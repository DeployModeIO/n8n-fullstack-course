'use client';

import { useEffect, useState } from 'react';
import { Cookie, Check, X } from 'lucide-react';
import Link from 'next/link';

const CONSENT_COOKIE = 'cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    const consent = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const persist = (value: string) => {
    document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] px-4 pb-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-white/90 p-5 shadow-2xl backdrop-blur-xl dark:bg-gray-900/90">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 text-[#FF6D5A]" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Usamos cookies
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Utilizamos cookies necesarias para el funcionamiento y, con tu
              consentimiento, cookies de analítica para mejorar el curso. Lee
              nuestra{' '}
              <Link href="/cookies" className="text-[#1E90FF] underline">
                Política de Cookies
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="text-[#1E90FF] underline">
                Privacidad
              </Link>
              .
            </p>

            {showPrefs && (
              <div className="mt-3 space-y-2 rounded-xl border border-gray-200/50 p-3 text-sm dark:border-white/10">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-white/80">
                    Necesarias (siempre activas)
                  </span>
                  <span className="text-xs text-gray-400">Obligatorio</span>
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-white/80">
                    Analítica
                  </span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => persist(analytics ? 'all' : 'necessary')}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#FF6D5A] to-[#EA4B71] px-4 py-2 text-sm font-medium text-white"
          >
            <Check size={14} /> Aceptar
          </button>
          <button
            onClick={() => persist('necessary')}
            className="flex items-center gap-1 rounded-xl border border-gray-300/50 px-4 py-2 text-sm text-gray-700 dark:border-white/15 dark:text-white/80"
          >
            <X size={14} /> Rechazar
          </button>
          <button
            onClick={() => setShowPrefs((s) => !s)}
            className="text-sm text-[#1E90FF] underline"
          >
            Configurar
          </button>
        </div>
      </div>
    </div>
  );
}
