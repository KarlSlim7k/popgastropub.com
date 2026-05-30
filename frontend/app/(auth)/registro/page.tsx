"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth-session";
import { useAuth } from "@/lib/auth-provider";

interface AuthResponse {
  user: { id: number; name: string; email: string; role?: string; points?: number; tier?: string };
  token: string;
}

export default function RegistroPage() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", password_confirmation: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Ingresa un email válido.";
    if (form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (form.password !== form.password_confirmation) return "Las contraseñas no coinciden.";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    try {
      const res = await fetchAPI<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim() || null,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });
      saveAuthSession({ token: res.token, user: res.user, provider: "password" });
      refreshSession();
      router.push("/puntos");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Error al registrar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-[#F2C777]">Crear Cuenta</h1>
          <p className="mt-3 inline-block rounded-full bg-[#D96725]/15 border border-[#D96725]/30 px-4 py-1.5 text-sm text-[#F2C894]">
            🎁 Obtén 50 puntos de bienvenida al registrarte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
          {error && (
            <div className="rounded-md border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Nombre completo</label>
            <input type="text" required value={form.name} onChange={set("name")} autoComplete="name"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="Tu nombre" />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Email</label>
            <input type="email" required value={form.email} onChange={set("email")} autoComplete="email"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="correo@ejemplo.com" />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Teléfono <span className="text-white/40">(opcional)</span></label>
            <input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="2828253243" />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Contraseña</label>
            <input type="password" required minLength={8} value={form.password} onChange={set("password")} autoComplete="new-password"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="Mínimo 8 caracteres" />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Confirmar contraseña</label>
            <input type="password" required minLength={8} value={form.password_confirmation} onChange={set("password_confirmation")} autoComplete="new-password"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="Repite tu contraseña" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#D96725] hover:bg-[#D96725]/85 text-white font-bold uppercase tracking-widest py-4 rounded-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="text-center text-sm text-white/50">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[#F2C777] font-bold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
