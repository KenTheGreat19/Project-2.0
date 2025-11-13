import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminAuth';

export async function GET() {
  try {
    const admin = await verifyAdminSession();
    
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `ApplyNHire Admin (${admin.email})`,
      issuer: 'ApplyNHire',
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdminSession();
    
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { secret, token } = await request.json();

    // Verify the token
    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Enable 2FA for the admin
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: true,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('2FA enable error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const admin = await verifyAdminSession();
    
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: admin.id },
      data: {
        twoFactorSecret: null,
        twoFactorEnabled: false,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
