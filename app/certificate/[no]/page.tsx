import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface VerifyPageProps {
  params: Promise<{ no: string }>;
}

export default async function VerifyCertificatePage({
  params,
}: VerifyPageProps) {
  const { no } = await params;
  const supabase = createClient();

  const { data: cert } = await supabase
    .from('certificates')
    .select('certificate_no, provider, issued_at, verification_url, user_id')
    .eq('certificate_no', no)
    .maybeSingle();

  const isValid = !!cert;

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-[#1E90FF]" />
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Certificate Verification
      </h1>

      <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/70 border border-gray-200/50 dark:bg-white/10 dark:border-white/15">
        {isValid ? (
          <div className="space-y-3">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
            <p className="font-semibold text-gray-900 dark:text-white">
              Valid certificate
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Code: <strong>{cert.certificate_no}</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Issued: {new Date(cert.issued_at).toLocaleDateString('en-US')}
            </p>
            {cert.verification_url && (
              <a
                href={cert.verification_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#1E90FF] underline"
              >
                Open verifiable credential
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <XCircle className="mx-auto h-10 w-10 text-red-500" />
            <p className="font-semibold text-gray-900 dark:text-white">
              Certificate not found
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The code <strong>{no}</strong> does not match any credential
              issued by this platform.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
