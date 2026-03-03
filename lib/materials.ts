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
  const data = await api<Record<string, unknown>[]>('/api/materials');
  return data.map(toMaterial);
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
    body: JSON.stringify(material),
  });
  return res.id;
};

export const updateMaterial = async (
  id: string,
  updates: Partial<Material>
): Promise<void> => {
  await api(`/api/materials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteMaterial = async (id: string): Promise<void> => {
  await api(`/api/materials/${id}`, { method: 'DELETE' });
};

export const uploadMaterialFile = async (
  file: File,
  _materialId: string,
  type: 'image' | 'pdf'
): Promise<string> => {
  if (type === 'image') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer la imagen'));
      reader.readAsDataURL(file);
    });
  }
  return '#';
};
