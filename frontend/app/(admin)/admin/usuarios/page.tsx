"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://popgastropub.com/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  rfc: string;
  role: "cliente" | "mesero" | "admin";
  status: "activo" | "inactivo" | "pendiente";
  points: number;
  tier: string;
  tierColor: string;
  joinDate: string;
  lastVisit: string;
  orders: number;
  totalSpent: string;
  avatar: string;
}

export default function AdminUsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", rfc: "", role: "cliente", status: "activo", password: "" });

  const fetchUsers = async () => {
    const session = getAuthSession();
    if (!session) return;
    setLoading(true);
    try {
      const data = await fetchWithAuth<User[]>("/admin/usuarios", session.token);
      setUsers(data);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", phone: "", rfc: "", role: "cliente", status: "activo", password: "" });
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, phone: user.phone, rfc: user.rfc, role: user.role, status: user.status, password: "" });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const session = getAuthSession();
    if (!session) return;
    const payload: Record<string, string> = { ...form };
    if (!payload.password) delete payload.password;
    try {
      if (editingUser) {
        await fetchWithAuth(`/admin/usuarios/${editingUser.id}`, session.token, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        if (!form.password) { alert("La contraseña es requerida"); return; }
        await fetchWithAuth("/admin/usuarios", session.token, { method: "POST", body: JSON.stringify(payload) });
      }
      setShowModal(false);
      fetchUsers();
    } catch { alert("Error al guardar usuario"); }
  };

  const handleDelete = async (id: string) => {
    const session = getAuthSession();
    if (!session) return;
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await fetchWithAuth(`/admin/usuarios/${id}`, session.token, { method: "DELETE" });
      fetchUsers();
    } catch { alert("Error al eliminar"); }
  };

  const handleExport = () => {
    const session = getAuthSession();
    if (!session) return;
    window.open(`${API_URL}/api/admin/usuarios-export?token=${session.token}`, "_blank");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "todos" || user.role === filterRole;
    const matchesStatus = filterStatus === "todos" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: User["role"]) => {
    const styles = { admin: "bg-pop-gold/10 text-pop-gold", mesero: "bg-pop-orange/10 text-pop-orange", cliente: "bg-gray-700/50 text-gray-300" };
    const labels = { admin: "Admin", mesero: "Mesero", cliente: "Cliente" };
    return <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[role]}`}>{labels[role]}</span>;
  };

  const getStatusBadge = (status: User["status"]) => {
    const styles = { activo: "bg-pop-gold/10 text-pop-gold", inactivo: "bg-gray-600/10 text-gray-400", pendiente: "bg-blue-500/10 text-blue-400" };
    const labels = { activo: "Activo", inactivo: "Inactivo", pendiente: "Pendiente" };
    return <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[status]}`}>{labels[status]}</span>;
  };

  const roleStats = [
    { role: "Clientes", count: users.filter((u) => u.role === "cliente").length, icon: "person" },
    { role: "Meseros", count: users.filter((u) => u.role === "mesero").length, icon: "restaurant" },
    { role: "Admins", count: users.filter((u) => u.role === "admin").length, icon: "admin_panel_settings" },
    { role: "Nuevos (7d)", count: users.filter((u) => { if (!u.joinDate) return false; return (Date.now() - new Date(u.joinDate).getTime()) / 86400000 <= 7; }).length, icon: "person_add" },
  ];

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">Usuarios</h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">Gestiona clientes, meseros y administradores</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">download</span>Exportar
          </button>
          <button onClick={openCreate} className="px-4 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">person_add</span>Crear Usuario
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        {roleStats.map((stat, i) => (
          <article key={i} className="bg-pop-cardGreen rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
                <span className="material-symbols-outlined text-pop-gold text-3xl">{stat.icon}</span>
              </div>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">{stat.role}</h3>
            <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stat.count}</p>
          </article>
        ))}
      </section>

      <section className="bg-pop-cardGreen rounded-xl p-6 border border-white/5 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
            <input type="text" placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-800/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase self-center mr-1">Rol:</span>
            {["todos", "cliente", "mesero", "admin"].map((role) => (
              <button key={role} onClick={() => setFilterRole(role)} className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${filterRole === role ? "bg-pop-gold text-pop-black" : "bg-gray-800/50 text-gray-400 hover:text-white"}`}>{role === "todos" ? "Todos" : role.charAt(0).toUpperCase() + role.slice(1)}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase self-center mr-1">Estado:</span>
            {["todos", "activo", "inactivo"].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${filterStatus === s ? "bg-pop-gold text-pop-black" : "bg-gray-800/50 text-gray-400 hover:text-white"}`}>{s === "todos" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pop-cardGreen rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Lista de Usuarios</h2>
            <p className="text-xs text-pop-orange font-bold uppercase tracking-widest mt-1">{filteredUsers.length} usuarios</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 px-6 text-left font-medium">Usuario</th>
                <th className="pb-4 text-left font-medium">Contacto</th>
                <th className="pb-4 text-left font-medium">Rol</th>
                <th className="pb-4 text-left font-medium">Tier</th>
                <th className="pb-4 text-left font-medium">Puntos</th>
                <th className="pb-4 text-left font-medium">Pedidos</th>
                <th className="pb-4 text-left font-medium">Gastado</th>
                <th className="pb-4 text-left font-medium">Estado</th>
                <th className="pb-4 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-pop-gold flex-shrink-0">{user.avatar}</div>
                      <div>
                        <p className="font-semibold text-white text-sm">{user.name}</p>
                        <p className="text-[10px] text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-xs text-gray-300">{user.email}</p>
                    <p className="text-[10px] text-gray-500">{user.phone}</p>
                  </td>
                  <td className="py-4">{getRoleBadge(user.role)}</td>
                  <td className="py-4"><span className={`text-xs font-bold ${user.tierColor}`}>{user.tier}</span></td>
                  <td className="py-4 font-mono font-bold text-pop-gold text-sm">{user.points?.toLocaleString()}</td>
                  <td className="py-4 text-gray-300 font-mono text-sm">{user.orders}</td>
                  <td className="py-4 font-mono font-semibold text-white text-sm">{user.totalSpent}</td>
                  <td className="py-4">{getStatusBadge(user.status)}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(user)} className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Editar">
                        <span className="material-symbols-outlined text-pop-gold text-lg">edit</span>
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 hover:bg-red-500/10 rounded transition-colors" title="Eliminar">
                        <span className="material-symbols-outlined text-red-400 text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !loading && (
                <tr><td colSpan={9} className="py-10 text-center text-gray-500 text-xs uppercase tracking-widest">Sin usuarios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pop-black/90 backdrop-blur-xl" onClick={() => setShowModal(false)} />
          <div className="relative bg-pop-cardGreen border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <header className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">{editingUser ? "Editar Usuario" : "Crear Usuario"}</h2>
                <p className="text-[10px] text-pop-orange font-bold uppercase tracking-widest mt-1">Datos de cuenta</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-gray-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nombre</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Teléfono</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">RFC</label>
                  <input type="text" value={form.rfc} onChange={(e) => setForm({ ...form, rfc: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Rol</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm">
                    <option value="cliente">Cliente</option>
                    <option value="mesero">Mesero</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Estado</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">{editingUser ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña"}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingUser ? "••••••••" : "Mínimo 8 caracteres"} className="w-full bg-pop-black border border-white/10 rounded-xl p-3 text-white focus:border-pop-gold outline-none text-sm placeholder-gray-600" />
              </div>
            </div>
            <footer className="p-6 border-t border-white/5 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Cancelar</button>
              <button onClick={handleSubmit} className="flex-[2] py-3 bg-pop-gold text-pop-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-pop-lightGold shadow-lg">{editingUser ? "Guardar" : "Crear"}</button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
