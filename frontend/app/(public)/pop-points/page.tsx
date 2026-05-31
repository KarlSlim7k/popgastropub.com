import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'POP Points | Programa de Lealtad | POP Perote',
  description: 'Gana puntos con cada visita y canjéalos por recompensas exclusivas. Únete al programa POP Points.',
};

const TIERS = [
  { name: 'POP Fan', range: '0 – 499 pts', color: '#F2C894', benefits: ['Promos básicas', '1 pt por cada $10 MXN', 'Check-in 25 pts'] },
  { name: 'POP Lover', range: '500 – 1,499 pts', color: '#F2C777', benefits: ['+10% puntos extra', 'Promo mensual exclusiva', 'Bebida gratis en cumpleaños'] },
  { name: 'POP VIP', range: '1,500 – 2,999 pts', color: '#D96725', benefits: ['+25% puntos extra', 'Roll gratis cada 5 visitas', 'Acceso anticipado a promos'] },
  { name: 'POP Elite', range: '3,000+ pts', color: '#732817', benefits: ['+50% puntos extra', 'Reservación prioritaria', 'Invitación a eventos', '1 buffet gratis/mes'] },
];

const EARN_ACTIONS = [
  { action: 'Registro', pts: '50 pts', icon: 'person_add' },
  { action: 'Por cada $10 MXN', pts: '1 pt', icon: 'payments' },
  { action: 'Check-in en restaurante', pts: '25 pts', icon: 'location_on' },
  { action: 'Reseña en Google', pts: '100 pts', icon: 'star' },
  { action: 'Referir un amigo', pts: '200 pts', icon: 'group_add' },
  { action: 'Día de baja afluencia', pts: '2x pts', icon: 'calendar_today' },
  { action: 'Cumpleaños', pts: '150 pts', icon: 'cake' },
  { action: 'Compartir en redes', pts: '30 pts', icon: 'share' },
];

export default function PuntosPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-20 pb-32">
      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F2C777]/5 blur-[150px] rounded-full" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#F2C777]/60 mb-4 block">Programa de Lealtad</span>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-none mb-6">
            POP <span className="text-[#F2C777]">Points</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Gana puntos con cada visita, sube de nivel y desbloquea recompensas exclusivas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login?tab=register" className="inline-flex items-center gap-2 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest text-sm px-10 py-5 rounded-sm transition-all duration-300">
              <span className="material-symbols-outlined">stars</span>
              Únete Gratis — Gana 50 pts
            </a>
            <a href="/login" className="inline-flex items-center gap-2 border border-[#F2C777]/20 text-[#F2C777] font-bold text-sm px-8 py-5 rounded-sm hover:bg-[#F2C777]/10 transition-all">
              Ya tengo cuenta
            </a>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter text-center mb-4">Niveles de Membresía</h2>
        <p className="text-white/50 text-center mb-16 max-w-lg mx-auto">Mientras más puntos acumules, mejores beneficios desbloqueas.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((tier) => (
            <div key={tier.name} className="bg-[#1C1C1C] border border-white/5 rounded-xl p-8 hover:border-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-full mb-6 flex items-center justify-center" style={{ backgroundColor: `${tier.color}20` }}>
                <span className="material-symbols-outlined text-2xl" style={{ color: tier.color }}>stars</span>
              </div>
              <h3 className="text-xl font-black text-white mb-1">{tier.name}</h3>
              <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: tier.color }}>{tier.range}</p>
              <ul className="space-y-3">
                {tier.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-white/60 text-sm">
                    <span className="material-symbols-outlined text-sm mt-0.5" style={{ color: tier.color }}>check</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How to Earn */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter text-center mb-4">Cómo Ganar Puntos</h2>
        <p className="text-white/50 text-center mb-16 max-w-lg mx-auto">Múltiples formas de acumular puntos en cada interacción con POP.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EARN_ACTIONS.map((item) => (
            <div key={item.action} className="bg-[#1C1C1C] border border-white/5 rounded-lg p-6 flex flex-col items-center text-center hover:border-[#F2C777]/20 transition-all">
              <span className="material-symbols-outlined text-[#F2C777] text-3xl mb-3">{item.icon}</span>
              <p className="text-white font-bold text-sm mb-1">{item.action}</p>
              <p className="text-[#F2C777] font-black text-lg">{item.pts}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="text-4xl font-black text-white tracking-tighter text-center mb-16">¿Cómo Funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: '01', title: 'Regístrate', desc: 'Crea tu cuenta gratis y recibe 50 puntos de bienvenida.', icon: 'person_add' },
            { step: '02', title: 'Acumula', desc: 'Gana puntos con cada compra, check-in y acción en la plataforma.', icon: 'trending_up' },
            { step: '03', title: 'Canjea', desc: 'Usa tus puntos para obtener recompensas exclusivas y descuentos.', icon: 'redeem' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="relative mx-auto mb-6 w-16 h-16 bg-[#1C1C1C] border border-[#F2C777]/15 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#F2C777] text-2xl">{s.icon}</span>
                <span className="absolute -top-2 -right-2 text-[10px] font-black bg-[#D96725] text-white px-2 py-0.5 rounded-full">{s.step}</span>
              </div>
              <h3 className="text-white font-black text-lg mb-2">{s.title}</h3>
              <p className="text-white/50 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-[#1C1C1C] to-[#0D0D0D] border border-[#F2C777]/10 rounded-2xl p-12 md:p-16">
          <span className="material-symbols-outlined text-[#F2C777] text-6xl mb-6">loyalty</span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Empieza a ganar hoy</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">Regístrate en menos de 30 segundos y comienza a acumular puntos desde tu primera visita.</p>
          <a href="/login?tab=register" className="inline-flex items-center gap-2 bg-[#D96725] hover:bg-[#F2C777] hover:text-[#0D0D0D] text-white font-black uppercase tracking-widest text-sm px-12 py-5 rounded-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,103,37,0.3)]">
            Crear Cuenta Gratis
          </a>
        </div>
      </section>
    </main>
  );
}
