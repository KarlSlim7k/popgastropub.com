'use client';

import React, { useState } from 'react';
import { fetchAPI, APIError } from '@/lib/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await fetchAPI('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setErrorMsg(err instanceof APIError ? err.getAllMessages() : 'No se pudo completar la suscripción.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-[#F2C777]">¡Gracias por suscribirte! Pronto recibirás nuestras ofertas.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <label htmlFor="newsletter-email" className="sr-only">Correo electrónico para newsletter</label>
      <input
        id="newsletter-email"
        className="w-full bg-black/20 border-b border-[#F2C777]/40 py-3 px-0 focus:border-[#F2C777] focus:ring-0 transition-colors text-sm"
        placeholder="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
      />
      <button
        aria-label="Suscribirme al newsletter"
        type="submit"
        disabled={status === 'loading'}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#F2C777] hover:scale-110 transition-transform disabled:opacity-50"
      >
        <span className="material-symbols-outlined" aria-hidden="true">east</span>
      </button>
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
      )}
    </form>
  );
}
