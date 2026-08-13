'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getAuthSession } from '@/lib/auth-session';
import { fetchWithAuth } from '@/lib/api';
import { getCloseTime, getDayOfWeekFromDateString, getOpenStatus, getRestaurantDateString, isWithinHours } from '@/lib/business-hours';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
  },
};

type ReservaStatus = 'idle' | 'submitting' | 'success' | 'error' | 'whatsapp_sent';

export default function Ubicacion() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState(2);
  const [notas, setNotas] = useState('');
  const [status, setStatus] = useState<ReservaStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openStatus, setOpenStatus] = useState<{ label: string; isOpen: boolean } | null>(null);

  useEffect(() => {
    setIsLoggedIn(!!getAuthSession());
    const current = getOpenStatus();
    setOpenStatus({ label: current.isOpen ? 'ABIERTO AHORA' : current.label.toUpperCase(), isOpen: current.isOpen });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const selectedDay = getDayOfWeekFromDateString(fecha);
    if (!isWithinHours(hora, selectedDay)) {
      const close = getCloseTime(selectedDay);
      setErrorMsg(close ? `El horario para ese día es de 14:00 a ${close}.` : 'POP Perote permanece cerrado los martes. Elige otra fecha.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setSubmittedEmail(email);
    const session = getAuthSession();

    try {
      if (session?.token) {
        await fetchWithAuth('/reservas', session.token, {
          method: 'POST',
          body: JSON.stringify({ nombre, email, telefono, fecha, hora, personas, notas }),
        });
        setStatus('success');
      } else {
        const { fetchAPI } = await import('@/lib/api');
        await fetchAPI('/reservas/public', {
          method: 'POST',
          body: JSON.stringify({ nombre, email, telefono, fecha, hora, personas, notas }),
        });
        setStatus('whatsapp_sent');
      }
      resetForm();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al crear la reservación.');
      setStatus('error');
    }
  };

  function resetForm() {
    setNombre(''); setEmail(''); setTelefono(''); setFecha(''); setHora(''); setPersonas(2); setNotas('');
  }

  const today = getRestaurantDateString();
  const selectedDay = fecha ? getDayOfWeekFromDateString(fecha) : null;
  const selectedCloseTime = selectedDay === null ? '22:00' : getCloseTime(selectedDay);

  return (
    <main className="bg-[#0D0D0D] pt-28 md:pt-36 overflow-x-clip">
      {/* Hero */}
      <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
        <Image alt="Entrada del restaurante POP Perote" src="/images/entrada_pop_horizontal.webp" fill sizes="100vw" className="object-cover brightness-[0.35]" priority />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="font-headline text-5xl md:text-8xl font-black text-[#F2C777] tracking-tighter mb-4"
          >
            ENCUÉNTRANOS 📍
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="font-body text-lg md:text-xl text-white/80 max-w-2xl font-light uppercase tracking-[0.2em]"
          >
            Gastronomía de Autor en el Corazón de Perote
          </motion.p>
        </div>
      </section>

      {/* Location & Contact Grid */}
      <section className="max-w-7xl mx-auto px-6 -mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-8 h-[500px] md:h-[600px] bg-[#1C1C1C] rounded-xl overflow-hidden relative"
        >
          <iframe title="Mapa de ubicación de POP Perote" allowFullScreen className="w-full h-full grayscale invert brightness-90 contrast-125" loading="lazy" src="https://maps.google.com/maps?q=POP+Perote,+Justo+Sierra+No.+11,+Col.+Amado+Nervo,+Perote,+Veracruz&t=&z=16&ie=UTF8&iwloc=&output=embed" />
          <div className="absolute bottom-6 left-6 bg-[#0D0D0D]/90 backdrop-blur-md p-6 max-w-sm rounded-lg border-l-4 border-[#D96725]">
            {openStatus && (
              <span className={`inline-block text-[10px] font-black px-2 py-1 rounded mb-3 tracking-widest uppercase ${openStatus.isOpen ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                {openStatus.label}
              </span>
            )}
            <h3 className="font-headline text-xl font-bold text-white mb-2">Justo Sierra No. 11</h3>
            <p className="text-white/60 text-sm leading-relaxed">Col. Amado Nervo, Perote, Veracruz. C.P. 91270</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-4"
        >
          <div className="bg-[#1C1C1C] p-8 rounded-xl border-t-2 border-[#F2C777]/20">
            <span className="text-[#F2C777] font-headline text-xs font-black tracking-widest uppercase mb-4 block">Contacto Directo</span>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#D96725]/10 flex items-center justify-center text-[#D96725]">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase font-bold">Teléfono</p>
                <p className="text-xl font-headline font-bold text-white tabular-nums">282-825-32-43</p>
              </div>
            </div>
            <span className="text-[#F2C777] font-headline text-xs font-black tracking-widest uppercase mb-6 block">Horarios</span>
            <div className="space-y-3">
              {[
                ['Lun, Mié, Jue', '14:00 - 21:30', 'text-white'],
                ['Vie - Sáb', '14:00 - 22:00', 'text-[#D96725]'],
                ['Domingo', '14:00 - 21:00', 'text-white'],
                ['Martes', 'Cerrado', 'text-red-500'],
              ].map(([day, time, color]) => (
                <div key={day} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm text-white/80">{day}</span>
                  <span className={`text-sm font-bold tabular-nums ${color}`}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.a
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="bg-[#D96725] p-8 rounded-xl flex flex-col justify-between h-48 transition-all duration-500"
            href="https://www.google.com/maps/dir/?api=1&destination=POP+Perote,+Justo+Sierra+No.+11,+Col.+Amado+Nervo,+Perote,+Veracruz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-4xl text-white">explore</span>
            <div><h4 className="font-headline text-2xl font-black text-white">CÓMO LLEGAR</h4><p className="text-white/70 text-sm font-bold uppercase tracking-widest mt-1">Abrir Maps</p></div>
          </motion.a>
          <motion.a
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1C1C1C] border border-[#F2C777]/10 p-8 rounded-xl flex flex-col justify-between h-48 transition-all duration-500 hover:border-[#F2C777]/30"
            href="https://wa.me/522828253243"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-4xl text-[#F2C777]">chat_bubble</span>
            <div><h4 className="font-headline text-2xl font-black text-white">WHATSAPP</h4><p className="text-[#F2C777] text-sm font-bold uppercase tracking-widest mt-1">Chat Directo</p></div>
          </motion.a>
          <motion.a
            variants={itemVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1C1C1C] border border-white/5 p-8 rounded-xl flex flex-col justify-between h-48 transition-all duration-500 hover:border-white/20"
            href="tel:2828253243"
          >
            <span className="material-symbols-outlined text-4xl text-white">call</span>
            <div><h4 className="font-headline text-2xl font-black text-white">LLAMAR</h4><p className="text-white/50 text-sm font-bold uppercase tracking-widest mt-1">Iniciar Llamada</p></div>
          </motion.a>
        </motion.div>
      </section>

      {/* Reservation Section */}
      <section className="bg-[#0D0D0D] py-24 border-t border-white/5" id="reservar">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2 className="font-headline text-4xl font-black text-[#F2C777] tracking-tighter mb-4 uppercase">SOLICITAR RESERVACIÓN</h2>
            <p className="text-white/60 mb-8 max-w-md">Asegura tu mesa para una velada inolvidable.</p>

            {/* Auth status badge */}
            {isLoggedIn ? (
              <div className="inline-flex items-center gap-2 bg-green-900/20 border border-green-500/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded mb-8">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Reservación se guardará en tu cuenta
              </div>
            ) : (
              <div className="bg-[#1C1C1C] border border-[#F2C777]/10 p-4 rounded-lg mb-8">
                <p className="text-white/70 text-sm mb-2">
                  <span className="text-[#F2C777] font-bold">¿Tienes cuenta?</span> Inicia sesión para guardar tu reservación y ganar <span className="text-[#F2C777] font-bold">50 puntos POP</span> de bienvenida.
                </p>
                <div className="flex gap-3">
                  <a href="/login" className="text-[#F2C777] text-xs font-bold uppercase tracking-widest hover:underline">Iniciar sesión</a>
                  <span className="text-white/20">|</span>
                  <a href="/login?tab=register" className="text-[#D96725] text-xs font-bold uppercase tracking-widest hover:underline">Registrarse</a>
                </div>
                <p className="text-white/40 text-xs mt-2">O continúa sin cuenta — te enviaremos el seguimiento por correo.</p>
              </div>
            )}

            {/* Success message */}
            {status === 'success' && (
              <div className="bg-green-900/20 border border-green-500/20 p-6 rounded-lg mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-green-400 text-2xl">check_circle</span>
                  <h3 className="text-white font-bold text-lg">¡Solicitud recibida!</h3>
                </div>
                <p className="text-white/60 text-sm">Tu solicitud quedó pendiente de revisión. Te notificaremos en tu cuenta cuando el equipo de POP confirme la disponibilidad.</p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-[#F2C777] text-xs font-bold uppercase tracking-widest hover:underline">
                  Hacer otra reservación
                </button>
              </div>
            )}

            {status === 'whatsapp_sent' && (
              <div className="bg-[#1C1C1C] border border-[#F2C777]/20 p-6 rounded-lg mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-[#F2C777] text-2xl">check_circle</span>
                  <h3 className="text-white font-bold text-lg">¡Reservación Registrada!</h3>
                </div>
                <p className="text-white/60 text-sm">Tu solicitud fue registrada. Te enviamos un correo a {submittedEmail || 'tu correo'} y el equipo de POP te confirmará por ahí.</p>
                <p className="text-white/40 text-xs mt-3">
                  💡 <a href="/login?tab=register" className="text-[#F2C777] hover:underline">Crea una cuenta</a> para gestionar tus reservaciones, ver el estado en tiempo real y ganar <span className="text-[#F2C777]">50 puntos POP</span> de bienvenida.
                </p>
                <button onClick={() => setStatus('idle')} className="mt-4 text-[#F2C777] text-xs font-bold uppercase tracking-widest hover:underline">
                  Hacer otra reservación
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-lg mb-8">
                <p className="text-red-400 text-sm font-bold">{errorMsg}</p>
                <button onClick={() => setStatus('idle')} className="mt-2 text-white/60 text-xs hover:underline">Intentar de nuevo</button>
              </div>
            )}

            {/* Form */}
            {(status === 'idle' || status === 'error' || status === 'submitting') && (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label htmlFor="reserva-nombre" className="text-xs font-bold uppercase tracking-widest text-white/60">Nombre completo</label><input id="reserva-nombre" className="w-full bg-transparent border-0 border-b border-white/10 py-4 focus:ring-0 focus:border-[#F2C777] transition-all text-white placeholder:text-white/30 outline-none" placeholder="Tu nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
                  <div><label htmlFor="reserva-email" className="text-xs font-bold uppercase tracking-widest text-white/60">Correo electrónico</label><input id="reserva-email" className="w-full bg-transparent border-0 border-b border-white/10 py-4 focus:ring-0 focus:border-[#F2C777] transition-all text-white placeholder:text-white/30 outline-none" placeholder="correo@ejemplo.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><label htmlFor="reserva-telefono" className="text-xs font-bold uppercase tracking-widest text-white/60">Teléfono (opcional)</label><input id="reserva-telefono" className="w-full bg-transparent border-0 border-b border-white/10 py-4 focus:ring-0 focus:border-[#F2C777] transition-all text-white placeholder:text-white/30 outline-none" placeholder="2828253243" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div><label htmlFor="reserva-fecha" className="text-xs font-bold uppercase tracking-widest text-white/60">Fecha</label><input id="reserva-fecha" className="w-full bg-transparent border-0 border-b border-white/10 py-4 focus:ring-0 focus:border-[#F2C777] transition-all text-white outline-none [color-scheme:dark]" type="date" min={today} value={fecha} onChange={(e) => { setFecha(e.target.value); setHora(''); }} required /></div>
                  <div><label htmlFor="reserva-hora" className="text-xs font-bold uppercase tracking-widest text-white/60">Hora</label><input id="reserva-hora" className="w-full bg-transparent border-0 border-b border-white/10 py-4 focus:ring-0 focus:border-[#F2C777] transition-all text-white outline-none [color-scheme:dark]" type="time" min="14:00" max={selectedCloseTime ?? undefined} disabled={selectedDay === 2} value={hora} onChange={(e) => setHora(e.target.value)} required /></div>
                  <div className="flex items-center justify-between border-b border-white/10 py-2" role="group" aria-label="Número de personas">
                    <span className="text-white/50 text-sm uppercase font-bold" id="reserva-personas">Personas</span>
                    <div className="flex items-center gap-4">
                      <button aria-label="Disminuir personas" className="text-[#F2C777]" type="button" onClick={() => setPersonas(p => Math.max(1, p - 1))}><span className="material-symbols-outlined" aria-hidden="true">remove_circle</span></button>
                      <span className="font-headline font-bold text-xl text-white tabular-nums">{personas}</span>
                      <button aria-label="Aumentar personas" className="text-[#F2C777]" type="button" onClick={() => setPersonas(p => Math.min(20, p + 1))}><span className="material-symbols-outlined" aria-hidden="true">add_circle</span></button>
                    </div>
                  </div>
                </div>
                {selectedDay === 2 && <p className="text-sm text-[#D96725]">POP Perote permanece cerrado los martes. Elige otra fecha.</p>}
                <div><label htmlFor="reserva-notas" className="text-xs font-bold uppercase tracking-widest text-white/60">Notas especiales (opcional)</label><textarea id="reserva-notas" className="w-full bg-transparent border-0 border-b border-white/10 py-4 focus:ring-0 focus:border-[#F2C777] transition-all text-white placeholder:text-white/30 resize-none outline-none" placeholder="Alergias, cumpleaños..." rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} /></div>
                <button className="w-full bg-[#D96725] text-white font-headline font-black py-6 rounded-sm tracking-widest uppercase transition-all duration-500 hover:bg-[#F2C777] hover:text-[#0D0D0D] active:scale-95 disabled:opacity-50" type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'ENVIANDO...' : 'ENVIAR SOLICITUD'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="relative h-64 overflow-hidden rounded-lg">
                <Image alt="Mesa grande POP Perote" src="/images/mesa_grande_1.webp" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="relative h-80 overflow-hidden rounded-lg">
                <Image alt="Decoración POP Perote" src="/images/decoracion_pop_3.webp" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-110" />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="relative h-80 overflow-hidden rounded-lg">
                <Image alt="Mesa lateral POP Perote" src="/images/mesa_lateral.webp" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-110" />
              </div>
              <div className="relative h-64 overflow-hidden rounded-lg">
                <Image alt="Decoración interior POP" src="/images/decoracion_pop_6.webp" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-110" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
