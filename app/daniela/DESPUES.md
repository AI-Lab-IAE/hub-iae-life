# Ideas para después del MVP — Daniela

- Guardar los datos en una base de datos en lugar de solo en el navegador, para usar TASKUP! en varios dispositivos.
- Notificaciones reales (push) para recordatorios de entregas y exámenes. Hoy dependen del permiso del navegador y solo funcionan con la página abierta.
- Dividir `components/TaskUp.jsx` en archivos más pequeños y pasarlo a TypeScript.
- Una sola app (25-nov), lo que falta:
  - Modo noche para toda IAE LIFE (Tareas era la única con tema noche; por ahora todo es claro).
  - "Ayúdame a estudiar" ahora abre Estudiar. Si se quiere, pasarle a Estudiar el nombre de la tarea. Las flashcards propias de Tareas se quitaron (están en el historial de git).
  - Horario de profesores: Tareas solo trae las clases de Horario para estudiantes.
  - Marcar una tarea como hecha desde Hoy (hoy Hoy solo la muestra y abre Tareas).
- Revisión del #30/#31 (27-nov), para después del piloto:
  - Los pendientes viejos de Colegio se pasan a la primera cuenta que abre Tareas en ese navegador (en una compu compartida podrían quedar en la cuenta de otra persona).
  - Si guardar falla por falta de espacio, los pendientes viejos de Colegio se podrían pasar dos veces cuando un guardado posterior sí funcione.
  - La primera vez que alguien entra (perfil incompleto), Entrar lo manda a completar el perfil y no lo devuelve a Tareas con el trabajo que venía de Colegio.
