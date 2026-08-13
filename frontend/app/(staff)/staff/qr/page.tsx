"use client";

import React, { useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/lib/auth-provider";
import { fetchWithAuth, fetchWithCsrf } from "@/lib/api";

interface QrResponse {
  url: string;
  puntos: number;
  ref: string;
  folio?: string;
  fecha_expiracion?: string;
  foto_url?: string | null;
}

interface ValidateResponse {
  valido: boolean;
  puntos_a_generar?: number;
  hash_preview?: string;
  referencia_preview?: string;
  errores?: string[];
}

interface HistorialItem {
  id: number;
  ref: string;
  folio_ticket: string | null;
  total: number;
  puntos: number;
  canjeado_at: string | null;
  fecha_expiracion: string | null;
  estado_legible: string;
  created_at: string;
}

const MONTOS_RAPIDOS = [95, 150, 200, 300, 400, 500, 750, 1000];

const formatMXN = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);

export default function StaffQrPage() {
  const { session } = useAuth();

  const [folio, setFolio] = useState("");
  const [total, setTotal] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [iva, setIva] = useState("");
  const [fechaEmision, setFechaEmision] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [validacion, setValidacion] = useState<ValidateResponse | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [qr, setQr] = useState<QrResponse | null>(null);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loadingHist, setLoadingHist] = useState(false);

  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalNum = useMemo(() => parseFloat(total) || 0, [total]);
  const subtotalNum = useMemo(() => parseFloat(subtotal) || 0, [subtotal]);
  const ivaNum = useMemo(() => parseFloat(iva) || 0, [iva]);
  const puntosPreview = useMemo(() => Math.floor(totalNum / 10), [totalNum]);

  const autocompletarIVA = () => {
    if (subtotalNum > 0) {
      setIva((subtotalNum * 0.16).toFixed(2));
    }
  };

  const autocompletarSubtotal = () => {
    if (totalNum > 0 && ivaNum > 0) {
      setSubtotal((totalNum - ivaNum).toFixed(2));
    } else if (totalNum > 0) {
      const sub = totalNum / 1.16;
      setSubtotal(sub.toFixed(2));
      setIva((totalNum - sub).toFixed(2));
    }
  };

  const handleMontoRapido = (monto: number) => {
    setTotal(monto.toString());
    const sub = monto / 1.16;
    setSubtotal(sub.toFixed(2));
    setIva((monto - sub).toFixed(2));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const cargarHistorial = async () => {
    if (!session?.token) return;
    setLoadingHist(true);
    try {
      const data = await fetchWithAuth<HistorialItem[]>("/staff/tickets", session.token);
      setHistorial(data || []);
    } catch {
      // silencioso
    } finally {
      setLoadingHist(false);
    }
  };

  React.useEffect(() => {
    cargarHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  const handleValidar = async () => {
    setError(null);
    setValidacion(null);

    if (!session?.token) {
      setError("Sesión no válida");
      return;
    }
    if (!folio || !total || !subtotal || !iva) {
      setError("Completa folio, total, subtotal e IVA");
      return;
    }

    setValidating(true);
    try {
      const res = await fetchWithAuth<ValidateResponse>(
        "/staff/tickets/validate",
        session.token,
        {
          method: "POST",
          body: JSON.stringify({
            folio,
            total: totalNum,
            subtotal: subtotalNum,
            iva: ivaNum,
            fecha_emision: fechaEmision,
          }),
        }
      );
      setValidacion(res);
      if (res.valido) {
        setShowConfirm(true);
      }
    } catch (e: any) {
      const data = e?.data || {};
      setValidacion({ valido: false, errores: data.errores || [e?.message || "Error al validar"] });
    } finally {
      setValidating(false);
    }
  };

  const handleConfirmarGenerar = async () => {
    if (!session?.token) return;
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("folio", folio);
      formData.append("total", totalNum.toString());
      formData.append("subtotal", subtotalNum.toString());
      formData.append("iva", ivaNum.toString());
      formData.append("fecha_emision", fechaEmision);
      if (foto) formData.append("foto", foto);

      const res = await fetchWithCsrf(`${process.env.NEXT_PUBLIC_API_URL}/staff/tickets/generate`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || `Error ${res.status}`);
      }

      const data: QrResponse = await res.json();
      setQr(data);
      setShowConfirm(false);
      cargarHistorial();
    } catch (e: any) {
      setError(e?.message || "Error al generar el QR");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setQr(null);
    setValidacion(null);
    setShowConfirm(false);
    setFolio("");
    setTotal("");
    setSubtotal("");
    setIva("");
    setFoto(null);
    setFotoPreview(null);
    setError(null);
  };

  if (qr) {
    return (
      <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
        <header className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">QR Generado</h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">El cliente debe escanear para acumular puntos</p>
        </header>

        <section className="max-w-md bg-pop-cardGreen p-8 rounded-2xl border border-pop-gold/20 space-y-6 text-center">
          <div className="bg-pop-black p-6 rounded-2xl inline-block mx-auto">
            <QRCodeSVG value={qr.url} size={256} bgColor="#1C3028" fgColor="#F2C166" level="M" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">El cliente ganará</p>
            <p className="text-5xl font-black text-pop-gold font-epilogue">{qr.puntos} pts</p>
            <p className="text-xs text-gray-600 mt-2 font-mono">
              {qr.folio ? `Folio #${qr.folio} · ` : ""}{qr.ref}
            </p>
            {qr.fecha_expiracion && (
              <p className="text-[10px] text-gray-500 mt-1">
                Expira: {new Date(qr.fecha_expiracion).toLocaleString("es-MX")}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-400">Pide al cliente escanear este código con su celular.</p>
          <button
            onClick={handleReset}
            className="w-full py-4 bg-white/5 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/10"
          >
            Generar Nuevo QR
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-24 lg:pt-20 p-6 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">QR de Puntos</h1>
        <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Captura los datos del ticket físico</p>
      </header>

      <section className="max-w-2xl bg-pop-cardGreen p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Folio del ticket (5-6 dígitos)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{5,6}"
              maxLength={6}
              value={folio}
              onChange={(e) => setFolio(e.target.value.replace(/\D/g, ""))}
              placeholder="48563"
              className="w-full bg-pop-black border border-white/10 rounded-xl px-4 py-3 text-xl font-black text-white focus:outline-none focus:border-pop-gold transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fecha y hora del ticket</label>
            <input
              type="datetime-local"
              value={fechaEmision}
              onChange={(e) => setFechaEmision(e.target.value)}
              className="w-full bg-pop-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Monto rápido (opcional)</label>
          <div className="grid grid-cols-4 gap-2">
            {MONTOS_RAPIDOS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleMontoRapido(m)}
                className={`p-2 rounded-lg text-sm font-bold transition-all ${
                  Math.round(totalNum) === m
                    ? "bg-pop-gold text-pop-black"
                    : "bg-pop-black text-pop-gold border border-pop-gold/30 hover:border-pop-gold"
                }`}
              >
                ${m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Subtotal</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pop-gold font-black">$</span>
              <input
                type="number"
                step="0.01"
                value={subtotal}
                onChange={(e) => setSubtotal(e.target.value)}
                onBlur={autocompletarSubtotal}
                placeholder="0.00"
                className="w-full bg-pop-black border border-white/10 rounded-xl pl-7 pr-3 py-3 text-lg font-bold text-white focus:outline-none focus:border-pop-gold transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">IVA (16%)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pop-gold font-black">$</span>
              <input
                type="number"
                step="0.01"
                value={iva}
                onChange={(e) => setIva(e.target.value)}
                onBlur={autocompletarIVA}
                placeholder="0.00"
                className="w-full bg-pop-black border border-white/10 rounded-xl pl-7 pr-3 py-3 text-lg font-bold text-white focus:outline-none focus:border-pop-gold transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pop-gold font-black">$</span>
              <input
                type="number"
                step="0.01"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="0.00"
                className="w-full bg-pop-black border border-white/10 rounded-xl pl-7 pr-3 py-3 text-lg font-bold text-white focus:outline-none focus:border-pop-gold transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Foto del ticket (evidencia)
          </label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-pop-black border border-pop-gold/30 text-pop-gold text-xs font-bold uppercase tracking-widest rounded-lg hover:border-pop-gold transition-all"
            >
              {foto ? "Cambiar foto" : "Tomar foto"}
            </button>
            {fotoPreview && (
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoPreview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            {foto && <span className="text-xs text-gray-400">{foto.name}</span>}
          </div>
        </div>

        {totalNum > 0 && (
          <div className="p-4 bg-pop-black/50 rounded-xl border border-pop-gold/20">
            <p className="text-xs text-gray-400">
              El cliente ganará <span className="text-pop-gold font-black text-lg">{puntosPreview} puntos</span>
              {puntosPreview > 0 && (
                <span className="text-gray-500 text-xs ml-2">(1 punto por cada $10 MXN)</span>
              )}
            </p>
          </div>
        )}

        {validacion && !validacion.valido && validacion.errores && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Validación fallida</p>
            <ul className="text-xs text-red-300 space-y-1">
              {validacion.errores.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}

        <button
          onClick={handleValidar}
          disabled={validating || !folio || !total || !subtotal || !iva}
          className="w-full py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-pop-lightGold transition-all disabled:opacity-50"
        >
          {validating ? "Validando ticket..." : "Validar y Continuar"}
        </button>
      </section>

      {showConfirm && validacion?.valido && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-pop-cardGreen border-2 border-pop-gold rounded-2xl p-8 max-w-md w-full space-y-6">
            <h2 className="text-2xl font-black text-pop-gold text-center uppercase tracking-wider">Confirma el QR</h2>

            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">Monto total</p>
              <p className="text-5xl font-black text-white text-center font-epilogue">{formatMXN(totalNum)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-pop-black/50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Folio</p>
                <p className="text-white font-mono font-bold">#{folio}</p>
              </div>
              <div className="p-3 bg-pop-black/50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Puntos</p>
                <p className="text-pop-gold font-black">{puntosPreview} pts</p>
              </div>
              <div className="p-3 bg-pop-black/50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Subtotal</p>
                <p className="text-white font-mono">{formatMXN(subtotalNum)}</p>
              </div>
              <div className="p-3 bg-pop-black/50 rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">IVA</p>
                <p className="text-white font-mono">{formatMXN(ivaNum)}</p>
              </div>
            </div>

            {fotoPreview && (
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fotoPreview} alt="ticket" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
                className="flex-1 py-3 bg-gray-700 text-white font-black uppercase text-xs tracking-widest rounded-xl disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarGenerar}
                disabled={submitting}
                className="flex-1 py-3 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-widest rounded-xl disabled:opacity-50"
              >
                {submitting ? "Generando..." : "Generar QR"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-2xl mt-10">
        <h3 className="text-lg font-black text-pop-gold mb-4 uppercase tracking-wider">QRs Recientes</h3>
        {loadingHist ? (
          <p className="text-gray-500 text-sm">Cargando...</p>
        ) : historial.length === 0 ? (
          <p className="text-gray-500 text-sm">Aún no has generado QRs.</p>
        ) : (
          <div className="space-y-2">
            {historial.slice(0, 10).map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-3 rounded-lg bg-pop-cardGreen border border-white/5"
              >
                <div>
                  <p className="text-white font-bold">{formatMXN(h.total)}</p>
                  <p className="text-gray-400 text-xs">
                    {h.folio_ticket ? `Folio #${h.folio_ticket} · ` : ""}
                    {new Date(h.created_at).toLocaleString("es-MX")}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                    h.estado_legible === "canjeado"
                      ? "bg-green-900/40 text-green-300 border border-green-700/40"
                      : h.estado_legible === "expirado"
                      ? "bg-red-900/40 text-red-300 border border-red-700/40"
                      : "bg-yellow-900/40 text-yellow-300 border border-yellow-700/40"
                  }`}
                >
                  {h.estado_legible}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
