const { Client } = require('pg');
require('dotenv').config();

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  try {
    // 1. Ensure a default Category
    const catRes = await client.query(`SELECT id FROM asset_categories WHERE name = 'Default Category'`);
    if (catRes.rows.length === 0) {
      await client.query(`
        INSERT INTO asset_categories (id, name, description)
        VALUES ('11111111-1111-1111-1111-111111111111', 'Default Category', 'System generated default category')
      `);
      console.log('Inserted default category.');
    } else {
      console.log('Default category exists.');
    }

    // 2. Ensure a default Location
    const locRes = await client.query(`SELECT id FROM locations WHERE name = 'Main HQ'`);
    if (locRes.rows.length === 0) {
      await client.query(`
        INSERT INTO locations (id, name, address, city)
        VALUES ('22222222-2222-2222-2222-222222222222', 'Main HQ', '123 ERP Street', 'Techville')
      `);
      console.log('Inserted default location.');
    } else {
      console.log('Default location exists.');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.end();
  }
}

seed();
