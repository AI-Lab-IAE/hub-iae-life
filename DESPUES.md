# IAE LIFE — ideas para después (v2)

Reúne los `DESPUES.md` de cada función. El detalle sigue en `app/<nombre>/DESPUES.md`.

## IAE School Guide

- Lista de tareas pendientes que el estudiante pueda marcar como hechas (necesita guardar datos).
- Foto aérea real del colegio en el Mapa, en lugar del plano inventado (solo si el coordinador lo autoriza, porque el repositorio es público). Los pines se ubican con el modo «Ubicar».
- Documentos reales para descargar.
- Enviar mensajes a profesores desde la app.
- Más datos de ejemplo (siempre inventados).
- Con fechas reales, el Calendario debería ocultar los eventos que ya pasaron.
- Horario de materias por grado (con materias y salones inventados, nunca los reales).
- Horario de primaria (cuando estén las horas confirmadas).
- Logo oficial del IAE en la barra superior (cuando el coordinador lo autorice; por ahora hay un espacio con las letras "IAE").
- Guardar el perfil en una cuenta para usarlo en varios dispositivos (necesita base de datos e inicio de sesión).

## EstudIA

- Vista del profesor: temas débiles del grupo, agregados y anónimos (sin ver quién es quién).
- Plan de estudio por fecha: repartir el repaso entre hoy y la fecha del examen.
- Cuentas del HUB en vez de solo guardar en el navegador (localStorage), para que el diagnóstico se vea desde cualquier dispositivo.
- Guardar los diagnósticos en la base de datos compartida del HUB.
- Cambiar a un modelo de IA más barato (Sonnet 5) una vez que el MVP esté validado.

## TASKUP!

- Guardar los datos en una base de datos en lugar de solo en el navegador, para usar TASKUP! en varios dispositivos.
- Notificaciones reales (push) para recordatorios de entregas y exámenes. Hoy dependen del permiso del navegador y solo funcionan con la página abierta.
- Conectar TASKUP! con los horarios de IAE LIFE cuando los demás módulos estén listos.
- Dividir `components/TaskUp.jsx` en archivos más pequeños y pasarlo a TypeScript.

## AvisoYa

- Notificaciones push reales en el celular (PWA), como en la versión original de AvisoYa.
- Escalamiento con IA: para un aviso urgente que no se vio, la IA decide por estudiante si reenviarlo, avisar al tutor, resaltarlo o esperar.
- Escribir el aviso en lenguaje natural y que la IA lo convierta en aviso con su audiencia.
- Cambios de horario: tachar o mover clases en el horario del estudiante y avisarle.

## AvisIA

- Elegir el tono (formal, neutral, casual) y el largo de cada correo.
- Botón "Regenerar" para variar la redacción de un correo.
- Enviar con un clic abriendo Gmail con el correo ya escrito.
- Copia automática del aviso a los padres.
- Historial de ausencias notificadas.
- Editar el horario semanal arrastrando las clases en un calendario.

## Cuenta (entrar con Google)

- Verificar el token de Google en el servidor (firma, `aud`, `iss`, `exp`, `hd`) y guardar la sesión en una cookie segura. Hoy solo se lee en el navegador porque no hay datos que proteger.
- Lista real de profesores autorizados (hoy `app/_life/profesores.ts` tiene los profesores inventados).
- Que AusencIA use el correo de los padres del perfil para la copia.
- Esconder "Probar con un usuario de ejemplo" cuando la app pase a datos reales.

## Una sola app (25-nov)

IAE LIFE se ve y funciona como una sola app: Hoy es la portada, las funciones se llaman por lo que hacen
(Estudiar, Tareas, Avisos, Faltar, Colegio, Horario) y los proyectos y autores solo salen en Créditos. Lo que falta:

- Modo noche para toda la app (antes solo lo tenía Tareas; se quitó del Perfil hasta que sea de todas).
- Idioma inglés para todas las funciones (hoy solo Tareas lo usa).
- Guardar todo por cuenta en una base de datos (hoy cada función guarda en el navegador).
- Marcar tareas como hechas desde Hoy (hoy Hoy las muestra y abre Tareas).
- Ver el detalle por función en `app/<nombre>/DESPUES.md`.
