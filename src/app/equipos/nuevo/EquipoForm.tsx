"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EquipoForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const body = {
      tipo: form.get("tipo"),
      alias: form.get("alias"),
      modelo: form.get("modelo"),
      numeroSerie: form.get("numeroSerie"),
      ubicacion: form.get("ubicacion"),
      notas: form.get("notas"),
    };
    const res = await fetch("/api/equipos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Ocurrió un error al guardar el equipo");
      return;
    }
    const equipo = await res.json();
    router.push(`/equipos/${equipo.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border bg-white p-6">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Tipo *</label>
        <select name="tipo" required className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500">
          <option value="dock">DJI Dock</option>
          <option value="drone">Drone</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Alias / nombre *</label>
        <input
          name="alias"
          required
          placeholder="Ej: Dock 1 - El Triángulo"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Modelo</label>
        <input
          name="modelo"
          placeholder="Ej: DJI Dock 3 / Matrice 4 TD"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">N° de serie</label>
        <input name="numeroSerie" className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Ubicación</label>
        <input
          name="ubicacion"
          placeholder="Ej: El Triángulo - Cerro Dragón - PAE"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Notas</label>
        <textarea name="notas" rows={3} className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {submitting ? "Guardando..." : "Guardar equipo"}
      </button>
    </form>
  );
}
