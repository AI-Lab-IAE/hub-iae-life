# HUB IAE LIFE — Instrucciones para Claude Code

Las reglas del proyecto viven en AGENTS.md, que comparten todos los agentes del equipo. Léelas y síguelas siempre:

@AGENTS.md

## Notas adicionales para Claude Code (uso del coordinador)

Este archivo lo usa Jose David Saldaña, coordinador del AI Lab, que sí puede modificar las partes compartidas del proyecto. Cuando trabajes con él:

- Puedes editar `app/page.tsx`, `app/layout.tsx`, `components/shared/`, `package.json` y la configuración, pero avisa antes de cambiar algo que afecte los módulos de los estudiantes.
- Al revisar un Pull Request de un estudiante, comprueba:
  1. Que solo cambió archivos dentro de su carpeta `app/<nombre>/`.
  2. Que no hay datos personales reales, contraseñas ni llaves de API.
  3. Que `npm run lint` y `npm run build` pasan.
  4. Que el cambio respeta la funcionalidad central del módulo (lo demás va a `DESPUES.md`).
  Entrega la revisión como una lista corta: qué está bien, qué hay que corregir y si se puede unir.
- Si un módulo se ve demasiado ambicioso para la fecha del MVP (13 de noviembre), dilo directamente y propón qué recortar.
- Para tareas de módulo, usa el skill `trabajar-en-mi-modulo`.
