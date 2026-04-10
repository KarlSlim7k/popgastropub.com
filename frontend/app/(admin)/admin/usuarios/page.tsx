"use client";

import { useState } from "react";

// Types
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

interface RoleStats {
  role: string;
  count: number;
  icon: string;
  color: string;
}

export default function AdminUsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const roleStats: RoleStats[] = [
    { role: "Clientes", count: 1240, icon: "person", color: "pop-gold" },
    { role: "Meseros", count: 18, icon: "restaurant", color: "pop-orange" },
    { role: "Admins", count: 4, icon: "admin_panel_settings", color: "pop-light-gold" },
    { role: "Nuevos (7 días)", count: 32, icon: "person_add", color: "error" },
  ];

  const users: User[] = [
    {
      id: "USR-001",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@email.com",
      phone: "282-123-4567",
      rfc: "MECC900101-XXX",
      role: "admin",
      status: "activo",
      points: 3450,
      tier: "POP Elite",
      tierColor: "text-pop-gold",
      joinDate: "2023-06-15",
      lastVisit: "2024-04-10",
      orders: 156,
      totalSpent: "$45,600",
      avatar: "CM",
    },
    {
      id: "USR-002",
      name: "María Fernanda López",
      email: "maria.lopez@email.com",
      phone: "282-234-5678",
      rfc: "LOMF850315-XXX",
      role: "cliente",
      status: "activo",
      points: 2800,
      tier: "POP VIP",
      tierColor: "text-pop-orange",
      joinDate: "2023-08-20",
      lastVisit: "2024-04-09",
      orders: 89,
      totalSpent: "$28,400",
      avatar: "ML",
    },
    {
      id: "USR-003",
      name: "Ricardo García",
      email: "ricardo.g@pop.com",
      phone: "282-345-6789",
      rfc: "GARC920520-XXX",
      role: "mesero",
      status: "activo",
      points: 2450,
      tier: "Staff",
      tierColor: "text-pop-light-gold",
      joinDate: "2023-09-01",
      lastVisit: "2024-04-10",
      orders: 142,
      totalSpent: "$0",
      avatar: "RG",
    },
    {
      id: "USR-004",
      name: "Sofía Luna",
      email: "sofia.luna@email.com",
      phone: "282-456-7890",
      rfc: "LUSF930810-XXX",
      role: "cliente",
      status: "activo",
      points: 1920,
      tier: "POP Lover",
      tierColor: "text-pop-light-gold",
      joinDate: "2023-11-05",
      lastVisit: "2024-04-08",
      orders: 67,
      totalSpent: "$15,200",
      avatar: "SL",
    },
    {
      id: "USR-005",
      name: "Marco Antonio Ruiz",
      email: "marco.ruiz@email.com",
      phone: "282-567-8901",
      rfc: "RUMA880725-XXX",
      role: "cliente",
      status: "inactivo",
      points: 480,
      tier: "POP Fan",
      tierColor: "text-gray-400",
      joinDate: "2024-01-12",
      lastVisit: "2024-03-01",
      orders: 12,
      totalSpent: "$3,200",
      avatar: "MR",
    },
    {
      id: "USR-006",
      name: "Laura Castillo",
      email: "laura.c@pop.com",
      phone: "282-678-9012",
      rfc: "CALC950412-XXX",
      role: "mesero",
      status: "activo",
      points: 1450,
      tier: "Staff",
      tierColor: "text-pop-light-gold",
      joinDate: "2023-10-15",
      lastVisit: "2024-04-10",
      orders: 98,
      totalSpent: "$0",
      avatar: "LC",
    },
    {
      id: "USR-007",
      name: "Jorge Pérez",
      email: "jorge.perez@email.com",
      phone: "282-789-0123",
      rfc: "PEPJ900228-XXX",
      role: "cliente",
      status: "pendiente",
      points: 50,
      tier: "POP Fan",
      tierColor: "text-gray-400",
      joinDate: "2024-04-08",
      lastVisit: "2024-04-08",
      orders: 1,
      totalSpent: "$350",
      avatar: "JP",
    },
    {
      id: "USR-008",
      name: "Ana Martínez",
      email: "ana.mtz@email.com",
      phone: "282-890-1234",
      rfc: "MAAN910605-XXX",
      role: "cliente",
      status: "activo",
      points: 1650,
      tier: "POP VIP",
      tierColor: "text-pop-orange",
      joinDate: "2023-07-22",
      lastVisit: "2024-04-07",
      orders: 78,
      totalSpent: "$22,100",
      avatar: "AM",
    },
  ];

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
    const labels = {
      admin: "Admin",
      mesero: "Mesero",
      cliente: "Cliente",
    };
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
    const labels = {
      activo: "Activo",
      inactivo: "Inactivo",
      pendiente: "Pendiente",
    };
    return (
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <main className="pt-24 lg:pt-20 p-4 lg:p-10 min-h-screen bg-pop-black">
      {/* Header */}
      <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white font-epilogue uppercase">
            Usuarios
          </h1>
          <p className="text-gray-400 mt-2 text-base lg:text-lg font-manrope">
            Gestiona clientes, meseros y administradores
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 text-sm font-semibold text-pop-gold border border-pop-gold/30 rounded-lg hover:bg-pop-gold/10 transition-all duration-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">download</span>
            Exportar
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all duration-200 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Nuevo Usuario
          </button>
        </div>
      </header>

      {/* Role Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10" aria-label="Estadísticas de roles">
        {roleStats.map((stat, index) => (
          <article
            key={index}
            className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl p-6 border-l-4 border-pop-gold hover:border-pop-orange transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,103,37,0.05)] group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-white/5 group-hover:bg-pop-gold/10 transition-colors">
                <span className="material-symbols-outlined text-pop-gold text-3xl transition-transform group-hover:scale-110">
                  {stat.icon}
                </span>
              </div>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
              {stat.role}
            </h3>
            <p className="text-3xl font-black text-white tracking-tighter font-epilogue">{stat.count.toLocaleString()}</p>
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
              placeholder="Buscar por nombre, email o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 focus:ring-1 focus:ring-pop-gold/20 transition-all"
            />
          </div>
          {/* Role Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase self-center mr-1">Rol:</span>
            {["todos", "cliente", "mesero", "admin"].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  filterRole === role
                    ? "bg-pop-gold text-pop-black"
                    : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {role === "todos" ? "Todos" : role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase self-center mr-1">Estado:</span>
            {["todos", "activo", "inactivo", "pendiente"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  filterStatus === status
                    ? "bg-pop-gold text-pop-black"
                    : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {status === "todos" ? "Todos" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Users Table */}
      <section className="bg-[#1C1B1B] backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black uppercase font-epilogue tracking-tighter text-white">
                Lista de Usuarios
              </h2>
              <p className="text-xs text-pop-orange font-bold uppercase tracking-widest mt-1">
                {filteredUsers.length} usuarios encontrados
              </p>
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
                        {user.avatar}
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
                    <span className={`text-xs font-bold ${user.tierColor}`}>{user.tier}</span>
                  </td>
                  <td className="py-4 font-mono font-bold text-pop-gold text-sm">{user.points.toLocaleString()}</td>
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
            </tbody>
          </table>
        </div>
      </section>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#1C1B1B] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase font-epilogue tracking-tighter text-white">
                Nuevo Usuario
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Ej: Carlos Mendoza"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="email@ejemplo.com"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="282-123-4567"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">RFC (opcional)</label>
                  <input
                    type="text"
                    placeholder="XXXX000000-XXX"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Rol</label>
                  <select className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-pop-gold/50 transition-all">
                    <option value="">Seleccionar rol</option>
                    <option value="cliente">Cliente</option>
                    <option value="mesero">Mesero</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Contraseña Temporal</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pop-gold/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="accent-pop-gold w-4 h-4" defaultChecked />
                  <span className="text-sm text-gray-300">Enviar credenciales por email</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-all"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 text-sm font-semibold text-pop-black bg-pop-gold rounded-lg hover:bg-pop-light-gold transition-all">
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
