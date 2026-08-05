import { IssueCertificateInput, IssueCertificateResult, CertificateProvider } from './types';

const BASE = 'https://b2b.sertifier.com';
const API_VERSION = '3.3';

function certNo(): string {
  const y = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `N8N-${y}-${rand}`;
}

/**
 * Adaptador Sertifier.
 * Requiere: SERTIFIER_SECRET_KEY y SERTIFIER_DESIGN_ID en el entorno.
 * El flujo real usa Design + Detail + Campaign; este helper asume que ya
 * tienes un Design creado en el dashboard y usamos la API de credenciales.
 */
export class SertifierProvider implements CertificateProvider {
  name = 'sertifier';

  private get key(): string {
    const k = process.env.SERTIFIER_SECRET_KEY;
    if (!k) throw new Error('SERTIFIER_SECRET_KEY no configurada');
    return k;
  }

  private get designId(): string {
    const d = process.env.SERTIFIER_DESIGN_ID;
    if (!d) throw new Error('SERTIFIER_DESIGN_ID no configurada');
    return d;
  }

  async issue(input: IssueCertificateInput): Promise<IssueCertificateResult> {
    const no = certNo();

    // 1) Crear Detail (datos del credential)
    const detailRes = await fetch(`${BASE}/CredentialProfile`, {
      method: 'POST',
      headers: {
        'api-version': API_VERSION,
        secretKey: this.key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        designId: this.designId,
        name: input.recipientName,
        email: input.recipientEmail,
        issuingDate: input.completionDate,
        certificateNo: no,
        customAttributes: {
          course: input.courseName,
          email: input.recipientEmail,
          ...input.customAttributes,
        },
      }),
    });
    if (!detailRes.ok) {
      throw new Error(`Sertifier Detail error: ${detailRes.status}`);
    }
    const detail = await detailRes.json();

    // 2) Publicar para generar URL verificable
    const credId = detail?.content?.id ?? detail?.data?.id ?? null;
    let verificationUrl = '';
    let pdfUrl: string | null = null;
    if (credId) {
      await fetch(`${BASE}/credential/publish`, {
        method: 'POST',
        headers: {
          'api-version': API_VERSION,
          secretKey: this.key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credentialIds: [credId] }),
      });
      verificationUrl = `${BASE.replace('b2b.', '').replace('https://', 'https://app.')}/credential/${credId}`;
      try {
        const pdfRes = await fetch(
          `${BASE}/credential/generatePDFLink/${credId}`,
          { headers: { 'api-version': API_VERSION, secretKey: this.key } }
        );
        if (pdfRes.ok) {
          const pdf = await pdfRes.json();
          pdfUrl = pdf?.content?.url ?? pdf?.data?.url ?? null;
        }
      } catch {}
    }

    return {
      provider: this.name,
      credentialId: credId,
      certificateNo: no,
      verificationUrl,
      pdfUrl,
    };
  }
}
