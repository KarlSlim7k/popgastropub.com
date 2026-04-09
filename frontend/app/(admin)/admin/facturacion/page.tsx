export default function AdminFacturacionPage() {
  return (
    <main className="ml-64 mt-[60px] p-8 min-h-screen">
{/* Section 1: KPIs Dashboard */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
{/* KPI 1 */}
<div className="bg-surface-container-low p-6 rounded-lg border-l-4 border-primary">
<div className="flex items-center justify-between mb-4">
<span className="material-symbols-outlined text-primary">description</span>
<span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">+12% vs last month</span>
</div>
<p className="text-outline text-xs uppercase tracking-widest font-bold">Facturas del mes</p>
<h3 className="text-3xl font-black mt-2">1,284</h3>
</div>
{/* KPI 2 */}
<div className="bg-surface-container-low p-6 rounded-lg border-l-4 border-secondary">
<div className="flex items-center justify-between mb-4">
<span className="material-symbols-outlined text-secondary">pending_actions</span>
<span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">Urgent</span>
</div>
<p className="text-outline text-xs uppercase tracking-widest font-bold">Pendientes</p>
<h3 className="text-3xl font-black mt-2">42</h3>
</div>
{/* KPI 3 */}
<div className="bg-surface-container-low p-6 rounded-lg border-l-4 border-[#4CAF50]">
<div className="flex items-center justify-between mb-4">
<span className="material-symbols-outlined text-[#4CAF50]">task_alt</span>
</div>
<p className="text-outline text-xs uppercase tracking-widest font-bold">Timbradas</p>
<h3 className="text-3xl font-black mt-2">1,235</h3>
</div>
{/* KPI 4 */}
<div className="bg-surface-container-low p-6 rounded-lg border-l-4 border-error">
<div className="flex items-center justify-between mb-4">
<span className="material-symbols-outlined text-error">error_outline</span>
</div>
<p className="text-outline text-xs uppercase tracking-widest font-bold">Errores</p>
<h3 className="text-3xl font-black mt-2">7</h3>
</div>
</div>
{/* Charts & Asymmetric Layout */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
{/* Weekly Chart */}
<div className="lg:col-span-2 bg-surface-container-low p-8 rounded-lg">
<div className="flex justify-between items-center mb-8">
<h2 className="text-xl font-black uppercase tracking-tight">Actividad Semanal</h2>
<div className="flex gap-2">
<span className="flex items-center gap-1 text-[10px] uppercase font-bold text-primary"><span className="w-2 h-2 rounded-full bg-primary"></span> Timbradas</span>
<span className="flex items-center gap-1 text-[10px] uppercase font-bold text-outline"><span className="w-2 h-2 rounded-full bg-outline"></span> Errores</span>
</div>
</div>
<div className="h-64 flex items-end justify-between gap-4">
{/* Simple Bar Representation for "Editorial" look */}
<div className="flex flex-col items-center flex-1 gap-2">
<div className="w-full bg-surface-container-high relative rounded-t-sm" style={{height: '60%'}}>
<div className="absolute bottom-0 w-full bg-primary rounded-t-sm" style={{height: '80%'}}></div>
</div>
<span className="text-[10px] font-bold text-outline uppercase">Lun</span>
</div>
<div className="flex flex-col items-center flex-1 gap-2">
<div className="w-full bg-surface-container-high relative rounded-t-sm" style={{height: '75%'}}>
<div className="absolute bottom-0 w-full bg-primary rounded-t-sm" style={{height: '90%'}}></div>
</div>
<span className="text-[10px] font-bold text-outline uppercase">Mar</span>
</div>
<div className="flex flex-col items-center flex-1 gap-2">
<div className="w-full bg-surface-container-high relative rounded-t-sm" style={{height: '40%'}}>
<div className="absolute bottom-0 w-full bg-primary rounded-t-sm" style={{height: '70%'}}></div>
</div>
<span className="text-[10px] font-bold text-outline uppercase">Mie</span>
</div>
<div className="flex flex-col items-center flex-1 gap-2">
<div className="w-full bg-surface-container-high relative rounded-t-sm" style={{height: '90%'}}>
<div className="absolute bottom-0 w-full bg-primary rounded-t-sm" style={{height: '95%'}}></div>
</div>
<span className="text-[10px] font-bold text-outline uppercase">Jue</span>
</div>
<div className="flex flex-col items-center flex-1 gap-2">
<div className="w-full bg-surface-container-high relative rounded-t-sm" style={{height: '55%'}}>
<div className="absolute bottom-0 w-full bg-primary rounded-t-sm" style={{height: '85%'}}></div>
</div>
<span className="text-[10px] font-bold text-outline uppercase">Vie</span>
</div>
<div className="flex flex-col items-center flex-1 gap-2">
<div className="w-full bg-surface-container-high relative rounded-t-sm" style={{height: '30%'}}>
<div className="absolute bottom-0 w-full bg-primary rounded-t-sm" style={{height: '90%'}}></div>
</div>
<span className="text-[10px] font-bold text-outline uppercase">Sab</span>
</div>
<div className="flex flex-col items-center flex-1 gap-2">
<div className="w-full bg-surface-container-high relative rounded-t-sm" style={{height: '20%'}}>
<div className="absolute bottom-0 w-full bg-primary rounded-t-sm" style={{height: '60%'}}></div>
</div>
<span className="text-[10px] font-bold text-outline uppercase">Dom</span>
</div>
</div>
</div>
{/* Stamping Costs / PAC Status */}
<div className="bg-primary-container text-on-primary-container p-8 rounded-lg flex flex-col justify-between">
<div>
<h2 className="text-xl font-black uppercase tracking-tight mb-2">Consumo PAC</h2>
<p className="text-xs opacity-80 leading-relaxed">Costo total de timbrado acumulado este mes seg\u00fan el proveedor seleccionado.</p>
</div>
<div className="mt-8">
<p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Total del Periodo</p>
<h4 className="text-4xl font-black tabular-nums">$2,840.50</h4>
</div>
<div className="mt-8 pt-6 border-t border-on-primary-container/20">
<div className="flex justify-between items-center text-xs">
<span>Saldo disponible</span>
<span className="font-bold">14,200 Folios</span>
</div>
<div className="w-full bg-on-primary-container/20 h-1 mt-2 rounded-full overflow-hidden">
<div className="bg-on-primary-container h-full w-2/3"></div>
</div>
</div>
</div>
</div>
{/* Section 2: Table Section */}
<div className="bg-surface-container-low rounded-lg overflow-hidden mb-10">
<div className="p-6 flex flex-wrap justify-between items-center gap-4">
<h2 className="text-xl font-black uppercase tracking-tight">Solicitudes de Facturaci\u00f3n</h2>
<div className="flex gap-3">
<button className="bg-surface-container-high px-4 py-2 text-xs font-bold uppercase tracking-wider rounded border border-outline-variant/15 flex items-center gap-2 hover:bg-surface-bright transition-all">
<span className="material-symbols-outlined text-sm">filter_list</span> Filtrar
                    </button>
<button className="bg-[#D96725] px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-primary rounded flex items-center gap-2 hover:brightness-110 transition-all">
<span className="material-symbols-outlined text-sm">sync</span> Sincronizar
                    </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-surface-container-high/50 text-[10px] uppercase font-bold text-outline tracking-widest">
<tr>
<th className="px-6 py-4">Folio</th>
<th className="px-6 py-4">Cliente / RFC</th>
<th className="px-6 py-4">Monto</th>
<th className="px-6 py-4">Fecha</th>
<th className="px-6 py-4">Estado</th>
<th className="px-6 py-4 text-right">Acciones</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/10">
<tr className="hover:bg-surface-container-high/30 transition-colors">
<td className="px-6 py-4 font-bold text-sm text-secondary">#PP-8821</td>
<td className="px-6 py-4">
<p className="font-bold text-sm">Gastronom\u00eda Avanzada S.A.</p>
<p className="text-xs text-outline">GAV920301-RT4</p>
</td>
<td className="px-6 py-4 font-mono font-bold text-sm tabular-nums">$14,500.00</td>
<td className="px-6 py-4 text-xs text-outline">12 Oct 2023, 14:30</td>
<td className="px-6 py-4">
<span className="bg-[#4CAF50]/10 text-[#4CAF50] text-[10px] font-bold px-2 py-1 rounded uppercase">Timbrado</span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-2 hover:text-secondary" title="Ver detalle"><span className="material-symbols-outlined text-lg">visibility</span></button>
<button className="p-2 hover:text-secondary" title="Reenviar"><span className="material-symbols-outlined text-lg">mail</span></button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-high/30 transition-colors">
<td className="px-6 py-4 font-bold text-sm text-secondary">#PP-8822</td>
<td className="px-6 py-4">
<p className="font-bold text-sm">Juan P\u00e9rez L\u00f3pez</p>
<p className="text-xs text-outline">PELJ850412-HX5</p>
</td>
<td className="px-6 py-4 font-mono font-bold text-sm tabular-nums">$2,140.00</td>
<td className="px-6 py-4 text-xs text-outline">12 Oct 2023, 15:10</td>
<td className="px-6 py-4">
<span className="bg-[#F2C777]/10 text-[#F2C777] text-[10px] font-bold px-2 py-1 rounded uppercase">Pendiente</span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="bg-[#D96725] px-3 py-1 text-[10px] font-black uppercase rounded text-on-primary">Timbrar Manual</button>
<button className="p-2 hover:text-secondary" title="Ver detalle"><span className="material-symbols-outlined text-lg">visibility</span></button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-high/30 transition-colors">
<td className="px-6 py-4 font-bold text-sm text-secondary">#PP-8823</td>
<td className="px-6 py-4">
<p className="font-bold text-sm">Distribuidora Perote</p>
<p className="text-xs text-outline">DPE100822-AA1</p>
</td>
<td className="px-6 py-4 font-mono font-bold text-sm tabular-nums">$450.00</td>
<td className="px-6 py-4 text-xs text-outline">12 Oct 2023, 16:45</td>
<td className="px-6 py-4">
<span className="bg-error/10 text-error text-[10px] font-bold px-2 py-1 rounded uppercase">Error</span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="bg-error/20 px-3 py-1 text-[10px] font-black uppercase rounded text-error border border-error/30">Corregir</button>
<button className="p-2 hover:text-secondary" title="Ver detalle"><span className="material-symbols-outlined text-lg">visibility</span></button>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-high/30 transition-colors">
<td className="px-6 py-4 font-bold text-sm text-secondary">#PP-8824</td>
<td className="px-6 py-4">
<p className="font-bold text-sm">Maria Elena Robles</p>
<p className="text-xs text-outline">ROEM901105-B33</p>
</td>
<td className="px-6 py-4 font-mono font-bold text-sm tabular-nums">$3,890.00</td>
<td className="px-6 py-4 text-xs text-outline">12 Oct 2023, 17:02</td>
<td className="px-6 py-4">
<span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase">Procesando</span>
</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<span className="material-symbols-outlined animate-spin text-primary">autorenew</span>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Section 3: PAC Configuration */}
<div className="bg-surface-container-low p-8 rounded-lg">
<h2 className="text-xl font-black uppercase tracking-tight mb-8">Configuraci\u00f3n del PAC (Facturaci\u00f3n)</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
<div className="space-y-6">
<div className="group">
<label className="text-[10px] uppercase font-bold text-outline block mb-2">Proveedor de Timbrado</label>
<select className="w-full bg-surface-container-high border-none border-b border-outline-variant/30 text-on-surface py-3 focus:ring-0 focus:border-secondary transition-all">
<option>Facturama (Recomendado)</option>
<option>Finkok</option>
<option>SW Sapien</option>
</select>
</div>
<div className="group">
<label className="text-[10px] uppercase font-bold text-outline block mb-2">API Public Key</label>
<input className="w-full bg-surface-container-high border-none border-b border-outline-variant/30 text-on-surface py-3 focus:ring-0 focus:border-secondary transition-all" type="password" defaultValue="*************************"/>
</div>
<div className="group">
<label className="text-[10px] uppercase font-bold text-outline block mb-2">API Private Key</label>
<input className="w-full bg-surface-container-high border-none border-b border-outline-variant/30 text-on-surface py-3 focus:ring-0 focus:border-secondary transition-all" type="password" defaultValue="*************************"/>
</div>
</div>
<div className="bg-surface-container-high p-6 rounded-lg border border-outline-variant/10 flex flex-col justify-between">
<div>
<div className="flex items-center gap-3 mb-4">
<div className="w-12 h-12 bg-secondary/10 flex items-center justify-center rounded">
<span className="material-symbols-outlined text-secondary text-3xl">verified_user</span>
</div>
<div>
<h4 className="font-bold">Estatus de Conexi\u00f3n</h4>
<p className="text-xs text-[#4CAF50] font-bold flex items-center gap-1">
<span className="w-2 h-2 rounded-full bg-[#4CAF50]"></span> Activo y Operacional
                                </p>
</div>
</div>
<p className="text-xs text-outline leading-relaxed">La integraci\u00f3n con Facturama est\u00e1 utilizando el ambiente de Producci\u00f3n (CFDI 4.0). El certificado de sello digital expira en 280 d\u00edas.</p>
</div>
<div className="mt-8">
<button className="w-full py-3 bg-secondary text-on-secondary text-xs font-black uppercase tracking-widest rounded hover:bg-secondary/90 transition-all">Guardar Configuraci\u00f3n</button>
</div>
</div>
</div>
</div>
    </main>
  );
}