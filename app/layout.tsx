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
            position="top-center"
            containerStyle={{ top: 80 }}
            toastOptions={{
              duration: 4000,
              style: { maxWidth: '90vw' },
            }}
          />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
