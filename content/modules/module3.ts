import { Module } from "../../types/course";

export const module3: Module = {
  id: "mod-03",
  slug: "integrations-apis-auth",
  title: "Integrations, APIs and Authentication",
  description: "Connect N8N to external services using REST APIs, OAuth2 and advanced authentication.",
  icon: "Plug",
  sortOrder: 3,
  lessons: [
    {
      id: "les-03-01",
      moduleSlug: "integrations-apis-auth",
      slug: "http-request-node",
      title: "HTTP Request Node: Consuming REST APIs",
      description: "Master the HTTP Request node to consume any REST API with different methods and authentication.",
      estimatedMinutes: 25,
      content: `## HTTP Request Node

The HTTP Request node is essential to integrate N8N with external services through REST APIs.

### Supported HTTP Methods

- **GET**: Retrieve data
- **POST**: Create resources
- **PUT**: Update full resources
- **PATCH**: Update partial resources
- **DELETE**: Delete resources
- **HEAD**: Retrieve headers
- **OPTIONS**: Retrieve allowed methods

### Basic Configuration

#### Simple GET Request

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

#### POST Request with a JSON Body

\`\`\`json
{
  "method": "POST",
  "url": "https://api.example.com/users",
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ name: $json.name, email: $json.email }) }}",
  "options": {
    "response": {
      "response": {
        "responseFormat": "json"
      }
    }
  }
}
\`\`\`

### Authentication

#### 1. API Key in a Header

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

#### 2. API Key in the Query String

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

### Custom Headers

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

### Handling Responses

#### JSON Response

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

#### Text Response

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

#### Binary Response (File Download)

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

### Automatic Pagination

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

### Practical Examples

#### Example 1: Consuming the GitHub API

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

#### Example 2: Creating an Airtable Record

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
  "jsonBody": "={{ JSON.stringify({ fields: { Name: $json.name, Email: $json.email, Phone: $json.phone } }) }}"
}
\`\`\`

#### Example 3: Uploading a File to S3

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

### Error Handling

#### Automatic Retry

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

#### Pattern: Retry with the Code Node

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

#### Implementing Rate Limiting

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

### Webhooks and Callbacks

#### Creating a Webhook Endpoint

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

#### Sending a Webhook with Data

\`\`\`json
{
  "method": "POST",
  "url": "https://your-n8n.com/webhook/webhook-callback",
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ status: 'completed', data: $json, timestamp: $now.toISO() }) }}"
}
\`\`\`

### Best Practices

1. **Use credentials**: Never hardcode API keys in the workflow
2. **Validate responses**: Check that the response is valid before processing it
3. **Handle errors**: Implement retry logic for unstable APIs
4. **Rate limiting**: Respect the API limits
5. **Timeouts**: Configure appropriate timeouts
6. **Logs**: Record requests and responses for debugging
7. **Versioning**: Use specific API versions whenever possible

### Debugging

#### Inspecting the Request and Response

\`\`\`javascript
// After the HTTP Request node
const response = $input.first().json;

console.log('=== HTTP REQUEST DEBUG ===');
console.log('Status:', $response.statusCode);
console.log('Headers:', $response.headers);
console.log('Body:', JSON.stringify(response, null, 2));
console.log('Timing:', $response.timing);

return $input.all();
\`\`\`

### Additional Resources

- [HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [REST API Best Practices](https://restfulapi.net/)
- [OAuth2 Flow](https://oauth.net/2/)
`,
    },
    {
      id: "les-03-02",
      moduleSlug: "integrations-apis-auth",
      slug: "supabase-integration",
      title: "Supabase Integration",
      description: "Connect N8N to Supabase for CRUD operations, authentication and realtime features.",
      estimatedMinutes: 30,
      content: `## Supabase Integration

Supabase is an open-source platform and an alternative to Firebase that provides a PostgreSQL database, authentication and realtime APIs.

### Credentials Setup

#### Creating Credentials in N8N

1. Go to **Credentials** in N8N
2. Click **New**
3. Select **Supabase API**
4. Configure:
   - **Host**: \`https://your-project.supabase.co\`
   - **Service Role Key**: Your service role key (from the Supabase Dashboard)

### CRUD Operations

#### SELECT: Reading Data

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

**With advanced filters:**

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

#### INSERT: Creating Records

\`\`\`json
{
  "operation": "insert",
  "tableId": "contacts",
  "fields": {
    "values": [
      {
        "name": "name",
        "value": "={{ $json.name }}"
      },
      {
        "name": "email",
        "value": "={{ $json.email }}"
      },
      {
        "name": "phone",
        "value": "={{ $json.phone }}"
      }
    ]
  }
}
\`\`\`

**Multiple inserts:**

\`\`\`javascript
// Code node to prepare the data
const items = $input.all();

return items.map(item => ({
  json: {
    name: item.json.name,
    email: item.json.email,
    phone: item.json.phone,
    created_at: new Date().toISOString()
  }
}));
\`\`\`

#### UPDATE: Updating Records

\`\`\`json
{
  "operation": "update",
  "tableId": "users",
  "updateKey": "id",
  "fields": {
    "values": [
      {
        "name": "status",
        "value": "={{ $json.newStatus }}"
      },
      {
        "name": "updated_at",
        "value": "={{ $now.toISO() }}"
      }
    ]
  }
}
\`\`\`

#### DELETE: Deleting Records

\`\`\`json
{
  "operation": "delete",
  "tableId": "temp_data",
  "deleteKey": "id"
}
\`\`\`

### Advanced Queries

#### Using the Supabase Client Directly

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
    // Query with complex filters
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

#### Joins and Relationships

\`\`\`javascript
// Fetch orders together with customer and product data
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

### User Authentication

#### Creating a User

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
          full_name: item.json.name,
          phone: item.json.phone
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

#### User Login

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

### Realtime with Webhooks

#### Configuring a Webhook in Supabase

In the Supabase Dashboard:
1. Go to **Database** → **Webhooks**
2. Click **Create a new webhook**
3. Configure:
   - **Name**: \`order_created\`
   - **Table**: \`orders\`
   - **Events**: \`INSERT\`
   - **URL**: \`https://your-n8n.com/webhook/supabase-orders\`

#### Processing a Supabase Webhook

\`\`\`javascript
// The Webhook node receives the data sent by Supabase
const webhookData = $input.first().json;

// Structure of the Supabase webhook payload
const {
  type,        // "INSERT", "UPDATE", "DELETE"
  table,       // Table name
  record,      // New record
  old_record,  // Previous record (for UPDATE)
  schema       // Schema (usually "public")
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

#### Creating RLS Policies

\`\`\`sql
-- Enable RLS on the table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Policy: users can only create their own orders
CREATE POLICY "Users can create own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: admins can view all orders
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

### RPC Functions

#### Creating a Function in Supabase

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

#### Calling an RPC Function from N8N

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

### Storage: File Handling

#### File Upload

\`\`\`javascript
const item = $input.first();
const binaryData = item.binary.data;
const bucket = 'user-uploads';
const fileName = \`uploads/\${Date.now()}_\${binaryData.fileName}\`;

// Convert base64 to a buffer
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

#### Downloading a File

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

### Common Patterns

#### Pattern: Two-Way Sync

\`\`\`
[Webhook: Supabase Change] → [Process Change] → [Update External System]
                                                        ↓
[Webhook: External Change] → [Process Change] → [Update Supabase]
\`\`\`

#### Pattern: Data Pipeline

\`\`\`
[Schedule: Every hour]
    ↓
[Supabase: Get New Records]
    ↓
[Transform Data]
    ↓
[Supabase: Update Processed]
    ↓
[Send to External API]
\`\`\`

### Best Practices

1. **Use the Service Role Key carefully**: Server-side only, never client-side
2. **Implement RLS**: Always enable Row Level Security
3. **Use indexes**: Create indexes for frequent queries
4. **Batch operations**: Use bulk insert/update for better performance
5. **Handle errors**: Implement retry logic for critical operations
6. **Monitor**: Use logs to track important operations
7. **Backups**: Configure automatic backups of your database

### Debugging

#### Verifying the Connection

\`\`\`javascript
// Supabase connection test
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

### Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase API Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
`,
    },
    {
      id: "les-03-03",
      moduleSlug: "integrations-apis-auth",
      slug: "google-workspace",
      title: "Google Workspace: Gmail, Sheets and Drive",
      description: "Integrate N8N with Google Workspace to automate emails, spreadsheets and files.",
      estimatedMinutes: 30,
      content: `## Google Workspace Integration

Google Workspace (formerly G Suite) offers Gmail, Google Sheets, Drive and more. N8N can integrate with all of these services.

### OAuth2 Setup

#### Creating OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Gmail API
   - Google Sheets API
   - Google Drive API
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure:
   - **Application type**: Web application
   - **Authorized redirect URIs**: \`https://your-n8n.com/rest/oauth2-credential/callback\`
6. Copy the **Client ID** and the **Client Secret**
7. In N8N, create the **Google OAuth2 API** credentials

### Gmail

#### Sending a Simple Email

\`\`\`json
{
  "resource": "message",
  "operation": "send",
  "sendTo": "={{ $json.email }}",
  "subject": "Welcome to our service",
  "emailType": "text",
  "message": "Hi {{ $json.name }},\\n\\nThanks for signing up.\\n\\nBest regards!"
}
\`\`\`

#### Sending an HTML Email

\`\`\`json
{
  "resource": "message",
  "operation": "send",
  "sendTo": "={{ $json.email }}",
  "subject": "Your monthly report",
  "emailType": "html",
  "message": "={{ $json.htmlContent }}"
}
\`\`\`

**Dynamic HTML example:**

\`\`\`javascript
// Code node to generate the HTML
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
        <h1>Monthly Report</h1>
      </div>
      <div class="content">
        <p>Hi \${item.json.name},</p>
        <p>Here is your report for the month:</p>
        <ul>
          <li>Sales: $\${item.json.sales}</li>
          <li>New customers: \${item.json.newCustomers}</li>
          <li>Satisfaction: \${item.json.satisfaction}%</li>
        </ul>
      </div>
      <div class="footer">
        <p>Automatically generated by N8N</p>
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

#### Sending an Email with Attachments

\`\`\`json
{
  "resource": "message",
  "operation": "send",
  "sendTo": "={{ $json.email }}",
  "subject": "Attached document",
  "emailType": "text",
  "message": "You will find the requested document attached.",
  "options": {
    "attachments": "data"
  }
}
\`\`\`

#### Reading Emails

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

#### Searching for Specific Emails

\`\`\`json
{
  "resource": "message",
  "operation": "getAll",
  "returnAll": false,
  "limit": 10,
  "filters": {
    "q": "from:customer@example.com subject:order newer_than:7d"
  }
}
\`\`\`

**Gmail search operators:**
- \`from:email@example.com\`: From a specific sender
- \`subject:word\`: In the subject
- \`newer_than:7d\`: Newer than 7 days
- \`older_than:1m\`: Older than 1 month
- \`has:attachment\`: With attachments
- \`is:unread\`: Unread
- \`label:important\`: With a specific label

### Google Sheets

#### Reading Data from a Sheet

\`\`\`json
{
  "operation": "getData",
  "documentId": "={{ $json.sheetId }}",
  "sheetName": "Sheet1",
  "range": "A1:Z1000",
  "options": {
    "valueInputMode": "USER_ENTERED"
  }
}
\`\`\`

#### Writing Data to a Sheet

\`\`\`json
{
  "operation": "append",
  "documentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheetName": "Data",
  "dataMode": "autoMap",
  "options": {
    "valueInputMode": "USER_ENTERED"
  }
}
\`\`\`

#### Updating Specific Cells

\`\`\`json
{
  "operation": "update",
  "documentId": "={{ $json.sheetId }}",
  "sheetName": "Sheet1",
  "range": "A2:B2",
  "dataMode": "defineBelow",
  "fieldsValues": {
    "values": [
      {
        "lookupValue": "={{ $json.name }}",
        "lookupColumn": "Name",
        "newColumn": "Status",
        "newValue": "Processed"
      }
    ]
  }
}
\`\`\`

#### Creating a New Sheet

\`\`\`javascript
const sheetName = \`Report_\${$now.toFormat('yyyy-MM-dd')}\`;

// Create the new spreadsheet
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
          title: 'Data',
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

#### Listing Files

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

#### File Upload

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

#### Downloading a File

\`\`\`json
{
  "resource": "file",
  "operation": "download",
  "fileId": "={{ $json.fileId }}"
}
\`\`\`

#### Sharing a File

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
        "emailAddress": "user@example.com"
      }
    ]
  }
}
\`\`\`

### Automation Patterns

#### Pattern 1: Email Processing Pipeline

\`\`\`
[Schedule: Every 5 min]
    ↓
[Gmail: Get Unread Emails]
    ↓
[IF: Has an attachment?]
    ├─ Yes → [Drive: Download Attachment]
    │           ↓
    │         [Process Attachment]
    │           ↓
    │         [Sheets: Log Data]
    │           ↓
    └─→ [Gmail: Mark as Read]
\`\`\`

#### Pattern 2: Report Generator

\`\`\`
[Schedule: Monday 9 AM]
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

#### Pattern 3: Form to Sheet Automation

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

### Advanced Examples

#### Processing Emails with Attachments

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const email = item.json;
  
  // Check whether the email has attachments
  if (email.attachments && email.attachments.length > 0) {
    for (const attachment of email.attachments) {
      // Download the attachment
      const fileData = await this.helpers.httpRequest({
        method: 'GET',
        url: \`https://www.googleapis.com/gmail/v1/users/me/messages/\${email.id}/attachments/\${attachment.attachmentId}\`,
        headers: {
          'Authorization': \`Bearer \${$credentials.accessToken}\`
        }
      });

      // Upload it to Drive
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

#### Generating a Dynamic Report in Sheets

\`\`\`javascript
const items = $input.all();

// Prepare the data for Sheets
const headers = ['Date', 'Customer', 'Product', 'Quantity', 'Total'];
const rows = items.map(item => [
  item.json.date,
  item.json.customer,
  item.json.product,
  item.json.quantity,
  \`$\${item.json.total}\`
]);

// Calculate the totals
const grandTotal = items.reduce((sum, item) => sum + item.json.total, 0);
rows.push(['', '', '', 'TOTAL:', \`$\${grandTotal}\`]);

// Combine the headers and the data
const allData = [headers, ...rows];

return [{
  json: {
    data: allData,
    rowCount: allData.length,
    columnCount: headers.length
  }
}];
\`\`\`

### Best Practices

1. **Rate limiting**: Respect the Google API limits
2. **Batch operations**: Use batch requests whenever possible
3. **Error handling**: Handle authentication and permission errors
4. **Minimal scopes**: Request only the permissions you need
5. **Token refresh**: Implement automatic token refresh
6. **Logs**: Record important operations for auditing
7. **Backup**: Keep backups of critical data in Sheets

### Debugging

#### Verifying Permissions

\`\`\`javascript
// Check the available scopes
const scopes = $credentials.scope;
console.log('Available scopes:', scopes);

// Connection test
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

### Additional Resources

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Drive API](https://developers.google.com/drive/api)
- [OAuth2 Playground](https://developers.google.com/oauthplayground/)
`,
    },
    {
      id: "les-03-04",
      moduleSlug: "integrations-apis-auth",
      slug: "notion-airtable",
      title: "Notion and Airtable as a CMS",
      description: "Use Notion and Airtable as content management systems for your workflows.",
      estimatedMinutes: 25,
      content: `## Notion and Airtable as a CMS

Notion and Airtable are powerful tools that can work as a CMS (Content Management System) for your automations.

### Notion Integration

#### Setup

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **New integration**
3. Configure:
   - **Name**: N8N Integration
   - **Associated workspace**: Your workspace
4. Copy the **Internal Integration Token**
5. In Notion, share the database with the integration
6. In N8N, create the **Notion API** credentials

#### Reading a Database

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

#### Creating a Page

\`\`\`json
{
  "operation": "create",
  "databaseId": "={{ $json.databaseId }}",
  "properties": {
    "properties": [
      {
        "key": "Name",
        "type": "title",
        "title": "={{ $json.title }}"
      },
      {
        "key": "Status",
        "type": "select",
        "select": "Draft"
      },
      {
        "key": "Author",
        "type": "rich_text",
        "rich_text": "={{ $json.author }}"
      }
    ]
  }
}
\`\`\`

#### Updating a Page

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

#### Adding Content to a Page

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const pageId = item.json.pageId;
  const content = item.json.content;

  // Create the content blocks
  const blocks = [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: item.json.subtitle } }]
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
        rich_text: [{ type: 'text', text: { content: 'Point 1' } }]
      }
    },
    {
      object: 'block',
      type: 'code',
      code: {
        rich_text: [{ type: 'text', text: { content: item.json.code } }],
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

#### Setup

1. Go to [Airtable API](https://airtable.com/api)
2. Select your base
3. Generate an **API Key**
4. In N8N, create the **Airtable API** credentials

#### Reading Records

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

#### Creating a Record

\`\`\`json
{
  "operation": "create",
  "application": "appXXXXXXXXXXXXXX",
  "table": "Contacts",
  "fields": {
    "values": [
      {
        "name": "Name",
        "value": "={{ $json.name }}"
      },
      {
        "name": "Email",
        "value": "={{ $json.email }}"
      },
      {
        "name": "Phone",
        "value": "={{ $json.phone }}"
      },
      {
        "name": "Status",
        "value": "New"
      }
    ]
  }
}
\`\`\`

#### Updating a Record

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

// Prepare the bulk create
const records = items.map(item => ({
  fields: {
    Name: item.json.name,
    Email: item.json.email,
    Phone: item.json.phone,
    Status: 'New',
    Source: 'N8N Automation'
  }
}));

// Airtable allows a maximum of 10 records per request
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
  
  // Rate limiting: Airtable allows 5 requests per second
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

### CMS Patterns

#### Pattern 1: Content Publishing Pipeline

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

#### Pattern 2: CRM with Airtable

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

#### Pattern 3: Knowledge Base Sync

\`\`\`
[Schedule: Daily]
    ↓
[Notion: Get Updated Pages]
    ↓
[Transform to Searchable Format]
    ↓
[Upload to Search Index]
    ↓
[Airtable: Log Sync Status]
\`\`\`

### Advanced Examples

#### Content Approval Workflow

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const pageId = item.json.pageId;
  
  // Fetch the Notion page
  const page = await this.helpers.httpRequest({
    method: 'GET',
    url: \`https://api.notion.com/v1/pages/\${pageId}\`,
    headers: {
      'Authorization': \`Bearer \${$credentials.accessToken}\`,
      'Notion-Version': '2022-06-28'
    }
  });

  // Check the status
  const status = page.data.properties.Status.select?.name;
  
  if (status === 'Pending Review') {
    // Send the approval notification
    const reviewers = ['editor@example.com', 'manager@example.com'];
    
    for (const reviewer of reviewers) {
      // The email node would go here
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

#### Two-Way Notion-Airtable Sync

\`\`\`javascript
// Sync data between Notion and Airtable
const notionItems = $input.all();
const results = [];

for (const notionItem of notionItems) {
  const notionId = notionItem.json.id;
  const email = notionItem.json.properties.Email.rich_text[0]?.plain_text;
  
  // Look up the record in Airtable by email
  const airtableSearch = await this.helpers.httpRequest({
    method: 'GET',
    url: \`https://api.airtable.com/v0/appXXX/Contacts?filterByFormula={Email}="\${email}"\`,
    headers: {
      'Authorization': \`Bearer \${$credentials.airtableKey}\`
    }
  });

  if (airtableSearch.data.records.length === 0) {
    // Create it in Airtable
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
    // Update it in Airtable
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

### Best Practices

#### Notion

1. **Use databases**: Prefer databases over pages for structured data
2. **Typed properties**: Use the right property types (select, date, etc.)
3. **Pagination**: Handle pagination for large databases
4. **Rate limiting**: Notion allows 3 requests per second
5. **Webhooks**: Use webhooks for realtime changes

#### Airtable

1. **Field types**: Use the appropriate field types
2. **Views**: Create specific views for different workflows
3. **Formulas**: Use Airtable formulas for calculations
4. **Batch operations**: Use bulk operations for better performance
5. **API limits**: Airtable allows 5 requests per second

### Debugging

#### Verifying the Notion Connection

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

#### Verifying the Airtable Connection

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

### Additional Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Airtable API Documentation](https://airtable.com/api)
- [Notion API Cookbook](https://developers.notion.com/docs/cookbook)
- [Airtable Formulas](https://support.airtable.com/docs/formula-field-reference)
`,
    },
    {
      id: "les-03-05",
      moduleSlug: "integrations-apis-auth",
      slug: "api-design-patterns",
      title: "API Design with N8N",
      description: "Build RESTful APIs using N8N webhooks to expose your workflows as services.",
      estimatedMinutes: 25,
      content: `## API Design with N8N

N8N can act as a backend for RESTful APIs using webhooks. This lets you expose your workflows as services.

### Webhook as an API Endpoint

#### Basic Configuration

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

#### Endpoint Structure

\`\`\`
GET    /api/v1/users          # List users
POST   /api/v1/users          # Create a user
GET    /api/v1/users/:id      # Get a specific user
PUT    /api/v1/users/:id      # Update a user completely
PATCH  /api/v1/users/:id      # Partially update a user
DELETE /api/v1/users/:id      # Delete a user
\`\`\`

#### Example: GET /api/v1/users

\`\`\`javascript
// The Webhook node receives the request
const query = $input.first().json.query || {};

// Parse the query parameters
const page = parseInt(query.page) || 1;
const limit = parseInt(query.limit) || 50;
const offset = (page - 1) * limit;

// Fetch the data from the database
const users = await this.helpers.httpRequest({
  method: 'GET',
  url: \`\${$credentials.supabaseUrl}/rest/v1/users\`,
  headers: {
    'apikey': $credentials.supabaseKey,
    'Authorization': \`Bearer \${$credentials.supabaseKey}\`,
    'Range': \`\${offset}-\${offset + limit - 1}\`
  }
});

// Build the response
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

#### Example: POST /api/v1/users

\`\`\`javascript
const body = $input.first().json.body;

// Validation
const errors = [];
if (!body.email) errors.push('Email is required');
if (!body.name) errors.push('Name is required');
if (body.email && !body.email.includes('@')) errors.push('Invalid email');

if (errors.length > 0) {
  return [{
    json: {
      success: false,
      errors,
      statusCode: 400
    }
  }];
}

// Create the user
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

### API Authentication

#### API Key Authentication

\`\`\`javascript
// First node after the webhook
const headers = $input.first().json.headers;
const apiKey = headers['x-api-key'];

// Verify the API key
const validKeys = ['key1', 'key2', 'key3']; // Or fetch them from a database

if (!apiKey || !validKeys.includes(apiKey)) {
  return [{
    json: {
      success: false,
      error: 'Unauthorized',
      statusCode: 401
    }
  }];
}

// Continue with the workflow
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
  
  // Add the authenticated user to the context
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

### Error Handling

#### Standard Error Response

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

// Usage
if (!body.email) {
  return [createErrorResponse(400, 'Validation error', { email: 'Email is required' })];
}

if (error.status === 404) {
  return [createErrorResponse(404, 'Resource not found')];
}

return [createErrorResponse(500, 'Internal server error', error.message)];
\`\`\`

### Rate Limiting

#### Implementing Rate Limiting

\`\`\`javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const ip = $input.first().json.headers['x-forwarded-for'] || 
           $input.first().json.headers['x-real-ip'];
const key = \`rate_limit:\${ip}\`;
const limit = 100; // requests per hour
const window = 3600; // seconds

// Get the current counter
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

// Increment the counter
await client.incr(key);
await client.expire(key, window);

// Continue with the workflow
return $input.all();
\`\`\`

### API Documentation

#### Generating an OpenAPI Spec

\`\`\`javascript
// Endpoint: GET /api/v1/docs
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'N8N API',
    version: '1.0.0',
    description: 'API automatically generated by N8N'
  },
  servers: [
    {
      url: 'https://your-n8n.com',
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

### Advanced Patterns

#### Pattern: API Gateway

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

#### Pattern: Async Processing

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

#### Pattern: Webhook Callbacks

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

### Complete Example: CRUD API

\`\`\`javascript
// Router node
const method = $input.first().json.httpMethod;
const path = $input.first().json.path;
const body = $input.first().json.body || {};
const params = $input.first().json.params || {};

// Parse the path: /api/v1/users/:id
const pathParts = path.split('/');
const resource = pathParts[3]; // users
const id = pathParts[4]; // id (optional)

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
  // Implementation
}

async function handleGetUser(id) {
  // Implementation
}

async function handleCreateUser(body) {
  // Implementation
}

async function handleUpdateUser(id, body) {
  // Implementation
}

async function handleDeleteUser(id) {
  // Implementation
}
\`\`\`

### Best Practices

1. **Versioning**: Use versions in the URLs (/api/v1/, /api/v2/)
2. **Validation**: Validate every input
3. **Authentication**: Implement auth on every endpoint
4. **Rate limiting**: Protect against abuse
5. **Logging**: Log every request
6. **Error handling**: Use appropriate HTTP status codes
7. **Documentation**: Generate OpenAPI specs
8. **Testing**: Test every endpoint
9. **CORS**: Configure CORS properly
10. **HTTPS**: Always use HTTPS in production

### Debugging

#### Testing the API with curl

\`\`\`bash
# GET request
curl -X GET https://your-n8n.com/api/v1/users \\
  -H "X-API-Key: your-api-key"

# POST request
curl -X POST https://your-n8n.com/api/v1/users \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"email": "user@example.com", "name": "John Doe"}'

# PUT request
curl -X PUT https://your-n8n.com/api/v1/users/123 \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"name": "Jane Doe"}'
\`\`\`

### Additional Resources

- [REST API Design Best Practices](https://restfulapi.net/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [API Security Checklist](https://github.com/shieldfy/API-Security-Checklist)
`,
    },
  ],
};
