import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'POP Perote | Dashboard Cliente',
  description: 'Tu espacio gastronómico exclusivo en POP Perote. Consulta tus puntos, pedidos y reservas.',
};

export default function DashboardClientePage() {
  return (
    <div className="dark">
      {/* TopNavBar */}
      <nav className="bg-stone-950/80 backdrop-blur-md fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 shadow-2xl shadow-orange-900/10">
        <div className="text-xl font-black text-orange-500 font-epilogue uppercase tracking-widest">Pop Perote</div>
        <div className="hidden md:flex items-center space-x-12">
          <a className="font-epilogue uppercase text-sm tracking-widest text-stone-400 hover:text-orange-300 transition-colors" href="#">Explorar</a>
          <a className="font-epilogue uppercase text-sm tracking-widest text-orange-400 border-b-2 border-orange-500 pb-1" href="#">Mi Mesa</a>
          <a className="font-epilogue uppercase text-sm tracking-widest text-stone-400 hover:text-orange-300 transition-colors" href="#">Carta</a>
          <a className="font-epilogue uppercase text-sm tracking-widest text-stone-400 hover:text-orange-300 transition-colors" href="#">Historial</a>
        </div>
        <div className="flex items-center space-x-6">
          <button className="text-stone-400 hover:text-orange-300 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-stone-400 hover:text-orange-300 transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl md:text-7xl font-black font-epilogue tracking-tighter text-on-surface">¡Hola, Sofía! 👋</h1>
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-epilogue text-[10px] font-bold uppercase tracking-widest rounded-lg">VIP Member</span>
            </div>
            <p className="text-stone-500 font-body text-lg max-w-md">Es un placer tenerte de vuelta en tu espacio gastronómico exclusivo.</p>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <span className="text-orange-400 font-epilogue text-4xl font-black tabular-nums">1,250</span>
            <span className="text-stone-500 font-epilogue uppercase text-xs tracking-[0.2em]">Puntos Acumulados</span>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Main Content Area (Column 1-8) */}
          <div className="md:col-span-8 space-y-12">
            {/* Quick Actions Grid */}
            <section>
              <h2 className="text-stone-500 font-epilogue uppercase text-[10px] tracking-widest mb-6 px-1">Acciones Rápidas</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="glass-card p-6 flex flex-col items-start gap-4 hover:bg-stone-900 transition-all duration-300 group">
                  <span className="material-symbols-outlined text-orange-400 text-3xl group-hover:scale-110 transition-transform">receipt_long</span>
                  <span className="font-epilogue font-bold text-sm">Mis Pedidos</span>
                </button>
                <button className="glass-card p-6 flex flex-col items-start gap-4 hover:bg-stone-900 transition-all duration-300 group">
                  <span className="material-symbols-outlined text-orange-400 text-3xl group-hover:scale-110 transition-transform">description</span>
                  <span className="font-epilogue font-bold text-sm">Factura (CFDI)</span>
                </button>
                <button className="glass-card p-6 flex flex-col items-start gap-4 hover:bg-stone-900 transition-all duration-300 group border-primary-container/20">
                  <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-110 transition-transform">stars</span>
                  <span className="font-epilogue font-bold text-sm">POP Points</span>
                </button>
                <button className="glass-card p-6 flex flex-col items-start gap-4 hover:bg-stone-900 transition-all duration-300 group">
                  <span className="material-symbols-outlined text-orange-400 text-3xl group-hover:scale-110 transition-transform">table_restaurant</span>
                  <span className="font-epilogue font-bold text-sm">Reservar</span>
                </button>
              </div>
            </section>

            {/* Points Tier Section */}
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-stone-500 font-epilogue uppercase text-[10px] tracking-widest px-1">Estado POP Points</h2>
                <a href="/puntos" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Ver todo</a>
              </div>
              <div className="bg-surface-container-low p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-secondary font-epilogue font-black text-3xl">POP VIP</div>
                    <div className="text-stone-400 text-sm mt-1">Nivel actual</div>
                  </div>
                  <div className="text-right">
                    <div className="text-on-surface font-bold text-xl tabular-nums">1,250</div>
                    <div className="text-stone-500 text-xs uppercase tracking-widest">de 1,500 para Elite</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-stone-500 uppercase tracking-widest">
                    <span>Progreso</span>
                    <span>83%</span>
                  </div>
                  <div className="h-2 bg-stone-900 w-full overflow-hidden rounded-full">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-secondary w-[83%] rounded-full" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-stone-900/50 p-4 rounded">
                    <div className="text-xs text-stone-500 uppercase tracking-widest mb-1">Puntos ganados este mes</div>
                    <div className="text-secondary font-black text-2xl tabular-nums">+340</div>
                  </div>
                  <div className="bg-stone-900/50 p-4 rounded">
                    <div className="text-xs text-stone-500 uppercase tracking-widest mb-1">Visitas este mes</div>
                    <div className="text-on-surface font-black text-2xl tabular-nums">3</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Orders */}
            <section className="space-y-6">
              <h2 className="text-stone-500 font-epilogue uppercase text-[10px] tracking-widest px-1">Últimos Pedidos</h2>
              <div className="space-y-3">
                {/* Order 1 */}
                <div className="glass-card p-5 flex items-center justify-between group hover:bg-stone-900 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500/10 flex items-center justify-center rounded">
                      <span className="material-symbols-outlined text-orange-400 text-xl">ramen_dining</span>
                    </div>
                    <div>
                      <div className="font-epilogue font-bold text-sm">Roll California + 2 piezas extras</div>
                      <div className="text-xs text-stone-500 uppercase tracking-wider">Oct 12 • $2,450 MXN</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-green-900/30 text-green-400">Completado</span>
                    <button className="text-stone-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">description</span>
                    </button>
                  </div>
                </div>
                {/* Order 2 */}
                <div className="glass-card p-5 flex items-center justify-between group hover:bg-stone-900 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500/10 flex items-center justify-center rounded">
                      <span className="material-symbols-outlined text-orange-400 text-xl">ramen_dining</span>
                    </div>
                    <div>
                      <div className="font-epilogue font-bold text-sm">Wings Teriyaki + Boneless BBQ</div>
                      <div className="text-xs text-stone-500 uppercase tracking-wider">Oct 5 • $1,210 MXN</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-blue-900/30 text-blue-400">En Camino</span>
                    <button className="text-stone-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">description</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Status Tracker */}
              <div className="bg-surface-container-low p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-epilogue font-bold uppercase tracking-widest text-sm">Rastreo de Pedido Activo</h3>
                  <span className="text-[10px] text-secondary uppercase tracking-widest font-bold">En Preparación</span>
                </div>
                <div className="relative flex justify-between">
                  <div className="absolute top-2 left-0 right-0 h-[2px] bg-stone-800">
                    <div className="h-full bg-secondary w-1/3" />
                  </div>
                  {[
                    { label: 'Confirmado', active: true },
                    { label: 'Preparando', active: true },
                    { label: 'En Camino', active: false },
                    { label: 'Entregado', active: false },
                  ].map((step) => (
                    <div key={step.label} className="relative z-10 flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-4 border-surface-container-low ${step.active ? 'bg-secondary' : 'bg-stone-800'}`} />
                      <span className="text-[10px] font-epilogue mt-3 text-stone-500 uppercase tracking-tighter">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Datos Fiscales y Facturas Recientes */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-stone-500 font-epilogue uppercase text-[10px] tracking-widest px-1">Datos Fiscales</h2>
                <div className="bg-surface-container-low p-6 flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                    <span className="text-stone-400 text-sm">RFC</span>
                    <span className="font-mono text-secondary font-bold">SOFJ880421H34</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                    <span className="text-stone-400 text-sm">Razón Social</span>
                    <span className="text-on-surface text-sm font-bold">Sofía Jiménez Pérez</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-stone-400 text-sm">Uso CFDI</span>
                    <span className="text-on-surface text-sm">Gastos en general</span>
                  </div>
                  <button className="mt-4 text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                    Editar Perfil Fiscal <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-stone-500 font-epilogue uppercase text-[10px] tracking-widest px-1">Facturas Recientes</h2>
                <div className="space-y-3">
                  <div className="glass-card p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-stone-900">
                        <span className="material-symbols-outlined text-stone-500">picture_as_pdf</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold">Consumo 12/Oct</div>
                        <div className="text-[10px] text-stone-500 uppercase">$2,450.00 MXN</div>
                      </div>
                    </div>
                    <button className="text-orange-400">
                      <span className="material-symbols-outlined">download</span>
                    </button>
                  </div>
                  <div className="glass-card p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-stone-900">
                        <span className="material-symbols-outlined text-stone-500">picture_as_pdf</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold">Consumo 05/Oct</div>
                        <div className="text-[10px] text-stone-500 uppercase">$1,210.00 MXN</div>
                      </div>
                    </div>
                    <button className="text-orange-400">
                      <span className="material-symbols-outlined">download</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Content (Column 9-12) */}
          <aside className="md:col-span-4 space-y-12">
            {/* Reservation Card */}
            <section className="space-y-6">
              <h2 className="text-stone-500 font-epilogue uppercase text-[10px] tracking-widest px-1">Próxima Reserva</h2>
              <div className="relative overflow-hidden group">
                <div className="h-48 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Atmospheric dimly lit high-end restaurant dining room with dark wood furniture and warm amber lighting"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuJxJQ8Yov3h-rdfOh-roeN8Dr0XdASO8zeHu0GW4xfjKjjskW7777abibu0ipYE_K8YdM1H2vw8OC-gQ8IAbr-3MFjlXgmUKc0_jSMBHLMfjUj_cUcizUEUevg9XGWs-Jys5nJzBSrTqKISNwz8BR-yrbGzJ41pg-mYoHWl9r3Zl5W0RBuIBUho_pptkY3fX1UPiTegonwOl8osxZI7Xju7afX4rpA1_flW2-GbC4PNNRHwpCw_brDqYQbgXQTioe-BjVlbWal7AG"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent p-6 flex flex-col justify-end">
                  <div className="text-orange-400 font-epilogue font-black text-2xl mb-1">Viernes, 20 Oct</div>
                  <div className="text-stone-300 text-sm font-bold">20:30 hrs • 4 Personas</div>
                  <div className="flex gap-2 mt-4">
                    <button className="px-4 py-2 bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all">Modificar</button>
                    <button className="px-4 py-2 border border-stone-700 text-stone-300 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-900 transition-all">Cancelar</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Loyalty Snapshot */}
            <section className="bg-surface-container-high p-8">
              <h2 className="text-stone-500 font-epilogue uppercase text-[10px] tracking-widest mb-6">Loyalty Program</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="font-epilogue text-3xl font-black text-secondary">POP VIP</span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-widest pb-1">250 pts para Elite</span>
                </div>
                <div className="h-1 bg-stone-900 w-full overflow-hidden">
                  <div className="h-full bg-secondary w-3/4" />
                </div>
                <p className="text-xs text-stone-400 italic">Disfrutas de +25% puntos, roll gratis cada 5 visitas y acceso anticipado a promociones.</p>
                <button className="w-full py-3 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest hover:bg-secondary/5 transition-all">
                  Ver todos mis beneficios
                </button>
              </div>
            </section>

            {/* Config Section */}
            <section className="space-y-4">
              <h2 className="text-stone-500 font-epilogue uppercase text-[10px] tracking-widest px-1">Configuración</h2>
              <div className="space-y-1">
                <a className="flex items-center gap-4 p-4 hover:bg-stone-900 transition-colors group" href="#">
                  <span className="material-symbols-outlined text-stone-500 group-hover:text-primary transition-colors">manage_accounts</span>
                  <span className="text-sm font-bold">Perfil de Usuario</span>
                </a>
                <a className="flex items-center gap-4 p-4 hover:bg-stone-900 transition-colors group" href="#">
                  <span className="material-symbols-outlined text-stone-500 group-hover:text-primary transition-colors">credit_card</span>
                  <span className="text-sm font-bold">Métodos de Pago</span>
                </a>
                <a className="flex items-center gap-4 p-4 hover:bg-stone-900 transition-colors group" href="#">
                  <span className="material-symbols-outlined text-stone-500 group-hover:text-primary transition-colors">shield_person</span>
                  <span className="text-sm font-bold">Privacidad y Seguridad</span>
                </a>
                <a className="flex items-center gap-4 p-4 hover:bg-stone-900 transition-colors group text-error/80" href="#">
                  <span className="material-symbols-outlined">logout</span>
                  <span className="text-sm font-bold">Cerrar Sesión</span>
                </a>
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Bottom NavBar – Solo móvil */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-stone-950 z-50 shadow-[0_-10px_40px_rgba(217,103,37,0.08)]">
        <a className="flex flex-col items-center justify-center text-stone-500 font-epilogue text-[10px] hover:text-orange-200" href="/">
          <span className="material-symbols-outlined mb-1">home</span>
          Inicio
        </a>
        <a className="flex flex-col items-center justify-center text-stone-500 font-epilogue text-[10px] hover:text-orange-200" href="/menu">
          <span className="material-symbols-outlined mb-1">restaurant</span>
          Menú
        </a>
        <a className="flex flex-col items-center justify-center text-stone-500 font-epilogue text-[10px] hover:text-orange-200" href="/facturacion">
          <span className="material-symbols-outlined mb-1">shopping_bag</span>
          Factura
        </a>
        <a className="flex flex-col items-center justify-center text-orange-400 bg-stone-900 rounded-xl px-4 py-1 font-epilogue text-[10px]" href="/dashboard/puntos">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          Perfil
        </a>
      </nav>
    </div>
  );
}
