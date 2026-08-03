import { api } from './api';
import type { Material } from '@/types';

const toMaterial = (m: Record<string, unknown>): Material => ({
  id: String(m.id),
  title: m.title as string,
  description: (m.description as string) || '',
  image: (m.image as string) || '',
  pdfUrl: (m.pdfUrl as string) || '',
  createdAt: m.createdAt as string,
  updatedAt: m.updatedAt as string | undefined,
});

export const getMaterials = async (): Promise<Material[]> => {
  try {
    const data = await api<Record<string, unknown>[]>('/api/materials');
    return data.map(toMaterial);
  } catch {
    return [];
  }
};

export const getMaterial = async (id: string): Promise<Material | null> => {
  try {
    const data = await api<Record<string, unknown>>(`/api/materials/${id}`);
    return toMaterial(data);
  } catch {
    return null;
  }
};

export const createMaterial = async (
  material: Omit<Material, 'id' | 'createdAt'>
): Promise<string> => {
  const res = await api<{ id: string }>('/api/materials', {
    method: 'POST',
    body: JSON.stringify({
      title: material.title,
      description: material.description,
      image: material.image || null,
      pdfUrl: material.pdfUrl || null,
    }),
  });
  return res.id;
};

export const updateMaterial = async (
  id: string,
  updates: Partial<Material>
): Promise<void> => {
  await api(`/api/materials/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: updates.title,
      description: updates.description,
      image: updates.image ?? null,
      pdfUrl: updates.pdfUrl ?? null,
    }),
  });
};

export const deleteMaterial = async (id: string): Promise<void> => {
  await api(`/api/materials/${id}`, { method: 'DELETE' });
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
}

function compressImageFile(file: File): Promise<string> {
  const MAX_WIDTH = 1400;
  const QUALITY = 0.72;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('No se pudo procesar la imagen'));
      img.onload = () => {
        const scale = Math.min(1, MAX_WIDTH / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo procesar la imagen'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const uploadMaterialFile = async (
  file: File,
  _materialId: string,
  type: 'image' | 'pdf'
): Promise<string> => {
  if (type === 'image') {
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen.');
    }
    if (file.size > 8 * 1024 * 1024) {
      throw new Error('La imagen no puede superar 8 MB.');
    }
    return compressImageFile(file);
  }

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('El archivo debe ser un PDF.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('El PDF no puede superar 10 MB.');
  }
  return fileToDataUrl(file);
};
