// Uso: node --env-file=.env.local scratch/<archivo>.js
const token = process.env.CANVAS_API_TOKEN;
const baseUrl = `${process.env.CANVAS_BASE_URL}/api/v1`;
if (!token || !process.env.CANVAS_BASE_URL) {
  console.error('Faltan CANVAS_API_TOKEN / CANVAS_BASE_URL en las variables de entorno.');
  process.exit(1);
}

async function testStudents() {
  const headers = { Authorization: `Bearer ${token}` };
  const res = await fetch(`${baseUrl}/courses/44999/users?enrollment_type[]=student&per_page=50`, { headers });
  const students = await res.json();
  console.log(`Encontrados ${students.length} estudiantes reales en CIT3203_CA01:`);
  students.forEach(s => {
    console.log(`- ID: ${s.id} | Nombre: ${s.name} | Sortable: ${s.sortable_name} | Login: ${s.login_id || s.email}`);
  });
}

testStudents().catch(console.error);
