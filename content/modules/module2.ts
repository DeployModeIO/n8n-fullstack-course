import { Module } from "../../types/course";

export const module2: Module = {
  id: "mod-02",
  slug: "n8n-core-essential-nodes",
  title: "N8N Core and Essential Nodes",
  description: "Master the fundamental N8N nodes: triggers, data transformation, the Code node, sub-workflows and flow control.",
  icon: "Cpu",
  sortOrder: 2,
  lessons: [
    {
      id: "les-02-01",
      moduleSlug: "n8n-core-essential-nodes",
      slug: "triggers-webhooks-cron",
      title: "Triggers: Webhooks, Schedule and Cron",
      description: "Learn the different trigger types in N8N and how to design event-driven architectures.",
      estimatedMinutes: 20,
      content: `## Triggers in N8N

Triggers are the entry point of every workflow. They define when and how a workflow runs.

### Trigger Types

#### 1. Webhook Trigger

Receives external HTTP requests. Ideal for integrations with forms, third-party APIs and service events.

**Basic configuration:**

\`\`\`json
{
  "httpMethod": "POST",
  "path": "my-webhook",
  "responseMode": "responseNode",
  "options": {
    "rawBody": true
  }
}
\`\`\`

**Common patterns:**
- **Fire-and-forget**: The webhook responds immediately and the workflow processes in the background
- **Synchronous**: The webhook waits for the workflow response before answering

**Example usage:**

\`\`\`javascript
// Send data to the webhook
fetch('https://your-n8n.com/webhook/my-webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com'
  })
});
\`\`\`

#### 2. Schedule Trigger (Cron)

Runs workflows at regular intervals. Perfect for scheduled tasks.

**Cron syntax:**

\`\`\`
* * * * *
│ │ │ │ │
│ │ │ │ └─ Day of the week (0-7, 0 and 7 = Sunday)
│ │ │ └─── Month (1-12)
│ │ └───── Day of the month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
\`\`\`

**Common examples:**

\`\`\`bash
# Every 5 minutes
*/5 * * * *

# Every hour
0 * * * *

# Every day at 9 AM
0 9 * * *

# Monday to Friday at 8 AM
0 8 * * 1-5

# First day of each month at midnight
0 0 1 * *
\`\`\`

#### 3. Email Trigger

Fires workflows when specific emails arrive.

**Configuration:**
- **Protocol**: IMAP
- **Host**: imap.gmail.com
- **Port**: 993
- **SSL**: true
- **Mailbox**: INBOX
- **Action**: Read and mark as read

**Useful filters:**
- From: specific emails
- Subject: keywords
- Has attachments: attachments only

#### 4. Database Trigger

Monitors changes in databases.

**PostgreSQL Trigger:**

\`\`\`sql
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('new_order', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_created
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION notify_new_order();
\`\`\`

### Event-Driven Design Patterns

#### Pattern 1: Event Sourcing

\`\`\`
[Webhook] → [Validate] → [Store Event] → [Process] → [Notify]
\`\`\`

#### Pattern 2: CQRS (Command Query Responsibility Segregation)

\`\`\`
[Webhook] → [Command Handler] → [Update DB] → [Publish Event]
                                                          ↓
                                            [Query Handler] → [Update View]
\`\`\`

#### Pattern 3: Saga Pattern

\`\`\`
[Trigger] → [Step 1] → [Step 2] → [Step 3]
                ↓           ↓           ↓
          [Compensate] [Compensate] [Compensate]
\`\`\`

### Best Practices

1. **Idempotency**: Design workflows that can run several times without side effects
2. **Early validation**: Validate data in the first node
3. **Detailed logs**: Record debugging information
4. **Timeouts**: Configure appropriate timeouts
5. **Retry logic**: Implement retries for failed operations

### Complete Example: Webhook with Validation

\`\`\`javascript
// Function node to validate the webhook payload
const body = $input.first().json;

// Validate required fields
const requiredFields = ['email', 'name', 'phone'];
const missingFields = requiredFields.filter(field => !body[field]);

if (missingFields.length > 0) {
  throw new Error(\`Missing fields: \${missingFields.join(', ')}\`);
}

// Validate the email format
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
if (!emailRegex.test(body.email)) {
  throw new Error('Invalid email');
}

// Return the validated data
return [{
  json: {
    ...body,
    validated: true,
    timestamp: new Date().toISOString()
  }
}];
\`\`\`

### Debugging Triggers

#### Webhook does not fire:
1. Check that the workflow is active
2. Review the webhook URL
3. Check the headers and HTTP method
4. Inspect the execution logs

#### Schedule does not run:
1. Check the cron syntax
2. Check the workflow timezone
3. Check for previous failed executions
4. Make sure the workflow is active

### Additional Resources

- [Trigger documentation](https://docs.n8n.io/integrations/builtin/core-nodes/)
- [Cron Expression Generator](https://crontab.guru/)
- [Webhook Testing with Postman](https://www.postman.com/)
`,
    },
    {
      id: "les-02-02",
      moduleSlug: "n8n-core-essential-nodes",
      slug: "data-transformation",
      title: "JSON and Binary Data Transformation",
      description: "Learn how to manipulate and transform data in N8N using native nodes and code.",
      estimatedMinutes: 25,
      content: `## Data Transformation in N8N

N8N handles data in JSON and binary format. Learning how to transform it is essential.

### Data Structure in N8N

Every item in N8N has two main properties:

\`\`\`javascript
{
  json: {
    // Structured data
    name: 'John',
    email: 'john@example.com'
  },
  binary: {
    // Binary data (files, images)
    data: {
      data: 'base64...',
      mimeType: 'image/png',
      fileName: 'photo.png'
    }
  }
}
\`\`\`

### Transformation Nodes

#### 1. Set Node

Creates or modifies fields in the items.

**Basic example:**

\`\`\`javascript
{
  "values": {
    "string": [
      {
        "name": "fullName",
        "value": "={{ $json.name }} {{ $json.lastName }}"
      }
    ],
    "number": [
      {
        "name": "age",
        "value": "={{ new Date().getFullYear() - $json.birthYear }}"
      }
    ],
    "boolean": [
      {
        "name": "isAdult",
        "value": "={{ $json.age >= 18 }}"
      }
    ]
  }
}
\`\`\`

#### 2. Rename Keys Node

Renames fields without modifying their content.

\`\`\`javascript
{
  "currentKey": "user_name",
  "newKey": "name"
}
\`\`\`

#### 3. Remove Duplicates Node

Removes duplicate items based on specific fields.

**Configuration:**
- **Compare**: Selected Fields
- **Options**: Keep First Match

#### 4. Sort Node

Sorts items by one or more fields.

\`\`\`javascript
{
  "sortFieldsUi": {
    "sortField": [
      {
        "fieldName": "date",
        "order": "descending"
      }
    ]
  }
}
\`\`\`

### Manipulating Data with the Code Node

#### Array Transformation

\`\`\`javascript
const items = $input.all();

// Filter items
const activeItems = items.filter(item => item.json.status === 'active');

// Map and transform
const transformed = items.map(item => ({
  json: {
    id: item.json.id,
    fullName: \`\${item.json.firstName} \${item.json.lastName}\`,
    emailLower: item.json.email.toLowerCase(),
    registeredAt: new Date(item.json.createdAt).toLocaleDateString('en-US')
  }
}));

// Reduce to a single object
const summary = items.reduce((acc, item) => {
  acc.total += item.json.amount;
  acc.count += 1;
  return acc;
}, { total: 0, count: 0 });

return transformed;
\`\`\`

#### Manipulating Nested Objects

\`\`\`javascript
const items = $input.all();

return items.map(item => {
  const data = item.json;
  
  // Extract nested data
  const address = data.address || {};
  const contact = data.contact || {};
  
  return {
    json: {
      // Flatten the structure
      name: data.name,
      street: address.street,
      city: address.city,
      country: address.country,
      phone: contact.phone,
      email: contact.email,
      
      // Create calculated fields
      fullAddress: \`\${address.street}, \${address.city}, \${address.country}\`,
      hasContact: !!(contact.phone || contact.email)
    }
  };
});
\`\`\`

### Working with Binary Data

#### Reading a CSV file

\`\`\`javascript
const items = $input.all();
const binaryData = items[0].binary.data;

// Convert base64 to a string
const csvContent = Buffer.from(binaryData.data, 'base64').toString('utf-8');

// Parse the CSV
const lines = csvContent.split('\\n');
const headers = lines[0].split(',');

const result = lines.slice(1).map(line => {
  const values = line.split(',');
  const obj = {};
  headers.forEach((header, index) => {
    obj[header.trim()] = values[index]?.trim();
  });
  return { json: obj };
});

return result;
\`\`\`

#### Converting JSON to CSV

\`\`\`javascript
const items = $input.all();

if (items.length === 0) return [];

// Extract the headers from the first item
const headers = Object.keys(items[0].json);

// Build the CSV content
const csvContent = [
  headers.join(','),
  ...items.map(item =>
    headers.map(header => {
      const value = item.json[header];
      // Escape quotes and wrap in quotes when the value contains a comma
      const escaped = String(value).replace(/"/g, '""');
      return \`"\${escaped}"\`;
    }).join(',')
  )
].join('\\n');

// Convert to binary
const binaryData = Buffer.from(csvContent, 'utf-8').toString('base64');

return [{
  json: { fileName: 'export.csv' },
  binary: {
    data: {
      data: binaryData,
      mimeType: 'text/csv',
      fileName: 'export.csv'
    }
  }
}];
\`\`\`

### Useful N8N Functions

#### $() - Access data from previous nodes

\`\`\`javascript
// Access the first item of the "Webhook" node
const webhookData = $('Webhook').first().json;

// Access all items of the "HTTP Request" node
const allItems = $('HTTP Request').all();

// Access the last item
const lastItem = $('HTTP Request').last().json;
\`\`\`

#### $node - Information about the current node

\`\`\`javascript
const nodeName = $node.name;
const executionId = $execution.id;
const workflowName = $workflow.name;
\`\`\`

#### DateTime - Working with dates

\`\`\`javascript
const now = $now; // Current DateTime
const today = $today; // Start of the current day

// Format dates
const formatted = $now.format('MM/dd/yyyy HH:mm');

// Manipulation
const nextWeek = $now.plus({ days: 7 });
const lastMonth = $now.minus({ months: 1 });

// Comparison
const isAfter = $now > DateTime.fromISO('2024-01-01');
\`\`\`

### Common Patterns

#### Batch Processing

\`\`\`javascript
const items = $input.all();
const batchSize = 10;
const batches = [];

for (let i = 0; i < items.length; i += batchSize) {
  batches.push({
    json: {
      batch: items.slice(i, i + batchSize),
      batchNumber: Math.floor(i / batchSize) + 1,
      totalBatches: Math.ceil(items.length / batchSize)
    }
  });
}

return batches;
\`\`\`

#### Data Enrichment

\`\`\`javascript
const items = $input.all();

return items.map(item => {
  const data = item.json;
  
  // Enrich the record with calculated data
  return {
    json: {
      ...data,
      // Calculate the age from the birth date
      age: Math.floor(
        ($now.diff(DateTime.fromISO(data.birthDate), 'years')).years
      ),
      // Generate a slug from the name
      slug: data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      // Hash for a unique ID
      hash: require('crypto')
        .createHash('md5')
        .update(data.email)
        .digest('hex'),
    }
  };
});
\`\`\`

### Best Practices

1. **Validate data early**: Use validations before complex transformations
2. **Handle null/undefined**: Always check that fields exist
3. **Use the right types**: Convert strings to numbers when necessary
4. **Document transformations**: Add comments to complex code
5. **Test with real data**: Use representative sample data

### Debugging

#### Inspecting data at every step:

\`\`\`javascript
// Log data for debugging
console.log('Input items:', JSON.stringify($input.all(), null, 2));
console.log('First item:', $input.first().json);

// Return the data unchanged
return $input.all();
\`\`\`

### Additional Resources

- [Expressions in N8N](https://docs.n8n.io/code/expressions/)
- [Code Node Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)
- [JavaScript Date Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
`,
    },
    {
      id: "les-02-03",
      moduleSlug: "n8n-core-essential-nodes",
      slug: "advanced-code-node",
      title: "Advanced Code Node: JavaScript and Python",
      description: "Master the Code node with advanced programming techniques in JavaScript and Python.",
      estimatedMinutes: 30,
      content: `## Advanced Code Node

The Code node is the most powerful node in N8N. It lets you run JavaScript or Python code for complex logic.

### Execution Modes

#### 1. Run Once for All Items

Runs the code once with all items available.

\`\`\`javascript
const items = $input.all();

// Process all items
const processed = items.map(item => ({
  json: {
    ...item.json,
    processed: true
  }
}));

return processed;
\`\`\`

#### 2. Run Once for Each Item

Runs the code for each individual item.

\`\`\`javascript
const item = $input.item;

return {
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
  }
};
\`\`\`

### Advanced JavaScript

#### Async/Await with External APIs

\`\`\`javascript
const items = $input.all();
const results = [];

for (const item of items) {
  try {
    // Asynchronous API call
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: \`https://api.example.com/users/\${item.json.userId}\`,
      headers: {
        'Authorization': \`Bearer \${$credentials.apiToken}\`
      }
    });
    
    results.push({
      json: {
        ...item.json,
        userData: response.data,
        fetched: true
      }
    });
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        error: error.message,
        fetched: false
      }
    });
  }
}

return results;
\`\`\`

#### Robust Error Handling

\`\`\`javascript
const items = $input.all();
const results = [];
const errors = [];

for (const item of items) {
  try {
    // Validation
    if (!item.json.email) {
      throw new Error('Email is required');
    }
    
    // Processing
    const processed = {
      ...item.json,
      emailLower: item.json.email.toLowerCase(),
      processedAt: new Date().toISOString()
    };
    
    results.push({ json: processed });
  } catch (error) {
    errors.push({
      json: {
        originalItem: item.json,
        error: error.message,
        errorType: error.constructor.name,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Return results and errors separately
return [...results, ...errors];
\`\`\`

#### Using External Modules

\`\`\`javascript
// N8N ships with several useful libraries
const crypto = require('crypto');
const moment = require('moment');

const items = $input.all();

return items.map(item => {
  const data = item.json;
  
  // Generate a hash
  const hash = crypto
    .createHash('sha256')
    .update(data.email)
    .digest('hex');
  
  // Format the date with moment
  const formattedDate = moment(data.createdAt)
    .locale('en')
    .format('MMMM Do, YYYY');
  
  return {
    json: {
      ...data,
      hash,
      formattedDate,
      daysSinceCreation: moment().diff(moment(data.createdAt), 'days')
    }
  };
});
\`\`\`

#### Complex Array Manipulation

\`\`\`javascript
const items = $input.all();

// Group by category
const grouped = items.reduce((acc, item) => {
  const category = item.json.category || 'uncategorized';
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(item.json);
  return acc;
}, {});

// Convert to the output format
return Object.entries(grouped).map(([category, items]) => ({
  json: {
    category,
    count: items.length,
    items,
    totalAmount: items.reduce((sum, item) => sum + (item.amount || 0), 0)
  }
}));
\`\`\`

### Python in the Code Node

#### Setup

To use Python, select "Python" in the "Language" field of the Code node.

#### Basic Example

\`\`\`python
items = []

for item in _input.all():
    data = item.json
    
    # Transformation
    items.append({
        'json': {
            'name': data.get('name', '').upper(),
            'email': data.get('email', '').lower(),
            'processed': True
        }
    })

return items
\`\`\`

#### Data Analysis with Python

\`\`\`python
import json
from datetime import datetime, timedelta

items = _input.all()
results = []

for item in items:
    data = item.json
    
    # Calculate metrics
    created_at = datetime.fromisoformat(data['createdAt'])
    days_active = (datetime.now() - created_at).days
    
    # Classify the user
    if days_active > 365:
        category = 'veteran'
    elif days_active > 90:
        category = 'regular'
    else:
        category = 'new'
    
    results.append({
        'json': {
            **data,
            'daysActive': days_active,
            'category': category,
            'isActive': days_active < 30
        }
    })

return results
\`\`\`

### Advanced Patterns

#### Rate Limiting

\`\`\`javascript
const items = $input.all();
const results = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  
  try {
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: \`https://api.example.com/data/\${item.json.id}\`
    });
    
    results.push({
      json: {
        ...item.json,
        apiData: response.data
      }
    });
    
    // Rate limiting: wait 100ms between requests
    if (i < items.length - 1) {
      await delay(100);
    }
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        error: error.message
      }
    });
  }
}

return results;
\`\`\`

#### Retry with Exponential Backoff

\`\`\`javascript
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await this.helpers.httpRequest({
        method: 'GET',
        url
      });
      return response;
    } catch (error) {
      lastError = error;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

const items = $input.all();
const results = [];

for (const item of items) {
  try {
    const data = await fetchWithRetry(
      \`https://api.example.com/users/\${item.json.userId}\`
    );
    
    results.push({
      json: {
        ...item.json,
        userData: data
      }
    });
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        error: \`Failed after retries: \${error.message}\`
      }
    });
  }
}

return results;
\`\`\`

#### Parallel Processing

\`\`\`javascript
const items = $input.all();

// Process in parallel (up to 5 concurrent requests)
const concurrency = 5;
const results = [];

async function processItem(item) {
  try {
    const response = await this.helpers.httpRequest({
      method: 'POST',
      url: 'https://api.example.com/process',
      body: item.json
    });
    
    return {
      json: {
        ...item.json,
        result: response.data,
        success: true
      }
    };
  } catch (error) {
    return {
      json: {
        ...item.json,
        error: error.message,
        success: false
      }
    };
  }
}

// Process in batches
for (let i = 0; i < items.length; i += concurrency) {
  const batch = items.slice(i, i + concurrency);
  const batchResults = await Promise.all(
    batch.map(item => processItem(item))
  );
  results.push(...batchResults);
}

return results;
\`\`\`

### Environment Variables and Secrets

\`\`\`javascript
// Access environment variables
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;

// Use N8N credentials
const credentials = await this.getCredentials('httpHeaderAuth');
const token = credentials.value;

// Access workflow variables
const workflowVar = $workflow.variables.myVariable;
\`\`\`

### Advanced Debugging

\`\`\`javascript
const items = $input.all();

// Detailed logging
console.log('=== DEBUG INFO ===');
console.log('Total items:', items.length);
console.log('First item:', JSON.stringify(items[0]?.json, null, 2));
console.log('Execution ID:', $execution.id);
console.log('Workflow name:', $workflow.name);

// Inspect the data structure
const sampleItem = items[0]?.json;
if (sampleItem) {
  console.log('Item keys:', Object.keys(sampleItem));
  console.log('Item types:', Object.entries(sampleItem).map(([k, v]) => 
    \`\${k}: \${typeof v}\`
  ));
}

return items;
\`\`\`

### Best Practices

1. **Use the right types**: Validate and convert data types
2. **Handle errors**: Always use try/catch in asynchronous operations
3. **Limit concurrency**: Do not fire too many simultaneous requests
4. **Use timeouts**: Configure timeouts for network operations
5. **Document your code**: Add comments for complex logic
6. **Test incrementally**: Test with a few items first

### Additional Resources

- [Code Node Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)
- [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [N8N Built-in Methods](https://docs.n8n.io/code/builtin/overview/)
`,
    },
    {
      id: "les-02-04",
      moduleSlug: "n8n-core-essential-nodes",
      slug: "sub-workflows",
      title: "Sub-Workflows and Modularization",
      description: "Learn how to build modular, reusable workflows with the Execute Workflow node.",
      estimatedMinutes: 25,
      content: `## Sub-Workflows and Modularization

Sub-workflows let you split complex workflows into reusable, maintainable components.

### Execute Workflow Node

This node runs another workflow and returns its results.

#### Basic Configuration

\`\`\`json
{
  "workflowId": "abc123",
  "mode": "once",
  "options": {
    "waitForSubWorkflow": true
  }
}
\`\`\`

#### Execution Modes

**1. Once (default)**
Runs the sub-workflow once with all items.

**2. Each Item**
Runs the sub-workflow once for every item.

### Design Patterns

#### Pattern 1: Processing Pipeline

\`\`\`
[Main Workflow]
    ↓
[Execute: Validate Data]
    ↓
[Execute: Enrich Data]
    ↓
[Execute: Save to DB]
    ↓
[Execute: Send Notification]
\`\`\`

**Main Workflow:**

\`\`\`javascript
// Each Execute Workflow node calls a specific sub-workflow
// Data flows from one to the next automatically
\`\`\`

#### Pattern 2: Workflow Router

\`\`\`
[Webhook]
    ↓
[Switch: Event Type]
    ├─→ [Execute: Process Order]
    ├─→ [Execute: Process Payment]
    └─→ [Execute: Process Shipment]
\`\`\`

**Switch Node Configuration:**

\`\`\`javascript
{
  "rules": {
    "rules": [
      {
        "value1": "={{ $json.eventType }}",
        "operation": "equal",
        "value2": "order_created",
        "output": 0
      },
      {
        "value1": "={{ $json.eventType }}",
        "operation": "equal",
        "value2": "payment_received",
        "output": 1
      },
      {
        "value1": "={{ $json.eventType }}",
        "operation": "equal",
        "value2": "shipment_sent",
        "output": 2
      }
    ]
  }
}
\`\`\`

#### Pattern 3: Centralized Error Handler

\`\`\`
[Main Workflow]
    ↓
[Try: Main Process]
    ↓ (error)
[Execute: Error Handler]
    ├─→ Log Error
    ├─→ Send Alert
    └─→ Retry Logic
\`\`\`

### Building Reusable Sub-Workflows

#### Sub-Workflow: Email Validation

\`\`\`javascript
// Input: { email: "user@example.com" }
// Output: { email: "user@example.com", valid: true, normalized: "user@example.com" }

const items = $input.all();

return items.map(item => {
  const email = item.json.email || '';
  
  // Normalize
  const normalized = email.toLowerCase().trim();
  
  // Validate the format
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  const valid = emailRegex.test(normalized);
  
  // Check for common disposable domains
  const disposableDomains = ['tempmail.com', '10minutemail.com'];
  const domain = normalized.split('@')[1];
  const isDisposable = disposableDomains.includes(domain);
  
  return {
    json: {
      email: normalized,
      valid: valid && !isDisposable,
      normalized,
      isDisposable,
      domain
    }
  };
});
\`\`\`

#### Sub-Workflow: Data Enrichment

\`\`\`javascript
// Input: { userId: "123" }
// Output: { userId: "123", userData: {...}, enriched: true }

const items = $input.all();
const results = [];

for (const item of items) {
  try {
    // Fetch the user data
    const userResponse = await this.helpers.httpRequest({
      method: 'GET',
      url: \`https://api.example.com/users/\${item.json.userId}\`,
      headers: {
        'Authorization': \`Bearer \${$credentials.apiToken}\`
      }
    });
    
    // Fetch additional data
    const profileResponse = await this.helpers.httpRequest({
      method: 'GET',
      url: \`https://api.example.com/users/\${item.json.userId}/profile\`
    });
    
    results.push({
      json: {
        ...item.json,
        userData: userResponse.data,
        profileData: profileResponse.data,
        enriched: true,
        enrichedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    results.push({
      json: {
        ...item.json,
        enriched: false,
        error: error.message
      }
    });
  }
}

return results;
\`\`\`

#### Sub-Workflow: Multi-Channel Notification

\`\`\`javascript
// Input: { message: "Alert", channels: ["email", "slack"], recipients: [...] }

const items = $input.all();
const results = [];

for (const item of items) {
  const { message, channels, recipients } = item.json;
  const sentTo = [];
  
  // Send by email
  if (channels.includes('email')) {
    for (const recipient of recipients) {
      if (recipient.email) {
        // The email node would go here
        sentTo.push({ channel: 'email', recipient: recipient.email });
      }
    }
  }
  
  // Send by Slack
  if (channels.includes('slack')) {
    // The Slack node would go here
    sentTo.push({ channel: 'slack', webhook: 'configured' });
  }
  
  results.push({
    json: {
      message,
      sentTo,
      sentAt: new Date().toISOString()
    }
  });
}

return results;
\`\`\`

### Passing Data Between Workflows

#### Sending Data to the Sub-Workflow

\`\`\`javascript
// In the Execute Workflow node
{
  "workflowId": "sub-workflow-id",
  "mode": "once",
  "options": {
    "waitForSubWorkflow": true,
    "data": {
      "userId": "={{ $json.userId }}",
      "action": "={{ $json.action }}",
      "metadata": "={{ JSON.stringify($json.metadata) }}"
    }
  }
}
\`\`\`

#### Receiving Data from the Sub-Workflow

\`\`\`javascript
// The sub-workflow returns items that become the output of the Execute Workflow node
// You can access them like any other node

const subWorkflowOutput = $input.all();

return subWorkflowOutput.map(item => ({
  json: {
    ...item.json,
    processedByMainWorkflow: true
  }
}));
\`\`\`

### Shared Variables

#### Using Variables from the Parent Workflow

\`\`\`javascript
// Inside the sub-workflow you can access parent workflow variables
const parentWorkflowId = $workflow.activeWorkflowId;
const executionId = $execution.id;

// Environment variables are shared
const apiKey = process.env.API_KEY;
\`\`\`

### Error Handling in Sub-Workflows

#### Pattern: Try-Catch with Execute Workflow

\`\`\`
[Main Workflow]
    ↓
[Execute: Sub-Workflow]
    ↓ (on error)
[Execute: Error Handler Sub-Workflow]
    ├─→ Log Error
    ├─→ Send Alert
    └─→ Return Fallback Data
\`\`\`

**Error Handler Sub-Workflow:**

\`\`\`javascript
const items = $input.all();

return items.map(item => {
  const error = item.json.error || {};
  
  // Detailed log
  console.error('Sub-workflow error:', {
    workflowId: error.workflowId,
    nodeId: error.nodeId,
    message: error.message,
    timestamp: new Date().toISOString()
  });
  
  // Return fallback data
  return {
    json: {
      success: false,
      error: error.message,
      fallback: true,
      timestamp: new Date().toISOString()
    }
  };
});
\`\`\`

### Performance Optimization

#### Batch Processing with Sub-Workflows

\`\`\`javascript
// Split the items into batches and process them in parallel
const items = $input.all();
const batchSize = 50;
const batches = [];

for (let i = 0; i < items.length; i += batchSize) {
  batches.push(items.slice(i, i + batchSize));
}

// Each batch is processed in a separate Execute Workflow
return batches.map((batch, index) => ({
  json: {
    batchNumber: index + 1,
    totalBatches: batches.length,
    items: batch
  }
}));
\`\`\`

### Best Practices

1. **Descriptive names**: Use clear names for sub-workflows
2. **Documentation**: Document the expected inputs and outputs
3. **Validation**: Validate incoming data in sub-workflows
4. **Error handling**: Always handle errors in sub-workflows
5. **Testing**: Test sub-workflows independently
6. **Versioning**: Keep versions of critical sub-workflows
7. **Monitoring**: Log executions of important sub-workflows

### Debugging

#### Verifying the Data Flow

\`\`\`javascript
// Inside the sub-workflow, log the incoming data
console.log('=== SUB-WORKFLOW INPUT ===');
console.log('Items received:', $input.all().length);
console.log('First item:', JSON.stringify($input.first().json, null, 2));

// Log the data before returning it
console.log('=== SUB-WORKFLOW OUTPUT ===');
console.log('Items to return:', results.length);
\`\`\`

### Additional Resources

- [Execute Workflow Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow/)
- [Workflow Organization](https://docs.n8n.io/flow-logic/subworkflows/)
- [Error Workflows](https://docs.n8n.io/flow-logic/error-handling/)
`,
    },
    {
      id: "les-02-05",
      moduleSlug: "n8n-core-essential-nodes",
      slug: "flow-control",
      title: "Flow Control: IF, Switch, Merge and Wait",
      description: "Master the flow control nodes to build complex, conditional workflows.",
      estimatedMinutes: 25,
      content: `## Flow Control in N8N

Flow control nodes let you build conditional logic, combine data and handle asynchronous executions.

### IF Node

Runs different branches based on conditions.

#### Basic Configuration

\`\`\`json
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.age }}",
        "rightValue": 18,
        "operator": {
          "type": "number",
          "operation": "gte"
        }
      }
    ]
  }
}
\`\`\`

#### Available Operators

**Numbers:**
- \`equal\`: Equal to
- \`notEqual\`: Not equal to
- \`gt\`: Greater than
- \`gte\`: Greater than or equal to
- \`lt\`: Less than
- \`lte\`: Less than or equal to

**Strings:**
- \`equal\`: Equal to
- \`notEqual\`: Not equal to
- \`contains\`: Contains
- \`notContains\`: Does not contain
- \`startsWith\`: Starts with
- \`endsWith\`: Ends with
- \`regex\`: Matches a regex

**Boolean:**
- \`true\`: Is true
- \`false\`: Is false

**Arrays:**
- \`contains\`: Contains an element
- \`lengthEqual\`: Length equal to
- \`lengthGt\`: Length greater than

#### Condition Examples

**Simple condition:**

\`\`\`javascript
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.status }}",
        "rightValue": "active",
        "operator": {
          "type": "string",
          "operation": "equal"
        }
      }
    ]
  }
}
\`\`\`

**Multiple conditions (AND):**

\`\`\`javascript
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.age }}",
        "rightValue": 18,
        "operator": { "type": "number", "operation": "gte" }
      },
      {
        "leftValue": "={{ $json.email }}",
        "rightValue": "",
        "operator": { "type": "string", "operation": "notEmpty" }
      },
      {
        "leftValue": "={{ $json.verified }}",
        "rightValue": true,
        "operator": { "type": "boolean", "operation": "true" }
      }
    ],
    "combinator": "and"
  }
}
\`\`\`

**Multiple conditions (OR):**

\`\`\`javascript
{
  "conditions": {
    "conditions": [
      {
        "leftValue": "={{ $json.role }}",
        "rightValue": "admin",
        "operator": { "type": "string", "operation": "equal" }
      },
      {
        "leftValue": "={{ $json.role }}",
        "rightValue": "moderator",
        "operator": { "type": "string", "operation": "equal" }
      }
    ],
    "combinator": "or"
  }
}
\`\`\`

### Switch Node

Routes items to different outputs based on conditions.

#### Configuration

\`\`\`json
{
  "mode": "rules",
  "rules": {
    "rules": [
      {
        "output": 0,
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.type }}",
              "rightValue": "sale",
              "operator": { "type": "string", "operation": "equal" }
            }
          ]
        }
      },
      {
        "output": 1,
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.type }}",
              "rightValue": "refund",
              "operator": { "type": "string", "operation": "equal" }
            }
          ]
        }
      },
      {
        "output": 2,
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.type }}",
              "rightValue": "inquiry",
              "operator": { "type": "string", "operation": "equal" }
            }
          ]
        }
      }
    ]
  },
  "fallbackOutput": 3
}
\`\`\`

#### Example: Ticket Router

\`\`\`
[Webhook: New Ticket]
    ↓
[Switch: Priority]
    ├─ Output 0 (High) → [Execute: Urgent Process]
    ├─ Output 1 (Medium) → [Execute: Normal Process]
    ├─ Output 2 (Low) → [Execute: Batch Process]
    └─ Fallback → [Execute: Default Process]
\`\`\`

### Merge Node

Combines data from multiple sources.

#### Merge Modes

**1. Append**
Concatenates the items of both inputs.

\`\`\`
Input 1: [A, B, C]
Input 2: [D, E, F]
Output: [A, B, C, D, E, F]
\`\`\`

**2. Combine by Position**
Combines items by position (index).

\`\`\`
Input 1: [{id: 1, name: "John"}, {id: 2, name: "Mary"}]
Input 2: [{age: 25}, {age: 30}]
Output: [{id: 1, name: "John", age: 25}, {id: 2, name: "Mary", age: 30}]
\`\`\`

**3. Combine by Fields**
Combines items based on matching fields (like a SQL JOIN).

\`\`\`javascript
{
  "mode": "combine",
  "combinationMode": "mergeByFields",
  "fieldsToMatch": {
    "fields": [
      {
        "field1": "userId",
        "field2": "id"
      }
    ]
  }
}
\`\`\`

**4. SQL-like Join**

\`\`\`javascript
{
  "mode": "combine",
  "combinationMode": "mergeByFields",
  "fieldsToMatch": {
    "fields": [
      {
        "field1": "orderId",
        "field2": "id"
      }
    ]
  },
  "options": {
    "joinMode": "innerJoin" // innerJoin, leftJoin, rightJoin, fullJoin
  }
}
\`\`\`

#### Example: Combining User and Order Data

\`\`\`
[HTTP: Get Users] ──┐
                    ├─→ [Merge: by userId] → [Output: Users with Orders]
[HTTP: Get Orders] ─┘
\`\`\`

### Wait Node

Pauses the workflow execution.

#### Wait Modes

**1. Fixed Time**

\`\`\`json
{
  "resume": "timeInterval",
  "amount": 5,
  "unit": "minutes"
}
\`\`\`

**2. Until a Specific Date**

\`\`\`json
{
  "resume": "specificTime",
  "dateTime": "={{ $now.plus({ hours: 2 }).toISO() }}"
}
\`\`\`

**3. Webhook Callback**

\`\`\`json
{
  "resume": "webhook",
  "options": {
    "webhookSuffix": "/callback"
  }
}
\`\`\`

#### Example: Retry with a Wait

\`\`\`
[HTTP Request]
    ↓ (error)
[Wait: 30 seconds]
    ↓
[HTTP Request] (retry)
    ↓ (error)
[Wait: 1 minute]
    ↓
[HTTP Request] (retry)
\`\`\`

### Split In Batches Node

Processes items in batches.

#### Configuration

\`\`\`json
{
  "batchSize": 10,
  "options": {}
}
\`\`\`

#### Example: Processing 1000 Items in Batches of 50

\`\`\`
[Split In Batches: 50]
    ↓
[HTTP Request: Process Batch]
    ↓
[Loop Back to Split In Batches]
    ↓ (when all batches have been processed)
[Continue Workflow]
\`\`\`

### Loop Over Items Node

Iterates over each item individually.

#### Configuration

\`\`\`json
{
  "options": {
    "reset": false
  }
}
\`\`\`

#### Example: Processing Items One by One

\`\`\`
[Loop Over Items]
    ↓
[HTTP Request: Process Item]
    ↓
[IF: Success?]
    ├─ Yes → [Loop Back]
    └─ No → [Error Handler] → [Loop Back]
\`\`\`

### Advanced Patterns

#### Pattern: State Machine

\`\`\`
[Start]
    ↓
[Switch: Current State]
    ├─ "new" → [Process New] → [Set: State = "processing"] → [Loop]
    ├─ "processing" → [Verify] → [Set: State = "completed"] → [Loop]
    ├─ "completed" → [Notify] → [End]
    └─ "error" → [Handle Error] → [End]
\`\`\`

#### Pattern: Fan-Out / Fan-In

\`\`\`
[Webhook: List of URLs]
    ↓
[Split In Batches: 5]
    ↓
[HTTP Request: Fetch URL] (5 in parallel)
    ↓
[Merge: Combine Results]
    ↓
[Process All Results]
\`\`\`

#### Pattern: Circuit Breaker

\`\`\`javascript
// Code node to implement a circuit breaker
const items = $input.all();
const circuitState = $workflow.variables.circuitState || 'closed';
const failureCount = $workflow.variables.failureCount || 0;
const threshold = 5;

if (circuitState === 'open') {
  // The circuit is open, skip processing
  return items.map(item => ({
    json: {
      ...item.json,
      skipped: true,
      reason: 'Circuit breaker open'
    }
  }));
}

// Process normally
const results = [];
let newFailureCount = failureCount;

for (const item of items) {
  try {
    // Try to process the item
    const result = await processItem(item);
    results.push({ json: { ...item.json, ...result, success: true } });
    newFailureCount = 0; // Reset on success
  } catch (error) {
    results.push({ json: { ...item.json, error: error.message, success: false } });
    newFailureCount++;
  }
}

// Update the circuit state
const newState = newFailureCount >= threshold ? 'open' : 'closed';

return results;
\`\`\`

### Best Practices

1. **Use IF for simple logic**: Two paths (true/false)
2. **Use Switch for multiple paths**: More than two options
3. **Merge carefully**: Make sure the match fields exist
4. **Use Wait sparingly**: Do not pause workflows for too long
5. **Batch processing**: Use Split In Batches for large volumes
6. **Document complex flows**: Add explanatory notes

### Debugging

#### Verifying the Execution Path

\`\`\`javascript
// In each control node, log the path that was taken
console.log('IF Node - Condition result:', conditionResult);
console.log('Switch Node - Output:', outputIndex);
console.log('Merge Node - Items from input 1:', input1Count);
console.log('Merge Node - Items from input 2:', input2Count);
\`\`\`

### Additional Resources

- [IF Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/)
- [Switch Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/)
- [Merge Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/)
- [Wait Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.wait/)
`,
    },
  ],
};
