"use client";

import { useState } from "react";

// Types
interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
  cost: string;
  stockPercent: number;
  stockLabel: string;
  stockColor: string;
  active: boolean;
  image: string;
  imageAlt: string;
  orders: number;
  rating: number;
}

interface CategoryStats {
  name: string;
  count: number;
  revenue: string;
  icon: string;
  color: string;
}

export default function AdminGestionMenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ["Todos", "Sushi", "Wings", "Boneless", "Crepes", "Snacks", "Bebidas", "Postres"];

  const categoryStats: CategoryStats[] = [
    { name: "Sushi", count: 42, revenue: "$85,400", icon: "set_meal", color: "pop-gold" },
    { name: "Wings", count: 18, revenue: "$32,200", icon: "lunch_dining", color: "pop-orange" },
    { name: "Bebidas", count: 24, revenue: "$45,600", icon: "local_bar", color: "pop-light-gold" },
    { name: "Postres", count: 8, revenue: "$12,800", icon: "cake", color: "pop-gold" },
  ];

  const menuItems: MenuItem[] = [
    {
      id: "SUSHI-001",
      name: "Dragon Roll Especial",
      category: "Sushi",
      price: "$185.00",
      cost: "$72.00",
      stockPercent: 85,
      stockLabel: "Disponible",
      stockColor: "bg-pop-gold",
      active: true,
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=150&fit=crop",
      imageAlt: "Dragon Roll",
      orders: 342,
      rating: 4.9,
    },
    {
      id: "SUSHI-012",
      name: "Volcano Roll",
      category: "Sushi",
      price: "$165.00",
      cost: "$65.00",
      stockPercent: 60,
      stockLabel: "Medio",
      stockColor: "bg-pop-light-gold",
      active: true,
      image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=150&fit=crop",
      imageAlt: "Volcano Roll",
      orders: 256,
      rating: 4.7,
    },
    {
      id: "WING-001",
      name: "Wings BBQ (12 pzas)",
      category: "Wings",
      price: "$145.00",
      cost: "$55.00",
      stockPercent: 90,
      stockLabel: "Disponible",
      stockColor: "bg-pop-gold",
      active: true,
      image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&h=150&fit=crop",
      imageAlt: "Wings BBQ",
      orders: 428,
      rating: 4.8,
    },
    {
      id: "WING-005",
      name: "Wings Mango Habanero",
      category: "Wings",
      price: "$155.00",
      cost: "$60.00",
      stockPercent: 25,
      stockLabel: "Bajo",
      stockColor: "bg-pop-orange",
      active: true,
      image: "https://images.unsplash.com/photo-1527477396000-e27163b8bbe?w=200&h=150&fit=crop",
      imageAlt: "Wings Mango Habanero",
      orders: 189,
      rating: 4.6,
    },
    {
      id: "BONE-001",
      name: "Boneless Clásicos (500g)",
      category: "Boneless",
      price: "$135.00",
      cost: "$48.00",
      stockPercent: 70,
      stockLabel: "Disponible",
      stockColor: "bg-pop-gold",
      active: true,
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=150&fit=crop",
      imageAlt: "Boneless",
      orders: 312,
      rating: 4.5,
    },
    {
      id: "CREP-003",
      name: "Crepe Nutella y Fresa",
      category: "Crepes",
      price: "$95.00",
      cost: "$32.00",
      stockPercent: 15,
      stockLabel: "Reabastecer",
      stockColor: "bg-error",
      active: false,
      image: "https://images.unsplash.com/photo-1519676867240-f03562e64571?w=200&h=150&fit=crop",
      imageAlt: "Crepe Nutella",
      orders: 156,
      rating: 4.4,
    },
    {
      id: "BEB-008",
      name: "Margarita Clásica",
      category: "Bebidas",
      price: "$110.00",
      cost: "$35.00",
      stockPercent: 95,
      stockLabel: "Disponible",
      stockColor: "bg-pop-gold",
      active: true,
      image: "https://images.unsplash.com/photo-1544145945-f9043585543f?w=200&h=150&fit=crop",
      imageAlt: "Margarita",
      orders: 524,
      rating: 4.9,
    },
    {
      id: "POST-002",
      name: "Cheesecake de Frutos Rojos",
      category: "Postres",
      price: "$85.00",
      cost: "$28.00",
      stockPercent: 40,
      stockLabel: "Medio",
      stockColor: "bg-pop-light-gold",
      active: true,
      image: "https://images.unsplash.com/photo-1533134242116-79c5e60818a7?w=200&h=150&fit=crop",
      imageAlt: "Cheesecake",
      orders: 198,
      rating: 4.7,
    },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">
            Gestión de Menú
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">
            Administra platillos, categorías y disponibilidad
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all duration-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">download</span>
            Exportar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Agregar Platillo
          </button>
        </div>
      </header>

      {/* Category Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10" aria-label="Estadísticas por categoría">
        {categoryStats.map((cat, index) => (
          <article
            key={index}
            className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,103,37,0.05)] group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
                <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">
                  {cat.icon}
                </span>
              </div>
              <span className="text-[10px] font-bold text-pop-gold bg-pop-gold/10 px-3 py-1 rounded-full uppercase tracking-widest">
                {cat.count} items
              </span>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
              {cat.name}
            </h3>
            <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{cat.revenue}</p>
          </article>
        ))}
      </section>

      {/* Filters */}
      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border border-white/5 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar platillo por nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 focus:ring-1 focus:ring-pop-gold/20 transition-all"
            />
          </div>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-pop-gold text-pop-black"
                    : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items Table */}
      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">
                Catálogo de Platillos
              </h2>
              <p className="text-xs text-pop-orange font-bold uppercase tracking-widest mt-1">
                {filteredItems.length} platillos encontrados
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 px-6 text-left font-medium">Platillo</th>
                <th className="pb-4 text-left font-medium">Categoría</th>
                <th className="pb-4 text-left font-medium">Precio</th>
                <th className="pb-4 text-left font-medium">Costo</th>
                <th className="pb-4 text-left font-medium">Margen</th>
                <th className="pb-4 text-left font-medium">Stock</th>
                <th className="pb-4 text-left font-medium">Pedidos</th>
                <th className="pb-4 text-left font-medium">Rating</th>
                <th className="pb-4 text-right font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredItems.map((item, index) => {
                const margin = ((parseFloat(item.price.replace('$', '')) - parseFloat(item.cost.replace('$', ''))) / parseFloat(item.price.replace('$', '')) * 100).toFixed(0);
                return (
                  <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                          <img
                            className="w-full h-full object-cover"
                            src={item.image}
                            alt={item.imageAlt}
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{item.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase mt-0.5">ID: {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300 rounded-md">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 font-mono font-semibold text-white text-sm">{item.price}</td>
                    <td className="py-4 font-mono text-gray-400 text-sm">{item.cost}</td>
                    <td className="py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        parseInt(margin) >= 60
                          ? "bg-pop-gold/10 text-pop-gold"
                          : parseInt(margin) >= 40
                          ? "bg-pop-light-gold/10 text-pop-light-gold"
                          : "bg-pop-orange/10 text-pop-orange"
                      }`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="w-24 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.stockColor}`}
                          style={{ width: `${item.stockPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">{item.stockLabel}</p>
                    </td>
                    <td className="py-4 text-gray-300 font-mono text-sm">{item.orders}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-pop-gold text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span className="text-gray-300 font-semibold text-sm">{item.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                            item.active ? "bg-pop-gold" : "bg-gray-700"
                          }`}
                          aria-label={item.active ? "Desactivar" : "Activar"}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                              item.active ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Editar">
                            <span className="material-symbols-outlined text-pop-gold text-lg">edit</span>
                          </button>
                          <button className="p-1.5 hover:bg-error/10 rounded transition-colors" title="Eliminar">
                            <span className="material-symbols-outlined text-error text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Platillo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#1C1B1B] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">
                Agregar Platillo
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre del Platillo</label>
                  <input
                    type="text"
                    placeholder="Ej: Dragon Roll Especial"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Categoría</label>
                  <select className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all">
                    <option value="">Seleccionar categoría</option>
                    {categories.filter(c => c !== "Todos").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Precio de Venta ($)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Costo ($)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Stock Inicial (%)</label>
                  <input
                    type="number"
                    placeholder="100"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Descripción del platillo..."
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">URL de Imagen</label>
                <input
                  type="text"
                  placeholder="https://..."
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                />
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all">
                Guardar Platillo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
