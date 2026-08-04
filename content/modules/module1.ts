import { Module } from "../../types/course";

export const module1: Module = {
  id: "mod-01",
  slug: "fundamentos-infraestructura",
  title: "Fundamentos e Infraestructura",
  description: "Domina los fundamentos de N8N, desde la instalación con Docker hasta el despliegue en producción con PostgreSQL y configuraciones profesionales.",
  icon: "Server",
  sortOrder: 1,
  lessons: [
    {
      id: "les-01-01",
      moduleSlug: "fundamentos-infraestructura",
      slug: "introduccion-n8n",
      title: "Introducción a N8N: ¿Qué es y por qué automatizar?",
      description: "Descubre qué es N8N, por qué la automatización de flujos de trabajo es esencial en el desarrollo moderno, y cómo se compara con alternativas como Zapier y Make.",
      content: `## ¿Qué es N8N?

N8N (pronunciado "nodemation") es una plataforma de automatización de flujos de trabajo **open-source** que permite conectar aplicaciones, servicios y APIs mediante una interfaz visual de nodos. A diferencia de soluciones propietarias, N8N te da control total sobre tu infraestructura, datos y lógica de automatización.

### ¿Por qué automatización?

En el desarrollo moderno, los equipos pierden horas en tareas repetitivas: mover datos entre sistemas, enviar notificaciones, sincronizar bases de datos, procesar formularios. La automatización elimina este trabajo manual y reduce errores humanos.

**Beneficios clave de la automatización:**

- **Eficiencia operativa**: Tareas que tomaban horas se ejecutan en segundos
- **Consistencia**: Elimina errores humanos en procesos repetitivos
- **Escalabilidad**: Los flujos automatizados manejan volúmenes crecientes sin esfuerzo adicional
- **Visibilidad**: Cada ejecución queda registrada para auditoría y debugging

### N8N vs Zapier vs Make

| Característica | N8N | Zapier | Make (Integromat) |
|---|---|---|---|
| Código abierto | Sí | No | No |
| Self-hosted | Sí | No | No |
| Precio | Gratis (self-hosted) | Desde $19.99/mes | Desde $9/mes |
| Código personalizado | JS + Python | Limitado | Limitado |
| Nodos personalizados | Sí | No | No |
| Control de datos | Total | En servidores de Zapier | En servidores de Make |

### Ventajas Open-Source

El modelo open-source de N8N ofrece ventajas significativas para desarrolladores y empresas:

1. **Soberanía de datos**: Tus datos nunca salen de tu infraestructura
2. **Extensibilidad**: Puedes crear nodos personalizados para cualquier API
3. **Sin límites artificiales**: No hay restricciones en ejecuciones ni tareas
4. **Comunidad activa**: Miles de contribuidores mejoran la plataforma constantemente
5. **Transparencia**: Puedes auditar el código fuente completo

### Casos de uso reales

- **Sincronización CRM-ERP**: Conectar HubSpot con SAP automáticamente
- **Procesamiento de leads**: Capturar formularios, enriquecer datos, asignar a vendedores
- **Monitorización**: Alertas automáticas cuando métricas superan umbrales
- **Content pipeline**: Publicar contenido en múltiples plataformas simultáneamente
- **Soporte al cliente**: Clasificar tickets con IA y routing automático`,
      estimatedMinutes: 15,
      quiz: [
        {
          id: "q-01-01-1",
          question: "¿Cuál es la principal ventaja de N8N sobre Zapier?",
          options: [
            "Tiene más integraciones nativas",
            "Es open-source y permite self-hosting",
            "Es más rápido en ejecución",
            "Tiene mejor interfaz gráfica"
          ],
          correctIndex: 1,
          explanation: "N8N es open-source y permite self-hosting, lo que da control total sobre datos, infraestructura y costos sin límites artificiales de ejecuciones."
        },
        {
          id: "q-01-01-2",
          question: "¿Qué lenguajes soporta el Code node de N8N?",
          options: [
            "Solo JavaScript",
            "JavaScript y Python",
            "JavaScript, Python y Ruby",
            "Cualquier lenguaje via Docker"
          ],
          correctIndex: 1,
          explanation: "El Code node de N8N soporta JavaScript y Python, permitiendo lógica personalizada dentro de los flujos de trabajo."
        },
        {
          id: "q-01-01-3",
          question: "¿Qué significa 'soberanía de datos' en el contexto de N8N?",
          options: [
            "Que N8N cumple con GDPR automáticamente",
            "Que los datos se encriptan en tránsito",
            "Que tus datos nunca salen de tu infraestructura",
            "Que N8N almacena backups en múltiples regiones"
          ],
          correctIndex: 2,
          explanation: "La soberanía de datos significa que al hacer self-hosting, tus datos permanecen en tu infraestructura y nunca se envían a servidores de terceros."
        }
      ]
    },
    {
      id: "les-01-02",
      moduleSlug: "fundamentos-infraestructura",
      slug: "instalacion-docker",
      title: "Instalación con Docker",
      description: "Aprende a instalar N8N usando Docker y docker-compose, configurando variables de entorno para un entorno de desarrollo profesional.",
      content: `## Instalación de N8N con Docker

Docker es la forma recomendada de ejecutar N8N. Proporciona aislamiento, reproducibilidad y facilidad de actualización.

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Docker** (v20.10 o superior)
- **Docker Compose** (v2.0 o superior)
- Al menos 2GB de RAM disponible

### Instalación de Docker

En **Ubuntu/Debian**:

\`\`\`bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
\`\`\`

En **Windows/Mac**, descarga Docker Desktop desde docker.com.

### Docker Compose básico

Crea un archivo \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=tu_password_seguro
      - N8N_HOST=tu-dominio.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://tu-dominio.com/
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

volumes:
  n8n_data:
\`\`\`

### Variables de entorno explicadas

| Variable | Descripción |
|---|---|
| \`N8N_BASIC_AUTH_ACTIVE\` | Activa autenticación básica |
| \`N8N_BASIC_AUTH_USER\` | Usuario para login |
| \`N8N_BASIC_AUTH_PASSWORD\` | Contraseña para login |
| \`N8N_HOST\` | Hostname público |
| \`WEBHOOK_URL\` | URL base para webhooks (debe ser pública) |
| \`N8N_PROTOCOL\` | Protocolo (http/https) |

### Configuración avanzada con PostgreSQL

Para producción, usa PostgreSQL en lugar de SQLite:

\`\`\`yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=db_password_seguro
      - WEBHOOK_URL=https://tu-dominio.com/
    depends_on:
      - postgres
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: n8n-postgres
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=db_password_seguro
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  n8n_data:
  postgres_data:
\`\`\`

### Comandos esenciales

\`\`\`bash
docker compose up -d
docker compose logs -f n8n
docker compose down
docker compose pull
docker compose up -d
\`\`\`

### Tips de producción

- **Nunca uses \`latest\`** en producción; fija una versión específica
- **Usa secrets de Docker** para credenciales en lugar de variables en texto plano
- **Configura healthchecks** para monitorizar el estado del contenedor
- **Limita recursos** con \`deploy.resources.limits\` en el compose`,
      estimatedMinutes: 20,
      n8nWorkflowJson: {
        name: "Health Check",
        nodes: [
          {
            parameters: { rule: { interval: [{ field: "minutes", minutesInterval: 5 }] } },
            id: "schedule-1",
            name: "Cada 5 minutos",
            type: "n8n-nodes-base.scheduleTrigger",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: { url: "http://localhost:5678/healthz", options: {} },
            id: "http-1",
            name: "Health Check",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 4,
            position: [470, 300]
          }
        ],
        connections: {
          "Cada 5 minutos": { main: [[{ node: "Health Check", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-01-02-1",
          question: "¿Qué base de datos usa N8N por defecto sin configuración adicional?",
          options: ["MySQL", "PostgreSQL", "SQLite", "MongoDB"],
          correctIndex: 2,
          explanation: "N8N usa SQLite por defecto, lo cual es adecuado para desarrollo pero no recomendado para producción donde se debe usar PostgreSQL."
        },
        {
          id: "q-01-02-2",
          question: "¿Qué variable de entorno define la URL pública para webhooks?",
          options: ["N8N_HOST", "WEBHOOK_URL", "N8N_PROTOCOL", "N8N_ENDPOINT_WEBHOOK"],
          correctIndex: 1,
          explanation: "WEBHOOK_URL define la URL base pública que N8N usa para generar las URLs de webhook. Debe ser accesible desde internet."
        },
        {
          id: "q-01-02-3",
          question: "¿Por qué no se recomienda usar la tag 'latest' en producción?",
          options: [
            "Porque es más lenta",
            "Porque no tiene soporte",
            "Porque puede introducir cambios breaking sin control",
            "Porque requiere más recursos"
          ],
          correctIndex: 2,
          explanation: "La tag 'latest' puede traer cambios breaking sin previo aviso. En producción se debe fijar una versión específica para garantizar estabilidad."
        }
      ]
    },
    {
      id: "les-01-03",
      moduleSlug: "fundamentos-infraestructura",
      slug: "despliegue-produccion",
      title: "Despliegue en Producción",
      description: "Despliega N8N en servidores VPS (Hetzner, DigitalOcean), Railway y Render con SSL, dominio personalizado y reverse proxy con nginx.",
      content: `## Despliegue en Producción

Desplegar N8N en producción requiere considerar SSL, dominio personalizado, reverse proxy y estrategia de backups.

### Opción 1: VPS (Hetzner/DigitalOcean)

Un VPS te da máximo control y mejor relación costo-rendimiento.

**Hetzner** ofrece servidores desde €3.79/mes con excelente rendimiento.

#### Configuración del servidor

\`\`\`bash
apt update && apt upgrade -y
apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx
systemctl enable docker nginx
\`\`\`

#### Nginx Reverse Proxy

\`\`\`nginx
server {
    listen 80;
    server_name n8n.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name n8n.tu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/n8n.tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/n8n.tu-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

#### SSL con Let's Encrypt

\`\`\`bash
certbot --nginx -d n8n.tu-dominio.com
\`\`\`

Certbot renueva automáticamente los certificados cada 90 días.

### Opción 2: Railway

Railway ofrece deploy con un clic desde GitHub:

1. Conecta tu repositorio en Railway
2. Añade las variables de entorno en el dashboard
3. Railway asigna un dominio automáticamente o usa el tuyo

**Ventajas**: Zero-config, auto-scaling, SSL automático.
**Desventajas**: Más costoso a escala, menos control.

### Opción 3: Render

Render ofrece servicios web con Docker:

1. Crea un nuevo Web Service desde Docker
2. Configura las variables de entorno
3. Render maneja SSL, CDN y deployments

### Configuración DNS

Configura un registro A o CNAME apuntando a tu servidor:

\`\`\`
n8n.tu-dominio.com  A  →  123.45.67.89
\`\`\`

### Docker Compose para producción

\`\`\`yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:1.48.0
    environment:
      - N8N_HOST=n8n.tu-dominio.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.tu-dominio.com/
      - GENERIC_TIMEZONE=America/Mexico_City
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=\${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=\${POSTGRES_PASSWORD}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
\`\`\`

### Checklist de producción

- [ ] SSL configurado y verificado
- [ ] Dominio apuntando correctamente
- [ ] PostgreSQL como base de datos
- [ ] Variables de entorno en archivo .env (no en docker-compose)
- [ ] Backups automáticos configurados
- [ ] Firewall configurado (solo puertos 80, 443)
- [ ] Monitoring activo (Uptime, logs)`,
      estimatedMinutes: 25,
      quiz: [
        {
          id: "q-01-03-1",
          question: "¿Qué header de nginx es esencial para que los webhooks de N8N funcionen correctamente detrás de un proxy?",
          options: [
            "X-Frame-Options",
            "X-Forwarded-Proto",
            "Content-Security-Policy",
            "Strict-Transport-Security"
          ],
          correctIndex: 1,
          explanation: "X-Forwarded-Proto le indica a N8N si la petición original era HTTP o HTTPS, lo cual es esencial para generar URLs de webhook correctas."
        },
        {
          id: "q-01-03-2",
          question: "¿Cada cuántos días renueva Certbot los certificados SSL automáticamente?",
          options: ["30 días", "60 días", "90 días", "365 días"],
          correctIndex: 2,
          explanation: "Let's Encrypt emite certificados válidos por 90 días y Certbot los renueva automáticamente antes de que expiren."
        },
        {
          id: "q-01-03-3",
          question: "¿Cuál es la principal ventaja de usar un VPS sobre Railway o Render?",
          options: [
            "Es más fácil de configurar",
            "Tiene SSL automático",
            "Máximo control y mejor relación costo-rendimiento",
            "No requiere conocimientos de Docker"
          ],
          correctIndex: 2,
          explanation: "Un VPS ofrece control total sobre la infraestructura, mejor rendimiento por el costo, pero requiere más configuración manual."
        }
      ]
    },
    {
      id: "les-01-04",
      moduleSlug: "fundamentos-infraestructura",
      slug: "configuracion-postgresql",
      title: "Configuración de PostgreSQL y Redis",
      description: "Configura PostgreSQL dedicado para N8N, Redis para cola de trabajos, y estrategias de backup para garantizar la persistencia de datos.",
      content: `## PostgreSQL para N8N

N8N almacena workflows, ejecuciones, credenciales y configuraciones en su base de datos. Para producción, PostgreSQL es la opción recomendada.

### ¿Por qué PostgreSQL?

- **Rendimiento**: Maneja miles de ejecuciones concurrentes
- **Fiabilidad**: ACID compliance, recuperación ante fallos
- **Escalabilidad**: Soporta replicación y clustering
- **Madurez**: Ecosistema robusto de herramientas

### Configuración optimizada

\`\`\`yaml
postgres:
  image: postgres:16-alpine
  container_name: n8n-postgres
  environment:
    POSTGRES_USER: n8n
    POSTGRES_PASSWORD: \${DB_PASSWORD}
    POSTGRES_DB: n8n
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./init.sql:/docker-entrypoint-initdb.d/init.sql
  command: >
    postgres
    -c shared_buffers=256MB
    -c effective_cache_size=768MB
    -c work_mem=16MB
    -c maintenance_work_mem=128MB
    -c max_connections=200
    -c wal_level=replica
    -c max_wal_senders=3
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U n8n"]
    interval: 5s
    timeout: 5s
    retries: 10
  restart: unless-stopped
\`\`\`

### Archivo init.sql

\`\`\`sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '768MB';
ALTER SYSTEM SET work_mem = '16MB';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_execution_workflow
ON execution_entity("workflowId");

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_execution_finished
ON execution_entity(finished);
\`\`\`

### Redis para Queue Mode

Redis permite distribuir trabajos entre múltiples workers de N8N:

\`\`\`yaml
redis:
  image: redis:7-alpine
  container_name: n8n-redis
  command: redis-server --requirepass \${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru
  volumes:
    - redis_data:/data
  healthcheck:
    test: ["CMD", "redis-cli", "-a", "\${REDIS_PASSWORD}", "ping"]
    interval: 5s
    timeout: 5s
    retries: 10
  restart: unless-stopped
\`\`\`

### Variables para Queue Mode en N8N

\`\`\`yaml
n8n:
  environment:
    - EXECUTIONS_MODE=queue
    - QUEUE_BULL_REDIS_HOST=redis
    - QUEUE_BULL_REDIS_PORT=6379
    - QUEUE_BULL_REDIS_PASSWORD=\${REDIS_PASSWORD}
    - QUEUE_WORKER_TIMEOUT=300
    - QUEUE_WORKER_CONCURRENCY=10
\`\`\`

### Estrategias de Backup

#### Backup automático con pg_dump

\`\`\`bash
#!/bin/bash
BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

pg_dump -h localhost -U n8n -d n8n -F c -f "$BACKUP_DIR/n8n_$TIMESTAMP.dump"

find "$BACKUP_DIR" -name "n8n_*.dump" -mtime +7 -delete
\`\`\`

#### Backup con WAL-G (Point-in-Time Recovery)

Para recuperación punto-en-el-tiempo, configura WAL archiving:

\`\`\`yaml
postgres:
  environment:
    - POSTGRES_INITDB_ARGS=--wal-segsize=16
  volumes:
    - ./wal-archive:/var/lib/postgresql/wal-archive
\`\`\`

### Monitoreo de PostgreSQL

Queries útiles para diagnosticar rendimiento:

\`\`\`sql
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
SELECT pg_size_pretty(pg_database_size('n8n'));
SELECT schemaname, relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC;
\`\`\`

### Mantenimiento

\`\`\`sql
VACUUM ANALYZE;
REINDEX DATABASE n8n;
\`\`\`

Ejecuta VACUUM semanalmente y monitorea el tamaño de la tabla \`execution_entity\`, que crece rápidamente.`,
      estimatedMinutes: 20,
      quiz: [
        {
          id: "q-01-04-1",
          question: "¿Qué variable de entorno activa el modo cola (queue mode) en N8N?",
          options: [
            "N8N_QUEUE_MODE=true",
            "EXECUTIONS_MODE=queue",
            "QUEUE_ENABLED=true",
            "N8N_WORKERS=auto"
          ],
          correctIndex: 1,
          explanation: "EXECUTIONS_MODE=queue activa el modo cola en N8N, que distribuye trabajos entre workers usando Redis como broker."
        },
        {
          id: "q-01-04-2",
          question: "¿Qué tabla de N8N crece más rápido y requiere mantenimiento frecuente?",
          options: [
            "workflow_entity",
            "credentials_entity",
            "execution_entity",
            "user"
          ],
          correctIndex: 2,
          explanation: "La tabla execution_entity almacena el historial de todas las ejecuciones y crece rápidamente. Requiere limpieza periódica y VACUUM."
        },
        {
          id: "q-01-04-3",
          question: "¿Qué política de Redis se recomienda para manejar el límite de memoria?",
          options: [
            "noeviction",
            "allkeys-lru",
            "volatile-ttl",
            "allkeys-random"
          ],
          correctIndex: 1,
          explanation: "allkeys-lru (Least Recently Used) elimina las claves menos usadas cuando se alcanza el límite de memoria, ideal para colas de trabajo."
        }
      ]
    },
    {
      id: "les-01-05",
      moduleSlug: "fundamentos-infraestructura",
      slug: "primer-workflow",
      title: "Tu Primer Workflow",
      description: "Crea tu primer workflow completo: webhook trigger, petición HTTP y envío de email. Incluye el JSON del workflow para importar directamente.",
      content: `## Tu Primer Workflow en N8N

Vamos a crear un workflow que recibe datos vía webhook, los procesa con una petición HTTP y envía un email con los resultados.

### Arquitectura del workflow

\`\`\`
[Webhook] → [HTTP Request] → [Send Email]
\`\`\`

**Caso de uso**: Un formulario web envía datos de contacto, N8N enriquece los datos consultando una API externa y notifica al equipo de ventas por email.

### Paso 1: Webhook Trigger

El nodo Webhook crea un endpoint HTTP que recibe datos:

1. Añade un nodo **Webhook**
2. Configura el método HTTP como **POST**
3. Copia la URL del webhook (test o production)
4. Activa el workflow

La URL del webhook tiene este formato:
\`\`\`
https://n8n.tu-dominio.com/webhook/contact-form
\`\`\`

### Paso 2: HTTP Request

El nodo HTTP Request consulta una API para enriquecer datos:

1. Añade un nodo **HTTP Request**
2. Método: **GET**
3. URL: \`https://api.enriquecimiento.com/v1/lookup?email={{ $json.email }}\`
4. Autenticación: Header Auth con tu API key

### Paso 3: Send Email

El nodo Email envía la notificación:

1. Añade un nodo **Send Email** (o Gmail node)
2. Configura SMTP o credenciales de Gmail
3. To: \`ventas@tuempresa.com\`
4. Subject: \`Nuevo lead: {{ $json.nombre }}\`
5. Body con datos del lead

### Testing del workflow

Para probar, envía un POST al webhook:

\`\`\`bash
curl -X POST https://n8n.tu-dominio.com/webhook/contact-form \\
  -H "Content-Type: application/json" \\
  -d '{"nombre": "Juan Pérez", "email": "juan@ejemplo.com", "empresa": "TechCorp"}'
\`\`\`

### Modo Test vs Producción

- **Test URL**: Solo funciona con el editor abierto y "Execute Workflow" activo
- **Production URL**: Funciona siempre que el workflow esté activado

### Debugging

N8N muestra los datos de cada nodo después de la ejecución:

- **Input**: Datos que recibió el nodo
- **Output**: Datos que produjo el nodo
- **JSON/Schema/Table**: Vistas diferentes de los datos

### Manejo de errores básico

Añade un **Error Trigger** para capturar fallos:

\`\`\`
[Error Trigger] → [Send Email (Error Alert)]
\`\`\`

Esto envía un email cuando cualquier nodo del workflow falla.

### Activación del workflow

Una vez probado, activa el workflow con el toggle en la esquina superior derecha. El webhook de producción estará activo y procesará peticiones automáticamente.

### Tips para tu primer workflow

- Usa el **modo test** antes de activar en producción
- Revisa la pestaña **Executions** para ver el historial
- Configura **timeout** en nodos HTTP para evitar esperas infinitas
- Usa **expresiones** \`{{ $json.campo }}\` para acceder a datos de nodos anteriores`,
      estimatedMinutes: 15,
      n8nWorkflowJson: {
        name: "Lead Enrichment Pipeline",
        nodes: [
          {
            parameters: {
              httpMethod: "POST",
              path: "contact-form",
              responseMode: "responseNode",
              options: {}
            },
            id: "webhook-1",
            name: "Webhook - Formulario",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300],
            webhookId: "contact-form"
          },
          {
            parameters: {
              method: "GET",
              url: "=https://api.enriquecimiento.com/v1/lookup?email={{ $json.email }}",
              authentication: "genericCredentialType",
              genericAuthType: "httpHeaderAuth",
              options: { timeout: 10000 }
            },
            id: "http-1",
            name: "Enriquecer Datos",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 4,
            position: [470, 300]
          },
          {
            parameters: {
              fromEmail: "n8n@tuempresa.com",
              toEmail: "ventas@tuempresa.com",
              subject: "=Nuevo lead: {{ $json.nombre }}",
              emailType: "text",
              message: "=Nuevo lead recibido:\\n\\nNombre: {{ $json.nombre }}\\nEmail: {{ $json.email }}\\nEmpresa: {{ $json.empresa }}\\n\\nDatos enriquecidos:\\n{{ JSON.stringify($json.enrichment) }}"
            },
            id: "email-1",
            name: "Notificar Ventas",
            type: "n8n-nodes-base.emailSend",
            typeVersion: 2,
            position: [690, 300]
          },
          {
            parameters: {
              respondWith: "json",
              responseBody: "={{ JSON.stringify({ success: true, message: 'Lead procesado correctamente' }) }}"
            },
            id: "respond-1",
            name: "Responder OK",
            type: "n8n-nodes-base.respondToWebhook",
            typeVersion: 1,
            position: [910, 300]
          }
        ],
        connections: {
          "Webhook - Formulario": { main: [[{ node: "Enriquecer Datos", type: "main", index: 0 }]] },
          "Enriquecer Datos": { main: [[{ node: "Notificar Ventas", type: "main", index: 0 }]] },
          "Notificar Ventas": { main: [[{ node: "Responder OK", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-01-05-1",
          question: "¿Cuál es la diferencia entre la URL de test y la de producción en un webhook de N8N?",
          options: [
            "La URL de test es más rápida",
            "La URL de test solo funciona con el editor abierto y Execute Workflow activo",
            "La URL de producción requiere autenticación adicional",
            "No hay diferencia, son la misma URL"
          ],
          correctIndex: 1,
          explanation: "La URL de test solo captura datos cuando el editor de N8N está abierto y se ejecuta manualmente. La URL de producción funciona siempre que el workflow esté activado."
        },
        {
          id: "q-01-05-2",
          question: "¿Cómo se accede a datos de un nodo anterior en una expresión de N8N?",
          options: [
            "{{ previousNode.data }}",
            "{{ $json.campo }}",
            "{{ input.campo }}",
            "{{ data.anterior.campo }}"
          ],
          correctIndex: 1,
          explanation: "La sintaxis {{ $json.campo }} accede a los datos JSON de salida del nodo inmediatamente anterior en el flujo."
        },
        {
          id: "q-01-05-3",
          question: "¿Qué nodo se usa para capturar errores de cualquier workflow?",
          options: [
            "Catch Error",
            "Error Trigger",
            "Error Handler",
            "Try-Catch"
          ],
          correctIndex: 1,
          explanation: "El Error Trigger es un nodo especial que se ejecuta automáticamente cuando cualquier workflow falla, permitiendo enviar alertas o ejecutar lógica de recuperación."
        }
      ]
    }
  ]
};
