const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function backfillEmployerIds() {
  try {
    console.log("🔄 Backfilling missing employerId values...")

    const users = await prisma.user.findMany({ where: { employerId: null } })

    if (!users.length) {
      console.log("✅ No users require backfill. All users have an employerId.")
      return
    }

    for (const u of users) {
      await prisma.user.update({
        where: { id: u.id },
        data: { employerId: u.id },
      })
      console.log(`Updated user ${u.email} -> employerId=${u.id}`)
    }

    console.log(`✅ Backfilled ${users.length} users.`)
  } catch (err) {
    console.error("❌ Error backfilling employerId:", err)
  } finally {
    await prisma.$disconnect()
  }
}

backfillEmployerIds()
