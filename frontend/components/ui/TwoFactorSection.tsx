"use client";

import { useState, useEffect } from "react";
import { getAuthSession } from "@/lib/auth-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.popgastropub.com/api";

async function api(path: string, method = "GET", body?: object) {
  const session = getAuthSession();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

export function TwoFactorSection() {
  const [status, setStatus] = useState<{ enabled: boolean; has_secret: boolean } | null>(null);
  const [step, setStep] = useState<"idle" | "setup" | "verify_enable" | "verify_disable">("idle");
  const [qrUrl, setQrUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadStatus = async () => {
    try {
      const s = await api("/auth/2fa/status");
      setStatus(s);
    } catch {}
  };

  useEffect(() => { loadStatus(); }, []);

  const showMsg = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleSetup = async () => {
    setLoading(true);
    try {
      const data = await api("/auth/2fa/setup", "POST");
      setQrUrl(data.qr_url);
      setSecret(data.secret);
      setStep("setup");
    } catch (e: any) { showMsg("error", e.message); }
    finally { setLoading(false); }
  };

  const handleEnable = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      await api("/auth/2fa/enable", "POST", { code });
      showMsg("success", "2FA activado correctamente");
      setStep("idle");
      setCode("");
      loadStatus();
    } catch (e: any) { showMsg("error", e.message); }
    finally { setLoading(false); }
  };

  const handleDisable = async () => {
    if (code.length !== 6) return;
    setLoading(true);
    try {
      await api("/auth/2fa/disable", "POST", { code });
      showMsg("success", "2FA desactivado");
      setStep("idle");
      setCode("");
      loadStatus();
    } catch (e: any) { showMsg("error", e.message); }
    finally { setLoading(false); }
  };

  if (!status) return <div className="h-16 bg-gray-800/30 rounded-lg animate-pulse" />;

  return (
    <div className="bg-gray-800/30 rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Autenticación de Dos Factores (2FA)</p>
          <p className="text-xs text-gray-500 mt-1">
            {status.enabled ? "✅ Activo — tu cuenta está protegida con TOTP" : "Capa extra de seguridad con Google Authenticator"}
          </p>
        </div>
        {status.enabled ? (
          <button onClick={() => setStep("verify_disable")} className="px-4 py-2 text-xs font-black text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all">
            Desactivar
          </button>
        ) : (
          <button onClick={handleSetup} disabled={loading} className="px-4 py-2 text-xs font-black text-pop-gold border border-pop-gold/20 rounded-lg hover:bg-pop-gold/10 transition-all disabled:opacity-50">
            {loading ? "..." : "Activar 2FA"}
          </button>
        )}
      </div>

      {msg && (
        <p className={`text-xs font-bold ${msg.type === "success" ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>
      )}

      {/* Setup: show QR */}
      {step === "setup" && (
        <div className="space-y-4 border-t border-white/5 pt-4">
          <p className="text-xs text-gray-400">1. Escanea este QR con Google Authenticator o Authy:</p>
          <div className="bg-white p-3 rounded-lg w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}`} alt="QR 2FA" width={180} height={180} />
          </div>
          <p className="text-[10px] text-gray-500 font-mono">Clave manual: <span className="text-white">{secret}</span></p>
          <p className="text-xs text-gray-400">2. Ingresa el código de 6 dígitos para confirmar:</p>
          <div className="flex gap-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-32 bg-pop-black border border-white/10 rounded-lg px-4 py-2 text-white text-center font-mono text-lg focus:border-pop-gold outline-none"
            />
            <button onClick={handleEnable} disabled={loading || code.length !== 6} className="px-6 py-2 bg-pop-gold text-pop-black font-black text-xs uppercase rounded-lg disabled:opacity-50">
              {loading ? "..." : "Confirmar"}
            </button>
            <button onClick={() => { setStep("idle"); setCode(""); }} className="px-4 py-2 text-xs text-gray-500 hover:text-white">Cancelar</button>
          </div>
        </div>
      )}

      {/* Disable: verify code */}
      {step === "verify_disable" && (
        <div className="space-y-3 border-t border-white/5 pt-4">
          <p className="text-xs text-gray-400">Ingresa el código actual para desactivar 2FA:</p>
          <div className="flex gap-3">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-32 bg-pop-black border border-white/10 rounded-lg px-4 py-2 text-white text-center font-mono text-lg focus:border-pop-gold outline-none"
            />
            <button onClick={handleDisable} disabled={loading || code.length !== 6} className="px-6 py-2 bg-red-500/20 text-red-400 font-black text-xs uppercase rounded-lg border border-red-500/20 disabled:opacity-50">
              {loading ? "..." : "Desactivar"}
            </button>
            <button onClick={() => { setStep("idle"); setCode(""); }} className="px-4 py-2 text-xs text-gray-500 hover:text-white">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
