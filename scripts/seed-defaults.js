const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.asset_categories.create({
    data: {
      name: 'Default Category',
      description: 'System generated default category',
    },
  });

  const location = await prisma.locations.create({
    data: {
      name: 'Main HQ',
      address: '123 ERP Street',
      city: 'Techville',
    },
  });

  console.log('Category ID:', category.id);
  console.log('Location ID:', location.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
