'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-provider';
import { fetchAPI, fetchWithAuth } from '@/lib/api';

interface ValidateResponse {
  valid: boolean;
  total: number;
  puntos: number;
  ref: string;
}

type Status = 'loading' | 'valid' | 'invalid' | 'success';

function CanjearContent() {
  const params = useSearchParams();
  const { session } = useAuth();

  const total = params.get('total');
  const ref = params.get('ref');
  const ts = params.get('ts');
  const sig = params.get('sig');

  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [info, setInfo] = useState<ValidateResponse | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  const query = `total=${total}&ref=${ref}&ts=${ts}&sig=${sig}`;

  const validate = useCallback(async () => {
    if (!total || !ref || !ts || !sig) {
      setStatus('invalid');
      setErrorMsg('Código QR incompleto o inválido.');
      return;
    }
    setStatus('loading');
    try {
      const res = await fetchAPI<ValidateResponse>(`/tickets/validate?${query}`);
      setInfo(res);
      setStatus('valid');
    } catch (e: any) {
      setStatus('invalid');
      setErrorMsg(e?.message || 'No se pudo validar el QR.');
    }
  }, [total, ref, ts, sig, query]);

  useEffect(() => { validate(); }, [validate]);

  const handleRedeem = async () => {
    if (!session?.token) return;
    setRedeeming(true);
    try {
      const res = await fetchWithAuth<{ puntos: number; balance: number }>('/tickets/redeem', session.token, {
        method: 'POST',
        body: JSON.stringify({ total: Number(total), ref, ts: Number(ts), sig }),
      });
      setBalance(res.balance);
      setStatus('success');
    } catch (e: any) {
      setStatus('invalid');
      setErrorMsg(e?.message || 'No se pudo canjear el ticket.');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md bg-[#1C1B1B] rounded-3xl border border-white/5 p-8 text-center space-y-6">
        {status === 'loading' && (
          <>
            <div className="w-10 h-10 border-2 border-[#F2C777] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Validando QR...</p>
          </>
        )}

        {status === 'invalid' && (
          <>
            <span className="material-symbols-outlined text-red-500 text-6xl">error</span>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">QR no válido</h1>
            <p className="text-gray-400 text-sm">{errorMsg}</p>
            <a href="/" className="inline-block px-8 py-3 bg-white/5 text-white font-black uppercase text-[10px] tracking-widest rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              Volver al inicio
            </a>
          </>
        )}

        {status === 'valid' && info && (
          <>
            <span className="material-symbols-outlined text-[#F2C777] text-6xl">stars</span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">¡Ganaste puntos POP!</h1>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Cuenta</p>
              <p className="text-2xl font-black text-white">${info.total} MXN</p>
            </div>
            <div className="bg-[#0D0D0D] rounded-2xl p-6 border border-[#F2C777]/20">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Puntos a ganar</p>
              <p className="text-5xl font-black text-[#F2C777] font-epilogue leading-none">+{info.puntos}</p>
            </div>

            {session ? (
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="w-full py-4 bg-[#D96725] text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-[#F2C777] hover:text-[#0D0D0D] transition-all disabled:opacity-50"
              >
                {redeeming ? 'Canjeando...' : `Canjear ${info.puntos} puntos`}
              </button>
            ) : (
              <div className="space-y-3">
                <a
                  href={`/login?redirect=/puntos/canjear?${encodeURIComponent(query)}`}
                  className="block w-full py-4 bg-[#D96725] text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-[#F2C777] hover:text-[#0D0D0D] transition-all"
                >
                  Inicia sesión para canjear
                </a>
                <a
                  href={`/login?tab=register&redirect=/puntos/canjear?${encodeURIComponent(query)}`}
                  className="block text-[#F2C777] text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  ¿No tienes cuenta? Regístrate gratis
                </a>
              </div>
            )}
          </>
        )}

        {status === 'success' && (
          <>
            <span className="material-symbols-outlined text-green-500 text-6xl">check_circle</span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">¡Puntos acreditados!</h1>
            {balance !== null && (
              <p className="text-gray-400 text-sm">
                Tu nuevo saldo: <span className="text-[#F2C777] font-black">{balance} pts</span>
              </p>
            )}
            <a href="/puntos" className="inline-block px-8 py-3 bg-[#F2C777] text-[#0D0D0D] font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#F2C894] transition-all">
              Ver mis puntos
            </a>
          </>
        )}
      </div>
    </main>
  );
}

export default function CanjearPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0D0D0D]" />}>
      <CanjearContent />
    </Suspense>
  );
}
