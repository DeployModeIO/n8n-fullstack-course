import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/utils/admin-check';
import { hashPassword } from '@/lib/auth/password';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { email, password, role } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'email y password son requeridos' },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 6 caracteres' },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const assignedRole = role || 'student';
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await hashPassword(password);

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: passwordHash, role: assignedRole })
      .eq('id', existing.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      data: { id: existing.id, email: normalizedEmail },
      updated: true,
    });
  }

  const { data: newUser, error: createError } = await supabase
    .from('users')
    .insert({
      email: normalizedEmail,
      password_hash: passwordHash,
      role: assignedRole,
    })
    .select('id, email')
    .single();

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 });
  }

  return NextResponse.json({ data: newUser, created: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase.from('users').delete().eq('id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
