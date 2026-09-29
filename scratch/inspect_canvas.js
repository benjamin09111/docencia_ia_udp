const fs = require('fs');

const token = '14869~kTrmBfE6ztBL2Nv4fREyAZUMDuLJJcQC3MvuX2KnyMP897n4hGKWZ6HJWeLBcF2e';
const baseUrl = 'https://udp.instructure.com/api/v1';

async function inspect() {
  const headers = { Authorization: `Bearer ${token}` };

  console.log('--- 1. Cursos Favoritos (Tablero) ---');
  const favsRes = await fetch(`${baseUrl}/users/self/favorites/courses`, { headers });
  const favs = await favsRes.json();
  console.log(`Encontrados ${favs.length} cursos favoritos en el Tablero:`);
  for (const c of favs) {
    console.log(`- [ID: ${c.id}] ${c.name} (${c.course_code}) | Estado: ${c.workflow_state}`);
  }

  // Tomamos el primer curso relevante: 44999 (PROYECTO EN TICS II)
  const testCourseId = 44999;
  console.log(`\n--- 2. Analizando Curso ${testCourseId}: 202602 - PROYECTO EN TICS II ---`);
  
  // Tareas / Assignments
  const assignRes = await fetch(`${baseUrl}/courses/${testCourseId}/assignments?per_page=10`, { headers });
  const assignments = await assignRes.json();
  console.log(`Tareas encontradas: ${Array.isArray(assignments) ? assignments.length : JSON.stringify(assignments)}`);
  if (Array.isArray(assignments)) {
    assignments.forEach(a => console.log(`  * [Tarea ${a.id}] ${a.name} | Puntos: ${a.points_possible} | Límite: ${a.due_at}`));
  }

  // Módulos / Clases
  const modRes = await fetch(`${baseUrl}/courses/${testCourseId}/modules?per_page=10`, { headers });
  const modules = await modRes.json();
  console.log(`Módulos encontrados: ${Array.isArray(modules) ? modules.length : JSON.stringify(modules)}`);
  if (Array.isArray(modules)) {
    modules.forEach(m => console.log(`  * [Módulo ${m.id}] ${m.name} (Items: ${m.items_count})`));
  }

  // Lista de usuarios / Alumnos
  const usersRes = await fetch(`${baseUrl}/courses/${testCourseId}/users?per_page=10`, { headers });
  const users = await usersRes.json();
  console.log(`Usuarios en el curso: ${Array.isArray(users) ? users.length : JSON.stringify(users)}`);
  if (Array.isArray(users)) {
    users.slice(0, 5).forEach(u => console.log(`  * [User ${u.id}] ${u.name} (${u.short_name})`));
  }

  // Archivos / Documentos del curso (para entrenar al agente)
  const filesRes = await fetch(`${baseUrl}/courses/${testCourseId}/files?per_page=5`, { headers });
  const files = await filesRes.json();
  console.log(`Archivos del curso: ${Array.isArray(files) ? files.length : JSON.stringify(files)}`);
  if (Array.isArray(files)) {
    files.forEach(f => console.log(`  * [Archivo ${f.id}] ${f.display_name} (${(f.size / 1024).toFixed(1)} KB)`));
  }
}

inspect().catch(console.error);
