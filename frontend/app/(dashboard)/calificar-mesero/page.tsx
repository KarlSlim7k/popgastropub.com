"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { fetchWithAuth } from '@/lib/api';

interface MeseroOption {
  id: number;
  nombre: string;
  iniciales: string;
}

export default function CalificarMeseroPage() {
  const { session } = useAuth();
  const [meseros, setMeseros] = useState<MeseroOption[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!session?.token) return;
    fetchWithAuth<MeseroOption[]>('/meseros/para-calificar', session.token)
      .then(setMeseros)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !rating || !session?.token) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetchWithAuth<{ message: string }>('/meseros/calificar', session.token, {
        method: 'POST',
        body: JSON.stringify({ mesero_id: selected, rating, comentario: comentario || null }),
      });
      setMessage({ type: 'success', text: res.message });
      setSelected(null);
      setRating(0);
      setComentario('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Error al enviar calificación' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="pt-24 p-6 min-h-screen bg-pop-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pop-gold border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white uppercase italic">
          Califica a tu Mesero
        </h1>
        <p className="text-pop-gold mt-3 text-xs font-black uppercase tracking-[0.3em]">
          Tu opinión ayuda a reconocer el mejor servicio
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-8">
        {/* Mesero selection */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">
            ¿Quién te atendió?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {meseros.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selected === m.id
                    ? 'border-pop-gold bg-pop-gold/10 text-white'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 mx-auto mb-2 flex items-center justify-center text-xs font-bold">
                  {m.iniciales || m.nombre.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-xs font-bold truncate">{m.nombre}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Star rating */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">
            Calificación
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition-transform hover:scale-110 ${
                  star <= rating ? 'text-pop-gold' : 'text-gray-600'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">
            Comentario (opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={255}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm resize-none focus:border-pop-gold focus:outline-none"
            placeholder="¿Cómo fue tu experiencia?"
          />
        </div>

        {message && (
          <p className={`text-sm font-bold ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={!selected || !rating || submitting}
          className="w-full py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-pop-lightGold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Enviando...' : 'Enviar Calificación'}
        </button>
      </form>
    </main>
  );
}
