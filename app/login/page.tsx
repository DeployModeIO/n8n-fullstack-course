import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/server';
import LoginForm from '@/components/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl p-8 backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-xl dark:bg-white/10 dark:border-white/15 dark:shadow-none">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Bienvenido</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Accede al curso más completo de N8N y automatización con IA.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
