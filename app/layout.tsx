import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'N8N Full Stack Course | From Zero to Professional',
  description:
    'Learn N8N from the fundamentals up to enterprise level. Automation, AI agents, custom nodes, API integrations, RAG and professional deployment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
