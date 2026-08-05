import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/auth/server';
import { NextRequest, NextResponse } from 'next/server';
import { finalExam, FINAL_EXAM_PASS_RATIO } from '@/content/finalExam';
import { issueCertificate } from '@/lib/certificate';
import {
  getEnrollmentStatus,
  recordExamAttempt,
  markCertificateIssued,
} from '@/lib/enrollment';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = await getEnrollmentStatus(session.userId);
  return NextResponse.json({ status });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = await getEnrollmentStatus(session.userId);
  if (status.blocked) {
    return NextResponse.json(
      { error: 'Tu acceso al curso está bloqueado.', blocked: true, status },
      { status: 403 }
    );
  }

  const supabase = createClient();
  const body = await request.json();
  const answers: Record<string, number> = body.answers ?? {};

  let correct = 0;
  for (const q of finalExam) {
    if (answers[q.id] === q.correctIndex) correct += 1;
  }
  const score = correct;
  const total = finalExam.length;
  const passed = correct / total >= FINAL_EXAM_PASS_RATIO;

  // Registrar intento (incrementa contador / bloquea si corresponde)
  const after = await recordExamAttempt(session.userId, passed);

  if (!passed) {
    return NextResponse.json({
      passed: false,
      score,
      total,
      status: after,
    });
  }

  // Aprobar: emitir certificado verificable
  const { data: userRow } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', session.userId)
    .maybeSingle();

  const name =
    userRow?.full_name ||
    (userRow?.email ? userRow.email.split('@')[0] : 'Estudiante');
  const email = userRow?.email || session.email;

  const cert = await issueCertificate({
    recipientName: name,
    recipientEmail: email,
    courseName: 'Curso Full Stack de N8N',
    completionDate: new Date().toISOString().slice(0, 10),
  });

  const { data: certRow, error: certErr } = await supabase
    .from('certificates')
    .insert({
      user_id: session.userId,
      course_id: 'n8n-fullstack',
      provider: cert.provider,
      credential_id: cert.credentialId,
      certificate_no: cert.certificateNo,
      verification_url: cert.verificationUrl,
      pdf_url: cert.pdfUrl,
    })
    .select('id')
    .single();

  if (certErr) {
    return NextResponse.json({ error: certErr.message }, { status: 500 });
  }

  await markCertificateIssued(session.userId, certRow.id);

  return NextResponse.json({
    passed: true,
    score,
    total,
    certificate: {
      id: certRow.id,
      provider: cert.provider,
      certificateNo: cert.certificateNo,
      verificationUrl: cert.verificationUrl,
      pdfUrl: cert.pdfUrl,
    },
    status: after,
  });
}
