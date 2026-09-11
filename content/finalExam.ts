import { QuizQuestion } from '../types/course';

export const finalExam: QuizQuestion[] = [
  {
    id: 'fe-01',
    question: 'What is the main difference between a "Trigger" node and an "Action" node in N8N?',
    options: [
      'There is no difference, they are synonyms',
      'The Trigger starts the workflow and the Action performs an operation',
      'The Action starts the workflow and the Trigger ends it',
      'Both must be connected to a database',
    ],
    correctIndex: 1,
    explanation:
      'Triggers are entry nodes that start workflow execution; Actions perform operations (HTTP, DB, email, etc.).',
  },
  {
    id: 'fe-02',
    question: 'In a RAG (Retrieval-Augmented Generation) flow, which component retrieves the relevant information?',
    options: [
      'The large language model (LLM) directly',
      'A vector store that searches for similar embeddings',
      'An inbound webhook',
      'The schedule node',
    ],
    correctIndex: 1,
    explanation:
      'The vector store retrieves the most similar chunks (by embedding) so they can be injected as context for the LLM.',
  },
  {
    id: 'fe-03',
    question: 'Which strategy is recommended so credentials are not exposed in a shared workflow?',
    options: [
      'Write them in the node content',
      'Use N8N native credentials, encrypted per environment',
      'Put them in a public spreadsheet',
      'Leave them in the chat history',
    ],
    correctIndex: 1,
    explanation:
      'N8N stores credentials encrypted and links them to the node without exposing the secret in the workflow JSON.',
  },
  {
    id: 'fe-04',
    question: 'To scale N8N in production under high concurrency, which option is the most suitable?',
    options: [
      'Running executions only from the editor UI',
      'Using the queue mode with multiple workers and Redis',
      'Turning off all logs',
      'Running a single process on a laptop',
    ],
    correctIndex: 1,
    explanation:
      'Queue mode with Redis and several workers lets you distribute the load and process executions in parallel.',
  },
  {
    id: 'fe-05',
    question: 'What is a "webhook" in the context of N8N?',
    options: [
      'A type of database',
      'An HTTP endpoint that receives data to start a workflow',
      'An error node',
      'An email client',
    ],
    correctIndex: 1,
    explanation:
      'The Webhook node exposes a URL that triggers workflow execution when it receives an HTTP request.',
  },
  {
    id: 'fe-06',
    question: 'When prompting agents, what does "few-shot prompting" bring to the table?',
    options: [
      'It reduces the cost to zero',
      'It provides examples in the prompt to guide the format/answer',
      'It disables memory',
      'It removes the need for the LLM',
    ],
    correctIndex: 1,
    explanation:
      'Few-shot prompting includes input/output examples so the model imitates the desired pattern.',
  },
  {
    id: 'fe-07',
    question: 'What is a security risk of letting an agent execute arbitrary code?',
    options: [
      'It always improves accuracy',
      'It can run malicious commands if it is not sandboxed',
      'There is no risk',
      'It only affects performance',
    ],
    correctIndex: 1,
    explanation:
      'Running code without isolation can enable privilege escalation or unauthorized access.',
  },
  {
    id: 'fe-08',
    question: 'To verify the authenticity of a certificate issued by your platform, the best approach is:',
    options: [
      'Printing it on paper',
      'Providing a public, independent verification URL/ID',
      'Sending it by SMS',
      'Not verifying anything',
    ],
    correctIndex: 1,
    explanation:
      'A verification URL lets employers validate the credential without relying on the holder.',
  },
];

export const FINAL_EXAM_PASS_RATIO = 0.7;
