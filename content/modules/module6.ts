import { Module } from "../../types/course";

export const module6: Module = {
  id: "mod-06",
  slug: "escalabilidad-seguridad",
  title: "Escalabilidad y Seguridad",
  description: "Escala N8N para producción: error handling, Docker con workers, Kubernetes y hardening de seguridad.",
  icon: "Shield",
  sortOrder: 6,
  lessons: [
    {
      id: "les-06-01",
      moduleSlug: "escalabilidad-seguridad",
      slug: "error-handling",
      title: "Error Handling y Alertas",
      description: "Implementa manejo global de errores, patrones try-catch, lógica de retry y alertas con Slack y email.",
      content: `## Error Handling y Alertas

El manejo robusto de errores es esencial para workflows de producción. Un error no manejado puede detener procesos críticos de negocio.

### Tipos de errores en N8N

| Tipo | Causa | Ejemplo |
|---|---|---|
| **Node error** | Fallo en un nodo específico | API timeout, credenciales inválidas |
| **Expression error** | Expresión inválida | Campo no existe, tipo incorrecto |
| **Workflow error** | Error de lógica del flujo | Datos faltantes, formato inesperado |
| **System error** | Fallo de infraestructura | OOM, disco lleno, red caída |

### Error Workflow (Global)

El Error Workflow se ejecuta automáticamente cuando cualquier workflow falla:

1. Crea un nuevo workflow con un **Error Trigger** node
2. En Settings → Workflow Settings → Error Workflow, selecciona este workflow

\`\`\`json
{
  "name": "Global Error Handler",
  "nodes": [
    {
      "parameters": {},
      "name": "Error Trigger",
      "type": "n8n-nodes-base.errorTrigger",
      "typeVersion": 1,
      "position": [250, 300]
    }
  ]
}
\`\`\`

El Error Trigger proporciona:

\`\`\`json
{
  "execution": {
    "id": "123",
    "url": "https://n8n.example.com/execution/123",
    "error": {
      "message": "Request failed with status code 500",
      "name": "NodeApiError"
    }
  },
  "workflow": {
    "id": "abc",
    "name": "Lead Processing"
  }
}
\`\`\`

### Patrón: Alerta en Slack

\`\`\`
[Error Trigger]
  → [Code: Formatear mensaje]
  → [Slack: Enviar a #alerts]
  → [Supabase: Registrar error]
\`\`\`

#### Formatear mensaje de error

\`\`\`javascript
const { execution, workflow } = $input.first().json;

const blocks = [
  {
    type: 'header',
    text: { type: 'plain_text', text: 'Workflow Error Alert' }
  },
  {
    type: 'section',
    fields: [
      { type: 'mrkdwn', text: \`*Workflow:*\\n\${workflow.name}\` },
      { type: 'mrkdwn', text: \`*Execution ID:*\\n\${execution.id}\` },
      { type: 'mrkdwn', text: \`*Error:*\\n\${execution.error.message}\` },
      { type: 'mrkdwn', text: \`*Time:*\\n<!date^\${Math.floor(Date.now()/1000)}^{date_short_pretty} at {time}|just now>\` }
    ]
  },
  {
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: { type: 'plain_text', text: 'View Execution' },
        url: execution.url
      }
    ]
  }
];

return [{ json: { blocks } }];
\`\`\`

### Patrón: Retry con backoff exponencial

\`\`\`
[HTTP Request] → (error) → [Code: Calcular delay] → [Wait] → [HTTP Request (retry)]
\`\`\`

#### Implementación

\`\`\`javascript
const maxRetries = 3;
const baseDelay = 1000;

const retryCount = $json._retryCount || 0;

if (retryCount >= maxRetries) {
  return [{ json: { _failed: true, _error: 'Max retries exceeded', _retryCount } }];
}

const delay = baseDelay * Math.pow(2, retryCount);

return [{
  json: {
    ...$json,
    _retryCount: retryCount + 1,
    _nextDelay: delay
  }
}];
\`\`\`

### Continue On Fail

Configura nodos individuales para continuar en caso de error:

\`\`\`json
{
  "options": {
    "continueOnFail": true
  }
}
\`\`\`

Luego verifica si hubo error:

\`\`\`javascript
if ($json.error) {
  return [{ json: { _failed: true, _error: $json.error.message, _originalData: $json } }];
}
return [{ json: $json }];
\`\`\`

### Patrón: Circuit Breaker

Evita saturar servicios que están fallando:

\`\`\`javascript
const serviceKey = 'api-externa';
const failureThreshold = 5;
const resetTimeout = 60000;

const state = await this.helpers.httpRequest({
  method: 'GET',
  url: \`http://redis:6379/circuit:\${serviceKey}\`
});

const circuitState = JSON.parse(state.body || '{"failures":0,"state":"closed"}');

if (circuitState.state === 'open') {
  const elapsed = Date.now() - circuitState.openedAt;
  if (elapsed < resetTimeout) {
    return [{ json: { _circuitOpen: true, _service: serviceKey } }];
  }
  circuitState.state = 'half-open';
}

return [{ json: { ...$json, _circuitState: circuitState } }];
\`\`\`

### Patrón: Dead Letter Queue

Guarda items fallidos para reprocesamiento posterior:

\`\`\`
[Cualquier nodo] → (error) → [Code: Formatear DLQ item]
  → [Supabase: Insertar en dead_letter_queue]
  → [Slack: Alertar]

[Schedule cada hora] → [Supabase: Leer DLQ]
  → [SplitInBatches] → [Reintentar] → (success) → [Supabase: Eliminar de DLQ]
\`\`\`

#### Estructura de DLQ en Supabase

\`\`\`sql
CREATE TABLE dead_letter_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  workflow_name TEXT NOT NULL,
  execution_id TEXT,
  node_name TEXT,
  error_message TEXT,
  input_data JSONB,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_retry_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);
\`\`\`

### Alertas por email

\`\`\`json
{
  "fromEmail": "n8n-alerts@tuempresa.com",
  "toEmail": "devops@tuempresa.com",
  "subject": "=ALERT: {{ $json.workflow.name }} failed",
  "emailType": "html",
  "message": "=<h2>Workflow Error</h2><p><strong>Workflow:</strong> {{ $json.workflow.name }}</p><p><strong>Error:</strong> {{ $json.execution.error.message }}</p><p><a href='{{ $json.execution.url }}'>View Execution</a></p>"
}
\`\`\`

### Dashboard de errores

Crea un workflow que genere un dashboard de salud:

\`\`\`
[Schedule: cada hora]
  → [Supabase: Contar errores últimas 24h]
  → [Supabase: Contar ejecuciones exitosas]
  → [Code: Calcular métricas]
  → [Google Sheets: Actualizar dashboard]
  → [IF: error rate > 5%] → [Slack: Alerta crítica]
\`\`\`

### Mejores prácticas

- **Siempre configura un Error Workflow global** en producción
- **Usa Continue On Fail** en nodos que pueden fallar sin ser críticos
- **Implementa retry con backoff** para APIs inestables
- **Monitorea la tasa de errores** y configura alertas proactivas
- **Usa Dead Letter Queue** para reprocesamiento automático
- **Loggea todos los errores** en una base de datos para análisis posterior
- **Configura alertas en Slack** para errores críticos en tiempo real`,
      estimatedMinutes: 22,
      n8nWorkflowJson: {
        name: "Global Error Handler",
        nodes: [
          {
            parameters: {},
            id: "error-trigger",
            name: "Error Trigger",
            type: "n8n-nodes-base.errorTrigger",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: {
              method: "POST",
              url: "https://hooks.slack.com/services/xxx/yyy/zzz",
              sendBody: true,
              specifyBody: "json",
              jsonBody: "={{ JSON.stringify({ text: `ALERT: ${$json.workflow.name} failed - ${$json.execution.error.message}`, blocks: [{ type: 'section', text: { type: 'mrkdwn', text: `*Workflow:* ${$json.workflow.name}\\n*Error:* ${$json.execution.error.message}\\n*Execution:* ${$json.execution.url}` } }] }) }}"
            },
            id: "slack-1",
            name: "Alert Slack",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 4,
            position: [470, 300]
          }
        ],
        connections: {
          "Error Trigger": { main: [[{ node: "Alert Slack", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-06-01-1",
          question: "¿Qué nodo se usa como trigger para el Error Workflow global?",
          options: [
            "Webhook Trigger",
            "Error Trigger",
            "Schedule Trigger",
            "Workflow Error Trigger"
          ],
          correctIndex: 1,
          explanation: "El Error Trigger es un nodo especial que se activa automáticamente cuando cualquier workflow del sistema falla, permitiendo manejar errores globalmente."
        },
        {
          id: "q-06-01-2",
          question: "¿Qué patrón evita saturar un servicio que está fallando repetidamente?",
          options: [
            "Dead Letter Queue",
            "Retry con backoff",
            "Circuit Breaker",
            "Fan-out / Fan-in"
          ],
          correctIndex: 2,
          explanation: "El Circuit Breaker detecta fallos repetidos y 'abre el circuito' para dejar de enviar peticiones al servicio fallido temporalmente."
        },
        {
          id: "q-06-01-3",
          question: "¿Qué es una Dead Letter Queue (DLQ)?",
          options: [
            "Una cola de emails no entregados",
            "Un almacenamiento de items fallidos para reprocesamiento posterior",
            "Un log de errores del sistema",
            "Una lista de workflows desactivados"
          ],
          correctIndex: 1,
          explanation: "Una Dead Letter Queue almacena items que fallaron en su procesamiento para poder reintentarlos posteriormente de forma automática o manual."
        }
      ]
    },
    {
      id: "les-06-02",
      moduleSlug: "escalabilidad-seguridad",
      slug: "docker-scaling",
      title: "Escalado con Docker",
      description: "Configura Docker Compose con múltiples workers, queue mode, PostgreSQL scaling y Redis para alta disponibilidad.",
      content: `## Escalado con Docker

Cuando N8N crece en uso, necesitas escalar horizontalmente. El queue mode con múltiples workers es la estrategia principal.

### Arquitectura de escalado

\`\`\`
                    ┌─ Worker 1 ─┐
Load Balancer ──→ ──┤─ Worker 2 ──┤──→ PostgreSQL
                    ├─ Worker 3 ─┤
                    └─ Worker N ─┘
                         ↕
                       Redis
\`\`\`

### Docker Compose con Queue Mode

\`\`\`yaml
version: '3.8'
services:
  n8n-main:
    image: n8nio/n8n:1.48.0
    container_name: n8n-main
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.tu-dominio.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.tu-dominio.com/
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_PASSWORD=\${REDIS_PASSWORD}
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=\${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=\${POSTGRES_PASSWORD}
      - N8N_DISABLE_UI=false
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  n8n-worker-1:
    image: n8nio/n8n:1.48.0
    container_name: n8n-worker-1
    command: worker
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_PASSWORD=\${REDIS_PASSWORD}
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=\${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=\${POSTGRES_PASSWORD}
      - QUEUE_WORKER_CONCURRENCY=10
      - N8N_DISABLE_UI=true
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  n8n-worker-2:
    image: n8nio/n8n:1.48.0
    container_name: n8n-worker-2
    command: worker
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_PASSWORD=\${REDIS_PASSWORD}
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=\${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=\${POSTGRES_PASSWORD}
      - QUEUE_WORKER_CONCURRENCY=10
      - N8N_DISABLE_UI=true
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  n8n-webhook:
    image: n8nio/n8n:1.48.0
    container_name: n8n-webhook
    command: webhook
    ports:
      - "5679:5678"
    environment:
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=\${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=\${POSTGRES_PASSWORD}
      - N8N_DISABLE_UI=true
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: n8n-postgres
    environment:
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    command: >
      postgres
      -c shared_buffers=512MB
      -c effective_cache_size=1536MB
      -c work_mem=32MB
      -c max_connections=300
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: n8n-redis
    command: redis-server --requirepass \${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "\${REDIS_PASSWORD}", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
\`\`\`

### Nginx Load Balancer

\`\`\`nginx
upstream n8n_webhook {
    least_conn;
    server n8n-webhook:5678;
}

upstream n8n_ui {
    server n8n-main:5678;
}

server {
    listen 443 ssl http2;
    server_name n8n.tu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/n8n.tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/n8n.tu-dominio.com/privkey.pem;

    location /webhook/ {
        proxy_pass http://n8n_webhook;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://n8n_ui;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
\`\`\`

### PostgreSQL Read Replicas

Para lecturas pesadas, configura read replicas:

\`\`\`yaml
postgres-replica:
  image: postgres:16-alpine
  container_name: n8n-postgres-replica
  environment:
    - POSTGRES_PRIMARY_HOST=postgres
    - POSTGRES_PRIMARY_PORT=5432
  command: >
    postgres
    -c hot_standby=on
    -c max_standby_streaming_delay=30s
  depends_on:
    - postgres
\`\`\`

### Monitoreo de workers

\`\`\`bash
docker compose ps
docker compose logs -f n8n-worker-1
docker compose top n8n-worker-1
\`\`\`

### Escalado automático con Docker Swarm

\`\`\`yaml
services:
  n8n-worker:
    image: n8nio/n8n:1.48.0
    command: worker
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
\`\`\`

### Métricas de escalado

Monitorea estas métricas para decidir cuándo escalar:

| Métrica | Umbral | Acción |
|---|---|---|
| Queue depth | > 100 jobs | Añadir workers |
| Worker CPU | > 80% sostenido | Añadir workers |
| Worker memory | > 85% | Aumentar recursos o workers |
| PostgreSQL connections | > 80% max | Aumentar max_connections |
| Redis memory | > 70% | Aumentar maxmemory |
| Response time | > 5s p95 | Revisar workers y DB |

### Tips de escalado

- **Empieza con 2 workers** y escala según demanda
- **Usa \`least_conn\`** en nginx para balancear webhooks
- **Separa webhook handler** del UI para mejor rendimiento
- **Monitorea queue depth** en Redis: \`redis-cli LLEN bull:workflow:wait\`
- **Ajusta concurrency** por worker según recursos disponibles
- **Usa healthchecks** en todos los servicios para failover automático`,
      estimatedMinutes: 25,
      quiz: [
        {
          id: "q-06-02-1",
          question: "¿Qué comando se usa para iniciar un worker de N8N?",
          options: [
            "n8n start --worker",
            "n8n worker",
            "n8n run worker",
            "n8n execute --mode worker"
          ],
          correctIndex: 1,
          explanation: "El comando 'n8n worker' (o 'worker' como argumento en Docker) inicia N8N en modo worker, que procesa jobs de la cola Redis sin exponer la UI."
        },
        {
          id: "q-06-02-2",
          question: "¿Qué estrategia de load balancing se recomienda para webhooks?",
          options: [
            "round-robin",
            "least_conn",
            "ip_hash",
            "random"
          ],
          correctIndex: 1,
          explanation: "least_conn distribuye las peticiones al servidor con menos conexiones activas, ideal para webhooks que pueden tener tiempos de procesamiento variables."
        },
        {
          id: "q-06-02-3",
          question: "¿Qué métrica indica que necesitas más workers?",
          options: [
            "Alto uso de disco",
            "Queue depth mayor a 100 jobs pendientes",
            "Muchos workflows activos",
            "Alto tráfico en la UI"
          ],
          correctIndex: 1,
          explanation: "Un queue depth alto (>100 jobs pendientes) indica que los workers actuales no pueden procesar el volumen de trabajo, y necesitas añadir más workers."
        }
      ]
    },
    {
      id: "les-06-03",
      moduleSlug: "escalabilidad-seguridad",
      slug: "kubernetes-deployment",
      title: "Despliegue en Kubernetes",
      description: "Despliega N8N en Kubernetes: pods, services, horizontal pod autoscaling, resource limits y configuración production-ready.",
      content: `## Despliegue en Kubernetes

Kubernetes (K8s) proporciona orquestación avanzada para N8N en producción, con auto-scaling, self-healing y gestión de recursos.

### Arquitectura en K8s

\`\`\`
┌─ Ingress Controller ─┐
│                       │
├─ N8N Main (1 pod)    ├──→ PostgreSQL (StatefulSet)
├─ N8N Workers (N pods)├──→ Redis (StatefulSet)
├─ N8N Webhook (N pods)│
└───────────────────────┘
\`\`\`

### Namespace

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: n8n
  labels:
    app: n8n
\`\`\`

### ConfigMap y Secrets

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: n8n-config
  namespace: n8n
data:
  N8N_HOST: "n8n.tu-dominio.com"
  N8N_PORT: "5678"
  N8N_PROTOCOL: "https"
  WEBHOOK_URL: "https://n8n.tu-dominio.com/"
  EXECUTIONS_MODE: "queue"
  QUEUE_BULL_REDIS_HOST: "redis-svc"
  QUEUE_BULL_REDIS_PORT: "6379"
  DB_TYPE: "postgresdb"
  DB_POSTGRESDB_HOST: "postgres-svc"
  DB_POSTGRESDB_PORT: "5432"
  DB_POSTGRESDB_DATABASE: "n8n"
  GENERIC_TIMEZONE: "America/Mexico_City"
---
apiVersion: v1
kind: Secret
metadata:
  name: n8n-secrets
  namespace: n8n
type: Opaque
stringData:
  DB_POSTGRESDB_USER: "n8n"
  DB_POSTGRESDB_PASSWORD: "super-secret-password"
  QUEUE_BULL_REDIS_PASSWORD: "redis-secret-password"
  N8N_ENCRYPTION_KEY: "encryption-key-here"
\`\`\`

### Deployment: N8N Main (UI)

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: n8n-main
  namespace: n8n
  labels:
    app: n8n
    component: main
spec:
  replicas: 1
  selector:
    matchLabels:
      app: n8n
      component: main
  template:
    metadata:
      labels:
        app: n8n
        component: main
    spec:
      containers:
        - name: n8n
          image: n8nio/n8n:1.48.0
          ports:
            - containerPort: 5678
          envFrom:
            - configMapRef:
                name: n8n-config
            - secretRef:
                name: n8n-secrets
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "2000m"
              memory: "2Gi"
          readinessProbe:
            httpGet:
              path: /healthz
              port: 5678
            initialDelaySeconds: 30
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /healthz
              port: 5678
            initialDelaySeconds: 60
            periodSeconds: 30
\`\`\`

### Deployment: N8N Workers

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: n8n-worker
  namespace: n8n
  labels:
    app: n8n
    component: worker
spec:
  replicas: 3
  selector:
    matchLabels:
      app: n8n
      component: worker
  template:
    metadata:
      labels:
        app: n8n
        component: worker
    spec:
      containers:
        - name: n8n
          image: n8nio/n8n:1.48.0
          command: ["n8n", "worker"]
          envFrom:
            - configMapRef:
                name: n8n-config
            - secretRef:
                name: n8n-secrets
          env:
            - name: QUEUE_WORKER_CONCURRENCY
              value: "10"
            - name: N8N_DISABLE_UI
              value: "true"
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "2000m"
              memory: "2Gi"
\`\`\`

### Horizontal Pod Autoscaler (HPA)

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: n8n-worker-hpa
  namespace: n8n
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: n8n-worker
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 120
\`\`\`

### Services

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: n8n-main-svc
  namespace: n8n
spec:
  selector:
    app: n8n
    component: main
  ports:
    - port: 5678
      targetPort: 5678
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: n8n-webhook-svc
  namespace: n8n
spec:
  selector:
    app: n8n
    component: webhook
  ports:
    - port: 5678
      targetPort: 5678
  type: ClusterIP
\`\`\`

### Ingress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: n8n-ingress
  namespace: n8n
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - n8n.tu-dominio.com
      secretName: n8n-tls
  rules:
    - host: n8n.tu-dominio.com
      http:
        paths:
          - path: /webhook
            pathType: Prefix
            backend:
              service:
                name: n8n-webhook-svc
                port:
                  number: 5678
          - path: /
            pathType: Prefix
            backend:
              service:
                name: n8n-main-svc
                port:
                  number: 5678
\`\`\`

### PostgreSQL StatefulSet

\`\`\`yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: n8n
spec:
  serviceName: postgres-svc
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_DB
              value: "n8n"
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: n8n-secrets
                  key: DB_POSTGRESDB_USER
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: n8n-secrets
                  key: DB_POSTGRESDB_PASSWORD
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
          resources:
            requests:
              cpu: "500m"
              memory: "1Gi"
            limits:
              cpu: "2000m"
              memory: "4Gi"
  volumeClaimTemplates:
    - metadata:
        name: postgres-data
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: standard
        resources:
          requests:
            storage: 20Gi
\`\`\`

### Comandos K8s

\`\`\`bash
kubectl apply -f k8s/
kubectl get pods -n n8n
kubectl logs -f deployment/n8n-worker -n n8n
kubectl scale deployment/n8n-worker --replicas=5 -n n8n
kubectl top pods -n n8n
kubectl describe hpa n8n-worker-hpa -n n8n
\`\`\`

### Tips de Kubernetes

- **Usa resource limits** siempre para evitar que un pod consuma todos los recursos
- **Configura probes** (readiness + liveness) para health checking
- **Usa StatefulSets** para PostgreSQL y Redis (persistent storage)
- **HPA con stabilization window** evita scaling oscilante
- **Usa PodDisruptionBudgets** para mantener disponibilidad durante updates
- **Configura NetworkPolicies** para aislar tráfico entre componentes`,
      estimatedMinutes: 25,
      quiz: [
        {
          id: "q-06-03-1",
          question: "¿Qué recurso de K8s escala automáticamente el número de pods?",
          options: [
            "Deployment",
            "ReplicaSet",
            "HorizontalPodAutoscaler",
            "StatefulSet"
          ],
          correctIndex: 2,
          explanation: "HorizontalPodAutoscaler (HPA) ajusta automáticamente el número de réplicas de un Deployment basándose en métricas como CPU y memoria."
        },
        {
          id: "q-06-03-2",
          question: "¿Qué tipo de recurso K8s se usa para PostgreSQL con almacenamiento persistente?",
          options: [
            "Deployment",
            "DaemonSet",
            "StatefulSet",
            "Job"
          ],
          correctIndex: 2,
          explanation: "StatefulSet es ideal para bases de datos como PostgreSQL porque garantiza almacenamiento persistente y nombres de pods estables."
        },
        {
          id: "q-06-03-3",
          question: "¿Qué probe de K8s verifica que un pod está listo para recibir tráfico?",
          options: [
            "livenessProbe",
            "readinessProbe",
            "startupProbe",
            "healthProbe"
          ],
          correctIndex: 1,
          explanation: "readinessProbe verifica que el pod está listo para recibir tráfico. Si falla, K8s deja de enviar peticiones al pod hasta que se recupere."
        }
      ]
    },
    {
      id: "les-06-04",
      moduleSlug: "escalabilidad-seguridad",
      slug: "security-hardening",
      title: "Security Hardening",
      description: "Fortalece la seguridad de N8N: autenticación, políticas de red, gestión de secretos, audit logging y mejores prácticas.",
      content: `## Security Hardening

La seguridad en N8N es crítica porque maneja datos sensibles, credenciales de APIs y lógica de negocio. Un N8N comprometido puede exponer toda tu infraestructura.

### Autenticación y acceso

#### User Management

N8N soporta múltiples métodos de autenticación:

\`\`\`yaml
environment:
  - N8N_USER_MANAGEMENT_JWT_SECRET=super-secret-jwt-key
  - N8N_USER_MANAGEMENT_SMTP_HOST=smtp.gmail.com
  - N8N_USER_MANAGEMENT_SMTP_PORT=587
  - N8N_USER_MANAGEMENT_SMTP_USER=n8n@tuempresa.com
  - N8N_USER_MANAGEMENT_SMTP_PASS=smtp-password
\`\`\`

#### LDAP/SAML (Enterprise)

\`\`\`yaml
environment:
  - N8N_USER_MANAGEMENT_AUTHENTICATION_METHOD=ldap
  - N8N_USER_MANAGEMENT_LDAP_URL=ldap://ldap.empresa.com:389
  - N8N_USER_MANAGEMENT_LDAP_BASE_DN=dc=empresa,dc=com
  - N8N_USER_MANAGEMENT_LDAP_BIND_DN=cn=admin,dc=empresa,dc=com
  - N8N_USER_MANAGEMENT_LDAP_BIND_PASSWORD=ldap-password
\`\`\`

### Gestión de secretos

#### Nunca hardcodees secretos en workflows

\`\`\`javascript
const apiKey = $env.STRIPE_API_KEY;
const webhookSecret = $env.WEBHOOK_SECRET;
const dbPassword = $env.DB_PASSWORD;
\`\`\`

#### Usa N8N Secrets (v1.42+)

\`\`\`javascript
const secret = $secrets.stripe.apiKey;
const token = $secrets.github.token;
\`\`\`

#### Variables de entorno en Docker

\`\`\`yaml
services:
  n8n:
    env_file:
      - .env.production
    environment:
      - N8N_ENCRYPTION_KEY=\${N8N_ENCRYPTION_KEY}
\`\`\`

#### Archivo .env.production

\`\`\`bash
N8N_ENCRYPTION_KEY=random-256-bit-key
DB_PASSWORD=strong-database-password
REDIS_PASSWORD=strong-redis-password
STRIPE_API_KEY=sk_live_xxx
OPENAI_API_KEY=sk-xxx
WEBHOOK_SECRET=hmac-secret-key
\`\`\`

### Network Policies (Kubernetes)

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: n8n-network-policy
  namespace: n8n
spec:
  podSelector:
    matchLabels:
      app: n8n
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - port: 5678
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgres
      ports:
        - port: 5432
    - to:
        - podSelector:
            matchLabels:
              app: redis
      ports:
        - port: 6379
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 10.0.0.0/8
              - 172.16.0.0/12
              - 192.168.0.0/16
      ports:
        - port: 443
\`\`\`

### Firewall (VPS)

\`\`\`bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 5678
ufw enable
\`\`\`

### Audit Logging

Configura logging detallado de todas las acciones:

\`\`\`yaml
environment:
  - N8N_LOG_LEVEL=info
  - N8N_LOG_OUTPUT=console,file
  - N8N_LOG_FILE_PATH=/var/log/n8n/n8n.log
  - N8N_LOG_FILE_MAX_SIZE=50mb
  - N8N_LOG_FILE_MAX_COUNT=10
\`\`\`

#### Workflow de audit log

\`\`\`
[Schedule: cada 5min]
  → [PostgreSQL: Obtener ejecuciones recientes]
  → [Code: Filtrar acciones sensibles]
  → [Supabase: Guardar audit log]
  → [IF: acción sospechosa] → [Slack: Alertar al equipo de seguridad]
\`\`\`

### Protección de Webhooks

#### Verificación HMAC

\`\`\`javascript
const crypto = require('crypto');
const signature = $input.first().json.headers['x-webhook-signature'];
const secret = $env.WEBHOOK_SECRET;
const body = JSON.stringify($input.first().json.body);

const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

if (signature !== expected) {
  throw new Error('Invalid webhook signature');
}

return $input.all();
\`\`\`

#### Rate Limiting por IP

\`\`\`javascript
const ip = $input.first().json.headers['x-forwarded-for'];
const key = \`webhook_rate:\${ip}\`;
const MAX = 60;
const WINDOW = 3600;

const count = await this.helpers.httpRequest({
  method: 'GET',
  url: \`http://redis:6379/\${key}\`
});

if (parseInt(count.body || '0') >= MAX) {
  throw new Error('Rate limit exceeded');
}

return $input.all();
\`\`\`

### Seguridad de credenciales en N8N

- **Encripta credenciales**: N8N encripta credenciales con \`N8N_ENCRYPTION_KEY\`
- **Rota la encryption key** periódicamente
- **Limita acceso** a credenciales por usuario y workflow
- **Audita uso** de credenciales regularmente
- **Usa credenciales separadas** para desarrollo y producción

### Checklist de seguridad

- [ ] N8N accesible solo por HTTPS
- [ ] Autenticación de usuarios configurada
- [ ] \`N8N_ENCRYPTION_KEY\` generada aleatoriamente
- [ ] Credenciales en variables de entorno o secrets manager
- [ ] Firewall configurado (solo 80, 443)
- [ ] Network policies en Kubernetes
- [ ] Audit logging activo
- [ ] Backups encriptados
- [ ] Actualizaciones de N8N al día
- [ ] Webhooks protegidos con HMAC
- [ ] Rate limiting implementado
- [ ] Acceso a PostgreSQL y Redis restringido por red
- [ ] Ejecución de workflows sandboxed (no acceso a filesystem del host)

### Mejores prácticas

- **Actualiza N8N** regularmente para parches de seguridad
- **Usa HTTPS** siempre, incluso en desarrollo
- **Principio de menor privilegio**: Cada credencial solo tiene los permisos necesarios
- **Separa ambientes**: Dev, staging y producción con credenciales diferentes
- **Monitorea accesos**: Loggea todos los logins y cambios de configuración
- **Backup encriptado**: Los backups contienen credenciales; encripta siempre
- **Revisión periódica**: Audita workflows y credenciales cada trimestre`,
      estimatedMinutes: 22,
      quiz: [
        {
          id: "q-06-04-1",
          question: "¿Qué variable de entorno encripta las credenciales almacenadas en N8N?",
          options: [
            "N8N_SECRET_KEY",
            "N8N_ENCRYPTION_KEY",
            "N8N_CREDENTIAL_SECRET",
            "N8N_SECURITY_KEY"
          ],
          correctIndex: 1,
          explanation: "N8N_ENCRYPTION_KEY es la clave que N8N usa para encriptar todas las credenciales almacenadas. Debe ser aleatoria y mantenerse segura."
        },
        {
          id: "q-06-04-2",
          question: "¿Qué método se usa para verificar la autenticidad de un webhook entrante?",
          options: [
            "API Key en query string",
            "Verificación HMAC de la firma del body",
            "IP whitelist únicamente",
            "Basic Auth"
          ],
          correctIndex: 1,
          explanation: "La verificación HMAC calcula un hash del body con un secreto compartido y lo compara con la firma enviada en el header, verificando autenticidad e integridad."
        },
        {
          id: "q-06-04-3",
          question: "¿Por qué no se debe permitir acceso directo al puerto 5678 en producción?",
          options: [
            "Porque es un puerto reservado",
            "Porque N8N no funciona en ese puerto",
            "Porque debe estar detrás de un reverse proxy con HTTPS y autenticación",
            "Porque causa conflictos con otros servicios"
          ],
          correctIndex: 2,
          explanation: "El puerto 5678 debe estar detrás de un reverse proxy (nginx) que proporciona HTTPS, autenticación, rate limiting y protección contra ataques directos."
        }
      ]
    }
  ]
};
