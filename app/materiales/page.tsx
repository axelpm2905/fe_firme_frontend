import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MaterialesContent } from '@/components/pages/MaterialesContent';
import { getMaterials } from '@/lib/materials';

export default async function MaterialesPage() {
  const materials = await getMaterials();

  return (
    <>
      <Header />
      <MaterialesContent materials={materials} />
      <Footer />
    </>
  );
}
