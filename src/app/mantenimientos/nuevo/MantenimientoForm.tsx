"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Equipo } from "@/lib/db";

export default function MantenimientoForm({
  equipos,
  equipoIdPreseleccionado,
}: {
  equipos: Equipo[];
  equipoIdPreseleccionado?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const body = {
      equipoId: form.get("equipoId"),
      fecha: form.get("fecha"),
      realizadoPor: form.get("realizadoPor"),
      tipo: form.get("tipo"),
      descripcion: form.get("descripcion"),
      observaciones: form.get("observaciones"),
    };
    const res = await fetch("/api/mantenimientos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Ocurrió un error al guardar el mantenimiento");
      return;
    }
    const mantenimiento = await res.json();
    router.push(`/mantenimientos/${mantenimiento.id}`);
  }

  if (equipos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed bg-white p-6 text-center text-sm text-slate-500">
        Primero necesitas registrar al menos un equipo.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border bg-white p-6">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Equipo *</label>
        <select
          name="equipoId"
          required
          defaultValue={equipoIdPreseleccionado}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        >
          {equipos.map((equipo) => (
            <option key={equipo.id} value={equipo.id}>
              {equipo.alias}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Fecha *</label>
        <input
          type="date"
          name="fecha"
          required
          defaultValue={today}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Realizado por *</label>
        <input
          name="realizadoPor"
          required
          placeholder="Nombre del técnico"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Tipo de mantenimiento *</label>
        <select name="tipo" required className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500">
          <option value="preventivo">Preventivo</option>
          <option value="correctivo">Correctivo</option>
          <option value="revision">Revisión</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Descripción</label>
        <textarea
          name="descripcion"
          rows={3}
          placeholder="Qué se hizo"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Observaciones</label>
        <textarea
          name="observaciones"
          rows={3}
          placeholder="Hallazgos, recomendaciones, piezas a reemplazar, etc."
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <p className="text-xs text-slate-400">
        Podrás agregar fotos después de guardar el reporte.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {submitting ? "Guardando..." : "Guardar mantenimiento"}
      </button>
    </form>
  );
}
