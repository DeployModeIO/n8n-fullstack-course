import { Module } from "../../types/course";

export const module4: Module = {
  id: "mod-04",
  slug: "automatizacion-ia",
  title: "Automatización con IA",
  description: "Integra inteligencia artificial en tus workflows: OpenAI, LangChain, RAG con Pinecone, modelos locales con Ollama y sistemas multi-agente.",
  icon: "Brain",
  sortOrder: 4,
  lessons: [
    {
      id: "les-04-01",
      moduleSlug: "automatizacion-ia",
      slug: "intro-ai-n8n",
      title: "IA en N8N: Introducción",
      description: "Descubre los nodos de IA en N8N, integración con OpenAI y técnicas de prompt engineering para automatización.",
      content: `## IA en N8N: Introducción

N8N integra nodos de IA que permiten incorporar modelos de lenguaje, embeddings y agentes conversacionales directamente en tus workflows.

### Nodos de IA disponibles

N8N ofrece una suite completa de nodos de IA:

| Nodo | Función |
|---|---|
| **OpenAI** | Chat completions, embeddings, image generation |
| **AI Agent** | Agente autónomo con herramientas |
| **Chain** | Cadenas de procesamiento LLM |
| **Memory** | Memoria conversacional |
| **Tool** | Herramientas para agentes |
| **Embeddings** | Vectorización de texto |
| **Vector Store** | Almacenamiento de vectores |
| **Document Loader** | Carga de documentos |
| **Text Splitter** | División de texto |
| **Output Parser** | Parseo estructurado de respuestas |

### Configuración de OpenAI

1. Obtén una API key en platform.openai.com
2. En N8N, crea credenciales de tipo **OpenAI API**
3. Pega tu API key

### Chat Completion básico

\`\`\`json
{
  "operation": "chat",
  "model": "gpt-4o",
  "messages": {
    "values": [
      {
        "role": "system",
        "content": "Eres un asistente de ventas profesional. Responde siempre en español de forma concisa."
      },
      {
        "role": "user",
        "content": "=Resume el siguiente email en 3 bullet points:\\n\\n{{ $json.emailBody }}"
      }
    ]
  },
  "options": {
    "temperature": 0.3,
    "maxTokens": 500
  }
}
\`\`\`

### Prompt Engineering para automatización

#### Principios clave

1. **Sé específico**: Define el rol, formato y restricciones
2. **Usa ejemplos**: Few-shot prompting mejora la calidad
3. **Estructura la salida**: Pide JSON, XML o formato específico
4. **Controla la temperatura**: Baja (0.1-0.3) para tareas determinísticas, alta (0.7-0.9) para creatividad

#### System prompt efectivo

\`\`\`
Eres un clasificador de tickets de soporte. Analiza el mensaje del usuario y responde SOLO con un JSON válido:

{
  "categoria": "billing|technical|general|feature_request",
  "prioridad": "low|medium|high|urgent",
  "resumen": "resumen en una línea",
  "requiere_humano": true/false
}

Reglas:
- Si menciona pagos, facturas o cobros → billing
- Si menciona errores, bugs o no funciona → technical
- Si menciona nuevas funcionalidades → feature_request
- Si hay palabras como "urgente", "emergencia", "producción caída" → urgent
\`\`\`

### Embeddings

Genera vectores para búsqueda semántica:

\`\`\`json
{
  "operation": "embeddings",
  "model": "text-embedding-3-small",
  "input": "={{ $json.texto }}"
}
\`\`\`

### Clasificación de emails con IA

\`\`\`
[Gmail Trigger: nuevo email]
  → [OpenAI: Clasificar email]
  → [Code: Parsear JSON de respuesta]
  → [Switch por categoría]
    → billing → [Sub-workflow: Billing]
    → technical → [Sub-workflow: Soporte Técnico]
    → general → [Sub-workflow: Respuesta General]
\`\`\`

### Generación de contenido

\`\`\`
[Schedule: diario 9am]
  → [HTTP Request: Obtener noticias del sector]
  → [OpenAI: Generar resumen ejecutivo]
  → [OpenAI: Generar post para LinkedIn]
  → [HTTP Request: Publicar en LinkedIn]
  → [Google Sheets: Registrar publicación]
\`\`\`

### Manejo de costos

- **Usa GPT-4o-mini** para tareas simples (10x más barato que GPT-4o)
- **Cachea respuestas** cuando el input no cambia frecuentemente
- **Limita maxTokens** al mínimo necesario
- **Usa system prompts concisos** para reducir tokens de entrada
- **Monitorea uso** con la tabla de ejecuciones de N8N

### Modelos recomendados por caso de uso

| Caso de uso | Modelo | Razón |
|---|---|---|
| Clasificación | GPT-4o-mini | Rápido y barato para tareas simples |
| Generación de contenido | GPT-4o | Mejor calidad creativa |
| Extracción de datos | GPT-4o | Mejor siguiendo instrucciones complejas |
| Embeddings | text-embedding-3-small | Balance costo/calidad |
| Análisis de imágenes | GPT-4o (vision) | Soporte multimodal |`,
      estimatedMinutes: 20,
      n8nWorkflowJson: {
        name: "Email Classifier AI",
        nodes: [
          {
            parameters: {
              operation: "chat",
              model: "gpt-4o-mini",
              messages: {
                values: [
                  { role: "system", content: "Clasifica el email y responde SOLO con JSON: {\"categoria\": \"billing|technical|general\", \"prioridad\": \"low|medium|high\", \"resumen\": \"...\"}" },
                  { role: "user", content: "={{ $json.body }}" }
                ]
              },
              options: { temperature: 0.1, maxTokens: 200 }
            },
            id: "openai-1",
            name: "Clasificar con IA",
            type: "@n8n/n8n-nodes-langchain.openAi",
            typeVersion: 1,
            position: [470, 300]
          }
        ],
        connections: {}
      },
      quiz: [
        {
          id: "q-04-01-1",
          question: "¿Qué temperatura se recomienda para tareas de clasificación determinísticas?",
          options: ["0.0-0.1", "0.3-0.5", "0.7-0.9", "1.0"],
          correctIndex: 0,
          explanation: "Para tareas determinísticas como clasificación, se usa temperatura baja (0.0-0.3) para obtener respuestas consistentes y predecibles."
        },
        {
          id: "q-04-01-2",
          question: "¿Qué modelo de OpenAI es más económico para tareas simples?",
          options: ["GPT-4o", "GPT-4o-mini", "GPT-3.5-turbo", "GPT-4-turbo"],
          correctIndex: 1,
          explanation: "GPT-4o-mini es significativamente más económico que GPT-4o y suficiente para tareas simples como clasificación y extracción de datos."
        },
        {
          id: "q-04-01-3",
          question: "¿Qué técnica de prompt engineering mejora la calidad dando ejemplos?",
          options: [
            "Zero-shot prompting",
            "Few-shot prompting",
            "Chain-of-thought",
            "ReAct prompting"
          ],
          correctIndex: 1,
          explanation: "Few-shot prompting proporciona ejemplos de entrada/salida al modelo, mejorando significativamente la calidad de las respuestas."
        }
      ]
    },
    {
      id: "les-04-02",
      moduleSlug: "automatizacion-ia",
      slug: "langchain-n8n",
      title: "LangChain en N8N",
      description: "Construye agentes conversacionales con LangChain: chains, agents, tools, memory y patrones de diseño avanzados.",
      content: `## LangChain en N8N

N8N integra LangChain.js nativamente, permitiendo construir agentes de IA con herramientas, memoria y cadenas de procesamiento.

### Conceptos de LangChain

- **Chain**: Secuencia de pasos de procesamiento (LLM → Parser → Output)
- **Agent**: LLM que decide qué herramientas usar dinámicamente
- **Tool**: Función que el agente puede invocar (buscar, calcular, API call)
- **Memory**: Contexto conversacional persistente entre interacciones
- **Retriever**: Busca documentos relevantes en una base vectorial

### AI Agent Node

El AI Agent es el nodo más potente de IA en N8N:

\`\`\`json
{
  "text": "={{ $json.userMessage }}",
  "agent": "conversationalAgent",
  "options": {
    "systemMessage": "Eres un asistente de soporte técnico. Usa las herramientas disponibles para ayudar al usuario. Si no sabes la respuesta, sé honesto."
  }
}
\`\`\`

### Conectar herramientas al agente

#### Herramienta: HTTP Request

\`\`\`json
{
  "name": "buscar_producto",
  "description": "Busca información de un producto por nombre o ID. Input: nombre del producto",
  "url": "=https://api.miempresa.com/products?q={{ $fromAI('query') }}",
  "sendHeaders": true
}
\`\`\`

#### Herramienta: Code (Calculator)

\`\`\`json
{
  "name": "calculadora",
  "description": "Realiza cálculos matemáticos. Input: expresión matemática",
  "jsCode": "const expr = $fromAI('expression'); try { return String(eval(expr)); } catch(e) { return 'Error: ' + e.message; }"
}
\`\`\`

#### Herramienta: Workflow

\`\`\`json
{
  "name": "crear_ticket",
  "description": "Crea un ticket de soporte. Input: descripción del problema del usuario",
  "workflowId": "={{ $env.TICKET_WORKFLOW_ID }}"
}
\`\`\`

### Memory (Memoria conversacional)

#### Window Buffer Memory

Mantiene las últimas N interacciones:

\`\`\`json
{
  "sessionKey": "={{ $json.sessionId }}",
  "sessionIdType": "customKey",
  "contextWindowLength": 10
}
\`\`\`

#### Redis Memory

Persiste la memoria entre ejecuciones:

\`\`\`json
{
  "sessionKey": "={{ $json.userId }}",
  "sessionIdType": "customKey",
  "sessionTTL": 86400
}
\`\`\`

### Chain: Simple Sequential

\`\`\`
[Input] → [LLM: Generar resumen] → [LLM: Traducir a inglés] → [LLM: Generar tweet] → [Output]
\`\`\`

### Chain: Structured Output

Fuerza al LLM a responder en formato estructurado:

\`\`\`json
{
  "text": "={{ $json.descripcion }}",
  "outputParser": {
    "type": "structured",
    "schema": {
      "type": "object",
      "properties": {
        "sentimiento": { "type": "string", "enum": ["positivo", "negativo", "neutral"] },
        "temas": { "type": "array", "items": { "type": "string" } },
        "score": { "type": "number" }
      },
      "required": ["sentimiento", "temas", "score"]
    }
  }
}
\`\`\`

### Patrón: Chatbot de soporte completo

\`\`\`
[Webhook: mensaje del usuario]
  → [AI Agent con herramientas]
    ├── Tool: Buscar en Knowledge Base (RAG)
    ├── Tool: Crear ticket de soporte
    ├── Tool: Consultar estado de pedido
    └── Tool: Escalar a humano
  → [Memory: Guardar conversación]
  → [Respond to Webhook: respuesta al usuario]
  → [Google Sheets: Log de conversación]
\`\`\`

### Manejo de errores en agentes

Los agentes pueden entrar en loops o hacer mal uso de herramientas:

\`\`\`json
{
  "options": {
    "maxIterations": 5,
    "returnIntermediateSteps": true
  }
}
\`\`\`

- **maxIterations**: Limita cuántas veces el agente puede usar herramientas
- **returnIntermediateSteps**: Permite ver qué herramientas usó y por qué

### Tips de LangChain en N8N

- Usa **descripciones claras** en las herramientas; el agente decide basándose en ellas
- **Limita maxIterations** para evitar loops infinitos
- Usa **$fromAI()** para que el agente genere parámetros dinámicos para herramientas
- **Window Buffer Memory** es suficiente para la mayoría de conversaciones
- Para producción, usa **Redis Memory** para persistir entre reinicios`,
      estimatedMinutes: 25,
      n8nWorkflowJson: {
        name: "AI Support Agent",
        nodes: [
          {
            parameters: { httpMethod: "POST", path: "chat", responseMode: "responseNode" },
            id: "webhook-1",
            name: "Chat Webhook",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: {
              text: "={{ $json.message }}",
              agent: "conversationalAgent",
              options: {
                systemMessage: "Eres un asistente de soporte. Usa las herramientas para ayudar al usuario.",
                maxIterations: 5
              }
            },
            id: "agent-1",
            name: "AI Agent",
            type: "@n8n/n8n-nodes-langchain.agent",
            typeVersion: 1,
            position: [470, 300]
          },
          {
            parameters: {
              respondWith: "json",
              responseBody: "={{ JSON.stringify({ response: $json.output, sessionId: $json.sessionId }) }}"
            },
            id: "respond-1",
            name: "Responder",
            type: "n8n-nodes-base.respondToWebhook",
            typeVersion: 1,
            position: [690, 300]
          }
        ],
        connections: {
          "Chat Webhook": { main: [[{ node: "AI Agent", type: "main", index: 0 }]] },
          "AI Agent": { main: [[{ node: "Responder", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-04-02-1",
          question: "¿Qué función se usa en herramientas de N8N para que el agente genere parámetros dinámicos?",
          options: ["$ai()", "$fromAI()", "$agent()", "$tool()"],
          correctIndex: 1,
          explanation: "$fromAI() permite que el agente de LangChain genere valores dinámicos para los parámetros de las herramientas basándose en el contexto de la conversación."
        },
        {
          id: "q-04-02-2",
          question: "¿Qué opción limita cuántas veces un agente puede invocar herramientas?",
          options: ["maxTools", "maxIterations", "maxCalls", "toolLimit"],
          correctIndex: 1,
          explanation: "maxIterations limita el número de veces que el agente puede invocar herramientas, previniendo loops infinitos y controlando costos."
        },
        {
          id: "q-04-02-3",
          question: "¿Qué tipo de memoria persiste conversaciones entre reinicios de N8N?",
          options: [
            "Window Buffer Memory",
            "In-Memory Buffer",
            "Redis Memory",
            "Session Memory"
          ],
          correctIndex: 2,
          explanation: "Redis Memory persiste las conversaciones en Redis, sobreviviendo reinicios de N8N. Window Buffer Memory se pierde al reiniciar."
        }
      ]
    },
    {
      id: "les-04-03",
      moduleSlug: "automatizacion-ia",
      slug: "rag-pinecone",
      title: "RAG con Pinecone",
      description: "Construye un pipeline RAG completo: carga de documentos, embeddings, almacenamiento en Pinecone y generación con retrieval.",
      content: `## RAG (Retrieval-Augmented Generation) con Pinecone

RAG combina búsqueda de documentos relevantes con generación de texto por IA, produciendo respuestas precisas basadas en tu propia información.

### ¿Qué es RAG?

\`\`\`
[Usuario pregunta] → [Buscar documentos relevantes] → [Enviar docs + pregunta al LLM] → [Respuesta fundamentada]
\`\`\`

RAG resuelve el problema de las "alucinaciones" del LLM al proporcionar contexto real de tu base de conocimiento.

### Arquitectura completa

\`\`\`
FASE 1: Indexación
[Documentos] → [Text Splitter] → [Embeddings] → [Pinecone]

FASE 2: Retrieval
[Pregunta] → [Embedding] → [Pinecone Search] → [Top-K docs] → [LLM con contexto] → [Respuesta]
\`\`\`

### Fase 1: Indexación de documentos

#### Document Loader

Carga documentos de diversas fuentes:

\`\`\`json
{
  "loaderType": "pdfLoader",
  "filePath": "={{ $json.filePath }}",
  "options": {
    "splitPages": true
  }
}
\`\`\`

Tipos de loaders disponibles:
- **PDF Loader**: Documentos PDF
- **JSON Loader**: Archivos JSON
- **Text Loader**: Archivos de texto plano
- **GitHub Loader**: Repositorios de GitHub
- **Web Loader**: Páginas web

#### Text Splitter

Divide documentos en chunks manejables:

\`\`\`json
{
  "chunkSize": 1000,
  "chunkOverlap": 200,
  "options": {}
}
\`\`\`

**Parámetros clave:**
- **chunkSize**: Tamaño máximo de cada fragmento (tokens)
- **chunkOverlap**: Solapamiento entre chunks para mantener contexto

#### Embeddings con OpenAI

\`\`\`json
{
  "model": "text-embedding-3-small",
  "options": {}
}
\`\`\`

#### Pinecone Vector Store

\`\`\`json
{
  "mode": "insert",
  "pineconeIndex": "knowledge-base",
  "namespace": "docs-2024",
  "options": {}
}
\`\`\`

### Fase 2: Retrieval y generación

#### Vector Store Retriever

\`\`\`json
{
  "pineconeIndex": "knowledge-base",
  "namespace": "docs-2024",
  "topK": 5,
  "options": {}
}
\`\`\`

#### Chain con contexto

\`\`\`json
{
  "prompt": "=Contesta la siguiente pregunta usando SOLO el contexto proporcionado. Si la respuesta no está en el contexto, di 'No tengo información suficiente'.\\n\\nContexto:\\n{{ $json.context }}\\n\\nPregunta: {{ $json.question }}",
  "options": {
    "temperature": 0.2
  }
}
\`\`\`

### Workflow completo: Indexación

\`\`\`
[Webhook: upload de documento]
  → [Google Drive: Descargar archivo]
  → [Document Loader: PDF]
  → [Text Splitter: chunks de 1000]
  → [Embeddings: OpenAI]
  → [Pinecone: Insertar vectores]
  → [Respond: Indexación completa]
\`\`\`

### Workflow completo: Chat con RAG

\`\`\`
[Webhook: pregunta del usuario]
  → [Embeddings: Vectorizar pregunta]
  → [Pinecone: Buscar top-5 similares]
  → [Code: Formatear contexto]
  → [OpenAI: Generar respuesta con contexto]
  → [Respond to Webhook: respuesta + fuentes]
\`\`\`

### Metadata filtering en Pinecone

Filtra resultados por metadata durante la búsqueda:

\`\`\`json
{
  "pineconeIndex": "knowledge-base",
  "namespace": "docs-2024",
  "topK": 5,
  "filter": {
    "department": "engineering",
    "year": { "$gte": 2024 }
  }
}
\`\`\`

### Optimización de RAG

- **Chunk size óptimo**: 500-1500 tokens dependiendo del contenido
- **Overlap**: 10-20% del chunk size para mantener contexto
- **Top-K**: 3-5 documentos para balance velocidad/calidad
- **Re-ranking**: Usa un modelo de re-ranking después del retrieval para mejorar relevancia
- **HyDE**: Genera una respuesta hipotética primero, luego busca con ella

### Manejo de costos de Pinecone

- **Starter plan**: Gratis hasta 100K vectores
- **Standard**: Desde $70/mes para producción
- **Optimiza**: Usa namespaces para separar datos y reducir búsquedas innecesarias
- **Limpia vectores**: Elimina documentos obsoletos periódicamente`,
      estimatedMinutes: 25,
      n8nWorkflowJson: {
        name: "RAG Chat Pipeline",
        nodes: [
          {
            parameters: { httpMethod: "POST", path: "ask", responseMode: "responseNode" },
            id: "webhook-1",
            name: "Pregunta Webhook",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: {
              operation: "embeddings",
              model: "text-embedding-3-small",
              input: "={{ $json.question }}"
            },
            id: "embed-1",
            name: "Vectorizar Pregunta",
            type: "@n8n/n8n-nodes-langchain.openAi",
            typeVersion: 1,
            position: [470, 300]
          },
          {
            parameters: {
              method: "POST",
              url: "=https://{{ $env.PINECONE_INDEX }}.svc.{{ $env.PINECONE_ENV }}.pinecone.io/query",
              sendHeaders: true,
              headerParameters: {
                parameters: [
                  { name: "Api-Key", value: "={{ $env.PINECONE_API_KEY }}" },
                  { name: "Content-Type", value: "application/json" }
                ]
              },
              sendBody: true,
              specifyBody: "json",
              jsonBody: "={{ JSON.stringify({ vector: $json.embedding, topK: 5, includeMetadata: true, namespace: 'docs' }) }}"
            },
            id: "pinecone-1",
            name: "Buscar en Pinecone",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 4,
            position: [690, 300]
          }
        ],
        connections: {
          "Pregunta Webhook": { main: [[{ node: "Vectorizar Pregunta", type: "main", index: 0 }]] },
          "Vectorizar Pregunta": { main: [[{ node: "Buscar en Pinecone", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-04-03-1",
          question: "¿Qué problema principal resuelve RAG en los LLMs?",
          options: [
            "Velocidad de respuesta",
            "Alucinaciones y falta de conocimiento específico",
            "Costo de API",
            "Complejidad de implementación"
          ],
          correctIndex: 1,
          explanation: "RAG resuelve las alucinaciones del LLM al proporcionar contexto real de tu base de conocimiento, generando respuestas fundamentadas en datos reales."
        },
        {
          id: "q-04-03-2",
          question: "¿Cuál es el chunk size recomendado para RAG?",
          options: [
            "100-200 tokens",
            "500-1500 tokens",
            "5000-10000 tokens",
            "Todo el documento"
          ],
          correctIndex: 1,
          explanation: "El chunk size óptimo para RAG es 500-1500 tokens, balanceando suficiente contexto con precisión en la búsqueda."
        },
        {
          id: "q-04-03-3",
          question: "¿Qué es 'chunk overlap' y por qué es importante?",
          options: [
            "Es la duplicación de chunks para redundancia",
            "Es el solapamiento entre chunks para mantener contexto entre fragmentos",
            "Es el número de chunks que se envían al LLM",
            "Es la diferencia de tamaño entre chunks"
          ],
          correctIndex: 1,
          explanation: "Chunk overlap es el solapamiento entre chunks consecutivos (10-20% del tamaño), que mantiene el contexto y evita cortar información importante entre fragmentos."
        }
      ]
    },
    {
      id: "les-04-04",
      moduleSlug: "automatizacion-ia",
      slug: "ollama-local-models",
      title: "Modelos Locales con Ollama",
      description: "Ejecuta modelos de IA localmente con Ollama, conéctalos a N8N y construye automatizaciones con privacidad total.",
      content: `## Modelos Locales con Ollama

Ollama permite ejecutar modelos de IA de forma local, sin enviar datos a servicios cloud. Ideal para datos sensibles y automatizaciones con privacidad total.

### ¿Qué es Ollama?

Ollama es una herramienta open-source que simplifica la ejecución de modelos LLM localmente. Soporta modelos como Llama 3, Mistral, Code Llama, Phi-3 y muchos más.

### Instalación

En **Linux**:
\`\`\`bash
curl -fsSL https://ollama.com/install.sh | sh
\`\`\`

En **macOS**: Descarga desde ollama.com

En **Windows**: Descarga el instalador desde ollama.com

### Descargar y ejecutar modelos

\`\`\`bash
ollama pull llama3.1:8b
ollama pull mistral:7b
ollama pull codellama:13b
ollama pull phi3:mini

ollama run llama3.1:8b
\`\`\`

### API de Ollama

Ollama expone una API REST en \`http://localhost:11434\`:

#### Chat completion

\`\`\`bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.1:8b",
  "messages": [
    { "role": "system", "content": "Eres un asistente útil." },
    { "role": "user", "content": "¿Qué es N8N?" }
  ],
  "stream": false
}'
\`\`\`

#### Embeddings

\`\`\`bash
curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "Texto para vectorizar"
}'
\`\`\`

### Conectar Ollama con N8N

#### Opción 1: HTTP Request

\`\`\`json
{
  "method": "POST",
  "url": "http://ollama:11434/api/chat",
  "sendBody": true,
  "specifyBody": "json",
  "jsonBody": "={{ JSON.stringify({ model: 'llama3.1:8b', messages: [{ role: 'system', content: 'Eres un asistente de soporte.' }, { role: 'user', content: $json.pregunta }], stream: false }) }}",
  "options": {
    "timeout": 120000
  }
}
\`\`\`

#### Opción 2: N8N AI Nodes con Ollama

N8N tiene soporte nativo para Ollama en sus nodos de IA:

\`\`\`json
{
  "model": "llama3.1:8b",
  "baseUrl": "http://ollama:11434",
  "options": {
    "temperature": 0.3,
    "numPredict": 500
  }
}
\`\`\`

### Docker Compose con Ollama

\`\`\`yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - OLLAMA_HOST=http://ollama:11434
    depends_on:
      - ollama

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

volumes:
  ollama_data:
\`\`\`

### Modelos recomendados por caso de uso

| Modelo | Tamaño | Mejor para |
|---|---|---|
| llama3.1:8b | 4.7GB | Chat general, clasificación |
| mistral:7b | 4.1GB | Rápido, buen rendimiento general |
| codellama:13b | 7.4GB | Generación de código |
| phi3:mini | 2.2GB | Tareas simples, hardware limitado |
| nomic-embed-text | 274MB | Embeddings |
| llama3.1:70b | 40GB | Máxima calidad (requiere GPU potente) |

### Requisitos de hardware

| Modelo | RAM mínima | GPU recomendada |
|---|---|---|
| 7B params | 8GB | RTX 3060 (12GB VRAM) |
| 13B params | 16GB | RTX 4070 (12GB VRAM) |
| 70B params | 64GB | A100 (80GB VRAM) |

### Patrón: Clasificación privada de documentos

\`\`\`
[Webhook: documento subido]
  → [Document Loader: extraer texto]
  → [Ollama: Clasificar con Llama 3.1]
  → [Code: Parsear resultado]
  → [Supabase: Guardar clasificación]
  → [Respond: Clasificación completa]
\`\`\`

### Ventajas de modelos locales

- **Privacidad total**: Los datos nunca salen de tu infraestructura
- **Sin costos de API**: Solo el costo del hardware
- **Sin rate limits**: Procesamiento ilimitado
- **Latencia baja**: Sin round-trip a la nube
- **Personalización**: Fine-tuning con tus datos

### Limitaciones

- **Calidad inferior**: Los modelos locales pequeños no igualan a GPT-4o
- **Hardware requerido**: Necesitas GPU para modelos grandes
- **Mantenimiento**: Tú gestionas las actualizaciones y el modelo
- **Velocidad**: Más lento que APIs cloud en hardware modesto`,
      estimatedMinutes: 20,
      n8nWorkflowJson: {
        name: "Ollama Local Classification",
        nodes: [
          {
            parameters: { httpMethod: "POST", path: "classify", responseMode: "responseNode" },
            id: "webhook-1",
            name: "Clasificar Webhook",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: {
              method: "POST",
              url: "http://ollama:11434/api/chat",
              sendBody: true,
              specifyBody: "json",
              jsonBody: "={{ JSON.stringify({ model: 'llama3.1:8b', messages: [{ role: 'system', content: 'Clasifica el siguiente texto en una de estas categorías: factura, contrato, reporte, otro. Responde SOLO con la categoría.' }, { role: 'user', content: $json.texto }], stream: false }) }}",
              options: { timeout: 120000 }
            },
            id: "ollama-1",
            name: "Clasificar con Ollama",
            type: "n8n-nodes-base.httpRequest",
            typeVersion: 4,
            position: [470, 300]
          },
          {
            parameters: {
              respondWith: "json",
              responseBody: "={{ JSON.stringify({ categoria: $json.message.content.trim().toLowerCase(), modelo: 'llama3.1:8b', local: true }) }}"
            },
            id: "respond-1",
            name: "Responder",
            type: "n8n-nodes-base.respondToWebhook",
            typeVersion: 1,
            position: [690, 300]
          }
        ],
        connections: {
          "Clasificar Webhook": { main: [[{ node: "Clasificar con Ollama", type: "main", index: 0 }]] },
          "Clasificar con Ollama": { main: [[{ node: "Responder", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-04-04-1",
          question: "¿En qué puerto expone Ollama su API REST por defecto?",
          options: ["3000", "8080", "11434", "5678"],
          correctIndex: 2,
          explanation: "Ollama expone su API REST en el puerto 11434 por defecto (http://localhost:11434)."
        },
        {
          id: "q-04-04-2",
          question: "¿Cuál es la principal ventaja de usar modelos locales con Ollama?",
          options: [
            "Mayor calidad que GPT-4o",
            "Privacidad total: los datos nunca salen de tu infraestructura",
            "Menor consumo de recursos",
            "Mayor velocidad en cualquier hardware"
          ],
          correctIndex: 1,
          explanation: "La principal ventaja es la privacidad total: los datos se procesan localmente y nunca se envían a servicios cloud externos."
        },
        {
          id: "q-04-04-3",
          question: "¿Qué modelo de Ollama se recomienda para embeddings?",
          options: [
            "llama3.1:8b",
            "mistral:7b",
            "nomic-embed-text",
            "codellama:13b"
          ],
          correctIndex: 2,
          explanation: "nomic-embed-text es un modelo específicamente diseñado para generar embeddings, con solo 274MB de tamaño."
        }
      ]
    },
    {
      id: "les-04-05",
      moduleSlug: "automatizacion-ia",
      slug: "ai-agentic-workflows",
      title: "Workflows Agénticos con IA",
      description: "Construye sistemas multi-agente, tool calling, workflows autónomos y recuperación de errores con inteligencia artificial.",
      content: `## Workflows Agénticos con IA

Los workflows agénticos representan el nivel más avanzado de automatización con IA. Permiten crear sistemas autónomos que toman decisiones, usan herramientas y se recuperan de errores.

### ¿Qué es un workflow agéntico?

Un workflow agéntico combina:
- **LLM como cerebro**: Toma decisiones basadas en contexto
- **Herramientas**: APIs, bases de datos, código que el agente puede invocar
- **Memoria**: Contexto persistente entre interacciones
- **Planificación**: Capacidad de descomponer tareas complejas en pasos

### Arquitectura multi-agente

\`\`\`
[Supervisor Agent]
  ├── [Research Agent] → Tool: Web Search, Tool: Wikipedia
  ├── [Analysis Agent] → Tool: Calculator, Tool: Code Interpreter
  ├── [Writing Agent] → Tool: Grammar Check, Tool: Translator
  └── [QA Agent] → Tool: Validator, Tool: Test Runner
\`\`\`

### Implementación en N8N

#### Supervisor Agent

El supervisor decide qué agente debe manejar cada tarea:

\`\`\`json
{
  "text": "={{ $json.task }}",
  "agent": "conversationalAgent",
  "options": {
    "systemMessage": "Eres un supervisor de agentes. Analiza la tarea y decide qué sub-agente debe manejarla. Usa las herramientas para delegar trabajo.",
    "maxIterations": 10
  }
}
\`\`\`

#### Herramientas como sub-workflows

Cada agente especializado es un sub-workflow:

\`\`\`json
{
  "name": "research_agent",
  "description": "Investiga un tema en la web y bases de conocimiento. Input: tema a investigar",
  "workflowId": "={{ $env.WF_RESEARCH_AGENT }}"
}
\`\`\`

### Patrón: Research & Report

\`\`\`
[Webhook: solicitud de reporte]
  → [Supervisor Agent]
    ├── Tool: research_agent (buscar información)
    ├── Tool: analysis_agent (analizar datos)
    └── Tool: writing_agent (redactar reporte)
  → [QA Agent: validar calidad]
  → [Google Drive: guardar PDF]
  → [Email: enviar al solicitante]
\`\`\`

### Tool Calling avanzado

#### Herramienta con múltiples pasos

\`\`\`json
{
  "name": "analizar_competencia",
  "description": "Analiza la competencia de una empresa. Input: nombre de la empresa y sector",
  "jsCode": "const { empresa, sector } = JSON.parse($fromAI('params')); const results = await this.helpers.httpRequest({ method: 'GET', url: \`https://api.crunchbase.com/v4/search?q=\${empresa}\` }); return JSON.stringify({ empresa, sector, competidores: results.body.entities.slice(0, 5) });"
}
\`\`\`

#### Herramienta con estado

\`\`\`javascript
const sessionId = $json.sessionId;
const stateKey = \`agent_state:\${sessionId}\`;

let state = {};
try {
  const saved = await this.helpers.httpRequest({
    method: 'GET',
    url: \`http://redis:6379/\${stateKey}\`
  });
  state = JSON.parse(saved.body);
} catch {
  state = { steps: [], errors: 0 };
}

state.steps.push({ action: $json.action, result: $json.result, timestamp: Date.now() });

await this.helpers.httpRequest({
  method: 'POST',
  url: \`http://redis:6379/\${stateKey}\`,
  body: JSON.stringify(state)
});

return { json: state };
\`\`\`

### Error Recovery con IA

Cuando un agente falla, usa IA para recuperarse:

\`\`\`
[Agente ejecuta tarea] → (error) → [Error Handler Agent]
  → [Analizar error con LLM]
  → [Decidir: reintentar / modificar parámetros / escalar a humano]
  → [Ejecutar recuperación]
\`\`\`

#### Implementación del Error Handler

\`\`\`json
{
  "text": "=Un agente falló con el siguiente error:\\n\\nError: {{ $json.error.message }}\\nContexto: {{ JSON.stringify($json.context) }}\\n\\nAnaliza el error y sugiere una acción: RETRY, MODIFY_PARAMS, o ESCALATE. Responde en JSON: {\"action\": \"...\", \"reason\": \"...\", \"modifiedParams\": {...}}",
  "options": {
    "temperature": 0.1,
    "maxTokens": 300
  }
}
\`\`\`

### Patrón: Autonomous Data Pipeline

\`\`\`
[Schedule: diario]
  → [Agent: Identificar fuentes de datos]
  → [Agent: Extraer datos de cada fuente]
  → [Agent: Limpiar y validar datos]
  → [Agent: Detectar anomalías]
  → [Agent: Generar insights]
  → [Agent: Crear reporte ejecutivo]
  → [Slack: Enviar resumen]
  → [Supabase: Guardar resultados]
\`\`\`

### Human-in-the-loop

Para decisiones críticas, incluye aprobación humana:

\`\`\`
[Agente propone acción]
  → [IF: requiere aprobación?]
    → (sí) → [Slack: Solicitar aprobación] → [Wait: webhook de aprobación]
      → [IF: aprobado?] → (sí) → [Ejecutar acción]
                        → (no) → [Modificar y reintentar]
    → (no) → [Ejecutar directamente]
\`\`\`

### Monitoreo de agentes

Métricas clave para monitorear:

- **Iteraciones por tarea**: Si un agente usa muchas iteraciones, optimiza las herramientas
- **Tasa de éxito**: Porcentaje de tareas completadas exitosamente
- **Tiempo promedio**: Cuánto tarda en completar tareas típicas
- **Costo por tarea**: Tokens de LLM consumidos por tarea
- **Escalamientos**: Cuántas veces escala a humano

### Mejores prácticas

- **Limita maxIterations** para evitar loops infinitos y costos descontrolados
- **Usa descripciones detalladas** en las herramientas; el agente depende de ellas
- **Implementa timeouts** en cada herramienta
- **Loggea todas las decisiones** del agente para debugging
- **Empieza simple**: Un agente con 2-3 herramientas, luego escala
- **Usa structured output** para respuestas predecibles del agente
- **Implementa circuit breakers**: Si un agente falla 3 veces, escala a humano`,
      estimatedMinutes: 25,
      n8nWorkflowJson: {
        name: "Multi-Agent Research Pipeline",
        nodes: [
          {
            parameters: { httpMethod: "POST", path: "research", responseMode: "responseNode" },
            id: "webhook-1",
            name: "Research Request",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [250, 300]
          },
          {
            parameters: {
              text: "={{ $json.topic }}",
              agent: "conversationalAgent",
              options: {
                systemMessage: "Eres un supervisor de investigación. Usa las herramientas para investigar el tema, analizar datos y generar un reporte completo.",
                maxIterations: 10,
                returnIntermediateSteps: true
              }
            },
            id: "supervisor-1",
            name: "Supervisor Agent",
            type: "@n8n/n8n-nodes-langchain.agent",
            typeVersion: 1,
            position: [470, 300]
          },
          {
            parameters: {
              respondWith: "json",
              responseBody: "={{ JSON.stringify({ report: $json.output, steps: $json.intermediateSteps, topic: $json.topic }) }}"
            },
            id: "respond-1",
            name: "Return Report",
            type: "n8n-nodes-base.respondToWebhook",
            typeVersion: 1,
            position: [690, 300]
          }
        ],
        connections: {
          "Research Request": { main: [[{ node: "Supervisor Agent", type: "main", index: 0 }]] },
          "Supervisor Agent": { main: [[{ node: "Return Report", type: "main", index: 0 }]] }
        }
      },
      quiz: [
        {
          id: "q-04-05-1",
          question: "¿Qué componente NO es parte de un workflow agéntico?",
          options: [
            "LLM como cerebro",
            "Herramientas",
            "Base de datos relacional obligatoria",
            "Memoria"
          ],
          correctIndex: 2,
          explanation: "Un workflow agéntico requiere LLM, herramientas y memoria, pero no necesariamente una base de datos relacional. Puede usar cualquier almacenamiento."
        },
        {
          id: "q-04-05-2",
          question: "¿Qué patrón permite que un humano apruebe acciones críticas del agente?",
          options: [
            "Fan-out / Fan-in",
            "Human-in-the-loop",
            "Dead Letter Queue",
            "Circuit Breaker"
          ],
          correctIndex: 1,
          explanation: "Human-in-the-loop es el patrón donde el agente propone una acción pero espera aprobación humana antes de ejecutarla, ideal para decisiones críticas."
        },
        {
          id: "q-04-05-3",
          question: "¿Qué métrica indica que un agente necesita optimización de herramientas?",
          options: [
            "Alto costo por tarea",
            "Muchas iteraciones por tarea",
            "Baja tasa de éxito",
            "Todas las anteriores"
          ],
          correctIndex: 3,
          explanation: "Todas estas métricas indican problemas: muchas iteraciones sugiere herramientas poco eficientes, alto costo indica uso excesivo de tokens, y baja tasa de éxito indica errores frecuentes."
        }
      ]
    }
  ]
};
