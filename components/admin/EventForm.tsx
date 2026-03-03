'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEvent, createEvent, updateEvent } from '@/lib/events';
// import { getMockEvent, createMockEvent, updateMockEvent } from '@/lib/mock/data'; // MODO MOCK DESACTIVADO
import { Event } from '@/types';
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
  });

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const event = await getEvent(eventId!); // FIREBASE ACTIVADO
      // const event = getMockEvent(eventId!); // MODO MOCK DESACTIVADO
      if (event) {
        setFormData({
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location,
          description: event.description,
        });
      }
    } catch (error: any) {
      toast.error('Error al cargar el evento');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (eventId) {
        await updateEvent(eventId, formData); // FIREBASE ACTIVADO
        // updateMockEvent(eventId, formData); // MODO MOCK DESACTIVADO
        toast.success('Evento actualizado exitosamente');
      } else {
        await createEvent(formData); // FIREBASE ACTIVADO
        // createMockEvent(formData); // MODO MOCK DESACTIVADO
        toast.success('Evento creado exitosamente');
      }

      router.push('/admin/eventos');
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el evento');
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
      <h1 className="text-4xl font-bold mb-8 text-navy">
        {eventId ? 'Editar Evento' : 'Nuevo Evento'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : eventId ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/eventos')}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
