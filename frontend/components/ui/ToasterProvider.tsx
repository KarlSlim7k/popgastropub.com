'use client';

import { Toaster as SonnerToaster } from 'sonner';

export default function ToasterProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          border: '1px solid rgba(242, 199, 119, 0.2)',
          color: '#F2C777',
        },
        className: 'font-sans text-sm',
      }}
    />
  );
}
