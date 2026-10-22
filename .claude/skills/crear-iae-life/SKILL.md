---
name: crear-iae-life
description: Une los módulos terminados del HUB IAE LIFE en una sola app llamada IAE LIFE, con navegación, diseño y nombre comunes. Úsalo solo cuando Jose David (el coordinador) lo pida, por ejemplo con /crear-iae-life, "crear IAE LIFE" o "unir los módulos en una sola app". No lo uses para trabajo de un estudiante en su módulo (para eso está trabajar-en-mi-modulo).
---

# Crear IAE LIFE

Convierte el HUB (un módulo por estudiante, mostrados como tarjetas) en **IAE LIFE**: una sola app con navegación y diseño comunes, donde cada módulo pasa a ser una función de la app.

Las reglas de AGENTS.md siguen aplicando: sin datos personales reales, sin secretos, todo en español y PR hacia `main`. Esta versión de Next.js es más nueva que lo que conoces; antes de usar APIs de navegación, `redirects` o `metadata`, lee la guía en `node_modules/next/dist/docs/`.

Trabaja por fases. **Al final de las fases 1 y 2 detente y espera la respuesta de Jose David.**

## Modo automático (botón "Crear IAE LIFE")

Si te lanzó el workflow `.github/workflows/crear-iae-life.yml` (el botón de `/coordinador`), nadie puede responderte durante la ejecución. En ese caso:

- **No te detengas** en las fases 1 y 2. En vez de preguntar, aplica estas decisiones:
  - Módulo **listo**: entra a IAE LIFE.
  - Módulo **incompleto**: entra con la etiqueta "Próximamente" en la navegación y en el inicio, sin tocar su código.
  - Módulo **roto** (no compila o su página no carga): queda fuera de la navegación, sin borrar su carpeta.
  - **Rutas:** se quedan como están (`/<nombre>`). No muevas carpetas: renombrarlas lo decide Jose David al revisar.
  - **Revisión automática:** no cambies `.github/`.
  - El resto del plan de la fase 2 (nombre, navegación, inicio, créditos, diseño común y `DESPUES.md`) sí se hace.
- En la fase 0, salta la confirmación de quién lo pide (el workflow solo corre con la cuenta de Jose David) y no crees la rama: el workflow ya te dejó en una.
- Haz commits en la rama actual, pero **no hagas push ni abras el PR**: de eso se encarga el workflow.
- Al terminar, escribe la descripción del PR (el formato de la fase 5) en el archivo `PR_IAE_LIFE.md` en la raíz del repositorio, sin hacerle commit. Agrega al inicio una sección "## Decisiones para Jose David" con la tabla del inventario de la fase 1, las decisiones que tomaste por él y las preguntas que habrías hecho.
- En la fase 4 no hay navegador ni `npm run dev`: comprueba con `npm run lint` y `npm run build`, revisa en el código que cada función tenga su enlace en la navegación y anota en el PR que Jose David debe probarla en el enlace de vista previa.
- Si algo falla y no se arregla en dos intentos, no sigas: explica el problema en `PR_IAE_LIFE.md` y deja los commits que sí funcionan.

## 0. Comprobar antes de empezar

- Confirma que quien lo pide es Jose David. Si es un estudiante, no sigas: explícale que esto lo hace el coordinador.
- El árbol de trabajo debe estar limpio. Si no lo está, detente y dilo.
- Sincroniza y crea la rama:
  ```
  git checkout main
  git pull
  git checkout -b coordinador/crear-iae-life
  ```
- Si `gh` o `git push` no tienen acceso a `AI-Lab-IAE/hub-iae-life`, usa la cuenta de GitHub `josesaldana-collab`.
- Revisa que no haya PRs de estudiantes abiertos (`gh pr list`). Si los hay, avísale a Jose David: conviene unirlos o cerrarlos antes, porque esta reorganización les va a generar conflictos.

## 1. Inventario de módulos (y detenerse)

Para cada carpeta `app/<nombre>/` que tenga `README.md`:

1. Lee `README.md` (funcionalidad central), `info.ts` (nombre y descripción del proyecto), `DESPUES.md`, `page.tsx` y `components/`.
2. Decide si la funcionalidad central está **lista**, **incompleta** (le falta algo o tiene textos de plantilla, como "Por definir" o "Escribe aquí…") o **rota** (la página no carga o falla el build).
3. Corre `npm run lint` y `npm run build` sobre `main` y anota los errores de cada módulo.
4. Busca piezas repetidas entre módulos: componentes casi iguales (botones, tarjetas, formularios, listas), tipos de datos parecidos o datos de ejemplo duplicados.

Entrégale a Jose David una tabla:

| Módulo | Proyecto | Estado | Qué falta | Piezas que se repiten |
|---|---|---|---|---|

Luego pregúntale qué hacer con cada módulo que no esté listo:
- dejarlo fuera de IAE LIFE por ahora;
- incluirlo con la etiqueta "Próximamente";
- esperar a que el estudiante lo termine.

**Detente aquí hasta que responda.**

## 2. Plan (y detenerse)

Propón un plan corto, con estos puntos como base, y espera a que Jose David lo apruebe o lo cambie:

- **Nombre:** "IAE LIFE" en `metadata` (`app/layout.tsx`), en el encabezado, en `README.md` y en `package.json` (`"name": "iae-life"`).
- **Navegación:** una barra común en `app/layout.tsx`, con una pestaña o enlace por función usando el nombre del proyecto, no el del estudiante. En celular, una barra inferior; en computadora, un menú arriba o al lado.
- **Inicio:** `app/page.tsx` deja de ser la cuadrícula de tarjetas del HUB y pasa a ser la portada de IAE LIFE: qué es la app y accesos a cada función.
- **Rutas:** propón cambiar `/<nombre-del-estudiante>` por rutas según la función (por ejemplo `/marco` → `/estudia`). Mueve las carpetas con `git mv` para conservar el historial y agrega `redirects` en `next.config.ts` para que los enlaces viejos sigan funcionando. Pregunta antes de hacerlo: Jose David puede preferir dejar las rutas como están.
- **Créditos:** una página `/creditos` con cada proyecto y su autor (solo el nombre de pila, como en `info.ts`).
- **Diseño común:** mueve las piezas repetidas del inventario a `components/shared/` y a `lib/`, y usa los mismos colores, tipografía y espaciados en todas las funciones.
- **Ideas pendientes:** junta los `DESPUES.md` de todos los módulos en un solo `DESPUES.md` en la raíz, agrupado por función, como lista para IAE LIFE v2.
- **Revisión automática:** `.github/workflows/revisar-pr.yml` comprueba que cada estudiante solo cambie `app/<nombre>/`. Si las carpetas cambian de nombre, propón cómo ajustarlo o si se retira.

**Detente aquí hasta que lo apruebe.**

## 3. Construir

- Sigue el plan aprobado en pasos pequeños, con un commit por paso que funcione:
  ```
  git add -A
  git commit -m "Describe en español qué cambió"
  ```
- **No cambies lo que hace cada módulo.** Solo mueve, renombra, unifica el diseño y conecta la navegación. Si para integrar algo hace falta cambiar su comportamiento, no lo hagas: anótalo para el reporte final.
- Cuando unifiques un componente repetido, comprueba que cada módulo que lo usaba siga funcionando igual.
- Si un paso falla y no se arregla en dos intentos, detente y explica el error.

## 4. Comprobar

```
npm run lint
npm run build
npm run dev
```

- Abre el inicio y cada función desde la navegación. Comprueba que la tarea principal de cada una se puede completar.
- Si moviste carpetas, prueba que los enlaces viejos (`/<nombre>`) redirigen.
- Revisa todo en tamaño de celular.
- Busca datos personales reales, contraseñas o llaves que se hayan colado (`git grep -niE "password|contraseña|api[_-]?key|secret|token|@iae\.edu"`) y revisa cada resultado.

## 5. Abrir el Pull Request

```
git push -u origin coordinador/crear-iae-life
```

Abre el PR hacia `main` con el título "Crear IAE LIFE" y esta descripción:

```
## Qué hace este cambio
Une los módulos del HUB en una sola app, IAE LIFE.

## Funciones incluidas
(tabla: función, ruta, autor, estado)

## Qué cambió
- Navegación:
- Rutas y redirecciones:
- Componentes unificados:
- Revisión automática:

## Pendiente
(módulos que quedaron fuera o como "Próximamente", y cambios de comportamiento que no se hicieron)

## Cómo probarlo
(pasos en el enlace de vista previa)
```

Espera a que Vercel publique la vista previa y dale a Jose David el enlace. **No unas el PR:** Jose David lo revisa y decide cuándo unirlo.
