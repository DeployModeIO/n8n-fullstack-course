import { Module } from "../../types/course";

export const module4: Module = {
  id: "mod-04",
  slug: "automatizacion-ia",
  title: "Automatización con IA (AI Agentic)",
  description: "Integra modelos de lenguaje, agentes autónomos y RAG en tus workflows de N8N.",
  icon: "Brain",
  sortOrder: 4,
  lessons: [
    {
      id: "les-04-01",
      moduleSlug: "automatizacion-ia",
      slug: "openai-integration",
      title: "Integración con OpenAI: GPT-4 y DALL-E",
      description: "Conecta N8N con OpenAI para generar texto, imágenes y procesar datos con IA.",
      estimatedMinutes: 25,
      content: `## Integración con OpenAI

OpenAI proporciona APIs para GPT-4 (texto), DALL-E (imágenes), Whisper (audio) y más. N8N puede integrarse con todos estos servicios.

### Configuración de Credenciales

1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea una nueva API key
3. En N8N, crea credenciales **OpenAI API**
4. Pega tu API key

### GPT-4: Generación de Texto

#### Chat Completion Simple

\`\`\`json
{
  "resource": "chat",
  "operation": "message",
  "modelId": "gpt-4",
  "messages": {
    "values": [
      {
        "role": "system",
        "content": "Eres un asistente útil que responde en español."
      },
      {
        "role": "user",
        "content": "={{ $json.pregunta }}"
      }
    ]
  },
  "options": {
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
\`\`\`

#### Chat con Contexto

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const conversation = item.json.conversation || [];
  const userMessage = item.json.mensaje;

  // Construir historial de conversación
  const messages = [
    {
      role: 'system',
      content: 'Eres un asistente de soporte técnico especializado en N8N.'
    },
    ...conversation.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: userMessage
    }
  ];

  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': \`Bearer \${$credentials.apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: {
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 1500
    }
  });

  const assistantMessage = response.data.choices[0].message.content;

  results.push({
    json: {
      ...item.json,
      respuesta: assistantMessage,
      conversation: [
        ...conversation,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantMessage }
      ],
      tokensUsed: response.data.usage.total_tokens
    }
  });
}

return results;
\`\`\`

#### Generación de Resúmenes

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const texto = item.json.contenido;

  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': \`Bearer \${$credentials.apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Genera un resumen conciso del siguiente texto en máximo 3 oraciones.'
        },
        {
          role: 'user',
          content: texto
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    }
  });

  results.push({
    json: {
      ...item.json,
      resumen: response.data.choices[0].message.content,
      originalLength: texto.length,
      summaryLength: response.data.choices[0].message.content.length
    }
  });
}

return results;
\`\`\`

#### Clasificación de Texto

\`\`\`javascript
const items = $input.all();
const categories = ['soporte', 'ventas', 'facturación', 'general'];

const results = [];

for (const item of items) {
  const mensaje = item.json.mensaje;

  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': \`Bearer \${$credentials.apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: \`Clasifica el siguiente mensaje en una de estas categorías: \${categories.join(', ')}. Responde solo con el nombre de la categoría.\`
        },
        {
          role: 'user',
          content: mensaje
        }
      ],
      temperature: 0,
      max_tokens: 20
    }
  });

  const categoria = response.data.choices[0].message.content.trim().toLowerCase();

  results.push({
    json: {
      ...item.json,
      categoria,
      confianza: response.data.choices[0].finish_reason
    }
  });
}

return results;
\`\`\`

#### Extracción de Datos Estructurados

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const texto = item.json.texto;

  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': \`Bearer \${$credentials.apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: \`Extrae la siguiente información del texto y devuelve un JSON válido:
{
  "nombre": "nombre completo",
  "email": "email",
  "telefono": "teléfono",
  "empresa": "nombre de empresa",
  "intereses": ["lista", "de", "intereses"]
}
Si algún campo no está presente, usa null.\`
        },
        {
          role: 'user',
          content: texto
        }
      ],
      temperature: 0,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    }
  });

  const extractedData = JSON.parse(response.data.choices[0].message.content);

  results.push({
    json: {
      ...item.json,
      datosExtraidos: extractedData
    }
  });
}

return results;
\`\`\`

### DALL-E: Generación de Imágenes

#### Generar Imagen desde Texto

\`\`\`json
{
  "resource": "image",
  "operation": "generate",
  "prompt": "={{ $json.descripcion }}",
  "options": {
    "size": "1024x1024",
    "quality": "hd",
    "n": 1
  }
}
\`\`\`

#### Generar Múltiples Variaciones

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const prompt = item.json.prompt;
  const variations = 3;

  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.openai.com/v1/images/generations',
    headers: {
      'Authorization': \`Bearer \${$credentials.apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: {
      model: 'dall-e-3',
      prompt,
      n: variations,
      size: '1024x1024',
      quality: 'hd'
    }
  });

  const images = response.data.data.map((img, index) => ({
    url: img.url,
    revisedPrompt: img.revised_prompt,
    variation: index + 1
  }));

  results.push({
    json: {
      ...item.json,
      images,
      generatedAt: new Date().toISOString()
    }
  });
}

return results;
\`\`\`

### Whisper: Transcripción de Audio

#### Transcribir Audio

\`\`\`javascript
const item = $input.first();
const audioFile = item.binary.audio;

// Convertir base64 a buffer
const audioBuffer = Buffer.from(audioFile.data, 'base64');

const formData = new FormData();
formData.append('file', audioBuffer, {
  filename: audioFile.fileName,
  contentType: audioFile.mimeType
});
formData.append('model', 'whisper-1');
formData.append('language', 'es');

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://api.openai.com/v1/audio/transcriptions',
  headers: {
    'Authorization': \`Bearer \${$credentials.apiKey}\`
  },
  body: formData,
  json: false
});

return [{
  json: {
    fileName: audioFile.fileName,
    transcription: response.data.text,
    duration: response.data.duration,
    language: response.data.language
  }
}];
\`\`\`

### Patrones Avanzados

#### Patrón: Content Generation Pipeline

\`\`\`
[Webhook: Request]
    ↓
[GPT-4: Generate Outline]
    ↓
[GPT-4: Write Sections]
    ↓
[GPT-4: Review and Edit]
    ↓
[DALL-E: Generate Images]
    ↓
[Assemble Final Content]
    ↓
[Return Response]
\`\`\`

#### Patrón: Customer Support Agent

\`\`\`
[Webhook: Customer Message]
    ↓
[GPT-4: Classify Intent]
    ↓
[IF: Simple Question?]
    ├─ Yes → [GPT-4: Generate Answer] → [Send Response]
    └─ No → [Search Knowledge Base]
              ↓
            [GPT-4: Answer with Context]
              ↓
            [IF: Confident?]
                ├─ Yes → [Send Response]
                └─ No → [Escalate to Human]
\`\`\`

#### Patrón: Data Enrichment with AI

\`\`\`
[Schedule: Daily]
    ↓
[Get New Records]
    ↓
[GPT-4: Extract Insights]
    ↓
[GPT-4: Generate Tags]
    ↓
[GPT-4: Score Quality]
    ↓
[Update Records]
\`\`\`

### Ejemplo Completo: Blog Post Generator

\`\`\`javascript
const item = $input.first();
const topic = item.json.topic;
const keywords = item.json.keywords || [];

// Paso 1: Generar outline
const outlineResponse = await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://api.openai.com/v1/chat/completions',
  headers: {
    'Authorization': \`Bearer \${$credentials.apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Eres un escritor experto en contenido SEO.'
      },
      {
        role: 'user',
        content: \`Genera un outline para un artículo de blog sobre: \${topic}
Keywords a incluir: \${keywords.join(', ')}
Devuelve un JSON con esta estructura:
{
  "title": "título atractivo",
  "sections": [
    {"heading": "H2 heading", "points": ["punto 1", "punto 2"]}
  ]
}\`
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  }
});

const outline = JSON.parse(outlineResponse.data.choices[0].message.content);

// Paso 2: Escribir cada sección
const sections = [];
for (const section of outline.sections) {
  const sectionResponse = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': \`Bearer \${$credentials.apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Escribe contenido detallado y atractivo para esta sección.'
        },
        {
          role: 'user',
          content: \`Escribe la sección "\${section.heading}" para el artículo "\${outline.title}".
Puntos a cubrir: \${section.points.join(', ')}
Extensión: 200-300 palabras.\`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }
  });

  sections.push({
    heading: section.heading,
    content: sectionResponse.data.choices[0].message.content
  });
}

// Paso 3: Generar imagen de portada
const imageResponse = await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://api.openai.com/v1/images/generations',
  headers: {
    'Authorization': \`Bearer \${$credentials.apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: {
    model: 'dall-e-3',
    prompt: \`Professional blog post cover image for: \${outline.title}. Modern, clean, relevant to the topic.\`,
    n: 1,
    size: '1792x1024',
    quality: 'hd'
  }
});

// Ensamblar artículo completo
const fullArticle = {
  title: outline.title,
  coverImage: imageResponse.data.data[0].url,
  introduction: sections[0]?.content || '',
  sections: sections.slice(1),
  metadata: {
    topic,
    keywords,
    generatedAt: new Date().toISOString(),
    wordCount: sections.reduce((sum, s) => sum + s.content.split(' ').length, 0)
  }
};

return [{ json: fullArticle }];
\`\`\`

### Optimización de Costos

#### Token Counting

\`\`\`javascript
// Estimar tokens antes de enviar
function estimateTokens(text) {
  // Aproximación: 1 token ≈ 4 caracteres en inglés, 2-3 en español
  return Math.ceil(text.length / 3);
}

const items = $input.all();
const results = [];

for (const item of items) {
  const prompt = item.json.prompt;
  const estimatedTokens = estimateTokens(prompt);
  
  // Verificar si excede el límite
  if (estimatedTokens > 3000) {
    results.push({
      json: {
        ...item.json,
        error: 'Prompt too long',
        estimatedTokens
      }
    });
    continue;
  }

  // Usar modelo más económico para tareas simples
  const model = estimatedTokens < 500 ? 'gpt-3.5-turbo' : 'gpt-4';

  const response = await this.helpers.httpRequest({
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Authorization': \`Bearer \${$credentials.apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: {
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    }
  });

  results.push({
    json: {
      ...item.json,
      respuesta: response.data.choices[0].message.content,
      model: model,
      tokensUsed: response.data.usage.total_tokens,
      estimatedCost: (response.data.usage.total_tokens / 1000) * 
        (model === 'gpt-4' ? 0.03 : 0.002)
    }
  });
}

return results;
\`\`\`

### Mejores Prácticas

1. **Rate limiting**: Respeta los límites de OpenAI (60 requests/minuto para GPT-4)
2. **Token management**: Monitorea el uso de tokens
3. **Error handling**: Maneja errores de rate limit y quota
4. **Caching**: Cachea respuestas para prompts repetidos
5. **Model selection**: Usa GPT-3.5 para tareas simples, GPT-4 para complejas
6. **Prompt engineering**: Diseña prompts claros y específicos
7. **Temperature**: Usa temperature baja (0-0.3) para tareas determinísticas
8. **Max tokens**: Limita max_tokens para controlar costos
9. **Batching**: Procesa múltiples items en paralelo cuando sea posible
10. **Monitoring**: Log todas las llamadas a la API

### Debugging

#### Verificar Uso de API

\`\`\`javascript
// Obtener uso de la API
const usage = await this.helpers.httpRequest({
  method: 'GET',
  url: 'https://api.openai.com/v1/usage',
  headers: {
    'Authorization': \`Bearer \${$credentials.apiKey}\`
  }
});

console.log('API Usage:', usage.data);
\`\`\`

### Recursos Adicionales

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GPT-4 Best Practices](https://platform.openai.com/docs/guides/gpt-best-practices)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI Pricing](https://openai.com/pricing)
`,
    },
    {
      id: "les-04-02",
      moduleSlug: "automatizacion-ia",
      slug: "langchain-n8n",
      title: "LangChain en N8N: Agentes y Cadenas",
      description: "Implementa agentes autónomos y cadenas de procesamiento con LangChain en N8N.",
      estimatedMinutes: 30,
      content: `## LangChain en N8N

LangChain es un framework para construir aplicaciones con LLMs. En N8N, puedes usar LangChain para crear agentes autónomos y cadenas complejas.

### Instalación de LangChain

LangChain viene preinstalado en N8N. Puedes usarlo directamente en el Code node.

### Conceptos Básicos

#### Components de LangChain

1. **Models**: LLMs (OpenAI, Anthropic, etc.)
2. **Prompts**: Templates para prompts
3. **Chains**: Secuencias de operaciones
4. **Agents**: Agentes autónomos con herramientas
5. **Memory**: Memoria de conversación
6. **Tools**: Herramientas que el agente puede usar

### Cadenas Simples (Chains)

#### Chain Básica con OpenAI

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require('langchain/prompts');
const { LLMChain } = require('langchain/chains');

const items = $input.all();
const results = [];

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0.7
});

const prompt = new PromptTemplate({
  template: 'Genera un título atractivo para un artículo sobre: {topic}',
  inputVariables: ['topic']
});

const chain = new LLMChain({ llm, prompt });

for (const item of items) {
  const response = await chain.call({ topic: item.json.topic });
  
  results.push({
    json: {
      ...item.json,
      titulo: response.text
    }
  });
}

return results;
\`\`\`

#### Sequential Chain

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require('langchain/prompts');
const { LLMChain, SequentialChain } = require('langchain/chains');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0.7
});

// Chain 1: Generar outline
const outlinePrompt = new PromptTemplate({
  template: 'Genera un outline de 3 puntos para un artículo sobre: {topic}',
  inputVariables: ['topic']
});
const outlineChain = new LLMChain({ llm, prompt: outlinePrompt, outputKey: 'outline' });

// Chain 2: Escribir introducción
const introPrompt = new PromptTemplate({
  template: 'Escribe una introducción basada en este outline: {outline}',
  inputVariables: ['outline']
});
const introChain = new LLMChain({ llm, prompt: introPrompt, outputKey: 'introduction' });

// Sequential Chain
const overallChain = new SequentialChain({
  chains: [outlineChain, introChain],
  inputVariables: ['topic'],
  outputVariables: ['outline', 'introduction']
});

const item = $input.first();
const response = await overallChain.call({ topic: item.json.topic });

return [{
  json: {
    topic: item.json.topic,
    outline: response.outline,
    introduction: response.introduction
  }
}];
\`\`\`

### Agentes Autónomos

#### Agente con Herramientas

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { Calculator } = require('langchain/tools/calculator');
const { WebBrowser } = require('langchain/tools/webbrowser');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Definir herramientas
const tools = [
  new Calculator(),
  new WebBrowser({ llm, embeddings: null })
];

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  verbose: true,
  maxIterations: 5
});

const item = $input.first();
const question = item.json.pregunta;

const result = await executor.call({ input: question });

return [{
  json: {
    pregunta: question,
    respuesta: result.output,
    steps: result.intermediateSteps
  }
}];
\`\`\`

#### Agente Personalizado con Herramientas Custom

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('langchain/tools');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Herramienta custom: Buscar en base de datos
const databaseSearch = new DynamicTool({
  name: 'database_search',
  description: 'Busca información en la base de datos de clientes. Input debe ser un email.',
  func: async (email) => {
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: \`\${$credentials.supabaseUrl}/rest/v1/customers?email=eq.\${email}\`,
      headers: {
        'apikey': $credentials.supabaseKey,
        'Authorization': \`Bearer \${$credentials.supabaseKey}\`
      }
    });
    
    if (response.data.length === 0) {
      return 'Cliente no encontrado';
    }
    
    const customer = response.data[0];
    return \`Cliente encontrado: \${customer.name}, Plan: \${customer.plan}, Status: \${customer.status}\`;
  }
});

// Herramienta custom: Calcular métricas
const metricsCalculator = new DynamicTool({
  name: 'metrics_calculator',
  description: 'Calcula métricas de uso del cliente. Input debe ser un customer ID.',
  func: async (customerId) => {
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: \`\${$credentials.supabaseUrl}/rest/v1/usage_metrics?customer_id=eq.\${customerId}\`,
      headers: {
        'apikey': $credentials.supabaseKey,
        'Authorization': \`Bearer \${$credentials.supabaseKey}\`
      }
    });
    
    const metrics = response.data;
    const totalUsage = metrics.reduce((sum, m) => sum + m.usage, 0);
    const avgUsage = totalUsage / metrics.length;
    
    return \`Métricas de uso: Total: \${totalUsage}, Promedio: \${avgUsage.toFixed(2)}, Registros: \${metrics.length}\`;
  }
});

const tools = [databaseSearch, metricsCalculator];

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  verbose: true,
  maxIterations: 10
});

const item = $input.first();
const question = item.json.pregunta;

const result = await executor.call({ input: question });

return [{
  json: {
    pregunta: question,
    respuesta: result.output,
    toolsUsed: result.intermediateSteps.map(step => step.action.tool)
  }
}];
\`\`\`

### Memoria de Conversación

#### Conversation Buffer Memory

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { ConversationChain } = require('langchain/chains');
const { BufferMemory } = require('langchain/memory');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0.7
});

const memory = new BufferMemory({
  memoryKey: 'history',
  returnMessages: true
});

const chain = new ConversationChain({ llm, memory });

const items = $input.all();
const results = [];

for (const item of items) {
  const conversationId = item.json.conversationId;
  const userMessage = item.json.mensaje;

  // Cargar historial si existe
  if (item.json.history) {
    for (const msg of item.json.history) {
      if (msg.role === 'user') {
        await memory.chatHistory.addUserMessage(msg.content);
      } else {
        await memory.chatHistory.addAIChatMessage(msg.content);
      }
    }
  }

  const response = await chain.call({ input: userMessage });

  // Obtener historial actualizado
  const messages = await memory.chatHistory.getMessages();
  const history = messages.map(msg => ({
    role: msg._getType() === 'human' ? 'user' : 'assistant',
    content: msg.content
  }));

  results.push({
    json: {
      conversationId,
      respuesta: response.response,
      history
    }
  });
}

return results;
\`\`\`

#### Conversation Summary Memory

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { ConversationChain } = require('langchain/chains');
const { ConversationSummaryMemory } = require('langchain/memory');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0.7
});

const memory = new ConversationSummaryMemory({
  memoryKey: 'history',
  llm
});

const chain = new ConversationChain({ llm, memory });

const item = $input.first();

// Cargar resumen previo si existe
if (item.json.previousSummary) {
  memory.buffer = item.json.previousSummary;
}

const response = await chain.call({ input: item.json.mensaje });

return [{
  json: {
    respuesta: response.response,
    summary: memory.buffer,
    conversationId: item.json.conversationId
  }
}];
\`\`\`

### Patrones Avanzados

#### Patrón: Multi-Agent System

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('langchain/tools');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Agente 1: Investigador
const researcherTools = [
  new DynamicTool({
    name: 'web_search',
    description: 'Busca información en la web',
    func: async (query) => {
      // Implementar búsqueda web
      return \`Resultados de búsqueda para: \${query}\`;
    }
  })
];

const researcher = await initializeAgentExecutorWithOptions(researcherTools, llm, {
  agentType: 'zero-shot-react-description',
  agentArgs: {
    prefix: 'Eres un investigador experto. Tu trabajo es buscar y recopilar información.'
  }
});

// Agente 2: Analista
const analystTools = [
  new DynamicTool({
    name: 'analyze_data',
    description: 'Analiza datos y genera insights',
    func: async (data) => {
      // Implementar análisis
      return \`Análisis de: \${data}\`;
    }
  })
];

const analyst = await initializeAgentExecutorWithOptions(analystTools, llm, {
  agentType: 'zero-shot-react-description',
  agentArgs: {
    prefix: 'Eres un analista de datos experto. Tu trabajo es analizar información y generar insights.'
  }
});

// Agente 3: Escritor
const writerTools = [
  new DynamicTool({
    name: 'write_report',
    description: 'Escribe reportes profesionales',
    func: async (content) => {
      // Implementar escritura
      return \`Reporte generado: \${content.substring(0, 100)}...\`;
    }
  })
];

const writer = await initializeAgentExecutorWithOptions(writerTools, llm, {
  agentType: 'zero-shot-react-description',
  agentArgs: {
    prefix: 'Eres un escritor profesional. Tu trabajo es crear reportes claros y concisos.'
  }
});

// Orquestar agentes
const item = $input.first();
const task = item.json.task;

// Paso 1: Investigación
const research = await researcher.call({ 
  input: \`Investiga sobre: \${task}\` 
});

// Paso 2: Análisis
const analysis = await analyst.call({ 
  input: \`Analiza esta investigación: \${research.output}\` 
});

// Paso 3: Escritura
const report = await writer.call({ 
  input: \`Escribe un reporte basado en: \${analysis.output}\` 
});

return [{
  json: {
    task,
    research: research.output,
    analysis: analysis.output,
    finalReport: report.output
  }
}];
\`\`\`

#### Patrón: RAG (Retrieval-Augmented Generation)

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
const { RetrievalQAChain } = require('langchain/chains');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: $credentials.apiKey
});

// Cargar documentos
const items = $input.all();
const documents = items.map(item => ({
  pageContent: item.json.content,
  metadata: { source: item.json.source, id: item.json.id }
}));

// Crear vector store
const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

// Crear retriever
const retriever = vectorStore.asRetriever({ k: 3 });

// Crear RAG chain
const chain = RetrievalQAChain.fromLLM(llm, retriever);

// Responder pregunta
const question = '¿Cuál es la política de devoluciones?';
const response = await chain.call({ query: question });

return [{
  json: {
    question,
    answer: response.text,
    sources: response.sourceDocuments.map(doc => doc.metadata.source)
  }
}];
\`\`\`

### Mejores Prácticas

1. **Agent configuration**: Configura maxIterations para evitar loops infinitos
2. **Tool descriptions**: Escribe descripciones claras para las herramientas
3. **Memory management**: Usa el tipo de memoria apropiado para tu caso
4. **Error handling**: Maneja errores de agentes gracefully
5. **Logging**: Log intermediate steps para debugging
6. **Cost control**: Monitorea el uso de tokens en agentes
7. **Testing**: Prueba agentes con diferentes inputs
8. **Prompt engineering**: Diseña prompts específicos para cada agente

### Debugging

#### Ver Agent Steps

\`\`\`javascript
const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  verbose: true, // Habilita logging detallado
  maxIterations: 5
});

const result = await executor.call({ input: question });

console.log('=== AGENT EXECUTION ===');
console.log('Input:', question);
console.log('Output:', result.output);
console.log('Steps:');
result.intermediateSteps.forEach((step, i) => {
  console.log(\`Step \${i + 1}:\`);
  console.log('  Action:', step.action.tool);
  console.log('  Input:', step.action.toolInput);
  console.log('  Observation:', step.observation);
});
\`\`\`

### Recursos Adicionales

- [LangChain Documentation](https://js.langchain.com/docs/)
- [LangChain Agents](https://js.langchain.com/docs/modules/agents/)
- [LangChain Memory](https://js.langchain.com/docs/modules/memory/)
- [LangChain Tools](https://js.langchain.com/docs/modules/tools/)
`,
    },
    {
      id: "les-04-03",
      moduleSlug: "automatizacion-ia",
      slug: "rag-vector-databases",
      title: "RAG y Bases de Datos Vectoriales",
      description: "Implementa Retrieval-Augmented Generation con Pinecone, Weaviate y embeddings.",
      estimatedMinutes: 30,
      content: `## RAG y Bases de Datos Vectoriales

RAG (Retrieval-Augmented Generation) combina búsqueda de información con generación de texto para crear respuestas más precisas y contextuales.

### Conceptos Básicos

#### ¿Qué es RAG?

RAG funciona en dos fases:
1. **Retrieval**: Busca documentos relevantes en una base de datos vectorial
2. **Generation**: Usa los documentos encontrados como contexto para generar una respuesta

#### Embeddings

Los embeddings son representaciones vectoriales de texto que capturan significado semántico.

\`\`\`javascript
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: $credentials.apiKey,
  modelName: 'text-embedding-ada-002'
});

const text = 'N8N es una plataforma de automatización de workflows';
const vector = await embeddings.embedQuery(text);

console.log('Vector dimension:', vector.length); // 1536 para ada-002
console.log('First 5 values:', vector.slice(0, 5));
\`\`\`

### Pinecone Integration

#### Configuración

1. Crea una cuenta en [Pinecone](https://www.pinecone.io/)
2. Crea un nuevo index
3. Obtén tu API key y environment
4. En N8N, crea credenciales **Pinecone API**

#### Crear Embeddings y Subir a Pinecone

\`\`\`javascript
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: $credentials.openaiKey
});

const pinecone = new Pinecone({
  apiKey: $credentials.pineconeKey,
  environment: $credentials.pineconeEnvironment
});

const index = pinecone.Index($credentials.pineconeIndex);

const items = $input.all();
const vectors = [];

for (const item of items) {
  const text = item.json.content;
  const id = item.json.id;
  
  // Generar embedding
  const embedding = await embeddings.embedQuery(text);
  
  vectors.push({
    id,
    values: embedding,
    metadata: {
      text,
      source: item.json.source,
      category: item.json.category,
      timestamp: new Date().toISOString()
    }
  });
}

// Subir en batches de 100
const batchSize = 100;
for (let i = 0; i < vectors.length; i += batchSize) {
  const batch = vectors.slice(i, i + batchSize);
  await index.upsert(batch);
}

return [{
  json: {
    uploaded: vectors.length,
    index: $credentials.pineconeIndex
  }
}];
\`\`\`

#### Búsqueda Semántica en Pinecone

\`\`\`javascript
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: $credentials.openaiKey
});

const pinecone = new Pinecone({
  apiKey: $credentials.pineconeKey,
  environment: $credentials.pineconeEnvironment
});

const index = pinecone.Index($credentials.pineconeIndex);

const item = $input.first();
const query = item.json.pregunta;

// Generar embedding de la pregunta
const queryEmbedding = await embeddings.embedQuery(query);

// Buscar documentos similares
const results = await index.query({
  vector: queryEmbedding,
  topK: 5,
  includeMetadata: true,
  filter: {
    category: { $eq: item.json.category || 'general' }
  }
});

const relevantDocs = results.matches.map(match => ({
  id: match.id,
  text: match.metadata.text,
  score: match.score,
  source: match.metadata.source
}));

return [{
  json: {
    pregunta: query,
    documentosRelevantes: relevantDocs,
    topScore: relevantDocs[0]?.score || 0
  }
}];
\`\`\`

#### RAG Completo con Pinecone

\`\`\`javascript
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { OpenAI } = require('langchain/llms/openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: $credentials.openaiKey
});

const llm = new OpenAI({
  openAIApiKey: $credentials.openaiKey,
  modelName: 'gpt-4',
  temperature: 0
});

const pinecone = new Pinecone({
  apiKey: $credentials.pineconeKey,
  environment: $credentials.pineconeEnvironment
});

const index = pinecone.Index($credentials.pineconeIndex);

const item = $input.first();
const question = item.json.pregunta;

// Paso 1: Retrieval
const queryEmbedding = await embeddings.embedQuery(question);
const results = await index.query({
  vector: queryEmbedding,
  topK: 3,
  includeMetadata: true
});

const context = results.matches
  .map(match => match.metadata.text)
  .join('\\n\\n');

// Paso 2: Generation
const prompt = \`Responde la siguiente pregunta usando solo la información proporcionada en el contexto. Si la respuesta no está en el contexto, di "No tengo suficiente información para responder".

Contexto:
\${context}

Pregunta: \${question}

Respuesta:\`;

const response = await llm.call(prompt);

return [{
  json: {
    pregunta: question,
    respuesta: response,
    fuentesUsadas: results.matches.map(m => m.metadata.source),
    confianza: results.matches[0]?.score || 0
  }
}];
\`\`\`

### Weaviate Integration

#### Configuración

1. Despliega Weaviate (cloud o self-hosted)
2. Obtén tu API key y URL
3. En N8N, configura las credenciales

#### Crear Schema y Subir Datos

\`\`\`javascript
const weaviateUrl = $credentials.weaviateUrl;
const apiKey = $credentials.weaviateKey;

// Crear schema
const schema = {
  class: 'Document',
  vectorizer: 'text2vec-openai',
  moduleConfig: {
    'text2vec-openai': {
      model: 'ada',
      modelVersion: '002',
      type: 'text'
    }
  },
  properties: [
    {
      name: 'content',
      dataType: ['text']
    },
    {
      name: 'source',
      dataType: ['text']
    },
    {
      name: 'category',
      dataType: ['text']
    }
  ]
};

await this.helpers.httpRequest({
  method: 'POST',
  url: \`\${weaviateUrl}/v1/schema\`,
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: schema
});

// Subir documentos
const items = $input.all();
const batch = items.map(item => ({
  class: 'Document',
  properties: {
    content: item.json.content,
    source: item.json.source,
    category: item.json.category
  }
}));

await this.helpers.httpRequest({
  method: 'POST',
  url: \`\${weaviateUrl}/v1/batch\`,
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: { objects: batch }
});

return [{
  json: {
    uploaded: batch.length,
    schema: 'Document'
  }
}];
\`\`\`

#### Búsqueda Semántica en Weaviate

\`\`\`javascript
const weaviateUrl = $credentials.weaviateUrl;
const apiKey = $credentials.weaviateKey;

const item = $input.first();
const question = item.json.pregunta;

const query = \`
{
  Get {
    Document(
      nearText: {
        concepts: ["\${question}"]
      }
      limit: 5
    ) {
      content
      source
      category
      _additional {
        certainty
        distance
      }
    }
  }
}
\`;

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: \`\${weaviateUrl}/v1/graphql\`,
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: { query }
});

const documents = response.data.data.Get.Document.map(doc => ({
  content: doc.content,
  source: doc.source,
  category: doc.category,
  certainty: doc._additional.certainty,
  distance: doc._additional.distance
}));

return [{
  json: {
    pregunta: question,
    documentos: documents,
    topCertainty: documents[0]?.certainty || 0
  }
}];
\`\`\`

### Patrones Avanzados

#### Patrón: Multi-Source RAG

\`\`\`javascript
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { OpenAI } = require('langchain/llms/openai');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: $credentials.openaiKey
});

const llm = new OpenAI({
  openAIApiKey: $credentials.openaiKey,
  modelName: 'gpt-4',
  temperature: 0
});

const item = $input.first();
const question = item.json.pregunta;

// Buscar en múltiples fuentes
const queryEmbedding = await embeddings.embedQuery(question);

// Fuente 1: Pinecone (documentación técnica)
const pineconeResults = await searchPinecone(queryEmbedding, 3);

// Fuente 2: Weaviate (FAQs)
const weaviateResults = await searchWeaviate(question, 3);

// Fuente 3: Base de datos SQL (datos estructurados)
const sqlResults = await searchSQL(question);

// Combinar resultados
const allContext = [
  ...pineconeResults.map(r => \`[Documentación]: \${r.text}\`),
  ...weaviateResults.map(r => \`[FAQ]: \${r.content}\`),
  ...sqlResults.map(r => \`[Datos]: \${r.answer}\`)
].join('\\n\\n');

// Generar respuesta
const prompt = \`Responde la pregunta usando la información de múltiples fuentes. Cita la fuente cuando sea relevante.

Fuentes:
\${allContext}

Pregunta: \${question}

Respuesta:\`;

const response = await llm.call(prompt);

return [{
  json: {
    pregunta: question,
    respuesta: response,
    fuentes: {
      documentacion: pineconeResults.length,
      faqs: weaviateResults.length,
      datos: sqlResults.length
    }
  }
}];

async function searchPinecone(embedding, k) {
  // Implementación de búsqueda en Pinecone
}

async function searchWeaviate(query, k) {
  // Implementación de búsqueda en Weaviate
}

async function searchSQL(query) {
  // Implementación de búsqueda en SQL
}
\`\`\`

#### Patrón: Conversational RAG

\`\`\`javascript
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { OpenAI } = require('langchain/llms/openai');
const { Pinecone } = require('@pinecone-database/pinecone');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: $credentials.openaiKey
});

const llm = new OpenAI({
  openAIApiKey: $credentials.openaiKey,
  modelName: 'gpt-4',
  temperature: 0
});

const pinecone = new Pinecone({
  apiKey: $credentials.pineconeKey,
  environment: $credentials.pineconeEnvironment
});

const index = pinecone.Index($credentials.pineconeIndex);

const item = $input.first();
const question = item.json.pregunta;
const conversationHistory = item.json.history || [];

// Reformular pregunta con contexto de conversación
const reformulatePrompt = \`Dada la siguiente conversación y una pregunta de seguimiento, reformula la pregunta de seguimiento para que sea una pregunta independiente.

Conversación:
\${conversationHistory.map(h => \`\${h.role}: \${h.content}\`).join('\\n')}

Pregunta de seguimiento: \${question}

Pregunta independiente:\`;

const standaloneQuestion = await llm.call(reformulatePrompt);

// Buscar con la pregunta reformulada
const queryEmbedding = await embeddings.embedQuery(standaloneQuestion);
const results = await index.query({
  vector: queryEmbedding,
  topK: 3,
  includeMetadata: true
});

const context = results.matches.map(m => m.metadata.text).join('\\n\\n');

// Generar respuesta
const responsePrompt = \`Responde la pregunta usando el contexto proporcionado.

Contexto:
\${context}

Pregunta: \${standaloneQuestion}

Respuesta:\`;

const response = await llm.call(responsePrompt);

// Actualizar historial
const newHistory = [
  ...conversationHistory,
  { role: 'user', content: question },
  { role: 'assistant', content: response }
];

return [{
  json: {
    pregunta: question,
    preguntaReformulada: standaloneQuestion,
    respuesta: response,
    history: newHistory,
    fuentes: results.matches.map(m => m.metadata.source)
  }
}];
\`\`\`

### Optimización de Performance

#### Chunking de Documentos

\`\`\`javascript
function chunkText(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

const items = $input.all();
const allChunks = [];

for (const item of items) {
  const chunks = chunkText(item.json.content);
  
  chunks.forEach((chunk, index) => {
    allChunks.push({
      json: {
        id: \`\${item.json.id}_chunk_\${index}\`,
        content: chunk,
        source: item.json.source,
        chunkIndex: index,
        totalChunks: chunks.length
      }
    });
  });
}

return allChunks;
\`\`\`

### Mejores Prácticas

1. **Chunk size**: Usa chunks de 500-1500 tokens con overlap
2. **Metadata**: Incluye metadata rica para filtrado
3. **Hybrid search**: Combina búsqueda vectorial con keyword search
4. **Reranking**: Usa un modelo para reordenar resultados
5. **Caching**: Cachea embeddings para documentos estáticos
6. **Evaluation**: Evalúa la calidad de las respuestas
7. **Cost control**: Monitorea el uso de embeddings y LLM
8. **Versioning**: Versiona tus índices para cambios de schema

### Debugging

#### Evaluar Calidad de RAG

\`\`\`javascript
const testQuestions = [
  {
    question: '¿Cuál es la política de devoluciones?',
    expectedAnswer: '30 días'
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    expectedAnswer: 'tarjeta, PayPal'
  }
];

const results = [];

for (const test of testQuestions) {
  const response = await ragQuery(test.question);
  
  results.push({
    json: {
      question: test.question,
      expected: test.expectedAnswer,
      actual: response.answer,
      sources: response.sources,
      relevance: response.confidence
    }
  });
}

return results;
\`\`\`

### Recursos Adicionales

- [Pinecone Documentation](https://docs.pinecone.io/)
- [Weaviate Documentation](https://weaviate.io/developers/weaviate)
- [LangChain RAG Tutorial](https://js.langchain.com/docs/use_cases/question_answering/)
- [Embedding Models Comparison](https://huggingface.co/spaces/mteb/leaderboard)
`,
    },
    {
      id: "les-04-04",
      moduleSlug: "automatizacion-ia",
      slug: "ai-agents-avanzados",
      title: "Agentes de IA Avanzados",
      description: "Construye agentes autónomos complejos con planificación, reflexión y múltiples herramientas.",
      estimatedMinutes: 35,
      content: `## Agentes de IA Avanzados

Los agentes avanzados pueden planificar, reflexionar sobre sus acciones y usar múltiples herramientas de forma autónoma.

### Planificación con Agentes

#### Plan-and-Execute Pattern

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('langchain/tools');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Paso 1: Crear plan
const planningPrompt = \`Dada la siguiente tarea, crea un plan detallado con pasos específicos.

Tarea: \${$input.first().json.task}

Devuelve un JSON con esta estructura:
{
  "goal": "objetivo principal",
  "steps": [
    {"step": 1, "action": "descripción de la acción", "tool": "nombre de la herramienta"},
    {"step": 2, "action": "descripción de la acción", "tool": "nombre de la herramienta"}
  ]
}\`;

const planResponse = await llm.call(planningPrompt);
const plan = JSON.parse(planResponse);

// Paso 2: Ejecutar cada paso
const results = [];
const context = { plan, completedSteps: [] };

for (const step of plan.steps) {
  const executionPrompt = \`Ejecuta el siguiente paso del plan:

Paso \${step.step}: \${step.action}
Herramienta a usar: \${step.tool}

Contexto previo:
\${JSON.stringify(context.completedSteps, null, 2)}

Devuelve el resultado de ejecutar este paso.\`;

  const stepResult = await llm.call(executionPrompt);
  
  context.completedSteps.push({
    step: step.step,
    action: step.action,
    result: stepResult
  });
  
  results.push({
    step: step.step,
    action: step.action,
    result: stepResult
  });
}

// Paso 3: Generar resumen final
const summaryPrompt = \`Dado el plan original y los resultados de cada paso, genera un resumen final.

Plan: \${JSON.stringify(plan, null, 2)}

Resultados:
\${JSON.stringify(results, null, 2)}

Genera un resumen conciso de lo que se logró.\`;

const summary = await llm.call(summaryPrompt);

return [{
  json: {
    task: $input.first().json.task,
    plan,
    executionResults: results,
    summary
  }
}];
\`\`\`

### Reflexión y Auto-Corrección

#### Reflexion Agent

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

const item = $input.first();
const task = item.json.task;
const maxIterations = 3;

let currentAttempt = '';
let reflection = '';
let iteration = 0;

while (iteration < maxIterations) {
  iteration++;
  
  // Generar solución
  const solutionPrompt = reflection 
    ? \`Tarea: \${task}

Intento anterior:
\${currentAttempt}

Reflexión sobre el intento anterior:
\${reflection}

Genera una nueva solución mejorada basada en la reflexión.\`
    : \`Tarea: \${task}

Genera una solución detallada para esta tarea.\`;

  currentAttempt = await llm.call(solutionPrompt);
  
  // Reflexionar sobre la solución
  const reflectionPrompt = \`Analiza críticamente la siguiente solución:

Tarea: \${task}

Solución propuesta:
\${currentAttempt}

Evalúa:
1. ¿La solución aborda completamente la tarea?
2. ¿Hay errores o inconsistencias?
3. ¿Se puede mejorar?
4. ¿Falta algo importante?

Si la solución es satisfactoria, responde: "SOLUCIÓN ACEPTABLE"
Si necesita mejoras, proporciona feedback específico.\`;

  reflection = await llm.call(reflectionPrompt);
  
  if (reflection.includes('SOLUCIÓN ACEPTABLE')) {
    break;
  }
}

return [{
  json: {
    task,
    finalSolution: currentAttempt,
    iterations: iteration,
    lastReflection: reflection,
    accepted: reflection.includes('SOLUCIÓN ACEPTABLE')
  }
}];
\`\`\`

### Multi-Tool Agents

#### Agente con Múltiples Herramientas Especializadas

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('langchain/tools');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Herramienta 1: Búsqueda web
const webSearch = new DynamicTool({
  name: 'web_search',
  description: 'Busca información actualizada en la web. Input: query de búsqueda.',
  func: async (query) => {
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: 'https://api.search.com/search',
      qs: { q: query, limit: 5 },
      headers: { 'Authorization': \`Bearer \${$credentials.searchApiKey}\` }
    });
    
    return response.data.results.map(r => 
      \`Título: \${r.title}\\nURL: \${r.url}\\nResumen: \${r.snippet}\`
    ).join('\\n\\n');
  }
});

// Herramienta 2: Calculadora avanzada
const calculator = new DynamicTool({
  name: 'calculator',
  description: 'Realiza cálculos matemáticos complejos. Input: expresión matemática.',
  func: async (expression) => {
    try {
      const result = eval(expression);
      return \`Resultado: \${result}\`;
    } catch (error) {
      return \`Error en el cálculo: \${error.message}\`;
    }
  }
});

// Herramienta 3: Base de datos interna
const databaseQuery = new DynamicTool({
  name: 'database_query',
  description: 'Consulta la base de datos interna de la empresa. Input: descripción de lo que buscas.',
  func: async (query) => {
    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: \`\${$credentials.supabaseUrl}/rest/v1/rpc/search_internal_data\`,
      headers: {
        'apikey': $credentials.supabaseKey,
        'Authorization': \`Bearer \${$credentials.supabaseKey}\`,
        'Content-Type': 'application/json'
      },
      body: { search_query: query }
    });
    
    return response.data.map(r => 
      \`ID: \${r.id}\\nTipo: \${r.type}\\nContenido: \${r.content}\`
    ).join('\\n\\n');
  }
});

// Herramienta 4: Generador de código
const codeGenerator = new DynamicTool({
  name: 'code_generator',
  description: 'Genera código basado en una descripción. Input: descripción del código necesario.',
  func: async (description) => {
    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': \`Bearer \${$credentials.openaiKey}\`,
        'Content-Type': 'application/json'
      },
      body: {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Eres un experto programador. Genera código limpio y funcional.' },
          { role: 'user', content: description }
        ],
        temperature: 0.2
      }
    });
    
    return response.data.choices[0].message.content;
  }
});

const tools = [webSearch, calculator, databaseQuery, codeGenerator];

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  verbose: true,
  maxIterations: 10,
  agentArgs: {
    prefix: \`Eres un asistente experto con acceso a múltiples herramientas. Tu objetivo es resolver tareas complejas usando las herramientas disponibles de forma estratégica.

Pautas:
1. Analiza la tarea antes de actuar
2. Usa las herramientas en el orden más lógico
3. Verifica tus resultados
4. Si una herramienta falla, intenta un enfoque alternativo\`
  }
});

const item = $input.first();
const task = item.json.task;

const result = await executor.call({ input: task });

return [{
  json: {
    task,
    solution: result.output,
    steps: result.intermediateSteps.map(step => ({
      tool: step.action.tool,
      input: step.action.toolInput,
      observation: step.observation
    }))
  }
}];
\`\`\`

### Agentes Especializados

#### Research Agent

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('langchain/tools');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0.3
});

const tools = [
  new DynamicTool({
    name: 'academic_search',
    description: 'Busca papers académicos y artículos científicos.',
    func: async (query) => {
      // Implementar búsqueda en Google Scholar, arXiv, etc.
      return \`Resultados académicos para: \${query}\`;
    }
  }),
  new DynamicTool({
    name: 'news_search',
    description: 'Busca noticias recientes y artículos de prensa.',
    func: async (query) => {
      // Implementar búsqueda en News API
      return \`Noticias recientes sobre: \${query}\`;
    }
  }),
  new DynamicTool({
    name: 'statistical_data',
    description: 'Obtiene datos estadísticos y métricas.',
    func: async (query) => {
      // Implementar búsqueda en APIs de datos
      return \`Datos estadísticos sobre: \${query}\`;
    }
  })
];

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  agentArgs: {
    prefix: \`Eres un investigador experto. Tu trabajo es:
1. Buscar información de múltiples fuentes
2. Verificar la credibilidad de las fuentes
3. Sintetizar información contradictoria
4. Proporcionar citas y referencias
5. Identificar gaps en la información\`
  }
});

const item = $input.first();
const researchQuestion = item.json.researchQuestion;

const result = await executor.call({ 
  input: \`Investiga: \${researchQuestion}\\n\\nProporciona un reporte completo con fuentes.\` 
});

return [{
  json: {
    researchQuestion,
    report: result.output,
    sources: result.intermediateSteps.map(s => s.action.toolInput)
  }
}];
\`\`\`

#### Data Analysis Agent

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('langchain/tools');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

const tools = [
  new DynamicTool({
    name: 'load_dataset',
    description: 'Carga un dataset para análisis. Input: nombre del dataset.',
    func: async (datasetName) => {
      const response = await this.helpers.httpRequest({
        method: 'GET',
        url: \`\${$credentials.supabaseUrl}/rest/v1/\${datasetName}?select=*\`,
        headers: {
          'apikey': $credentials.supabaseKey,
          'Authorization': \`Bearer \${$credentials.supabaseKey}\`
        }
      });
      
      return JSON.stringify(response.data.slice(0, 100)); // Primeros 100 registros
    }
  }),
  new DynamicTool({
    name: 'calculate_statistics',
    description: 'Calcula estadísticas de un campo. Input: "dataset.field".',
    func: async (input) => {
      const [dataset, field] = input.split('.');
      
      const response = await this.helpers.httpRequest({
        method: 'GET',
        url: \`\${$credentials.supabaseUrl}/rest/v1/\${dataset}?select=\${field}\`,
        headers: {
          'apikey': $credentials.supabaseKey,
          'Authorization': \`Bearer \${$credentials.supabaseKey}\`
        }
      });
      
      const values = response.data.map(r => r[field]).filter(v => v !== null);
      const sum = values.reduce((a, b) => a + b, 0);
      const mean = sum / values.length;
      const sorted = [...values].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      
      return \`Estadísticas de \${field}:
- Count: \${values.length}
- Mean: \${mean.toFixed(2)}
- Median: \${median}
- Min: \${Math.min(...values)}
- Max: \${Math.max(...values)}\`;
    }
  }),
  new DynamicTool({
    name: 'generate_chart',
    description: 'Genera código para visualización. Input: descripción del chart.',
    func: async (description) => {
      const response = await this.helpers.httpRequest({
        method: 'POST',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Authorization': \`Bearer \${$credentials.openaiKey}\`,
          'Content-Type': 'application/json'
        },
        body: {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'Genera código Python con matplotlib para visualización de datos.' },
            { role: 'user', content: description }
          ]
        }
      });
      
      return response.data.choices[0].message.content;
    }
  })
];

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  agentArgs: {
    prefix: \`Eres un analista de datos experto. Tu trabajo es:
1. Explorar datasets
2. Calcular estadísticas relevantes
3. Identificar patrones y anomalías
4. Generar visualizaciones
5. Proporcionar insights accionables\`
  }
});

const item = $input.first();
const analysisTask = item.json.analysisTask;

const result = await executor.call({ input: analysisTask });

return [{
  json: {
    analysisTask,
    analysis: result.output,
    steps: result.intermediateSteps
  }
}];
\`\`\`

### Patrones de Coordinación

#### Supervisor Pattern

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Definir agentes especializados
const agents = {
  researcher: {
    description: 'Investigador experto en búsqueda de información',
    func: async (task) => {
      // Implementar agente de investigación
      return \`Investigación completada: \${task}\`;
    }
  },
  analyst: {
    description: 'Analista de datos y estadísticas',
    func: async (task) => {
      // Implementar agente de análisis
      return \`Análisis completado: \${task}\`;
    }
  },
  writer: {
    description: 'Escritor profesional de reportes',
    func: async (task) => {
      // Implementar agente de escritura
      return \`Reporte escrito: \${task}\`;
    }
  }
};

// Supervisor decide qué agente usar
const supervisorPrompt = \`Dada la siguiente tarea, decide qué agente especializado debe ejecutarla.

Agentes disponibles:
\${Object.entries(agents).map(([name, agent]) => 
  \`- \${name}: \${agent.description}\`
).join('\\n')}

Tarea: \${$input.first().json.task}

Responde solo con el nombre del agente más apropiado.\`;

const selectedAgent = (await llm.call(supervisorPrompt)).trim().toLowerCase();

// Ejecutar con el agente seleccionado
const agent = agents[selectedAgent];
if (!agent) {
  throw new Error(\`Agente no encontrado: \${selectedAgent}\`);
}

const result = await agent.func($input.first().json.task);

return [{
  json: {
    task: $input.first().json.task,
    selectedAgent,
    result
  }
}];
\`\`\`

### Mejores Prácticas

1. **Clear instructions**: Proporciona instrucciones claras y específicas
2. **Tool descriptions**: Escribe descripciones detalladas de herramientas
3. **Error handling**: Maneja errores gracefully en agentes
4. **Iteration limits**: Establece límites de iteraciones
5. **Logging**: Log todas las acciones del agente
6. **Testing**: Prueba agentes con casos edge
7. **Cost monitoring**: Monitorea el uso de tokens
8. **Human-in-the-loop**: Incluye validación humana para decisiones críticas

### Debugging

#### Trace Agent Execution

\`\`\`javascript
const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  verbose: true,
  maxIterations: 5,
  returnIntermediateSteps: true
});

const result = await executor.call({ input: task });

console.log('=== AGENT TRACE ===');
console.log('Input:', task);
console.log('\\nExecution Steps:');
result.intermediateSteps.forEach((step, i) => {
  console.log(\`\\nStep \${i + 1}:\`);
  console.log('  Thought:', step.action.log);
  console.log('  Action:', step.action.tool);
  console.log('  Input:', step.action.toolInput);
  console.log('  Observation:', step.observation);
});
console.log('\\nFinal Output:', result.output);
\`\`\`

### Recursos Adicionales

- [LangChain Agents Guide](https://js.langchain.com/docs/modules/agents/)
- [Agent Architectures](https://lilianweng.github.io/posts/2023-06-23-agent/)
- [ReAct Paper](https://arxiv.org/abs/2210.03629)
- [Plan-and-Solve Paper](https://arxiv.org/abs/2305.04091)
`,
    },
  ],
};
