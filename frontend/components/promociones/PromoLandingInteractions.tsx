"use client";

import { useEffect, useState, type AnchorHTMLAttributes, type FormEvent, type ReactNode } from "react";
import { API_URL } from "@/lib/api";

export type PromoFormField = "nombre" | "telefono" | "email" | "mensaje";
type PromoClickType = "cta_primary_click" | "cta_secondary_click";

const FIELD_CONFIG: Record<PromoFormField, { label: string; type: string; placeholder: string }> = {
  nombre: { label: "Nombre", type: "text", placeholder: "Tu nombre" },
  telefono: { label: "Teléfono", type: "tel", placeholder: "Tu teléfono" },
  email: { label: "Correo electrónico", type: "email", placeholder: "tu@email.com" },
  mensaje: { label: "Mensaje", type: "textarea", placeholder: "¿Cómo podemos ayudarte?" },
};

async function postInteraction(slug: string, endpoint: string, body: Record<string, string> = {}) {
  return fetch(`${API_URL}/promociones/${encodeURIComponent(slug)}/${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    keepalive: endpoint !== "lead",
    body: JSON.stringify(body),
  });
}

function getLeadOrigin(): string {
  if (!document.referrer) return "landing";

  try {
    return new URL(document.referrer).hostname;
  } catch {
    return "landing";
  }
}

function recordClick(slug: string, type: PromoClickType): void {
  const url = `${API_URL}/promociones/${encodeURIComponent(slug)}/click`;
  const body = new FormData();
  body.append("type", type);

  if (navigator.sendBeacon?.(url, body)) return;

  void postInteraction(slug, "click", { type }).catch(() => undefined);
}

export function PromoViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    void postInteraction(slug, "view").catch(() => undefined);
  }, [slug]);

  return null;
}

export function PromoTrackedLink({
  slug,
  eventType,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  slug: string;
  eventType: PromoClickType;
  children: ReactNode;
}) {
  return (
    <a
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        recordClick(slug, eventType);
      }}
    >
      {children}
    </a>
  );
}

export function PromoLeadForm({
  slug,
  fields,
  preview = false,
}: {
  slug?: string;
  fields: PromoFormField[];
  preview?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!slug || preview) return;

    setStatus("sending");
    try {
      const response = await postInteraction(slug, "lead", {
        ...values,
        origen: getLeadOrigin(),
      });
      if (!response.ok) throw new Error("No fue posible registrar tus datos.");

      setValues({});
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="mt-10 border border-[#F2C777]/25 bg-[#732817]/30 p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D96725]">Mantente en contacto</p>
      <h2 className="mt-2 font-epilogue text-2xl font-black uppercase text-[#F2C777]">Déjanos tus datos</h2>
      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const config = FIELD_CONFIG[field];
          const sharedProps = {
            id: `promo-${field}`,
            name: field,
            value: values[field] || "",
            required: true,
            disabled: preview || status === "sending",
            placeholder: config.placeholder,
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setValues({ ...values, [field]: event.target.value }),
            className: "w-full border border-[#F2C777]/20 bg-[#0D0D0D]/60 px-3 py-3 text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-[#F2C777] disabled:opacity-60",
          };

          return (
            <label key={field} className={field === "mensaje" ? "sm:col-span-2" : ""}>
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-[#F2C894]">
                {config.label}
              </span>
              {config.type === "textarea" ? (
                <textarea {...sharedProps} rows={4} />
              ) : (
                <input {...sharedProps} type={config.type} />
              )}
            </label>
          );
        })}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={preview || status === "sending"}
            className="w-full bg-[#F2C777] px-5 py-3 text-sm font-black uppercase tracking-widest text-[#0D0D0D] transition-colors hover:bg-[#F2C894] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Enviando..." : "Enviar datos"}
          </button>
          {status === "success" && <p className="mt-3 text-sm font-bold text-[#F2C777]">Tus datos se registraron correctamente.</p>}
          {status === "error" && <p className="mt-3 text-sm font-bold text-[#D96725]">No fue posible enviar tus datos. Inténtalo nuevamente.</p>}
          {preview && <p className="mt-3 text-xs text-[#F2C894]">El envío está desactivado durante la vista previa.</p>}
        </div>
      </form>
    </section>
  );
}
