import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    const admin = await verifyAdminSession(request);
    
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      enabled: admin.twoFactorEnabled || false,
      email: admin.email,
    });

  } catch (error) {
    console.error('2FA status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
