import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'POP BAR STARS | Dashboard Mesero',
  description: 'Panel de rendimiento para meseros de POP Perote. Consulta tus puntos, ranking y metas del mes.',
};

export default function RankingMeseroDashboardPage() {
  return (
    <div className="dark min-h-screen bg-[#0D0D0D] text-on-surface font-body">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-stone-950 border-r border-stone-800/50 p-6 flex-col hidden md:flex z-40">
        {/* Logo */}
        <div className="mb-10">
          <div className="text-xl font-black text-orange-500 font-epilogue uppercase tracking-widest">POP</div>
          <div className="text-[10px] text-stone-500 uppercase tracking-widest font-epilogue">Bar Stars System</div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 flex-1">
          <a className="flex items-center gap-3 px-4 py-3 text-orange-400 bg-stone-900/50 font-bold transition-all duration-300 rounded-lg group" href="#">
            <span className="material-symbols-outlined text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-epilogue tracking-tight">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:bg-stone-900 hover:text-white transition-all duration-300 rounded-lg group" href="#">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="font-epilogue tracking-tight">Reservaciones</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:bg-stone-900 hover:text-white transition-all duration-300 rounded-lg group" href="#">
            <span className="material-symbols-outlined">restaurant_menu</span>
            <span className="font-epilogue tracking-tight">Menú</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:bg-stone-900 hover:text-white transition-all duration-300 rounded-lg group" href="#">
            <span className="material-symbols-outlined">group</span>
            <span className="font-epilogue tracking-tight">Staff</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:bg-stone-900 hover:text-white transition-all duration-300 rounded-lg group" href="#">
            <span className="material-symbols-outlined">monitoring</span>
            <span className="font-epilogue tracking-tight">Analíticas</span>
          </a>
        </nav>

        {/* Profile Footer */}
        <div className="mt-auto pt-6 border-t border-stone-800/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-orange-500/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Ricardo S. – Mesero POP Perote"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7Kofx4LF_-ijlo739yBenoYaYbXzvXZrKihDJhdxiKnNZsxaa6OUlkZJMkFRMaFIZ2uZcEaOZipLxcZbYt_GQQhRgtanKtpjgqzmCj1J2XfRZd0kq_5i87qZZyZ_9wyKi4moTL3opdrtI1HnWO2w6Ajtz1ef7nbiSrMrmld4zTiv7NBZEQtHsJ5bYc13kQrw_OLrTYe9uKH3HXEz3q0SklYPWYfcEL87iMJzT0XGNFEEGQSPaJjSYlGiUPZUoiaizQwb9nHV-CTVB"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Ricardo S.</p>
            <p className="text-[10px] text-orange-400 uppercase tracking-widest">Master Mesero</p>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="md:ml-64 p-4 md:p-8 pb-32">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface tracking-tighter mb-2 italic">¡Hola, Ricardo! 🌟</h1>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Turno: Activo
              </span>
              <span className="text-on-surface-variant text-sm font-light">ID: #MZ-8829-POP</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-surface-container-high text-on-surface text-sm font-bold tracking-tight hover:bg-surface-bright transition-all border border-outline-variant/30">
              CHECK-OUT
            </button>
            <button className="px-8 py-3 bg-primary-container text-on-primary-container text-sm font-black tracking-tight hover:shadow-[0_0_20px_rgba(228,111,45,0.3)] transition-all">
              RESERVACIÓN NUEVA
            </button>
          </div>
        </header>

        {/* Bento Grid Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="md:col-span-1 glass-card p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary opacity-50">table_restaurant</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Hoy</span>
            </div>
            <div className="mt-8">
              <p className="text-4xl font-black tabular-nums">14</p>
              <p className="text-sm text-on-surface-variant font-medium">Mesas atendidas</p>
            </div>
          </div>
          <div className="md:col-span-1 glass-card p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary opacity-50">wine_bar</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ventas</span>
            </div>
            <div className="mt-8">
              <p className="text-4xl font-black tabular-nums">42</p>
              <p className="text-sm text-on-surface-variant font-medium">Bebidas vendidas</p>
            </div>
          </div>
          <div className="md:col-span-2 bg-gradient-to-br from-primary-container to-tertiary-container p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-500">
              <span className="material-symbols-outlined text-9xl">stars</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-on-primary-container">star</span>
              <span className="text-[10px] font-black text-on-primary-container uppercase tracking-widest">Bar Stars Loyalty</span>
            </div>
            <div className="mt-8">
              <p className="text-5xl font-black text-on-primary-container tabular-nums">2,840</p>
              <p className="text-sm text-on-primary-container/80 font-bold">Puntos Totales Ganados</p>
            </div>
          </div>
        </section>

        {/* Orders Kanban + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Kanban */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
                <span className="w-1 h-6 bg-primary" />
                Pedidos en Tiempo Real
              </h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant">LISTA</span>
                <span className="px-2 py-1 bg-primary text-on-primary rounded text-[10px] font-bold">KANBAN</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pending */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Pendiente (2)</span>
                </div>
                <div className="glass-card p-4 border-l-2 border-l-stone-600">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm">Mesa 04</span>
                    <span className="text-[10px] font-mono text-stone-500">#441</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4">2x Old Fashioned, 1x Tartare</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-stone-500">schedule</span>
                    <span className="text-[10px] text-stone-500">Hace 4 min</span>
                  </div>
                </div>
                <div className="glass-card p-4 border-l-2 border-l-stone-600">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm">Mesa 12</span>
                    <span className="text-[10px] font-mono text-stone-500">#445</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4">1x Ribeye, 1x Vino Tinto</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-stone-500">schedule</span>
                    <span className="text-[10px] text-stone-500">Hace 1 min</span>
                  </div>
                </div>
              </div>
              {/* Prepping */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Preparando (1)</span>
                </div>
                <div className="glass-card p-4 border-l-2 border-l-orange-500 bg-orange-500/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm">Mesa 08</span>
                    <span className="text-[10px] font-mono text-stone-500">#439</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4">3x Margarita Hibisco, 2x Wings</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-orange-500">local_fire_department</span>
                    <span className="text-[10px] text-orange-500">+30 pts esperados</span>
                  </div>
                </div>
              </div>
              {/* Ready */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Listo (1)</span>
                </div>
                <div className="glass-card p-4 border-l-2 border-l-green-500 bg-green-500/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm">Mesa 03</span>
                    <span className="text-[10px] font-mono text-stone-500">#436</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-4">4x Sushi Rolls, 2x Cocktails</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-green-400">check_circle</span>
                    <span className="text-[10px] text-green-400">Listo para entregar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Ranking + Badges */}
          <aside className="space-y-8">
            {/* Live Ranking */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold mb-6 tracking-widest uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>leaderboard</span>
                Ranking en Vivo
              </h3>
              <div className="space-y-2">
                {/* 1st Place */}
                <div className="flex items-center justify-between p-3 bg-secondary/10 border border-secondary/30">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-secondary">1</span>
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-[8px] font-bold text-secondary">SV</div>
                    <span className="text-xs font-bold text-secondary">Sofía V.</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-secondary">3,120</span>
                </div>
                {/* 2nd Place – Current user */}
                <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-primary">2</span>
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">RS</div>
                    <span className="text-xs font-bold text-primary">Ricardo S.</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-primary">2,840</span>
                </div>
                {/* 3rd Place */}
                <div className="flex items-center justify-between p-3 bg-stone-900/50">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-stone-500">3</span>
                    <div className="w-6 h-6 rounded-full bg-stone-700/50 flex items-center justify-center text-[8px] font-bold text-stone-400">ML</div>
                    <span className="text-xs font-bold text-on-surface/70">Marcos L.</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-stone-400">2,310</span>
                </div>
                {/* 4th Place */}
                <div className="flex items-center justify-between p-3 bg-stone-900/30">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-stone-500">4</span>
                    <div className="w-6 h-6 rounded-full bg-stone-700/50 flex items-center justify-center text-[8px] font-bold text-stone-400">ET</div>
                    <span className="text-xs font-bold text-on-surface/50">Elena T.</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-stone-500">1,890</span>
                </div>
              </div>
            </div>

            {/* Monthly Badges */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold mb-6 tracking-widest uppercase">Badges del Mes</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center border-2 border-secondary/20 group-hover:scale-110 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_bar</span>
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">Queen Margarita</span>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 group-hover:scale-110 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">5 Stars Mesero</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                  <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center border-2 border-dashed border-stone-700">
                    <span className="material-symbols-outlined text-stone-500 text-3xl">timer</span>
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">Punctuality Pro</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                  <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center border-2 border-dashed border-stone-700">
                    <span className="material-symbols-outlined text-stone-500 text-3xl">receipt_long</span>
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">Sales Shark</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* History & Feed */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shift History Table */}
          <div className="lg:col-span-2 glass-card overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
              <h3 className="text-sm font-bold tracking-widest uppercase">Historial de Turno</h3>
              <button className="flex items-center gap-2 text-[10px] font-bold text-primary hover:underline">
                <span className="material-symbols-outlined text-xs">download</span> EXPORTAR REPORTE
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Hora</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Mesa</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Productos</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4 text-xs tabular-nums">20:15</td>
                  <td className="px-6 py-4 text-xs font-bold">T-04</td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">3 Drinks, 1 Entrada</td>
                  <td className="px-6 py-4 text-xs font-bold tabular-nums">$1,240.00</td>
                  <td className="px-6 py-4 text-xs text-primary font-bold">+120</td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4 text-xs tabular-nums">19:42</td>
                  <td className="px-6 py-4 text-xs font-bold">T-09</td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">5 Platos, 5 Drinks</td>
                  <td className="px-6 py-4 text-xs font-bold tabular-nums">$4,850.00</td>
                  <td className="px-6 py-4 text-xs text-primary font-bold">+480</td>
                </tr>
                <tr className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4 text-xs tabular-nums">19:10</td>
                  <td className="px-6 py-4 text-xs font-bold">T-11</td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">2 Drinks</td>
                  <td className="px-6 py-4 text-xs font-bold tabular-nums">$420.00</td>
                  <td className="px-6 py-4 text-xs text-primary font-bold">+40</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* System Notifications */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-bold mb-6 tracking-widest uppercase">Notificaciones del Sistema</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-sm">campaign</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Alerta: Restock Bar</p>
                  <p className="text-[10px] text-stone-500 mt-1">Mezcal &quot;Don Julio&quot; stock bajo. Informar a los clientes antes de tomar la orden.</p>
                  <span className="text-[8px] text-stone-600 mt-2 block">HACE 10 MIN</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">celebration</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">¡Flash Bonus!</p>
                  <p className="text-[10px] text-stone-500 mt-1">Puntos dobles por cada cóctel &quot;Summer Sunset&quot; vendido en la próxima hora.</p>
                  <span className="text-[8px] text-stone-600 mt-2 block">HACE 25 MIN</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-stone-500 text-sm">schedule</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Estado Cocina</p>
                  <p className="text-[10px] text-stone-500 mt-1">Sección grill con alta capacidad. Demora en cortes +15 min.</p>
                  <span className="text-[8px] text-stone-600 mt-2 block">HACE 45 MIN</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom NavBar – Solo móvil */}
      <nav className="fixed bottom-0 left-0 w-full flex md:hidden justify-around items-center px-4 pb-6 pt-2 bg-stone-950 shadow-[0_-10px_40px_rgba(217,103,37,0.08)] z-50">
        <a className="flex flex-col items-center justify-center text-orange-400 bg-stone-900 rounded-xl px-4 py-1" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-epilogue text-[10px]">Inicio</span>
        </a>
        <a className="flex flex-col items-center justify-center text-stone-500 hover:text-orange-200 transition-colors" href="#">
          <span className="material-symbols-outlined">restaurant</span>
          <span className="font-epilogue text-[10px]">Pedidos</span>
        </a>
        <a className="flex flex-col items-center justify-center text-stone-500 hover:text-orange-200 transition-colors" href="#">
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="font-epilogue text-[10px]">Ranking</span>
        </a>
        <a className="flex flex-col items-center justify-center text-stone-500 hover:text-orange-200 transition-colors" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="font-epilogue text-[10px]">Perfil</span>
        </a>
      </nav>
    </div>
  );
}
