import { getSession } from '@/lib/auth/server';

export async function isAdmin() {
  const session = await getSession();
  return session?.role === 'admin' && session?.email === 'luisriverosu@gmail.com';
}
