import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/utils/admin-check';
import { getSession } from '@/lib/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
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

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();
  const body = await request.json();
  const { email, role } = body;

  if (!email || !role) {
    return NextResponse.json(
      { error: 'email and role are required' },
      { status: 400 }
    );
  }

  const token = crypto.randomUUID();
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('invitations')
    .insert({
      email,
      role,
      invited_by: session.userId,
      token,
      expires_at,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, token });
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json(
      { error: 'id and status are required' },
      { status: 400 }
    );
  }

  const validStatuses = ['pending', 'accepted', 'expired', 'revoked'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${validStatuses.join(', ')}` },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('invitations')
    .update({ status, accepted_at: status === 'accepted' ? new Date().toISOString() : null })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
