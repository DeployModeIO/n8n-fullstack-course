import { createClient } from '@/lib/supabase/server';

export const COURSE_ID = 'n8n-fullstack';
const DEFAULT_MAX_ATTEMPTS = 3;

export interface EnrollmentStatus {
  attemptsCount: number;
  maxAttempts: number;
  attemptsLeft: number;
  blocked: boolean;
  certificateId: string | null;
}

export async function getEnrollmentStatus(
  userId: string,
  courseId: string = COURSE_ID
): Promise<EnrollmentStatus> {
  const supabase = createClient();
  const { data } = await supabase
    .from('enrollments')
    .select('attempts_count, max_attempts, blocked, certificate_id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();

  if (!data) {
    return {
      attemptsCount: 0,
      maxAttempts: DEFAULT_MAX_ATTEMPTS,
      attemptsLeft: DEFAULT_MAX_ATTEMPTS,
      blocked: false,
      certificateId: null,
    };
  }

  const attemptsCount = data.attempts_count ?? 0;
  const maxAttempts = data.max_attempts ?? DEFAULT_MAX_ATTEMPTS;
  return {
    attemptsCount,
    maxAttempts,
    attemptsLeft: Math.max(0, maxAttempts - attemptsCount),
    blocked: !!data.blocked,
    certificateId: data.certificate_id ?? null,
  };
}

/**
 * Registra un intento del examen final.
 * Si se aprueba, no se bloquea. Si se falla y se alcanza el máximo,
 * se marca como bloqueado.
 */
export async function recordExamAttempt(
  userId: string,
  passed: boolean,
  courseId: string = COURSE_ID
): Promise<EnrollmentStatus> {
  const supabase = createClient();

  const { data: current } = await supabase
    .from('enrollments')
    .select('attempts_count, max_attempts, blocked')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();

  const maxAttempts = current?.max_attempts ?? DEFAULT_MAX_ATTEMPTS;
  const attemptsCount = (current?.attempts_count ?? 0) + 1;
  const blocked = !passed && attemptsCount >= maxAttempts;

  const { data: updated, error } = await supabase
    .from('enrollments')
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        attempts_count: attemptsCount,
        max_attempts: maxAttempts,
        blocked,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,course_id' }
    )
    .select('attempts_count, max_attempts, blocked, certificate_id')
    .single();

  if (error) throw new Error(error.message);

  const finalCount = updated?.attempts_count ?? attemptsCount;
  return {
    attemptsCount: finalCount,
    maxAttempts,
    attemptsLeft: Math.max(0, maxAttempts - finalCount),
    blocked: !!updated?.blocked,
    certificateId: updated?.certificate_id ?? null,
  };
}

export async function markCertificateIssued(
  userId: string,
  certificateId: string,
  courseId: string = COURSE_ID
): Promise<void> {
  const supabase = createClient();
  await supabase
    .from('enrollments')
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        certificate_id: certificateId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,course_id' }
    );
}
