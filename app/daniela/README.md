# Módulo de Daniela

- **Proyecto:** TASKUP!
- **Para quién es:** estudiantes que tienen dificultad para organizar su tiempo entre tareas, exámenes, proyectos y actividades.
- **Funcionalidad central:** TASKUP! organiza automáticamente las tareas del estudiante dentro de su horario real. Usa la fecha de entrega, el tiempo que necesita cada trabajo y los espacios libres que de verdad existen. No toca clases, actividades, eventos, sueño ni tiempo personal.

## Qué hace hoy

**Planificación**
- Reparte cada tarea entre los días disponibles antes de la entrega, en lugar de ponerla "lo antes posible".
- Solo usa espacios de al menos 10 minutos.
- Usa la hora de Panamá (America/Panama) y nunca programa sesiones en horas que ya pasaron.
- La prioridad se recalcula según qué tan cerca está la entrega.
- Solo ofrece reducir sueño o tiempo personal cuando de verdad no hay tiempo, y siempre pide confirmación.
- El usuario puede elegir en cuántos días hacer un trabajo y cuánto tiempo por día, o dejar que TASKUP! lo calcule.
- Al marcar progreso (25 %, 50 %, 75 %, 100 %) se recalculan las sesiones restantes.

**Horario y calendario**
- Vista semanal y mensual; bloques fijos, sueño, Shabbat y tiempo personal.
- Eventos y exámenes con recordatorio un día antes.
- "Estoy atrasada": plan para ponerse al día con el horario real.

**Inteligencia artificial**
- Asistente tipo chat que usa los datos del usuario cuando la pregunta es sobre su horario o tareas.
- "Ayúdame a estudiar": con texto o una imagen genera flashcards y un quiz.

**Otras funciones**
- Historial con opciones de recuperar y deshacer cambios del horario.
- Pantalla de progreso con estadísticas reales, español/inglés, modo día/noche.

## Cómo está armado

- `components/TaskUp.jsx`: toda la app (React). Los datos se guardan solo en el navegador (`localStorage`).
- `api/asistente/route.ts` y `api/estudiar/route.ts`: llaman a la IA desde el servidor, así la llave de API nunca llega al navegador.
- `lib/`: conexión con Claude, formato de los pedidos y límite de uso por hora.

## Pruebas del planificador

| Caso | Resultado |
|---|---|
| Tarea que vence mañana | Prioridad alta, programada correctamente |
| Vence en 3 días | Repartida entre los días, sin forzar nada |
| Vence en 1 semana, el sábado tiene solo 2 min libres | No usa el sábado, reparte 12 min por día en los demás |
| Vence en 3 semanas (300 min) | Repartida en 22 días |
| 10 min necesarios y 2 min libres hoy | Ignora el hueco de 2 min |
| Son las 3:00 p. m. y hay un hueco de 10 a 12 hoy | Ignora el hueco que ya pasó |
| Varios días libres | Reparto parejo (20 min por día) |
| Ningún día con espacio suficiente | Avisa que falta tiempo y pide confirmación |

Construido por Daniela Schneir con la ayuda de Claude (Anthropic).
