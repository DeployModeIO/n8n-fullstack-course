import Link from 'next/link';
import { ShieldCheck, BookOpen, ExternalLink } from 'lucide-react';

export const metadata = { title: 'Certificaciones de Seguridad Open Source | Curso N8N' };

const certs = [
  {
    name: 'CKS – Certified Kubernetes Security Specialist',
    issuer: 'Linux Foundation / CNCF',
    open: true,
    desc: 'Asegura clusters Kubernetes: policy, hardening, runtime y supply chain. Parte del ecosistema open source CNCF.',
    url: 'https://www.cncf.io/training/certification/cks/',
  },
  {
    name: 'LFCS – Linux Foundation Certified Sysadmin',
    issuer: 'Linux Foundation',
    open: true,
    desc: 'Administración de sistemas Linux (operaciones, redes, seguridad básica). Base sólida para cualquier despliegue.',
    url: 'https://training.linuxfoundation.org/certification/lfcs/',
  },
  {
    name: 'OpenSSF Best Practices Badge',
    issuer: 'OpenSSF (Open Source Security Foundation)',
    open: true,
    desc: 'No es un examen, sino una certificación de buenas prácticas de seguridad para proyectos open source.',
    url: 'https://www.bestpractices.dev/',
  },
  {
    name: 'OWASP API Security Top 10 / ASVS',
    issuer: 'OWASP (Open Web Application Security Project)',
    open: true,
    desc: 'Estándares abiertos para asegurar APIs y aplicaciones web. Ideales para quienes construyen integraciones con N8N.',
    url: 'https://owasp.org/www-project-api-security/',
  },
  {
    name: 'CHFI – Computer Hacking Forensic Investigator',
    issuer: 'EC-Council',
    open: false,
    desc: 'Forensia digital. No es open source, pero es muy demandada en seguridad ofensiva/defensiva.',
    url: 'https://www.eccouncil.org/',
  },
];

export default function SecurityCertsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-[#1E90FF]" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Certificaciones de Seguridad Open Source
        </h1>
      </div>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Complementa tu perfil de automatización con credenciales de seguridad
        basadas en estándares abiertos. Las marcadas como “Open” son de
        ecosistemas open source.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {certs.map((c) => (
          <div
            key={c.name}
            className="flex flex-col rounded-2xl p-5 backdrop-blur-xl bg-white/70 border border-gray-200/50 dark:bg-white/10 dark:border-white/15"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">
                {c.name}
              </span>
              <span
                className={
                  c.open
                    ? 'rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600 dark:text-green-400'
                    : 'rounded-full bg-gray-500/10 px-2 py-0.5 text-xs text-gray-500'
                }
              >
                {c.open ? 'Open' : 'Propietaria'}
              </span>
            </div>
            <p className="mb-1 text-sm text-[#FF6D5A]">{c.issuer}</p>
            <p className="mb-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
              {c.desc}
            </p>
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[#1E90FF] hover:underline"
            >
              Más información <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl p-6 backdrop-blur-xl bg-white/70 border border-gray-200/50 dark:bg-white/10 dark:border-white/15">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen size={18} className="text-[#FF6D5A]" />
          <span className="font-semibold text-gray-900 dark:text-white">
            ¿Por qué sumar seguridad?
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Los workflows de N8N manejan credenciales y datos sensibles. Conocer
          OWASP, hardening de Linux y supply-chain (OpenSSF) te diferencia al
          desplegar automatizaciones en producción.
        </p>
        <Link
          href="/examen-final"
          className="mt-4 inline-block rounded-xl bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] px-5 py-2.5 text-sm font-medium text-white"
        >
          Rendir mi certificación del curso
        </Link>
      </div>
    </div>
  );
}
