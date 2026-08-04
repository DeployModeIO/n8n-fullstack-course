import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/utils/admin-check';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data.users });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { email, password, role } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'email and password are required' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (role && data.user) {
    await supabase
      .from('users')
      .update({ role })
      .eq('id', data.user.id);
  }

  return NextResponse.json({ data: data.user });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) {
    return NextResponse.json(
      { error: 'id is required' },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
