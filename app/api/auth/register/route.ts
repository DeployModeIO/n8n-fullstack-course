import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password, invitation_token } = await request.json();

  if (!email || !password || !invitation_token) {
    return NextResponse.json(
      { error: 'Email, password y invitation_token son requeridos.' },
      { status: 400 }
    );
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invitation, error: inviteError } = await supabaseAdmin
    .from('invitations')
    .select('id, email, role, status, expires_at')
    .eq('token', invitation_token)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .single();

  if (inviteError || !invitation) {
    return NextResponse.json(
      { error: 'La invitación no es válida o ha expirado.' },
      { status: 400 }
    );
  }

  if (invitation.email !== email) {
    return NextResponse.json(
      { error: 'El email no coincide con la invitación.' },
      { status: 400 }
    );
  }

  const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (userError) {
    return NextResponse.json(
      { error: userError.message },
      { status: 400 }
    );
  }

  await supabaseAdmin
    .from('invitations')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    })
    .eq('id', invitation.id);

  return NextResponse.json({
    success: true,
    user: { id: newUser.user.id, email: newUser.user.email },
  });
}
