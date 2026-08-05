import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Curso Full Stack N8N | De Cero a Profesional',
  description:
    'Aprende N8N desde los fundamentos hasta nivel enterprise. Automatización, AI agents, custom nodes, integraciones API, RAG y despliegue profesional.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 antialiased dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-white`}
      >
        <Providers attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
