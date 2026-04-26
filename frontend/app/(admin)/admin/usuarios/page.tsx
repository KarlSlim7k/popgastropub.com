"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { getAuthSession } from "@/lib/auth-session";

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

  useEffect(() => {
    const session = getAuthSession();
    if (!session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchWithAuth<User[]>("/api/admin/usuarios", session.token)
      .then((data) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "todos" || user.role === filterRole;
    const matchesStatus = filterStatus === "todos" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: User["role"]) => {
    const styles = {
      admin: "bg-pop-gold/10 text-pop-gold",
      mesero: "bg-pop-light-gold/10 text-pop-light-gold",
      cliente: "bg-gray-700/50 text-gray-300",
    };
    const labels = { admin: "Admin", mesero: "Mesero", cliente: "Cliente" };
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const getStatusBadge = (status: User["status"]) => {
    const styles = {
      activo: "bg-pop-gold/10 text-pop-gold",
      inactivo: "bg-gray-600/10 text-gray-400",
      pendiente: "bg-blue-500/10 text-blue-400",
    };
    const labels = { activo: "Activo", inactivo: "Inactivo", pendiente: "Pendiente" };
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const roleStats = [
    { role: "Clientes", count: users.filter((u) => u.role === "cliente").length, icon: "person", color: "pop-gold" },
    { role: "Meseros", count: users.filter((u) => u.role === "mesero").length, icon: "restaurant", color: "pop-orange" },
    { role: "Admins", count: users.filter((u) => u.role === "admin").length, icon: "admin_panel_settings", color: "pop-light-gold" },
    {
      role: "Nuevos (7 días)",
      count: users.filter((u) => {
        if (!u.joinDate) return false;
        const d = new Date(u.joinDate);
        const now = new Date();
        const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }).length,
      icon: "person_add",
      color: "error",
    },
  ];

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">Usuarios</h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">Gestiona clientes, meseros y administradores</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all duration-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">download</span>
            Exportar
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10" aria-label="Estadísticas de roles">
        {roleStats.map((stat, index) => (
          <article
            key={index}
            className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,103,37,0.05)] group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
                <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">{stat.icon}</span>
              </div>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">{stat.role}</h3>
            <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stat.count.toLocaleString()}</p>
          </article>
        ))}
      </section>

      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border border-white/5 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
            <input
              type="text"
              placeholder="Buscar por nombre, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 focus:ring-1 focus:ring-pop-gold/20 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase self-center mr-1">Rol:</span>
            {["todos", "cliente", "mesero", "admin"].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  filterRole === role ? "bg-pop-gold text-pop-black" : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {role === "todos" ? "Todos" : role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase self-center mr-1">Estado:</span>
            {["todos", "activo", "inactivo", "pendiente"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  filterStatus === status ? "bg-pop-gold text-pop-black" : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {status === "todos" ? "Todos" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">Lista de Usuarios</h2>
              <p className="text-xs text-pop-orange font-bold uppercase tracking-widest mt-1">{filteredUsers.length} usuarios encontrados</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 px-6 text-left font-medium">Usuario</th>
                <th className="pb-4 text-left font-medium">Contacto</th>
                <th className="pb-4 text-left font-medium">Rol</th>
                <th className="pb-4 text-left font-medium">Tier POP</th>
                <th className="pb-4 text-left font-medium">Puntos</th>
                <th className="pb-4 text-left font-medium">Pedidos</th>
                <th className="pb-4 text-left font-medium">Total Gastado</th>
                <th className="pb-4 text-left font-medium">Última Visita</th>
                <th className="pb-4 text-left font-medium">Estado</th>
                <th className="pb-4 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-pop-gold flex-shrink-0">
                        {user.avatar || user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{user.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-xs text-gray-300">{user.email}</p>
                    <p className="text-[10px] text-gray-500">{user.phone}</p>
                  </td>
                  <td className="py-4">{getRoleBadge(user.role)}</td>
                  <td className="py-4">
                    <span className={`text-xs font-bold ${user.tierColor || "text-gray-400"}`}>{user.tier || "-"}</span>
                  </td>
                  <td className="py-4 font-mono font-bold text-pop-gold text-sm">{user.points?.toLocaleString()}</td>
                  <td className="py-4 text-gray-300 font-mono text-sm">{user.orders}</td>
                  <td className="py-4 font-mono font-semibold text-white text-sm">{user.totalSpent}</td>
                  <td className="py-4 text-xs text-gray-400">{user.lastVisit}</td>
                  <td className="py-4">{getStatusBadge(user.status)}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Ver perfil">
                        <span className="material-symbols-outlined text-pop-gold text-lg">visibility</span>
                      </button>
                      <button className="p-1.5 hover:bg-pop-gold/10 rounded transition-colors" title="Editar">
                        <span className="material-symbols-outlined text-gray-400 text-lg">edit</span>
                      </button>
                      <button className="p-1.5 hover:bg-error/10 rounded transition-colors" title="Eliminar">
                        <span className="material-symbols-outlined text-error text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-gray-500 text-xs uppercase tracking-widest">
                    Sin usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
