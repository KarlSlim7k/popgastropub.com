"use client";

import { useState, useEffect } from "react";
import { downloadAuthenticatedFile, fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";
import PromoLandingContent, { type PromoLandingData } from "@/components/promociones/PromoLandingContent";
import type { PromoFormField } from "@/components/promociones/PromoLandingInteractions";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Promo {
  id: string;
  name: string;
  description: string;
  type: "descuento" | "2x1" | "combo" | "happy_hour" | "evento" | "puntos" | "regalo" | "especial";
  discount: string;
  startDate: string;
  endDate: string;
  daysActive: string[];
  indefinite: boolean;
  status: "activa" | "pausada" | "finalizada";
  redemptions: number;
  target: number;
  revenue: string;
  image: string;
  imageAlt: string;
  slug: string;
  landingEnabled: boolean;
  landingTitle: string;
  landingSubtitle: string;
  landingContent: string;
  landingTemplate: "editorial" | "clasica";
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
  formEnabled: boolean;
  formFields: PromoFormField[];
  viewsCount: number;
  clicksCount: number;
  leadsCount: number;
  published: boolean;
  publishedAt: string | null;
  landingUrl: string;
}

interface PromoMetrics {
  viewsCount: number;
  clicksCount: number;
  leadsCount: number;
  clickThroughRate: number;
  leadConversionRate: number;
  events: {
    views: number;
    primaryClicks: number;
    secondaryClicks: number;
    leads: number;
  };
}

interface PromoLead {
  id: number;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  mensaje: string | null;
  origen: string | null;
  created_at: string;
}

const DAYS = [
  { value: "lunes", label: "Lun" },
  { value: "martes", label: "Mar" },
  { value: "miercoles", label: "Mié" },
  { value: "jueves", label: "Jue" },
  { value: "viernes", label: "Vie" },
  { value: "sabado", label: "Sáb" },
  { value: "domingo", label: "Dom" },
];
const ALL_DAYS = DAYS.map((day) => day.value);
const FOODBOOKING_URL = "https://www.foodbooking.com/ordering/restaurant/menu?company_uid=04f4d10b-2c07-4411-895d-4437eb890919&restaurant_uid=499ca112-e4ea-46f4-8990-47d5b58748ae&facebook=true";
const CTA_PRESETS = [
  { label: "Orden interna", text: "Ordenar ahora", url: "/orden" },
  { label: "FoodBooking", text: "Pedir en FoodBooking", url: FOODBOOKING_URL },
  { label: "WhatsApp", text: "Enviar WhatsApp", url: "https://wa.me/522821278014" },
  { label: "Menú", text: "Ver menú", url: "/menu" },
  { label: "Ubicación", text: "Ver ubicación", url: "/ubicacion" },
];
const TYPE_LABELS: Record<Promo["type"], string> = {
  descuento: "Descuento",
  "2x1": "2x1",
  combo: "Combo",
  happy_hour: "Happy Hour",
  evento: "Evento Especial",
  puntos: "Puntos",
  regalo: "Regalo",
  especial: "Especial",
};
const FORM_FIELD_OPTIONS: { value: PromoFormField; label: string }[] = [
  { value: "nombre", label: "Nombre" },
  { value: "telefono", label: "Teléfono" },
  { value: "email", label: "Correo" },
  { value: "mensaje", label: "Mensaje" },
];
const EMPTY_PROMO_FORM: Partial<Promo> = {
  name: "",
  description: "",
  type: "descuento",
  discount: "",
  startDate: "",
  endDate: "",
  daysActive: ALL_DAYS,
  indefinite: false,
  status: "activa",
  target: 0,
  image: "",
  slug: "",
  landingEnabled: false,
  landingTitle: "",
  landingSubtitle: "",
  landingContent: "",
  landingTemplate: "editorial",
  seoTitle: "",
  seoDescription: "",
  ogImage: "",
  ctaPrimaryText: "",
  ctaPrimaryUrl: "",
  ctaSecondaryText: "",
  ctaSecondaryUrl: "",
  formEnabled: false,
  formFields: [],
};

export default function AdminPromocionesPage() {
  const [filterStatus, setFilterStatus] = useState("todas");
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPromo, setPreviewPromo] = useState<Partial<Promo> | null>(null);
  const [insightsPromo, setInsightsPromo] = useState<Promo | null>(null);
  const [metrics, setMetrics] = useState<PromoMetrics | null>(null);
  const [leads, setLeads] = useState<PromoLead[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const [form, setForm] = useState<Partial<Promo>>({ ...EMPTY_PROMO_FORM, daysActive: [...ALL_DAYS] });

  const fetchPromos = async () => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const data = await fetchWithAuth<any>("/admin/promociones?all=true", session.token);
      setPromos(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const openCreate = () => {
    setEditingPromo(null);
    setForm({ ...EMPTY_PROMO_FORM, daysActive: [...ALL_DAYS] });
    setShowModal(true);
  };

  const openEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setForm({ ...promo });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async () => {
    const session = getAuthSession();
    if (!session) return;
    const body = JSON.stringify(form);
    try {
      if (editingPromo) {
        await fetchWithAuth(`/admin/promociones/${editingPromo.id}`, session.token, { method: "PUT", body });
      } else {
        await fetchWithAuth("/admin/promociones", session.token, { method: "POST", body });
      }
      closeModal();
      fetchPromos();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al guardar promoción");
    }
  };

  const handleDelete = async (id: string) => {
    const session = getAuthSession();
    if (!session) return;
    if (!confirm("¿Eliminar esta promoción?")) return;
    try {
      await fetchWithAuth(`/admin/promociones/${id}`, session.token, { method: "DELETE" });
      fetchPromos();
    } catch {
      alert("Error al eliminar");
    }
  };

  const handlePublication = async (promo: Promo) => {
    const session = getAuthSession();
    if (!session) return;
    try {
      await fetchWithAuth(`/admin/promociones/${promo.id}/${promo.published ? "unpublish" : "publish"}`, session.token, { method: "POST" });
      fetchPromos();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al actualizar la publicación");
    }
  };

  const copyLandingLink = async (promo: Promo) => {
    if (!promo.landingUrl) return;
    try {
      await navigator.clipboard.writeText(promo.landingUrl);
      alert("Enlace copiado");
    } catch {
      alert(`Copia este enlace: ${promo.landingUrl}`);
    }
  };

  const openInsights = async (promo: Promo) => {
    const session = getAuthSession();
    if (!session) return;
    setInsightsPromo(promo);
    setLoadingInsights(true);
    try {
      const [metricsResponse, leadsResponse] = await Promise.all([
        fetchWithAuth<PromoMetrics>(`/admin/promociones/${promo.id}/metrics`, session.token),
        fetchWithAuth<{ data: PromoLead[] }>(`/admin/promociones/${promo.id}/leads`, session.token),
      ]);
      setMetrics(metricsResponse);
      setLeads(leadsResponse.data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al cargar métricas");
      setInsightsPromo(null);
    } finally {
      setLoadingInsights(false);
    }
  };

  const downloadLeadsCsv = async () => {
    const session = getAuthSession();
    if (!session || !insightsPromo) return;
    try {
      await downloadAuthenticatedFile(`/admin/promociones/${insightsPromo.id}/leads.csv`, session.token, `leads-${insightsPromo.slug || insightsPromo.id}.csv`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al exportar leads");
    }
  };

  const toPreviewData = (promo: Partial<Promo>): PromoLandingData => ({
    titulo: promo.name || "Título de la campaña",
    descripcion: promo.description || "",
    descuento: promo.discount || "",
    imagen: promo.image || "",
    dia_inicio: promo.startDate || null,
    dia_fin: promo.endDate || null,
    dias_activos: promo.daysActive || [],
    indefinida: !!promo.indefinite,
    disponible_hoy: true,
    landing_title: promo.landingTitle || "",
    landing_subtitle: promo.landingSubtitle || "",
    landing_content: promo.landingContent || "",
    landing_template: promo.landingTemplate || "editorial",
    seo_title: promo.seoTitle || "",
    seo_description: promo.seoDescription || "",
    og_image: promo.ogImage || "",
    cta_primary_text: promo.ctaPrimaryText || "",
    cta_primary_url: promo.ctaPrimaryUrl || "",
    cta_secondary_text: promo.ctaSecondaryText || "",
    cta_secondary_url: promo.ctaSecondaryUrl || "",
    form_enabled: !!promo.formEnabled,
    form_fields: promo.formFields || [],
  });

  const applyCtaPreset = (target: "primary" | "secondary", text: string, url: string) => {
    setForm(target === "primary"
      ? { ...form, ctaPrimaryText: text, ctaPrimaryUrl: url }
      : { ...form, ctaSecondaryText: text, ctaSecondaryUrl: url });
  };

  const filteredPromos = promos.filter((p) => {
    if (filterStatus === "todas") return true;
    return p.status === filterStatus;
  });

  const getStatusBadge = (status: Promo["status"]) => {
    const styles = {
      activa: "bg-pop-gold/10 text-pop-gold",
      pausada: "bg-gray-600/10 text-gray-400",
      finalizada: "bg-red-500/10 text-red-500",
    };
    const labels = { activa: "Activa", pausada: "Pausada", finalizada: "Finalizada" };
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type: Promo["type"]) => {
    return <span className="bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300 rounded-md">{TYPE_LABELS[type]}</span>;
  };

  const activeCount = promos.filter((p) => p.status === "activa").length;
  const totalViews = promos.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalClicks = promos.reduce((acc, p) => acc + (p.clicksCount || 0), 0);
  const totalLeads = promos.reduce((acc, p) => acc + (p.leadsCount || 0), 0);

  // Build weekly calendar from real promo data
  const calendarDays = DAYS.map((day) => ({
    day,
    promos: promos
      .filter((p) => p.status === "activa" && p.daysActive.includes(day.value))
      .map((p) => p.name),
  }));

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">
            Marketing y Campañas
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">Gestiona promociones y landings públicas para compartir</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openCreate}
            className="px-5 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Nueva Campaña
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10" aria-label="Estadísticas de promociones">
        {[
          { label: "Promociones Activas", value: String(activeCount), icon: "local_offer", color: "pop-gold", sublabel: `De ${promos.length} totales` },
          { label: "Visitas a Landings", value: totalViews.toLocaleString(), icon: "visibility", color: "pop-orange", sublabel: "Acumuladas" },
          { label: "Clics en Botones", value: totalClicks.toLocaleString(), icon: "ads_click", color: "pop-light-gold", sublabel: "Acumulados" },
          { label: "Leads Captados", value: totalLeads.toLocaleString(), icon: "person_add", color: "error", sublabel: "Acumulados" },
        ].map((stat, index) => (
          <article
            key={index}
            className="bg-pop-cardGreen backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,103,37,0.05)] group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
                <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">{stat.icon}</span>
              </div>
              <span className="text-[10px] font-bold text-pop-gold bg-pop-gold/10 px-3 py-1 rounded-full uppercase tracking-widest">{stat.sublabel}</span>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">{stat.label}</h3>
            <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="bg-pop-cardGreen backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-white/5 mb-8">
        <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white mb-6">Calendario Semanal de Promociones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-4 border transition-all ${
                day.promos.length > 0 ? "bg-pop-gold/5 border-pop-gold/20 hover:bg-pop-gold/10" : "bg-gray-800/30 border-gray-700/30 opacity-60"
              }`}
            >
              <p className="text-xs font-bold text-pop-gold uppercase tracking-wider mb-3">{day.day.label}</p>
              <div className="space-y-1.5">
                {day.promos.length > 0 ? day.promos.map((name, pIdx) => (
                  <span key={pIdx} className="block text-[10px] bg-pop-orange/10 text-pop-orange px-2 py-1 rounded font-medium truncate">{name}</span>
                )) : (
                  <span className="block text-[10px] text-gray-600 px-2 py-1">Sin promos</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap gap-2 mb-6">
        {["todas", "activa", "pausada", "finalizada"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
              filterStatus === status ? "bg-pop-gold text-pop-black" : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            {status === "todas" ? "Todas" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </section>

      <section className="bg-pop-cardGreen backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 px-6 text-left font-medium">Promoción</th>
                <th className="pb-4 text-left font-medium">Tipo</th>
                <th className="pb-4 text-left font-medium">Descuento</th>
                <th className="pb-4 text-left font-medium">Vigencia</th>
                <th className="pb-4 text-left font-medium">Días</th>
                <th className="pb-4 text-left font-medium">Progreso</th>
                <th className="pb-4 text-left font-medium">Estado</th>
                <th className="pb-4 text-left font-medium">Landing</th>
                <th className="pb-4 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredPromos.map((promo) => {
                const progressPercent = promo.target > 0 ? Math.round((promo.redemptions / promo.target) * 100) : 0;
                return (
                  <tr key={promo.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                          {promo.image ? <img className="w-full h-full object-cover" src={promo.image} alt={promo.imageAlt || promo.name} loading="lazy" /> : <div className="w-full h-full bg-pop-gold/10" />}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{promo.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[200px]">{promo.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">{getTypeBadge(promo.type)}</td>
                    <td className="py-4 font-mono font-bold text-pop-gold text-sm">{promo.discount}</td>
                    <td className="py-4 text-xs text-gray-400">
                      {promo.indefinite ? <p>Indefinida</p> : <><p>{promo.startDate}</p><p className="text-gray-600">{promo.endDate}</p></>}
                    </td>
                    <td className="py-4 text-xs text-gray-300 font-medium">{promo.daysActive.map((day) => DAYS.find((option) => option.value === day)?.label || day).join(", ")}</td>
                    <td className="py-4">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                          <span>{promo.redemptions}</span>
                          <span>{promo.target}</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${progressPercent >= 80 ? "bg-pop-gold" : progressPercent >= 50 ? "bg-pop-light-gold" : "bg-pop-orange"}`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{progressPercent}%</p>
                      </div>
                    </td>
                    <td className="py-4">{getStatusBadge(promo.status)}</td>
                    <td className="py-4">
                      {promo.published ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider bg-pop-gold/10 text-pop-gold">Publicada</span>
                      ) : promo.landingEnabled ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider bg-pop-orange/10 text-pop-orange">Borrador</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider bg-gray-600/10 text-gray-500">Desactivada</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {promo.published && promo.slug && (
                          <>
                            <a href={promo.landingUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Ver landing">
                              <span className="material-symbols-outlined text-pop-gold text-lg">open_in_new</span>
                            </a>
                            <button onClick={() => copyLandingLink(promo)} className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Copiar enlace">
                              <span className="material-symbols-outlined text-pop-gold text-lg">content_copy</span>
                            </button>
                          </>
                        )}
                        {promo.landingEnabled && (
                          <>
                            <button onClick={() => openInsights(promo)} className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Métricas y leads">
                              <span className="material-symbols-outlined text-pop-gold text-lg">monitoring</span>
                            </button>
                            <button onClick={() => setPreviewPromo(promo)} className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Previsualizar">
                              <span className="material-symbols-outlined text-pop-gold text-lg">preview</span>
                            </button>
                            <button onClick={() => handlePublication(promo)} className="p-1.5 hover:bg-pop-orange/10 rounded transition-colors" title={promo.published ? "Despublicar" : "Publicar"}>
                              <span className="material-symbols-outlined text-pop-orange text-lg">{promo.published ? "visibility_off" : "publish"}</span>
                            </button>
                          </>
                        )}
                        <button onClick={() => openEdit(promo)} className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-pop-gold text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(promo.id)} className="p-1.5 hover:bg-error/10 rounded transition-colors" title="Eliminar">
                          <span className="material-symbols-outlined text-error text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPromos.length === 0 && !loading && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-500 text-xs uppercase tracking-widest">
                    Sin promociones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-pop-cardGreen border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">
                {editingPromo ? "Editar Campaña" : "Crear Campaña"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre de la Promoción</label>
                <input
                  type="text"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Happy Hour Margaritas"
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Tipo de Promoción</label>
                  <select
                    value={form.type || "descuento"}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                  >
                    <option value="descuento">Descuento</option>
                    <option value="2x1">2x1</option>
                    <option value="combo">Combo</option>
                    <option value="happy_hour">Happy Hour</option>
                    <option value="evento">Evento Especial</option>
                    <option value="puntos">Puntos</option>
                    <option value="regalo">Regalo</option>
                    <option value="especial">Especial</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Descuento / Beneficio</label>
                  <input
                    type="text"
                    value={form.discount || ""}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    placeholder="Ej: 20%, 2x1, Gratis"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Descripción</label>
                <textarea
                  rows={3}
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe los detalles de la promoción..."
                  className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all resize-none"
                />
              </div>
              <section className="rounded-lg border border-pop-gold/20 bg-pop-gold/5 p-4 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form.landingEnabled}
                    onChange={(e) => setForm({ ...form, landingEnabled: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-pop-gold"
                  />
                  <span>
                    <span className="block text-sm font-bold text-white">Landing pública individual</span>
                    <span className="block text-xs text-gray-400 mt-1">Habilita una URL para compartir esta campaña. La landing seguirá oculta hasta publicarla.</span>
                  </span>
                </label>
                {form.landingEnabled && (
                  <>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Slug de la URL</label>
                      <div className="flex items-center rounded-lg border border-white/10 bg-gray-800/50 overflow-hidden focus-within:border-pop-gold/50 transition-all">
                        <span className="px-3 py-3 text-xs text-gray-500 border-r border-white/10">/promo/</span>
                        <input
                          type="text"
                          value={form.slug || ""}
                          onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") })}
                          placeholder="sushiercoles"
                          className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2">Si lo dejas vacío al guardar, se generará desde el nombre de la campaña.</p>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Plantilla</label>
                      <select
                        value={form.landingTemplate || "editorial"}
                        onChange={(e) => setForm({ ...form, landingTemplate: e.target.value as Promo["landingTemplate"] })}
                        className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                      >
                        <option value="editorial">Editorial · imagen a la izquierda</option>
                        <option value="clasica">Clásica · contenido a la izquierda</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Título de landing</label>
                        <input
                          type="text"
                          value={form.landingTitle || ""}
                          onChange={(e) => setForm({ ...form, landingTitle: e.target.value })}
                          placeholder={form.name || "Título principal"}
                          className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Subtítulo</label>
                        <input
                          type="text"
                          value={form.landingSubtitle || ""}
                          onChange={(e) => setForm({ ...form, landingSubtitle: e.target.value })}
                          placeholder="Beneficio breve para redes sociales"
                          className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Contenido extendido</label>
                      <textarea
                        rows={4}
                        value={form.landingContent || ""}
                        onChange={(e) => setForm({ ...form, landingContent: e.target.value })}
                        placeholder="Explica condiciones, productos incluidos o detalles relevantes..."
                        className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all resize-none"
                      />
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/10 p-4 space-y-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-pop-gold">SEO y redes sociales</p>
                        <p className="mt-1 text-xs text-gray-400">Personaliza cómo aparecerá el enlace al compartirlo. Si dejas campos vacíos se usarán los textos e imagen de la landing.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Título SEO</label>
                          <input
                            type="text"
                            value={form.seoTitle || ""}
                            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                            placeholder={form.landingTitle || form.name || "Título para buscadores"}
                            className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Descripción SEO</label>
                          <input
                            type="text"
                            value={form.seoDescription || ""}
                            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                            placeholder={form.landingSubtitle || form.description || "Descripción para buscadores y redes"}
                            className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Imagen Open Graph (opcional)</label>
                        <ImageUpload
                          value={form.ogImage || ""}
                          onChange={(url) => setForm({ ...form, ogImage: url })}
                          folder="promociones"
                        />
                      </div>
                    </div>
                    {(["primary", "secondary"] as const).map((target) => {
                      const isPrimary = target === "primary";
                      return (
                        <div key={target} className="rounded-lg border border-white/10 bg-black/10 p-4 space-y-3">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-pop-gold">
                            CTA {isPrimary ? "principal" : "secundario"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {CTA_PRESETS.map((preset) => (
                              <button
                                key={`${target}-${preset.label}`}
                                type="button"
                                onClick={() => applyCtaPreset(target, preset.text, preset.url)}
                                className="rounded border border-white/10 bg-gray-800/50 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-300 hover:border-pop-gold/40 hover:text-pop-gold transition-all"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-3">
                            <input
                              type="text"
                              value={(isPrimary ? form.ctaPrimaryText : form.ctaSecondaryText) || ""}
                              onChange={(e) => setForm(isPrimary ? { ...form, ctaPrimaryText: e.target.value } : { ...form, ctaSecondaryText: e.target.value })}
                              placeholder="Texto del botón"
                              className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                            />
                            <input
                              type="text"
                              value={(isPrimary ? form.ctaPrimaryUrl : form.ctaSecondaryUrl) || ""}
                              onChange={(e) => setForm(isPrimary ? { ...form, ctaPrimaryUrl: e.target.value } : { ...form, ctaSecondaryUrl: e.target.value })}
                              placeholder="/orden o https://..."
                              className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="rounded-lg border border-white/10 bg-black/10 p-4 space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!form.formEnabled}
                          onChange={(e) => setForm({ ...form, formEnabled: e.target.checked, formFields: e.target.checked && (form.formFields || []).length === 0 ? ["nombre", "telefono"] : form.formFields })}
                          className="mt-0.5 w-4 h-4 accent-pop-gold"
                        />
                        <span>
                          <span className="block text-sm font-bold text-white">Formulario para captar leads</span>
                          <span className="block text-xs text-gray-400 mt-1">Muestra campos opcionales al final de la landing y almacena los envíos para consulta administrativa.</span>
                        </span>
                      </label>
                      {form.formEnabled && (
                        <div>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Campos requeridos</p>
                          <div className="flex flex-wrap gap-2">
                            {FORM_FIELD_OPTIONS.map((field) => {
                              const selected = (form.formFields || []).includes(field.value);
                              return (
                                <button
                                  key={field.value}
                                  type="button"
                                  onClick={() => setForm({
                                    ...form,
                                    formFields: selected
                                      ? (form.formFields || []).filter((value) => value !== field.value)
                                      : [...(form.formFields || []), field.value],
                                  })}
                                  className={`rounded border px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    selected ? "border-pop-gold bg-pop-gold text-pop-black" : "border-white/10 bg-gray-800/50 text-gray-400 hover:border-pop-gold/40"
                                  }`}
                                >
                                  {field.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </section>
              <label className="flex items-start gap-3 rounded-lg border border-pop-gold/20 bg-pop-gold/5 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.indefinite}
                  onChange={(e) => setForm({ ...form, indefinite: e.target.checked, startDate: e.target.checked ? "" : form.startDate, endDate: e.target.checked ? "" : form.endDate })}
                  className="mt-0.5 w-4 h-4 accent-pop-gold"
                />
                <span>
                  <span className="block text-sm font-bold text-white">Promoción recurrente indefinida</span>
                  <span className="block text-xs text-gray-400 mt-1">Se activa cada semana en los días seleccionados sin solicitar un rango de fechas.</span>
                </span>
              </label>
              {!form.indefinite && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Fecha de Inicio</label>
                    <input
                      type="date"
                      value={form.startDate || ""}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Fecha de Fin</label>
                    <input
                      type="date"
                      value={form.endDate || ""}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Días Activos</label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {DAYS.map((day) => {
                    const selected = (form.daysActive || []).includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => setForm({ ...form, daysActive: selected ? (form.daysActive || []).filter((value) => value !== day.value) : [...(form.daysActive || []), day.value] })}
                        className={`rounded-lg border px-2 py-3 text-xs font-bold transition-all ${selected ? "bg-pop-gold text-pop-black border-pop-gold" : "bg-gray-800/50 text-gray-400 border-white/10"}`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Meta de Redenciones</label>
                  <input
                    type="number"
                    value={form.target || 0}
                    onChange={(e) => setForm({ ...form, target: Number(e.target.value) })}
                    placeholder="Ej: 500"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Estado</label>
                  <select
                    value={form.status || "activa"}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Promo["status"] })}
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all"
                  >
                    <option value="activa">Activa</option>
                    <option value="pausada">Pausada</option>
                    <option value="finalizada">Finalizada</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Imagen (opcional)</label>
                  <ImageUpload
                    value={form.image || ""}
                    onChange={(url) => setForm({ ...form, image: url })}
                    folder="promociones"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              {form.landingEnabled && (
                <button onClick={() => setPreviewPromo(form)} className="px-6 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/40 rounded-lg hover:bg-pop-gold/10 transition-all">
                  Previsualizar
                </button>
              )}
              <button onClick={closeModal} className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all"
              >
                {editingPromo ? "Guardar Cambios" : "Crear Campaña"}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewPromo && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#0D0D0D]" role="dialog" aria-modal="true" aria-label="Previsualización de landing">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F2C777]/20 bg-[#0D0D0D]/95 px-5 py-3 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2C777]">Vista previa · no publicada</p>
            <button onClick={() => setPreviewPromo(null)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F2C894] hover:text-[#F2C777]">
              <span className="material-symbols-outlined text-lg">close</span>
              Cerrar
            </button>
          </div>
          <PromoLandingContent promo={toPreviewData(previewPromo)} preview />
        </div>
      )}

      {insightsPromo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setInsightsPromo(null)}>
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-white/10 bg-pop-cardGreen" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-white/5 p-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-pop-gold">Métricas y leads</p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white font-epilogue">{insightsPromo.name}</h2>
              </div>
              <button onClick={() => setInsightsPromo(null)} className="text-gray-500 transition-colors hover:text-white">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {loadingInsights || !metrics ? (
              <p className="p-8 text-sm text-gray-400">Cargando métricas...</p>
            ) : (
              <div className="space-y-7 p-6">
                <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                  {[
                    { label: "Visitas", value: metrics.viewsCount.toLocaleString() },
                    { label: "Clics", value: metrics.clicksCount.toLocaleString() },
                    { label: "Leads", value: metrics.leadsCount.toLocaleString() },
                    { label: "Clics / visita", value: `${metrics.clickThroughRate}%` },
                    { label: "Leads / visita", value: `${metrics.leadConversionRate}%` },
                  ].map((stat) => (
                    <article key={stat.label} className="rounded-lg border border-white/5 bg-black/15 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
                      <p className="mt-2 text-2xl font-black text-pop-gold">{stat.value}</p>
                    </article>
                  ))}
                </section>

                <section>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white font-epilogue">Leads registrados</h3>
                      <p className="mt-1 text-xs text-gray-500">Mostrando los últimos {leads.length} registros.</p>
                    </div>
                    <button onClick={downloadLeadsCsv} className="flex items-center gap-2 rounded-lg border border-pop-gold/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-pop-gold transition-colors hover:bg-pop-gold/10">
                      <span className="material-symbols-outlined text-base">download</span>
                      Exportar CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-white/5">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-black/20 uppercase tracking-wider text-gray-500">
                        <tr>
                          <th className="px-3 py-3">Fecha</th>
                          <th className="px-3 py-3">Nombre</th>
                          <th className="px-3 py-3">Teléfono</th>
                          <th className="px-3 py-3">Correo</th>
                          <th className="px-3 py-3">Mensaje</th>
                          <th className="px-3 py-3">Origen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        {leads.map((lead) => (
                          <tr key={lead.id}>
                            <td className="whitespace-nowrap px-3 py-3">{new Date(lead.created_at).toLocaleString("es-MX")}</td>
                            <td className="px-3 py-3">{lead.nombre || "—"}</td>
                            <td className="px-3 py-3">{lead.telefono || "—"}</td>
                            <td className="px-3 py-3">{lead.email || "—"}</td>
                            <td className="max-w-[220px] truncate px-3 py-3">{lead.mensaje || "—"}</td>
                            <td className="px-3 py-3">{lead.origen || "—"}</td>
                          </tr>
                        ))}
                        {leads.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-3 py-8 text-center uppercase tracking-widest text-gray-600">Sin leads registrados</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
