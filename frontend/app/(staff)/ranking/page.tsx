import Image from 'next/image';

export default function RankingPage() {
  return (
    <main className="pt-20 pb-24 md:pb-12 md:pl-64 min-h-screen px-6 md:px-12 bg-surface">
{/* Staff Header Section */}
<section className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-center border-b border-surface-container-high mb-8">
<div className="lg:col-span-5 flex items-center gap-6">
<div className="relative">
<div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-secondary via-primary to-transparent">
<img className="w-full h-full rounded-full object-cover" data-alt="professional headshot of a friendly waiter in dark modern restaurant uniform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkENiruVzKXJcyA9U_yr4Vg6acgmPfqCD_DFn7Rpg2fgMywIOglHHbq__Gsrd0J1hSNsWCqcFMJjPHU-g866_H8TSIH9SKZ50wFHWvYvlP8BFyd0kSIDkiaAtkfF0-zHlS8eI6QqrD1BrMBsyAnMbGDI3emBcYGohvOMcFjWUXttKB1YP9pH-rqbOlwMJGxHFI38WX2CBu-k1jetw5yQRDXhapEyYnaSIA9rRfHs4vYYdtBL5T9keBiI3HKSuRzM2L1jZQDZfH86uL"/>
</div>
<div className="absolute -bottom-1 -right-1 bg-secondary text-surface text-xs font-black p-1 rounded-full shadow-lg">
<span className="material-symbols-outlined text-[16px]" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
</div>
</div>
<div>
<h2 className="text-3xl font-headline font-black text-on-surface tracking-tight">¡Hola, Ricardo! 🌟</h2>
<p className="text-on-surface/60 font-medium mt-1">Sigue así, estás cerca de la cima.</p>
</div>
</div>
<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
<div className="glass-card p-4 rounded-lg flex flex-col justify-center">
<span className="text-xs uppercase tracking-widest text-secondary font-bold mb-1">Current Points</span>
<span className="text-4xl font-headline font-black monospaced-stat text-on-surface">850 pts</span>
</div>
<div className="glass-card p-4 rounded-lg flex flex-col justify-center">
<span className="text-xs uppercase tracking-widest text-secondary font-bold mb-1">Ranking Position</span>
<div className="flex items-end gap-2">
<span className="text-4xl font-headline font-black monospaced-stat text-on-surface">#2 de 8</span>
<span className="material-symbols-outlined text-green-400 mb-1" data-icon="trending_up">trending_up</span>
</div>
</div>
<div className="glass-card p-4 rounded-lg flex flex-col justify-center hidden sm:flex">
<span className="text-xs uppercase tracking-widest text-secondary font-bold mb-1">Next Reward</span>
<span className="text-sm font-headline font-bold text-on-surface truncate">Voucher Cena Premium</span>
<div className="w-full bg-surface-container-high h-1 mt-2 rounded-full overflow-hidden">
<div className="bg-primary w-3/4 h-full"></div>
</div>
</div>
</div>
</section>
{/* Staggered Layout for Goals and Badges */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
{/* Monthly Goals */}
<div className="lg:col-span-1 space-y-6">
<div className="flex items-center justify-between">
<h3 className="text-xl font-headline font-black uppercase tracking-tight">Metas Mensuales</h3>
<span className="material-symbols-outlined text-secondary/40" data-icon="calendar_month">calendar_month</span>
</div>
<div className="space-y-8">
<div>
<div className="flex justify-between items-center mb-2">
<span className="text-sm font-bold uppercase tracking-widest text-on-surface/80">Bebidas Meta (12/15)</span>
<span className="text-sm monospaced-stat text-secondary font-bold">80%</span>
</div>
<div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary-container to-secondary w-[80%]"></div>
</div>
</div>
<div>
<div className="flex justify-between items-center mb-2">
<span className="text-sm font-bold uppercase tracking-widest text-on-surface/80">Calificación Clientes (4.8/5.0)</span>
<span className="text-sm monospaced-stat text-secondary font-bold">96%</span>
</div>
<div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary-container to-secondary w-[96%]"></div>
</div>
</div>
<div className="p-6 bg-primary-container/10 border border-primary-container/20 rounded-lg">
<p className="text-sm text-primary leading-relaxed">
<span className="font-bold">¡Tip de Estrella!</span> Ofrece la nueva <i>Margarita de Hibisco</i> como aperitivo para completar tu meta de bebidas esta semana.
                        </p>
</div>
</div>
</div>
{/* Badges & Achievements */}
<div className="lg:col-span-2 space-y-6">
<div className="flex items-center justify-between">
<h3 className="text-xl font-headline font-black uppercase tracking-tight">Insignias &amp; Logros</h3>
<span className="text-sm font-bold text-secondary uppercase tracking-widest">Ver Todo</span>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
{/* Achievement: Reina Margarita */}
<div className="glass-card p-4 rounded-xl flex flex-col items-center text-center group cursor-pointer hover:bg-secondary/10 transition-colors">
<div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-secondary text-3xl" data-icon="crown" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
</div>
<span className="text-[10px] uppercase font-black tracking-tighter leading-tight">Reina Margarita</span>
</div>
{/* Achievement: Racha de 5 días */}
<div className="glass-card p-4 rounded-xl flex flex-col items-center text-center group cursor-pointer hover:bg-secondary/10 transition-colors">
<div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-primary text-3xl" data-icon="local_fire_department" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
</div>
<span className="text-[10px] uppercase font-black tracking-tighter leading-tight">Racha 5 Días</span>
</div>
{/* Achievement: 5 Estrellas */}
<div className="glass-card p-4 rounded-xl flex flex-col items-center text-center group cursor-pointer hover:bg-secondary/10 transition-colors">
<div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-secondary text-3xl" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<span className="text-[10px] uppercase font-black tracking-tighter leading-tight">5 Estrellas</span>
</div>
{/* Locked Achievement 1 */}
<div className="bg-surface-container-low/50 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center opacity-40 grayscale">
<div className="w-16 h-16 bg-on-surface/10 rounded-full flex items-center justify-center mb-3 relative">
<span className="material-symbols-outlined text-on-surface/40 text-3xl" data-icon="cocktail">liquor</span>
<span className="material-symbols-outlined absolute top-0 right-0 text-xs text-on-surface" data-icon="lock">lock</span>
</div>
<span className="text-[10px] uppercase font-black tracking-tighter leading-tight">Mixólogo POP</span>
</div>
{/* Locked Achievement 2 */}
<div className="bg-surface-container-low/50 border border-white/5 p-4 rounded-xl flex flex-col items-center text-center opacity-40 grayscale">
<div className="w-16 h-16 bg-on-surface/10 rounded-full flex items-center justify-center mb-3 relative">
<span className="material-symbols-outlined text-on-surface/40 text-3xl" data-icon="diamond" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
<span className="material-symbols-outlined absolute top-0 right-0 text-xs text-on-surface" data-icon="lock">lock</span>
</div>
<span className="text-[10px] uppercase font-black tracking-tighter leading-tight">Barra de Oro</span>
</div>
</div>
</div>
</div>
{/* Full Ranking Podium */}
<section className="mb-12">
<h3 className="text-2xl font-headline font-black uppercase tracking-tight mb-8 text-center">Podio del Mes</h3>
<div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 max-w-4xl mx-auto">
{/* 2nd Place */}
<div className="w-full md:w-1/3 flex flex-col items-center">
<div className="relative mb-4">
<img className="w-20 h-20 rounded-full border-4 border-slate-400" data-alt="close up profile of a waiter in a charcoal restaurant uniform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmXgmaKvBT10WRkAiRu5P1pVaxn9uMe4scNtzWLDyobTc0zo6U9CSX91vkIqugR2-hbShEzU5QTOBktm-SulSZoIS3YKaWvIg3MPKqRdE9kjTQyOI4HTxjjYQ_KPrEV4IZ-znzpDZxNEsrVJAKqvMMvZHuO3xx3VfROIiIQDBIr6lFQ0dBMa91hSPmnk1YJEuLMjH3-1e281g589hy8FO_vgi2JNxCzi7h0bFSYmFlbGGL51-b7EuyNtSPvb8Nlu1uCfz83J29gWWq"/>
<div className="absolute -top-2 -right-2 bg-slate-400 text-surface text-xs font-black w-6 h-6 flex items-center justify-center rounded-full">2</div>
</div>
<div className="text-center mb-2">
<div className="font-headline font-bold text-on-surface">Ricardo G.</div>
<div className="text-xs monospaced-stat text-secondary">850 pts</div>
</div>
<div className="w-full bg-slate-800 h-32 rounded-t-xl flex items-center justify-center">
<span className="material-symbols-outlined text-slate-500/30 text-6xl" data-icon="military_tech">military_tech</span>
</div>
</div>
{/* 1st Place */}
<div className="w-full md:w-1/3 flex flex-col items-center z-10">
<div className="relative mb-4 scale-110">
<div className="absolute -top-12 left-1/2 -translate-x-1/2">
<span className="material-symbols-outlined text-secondary text-5xl" data-icon="crown" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
</div>
<img className="w-24 h-24 rounded-full border-4 border-secondary" data-alt="professional male staff portrait with confident smile in editorial style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB5h0XECwNOMX4MFj7aikwYlrIMnvM4A1vIuNZf6F-541bEu3WEK7drIz2dG-GhF8zxVT5zBrjpc5t2EJuyvqZvWyZY_L_bAea2kyl3ou_Ag9blEj5TkhGSjBjawoqHulwjFz1OllXoOKHKeCUEMj4Wx6Es-LQtOJzrRKOElrxHmnw18e7lYQBNIFBboslwOdCsjAtk7LMk3bxrCtZeeQUlZU9ciOM34juZl19bOZxVwux1cvs_Q39Y7kNel5Gy7iQX5WufBQckVk6"/>
<div className="absolute -top-2 -right-2 bg-secondary text-surface text-xs font-black w-8 h-8 flex items-center justify-center rounded-full shadow-lg shadow-secondary/20">1</div>
</div>
<div className="text-center mb-4">
<div className="font-headline font-black text-secondary text-xl">Sofía V.</div>
<div className="text-sm monospaced-stat text-on-surface font-bold">1,020 pts</div>
</div>
<div className="w-full bg-gradient-to-b from-secondary to-secondary-container h-48 rounded-t-xl flex items-center justify-center shadow-[0_-10px_40px_rgba(235,192,113,0.15)]">
<span className="material-symbols-outlined text-on-secondary/40 text-8xl" data-icon="workspace_premium" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
</div>
</div>
{/* 3rd Place */}
<div className="w-full md:w-1/3 flex flex-col items-center">
<div className="relative mb-4">
<img className="w-20 h-20 rounded-full border-4 border-amber-800" data-alt="side profile of a male server in a clean white shirt under dark warm restaurant lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8pKytxzlHd2qY17DzjH_CeA4Ao2NnsPHCm3XHtyycrWpCdw1kpj3wiybZ03R2ps3eGYymypsL2s98Zs2O1bHV8Y-eKuVjNJ_aAgMiEmJ4WEAVZgQ0BgWVrsbJgCHETzvBwzXg7myF5xAJI1zAmxzgH8pex9Ut7qdXp1TZzi9wI0u-TBlOtQNHiI7YmuH99W7OLFZYPnAIim9mdKrLithiBLj7tWpDDCJ9VwUwOoUGk_1Af6SFxl7xfknvewTF0VYPsGFjdHkEhdm3"/>
<div className="absolute -top-2 -right-2 bg-amber-800 text-on-surface text-xs font-black w-6 h-6 flex items-center justify-center rounded-full">3</div>
</div>
<div className="text-center mb-2">
<div className="font-headline font-bold text-on-surface">Marcos L.</div>
<div className="text-xs monospaced-stat text-secondary">790 pts</div>
</div>
<div className="w-full bg-amber-950/40 h-24 rounded-t-xl flex items-center justify-center">
<span className="material-symbols-outlined text-amber-900/30 text-6xl" data-icon="award_star">award_star</span>
</div>
</div>
</div>
</section>
{/* Stats & Ranking Table Combined */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
{/* Rest of Ranking (Table) */}
<div className="xl:col-span-8 bg-surface-container-low rounded-xl overflow-hidden">
<div className="p-6 border-b border-surface-container-high flex justify-between items-center">
<h3 className="font-headline font-black uppercase tracking-tight">Clasificación General</h3>
<span className="text-xs text-on-surface/40 uppercase tracking-widest">Actualizado hace 2 min</span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-surface-container text-[10px] uppercase tracking-widest font-black text-secondary">
<tr>
<th className="px-6 py-4">#</th>
<th className="px-6 py-4">Staff</th>
<th className="px-6 py-4">Puntos</th>
<th className="px-6 py-4 text-center">Insignia Top</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container-high">
{/* Row 4 */}
<tr className="hover:bg-surface-container-high/50 transition-colors">
<td className="px-6 py-4 monospaced-stat font-bold text-on-surface/60">04</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-variant flex-shrink-0"></div>
<span className="font-headline font-semibold text-sm">Elena Torres</span>
</div>
</td>
<td className="px-6 py-4 monospaced-stat text-secondary font-bold">710</td>
<td className="px-6 py-4 text-center">
<span className="material-symbols-outlined text-primary text-xl" data-icon="flash_on">flash_on</span>
</td>
</tr>
{/* Row 5 */}
<tr className="hover:bg-surface-container-high/50 transition-colors">
<td className="px-6 py-4 monospaced-stat font-bold text-on-surface/60">05</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-variant flex-shrink-0"></div>
<span className="font-headline font-semibold text-sm">Pablo Méndez</span>
</div>
</td>
<td className="px-6 py-4 monospaced-stat text-secondary font-bold">650</td>
<td className="px-6 py-4 text-center">
<span className="material-symbols-outlined text-on-surface/30 text-xl" data-icon="thumb_up">thumb_up</span>
</td>
</tr>
{/* Row 6 */}
<tr className="hover:bg-surface-container-high/50 transition-colors">
<td className="px-6 py-4 monospaced-stat font-bold text-on-surface/60">06</td>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-variant flex-shrink-0"></div>
<span className="font-headline font-semibold text-sm">Diana Cruz</span>
</div>
</td>
<td className="px-6 py-4 monospaced-stat text-secondary font-bold">590</td>
<td className="px-6 py-4 text-center">
<span className="material-symbols-outlined text-on-surface/30 text-xl" data-icon="timer">timer</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* History & Stats */}
<div className="xl:col-span-4 space-y-8">
{/* Point Graph Placeholder */}
<div className="glass-card p-6 rounded-xl">
<h4 className="text-xs uppercase font-black tracking-widest text-secondary mb-6">Puntos por Semana</h4>
<div className="h-40 flex items-end gap-2 px-2">
<div className="flex-1 bg-surface-container-high h-[40%] rounded-sm hover:bg-primary transition-colors"></div>
<div className="flex-1 bg-surface-container-high h-[65%] rounded-sm hover:bg-primary transition-colors"></div>
<div className="flex-1 bg-primary h-[85%] rounded-sm"></div>
<div className="flex-1 bg-surface-container-high h-[55%] rounded-sm hover:bg-primary transition-colors"></div>
<div className="flex-1 bg-secondary h-full rounded-sm"></div>
</div>
<div className="flex justify-between mt-4 text-[10px] uppercase font-bold text-on-surface/40 monospaced-stat">
<span>Sem 1</span>
<span>Sem 2</span>
<span>Sem 3</span>
<span>Sem 4</span>
<span>Actual</span>
</div>
</div>
{/* Recent Achievement Timeline */}
<div className="space-y-4">
<h4 className="text-xs uppercase font-black tracking-widest text-secondary">Logros Recientes</h4>
<div className="space-y-4 relative before:absolute before:left-3 before:top-4 before:bottom-4 before:w-[1px] before:bg-surface-container-high">
<div className="relative pl-8">
<div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-secondary ring-4 ring-surface"></div>
<div className="text-sm font-headline font-bold">Insignia "5 Estrellas"</div>
<div className="text-[10px] text-on-surface/40 uppercase tracking-widest">Hace 1 día • +50 pts</div>
</div>
<div className="relative pl-8">
<div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-surface-container-high ring-4 ring-surface"></div>
<div className="text-sm font-headline font-bold">Meta "Bebidas" (Fase 2)</div>
<div className="text-[10px] text-on-surface/40 uppercase tracking-widest">Hace 3 días • +100 pts</div>
</div>
<div className="relative pl-8">
<div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-surface-container-high ring-4 ring-surface"></div>
<div className="text-sm font-headline font-bold">Perfect Attendance</div>
<div className="text-[10px] text-on-surface/40 uppercase tracking-widest">Hace 1 semana • +20 pts</div>
</div>
</div>
</div>
</div>
</div>
</main>
  );
}
