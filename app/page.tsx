import Link from 'next/link';

const stats = [
  { value: '6', label: 'Módulos' },
  { value: '30+', label: 'Lecciones' },
  { value: '12', label: 'Proyectos' },
];

const features = [
  {
    title: 'Despliegue Profesional',
    description:
      'Docker, Kubernetes, CI/CD y monitoreo en producción con las mejores prácticas de la industria.',
    icon: '🚀',
  },
  {
    title: 'AI Agentic Workflows',
    description:
      'Construye agentes autónomos con LLMs, tool-calling, memoria y razonamiento multi-paso.',
    icon: '🤖',
  },
  {
    title: 'Custom Nodes',
    description:
      'Desarrolla nodos personalizados en TypeScript para extender las capacidades de N8N.',
    icon: '🧩',
  },
  {
    title: 'Integraciones API',
    description:
      'Conecta con REST, GraphQL, webhooks y OAuth2 para orquestar cualquier servicio.',
    icon: '🔗',
  },
  {
    title: 'RAG & Vector DBs',
    description:
      'Implementa retrieval-augmented generation con Pinecone, Weaviate y embeddings avanzados.',
    icon: '🧠',
  },
  {
    title: 'Seguridad Enterprise',
    description:
      'RBAC, auditoría, encriptación, secrets management y cumplimiento normativo.',
    icon: '🔒',
  },
];

const testimonials = [
  {
    name: 'María García',
    role: 'Automation Engineer',
    text: 'Este curso transformó mi carrera. Pasé de scripts básicos a diseñar workflows enterprise en semanas.',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'CTO en StartupX',
    text: 'El módulo de AI agents es increíble. Implementamos un sistema completo de atención al cliente automatizado.',
  },
  {
    name: 'Ana Martínez',
    role: 'DevOps Lead',
    text: 'La sección de despliegue y seguridad es exactamente lo que necesitaba para llevar N8N a producción.',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-24 sm:py-32">
        <div className="animated-gradient absolute inset-0 opacity-10 dark:opacity-20" />
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="bg-gradient-to-r from-gray-900 via-orange-600 to-orange-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl dark:from-white dark:via-orange-200 dark:to-orange-400">
            Domina N8N: De Cero a Nivel Enterprise
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-400">
            El curso más completo de automatización con N8N. Aprende a construir
            workflows inteligentes, agentes de IA, integraciones complejas y
            despliegues profesionales.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/course/fundamentos-infraestructura/introduccion-n8n"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40"
            >
              Comenzar Curso
            </Link>
            <Link
              href="/login"
              className="rounded-xl border px-8 py-3.5 text-lg font-semibold transition bg-white/70 border-gray-300 text-gray-900 hover:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-8 sm:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-orange-500 sm:text-5xl dark:text-orange-400">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Lo que aprenderás
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl p-6 transition backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg hover:border-orange-500/30 dark:bg-white/5 dark:border-white/10 dark:shadow-none"
              >
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Comienza tu viaje hoy
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Únete a miles de profesionales que ya están construyendo el futuro de
            la automatización.
          </p>
          <Link
            href="/course/fundamentos-infraestructura/introduccion-n8n"
            className="inline-block rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40"
          >
            Comenzar Curso
          </Link>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Lo que dicen nuestros estudiantes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl p-6 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg dark:bg-white/5 dark:border-white/10 dark:shadow-none">
                <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t px-4 py-8 border-gray-200/50 dark:border-white/5">
        <div className="mx-auto max-w-6xl text-center text-sm text-gray-500 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Curso Full Stack N8N. Todos los
          derechos reservados.
        </div>
      </footer>
    </>
  );
}
