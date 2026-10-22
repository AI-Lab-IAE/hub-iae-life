# HUB IAE LIFE — Reglas para agentes

> **Borrador** escrito por Claude a partir de CLAUDE.md y del skill `trabajar-en-mi-modulo`. Jose David lo revisa antes de compartirlo con los estudiantes.

Estas reglas aplican a cualquier agente (Claude Code, Codex, Cursor, etc.) que trabaje en este repositorio, sin importar quién lo use.

## Qué es este proyecto

HUB IAE LIFE es una sola web app del AI Lab del Instituto Alberto Einstein. Reúne los módulos que construye cada estudiante; cada módulo resuelve un problema de la vida escolar del IAE.

- **MVP:** jueves 13 de noviembre de 2026. Lo que no sea la funcionalidad central de un módulo va a su `DESPUES.md`.
- **Stack:** Next.js (App Router) + TypeScript + Tailwind CSS. Sin base de datos por ahora.
- **Idioma:** toda la interfaz, los comentarios y los mensajes de commit van en español.

> Esta versión de Next.js es más nueva que lo que el agente conoce. Antes de usar una API de Next.js, revisa la guía en `node_modules/next/dist/docs/` (ver el bloque al final de este archivo).

## Estructura

```
app/
  page.tsx              # inicio del HUB: lista los módulos (lo mantiene Jose David)
  layout.tsx            # layout común (lo mantiene Jose David)
  <nombre>/             # un módulo por estudiante
    info.ts             # nombre del proyecto y descripción (salen en la tarjeta del inicio)
    page.tsx
    components/
    README.md           # proyecto, para quién es, funcionalidad central
    DESPUES.md          # ideas para después del MVP
app/coordinador/        # avance de módulos y botón "Crear IAE LIFE" (lo mantiene Jose David)
components/shared/      # componentes comunes (lo mantiene Jose David)
```

Para cambiar el nombre o la descripción de su tarjeta en la página de inicio, el estudiante edita `app/<nombre>/info.ts`. No hace falta tocar `app/page.tsx`.

Módulos: `marco`, `camille`, `abraham`, `jonathan`, `daniela`. Cada módulo vive en `http://localhost:3000/<nombre>`.

## Reglas para trabajar en un módulo

1. **Solo tu carpeta.** Un estudiante cambia únicamente archivos dentro de `app/<nombre>/`. No edites `app/page.tsx`, `app/layout.tsx`, `components/shared/`, `package.json` ni archivos de configuración. Si hace falta algo ahí (una dependencia nueva, un componente común), detente y pide que se avise a Jose David.
2. **Funcionalidad central primero.** Antes de programar, revisa en `app/<nombre>/README.md` cuál es la funcionalidad central. Si el pedido no es parte de ella o no cabe antes del 13 de noviembre, anótalo en `DESPUES.md` y propón algo más simple.
3. **Planea antes de programar.** Explica en 3 a 5 líneas qué vas a hacer y qué archivos vas a tocar, y espera a que el estudiante diga que sí.
4. **Reutiliza.** Para estilos usa Tailwind. Si un componente de `components/shared/` sirve, úsalo en lugar de crear otro igual.
5. **Commits pequeños.** Un cambio a la vez, con un commit después de cada paso que funcione.
6. **Explica.** Al terminar, cuéntale al estudiante en palabras sencillas qué cambió, cómo funciona y qué debería probar.

El skill `crear-iae-life` (que une los módulos en la app final IAE LIFE) es solo para Jose David. Si un estudiante lo pide, explícale que eso lo hace el coordinador.

## Datos y seguridad

- **Nada de datos personales reales:** ni nombres de estudiantes, padres o docentes, ni cédulas, teléfonos, correos o notas. Usa datos inventados y que se noten inventados (por ejemplo "Estudiante Prueba 1").
- **Nada de secretos en el código:** ni contraseñas, ni llaves de API, ni tokens. Si un módulo necesita una llave, se guarda como variable de entorno y la configura Jose David.
- No subas archivos `.env`.

## Git y Pull Requests

- Nunca trabajes directo en `main`. Rama: `<nombre>/<descripcion-corta>` (por ejemplo `marco/lista-de-tareas`).
- Antes de empezar: `git checkout main && git pull`, y luego crea o actualiza la rama.
- Si aparece un conflicto en un archivo que no es del módulo, no lo resuelvas: detente y pide que se avise a Jose David.
- Antes de abrir el PR, deben pasar:
  ```
  npm run lint
  npm run build
  ```
  y la página `/<nombre>` debe cargar y verse bien en tamaño de celular.
- Si algo falla y no se arregla en dos intentos, detente y explica el error.
- Abre el PR hacia `main` usando la plantilla. **Jose David revisa y aprueba; nadie une su propio cambio.**

## Comandos

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
