import { Module } from "../../types/course";

export const module5: Module = {
  id: "mod-05",
  slug: "custom-nodes",
  title: "Custom Nodes y Desarrollo",
  description: "Aprende a crear nodos personalizados para N8N usando TypeScript y el SDK oficial.",
  icon: "Code",
  sortOrder: 5,
  lessons: [
    {
      id: "les-05-01",
      moduleSlug: "custom-nodes",
      slug: "introduccion-custom-nodes",
      title: "Introducción a Custom Nodes",
      description: "Entiende cuándo y por qué crear nodos personalizados para N8N.",
      estimatedMinutes: 15,
      content: `## Introducción a Custom Nodes

Los custom nodes te permiten extender N8N con funcionalidad específica para tu caso de uso.

### ¿Cuándo Crear un Custom Node?

#### Razones válidas:
1. **API no soportada**: La API que necesitas no tiene un nodo nativo
2. **Lógica de negocio específica**: Necesitas encapsular lógica compleja reutilizable
3. **Integración interna**: Conectar con sistemas internos de tu empresa
4. **Performance**: Optimizar operaciones que haces frecuentemente
5. **Comunidad**: Contribuir nodos útiles para otros usuarios

#### Cuándo NO crear un custom node:
1. **Uso único**: Si solo lo usarás una vez, usa Code node
2. **HTTP Request suficiente**: Si la API es REST estándar, usa HTTP Request
3. **Func node resuelve**: Si puedes resolverlo con JavaScript en Function node

### Arquitectura de un Custom Node

#### Estructura Básica

\`\`\`
my-custom-node/
├── nodes/
│   └── MyCustomNode/
│       ├── MyCustomNode.node.ts      # Definición del nodo
│       └── MyCustomNode.node.json    # Metadata (opcional)
├── credentials/
│   └── MyCustomNodeApi.credentials.ts # Credenciales
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

#### Componentes Principales

1. **Node Class**: Define el comportamiento del nodo
2. **Properties**: Configuración visible en la UI
3. **Execute Method**: Lógica de ejecución
4. **Credentials**: Manejo de autenticación

### Tipos de Nodos

#### 1. Regular Node

Ejecuta una acción y retorna datos.

\`\`\`typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class MyCustomNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Custom Node',
    name: 'myCustomNode',
    icon: 'file:myCustomNode.svg',
    group: ['transform'],
    version: 1,
    description: 'Descripción de mi nodo personalizado',
    defaults: {
      name: 'My Custom Node',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      // Definición de propiedades
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      // Lógica del nodo
      returnData.push({
        json: {
          result: 'processed'
        }
      });
    }

    return [returnData];
  }
}
\`\`\`

#### 2. Trigger Node

Inicia workflows basándose en eventos.

\`\`\`typescript
import {
  ITriggerFunctions,
  INodeType,
  INodeTypeDescription,
  ITriggerResponse,
} from 'n8n-workflow';

export class MyTriggerNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Trigger',
    name: 'myTrigger',
    icon: 'file:myTrigger.svg',
    group: ['trigger'],
    version: 1,
    description: 'Trigger personalizado',
    defaults: {
      name: 'My Trigger',
    },
    inputs: [],
    outputs: ['main'],
    properties: [],
  };

  async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const webhookUrl = this.getNodeWebhookUrl('/my-webhook');
    
    // Configurar webhook o polling
    const webhookData = this.getWorkflowStaticData('node');
    
    return {
      webhookMethods: {
        default: {
          httpMethod: 'POST',
          path: '/my-webhook',
        },
      },
    };
  }
}
\`\`\`

### Propiedades del Nodo

#### Tipos de Propiedades Comunes

**String:**
\`\`\`typescript
{
  displayName: 'API Key',
  name: 'apiKey',
  type: 'string',
  default: '',
  required: true,
  description: 'Tu API key',
}
\`\`\`

**Number:**
\`\`\`typescript
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  description: 'Número máximo de resultados',
}
\`\`\`

**Boolean:**
\`\`\`typescript
{
  displayName: 'Include Metadata',
  name: 'includeMetadata',
  type: 'boolean',
  default: false,
  description: 'Incluir metadata en la respuesta',
}
\`\`\`

**Options:**
\`\`\`typescript
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  options: [
    {
      name: 'Create',
      value: 'create',
    },
    {
      name: 'Read',
      value: 'read',
    },
    {
      name: 'Update',
      value: 'update',
    },
    {
      name: 'Delete',
      value: 'delete',
    },
  ],
  default: 'create',
  description: 'Operación a realizar',
}
\`\`\`

**Collection:**
\`\`\`typescript
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  options: [
    {
      displayName: 'Status',
      name: 'status',
      type: 'string',
      default: '',
    },
    {
      displayName: 'Priority',
      name: 'priority',
      type: 'number',
      default: 1,
    },
  ],
}
\`\`\`

### Credenciales

#### Definición de Credenciales

\`\`\`typescript
import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MyCustomNodeApi implements ICredentialType {
  name = 'myCustomNodeApi';
  displayName = 'My Custom Node API';
  documentationUrl = 'https://docs.example.com';
  
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      required: true,
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.example.com',
      required: true,
    },
  ];
}
\`\`\`

#### Uso de Credenciales en el Nodo

\`\`\`typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const credentials = await this.getCredentials('myCustomNodeApi');
  
  const apiKey = credentials.apiKey as string;
  const baseUrl = credentials.baseUrl as string;
  
  const response = await this.helpers.httpRequest({
    method: 'GET',
    url: \`\${baseUrl}/endpoint\`,
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
    },
  });
  
  return [this.helpers.returnJsonArray(response.data)];
}
\`\`\`

### Ejemplo Completo: Nodo de Notificación

\`\`\`typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class NotificationNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Send Notification',
    name: 'notificationNode',
    icon: 'file:notification.svg',
    group: ['output'],
    version: 1,
    description: 'Envía notificaciones a múltiples canales',
    defaults: {
      name: 'Send Notification',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'notificationApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Channel',
        name: 'channel',
        type: 'options',
        options: [
          {
            name: 'Email',
            value: 'email',
          },
          {
            name: 'Slack',
            value: 'slack',
          },
          {
            name: 'SMS',
            value: 'sms',
          },
        ],
        default: 'email',
        description: 'Canal de notificación',
      },
      {
        displayName: 'Recipient',
        name: 'recipient',
        type: 'string',
        default: '',
        required: true,
        description: 'Email, webhook URL o número de teléfono',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        description: 'Mensaje a enviar',
      },
      {
        displayName: 'Subject',
        name: 'subject',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            channel: ['email'],
          },
        },
        description: 'Asunto del email',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('notificationApi');

    for (let i = 0; i < items.length; i++) {
      const channel = this.getNodeParameter('channel', i) as string;
      const recipient = this.getNodeParameter('recipient', i) as string;
      const message = this.getNodeParameter('message', i) as string;

      let result: any;

      switch (channel) {
        case 'email':
          const subject = this.getNodeParameter('subject', i) as string;
          result = await this.sendEmail(credentials, recipient, subject, message);
          break;
        case 'slack':
          result = await this.sendSlack(credentials, recipient, message);
          break;
        case 'sms':
          result = await this.sendSMS(credentials, recipient, message);
          break;
      }

      returnData.push({
        json: {
          success: true,
          channel,
          recipient,
          messageId: result.id,
          sentAt: new Date().toISOString(),
        },
      });
    }

    return [returnData];
  }

  private async sendEmail(credentials: any, to: string, subject: string, body: string) {
    return await this.helpers.httpRequest({
      method: 'POST',
      url: \`\${credentials.baseUrl}/email/send\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: { to, subject, body },
    });
  }

  private async sendSlack(credentials: any, webhookUrl: string, text: string) {
    return await this.helpers.httpRequest({
      method: 'POST',
      url: webhookUrl,
      body: { text },
    });
  }

  private async sendSMS(credentials: any, phone: string, message: string) {
    return await this.helpers.httpRequest({
      method: 'POST',
      url: \`\${credentials.baseUrl}/sms/send\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: { to: phone, message },
    });
  }
}
\`\`\`

### Testing de Custom Nodes

#### Testing Local

\`\`\`bash
# Link el nodo a tu instalación de N8N
cd my-custom-node
npm link

cd ~/.n8n
npm link my-custom-node

# Reiniciar N8N
n8n start
\`\`\`

#### Testing con Docker

\`\`\`dockerfile
FROM n8nio/n8n

COPY my-custom-node /custom-nodes/my-custom-node
RUN cd /custom-nodes/my-custom-node && npm install

ENV N8N_CUSTOM_EXTENSIONS=/custom-nodes
\`\`\`

### Publicación en npm

#### Preparar para Publicación

\`\`\`json
{
  "name": "n8n-nodes-my-custom-node",
  "version": "1.0.0",
  "description": "Custom node for N8N",
  "keywords": [
    "n8n-community-node-package"
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/MyCustomNodeApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/MyCustomNode/MyCustomNode.node.js"
    ]
  },
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "format": "prettier nodes credentials --write",
    "lint": "tslint -p tsconfig.json -c tslint.json",
    "lintfix": "tslint --fix -p tsconfig.json -c tslint.json"
  }
}
\`\`\`

#### Publicar

\`\`\`bash
npm run build
npm publish
\`\`\`

### Mejores Prácticas

1. **Naming**: Usa nombres descriptivos y únicos
2. **Documentation**: Documenta todas las propiedades
3. **Error handling**: Maneja errores gracefully
4. **Type safety**: Usa TypeScript estrictamente
5. **Testing**: Prueba con diferentes inputs
6. **Versioning**: Usa semantic versioning
7. **Icons**: Proporciona iconos SVG de alta calidad
8. **Examples**: Incluye ejemplos de uso

### Recursos Adicionales

- [N8N Custom Nodes Documentation](https://docs.n8n.io/integrations/creating-nodes/)
- [N8N Node Starter Kit](https://github.com/n8n-io/n8n-nodes-starter)
- [N8N Community Nodes](https://www.npmjs.com/search?q=n8n-nodes)
- [N8N Workflow Automation](https://docs.n8n.io/)
`,
    },
    {
      id: "les-05-02",
      moduleSlug: "custom-nodes",
      slug: "desarrollo-node-avanzado",
      title: "Desarrollo Avanzado de Nodos",
      description: "Técnicas avanzadas para crear nodos complejos con autenticación OAuth2 y webhooks.",
      estimatedMinutes: 30,
      content: `## Desarrollo Avanzado de Nodos

Aprende técnicas avanzadas para crear nodos complejos con autenticación OAuth2, webhooks y manejo de datos binarios.

### Autenticación OAuth2

#### Credenciales OAuth2

\`\`\`typescript
import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MyServiceOAuth2Api implements ICredentialType {
  name = 'myServiceOAuth2Api';
  extends = ['oAuth2Api'];
  displayName = 'My Service OAuth2 API';
  documentationUrl = 'https://docs.myservice.com/oauth';
  
  properties: INodeProperties[] = [
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://api.myservice.com/oauth/authorize',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://api.myservice.com/oauth/token',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: 'read write',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: 'response_type=code',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },
  ];
}
\`\`\`

#### Uso de OAuth2 en el Nodo

\`\`\`typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    const options = {
      method: 'GET' as const,
      url: 'https://api.myservice.com/data',
      json: true,
    };

    // N8N maneja automáticamente el refresh del token
    const response = await this.helpers.requestOAuth2.call(
      this,
      'myServiceOAuth2Api',
      options
    );

    returnData.push({
      json: response,
    });
  }

  return [returnData];
}
\`\`\`

### Trigger Nodes con Webhooks

#### Webhook Trigger Node

\`\`\`typescript
import {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';

export class MyWebhookTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Webhook Trigger',
    name: 'myWebhookTrigger',
    icon: 'file:webhook.svg',
    group: ['trigger'],
    version: 1,
    description: 'Trigger basado en webhooks',
    defaults: {
      name: 'My Webhook Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'myServiceApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'my-webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: [
          {
            name: 'User Created',
            value: 'user.created',
          },
          {
            name: 'User Updated',
            value: 'user.updated',
          },
          {
            name: 'Order Completed',
            value: 'order.completed',
          },
        ],
        default: [],
        description: 'Eventos a escuchar',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        
        if (!webhookData.webhookId) {
          return false;
        }

        const credentials = await this.getCredentials('myServiceApi');
        
        try {
          const response = await this.helpers.httpRequest({
            method: 'GET',
            url: \`\${credentials.baseUrl}/webhooks/\${webhookData.webhookId}\`,
            headers: {
              'Authorization': \`Bearer \${credentials.apiKey}\`,
            },
          });
          
          return true;
        } catch (error) {
          return false;
        }
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const events = this.getNodeParameter('events') as string[];
        const credentials = await this.getCredentials('myServiceApi');

        const response = await this.helpers.httpRequest({
          method: 'POST',
          url: \`\${credentials.baseUrl}/webhooks\`,
          headers: {
            'Authorization': \`Bearer \${credentials.apiKey}\`,
            'Content-Type': 'application/json',
          },
          body: {
            url: webhookUrl,
            events,
          },
        });

        const webhookData = this.getWorkflowStaticData('node');
        webhookData.webhookId = response.id;

        return true;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const credentials = await this.getCredentials('myServiceApi');

        try {
          await this.helpers.httpRequest({
            method: 'DELETE',
            url: \`\${credentials.baseUrl}/webhooks/\${webhookData.webhookId}\`,
            headers: {
              'Authorization': \`Bearer \${credentials.apiKey}\`,
            },
          });
        } catch (error) {
          return false;
        }

        delete webhookData.webhookId;
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData();
    const headerData = this.getHeaderData();
    const queryData = this.getQueryData();

    // Validar webhook (ejemplo: verificar firma)
    const credentials = await this.getCredentials('myServiceApi');
    const signature = headerData['x-signature'] as string;
    
    if (!this.verifyWebhookSignature(bodyData, signature, credentials.webhookSecret)) {
      throw new Error('Invalid webhook signature');
    }

    return {
      workflowData: [
        this.helpers.returnJsonArray({
          event: bodyData.event,
          data: bodyData.data,
          timestamp: bodyData.timestamp,
          headers: headerData,
          query: queryData,
        }),
      ],
    };
  }

  private verifyWebhookSignature(body: any, signature: string, secret: string): boolean {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(body)).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  }
}
\`\`\`

### Manejo de Datos Binarios

#### Descargar Archivos

\`\`\`typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    const fileId = this.getNodeParameter('fileId', i) as string;
    const credentials = await this.getCredentials('myServiceApi');

    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: \`\${credentials.baseUrl}/files/\${fileId}/download\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
      },
      encoding: null, // Importante para datos binarios
      returnFullResponse: true,
    });

    const fileName = this.getFileNameFromHeaders(response.headers);
    const mimeType = response.headers['content-type'];

    const binaryData = await this.helpers.prepareBinaryData(
      response.body,
      fileName,
      mimeType
    );

    returnData.push({
      json: {
        fileId,
        fileName,
        mimeType,
        size: response.body.length,
      },
      binary: {
        data: binaryData,
      },
    });
  }

  return [returnData];
}

private getFileNameFromHeaders(headers: any): string {
  const contentDisposition = headers['content-disposition'];
  if (!contentDisposition) {
    return 'download.bin';
  }

  const match = contentDisposition.match(/filename[^;=\\n]*=((['"]).*?\\2|[^;\\n]*)/);
  return match ? match[1].replace(/['"]/g, '') : 'download.bin';
}
\`\`\`

#### Subir Archivos

\`\`\`typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
    const credentials = await this.getCredentials('myServiceApi');

    const binaryData = items[i].binary?.[binaryPropertyName];
    
    if (!binaryData) {
      throw new Error(\`No binary data found in property '\${binaryPropertyName}'\`);
    }

    const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

    const formData = new FormData();
    formData.append('file', buffer, {
      filename: binaryData.fileName,
      contentType: binaryData.mimeType,
    });

    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: \`\${credentials.baseUrl}/files/upload\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
      },
      body: formData,
    });

    returnData.push({
      json: {
        fileId: response.id,
        fileName: binaryData.fileName,
        mimeType: binaryData.mimeType,
        size: binaryData.fileSize,
        uploadedAt: response.createdAt,
      },
    });
  }

  return [returnData];
}
\`\`\`

### Nodos con Múltiples Operaciones

#### Patrón CRUD Completo

\`\`\`typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class MyCRUDNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My CRUD Node',
    name: 'myCRUDNode',
    icon: 'file:crud.svg',
    group: ['transform'],
    version: 1,
    description: 'Operaciones CRUD completas',
    defaults: {
      name: 'My CRUD Node',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'myServiceApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Crear un nuevo recurso',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Obtener un recurso',
          },
          {
            name: 'Get All',
            value: 'getAll',
            description: 'Obtener todos los recursos',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Actualizar un recurso',
          },
          {
            name: 'Delete',
            value: 'delete',
            description: 'Eliminar un recurso',
          },
        ],
        default: 'create',
      },
      {
        displayName: 'Resource ID',
        name: 'resourceId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['get', 'update', 'delete'],
          },
        },
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            operation: ['getAll'],
          },
        },
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        displayOptions: {
          show: {
            operation: ['getAll'],
            returnAll: [false],
          },
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: {
            operation: ['create', 'update'],
          },
        },
        options: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: [
              {
                name: 'Active',
                value: 'active',
              },
              {
                name: 'Inactive',
                value: 'inactive',
              },
            ],
            default: 'active',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('myServiceApi');

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      let response: any;

      switch (operation) {
        case 'create':
          response = await this.createResource(credentials, i);
          break;
        case 'get':
          response = await this.getResource(credentials, i);
          break;
        case 'getAll':
          response = await this.getAllResources(credentials, i);
          break;
        case 'update':
          response = await this.updateResource(credentials, i);
          break;
        case 'delete':
          response = await this.deleteResource(credentials, i);
          break;
      }

      if (Array.isArray(response)) {
        returnData.push(...response.map(r => ({ json: r })));
      } else {
        returnData.push({ json: response });
      }
    }

    return [returnData];
  }

  private async createResource(credentials: any, index: number) {
    const additionalFields = this.getNodeParameter('additionalFields', index) as any;

    return await this.helpers.httpRequest({
      method: 'POST',
      url: \`\${credentials.baseUrl}/resources\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: additionalFields,
    });
  }

  private async getResource(credentials: any, index: number) {
    const resourceId = this.getNodeParameter('resourceId', index) as string;

    return await this.helpers.httpRequest({
      method: 'GET',
      url: \`\${credentials.baseUrl}/resources/\${resourceId}\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
      },
    });
  }

  private async getAllResources(credentials: any, index: number) {
    const returnAll = this.getNodeParameter('returnAll', index) as boolean;
    const limit = returnAll ? 1000 : this.getNodeParameter('limit', index) as number;

    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: \`\${credentials.baseUrl}/resources\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
      },
      qs: { limit },
    });

    return response.data;
  }

  private async updateResource(credentials: any, index: number) {
    const resourceId = this.getNodeParameter('resourceId', index) as string;
    const additionalFields = this.getNodeParameter('additionalFields', index) as any;

    return await this.helpers.httpRequest({
      method: 'PATCH',
      url: \`\${credentials.baseUrl}/resources/\${resourceId}\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: additionalFields,
    });
  }

  private async deleteResource(credentials: any, index: number) {
    const resourceId = this.getNodeParameter('resourceId', index) as string;

    await this.helpers.httpRequest({
      method: 'DELETE',
      url: \`\${credentials.baseUrl}/resources/\${resourceId}\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
      },
    });

    return { success: true, deleted: resourceId };
  }
}
\`\`\`

### Manejo de Errores

#### Error Handling Robusto

\`\`\`typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const items = this.getInputData();
  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      const response = await this.processItem(i);
      returnData.push({ json: response });
    } catch (error) {
      if (this.continueOnFail()) {
        returnData.push({
          json: {
            error: error.message,
            item: items[i].json,
          },
        });
      } else {
        throw error;
      }
    }
  }

  return [returnData];
}

private async processItem(index: number) {
  const credentials = await this.getCredentials('myServiceApi');
  
  try {
    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: \`\${credentials.baseUrl}/process\`,
      headers: {
        'Authorization': \`Bearer \${credentials.apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: this.getInputData()[index].json,
    });

    return response;
  } catch (error) {
    // Manejo específico de errores
    if (error.statusCode === 401) {
      throw new Error('Authentication failed. Please check your credentials.');
    } else if (error.statusCode === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.statusCode >= 500) {
      throw new Error(\`Server error: \${error.message}\`);
    } else {
      throw new Error(\`Request failed: \${error.message}\`);
    }
  }
}
\`\`\`

### Testing Avanzado

#### Unit Tests con Jest

\`\`\`typescript
import { MyCustomNode } from '../nodes/MyCustomNode/MyCustomNode.node';
import { executeWorkflow } from './utils';

describe('MyCustomNode', () => {
  let node: MyCustomNode;

  beforeEach(() => {
    node = new MyCustomNode();
  });

  test('should have correct description', () => {
    expect(node.description.displayName).toBe('My Custom Node');
    expect(node.description.name).toBe('myCustomNode');
  });

  test('should execute successfully', async () => {
    const { result } = await executeWorkflow({
      nodes: [
        {
          name: 'My Custom Node',
          type: 'n8n-nodes-my-custom-node.myCustomNode',
          parameters: {
            operation: 'create',
            name: 'Test Resource',
          },
        },
      ],
    });

    expect(result).toBeDefined();
    expect(result[0][0].json.success).toBe(true);
  });

  test('should handle errors gracefully', async () => {
    const { result } = await executeWorkflow({
      nodes: [
        {
          name: 'My Custom Node',
          type: 'n8n-nodes-my-custom-node.myCustomNode',
          parameters: {
            operation: 'create',
            name: '', // Invalid: empty name
          },
        },
      ],
    });

    expect(result[0][0].json.error).toBeDefined();
  });
});
\`\`\`

### Mejores Prácticas

1. **Type safety**: Usa TypeScript estrictamente
2. **Error messages**: Proporciona mensajes de error claros
3. **Validation**: Valida inputs antes de procesar
4. **Pagination**: Implementa paginación para listas grandes
5. **Rate limiting**: Respeta límites de API
6. **Caching**: Cachea respuestas cuando sea apropiado
7. **Logging**: Log información útil para debugging
8. **Documentation**: Documenta todos los parámetros

### Recursos Adicionales

- [N8N Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)
- [N8N Node UI Elements](https://docs.n8n.io/integrations/creating-nodes/build/reference/node-ui-elements/)
- [N8N HTTP Request Helper](https://docs.n8n.io/integrations/creating-nodes/build/reference/http-helpers/)
- [Testing N8N Nodes](https://docs.n8n.io/integrations/creating-nodes/test/)
`,
    },
    {
      id: "les-05-03",
      moduleSlug: "custom-nodes",
      slug: "publicacion-distribucion",
      title: "Publicación y Distribución de Nodos",
      description: "Publica tus nodos en npm y compártelos con la comunidad de N8N.",
      estimatedMinutes: 20,
      content: `## Publicación y Distribución de Nodos

Aprende a publicar tus custom nodes en npm y distribuirlos a la comunidad de N8N.

### Preparación para Publicación

#### Estructura del Package

\`\`\`
n8n-nodes-my-custom-node/
├── nodes/
│   └── MyCustomNode/
│       ├── MyCustomNode.node.ts
│       ├── MyCustomNode.node.json
│       └── myCustomNode.svg
├── credentials/
│   └── MyCustomNodeApi.credentials.ts
├── package.json
├── tsconfig.json
├── tslint.json
├── .prettierrc.js
├── .npmignore
├── README.md
└── LICENSE
\`\`\`

#### package.json Completo

\`\`\`json
{
  "name": "n8n-nodes-my-custom-node",
  "version": "1.0.0",
  "description": "Custom node for N8N that does amazing things",
  "keywords": [
    "n8n-community-node-package",
    "n8n",
    "automation",
    "workflow"
  ],
  "license": "MIT",
  "homepage": "https://github.com/username/n8n-nodes-my-custom-node",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/username/n8n-nodes-my-custom-node.git"
  },
  "main": "index.js",
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "format": "prettier nodes credentials --write",
    "lint": "tslint -p tsconfig.json -c tslint.json",
    "lintfix": "tslint --fix -p tsconfig.json -c tslint.json",
    "prepublishOnly": "npm run build && npm run lint"
  },
  "files": [
    "dist"
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/MyCustomNodeApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/MyCustomNode/MyCustomNode.node.js"
    ]
  },
  "devDependencies": {
    "@types/express": "^4.17.13",
    "@types/request-promise-native": "~1.0.15",
    "gulp": "^4.0.0",
    "n8n-core": "^0.150.0",
    "n8n-workflow": "^0.135.0",
    "prettier": "^2.7.1",
    "tslint": "^6.1.2",
    "typescript": "~4.8.0"
  }
}
\`\`\`

#### tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "module": "commonjs",
    "target": "es2019",
    "lib": ["es2019"],
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": false,
    "outDir": "./dist/",
    "rootDir": "./",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "credentials/**/*",
    "nodes/**/*",
    "nodes/**/*.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
\`\`\`

#### .npmignore

\`\`\`
src/
node_modules/
.npmignore
tsconfig.json
tslint.json
.prettierrc.js
.editorconfig
.gitignore
.github/
*.test.ts
*.spec.ts
coverage/
.vscode/
\`\`\`

### Build Process

#### Gulpfile para Iconos

\`\`\`javascript
const gulp = require('gulp');

gulp.task('build:icons', () => {
  return gulp
    .src('nodes/**/*.svg')
    .pipe(gulp.dest('dist/nodes/'));
});

gulp.task('build', gulp.series('build:icons'));
\`\`\`

#### Build Script

\`\`\`bash
# Limpiar directorio dist
rm -rf dist

# Compilar TypeScript
npm run build

# Verificar estructura
ls -la dist/nodes/MyCustomNode/
ls -la dist/credentials/
\`\`\`

### Testing Local

#### Link Local

\`\`\`bash
# En el directorio de tu nodo
cd n8n-nodes-my-custom-node
npm link

# En tu instalación de N8N
cd ~/.n8n
npm link n8n-nodes-my-custom-node

# Reiniciar N8N
n8n start
\`\`\`

#### Testing con Docker

\`\`\`dockerfile
FROM n8nio/n8n:latest

# Copiar el nodo
COPY n8n-nodes-my-custom-node /custom-nodes/n8n-nodes-my-custom-node

# Instalar dependencias
RUN cd /custom-nodes/n8n-nodes-my-custom-node && npm install --production

# Configurar variable de entorno
ENV N8N_CUSTOM_EXTENSIONS=/custom-nodes

# Exponer puerto
EXPOSE 5678

CMD ["n8n", "start"]
\`\`\`

#### Docker Compose para Testing

\`\`\`yaml
version: '3.8'

services:
  n8n:
    build: .
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n-nodes-my-custom-node:/custom-nodes/n8n-nodes-my-custom-node

volumes:
  n8n_data:
\`\`\`

### Publicación en npm

#### Preparar para Publicación

\`\`\`bash
# Verificar que estás logueado en npm
npm whoami

# Si no estás logueado
npm login

# Verificar package.json
npm pack --dry-run

# Verificar que todos los archivos necesarios están incluidos
tar -tzf n8n-nodes-my-custom-node-1.0.0.tgz
\`\`\`

#### Publicar

\`\`\`bash
# Incrementar versión
npm version patch  # o minor, major

# Publicar
npm publish

# Verificar publicación
npm view n8n-nodes-my-custom-node
\`\`\`

#### Tags de Versión

\`\`\`bash
# Publicar como beta
npm publish --tag beta

# Publicar como next
npm publish --tag next

# Cambiar tag a latest
npm dist-tag add n8n-nodes-my-custom-node@1.0.0-beta.1 latest
\`\`\`

### Documentación

#### README.md Template

\`\`\`markdown
# n8n-nodes-my-custom-node

[![npm version](https://badge.fury.io/js/n8n-nodes-my-custom-node.svg)](https://badge.fury.io/js/n8n-nodes-my-custom-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Custom node for N8N that provides [brief description of functionality].

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter \`n8n-nodes-my-custom-node\`
4. Click **Install**

### Manual Installation

\`\`\`bash
cd ~/.n8n
npm install n8n-nodes-my-custom-node
\`\`\`

## Features

- ✅ Feature 1
- ✅ Feature 2
- ✅ Feature 3

## Credentials

This node requires credentials for [service name]. You'll need:

- API Key
- Base URL

## Operations

### Create
Creates a new resource.

**Parameters:**
- \`name\` (required): Name of the resource
- \`description\`: Optional description

### Get
Retrieves a resource by ID.

**Parameters:**
- \`resourceId\` (required): ID of the resource

### Get All
Retrieves all resources.

**Parameters:**
- \`returnAll\`: Return all results (default: false)
- \`limit\`: Maximum number of results (default: 50)

### Update
Updates an existing resource.

**Parameters:**
- \`resourceId\` (required): ID of the resource
- \`name\`: New name
- \`description\`: New description

### Delete
Deletes a resource.

**Parameters:**
- \`resourceId\` (required): ID of the resource

## Examples

### Example 1: Create a Resource

\`\`\`json
{
  "operation": "create",
  "name": "My Resource",
  "description": "This is a test resource"
}
\`\`\`

### Example 2: Get All Resources

\`\`\`json
{
  "operation": "getAll",
  "returnAll": true
}
\`\`\`

## Development

### Setup

\`\`\`bash
git clone https://github.com/username/n8n-nodes-my-custom-node.git
cd n8n-nodes-my-custom-node
npm install
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

### Test Locally

\`\`\`bash
npm link
cd ~/.n8n
npm link n8n-nodes-my-custom-node
n8n start
\`\`\`

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT © [Your Name](https://github.com/username)

## Support

- 📖 [Documentation](https://github.com/username/n8n-nodes-my-custom-node/wiki)
- 🐛 [Report Bug](https://github.com/username/n8n-nodes-my-custom-node/issues)
- 💬 [Discussions](https://github.com/username/n8n-nodes-my-custom-node/discussions)
\`\`\`

### Versioning

#### Semantic Versioning

\`\`\`
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes
\`\`\`

#### Changelog

\`\`\`markdown
# Changelog

## [1.1.0] - 2024-01-15

### Added
- New operation: Bulk create
- Support for binary data upload

### Changed
- Improved error messages
- Updated dependencies

### Fixed
- Fixed pagination issue in getAll operation
- Fixed authentication refresh

## [1.0.0] - 2024-01-01

### Added
- Initial release
- CRUD operations
- OAuth2 authentication
\`\`\`

### Promoción

#### N8N Community Forum

Publica en [N8N Community](https://community.n8n.io/c/questions/12):

\`\`\`markdown
## 🚀 New Community Node: n8n-nodes-my-custom-node

I'm excited to share my new custom node for N8N!

### What it does
[Brief description]

### Features
- Feature 1
- Feature 2
- Feature 3

### Installation
\`\`\`bash
npm install n8n-nodes-my-custom-node
\`\`\`

### Links
- 📦 [npm](https://www.npmjs.com/package/n8n-nodes-my-custom-node)
- 💻 [GitHub](https://github.com/username/n8n-nodes-my-custom-node)
- 📖 [Documentation](https://github.com/username/n8n-nodes-my-custom-node/wiki)

Feedback and contributions are welcome!
\`\`\`

#### Social Media

Comparte en Twitter, LinkedIn, etc.:

\`\`\`
🚀 Just published n8n-nodes-my-custom-node! 

A custom node for @n8n_io that [brief description].

✅ Feature 1
✅ Feature 2
✅ Feature 3

Install: npm install n8n-nodes-my-custom-node

#n8n #automation #workflow #opensource
\`\`\`

### Mantenimiento

#### Actualizaciones Regulares

\`\`\`bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Actualizar n8n-workflow y n8n-core
npm install n8n-workflow@latest n8n-core@latest

# Testear con última versión de N8N
docker run -it --rm -p 5678:5678 n8nio/n8n:latest
\`\`\`

#### CI/CD con GitHub Actions

\`\`\`yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Lint
      run: npm run lint
    
    - name: Test
      run: npm test

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        registry-url: https://registry.npmjs.org/
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Publish to npm
      run: npm publish
      env:
        NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
\`\`\`

### Mejores Prácticas

1. **Versioning**: Usa semantic versioning estrictamente
2. **Changelog**: Mantén un changelog detallado
3. **Documentation**: Documenta todas las funcionalidades
4. **Testing**: Prueba con diferentes versiones de N8N
5. **Support**: Responde issues y preguntas rápidamente
6. **Updates**: Mantén dependencias actualizadas
7. **Security**: Monitorea vulnerabilidades
8. **Community**: Participa en la comunidad de N8N

### Recursos Adicionales

- [N8N Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions for npm](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
`,
    },
  ],
};
