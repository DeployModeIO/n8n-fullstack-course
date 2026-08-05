import Link from 'next/link';

export const metadata = { title: 'Política de Cookies | Curso N8N' };

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Política de Cookies
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-white/70">
        <p>
          Esta política explica qué cookies utiliza el Curso Full Stack de N8N y
          para qué sirven.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          ¿Qué son las cookies?
        </h2>
        <p>
          Son pequeños archivos que un sitio web guarda en tu navegador para
          recordar información sobre tu visita.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Tipos de cookies que usamos
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Cookies necesarias:</strong> mantienen tu sesión
            autenticada (cookie <code>session</code>) y recuerdan tu
            preferencia de tema claro/oscuro. No se pueden desactivar.
          </li>
          <li>
            <strong>Cookie de consentimiento:</strong> registra tu elección en
            el banner de cookies (<code>cookie_consent</code>).
          </li>
          <li>
            <strong>Cookies de analítica:</strong> solo con tu consentimiento,
            nos ayudan a entender qué contenido mejora el aprendizaje.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gestión de cookies
        </h2>
        <p>
          Puedes cambiar tu decisión en cualquier momento borrando las cookies
          de este sitio en tu navegador, o contactando al administrador. Al
          reabrir el sitio se mostrará de nuevo el banner de consentimiento.
        </p>

        <p className="pt-4">
          <Link href="/privacy" className="text-[#1E90FF] underline">
            Ver Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
