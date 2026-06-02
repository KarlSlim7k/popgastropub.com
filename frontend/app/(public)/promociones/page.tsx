'use client';

import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';
import { getSupportedImageUrl } from '@/components/promociones/PromoLandingContent';
import { API_URL } from '@/lib/api';

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
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day === 0 ? 7 : day) - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getTodayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function getPromosForDay(promos: Promo[], diaName: string): Promo[] {
  return promos.filter(p => p.activa && parseDias(p.dias_activos).includes(diaName));
}

function getPromoAction(promo: Promo): string {
  return promo.landing_url || promo.cta_primary_url || '/orden';
}

function isExternalUrl(value: string): boolean {
  return value.startsWith('https://');
}

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
    <main className="pt-24 pb-32">
      {/* Hero Section */}
      <section className="px-4 sm:px-8 mb-20 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black font-headline text-[#F2C777] tracking-tighter uppercase leading-[0.9]">
            PROMOCIONES
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-gray-400 font-medium max-w-2xl">
            Porque en POP siempre hay algo especial para ti.
          </p>
        </div>

        {heroPromo ? (
          <div className="relative group overflow-hidden rounded-xl bg-[#0D0D0D] min-h-[400px] flex flex-col md:flex-row border border-[#732817]/30">
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
                <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-[#732817] via-[#D96725] to-[#F2C777]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-transparent to-transparent" />
            </div>
            <div className="w-full md:w-2/5 p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative z-10">
              <div className="inline-flex items-center px-3 py-1 bg-[#D96725]/20 border border-[#D96725]/30 text-[#D96725] text-xs font-bold tracking-widest uppercase mb-6 w-fit">
                {parseDias(heroPromo.dias_activos).includes(todayName) ? 'Disponible hoy' : 'Próximamente'}
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-headline text-white leading-none mb-4 uppercase">
                {heroPromo.titulo}
              </h2>
              <p className="text-lg text-gray-400 mb-4 leading-relaxed">{heroPromo.descripcion}</p>
              {heroPromo.descuento && (
                <span className="text-[#F2C777] font-headline font-bold text-2xl mb-6">{heroPromo.descuento}</span>
              )}
              <a
                href={getPromoAction(heroPromo)}
                target={isExternalUrl(getPromoAction(heroPromo)) ? '_blank' : undefined}
                rel={isExternalUrl(getPromoAction(heroPromo)) ? 'noopener noreferrer' : undefined}
                className="bg-[#D96725] text-white font-headline font-bold py-5 px-10 rounded-sm tracking-widest text-sm transition-all duration-500 hover:bg-[#F2C777] hover:text-[#0D0D0D] hover:shadow-[0_0_30px_rgba(217,103,37,0.4)] hover:scale-[1.02] uppercase w-full md:w-fit text-center"
              >
                APROVECHAR AHORA →
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[#0D0D0D] border border-[#732817]/30 p-12 text-center">
            <p className="text-gray-400 text-lg">No hay promociones activas en este momento.</p>
          </div>
        )}
      </section>

      {/* Weekly Calendar */}
      <section className="px-4 sm:px-8 mb-24 max-w-7xl mx-auto">
        <h3 className="font-headline font-bold text-2xl mb-8 flex items-center uppercase tracking-widest text-white">
          <span className="w-8 h-[2px] bg-[#F2C777] mr-4" /> Agenda Semanal
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {weekDates.map((date, i) => {
            const isToday = i === todayIndex;
            const dayPromos = getPromosForDay(promos, DIAS_SEMANA[i]);
            return (
              <div
                key={i}
                className={`p-6 rounded-lg relative overflow-hidden ${
                  isToday
                    ? 'bg-[#0D0D0D] border-2 border-[#F2C777] shadow-[0_0_20px_rgba(242,199,119,0.15)]'
                    : 'bg-[#0D0D0D]/60 border border-transparent hover:border-[#732817]/30'
                }`}
              >
                <span className={`block text-xs font-bold uppercase tracking-tighter mb-1 ${isToday ? 'text-[#F2C777]' : 'text-gray-500'}`}>
                  {DIAS_CORTOS[i]}
                </span>
                <span className={`block text-2xl font-black font-headline mb-3 ${isToday ? 'text-[#F2C777]' : 'text-gray-400'}`}>
                  {date.getDate()}
                </span>
                {dayPromos.length > 0 ? (
                  dayPromos.map(p => (
                    <div key={p.id} className="inline-flex items-center px-2 py-0.5 bg-[#F2C777] text-[#0D0D0D] text-[9px] font-black uppercase rounded-[2px] mb-1 mr-1">
                      {p.titulo}
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] uppercase font-bold text-gray-600">Sin Eventos</div>
                )}
                {isToday && (
                  <div className="absolute top-0 right-0 p-2">
                    <div className="w-1.5 h-1.5 bg-[#F2C777] rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Promos Grid */}
      <section className="px-4 sm:px-8 mb-24 max-w-7xl mx-auto">
        <h3 className="font-headline font-bold text-4xl uppercase tracking-tighter text-white mb-10">Más Promociones</h3>
        {activePromos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {activePromos.map(promo => (
              <article key={promo.id} className="group flex flex-col bg-[#0D0D0D] rounded-sm overflow-hidden border-b border-transparent hover:border-[#F2C777] transition-all duration-500">
                <div className="relative h-48 overflow-hidden">
                  {getSupportedImageUrl(promo.imagen) ? (
                    <Image
                      src={getSupportedImageUrl(promo.imagen) as string}
                      alt={promo.titulo}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#732817] via-[#D96725] to-[#F2C894] group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#D96725] text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-sm">
                      {promo.tipo}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h4 className="font-headline font-bold text-2xl mb-2 text-white uppercase">{promo.titulo}</h4>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">{promo.descripcion}</p>
                  <div className="mt-auto flex justify-between items-center pt-6 border-t border-gray-800">
                    {promo.descuento && (
                      <span className="text-[#F2C777] font-headline font-bold text-sm">{promo.descuento}</span>
                    )}
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                      {parseDias(promo.dias_activos).join(', ')}
                    </span>
                  </div>
                  <a
                    href={getPromoAction(promo)}
                    target={isExternalUrl(getPromoAction(promo)) ? '_blank' : undefined}
                    rel={isExternalUrl(getPromoAction(promo)) ? 'noopener noreferrer' : undefined}
                    className="mt-6 inline-flex text-xs font-black uppercase tracking-widest text-[#D96725] transition-colors hover:text-[#F2C777]"
                  >
                    Ver promoción →
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-[#732817]/20 rounded-lg">
            <p className="text-gray-500 text-lg">No hay promociones activas por el momento.</p>
          </div>
        )}
      </section>

      {/* Próximamente */}
      <section className="bg-[#0D0D0D] py-24">
        <div className="px-4 sm:px-8 max-w-7xl mx-auto text-center">
          <h3 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none text-white mb-4">
            PRÓXIMAMENTE
          </h3>
          <p className="text-gray-500 text-lg">Estamos preparando nuevas promociones para ti. ¡Mantente atento!</p>
        </div>
      </section>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <main className="pt-24 pb-32">
      <section className="px-4 sm:px-8 mb-20 max-w-7xl mx-auto">
        <div className="h-12 w-96 bg-gray-800 rounded animate-pulse mb-4" />
        <div className="h-6 w-64 bg-gray-800 rounded animate-pulse mb-12" />
        <div className="h-[400px] bg-gray-800 rounded-xl animate-pulse" />
      </section>
      <section className="px-4 sm:px-8 mb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 bg-gray-800 rounded-sm animate-pulse" />
          ))}
        </div>
      </section>
    </main>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="pt-24 pb-32 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <p className="text-gray-400 text-xl mb-6">No pudimos cargar las promociones</p>
        <button
          onClick={onRetry}
          className="bg-[#D96725] text-white font-headline font-bold py-4 px-8 rounded-sm tracking-widest text-sm uppercase hover:bg-[#F2C777] hover:text-[#0D0D0D] transition-all"
        >
          REINTENTAR
        </button>
      </div>
    </main>
  );
}
