'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { finalExam } from '@/content/finalExam';
import { cn } from '@/lib/utils/cn';
import { ShieldAlert, CheckCircle2, XCircle, Award } from 'lucide-react';
import ContentProtection from '@/components/ContentProtection';

interface Status {
  attemptsCount: number;
  maxAttempts: number;
  attemptsLeft: number;
  blocked: boolean;
  certificateId: string | null;
}

export default function FinalExamPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    score: number;
    total: number;
    certificate?: { verificationUrl: string; certificateNo: string };
  } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/exam/final')
      .then((r) => r.json())
      .then((d) => setStatus(d.status))
      .catch(() => setStatus(null));
  }, []);

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/exam/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error submitting your exam');
        if (data.status) setStatus(data.status);
        return;
      }
      setResult({
        passed: data.passed,
        score: data.score,
        total: data.total,
        certificate: data.certificate,
      });
      setStatus(data.status);
    } catch {
      setError('Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  if (status?.blocked) {
    return (
      <ContentProtection>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Access blocked
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You have used up the 3 attempts allowed for the final exam. Contact
            the administrator if you believe this is a mistake.
          </p>
        </div>
      </ContentProtection>
    );
  }

  if (result?.passed) {
    return (
      <ContentProtection>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <Award className="mx-auto mb-4 h-12 w-12 text-[#1E90FF]" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Congratulations! You passed the course
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Your certificate has been issued. Score: {result.score}/{result.total}
          </p>
          {result.certificate && (
            <a
              href={result.certificate.verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-xl bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] px-6 py-3 font-medium text-white"
            >
              View / download certificate ({result.certificate.certificateNo})
            </a>
          )}
          <div className="mt-4">
            <Link href="/dashboard" className="text-sm text-[#1E90FF] underline">
              Go to dashboard
            </Link>
          </div>
        </div>
      </ContentProtection>
    );
  }

  return (
    <ContentProtection>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Final Exam
          </h1>
          {status && (
            <span
              className={cn(
                'rounded-lg px-3 py-1 text-sm',
                status.attemptsLeft > 0
                  ? 'bg-[#FF6D5A]/10 text-[#FF6D5A]'
                  : 'bg-red-500/10 text-red-600'
              )}
            >
              Attempts left: {status.attemptsLeft}
            </span>
          )}
        </div>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          You must answer at least 70% correctly to get your certificate. You
          can take it up to 3 times.
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {!result?.passed && (
          <div className="space-y-6">
            {finalExam.map((q, qi) => (
              <div
                key={q.id}
                className="rounded-2xl p-5 backdrop-blur-xl bg-white/70 border border-gray-200/50 dark:bg-white/10 dark:border-white/15"
              >
                <p className="mb-3 font-semibold text-gray-900 dark:text-white">
                  {qi + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt: string, oi: number) => (
                    <label
                      key={oi}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm border-gray-200/50 hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/5"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={oi}
                        checked={answers[q.id] === oi}
                        onChange={() =>
                          setAnswers((a) => ({ ...a, [q.id]: oi }))
                        }
                      />
                      <span className="text-gray-700 dark:text-white/80">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={submit}
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] py-3 font-medium text-white hover:-translate-y-0.5 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit exam'}
            </button>
          </div>
        )}

        {result && !result.passed && (
          <div className="mt-6 rounded-2xl p-6 text-center backdrop-blur-xl bg-white/70 border border-gray-200/50 dark:bg-white/10 dark:border-white/15">
            <XCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              You did not pass this time ({result.score}/{result.total})
            </p>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {status && `You have ${status.attemptsLeft} attempt(s) left.`} Review
              the material and try again.
            </p>
          </div>
        )}
      </div>
    </ContentProtection>
  );
}
