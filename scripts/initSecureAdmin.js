const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'kentaurch.kcgl@gmail.com';
  const defaultPassword = 'admin123';
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);
  
  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Super Admin',
      twoFactorEnabled: false,
      loginAttempts: 0,
      lockedUntil: null,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Super Admin',
      twoFactorEnabled: false,
    },
  });

  console.log('✅ Admin user created/updated successfully!');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Default Password:', defaultPassword);
  console.log('⚠️  Please change the password after first login!');
  console.log('🔐 2FA is disabled by default. Enable it in admin settings.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
