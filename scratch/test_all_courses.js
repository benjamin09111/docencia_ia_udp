const token = '14869~kTrmBfE6ztBL2Nv4fREyAZUMDuLJJcQC3MvuX2KnyMP897n4hGKWZ6HJWeLBcF2e';
const baseUrl = 'https://udp.instructure.com/api/v1';

async function testAll() {
  const headers = { Authorization: `Bearer ${token}` };
  const courses = [
    { id: 44999, code: 'CIT3203_CA01' },
    { id: 45002, code: 'CIT3203_CA02' },
    { id: 47552, code: 'CIT3203_CA03' },
    { id: 47047, code: 'CIT2206_CA01' }, // Gestión Organizacional
    { id: 44988, code: 'CIT3100_CA02' }, // Arquitecturas Emergentes
  ];

  for (const c of courses) {
    try {
      const res = await fetch(`${baseUrl}/courses/${c.id}/users?enrollment_type[]=student&per_page=100`, { headers });
      const students = await res.json();
      console.log(`[${c.code} - ID: ${c.id}] => ${Array.isArray(students) ? students.length : 0} alumnos estudiantes`);
    } catch (e) {
      console.error(c.code, e);
    }
  }
}

testAll().catch(console.error);
