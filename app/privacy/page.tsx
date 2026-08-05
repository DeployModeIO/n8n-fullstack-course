import Link from 'next/link';

export const metadata = { title: 'Política de Privacidad | Curso N8N' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Política de Privacidad
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-white/70">
        <p>
          Esta política describe cómo el Curso Full Stack de N8N recopila,
          usa y protege tus datos personales.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Datos que recopilamos
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Correo electrónico y rol (creados por el administrador).</li>
          <li>Progreso del curso, lecciones completadas y resultados de quizzes.</li>
          <li>Intentos de examen y, en su caso, el certificado emitido.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Uso de los datos
        </h2>
        <p>
          Los usamos únicamente para operar la plataforma, llevar tu progreso,
          emitir certificados verificables y mejorar el contenido. No vendemos
          tus datos.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Seguridad
        </h2>
        <p>
          Las contraseñas se almacenan con hash bcrypt. Las sesiones usan
          tokens JWT en cookies httpOnly. El contenido del curso incluye
          marcas de agua y protección contra copia para evitar la piratería.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Tus derechos
        </h2>
        <p>
          Puedes solicitar acceso, corrección o eliminación de tus datos
          escribiendo al administrador.
        </p>

        <p className="pt-4">
          <Link href="/cookies" className="text-[#1E90FF] underline">
            Ver Política de Cookies
          </Link>
        </p>
      </div>
    </div>
  );
}
