'use client';

import { useState, useEffect } from 'react';
import { getAuthSession } from '@/lib/auth-session';

type Step = 'idle' | 'uploading' | 'form' | 'submitting' | 'done' | 'error';

const faqs = [
  {
    q: '¿Cuánto tiempo tengo para solicitar mi factura?',
    a: 'Tienes hasta el último día del mes en que realizaste tu compra para solicitar tu factura.',
  },
  {
    q: '¿Qué datos necesito?',
    a: 'RFC, Razón Social, Régimen Fiscal, Uso de CFDI, Código Postal y correo electrónico.',
  },
  {
    q: '¿Cuánto tardan en contactarme?',
    a: 'Nuestro equipo de contadores se pondrá en contacto contigo en un máximo de 24 horas hábiles.',
  },
];

const usosCFDI = [
  'G01 — Adquisición de mercancias',
  'G03 — Gastos en general',
  'D10 — Pagos por servicios educativos',
  'S01 — Sin efectos fiscales',
];

const regimenesFiscales = [
  '601 — General de Ley Personas Morales',
  '605 — Sueldos y Salarios e Ingresos Asimilados',
  '616 — Sin obligaciones fiscales',
  '621 — Incorporación Fiscal',
  '625 — Actividades Empresariales con ingresos por comisiones',
  '626 — Régimen Simplificado de Confianza',
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://popgastropub.com/api';

export default function FacturacionPage() {
  const [step, setStep] = useState<Step>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setIsLoggedIn(!!getAuthSession());
  }, []);

  function handleFile(selectedFile: File) {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setStep('uploading');
    setTimeout(() => setStep('form'), 1800);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;

    setStep('submitting');
    setErrorMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('ticket', file);

    const session = getAuthSession();
    const headers = new Headers();
    if (session?.token) {
      headers.append('Authorization', `Bearer ${session.token}`);
    }

    try {
      const res = await fetch(`${API_URL}/api/facturas`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Error al enviar la solicitud');
      }

      setStep('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido');
      setStep('error');
    }
  }

  function reset() {
    setStep('idle');
    setFileName(null);
    setFile(null);
    setErrorMsg(null);
  }

  if (isLoggedIn === null) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-32">
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-t-[#F2C777] border-[#F2C777]/20 rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-32">
        <section className="relative overflow-hidden py-20 px-6 md:px-16">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#D96725]/10 blur-[120px] rounded-full" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#F2C777]/60 mb-4">
              POP PEROTE · Facturación
            </p>
            <h1 className="font-epilogue text-5xl md:text-7xl font-black tracking-tighter text-white leading-none mb-6">
              SOLICITAR <span className="text-[#F2C777]">FACTURA</span>
            </h1>
          </div>
        </section>
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
          <p className="text-white/60 text-lg mb-6">Inicia sesión para solicitar factura</p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest px-8 py-4 transition-all"
          >
            Iniciar Sesión
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-32">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 px-6 md:px-16">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#D96725]/10 blur-[120px] rounded-full" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#F2C777]/60 mb-4">
            POP PEROTE · Facturación
          </p>
          <h1 className="font-epilogue text-5xl md:text-7xl font-black tracking-tighter text-white leading-none mb-6">
            SOLICITAR{' '}
            <span className="text-[#F2C777]">FACTURA</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto font-manrope leading-relaxed">
            Sube tu ticket, proporciona tus datos fiscales y nuestro equipo de contadores se encargará del resto.
          </p>
        </div>

        {/* Pasos */}
        <div className="relative z-10 max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-4 md:gap-8">
          {[
            { icon: 'cloud_upload', num: '01', title: 'Sube ticket', desc: 'Digitaliza tu comprobante de consumo físico.' },
            { icon: 'edit_document', num: '02', title: 'Datos fiscales', desc: 'Ingresa tu RFC y detalles fiscales vigentes.' },
            { icon: 'support_agent', num: '03', title: 'Contadores contactarán', desc: 'Nuestro equipo se pondrá en contacto contigo.' },
          ].map((s, i) => (
            <div key={i} className="text-center group">
              <div className="relative mx-auto mb-4 w-14 h-14 md:w-16 md:h-16 bg-[#1C1B1B] border border-[#F2C777]/15 flex items-center justify-center transition-colors group-hover:border-[#F2C777]/40">
                <span className="material-symbols-outlined text-[#F2C777] text-2xl md:text-3xl">{s.icon}</span>
                <span className="absolute -top-2 -right-2 text-[10px] font-black bg-[#D96725] text-white px-1.5 py-0.5 leading-none">{s.num}</span>
              </div>
              <h3 className="font-epilogue font-black text-white text-sm md:text-base uppercase tracking-tight mb-1">{s.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed hidden md:block">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── Columna izquierda: Upload + Formulario ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* PASO 1: Upload */}
            {step === 'idle' && (
              <div className="bg-[#181413] p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#F2C777] text-2xl">cloud_upload</span>
                  <h2 className="font-epilogue font-black text-white text-xl uppercase tracking-tight">
                    Sube tu Ticket
                  </h2>
                </div>

                <label
                  htmlFor="ticket-upload"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed p-10 md:p-16 cursor-pointer transition-all duration-300 ${
                    dragOver
                      ? 'border-[#F2C777] bg-[#F2C777]/5'
                      : 'border-[#F2C777]/20 hover:border-[#F2C777]/50 hover:bg-[#F2C777]/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#F2C777] text-5xl">receipt</span>
                  <div className="text-center">
                    <p className="text-white font-bold mb-1">Arrastra tu ticket aquí</p>
                    <p className="text-white/40 text-sm">o haz clic para seleccionar</p>
                    <p className="text-white/30 text-xs mt-2">Formatos: JPG, PNG, PDF · Máx 5 MB</p>
                  </div>
                  <span className="bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black text-sm px-6 py-3 transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    Seleccionar archivo
                  </span>
                </label>
                <input
                  id="ticket-upload"
                  name="ticket"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="sr-only"
                  onChange={handleInput}
                />
              </div>
            )}

            {/* ESTADO: Subiendo */}
            {step === 'uploading' && (
              <div className="bg-[#181413] p-8 flex flex-col items-center gap-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-[#F2C777]/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#F2C777] animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-[#F2C777] text-2xl">cloud_upload</span>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold">Analizando ticket...</p>
                  <p className="text-white/40 text-sm mt-1">{fileName}</p>
                </div>
                <div className="w-full bg-[#0D0D0D] h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D96725] to-[#F2C777] animate-[progress_1.8s_ease-in-out_forwards] w-0" />
                </div>
              </div>
            )}

            {/* PASO 2: Formulario */}
            {(step === 'form' || step === 'submitting' || step === 'done' || step === 'error') && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Ticket adjunto */}
                <div className="bg-[#181413] px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-400">task_alt</span>
                    <div>
                      <p className="text-white text-sm font-bold">{fileName}</p>
                      <p className="text-white/40 text-xs">Ticket listo para enviar</p>
                    </div>
                  </div>
                  <button type="button" onClick={reset} className="text-white/30 hover:text-white/60 transition-colors text-xs font-bold underline underline-offset-2">
                    Cambiar
                  </button>
                </div>

                {/* Datos fiscales */}
                <div className="bg-[#181413] p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="material-symbols-outlined text-[#F2C777] text-2xl">description</span>
                    <h2 className="font-epilogue font-black text-white text-xl uppercase tracking-tight">
                      Datos Fiscales
                    </h2>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#F2C777]/70 mb-2">
                        RFC *
                      </label>
                      <input
                        name="rfc"
                        required
                        pattern="[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}"
                        placeholder="XAXX010101000"
                        maxLength={13}
                        className="w-full bg-transparent border-b border-[#F2C777]/20 py-3 text-white placeholder:text-white/25 focus:border-[#F2C777] focus:outline-none transition-colors uppercase font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#F2C777]/70 mb-2">
                        Razón Social / Nombre *
                      </label>
                      <input
                        name="razon_social"
                        required
                        placeholder="Tal como aparece en Constancia SAT"
                        className="w-full bg-transparent border-b border-[#F2C777]/20 py-3 text-white placeholder:text-white/25 focus:border-[#F2C777] focus:outline-none transition-colors text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#F2C777]/70 mb-2">
                          Régimen Fiscal *
                        </label>
                        <select
                          name="regimen_fiscal"
                          required
                          className="w-full bg-[#181413] border-b border-[#F2C777]/20 py-3 text-white/80 focus:border-[#F2C777] focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
                        >
                          <option value="">Selecciona...</option>
                          {regimenesFiscales.map((r, i) => (
                            <option key={i} value={r.substring(0, 3)}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#F2C777]/70 mb-2">
                          Uso de CFDI *
                        </label>
                        <select
                          name="uso_cfdi"
                          required
                          className="w-full bg-[#181413] border-b border-[#F2C777]/20 py-3 text-white/80 focus:border-[#F2C777] focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
                        >
                          <option value="">Selecciona...</option>
                          {usosCFDI.map((u, i) => (
                            <option key={i} value={u.substring(0, 3)}>{u}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#F2C777]/70 mb-2">
                          Código Postal *
                        </label>
                        <input
                          name="codigo_postal"
                          required
                          maxLength={5}
                          pattern="[0-9]{5}"
                          placeholder="00000"
                          className="w-full bg-transparent border-b border-[#F2C777]/20 py-3 text-white placeholder:text-white/25 focus:border-[#F2C777] focus:outline-none transition-colors font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#F2C777]/70 mb-2">
                          Correo Electrónico *
                        </label>
                        <input
                          name="email"
                          required
                          type="email"
                          placeholder="tu@correo.com"
                          className="w-full bg-transparent border-b border-[#F2C777]/20 py-3 text-white placeholder:text-white/25 focus:border-[#F2C777] focus:outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {step === 'form' && (
                    <button
                      type="submit"
                      className="w-full mt-6 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest py-4 flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
                    >
                      <span className="material-symbols-outlined">send</span>
                      Solicitar Factura
                    </button>
                  )}

                  {step === 'submitting' && (
                    <div className="mt-6 flex items-center justify-center gap-4 py-4 border border-[#F2C777]/20">
                      <div className="w-5 h-5 border-2 border-t-[#F2C777] border-[#F2C777]/20 rounded-full animate-spin" />
                      <span className="text-[#F2C777] font-black uppercase text-sm tracking-widest">Enviando solicitud...</span>
                    </div>
                  )}

                  {step === 'error' && errorMsg && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center">
                      {errorMsg}
                    </div>
                  )}
                </div>

                {/* Estado de solicitud */}
                {step === 'done' && (
                  <div className="bg-[#181413] p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-emerald-400 text-2xl">check_circle</span>
                      <h3 className="font-epilogue font-black text-white uppercase tracking-tight text-lg">
                        Solicitud Enviada
                      </h3>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Solicitud recibida. Nuestro equipo de contadores se pondrá en contacto contigo.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-6 w-full border border-[#F2C777]/30 text-[#F2C777] hover:bg-[#F2C777]/10 font-black uppercase tracking-widest py-3 transition-colors"
                    >
                      Enviar otra solicitud
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* ── Columna derecha: info ── */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="bg-[#181413] p-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F2C777]/60 mb-4">Datos del Establecimiento</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#F2C777] text-base mt-0.5">store</span>
                  <div>
                    <p className="text-white font-bold">POP Perote</p>
                    <p className="text-white/50 text-xs">Gastronomic Editorial S.A. de C.V.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#F2C777] text-base mt-0.5">location_on</span>
                  <p className="text-white/60 text-xs">Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#F2C777] text-base mt-0.5">mail</span>
                  <p className="text-white/60 text-xs">facturacion@pop-perote.com</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#F2C777] text-base mt-0.5">schedule</span>
                  <p className="text-white/60 text-xs">Tiempo de respuesta: 24 horas hábiles</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1C1B1B] border border-[#F2C777]/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[#D96725] text-xl">info</span>
                <p className="font-black text-white text-sm uppercase tracking-tight">Requisitos</p>
              </div>
              <ul className="space-y-2 text-xs text-white/50 leading-relaxed">
                <li className="flex gap-2"><span className="text-[#F2C777] flex-shrink-0">→</span> RFC y Razón Social deben coincidir <strong className="text-white/70">exactamente</strong> con el SAT.</li>
                <li className="flex gap-2"><span className="text-[#F2C777] flex-shrink-0">→</span> Solo se expiden facturas en el <strong className="text-white/70">mes en curso</strong>.</li>
                <li className="flex gap-2"><span className="text-[#F2C777] flex-shrink-0">→</span> El ticket debe ser <strong className="text-white/70">legible</strong> y mostrar el folio y monto.</li>
              </ul>
            </div>

            <div className="bg-[#181413] p-6">
              <p className="font-epilogue font-black text-white uppercase tracking-tight text-base mb-4">
                Preguntas Frecuentes
              </p>
              <div className="space-y-1">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-[#F2C777]/8 last:border-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-3 py-3 text-left text-sm text-white/70 hover:text-white transition-colors"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <span className={`material-symbols-outlined text-[#F2C777] text-base flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {openFaq === i && (
                      <p className="text-white/40 text-xs pb-3 leading-relaxed">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Barra de contacto inferior ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-20">
        <div className="bg-[#732817]/30 border border-[#732817]/50 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm">¿Problemas con tu factura?</p>
            <p className="text-white/50 text-xs mt-1">Nuestro equipo fiscal responde en menos de 24 horas hábiles.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href="mailto:facturacion@pop-perote.com"
              className="flex items-center gap-2 border border-[#F2C777]/30 text-[#F2C777] hover:bg-[#F2C777]/10 font-black text-xs px-4 py-2.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              Email
            </a>
            <a
              href="https://wa.me/522828253243"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black text-xs px-4 py-2.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

    </main>
  );
}
