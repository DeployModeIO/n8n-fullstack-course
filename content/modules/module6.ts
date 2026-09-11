import { Module } from "../../types/course";

export const module6: Module = {
  id: "mod-06",
  slug: "scalability-security",
  title: "Scalability and Security",
  description: "Scale N8N for production: error handling, Docker with workers, Kubernetes and security hardening.",
  icon: "Shield",
  sortOrder: 6,
  lessons: [
    {
      id: "les-06-01",
      moduleSlug: "scalability-security",
      slug: "error-handling",
      title: "Error Handling and Alerts",
      description: "Implement global error handling, try-catch patterns, retry logic and alerts with Slack and email.",
      estimatedMinutes: 22,
      content: `## Error Handling and Alerts

Robust error handling is essential for production workflows. An unhandled error can halt critical business processes.

### Error Types in N8N

| Type | Cause | Example |
|---|---|---|
| **Node error** | Failure in a specific node | API timeout, invalid credentials |
| **Expression error** | Invalid expression | Field does not exist, wrong type |
| **Workflow error** | Flow logic error | Missing data, unexpected format |
| **System error** | Infrastructure failure | OOM, full disk, network down |

### Error Workflow (Global)

The Error Workflow runs automatically whenever any workflow fails:

1. Create a new workflow with an **Error Trigger** node
2. In Settings -> Workflow Settings -> Error Workflow, select this workflow

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

The Error Trigger provides:

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

### Pattern: Slack Alert

\`\`\`
[Error Trigger]
  -> [Code: Format message]
  -> [Slack: Send to #alerts]
  -> [Supabase: Log error]
\`\`\`

#### Formatting the error message

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

### Pattern: Retry with exponential backoff

\`\`\`
[HTTP Request] -> (error) -> [Code: Calculate delay] -> [Wait] -> [HTTP Request (retry)]
\`\`\`

#### Implementation

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

Configure individual nodes to continue when an error occurs:

\`\`\`json
{
  "options": {
    "continueOnFail": true
  }
}
\`\`\`

Then check whether an error occurred:

\`\`\`javascript
if ($json.error) {
  return [{ json: { _failed: true, _error: $json.error.message, _originalData: $json } }];
}
return [{ json: $json }];
\`\`\`

### Pattern: Circuit Breaker

Prevents overwhelming services that are already failing:

\`\`\`javascript
const serviceKey = 'external-api';
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

### Pattern: Dead Letter Queue

Stores failed items for later reprocessing:

\`\`\`
[Any node] -> (error) -> [Code: Format DLQ item]
  -> [Supabase: Insert into dead_letter_queue]
  -> [Slack: Alert]

[Schedule every hour] -> [Supabase: Read DLQ]
  -> [SplitInBatches] -> [Retry] -> (success) -> [Supabase: Remove from DLQ]
\`\`\`

#### DLQ Structure in Supabase

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

### Email alerts

\`\`\`json
{
  "fromEmail": "n8n-alerts@yourcompany.com",
  "toEmail": "devops@yourcompany.com",
  "subject": "=ALERT: {{ $json.workflow.name }} failed",
  "emailType": "html",
  "message": "=<h2>Workflow Error</h2><p><strong>Workflow:</strong> {{ $json.workflow.name }}</p><p><strong>Error:</strong> {{ $json.execution.error.message }}</p><p><a href='{{ $json.execution.url }}'>View Execution</a></p>"
}
\`\`\`

### Error dashboard

Create a workflow that generates a health dashboard:

\`\`\`
[Schedule: every hour]
  -> [Supabase: Count errors in the last 24h]
  -> [Supabase: Count successful executions]
  -> [Code: Calculate metrics]
  -> [Google Sheets: Update dashboard]
  -> [IF: error rate > 5%] -> [Slack: Critical alert]
\`\`\`

### Best practices

- **Always configure a global Error Workflow** in production
- **Use Continue On Fail** on nodes that can fail without being critical
- **Implement retry with backoff** for unstable APIs
- **Monitor the error rate** and configure proactive alerts
- **Use a Dead Letter Queue** for automatic reprocessing
- **Log every error** in a database for later analysis
- **Configure Slack alerts** for critical errors in real time`,
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
          question: "Which node is used as the trigger for the global Error Workflow?",
          options: [
            "Webhook Trigger",
            "Error Trigger",
            "Schedule Trigger",
            "Workflow Error Trigger"
          ],
          correctIndex: 1,
          explanation: "The Error Trigger is a special node that fires automatically when any workflow in the system fails, allowing errors to be handled globally."
        },
        {
          id: "q-06-01-2",
          question: "Which pattern prevents overwhelming a service that is failing repeatedly?",
          options: [
            "Dead Letter Queue",
            "Retry with backoff",
            "Circuit Breaker",
            "Fan-out / Fan-in"
          ],
          correctIndex: 2,
          explanation: "The Circuit Breaker detects repeated failures and 'opens the circuit' to stop sending requests to the failing service temporarily."
        },
        {
          id: "q-06-01-3",
          question: "What is a Dead Letter Queue (DLQ)?",
          options: [
            "A queue of undelivered emails",
            "A store of failed items for later reprocessing",
            "A system error log",
            "A list of disabled workflows"
          ],
          correctIndex: 1,
          explanation: "A Dead Letter Queue stores items whose processing failed so they can be retried later, either automatically or manually."
        }
      ]
    },
    {
      id: "les-06-02",
      moduleSlug: "scalability-security",
      slug: "docker-scaling",
      title: "Scaling with Docker",
      description: "Configure Docker Compose with multiple workers, queue mode, PostgreSQL scaling and Redis for high availability.",
      estimatedMinutes: 25,
      content: `## Scaling with Docker

When N8N grows in usage, you need to scale horizontally. Queue mode with multiple workers is the main strategy.

### Scaling architecture

\`\`\`
                    ┌─ Worker 1 ─┐
Load Balancer ──-> ──┤─ Worker 2 ──┤──> PostgreSQL
                    ├─ Worker 3 ─┤
                    └─ Worker N ─┘
                         ↕
                       Redis
\`\`\`

### Docker Compose with Queue Mode

\`\`\`yaml
version: '3.8'
services:
  n8n-main:
    image: n8nio/n8n:1.48.0
    container_name: n8n-main
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.your-domain.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.your-domain.com/
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
    server_name n8n.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/n8n.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/n8n.your-domain.com/privkey.pem;

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

For heavy read workloads, configure read replicas:

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

### Monitoring workers

\`\`\`bash
docker compose ps
docker compose logs -f n8n-worker-1
docker compose top n8n-worker-1
\`\`\`

### Automatic scaling with Docker Swarm

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

### Scaling metrics

Monitor these metrics to decide when to scale:

| Metric | Threshold | Action |
|---|---|---|
| Queue depth | > 100 jobs | Add workers |
| Worker CPU | > 80% sustained | Add workers |
| Worker memory | > 85% | Increase resources or workers |
| PostgreSQL connections | > 80% max | Increase max_connections |
| Redis memory | > 70% | Increase maxmemory |
| Response time | > 5s p95 | Review workers and DB |

### Scaling tips

- **Start with 2 workers** and scale as demand grows
- **Use \`least_conn\`** in nginx to balance webhooks
- **Separate the webhook handler** from the UI for better performance
- **Monitor queue depth** in Redis: \`redis-cli LLEN bull:workflow:wait\`
- **Tune concurrency** per worker according to the available resources
- **Use healthchecks** on every service for automatic failover`,
      quiz: [
        {
          id: "q-06-02-1",
          question: "Which command starts an N8N worker?",
          options: [
            "n8n start --worker",
            "n8n worker",
            "n8n run worker",
            "n8n execute --mode worker"
          ],
          correctIndex: 1,
          explanation: "The 'n8n worker' command (or 'worker' as the Docker argument) starts N8N in worker mode, which processes Redis queue jobs without exposing the UI."
        },
        {
          id: "q-06-02-2",
          question: "Which load balancing strategy is recommended for webhooks?",
          options: [
            "round-robin",
            "least_conn",
            "ip_hash",
            "random"
          ],
          correctIndex: 1,
          explanation: "least_conn distributes requests to the server with the fewest active connections, which is ideal for webhooks whose processing time can vary."
        },
        {
          id: "q-06-02-3",
          question: "Which metric indicates that you need more workers?",
          options: [
            "High disk usage",
            "Queue depth above 100 pending jobs",
            "Many active workflows",
            "High UI traffic"
          ],
          correctIndex: 1,
          explanation: "A high queue depth (>100 pending jobs) means the current workers cannot handle the workload, so you need to add more workers."
        }
      ]
    },
    {
      id: "les-06-03",
      moduleSlug: "scalability-security",
      slug: "kubernetes-deployment",
      title: "Deploying on Kubernetes",
      description: "Deploy N8N on Kubernetes: pods, services, horizontal pod autoscaling, resource limits and production-ready configuration.",
      estimatedMinutes: 25,
      content: `## Deploying on Kubernetes

Kubernetes (K8s) provides advanced orchestration for N8N in production, with auto-scaling, self-healing and resource management.

### K8s architecture

\`\`\`
┌─ Ingress Controller ─┐
│                       │
├─ N8N Main (1 pod)    ──┤─> PostgreSQL (StatefulSet)
├─ N8N Workers (N pods)├──> Redis (StatefulSet)
├─ N8N Webhook (N pods)│
└──────────────────────┘
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

### ConfigMap and Secrets

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: n8n-config
  namespace: n8n
data:
  N8N_HOST: "n8n.your-domain.com"
  N8N_PORT: "5678"
  N8N_PROTOCOL: "https"
  WEBHOOK_URL: "https://n8n.your-domain.com/"
  EXECUTIONS_MODE: "queue"
  QUEUE_BULL_REDIS_HOST: "redis-svc"
  QUEUE_BULL_REDIS_PORT: "6379"
  DB_TYPE: "postgresdb"
  DB_POSTGRESDB_HOST: "postgres-svc"
  DB_POSTGRESDB_PORT: "5432"
  DB_POSTGRESDB_DATABASE: "n8n"
  GENERIC_TIMEZONE: "UTC"
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
        - n8n.your-domain.com
      secretName: n8n-tls
  rules:
    - host: n8n.your-domain.com
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

### K8s Commands

\`\`\`bash
kubectl apply -f k8s/
kubectl get pods -n n8n
kubectl logs -f deployment/n8n-worker -n n8n
kubectl scale deployment/n8n-worker --replicas=5 -n n8n
kubectl top pods -n n8n
kubectl describe hpa n8n-worker-hpa -n n8n
\`\`\`

### Kubernetes Tips

- **Always use resource limits** so a single pod cannot consume all resources
- **Configure probes** (readiness + liveness) for health checking
- **Use StatefulSets** for PostgreSQL and Redis (persistent storage)
- **HPA with a stabilization window** avoids oscillating scaling
- **Use PodDisruptionBudgets** to keep availability during updates
- **Configure NetworkPolicies** to isolate traffic between components`,
      quiz: [
        {
          id: "q-06-03-1",
          question: "Which K8s resource automatically scales the number of pods?",
          options: [
            "Deployment",
            "ReplicaSet",
            "HorizontalPodAutoscaler",
            "StatefulSet"
          ],
          correctIndex: 2,
          explanation: "HorizontalPodAutoscaler (HPA) automatically adjusts the number of replicas of a Deployment based on metrics such as CPU and memory."
        },
        {
          id: "q-06-03-2",
          question: "Which type of K8s resource is used for PostgreSQL with persistent storage?",
          options: [
            "Deployment",
            "DaemonSet",
            "StatefulSet",
            "Job"
          ],
          correctIndex: 2,
          explanation: "StatefulSet is ideal for databases such as PostgreSQL because it guarantees persistent storage and stable pod names."
        },
        {
          id: "q-06-03-3",
          question: "Which K8s probe checks that a pod is ready to receive traffic?",
          options: [
            "livenessProbe",
            "readinessProbe",
            "startupProbe",
            "healthProbe"
          ],
          correctIndex: 1,
          explanation: "readinessProbe checks that the pod is ready to receive traffic. If it fails, K8s stops sending requests to the pod until it recovers."
        }
      ]
    },
    {
      id: "les-06-04",
      moduleSlug: "scalability-security",
      slug: "security-hardening",
      title: "Security Hardening",
      description: "Strengthen N8N security: authentication, network policies, secret management, audit logging and best practices.",
      estimatedMinutes: 22,
      content: `## Security Hardening

Security in N8N is critical because it handles sensitive data, API credentials and business logic. A compromised N8N can expose your entire infrastructure.

### Authentication and access

#### User Management

N8N supports multiple authentication methods:

\`\`\`yaml
environment:
  - N8N_USER_MANAGEMENT_JWT_SECRET=super-secret-jwt-key
  - N8N_USER_MANAGEMENT_SMTP_HOST=smtp.gmail.com
  - N8N_USER_MANAGEMENT_SMTP_PORT=587
  - N8N_USER_MANAGEMENT_SMTP_USER=n8n@yourcompany.com
  - N8N_USER_MANAGEMENT_SMTP_PASS=smtp-password
\`\`\`

#### LDAP/SAML (Enterprise)

\`\`\`yaml
environment:
  - N8N_USER_MANAGEMENT_AUTHENTICATION_METHOD=ldap
  - N8N_USER_MANAGEMENT_LDAP_URL=ldap://ldap.company.com:389
  - N8N_USER_MANAGEMENT_LDAP_BASE_DN=dc=company,dc=com
  - N8N_USER_MANAGEMENT_LDAP_BIND_DN=cn=admin,dc=company,dc=com
  - N8N_USER_MANAGEMENT_LDAP_BIND_PASSWORD=ldap-password
\`\`\`

### Secret management

#### Never hardcode secrets in workflows

\`\`\`javascript
const apiKey = $env.STRIPE_API_KEY;
const webhookSecret = $env.WEBHOOK_SECRET;
const dbPassword = $env.DB_PASSWORD;
\`\`\`

#### Use N8N Secrets (v1.42+)

\`\`\`javascript
const secret = $secrets.stripe.apiKey;
const token = $secrets.github.token;
\`\`\`

#### Environment variables in Docker

\`\`\`yaml
services:
  n8n:
    env_file:
      - .env.production
    environment:
      - N8N_ENCRYPTION_KEY=\${N8N_ENCRYPTION_KEY}
\`\`\`

#### The .env.production file

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

Configure detailed logging of every action:

\`\`\`yaml
environment:
  - N8N_LOG_LEVEL=info
  - N8N_LOG_OUTPUT=console,file
  - N8N_LOG_FILE_PATH=/var/log/n8n/n8n.log
  - N8N_LOG_FILE_MAX_SIZE=50mb
  - N8N_LOG_FILE_MAX_COUNT=10
\`\`\`

#### Audit log workflow

\`\`\`
[Schedule: every 5min]
  -> [PostgreSQL: Get recent executions]
  -> [Code: Filter sensitive actions]
  -> [Supabase: Save audit log]
  -> [IF: suspicious action] -> [Slack: Alert the security team]
\`\`\`

### Webhook Protection

#### HMAC Verification

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

#### Rate Limiting by IP

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

### Credential security in N8N

- **Encrypt credentials**: N8N encrypts credentials with \`N8N_ENCRYPTION_KEY\`
- **Rotate the encryption key** periodically
- **Limit access** to credentials per user and per workflow
- **Audit the usage** of credentials regularly
- **Use separate credentials** for development and production

### Security checklist

- [ ] N8N reachable only over HTTPS
- [ ] User authentication configured
- [ ] \`N8N_ENCRYPTION_KEY\` generated randomly
- [ ] Credentials in environment variables or a secrets manager
- [ ] Firewall configured (only 80, 443)
- [ ] Network policies in Kubernetes
- [ ] Audit logging enabled
- [ ] Encrypted backups
- [ ] N8N updates up to date
- [ ] Webhooks protected with HMAC
- [ ] Rate limiting implemented
- [ ] Network-restricted access to PostgreSQL and Redis
- [ ] Sandboxed workflow execution (no access to the host filesystem)

### Best practices

- **Update N8N** regularly for security patches
- **Always use HTTPS**, even in development
- **Principle of least privilege**: Each credential has only the permissions it needs
- **Separate environments**: Dev, staging and production with different credentials
- **Monitor access**: Log all logins and configuration changes
- **Encrypted backups**: Backups contain credentials; always encrypt them
- **Regular review**: Audit workflows and credentials every quarter`,
      quiz: [
        {
          id: "q-06-04-1",
          question: "Which environment variable encrypts the credentials stored in N8N?",
          options: [
            "N8N_SECRET_KEY",
            "N8N_ENCRYPTION_KEY",
            "N8N_CREDENTIAL_SECRET",
            "N8N_SECURITY_KEY"
          ],
          correctIndex: 1,
          explanation: "N8N_ENCRYPTION_KEY is the key N8N uses to encrypt all stored credentials. It must be random and kept secure."
        },
        {
          id: "q-06-04-2",
          question: "Which method is used to verify the authenticity of an incoming webhook?",
          options: [
            "API Key in the query string",
            "HMAC verification of the body signature",
            "IP whitelist only",
            "Basic Auth"
          ],
          correctIndex: 1,
          explanation: "HMAC verification computes a hash of the body with a shared secret and compares it with the signature sent in the header, verifying authenticity and integrity."
        },
        {
          id: "q-06-04-3",
          question: "Why should direct access to port 5678 not be allowed in production?",
          options: [
            "Because it is a reserved port",
            "Because N8N does not work on that port",
            "Because it must sit behind a reverse proxy with HTTPS and authentication",
            "Because it conflicts with other services"
          ],
          correctIndex: 2,
          explanation: "Port 5678 must sit behind a reverse proxy (nginx) that provides HTTPS, authentication, rate limiting and protection against direct attacks."
        }
      ]
    }
  ]
};
