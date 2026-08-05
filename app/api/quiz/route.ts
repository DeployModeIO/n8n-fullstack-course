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
  const { lesson_id, score, total_questions, answers, passed } = body;

  if (!lesson_id || score === undefined) {
    return NextResponse.json(
      { error: 'lesson_id and score are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('quiz_results')
    .insert({
      user_id: session.userId,
      lesson_id,
      score,
      total_questions: total_questions ?? 0,
      answers,
      passed: passed ?? false,
    })
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
    .from('quiz_results')
    .select('*')
    .eq('user_id', session.userId)
    .order('attempted_at', { ascending: false });

  if (lessonId) {
    query = query.eq('lesson_id', lessonId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
