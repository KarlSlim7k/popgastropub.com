'use client';

import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getSupportedImageUrl } from '@/components/promociones/PromoLandingContent';
import { API_URL } from '@/lib/api';
import { getRestaurantDateString, getRestaurantDayOfWeek } from '@/lib/business-hours';

interface Promo {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  descuento: string;
  dia_inicio: string;
  dia_fin: string;
  dias_activos: string | string[] | null;
  activa: boolean;
  estado: string;
  imagen?: string | null;
  landing_url?: string | null;
  cta_primary_url?: string | null;
}

const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function parseDias(dias: string | string[] | null): string[] {
  if (!dias) return [];
  if (Array.isArray(dias)) return dias;
  return dias.split(',').map(d => d.trim());
}

function getWeekDates(): Date[] {
  const now = new Date(`${getRestaurantDateString()}T12:00:00`);
  const day = getRestaurantDayOfWeek();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day === 0 ? 7 : day) - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getTodayIndex(): number {
  const day = getRestaurantDayOfWeek();
  return day === 0 ? 6 : day - 1;
}

function getPromosForDay(promos: Promo[], diaName: string): Promo[] {
  return promos.filter(p => p.activa && parseDias(p.dias_activos).includes(diaName));
}

function getPromoAction(promo: Promo): string {
  return promo.landing_url || promo.cta_primary_url || '/menu';
}

function isExternalUrl(value: string): boolean {
  return value.startsWith('https://');
}

function formatDateShort(dateStr: string): string {
  if (!dateStr || !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y.slice(2)}`;
}

/* ── Stagger animation variants ── */
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

export default function Promociones() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API_URL}/promociones`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setPromos(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPromos(); }, [fetchPromos]);

  const todayIndex = getTodayIndex();
  const todayName = DIAS_SEMANA[todayIndex];
  const weekDates = getWeekDates();
  const activePromos = promos.filter(p => p.activa);
  const heroPromo = activePromos.find(p => parseDias(p.dias_activos).includes(todayName)) || activePromos[0];

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={fetchPromos} />;

  return (
    <main className="pt-28 md:pt-36 pb-32 bg-[#0D0D0D] min-h-screen">
      {/* ── Hero ── */}
      <section className="px-4 sm:px-8 mb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="mb-10 md:mb-14"
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black font-epilogue text-[#F2C777] tracking-tighter uppercase leading-[0.9]">
            PROMOCIONES
          </h1>
          <p className="text-lg md:text-xl mt-3 text-[#e5e2e1]/60 font-medium max-w-2xl">
            Cerveza fría, buena mesa y una razón nueva pa' venir cada semana.
          </p>
        </motion.div>

        {heroPromo ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
            className="relative group overflow-hidden rounded-2xl bg-[#0D0D0D] min-h-[420px] flex flex-col md:flex-row border border-[#732817]/30 shadow-2xl shadow-black/40"
          >
            {/* Image side */}
            <div className="relative min-h-[260px] w-full overflow-hidden sm:min-h-[300px] md:w-3/5">
              {getSupportedImageUrl(heroPromo.imagen) ? (
                <Image
                  src={getSupportedImageUrl(heroPromo.imagen) as string}
                  alt={heroPromo.titulo}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full min-h-[300px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#732817] via-[#D96725] to-[#F2C777]" />
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230D0D0D' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[120px] font-black text-white/10 font-epilogue select-none">POP</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/80 via-transparent to-transparent" />
            </div>

            {/* Content side */}
            <div className="w-full md:w-2/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="inline-flex items-center px-3 py-1.5 bg-[#D96725]/15 border border-[#D96725]/30 text-[#D96725] text-[10px] font-black tracking-[0.2em] uppercase mb-5 w-fit rounded-full">
                  {parseDias(heroPromo.dias_activos).includes(todayName) ? '🔥 Disponible hoy' : 'Próximamente'}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-epilogue text-white leading-none mb-4 uppercase tracking-tight">
                  {heroPromo.titulo}
                </h2>
                <p className="text-base text-[#e5e2e1]/60 mb-5 leading-relaxed">{heroPromo.descripcion}</p>
                {heroPromo.descuento && (
                  <span className="text-[#F2C777] font-epilogue font-bold text-xl md:text-2xl mb-6 block">{heroPromo.descuento}</span>
                )}
                <a
                  href={getPromoAction(heroPromo)}
                  target={isExternalUrl(getPromoAction(heroPromo)) ? '_blank' : undefined}
                  rel={isExternalUrl(getPromoAction(heroPromo)) ? 'noopener noreferrer' : undefined}
                  className="bg-[#D96725] text-white font-epilogue font-bold py-4 px-8 rounded-lg tracking-widest text-xs transition-all duration-300 hover:bg-[#F2C777] hover:text-[#0D0D0D] hover:shadow-[0_0_30px_rgba(217,103,37,0.35)] hover:scale-[1.02] uppercase w-full md:w-fit text-center inline-flex items-center justify-center gap-2"
                >
                  APROVECHAR AHORA
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-[#0D0D0D] border border-[#732817]/30 p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#732817]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#D96725]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[#e5e2e1]/60 text-lg">No hay promociones activas en este momento.</p>
            <p className="text-[#e5e2e1]/40 text-sm mt-2">Vuelve pronto para descubrir nuestras ofertas.</p>
          </motion.div>
        )}
      </section>

      {/* ── Weekly Calendar ── */}
      <section className="px-4 sm:px-8 mb-24 max-w-7xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-epilogue font-bold text-xl mb-8 flex items-center uppercase tracking-widest text-white"
        >
          <span className="w-8 h-[2px] bg-[#F2C777] mr-4" />
          Agenda Semanal
        </motion.h3>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3"
        >
          {weekDates.map((date, i) => {
            const isToday = i === todayIndex;
            const dayPromos = getPromosForDay(promos, DIAS_SEMANA[i]);
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`p-4 sm:p-5 rounded-xl relative overflow-hidden transition-all duration-300 ${
                  isToday
                    ? 'bg-[#0D0D0D] border-2 border-[#F2C777] shadow-[0_0_24px_rgba(242,199,119,0.12)]'
                    : 'bg-[#0D0D0D]/50 border border-[#e5e2e1]/5 hover:border-[#732817]/30 hover:bg-[#0D0D0D]/80'
                }`}
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${isToday ? 'text-[#F2C777]' : 'text-[#e5e2e1]/30'}`}>
                    {DIAS_CORTOS[i]}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#D96725] bg-[#D96725]/10 px-1.5 py-0.5 rounded">HOY</span>
                  )}
                </div>
                <span className={`block text-2xl font-black font-epilogue mb-3 ${isToday ? 'text-[#F2C777]' : 'text-[#e5e2e1]/40'}`}>
                  {date.getDate()}
                </span>
                <div className="space-y-1.5">
                  {dayPromos.length > 0 ? (
                    dayPromos.map(p => (
                      <div
                        key={p.id}
                        className="px-2 py-1 bg-[#F2C777] text-[#0D0D0D] text-[9px] font-black uppercase rounded-[4px] leading-tight truncate"
                        title={p.titulo}
                      >
                        {p.titulo}
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] uppercase font-bold text-[#e5e2e1]/20">Sin promos</div>
                  )}
                </div>
                {isToday && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-[#F2C777] rounded-full animate-pulse" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Active Promos Grid ── */}
      <section className="px-4 sm:px-8 mb-24 max-w-7xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-epilogue font-bold text-3xl md:text-4xl uppercase tracking-tighter text-white mb-10"
        >
          Más Promociones
        </motion.h3>

        {activePromos.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activePromos.map((promo) => (
              <motion.article
                key={promo.id}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col bg-[#0D0D0D] rounded-xl overflow-hidden border border-[#e5e2e1]/5 hover:border-[#F2C777]/30 transition-all duration-500 shadow-lg shadow-black/20 hover:shadow-[#F2C777]/5"
              >
                {/* Image area */}
                <div className="relative h-52 overflow-hidden">
                  {getSupportedImageUrl(promo.imagen) ? (
                    <Image
                      src={getSupportedImageUrl(promo.imagen) as string}
                      alt={promo.titulo}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#732817] via-[#D96725] to-[#F2C894]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-black text-white/10 font-epilogue select-none">POP</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#D96725] text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-widest rounded-md shadow-lg">
                      {promo.tipo}
                    </span>
                  </div>
                  {promo.descuento && (
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-[#F2C777] text-[#0D0D0D] text-xs font-black px-3 py-1.5 rounded-md shadow-lg">
                        {promo.descuento}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <h4 className="font-epilogue font-bold text-xl mb-2 text-white uppercase tracking-tight group-hover:text-[#F2C777] transition-colors duration-300">
                    {promo.titulo}
                  </h4>
                  <p className="text-[#e5e2e1]/50 text-sm mb-5 leading-relaxed line-clamp-2">{promo.descripcion}</p>

                  <div className="mt-auto pt-5 border-t border-[#e5e2e1]/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[#e5e2e1]/40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-[10px] uppercase font-bold tracking-widest">
                          {parseDias(promo.dias_activos).join(', ')}
                        </span>
                      </div>
                      {promo.dia_inicio && promo.dia_fin && (
                        <span className="text-[9px] uppercase font-bold tracking-widest text-[#D96725]">
                          Hasta {formatDateShort(promo.dia_fin)}
                        </span>
                      )}
                    </div>
                    <a
                      href={getPromoAction(promo)}
                      target={isExternalUrl(getPromoAction(promo)) ? '_blank' : undefined}
                      rel={isExternalUrl(getPromoAction(promo)) ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center justify-center w-full gap-2 text-xs font-black uppercase tracking-widest text-[#0D0D0D] bg-[#F2C777] py-3 rounded-lg transition-all duration-300 hover:bg-[#F2C894] hover:shadow-[0_0_20px_rgba(242,199,119,0.25)] hover:scale-[1.02]"
                    >
                      Ver promoción
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border border-[#732817]/20 rounded-2xl bg-[#0D0D0D]/50"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#732817]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#D96725]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[#e5e2e1]/40 text-lg">No hay promociones activas por el momento.</p>
          </motion.div>
        )}
      </section>

      {/* ── Coming Soon / Newsletter ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#1c1b1b] to-[#0D0D0D]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F2C777' fill-opacity='0.08' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="px-4 sm:px-8 max-w-7xl mx-auto text-center py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F2C777]/10 flex items-center justify-center border border-[#F2C777]/20">
              <svg className="w-8 h-8 text-[#F2C777]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <h3 className="font-epilogue font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none text-white mb-4">
              PRÓXIMAMENTE
            </h3>
            <p className="text-[#e5e2e1]/50 text-lg max-w-lg mx-auto mb-8">
              Ya estamos cocinando la próxima promo. Súmate por WhatsApp y entérate primero, antes que nadie.
            </p>
            <a
              href="https://wa.me/522828253243?text=Hola%20POP%20Perote,%20quiero%20recibir%20las%20promociones%20exclusivas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D96725] text-white font-epilogue font-bold py-4 px-8 rounded-lg tracking-widest text-xs uppercase transition-all duration-300 hover:bg-[#F2C777] hover:text-[#0D0D0D] hover:shadow-[0_0_30px_rgba(217,103,37,0.35)] hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.004 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              AVÍSAME DE LAS PROMOS
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

/* ── Loading Skeleton ── */
function LoadingSkeleton() {
  return (
    <main className="pt-28 md:pt-36 pb-32 bg-[#0D0D0D] min-h-screen">
      <section className="px-4 sm:px-8 mb-20 max-w-7xl mx-auto">
        <div className="h-14 w-80 bg-[#1c1b1b] rounded-lg animate-pulse mb-4" />
        <div className="h-5 w-64 bg-[#1c1b1b] rounded-lg animate-pulse mb-12" />
        <div className="h-[420px] bg-[#1c1b1b] rounded-2xl animate-pulse border border-[#e5e2e1]/5" />
      </section>
      <section className="px-4 sm:px-8 mb-24 max-w-7xl mx-auto">
        <div className="h-6 w-48 bg-[#1c1b1b] rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-40 bg-[#1c1b1b] rounded-xl animate-pulse border border-[#e5e2e1]/5" />
          ))}
        </div>
      </section>
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="h-8 w-56 bg-[#1c1b1b] rounded-lg animate-pulse mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[380px] bg-[#1c1b1b] rounded-xl animate-pulse border border-[#e5e2e1]/5" />
          ))}
        </div>
      </section>
    </main>
  );
}

/* ── Error State ── */
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="pt-28 md:pt-36 pb-32 bg-[#0D0D0D] min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center px-6 max-w-md"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#D96725]/10 flex items-center justify-center border border-[#D96725]/20">
          <svg className="w-10 h-10 text-[#D96725]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <p className="text-white text-xl font-bold mb-2">No pudimos cargar las promociones</p>
        <p className="text-[#e5e2e1]/40 text-sm mb-8">Parece que hubo un problema de conexión. Intenta de nuevo en un momento.</p>
        <button
          onClick={onRetry}
          className="bg-[#D96725] text-white font-epilogue font-bold py-4 px-8 rounded-lg tracking-widest text-xs uppercase hover:bg-[#F2C777] hover:text-[#0D0D0D] transition-all inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          REINTENTAR
        </button>
      </motion.div>
    </main>
  );
}
