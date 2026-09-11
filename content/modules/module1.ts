import { Module } from "../../types/course";

export const module1: Module = {
  id: "mod-01",
  slug: "infrastructure-fundamentals",
  title: "Fundamentals and Infrastructure",
  description: "Learn the core concepts of N8N and how to deploy it in different environments, from local to production.",
  icon: "Server",
  sortOrder: 1,
  lessons: [
    {
      id: "les-01-01",
      moduleSlug: "infrastructure-fundamentals",
      slug: "intro-to-n8n",
      title: "Introduction to N8N",
      description: "Discover what N8N is and why it is a leading tool for workflow automation.",
      estimatedMinutes: 15,
      content: `## Introduction to N8N

### What is N8N?

N8N is an **open-source** workflow automation platform that lets you connect different applications and services to automate repetitive tasks.

### Key features:

- **Open Source**: open code and self-hostable
- **Visual**: visual workflow editor with drag-and-drop nodes
- **Flexible**: more than 300 native integrations
- **Extensible**: you can build custom nodes
- **Scalable**: from personal use to enterprise

### Why N8N?

#### Advantages over other tools:

1. **Full control**: you control your data and your infrastructure
2. **No artificial limits**: no caps on executions or nodes
3. **Customizable**: adapt the tool to your needs
4. **Active community**: large community and extensive documentation
5. **Cost-effective**: free for personal use, affordable licenses for companies

### Common use cases

#### Marketing automation:
- Sync leads between the CRM and email marketing
- Publish content on social media automatically
- Generate campaign reports

#### Operations:
- Process orders automatically
- Sync inventory across platforms
- Send notifications for important events

#### Development:
- CI/CD pipelines
- Application monitoring
- Automatic database backups

### Your first workflow

In the next lesson you will learn how to install N8N and create your first automated workflow.

#### Additional resources:
- [Official N8N documentation](https://docs.n8n.io)
- [N8N community](https://community.n8n.io)
- [N8N on GitHub](https://github.com/n8n-io/n8n)
`,
      labs: [
        {
          id: "lab-01-01",
          title: "N8N value map for your company",
          objective:
            "Identify 3 repetitive processes in your day-to-day that could be automated with N8N.",
          instructions:
            "1. List 5 manual tasks you perform every week.\n2. Classify them by volume and pain (impact).\n3. Pick the 3 best candidates and describe the input, the step and the output of each.\n4. State which native N8N integration you would use.",
          deliverable:
            "A one-page document with the prioritized automation map.",
          difficulty: "easy",
        },
        {
          id: "lab-01-02",
          title: "Install N8N and expose it safely",
          objective:
            "Bring up a local N8N instance and document the basic security configuration.",
          instructions:
            "1. Run N8N with Docker or npm.\n2. Set an environment variable for the execution mode (OWN).\n3. Enable HTTPS with a reverse proxy (e.g. Caddy).\n4. Document the exposed ports and justify why they should not stay open.",
          deliverable:
            "Screenshot of the running instance + diagram of the proxy layer.",
          difficulty: "medium",
        },
      ],
    },
    {
      id: "les-01-02",
      moduleSlug: "infrastructure-fundamentals",
      slug: "local-installation",
      title: "Local Installation",
      description: "Learn how to install N8N on your local machine using Docker or npm.",
      estimatedMinutes: 20,
      content: `## Local Installation of N8N

### Installation methods

#### Option 1: Docker (recommended)

Docker is the easiest and most consistent way to run N8N.

**Requirements:**
- Docker installed on your system
- Docker Compose (optional but recommended)

**Installing with Docker:**

\`\`\`bash
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  n8nio/n8n
\`\`\`

**With Docker Compose:**

Create a \`docker-compose.yml\` file:

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
      - N8N_BASIC_AUTH_PASSWORD=your_secure_password
\`\`\`

Run:
\`\`\`bash
docker-compose up -d
\`\`\`

#### Option 2: npm

If you prefer to install N8N globally:

\`\`\`bash
npm install -g n8n
n8n start
\`\`\`

#### Option 3: npx (no installation)

\`\`\`bash
npx n8n
\`\`\`

### Accessing N8N

Once installed, open your browser and go to:
\`\`\`
http://localhost:5678
\`\`\`

### Initial setup

1. **Create the administrator account**
2. **Set the time zone**
3. **Explore the interface**

### Troubleshooting

#### Port in use:
If port 5678 is already in use, change the mapping:
\`\`\`bash
docker run -p 8080:5678 n8nio/n8n
\`\`\`

#### Volume permissions:
\`\`\`bash
chmod -R 755 ~/.n8n
\`\`\`

### Next steps

In the next lesson you will learn how to configure N8N for production.
`,
    },
    {
      id: "les-01-03",
      moduleSlug: "infrastructure-fundamentals",
      slug: "production-setup",
      title: "Production Setup",
      description: "Configure N8N for production environments with security and scalability in mind.",
      estimatedMinutes: 25,
      content: `## Production Setup

### Important considerations

Before deploying N8N to production, consider:

1. **Security**: authentication, HTTPS, firewalls
2. **Persistence**: external database (PostgreSQL)
3. **Scalability**: multiple workers for heavy load
4. **Monitoring**: logs and metrics
5. **Backups**: data backup strategy

### Essential environment variables

#### Database:
\`\`\`bash
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=your_secure_password
\`\`\`

#### Security:
\`\`\`bash
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure_password
N8N_HOST=your-domain.com
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-domain.com/
\`\`\`

#### Execution:
\`\`\`bash
EXECUTIONS_MODE=queue
QUEUE_BULL_REDIS_HOST=localhost
QUEUE_BULL_REDIS_PORT=6379
\`\`\`

### Docker Compose for production

\`\`\`yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: n8n_user
      POSTGRES_PASSWORD: secure_password
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
      - DB_POSTGRESDB_PASSWORD=secure_password
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - N8N_HOST=your-domain.com
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://your-domain.com/
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

### Nginx as a reverse proxy

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

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

### SSL with Let's Encrypt

\`\`\`bash
certbot --nginx -d your-domain.com
\`\`\`

### Monitoring and logs

#### Tail the logs:
\`\`\`bash
docker-compose logs -f n8n
\`\`\`

#### Metrics with Prometheus:
Enable the metrics endpoint:
\`\`\`bash
N8N_METRICS=true
\`\`\`

### Automatic backup

Daily backup script:
\`\`\`bash
#!/bin/bash
docker exec postgres pg_dump -U n8n_user n8n > backup_$(date +%Y%m%d).sql
\`\`\`

### Production checklist

- [ ] PostgreSQL database configured
- [ ] Redis for the execution queue
- [ ] HTTPS enabled
- [ ] Authentication configured
- [ ] Secure environment variables
- [ ] Automatic backups configured
- [ ] Monitoring enabled
- [ ] Firewall configured
- [ ] Centralized logs
`,
    },
    {
      id: "les-01-04",
      moduleSlug: "infrastructure-fundamentals",
      slug: "n8n-interface",
      title: "Getting to Know the Interface",
      description: "Explore the N8N interface and learn how to navigate its different sections.",
      estimatedMinutes: 20,
      content: `## Getting to Know the N8N Interface

### Overview

The N8N interface is divided into several main sections:

#### 1. Main dashboard
- List of workflows
- Button to create a new workflow
- Filters and search
- Execution statistics

#### 2. Workflow editor
- Main canvas for designing workflows
- Node panel (left)
- Configuration panel (right)
- Top toolbar

#### 3. Executions
- Execution history
- Detailed logs
- Manual retries

#### 4. Credentials
- API credential management
- OAuth connections
- Access tokens

### The workflow editor

#### Main canvas
The central area where you build your workflow by dragging and connecting nodes.

#### Node panel
- **Trigger nodes**: start the workflow
- **Regular nodes**: process data
- **Flow nodes**: control the flow

#### Toolbar
- **Save**: save the workflow
- **Execute**: run the workflow manually
- **Active**: enable/disable the workflow
- **Settings**: workflow configuration

### Node types

#### Trigger nodes
- Webhook
- Schedule (Cron)
- Email triggers
- Database triggers

#### Action nodes
- HTTP Request
- Email
- Database queries
- File operations

#### Flow nodes (flow control)
- IF (conditional)
- Switch (multiple paths)
- Merge (combine data)
- Wait (pause)

### Fast navigation

#### Keyboard shortcuts:
- \`Ctrl + S\`: save
- \`Ctrl + Enter\`: execute
- \`Ctrl + Z\`: undo
- \`Ctrl + Y\`: redo
- \`Delete\`: remove the selected node

#### Zoom and navigation:
- Mouse wheel: zoom
- Click + drag: move the canvas
- Double click on a node: edit

### Workflow configuration

#### Important settings:
- **Name**: the workflow name
- **Timezone**: time zone used by schedules
- **Error workflow**: workflow to run when an error occurs
- **Save execution progress**: store execution progress

### Executions

#### Viewing executions:
1. Click "Executions" in the menu
2. Filter by workflow, status or date
3. Click an execution to see the details

#### Execution details:
- Input data
- Output data
- Execution time
- Full logs
- Errors (if any)

### Credentials

#### Creating credentials:
1. Go to "Credentials"
2. Click "New"
3. Select the type (OAuth2, API Key, etc.)
4. Fill in the required fields
5. Save

#### Common types:
- **OAuth2**: for Google, GitHub, etc.
- **Header Auth**: API keys in headers
- **Basic Auth**: user and password
- **Query Auth**: API keys in query params

### Tips and tricks

#### Organization:
- Use descriptive node names
- Group related nodes with notes
- Use colors to identify node types

#### Debugging:
- Execute node by node
- Inspect the data at each step
- Use the "No Operation" node while debugging

#### Performance:
- Avoid unnecessary loops
- Use batch processing when possible
- Limit the amount of data processed

### Next steps

Now that you know the interface, in the next lesson you will build your first complete workflow.
`,
    },
    {
      id: "les-01-05",
      moduleSlug: "infrastructure-fundamentals",
      slug: "first-workflow",
      title: "Your First Workflow",
      description: "Build your first complete workflow: from a trigger to the final action.",
      estimatedMinutes: 30,
      content: `## Your First Workflow

### Objective

Create a workflow that:
1. Receives data from a webhook
2. Processes the information
3. Sends a confirmation email

### Step 1: Create the workflow

1. Click "New Workflow"
2. Name your workflow: "My First Workflow"
3. Save with Ctrl + S

### Step 2: Add the trigger

#### Webhook node:
1. Click the "+" button to add a node
2. Search for "Webhook"
3. Configure:
   - **HTTP Method**: POST
   - **Path**: my-first-webhook
   - **Response Mode**: When Last Node Finishes

#### Webhook URL:
\`\`\`
https://your-instance.com/webhook/my-first-webhook
\`\`\`

### Step 3: Process data

#### Function node:
1. Add a "Function" node
2. Connect the webhook to the function
3. Code:

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  const name = item.json.name || 'User';
  const email = item.json.email;
  
  results.push({
    json: {
      name,
      email,
      message: \`Hello \${name}, thanks for reaching out!\`,
      timestamp: new Date().toISOString()
    }
  });
}

return results;
\`\`\`

### Step 4: Send the email

#### Email node (Gmail):
1. Add a "Gmail" node
2. Set up OAuth2 credentials
3. Configure:
   - **To**: \`={{ $json.email }}\`
   - **Subject**: "Contact confirmation"
   - **Body**: \`={{ $json.message }}\`

### Step 5: Test the workflow

#### Manual run:
1. Click "Execute Workflow"
2. Send test data to the webhook:

\`\`\`bash
curl -X POST https://your-instance.com/webhook/my-first-webhook \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John", "email": "john@example.com"}'
\`\`\`

#### Check the results:
- Review the run in "Executions"
- Make sure the email was sent
- Inspect the data on each node

### Step 6: Activate the workflow

1. Toggle "Active" in the top bar
2. The webhook is now listening
3. Test with real data

### The complete workflow

\`\`\`
[Webhook] → [Function] → [Gmail]
\`\`\`

### Possible improvements

#### Add validation:
\`\`\`javascript
if (!item.json.email) {
  throw new Error('Email is required');
}
\`\`\`

#### Add error handling:
- Create an "Error Workflow"
- Configure it in Settings
- Send error notifications

#### Add a database:
- Store the contacts in a DB
- Use the "PostgreSQL" or "MySQL" node

### Debugging

#### Common problems:

**The webhook does not respond:**
- Make sure the workflow is active
- Check the webhook URL
- Review the logs

**The email is not sent:**
- Verify the OAuth2 credentials
- Check the Gmail permissions
- Inspect the email node

**Incorrect data:**
- Use "Execute Node" on each step
- Inspect the input/output data
- Check the expressions

### Additional resources

- [Webhook documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Expressions in N8N](https://docs.n8n.io/code/expressions/)
- [Error handling](https://docs.n8n.io/flow-logic/error-handling/)

### Congratulations!

You have created your first working workflow. In the upcoming modules you will learn advanced techniques for more complex workflows.
`,
    },
  ],
};


