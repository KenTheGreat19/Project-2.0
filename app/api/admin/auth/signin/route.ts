import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { prisma } from '@/lib/prisma';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  try {
    const { email, password, twoFactorCode } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        role: 'ADMIN',
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Account locked. Try again in ${remainingTime} minutes` },
        { status: 423 }
      );
    }

    // Reset lock if time has passed
    if (admin.lockedUntil && admin.lockedUntil <= new Date()) {
      await prisma.user.update({
        where: { id: admin.id },
        data: {
          loginAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password || '');
    
    if (!isValidPassword) {
      // Increment failed attempts
      const newAttempts = (admin.loginAttempts || 0) + 1;
      const updateData: any = {
        loginAttempts: newAttempts,
      };

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOCK_TIME);
      }

      await prisma.user.update({
        where: { id: admin.id },
        data: updateData,
      });

      return NextResponse.json(
        { 
          error: 'Invalid credentials',
          attemptsRemaining: Math.max(0, MAX_LOGIN_ATTEMPTS - newAttempts)
        },
        { status: 401 }
      );
    }

    // If 2FA is enabled, verify the code
    if (admin.twoFactorEnabled && admin.twoFactorSecret) {
      if (!twoFactorCode) {
        return NextResponse.json(
          { error: 'Two-factor authentication code required', requires2FA: true },
          { status: 401 }
        );
      }

      const isValid = speakeasy.totp.verify({
        secret: admin.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2,
      });

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid two-factor authentication code' },
          { status: 401 }
        );
      }
    }

    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Successful login - reset attempts and update login info
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ip,
      },
    });

    // Create secure session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        id: admin.id,
        email: admin.email,
        role: admin.role,
        timestamp: Date.now(),
      })
    ).toString('base64');

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/admin',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        twoFactorEnabled: admin.twoFactorEnabled,
      },
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
