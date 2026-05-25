# Esquema De Google Sheets

La app lee seis pestañas. Los nombres deben coincidir exactamente.

Las fechas simples usan formato `YYYY-MM-DD`. Los timestamps pueden usar `YYYY-MM-DD HH:mm`.

## `dashboard_state`

Una fila representa el estado presente.

| Columna | Uso |
| --- | --- |
| `date` | Fecha del estado actual. |
| `main_focus` | Foco principal visible en el header. |
| `energy_physical` | Texto breve, por ejemplo `media`. |
| `energy_mental` | Texto breve, por ejemplo `alta`. |
| `current_pressure` | Tension o carga actual. |
| `today_main_action` | Accion principal del dia. |
| `do_not_touch_today` | Lo que no merece atencion hoy. |
| `notes` | Nota breve de contexto. |

Compatibilidad: si una planilla anterior usa `anxiety_level`, se toma como `current_pressure`.

## `projects`

Cada fila es un frente o proyecto. Las cards se ordenan por prioridad y luego por estado.

| Columna | Uso |
| --- | --- |
| `project_id` | ID estable y unico. |
| `name` | Nombre visible. |
| `status` | Ejemplos: `activo`, `mantenimiento`, `bloqueado`, `urgente`. |
| `priority` | Ejemplos: `maxima`, `urgente`, `alta`, `media`, `baja`. |
| `category` | Etiqueta visible, por ejemplo `Frente estrategico`. |
| `counter_id` | ID de un counter relacionado, opcional. |
| `accent` | Color opcional: `cyan`, `amber`, `green`, `violet`, `slate`. |
| `current_state` | Estado actual breve. |
| `next_action` | Proxima accion concreta. |
| `blocker` | Bloqueo, si existe. |
| `last_updated` | Ultima actualizacion. |
| `notes` | Contexto corto. |

## `counters`

Los counters pueden cargarse manualmente o calcularse por fecha.

| Columna | Uso |
| --- | --- |
| `counter_id` | ID estable y unico. |
| `label` | Nombre visible. |
| `type` | `manual` o `date_based`. |
| `start_date` | Base para calcular dias transcurridos. |
| `reset_date` | Base inclusiva para rachas: `hoy - reset_date + 1`. |
| `current_value` | Numero usado en counters manuales. |
| `target_value` | Meta opcional para barra de progreso. |
| `unit` | Unidad visible. |
| `auto_calculate` | `true` o `false`. |
| `project_id` | Proyecto relacionado, opcional. |
| `accent` | Color opcional. |
| `last_updated` | Fecha de ultima edicion. |
| `notes` | Nota breve. |

## `updates_log`

| Columna | Uso |
| --- | --- |
| `timestamp` | Momento del evento. |
| `project_id` | Proyecto asociado. |
| `type` | Tipo de evento, por ejemplo `milestone`, `next_action`, `maintenance`. |
| `summary` | Resumen visible. |
| `details` | Detalle expandible. |
| `mood` | Clima o lectura subjetiva opcional. |
| `energy` | Energia opcional. |
| `source` | Origen, por ejemplo `manual` o `chat`. |

## `daily_checkins`

| Columna | Uso |
| --- | --- |
| `date` | Fecha. |
| `type` | Ejemplos: `checkin`, `cierre`. |
| `physical_energy` | Energia fisica. |
| `mental_energy` | Energia mental. |
| `summary` | Resumen. |
| `main_action` | Accion principal. |
| `tomorrow_action` | Proximo paso. |
| `notes` | Nota opcional. |

## `config`

Actualmente se expone en la API para extensiones futuras.

| Columna | Uso |
| --- | --- |
| `key` | Clave. |
| `value` | Valor. |
| `notes` | Descripcion. |
