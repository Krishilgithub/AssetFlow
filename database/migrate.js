const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

async function runMigration() {
    console.log('Connecting to Neon PostgreSQL...');
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        console.log('Connected successfully.');

        const schemaPath = path.join(__dirname, 'schema.sql');
        console.log(`Reading schema file from ${schemaPath}...`);
        
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        await client.query(schemaSql);
        
        console.log('Migration completed successfully! All tables, indexes, and procedures have been created.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await client.end();
        console.log('Connection closed.');
    }
}

runMigration();
