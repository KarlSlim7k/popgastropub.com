'use client';

import { useState } from 'react';

/* ─── Tipos ──────────────────────────────────────────────────────────────── */
type Step = 'idle' | 'uploading' | 'form' | 'processing' | 'done' | 'error';

type InvoiceStatus = 'timbrado' | 'procesando' | 'error';

interface HistoryItem {
  folio: string;
  fecha: string;
  monto: string;
  status: InvoiceStatus;
}

/* ─── Datos dummy de historial ───────────────────────────────────────────── */
const historyItems: HistoryItem[] = [
  { folio: 'T-2024-0312', fecha: '12 Mar 2024', monto: '$342.00', status: 'timbrado' },
  { folio: 'T-2024-0289', fecha: '28 Feb 2024', monto: '$218.50', status: 'timbrado' },
  { folio: 'T-2024-0201', fecha: '01 Feb 2024', monto: '$580.00', status: 'error' },
];

const faqs = [
  {
    q: '¿Cuánto tiempo tengo para solicitar mi factura?',
    a: 'Tienes hasta el último día del mes en que realizaste tu compra para solicitar tu CFDI.',
  },
  {
    q: '¿Qué datos necesito para facturar?',
    a: 'RFC, Razón Social exacta (tal como aparece en el SAT), Régimen Fiscal, Uso de CFDI y Código Postal fiscal.',
  },
  {
    q: '¿En qué formato recibo mi factura?',
    a: 'Recibirás el XML timbrado y el PDF representación impresa a tu correo electrónico.',
  },
  {
    q: '¿Qué hago si hay un error en mi CFDI?',
    a: 'Contáctanos a facturacion@pop-perote.com con tu número de folio; revisamos y cancelamos en caso de error.',
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

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config = {
    timbrado: { label: 'Timbrado', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    procesando: { label: 'Procesando', cls: 'bg-[#F2C777]/20 text-[#F2C777] border-[#F2C777]/30' },
    error: { label: 'Error', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${config.cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

/* ─── Componente principal ───────────────────────────────────────────────── */
export default function FacturacionPage() {
  const [step, setStep] = useState<Step>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'nueva' | 'historial'>('nueva');

  /* Simula upload y luego pasa al formulario */
  function handleFile(file: File) {
    setFileName(file.name);
    setStep('uploading');
    setTimeout(() => setStep('form'), 1800);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => setStep('done'), 3000);
  }

  function reset() {
    setStep('idle');
    setFileName(null);
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-32">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 px-6 md:px-16">
        {/* Glow de fondo */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#D96725]/10 blur-[120px] rounded-full" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#F2C777]/60 mb-4">
            POP PEROTE · Facturación Electrónica
          </p>
          <h1 className="font-epilogue text-5xl md:text-7xl font-black tracking-tighter text-white leading-none mb-6">
            FACTURA{' '}
            <span className="text-[#F2C777]">CFDI 4.0</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto font-manrope leading-relaxed">
            Gestiona tus comprobantes fiscales de forma ágil y elegante. Un proceso diseñado para la precisión gastronómica.
          </p>
        </div>

        {/* Pasos */}
        <div className="relative z-10 max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-4 md:gap-8">
          {[
            { icon: 'cloud_upload', num: '01', title: 'Sube ticket', desc: 'Digitaliza tu comprobante de consumo físico.' },
            { icon: 'edit_document', num: '02', title: 'Llena datos', desc: 'Ingresa tu RFC y detalles fiscales vigentes.' },
            { icon: 'receipt_long', num: '03', title: 'Recibe CFDI', desc: 'Descarga tu XML y PDF instantáneamente.' },
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

      {/* ── Tabs ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex border-b border-[#F2C777]/10 mb-10">
          {(['nueva', 'historial'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-epilogue font-black uppercase tracking-widest text-sm transition-colors ${
                activeTab === tab
                  ? 'text-[#F2C777] border-b-2 border-[#F2C777]'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab === 'nueva' ? '📄 Nueva Factura' : '📋 Mis Facturas'}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════
            TAB: NUEVA FACTURA
        ═══════════════════════════════════════ */}
        {activeTab === 'nueva' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* ── Columna izquierda: Upload + Formulario ── */}
            <div className="lg:col-span-3 space-y-6">

              {/* PASO 1: Upload */}
              {step === 'idle' && (
                <div className="bg-[#181413] p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-[#F2C777] text-2xl">cloud_upload</span>
                    <h2 className="font-epilogue font-black text-white text-xl uppercase tracking-tight">
                      Digitalización del Ticket
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

              {/* PASO 2: Formulario CFDI */}
              {(step === 'form' || step === 'processing' || step === 'done') && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Ticket adjunto */}
                  <div className="bg-[#181413] px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-400">task_alt</span>
                      <div>
                        <p className="text-white text-sm font-bold">{fileName}</p>
                        <p className="text-white/40 text-xs">Ticket validado correctamente</p>
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
                        Información Fiscal (CFDI 4.0)
                      </h2>
                    </div>

                    {/* Datos del emisor (readonly) */}
                    <div className="mb-8 p-4 bg-[#0D0D0D]/60 border border-[#F2C777]/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#F2C777]/60 mb-3">Datos del Emisor</p>
                      <p className="text-white font-bold text-sm">POP Perote Gastronomic Editorial S.A. de C.V.</p>
                      <p className="text-white/50 text-xs mt-1">RFC: PPG200115XY3 · Perote, Veracruz · Régimen 601</p>
                    </div>

                    {/* Campos del receptor */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#F2C777]/70 mb-2">
                          RFC del Receptor *
                        </label>
                        <input
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
                            Código Postal Fiscal *
                          </label>
                          <input
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
                            required
                            type="email"
                            placeholder="tu@correo.com"
                            className="w-full bg-transparent border-b border-[#F2C777]/20 py-3 text-white placeholder:text-white/25 focus:border-[#F2C777] focus:outline-none transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Aviso legal */}
                    <p className="text-white/25 text-[10px] leading-relaxed mt-8 border-t border-[#F2C777]/10 pt-6">
                      Al enviar esta solicitud confirmas que los datos fiscales ingresados son correctos y corresponden a tu RFC registrado en el SAT conforme a CFDI 4.0.
                    </p>

                    {/* Botón submit */}
                    {step === 'form' && (
                      <button
                        type="submit"
                        className="w-full mt-6 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest py-4 flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
                      >
                        <span className="material-symbols-outlined">send</span>
                        Solicitar Factura
                      </button>
                    )}

                    {/* Estado: procesando */}
                    {step === 'processing' && (
                      <div className="mt-6 flex items-center justify-center gap-4 py-4 border border-[#F2C777]/20">
                        <div className="w-5 h-5 border-2 border-t-[#F2C777] border-[#F2C777]/20 rounded-full animate-spin" />
                        <span className="text-[#F2C777] font-black uppercase text-sm tracking-widest">Timbrado en proceso...</span>
                      </div>
                    )}
                  </div>

                  {/* ── Estado del timbrado ── */}
                  {(step === 'processing' || step === 'done') && (
                    <div className="bg-[#181413] p-6 md:p-8">
                      <h3 className="font-epilogue font-black text-white uppercase tracking-tight text-lg mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#F2C777]">verified</span>
                        Estado de Solicitud
                      </h3>
                      <div className="space-y-0">
                        {[
                          { label: 'Ticket Validado', desc: 'Sistema verificó folio y monto', done: true },
                          { label: 'Validación SAT', desc: 'Datos fiscales autorizados', done: true },
                          { label: 'Timbrado CFDI', desc: step === 'done' ? 'CFDI generado correctamente' : 'Generando sellos digitales...', done: step === 'done' },
                          { label: 'Envío por email', desc: step === 'done' ? 'XML y PDF enviados a tu correo' : 'Esperando timbrado...', done: step === 'done' },
                        ].map((s, i) => (
                          <div key={i} className="flex gap-4 pb-6 relative">
                            {/* Línea vertical */}
                            {i < 3 && <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[#F2C777]/10" />}
                            {/* Indicador */}
                            <div className={`relative z-10 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                              s.done
                                ? 'bg-emerald-500/20 border border-emerald-500/60'
                                : i === 2 && step === 'processing'
                                  ? 'bg-[#F2C777]/20 border border-[#F2C777]/60'
                                  : 'bg-white/5 border border-white/15'
                            }`}>
                              {s.done ? (
                                <span className="material-symbols-outlined text-emerald-400 text-[14px]">check</span>
                              ) : i === 2 && step === 'processing' ? (
                                <div className="w-2 h-2 rounded-full bg-[#F2C777] animate-pulse" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                              )}
                            </div>
                            <div>
                              <p className={`font-bold text-sm ${s.done ? 'text-white' : 'text-white/40'}`}>{s.label}</p>
                              <p className="text-white/40 text-xs mt-0.5">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Descarga cuando está listo */}
                      {step === 'done' && (
                        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-emerald-400 font-black text-sm uppercase tracking-wider">✓ CFDI Timbrado Exitosamente</p>
                            <p className="text-white/50 text-xs mt-1">Folio: T-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 9000) + 1000)}</p>
                          </div>
                          <div className="flex gap-3">
                            <button type="button" className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-black text-xs px-4 py-2 transition-colors">
                              <span className="material-symbols-outlined text-sm">download</span> XML
                            </button>
                            <button type="button" className="flex items-center gap-2 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black text-xs px-4 py-2 transition-colors">
                              <span className="material-symbols-outlined text-sm">picture_as_pdf</span> PDF
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* ── Columna derecha: info ── */}
            <aside className="lg:col-span-2 space-y-6">
              {/* Info del emisor */}
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
                    <p className="text-white/60 text-xs">SLA Máximo: 24 horas hábiles</p>
                  </div>
                </div>
              </div>

              {/* Notas CFDI 4.0 */}
              <div className="bg-[#1C1B1B] border border-[#F2C777]/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#D96725] text-xl">info</span>
                  <p className="font-black text-white text-sm uppercase tracking-tight">Requisitos CFDI 4.0</p>
                </div>
                <ul className="space-y-2 text-xs text-white/50 leading-relaxed">
                  <li className="flex gap-2"><span className="text-[#F2C777] flex-shrink-0">→</span> RFC y Razón Social deben coincidir <strong className="text-white/70">exactamente</strong> con el SAT.</li>
                  <li className="flex gap-2"><span className="text-[#F2C777] flex-shrink-0">→</span> Solo se expiden facturas en el <strong className="text-white/70">mes en curso</strong>.</li>
                  <li className="flex gap-2"><span className="text-[#F2C777] flex-shrink-0">→</span> El ticket debe ser <strong className="text-white/70">legible</strong> y mostrar el folio y monto.</li>
                  <li className="flex gap-2"><span className="text-[#F2C777] flex-shrink-0">→</span> Las cancelaciones requieren autorización manual.</li>
                </ul>
              </div>

              {/* FAQ rápido */}
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
        )}

        {/* ═══════════════════════════════════════
            TAB: MIS FACTURAS
        ═══════════════════════════════════════ */}
        {activeTab === 'historial' && (
          <div className="max-w-3xl">
            <div className="bg-[#181413] divide-y divide-[#F2C777]/8">
              {/* Cabecera tabla */}
              <div className="grid grid-cols-4 gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/30">
                <span>Folio</span>
                <span>Fecha</span>
                <span>Monto</span>
                <span className="text-right">Estado</span>
              </div>
              {/* Filas */}
              {historyItems.map((item) => (
                <div key={item.folio} className="grid grid-cols-4 gap-4 items-center px-6 py-5 hover:bg-white/[0.02] transition-colors group">
                  <div>
                    <p className="text-white font-bold text-sm font-mono">{item.folio}</p>
                  </div>
                  <p className="text-white/50 text-sm">{item.fecha}</p>
                  <p className="text-[#F2C777] font-black font-mono text-sm">{item.monto}</p>
                  <div className="flex items-center justify-end gap-3">
                    <StatusBadge status={item.status} />
                    {item.status === 'timbrado' && (
                      <button type="button" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white/40 hover:text-[#F2C777] text-base">download</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {/* Empty state */}
              {historyItems.length === 0 && (
                <div className="text-center py-16 text-white/30">
                  <span className="material-symbols-outlined text-5xl mb-3 block">receipt_long</span>
                  <p className="font-bold">No tienes facturas registradas</p>
                  <p className="text-xs mt-1">Tus CFDI aparecerán aquí una vez procesados</p>
                </div>
              )}
            </div>
            <p className="text-white/20 text-xs mt-4 px-1">
              * Las facturas se conservan en historial por 90 días · Para soporte: facturacion@pop-perote.com
            </p>
          </div>
        )}
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
