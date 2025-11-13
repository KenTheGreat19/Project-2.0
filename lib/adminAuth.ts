import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

/**
 * Verifies an admin session from the request
 * @returns The admin user object if valid, null otherwise
 */
export async function verifyAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie) {
      return null;
    }

    // Decode session token
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    );

    // Verify session is not expired (8 hours)
    const sessionAge = Date.now() - sessionData.timestamp;
    if (sessionAge > 8 * 60 * 60 * 1000) {
      return null;
    }

    // Get admin user
    const admin = await prisma.user.findFirst({
      where: {
        id: sessionData.id,
        email: sessionData.email,
        role: 'ADMIN',
      },
    });

    return admin;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}
