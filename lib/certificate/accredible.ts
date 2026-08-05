import { IssueCertificateInput, IssueCertificateResult, CertificateProvider } from './types';

const BASE = 'https://api.accredible.com/v1';

function certNo(): string {
  const y = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `N8N-${y}-${rand}`;
}

/**
 * Adaptador Accredible.
 * Requiere: ACCREDIBLE_API_KEY y ACCREDIBLE_GROUP_ID en el entorno.
 */
export class AccredibleProvider implements CertificateProvider {
  name = 'accredible';

  private get key(): string {
    const k = process.env.ACCREDIBLE_API_KEY;
    if (!k) throw new Error('ACCREDIBLE_API_KEY no configurada');
    return k;
  }

  private get groupId(): string {
    const g = process.env.ACCREDIBLE_GROUP_ID;
    if (!g) throw new Error('ACCREDIBLE_GROUP_ID no configurada');
    return g;
  }

  async issue(input: IssueCertificateInput): Promise<IssueCertificateResult> {
    const no = certNo();

    const res = await fetch(`${BASE}/credentials`, {
      method: 'POST',
      headers: {
        Authorization: `Token token=${this.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: {
          group_id: this.groupId,
          issued_on: input.completionDate,
          certificate: {
            name: `Certificado de ${input.courseName}`,
            certificate_number: no,
          },
        },
        recipient: {
          name: input.recipientName,
          email: input.recipientEmail,
        },
        custom_attributes: {
          course: input.courseName,
          ...input.customAttributes,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Accredible error ${res.status}: ${text}`);
    }

    const data = await res.json();
    const cred = data.credential ?? {};
    return {
      provider: this.name,
      credentialId: cred.id ?? null,
      certificateNo: no,
      verificationUrl: cred.url ?? '',
      pdfUrl: cred.url ?? null,
    };
  }
}
