const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.users.findMany({
    include: {
      user_roles: {
        include: {
          roles: true
        }
      }
    }
  });
  console.log('Users in DB:');
  for (const u of users) {
    console.log(`- ID: ${u.id}, Name: ${u.first_name} ${u.last_name}, Email: ${u.email}, Role: ${u.user_roles[0]?.roles?.name || 'None'}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
