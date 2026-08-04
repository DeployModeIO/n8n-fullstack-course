import { Module } from "../../types/course";

export const module5: Module = {
  id: "mod-05",
  slug: "custom-nodes",
  title: "Custom Nodes y Desarrollo",
  description: "Crea nodos personalizados para N8N: desde la configuración del entorno de desarrollo hasta la publicación en npm y la comunidad.",
  icon: "Code",
  sortOrder: 5,
  lessons: [
    {
      id: "les-05-01",
      moduleSlug: "custom-nodes",
      slug: "intro-custom-nodes",
      title: "Introducción a Custom Nodes",
      description: "Descubre por qué crear nodos personalizados, la arquitectura de nodos en N8N y cómo configurar tu entorno de desarrollo.",
      content: `## Introducción a Custom Nodes

Los custom nodes (nodos personalizados) te permiten extender N8N con funcionalidad específica para tu caso de uso, integrando APIs internas, servicios propietarios o lógica de negocio única.

### ¿Por qué crear custom nodes?

- **APIs internas**: Conectar con servicios internos de tu empresa que no tienen nodo nativo
- **Lógica reutilizable**: Empaquetar lógica compleja en un nodo visual
- **Integraciones propietarias**: Conectar con software propietario o legacy
- **Optimización**: Reemplazar combinaciones complejas de nodos con un solo nodo eficiente
- **Distribución**: Compartir tu integración con la comunidad de N8N

### Arquitectura de un nodo N8N

Cada nodo en N8N consiste en:

\`\`\`
mi-nodo/
├── nodes/
│   └── MiNodo/
│       ├── MiNodo.node.ts          ← Definición del nodo
│       ├── MiNodo.node.json         ← Metadata (opcional)
│       └── descriptions/
│           └── MiNodoDescription.ts ← Parámetros y opciones
├── credentials/
│   └── MiNodoApi.credentials.ts     ← Definición de credenciales
├── package.json
├── tsconfig.json
└── .eslintrc.js
\`\`\`

### Componentes principales

#### 1. Node Definition (\`MiNodo.node.ts\`)

Define la estructura, propiedades y ejecución del nodo:

\`\`\`typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class MiNodo implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Mi Nodo Personalizado',
    name: 'miNodo',
    icon: 'file:miNodo.svg',
    group: ['transform'],
    version: 1,
    description: 'Realiza operaciones personalizadas',
    defaults: {
      name: 'Mi Nodo',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'miNodoApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operación',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'Crear', value: 'create' },
          { name: 'Leer', value: 'read' },
          { name: 'Actualizar', value: 'update' },
          { name: 'Eliminar', value: 'delete' },
        ],
        default: 'read',
      },
      {
        displayName: 'Recurso ID',
        name: 'resourceId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['read', 'update', 'delete'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      const credentials = await this.getCredentials('miNodoApi');

      let responseData;

      switch (operation) {
        case 'create':
          responseData = await createResource(this, credentials, i);
          break;
        case 'read':
          responseData = await readResource(this, credentials, i);
          break;
        case 'update':
          responseData = await updateResource(this, credentials, i);
          break;
        case 'delete':
          responseData = await deleteResource(this, credentials, i);
          break;
      }

      returnData.push({ json: responseData });
    }

    return [returnData];
  }
}
\`\`\`

#### 2. Credentials (\`MiNodoApi.credentials.ts\`)

Define cómo el usuario configura las credenciales:

\`\`\`typescript
import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MiNodoApi implements ICredentialType {
  name = 'miNodoApi';
  displayName = 'Mi Nodo API';
  properties: INodeProperties[] = [
    {
      displayName: 'API URL',
      name: 'apiUrl',
      type: 'string',
      default: 'https://api.miempresa.com',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];
}
\`\`\`

### Entorno de desarrollo

#### Requisitos

- **Node.js** 18 o superior
- **npm** o **pnpm**
- **TypeScript** 5+
- **N8N** instalado localmente para testing

#### Configuración inicial

\`\`\`bash
npx n8n-node new mi-n8n-node
cd mi-n8n-node
npm install
\`\`\`

#### Vincular con N8N local

\`\`\`bash
npm link
cd ~/.n8n
npm link mi-n8n-node
\`\`\`

O con la variable de entorno:

\`\`\`bash
export N8N_CUSTOM_EXTENSIONS="/ruta/a/mi-n8n-node"
n8n start
\`\`\`

### Tipos de propiedades

| Tipo | Descripción | Ejemplo |
|---|---|---|
| \`string\` | Campo de texto | Nombre, URL |
| \`number\` | Campo numérico | Cantidad, límite |
| \`boolean\` | Toggle true/false | Activo, incluir metadata |
| \`options\` | Dropdown de opciones | Operación, formato |
| \`multiOptions\` | Multi-select | Tags, categorías |
| \`json\` | Editor JSON | Body de petición |
| \`collection\` | Grupo de campos | Opciones avanzadas |
| \`fixedCollection\` | Grupo fijo de campos | Parámetros de filtro |
| \`resourceLocator\` | Selector de recurso | Base de datos, tabla |
| \`dateTime\` | Selector de fecha | Fecha inicio, deadline |

### Ciclo de vida del desarrollo

1. **Diseño**: Define las operaciones, parámetros y credenciales
2. **Implementación**: Escribe el código TypeScript del nodo
3. **Testing**: Prueba localmente con N8N
4. **Empaquetado**: Compila y empaqueta el nodo
5. **Publicación**: Publica en npm o instala localmente
6. **Mantenimiento**: Actualiza y corrige bugs`,
      estimatedMinutes: 20,
      quiz: [
        {
          id: "q-05-01-1",
          question: "¿Qué archivo define la estructura y ejecución de un custom node?",
          options: [
            "package.json",
            "MiNodo.node.ts",
            "MiNodo.credentials.ts",
            "index.ts"
          ],
          correctIndex: 1,
          explanation: "El archivo MiNodo.node.ts contiene la definición del nodo (INodeType) con sus propiedades, parámetros y la función execute() que define la lógica."
        },
        {
          id: "q-05-01-2",
          question: "¿Cómo se vincula un custom node con N8N local para testing?",
          options: [
            "Copiando los archivos a la carpeta de N8N",
            "Con npm link o la variable N8N_CUSTOM_EXTENSIONS",
            "Instalando desde npm",
            "Configurando un webhook especial"
          ],
          correctIndex: 1,
          explanation: "Se puede vincular con npm link (creando un symlink) o configurando la variable de entorno N8N_CUSTOM_EXTENSIONS apuntando a la carpeta del nodo."
        },
        {
          id: "q-05-01-3",
          question: "¿Qué tipo de propiedad se usa para un dropdown de opciones?",
          options: ["string", "options", "select", "dropdown"],
          correctIndex: 1,
          explanation: "El tipo 'options' crea un dropdown con opciones predefinidas en el editor de N8N."
        }
      ]
    },
    {
      id: "les-05-02",
      moduleSlug: "custom-nodes",
      slug: "n8n-cli-setup",
      title: "N8N Node CLI y Scaffolding",
      description: "Instala y configura el CLI de N8N para crear proyectos de nodos personalizados con TypeScript y la estructura correcta.",
      content: `## N8N Node CLI y Scaffolding

El CLI de N8N facilita la creación de proyectos de nodos personalizados con la estructura correcta, TypeScript configurado y herramientas de build listas para usar.

### Instalación del CLI

\`\`\`bash
npm install -g n8n-node-cli
\`\`\`

O usando npx sin instalación global:

\`\`\`bash
npx n8n-node-cli new mi-n8n-nodo
\`\`\`

### Crear un nuevo proyecto

\`\`\`bash
n8n-node-cli new n8n-nodes-mi-servicio
\`\`\`

Esto genera la siguiente estructura:

\`\`\`
n8n-nodes-mi-servicio/
├── credentials/
│   └── MiServicioApi.credentials.ts
├── nodes/
│   └── MiServicio/
│       ├── MiServicio.node.ts
│       └── MiServicio.node.json
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .prettierrc.js
├── gulpfile.js
├── LICENSE.md
├── package.json
├── README.md
├── tsconfig.json
└── tslint.json
\`\`\`

### Configuración de TypeScript

El \`tsconfig.json\` generado incluye:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "es2019",
    "lib": ["es2019", "es2020", "es2022.error"],
    "removeComments": true,
    "useUnknownInCatchVariables": false,
    "forceConsistentCasingInFileNames": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "preserveConstEnums": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "incremental": true,
    "declaration": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": [
    "credentials/**/*",
    "nodes/**/*",
    "nodes/**/*.json",
    "package.json"
  ]
}
\`\`\`

### package.json configurado

\`\`\`json
{
  "name": "n8n-nodes-mi-servicio",
  "version": "0.1.0",
  "description": "N8N nodes para Mi Servicio",
  "keywords": [
    "n8n-community-node-package"
  ],
  "license": "MIT",
  "main": "index.js",
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "format": "prettier nodes credentials --write",
    "lint": "eslint nodes credentials package.json",
    "lintfix": "eslint nodes credentials package.json --fix",
    "prepublishOnly": "npm run build && npm run lint -c .eslintrc.prepublish.js"
  },
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/MiServicioApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/MiServicio/MiServicio.node.js"
    ]
  },
  "devDependencies": {
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-n8n-nodes-base": "^1.16.0",
    "gulp": "^4.0.0",
    "n8n-workflow": "^1.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "n8n-workflow": ">=1.0.0"
  }
}
\`\`\`

### Comandos del CLI

| Comando | Descripción |
|---|---|
| \`n8n-node-cli new <name>\` | Crear nuevo proyecto |
| \`n8n-node-cli generate node <name>\` | Generar un nuevo nodo |
| \`n8n-node-cli generate credentials <name>\` | Generar nuevas credenciales |

### Convenciones de nombrado

- **Package**: \`n8n-nodes-<nombre>\` (prefijo obligatorio para comunidad)
- **Node class**: PascalCase (\`MiServicio\`)
- **Node name**: camelCase (\`miServicio\`)
- **Credentials class**: PascalCase con Api suffix (\`MiServicioApi\`)
- **Display name**: Título con espacios (\`Mi Servicio\`)

### ESLint para N8N nodes

El plugin \`eslint-plugin-n8n-nodes-base\` verifica:

- Estructura correcta de propiedades
- Nombres consistentes
- Tipos de parámetros válidos
- Display options correctos
- Credenciales bien definidas

\`\`\`bash
npm run lint
npm run lintfix
\`\`\`

### Build y desarrollo

#### Modo desarrollo (watch)

\`\`\`bash
npm run dev
\`\`\`

Compila TypeScript en modo watch, recompilando automáticamente al guardar cambios.

#### Build para producción

\`\`\`bash
npm run build
\`\`\`

Compila TypeScript y copia iconos a la carpeta \`dist/\`.

#### Pre-publish

\`\`\`bash
npm run prepublishOnly
\`\`\`

Ejecuta build + lint estricto antes de publicar en npm.

### Estructura recomendada para nodos complejos

\`\`\`
n8n-nodes-mi-servicio/
├── credentials/
│   └── MiServicioApi.credentials.ts
├── nodes/
│   └── MiServicio/
│       ├── MiServicio.node.ts
│       ├── actions/
│       │   ├── create.ts
│       │   ├── read.ts
│       │   ├── update.ts
│       │   └── delete.ts
│       ├── descriptions/
│       │   ├── index.ts
│       │   ├── createDescription.ts
│       │   ├── readDescription.ts
│       │   └── updateDescription.ts
│       ├── transport/
│       │   └── api.ts
│       └── types.ts
├── test/
│   └── MiServicio.test.ts
└── package.json
\`\`\`

### Tips de setup

- Usa **pnpm** en lugar de npm para builds más rápidos
- Configura **Husky** para pre-commit hooks con lint
- Usa **changesets** para versionado semántico
- Configura **GitHub Actions** para CI/CD automático
- Mantén \`n8n-workflow\` como \`peerDependency\`, no como \`dependency\``,
      estimatedMinutes: 18,
      quiz: [
        {
          id: "q-05-02-1",
          question: "¿Qué prefijo debe tener el nombre del package para nodos de la comunidad N8N?",
          options: [
            "n8n-community-",
            "n8n-nodes-",
            "n8n-plugin-",
            "n8n-ext-"
          ],
          correctIndex: 1,
          explanation: "Los packages de nodos para la comunidad N8N deben usar el prefijo 'n8n-nodes-' seguido del nombre del servicio."
        },
        {
          id: "q-05-02-2",
          question: "¿Qué keyword debe incluir package.json para que N8N reconozca el paquete como nodo comunitario?",
          options: [
            "n8n-node",
            "n8n-community-node-package",
            "n8n-extension",
            "n8n-plugin"
          ],
          correctIndex: 1,
          explanation: "La keyword 'n8n-community-node-package' en package.json permite que N8N identifique e instale el paquete como nodo comunitario."
        },
        {
          id: "q-05-02-3",
          question: "¿Cómo debe declararse n8n-workflow en package.json?",
          options: [
            "Como dependency",
            "Como devDependency",
            "Como peerDependency",
            "Como optionalDependency"
          ],
          correctIndex: 2,
          explanation: "n8n-workflow debe declararse como peerDependency para evitar conflictos de versiones con la instalación de N8N del usuario."
        }
      ]
    },
    {
      id: "les-05-03",
      moduleSlug: "custom-nodes",
      slug: "building-first-node",
      title: "Construyendo tu Primer Custom Node",
      description: "Paso a paso: crea un custom node completo con inputs, outputs, credenciales y lógica de ejecución real.",
      content: `## Construyendo tu Primer Custom Node

Vamos a crear un custom node que se integra con una API de gestión de tareas. El nodo permitirá crear, leer, actualizar y eliminar tareas.

### Paso 1: Definir las credenciales

\`\`\`typescript
import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TaskManagerApi implements ICredentialType {
  name = 'taskManagerApi';
  displayName = 'Task Manager API';
  documentationUrl = 'https://docs.taskmanager.com/api';

  properties: INodeProperties[] = [
    {
      displayName: 'API URL',
      name: 'apiUrl',
      type: 'string',
      default: 'https://api.taskmanager.com/v1',
      placeholder: 'https://api.taskmanager.com/v1',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
  ];
}
\`\`\`

### Paso 2: Definir las propiedades del nodo

\`\`\`typescript
import { INodeProperties } from 'n8n-workflow';

export const taskFields: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    options: [
      { name: 'Create Task', value: 'create' },
      { name: 'Get Task', value: 'get' },
      { name: 'Get All Tasks', value: 'getAll' },
      { name: 'Update Task', value: 'update' },
      { name: 'Delete Task', value: 'delete' },
    ],
    default: 'getAll',
  },
  {
    displayName: 'Task ID',
    name: 'taskId',
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
    displayName: 'Title',
    name: 'title',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        operation: ['create'],
      },
    },
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    typeOptions: { rows: 4 },
    default: '',
    displayOptions: {
      show: {
        operation: ['create', 'update'],
      },
    },
  },
  {
    displayName: 'Priority',
    name: 'priority',
    type: 'options',
    options: [
      { name: 'Low', value: 'low' },
      { name: 'Medium', value: 'medium' },
      { name: 'High', value: 'high' },
    ],
    default: 'medium',
    displayOptions: {
      show: {
        operation: ['create', 'update'],
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
    typeOptions: {
      minValue: 1,
    },
  },
];
\`\`\`

### Paso 3: Implementar la lógica del nodo

\`\`\`typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';
import { taskFields } from './descriptions';

export class TaskManager implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Task Manager',
    name: 'taskManager',
    icon: 'file:taskManager.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Manage tasks via Task Manager API',
    defaults: {
      name: 'Task Manager',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'taskManagerApi',
        required: true,
      },
    ],
    properties: taskFields,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const credentials = await this.getCredentials('taskManagerApi');

    const apiUrl = credentials.apiUrl as string;
    const apiKey = credentials.apiKey as string;

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter('operation', i) as string;

        let responseData;

        if (operation === 'create') {
          const title = this.getNodeParameter('title', i) as string;
          const description = this.getNodeParameter('description', i, '') as string;
          const priority = this.getNodeParameter('priority', i) as string;

          responseData = await this.helpers.httpRequest({
            method: 'POST',
            url: \`\${apiUrl}/tasks\`,
            headers: {
              'Authorization': \`Bearer \${apiKey}\`,
              'Content-Type': 'application/json',
            },
            body: { title, description, priority },
            json: true,
          });
        } else if (operation === 'get') {
          const taskId = this.getNodeParameter('taskId', i) as string;

          responseData = await this.helpers.httpRequest({
            method: 'GET',
            url: \`\${apiUrl}/tasks/\${taskId}\`,
            headers: {
              'Authorization': \`Bearer \${apiKey}\`,
            },
            json: true,
          });
        } else if (operation === 'getAll') {
          const returnAll = this.getNodeParameter('returnAll', i) as boolean;
          const limit = returnAll ? 1000 : this.getNodeParameter('limit', i) as number;

          responseData = await this.helpers.httpRequest({
            method: 'GET',
            url: \`\${apiUrl}/tasks?limit=\${limit}\`,
            headers: {
              'Authorization': \`Bearer \${apiKey}\`,
            },
            json: true,
          });

          if (Array.isArray(responseData)) {
            for (const task of responseData) {
              returnData.push({ json: task });
            }
            continue;
          }
        } else if (operation === 'update') {
          const taskId = this.getNodeParameter('taskId', i) as string;
          const description = this.getNodeParameter('description', i, '') as string;
          const priority = this.getNodeParameter('priority', i) as string;

          responseData = await this.helpers.httpRequest({
            method: 'PATCH',
            url: \`\${apiUrl}/tasks/\${taskId}\`,
            headers: {
              'Authorization': \`Bearer \${apiKey}\`,
              'Content-Type': 'application/json',
            },
            body: { description, priority },
            json: true,
          });
        } else if (operation === 'delete') {
          const taskId = this.getNodeParameter('taskId', i) as string;

          responseData = await this.helpers.httpRequest({
            method: 'DELETE',
            url: \`\${apiUrl}/tasks/\${taskId}\`,
            headers: {
              'Authorization': \`Bearer \${apiKey}\`,
            },
            json: true,
          });

          responseData = { success: true, deletedId: taskId };
        }

        returnData.push({ json: responseData });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error, {
          itemIndex: i,
        });
      }
    }

    return [returnData];
  }
}
\`\`\`

### Paso 4: Manejo de errores

Usa \`NodeOperationError\` para errores específicos del nodo:

\`\`\`typescript
throw new NodeOperationError(
  this.getNode(),
  \`Task with ID '\${taskId}' not found\`,
  {
    itemIndex: i,
    description: 'Verify the task ID exists in Task Manager',
  }
);
\`\`\`

### Paso 5: Build y test

\`\`\`bash
npm run build
npm run lint
\`\`\`

Para probar localmente:

\`\`\`bash
npm link
cd ~/.n8n
npm link n8n-nodes-task-manager
n8n start
\`\`\`

### Icono del nodo

Crea un archivo SVG de 60x60px en \`nodes/TaskManager/taskManager.svg\`:

\`\`\`svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
  <rect width="60" height="60" rx="8" fill="#4A90D9"/>
  <path d="M20 30l7 7 13-13" stroke="white" stroke-width="4" fill="none"/>
</svg>
\`\`\`

### Tips de desarrollo

- Usa **\`this.helpers.httpRequest()\`** en lugar de fetch/axios
- Implementa **\`continueOnFail()\`** para que el workflow no se detenga en errores
- Usa **\`NodeOperationError\`** con \`itemIndex\` para errores específicos por item
- Usa **\`displayOptions\`** para mostrar/ocultar campos según la operación seleccionada
- Incluye **\`subtitle\`** para mostrar la operación actual en el canvas`,
      estimatedMinutes: 25,
      quiz: [
        {
          id: "q-05-03-1",
          question: "¿Qué método se usa para hacer peticiones HTTP dentro de un custom node?",
          options: [
            "fetch()",
            "axios.request()",
            "this.helpers.httpRequest()",
            "this.http()"
          ],
          correctIndex: 2,
          explanation: "this.helpers.httpRequest() es el método proporcionado por N8N para hacer peticiones HTTP dentro de custom nodes, con manejo integrado de errores y autenticación."
        },
        {
          id: "q-05-03-2",
          question: "¿Qué función permite que el nodo continúe procesando aunque un item falle?",
          options: [
            "this.ignoreErrors()",
            "this.continueOnFail()",
            "this.skipOnError()",
            "this.catchErrors()"
          ],
          correctIndex: 1,
          explanation: "this.continueOnFail() retorna true si el usuario configuró el nodo para continuar en caso de error, permitiendo procesar los items restantes."
        },
        {
          id: "q-05-03-3",
          question: "¿Qué clase se usa para lanzar errores específicos de un custom node?",
          options: [
            "Error",
            "NodeError",
            "NodeOperationError",
            "WorkflowError"
          ],
          correctIndex: 2,
          explanation: "NodeOperationError es la clase específica de N8N para errores de operación en nodos, permitiendo incluir itemIndex y descripciones útiles."
        }
      ]
    },
    {
      id: "les-05-04",
      moduleSlug: "custom-nodes",
      slug: "testing-publishing",
      title: "Testing y Publicación de Custom Nodes",
      description: "Prueba tus custom nodes localmente, escribe tests unitarios, publica en npm y envía a la comunidad de N8N.",
      content: `## Testing y Publicación de Custom Nodes

Una vez construido tu custom node, necesitas probarlo exhaustivamente, empaquetarlo y publicarlo para que otros puedan usarlo.

### Testing local

#### Vinculación con N8N

\`\`\`bash
cd n8n-nodes-mi-servicio
npm run build
npm link

cd ~/.n8n
npm link n8n-nodes-mi-servicio
n8n start
\`\`\`

#### Testing con Docker

\`\`\`yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    volumes:
      - ./dist:/home/node/.n8n/custom/n8n-nodes-mi-servicio/dist
      - ./package.json:/home/node/.n8n/custom/n8n-nodes-mi-servicio/package.json
    environment:
      - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
\`\`\`

### Tests unitarios con Jest

#### Instalación

\`\`\`bash
npm install --save-dev jest ts-jest @types/jest n8n-core
\`\`\`

#### Configuración de Jest

\`\`\`json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": ["**/test/**/*.test.ts"],
    "transform": {
      "^.+\\\\.ts$": "ts-jest"
    }
  }
}
\`\`\`

#### Test de credenciales

\`\`\`typescript
import { TaskManagerApi } from '../credentials/TaskManagerApi.credentials';

describe('TaskManagerApi Credentials', () => {
  it('should have correct name', () => {
    const credentials = new TaskManagerApi();
    expect(credentials.name).toBe('taskManagerApi');
  });

  it('should have required properties', () => {
    const credentials = new TaskManagerApi();
    const propertyNames = credentials.properties.map(p => p.name);
    expect(propertyNames).toContain('apiUrl');
    expect(propertyNames).toContain('apiKey');
  });

  it('should mark apiKey as password', () => {
    const credentials = new TaskManagerApi();
    const apiKeyProp = credentials.properties.find(p => p.name === 'apiKey');
    expect(apiKeyProp?.typeOptions?.password).toBe(true);
  });
});
\`\`\`

#### Test de nodo

\`\`\`typescript
import { TaskManager } from '../nodes/TaskManager/TaskManager.node';

describe('TaskManager Node', () => {
  it('should have correct metadata', () => {
    const node = new TaskManager();
    expect(node.description.displayName).toBe('Task Manager');
    expect(node.description.name).toBe('taskManager');
    expect(node.description.inputs).toContain('main');
    expect(node.description.outputs).toContain('main');
  });

  it('should require credentials', () => {
    const node = new TaskManager();
    expect(node.description.credentials).toBeDefined();
    expect(node.description.credentials![0].name).toBe('taskManagerApi');
    expect(node.description.credentials![0].required).toBe(true);
  });

  it('should have CRUD operations', () => {
    const node = new TaskManager();
    const operationProp = node.description.properties.find(
      p => p.name === 'operation'
    ) as any;
    const operationValues = operationProp.options.map((o: any) => o.value);
    expect(operationValues).toContain('create');
    expect(operationValues).toContain('get');
    expect(operationValues).toContain('update');
    expect(operationValues).toContain('delete');
  });
});
\`\`\`

#### Ejecutar tests

\`\`\`bash
npx jest --coverage
\`\`\`

### Publicación en npm

#### Preparar el package

\`\`\`bash
npm run build
npm run lint
npm run prepublishOnly
\`\`\`

#### Verificar package

\`\`\`bash
npm pack --dry-run
\`\`\`

Esto muestra qué archivos se incluirán en el paquete.

#### Publicar

\`\`\`bash
npm login
npm publish --access public
\`\`\`

#### Versionado semántico

\`\`\`bash
npm version patch  # 0.1.0 → 0.1.1 (bug fixes)
npm version minor  # 0.1.0 → 0.2.0 (new features)
npm version major  # 0.1.0 → 1.0.0 (breaking changes)
\`\`\`

### Enviar a la comunidad N8N

#### Requisitos

1. Package publicado en npm con prefijo \`n8n-nodes-\`
2. Keyword \`n8n-community-node-package\` en package.json
3. README con documentación de uso
4. Licencia open-source (MIT recomendado)
5. Icono SVG para el nodo

#### Proceso de submission

1. Publica tu package en npm
2. Ve al repositorio n8n-community-node-packages en GitHub
3. Crea un issue o PR con la información de tu nodo
4. El equipo de N8N revisará y aprobará

### Instalación por usuarios

Los usuarios pueden instalar tu nodo desde N8N:

1. Ve a **Settings** → **Community Nodes**
2. Click en **Install a community node**
3. Ingresa el nombre del package: \`n8n-nodes-mi-servicio\`
4. Click en **Install**

O vía CLI:

\`\`\`bash
n8n install n8n-nodes-mi-servicio
\`\`\`

### CI/CD con GitHub Actions

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
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - run: npm test

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
\`\`\`

### Mejores prácticas de publicación

- **README completo**: Incluye instalación, configuración, ejemplos y screenshots
- **Changelog**: Documenta cambios en cada versión
- **Semantic versioning**: Sigue semver estrictamente
- **Tests**: Mínimo 80% de cobertura de código
- **Linting**: Sin errores ni warnings
- **Tipos estrictos**: \`strict: true\` en tsconfig.json
- **Documentación**: JSDoc en funciones públicas`,
      estimatedMinutes: 20,
      quiz: [
        {
          id: "q-05-04-1",
          question: "¿Qué comando verifica qué archivos se incluirán en el paquete npm?",
          options: [
            "npm check",
            "npm pack --dry-run",
            "npm verify",
            "npm list --production"
          ],
          correctIndex: 1,
          explanation: "npm pack --dry-run muestra qué archivos se incluirían en el paquete sin crearlo realmente, permitiendo verificar que no se incluyan archivos sensibles."
        },
        {
          id: "q-05-04-2",
          question: "¿Cómo instalan los usuarios un custom node desde la interfaz de N8N?",
          options: [
            "Settings → Extensions → Add",
            "Settings → Community Nodes → Install",
            "Workflows → Import Node",
            "Admin → Plugins → Install"
          ],
          correctIndex: 1,
          explanation: "Los usuarios instalan custom nodes desde Settings → Community Nodes → Install a community node, ingresando el nombre del package npm."
        },
        {
          id: "q-05-04-3",
          question: "¿Qué tipo de version incrementa de 0.1.0 a 0.2.0?",
          options: [
            "patch",
            "minor",
            "major",
            "release"
          ],
          correctIndex: 1,
          explanation: "npm version minor incrementa el número minor (0.1.0 → 0.2.0), indicando nuevas funcionalidades sin breaking changes."
        }
      ]
    }
  ]
};
