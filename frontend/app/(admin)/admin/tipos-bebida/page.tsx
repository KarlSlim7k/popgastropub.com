"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

interface DrinkType {
  id: number;
  slug: string;
  label: string;
  points: number;
  icon: string;
  active: boolean;
  sort_order: number;
}

const ICON_OPTIONS = [
  { value: "local_bar", label: "Cóctel" },
  { value: "wine_bar", label: "Copa" },
  { value: "sports_bar", label: "Jarra" },
  { value: "local_drink", label: "Botella" },
  { value: "restaurant", label: "Combo" },
  { value: "trending_up", label: "Upgrade" },
  { value: "emoji_events", label: "Premium" },
  { value: "celebration", label: "Especial" },
  { value: "liquor", label: "Licores" },
  { value: "icecream", label: "Postre" },
  { value: "coffee", label: "Café" },
  { value: "water_drop", label: "Agua" },
];

export default function AdminTiposBebidaPage() {
  const [drinkTypes, setDrinkTypes] = useState<DrinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DrinkType | null>(null);

  const [form, setForm] = useState({
    slug: "",
    label: "",
    points: 0,
    icon: "local_bar",
    active: true,
    sort_order: 0,
  });

  const fetchTypes = async () => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const data = await fetchWithAuth<DrinkType[]>("/admin/drink-types", session.token);
      setDrinkTypes(Array.isArray(data) ? data : []);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ slug: "", label: "", points: 10, icon: "local_bar", active: true, sort_order: drinkTypes.length });
    setShowModal(true);
  };

  const openEdit = (item: DrinkType) => {
    setEditingItem(item);
    setForm({ ...item });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async () => {
    const session = getAuthSession();
    if (!session) return;
    if (!form.slug.trim() || !form.label.trim()) {
      alert("El identificador y el nombre son obligatorios.");
      return;
    }
    try {
      if (editingItem) {
        await fetchWithAuth(`/admin/drink-types/${editingItem.id}`, session.token, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await fetchWithAuth("/admin/drink-types", session.token, {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      closeModal();
      fetchTypes();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al guardar");
    }
  };

  const handleDelete = async (item: DrinkType) => {
    const session = getAuthSession();
    if (!session) return;
    if (!confirm(`¿Eliminar el tipo "${item.label}"?`)) return;
    try {
      await fetchWithAuth(`/admin/drink-types/${item.id}`, session.token, { method: "DELETE" });
      fetchTypes();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Error al eliminar";
      alert(msg);
    }
  };

  const toggleActive = async (item: DrinkType) => {
    const session = getAuthSession();
    if (!session) return;
    try {
      await fetchWithAuth(`/admin/drink-types/${item.id}`, session.token, {
        method: "PUT",
        body: JSON.stringify({ active: !item.active }),
      });
      setDrinkTypes((prev) => prev.map((t) => (t.id === item.id ? { ...t, active: !t.active } : t)));
    } catch {
      alert("Error al cambiar estado");
    }
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white font-epilogue uppercase leading-none flex items-center gap-4">
            <span className="material-symbols-outlined text-pop-gold text-5xl lg:text-7xl">local_drink</span>
            Tipos de Bebida
          </h1>
          <p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">
            Configuración de puntos para Ranking POP Bar Stars
          </p>
        </div>
        <button
          onClick={openCreate}
          className="w-full md:w-auto px-8 py-4 bg-pop-gold text-pop-black font-black uppercase text-xs tracking-[0.2em] rounded-lg hover:bg-pop-lightGold transition-all shadow-lg"
        >
          Agregar Tipo
        </button>
      </header>

      <section className="flex gap-4 mb-10 overflow-x-auto no-scrollbar pb-2">
        <div className="min-w-[160px] flex-1 bg-pop-cardGreen p-5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Tipos</p>
          <p className="text-2xl font-black text-white">{drinkTypes.length}</p>
        </div>
        <div className="min-w-[160px] flex-1 bg-pop-cardGreen p-5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Activos</p>
          <p className="text-2xl font-black text-green-400">{drinkTypes.filter((t) => t.active).length}</p>
        </div>
        <div className="min-w-[160px] flex-1 bg-pop-cardGreen p-5 rounded-2xl border border-white/5">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Puntos Promedio</p>
          <p className="text-2xl font-black text-pop-gold">
            {drinkTypes.length ? Math.round(drinkTypes.reduce((acc, t) => acc + t.points, 0) / drinkTypes.length) : 0}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drinkTypes.map((type) => (
          <article
            key={type.id}
            className={`bg-pop-cardGreen rounded-2xl border p-5 transition-all ${
              type.active ? "border-white/5" : "border-red-500/20 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-pop-gold/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-pop-gold text-2xl">{type.icon}</span>
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase">{type.label}</h3>
                  <p className="text-[9px] text-gray-500 font-mono">{type.slug}</p>
                </div>
              </div>
              <button
                onClick={() => toggleActive(type)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  type.active
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {type.active ? "Activo" : "Pausado"}
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Puntos</p>
                <p className="text-2xl font-black text-pop-gold">{type.points}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Orden</p>
                <p className="text-lg font-black text-white">#{type.sort_order}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(type)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-pop-gold text-[9px] font-black uppercase tracking-widest hover:bg-pop-gold/10 transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(type)}
                className="py-2.5 px-4 rounded-xl bg-white/5 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {drinkTypes.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-500 text-xs uppercase tracking-widest">
          No hay tipos de bebida configurados
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-pop-black/90 backdrop-blur-xl" onClick={closeModal} />
          <div className="relative bg-pop-cardGreen border-t md:border border-white/10 w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <header className="p-6 lg:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <div>
                <h2 className="text-xl lg:text-2xl font-black uppercase font-epilogue tracking-tighter text-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-pop-gold text-3xl">local_drink</span>
                  {editingItem ? "Editar Tipo" : "Nuevo Tipo"}
                </h2>
                <p className="text-[10px] text-pop-orange font-bold uppercase tracking-widest mt-1">
                  Configuración para Ranking POP Bar Stars
                </p>
              </div>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <div className="p-6 lg:p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                    Identificador (slug)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                    placeholder="ej: cocktail"
                    disabled={!!editingItem}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none disabled:opacity-50"
                  />
                  <p className="text-[8px] text-gray-600">Solo letras, números y guiones. No se puede cambiar al editar.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nombre</label>
                  <input
                    type="text"
                    value={form.label}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="Cóctel / Margarita"
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Puntos por venta</label>
                  <input
                    type="number"
                    min={0}
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Orden de visualización</label>
                  <input
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full bg-pop-black border border-white/10 rounded-xl p-4 text-white focus:border-pop-gold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Ícono</label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, icon: opt.value })}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                        form.icon === opt.value
                          ? "bg-pop-gold/10 border-pop-gold"
                          : "bg-white/5 border-white/10 hover:border-pop-gold/30"
                      }`}
                    >
                      <span className="material-symbols-outlined text-pop-gold text-lg">{opt.value}</span>
                      <span className="text-[7px] text-gray-500 font-bold uppercase truncate w-full text-center">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-pop-gold/5 border border-pop-gold/10 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm">Tipo activo</h4>
                  <p className="text-[8px] text-pop-gold uppercase tracking-widest font-black">
                    {form.active ? "Visible para asignar a bebidas" : "Oculto del selector"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-6 h-6 accent-pop-gold"
                />
              </div>
            </div>

            <footer className="p-6 lg:p-8 border-t border-white/5 flex gap-3">
              <button onClick={closeModal} type="button" className="flex-1 py-4 text-gray-500 font-black uppercase text-[10px] tracking-widest">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                type="button"
                className="flex-[2] py-4 bg-pop-gold text-pop-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-pop-lightGold shadow-lg"
              >
                {editingItem ? "Guardar Cambios" : "Crear Tipo"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
