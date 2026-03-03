'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMaterial, createMaterial, updateMaterial, uploadMaterialFile } from '@/lib/materials';
import { Material } from '@/types';
import toast from 'react-hot-toast';

interface MaterialFormProps {
  materialId?: string;
}

export const MaterialForm = ({ materialId }: MaterialFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    pdfUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (materialId) {
      loadMaterial();
    }
  }, [materialId]);

  const loadMaterial = async () => {
    try {
      const material = await getMaterial(materialId!); // FIREBASE ACTIVADO
      // const material = getMockMaterial(materialId!); // MODO MOCK DESACTIVADO
      if (material) {
        setFormData({
          title: material.title,
          description: material.description,
          image: material.image || '',
          pdfUrl: material.pdfUrl || '',
        });
        setImagePreview(material.image || '');
      }
    } catch (error: any) {
      toast.error('Error al cargar el material');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image = formData.image;
      let pdfUrl = formData.pdfUrl;

      const materialIdForUpload = materialId || Date.now().toString();

      // Subir imagen si hay una nueva
      if (imageFile) {
        image = await uploadMaterialFile(imageFile, materialIdForUpload, 'image');
      }

      // Subir PDF si hay uno nuevo
      if (pdfFile) {
        pdfUrl = await uploadMaterialFile(pdfFile, materialIdForUpload, 'pdf');
      }

      const materialData = {
        ...formData,
        image,
        pdfUrl,
      };

      if (materialId) {
        await updateMaterial(materialId, materialData); // FIREBASE ACTIVADO
        // updateMockMaterial(materialId, materialData); // MODO MOCK DESACTIVADO
        toast.success('Material actualizado exitosamente');
      } else {
        await createMaterial(materialData); // FIREBASE ACTIVADO
        // createMockMaterial(materialData); // MODO MOCK DESACTIVADO
        toast.success('Material creado exitosamente');
      }

      router.push('/admin/materiales');
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <button
        type="button"
        onClick={() => router.push('/admin/materiales')}
        className="flex items-center gap-2 text-navy hover:text-navy-dark mb-6 transition-colors"
      >
        ← Volver atrás
      </button>
      <h1 className="text-4xl font-bold mb-8 text-navy">
        {materialId ? 'Editar Material' : 'Nuevo Material'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Preview" className="max-w-md h-auto rounded-lg" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivo PDF *
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handlePdfChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required={!materialId || !formData.pdfUrl}
          />
          {formData.pdfUrl && !pdfFile && (
            <p className="mt-2 text-sm text-gray-text">
              PDF actual: <a href={formData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver PDF</a>
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : materialId ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/materiales')}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
