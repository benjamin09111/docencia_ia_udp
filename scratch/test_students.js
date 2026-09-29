const token = '14869~kTrmBfE6ztBL2Nv4fREyAZUMDuLJJcQC3MvuX2KnyMP897n4hGKWZ6HJWeLBcF2e';
const baseUrl = 'https://udp.instructure.com/api/v1';

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
