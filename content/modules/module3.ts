import { Module } from "../../types/course";

export const module3: Module = {
  id: "mod-03",
  slug: "integraciones-apis",
  title: "Integraciones, APIs y Autenticación",
  description: "Conecta N8N con servicios externos usando REST APIs, OAuth2, y autenticación avanzada.",
  icon: "Plug",
  sortOrder: 3,
  lessons: [
    {
      id: "les-03-01",
      moduleSlug: "integraciones-apis",
      slug: "http-request-node",
      title: "HTTP Request Node: Consumo de APIs REST",
      description: "Domina el HTTP Request node para consumir cualquier API REST con diferentes métodos y autenticación.",
      estimatedMinutes: 25,
      content: `## HTTP Request Node

El HTTP Request node es fundamental para integrarar N8N con servicios externos vía APIs REST.

### Métodos HTTP Soportados

- **GET**: Obtener datos
- **POST**: Crear recursos
- **PUT**: Actualizar recursos completos
- **PATCH**: Actualizar recursos parciales
- **DELETE**: Eliminar recursos
- **HEAD**: Obtener headers
- **OPTIONS**: Obtener métodos permitidos

### Configuración Básica

#### GET Request Simple

\`\`\`json
{
  "method": "GET",
  "url": "https://api.example.com/users",
  "authentication": "none",
  "sendHeaders": false,
  "sendQuery": false,
  "options": {}
}
\`\`\`

#### POST Request con JSON Body

\`\`\`json
{
  "method": "POST",
  "url": "https://api.example.com/users",
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ name: $json.nombre, email: $json.email }) }}",
  "options": {
    "response": {
      "response": {
        "responseFormat": "json"
      }
    }
  }
}
\`\`\`

### Autenticación

#### 1. API Key en Header

\`\`\`json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "X-API-Key",
        "value": "={{ $credentials.apiKey }}"
      }
    ]
  }
}
\`\`\`

#### 2. API Key en Query

\`\`\`json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpQueryAuth",
  "sendQuery": true,
  "queryParameters": {
    "parameters": [
      {
        "name": "api_key",
        "value": "={{ $credentials.apiKey }}"
      }
    ]
  }
}
\`\`\`

#### 3. Basic Auth

\`\`\`json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpBasicAuth"
}
\`\`\`

#### 4. Bearer Token

\`\`\`json
{
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "=Bearer {{ $credentials.token }}"
      }
    ]
  }
}
\`\`\`

#### 5. OAuth2

\`\`\`json
{
  "authentication": "predefinedCredentialType",
  "nodeCredentialType": "googleOAuth2Api"
}
\`\`\`

### Headers Personalizados

\`\`\`json
{
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Content-Type",
        "value": "application/json"
      },
      {
        "name": "Accept",
        "value": "application/json"
      },
      {
        "name": "X-Custom-Header",
        "value": "={{ $json.customValue }}"
      }
    ]
  }
}
\`\`\`

### Query Parameters

\`\`\`json
{
  "sendQuery": true,
  "queryParameters": {
    "parameters": [
      {
        "name": "page",
        "value": "={{ $json.page || 1 }}"
      },
      {
        "name": "limit",
        "value": "={{ $json.limit || 50 }}"
      },
      {
        "name": "filter",
        "value": "={{ $json.filter }}"
      }
    ]
  }
}
\`\`\`

### Manejo de Respuestas

#### Respuesta JSON

\`\`\`json
{
  "options": {
    "response": {
      "response": {
        "responseFormat": "json"
      }
    }
  }
}
\`\`\`

#### Respuesta de Texto

\`\`\`json
{
  "options": {
    "response": {
      "response": {
        "responseFormat": "text"
      }
    }
  }
}
\`\`\`

#### Respuesta Binaria (Descarga de Archivo)

\`\`\`json
{
  "options": {
    "response": {
      "response": {
        "responseFormat": "file",
        "outputPropertyName": "data",
        "fileName": "={{ $json.fileName }}"
      }
    }
  }
}
\`\`\`

### Paginación Automática

#### Offset-Based Pagination

\`\`\`json
{
  "options": {
    "pagination": {
      "pagination": {
        "mode": "offset",
        "pageSize": 100,
        "type": "body",
        "propertyName": "offset"
      }
    }
  }
}
\`\`\`

#### Cursor-Based Pagination

\`\`\`json
{
  "options": {
    "pagination": {
      "pagination": {
        "mode": "cursor",
        "type": "body",
        "propertyName": "cursor",
        "cursorValue": "={{ $response.body.nextCursor }}"
      }
    }
  }
}
\`\`\`

### Ejemplos Prácticos

#### Ejemplo 1: Consumir API de GitHub

\`\`\`json
{
  "method": "GET",
  "url": "https://api.github.com/repos/n8n-io/n8n/issues",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Accept",
        "value": "application/vnd.github.v3+json"
      }
    ]
  },
  "sendQuery": true,
  "queryParameters": {
    "parameters": [
      {
        "name": "state",
        "value": "open"
      },
      {
        "name": "per_page",
        "value": "100"
      }
    ]
  }
}
\`\`\`

#### Ejemplo 2: Crear Registro en Airtable

\`\`\`json
{
  "method": "POST",
  "url": "https://api.airtable.com/v0/appXXXXXXXXXXXXXX/Contacts",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  },
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ fields: { Name: $json.nombre, Email: $json.email, Phone: $json.telefono } }) }}"
}
\`\`\`

#### Ejemplo 3: Upload de Archivo a S3

\`\`\`json
{
  "method": "PUT",
  "url": "={{ $json.presignedUrl }}",
  "sendBody": true,
  "contentType": "multipart-form-data",
  "bodyParameters": {
    "parameters": [
      {
        "parameterType": "formData",
        "name": "file",
        "value": "={{ $binary.data }}"
      }
    ]
  }
}
\`\`\`

### Manejo de Errores

#### Retry Automático

\`\`\`json
{
  "options": {
    "timeout": 10000,
    "response": {
      "response": {
        "neverError": false
      }
    }
  }
}
\`\`\`

#### Patrón: Retry con Code Node

\`\`\`javascript
const items = $input.all();
const results = [];
const maxRetries = 3;

for (const item of items) {
  let success = false;
  let attempt = 0;
  let lastError = null;

  while (!success && attempt < maxRetries) {
    try {
      const response = await this.helpers.httpRequest({
        method: 'POST',
        url: 'https://api.example.com/data',
        headers: {
          'Authorization': \`Bearer \${$credentials.token}\`,
          'Content-Type': 'application/json'
        },
        body: item.json
      });

      results.push({
        json: {
          ...item.json,
          response: response.data,
          success: true,
          attempt: attempt + 1
        }
      });
      success = true;
    } catch (error) {
      attempt++;
      lastError = error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  if (!success) {
    results.push({
      json: {
        ...item.json,
        error: lastError.message,
        success: false,
        attempts: attempt
      }
    });
  }
}

return results;
\`\`\`

### Rate Limiting

#### Implementar Rate Limiting

\`\`\`javascript
const items = $input.all();
const results = [];
const requestsPerSecond = 10;
const delay = 1000 / requestsPerSecond;

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
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        error: error.message
      }
    });
  }

  // Rate limiting
  if (i < items.length - 1) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

return results;
\`\`\`

### Webhooks y Callbacks

#### Crear Webhook Endpoint

\`\`\`json
{
  "httpMethod": "POST",
  "path": "webhook-callback",
  "responseMode": "responseNode",
  "options": {
    "rawBody": true
  }
}
\`\`\`

#### Enviar Webhook con Datos

\`\`\`json
{
  "method": "POST",
  "url": "https://tu-n8n.com/webhook/webhook-callback",
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ status: 'completed', data: $json, timestamp: $now.toISO() }) }}"
}
\`\`\`

### Mejores Prácticas

1. **Usa credenciales**: Nunca hardcodees API keys en el workflow
2. **Valida respuestas**: Verifica que la respuesta sea válida antes de procesarla
3. **Maneja errores**: Implementa retry logic para APIs inestables
4. **Rate limiting**: Respeta los límites de las APIs
5. **Timeouts**: Configura timeouts apropiados
6. **Logs**: Registra requests y responses para debugging
7. **Versionado**: Usa versiones específicas de APIs cuando sea posible

### Debugging

#### Inspeccionar Request y Response

\`\`\`javascript
// Después del HTTP Request node
const response = $input.first().json;

console.log('=== HTTP REQUEST DEBUG ===');
console.log('Status:', $response.statusCode);
console.log('Headers:', $response.headers);
console.log('Body:', JSON.stringify(response, null, 2));
console.log('Timing:', $response.timing);

return $input.all();
\`\`\`

### Recursos Adicionales

- [HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [REST API Best Practices](https://restfulapi.net/)
- [OAuth2 Flow](https://oauth.net/2/)
`,
    },
    {
      id: "les-03-02",
      moduleSlug: "integraciones-apis",
      slug: "integracion-supabase",
      title: "Integración con Supabase",
      description: "Conecta N8N con Supabase para operaciones CRUD, autenticación y tiempo real.",
      estimatedMinutes: 30,
      content: `## Integración con Supabase

Supabase es una plataforma open-source alternativa a Firebase que proporciona base de datos PostgreSQL, autenticación y APIs en tiempo real.

### Configuración de Credenciales

#### Crear Credenciales en N8N

1. Ve a **Credentials** en N8N
2. Click en **New**
3. Selecciona **Supabase API**
4. Configura:
   - **Host**: \`https://tu-proyecto.supabase.co\`
   - **Service Role Key**: Tu service role key (desde Supabase Dashboard)

### Operaciones CRUD

#### SELECT: Leer Datos

\`\`\`json
{
  "operation": "getAll",
  "tableId": "users",
  "returnAll": false,
  "limit": 100,
  "filters": {
    "filters": [
      {
        "key": "status",
        "value": "active"
      }
    ]
  }
}
\`\`\`

**Con filtros avanzados:**

\`\`\`json
{
  "operation": "getAll",
  "tableId": "orders",
  "returnAll": false,
  "limit": 50,
  "filters": {
    "filters": [
      {
        "key": "created_at",
        "value": "={{ $now.minus({ days: 7 }).toISO() }}",
        "condition": "gte"
      },
      {
        "key": "amount",
        "value": "100",
        "condition": "gt"
      }
    ]
  }
}
\`\`\`

#### INSERT: Crear Registros

\`\`\`json
{
  "operation": "insert",
  "tableId": "contacts",
  "fields": {
    "values": [
      {
        "name": "name",
        "value": "={{ $json.nombre }}"
      },
      {
        "name": "email",
        "value": "={{ $json.email }}"
      },
      {
        "name": "phone",
        "value": "={{ $json.telefono }}"
      }
    ]
  }
}
\`\`\`

**Insert múltiple:**

\`\`\`javascript
// Code node para preparar datos
const items = $input.all();

return items.map(item => ({
  json: {
    name: item.json.nombre,
    email: item.json.email,
    phone: item.json.telefono,
    created_at: new Date().toISOString()
  }
}));
\`\`\`

#### UPDATE: Actualizar Registros

\`\`\`json
{
  "operation": "update",
  "tableId": "users",
  "updateKey": "id",
  "fields": {
    "values": [
      {
        "name": "status",
        "value": "={{ $json.nuevoStatus }}"
      },
      {
        "name": "updated_at",
        "value": "={{ $now.toISO() }}"
      }
    ]
  }
}
\`\`\`

#### DELETE: Eliminar Registros

\`\`\`json
{
  "operation": "delete",
  "tableId": "temp_data",
  "deleteKey": "id"
}
\`\`\`

### Queries Avanzadas

#### Usar Supabase Client Directamente

\`\`\`javascript
const items = $input.all();
const supabaseUrl = $credentials.host;
const supabaseKey = $credentials.serviceRoleKey;

async function supabaseQuery(endpoint, options = {}) {
  const response = await this.helpers.httpRequest({
    method: options.method || 'GET',
    url: \`\${supabaseUrl}/rest/v1/\${endpoint}\`,
    headers: {
      'apikey': supabaseKey,
      'Authorization': \`Bearer \${supabaseKey}\`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=representation'
    },
    body: options.body,
    qs: options.qs
  });
  return response;
}

const results = [];

for (const item of items) {
  try {
    // Query con filtros complejos
    const response = await supabaseQuery('orders', {
      qs: {
        select: '*,customer:customers(name,email)',
        user_id: \`eq.\${item.json.userId}\`,
        status: 'eq.completed',
        order: 'created_at.desc',
        limit: '10'
      }
    });

    results.push({
      json: {
        ...item.json,
        orders: response.data
      }
    });
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

#### Joins y Relaciones

\`\`\`javascript
// Obtener órdenes con datos de clientes y productos
const response = await supabaseQuery('orders', {
  qs: {
    select: \`
      *,
      customer:customers(id,name,email),
      order_items(
        quantity,
        price,
        product:products(name,sku,category)
      )
    \`,
    created_at: \`gte.\${$now.minus({ days: 30 }).toISO()}\`,
    order: 'created_at.desc'
  }
});

return response.data.map(order => ({
  json: {
    orderId: order.id,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    totalAmount: order.order_items.reduce(
      (sum, item) => sum + (item.quantity * item.price), 0
    ),
    items: order.order_items.map(item => ({
      product: item.product.name,
      quantity: item.quantity,
      price: item.price
    }))
  }
}));
\`\`\`

### Autenticación de Usuarios

#### Crear Usuario

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  try {
    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: \`\${$credentials.host}/auth/v1/admin/users\`,
      headers: {
        'apikey': $credentials.serviceRoleKey,
        'Authorization': \`Bearer \${$credentials.serviceRoleKey}\`,
        'Content-Type': 'application/json'
      },
      body: {
        email: item.json.email,
        password: item.json.password,
        email_confirm: true,
        user_metadata: {
          full_name: item.json.nombre,
          phone: item.json.telefono
        }
      }
    });

    results.push({
      json: {
        ...item.json,
        userId: response.data.id,
        created: true
      }
    });
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        error: error.message,
        created: false
      }
    });
  }
}

return results;
\`\`\`

#### Login de Usuario

\`\`\`javascript
const { email, password } = $input.first().json;

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: \`\${$credentials.host}/auth/v1/token?grant_type=password\`,
  headers: {
    'apikey': $credentials.serviceRoleKey,
    'Content-Type': 'application/json'
  },
  body: { email, password }
});

return [{
  json: {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    user: response.data.user
  }
}];
\`\`\`

### Tiempo Real con Webhooks

#### Configurar Webhook en Supabase

En Supabase Dashboard:
1. Ve a **Database** → **Webhooks**
2. Click en **Create a new webhook**
3. Configura:
   - **Name**: \`order_created\`
   - **Table**: \`orders\`
   - **Events**: \`INSERT\`
   - **URL**: \`https://tu-n8n.com/webhook/supabase-orders\`

#### Procesar Webhook de Supabase

\`\`\`javascript
// Webhook node recibe datos de Supabase
const webhookData = $input.first().json;

// Estructura del webhook de Supabase
const {
  type,        // "INSERT", "UPDATE", "DELETE"
  table,       // Nombre de la tabla
  record,      // Nuevo registro
  old_record,  // Registro anterior (para UPDATE)
  schema       // Schema (usualmente "public")
} = webhookData;

return [{
  json: {
    eventType: type,
    table,
    data: record,
    previousData: old_record,
    timestamp: new Date().toISOString()
  }
}];
\`\`\`

### Row Level Security (RLS)

#### Crear Políticas RLS

\`\`\`sql
-- Habilitar RLS en la tabla
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo ven sus propias órdenes
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuarios solo pueden crear sus propias órdenes
CREATE POLICY "Users can create own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Admins pueden ver todas las órdenes
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);
\`\`\`

### Funciones RPC

#### Crear Función en Supabase

\`\`\`sql
CREATE OR REPLACE FUNCTION get_user_orders(user_uuid uuid)
RETURNS TABLE (
  order_id uuid,
  total_amount numeric,
  status text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT id, total, status, created_at
  FROM orders
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

#### Llamar Función RPC desde N8N

\`\`\`javascript
const userId = $input.first().json.userId;

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: \`\${$credentials.host}/rest/v1/rpc/get_user_orders\`,
  headers: {
    'apikey': $credentials.serviceRoleKey,
    'Authorization': \`Bearer \${$credentials.serviceRoleKey}\`,
    'Content-Type': 'application/json'
  },
  body: { user_uuid: userId }
});

return response.data.map(order => ({
  json: {
    orderId: order.order_id,
    total: order.total_amount,
    status: order.status,
    createdAt: order.created_at
  }
}));
\`\`\`

### Storage: Manejo de Archivos

#### Upload de Archivo

\`\`\`javascript
const item = $input.first();
const binaryData = item.binary.data;
const bucket = 'user-uploads';
const fileName = \`uploads/\${Date.now()}_\${binaryData.fileName}\`;

// Convertir base64 a buffer
const buffer = Buffer.from(binaryData.data, 'base64');

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: \`\${$credentials.host}/storage/v1/object/\${bucket}/\${fileName}\`,
  headers: {
    'apikey': $credentials.serviceRoleKey,
    'Authorization': \`Bearer \${$credentials.serviceRoleKey}\`,
    'Content-Type': binaryData.mimeType
  },
  body: buffer,
  json: false
});

return [{
  json: {
    fileName,
    publicUrl: \`\${$credentials.host}/storage/v1/object/public/\${bucket}/\${fileName}\`,
    uploaded: true
  }
}];
\`\`\`

#### Descargar Archivo

\`\`\`javascript
const filePath = $input.first().json.filePath;
const bucket = 'user-uploads';

const response = await this.helpers.httpRequest({
  method: 'GET',
  url: \`\${$credentials.host}/storage/v1/object/\${bucket}/\${filePath}\`,
  headers: {
    'apikey': $credentials.serviceRoleKey,
    'Authorization': \`Bearer \${$credentials.serviceRoleKey}\`
  },
  encoding: null
});

const base64Data = Buffer.from(response).toString('base64');

return [{
  json: { fileName: filePath.split('/').pop() },
  binary: {
    data: {
      data: base64Data,
      mimeType: 'application/octet-stream',
      fileName: filePath.split('/').pop()
    }
  }
}];
\`\`\`

### Patrones Comunes

#### Patrón: Sync Bidireccional

\`\`\`
[Webhook: Supabase Change] → [Process Change] → [Update External System]
                                                        ↓
[Webhook: External Change] → [Process Change] → [Update Supabase]
\`\`\`

#### Patrón: Data Pipeline

\`\`\`
[Schedule: Cada hora]
    ↓
[Supabase: Get New Records]
    ↓
[Transform Data]
    ↓
[Supabase: Update Processed]
    ↓
[Send to External API]
\`\`\`

### Mejores Prácticas

1. **Usa Service Role Key con cuidado**: Solo en server-side, nunca en client-side
2. **Implementa RLS**: Siempre habilita Row Level Security
3. **Usa índices**: Crea índices para queries frecuentes
4. **Batch operations**: Usa bulk insert/update para mejor performance
5. **Maneja errores**: Implementa retry logic para operaciones críticas
6. **Monitorea**: Usa logs para trackear operaciones importantes
7. **Backup**: Configura backups automáticos de tu base de datos

### Debugging

#### Verificar Conexión

\`\`\`javascript
// Test de conexión a Supabase
try {
  const response = await this.helpers.httpRequest({
    method: 'GET',
    url: \`\${$credentials.host}/rest/v1/\`,
    headers: {
      'apikey': $credentials.serviceRoleKey,
      'Authorization': \`Bearer \${$credentials.serviceRoleKey}\`
    }
  });
  
  console.log('Supabase connection successful');
  console.log('Available tables:', response.data.definitions);
} catch (error) {
  console.error('Connection failed:', error.message);
}
\`\`\`

### Recursos Adicionales

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase API Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
`,
    },
    {
      id: "les-03-03",
      moduleSlug: "integraciones-apis",
      slug: "google-workspace",
      title: "Google Workspace: Gmail, Sheets y Drive",
      description: "Integra N8N con Google Workspace para automatizar emails, hojas de cálculo y archivos.",
      estimatedMinutes: 30,
      content: `## Google Workspace Integration

Google Workspace (antes G Suite) ofrece Gmail, Google Sheets, Drive y más. N8N puede integrarse con todos estos servicios.

### Configuración de OAuth2

#### Crear Credenciales OAuth2

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las APIs necesarias:
   - Gmail API
   - Google Sheets API
   - Google Drive API
4. Ve a **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configura:
   - **Application type**: Web application
   - **Authorized redirect URIs**: \`https://tu-n8n.com/rest/oauth2-credential/callback\`
6. Copia **Client ID** y **Client Secret**
7. En N8N, crea credenciales **Google OAuth2 API**

### Gmail

#### Enviar Email Simple

\`\`\`json
{
  "resource": "message",
  "operation": "send",
  "sendTo": "={{ $json.email }}",
  "subject": "Bienvenido a nuestro servicio",
  "emailType": "text",
  "message": "Hola {{ $json.nombre }},\\n\\nGracias por registrarte.\\n\\nSaludos!"
}
\`\`\`

#### Enviar Email HTML

\`\`\`json
{
  "resource": "message",
  "operation": "send",
  "sendTo": "={{ $json.email }}",
  "subject": "Tu reporte mensual",
  "emailType": "html",
  "message": "={{ $json.htmlContent }}"
}
\`\`\`

**Ejemplo de HTML dinámico:**

\`\`\`javascript
// Code node para generar HTML
const items = $input.all();

return items.map(item => {
  const html = \`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #4285f4; color: white; padding: 20px; }
        .content { padding: 20px; }
        .footer { background: #f5f5f5; padding: 10px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Reporte Mensual</h1>
      </div>
      <div class="content">
        <p>Hola \${item.json.nombre},</p>
        <p>Aquí está tu reporte del mes:</p>
        <ul>
          <li>Ventas: $\${item.json.ventas}</li>
          <li>Clientes nuevos: \${item.json.clientesNuevos}</li>
          <li>Satisfacción: \${item.json.satisfaccion}%</li>
        </ul>
      </div>
      <div class="footer">
        <p>Generado automáticamente por N8N</p>
      </div>
    </body>
    </html>
  \`;

  return {
    json: {
      ...item.json,
      htmlContent: html
    }
  };
});
\`\`\`

#### Enviar Email con Adjuntos

\`\`\`json
{
  "resource": "message",
  "operation": "send",
  "sendTo": "={{ $json.email }}",
  "subject": "Documento adjunto",
  "emailType": "text",
  "message": "Adjunto encontrarás el documento solicitado.",
  "options": {
    "attachments": "data"
  }
}
\`\`\`

#### Leer Emails

\`\`\`json
{
  "resource": "message",
  "operation": "getAll",
  "returnAll": false,
  "limit": 50,
  "filters": {
    "labelIds": ["INBOX"],
    "q": "is:unread",
    "includeSpamTrash": false
  }
}
\`\`\`

#### Buscar Emails Específicos

\`\`\`json
{
  "resource": "message",
  "operation": "getAll",
  "returnAll": false,
  "limit": 10,
  "filters": {
    "q": "from:cliente@example.com subject:pedido newer_than:7d"
  }
}
\`\`\`

**Operadores de búsqueda Gmail:**
- \`from:email@ejemplo.com\`: De un remitente específico
- \`subject:palabra\`: En el asunto
- \`newer_than:7d\`: Más reciente que 7 días
- \`older_than:1m\`: Más antiguo que 1 mes
- \`has:attachment\`: Con adjuntos
- \`is:unread\`: No leídos
- \`label:importante\`: Con etiqueta específica

### Google Sheets

#### Leer Datos de Sheet

\`\`\`json
{
  "operation": "getData",
  "documentId": "={{ $json.sheetId }}",
  "sheetName": "Hoja 1",
  "range": "A1:Z1000",
  "options": {
    "valueInputMode": "USER_ENTERED"
  }
}
\`\`\`

#### Escribir Datos en Sheet

\`\`\`json
{
  "operation": "append",
  "documentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheetName": "Datos",
  "dataMode": "autoMap",
  "options": {
    "valueInputMode": "USER_ENTERED"
  }
}
\`\`\`

#### Actualizar Celdas Específicas

\`\`\`json
{
  "operation": "update",
  "documentId": "={{ $json.sheetId }}",
  "sheetName": "Hoja 1",
  "range": "A2:B2",
  "dataMode": "defineBelow",
  "fieldsValues": {
    "values": [
      {
        "lookupValue": "={{ $json.nombre }}",
        "lookupColumn": "Nombre",
        "newColumn": "Status",
        "newValue": "Procesado"
      }
    ]
  }
}
\`\`\`

#### Crear Nuevo Sheet

\`\`\`javascript
const sheetName = \`Reporte_\${$now.toFormat('yyyy-MM-dd')}\`;

// Crear nuevo spreadsheet
const createResponse = await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://sheets.googleapis.com/v4/spreadsheets',
  headers: {
    'Authorization': \`Bearer \${$credentials.accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    properties: {
      title: sheetName
    },
    sheets: [
      {
        properties: {
          title: 'Datos',
          gridProperties: {
            rowCount: 1000,
            columnCount: 26
          }
        }
      }
    ]
  }
});

return [{
  json: {
    sheetId: createResponse.data.spreadsheetId,
    sheetUrl: createResponse.data.spreadsheetUrl,
    sheetName
  }
}];
\`\`\`

### Google Drive

#### Listar Archivos

\`\`\`json
{
  "resource": "file",
  "operation": "getAll",
  "returnAll": false,
  "limit": 100,
  "filters": {
    "query": "mimeType='application/pdf' and 'root' in parents"
  }
}
\`\`\`

#### Upload de Archivo

\`\`\`json
{
  "resource": "file",
  "operation": "upload",
  "name": "={{ $json.fileName }}",
  "inputDataFieldName": "data",
  "options": {
    "parents": ["folder-id-here"]
  }
}
\`\`\`

#### Descargar Archivo

\`\`\`json
{
  "resource": "file",
  "operation": "download",
  "fileId": "={{ $json.fileId }}"
}
\`\`\`

#### Compartir Archivo

\`\`\`json
{
  "resource": "file",
  "operation": "share",
  "fileId": "={{ $json.fileId }}",
  "permissions": {
    "permissions": [
      {
        "role": "reader",
        "type": "user",
        "emailAddress": "usuario@example.com"
      }
    ]
  }
}
\`\`\`

### Patrones de Automatización

#### Patrón 1: Email Processing Pipeline

\`\`\`
[Schedule: Cada 5 min]
    ↓
[Gmail: Get Unread Emails]
    ↓
[IF: Tiene adjunto?]
    ├─ Yes → [Drive: Download Attachment]
    │           ↓
    │         [Process Attachment]
    │           ↓
    │         [Sheets: Log Data]
    │           ↓
    └─→ [Gmail: Mark as Read]
\`\`\`

#### Patrón 2: Report Generator

\`\`\`
[Schedule: Lunes 9 AM]
    ↓
[Supabase: Get Weekly Data]
    ↓
[Code: Generate HTML Report]
    ↓
[Sheets: Create Report Sheet]
    ↓
[Drive: Upload PDF]
    ↓
[Gmail: Send Report Email]
\`\`\`

#### Patrón 3: Form to Sheet Automation

\`\`\`
[Webhook: Form Submission]
    ↓
[Validate Data]
    ↓
[Sheets: Append Row]
    ↓
[Drive: Create Folder]
    ↓
[Gmail: Send Confirmation]
\`\`\`

### Ejemplos Avanzados

#### Procesar Emails con Attachments

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const email = item.json;
  
  // Verificar si tiene attachments
  if (email.attachments && email.attachments.length > 0) {
    for (const attachment of email.attachments) {
      // Descargar attachment
      const fileData = await this.helpers.httpRequest({
        method: 'GET',
        url: \`https://www.googleapis.com/gmail/v1/users/me/messages/\${email.id}/attachments/\${attachment.attachmentId}\`,
        headers: {
          'Authorization': \`Bearer \${$credentials.accessToken}\`
        }
      });

      // Upload a Drive
      const driveResponse = await this.helpers.httpRequest({
        method: 'POST',
        url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        headers: {
          'Authorization': \`Bearer \${$credentials.accessToken}\`,
          'Content-Type': 'multipart/related'
        },
        body: {
          metadata: {
            name: attachment.filename,
            parents: ['folder-id']
          },
          media: {
            mimeType: attachment.mimeType,
            body: Buffer.from(fileData.data.data, 'base64')
          }
        }
      });

      results.push({
        json: {
          emailId: email.id,
          from: email.from,
          subject: email.subject,
          attachmentName: attachment.filename,
          driveFileId: driveResponse.data.id,
          driveFileUrl: driveResponse.data.webViewLink
        }
      });
    }
  }
}

return results;
\`\`\`

#### Generar Reporte Dinámico en Sheets

\`\`\`javascript
const items = $input.all();

// Preparar datos para Sheets
const headers = ['Fecha', 'Cliente', 'Producto', 'Cantidad', 'Total'];
const rows = items.map(item => [
  item.json.fecha,
  item.json.cliente,
  item.json.producto,
  item.json.cantidad,
  \`$\${item.json.total}\`
]);

// Calcular totales
const totalGeneral = items.reduce((sum, item) => sum + item.json.total, 0);
rows.push(['', '', '', 'TOTAL:', \`$\${totalGeneral}\`]);

// Combinar headers y datos
const allData = [headers, ...rows];

return [{
  json: {
    data: allData,
    rowCount: allData.length,
    columnCount: headers.length
  }
}];
\`\`\`

### Mejores Prácticas

1. **Rate limiting**: Respeta los límites de la API de Google
2. **Batch operations**: Usa batch requests cuando sea posible
3. **Error handling**: Maneja errores de autenticación y permisos
4. **Scopes mínimos**: Solicita solo los permisos necesarios
5. **Token refresh**: Implementa refresh automático de tokens
6. **Logs**: Registra operaciones importantes para auditoría
7. **Backup**: Mantén backups de datos críticos en Sheets

### Debugging

#### Verificar Permisos

\`\`\`javascript
// Verificar scopes disponibles
const scopes = $credentials.scope;
console.log('Available scopes:', scopes);

// Test de conexión
try {
  const profile = await this.helpers.httpRequest({
    method: 'GET',
    url: 'https://www.googleapis.com/oauth2/v1/userinfo',
    headers: {
      'Authorization': \`Bearer \${$credentials.accessToken}\`
    }
  });
  console.log('User profile:', profile.data);
} catch (error) {
  console.error('Auth error:', error.message);
}
\`\`\`

### Recursos Adicionales

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Drive API](https://developers.google.com/drive/api)
- [OAuth2 Playground](https://developers.google.com/oauthplayground/)
`,
    },
    {
      id: "les-03-04",
      moduleSlug: "integraciones-apis",
      slug: "notion-airtable",
      title: "Notion y Airtable como CMS",
      description: "Usa Notion y Airtable como sistemas de gestión de contenido para tus workflows.",
      estimatedMinutes: 25,
      content: `## Notion y Airtable como CMS

Notion y Airtable son herramientas poderosas que pueden funcionar como CMS (Content Management System) para tus automatizaciones.

### Notion Integration

#### Configuración

1. Ve a [Notion Integrations](https://www.notion.so/my-integrations)
2. Click en **New integration**
3. Configura:
   - **Name**: N8N Integration
   - **Associated workspace**: Tu workspace
4. Copia el **Internal Integration Token**
5. En Notion, comparte la base de datos con la integración
6. En N8N, crea credenciales **Notion API**

#### Leer Base de Datos

\`\`\`json
{
  "operation": "getAll",
  "databaseId": "={{ $json.databaseId }}",
  "returnAll": false,
  "limit": 100,
  "filters": {
    "filter": {
      "property": "Status",
      "select": {
        "equals": "Published"
      }
    }
  }
}
\`\`\`

#### Crear Página

\`\`\`json
{
  "operation": "create",
  "databaseId": "={{ $json.databaseId }}",
  "properties": {
    "properties": [
      {
        "key": "Name",
        "type": "title",
        "title": "={{ $json.titulo }}"
      },
      {
        "key": "Status",
        "type": "select",
        "select": "Draft"
      },
      {
        "key": "Author",
        "type": "rich_text",
        "rich_text": "={{ $json.autor }}"
      }
    ]
  }
}
\`\`\`

#### Actualizar Página

\`\`\`json
{
  "operation": "update",
  "pageId": "={{ $json.pageId }}",
  "properties": {
    "properties": [
      {
        "key": "Status",
        "type": "select",
        "select": "Published"
      },
      {
        "key": "Published Date",
        "type": "date",
        "date": "={{ $now.toISO() }}"
      }
    ]
  }
}
\`\`\`

#### Agregar Contenido a Página

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const pageId = item.json.pageId;
  const content = item.json.contenido;

  // Crear bloques de contenido
  const blocks = [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: item.json.subtitulo } }]
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content } }]
      }
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: 'Punto 1' } }]
      }
    },
    {
      object: 'block',
      type: 'code',
      code: {
        rich_text: [{ type: 'text', text: { content: item.json.codigo } }],
        language: 'javascript'
      }
    }
  ];

  const response = await this.helpers.httpRequest({
    method: 'PATCH',
    url: \`https://api.notion.com/v1/blocks/\${pageId}/children\`,
    headers: {
      'Authorization': \`Bearer \${$credentials.accessToken}\`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: { children: blocks }
  });

  results.push({
    json: {
      pageId,
      blocksAdded: blocks.length,
      success: true
    }
  });
}

return results;
\`\`\`

### Airtable Integration

#### Configuración

1. Ve a [Airtable API](https://airtable.com/api)
2. Selecciona tu base
3. Genera un **API Key**
4. En N8N, crea credenciales **Airtable API**

#### Leer Registros

\`\`\`json
{
  "operation": "list",
  "application": "appXXXXXXXXXXXXXX",
  "table": "Contacts",
  "returnAll": false,
  "limit": 100,
  "options": {
    "filterByFormula": "{Status} = 'Active'",
    "sort": [
      {
        "field": "Created",
        "direction": "desc"
      }
    ]
  }
}
\`\`\`

#### Crear Registro

\`\`\`json
{
  "operation": "create",
  "application": "appXXXXXXXXXXXXXX",
  "table": "Contacts",
  "fields": {
    "values": [
      {
        "name": "Name",
        "value": "={{ $json.nombre }}"
      },
      {
        "name": "Email",
        "value": "={{ $json.email }}"
      },
      {
        "name": "Phone",
        "value": "={{ $json.telefono }}"
      },
      {
        "name": "Status",
        "value": "New"
      }
    ]
  }
}
\`\`\`

#### Actualizar Registro

\`\`\`json
{
  "operation": "update",
  "application": "appXXXXXXXXXXXXXX",
  "table": "Contacts",
  "id": "={{ $json.recordId }}",
  "fields": {
    "values": [
      {
        "name": "Status",
        "value": "Processed"
      },
      {
        "name": "Last Contact",
        "value": "={{ $now.toISO() }}"
      }
    ]
  }
}
\`\`\`

#### Bulk Operations

\`\`\`javascript
const items = $input.all();

// Preparar para bulk create
const records = items.map(item => ({
  fields: {
    Name: item.json.nombre,
    Email: item.json.email,
    Phone: item.json.telefono,
    Status: 'New',
    Source: 'N8N Automation'
  }
}));

// Airtable permite máximo 10 registros por request
const batchSize = 10;
const results = [];

for (let i = 0; i < records.length; i += batchSize) {
  const batch = records.slice(i, i + batchSize);
  
  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: \`https://api.airtable.com/v0/appXXXXXXXXXXXXXX/Contacts\`,
    headers: {
      'Authorization': \`Bearer \${$credentials.apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: { records: batch }
  });

  results.push(...response.data.records);
  
  // Rate limiting: Airtable permite 5 requests por segundo
  if (i + batchSize < records.length) {
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

return results.map(record => ({
  json: {
    recordId: record.id,
    created: true,
    fields: record.fields
  }
}));
\`\`\`

### Patrones de CMS

#### Patrón 1: Content Publishing Pipeline

\`\`\`
[Webhook: New Content]
    ↓
[Validate Content]
    ↓
[Notion: Create Draft Page]
    ↓
[AI: Generate Summary]
    ↓
[Notion: Update with Summary]
    ↓
[Notify Reviewers]
    ↓
[Webhook: Content Approved]
    ↓
[Notion: Publish Page]
    ↓
[Post to Social Media]
\`\`\`

#### Patrón 2: CRM con Airtable

\`\`\`
[Webhook: New Lead]
    ↓
[Airtable: Create Contact]
    ↓
[Enrich Data from API]
    ↓
[Airtable: Update Contact]
    ↓
[Send Welcome Email]
    ↓
[Schedule Follow-up]
\`\`\`

#### Patrón 3: Knowledge Base Sync

\`\`\`
[Schedule: Diario]
    ↓
[Notion: Get Updated Pages]
    ↓
[Transform to Searchable Format]
    ↓
[Upload to Search Index]
    ↓
[Airtable: Log Sync Status]
\`\`\`

### Ejemplos Avanzados

#### Content Approval Workflow

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const pageId = item.json.pageId;
  
  // Obtener página de Notion
  const page = await this.helpers.httpRequest({
    method: 'GET',
    url: \`https://api.notion.com/v1/pages/\${pageId}\`,
    headers: {
      'Authorization': \`Bearer \${$credentials.accessToken}\`,
      'Notion-Version': '2022-06-28'
    }
  });

  // Verificar status
  const status = page.data.properties.Status.select?.name;
  
  if (status === 'Pending Review') {
    // Enviar notificación de aprobación
    const reviewers = ['editor@example.com', 'manager@example.com'];
    
    for (const reviewer of reviewers) {
      // Aquí iría el nodo de email
      console.log(\`Sending approval request to \${reviewer}\`);
    }

    results.push({
      json: {
        pageId,
        title: page.data.properties.Name.title[0].plain_text,
        status: 'Review Requested',
        reviewers
      }
    });
  }
}

return results;
\`\`\`

#### Sync Bidireccional Notion-Airtable

\`\`\`javascript
// Sincronizar datos entre Notion y Airtable
const notionItems = $input.all();
const results = [];

for (const notionItem of notionItems) {
  const notionId = notionItem.json.id;
  const email = notionItem.json.properties.Email.rich_text[0]?.plain_text;
  
  // Buscar en Airtable por email
  const airtableSearch = await this.helpers.httpRequest({
    method: 'GET',
    url: \`https://api.airtable.com/v0/appXXX/Contacts?filterByFormula={Email}="\${email}"\`,
    headers: {
      'Authorization': \`Bearer \${$credentials.airtableKey}\`
    }
  });

  if (airtableSearch.data.records.length === 0) {
    // Crear en Airtable
    const newRecord = await this.helpers.httpRequest({
      method: 'POST',
      url: 'https://api.airtable.com/v0/appXXX/Contacts',
      headers: {
        'Authorization': \`Bearer \${$credentials.airtableKey}\`,
        'Content-Type': 'application/json'
      },
      body: {
        fields: {
          Name: notionItem.json.properties.Name.title[0].plain_text,
          Email: email,
          Source: 'Notion',
          NotionID: notionId
        }
      }
    });

    results.push({
      json: {
        notionId,
        airtableId: newRecord.data.id,
        action: 'created'
      }
    });
  } else {
    // Actualizar en Airtable
    const recordId = airtableSearch.data.records[0].id;
    
    await this.helpers.httpRequest({
      method: 'PATCH',
      url: \`https://api.airtable.com/v0/appXXX/Contacts/\${recordId}\`,
      headers: {
        'Authorization': \`Bearer \${$credentials.airtableKey}\`,
        'Content-Type': 'application/json'
      },
      body: {
        fields: {
          Name: notionItem.json.properties.Name.title[0].plain_text,
          LastSync: new Date().toISOString()
        }
      }
    });

    results.push({
      json: {
        notionId,
        airtableId: recordId,
        action: 'updated'
      }
    });
  }
}

return results;
\`\`\`

### Mejores Prácticas

#### Notion

1. **Usa databases**: Prefiere databases sobre pages para datos estructurados
2. **Propiedades tipadas**: Usa los tipos de propiedad correctos (select, date, etc.)
3. **Pagination**: Maneja paginación para bases de datos grandes
4. **Rate limiting**: Notion permite 3 requests por segundo
5. **Webhooks**: Usa webhooks para cambios en tiempo real

#### Airtable

1. **Field types**: Usa los tipos de campo apropiados
2. **Views**: Crea vistas específicas para diferentes workflows
3. **Formulas**: Usa fórmulas de Airtable para cálculos
4. **Batch operations**: Usa bulk operations para mejor performance
5. **API limits**: Airtable permite 5 requests por segundo

### Debugging

#### Verificar Conexión Notion

\`\`\`javascript
try {
  const response = await this.helpers.httpRequest({
    method: 'GET',
    url: 'https://api.notion.com/v1/users/me',
    headers: {
      'Authorization': \`Bearer \${$credentials.accessToken}\`,
      'Notion-Version': '2022-06-28'
    }
  });
  console.log('Notion bot:', response.data.bot);
} catch (error) {
  console.error('Notion error:', error.message);
}
\`\`\`

#### Verificar Conexión Airtable

\`\`\`javascript
try {
  const response = await this.helpers.httpRequest({
    method: 'GET',
    url: 'https://api.airtable.com/v0/meta/bases',
    headers: {
      'Authorization': \`Bearer \${$credentials.apiKey}\`
    }
  });
  console.log('Available bases:', response.data.bases);
} catch (error) {
  console.error('Airtable error:', error.message);
}
\`\`\`

### Recursos Adicionales

- [Notion API Documentation](https://developers.notion.com/)
- [Airtable API Documentation](https://airtable.com/api)
- [Notion API Cookbook](https://developers.notion.com/docs/cookbook)
- [Airtable Formulas](https://support.airtable.com/docs/formula-field-reference)
`,
    },
    {
      id: "les-03-05",
      moduleSlug: "integraciones-apis",
      slug: "api-design-patterns",
      title: "Diseño de APIs con N8N",
      description: "Crea APIs RESTful usando webhooks de N8N para exponer tus workflows como servicios.",
      estimatedMinutes: 25,
      content: `## Diseño de APIs con N8N

N8N puede funcionar como backend para APIs RESTful usando webhooks. Esto te permite exponer tus workflows como servicios.

### Webhook como API Endpoint

#### Configuración Básica

\`\`\`json
{
  "httpMethod": "POST",
  "path": "api/v1/users",
  "responseMode": "responseNode",
  "options": {
    "rawBody": true
  }
}
\`\`\`

#### Response Node

\`\`\`json
{
  "respondWith": "json",
  "responseBody": "={{ JSON.stringify({ success: true, data: $json }) }}",
  "options": {
    "responseCode": 200,
    "responseHeaders": {
      "entries": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    }
  }
}
\`\`\`

### REST API Design

#### Estructura de Endpoints

\`\`\`
GET    /api/v1/users          # Listar usuarios
POST   /api/v1/users          # Crear usuario
GET    /api/v1/users/:id      # Obtener usuario específico
PUT    /api/v1/users/:id      # Actualizar usuario completo
PATCH  /api/v1/users/:id      # Actualizar usuario parcial
DELETE /api/v1/users/:id      # Eliminar usuario
\`\`\`

#### Ejemplo: GET /api/v1/users

\`\`\`javascript
// Webhook node recibe request
const query = $input.first().json.query || {};

// Parsear query parameters
const page = parseInt(query.page) || 1;
const limit = parseInt(query.limit) || 50;
const offset = (page - 1) * limit;

// Obtener datos de la base de datos
const users = await this.helpers.httpRequest({
  method: 'GET',
  url: \`\${$credentials.supabaseUrl}/rest/v1/users\`,
  headers: {
    'apikey': $credentials.supabaseKey,
    'Authorization': \`Bearer \${$credentials.supabaseKey}\`,
    'Range': \`\${offset}-\${offset + limit - 1}\`
  }
});

// Preparar respuesta
const response = {
  success: true,
  data: users.data,
  pagination: {
    page,
    limit,
    total: users.headers['content-range']?.split('/')[1] || 0
  }
};

return [{ json: response }];
\`\`\`

#### Ejemplo: POST /api/v1/users

\`\`\`javascript
const body = $input.first().json.body;

// Validación
const errors = [];
if (!body.email) errors.push('Email es requerido');
if (!body.name) errors.push('Name es requerido');
if (body.email && !body.email.includes('@')) errors.push('Email inválido');

if (errors.length > 0) {
  return [{
    json: {
      success: false,
      errors,
      statusCode: 400
    }
  }];
}

// Crear usuario
try {
  const newUser = await this.helpers.httpRequest({
    method: 'POST',
    url: \`\${$credentials.supabaseUrl}/rest/v1/users\`,
    headers: {
      'apikey': $credentials.supabaseKey,
      'Authorization': \`Bearer \${$credentials.supabaseKey}\`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: {
      email: body.email,
      name: body.name,
      created_at: new Date().toISOString()
    }
  });

  return [{
    json: {
      success: true,
      data: newUser.data[0],
      statusCode: 201
    }
  }];
} catch (error) {
  return [{
    json: {
      success: false,
      error: error.message,
      statusCode: 500
    }
  }];
}
\`\`\`

### Autenticación de API

#### API Key Authentication

\`\`\`javascript
// Primer nodo después del webhook
const headers = $input.first().json.headers;
const apiKey = headers['x-api-key'];

// Verificar API key
const validKeys = ['key1', 'key2', 'key3']; // O obtener de base de datos

if (!apiKey || !validKeys.includes(apiKey)) {
  return [{
    json: {
      success: false,
      error: 'Unauthorized',
      statusCode: 401
    }
  }];
}

// Continuar con el workflow
return $input.all();
\`\`\`

#### JWT Authentication

\`\`\`javascript
const jwt = require('jsonwebtoken');
const headers = $input.first().json.headers;
const authHeader = headers['authorization'];

if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return [{
    json: {
      success: false,
      error: 'Missing or invalid authorization header',
      statusCode: 401
    }
  }];
}

const token = authHeader.substring(7);

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Agregar usuario autenticado al contexto
  const items = $input.all();
  return items.map(item => ({
    json: {
      ...item.json,
      user: decoded
    }
  }));
} catch (error) {
  return [{
    json: {
      success: false,
      error: 'Invalid token',
      statusCode: 401
    }
  }];
}
\`\`\`

### Manejo de Errores

#### Error Response Estándar

\`\`\`javascript
function createErrorResponse(statusCode, message, details = null) {
  return {
    json: {
      success: false,
      error: {
        code: statusCode,
        message,
        details,
        timestamp: new Date().toISOString()
      },
      statusCode
    }
  };
}

// Uso
if (!body.email) {
  return [createErrorResponse(400, 'Validation error', { email: 'Email is required' })];
}

if (error.status === 404) {
  return [createErrorResponse(404, 'Resource not found')];
}

return [createErrorResponse(500, 'Internal server error', error.message)];
\`\`\`

### Rate Limiting

#### Implementar Rate Limiting

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const ip = $input.first().json.headers['x-forwarded-for'] || 
           $input.first().json.headers['x-real-ip'];
const key = \`rate_limit:\${ip}\`;
const limit = 100; // requests por hora
const window = 3600; // segundos

// Obtener contador actual
const current = await client.get(key);
const count = current ? parseInt(current) : 0;

if (count >= limit) {
  return [{
    json: {
      success: false,
      error: 'Rate limit exceeded',
      statusCode: 429,
      retryAfter: window
    }
  }];
}

// Incrementar contador
await client.incr(key);
await client.expire(key, window);

// Continuar con el workflow
return $input.all();
\`\`\`

### Documentación de API

#### Generar OpenAPI Spec

\`\`\`javascript
// Endpoint: GET /api/v1/docs
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'N8N API',
    version: '1.0.0',
    description: 'API generada automáticamente por N8N'
  },
  servers: [
    {
      url: 'https://tu-n8n.com',
      description: 'Production server'
    }
  ],
  paths: {
    '/api/v1/users': {
      get: {
        summary: 'List users',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 50 }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUser' }
            }
          }
        },
        responses: {
          '201': {
            description: 'User created'
          }
        }
      }
    }
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      CreateUser: {
        type: 'object',
        required: ['email', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' }
        }
      }
    }
  }
};

return [{ json: openApiSpec }];
\`\`\`

### Patrones Avanzados

#### Patrón: API Gateway

\`\`\`
[Webhook: /api/*]
    ↓
[Authenticate Request]
    ↓
[Route Request]
    ├─ /users → [Users Workflow]
    ├─ /orders → [Orders Workflow]
    └─ /products → [Products Workflow]
\`\`\`

#### Patrón: Async Processing

\`\`\`
[Webhook: POST /api/v1/jobs]
    ↓
[Create Job Record]
    ↓
[Return Job ID Immediately]
    
[Background: Process Job]
    ↓
[Update Job Status]
    
[Webhook: GET /api/v1/jobs/:id]
    ↓
[Return Job Status]
\`\`\`

#### Patrón: Webhook Callbacks

\`\`\`
[Webhook: POST /api/v1/process]
    ↓
[Validate Request]
    ↓
[Store Callback URL]
    ↓
[Return 202 Accepted]
    
[Background: Long Process]
    ↓
[POST to Callback URL with Result]
\`\`\`

### Ejemplo Completo: CRUD API

\`\`\`javascript
// Router node
const method = $input.first().json.httpMethod;
const path = $input.first().json.path;
const body = $input.first().json.body || {};
const params = $input.first().json.params || {};

// Parse path: /api/v1/users/:id
const pathParts = path.split('/');
const resource = pathParts[3]; // users
const id = pathParts[4]; // id (opcional)

// Routing
if (resource === 'users') {
  if (method === 'GET' && !id) {
    // List users
    return handleListUsers();
  } else if (method === 'GET' && id) {
    // Get user by ID
    return handleGetUser(id);
  } else if (method === 'POST') {
    // Create user
    return handleCreateUser(body);
  } else if (method === 'PUT' && id) {
    // Update user
    return handleUpdateUser(id, body);
  } else if (method === 'DELETE' && id) {
    // Delete user
    return handleDeleteUser(id);
  }
}

return [{
  json: {
    success: false,
    error: 'Route not found',
    statusCode: 404
  }
}];

async function handleListUsers() {
  // Implementación
}

async function handleGetUser(id) {
  // Implementación
}

async function handleCreateUser(body) {
  // Implementación
}

async function handleUpdateUser(id, body) {
  // Implementación
}

async function handleDeleteUser(id) {
  // Implementación
}
\`\`\`

### Mejores Prácticas

1. **Versionado**: Usa versiones en URLs (/api/v1/, /api/v2/)
2. **Validación**: Valida todos los inputs
3. **Autenticación**: Implementa auth en todos los endpoints
4. **Rate limiting**: Protege contra abuso
5. **Logging**: Registra todas las requests
6. **Error handling**: Usa códigos HTTP apropiados
7. **Documentation**: Genera OpenAPI specs
8. **Testing**: Prueba todos los endpoints
9. **CORS**: Configura CORS apropiadamente
10. **HTTPS**: Siempre usa HTTPS en producción

### Debugging

#### Test de API con curl

\`\`\`bash
# GET request
curl -X GET https://tu-n8n.com/api/v1/users \\
  -H "X-API-Key: your-api-key"

# POST request
curl -X POST https://tu-n8n.com/api/v1/users \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"email": "user@example.com", "name": "John Doe"}'

# PUT request
curl -X PUT https://tu-n8n.com/api/v1/users/123 \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"name": "Jane Doe"}'
\`\`\`

### Recursos Adicionales

- [REST API Design Best Practices](https://restfulapi.net/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [API Security Checklist](https://github.com/shieldfy/API-Security-Checklist)
`,
    },
  ],
};
