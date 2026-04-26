'use client';

import React from 'react';

export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert('¡Gracias por suscribirte! Pronto recibirás nuestras ofertas.');
        e.currentTarget.reset();
      }}
      className="relative"
    >
      <input
        className="w-full bg-black/20 border-b border-[#EBC071]/40 py-3 px-0 focus:border-[#EBC071] focus:ring-0 transition-colors text-sm"
        placeholder="E-mail address"
        type="email"
      />
      <button
        type="submit"
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#EBC071] hover:scale-110 transition-transform"
      >
        <span className="material-symbols-outlined">east</span>
      </button>
    </form>
  );
}
