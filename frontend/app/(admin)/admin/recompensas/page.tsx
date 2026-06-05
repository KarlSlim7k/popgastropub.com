"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Recompensa {
  id: number;
  nombre: string;
  descripcion?: string;
  puntos_requeridos: number;
  imagen?: string;
  disponible: boolean;
  categoria: string;
  tier: "fan" | "lover" | "vip" | "elite";
}

type RewardForm = Omit<Recompensa, "id">;

const emptyForm: RewardForm = { nombre: "", descripcion: "", puntos_requeridos: 100, imagen: "", disponible: true, categoria: "general", tier: "fan" };

export default function AdminRecompensasPage() {
  const [rewards, setRewards] = useState<Recompensa[]>([]);
  const [editing, setEditing] = useState<Recompensa | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<RewardForm>({ ...emptyForm });

  const load = async () => {
    const session = getAuthSession();
    if (!session) return;
    try {
      setRewards(await fetchWithAuth<Recompensa[]>("/admin/recompensas", session.token));
    } catch {
      toast.error("No se pudieron cargar las recompensas");
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm }); setShowModal(true); };
  const openEdit = (reward: Recompensa) => { setEditing(reward); setForm({ ...reward, imagen: reward.imagen || "", descripcion: reward.descripcion || "" }); setShowModal(true); };

  const save = async () => {
    const session = getAuthSession();
    if (!session) return;
    try {
      await fetchWithAuth(editing ? `/admin/recompensas/${editing.id}` : "/admin/recompensas", session.token, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setShowModal(false);
      load();
    } catch {
      toast.error("No se pudo guardar la recompensa");
    }
  };

  const remove = async (id: number) => {
    const session = getAuthSession();
    if (!session || !confirm("¿Eliminar esta recompensa?")) return;
    try {
      await fetchWithAuth(`/admin/recompensas/${id}`, session.token, { method: "DELETE" });
      setRewards((current) => current.filter((reward) => reward.id !== id));
    } catch {
      toast.error("No se pudo eliminar la recompensa");
    }
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white font-epilogue uppercase">Recompensas</h1><p className="text-pop-orange mt-2 text-xs font-bold uppercase tracking-[0.3em]">Catálogo canjeable por clientes</p></div>
        <button onClick={openCreate} className="px-5 py-3 bg-pop-gold text-pop-black rounded-lg text-xs font-black uppercase tracking-widest">Nueva recompensa</button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <article key={reward.id} className="bg-pop-cardGreen rounded-2xl border border-white/5 p-6">
            <div className="flex justify-between gap-4 mb-4"><div><p className="text-[10px] uppercase tracking-widest text-pop-orange font-black">{reward.categoria} · {reward.tier}</p><h2 className="mt-2 text-xl text-white font-black uppercase">{reward.nombre}</h2></div><span className={`text-[9px] font-black uppercase ${reward.disponible ? "text-green-400" : "text-gray-500"}`}>{reward.disponible ? "Activa" : "Pausada"}</span></div>
            <p className="text-sm text-gray-400 min-h-12">{reward.descripcion || "Sin descripción"}</p>
            <div className="mt-5 pt-5 border-t border-white/5 flex justify-between items-center"><p className="text-2xl font-black text-pop-gold">{reward.puntos_requeridos} pts</p><div className="flex gap-3"><button onClick={() => openEdit(reward)} className="material-symbols-outlined text-pop-gold">edit</button><button onClick={() => remove(reward.id)} className="material-symbols-outlined text-red-400">delete</button></div></div>
          </article>
        ))}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-xl bg-pop-cardGreen border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-black uppercase text-white">{editing ? "Editar recompensa" : "Nueva recompensa"}</h2>
            <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Nombre" className="w-full bg-pop-black border border-white/10 rounded-lg p-3 text-white" />
            <textarea value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} placeholder="Descripción" className="w-full bg-pop-black border border-white/10 rounded-lg p-3 text-white" />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" min="1" value={form.puntos_requeridos} onChange={(event) => setForm({ ...form, puntos_requeridos: Number(event.target.value) })} className="bg-pop-black border border-white/10 rounded-lg p-3 text-white" />
              <input value={form.categoria} onChange={(event) => setForm({ ...form, categoria: event.target.value })} placeholder="Categoría" className="bg-pop-black border border-white/10 rounded-lg p-3 text-white" />
              <select value={form.tier} onChange={(event) => setForm({ ...form, tier: event.target.value as Recompensa["tier"] })} className="bg-pop-black border border-white/10 rounded-lg p-3 text-white"><option value="fan">Fan</option><option value="lover">Lover</option><option value="vip">VIP</option><option value="elite">Elite</option></select>
              <label className="flex items-center gap-3 text-xs uppercase tracking-widest text-white"><input type="checkbox" checked={form.disponible} onChange={(event) => setForm({ ...form, disponible: event.target.checked })} /> Disponible</label>
            </div>
            <ImageUpload value={form.imagen || ""} onChange={(url) => setForm({ ...form, imagen: url })} folder="recompensas" />
            <div className="flex justify-end gap-3 pt-3"><button onClick={() => setShowModal(false)} className="px-5 py-3 text-xs font-black uppercase text-gray-400">Cancelar</button><button onClick={save} className="px-5 py-3 rounded-lg bg-pop-gold text-pop-black text-xs font-black uppercase">Guardar</button></div>
          </div>
        </div>
      )}
    </main>
  );
}
