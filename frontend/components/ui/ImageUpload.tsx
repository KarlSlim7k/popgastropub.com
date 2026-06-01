"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { getAuthSession } from "@/lib/auth-session";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.popgastropub.com/api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: "menu" | "promociones" | "recompensas";
}

export function ImageUpload({ value, onChange, folder = "menu" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const session = getAuthSession();
      if (!session) throw new Error("No autenticado");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch(`${API_URL}/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status}`);
      }

      const data = await res.json();
      onChange(data.url);
    } catch (e: any) {
      setError(e.message || "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="relative border-2 border-dashed border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-pop-gold/40 transition-all"
        style={{ minHeight: "120px" }}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <div className="relative h-32">
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-black uppercase tracking-widest">Cambiar imagen</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-pop-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-gray-500 text-3xl">cloud_upload</span>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Subir imagen</p>
                <p className="text-[10px] text-gray-600">JPG, PNG, WebP · Máx 4MB</p>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* URL manual fallback */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="O pega una URL de imagen..."
        className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-pop-gold/50"
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
