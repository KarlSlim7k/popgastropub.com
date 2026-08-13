"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth-session";
import { useAuth } from "@/lib/auth-provider";
import PasswordInput from "@/components/ui/PasswordInput";

interface AuthResponse {
  user: { id: number; name: string; email: string; role?: string; points?: number; tier?: string };
  token?: string;
}

export default function RegistroPage() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    password: "",
    password_confirmation: "",
    terms_accepted: false,
    newsletter_subscribed: false,
  });
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setReferralCode(new URLSearchParams(window.location.search).get("ref")?.trim() ?? "");
  }, []);

  function validate(): string | null {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Ingresa un email válido.";
    if (form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(form.password) || !/\d/.test(form.password)) return "La contraseña debe incluir al menos una letra y un número.";
    if (form.password !== form.password_confirmation) return "Las contraseñas no coinciden.";
    if (!form.terms_accepted) return "Debes aceptar los Términos y la Política de Privacidad.";
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
          birth_date: form.birth_date || null,
          password: form.password,
          password_confirmation: form.password_confirmation,
          terms_accepted: form.terms_accepted,
          newsletter_subscribed: form.newsletter_subscribed,
          ...(referralCode ? { ref: referralCode } : {}),
        }),
      });
      saveAuthSession({ token: "http-only-cookie", user: res.user, provider: "password" });
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
          {referralCode && <p className="mt-3 text-sm text-white/70">Invitación aplicada: <strong className="text-[#F2C777]">{referralCode}</strong></p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
          {error && (
            <div className="rounded-md border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
          )}

          <div>
            <label htmlFor="register-name" className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Nombre completo</label>
            <input id="register-name" type="text" required value={form.name} onChange={set("name")} autoComplete="name"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="Tu nombre" />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Email</label>
            <input id="register-email" type="email" required value={form.email} onChange={set("email")} autoComplete="email"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="correo@ejemplo.com" />
          </div>

          <div>
            <label htmlFor="register-phone" className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Teléfono <span className="text-white/40">(opcional)</span></label>
            <input id="register-phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} autoComplete="tel" inputMode="numeric" maxLength={10}
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="2828253243" />
          </div>

          <div>
            <label htmlFor="register-birth-date" className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Fecha de nacimiento <span className="text-white/40">(opcional)</span></label>
            <input id="register-birth-date" type="date" value={form.birth_date} onChange={set("birth_date")} autoComplete="bday"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#D96725] transition-colors [color-scheme:dark]" />
            <p className="mt-1 text-[11px] text-white/40">Se usa para otorgarte el bono anual de cumpleaños.</p>
          </div>

          <div>
            <label htmlFor="register-password" className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Contraseña</label>
            <PasswordInput id="register-password" required minLength={8} value={form.password} onChange={set("password")} autoComplete="new-password"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 pr-10 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="Mínimo 8 caracteres" />
          </div>

          <div>
            <label htmlFor="register-password-confirmation" className="block text-[10px] uppercase tracking-widest text-[#F2C777] mb-1">Confirmar contraseña</label>
            <PasswordInput id="register-password-confirmation" required minLength={8} value={form.password_confirmation} onChange={set("password_confirmation")} autoComplete="new-password"
              className="w-full bg-transparent border border-white/10 rounded-md px-4 py-3 pr-10 text-white placeholder-white/30 focus:outline-none focus:border-[#D96725] transition-colors"
              placeholder="Repite tu contraseña" />
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" id="newsletter" checked={form.newsletter_subscribed}
              onChange={(e) => setForm((f) => ({ ...f, newsletter_subscribed: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded-sm border border-white/10 bg-transparent accent-[#D96725]" />
            <label htmlFor="newsletter" className="text-xs text-white/50 leading-tight">
              Quiero recibir promociones y noticias por correo.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" id="terms" required checked={form.terms_accepted}
              onChange={(e) => setForm((f) => ({ ...f, terms_accepted: e.target.checked }))}
              className="mt-1 w-4 h-4 rounded-sm border border-white/10 bg-transparent accent-[#D96725]" />
            <label htmlFor="terms" className="text-xs text-white/60 leading-relaxed">
              Acepto los <Link href="/terminos" className="text-[#F2C777] hover:underline">Términos</Link> y la <Link href="/privacidad" className="text-[#F2C777] hover:underline">Política de Privacidad</Link>.
            </label>
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
