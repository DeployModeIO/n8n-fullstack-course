import { IssueCertificateInput, IssueCertificateResult, CertificateProvider } from './types';
import { SertifierProvider } from './sertifier';
import { AccredibleProvider } from './accredible';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://n8n-fullstack-course.vercel.app';

/**
 * Proveedor local de respaldo: emite un registro verificable en nuestra
 * propia plataforma cuando no hay claves de un proveedor externo.
 */
class LocalProvider implements CertificateProvider {
  name = 'local';

  async issue(input: IssueCertificateInput): Promise<IssueCertificateResult> {
    const y = new Date().getFullYear();
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    const no = `N8N-${y}-${rand}`;
    return {
      provider: this.name,
      credentialId: null,
      certificateNo: no,
      verificationUrl: `${BASE_URL}/certificado/${no}`,
      pdfUrl: null,
    };
  }
}

export function getCertificateProvider(): CertificateProvider {
  const choice = (process.env.CERT_PROVIDER || 'local').toLowerCase();
  if (choice === 'sertifier') return new SertifierProvider();
  if (choice === 'accredible') return new AccredibleProvider();
  return new LocalProvider();
}

export async function issueCertificate(
  input: IssueCertificateInput
): Promise<IssueCertificateResult> {
  const provider = getCertificateProvider();
  try {
    return await provider.issue(input);
  } catch (err) {
    // Si el proveedor externo falla (claves faltantes, error de red),
    // emitimos localmente para no romper el flujo del curso.
    console.warn('[certificate] proveedor externo falló, usando local:', err);
    return new LocalProvider().issue(input);
  }
}

export type { IssueCertificateInput, IssueCertificateResult, CertificateProvider };
