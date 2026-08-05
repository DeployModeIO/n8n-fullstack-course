import { Module } from "../../types/course";

export const module1: Module = {
  id: "mod-01",
  slug: "fundamentos-infraestructura",
  title: "Fundamentos e Infraestructura",
  description: "Aprende los conceptos básicos de N8N y cómo desplegarlo en diferentes entornos, desde local hasta producción.",
  icon: "Server",
  sortOrder: 1,
  lessons: [
    {
      id: "les-01-01",
      moduleSlug: "fundamentos-infraestructura",
      slug: "introduccion-n8n",
      title: "Introducción a N8N",
      description: "Descubre qué es N8N y por qué es la herramienta líder en automatización de workflows.",
      estimatedMinutes: 15,
      content: `## Introducción a N8N

### ¿Qué es N8N?

N8N es una plataforma de automatización de workflows **open-source** que te permite conectar diferentes aplicaciones y servicios para automatizar tareas repetitivas.

### Características principales:

- **Open Source**: Código abierto y auto-hospedable
- **Visual**: Editor visual de workflows con nodos arrastrables
- **Flexible**: Más de 300 integraciones nativas
- **Extensible**: Puedes crear nodos personalizados
- **Escalable**: Desde uso personal hasta enterprise

### ¿Por qué N8N?

#### Ventajas sobre otras herramientas:

1. **Control total**: Tú controlas tus datos y la infraestructura
2. **Sin límites artificiales**: No hay límites en ejecuciones o nodos
3. **Personalizable**: Adapta la herramienta a tus necesidades
4. **Comunidad activa**: Gran comunidad y documentación extensa
5. **Costo-efectivo**: Gratis para uso personal, licencias accesibles para empresas

### Casos de uso comunes

#### Automatización de marketing:
- Sincronizar leads entre CRM y email marketing
- Publicar contenido en redes sociales automáticamente
- Generar reportes de campañas

#### Operaciones:
- Procesar pedidos automáticamente
- Sincronizar inventario entre plataformas
- Notificaciones de eventos importantes

#### Desarrollo:
- CI/CD pipelines
- Monitoreo de aplicaciones
- Backup automático de bases de datos

### Tu primer workflow

En la próxima lección, aprenderás a instalar N8N y crear tu primer workflow automatizado.

#### Recursos adicionales:
- [Documentación oficial de N8N](https://docs.n8n.io)
- [Comunidad de N8N](https://community.n8n.io)
- [GitHub de N8N](https://github.com/n8n-io/n8n)
`,
      labs: [
        {
          id: "lab-01-01",
          title: "Mapa de valor de N8N para tu empresa",
          objective:
            "Identificar 3 procesos repetitivos en tu día a día que podrían automatizarse con N8N.",
          instructions:
            "1. Lista 5 tareas manuales que realizas cada semana.\n2. Clasifícalas por volumen y dolor (impacto).\n3. Elige las 3 mejor candidatas y describe la entrada, el paso y la salida de cada una.\n4. Señala qué integración nativa de N8N usarías.",
          deliverable:
            "Documento de una página con el mapa de automatizaciones priorizado.",
          difficulty: "easy",
        },
        {
          id: "lab-01-02",
          title: "Instala N8N y exponlo de forma segura",
          objective:
            "Levantar una instancia local de N8N y documentar la configuración de seguridad básica.",
          instructions:
            "1. Ejecuta N8N con Docker o npm.\n2. Configura una variable de entorno para el modo de ejecución (OWN).\n3. Habilita HTTPS con un proxy inverso (ej. Caddy).\n4. Documenta los puertos expuestos y justifica por qué no deben quedar abiertos.",
          deliverable:
            "Captura de la instancia corriendo + diagrama de la capa de proxy.",
          difficulty: "medium",
        },
      ],
    },
    {
      id: "les-01-02",
      moduleSlug: "fundamentos-infraestructura",
      slug: "instalacion-local",
      title: "Instalación Local",
      description: "Aprende a instalar N8N en tu máquina local usando Docker o npm.",
      estimatedMinutes: 20,
      content: `## Instalación Local de N8N

### Métodos de instalación

#### Opción 1: Docker (Recomendado)

Docker es la forma más fácil y consistente de ejecutar N8N.

**Requisitos:**
- Docker instalado en tu sistema
- Docker Compose (opcional pero recomendado)

**Instalación con Docker:**

\`\`\`bash
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  n8nio/n8n
\`\`\`

**Con Docker Compose:**

Crea un archivo \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - ~/.n8n:/home/node/.n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=tu_password_seguro
\`\`\`

Ejecuta:
\`\`\`bash
docker-compose up -d
\`\`\`

#### Opción 2: npm

Si prefieres instalar N8N globalmente:

\`\`\`bash
npm install -g n8n
n8n start
\`\`\`

#### Opción 3: npx (sin instalación)

\`\`\`bash
npx n8n
\`\`\`

### Acceder a N8N

Una vez instalado, abre tu navegador y ve a:
\`\`\`
http://localhost:5678
\`\`\`

### Configuración inicial

1. **Crear cuenta de administrador**
2. **Configurar zona horaria**
3. **Explorar la interfaz**

### Solución de problemas

#### Puerto ocupado:
Si el puerto 5678 está en uso, cambia el mapeo:
\`\`\`bash
docker run -p 8080:5678 n8nio/n8n
\`\`\`

#### Permisos de volumen:
\`\`\`bash
chmod -R 755 ~/.n8n
\`\`\`

### Próximos pasos

En la siguiente lección aprenderás a configurar N8N para producción.
`,
    },
    {
      id: "les-01-03",
      moduleSlug: "fundamentos-infraestructura",
      slug: "configuracion-produccion",
      title: "Configuración para Producción",
      description: "Configura N8N para entornos de producción con seguridad y escalabilidad.",
      estimatedMinutes: 25,
      content: `## Configuración para Producción

### Consideraciones importantes

Antes de desplegar N8N en producción, considera:

1. **Seguridad**: Autenticación, HTTPS, firewalls
2. **Persistencia**: Base de datos externa (PostgreSQL)
3. **Escalabilidad**: Workers múltiples para alta carga
4. **Monitoreo**: Logs y métricas
5. **Backup**: Estrategia de respaldo de datos

### Variables de entorno esenciales

#### Base de datos:
\`\`\`bash
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=tu_password_seguro
\`\`\`

#### Seguridad:
\`\`\`bash
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=password_seguro
N8N_HOST=tu-dominio.com
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://tu-dominio.com/
\`\`\`

#### Ejecución:
\`\`\`bash
EXECUTIONS_MODE=queue
QUEUE_BULL_REDIS_HOST=localhost
QUEUE_BULL_REDIS_PORT=6379
\`\`\`

### Docker Compose para producción

\`\`\`yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: n8n_user
      POSTGRES_PASSWORD: password_seguro
      POSTGRES_DB: n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n_user
      - DB_POSTGRESDB_PASSWORD=password_seguro
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - N8N_HOST=tu-dominio.com
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://tu-dominio.com/
    depends_on:
      - postgres
      - redis
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  postgres_data:
  redis_data:
  n8n_data:
\`\`\`

### Nginx como proxy reverso

\`\`\`nginx
server {
    listen 80;
    server_name tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name tu-dominio.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

### SSL con Let's Encrypt

\`\`\`bash
certbot --nginx -d tu-dominio.com
\`\`\`

### Monitoreo y logs

#### Ver logs en tiempo real:
\`\`\`bash
docker-compose logs -f n8n
\`\`\`

#### Métricas con Prometheus:
Habilita el endpoint de métricas:
\`\`\`bash
N8N_METRICS=true
\`\`\`

### Backup automático

Script de backup diario:
\`\`\`bash
#!/bin/bash
docker exec postgres pg_dump -U n8n_user n8n > backup_$(date +%Y%m%d).sql
\`\`\`

### Checklist de producción

- [ ] Base de datos PostgreSQL configurada
- [ ] Redis para cola de ejecución
- [ ] HTTPS habilitado
- [ ] Autenticación configurada
- [ ] Variables de entorno seguras
- [ ] Backup automático configurado
- [ ] Monitoreo habilitado
- [ ] Firewall configurado
- [ ] Logs centralizados
`,
    },
    {
      id: "les-01-04",
      moduleSlug: "fundamentos-infraestructura",
      slug: "interfaz-n8n",
      title: "Conociendo la Interfaz",
      description: "Explora la interfaz de N8N y aprende a navegar por sus diferentes secciones.",
      estimatedMinutes: 20,
      content: `## Conociendo la Interfaz de N8N

### Vista general

La interfaz de N8N se divide en varias secciones principales:

#### 1. Dashboard principal
- Lista de workflows
- Botón para crear nuevo workflow
- Filtros y búsqueda
- Estadísticas de ejecución

#### 2. Editor de workflows
- Canvas principal para diseñar workflows
- Panel de nodos (izquierda)
- Panel de configuración (derecha)
- Barra de herramientas superior

#### 3. Ejecuciones
- Historial de ejecuciones
- Logs detallados
- Reintentos manuales

#### 4. Credenciales
- Gestión de credenciales de APIs
- Conexiones OAuth
- Tokens de acceso

### El editor de workflows

#### Canvas principal
El área central donde construyes tu workflow arrastrando y conectando nodos.

#### Panel de nodos
- **Trigger nodes**: Inician el workflow
- **Regular nodes**: Procesan datos
- **Flow nodes**: Controlan el flujo

#### Barra de herramientas
- **Save**: Guardar workflow
- **Execute**: Ejecutar workflow manualmente
- **Active**: Activar/desactivar workflow
- **Settings**: Configuración del workflow

### Tipos de nodos

#### Trigger nodes (Disparadores)
- Webhook
- Schedule (Cron)
- Email triggers
- Database triggers

#### Action nodes (Acciones)
- HTTP Request
- Email
- Database queries
- File operations

#### Flow nodes (Control de flujo)
- IF (condicional)
- Switch (múltiples caminos)
- Merge (combinar datos)
- Wait (esperar)

### Navegación rápida

#### Atajos de teclado:
- \`Ctrl + S\`: Guardar
- \`Ctrl + Enter\`: Ejecutar
- \`Ctrl + Z\`: Deshacer
- \`Ctrl + Y\`: Rehacer
- \`Delete\`: Eliminar nodo seleccionado

#### Zoom y navegación:
- Scroll del mouse: Zoom
- Click + arrastrar: Mover canvas
- Doble click en nodo: Editar

### Configuración del workflow

#### Settings importantes:
- **Name**: Nombre del workflow
- **Timezone**: Zona horaria para schedules
- **Error workflow**: Workflow a ejecutar en caso de error
- **Save execution progress**: Guardar progreso de ejecución

### Ejecuciones

#### Ver ejecuciones:
1. Click en "Executions" en el menú
2. Filtra por workflow, estado o fecha
3. Click en una ejecución para ver detalles

#### Detalles de ejecución:
- Input data
- Output data
- Tiempo de ejecución
- Logs completos
- Errores (si los hay)

### Credenciales

#### Crear credenciales:
1. Ve a "Credentials"
2. Click en "New"
3. Selecciona el tipo (OAuth2, API Key, etc.)
4. Completa los campos requeridos
5. Guarda

#### Tipos comunes:
- **OAuth2**: Para Google, GitHub, etc.
- **Header Auth**: API keys en headers
- **Basic Auth**: Usuario y contraseña
- **Query Auth**: API keys en query params

### Tips y trucos

#### Organización:
- Usa nombres descriptivos para nodos
- Agrupa nodos relacionados con notas
- Usa colores para identificar tipos de nodos

#### Debugging:
- Ejecuta nodo por nodo
- Inspecciona datos en cada paso
- Usa el nodo "No Operation" para debuggear

#### Performance:
- Evita loops innecesarios
- Usa batch processing cuando sea posible
- Limita la cantidad de datos procesados

### Próximos pasos

Ahora que conoces la interfaz, en la siguiente lección crearás tu primer workflow completo.
`,
    },
    {
      id: "les-01-05",
      moduleSlug: "fundamentos-infraestructura",
      slug: "primer-workflow",
      title: "Tu Primer Workflow",
      description: "Crea tu primer workflow completo: desde un trigger hasta la acción final.",
      estimatedMinutes: 30,
      content: `## Tu Primer Workflow

### Objetivo

Crear un workflow que:
1. Reciba datos de un webhook
2. Procese la información
3. Envíe un email de confirmación

### Paso 1: Crear el workflow

1. Click en "New Workflow"
2. Nombra tu workflow: "Mi Primer Workflow"
3. Guarda con Ctrl + S

### Paso 2: Agregar trigger

#### Webhook node:
1. Click en el botón "+" para agregar un nodo
2. Busca "Webhook"
3. Configura:
   - **HTTP Method**: POST
   - **Path**: mi-primer-webhook
   - **Response Mode**: When Last Node Finishes

#### URL del webhook:
\`\`\`
https://tu-instancia.com/webhook/mi-primer-webhook
\`\`\`

### Paso 3: Procesar datos

#### Function node:
1. Agrega un nodo "Function"
2. Conecta el webhook al function
3. Código:

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const nombre = item.json.nombre || 'Usuario';
  const email = item.json.email;
  
  results.push({
    json: {
      nombre,
      email,
      mensaje: \`Hola \${nombre}, gracias por contactarnos!\`,
      timestamp: new Date().toISOString()
    }
  });
}

return results;
\`\`\`

### Paso 4: Enviar email

#### Email node (Gmail):
1. Agrega un nodo "Gmail"
2. Configura credenciales OAuth2
3. Configura:
   - **To**: \`={{ $json.email }}\`
   - **Subject**: "Confirmación de contacto"
   - **Body**: \`={{ $json.mensaje }}\`

### Paso 5: Probar el workflow

#### Ejecución manual:
1. Click en "Execute Workflow"
2. Envía datos de prueba al webhook:

\`\`\`bash
curl -X POST https://tu-instancia.com/webhook/mi-primer-webhook \\
  -H "Content-Type: application/json" \\
  -d '{"nombre": "Juan", "email": "juan@example.com"}'
\`\`\`

#### Ver resultados:
- Revisa la ejecución en "Executions"
- Verifica que el email fue enviado
- Inspecciona los datos en cada nodo

### Paso 6: Activar el workflow

1. Toggle "Active" en la barra superior
2. El webhook ahora está escuchando
3. Prueba con datos reales

### Workflow completo

\`\`\`
[Webhook] → [Function] → [Gmail]
\`\`\`

### Mejoras posibles

#### Agregar validación:
\`\`\`javascript
if (!item.json.email) {
  throw new Error('Email es requerido');
}
\`\`\`

#### Agregar error handling:
- Crea un "Error Workflow"
- Configúralo en Settings
- Envía notificaciones de error

#### Agregar base de datos:
- Guarda los contactos en una BD
- Usa el nodo "PostgreSQL" o "MySQL"

### Debugging

#### Problemas comunes:

**Webhook no responde:**
- Verifica que el workflow esté activo
- Revisa la URL del webhook
- Comprueba los logs

**Email no se envía:**
- Verifica credenciales OAuth2
- Revisa permisos de Gmail
- Inspecciona el nodo de email

**Datos incorrectos:**
- Usa "Execute Node" en cada paso
- Inspecciona los datos de entrada/salida
- Verifica las expresiones

### Recursos adicionales

- [Documentación de Webhooks](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Expresiones en N8N](https://docs.n8n.io/code/expressions/)
- [Manejo de errores](https://docs.n8n.io/flow-logic/error-handling/)

### ¡Felicidades!

Has creado tu primer workflow funcional. En los próximos módulos aprenderás técnicas avanzadas para workflows más complejos.
`,
    },
  ],
};
