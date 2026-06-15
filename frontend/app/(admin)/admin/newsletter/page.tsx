"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";
import { Pagination } from "@/components/ui/Pagination";

interface Subscriber {
  id: number;
  user_id: number | null;
  email: string;
  name: string | null;
  source: "landing" | "user";
  unsubscribed_at: string | null;
  created_at: string;
}

interface Stats {
  total_active: number;
  total_unsubscribed: number;
  by_source: Record<string, number>;
}

interface BroadcastListItem {
  id: string;
  name?: string | null;
  status: string;
  created_at?: string;
}

interface BroadcastDetail extends BroadcastListItem {
  subject?: string;
  html?: string;
  text?: string;
  preview_text?: string;
}

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-700/50 text-gray-300",
  queued: "bg-blue-500/10 text-blue-400",
  scheduled: "bg-blue-500/10 text-blue-400",
  sent: "bg-pop-gold/10 text-pop-gold",
};

export default function AdminNewsletterPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subLoading, setSubLoading] = useState(true);
  const [subPage, setSubPage] = useState(1);
  const [subMeta, setSubMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  const [broadcasts, setBroadcasts] = useState<BroadcastListItem[]>([]);
  const [broadcastsLoading, setBroadcastsLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", subject: "", preview_text: "", html: "", text: "" });

  const [viewBroadcast, setViewBroadcast] = useState<BroadcastDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [sendTarget, setSendTarget] = useState<BroadcastListItem | null>(null);
  const [sending, setSending] = useState(false);

  const fetchStats = async () => {
    const session = getAuthSession();
    if (!session) return;
    try {
      const data = await fetchWithAuth<Stats>("/admin/newsletter", session.token);
      setStats(data);
    } catch {}
  };

  const fetchSubscribers = async (p = subPage) => {
    const session = getAuthSession();
    if (!session) return;
    setSubLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), per_page: "20" });
      if (search) params.set("search", search);
      if (sourceFilter !== "todos") params.set("source", sourceFilter);
      if (statusFilter !== "todos") params.set("status", statusFilter);
      const data = await fetchWithAuth<{ data: Subscriber[]; meta: typeof subMeta }>(`/admin/newsletter/subscribers?${params}`, session.token);
      setSubscribers(data.data ?? []);
      if (data.meta) setSubMeta(data.meta);
    } catch {
      toast.error("Error al cargar suscriptores");
    } finally {
      setSubLoading(false);
    }
  };

  const fetchBroadcasts = async () => {
    const session = getAuthSession();
    if (!session) return;
    setBroadcastsLoading(true);
    try {
      const data = await fetchWithAuth<{ data: BroadcastListItem[] }>("/admin/newsletter/broadcasts", session.token);
      setBroadcasts(data.data ?? []);
    } catch {
      toast.error("Error al cargar campañas de Resend");
    } finally {
      setBroadcastsLoading(false);
    }
  };

  useEffect(() => { fetchStats(); fetchBroadcasts(); }, []);
  useEffect(() => { fetchSubscribers(1); setSubPage(1); }, [search, sourceFilter, statusFilter]);
  useEffect(() => { fetchSubscribers(subPage); }, [subPage]);

  const openCreateModal = () => {
    setCreateForm({ name: "", subject: "", preview_text: "", html: "", text: "" });
    setShowCreateModal(true);
  };

  const handleCreateBroadcast = async () => {
    const session = getAuthSession();
    if (!session) return;
    if (!createForm.subject.trim()) { toast.error("El asunto es requerido"); return; }
    if (!createForm.html.trim() && !createForm.text.trim()) { toast.error("Escribe el contenido en HTML o texto"); return; }

    setCreating(true);
    try {
      const payload: Record<string, string> = { subject: createForm.subject };
      if (createForm.name.trim()) payload.name = createForm.name.trim();
      if (createForm.preview_text.trim()) payload.preview_text = createForm.preview_text.trim();
      if (createForm.html.trim()) payload.html = createForm.html;
      if (createForm.text.trim()) payload.text = createForm.text;

      await fetchWithAuth("/admin/newsletter/broadcasts", session.token, { method: "POST", body: JSON.stringify(payload) });
      toast.success("Campaña creada como borrador");
      setShowCreateModal(false);
      fetchBroadcasts();
    } catch {
      toast.error("Error al crear la campaña");
    } finally {
      setCreating(false);
    }
  };

  const openView = async (broadcast: BroadcastListItem) => {
    const session = getAuthSession();
    if (!session) return;
    setViewBroadcast({ ...broadcast });
    setViewLoading(true);
    try {
      const detail = await fetchWithAuth<BroadcastDetail>(`/admin/newsletter/broadcasts/${broadcast.id}`, session.token);
      setViewBroadcast(detail);
    } catch {
      toast.error("Error al obtener detalle de la campaña");
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async (broadcast: BroadcastListItem) => {
    const session = getAuthSession();
    if (!session) return;
    if (!confirm(`¿Eliminar la campaña "${broadcast.name || broadcast.id}"?`)) return;
    try {
      await fetchWithAuth(`/admin/newsletter/broadcasts/${broadcast.id}`, session.token, { method: "DELETE" });
      toast.success("Campaña eliminada");
      fetchBroadcasts();
    } catch {
      toast.error("Error al eliminar la campaña");
    }
  };

  const handleSend = async () => {
    const session = getAuthSession();
    if (!session || !sendTarget) return;
    setSending(true);
    try {
      await fetchWithAuth(`/admin/newsletter/broadcasts/${sendTarget.id}/send`, session.token, { method: "POST" });
      toast.success("Campaña enviada");
      setSendTarget(null);
      fetchBroadcasts();
    } catch {
      toast.error("Error al enviar la campaña");
    } finally {
      setSending(false);
    }
  };

  const sourceLabel = (s: string) => (s === "landing" ? "Landing" : "Usuario registrado");
  const statusLabel = (s: string) => ({ draft: "Borrador", queued: "En cola", scheduled: "Programada", sent: "Enviada" }[s] ?? s);

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 lg:mb-10">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">Newsletter</h1>
        <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">Suscriptores y campañas de correo (Resend)</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        <article className="bg-pop-cardGreen rounded-xl p-6 border-l-4 border-pop-gold">
          <div className="p-3 rounded-lg bg-white/5 inline-flex mb-4"><span className="material-symbols-outlined text-pop-gold text-3xl">mail</span></div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Suscriptores Activos</h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stats?.total_active ?? "—"}</p>
        </article>
        <article className="bg-pop-cardGreen rounded-xl p-6 border-l-4 border-gray-600">
          <div className="p-3 rounded-lg bg-white/5 inline-flex mb-4"><span className="material-symbols-outlined text-gray-400 text-3xl">unsubscribe</span></div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Desuscritos</h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stats?.total_unsubscribed ?? "—"}</p>
        </article>
        <article className="bg-pop-cardGreen rounded-xl p-6 border-l-4 border-pop-orange">
          <div className="p-3 rounded-lg bg-white/5 inline-flex mb-4"><span className="material-symbols-outlined text-pop-orange text-3xl">language</span></div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Desde Landing</h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stats?.by_source?.landing ?? 0}</p>
        </article>
        <article className="bg-pop-cardGreen rounded-xl p-6 border-l-4 border-purple-500">
          <div className="p-3 rounded-lg bg-white/5 inline-flex mb-4"><span className="material-symbols-outlined text-purple-400 text-3xl">group</span></div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Usuarios Registrados</h3>
          <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stats?.by_source?.user ?? 0}</p>
        </article>
      </section>

      {/* Subscribers */}
      <section className="bg-pop-cardGreen rounded-xl p-6 border border-white/5 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
            <input type="text" placeholder="Buscar por email o nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-gray-800/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase self-center mr-1">Origen:</span>
            {["todos", "landing", "user"].map((s) => (
              <button key={s} onClick={() => setSourceFilter(s)} className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${sourceFilter === s ? "bg-pop-gold text-pop-black" : "bg-gray-800/50 text-gray-400 hover:text-white"}`}>{s === "todos" ? "Todos" : sourceLabel(s)}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase self-center mr-1">Estado:</span>
            {["todos", "active", "unsubscribed"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${statusFilter === s ? "bg-pop-gold text-pop-black" : "bg-gray-800/50 text-gray-400 hover:text-white"}`}>{s === "todos" ? "Todos" : s === "active" ? "Activos" : "Desuscritos"}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden mb-10">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Suscriptores</h2>
          <p className="text-xs text-pop-orange font-bold uppercase tracking-widest mt-1">{subMeta.total} registros</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 px-6 text-left font-medium">Email</th>
                <th className="pb-4 text-left font-medium">Nombre</th>
                <th className="pb-4 text-left font-medium">Origen</th>
                <th className="pb-4 text-left font-medium">Estado</th>
                <th className="pb-4 px-6 text-left font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-6 text-sm text-white">{s.email}</td>
                  <td className="py-4 text-xs text-gray-300">{s.name || "—"}</td>
                  <td className="py-4 text-xs text-gray-300">{sourceLabel(s.source)}</td>
                  <td className="py-4">
                    {s.unsubscribed_at ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider bg-gray-700/50 text-gray-300">Desuscrito</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider bg-pop-gold/10 text-pop-gold">Activo</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-500">{new Date(s.created_at).toLocaleDateString("es-MX")}</td>
                </tr>
              ))}
              {subscribers.length === 0 && !subLoading && (
                <tr><td colSpan={5} className="py-10 text-center text-gray-500 text-xs uppercase tracking-widest">Sin suscriptores</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6">
          <Pagination currentPage={subMeta.current_page} lastPage={subMeta.last_page} total={subMeta.total} onPageChange={setSubPage} />
        </div>
      </section>

      {/* Broadcasts */}
      <section className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Campañas</h2>
            <p className="text-xs text-pop-orange font-bold uppercase tracking-widest mt-1">{broadcasts.length} campañas en Resend</p>
          </div>
          <button onClick={openCreateModal} className="px-4 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>Nueva Campaña
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 px-6 text-left font-medium">Nombre</th>
                <th className="pb-4 text-left font-medium">Estado</th>
                <th className="pb-4 text-left font-medium">Creada</th>
                <th className="pb-4 px-6 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {broadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-6 text-sm text-white">{b.name || "(Sin nombre)"}</td>
                  <td className="py-4"><span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${STATUS_STYLES[b.status] ?? "bg-gray-700/50 text-gray-300"}`}>{statusLabel(b.status)}</span></td>
                  <td className="py-4 text-xs text-gray-500">{b.created_at ? new Date(b.created_at).toLocaleDateString("es-MX") : "—"}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openView(b)} className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Ver">
                        <span className="material-symbols-outlined text-pop-gold text-lg">visibility</span>
                      </button>
                      {b.status === "draft" && (
                        <>
                          <button onClick={() => setSendTarget(b)} className="p-1.5 hover:bg-green-500/10 rounded transition-colors" title="Enviar">
                            <span className="material-symbols-outlined text-green-400 text-lg">send</span>
                          </button>
                          <button onClick={() => handleDelete(b)} className="p-1.5 hover:bg-red-500/10 rounded transition-colors" title="Eliminar">
                            <span className="material-symbols-outlined text-red-400 text-lg">delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {broadcasts.length === 0 && !broadcastsLoading && (
                <tr><td colSpan={4} className="py-10 text-center text-gray-500 text-xs uppercase tracking-widest">Sin campañas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create broadcast modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pop-black/90 backdrop-blur-xl" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-pop-cardGreen border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <header className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Nueva Campaña</h2>
                <p className="text-[10px] text-pop-orange font-bold uppercase tracking-widest mt-1">Se crea como borrador en Resend</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nombre interno (opcional)</label>
                  <input type="text" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm" placeholder="Promo de quincena" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Texto de previsualización (opcional)</label>
                  <input type="text" maxLength={150} value={createForm.preview_text} onChange={(e) => setCreateForm({ ...createForm, preview_text: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm" placeholder="Aparece junto al asunto en el correo" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Asunto</label>
                <input type="text" value={createForm.subject} onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm" placeholder="Promociones de la quincena en POP Perote" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Contenido HTML</label>
                <textarea value={createForm.html} onChange={(e) => setCreateForm({ ...createForm, html: e.target.value })} rows={8} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm font-mono" placeholder="<h1>¡Hola!</h1><p>Esta semana...</p>" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Contenido en texto plano (opcional si hay HTML)</label>
                <textarea value={createForm.text} onChange={(e) => setCreateForm({ ...createForm, text: e.target.value })} rows={4} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm" placeholder="Versión en texto plano" />
              </div>
            </div>
            <footer className="p-6 border-t border-white/5 flex gap-3">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Cancelar</button>
              <button onClick={handleCreateBroadcast} disabled={creating} className="flex-[2] py-3 bg-pop-gold text-pop-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-pop-lightGold shadow-lg disabled:opacity-50">{creating ? "Creando..." : "Crear Borrador"}</button>
            </footer>
          </div>
        </div>
      )}

      {/* View broadcast modal */}
      {viewBroadcast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pop-black/90 backdrop-blur-xl" onClick={() => setViewBroadcast(null)} />
          <div className="relative bg-pop-cardGreen border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <header className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">{viewBroadcast.name || "Campaña"}</h2>
                <span className={`inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${STATUS_STYLES[viewBroadcast.status] ?? "bg-gray-700/50 text-gray-300"}`}>{statusLabel(viewBroadcast.status)}</span>
              </div>
              <button onClick={() => setViewBroadcast(null)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto no-scrollbar">
              {viewLoading ? (
                <p className="text-xs text-gray-500 uppercase tracking-widest">Cargando...</p>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Asunto</label>
                    <p className="text-sm text-white">{viewBroadcast.subject || "—"}</p>
                  </div>
                  {viewBroadcast.preview_text && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Previsualización</label>
                      <p className="text-sm text-gray-300">{viewBroadcast.preview_text}</p>
                    </div>
                  )}
                  {viewBroadcast.html && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">HTML</label>
                      <pre className="text-xs text-gray-300 bg-pop-black border border-white/10 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap">{viewBroadcast.html}</pre>
                    </div>
                  )}
                  {viewBroadcast.text && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Texto plano</label>
                      <pre className="text-xs text-gray-300 bg-pop-black border border-white/10 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap">{viewBroadcast.text}</pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Send confirmation modal */}
      {sendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pop-black/90 backdrop-blur-xl" onClick={() => !sending && setSendTarget(null)} />
          <div className="relative bg-pop-cardGreen border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <header className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Confirmar Envío</h2>
            </header>
            <div className="p-6 space-y-3">
              <p className="text-sm text-gray-300">
                Vas a enviar la campaña <span className="text-white font-bold">&quot;{sendTarget.name || sendTarget.id}&quot;</span> a todos los suscriptores activos del segmento de newsletter.
              </p>
              <p className="text-xs text-red-400 font-bold uppercase tracking-widest">Esta acción no se puede deshacer.</p>
            </div>
            <footer className="p-6 border-t border-white/5 flex gap-3">
              <button onClick={() => setSendTarget(null)} disabled={sending} className="flex-1 py-3 text-xs font-black text-gray-500 uppercase tracking-widest disabled:opacity-50">Cancelar</button>
              <button onClick={handleSend} disabled={sending} className="flex-[2] py-3 bg-pop-orange text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-pop-orange/90 shadow-lg disabled:opacity-50">{sending ? "Enviando..." : "Enviar Campaña"}</button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
