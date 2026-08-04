import { Module } from "../../types/course";

export const module2: Module = {
  id: "mod-02",
  slug: "core-nodos-esenciales",
  title: "Core de N8N y Nodos Esenciales",
  description: "Domina los nodos fundamentales de N8N: triggers, transformación de datos, Code node, sub-workflows y control de flujo.",
  icon: "Cpu",
  sortOrder: 2,
  lessons: [
    {
      id: "les-02-01",
      moduleSlug: "core-nodos-esenciales",
      slug: "triggers-webhooks-cron",
      title: "Triggers: Webhooks, Schedule y Cron",
      description: "Aprende los diferentes tipos de triggers en N8N y cómo diseñar arquitecturas event-driven con webhooks y schedules.",
      content: `## Triggers en N8N

Los triggers son el punto de entrada de todo workflow. Definen cuándo y cómo se ejecuta un flujo de trabajo.

### Tipos de Triggers

#### 1. Webhook Trigger

Recibe peticiones HTTP externas. Ideal para integraciones con formularios, APIs de terceros y eventos de servicios.

\`\`\`json
{
  "httpMethod": "POST",
  "path": "mi-webhook",
  "responseMode": "responseNode",
  "options": {
    "rawBody": true
  }
}
\`\`\`

**Patrones comunes:**
- **Fire-and-forget**: El webhook responde inmediatamente y el workflow procesa en background
- **Synchronous**: El webhook espera la respuesta del workflow antes de responder
- **Validación**: Verificar firma HMAC o API key antes de procesar

#### 2. Schedule Trigger (Cron)

Ejecuta workflows en intervalos regulares:

\`\`\`json
{
  "rule": {
    "interval": [
      { "field": "cronExpression", "expression": "0 9 * * 1-5" }
    ]
  }
}
\`\`\`

**Expresiones Cron útiles:**
- \`0 */6 * * *\` — Cada 6 horas
- \`0 9 * * 1-5\` — 9am lunes a viernes
- \`*/15 * * * *\` — Cada 15 minutos
- \`0 0 1 * *\` — Primer día de cada mes

#### 3. App Triggers

Muchas apps tienen triggers nativos en N8N:

- **Gmail Trigger**: Nuevo email recibido
- **GitHub Trigger**: Nuevo push, PR, issue
- **Stripe Trigger**: Pago completado, suscripción cancelada
- **Slack Trigger**: Nuevo mensaje en canal

### Patrones Event-Driven

#### Patrón: Event Router

Un webhook central que rutea eventos a diferentes sub-workflows:

\`\`\`
[Webhook] → [Switch por tipo] → [Sub-workflow A]
                              → [Sub-workflow B]
                              → [Sub-workflow C]
\`\`\`

#### Patrón: Polling con Schedule

Cuando no hay webhook disponible, usa Schedule para consultar APIs periódicamente:

\`\`\`
[Schedule cada 5min] → [HTTP Request: ¿hay nuevos registros?] → [IF: hay nuevos?] → [Procesar]
\`\`\`

#### Patrón: Dead Letter Queue

Captura eventos que fallaron para reprocesamiento:

\`\`\`
[Webhook] → [Procesar] → [Error?] → [Guardar en DLQ (Supabase/Redis)]
[Schedule cada hora] → [Leer DLQ] → [Reintentar] → [Eliminar si OK]
\`\`\`

### Mejores prácticas

- **Idempotencia**: Diseña workflows que puedan ejecutarse múltiples veces sin efectos secundarios
- **Validación de entrada**: Siempre valida los datos del webhook antes de procesar
- **Rate limiting**: Protege tus webhooks con verificación de API key o HMAC
- **Timeouts**: Configura timeouts adecuados en webhooks síncronos
- **Logging**: Registra todos los eventos recibidos para debugging`,
      estimatedMinutes: 18,
      n8nWorkflowJson: {
        name: "Event Router",
        nodes: [
          {
            parameters: { httpMethod: "POST", path: "events", responseMode: "responseNode" },
            id: "webhook-1",
            name: "Event Webhook",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: {
              rules: {
                rules: [
                  { output: 0, conditions: { conditions: [{ leftValue: "={{ $json.type }}", rightValue: "user.created", operator: "equals" }] } },
                  { output: 1, conditions: { conditions: [{ leftValue: "={{ $json.type }}", rightValue: "order.completed", operator: "equals" }] } }
                ]
              }
            },
            id: "switch-1",
            name: "Router por Tipo",
            type: "n8n-nodes-base.switch",
            typeVersion: 3,
            position: [470, 300]
          }
        ],
        connections: {
          "Event Webhook": { main: [[{ node: "Router por Tipo", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-02-01-1",
          question: "¿Qué expresión cron ejecuta un workflow cada 6 horas?",
          options: ["0 6 * * *", "*/6 * * * *", "0 */6 * * *", "6 * * * *"],
          correctIndex: 2,
          explanation: "0 */6 * * * significa: minuto 0, cada 6 horas (*/6), todos los días. Se ejecuta a las 0:00, 6:00, 12:00 y 18:00."
        },
        {
          id: "q-02-01-2",
          question: "¿Qué patrón se usa cuando un servicio no ofrece webhooks?",
          options: [
            "Dead Letter Queue",
            "Polling con Schedule",
            "Event Router",
            "Fire-and-forget"
          ],
          correctIndex: 1,
          explanation: "Cuando un servicio no ofrece webhooks, se usa polling con Schedule para consultar periódicamente si hay nuevos datos."
        },
        {
          id: "q-02-01-3",
          question: "¿Qué significa idempotencia en el contexto de workflows?",
          options: [
            "Que el workflow se ejecuta una sola vez",
            "Que el workflow puede ejecutarse múltiples veces sin efectos secundarios",
            "Que el workflow no requiere triggers",
            "Que el workflow se ejecuta en paralelo"
          ],
          correctIndex: 1,
          explanation: "Idempotencia significa que ejecutar el workflow una o múltiples veces produce el mismo resultado, sin duplicaciones ni efectos secundarios."
        }
      ]
    },
    {
      id: "les-02-02",
      moduleSlug: "core-nodos-esenciales",
      slug: "transformacion-datos",
      title: "Transformación de Datos",
      description: "Domina la manipulación de JSON, transformación de datos con los nodos Set, Code y las expresiones de N8N.",
      content: `## Transformación de Datos en N8N

La transformación de datos es el corazón de la automatización. N8N ofrece múltiples herramientas para manipular, filtrar y reestructurar datos.

### El modelo de datos de N8N

Cada nodo recibe y emite un array de items. Cada item tiene una propiedad \`json\` con los datos:

\`\`\`json
[
  { "json": { "nombre": "Juan", "email": "juan@mail.com" } },
  { "json": { "nombre": "María", "email": "maria@mail.com" } }
]
\`\`\`

### Nodo Set (Edit Fields)

El nodo Set crea, modifica o elimina campos:

\`\`\`json
{
  "assignments": {
    "assignments": [
      { "id": "1", "name": "fullName", "value": "={{ $json.firstName + ' ' + $json.lastName }}", "type": "string" },
      { "id": "2", "name": "createdAt", "value": "={{ $now.toISO() }}", "type": "string" }
    ]
  }
}
\`\`\`

### Expresiones de N8N

Las expresiones usan sintaxis JavaScript dentro de \`{{ }}\`:

\`\`\`javascript
{{ $json.nombre.toUpperCase() }}
{{ $json.precio * 1.16 }}
{{ $json.fecha ? new Date($json.fecha).toLocaleDateString() : 'Sin fecha' }}
{{ $('Nombre del Nodo').item.json.campo }}
{{ $now.minus({days: 7}).toISO() }}
{{ $items().length }}
\`\`\`

### Variables especiales

| Variable | Descripción |
|---|---|
| \`$json\` | Datos JSON del item actual |
| \`$now\` | Fecha/hora actual (Luxon DateTime) |
| \`$today\` | Inicio del día actual |
| \`$runIndex\` | Índice de ejecución actual |
| \`$itemIndex\` | Índice del item actual |
| \`$nodeVersion\` | Versión del nodo actual |
| \`$workflow\` | Info del workflow (id, name, active) |
| \`$execution\` | Info de la ejecución (id, mode) |
| \`$('NodeName')\` | Referencia a nodo específico |
| \`$items()\` | Todos los items del nodo anterior |
| \`$env\` | Variables de entorno |
| \`$secrets\` | Secretos de N8N |

### Nodo Code (JavaScript)

Para transformaciones complejas, usa el Code node:

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const data = item.json;

  const cleaned = {
    nombre: data.nombre?.trim() || 'Sin nombre',
    email: data.email?.toLowerCase(),
    telefono: data.telefono?.replace(/\\D/g, '') || null,
    score: calculateScore(data),
    tags: data.tags?.split(',').map(t => t.trim()) || []
  };

  results.push({ json: cleaned });
}

function calculateScore(data) {
  let score = 0;
  if (data.email) score += 10;
  if (data.telefono) score += 15;
  if (data.empresa) score += 20;
  return score;
}

return results;
\`\`\`

### Transformaciones comunes

#### Flatten objetos anidados

\`\`\`javascript
const { address, ...rest } = $json;
return { json: { ...rest, city: address?.city, country: address?.country } };
\`\`\`

#### Agrupar datos

\`\`\`javascript
const items = $input.all();
const grouped = {};

for (const item of items) {
  const key = item.json.categoria;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(item.json);
}

return Object.entries(grouped).map(([categoria, productos]) => ({
  json: { categoria, productos, total: productos.length }
}));
\`\`\`

#### Filtrar y mapear

\`\`\`javascript
return $input.all()
  .filter(item => item.json.activo === true)
  .map(item => ({
    json: {
      id: item.json.id,
      displayName: \`\${item.json.nombre} (\${item.json.empresa})\`
    }
  }));
\`\`\`

### Tips de transformación

- Usa **Set** para cambios simples (1-3 campos)
- Usa **Code** para lógica compleja (loops, condicionales, funciones)
- Usa **\`$('NodeName').item.json\`** para acceder a datos de nodos anteriores específicos
- Siempre valida datos opcionales con **optional chaining** (\`?.\`)
- Usa **Luxon** (disponible como \`$now\`, \`$today\`) para manipulación de fechas`,
      estimatedMinutes: 22,
      quiz: [
        {
          id: "q-02-02-1",
          question: "¿Qué variable especial de N8N se usa para acceder a datos de un nodo específico por nombre?",
          options: [
            "$node['nombre']",
            "$('nombre').item.json",
            "$getNode('nombre')",
            "$parent.nombre"
          ],
          correctIndex: 1,
          explanation: "$('NodeName').item.json permite acceder a los datos JSON de salida de cualquier nodo específico del workflow por su nombre."
        },
        {
          id: "q-02-02-2",
          question: "¿Qué librería de fechas está integrada en N8N para manipulación de fechas?",
          options: ["Moment.js", "Date-fns", "Luxon", "Day.js"],
          correctIndex: 2,
          explanation: "N8N integra Luxon como librería de fechas, disponible a través de $now y $today para manipulación de fechas y tiempos."
        },
        {
          id: "q-02-02-3",
          question: "En el Code node, ¿cómo se retorna correctamente un array de items?",
          options: [
            "return data;",
            "return { json: data };",
            "return items.map(i => ({ json: i }));",
            "return JSON.stringify(items);"
          ],
          correctIndex: 2,
          explanation: "El Code node debe retornar un array de objetos con propiedad json. items.map(i => ({ json: i })) es la forma correcta."
        }
      ]
    },
    {
      id: "les-02-03",
      moduleSlug: "core-nodos-esenciales",
      slug: "code-node-avanzado",
      title: "Code Node Avanzado",
      description: "Técnicas avanzadas del Code node: soporte Python, manejo de errores, patrones de diseño y uso de librerías externas.",
      content: `## Code Node Avanzado

El Code node es la herramienta más potente de N8N. Permite ejecutar JavaScript o Python con acceso completo al runtime de N8N.

### Modos de ejecución

#### Run Once for All Items

Procesa todos los items de una vez. Ideal para agregaciones y transformaciones batch:

\`\`\`javascript
const items = $input.all();
const total = items.reduce((sum, item) => sum + item.json.precio, 0);
return [{ json: { total, count: items.length, average: total / items.length } }];
\`\`\`

#### Run Once for Each Item

Procesa cada item individualmente. Más simple pero menos eficiente:

\`\`\`javascript
const data = $input.item.json;
return {
  json: {
    processed: true,
    slug: data.nombre.toLowerCase().replace(/\\s+/g, '-'),
    hash: require('crypto').createHash('md5').update(data.email).digest('hex')
  }
};
\`\`\`

### Python en N8N

N8N soporta Python en el Code node (desde v1.20+):

\`\`\`python
import json
import re

items = []
for item in _input.all():
    data = item.json
    cleaned_email = data.get('email', '').strip().lower()
    phone_digits = re.sub(r'\\D', '', data.get('telefono', ''))

    items.append({
        'json': {
            'email': cleaned_email,
            'telefono': phone_digits,
            'valido': bool(cleaned_email and phone_digits)
        }
    })

return items
\`\`\`

### Manejo de errores robusto

\`\`\`javascript
const items = $input.all();
const results = [];
const errors = [];

for (const item of items) {
  try {
    const data = item.json;

    if (!data.email) {
      throw new Error(\`Email requerido para item \${item.json.id}\`);
    }

    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: \`https://api.example.com/users/\${data.email}\`,
      headers: { 'Authorization': \`Bearer \${$env.API_TOKEN}\` }
    });

    results.push({
      json: { ...data, enriched: response.body }
    });
  } catch (error) {
    errors.push({
      json: {
        originalItem: item.json,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}

return [...results, ...errors];
\`\`\`

### Helper: this.helpers

El contexto \`this\` ofrece helpers poderosos:

\`\`\`javascript
this.helpers.httpRequest({
  method: 'POST',
  url: 'https://api.example.com/data',
  body: { key: 'value' },
  headers: { 'Content-Type': 'application/json' }
});

this.helpers.prepareOutputData([
  { json: { result: 'processed' } }
]);
\`\`\`

### Patrones avanzados

#### Batch Processing con Rate Limiting

\`\`\`javascript
const items = $input.all();
const BATCH_SIZE = 10;
const DELAY_MS = 1000;

const results = [];

for (let i = 0; i < items.length; i += BATCH_SIZE) {
  const batch = items.slice(i, i + BATCH_SIZE);

  const promises = batch.map(async (item) => {
    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: 'https://api.example.com/process',
      body: item.json
    });
    return { json: { ...item.json, result: response.body } };
  });

  const batchResults = await Promise.all(promises);
  results.push(...batchResults);

  if (i + BATCH_SIZE < items.length) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }
}

return results;
\`\`\`

#### Data Validation Pipeline

\`\`\`javascript
const validators = {
  email: (v) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v),
  phone: (v) => /^\\+?[\\d\\s-]{10,}$/.test(v),
  url: (v) => { try { new URL(v); return true; } catch { return false; } }
};

return $input.all().map(item => {
  const data = item.json;
  const validation = {};

  for (const [field, validator] of Object.entries(validators)) {
    validation[field] = data[field] ? validator(data[field]) : false;
  }

  const allValid = Object.values(validation).every(Boolean);

  return { json: { ...data, _validation: validation, _isValid: allValid } };
});
\`\`\`

### Limitaciones y consideraciones

- **Timeout**: El Code node tiene un timeout de 300 segundos por defecto
- **Memoria**: Limitado por la memoria del contenedor Docker
- **Módulos externos**: No puedes \`require()\` paquetes npm directamente; usa \`this.helpers.httpRequest\` para APIs externas
- **Python**: Soporte más limitado que JavaScript; no todas las funciones de \`this.helpers\` están disponibles`,
      estimatedMinutes: 25,
      quiz: [
        {
          id: "q-02-03-1",
          question: "¿Cuál es la diferencia entre 'Run Once for All Items' y 'Run Once for Each Item'?",
          options: [
            "No hay diferencia, son aliases",
            "El primero procesa todos los items juntos; el segundo procesa cada item individualmente",
            "El primero es más lento pero más seguro",
            "El segundo solo funciona con Python"
          ],
          correctIndex: 1,
          explanation: "'Run Once for All Items' recibe todos los items como array y los procesa juntos. 'Run Once for Each Item' ejecuta el código una vez por cada item individual."
        },
        {
          id: "q-02-03-2",
          question: "¿Cómo se hacen peticiones HTTP desde el Code node?",
          options: [
            "fetch('url')",
            "axios.get('url')",
            "this.helpers.httpRequest({ method, url })",
            "$http.get('url')"
          ],
          correctIndex: 2,
          explanation: "El Code node usa this.helpers.httpRequest() para hacer peticiones HTTP, ya que fetch y axios no están disponibles directamente."
        },
        {
          id: "q-02-03-3",
          question: "¿Cuál es el timeout por defecto del Code node?",
          options: ["60 segundos", "120 segundos", "300 segundos", "600 segundos"],
          correctIndex: 2,
          explanation: "El Code node tiene un timeout por defecto de 300 segundos (5 minutos), configurable en las opciones del nodo."
        }
      ]
    },
    {
      id: "les-02-04",
      moduleSlug: "core-nodos-esenciales",
      slug: "sub-workflows",
      title: "Sub-Workflows y Diseño Modular",
      description: "Aprende a crear workflows modulares con Execute Workflow, pasar parámetros entre workflows y diseñar arquitecturas reutilizables.",
      content: `## Sub-Workflows y Diseño Modular

Los sub-workflows permiten dividir workflows complejos en piezas reutilizables y mantenibles. El nodo **Execute Workflow** es la clave.

### ¿Por qué sub-workflows?

- **Reutilización**: Un sub-workflow de "enviar notificación" se usa en múltiples flujos
- **Mantenibilidad**: Cambios en un lugar afectan todos los flujos que lo usan
- **Legibilidad**: Workflows principales más simples y fáciles de entender
- **Testing**: Cada pieza se prueba de forma independiente
- **Control de errores**: Aislamiento de fallos en módulos específicos

### Execute Workflow Node

\`\`\`json
{
  "workflowId": {
    "value": "={{ $env.NOTIFICATION_WORKFLOW_ID }}",
    "mode": "id"
  },
  "mode": "each",
  "options": {
    "waitForSubWorkflow": true,
    "timeout": 30
  }
}
\`\`\`

### Modos de ejecución

| Modo | Descripción |
|---|---|
| \`each\` | Ejecuta el sub-workflow una vez por cada item |
| \`once\` | Ejecuta el sub-workflow una vez con todos los items |

### Pasar parámetros

#### Del parent al sub-workflow

Los items del parent se pasan automáticamente como input del sub-workflow. Para pasar datos adicionales, usa el nodo Set antes de Execute Workflow:

\`\`\`javascript
return $input.all().map(item => ({
  json: {
    ...item.json,
    _config: {
      sendEmail: true,
      sendSlack: false,
      priority: 'high'
    }
  }
}));
\`\`\`

#### Del sub-workflow al parent

El output del sub-workflow reemplaza los items del Execute Workflow node. Usa el nodo **Respond to Webhook** o simplemente deja que el último nodo del sub-workflow emita los datos.

### Patrón: Workflow Factory

Un workflow principal que decide qué sub-workflow ejecutar:

\`\`\`
[Trigger] → [Clasificar evento] → [Switch]
  → Output 0: [Execute Workflow: Procesar Pago]
  → Output 1: [Execute Workflow: Registrar Lead]
  → Output 2: [Execute Workflow: Enviar Soporte]
\`\`\`

### Patrón: Pipeline con etapas

\`\`\`
[Trigger] → [Execute: Validar Datos]
          → [Execute: Enriquecer Datos]
          → [Execute: Guardar en DB]
          → [Execute: Enviar Notificaciones]
\`\`\`

Cada etapa es un sub-workflow independiente que recibe datos de la etapa anterior.

### Patrón: Fan-out / Fan-in

Procesa items en paralelo con múltiples sub-workflows:

\`\`\`
[Trigger con 100 items] → [SplitInBatches: 10]
  → [Execute Workflow: Procesar Batch]
  → [Merge todos los resultados]
\`\`\`

### Manejo de errores en sub-workflows

Si el sub-workflow falla, el Execute Workflow node emite el error. Conecta un **Error Output** para manejar fallos:

\`\`\`
[Execute Workflow] → (success) → [Continuar flujo]
                 → (error)   → [Log error] → [Retry o Alert]
\`\`\`

### Variables de entorno para workflow IDs

Usa variables de entorno para los IDs de sub-workflows, facilitando el deploy entre ambientes:

\`\`\`yaml
N8N_WORKFLOW_ID_NOTIFICATIONS=abc123
N8N_WORKFLOW_ID_ENRICHMENT=def456
N8N_WORKFLOW_ID_BILLING=ghi789
\`\`\`

### Mejores prácticas

- **Nombres descriptivos**: "Sub - Enviar Notificación Slack" en vez de "Workflow 2"
- **Documentación**: Incluye un nodo Sticky Note al inicio de cada sub-workflow
- **Input validation**: Valida los datos de entrada al inicio del sub-workflow
- **Output consistente**: Siempre retorna datos en un formato predecible
- **Versionado**: Cuando hagas cambios breaking, crea una nueva versión del sub-workflow`,
      estimatedMinutes: 20,
      n8nWorkflowJson: {
        name: "Workflow Factory",
        nodes: [
          {
            parameters: { httpMethod: "POST", path: "events" },
            id: "webhook-1",
            name: "Eventos Webhook",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: {
              rules: {
                rules: [
                  { output: 0, conditions: { conditions: [{ leftValue: "={{ $json.type }}", rightValue: "payment", operator: "equals" }] } },
                  { output: 1, conditions: { conditions: [{ leftValue: "={{ $json.type }}", rightValue: "lead", operator: "equals" }] } },
                  { output: 2, conditions: { conditions: [{ leftValue: "={{ $json.type }}", rightValue: "support", operator: "equals" }] } }
                ]
              }
            },
            id: "switch-1",
            name: "Clasificar Evento",
            type: "n8n-nodes-base.switch",
            typeVersion: 3,
            position: [470, 300]
          },
          {
            parameters: { workflowId: { value: "={{ $env.WF_PAYMENT }}", mode: "id" } },
            id: "exec-1",
            name: "Procesar Pago",
            type: "n8n-nodes-base.executeWorkflow",
            typeVersion: 1,
            position: [690, 150]
          },
          {
            parameters: { workflowId: { value: "={{ $env.WF_LEAD }}", mode: "id" } },
            id: "exec-2",
            name: "Registrar Lead",
            type: "n8n-nodes-base.executeWorkflow",
            typeVersion: 1,
            position: [690, 300]
          },
          {
            parameters: { workflowId: { value: "={{ $env.WF_SUPPORT }}", mode: "id" } },
            id: "exec-3",
            name: "Enviar a Soporte",
            type: "n8n-nodes-base.executeWorkflow",
            typeVersion: 1,
            position: [690, 450]
          }
        ],
        connections: {
          "Eventos Webhook": { main: [[{ node: "Clasificar Evento", type: "main", index: 0 }]] },
          "Clasificar Evento": {
            main: [
              [{ node: "Procesar Pago", type: "main", index: 0 }],
              [{ node: "Registrar Lead", type: "main", index: 0 }],
              [{ node: "Enviar a Soporte", type: "main", index: 0 }]
            ]
          }
        }
      },
      quiz: [
        {
          id: "q-02-04-1",
          question: "¿Qué modo de Execute Workflow ejecuta el sub-workflow una vez por cada item?",
          options: ["once", "each", "batch", "parallel"],
          correctIndex: 1,
          explanation: "El modo 'each' ejecuta el sub-workflow una vez por cada item del input, mientras que 'once' ejecuta el sub-workflow una sola vez con todos los items."
        },
        {
          id: "q-02-04-2",
          question: "¿Por qué se recomienda usar variables de entorno para los IDs de sub-workflows?",
          options: [
            "Porque es más rápido",
            "Porque facilita el deploy entre ambientes (dev, staging, production)",
            "Porque es requerido por N8N",
            "Porque mejora el rendimiento"
          ],
          correctIndex: 1,
          explanation: "Usar variables de entorno para workflow IDs permite cambiar los IDs sin modificar el workflow, facilitando el deploy entre diferentes ambientes."
        },
        {
          id: "q-02-04-3",
          question: "¿Qué patrón permite procesar items en paralelo con sub-workflows?",
          options: [
            "Pipeline con etapas",
            "Workflow Factory",
            "Fan-out / Fan-in",
            "Dead Letter Queue"
          ],
          correctIndex: 2,
          explanation: "El patrón Fan-out/Fan-in divide items en batches y los procesa en paralelo con sub-workflows, luego merge todos los resultados."
        }
      ]
    },
    {
      id: "les-02-05",
      moduleSlug: "core-nodos-esenciales",
      slug: "control-flow",
      title: "Control de Flujo",
      description: "Domina los nodos de control: IF, Switch, Merge, SplitInBatches y Wait para construir flujos complejos y robustos.",
      content: `## Control de Flujo en N8N

Los nodos de control permiten crear lógica condicional, paralelismo y manejo de lotes en tus workflows.

### IF Node

Evalúa una condición y dirige items a la rama true o false:

\`\`\`json
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.score }}",
        "rightValue": 80,
        "operator": { "type": "number", "operation": "gte" }
      }
    ]
  }
}
\`\`\`

**Output 0 (true)**: Items que cumplen la condición
**Output 1 (false)**: Items que no la cumplen

### Switch Node

Dirige items a múltiples salidas basadas en condiciones:

\`\`\`json
{
  "rules": {
    "rules": [
      {
        "output": 0,
        "conditions": {
          "conditions": [{ "leftValue": "={{ $json.status }}", "rightValue": "active", "operator": "equals" }]
        }
      },
      {
        "output": 1,
        "conditions": {
          "conditions": [{ "leftValue": "={{ $json.status }}", "rightValue": "pending", "operator": "equals" }]
        }
      },
      {
        "output": 2,
        "conditions": {
          "conditions": [{ "leftValue": "={{ $json.status }}", "rightValue": "cancelled", "operator": "equals" }]
        }
      }
    ]
  },
  "fallbackOutput": 3
}
\`\`\`

### Merge Node

Combina datos de múltiples ramas. Modos disponibles:

| Modo | Descripción |
|---|---|
| **Append** | Concatena items de ambas entradas |
| **Combine by Position** | Une items por índice (item 0 de Input 1 con item 0 de Input 2) |
| **Combine by Matching Fields** | JOIN por campo común (como SQL) |
| **Choose Branch** | Espera a que una rama termine y usa sus datos |

#### Ejemplo: Combine by Matching Fields (SQL JOIN)

\`\`\`json
{
  "mode": "combine",
  "combinationMode": "mergeByFields",
  "fieldsToMatch": {
    "fields": [{ "field1": "userId", "field2": "id" }]
  },
  "joinMode": "keepMatches",
  "options": {}
}
\`\`\`

### SplitInBatches

Procesa items en lotes controlados. Esencial para respetar rate limits:

\`\`\`json
{
  "batchSize": 50,
  "options": {}
}
\`\`\`

El nodo SplitInBatches tiene dos outputs:
- **Output 0 (loop)**: Se ejecuta mientras queden items por procesar
- **Output 1 (done)**: Se ejecuta cuando todos los items fueron procesados

Patrón típico:

\`\`\`
[SplitInBatches: 10] → [HTTP Request] → [Wait: 1s] → (vuelve a SplitInBatches)
                  └→ (done) → [Continuar flujo]
\`\`\`

### Wait Node

Pausa la ejecución por un tiempo determinado:

\`\`\`json
{
  "resume": "timeInterval",
  "amount": 30,
  "unit": "seconds"
}
\`\`\`

Opciones de resume:
- **timeInterval**: Espera un tiempo fijo
- **specificTime**: Espera hasta una hora específica
- **webhook**: Espera hasta recibir un webhook externo

### Error Workflow

Captura errores de cualquier nodo del workflow:

\`\`\`
[Cualquier nodo] → (error output) → [Manejar Error]
\`\`\`

Configura "Continue On Fail" en las opciones del nodo para que no detenga el workflow:

\`\`\`json
{
  "options": {
    "continueOnFail": true
  }
}
\`\`\`

### Patrón: Retry con backoff

\`\`\`
[SplitInBatches: 1] → [HTTP Request] → (error?) → [Wait: 2^n segundos] → (retry)
                                    → (success) → (vuelve a SplitInBatches)
\`\`\`

### Patrón: Parallel Processing

\`\`\`
[Trigger] → [Nodo A (API 1)] ──┐
          → [Nodo B (API 2)] ──┤→ [Merge] → [Procesar resultados combinados]
          → [Nodo C (API 3)] ──┘
\`\`\`

### Tips de control de flujo

- Usa **Switch** en lugar de múltiples IF encadenados
- **Merge by Matching Fields** es tu amigo para JOINs entre APIs
- **SplitInBatches** + **Wait** = respeto de rate limits
- Configura **Continue On Fail** para nodos que pueden fallar sin detener el flujo
- Usa **Error Trigger** global para alertas de fallos no manejados`,
      estimatedMinutes: 22,
      n8nWorkflowJson: {
        name: "Batch Processing con Retry",
        nodes: [
          {
            parameters: { rule: { interval: [{ field: "hours", hoursInterval: 1 }] } },
            id: "schedule-1",
            name: "Cada hora",
            type: "n8n-nodes-base.scheduleTrigger",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: { url: "https://api.example.com/pending-items", options: {} },
            id: "http-1",
            name: "Obtener Items",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 4,
            position: [470, 300]
          },
          {
            parameters: { batchSize: 10 },
            id: "split-1",
            name: "Batch de 10",
            type: "n8n-nodes-base.splitInBatches",
            typeVersion: 3,
            position: [690, 300]
          },
          {
            parameters: { method: "POST", url: "https://api.example.com/process", options: { timeout: 30000 } },
            id: "http-2",
            name: "Procesar Item",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 4,
            position: [910, 300]
          },
          {
            parameters: { resume: "timeInterval", amount: 2, unit: "seconds" },
            id: "wait-1",
            name: "Esperar 2s",
            type: "n8n-nodes-base.wait",
            typeVersion: 1,
            position: [1130, 300]
          }
        ],
        connections: {
          "Cada hora": { main: [[{ node: "Obtener Items", type: "main", index: 0 }]] },
          "Obtener Items": { main: [[{ node: "Batch de 10", type: "main", index: 0 }]] },
          "Batch de 10": {
            main: [
              [{ node: "Procesar Item", type: "main", index: 0 }],
              []
            ]
          },
          "Procesar Item": { main: [[{ node: "Esperar 2s", type: "main", index: 0 }]] },
          "Esperar 2s": { main: [[{ node: "Batch de 10", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-02-05-1",
          question: "¿Cuántos outputs tiene el nodo SplitInBatches?",
          options: [
            "1 output",
            "2 outputs: loop y done",
            "3 outputs: loop, done y error",
            "Depende del batch size"
          ],
          correctIndex: 1,
          explanation: "SplitInBatches tiene 2 outputs: el output 0 (loop) se ejecuta mientras queden items, y el output 1 (done) cuando todos fueron procesados."
        },
        {
          id: "q-02-05-2",
          question: "¿Qué modo del Merge node funciona como un SQL JOIN?",
          options: [
            "Append",
            "Combine by Position",
            "Combine by Matching Fields",
            "Choose Branch"
          ],
          correctIndex: 2,
          explanation: "Combine by Matching Fields une items de dos inputs basándose en un campo común, similar a un JOIN en SQL."
        },
        {
          id: "q-02-05-3",
          question: "¿Qué opción permite que un nodo continúe ejecutándose aunque falle?",
          options: [
            "Retry on Fail",
            "Continue On Fail",
            "Ignore Errors",
            "Skip on Error"
          ],
          correctIndex: 1,
          explanation: "La opción 'Continue On Fail' en la configuración del nodo permite que el workflow continúe ejecutándose aunque ese nodo específico falle."
        }
      ]
    }
  ]
};
