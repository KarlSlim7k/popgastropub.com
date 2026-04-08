'use client';

import { useState } from 'react';

/* ─── Tipos ──────────────────────────────────────────────────────────────── */
type TierKey = 'fan' | 'lover' | 'vip' | 'elite';

interface Tier {
  key: TierKey;
  label: string;
  minPts: number;
  maxPts: number | null;
  icon: string;
  color: string;
  glow: string;
  benefits: string[];
  multiplier: string;
}

interface HistoryEntry {
  date: string;
  title: string;
  subtitle: string;
  points: number;
  balance: number;
  type: 'earn' | 'redeem' | 'bonus';
}

interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
  category: string;
  available: boolean;
}

/* ─── Datos estáticos ────────────────────────────────────────────────────── */
const USER_POINTS = 1250;
const USER_NAME = 'Sofía';

const tiers: Tier[] = [
  {
    key: 'fan',
    label: 'POP Fan',
    minPts: 0,
    maxPts: 499,
    icon: 'military_tech',
    color: '#A0A0A0',
    glow: 'rgba(160,160,160,0.25)',
    multiplier: '×1',
    benefits: [
      'Acumula 1 pto por cada $10 MXN',
      'Acceso a promos básicas',
      'Notificaciones de promociones',
    ],
  },
  {
    key: 'lover',
    label: 'POP Lover',
    minPts: 500,
    maxPts: 1499,
    icon: 'favorite',
    color: '#FFB693',
    glow: 'rgba(255,182,147,0.25)',
    multiplier: '×1.1',
    benefits: [
      '+10% puntos por compra',
      'Promo exclusiva mensual',
      'Bebida gratis en cumpleaños',
    ],
  },
  {
    key: 'vip',
    label: 'POP VIP',
    minPts: 1500,
    maxPts: 2999,
    icon: 'workspace_premium',
    color: '#EBC071',
    glow: 'rgba(235,192,113,0.3)',
    multiplier: '×1.25',
    benefits: [
      '+25% puntos por compra',
      'Rollo gratis cada 5 visitas',
      'Acceso temprano a promos',
    ],
  },
  {
    key: 'elite',
    label: 'POP Elite',
    minPts: 3000,
    maxPts: null,
    icon: 'diamond',
    color: '#D96725',
    glow: 'rgba(217,103,37,0.35)',
    multiplier: '×1.5',
    benefits: [
      '+50% puntos por compra',
      'Mesa reservada prioritaria',
      'Invitación a eventos exclusivos',
      '1 buffet gratis al mes',
    ],
  },
];

const history: HistoryEntry[] = [
  { date: '12 OCT 2024', title: 'Cena Gourmet – Pedido #4567', subtitle: 'Visita presencial', points: 120, balance: 1250, type: 'earn' },
  { date: '05 OCT 2024', title: 'Take-out Especial', subtitle: 'Pedido a domicilio', points: 85, balance: 1130, type: 'earn' },
  { date: '28 SEP 2024', title: 'Reseña Google', subtitle: 'Con comprobante de visita', points: 100, balance: 1045, type: 'bonus' },
  { date: '20 SEP 2024', title: 'Canje – Margarita Gratis', subtitle: 'Canjeo de recompensa', points: -100, balance: 945, type: 'redeem' },
  { date: '14 SEP 2024', title: 'Check-in Presencial', subtitle: 'Registro en sucursal', points: 25, balance: 1045, type: 'earn' },
  { date: '07 SEP 2024', title: 'Referido – Carlos M.', subtitle: 'Primer pedido del amigo', points: 200, balance: 1020, type: 'bonus' },
];

const rewards: Reward[] = [
  { id: 'r1', title: 'Margarita Gratis', cost: 100, icon: '🍹', category: 'Bebidas', available: true },
  { id: 'r2', title: 'Orden de Alitas (6 pzas)', cost: 350, icon: '🍗', category: 'Comida', available: true },
  { id: 'r3', title: 'Postre de Autor', cost: 400, icon: '🍫', category: 'Postre', available: false },
  { id: 'r4', title: 'Rollo Especial', cost: 500, icon: '🍣', category: 'Sushi', available: false },
  { id: 'r5', title: 'Buffet POP Elite', cost: 1500, icon: '🎉', category: 'VIP', available: false },
  { id: 'r6', title: '2×1 en Boneless', cost: 200, icon: '🔥', category: 'Promo', available: false },
];

const earnWays = [
  { icon: 'shopping_bag', label: 'Por compra', desc: '1 pto por cada $10 MXN', pts: '+1 pto/$10' },
  { icon: 'store', label: 'Check-in', desc: 'Visita presencial registrada', pts: '+25 pts' },
  { icon: 'star', label: 'Reseña Google', desc: 'Con foto como comprobante', pts: '+100 pts' },
  { icon: 'group_add', label: 'Referir amigo', desc: 'En su primer pedido', pts: '+200 pts' },
  { icon: 'cake', label: 'Cumpleaños', desc: 'Regalo automático anual', pts: '+150 pts' },
  { icon: 'share', label: 'Compartir en redes', desc: 'Etiquétanos en tu post', pts: '+30 pts' },
];

/* ─── Helper: obtener tier actual ────────────────────────────────────────── */
function getCurrentTier(points: number): Tier {
  return [...tiers].reverse().find((t) => points >= t.minPts) ?? tiers[0];
}

function getNextTier(current: Tier): Tier | null {
  const idx = tiers.findIndex((t) => t.key === current.key);
  return idx < tiers.length - 1 ? tiers[idx + 1] : null;
}

/* ─── Componentes internos ───────────────────────────────────────────────── */
function PointsBadge({ points, delta }: { points: number; delta?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`font-mono font-black tabular-nums ${delta && delta < 0 ? 'text-red-400' : 'text-[#F2C777]'}`}>
        {delta ? (delta > 0 ? `+${delta}` : delta) : points.toLocaleString('es-MX')}
      </span>
      <span className="text-[10px] font-black uppercase tracking-widest text-[#F2C777]/50">pts</span>
    </div>
  );
}

/* ─── Página principal ───────────────────────────────────────────────────── */
export default function PuntosPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recompensas' | 'historial' | 'como-ganar'>('dashboard');
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const currentTier = getCurrentTier(USER_POINTS);
  const nextTier = getNextTier(currentTier);
  const ptsToNext = nextTier ? nextTier.minPts - USER_POINTS : 0;
  const progress = nextTier
    ? ((USER_POINTS - currentTier.minPts) / (nextTier.minPts - currentTier.minPts)) * 100
    : 100;

  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-20 pb-32">

      {/* ─── Hero personalizado ─── */}
      <section className="relative overflow-hidden px-6 py-14 md:px-16">
        {/* Glow ambiental del tier */}
        <div
          className="pointer-events-none absolute left-0 top-0 w-full h-full opacity-20 blur-[160px]"
          style={{ background: `radial-gradient(ellipse 80% 60% at 30% 50%, ${currentTier.glow}, transparent)` }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between">
            {/* Saludo */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#F2C777]/50 mb-3">
                POP Points · Dashboard
              </p>
              <h1 className="font-epilogue text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
                ¡Hola, {USER_NAME}! <span className="wave inline-block">👋</span>
              </h1>
              <p className="text-white/50 mt-3 text-base max-w-md">
                Tus logros gastronómicos están listos para ser celebrados hoy.
              </p>
            </div>

            {/* Card de puntos + tier */}
            <div className="flex-shrink-0 bg-[#181413] border border-[#F2C777]/10 p-6 md:p-8 min-w-[280px] relative overflow-hidden">
              {/* Glow interior */}
              <div
                className="absolute inset-0 opacity-10 blur-2xl"
                style={{ background: currentTier.glow }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ color: currentTier.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {currentTier.icon}
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Tu nivel actual</p>
                    <p className="font-epilogue font-black text-lg text-white">{currentTier.label}</p>
                  </div>
                  <span
                    className="ml-auto font-black text-xs px-2 py-1 border"
                    style={{ color: currentTier.color, borderColor: `${currentTier.color}40` }}
                  >
                    {currentTier.multiplier}
                  </span>
                </div>

                {/* Puntos grandes */}
                <div className="mb-5">
                  <span className="font-epilogue font-black tabular-nums text-5xl text-[#F2C777]">
                    {USER_POINTS.toLocaleString('es-MX')}
                  </span>
                  <span className="ml-2 text-sm font-black uppercase tracking-widest text-[#F2C777]/50">pts</span>
                </div>

                {/* Barra de progreso */}
                {nextTier && (
                  <>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-white/40 mb-2">
                      <span>{currentTier.label}</span>
                      <span>{nextTier.label}</span>
                    </div>
                    <div className="relative h-1.5 bg-[#0D0D0D] rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`,
                          boxShadow: `0 0 8px ${currentTier.color}60`,
                        }}
                      />
                    </div>
                    <p className="text-white/40 text-xs">
                      Faltan <span className="text-[#F2C777] font-bold">{ptsToNext} pts</span> para {nextTier.label}
                    </p>
                  </>
                )}
                {!nextTier && (
                  <p className="text-[#D96725] font-black text-xs uppercase tracking-widest mt-2">
                    ✦ Nivel máximo alcanzado
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tabs ─── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex overflow-x-auto border-b border-[#F2C777]/10 mb-10 scrollbar-none">
          {([
            { key: 'dashboard', label: '📊 Resumen' },
            { key: 'recompensas', label: '🎁 Recompensas' },
            { key: 'historial', label: '📋 Historial' },
            { key: 'como-ganar', label: '💡 Cómo Ganar' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-5 py-4 font-epilogue font-black uppercase tracking-widest text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-[#F2C777] border-b-2 border-[#F2C777]'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════
            TAB: DASHBOARD
        ═══════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Stats rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: 'Puntos Totales', value: USER_POINTS.toLocaleString('es-MX'), unit: 'pts', icon: 'stars' },
                { label: 'Próximo nivel', value: nextTier ? ptsToNext.toString() : '—', unit: nextTier ? 'pts más' : 'Máximo', icon: 'trending_up' },
                { label: 'Visitas este mes', value: '3', unit: 'visitas', icon: 'store' },
                { label: 'Canjeos totales', value: '1', unit: 'recompensa', icon: 'redeem' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#181413] p-4 md:p-6 border border-[#F2C777]/8 hover:border-[#F2C777]/20 transition-colors">
                  <span className="material-symbols-outlined text-[#F2C777]/50 text-xl mb-3 block">{stat.icon}</span>
                  <p className="font-epilogue font-black text-2xl md:text-3xl text-white tabular-nums">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">{stat.unit}</p>
                  <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Escala de tiers */}
            <div className="bg-[#181413] p-6 md:p-8">
              <h2 className="font-epilogue font-black text-white uppercase tracking-tight text-xl mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F2C777]">military_tech</span>
                Escala de Prestigio
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tiers.map((tier) => {
                  const isActive = tier.key === currentTier.key;
                  return (
                    <div
                      key={tier.key}
                      className={`relative p-5 border transition-all duration-300 ${
                        isActive
                          ? 'border-opacity-60'
                          : 'border-white/8 opacity-50'
                      }`}
                      style={isActive ? { borderColor: `${tier.color}60`, boxShadow: `0 0 20px ${tier.glow}` } : {}}
                    >
                      {isActive && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#D96725] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest whitespace-nowrap">
                          Tu nivel
                        </div>
                      )}
                      <span
                        className="material-symbols-outlined text-4xl mb-3 block"
                        style={{ color: tier.color, fontVariationSettings: "'FILL' 1" }}
                      >
                        {tier.icon}
                      </span>
                      <p className="font-epilogue font-black text-white text-sm uppercase">{tier.label}</p>
                      <p className="text-[10px] font-bold mt-1" style={{ color: `${tier.color}99` }}>
                        {tier.maxPts ? `${tier.minPts.toLocaleString('es-MX')} – ${tier.maxPts.toLocaleString('es-MX')} pts` : `${tier.minPts.toLocaleString('es-MX')}+ pts`}
                      </p>
                      <p className="text-xs font-black mt-2" style={{ color: tier.color }}>{tier.multiplier} puntos</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="bg-[#181413] p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-epilogue font-black text-white uppercase tracking-tight text-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#F2C777]">history</span>
                  Actividad Reciente
                </h2>
                <button
                  onClick={() => setActiveTab('historial')}
                  className="text-xs font-black uppercase tracking-widest text-[#F2C777]/60 hover:text-[#F2C777] transition-colors flex items-center gap-1"
                >
                  Ver todo <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              <div className="space-y-1">
                {history.slice(0, 3).map((entry, i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-b border-[#F2C777]/8 last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      entry.type === 'earn' ? 'bg-emerald-500/15' :
                      entry.type === 'bonus' ? 'bg-[#F2C777]/15' : 'bg-red-500/15'
                    }`}>
                      <span className={`material-symbols-outlined text-base ${
                        entry.type === 'earn' ? 'text-emerald-400' :
                        entry.type === 'bonus' ? 'text-[#F2C777]' : 'text-red-400'
                      }`}>
                        {entry.type === 'earn' ? 'add_circle' : entry.type === 'bonus' ? 'star' : 'remove_circle'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{entry.title}</p>
                      <p className="text-white/40 text-xs">{entry.subtitle} · {entry.date}</p>
                    </div>
                    <PointsBadge points={entry.points} delta={entry.points} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
            TAB: RECOMPENSAS
        ═══════════════════════════════════ */}
        {activeTab === 'recompensas' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-epilogue font-black text-white uppercase tracking-tight text-2xl">Catálogo de Recompensas</h2>
                <p className="text-white/40 text-sm mt-1">Saldo disponible: <span className="text-[#F2C777] font-bold">{USER_POINTS.toLocaleString('es-MX')} pts</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const canRedeem = USER_POINTS >= reward.cost;
                const isSelected = selectedReward === reward.id;
                return (
                  <div
                    key={reward.id}
                    className={`relative bg-[#181413] p-6 border transition-all duration-300 group ${
                      canRedeem
                        ? 'border-[#F2C777]/15 hover:border-[#F2C777]/40 cursor-pointer'
                        : 'border-white/5 opacity-60'
                    } ${isSelected ? 'border-[#D96725]/60 shadow-[0_0_20px_rgba(217,103,37,0.15)]' : ''}`}
                    onClick={() => canRedeem && setSelectedReward(isSelected ? null : reward.id)}
                  >
                    {canRedeem && (
                      <span className="absolute top-3 right-3 bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-emerald-500/30">
                        Disponible
                      </span>
                    )}
                    <div className="text-4xl mb-4">{reward.icon}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#F2C777]/50 mb-1">{reward.category}</p>
                    <h3 className="font-epilogue font-black text-white text-lg uppercase tracking-tight mb-4">{reward.title}</h3>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono font-black text-[#F2C777] text-xl">
                        {reward.cost.toLocaleString('es-MX')} <span className="text-sm text-[#F2C777]/50">pts</span>
                      </span>
                      {canRedeem ? (
                        <button
                          type="button"
                          className="bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black text-xs px-4 py-2 transition-all active:scale-95"
                        >
                          Canjear
                        </button>
                      ) : (
                        <span className="text-white/20 text-xs font-bold">
                          Faltan {(reward.cost - USER_POINTS).toLocaleString('es-MX')} pts
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aviso */}
            <div className="bg-[#1C1B1B] border border-[#F2C777]/10 p-5 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#F2C777] text-xl flex-shrink-0 mt-0.5">info</span>
              <p className="text-white/40 text-sm leading-relaxed">
                Los canjes se aplican en tu próxima visita al restaurante o pedido. Válido hasta 30 días después del canje. No acumulable con otras promociones.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
            TAB: HISTORIAL
        ═══════════════════════════════════ */}
        {activeTab === 'historial' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h2 className="font-epilogue font-black text-white uppercase tracking-tight text-2xl">Historial de Puntos</h2>
              <div className="flex gap-2">
                {(['earn', 'bonus', 'redeem'] as const).map((type) => (
                  <span key={type} className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 border ${
                    type === 'earn' ? 'border-emerald-500/30 text-emerald-400' :
                    type === 'bonus' ? 'border-[#F2C777]/30 text-[#F2C777]' :
                    'border-red-500/30 text-red-400'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {type === 'earn' ? 'Ganados' : type === 'bonus' ? 'Bonus' : 'Canjeados'}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#181413] divide-y divide-[#F2C777]/8">
              {history.map((entry, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors">
                  {/* Icono */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    entry.type === 'earn' ? 'bg-emerald-500/15' :
                    entry.type === 'bonus' ? 'bg-[#F2C777]/15' : 'bg-red-500/15'
                  }`}>
                    <span className={`material-symbols-outlined text-lg ${
                      entry.type === 'earn' ? 'text-emerald-400' :
                      entry.type === 'bonus' ? 'text-[#F2C777]' : 'text-red-400'
                    }`}>
                      {entry.type === 'earn' ? 'add_circle' : entry.type === 'bonus' ? 'star' : 'remove_circle'}
                    </span>
                  </div>

                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">{entry.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{entry.subtitle}</p>
                  </div>

                  {/* Fecha */}
                  <p className="text-white/30 text-xs hidden md:block flex-shrink-0">{entry.date}</p>

                  {/* Puntos */}
                  <div className="text-right flex-shrink-0">
                    <p className={`font-mono font-black text-sm ${entry.points > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {entry.points > 0 ? '+' : ''}{entry.points} pts
                    </p>
                    <p className="text-white/30 text-xs">Saldo: {entry.balance.toLocaleString('es-MX')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════
            TAB: CÓMO GANAR
        ═══════════════════════════════════ */}
        {activeTab === 'como-ganar' && (
          <div className="space-y-10">
            <div>
              <h2 className="font-epilogue font-black text-white uppercase tracking-tight text-2xl mb-2">
                Cómo Acumular Puntos
              </h2>
              <p className="text-white/40 text-sm">Cada interacción con POP te acerca al siguiente nivel.</p>
            </div>

            {/* Grid de formas de ganar */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {earnWays.map((way, i) => (
                <div key={i} className="bg-[#181413] p-6 border border-[#F2C777]/8 hover:border-[#F2C777]/25 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#D96725]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D96725]/25 transition-colors">
                      <span className="material-symbols-outlined text-[#D96725] text-xl">{way.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-epilogue font-black text-white text-sm uppercase tracking-tight">{way.label}</p>
                        <span className="text-[#F2C777] font-mono font-black text-xs whitespace-nowrap">{way.pts}</span>
                      </div>
                      <p className="text-white/40 text-xs leading-relaxed">{way.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabla de beneficios por tier */}
            <div className="bg-[#181413] p-6 md:p-8">
              <h3 className="font-epilogue font-black text-white uppercase tracking-tight text-xl mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#F2C777]">table_chart</span>
                Beneficios por Nivel
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#F2C777]/10">
                      <th className="text-left text-[10px] font-black uppercase tracking-widest text-white/30 pb-4 pr-4">Beneficio</th>
                      {tiers.map((t) => (
                        <th key={t.key} className="text-center pb-4 px-2">
                          <span className="material-symbols-outlined text-xl block mx-auto" style={{ color: t.color, fontVariationSettings: "'FILL' 1" }}>{t.icon}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider block mt-1" style={{ color: t.color }}>{t.label.replace('POP ', '')}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2C777]/8">
                    {[
                      { benefit: 'Multiplicador de puntos', values: ['×1', '×1.1', '×1.25', '×1.5'] },
                      { benefit: 'Promo exclusiva mensual', values: ['—', '✓', '✓', '✓'] },
                      { benefit: 'Bebida gratis cumpleaños', values: ['—', '✓', '✓', '✓'] },
                      { benefit: 'Acceso temprano promos', values: ['—', '—', '✓', '✓'] },
                      { benefit: 'Rollo gratis (5 visitas)', values: ['—', '—', '✓', '✓'] },
                      { benefit: 'Mesa prioritaria', values: ['—', '—', '—', '✓'] },
                      { benefit: 'Buffet mensual gratis', values: ['—', '—', '—', '✓'] },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="text-white/50 text-sm py-3 pr-4">{row.benefit}</td>
                        {row.values.map((val, j) => (
                          <td key={j} className="text-center py-3 px-2">
                            <span className={`text-sm font-bold ${val === '✓' ? 'text-emerald-400' : val === '—' ? 'text-white/15' : 'text-[#F2C777] font-mono'}`}>
                              {val}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA registro */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#732817]/40 to-[#181413] border border-[#732817]/40 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="pointer-events-none absolute right-0 top-0 w-48 h-full opacity-10"
                style={{ background: 'radial-gradient(circle at right, #D96725, transparent)' }}
              />
              <div className="relative z-10">
                <p className="text-[#F2C777] font-black text-sm uppercase tracking-widest mb-2">¿Aún no tienes cuenta?</p>
                <h3 className="font-epilogue font-black text-white text-2xl uppercase tracking-tight">
                  Regístrate y gana <span className="text-[#F2C777]">50 pts</span> de bienvenida
                </h3>
              </div>
              <a
                href="/registro"
                className="relative z-10 flex-shrink-0 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest px-8 py-4 transition-all duration-300 active:scale-95 flex items-center gap-3"
              >
                Crear cuenta gratis
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
