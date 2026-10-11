const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'schema.sql'), 'utf8');
  // Credenciales SOLO desde variables de entorno (node --env-file=.env.local scripts/migrate.js)
  const { SUPABASE_DB_HOST, SUPABASE_DB_USER, SUPABASE_PASSWORD } = process.env;
  if (!SUPABASE_DB_HOST || !SUPABASE_DB_USER || !SUPABASE_PASSWORD) {
    throw new Error('Faltan SUPABASE_DB_HOST, SUPABASE_DB_USER o SUPABASE_PASSWORD en las variables de entorno.');
  }
  const client = new Client({
    host: SUPABASE_DB_HOST,
    port: Number(process.env.SUPABASE_DB_PORT || 5432),
    user: SUPABASE_DB_USER,
    password: SUPABASE_PASSWORD,
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
