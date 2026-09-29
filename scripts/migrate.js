const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'schema.sql'), 'utf8');
  const password = process.env.SUPABASE_PASSWORD || process.env.NEXT_PUBLIC_SUPABASE_PASSWORD || '2hbN0dKKZcw8ZEEU';
  const client = new Client({
    host: 'aws-0-us-west-2.pooler.supabase.com',
    port: 6543,
    user: 'postgres.xsjmjiiuicsbfrnlseui',
    password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  console.log('Connecting to Supabase PostgreSQL database...');
  await client.connect();
  console.log('Connected! Applying schema.sql...');
  await client.query(sql);
  console.log('SCHEMA APPLIED SUCCESSFULLY!');

  const res = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log('Created tables in database:', res.rows.map((r) => r.table_name));

  const views = await client.query(
    "SELECT table_name FROM information_schema.views WHERE table_schema = 'public'"
  );
  console.log('Created views in database:', views.rows.map((r) => r.table_name));

  await client.end();
}

migrate().catch((e) => {
  console.error('Migration error:', e);
  process.exit(1);
});
