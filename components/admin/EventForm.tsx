'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEvent, createEvent, updateEvent, uploadEventImage } from '@/lib/events';
import toast from 'react-hot-toast';

interface EventFormProps {
  eventId?: string;
}

export const EventForm = ({ eventId }: EventFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const event = await getEvent(eventId!);
      if (event) {
        setFormData({
          title: event.title,
          date: event.date.slice(0, 10),
          time: event.time,
          location: event.location,
          description: event.description,
          image: event.image || '',
        });
        setImagePreview(event.image || '');
      }
    } catch {
      toast.error('Error al cargar el evento');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image = formData.image;
      if (imageFile) {
        image = await uploadEventImage(imageFile);
      }

      const payload = { ...formData, image };

      if (eventId) {
        await updateEvent(eventId, payload);
        toast.success('Evento actualizado exitosamente');
      } else {
        await createEvent(payload);
        toast.success('Evento creado exitosamente');
      }

      router.push('/admin/eventos');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar el evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <button
        type="button"
        onClick={() => router.push('/admin/eventos')}
        className="flex items-center gap-2 text-navy hover:text-navy-dark mb-6 transition-colors"
      >
        ← Volver atrás
      </button>
      <h1 className="text-2xl sm:text-4xl font-bold mb-8 text-navy">
        {eventId ? 'Editar Evento' : 'Nuevo Evento'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora *</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del evento</label>
          <p className="text-xs text-gray-500 mb-2">
            Ideal: 1920×1080 (16:9). Se muestra igual en móvil y escritorio.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg"
          />
          {imagePreview && (
            <div className="mt-4 relative aspect-[16/9] w-full max-w-lg overflow-hidden rounded-xl bg-navy/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" />
            </div>
          )}
          {formData.image && !imageFile && (
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, image: '' });
                setImagePreview('');
              }}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Quitar imagen
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="min-h-[48px] bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : eventId ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/eventos')}
            className="min-h-[48px] bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
