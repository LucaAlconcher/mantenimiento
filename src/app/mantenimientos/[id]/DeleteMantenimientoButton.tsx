"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteMantenimientoButton({
  mantenimientoId,
  equipoId,
}: {
  mantenimientoId: string;
  equipoId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Eliminar este reporte de mantenimiento?")) return;
    setLoading(true);
    await fetch(`/api/mantenimientos/${mantenimientoId}`, { method: "DELETE" });
    router.push(`/equipos/${equipoId}`);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-200 hover:bg-red-100 disabled:opacity-50"
    >
      <Trash2 size={15} />
      {loading ? "Eliminando..." : "Eliminar reporte"}
    </button>
  );
}
