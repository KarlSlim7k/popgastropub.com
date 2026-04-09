export default function AdminDashboardPage() {
  return (
    <main className="ml-64 pt-20 p-8 min-h-screen">
{/* Header Section */}
<div className="mb-10 flex justify-between items-end">
<div>
<h1 className="text-4xl font-black font-headline text-on-surface tracking-tighter uppercase">Central Control</h1>
<p className="text-on-surface-variant font-body mt-2">Real-time performance monitoring &amp; gastronomic oversight.</p>
</div>
<div className="flex gap-3">
<button className="bg-[#1C1B1B] text-primary px-4 py-2 text-sm font-bold uppercase tracking-widest border border-outline-variant hover:border-primary transition-all">Export Report</button>
<button className="bg-primary-container text-on-primary-container px-6 py-2 text-sm font-black uppercase tracking-widest hover:scale-[0.98] transition-transform">Live View</button>
</div>
</div>
{/* KPI Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
<div className="bg-surface-container-low p-6 border-l-4 border-primary">
<div className="flex justify-between items-start mb-4">
<span className="material-symbols-outlined text-primary" data-icon="group">group</span>
<span className="text-xs font-mono font-bold text-primary">+12%</span>
</div>
<h3 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Usuarios Totales</h3>
<p className="text-3xl font-black font-headline mt-2 mono-nums">1,540</p>
</div>
<div className="bg-surface-container-low p-6 border-l-4 border-secondary">
<div className="flex justify-between items-start mb-4">
<span className="material-symbols-outlined text-secondary" data-icon="receipt_long">receipt_long</span>
<span className="text-xs font-mono font-bold text-secondary">+5%</span>
</div>
<h3 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Pedidos del Mes</h3>
<p className="text-3xl font-black font-headline mt-2 mono-nums">840</p>
</div>
<div className="bg-surface-container-low p-6 border-l-4 border-tertiary">
<div className="flex justify-between items-start mb-4">
<span className="material-symbols-outlined text-tertiary" data-icon="token">token</span>
<span className="text-xs font-mono font-bold text-tertiary">Growth</span>
</div>
<h3 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Puntos Emitidos</h3>
<p className="text-3xl font-black font-headline mt-2 mono-nums">125,000</p>
</div>
<div className="bg-surface-container-low p-6 border-l-4 border-primary-container">
<div className="flex justify-between items-start mb-4">
<span className="material-symbols-outlined text-primary-container" data-icon="payments">payments</span>
<span className="text-xs font-mono font-bold text-primary-container">Live</span>
</div>
<h3 className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Ventas Bebidas</h3>
<p className="text-3xl font-black font-headline mt-2 mono-nums">$45,600</p>
</div>
</div>
{/* Graphs & Analytics Section */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
{/* Bar Chart: Pedidos por Día */}
<div className="lg:col-span-2 bg-surface-container-low p-8 relative overflow-hidden">
<div className="flex justify-between items-center mb-8">
<h2 className="text-xl font-black uppercase font-headline">Pedidos por Día</h2>
<div className="flex gap-2">
<button className="bg-[#2A2A2A] p-1 px-3 text-[10px] font-bold uppercase">7D</button>
<button className="bg-primary text-on-primary p-1 px-3 text-[10px] font-bold uppercase">30D</button>
</div>
</div>
<div className="h-64 flex items-end justify-between gap-2">
<div className="flex flex-col items-center gap-2 flex-1">
<div className="w-full bg-primary/20 h-[40%] relative group">
<div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="text-[10px] font-mono text-on-surface-variant">MON</span>
</div>
<div className="flex flex-col items-center gap-2 flex-1">
<div className="w-full bg-primary/20 h-[60%] relative group">
<div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="text-[10px] font-mono text-on-surface-variant">TUE</span>
</div>
<div className="flex flex-col items-center gap-2 flex-1">
<div className="w-full bg-primary/20 h-[55%] relative group">
<div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="text-[10px] font-mono text-on-surface-variant">WED</span>
</div>
<div className="flex flex-col items-center gap-2 flex-1">
<div className="w-full bg-primary/20 h-[85%] relative group">
<div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="text-[10px] font-mono text-on-surface-variant">THU</span>
</div>
<div className="flex flex-col items-center gap-2 flex-1">
<div className="w-full bg-primary/20 h-[70%] relative group">
<div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="text-[10px] font-mono text-on-surface-variant">FRI</span>
</div>
<div className="flex flex-col items-center gap-2 flex-1">
<div className="w-full bg-primary/20 h-[95%] relative group">
<div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="text-[10px] font-mono text-on-surface-variant">SAT</span>
</div>
<div className="flex flex-col items-center gap-2 flex-1">
<div className="w-full bg-primary/20 h-[80%] relative group">
<div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
<span className="text-[10px] font-mono text-on-surface-variant">SUN</span>
</div>
</div>
</div>
{/* Donut Chart: Top 5 Platillos */}
<div className="bg-surface-container-low p-8">
<h2 className="text-xl font-black uppercase font-headline mb-8">Top 5 Platillos</h2>
<div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
{/* Svg representation of a donut chart */}
<svg className="transform -rotate-90" viewBox="0 0 100 100">
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#E46F2D" strokeDasharray="120 251.2" strokeWidth="12"></circle>
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#EBC071" strokeDasharray="60 251.2" strokeDashoffset="-120" strokeWidth="12"></circle>
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#FFB4A3" strokeDasharray="40 251.2" strokeDashoffset="-180" strokeWidth="12"></circle>
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#353534" strokeDasharray="31.2 251.2" strokeDashoffset="-220" strokeWidth="12"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-2xl font-black font-headline">840</span>
<span className="text-[10px] uppercase text-on-surface-variant">Total Orders</span>
</div>
</div>
<ul className="space-y-3">
<li className="flex justify-between items-center text-xs">
<div className="flex items-center gap-2">
<span className="w-3 h-3 bg-primary-container rounded-sm"></span>
<span className="font-bold">Perote Burger Supreme</span>
</div>
<span className="font-mono">45%</span>
</li>
<li className="flex justify-between items-center text-xs">
<div className="flex items-center gap-2">
<span className="w-3 h-3 bg-secondary rounded-sm"></span>
<span className="font-bold">Tacos de Ribeye</span>
</div>
<span className="font-mono">25%</span>
</li>
<li className="flex justify-between items-center text-xs">
<div className="flex items-center gap-2">
<span className="w-3 h-3 bg-tertiary rounded-sm"></span>
<span className="font-bold">Pasta Obsidian</span>
</div>
<span className="font-mono">15%</span>
</li>
</ul>
</div>
</div>
{/* Secondary Data Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
{/* Top 5 Meseros del Mes */}
<div className="lg:col-span-2 bg-surface-container-low p-8">
<div className="flex justify-between items-center mb-6">
<h2 className="text-xl font-black uppercase font-headline">Top 5 Meseros del Mes</h2>
<span className="material-symbols-outlined text-secondary" data-icon="workspace_premium">workspace_premium</span>
</div>
<table className="w-full text-left">
<thead>
<tr className="border-b border-[#2A2A2A] text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
<th className="pb-4">Name</th>
<th className="pb-4">Orders Served</th>
<th className="pb-4">Avg. Rating</th>
<th className="pb-4 text-right">Points</th>
</tr>
</thead>
<tbody className="text-sm">
<tr className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
<td className="py-4 font-bold flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-[#353534] flex items-center justify-center text-[10px]">RG</div>
                                Ricardo G.
                            </td>
<td className="py-4 font-mono">142</td>
<td className="py-4">
<div className="flex items-center text-secondary">
<span className="material-symbols-outlined text-xs" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="ml-1 text-xs">4.9</span>
</div>
</td>
<td className="py-4 text-right font-mono text-primary">2,450</td>
</tr>
<tr className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
<td className="py-4 font-bold flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-[#353534] flex items-center justify-center text-[10px]">SL</div>
                                Sofía L.
                            </td>
<td className="py-4 font-mono">128</td>
<td className="py-4">
<div className="flex items-center text-secondary">
<span className="material-symbols-outlined text-xs" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="ml-1 text-xs">4.8</span>
</div>
</td>
<td className="py-4 text-right font-mono text-primary">1,920</td>
</tr>
<tr className="border-b border-[#2A2A2A]/50 hover:bg-[#2A2A2A]/30 transition-colors">
<td className="py-4 font-bold flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-[#353534] flex items-center justify-center text-[10px]">MA</div>
                                Marco A.
                            </td>
<td className="py-4 font-mono">115</td>
<td className="py-4">
<div className="flex items-center text-secondary">
<span className="material-symbols-outlined text-xs" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="ml-1 text-xs">4.7</span>
</div>
</td>
<td className="py-4 text-right font-mono text-primary">1,680</td>
</tr>
</tbody>
</table>
</div>
{/* Recent Activity Timeline */}
<div className="bg-surface-container-low p-8">
<h2 className="text-xl font-black uppercase font-headline mb-8">Recent Activity</h2>
<div className="space-y-8 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
<div className="relative pl-10">
<div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-primary-container ring-4 ring-surface shadow-[0_0_10px_#e46f2d]"></div>
<p className="text-xs font-bold uppercase tracking-widest text-primary-container">Nuevo Registro</p>
<p className="text-sm font-bold mt-1">Juan P. has joined the circle</p>
<p className="text-[10px] text-on-surface-variant font-mono mt-1">2 MINS AGO</p>
</div>
<div className="relative pl-10">
<div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface"></div>
<p className="text-xs font-bold uppercase tracking-widest text-secondary">Canje de Premio</p>
<p className="text-sm font-bold mt-1">Margarita (via Sofía L.)</p>
<p className="text-[10px] text-on-surface-variant font-mono mt-1">15 MINS AGO</p>
</div>
<div className="relative pl-10">
<div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-tertiary ring-4 ring-surface"></div>
<p className="text-xs font-bold uppercase tracking-widest text-tertiary">Meta Alcanzada</p>
<p className="text-sm font-bold mt-1">Ricardo G. hit Daily Sales Goal</p>
<p className="text-[10px] text-on-surface-variant font-mono mt-1">1 HOUR AGO</p>
</div>
</div>
</div>
</div>
{/* Menu Management Preview */}
<section className="bg-surface-container-low p-8">
<div className="flex justify-between items-center mb-8">
<div>
<h2 className="text-2xl font-black uppercase font-headline">Menu Management Preview</h2>
<p className="text-sm text-on-surface-variant">Live menu status and pricing control.</p>
</div>
<button className="flex items-center gap-2 bg-[#2A2A2A] px-4 py-2 text-xs font-bold uppercase hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                    Add Item
                </button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="border-b border-[#2A2A2A] text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
<th className="pb-6">Dish / Image</th>
<th className="pb-6">Category</th>
<th className="pb-6">Price</th>
<th className="pb-6">Stock Level</th>
<th className="pb-6 text-right">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-[#2A2A2A]/50">
<tr>
<td className="py-6">
<div className="flex items-center gap-4">
<div className="w-16 h-12 bg-[#2A2A2A] rounded-sm overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" data-alt="extreme close-up of a juicy gourmet burger with melting cheese and dark editorial lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACdV_8vgzax1oA92g_CZnQXfq8bR7UFYRJvv4yiuZUU6JkBsX3vsL7xwKyunXuF0kQtfSJ8Y8GHagXImCepO7UeNkRvjG-g_hNBBomovQFKF7KdakijvFyj8GwzGuaUFU0T2SNykQBRNL5VNvyl70uH4FazdNrN_Zsuf5JhJm2fRFzW-_CKzD7_p6wNbX25p5pjRhG-Mfl9P4KkXsei_LUuL6mWPXQkTmRx1Qj6YytUSMNIhYnF70aVv5HFYxYSQSdXYt5UMLr2UcJ"/>
</div>
<div>
<p className="font-bold font-headline">Perote Burger Supreme</p>
<p className="text-[10px] text-on-surface-variant uppercase">ID: POP-001</p>
</div>
</div>
</td>
<td className="py-6">
<span className="bg-[#2A2A2A] px-2 py-1 text-[10px] font-bold uppercase">Main Course</span>
</td>
<td className="py-6 font-mono font-bold">$18.50</td>
<td className="py-6">
<div className="w-24 bg-surface-variant h-1 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[85%]"></div>
</div>
<p className="text-[10px] text-on-surface-variant mt-1">High Demand</p>
</td>
<td className="py-6 text-right">
<button className="relative inline-flex items-center h-5 w-10 rounded-full bg-primary transition-colors focus:outline-none">
<span className="inline-block w-3 h-3 transform translate-x-6 bg-surface rounded-full transition-transform"></span>
</button>
<span className="ml-2 text-[10px] font-bold uppercase text-primary">Activo</span>
</td>
</tr>
<tr>
<td className="py-6">
<div className="flex items-center gap-4">
<div className="w-16 h-12 bg-[#2A2A2A] rounded-sm overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" data-alt="vibrant healthy mediterranean salad bowl in a dark ceramic bowl with moody lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwyRAe5r18Tmt-7fxNlLg9VFntmhHSqBnVH5PSGjN1qx-qCb-IzgZ-X9IB7vKiRi1zUohlWjb-e-rpA98DjGC-m3tSiI7RCkOOXcnTyLzIoaFG-fx9gJi06VYd0y2-W_iRUyaOZgnPAWs_eV10FSj7-XDDyndSFkPzQkjLphRBm0jtQVrkciALPn7lf_XcrYqBZoTNjx1fIQ-yKQnQWnu2wS-g4yLLxj7lyG7GixuUeazEJHGJCHPeUv-l4hLJrG0UaFRJ9a_GqUPn"/>
</div>
<div>
<p className="font-bold font-headline">Zen Garden Bowl</p>
<p className="text-[10px] text-on-surface-variant uppercase">ID: POP-004</p>
</div>
</div>
</td>
<td className="py-6">
<span className="bg-[#2A2A2A] px-2 py-1 text-[10px] font-bold uppercase">Salads</span>
</td>
<td className="py-6 font-mono font-bold">$14.00</td>
<td className="py-6">
<div className="w-24 bg-surface-variant h-1 rounded-full overflow-hidden">
<div className="bg-tertiary h-full w-[30%]"></div>
</div>
<p className="text-[10px] text-on-surface-variant mt-1">Restock Needed</p>
</td>
<td className="py-6 text-right">
<button className="relative inline-flex items-center h-5 w-10 rounded-full bg-primary transition-colors focus:outline-none">
<span className="inline-block w-3 h-3 transform translate-x-6 bg-surface rounded-full transition-transform"></span>
</button>
<span className="ml-2 text-[10px] font-bold uppercase text-primary">Activo</span>
</td>
</tr>
<tr>
<td className="py-6">
<div className="flex items-center gap-4">
<div className="w-16 h-12 bg-[#2A2A2A] rounded-sm overflow-hidden flex-shrink-0">
<img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" data-alt="elegant crystal glass with premium whiskey and clear ice sphere on dark mahogany table" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6iU7R6UVHRWrhpwfI3MIGD88wT61TP26SGVA2BHabYdOHBQVgHNKV5eBmUeY3yx8-RUizeZdh--F7aVYKOV5q3NxHYHy3XmlqH4WC-haL3UbVFlOCl3HLpSyjE7huaZ_vUKonXipwumFKKlVph81jGrTxeTZ37am6DK0-EdddQ4jiUgd6txc-jS3URZW5Q7wpMrEpiJuzXdH-m1Uz4hFsxcvuKtQ6eqK6cxHqqgyyMwpsvuI5BDOZDZomqQbSFw8mrw6XiES39hh7"/>
</div>
<div>
<p className="font-bold font-headline">Old Fashioned Perote</p>
<p className="text-[10px] text-on-surface-variant uppercase">ID: POP-088</p>
</div>
</div>
</td>
<td className="py-6">
<span className="bg-[#2A2A2A] px-2 py-1 text-[10px] font-bold uppercase">Cocktails</span>
</td>
<td className="py-6 font-mono font-bold">$12.50</td>
<td className="py-6">
<div className="w-24 bg-surface-variant h-1 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[100%]"></div>
</div>
<p className="text-[10px] text-on-surface-variant mt-1">Full Stock</p>
</td>
<td className="py-6 text-right">
<button className="relative inline-flex items-center h-5 w-10 rounded-full bg-surface-variant transition-colors focus:outline-none">
<span className="inline-block w-3 h-3 transform translate-x-1 bg-on-surface-variant rounded-full transition-transform"></span>
</button>
<span className="ml-2 text-[10px] font-bold uppercase text-on-surface-variant">Inactivo</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
</main>
  );
}
