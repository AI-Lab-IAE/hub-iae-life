# Ideas para después del MVP — Jonathan

Ya están en el módulo: tono y largo, Regenerar, abrir en Gmail, copia a los padres e historial.

- Ausencias de varios días o por horas (estaban en el prototipo de Jonathan; en IAE LIFE por ahora es un día y se marcan las clases).
- Quitar un profesor de la lista desde la pantalla de correos (por ahora se desmarca su clase en el paso 2).
- Editar el horario arrastrando clases: se hace en **Horario** de IAE LIFE, no aquí.
- **Asistente de horario con IA:** escribir en palabras, por ejemplo "el lunes a las 2:30 pon Español con el profesor X", y que la IA lo agregue al horario. Necesita la llave de API (la configura Jose David).
- Revisión de Codex (25-nov), lo que queda:
  - Los correos de los profesores son de ejemplo; en el piloto deben venir del colegio (lista oficial), no del horario de ejemplo.
  - El historial vive en localStorage, sin transacciones: si dos pestañas guardan en el mismo instante, el último gana. Con base de datos se resuelve.
  - El enlace a Gmail ya no lleva el mensaje (solo asunto y destinatario); el mensaje se copia y se pega. Si Gmail permite adjuntar el texto de otra forma segura, se puede mejorar.
