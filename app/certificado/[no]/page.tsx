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
        Verificación de Certificado
      </h1>

      <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/70 border border-gray-200/50 dark:bg-white/10 dark:border-white/15">
        {isValid ? (
          <div className="space-y-3">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-500" />
            <p className="font-semibold text-gray-900 dark:text-white">
              Certificado válido
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Código: <strong>{cert.certificate_no}</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Emitido: {new Date(cert.issued_at).toLocaleDateString('es')}
            </p>
            {cert.verification_url && (
              <a
                href={cert.verification_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#1E90FF] underline"
              >
                Abrir credencial verificable
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <XCircle className="mx-auto h-10 w-10 text-red-500" />
            <p className="font-semibold text-gray-900 dark:text-white">
              Certificado no encontrado
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              El código <strong>{no}</strong> no corresponde a ninguna
              credencial emitida por esta plataforma.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
