# Módulo de Jonathan

- **Proyecto:** AvisIA
- **Para quién es:** estudiantes del IAE que van a faltar a clases (por una competencia, una cita médica, un viaje, etc.).
- **Funcionalidad central:** el estudiante elige la fecha, las clases y (si quiere) el motivo de su ausencia; AvisIA cruza esos datos con su horario y genera un correo listo para cada profesor afectado (uno por profesor).

## Qué hace (unido a IAE LIFE)

- Usa la cuenta de IAE LIFE: el nombre y el horario salen de la cuenta y de **Mi horario**. Sin cuenta, pide el nombre y usa el horario de ejemplo de `lib/horario.ts`.
- Motivo opcional (enfermedad, cita médica, competencia, viaje familiar, otro) más texto libre.
- En cada correo: tono (formal, neutral, estándar, casual), largo (corto, medio, largo) y **Regenerar** para otra redacción. Sin IA: son las plantillas de Jonathan (`lib/correos.ts`).
- **Abrir en Gmail** (ventana de redactar) o **App de correo** (`mailto:`), en una pestaña nueva. Nada se envía solo.
- Si en Perfil está el correo de los padres, va en copia (CC).
- Historial de ausencias avisadas, solo en este navegador y por cuenta (`avisia:historial:<correo>`).
