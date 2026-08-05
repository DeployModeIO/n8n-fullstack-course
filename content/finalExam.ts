import { QuizQuestion } from '../types/course';

export const finalExam: QuizQuestion[] = [
  {
    id: 'fe-01',
    question: '¿Cuál es la diferencia principal entre un nodo "Trigger" y un nodo "Action" en N8N?',
    options: [
      'No hay diferencia, son sinónimos',
      'El Trigger inicia el workflow y el Action ejecuta una operación',
      'El Action inicia el workflow y el Trigger lo termina',
      'Ambos deben conectarse a una base de datos',
    ],
    correctIndex: 1,
    explanation:
      'Los Triggers son nodos de entrada que inician la ejecución del workflow; los Actions realizan operaciones (HTTP, DB, email, etc.).',
  },
  {
    id: 'fe-02',
    question: 'En un flujo RAG (Retrieval-Augmented Generation), ¿qué componente recupera la información relevante?',
    options: [
      'El modelo de lenguaje grande (LLM) directamente',
      'Un vector store que busca embeddings similares',
      'Un webhook de entrada',
      'El nodo de schedules',
    ],
    correctIndex: 1,
    explanation:
      'El vector store recupera los fragmentos más similares (por embedding) para inyectarlos como contexto al LLM.',
  },
  {
    id: 'fe-03',
    question: '¿Qué estrategia es recomendable para no exponer credenciales en un workflow compartido?',
    options: [
      'Escribirlas en el contenido del nodo',
      'Usar las credenciales nativas de N8N cifradas por entorno',
      'Ponerlas en una hoja de cálculo pública',
      'Dejarlas en el historial del chat',
    ],
    correctIndex: 1,
    explanation:
      'N8N almacena credenciales cifradas y las vincula al nodo sin exponer el secreto en el JSON del workflow.',
  },
  {
    id: 'fe-04',
    question: 'Para escalar N8N en producción con alta concurrencia, ¿qué opción es más adecuada?',
    options: [
      'Solo ejecución en la UI del editor',
      'Usar n8n-queue con múltiples workers y Redis',
      'Desactivar todos los logs',
      'Ejecutar un único proceso en una laptop',
    ],
    correctIndex: 1,
    explanation:
      'El modo queue con Redis y varios workers permite distribuir la carga y procesar ejecuciones en paralelo.',
  },
  {
    id: 'fe-05',
    question: '¿Qué es un "webhook" en el contexto de N8N?',
    options: [
      'Un tipo de base de datos',
      'Un endpoint HTTP que recibe datos para iniciar un workflow',
      'Un nodo de error',
      'Un cliente de correo',
    ],
    correctIndex: 1,
    explanation:
      'El nodo Webhook expone una URL que, al recibir una petición HTTP, dispara la ejecución del workflow.',
  },
  {
    id: 'fe-06',
    question: 'En prompting para agentes, ¿qué aporta el "few-shot prompting"?',
    options: [
      'Reduce el costo a cero',
      'Proporciona ejemplos en el prompt para guiar el formato/respuesta',
      'Desactiva la memoria',
      'Elimina la necesidad del LLM',
    ],
    correctIndex: 1,
    explanation:
      'Few-shot prompting incluye ejemplos de entrada/salida para que el modelo imite el patrón deseado.',
  },
  {
    id: 'fe-07',
    question: '¿Cuál es un riesgo de seguridad al permitir que un agente ejecute código arbitrario?',
    options: [
      'Mejora la precisión siempre',
      'Puede ejecutar comandos maliciosos si no está sandboxeado',
      'No tiene riesgo',
      'Solo afecta al rendimiento',
    ],
    correctIndex: 1,
    explanation:
      'Ejecutar código sin aislamiento puede permitir escalada de privilegios o acceso no autorizado.',
  },
  {
    id: 'fe-08',
    question: 'Para verificar la autenticidad de un certificado emitido por tu plataforma, lo ideal es:',
    options: [
      'Imprimirlo en papel',
      'Ofrecer una URL/ID de verificación pública e independiente',
      'Enviarlo por SMS',
      'No verificar nada',
    ],
    correctIndex: 1,
    explanation:
      'Una URL de verificación permite a empleadores validar la credential sin depender del portador.',
  },
];

export const FINAL_EXAM_PASS_RATIO = 0.7;
