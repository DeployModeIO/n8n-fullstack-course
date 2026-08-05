import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/auth/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();
  const body = await request.json();
  const { lesson_id, completed } = body;

  if (!lesson_id) {
    return NextResponse.json(
      { error: 'lesson_id is required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: session.userId,
        lesson_id,
        completed: completed ?? true,
        completed_at: completed ? new Date().toISOString() : null,
        last_accessed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get('lesson_id');

  let query = supabase
    .from('user_progress')
    .select('*, lessons(*)')
    .eq('user_id', session.userId);

  if (lessonId) {
    query = query.eq('lesson_id', lessonId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
