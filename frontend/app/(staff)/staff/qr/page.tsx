"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth } from "@/lib/api";

interface QrResponse {
  url: string;
  puntos: number;
  ref: string;
}

export default function StaffQrPage() {
  const { session } = useAuth();
  const [total, setTotal] = useState("");
  const [qr, setQr] = useState<QrResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const monto = parseInt(total, 10);
    if (!session?.token || !monto || monto < 1) {
      setError("Ingresa un monto válido");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetchWithAuth<QrResponse>("/staff/tickets/generate", session.token, {
        method: "POST",
        body: JSON.stringify({ total: monto }),
      });
      setQr(res);
    } catch (e: any) {
      setError(e?.message || "Error al generar el QR");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setQr(null);
    setTotal("");
    setError(null);
  };

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">QR de Puntos</h1>
        <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Genera el QR para que el cliente acumule puntos POP</p>
      </header>

      {!qr ? (
        <section className="max-w-md bg-pop-cardGreen p-8 rounded-2xl border border-white/5 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Monto total de la cuenta (MXN)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pop-gold font-black text-2xl">$</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="0"
                className="w-full bg-pop-black border border-white/10 rounded-xl pl-10 pr-4 py-4 text-2xl font-black text-white focus:outline-none focus:border-pop-gold transition-all"
              />
            </div>
          </div>

          {total && parseInt(total, 10) > 0 && (
            <p className="text-sm text-gray-400">
              El cliente ganará <span className="text-pop-gold font-black">{Math.floor(parseInt(total, 10) / 10)} puntos</span>
            </p>
          )}

          {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={submitting}
            className="w-full py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-pop-lightGold transition-all disabled:opacity-50"
          >
            {submitting ? "Generando..." : "Generar QR"}
          </button>
        </section>
      ) : (
        <section className="max-w-md bg-pop-cardGreen p-8 rounded-2xl border border-pop-gold/20 space-y-6 text-center">
          <div className="bg-pop-black p-6 rounded-2xl inline-block mx-auto">
            <QRCodeSVG value={qr.url} size={256} bgColor="#1C3028" fgColor="#F2C166" level="M" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">El cliente ganará</p>
            <p className="text-5xl font-black text-pop-gold font-epilogue">{qr.puntos} pts</p>
            <p className="text-xs text-gray-600 mt-2 font-mono">{qr.ref}</p>
          </div>
          <p className="text-sm text-gray-400">Pide al cliente escanear este código con su celular.</p>
          <button
            onClick={handleReset}
            className="w-full py-4 bg-white/5 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/10"
          >
            Generar Nuevo QR
          </button>
        </section>
      )}
    </main>
  );
}
