"use client";

import { useState } from "react";

// Types
interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number; // percentage
  status: "available" | "low" | "out";
  active: boolean;
  image: string;
  orders: number;
  rating: number;
  hasPromo: boolean;
  promoPrice?: number;
  allergens: string[];
}

export default function AdminGestionMenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories = ["Todos", "Sushi", "Wings", "Bebidas", "Postres", "Snacks"];

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "SUSHI-001",
      name: "Dragon Roll Especial",
      category: "Sushi",
      price: 185.00,
      cost: 72.00,
      stock: 85,
      status: "available",
      active: true,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=150&fit=crop",
      orders: 342,
      rating: 4.9,
      hasPromo: false,
      allergens: ["Pescado", "Sésamo"],
    },
    {
      id: "WING-001",
      name: "Wings BBQ (12 pzas)",
      category: "Wings",
      price: 145.00,
      cost: 55.00,
      stock: 15,
      status: "low",
      active: true,
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&h=150&fit=crop",
      orders: 428,
      rating: 4.8,
      hasPromo: true,
      promoPrice: 120.00,
      allergens: ["Gluten"],
    },
    {
      id: "SUSHI-004",
      name: "Acevichado Roll",
      category: "Sushi",
      price: 175.00,
      cost: 68.00,
      stock: 0,
      status: "out",
      active: false,
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&h=150&fit=crop",
      orders: 215,
      rating: 4.6,
      hasPromo: false,
      allergens: ["Mariscos"],
    },
  ]);

  const toggleActive = (id: string) => {
    setMenuItems(items => items.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none">
            Menú
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Administración de catálogo · POP Perote
          </p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setShowModal(true); }}
          className="w-full md:w-auto px-8 py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-[0.2em] rounded-lg hover:bg-pop-lightGold transition-all shadow-lg"
        >
          Agregar Platillo
        </button>
      </header>

      {/* Stats Summary - Scrollable on mobile */}
      <section className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-6 mb-10 overflow-x-auto no-scrollbar pb-2">
        <div className="min-w-[160px] flex-1 bg-[#1C1B1B] p-5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Items</p>
          <p className="text-2xl font-black text-white">{menuItems.length}</p>
        </div>
        <div className="min-w-[160px] flex-1 bg-[#1C1B1B] p-5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Margen</p>
          <p className="text-2xl font-black text-green-400">58%</p>
        </div>
        <div className="min-w-[160px] flex-1 bg-[#1C1B1B] p-5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Agotados</p>
          <p className="text-2xl font-black text-pop-orange">{menuItems.filter(i => i.status === 'out').length}</p>
        </div>
        <div className="min-w-[160px] flex-1 bg-[#1C1B1B] p-5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Categorías</p>
          <p className="text-2xl font-black text-pop-gold">{categories.length - 1}</p>
        </div>
      </section>

      {/* Controls: Search & Categories (Stacked on mobile) */}
      <div className="bg-[#1C1B1B] p-5 lg:p-6 rounded-2xl border border-white/5 mb-8 space-y-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-pop-black border border-white/10 rounded-xl py-4 pl-12 pr-6 text-sm text-white focus:border-pop-gold outline-none"
          />
        </div>
        <div className="flex overflow-x-auto gap-2 no-scrollbar py-1">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                selectedCategory === cat ? 'bg-pop-gold text-pop-black border-pop-gold' : 'bg-transparent text-gray-500 border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List: Desktop Table / Mobile Cards */}
      <div className="space-y-4">
        {/* Header for Desktop */}
        <div className="hidden lg:grid grid-cols-6 gap-4 px-8 py-4 bg-white/[0.02] text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] border-b border-white/5">
           <div className="col-span-2">Platillo</div>
           <div>Categoría</div>
           <div>PVP / Costo</div>
           <div>Inventario</div>
           <div className="text-right">Estado / Acciones</div>
        </div>

        {/* Dynamic Items */}
        {filteredItems.map(item => (
          <article key={item.id} className="bg-[#1C1B1B] lg:bg-transparent rounded-2xl lg:rounded-none p-5 lg:p-0 border border-white/5 lg:border-none lg:grid lg:grid-cols-6 lg:gap-4 lg:px-8 lg:py-6 lg:items-center hover:bg-white/[0.02] transition-all">
             {/* Mobile: Top Row | Desktop: Info */}
             <div className="lg:col-span-2 flex items-center gap-4 mb-4 lg:mb-0">
                <div className="w-20 h-16 lg:w-16 lg:h-12 rounded-xl bg-pop-black border border-white/10 overflow-hidden shadow-lg">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                   <p className="text-base lg:text-sm font-black text-white uppercase leading-none">{item.name}</p>
                   <p className="text-[9px] text-gray-500 mt-1 uppercase font-black tracking-widest">ID: {item.id}</p>
                </div>
             </div>

             {/* Mobile: Specs | Desktop: Cells */}
             <div className="grid grid-cols-2 lg:block gap-4 mb-4 lg:mb-0">
                <div className="lg:hidden text-[9px] font-black text-gray-500 uppercase">Categoría</div>
                <div className="text-right lg:text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-pop-orange/80">{item.category}</span>
                </div>
                
                <div className="lg:hidden text-[9px] font-black text-gray-500 uppercase">PVP / Costo</div>
                <div className="text-right lg:text-left font-mono">
                  <span className="text-white font-bold">${item.price}</span>
                  <span className="text-[10px] text-gray-500 ml-2 lg:block lg:ml-0 lg:mt-0.5">/ ${item.cost}</span>
                </div>
             </div>

             <div className="mb-6 lg:mb-0">
                <div className="lg:hidden text-[9px] font-black text-gray-500 uppercase mb-2">Inventario</div>
                <div className="flex items-center gap-3">
                   <div className="flex-1 lg:max-w-[100px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.status === 'out' ? 'bg-red-500' : item.status === 'low' ? 'bg-pop-orange' : 'bg-pop-gold'}`} style={{ width: `${item.stock}%` }} />
                   </div>
                   <span className="text-[10px] font-black text-white">{item.stock}%</span>
                </div>
             </div>

             {/* Action Row */}
             <div className="flex items-center justify-between lg:justify-end gap-3 pt-4 lg:pt-0 border-t lg:border-none border-white/5">
                <button 
                  onClick={() => toggleActive(item.id)}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    item.active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {item.active ? 'Activo' : 'Pausado'}
                </button>
                <div className="flex gap-2">
                   <button onClick={() => handleEdit(item)} className="w-10 h-10 flex items-center justify-center bg-white/5 text-pop-gold rounded-xl hover:bg-pop-gold/10">
                     <span className="material-symbols-outlined text-base">edit</span>
                   </button>
                   <button className="w-10 h-10 flex items-center justify-center bg-white/5 text-red-400 rounded-xl hover:bg-red-500/10">
                     <span className="material-symbols-outlined text-base">delete</span>
                   </button>
                </div>
             </div>
          </article>
        ))}
      </div>

      {/* Edit/Add Modal - Improved for Mobile */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-pop-black/90 backdrop-blur-xl" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#1C1B1B] border-t md:border border-white/10 w-full max-w-2xl rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <header className="p-6 lg:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div>
                <h2 className="text-xl lg:text-2xl font-black uppercase font-epilogue tracking-tighter text-white">
                  {editingItem ? 'Editar Plato' : 'Nuevo Plato'}
                </h2>
                <p className="text-[10px] text-pop-orange font-bold uppercase tracking-widest mt-1">Configuración Técnica</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form className="p-6 lg:p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nombre</label>
                  <input type="text" defaultValue={editingItem?.name} className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Categoría</label>
                  <select defaultValue={editingItem?.category} className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none">
                    {categories.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2 col-span-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Precio ($)</label>
                  <input type="number" defaultValue={editingItem?.price} className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none" />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Costo ($)</label>
                  <input type="number" defaultValue={editingItem?.cost} className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none" />
                </div>
                <div className="col-span-2 md:col-span-1 bg-pop-gold/5 border border-pop-gold/10 p-4 rounded-xl flex items-center justify-between">
                   <p className="text-[9px] font-black uppercase tracking-widest text-pop-gold">Margen</p>
                   <p className="text-lg font-black text-white">61%</p>
                </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Alérgenos</label>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {["Pescado", "Mariscos", "Sésamo", "Gluten", "Lácteos"].map(alg => (
                     <label key={alg} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl cursor-pointer hover:border-pop-gold transition-all">
                       <input type="checkbox" defaultChecked={editingItem?.allergens.includes(alg)} className="w-4 h-4 rounded accent-pop-gold" />
                       <span className="text-[10px] font-bold text-white uppercase">{alg}</span>
                     </label>
                   ))}
                 </div>
              </div>
              
              <div className="p-5 bg-pop-orange/5 border border-pop-orange/10 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm">Oferta Flash</h4>
                  <p className="text-[8px] text-pop-orange uppercase tracking-widest font-black">Multiplicador de Visibilidad</p>
                </div>
                <input type="checkbox" defaultChecked={editingItem?.hasPromo} className="w-6 h-6 accent-pop-orange" />
              </div>
            </form>

            <footer className="p-6 lg:p-8 border-t border-white/5 flex gap-3">
              <button onClick={() => setShowModal(false)} type="button" className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest">
                Cancelar
              </button>
              <button type="button" className="flex-[2] py-4 bg-pop-gold text-pop-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pop-lightGold shadow-lg">
                {editingItem ? 'Guardar Cambios' : 'Crear Platillo'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
