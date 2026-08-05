export interface IssueCertificateInput {
  recipientName: string;
  recipientEmail: string;
  courseName: string;
  completionDate: string;
  customAttributes?: Record<string, string>;
}

export interface IssueCertificateResult {
  provider: string;
  credentialId: string | null;
  certificateNo: string;
  verificationUrl: string;
  pdfUrl: string | null;
}

export interface CertificateProvider {
  name: string;
  issue(input: IssueCertificateInput): Promise<IssueCertificateResult>;
}
