import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gray-light">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-navy mb-4">404</h1>
          <p className="text-xl text-gray-text mb-8">Página no encontrada</p>
          <Link
            href="/"
            className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
