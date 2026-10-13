"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function FotoUploader({ mantenimientoId }: { mantenimientoId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Selecciona una foto primero");
      return;
    }
    setError(null);
    setUploading(true);
    const formData = new FormData(form);
    const res = await fetch(`/api/mantenimientos/${mantenimientoId}/fotos`, {
      method: "POST",
      body: formData,
    });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo subir la foto");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg border bg-white p-4">
      <label className="text-sm font-medium">Agregar foto</label>
      <input
        ref={inputRef}
        type="file"
        name="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="text-sm"
      />
      <input
        type="text"
        name="caption"
        placeholder="Descripción de la foto (opcional)"
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={uploading}
        className="self-start rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {uploading ? "Subiendo..." : "Subir foto"}
      </button>
    </form>
  );
}
