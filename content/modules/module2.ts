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
      description: "Aprende los diferentes tipos de triggers en N8N y cómo diseñar arquitecturas event-driven.",
      estimatedMinutes: 20,
      content: `## Triggers en N8N

Los triggers son el punto de entrada de todo workflow. Definen cuándo y cómo se ejecuta un flujo de trabajo.

### Tipos de Triggers

#### 1. Webhook Trigger

Recibe peticiones HTTP externas. Ideal para integraciones con formularios, APIs de terceros y eventos de servicios.

**Configuración básica:**

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

**Ejemplo de uso:**

\`\`\`javascript
// Enviar datos al webhook
fetch('https://tu-n8n.com/webhook/mi-webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Juan',
    email: 'juan@example.com'
  })
});
\`\`\`

#### 2. Schedule Trigger (Cron)

Ejecuta workflows en intervalos regulares. Perfecto para tareas programadas.

**Sintaxis Cron:**

\`\`\`
* * * * *
│ │ │ │ │
│ │ │ │ └─ Día de la semana (0-7, 0 y 7 = domingo)
│ │ │ └─── Mes (1-12)
│ │ └───── Día del mes (1-31)
│ └─────── Hora (0-23)
└───────── Minuto (0-59)
\`\`\`

**Ejemplos comunes:**

\`\`\`bash
# Cada 5 minutos
*/5 * * * *

# Cada hora
0 * * * *

# Todos los días a las 9 AM
0 9 * * *

# Lunes a Viernes a las 8 AM
0 8 * * 1-5

# Primer día de cada mes a medianoche
0 0 1 * *
\`\`\`

#### 3. Email Trigger

Dispara workflows cuando llegan emails específicos.

**Configuración:**
- **Protocol**: IMAP
- **Host**: imap.gmail.com
- **Port**: 993
- **SSL**: true
- **Mailbox**: INBOX
- **Action**: Read and mark as read

**Filtros útiles:**
- From: emails específicos
- Subject: palabras clave
- Has attachments: solo con adjuntos

#### 4. Database Trigger

Monitorea cambios en bases de datos.

**PostgreSQL Trigger:**

\`\`\`sql
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('new_order', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_created
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION notify_new_order();
\`\`\`

### Patrones de Diseño Event-Driven

#### Patrón 1: Event Sourcing

\`\`\`
[Webhook] → [Validar] → [Guardar Evento] → [Procesar] → [Notificar]
\`\`\`

#### Patrón 2: CQRS (Command Query Responsibility Segregation)

\`\`\`
[Webhook] → [Command Handler] → [Actualizar BD] → [Publicar Evento]
                                                              ↓
                                              [Query Handler] → [Actualizar Vista]
\`\`\`

#### Patrón 3: Saga Pattern

\`\`\`
[Trigger] → [Step 1] → [Step 2] → [Step 3]
                ↓           ↓           ↓
          [Compensate] [Compensate] [Compensate]
\`\`\`

### Mejores Prácticas

1. **Idempotencia**: Diseña workflows que puedan ejecutarse múltiples veces sin efectos secundarios
2. **Validación temprana**: Valida datos en el primer nodo
3. **Logs detallados**: Registra información de debugging
4. **Timeouts**: Configura timeouts apropiados
5. **Retry logic**: Implementa reintentos para operaciones fallidas

### Ejemplo Completo: Webhook con Validación

\`\`\`javascript
// Function node para validar webhook
const body = $input.first().json;

// Validar campos requeridos
const requiredFields = ['email', 'nombre', 'telefono'];
const missingFields = requiredFields.filter(field => !body[field]);

if (missingFields.length > 0) {
  throw new Error(\`Campos faltantes: \${missingFields.join(', ')}\`);
}

// Validar formato de email
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
if (!emailRegex.test(body.email)) {
  throw new Error('Email inválido');
}

// Retornar datos validados
return [{
  json: {
    ...body,
    validated: true,
    timestamp: new Date().toISOString()
  }
}];
\`\`\`

### Debugging de Triggers

#### Webhook no se dispara:
1. Verifica que el workflow esté activo
2. Revisa la URL del webhook
3. Comprueba los headers y método HTTP
4. Inspecciona los logs de ejecución

#### Schedule no ejecuta:
1. Verifica la sintaxis del cron
2. Comprueba la zona horaria del workflow
3. Revisa si hay ejecuciones previas fallidas
4. Asegúrate de que el workflow esté activo

### Recursos Adicionales

- [Documentación de Triggers](https://docs.n8n.io/integrations/builtin/core-nodes/)
- [Cron Expression Generator](https://crontab.guru/)
- [Webhook Testing con Postman](https://www.postman.com/)
`,
    },
    {
      id: "les-02-02",
      moduleSlug: "core-nodos-esenciales",
      slug: "transformacion-datos",
      title: "Transformación de Datos JSON y Binarios",
      description: "Aprende a manipular y transformar datos en N8N usando nodos nativos y código.",
      estimatedMinutes: 25,
      content: `## Transformación de Datos en N8N

N8N maneja datos en formato JSON y binario. Aprender a transformarlos es fundamental.

### Estructura de Datos en N8N

Cada item en N8N tiene dos propiedades principales:

\`\`\`javascript
{
  json: {
    // Datos estructurados
    nombre: 'Juan',
    email: 'juan@example.com'
  },
  binary: {
    // Datos binarios (archivos, imágenes)
    data: {
      data: 'base64...',
      mimeType: 'image/png',
      fileName: 'foto.png'
    }
  }
}
\`\`\`

### Nodos de Transformación

#### 1. Set Node

Crea o modifica campos en los items.

**Ejemplo básico:**

\`\`\`javascript
{
  "values": {
    "string": [
      {
        "name": "nombreCompleto",
        "value": "={{ $json.nombre }} {{ $json.apellido }}"
      }
    ],
    "number": [
      {
        "name": "edad",
        "value": "={{ new Date().getFullYear() - $json.anioNacimiento }}"
      }
    ],
    "boolean": [
      {
        "name": "esMayor",
        "value": "={{ $json.edad >= 18 }}"
      }
    ]
  }
}
\`\`\`

#### 2. Rename Keys Node

Renombra campos sin modificar su contenido.

\`\`\`javascript
{
  "currentKey": "user_name",
  "newKey": "nombre"
}
\`\`\`

#### 3. Remove Duplicates Node

Elimina items duplicados basándose en campos específicos.

**Configuración:**
- **Compare**: Selected Fields
- **Options**: Keep First Match

#### 4. Sort Node

Ordena items por uno o más campos.

\`\`\`javascript
{
  "sortFieldsUi": {
    "sortField": [
      {
        "fieldName": "fecha",
        "order": "descending"
      }
    ]
  }
}
\`\`\`

### Manipulación con Code Node

#### Transformación de Arrays

\`\`\`javascript
const items = $input.all();

// Filtrar items
const activos = items.filter(item => item.json.estado === 'activo');

// Mapear y transformar
const transformados = items.map(item => ({
  json: {
    id: item.json.id,
    nombreCompleto: \`\${item.json.nombre} \${item.json.apellido}\`,
    emailLower: item.json.email.toLowerCase(),
    fechaRegistro: new Date(item.json.createdAt).toLocaleDateString('es-ES')
  }
}));

// Reducir a un solo objeto
const resumen = items.reduce((acc, item) => {
  acc.total += item.json.monto;
  acc.cantidad += 1;
  return acc;
}, { total: 0, cantidad: 0 });

return transformados;
\`\`\`

#### Manipulación de Objetos Anidados

\`\`\`javascript
const items = $input.all();

return items.map(item => {
  const data = item.json;
  
  // Extraer datos anidados
  const direccion = data.direccion || {};
  const contacto = data.contacto || {};
  
  return {
    json: {
      // Aplanar estructura
      nombre: data.nombre,
      calle: direccion.calle,
      ciudad: direccion.ciudad,
      pais: direccion.pais,
      telefono: contacto.telefono,
      email: contacto.email,
      
      // Crear campos calculados
      direccionCompleta: \`\${direccion.calle}, \${direccion.ciudad}, \${direccion.pais}\`,
      tieneContacto: !!(contacto.telefono || contacto.email)
    }
  };
});
\`\`\`

### Trabajo con Datos Binarios

#### Leer archivo CSV

\`\`\`javascript
const items = $input.all();
const binaryData = items[0].binary.data;

// Convertir base64 a string
const csvContent = Buffer.from(binaryData.data, 'base64').toString('utf-8');

// Parsear CSV
const lines = csvContent.split('\\n');
const headers = lines[0].split(',');

const result = lines.slice(1).map(line => {
  const values = line.split(',');
  const obj = {};
  headers.forEach((header, index) => {
    obj[header.trim()] = values[index]?.trim();
  });
  return { json: obj };
});

return result;
\`\`\`

#### Convertir JSON a CSV

\`\`\`javascript
const items = $input.all();

if (items.length === 0) return [];

// Extraer headers del primer item
const headers = Object.keys(items[0].json);

// Crear contenido CSV
const csvContent = [
  headers.join(','),
  ...items.map(item => 
    headers.map(header => {
      const value = item.json[header];
      // Escapar comillas y envolver en comillas si contiene coma
      const escaped = String(value).replace(/"/g, '""');
      return \`"\${escaped}"\`;
    }).join(',')
  )
].join('\\n');

// Convertir a binario
const binaryData = Buffer.from(csvContent, 'utf-8').toString('base64');

return [{
  json: { fileName: 'export.csv' },
  binary: {
    data: {
      data: binaryData,
      mimeType: 'text/csv',
      fileName: 'export.csv'
    }
  }
}];
\`\`\`

### Funciones Útiles de N8N

#### $() - Acceder a datos de nodos anteriores

\`\`\`javascript
// Acceder al primer item del nodo "Webhook"
const webhookData = $('Webhook').first().json;

// Acceder a todos los items del nodo "HTTP Request"
const allItems = $('HTTP Request').all();

// Acceder al último item
const lastItem = $('HTTP Request').last().json;
\`\`\`

#### $node - Información del nodo actual

\`\`\`javascript
const nodeName = $node.name;
const executionId = $execution.id;
const workflowName = $workflow.name;
\`\`\`

#### DateTime - Manejo de fechas

\`\`\`javascript
const now = $now; // DateTime actual
const today = $today; // Inicio del día actual

// Formatear fechas
const formatted = $now.format('dd/MM/yyyy HH:mm');

// Manipulación
const nextWeek = $now.plus({ days: 7 });
const lastMonth = $now.minus({ months: 1 });

// Comparación
const isAfter = $now > DateTime.fromISO('2024-01-01');
\`\`\`

### Patrones Comunes

#### Batch Processing

\`\`\`javascript
const items = $input.all();
const batchSize = 10;
const batches = [];

for (let i = 0; i < items.length; i += batchSize) {
  batches.push({
    json: {
      batch: items.slice(i, i + batchSize),
      batchNumber: Math.floor(i / batchSize) + 1,
      totalBatches: Math.ceil(items.length / batchSize)
    }
  });
}

return batches;
\`\`\`

#### Data Enrichment

\`\`\`javascript
const items = $input.all();

return items.map(item => {
  const data = item.json;
  
  // Enriquecer con datos calculados
  return {
    json: {
      ...data,
      // Calcular edad desde fecha de nacimiento
      edad: Math.floor(
        ($now.diff(DateTime.fromISO(data.fechaNacimiento), 'years')).years
      ),
      // Generar slug desde nombre
      slug: data.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      // Hash para ID único
      hash: require('crypto')
        .createHash('md5')
        .update(data.email)
        .digest('hex')
    }
  };
});
\`\`\`

### Mejores Prácticas

1. **Valida datos temprano**: Usa validaciones antes de transformaciones complejas
2. **Maneja null/undefined**: Siempre verifica que los campos existan
3. **Usa tipos correctos**: Convierte strings a números cuando sea necesario
4. **Documenta transformaciones**: Agrega comentarios en código complejo
5. **Prueba con datos reales**: Usa datos de muestra representativos

### Debugging

#### Inspeccionar datos en cada paso:

\`\`\`javascript
// Log de datos para debugging
console.log('Input items:', JSON.stringify($input.all(), null, 2));
console.log('First item:', $input.first().json);

// Retornar datos sin modificar
return $input.all();
\`\`\`

### Recursos Adicionales

- [Expresiones en N8N](https://docs.n8n.io/code/expressions/)
- [Code Node Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)
- [JavaScript Date Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
`,
    },
    {
      id: "les-02-03",
      moduleSlug: "core-nodos-esenciales",
      slug: "code-node-avanzado",
      title: "Code Node Avanzado: JavaScript y Python",
      description: "Domina el Code node con técnicas avanzadas de programación en JavaScript y Python.",
      estimatedMinutes: 30,
      content: `## Code Node Avanzado

El Code node es el más poderoso de N8N. Permite ejecutar código JavaScript o Python para lógica compleja.

### Modos de Ejecución

#### 1. Run Once for All Items

Ejecuta el código una vez con todos los items disponibles.

\`\`\`javascript
const items = $input.all();

// Procesar todos los items
const processed = items.map(item => ({
  json: {
    ...item.json,
    processed: true
  }
}));

return processed;
\`\`\`

#### 2. Run Once for Each Item

Ejecuta el código para cada item individualmente.

\`\`\`javascript
const item = $input.item;

return {
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
  }
};
\`\`\`

### JavaScript Avanzado

#### Async/Await con APIs Externas

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  try {
    // Llamada API asíncrona
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: \`https://api.example.com/users/\${item.json.userId}\`,
      headers: {
        'Authorization': \`Bearer \${$credentials.apiToken}\`
      }
    });
    
    results.push({
      json: {
        ...item.json,
        userData: response.data,
        fetched: true
      }
    });
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        error: error.message,
        fetched: false
      }
    });
  }
}

return results;
\`\`\`

#### Manejo de Errores Robusto

\`\`\`javascript
const items = $input.all();
const results = [];
const errors = [];

for (const item of items) {
  try {
    // Validación
    if (!item.json.email) {
      throw new Error('Email es requerido');
    }
    
    // Procesamiento
    const processed = {
      ...item.json,
      emailLower: item.json.email.toLowerCase(),
      processedAt: new Date().toISOString()
    };
    
    results.push({ json: processed });
  } catch (error) {
    errors.push({
      json: {
        originalItem: item.json,
        error: error.message,
        errorType: error.constructor.name,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Retornar resultados y errores por separado
return [...results, ...errors];
\`\`\`

#### Uso de Módulos Externos

\`\`\`javascript
// N8N incluye varias librerías útiles
const crypto = require('crypto');
const moment = require('moment');

const items = $input.all();

return items.map(item => {
  const data = item.json;
  
  // Generar hash
  const hash = crypto
    .createHash('sha256')
    .update(data.email)
    .digest('hex');
  
  // Formatear fecha con moment
  const fechaFormateada = moment(data.createdAt)
    .locale('es')
    .format('DD [de] MMMM [de] YYYY');
  
  return {
    json: {
      ...data,
      hash,
      fechaFormateada,
      diasDesdeCreacion: moment().diff(moment(data.createdAt), 'days')
    }
  };
});
\`\`\`

#### Manipulación de Arrays Compleja

\`\`\`javascript
const items = $input.all();

// Agrupar por categoría
const grouped = items.reduce((acc, item) => {
  const category = item.json.category || 'sin-categoria';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(item.json);
  return acc;
}, {});

// Convertir a formato de salida
return Object.entries(grouped).map(([category, items]) => ({
  json: {
    category,
    count: items.length,
    items,
    totalAmount: items.reduce((sum, item) => sum + (item.amount || 0), 0)
  }
}));
\`\`\`

### Python en Code Node

#### Configuración

Para usar Python, selecciona "Python" en el campo "Language" del Code node.

#### Ejemplo Básico

\`\`\`python
items = []

for item in _input.all():
    data = item.json
    
    # Transformación
    items.append({
        'json': {
            'nombre': data.get('nombre', '').upper(),
            'email': data.get('email', '').lower(),
            'procesado': True
        }
    })

return items
\`\`\`

#### Análisis de Datos con Python

\`\`\`python
import json
from datetime import datetime, timedelta

items = _input.all()
results = []

for item in items:
    data = item.json
    
    # Calcular métricas
    fecha_creacion = datetime.fromisoformat(data['createdAt'])
    dias_activo = (datetime.now() - fecha_creacion).days
    
    # Clasificar usuario
    if dias_activo > 365:
        categoria = 'veterano'
    elif dias_activo > 90:
        categoria = 'regular'
    else:
        categoria = 'nuevo'
    
    results.append({
        'json': {
            **data,
            'diasActivo': dias_activo,
            'categoria': categoria,
            'esActivo': dias_activo < 30
        }
    })

return results
\`\`\`

### Patrones Avanzados

#### Rate Limiting

\`\`\`javascript
const items = $input.all();
const results = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  
  try {
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: \`https://api.example.com/data/\${item.json.id}\`
    });
    
    results.push({
      json: {
        ...item.json,
        apiData: response.data
      }
    });
    
    // Rate limiting: esperar 100ms entre requests
    if (i < items.length - 1) {
      await delay(100);
    }
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        error: error.message
      }
    });
  }
}

return results;
\`\`\`

#### Retry con Exponential Backoff

\`\`\`javascript
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await this.helpers.httpRequest({
        method: 'GET',
        url
      });
      return response;
    } catch (error) {
      lastError = error;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

const items = $input.all();
const results = [];

for (const item of items) {
  try {
    const data = await fetchWithRetry(
      \`https://api.example.com/users/\${item.json.userId}\`
    );
    
    results.push({
      json: {
        ...item.json,
        userData: data
      }
    });
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        error: \`Failed after retries: \${error.message}\`
      }
    });
  }
}

return results;
\`\`\`

#### Parallel Processing

\`\`\`javascript
const items = $input.all();

// Procesar en paralelo (máximo 5 concurrentes)
const concurrency = 5;
const results = [];

async function processItem(item) {
  try {
    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: 'https://api.example.com/process',
      body: item.json
    });
    
    return {
      json: {
        ...item.json,
        result: response.data,
        success: true
      }
    };
  } catch (error) {
    return {
      json: {
        ...item.json,
        error: error.message,
        success: false
      }
    };
  }
}

// Procesar en lotes
for (let i = 0; i < items.length; i += concurrency) {
  const batch = items.slice(i, i + concurrency);
  const batchResults = await Promise.all(
    batch.map(item => processItem(item))
  );
  results.push(...batchResults);
}

return results;
\`\`\`

### Variables de Entorno y Secrets

\`\`\`javascript
// Acceder a variables de entorno
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

// Usar credenciales de N8N
const credentials = await this.getCredentials('httpHeaderAuth');
const token = credentials.value;

// Acceder a variables del workflow
const workflowVar = $workflow.variables.miVariable;
\`\`\`

### Debugging Avanzado

\`\`\`javascript
const items = $input.all();

// Logging detallado
console.log('=== DEBUG INFO ===');
console.log('Total items:', items.length);
console.log('First item:', JSON.stringify(items[0]?.json, null, 2));
console.log('Execution ID:', $execution.id);
console.log('Workflow name:', $workflow.name);

// Inspeccionar estructura de datos
const sampleItem = items[0]?.json;
if (sampleItem) {
  console.log('Item keys:', Object.keys(sampleItem));
  console.log('Item types:', Object.entries(sampleItem).map(([k, v]) => 
    \`\${k}: \${typeof v}\`
  ));
}

return items;
\`\`\`

### Mejores Prácticas

1. **Usa tipos correctos**: Valida y convierte tipos de datos
2. **Maneja errores**: Siempre usa try/catch en operaciones asíncronas
3. **Limita concurrencia**: No hagas demasiadas requests simultáneas
4. **Usa timeouts**: Configura timeouts para operaciones de red
5. **Documenta código**: Agrega comentarios para lógica compleja
6. **Prueba incrementalmente**: Prueba con pocos items primero

### Recursos Adicionales

- [Code Node Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)
- [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [N8N Built-in Methods](https://docs.n8n.io/code/builtin/overview/)
`,
    },
    {
      id: "les-02-04",
      moduleSlug: "core-nodos-esenciales",
      slug: "sub-workflows",
      title: "Sub-Workflows y Modularización",
      description: "Aprende a crear workflows modulares y reutilizables usando Execute Workflow node.",
      estimatedMinutes: 25,
      content: `## Sub-Workflows y Modularización

Los sub-workflows permiten dividir workflows complejos en componentes reutilizables y mantenibles.

### Execute Workflow Node

Este nodo ejecuta otro workflow y retorna sus resultados.

#### Configuración Básica

\`\`\`json
{
  "workflowId": "abc123",
  "mode": "once",
  "options": {
    "waitForSubWorkflow": true
  }
}
\`\`\`

#### Modos de Ejecución

**1. Once (Por defecto)**
Ejecuta el sub-workflow una vez con todos los items.

**2. Each Item**
Ejecuta el sub-workflow una vez por cada item.

### Patrones de Diseño

#### Patrón 1: Pipeline de Procesamiento

\`\`\`
[Main Workflow]
    ↓
[Execute: Validar Datos]
    ↓
[Execute: Enriquecer Datos]
    ↓
[Execute: Guardar en BD]
    ↓
[Execute: Enviar Notificación]
\`\`\`

**Main Workflow:**

\`\`\`javascript
// Cada Execute Workflow node llama a un sub-workflow específico
// Los datos fluyen de uno a otro automáticamente
\`\`\`

#### Patrón 2: Router de Workflows

\`\`\`
[Webhook]
    ↓
[Switch: Tipo de Evento]
    ├─→ [Execute: Procesar Orden]
    ├─→ [Execute: Procesar Pago]
    └─→ [Execute: Procesar Envío]
\`\`\`

**Switch Node Configuration:**

\`\`\`javascript
{
  "rules": {
    "rules": [
      {
        "value1": "={{ $json.eventType }}",
        "operation": "equal",
        "value2": "order_created",
        "output": 0
      },
      {
        "value1": "={{ $json.eventType }}",
        "operation": "equal",
        "value2": "payment_received",
        "output": 1
      },
      {
        "value1": "={{ $json.eventType }}",
        "operation": "equal",
        "value2": "shipment_sent",
        "output": 2
      }
    ]
  }
}
\`\`\`

#### Patrón 3: Error Handler Centralizado

\`\`\`
[Main Workflow]
    ↓
[Try: Proceso Principal]
    ↓ (error)
[Execute: Error Handler]
    ├─→ Log Error
    ├─→ Send Alert
    └─→ Retry Logic
\`\`\`

### Creación de Sub-Workflows Reutilizables

#### Sub-Workflow: Validación de Email

\`\`\`javascript
// Input: { email: "user@example.com" }
// Output: { email: "user@example.com", valid: true, normalized: "user@example.com" }

const items = $input.all();

return items.map(item => {
  const email = item.json.email || '';
  
  // Normalizar
  const normalized = email.toLowerCase().trim();
  
  // Validar formato
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  const valid = emailRegex.test(normalized);
  
  // Verificar dominio común
  const disposableDomains = ['tempmail.com', '10minutemail.com'];
  const domain = normalized.split('@')[1];
  const isDisposable = disposableDomains.includes(domain);
  
  return {
    json: {
      email: normalized,
      valid: valid && !isDisposable,
      normalized,
      isDisposable,
      domain
    }
  };
});
\`\`\`

#### Sub-Workflow: Enriquecimiento de Datos

\`\`\`javascript
// Input: { userId: "123" }
// Output: { userId: "123", userData: {...}, enriched: true }

const items = $input.all();
const results = [];

for (const item of items) {
  try {
    // Obtener datos del usuario
    const userResponse = await this.helpers.httpRequest({
      method: 'GET',
      url: \`https://api.example.com/users/\${item.json.userId}\`,
      headers: {
        'Authorization': \`Bearer \${$credentials.apiToken}\`
      }
    });
    
    // Obtener datos adicionales
    const profileResponse = await this.helpers.httpRequest({
      method: 'GET',
      url: \`https://api.example.com/users/\${item.json.userId}/profile\`
    });
    
    results.push({
      json: {
        ...item.json,
        userData: userResponse.data,
        profileData: profileResponse.data,
        enriched: true,
        enrichedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        enriched: false,
        error: error.message
      }
    });
  }
}

return results;
\`\`\`

#### Sub-Workflow: Notificación Multi-Canal

\`\`\`javascript
// Input: { message: "Alerta", channels: ["email", "slack"], recipients: [...] }

const items = $input.all();
const results = [];

for (const item of items) {
  const { message, channels, recipients } = item.json;
  const sentTo = [];
  
  // Enviar por email
  if (channels.includes('email')) {
    for (const recipient of recipients) {
      if (recipient.email) {
        // Aquí iría el nodo de email
        sentTo.push({ channel: 'email', recipient: recipient.email });
      }
    }
  }
  
  // Enviar por Slack
  if (channels.includes('slack')) {
    // Aquí iría el nodo de Slack
    sentTo.push({ channel: 'slack', webhook: 'configured' });
  }
  
  results.push({
    json: {
      message,
      sentTo,
      sentAt: new Date().toISOString()
    }
  });
}

return results;
\`\`\`

### Manejo de Datos entre Workflows

#### Pasar Datos al Sub-Workflow

\`\`\`javascript
// En el Execute Workflow node
{
  "workflowId": "sub-workflow-id",
  "mode": "once",
  "options": {
    "waitForSubWorkflow": true,
    "data": {
      "userId": "={{ $json.userId }}",
      "action": "={{ $json.action }}",
      "metadata": "={{ JSON.stringify($json.metadata) }}"
    }
  }
}
\`\`\`

#### Recibir Datos del Sub-Workflow

\`\`\`javascript
// El sub-workflow retorna items que se convierten en output del Execute Workflow node
// Puedes acceder a ellos como cualquier otro nodo

const subWorkflowOutput = $input.all();

return subWorkflowOutput.map(item => ({
  json: {
    ...item.json,
    processedByMainWorkflow: true
  }
}));
\`\`\`

### Variables Compartidas

#### Usar Variables del Workflow Principal

\`\`\`javascript
// En el sub-workflow, puedes acceder a variables del workflow principal
const parentWorkflowId = $workflow.activeWorkflowId;
const executionId = $execution.id;

// Las variables de entorno son compartidas
const apiKey = process.env.API_KEY;
\`\`\`

### Error Handling en Sub-Workflows

#### Patrón: Try-Catch con Execute Workflow

\`\`\`
[Main Workflow]
    ↓
[Execute: Sub-Workflow]
    ↓ (on error)
[Execute: Error Handler Sub-Workflow]
    ├─→ Log Error
    ├─→ Send Alert
    └─→ Return Fallback Data
\`\`\`

**Error Handler Sub-Workflow:**

\`\`\`javascript
const items = $input.all();

return items.map(item => {
  const error = item.json.error || {};
  
  // Log detallado
  console.error('Sub-workflow error:', {
    workflowId: error.workflowId,
    nodeId: error.nodeId,
    message: error.message,
    timestamp: new Date().toISOString()
  });
  
  // Retornar datos de fallback
  return {
    json: {
      success: false,
      error: error.message,
      fallback: true,
      timestamp: new Date().toISOString()
    }
  };
});
\`\`\`

### Optimización de Performance

#### Batch Processing con Sub-Workflows

\`\`\`javascript
// Dividir items en lotes y procesar en paralelo
const items = $input.all();
const batchSize = 50;
const batches = [];

for (let i = 0; i < items.length; i += batchSize) {
  batches.push(items.slice(i, i + batchSize));
}

// Cada lote se procesa en un Execute Workflow separado
return batches.map((batch, index) => ({
  json: {
    batchNumber: index + 1,
    totalBatches: batches.length,
    items: batch
  }
}));
\`\`\`

### Mejores Prácticas

1. **Nombres descriptivos**: Usa nombres claros para sub-workflows
2. **Documentación**: Documenta inputs y outputs esperados
3. **Validación**: Valida datos de entrada en sub-workflows
4. **Error handling**: Siempre maneja errores en sub-workflows
5. **Testing**: Prueba sub-workflows independientemente
6. **Versionado**: Mantén versiones de sub-workflows críticos
7. **Monitoreo**: Log ejecuciones de sub-workflows importantes

### Debugging

#### Verificar Flujo de Datos

\`\`\`javascript
// En el sub-workflow, log los datos recibidos
console.log('=== SUB-WORKFLOW INPUT ===');
console.log('Items received:', $input.all().length);
console.log('First item:', JSON.stringify($input.first().json, null, 2));

// Log los datos antes de retornar
console.log('=== SUB-WORKFLOW OUTPUT ===');
console.log('Items to return:', results.length);
\`\`\`

### Recursos Adicionales

- [Execute Workflow Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow/)
- [Workflow Organization](https://docs.n8n.io/flow-logic/subworkflows/)
- [Error Workflows](https://docs.n8n.io/flow-logic/error-handling/)
`,
    },
    {
      id: "les-02-05",
      moduleSlug: "core-nodos-esenciales",
      slug: "control-flujo",
      title: "Control de Flujo: IF, Switch, Merge y Wait",
      description: "Domina los nodos de control de flujo para crear workflows complejos y condicionales.",
      estimatedMinutes: 25,
      content: `## Control de Flujo en N8N

Los nodos de control de flujo permiten crear lógica condicional, combinar datos y manejar ejecuciones asíncronas.

### IF Node

Ejecuta diferentes ramas basándose en condiciones.

#### Configuración Básica

\`\`\`json
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.edad }}",
        "rightValue": 18,
        "operator": {
          "type": "number",
          "operation": "gte"
        }
      }
    ]
  }
}
\`\`\`

#### Operadores Disponibles

**Números:**
- \`equal\`: Igual a
- \`notEqual\`: Diferente de
- \`gt\`: Mayor que
- \`gte\`: Mayor o igual que
- \`lt\`: Menor que
- \`lte\`: Menor o igual que

**Strings:**
- \`equal\`: Igual a
- \`notEqual\`: Diferente de
- \`contains\`: Contiene
- \`notContains\`: No contiene
- \`startsWith\`: Empieza con
- \`endsWith\`: Termina con
- \`regex\`: Coincide con regex

**Boolean:**
- \`true\`: Es verdadero
- \`false\`: Es falso

**Arrays:**
- \`contains\`: Contiene elemento
- \`lengthEqual\`: Longitud igual a
- \`lengthGt\`: Longitud mayor que

#### Ejemplos de Condiciones

**Condición simple:**

\`\`\`javascript
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.status }}",
        "rightValue": "active",
        "operator": {
          "type": "string",
          "operation": "equal"
        }
      }
    ]
  }
}
\`\`\`

**Múltiples condiciones (AND):**

\`\`\`javascript
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.edad }}",
        "rightValue": 18,
        "operator": { "type": "number", "operation": "gte" }
      },
      {
        "leftValue": "={{ $json.email }}",
        "rightValue": "",
        "operator": { "type": "string", "operation": "notEmpty" }
      },
      {
        "leftValue": "={{ $json.verified }}",
        "rightValue": true,
        "operator": { "type": "boolean", "operation": "true" }
      }
    ],
    "combinator": "and"
  }
}
\`\`\`

**Múltiples condiciones (OR):**

\`\`\`javascript
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.role }}",
        "rightValue": "admin",
        "operator": { "type": "string", "operation": "equal" }
      },
      {
        "leftValue": "={{ $json.role }}",
        "rightValue": "moderator",
        "operator": { "type": "string", "operation": "equal" }
      }
    ],
    "combinator": "or"
  }
}
\`\`\`

### Switch Node

Dirige items a diferentes salidas basándose en condiciones.

#### Configuración

\`\`\`json
{
  "mode": "rules",
  "rules": {
    "rules": [
      {
        "output": 0,
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.tipo }}",
              "rightValue": "venta",
              "operator": { "type": "string", "operation": "equal" }
            }
          ]
        }
      },
      {
        "output": 1,
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.tipo }}",
              "rightValue": "devolucion",
              "operator": { "type": "string", "operation": "equal" }
            }
          ]
        }
      },
      {
        "output": 2,
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.tipo }}",
              "rightValue": "consulta",
              "operator": { "type": "string", "operation": "equal" }
            }
          ]
        }
      }
    ]
  },
  "fallbackOutput": 3
}
\`\`\`

#### Ejemplo: Router de Tickets

\`\`\`
[Webhook: Nuevo Ticket]
    ↓
[Switch: Prioridad]
    ├─ Output 0 (Alta) → [Execute: Proceso Urgente]
    ├─ Output 1 (Media) → [Execute: Proceso Normal]
    ├─ Output 2 (Baja) → [Execute: Proceso Batch]
    └─ Fallback → [Execute: Proceso Default]
\`\`\`

### Merge Node

Combina datos de múltiples fuentes.

#### Modos de Merge

**1. Append**
Concatena items de ambas entradas.

\`\`\`
Input 1: [A, B, C]
Input 2: [D, E, F]
Output: [A, B, C, D, E, F]
\`\`\`

**2. Combine by Position**
Combina items por posición (índice).

\`\`\`
Input 1: [{id: 1, name: "Juan"}, {id: 2, name: "María"}]
Input 2: [{age: 25}, {age: 30}]
Output: [{id: 1, name: "Juan", age: 25}, {id: 2, name: "María", age: 30}]
\`\`\`

**3. Combine by Fields**
Combina items basándose en campos coincidentes (como SQL JOIN).

\`\`\`javascript
{
  "mode": "combine",
  "combinationMode": "mergeByFields",
  "fieldsToMatch": {
    "fields": [
      {
        "field1": "userId",
        "field2": "id"
      }
    ]
  }
}
\`\`\`

**4. SQL-like Join**

\`\`\`javascript
{
  "mode": "combine",
  "combinationMode": "mergeByFields",
  "fieldsToMatch": {
    "fields": [
      {
        "field1": "orderId",
        "field2": "id"
      }
    ]
  },
  "options": {
    "joinMode": "innerJoin" // innerJoin, leftJoin, rightJoin, fullJoin
  }
}
\`\`\`

#### Ejemplo: Combinar Datos de Usuario y Pedidos

\`\`\`
[HTTP: Obtener Usuarios] ──┐
                           ├─→ [Merge: by userId] → [Output: Usuarios con Pedidos]
[HTTP: Obtener Pedidos] ──┘
\`\`\`

### Wait Node

Pausa la ejecución del workflow.

#### Modos de Espera

**1. Tiempo Fijo**

\`\`\`json
{
  "resume": "timeInterval",
  "amount": 5,
  "unit": "minutes"
}
\`\`\`

**2. Hasta Fecha Específica**

\`\`\`json
{
  "resume": "specificTime",
  "dateTime": "={{ $now.plus({ hours: 2 }).toISO() }}"
}
\`\`\`

**3. Webhook Callback**

\`\`\`json
{
  "resume": "webhook",
  "options": {
    "webhookSuffix": "/callback"
  }
}
\`\`\`

#### Ejemplo: Retry con Espera

\`\`\`
[HTTP Request]
    ↓ (error)
[Wait: 30 seconds]
    ↓
[HTTP Request] (retry)
    ↓ (error)
[Wait: 1 minute]
    ↓
[HTTP Request] (retry)
\`\`\`

### Split In Batches Node

Procesa items en lotes.

#### Configuración

\`\`\`json
{
  "batchSize": 10,
  "options": {}
}
\`\`\`

#### Ejemplo: Procesar 1000 Items en Lotes de 50

\`\`\`
[Split In Batches: 50]
    ↓
[HTTP Request: Procesar Lote]
    ↓
[Loop Back to Split In Batches]
    ↓ (cuando todos los lotes están procesados)
[Continue Workflow]
\`\`\`

### Loop Over Items Node

Itera sobre cada item individualmente.

#### Configuración

\`\`\`json
{
  "options": {
    "reset": false
  }
}
\`\`\`

#### Ejemplo: Procesar Items Uno por Uno

\`\`\`
[Loop Over Items]
    ↓
[HTTP Request: Procesar Item]
    ↓
[IF: Success?]
    ├─ Yes → [Loop Back]
    └─ No → [Error Handler] → [Loop Back]
\`\`\`

### Patrones Avanzados

#### Patrón: State Machine

\`\`\`
[Start]
    ↓
[Switch: Estado Actual]
    ├─ "nuevo" → [Procesar Nuevo] → [Set: Estado = "procesando"] → [Loop]
    ├─ "procesando" → [Verificar] → [Set: Estado = "completado"] → [Loop]
    ├─ "completado" → [Notificar] → [End]
    └─ "error" → [Manejar Error] → [End]
\`\`\`

#### Patrón: Fan-Out / Fan-In

\`\`\`
[Webhook: Lista de URLs]
    ↓
[Split In Batches: 5]
    ↓
[HTTP Request: Fetch URL] (5 en paralelo)
    ↓
[Merge: Combinar Resultados]
    ↓
[Procesar Todos los Resultados]
\`\`\`

#### Patrón: Circuit Breaker

\`\`\`javascript
// Code node para implementar circuit breaker
const items = $input.all();
const circuitState = $workflow.variables.circuitState || 'closed';
const failureCount = $workflow.variables.failureCount || 0;
const threshold = 5;

if (circuitState === 'open') {
  // Circuit abierto, no procesar
  return items.map(item => ({
    json: {
      ...item.json,
      skipped: true,
      reason: 'Circuit breaker open'
    }
  }));
}

// Procesar normalmente
const results = [];
let newFailureCount = failureCount;

for (const item of items) {
  try {
    // Intentar procesar
    const result = await processItem(item);
    results.push({ json: { ...item.json, ...result, success: true } });
    newFailureCount = 0; // Reset on success
  } catch (error) {
    results.push({ json: { ...item.json, error: error.message, success: false } });
    newFailureCount++;
  }
}

// Actualizar estado del circuit
const newState = newFailureCount >= threshold ? 'open' : 'closed';

return results;
\`\`\`

### Mejores Prácticas

1. **Usa IF para lógica simple**: Dos caminos (true/false)
2. **Usa Switch para múltiples caminos**: Más de dos opciones
3. **Merge con cuidado**: Asegúrate de que los campos de match existan
4. **Wait con moderación**: No pauses workflows por demasiado tiempo
5. **Batch processing**: Usa Split In Batches para grandes volúmenes
6. **Documenta flujos complejos**: Agrega notas explicativas

### Debugging

#### Verificar Flujo de Ejecución

\`\`\`javascript
// En cada nodo de control, log el camino tomado
console.log('IF Node - Condition result:', conditionResult);
console.log('Switch Node - Output:', outputIndex);
console.log('Merge Node - Items from input 1:', input1Count);
console.log('Merge Node - Items from input 2:', input2Count);
\`\`\`

### Recursos Adicionales

- [IF Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/)
- [Switch Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/)
- [Merge Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/)
- [Wait Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/)
`,
    },
  ],
};
