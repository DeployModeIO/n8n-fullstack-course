import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, sessionCookieOptions, SESSION_COOKIE } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email y contraseña son requeridos' },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data: user } = await supabase
    .from('users')
    .select('id, email, role, password_hash')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (!user || !user.password_hash) {
    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
  });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
