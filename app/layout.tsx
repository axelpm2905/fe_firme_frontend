import type { Metadata, Viewport } from 'next';

export const dynamic = 'force-dynamic';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { AuthLoadingOverlay } from '@/components/auth/AuthLoadingOverlay';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fe Firme – Ministerio de Apologética',
  description: 'Ministerio de Apologética Cristiana - Iglesia Oasis de Amor Nicaragua',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#001f3f',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <AuthLoadingOverlay />
            {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                maxWidth: 'min(90vw, 22rem)',
                fontSize: '0.875rem',
                background: '#fff',
                color: '#1f2937',
                border: '1px solid rgba(0,31,63,0.08)',
                boxShadow: '0 8px 24px rgba(0,31,63,0.1)',
              },
            }}
          />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
