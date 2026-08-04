import { Module } from "../../types/course";

export const module3: Module = {
  id: "mod-03",
  slug: "integraciones-apis",
  title: "Integraciones, APIs y Autenticación",
  description: "Conecta N8N con servicios externos: HTTP Request, Supabase, Google Workspace, Notion, Airtable y patrones de diseño de APIs.",
  icon: "Plug",
  sortOrder: 3,
  lessons: [
    {
      id: "les-03-01",
      moduleSlug: "integraciones-apis",
      slug: "http-request-node",
      title: "HTTP Request: Deep Dive",
      description: "Domina el nodo HTTP Request: métodos, headers, autenticación OAuth2, API Keys, Bearer tokens y manejo de respuestas.",
      content: `## HTTP Request Node: Deep Dive

El HTTP Request es el nodo más versátil de N8N. Permite interactuar con cualquier API REST, GraphQL o SOAP.

### Configuración básica

\`\`\`json
{
  "method": "POST",
  "url": "https://api.example.com/v1/resource",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "Content-Type", "value": "application/json" },
      { "name": "Accept", "value": "application/json" }
    ]
  },
  "sendBody": true,
  "bodyParameters": {
    "parameters": [
      { "name": "nombre", "value": "={{ $json.nombre }}" },
      { "name": "email", "value": "={{ $json.email }}" }
    ]
  },
  "options": {
    "timeout": 30000,
    "response": { "response": { "responseFormat": "json" } }
  }
}
\`\`\`

### Métodos HTTP

| Método | Uso típico |
|---|---|
| GET | Obtener datos |
| POST | Crear recursos |
| PUT | Reemplazar recursos completos |
| PATCH | Actualizar parcialmente |
| DELETE | Eliminar recursos |

### Autenticación

#### API Key (Header)

\`\`\`json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true
}
\`\`\`

Configura en Credentials:
- Name: \`X-API-Key\`
- Value: \`tu-api-key-secreta\`

#### Bearer Token

\`\`\`json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth"
}
\`\`\`

Credentials:
- Name: \`Authorization\`
- Value: \`Bearer eyJhbGciOiJIUzI1NiIs...\`

#### OAuth2

N8N maneja el flujo OAuth2 completo:

1. Configura las credenciales OAuth2 con Client ID y Secret
2. N8N solicita y renueva tokens automáticamente
3. El token se incluye en el header Authorization

\`\`\`json
{
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "googleOAuth2Api"
}
\`\`\`

#### Basic Auth

\`\`\`json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpBasicAuth"
}
\`\`\`

### Opciones avanzadas

#### Paginación automática

\`\`\`json
{
  "options": {
    "pagination": {
      "pagination": {
        "type": "nextUrl",
        "nextUrl": "={{ $response.body.next_page }}",
        "maxRequests": 100
      }
    }
  }
}
\`\`\`

#### Retry on failure

\`\`\`json
{
  "options": {
    "retry": {
      "maxRetries": 3,
      "retryInterval": 5000
    }
  }
}
\`\`\`

#### Proxy y SSL

\`\`\`json
{
  "options": {
    "proxy": "http://proxy.empresa.com:8080",
    "allowUnauthorizedCerts": false
  }
}
\`\`\`

### GraphQL

\`\`\`json
{
  "method": "POST",
  "url": "https://api.example.com/graphql",
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ query: '{ users { id name email } }' }) }}"
}
\`\`\`

### Manejo de respuestas

#### Response codes

- **2xx**: Éxito
- **3xx**: Redirección (N8N sigue automáticamente)
- **4xx**: Error del cliente (revisar parámetros)
- **5xx**: Error del servidor (reintentar o alertar)

#### Parseo de respuestas

\`\`\`json
{
  "options": {
    "response": {
      "response": {
        "responseFormat": "json",
        "outputPropertyName": "responseData"
      }
    }
  }
}
\`\`\`

### Tips de HTTP Request

- Siempre configura **timeout** para evitar bloqueos infinitos
- Usa **pagination** para APIs que retornan datos paginados
- Configura **retry** para APIs inestables
- Usa **expressions** para construir URLs dinámicas
- Guarda credenciales en **N8N Credentials**, nunca en el workflow directamente`,
      estimatedMinutes: 20,
      quiz: [
        {
          id: "q-03-01-1",
          question: "¿Qué tipo de autenticación maneja la renovación de tokens automáticamente?",
          options: ["API Key", "Bearer Token", "OAuth2", "Basic Auth"],
          correctIndex: 2,
          explanation: "OAuth2 en N8N maneja automáticamente la solicitud, almacenamiento y renovación de tokens de acceso sin intervención manual."
        },
        {
          id: "q-03-01-2",
          question: "¿Cómo se configura la paginación automática en HTTP Request?",
          options: [
            "Con un loop en Code node",
            "En options.pagination con nextUrl",
            "No es posible, hay que hacerlo manualmente",
            "Con SplitInBatches"
          ],
          correctIndex: 1,
          explanation: "La paginación automática se configura en options.pagination, donde se especifica cómo obtener la URL de la siguiente página."
        },
        {
          id: "q-03-01-3",
          question: "¿Dónde se deben almacenar las credenciales de API en N8N?",
          options: [
            "En variables del workflow",
            "En el Code node como constantes",
            "En N8N Credentials",
            "En el docker-compose.yml"
          ],
          correctIndex: 2,
          explanation: "Las credenciales deben almacen en N8N Credentials, que las encripta y gestiona de forma segura, separadas del workflow."
        }
      ]
    },
    {
      id: "les-03-02",
      moduleSlug: "integraciones-apis",
      slug: "integracion-supabase",
      title: "Integración con Supabase",
      description: "Conecta N8N con Supabase para operaciones CRUD, autenticación, real-time subscriptions y manejo de tokens.",
      content: `## Integración con Supabase

Supabase es una plataforma open-source que proporciona base de datos PostgreSQL, autenticación, almacenamiento y real-time subscriptions. N8N se integra perfectamente con todos sus servicios.

### Configuración de credenciales

N8N tiene un nodo nativo para Supabase, pero también puedes usar HTTP Request directamente.

**Credenciales necesarias:**
- **Supabase URL**: \`https://xxxxx.supabase.co\`
- **Service Role Key**: Clave con permisos completos (no exponer al cliente)
- **Anon Key**: Clave pública para operaciones limitadas

### Operaciones CRUD

#### INSERT (Crear registros)

\`\`\`json
{
  "method": "POST",
  "url": "={{ $env.SUPABASE_URL }}/rest/v1/leads",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "apikey", "value": "={{ $env.SUPABASE_SERVICE_KEY }}" },
      { "name": "Authorization", "value": "Bearer {{ $env.SUPABASE_SERVICE_KEY }}" },
      { "name": "Content-Type", "value": "application/json" },
      { "name": "Prefer", "value": "return=representation" }
    ]
  },
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ nombre: $json.nombre, email: $json.email, empresa: $json.empresa, source: 'webhook', created_at: $now.toISO() }) }}"
}
\`\`\`

#### SELECT (Leer registros)

\`\`\`json
{
  "method": "GET",
  "url": "={{ $env.SUPABASE_URL }}/rest/v1/leads?select=*&status=eq.pending&order=created_at.desc&limit=50",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "apikey", "value": "={{ $env.SUPABASE_SERVICE_KEY }}" },
      { "name": "Authorization", "value": "Bearer {{ $env.SUPABASE_SERVICE_KEY }}" }
    ]
  }
}
\`\`\`

#### UPDATE (Actualizar registros)

\`\`\`json
{
  "method": "PATCH",
  "url": "={{ $env.SUPABASE_URL }}/rest/v1/leads?id=eq.{{ $json.id }}",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "apikey", "value": "={{ $env.SUPABASE_SERVICE_KEY }}" },
      { "name": "Authorization", "value": "Bearer {{ $env.SUPABASE_SERVICE_KEY }}" },
      { "name": "Prefer", "value": "return=representation" }
    ]
  },
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ status: 'processed', processed_at: $now.toISO() }) }}"
}
\`\`\`

#### DELETE (Eliminar registros)

\`\`\`json
{
  "method": "DELETE",
  "url": "={{ $env.SUPABASE_URL }}/rest/v1/leads?id=eq.{{ $json.id }}",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "apikey", "value": "={{ $env.SUPABASE_SERVICE_KEY }}" },
      { "name": "Authorization", "value": "Bearer {{ $env.SUPABASE_SERVICE_KEY }}" }
    ]
  }
}
\`\`\`

### Filtros de PostgREST

Supabase usa PostgREST, que soporta operadores de filtro en la URL:

| Operador | Sintaxis | Ejemplo |
|---|---|---|
| Igual | \`eq\` | \`status=eq.active\` |
| No igual | \`neq\` | \`status=neq.deleted\` |
| Mayor que | \`gt\` | \`score=gt.80\` |
| Menor que | \`lt\` | \`created_at=lt.2024-01-01\` |
| LIKE | \`like\` | \`nombre=like.*juan*\` |
| IN | \`in\` | \`status=in.(active,pending)\` |
| IS NULL | \`is\` | \`email=is.null\` |

### RPC (Funciones de base de datos)

\`\`\`json
{
  "method": "POST",
  "url": "={{ $env.SUPABASE_URL }}/rest/v1/rpc/process_lead",
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ lead_id: $json.id, action: 'enrich' }) }}"
}
\`\`\`

### Real-time con Webhooks de Supabase

Configura un trigger en Supabase que llame a N8N:

\`\`\`sql
CREATE OR REPLACE FUNCTION notify_n8n()
RETURNS trigger AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://n8n.tu-dominio.com/webhook/supabase-event',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'data', CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
\`\`\`

### Upset (INSERT o UPDATE)

\`\`\`json
{
  "method": "POST",
  "url": "={{ $env.SUPABASE_URL }}/rest/v1/leads",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "apikey", "value": "={{ $env.SUPABASE_SERVICE_KEY }}" },
      { "name": "Authorization", "value": "Bearer {{ $env.SUPABASE_SERVICE_KEY }}" },
      { "name": "Prefer", "value": "resolution=merge-duplicates,return=representation" }
    ]
  },
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ email: $json.email, nombre: $json.nombre, updated_at: $now.toISO() }) }}"
}
\`\`\`

### Seguridad

- **Nunca uses la Service Role Key en el frontend**; solo en N8N (backend)
- **Usa Row Level Security (RLS)** en Supabase para controlar acceso a nivel de fila
- **Rota las claves** periódicamente
- **Usa variables de entorno** en N8N para las claves, no las hardcodees en workflows`,
      estimatedMinutes: 22,
      n8nWorkflowJson: {
        name: "Supabase CRUD Pipeline",
        nodes: [
          {
            parameters: { httpMethod: "POST", path: "new-lead" },
            id: "webhook-1",
            name: "Nuevo Lead",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: {
              method: "POST",
              url: "={{ $env.SUPABASE_URL }}/rest/v1/leads",
              sendHeaders: true,
              headerParameters: {
                parameters: [
                  { name: "apikey", value: "={{ $env.SUPABASE_SERVICE_KEY }}" },
                  { name: "Authorization", value: "Bearer {{ $env.SUPABASE_SERVICE_KEY }}" },
                  { name: "Prefer", value: "return=representation" }
                ]
              },
              sendBody: true,
              specifyBody: "json",
              jsonBody: "={{ JSON.stringify($json) }}"
            },
            id: "http-insert",
            name: "Insertar en Supabase",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 4,
            position: [470, 300]
          },
          {
            parameters: {
              method: "GET",
              url: "={{ $env.SUPABASE_URL }}/rest/v1/leads?id=eq.{{ $json.id }}&select=*,enrichment(*)",
              sendHeaders: true,
              headerParameters: {
                parameters: [
                  { name: "apikey", value: "={{ $env.SUPABASE_SERVICE_KEY }}" },
                  { name: "Authorization", value: "Bearer {{ $env.SUPABASE_SERVICE_KEY }}" }
                ]
              }
            },
            id: "http-select",
            name: "Leer Lead Completo",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 4,
            position: [690, 300]
          }
        ],
        connections: {
          "Nuevo Lead": { main: [[{ node: "Insertar en Supabase", type: "main", index: 0 }]] },
          "Insertar en Supabase": { main: [[{ node: "Leer Lead Completo", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-03-02-1",
          question: "¿Qué header de Supabase permite retornar los datos insertados/actualizados?",
          options: [
            "X-Return-Data: true",
            "Prefer: return=representation",
            "Accept: application/json",
            "X-Include-Data: true"
          ],
          correctIndex: 1,
          explanation: "El header 'Prefer: return=representation' le indica a PostgREST que retorne los datos del registro insertado o actualizado en la respuesta."
        },
        {
          id: "q-03-02-2",
          question: "¿Qué clave de Supabase NO debe usarse en el frontend?",
          options: ["Anon Key", "Service Role Key", "API URL", "Project Reference"],
          correctIndex: 1,
          explanation: "La Service Role Key tiene permisos completos sobre la base de datos y solo debe usarse en el backend (N8N). Nunca debe exponerse en el frontend."
        },
        {
          id: "q-03-02-3",
          question: "¿Qué operador de PostgREST se usa para buscar valores que contengan un texto?",
          options: ["contains", "like", "match", "search"],
          correctIndex: 1,
          explanation: "El operador 'like' con wildcards (*texto*) se usa para buscar valores que contengan un texto específico en PostgREST."
        }
      ]
    },
    {
      id: "les-03-03",
      moduleSlug: "integraciones-apis",
      slug: "integracion-google-workspace",
      title: "Integración con Google Workspace",
      description: "Conecta N8N con Gmail, Google Sheets y Google Drive usando OAuth2 para automatizaciones completas.",
      content: `## Integración con Google Workspace

Google Workspace es uno de los ecosistemas más usados en empresas. N8N ofrece nodos nativos para Gmail, Sheets y Drive con soporte OAuth2.

### Configuración OAuth2

#### Paso 1: Google Cloud Console

1. Ve a Google Cloud Console
2. Crea un proyecto nuevo
3. Habilita las APIs necesarias: Gmail API, Google Sheets API, Google Drive API
4. Ve a **Credentials** → **Create OAuth 2.0 Client ID**
5. Tipo: **Web application**
6. Authorized redirect URIs: agrega la URL que N8N te proporciona

#### Paso 2: Configurar en N8N

1. En N8N, crea nuevas credenciales de tipo **Google OAuth2**
2. Pega el Client ID y Client Secret
3. Selecciona los scopes necesarios
4. Haz clic en **Connect** y autoriza la cuenta

### Gmail Node

#### Enviar email

\`\`\`json
{
  "operation": "send",
  "sendTo": "={{ $json.email }}",
  "subject": "Bienvenido a nuestro servicio, {{ $json.nombre }}",
  "emailType": "html",
  "message": "<h1>Bienvenido</h1><p>Hola {{ $json.nombre }}, tu cuenta ha sido creada exitosamente.</p>",
  "options": {
    "ccEmail": "ventas@tuempresa.com"
  }
}
\`\`\`

#### Leer emails

\`\`\`json
{
  "operation": "getAll",
  "simple": false,
  "filters": {
    "labelIds": ["INBOX"],
    "readStatus": "unread",
    "q": "from:cliente@empresa.com subject:factura"
  },
  "returnAll": false,
  "limit": 10
}
\`\`\`

#### Gmail Trigger

Configura un trigger para nuevos emails:

\`\`\`json
{
  "event": "messageReceived",
  "filters": {
    "labelIds": ["INBOX"],
    "q": "has:attachment"
  }
}
\`\`\`

### Google Sheets Node

#### Leer datos

\`\`\`json
{
  "operation": "read",
  "documentId": { "value": "={{ $env.GOOGLE_SHEET_ID }}" },
  "sheetName": { "value": "Leads" },
  "options": {
    "dataLocationOnSheet": {
      "values": {
        "rangeDefinition": "detectAutomatically"
      }
    }
  }
}
\`\`\`

#### Escribir datos (append)

\`\`\`json
{
  "operation": "append",
  "documentId": { "value": "={{ $env.GOOGLE_SHEET_ID }}" },
  "sheetName": { "value": "Leads" },
  "dataMode": "autoMapInputData",
  "options": {
    "valueInputMode": "USER_ENTERED"
  }
}
\`\`\`

#### Actualizar celda específica

\`\`\`json
{
  "operation": "update",
  "documentId": { "value": "={{ $env.GOOGLE_SHEET_ID }}" },
  "sheetName": { "value": "Leads" },
  "dataMode": "defineBelow",
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      "Nombre": "={{ $json.nombre }}",
      "Email": "={{ $json.email }}",
      "Status": "Procesado",
      "Fecha": "={{ $now.toFormat('yyyy-MM-dd HH:mm') }}"
    }
  }
}
\`\`\`

### Google Drive Node

#### Subir archivo

\`\`\`json
{
  "operation": "upload",
  "name": "reporte-{{ $now.toFormat('yyyy-MM-dd') }}.pdf",
  "folderId": { "value": "={{ $env.DRIVE_FOLDER_ID }}" },
  "inputDataFieldName": "data"
}
\`\`\`

#### Buscar archivos

\`\`\`json
{
  "operation": "search",
  "query": "mimeType='application/pdf' and modifiedTime > '2024-01-01'"
}
\`\`\`

### Workflow completo: Lead → Sheet → Email → Drive

\`\`\`
[Webhook: Nuevo Lead]
  → [Google Sheets: Append Row]
  → [Gmail: Enviar Bienvenida]
  → [Google Drive: Guardar PDF del contrato]
\`\`\`

### Tips de Google Workspace

- **Usa Service Accounts** para automatizaciones server-to-server sin intervención humana
- **Respeta los rate limits**: Gmail permite 250 mensajes/día por usuario con quota de API
- **Usa filtros de Gmail** para pre-clasificar emails antes de procesarlos en N8N
- **Cachea datos de Sheets** si los lees frecuentemente; usa un webhook para cambios en vez de polling
- **Maneja errores de OAuth**: Los tokens expiran; N8N los renueva automáticamente, pero monitorea fallos de autenticación`,
      estimatedMinutes: 20,
      quiz: [
        {
          id: "q-03-03-1",
          question: "¿Qué tipo de credenciales se usa para conectar N8N con Google Workspace?",
          options: ["API Key", "Basic Auth", "OAuth2", "Service Account siempre"],
          correctIndex: 2,
          explanation: "N8N usa OAuth2 para conectar con Google Workspace, permitiendo acceso delegado sin compartir contraseñas."
        },
        {
          id: "q-03-03-2",
          question: "¿Qué operación de Google Sheets agrega datos al final de la hoja?",
          options: ["write", "append", "insert", "push"],
          correctIndex: 1,
          explanation: "La operación 'append' agrega datos al final de la hoja de cálculo, después de la última fila con datos."
        },
        {
          id: "q-03-03-3",
          question: "¿Cuál es el límite diario de envío de emails con Gmail API por usuario?",
          options: ["50 mensajes", "100 mensajes", "250 mensajes", "Ilimitado"],
          correctIndex: 2,
          explanation: "Gmail API tiene un límite de aproximadamente 250 mensajes por día por usuario con quota de API. Para mayor volumen, usa un servicio de email transaccional."
        }
      ]
    },
    {
      id: "les-03-04",
      moduleSlug: "integraciones-apis",
      slug: "integracion-notion-airtable",
      title: "Integración con Notion y Airtable",
      description: "Automatiza Notion databases y Airtable como CMS, con patrones de sincronización bidireccional entre plataformas.",
      content: `## Integración con Notion y Airtable

Notion y Airtable son herramientas populares para gestión de datos. N8N permite automatizar ambos como base de datos, CMS o sistema de gestión.

### Notion: Configuración

1. Crea una integración en notion.so/my-integrations
2. Copia el **Internal Integration Token**
3. Comparte la base de datos con la integración
4. Configura las credenciales en N8N

### Notion: Consultar base de datos

\`\`\`json
{
  "operation": "search",
  "resource": "database",
  "query": "Leads Pipeline"
}
\`\`\`

### Notion: Crear página en database

\`\`\`json
{
  "operation": "create",
  "resource": "databasePage",
  "databaseId": "={{ $env.NOTION_DB_ID }}",
  "properties": {
    "properties": [
      { "key": "Nombre", "value": "={{ $json.nombre }}" },
      { "key": "Email", "value": "={{ $json.email }}" },
      { "key": "Status", "value": "Nuevo" },
      { "key": "Score", "value": "={{ $json.score }}" }
    ]
  }
}
\`\`\`

### Notion: Actualizar página

\`\`\`json
{
  "operation": "update",
  "resource": "databasePage",
  "pageId": "={{ $json.notionPageId }}",
  "properties": {
    "properties": [
      { "key": "Status", "value": "Procesado" },
      { "key": "Última actualización", "value": "={{ $now.toISO() }}" }
    ]
  }
}
\`\`\`

### Notion: Tipos de propiedades

| Tipo | Ejemplo de valor |
|---|---|
| Title | \`"Mi página"\` |
| Rich text | \`"Texto con formato"\` |
| Number | \`42\` |
| Select | \`"Opción A"\` |
| Multi-select | \`["Tag1", "Tag2"]\` |
| Date | \`"2024-01-15"\` |
| Checkbox | \`true\` |
| URL | \`"https://ejemplo.com"\` |
| Email | \`"user@mail.com"\` |

### Airtable: Configuración

1. Ve a airtable.com/create/tokens
2. Crea un Personal Access Token
3. Selecciona los scopes: \`data.records:read\`, \`data.records:write\`
4. Configura en N8N

### Airtable: Listar registros

\`\`\`json
{
  "operation": "list",
  "base": { "value": "={{ $env.AIRTABLE_BASE_ID }}" },
  "table": { "value": "Leads" },
  "options": {
    "filterByFormula": "AND({Status} = 'Nuevo', {Score} > 50)",
    "sort": [{ "field": "created_at", "direction": "desc" }],
    "maxRecords": 100
  }
}
\`\`\`

### Airtable: Crear registro

\`\`\`json
{
  "operation": "create",
  "base": { "value": "={{ $env.AIRTABLE_BASE_ID }}" },
  "table": { "value": "Leads" },
  "columns": {
    "mappingMode": "defineBelow",
    "value": {
      "Nombre": "={{ $json.nombre }}",
      "Email": "={{ $json.email }}",
      "Empresa": "={{ $json.empresa }}",
      "Status": "Nuevo",
      "Score": "={{ $json.score }}"
    }
  }
}
\`\`\`

### Patrón: Sincronización Bidireccional

Sincroniza datos entre Notion y Airtable:

\`\`\`
[Schedule cada 15min]
  → [Leer Notion: últimos cambios]
  → [Comparar con Airtable]
  → [Actualizar diferencias en Airtable]
  → [Leer Airtable: últimos cambios]
  → [Comparar con Notion]
  → [Actualizar diferencias en Notion]
\`\`\`

#### Implementación del sync

\`\`\`javascript
const notionItems = $input.all();
const airtableItems = $('Airtable').all();

const airtableMap = new Map(
  airtableItems.map(item => [item.json.fields.Email, item.json])
);

const toUpdateInAirtable = [];
const toCreateInAirtable = [];

for (const item of notionItems) {
  const existing = airtableMap.get(item.json.properties.Email);
  if (existing) {
    if (existing.fields.Status !== item.json.properties.Status) {
      toUpdateInAirtable.push({
        id: existing.id,
        fields: { Status: item.json.properties.Status }
      });
    }
  } else {
    toCreateInAirtable.push({
      fields: {
        Nombre: item.json.properties.Nombre,
        Email: item.json.properties.Email,
        Status: item.json.properties.Status
      }
    });
  }
}

return { json: { toUpdateInAirtable, toCreateInAirtable } };
\`\`\`

### Tips

- **Notion API rate limit**: 3 requests/segundo por integración
- **Airtable rate limit**: 5 requests/segundo por base
- Usa **webhooks de Airtable** para cambios en tiempo real en vez de polling
- Para Notion, usa **Notion Trigger** (disponible en N8N) para detectar cambios
- **Cachea IDs** de páginas/registros para evitar búsquedas repetidas`,
      estimatedMinutes: 18,
      quiz: [
        {
          id: "q-03-04-1",
          question: "¿Qué se debe hacer antes de que una integración de Notion pueda acceder a una base de datos?",
          options: [
            "Configurar un webhook",
            "Compartir la base de datos con la integración",
            "Crear un token de Airtable",
            "Activar la API de Notion"
          ],
          correctIndex: 1,
          explanation: "Es necesario compartir la base de datos con la integración de Notion desde la propia página de Notion, de lo contrario la API no tendrá acceso."
        },
        {
          id: "q-03-04-2",
          question: "¿Cuál es el rate limit de la API de Airtable por base?",
          options: [
            "1 request/segundo",
            "3 requests/segundo",
            "5 requests/segundo",
            "10 requests/segundo"
          ],
          correctIndex: 2,
          explanation: "Airtable tiene un rate limit de 5 requests por segundo por base. Usa SplitInBatches con Wait para respetar este límite."
        },
        {
          id: "q-03-04-3",
          question: "¿Qué fórmula de Airtable filtra registros con Status 'Nuevo' y Score mayor a 50?",
          options: [
            "Status = 'Nuevo' AND Score > 50",
            "AND({Status} = 'Nuevo', {Score} > 50)",
            "WHERE Status='Nuevo' AND Score>50",
            "filter(Status:Nuevo,Score:>50)"
          ],
          correctIndex: 1,
          explanation: "Airtable usa sintaxis de fórmula con AND({Campo} = valor, {Campo} operador valor) para filtrar registros."
        }
      ]
    },
    {
      id: "les-03-05",
      moduleSlug: "integraciones-apis",
      slug: "api-design-patterns",
      title: "Diseño de APIs con N8N",
      description: "Construye endpoints API con webhooks de N8N, formateo de respuestas, validación de entrada y patrones de rate limiting.",
      content: `## Diseño de APIs con N8N

N8N puede funcionar como backend de API usando webhooks. Esto permite crear endpoints REST sin escribir un servidor tradicional.

### Arquitectura: N8N como API

\`\`\`
[Cliente] → [Webhook N8N] → [Lógica de negocio] → [Respond to Webhook]
\`\`\`

### Endpoint básico con respuesta JSON

\`\`\`json
{
  "httpMethod": "GET",
  "path": "api/v1/products",
  "responseMode": "responseNode"
}
\`\`\`

El nodo **Respond to Webhook** formatea la respuesta:

\`\`\`json
{
  "respondWith": "json",
  "responseBody": "={{ JSON.stringify({ success: true, data: $items(), meta: { total: $items().length, timestamp: $now.toISO() } }) }}",
  "options": {
    "responseCode": 200,
    "responseHeaders": {
      "entries": [
        { "name": "Content-Type", "value": "application/json" },
        { "name": "X-Request-Id", "value": "={{ $execution.id }}" }
      ]
    }
  }
}
\`\`\`

### Validación de entrada

\`\`\`javascript
const data = $input.first().json;
const errors = [];

if (!data.email) errors.push('email es requerido');
if (!data.nombre || data.nombre.length < 2) errors.push('nombre debe tener al menos 2 caracteres');
if (data.score && (data.score < 0 || data.score > 100)) errors.push('score debe estar entre 0 y 100');

if (errors.length > 0) {
  return [{
    json: {
      _response: {
        statusCode: 400,
        body: { success: false, errors }
      }
    }
  }];
}

return [{ json: { ...data, _validated: true } }];
\`\`\`

### Patrón: REST API completa

#### GET /api/v1/users/:id

\`\`\`
[Webhook GET] → [Extraer ID del path] → [Buscar en Supabase] → [IF: existe?]
  → (sí) → [Respond 200 con datos]
  → (no) → [Respond 404]
\`\`\`

#### POST /api/v1/users

\`\`\`
[Webhook POST] → [Validar body] → [IF: válido?]
  → (sí) → [Insertar en Supabase] → [Respond 201]
  → (no) → [Respond 400 con errores]
\`\`\`

#### PUT /api/v1/users/:id

\`\`\`
[Webhook PUT] → [Extraer ID] → [Validar body] → [Actualizar Supabase] → [Respond 200]
\`\`\`

### Autenticación de API

#### API Key en header

\`\`\`javascript
const apiKey = $input.first().json.headers['x-api-key'];
const validKeys = ($env.VALID_API_KEYS || '').split(',');

if (!apiKey || !validKeys.includes(apiKey)) {
  return [{
    json: {
      _response: {
        statusCode: 401,
        body: { success: false, error: 'API key inválida' }
      }
    }
  }];
}

return $input.all();
\`\`\`

#### HMAC Signature Verification

\`\`\`javascript
const crypto = require('crypto');
const data = $input.first();
const signature = data.json.headers['x-signature'];
const secret = $env.WEBHOOK_SECRET;

const body = JSON.stringify(data.json.body);
const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(body)
  .digest('hex');

if (signature !== expectedSignature) {
  return [{ json: { _response: { statusCode: 403, body: { error: 'Firma inválida' } } } }];
}

return $input.all();
\`\`\`

### Rate Limiting

Implementa rate limiting con Redis:

\`\`\`javascript
const clientIp = $input.first().json.headers['x-forwarded-for'] || 'unknown';
const key = \`rate_limit:\${clientIp}\`;
const MAX_REQUESTS = 100;
const WINDOW_SECONDS = 60;

const currentCount = await this.helpers.httpRequest({
  method: 'GET',
  url: \`http://redis:6379/\${key}\`
});

if (parseInt(currentCount.body) > MAX_REQUESTS) {
  return [{
    json: {
      _response: {
        statusCode: 429,
        body: { error: 'Rate limit exceeded', retryAfter: WINDOW_SECONDS }
      }
    }
  }];
}

return $input.all();
\`\`\`

### CORS Headers

Para APIs consumidas desde el browser:

\`\`\`json
{
  "respondWith": "json",
  "options": {
    "responseHeaders": {
      "entries": [
        { "name": "Access-Control-Allow-Origin", "value": "*" },
        { "name": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "name": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization, X-API-Key" }
      ]
    }
  }
}
\`\`\`

### Mejores prácticas

- Usa **versionado de API** (\`/api/v1/\`, \`/api/v2/\`)
- Retorna **códigos HTTP correctos** (200, 201, 400, 401, 404, 429, 500)
- Incluye **X-Request-Id** en respuestas para debugging
- Implementa **rate limiting** siempre que la API sea pública
- Documenta tus endpoints con **Sticky Notes** en el workflow
- Usa **Respond to Webhook** siempre en lugar de response mode en el webhook`,
      estimatedMinutes: 22,
      n8nWorkflowJson: {
        name: "REST API - Users",
        nodes: [
          {
            parameters: { httpMethod: "GET", path: "api/v1/users/{id}", responseMode: "responseNode" },
            id: "webhook-get",
            name: "GET User",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 200]
          },
          {
            parameters: { httpMethod: "POST", path: "api/v1/users", responseMode: "responseNode" },
            id: "webhook-post",
            name: "POST User",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 400]
          },
          {
            parameters: {
              respondWith: "json",
              responseBody: "={{ JSON.stringify({ success: true, data: $json }) }}",
              options: {
                responseCode: 200,
                responseHeaders: {
                  entries: [
                    { name: "Content-Type", value: "application/json" },
                    { name: "X-Request-Id", value: "={{ $execution.id }}" }
                  ]
                }
              }
            },
            id: "respond-200",
            name: "Respond 200",
            type: "n8n-nodes-base.respondToWebhook",
            typeVersion: 1,
            position: [900, 200]
          }
        ],
        connections: {
          "GET User": { main: [[{ node: "Respond 200", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-03-05-1",
          question: "¿Qué nodo se usa para enviar una respuesta personalizada al cliente en un webhook?",
          options: [
            "HTTP Response",
            "Respond to Webhook",
            "Send Response",
            "Webhook Response"
          ],
          correctIndex: 1,
          explanation: "El nodo 'Respond to Webhook' permite enviar respuestas personalizadas con status code, headers y body al cliente que llamó el webhook."
        },
        {
          id: "q-03-05-2",
          question: "¿Qué código HTTP se debe retornar cuando un recurso se crea exitosamente?",
          options: ["200 OK", "201 Created", "204 No Content", "301 Moved"],
          correctIndex: 1,
          explanation: "201 Created es el código HTTP correcto cuando un recurso se crea exitosamente mediante POST."
        },
        {
          id: "q-03-05-3",
          question: "¿Qué header se usa comúnmente para verificar la autenticidad de un webhook?",
          options: [
            "X-API-Key",
            "X-Signature (HMAC)",
            "Content-Type",
            "X-Request-Id"
          ],
          correctIndex: 1,
          explanation: "X-Signature con HMAC permite verificar que el webhook fue enviado por el servicio legítimo y que el body no fue modificado en tránsito."
        }
      ]
    }
  ]
};
