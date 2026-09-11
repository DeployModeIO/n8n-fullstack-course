import { Module } from "../../types/course";

export const module4: Module = {
  id: "mod-04",
  slug: "ai-automation",
  title: "AI Automation (Agentic AI)",
  description: "Integrate language models, autonomous agents and RAG into your N8N workflows.",
  icon: "Brain",
  sortOrder: 4,
  lessons: [
    {
      id: "les-04-01",
      moduleSlug: "ai-automation",
      slug: "openai-integration",
      title: "OpenAI Integration: GPT-4 and DALL-E",
      description: "Connect N8N to OpenAI to generate text and images and to process data with AI.",
      estimatedMinutes: 25,
      content: `## OpenAI Integration

OpenAI provides APIs for GPT-4 (text), DALL-E (images), Whisper (audio) and more. N8N can integrate with all of these services.

### Credentials Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. In N8N, create the **OpenAI API** credentials
4. Paste your API key

### GPT-4: Text Generation

#### Simple Chat Completion

\`\`\`json
{
  "resource": "chat",
  "operation": "message",
  "modelId": "gpt-4",
  "messages": {
    "values": [
      {
        "role": "system",
        "content": "You are a helpful assistant that answers in English."
      },
      {
        "role": "user",
        "content": "={{ $json.question }}"
      }
    ]
  },
  "options": {
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
\`\`\`

#### Chat with Context

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const conversation = item.json.conversation || [];
  const userMessage = item.json.message;

  // Build the conversation history
  const messages = [
    {
      role: 'system',
      content: 'You are a technical support assistant specialized in N8N.'
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
      answer: assistantMessage,
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

#### Generating Summaries

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const text = item.json.content;

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
          content: 'Generate a concise summary of the following text in at most 3 sentences.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    }
  });

  results.push({
    json: {
      ...item.json,
      summary: response.data.choices[0].message.content,
      originalLength: text.length,
      summaryLength: response.data.choices[0].message.content.length
    }
  });
}

return results;
\`\`\`

#### Text Classification

\`\`\`javascript
const items = $input.all();
const categories = ['support', 'sales', 'billing', 'general'];

const results = [];

for (const item of items) {
  const message = item.json.message;

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
          content: \`Classify the following message into one of these categories: \${categories.join(', ')}. Reply only with the category name.\`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0,
      max_tokens: 20
    }
  });

  const category = response.data.choices[0].message.content.trim().toLowerCase();

  results.push({
    json: {
      ...item.json,
      category,
      confidence: response.data.choices[0].finish_reason
    }
  });
}

return results;
\`\`\`

#### Extracting Structured Data

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const text = item.json.text;

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
          content: \`Extract the following information from the text and return valid JSON:
{
  "name": "full name",
  "email": "email",
  "phone": "phone number",
  "company": "company name",
  "interests": ["list", "of", "interests"]
}
If a field is not present, use null.\`
        },
        {
          role: 'user',
          content: text
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
      extractedData: extractedData
    }
  });
}

return results;
\`\`\`

### DALL-E: Image Generation

#### Generating an Image from Text

\`\`\`json
{
  "resource": "image",
  "operation": "generate",
  "prompt": "={{ $json.description }}",
  "options": {
    "size": "1024x1024",
    "quality": "hd",
    "n": 1
  }
}
\`\`\`

#### Generating Multiple Variations

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

### Whisper: Audio Transcription

#### Transcribing Audio

\`\`\`javascript
const item = $input.first();
const audioFile = item.binary.audio;

// Convert base64 to a buffer
const audioBuffer = Buffer.from(audioFile.data, 'base64');

const formData = new FormData();
formData.append('file', audioBuffer, {
  filename: audioFile.fileName,
  contentType: audioFile.mimeType
});
formData.append('model', 'whisper-1');
formData.append('language', 'en');

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

### Advanced Patterns

#### Pattern: Content Generation Pipeline

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

#### Pattern: Customer Support Agent

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

#### Pattern: Data Enrichment with AI

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

### Complete Example: Blog Post Generator

\`\`\`javascript
const item = $input.first();
const topic = item.json.topic;
const keywords = item.json.keywords || [];

// Step 1: Generate the outline
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
        content: 'You are an expert SEO content writer.'
      },
      {
        role: 'user',
        content: \`Generate an outline for a blog article about: \${topic}
Keywords to include: \${keywords.join(', ')}
Return JSON with this structure:
{
  "title": "engaging title",
  "sections": [
    {"heading": "H2 heading", "points": ["point 1", "point 2"]}
  ]
}\`
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  }
});

const outline = JSON.parse(outlineResponse.data.choices[0].message.content);

// Step 2: Write each section
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
          content: 'Write detailed and engaging content for this section.'
        },
        {
          role: 'user',
          content: \`Write the section "\${section.heading}" for the article "\${outline.title}".
Points to cover: \${section.points.join(', ')}
Length: 200-300 words.\`
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

// Step 3: Generate the cover image
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

// Assemble the full article
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

### Cost Optimization

#### Token Counting

\`\`\`javascript
// Estimate the tokens before sending the request
function estimateTokens(text) {
  // Approximation: 1 token ≈ 4 characters in English, 2-3 in Spanish
  return Math.ceil(text.length / 3);
}

const items = $input.all();
const results = [];

for (const item of items) {
  const prompt = item.json.prompt;
  const estimatedTokens = estimateTokens(prompt);
  
  // Check whether it exceeds the limit
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

  // Use a cheaper model for simple tasks
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
      answer: response.data.choices[0].message.content,
      model: model,
      tokensUsed: response.data.usage.total_tokens,
      estimatedCost: (response.data.usage.total_tokens / 1000) * 
        (model === 'gpt-4' ? 0.03 : 0.002)
    }
  });
}

return results;
\`\`\`

### Best Practices

1. **Rate limiting**: Respect the OpenAI limits (60 requests/minute for GPT-4)
2. **Token management**: Monitor token usage
3. **Error handling**: Handle rate limit and quota errors
4. **Caching**: Cache responses for repeated prompts
5. **Model selection**: Use GPT-3.5 for simple tasks and GPT-4 for complex ones
6. **Prompt engineering**: Design clear and specific prompts
7. **Temperature**: Use a low temperature (0-0.3) for deterministic tasks
8. **Max tokens**: Limit max_tokens to control costs
9. **Batching**: Process multiple items in parallel whenever possible
10. **Monitoring**: Log every API call

### Debugging

#### Verifying API Usage

\`\`\`javascript
// Fetch the API usage
const usage = await this.helpers.httpRequest({
  method: 'GET',
  url: 'https://api.openai.com/v1/usage',
  headers: {
    'Authorization': \`Bearer \${$credentials.apiKey}\`
  }
});

console.log('API Usage:', usage.data);
\`\`\`

### Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GPT-4 Best Practices](https://platform.openai.com/docs/guides/gpt-best-practices)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI Pricing](https://openai.com/pricing)
`,
    },
    {
      id: "les-04-02",
      moduleSlug: "ai-automation",
      slug: "langchain-n8n",
      title: "LangChain in N8N: Agents and Chains",
      description: "Implement autonomous agents and processing chains with LangChain in N8N.",
      estimatedMinutes: 30,
      content: `## LangChain in N8N

LangChain is a framework for building applications with LLMs. In N8N you can use LangChain to create autonomous agents and complex chains.

### Installing LangChain

LangChain is preinstalled with N8N. You can use it directly in the Code node.

### Core Concepts

#### LangChain Components

1. **Models**: LLMs (OpenAI, Anthropic, etc.)
2. **Prompts**: Prompt templates
3. **Chains**: Sequences of operations
4. **Agents**: Autonomous agents with tools
5. **Memory**: Conversation memory
6. **Tools**: Tools the agent can use

### Simple Chains

#### Basic Chain with OpenAI

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
  template: 'Generate an engaging title for an article about: {topic}',
  inputVariables: ['topic']
});

const chain = new LLMChain({ llm, prompt });

for (const item of items) {
  const response = await chain.call({ topic: item.json.topic });
  
  results.push({
    json: {
      ...item.json,
      title: response.text
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

// Chain 1: Generate the outline
const outlinePrompt = new PromptTemplate({
  template: 'Generate a 3-point outline for an article about: {topic}',
  inputVariables: ['topic']
});
const outlineChain = new LLMChain({ llm, prompt: outlinePrompt, outputKey: 'outline' });

// Chain 2: Write the introduction
const introPrompt = new PromptTemplate({
  template: 'Write an introduction based on this outline: {outline}',
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

### Autonomous Agents

#### Agent with Tools

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

// Define the tools
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
const question = item.json.question;

const result = await executor.call({ input: question });

return [{
  json: {
    question: question,
    answer: result.output,
    steps: result.intermediateSteps
  }
}];
\`\`\`

#### Custom Agent with Custom Tools

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('langchain/tools');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Custom tool: search the database
const databaseSearch = new DynamicTool({
  name: 'database_search',
  description: 'Search the customer database for information. The input must be an email.',
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
      return 'Customer not found';
    }
    
    const customer = response.data[0];
    return \`Customer found: \${customer.name}, Plan: \${customer.plan}, Status: \${customer.status}\`;
  }
});

// Custom tool: calculate metrics
const metricsCalculator = new DynamicTool({
  name: 'metrics_calculator',
  description: 'Calculate customer usage metrics. The input must be a customer ID.',
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
    
    return \`Usage metrics: Total: \${totalUsage}, Average: \${avgUsage.toFixed(2)}, Records: \${metrics.length}\`;
  }
});

const tools = [databaseSearch, metricsCalculator];

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  verbose: true,
  maxIterations: 10
});

const item = $input.first();
const question = item.json.question;

const result = await executor.call({ input: question });

return [{
  json: {
    question: question,
    answer: result.output,
    toolsUsed: result.intermediateSteps.map(step => step.action.tool)
  }
}];
\`\`\`

### Conversation Memory

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
  const userMessage = item.json.message;

  // Load the history if it exists
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

  // Get the updated history
  const messages = await memory.chatHistory.getMessages();
  const history = messages.map(msg => ({
    role: msg._getType() === 'human' ? 'user' : 'assistant',
    content: msg.content
  }));

  results.push({
    json: {
      conversationId,
      answer: response.response,
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

// Load the previous summary if it exists
if (item.json.previousSummary) {
  memory.buffer = item.json.previousSummary;
}

const response = await chain.call({ input: item.json.message });

return [{
  json: {
    answer: response.response,
    summary: memory.buffer,
    conversationId: item.json.conversationId
  }
}];
\`\`\`

### Advanced Patterns

#### Pattern: Multi-Agent System

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('langchain/tools');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Agent 1: Researcher
const researcherTools = [
  new DynamicTool({
    name: 'web_search',
    description: 'Search the web for information',
    func: async (query) => {
      // Implement the web search
      return \`Search results for: \${query}\`;
    }
  })
];

const researcher = await initializeAgentExecutorWithOptions(researcherTools, llm, {
  agentType: 'zero-shot-react-description',
  agentArgs: {
    prefix: 'You are an expert researcher. Your job is to search for and gather information.'
  }
});

// Agent 2: Analyst
const analystTools = [
  new DynamicTool({
    name: 'analyze_data',
    description: 'Analyze data and generate insights',
    func: async (data) => {
      // Implement the analysis
      return \`Analysis of: \${data}\`;
    }
  })
];

const analyst = await initializeAgentExecutorWithOptions(analystTools, llm, {
  agentType: 'zero-shot-react-description',
  agentArgs: {
    prefix: 'You are an expert data analyst. Your job is to analyze information and generate insights.'
  }
});

// Agent 3: Writer
const writerTools = [
  new DynamicTool({
    name: 'write_report',
    description: 'Write professional reports',
    func: async (content) => {
      // Implement the writing
      return \`Report generated: \${content.substring(0, 100)}...\`;
    }
  })
];

const writer = await initializeAgentExecutorWithOptions(writerTools, llm, {
  agentType: 'zero-shot-react-description',
  agentArgs: {
    prefix: 'You are a professional writer. Your job is to create clear and concise reports.'
  }
});

// Orchestrate the agents
const item = $input.first();
const task = item.json.task;

// Step 1: Research
const research = await researcher.call({ 
  input: \`Research: \${task}\` 
});

// Step 2: Analysis
const analysis = await analyst.call({ 
  input: \`Analyze this research: \${research.output}\` 
});

// Step 3: Writing
const report = await writer.call({ 
  input: \`Write a report based on: \${analysis.output}\` 
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

#### Pattern: RAG (Retrieval-Augmented Generation)

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

// Load the documents
const items = $input.all();
const documents = items.map(item => ({
  pageContent: item.json.content,
  metadata: { source: item.json.source, id: item.json.id }
}));

// Create the vector store
const vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);

// Create the retriever
const retriever = vectorStore.asRetriever({ k: 3 });

// Create the RAG chain
const chain = RetrievalQAChain.fromLLM(llm, retriever);

// Answer the question
const question = 'What is the return policy?';
const response = await chain.call({ query: question });

return [{
  json: {
    question,
    answer: response.text,
    sources: response.sourceDocuments.map(doc => doc.metadata.source)
  }
}];
\`\`\`

### Best Practices

1. **Agent configuration**: Set maxIterations to avoid infinite loops
2. **Tool descriptions**: Write clear descriptions for the tools
3. **Memory management**: Use the memory type that fits your use case
4. **Error handling**: Handle agent errors gracefully
5. **Logging**: Log intermediate steps for debugging
6. **Cost control**: Monitor token usage in agents
7. **Testing**: Test agents with different inputs
8. **Prompt engineering**: Design specific prompts for each agent

### Debugging

#### Viewing Agent Steps

\`\`\`javascript
const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  verbose: true, // Enables detailed logging
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

### Additional Resources

- [LangChain Documentation](https://js.langchain.com/docs/)
- [LangChain Agents](https://js.langchain.com/docs/modules/agents/)
- [LangChain Memory](https://js.langchain.com/docs/modules/memory/)
- [LangChain Tools](https://js.langchain.com/docs/modules/tools/)
`,
    },
    {
      id: "les-04-03",
      moduleSlug: "ai-automation",
      slug: "rag-vector-databases",
      title: "RAG and Vector Databases",
      description: "Implement Retrieval-Augmented Generation with Pinecone, Weaviate and embeddings.",
      estimatedMinutes: 30,
      content: `## RAG and Vector Databases

RAG (Retrieval-Augmented Generation) combines information retrieval with text generation to deliver more accurate, contextual answers.

### Core Concepts

#### What is RAG?

RAG works in two phases:
1. **Retrieval**: Find relevant documents in a vector database
2. **Generation**: Use the retrieved documents as context to generate an answer

#### Embeddings

Embeddings are vector representations of text that capture semantic meaning.

\`\`\`javascript
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: $credentials.apiKey,
  modelName: 'text-embedding-ada-002'
});

const text = 'N8N is a workflow automation platform';
const vector = await embeddings.embedQuery(text);

console.log('Vector dimension:', vector.length); // 1536 for ada-002
console.log('First 5 values:', vector.slice(0, 5));
\`\`\`

### Pinecone Integration

#### Setup

1. Create an account at [Pinecone](https://www.pinecone.io/)
2. Create a new index
3. Get your API key and environment
4. In N8N, create the **Pinecone API** credentials

#### Creating Embeddings and Uploading to Pinecone

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
  
  // Generate the embedding
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

// Upload in batches of 100
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

#### Semantic Search in Pinecone

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
const query = item.json.question;

// Generate the embedding of the question
const queryEmbedding = await embeddings.embedQuery(query);

// Search for similar documents
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
    question: query,
    relevantDocuments: relevantDocs,
    topScore: relevantDocs[0]?.score || 0
  }
}];
\`\`\`

#### Complete RAG with Pinecone

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
const question = item.json.question;

// Step 1: Retrieval
const queryEmbedding = await embeddings.embedQuery(question);
const results = await index.query({
  vector: queryEmbedding,
  topK: 3,
  includeMetadata: true
});

const context = results.matches
  .map(match => match.metadata.text)
  .join('\\n\\n');

// Step 2: Generation
const prompt = \`Answer the following question using only the information provided in the context. If the answer is not in the context, say "I do not have enough information to answer".

Context:
\${context}

Question: \${question}

Answer:\`;

const response = await llm.call(prompt);

return [{
  json: {
    question: question,
    answer: response,
    sourcesUsed: results.matches.map(m => m.metadata.source),
    confidence: results.matches[0]?.score || 0
  }
}];
\`\`\`

### Weaviate Integration

#### Setup

1. Deploy Weaviate (cloud or self-hosted)
2. Get your API key and URL
3. In N8N, configure the credentials

#### Creating a Schema and Uploading Data

\`\`\`javascript
const weaviateUrl = $credentials.weaviateUrl;
const apiKey = $credentials.weaviateKey;

// Create the schema
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

// Upload the documents
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

#### Semantic Search in Weaviate

\`\`\`javascript
const weaviateUrl = $credentials.weaviateUrl;
const apiKey = $credentials.weaviateKey;

const item = $input.first();
const question = item.json.question;

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
    question: question,
    documents: documents,
    topCertainty: documents[0]?.certainty || 0
  }
}];
\`\`\`

### Advanced Patterns

#### Pattern: Multi-Source RAG

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
const question = item.json.question;

// Search across multiple sources
const queryEmbedding = await embeddings.embedQuery(question);

// Source 1: Pinecone (technical documentation)
const pineconeResults = await searchPinecone(queryEmbedding, 3);

// Source 2: Weaviate (FAQs)
const weaviateResults = await searchWeaviate(question, 3);

// Source 3: SQL database (structured data)
const sqlResults = await searchSQL(question);

// Combine the results
const allContext = [
  ...pineconeResults.map(r => \`[Documentation]: \${r.text}\`),
  ...weaviateResults.map(r => \`[FAQ]: \${r.content}\`),
  ...sqlResults.map(r => \`[Data]: \${r.answer}\`)
].join('\\n\\n');

// Generate the answer
const prompt = \`Answer the question using information from multiple sources. Cite the source when relevant.

Sources:
\${allContext}

Question: \${question}

Answer:\`;

const response = await llm.call(prompt);

return [{
  json: {
    question: question,
    answer: response,
    sources: {
      documentation: pineconeResults.length,
      faqs: weaviateResults.length,
      data: sqlResults.length
    }
  }
}];

async function searchPinecone(embedding, k) {
  // Implementation of the Pinecone search
}

async function searchWeaviate(query, k) {
  // Implementation of the Weaviate search
}

async function searchSQL(query) {
  // Implementation of the SQL search
}
\`\`\`

#### Pattern: Conversational RAG

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
const question = item.json.question;
const conversationHistory = item.json.history || [];

// Reformulate the question using the conversation context
const reformulatePrompt = \`Given the following conversation and a follow-up question, reformulate the follow-up question so that it stands alone.

Conversation:
\${conversationHistory.map(h => \`\${h.role}: \${h.content}\`).join('\\n')}

Follow-up question: \${question}

Standalone question:\`;

const standaloneQuestion = await llm.call(reformulatePrompt);

// Search using the reformulated question
const queryEmbedding = await embeddings.embedQuery(standaloneQuestion);
const results = await index.query({
  vector: queryEmbedding,
  topK: 3,
  includeMetadata: true
});

const context = results.matches.map(m => m.metadata.text).join('\\n\\n');

// Generate the answer
const responsePrompt = \`Answer the question using the provided context.

Context:
\${context}

Question: \${standaloneQuestion}

Answer:\`;

const response = await llm.call(responsePrompt);

// Update the history
const newHistory = [
  ...conversationHistory,
  { role: 'user', content: question },
  { role: 'assistant', content: response }
];

return [{
  json: {
    question: question,
    reformulatedQuestion: standaloneQuestion,
    answer: response,
    history: newHistory,
    sources: results.matches.map(m => m.metadata.source)
  }
}];
\`\`\`

### Performance Optimization

#### Document Chunking

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

### Best Practices

1. **Chunk size**: Use chunks of 500-1500 tokens with overlap
2. **Metadata**: Include rich metadata for filtering
3. **Hybrid search**: Combine vector search with keyword search
4. **Reranking**: Use a model to rerank the results
5. **Caching**: Cache embeddings for static documents
6. **Evaluation**: Evaluate the quality of the answers
7. **Cost control**: Monitor embedding and LLM usage
8. **Versioning**: Version your indexes for schema changes

### Debugging

#### Evaluating RAG Quality

\`\`\`javascript
const testQuestions = [
  {
    question: 'What is the return policy?',
    expectedAnswer: '30 days'
  },
  {
    question: 'Which payment methods do you accept?',
    expectedAnswer: 'card, PayPal'
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

### Additional Resources

- [Pinecone Documentation](https://docs.pinecone.io/)
- [Weaviate Documentation](https://weaviate.io/developers/weaviate)
- [LangChain RAG Tutorial](https://js.langchain.com/docs/use_cases/question_answering/)
- [Embedding Models Comparison](https://huggingface.co/spaces/mteb/leaderboard)
`,
    },
    {
      id: "les-04-04",
      moduleSlug: "ai-automation",
      slug: "advanced-ai-agents",
      title: "Advanced AI Agents",
      description: "Build complex autonomous agents with planning, reflection and multiple tools.",
      estimatedMinutes: 35,
      content: `## Advanced AI Agents

Advanced agents can plan, reflect on their actions and use multiple tools autonomously.

### Planning with Agents

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

// Step 1: Create the plan
const planningPrompt = \`Given the following task, create a detailed plan with specific steps.

Task: \${$input.first().json.task}

Return JSON with this structure:
{
  "goal": "main objective",
  "steps": [
    {"step": 1, "action": "action description", "tool": "tool name"},
    {"step": 2, "action": "action description", "tool": "tool name"}
  ]
}\`;

const planResponse = await llm.call(planningPrompt);
const plan = JSON.parse(planResponse);

// Step 2: Execute each step
const results = [];
const context = { plan, completedSteps: [] };

for (const step of plan.steps) {
  const executionPrompt = \`Execute the following step of the plan:

Step \${step.step}: \${step.action}
Tool to use: \${step.tool}

Previous context:
\${JSON.stringify(context.completedSteps, null, 2)}

Return the result of executing this step.\`;

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

// Step 3: Generate the final summary
const summaryPrompt = \`Given the original plan and the results of each step, generate a final summary.

Plan: \${JSON.stringify(plan, null, 2)}

Results:
\${JSON.stringify(results, null, 2)}

Generate a concise summary of what was accomplished.\`;

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

### Reflection and Self-Correction

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
  
  // Generate a solution
  const solutionPrompt = reflection 
    ? \`Task: \${task}

Previous attempt:
\${currentAttempt}

Reflection on the previous attempt:
\${reflection}

Generate a new, improved solution based on the reflection.\`
    : \`Task: \${task}

Generate a detailed solution for this task.\`;

  currentAttempt = await llm.call(solutionPrompt);
  
  // Reflect on the solution
  const reflectionPrompt = \`Critically analyze the following solution:

Task: \${task}

Proposed solution:
\${currentAttempt}

Evaluate:
1. Does the solution fully address the task?
2. Are there errors or inconsistencies?
3. Can it be improved?
4. Is anything important missing?

If the solution is satisfactory, answer: "SOLUTION ACCEPTABLE"
If it needs improvement, provide specific feedback.\`;

  reflection = await llm.call(reflectionPrompt);
  
  if (reflection.includes('SOLUTION ACCEPTABLE')) {
    break;
  }
}

return [{
  json: {
    task,
    finalSolution: currentAttempt,
    iterations: iteration,
    lastReflection: reflection,
    accepted: reflection.includes('SOLUTION ACCEPTABLE')
  }
}];
\`\`\`

### Multi-Tool Agents

#### Agent with Multiple Specialized Tools

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const { DynamicTool } = require('langchain/tools');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Tool 1: Web search
const webSearch = new DynamicTool({
  name: 'web_search',
  description: 'Search the web for up-to-date information. Input: search query.',
  func: async (query) => {
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: 'https://api.search.com/search',
      qs: { q: query, limit: 5 },
      headers: { 'Authorization': \`Bearer \${$credentials.searchApiKey}\` }
    });
    
    return response.data.results.map(r => 
      \`Title: \${r.title}\\nURL: \${r.url}\\nSnippet: \${r.snippet}\`
    ).join('\\n\\n');
  }
});

// Tool 2: Advanced calculator
const calculator = new DynamicTool({
  name: 'calculator',
  description: 'Perform complex mathematical calculations. Input: a math expression.',
  func: async (expression) => {
    try {
      const result = eval(expression);
      return \`Result: \${result}\`;
    } catch (error) {
      return \`Calculation error: \${error.message}\`;
    }
  }
});

// Tool 3: Internal database
const databaseQuery = new DynamicTool({
  name: 'database_query',
  description: 'Query the company internal database. Input: description of what you are looking for.',
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
      \`ID: \${r.id}\\nType: \${r.type}\\nContent: \${r.content}\`
    ).join('\\n\\n');
  }
});

// Tool 4: Code generator
const codeGenerator = new DynamicTool({
  name: 'code_generator',
  description: 'Generate code from a description. Input: description of the code you need.',
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
          { role: 'system', content: 'You are an expert programmer. Generate clean, working code.' },
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
    prefix: \`You are an expert assistant with access to multiple tools. Your goal is to solve complex tasks by using the available tools strategically.

Guidelines:
1. Analyze the task before acting
2. Use the tools in the most logical order
3. Verify your results
4. If a tool fails, try an alternative approach\`
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

### Specialized Agents

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
    description: 'Search academic papers and scientific articles.',
    func: async (query) => {
      // Implement a search on Google Scholar, arXiv, etc.
      return \`Academic results for: \${query}\`;
    }
  }),
  new DynamicTool({
    name: 'news_search',
    description: 'Search recent news and press articles.',
    func: async (query) => {
      // Implement a search with the News API
      return \`Recent news about: \${query}\`;
    }
  }),
  new DynamicTool({
    name: 'statistical_data',
    description: 'Fetch statistical data and metrics.',
    func: async (query) => {
      // Implement a search across data APIs
      return \`Statistical data about: \${query}\`;
    }
  })
];

const executor = await initializeAgentExecutorWithOptions(tools, llm, {
  agentType: 'zero-shot-react-description',
  agentArgs: {
    prefix: \`You are an expert researcher. Your job is:
1. Search for information from multiple sources
2. Verify the credibility of the sources
3. Synthesize contradictory information
4. Provide citations and references
5. Identify gaps in the information\`
  }
});

const item = $input.first();
const researchQuestion = item.json.researchQuestion;

const result = await executor.call({ 
  input: \`Research: \${researchQuestion}\\n\\nProvide a complete report with sources.\` 
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
    description: 'Load a dataset for analysis. Input: dataset name.',
    func: async (datasetName) => {
      const response = await this.helpers.httpRequest({
        method: 'GET',
        url: \`\${$credentials.supabaseUrl}/rest/v1/\${datasetName}?select=*\`,
        headers: {
          'apikey': $credentials.supabaseKey,
          'Authorization': \`Bearer \${$credentials.supabaseKey}\`
        }
      });
      
      return JSON.stringify(response.data.slice(0, 100)); // First 100 records
    }
  }),
  new DynamicTool({
    name: 'calculate_statistics',
    description: 'Calculate statistics for a field. Input: "dataset.field".',
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
      
      return \`Statistics for \${field}:
- Count: \${values.length}
- Mean: \${mean.toFixed(2)}
- Median: \${median}
- Min: \${Math.min(...values)}
- Max: \${Math.max(...values)}\`;
    }
  }),
  new DynamicTool({
    name: 'generate_chart',
    description: 'Generate visualization code. Input: chart description.',
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
            { role: 'system', content: 'Generate Python code with matplotlib for data visualization.' },
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
    prefix: \`You are an expert data analyst. Your job is:
1. Explore datasets
2. Calculate relevant statistics
3. Identify patterns and anomalies
4. Generate visualizations
5. Provide actionable insights\`
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

### Coordination Patterns

#### Supervisor Pattern

\`\`\`javascript
const { OpenAI } = require('langchain/llms/openai');

const llm = new OpenAI({
  openAIApiKey: $credentials.apiKey,
  modelName: 'gpt-4',
  temperature: 0
});

// Define the specialized agents
const agents = {
  researcher: {
    description: 'Expert researcher specialized in information retrieval',
    func: async (task) => {
      // Implement the research agent
      return \`Research completed: \${task}\`;
    }
  },
  analyst: {
    description: 'Data and statistics analyst',
    func: async (task) => {
      // Implement the analysis agent
      return \`Analysis completed: \${task}\`;
    }
  },
  writer: {
    description: 'Professional report writer',
    func: async (task) => {
      // Implement the writing agent
      return \`Report written: \${task}\`;
    }
  }
};

// The supervisor decides which agent to use
const supervisorPrompt = \`Given the following task, decide which specialized agent should execute it.

Available agents:
\${Object.entries(agents).map(([name, agent]) => 
  \`- \${name}: \${agent.description}\`
).join('\\n')}

Task: \${$input.first().json.task}

Reply only with the name of the most appropriate agent.\`;

const selectedAgent = (await llm.call(supervisorPrompt)).trim().toLowerCase();

// Execute with the selected agent
const agent = agents[selectedAgent];
if (!agent) {
  throw new Error(\`Agent not found: \${selectedAgent}\`);
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

### Best Practices

1. **Clear instructions**: Provide clear, specific instructions
2. **Tool descriptions**: Write detailed tool descriptions
3. **Error handling**: Handle agent errors gracefully
4. **Iteration limits**: Set iteration limits
5. **Logging**: Log every agent action
6. **Testing**: Test agents with edge cases
7. **Cost monitoring**: Monitor token usage
8. **Human-in-the-loop**: Include human validation for critical decisions

### Debugging

#### Tracing Agent Execution

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

### Additional Resources

- [LangChain Agents Guide](https://js.langchain.com/docs/modules/agents/)
- [Agent Architectures](https://lilianweng.github.io/posts/2023-06-23-agent/)
- [ReAct Paper](https://arxiv.org/abs/2210.03629)
- [Plan-and-Solve Paper](https://arxiv.org/abs/2305.04091)
`,
    },
  ],
};
