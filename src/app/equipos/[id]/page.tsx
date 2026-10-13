import Link from "next/link";
import { notFound } from "next/navigation";
import { Wrench } from "lucide-react";
import { getEquipo, listMantenimientos } from "@/lib/db";
import {
  TIPO_EQUIPO_COLOR,
  TIPO_EQUIPO_LABEL,
  TIPO_MANTENIMIENTO_COLOR,
  TIPO_MANTENIMIENTO_LABEL,
  formatFecha,
} from "@/lib/labels";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import ClickableRow from "@/components/ClickableRow";
import DeleteEquipoButton from "./DeleteEquipoButton";

export default async function EquipoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const equipo = await getEquipo(id);
  if (!equipo) notFound();

  const mantenimientos = await listMantenimientos(id);

  return (
    <div className="flex flex-col">
      <PageHeader
        title={equipo.alias}
        description={`${TIPO_EQUIPO_LABEL[equipo.tipo]}${equipo.modelo ? ` · ${equipo.modelo}` : ""}${equipo.numeroSerie ? ` · N/S ${equipo.numeroSerie}` : ""}`}
        action={
          <div className="flex items-center gap-4">
            <Link
              href={`/mantenimientos/nuevo?equipoId=${equipo.id}`}
              className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500"
            >
              <Wrench size={16} />
              Registrar mantenimiento
            </Link>
            <DeleteEquipoButton equipoId={equipo.id} />
          </div>
        }
      />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={TIPO_EQUIPO_COLOR[equipo.tipo]}>{TIPO_EQUIPO_LABEL[equipo.tipo]}</Badge>
          {equipo.ubicacion && (
            <span className="text-sm text-slate-500">📍 {equipo.ubicacion}</span>
          )}
        </div>
        {equipo.notas && (
          <p className="rounded-lg border bg-white p-4 text-sm text-slate-600">{equipo.notas}</p>
        )}

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Historial de mantenimientos ({mantenimientos.length})
          </h2>

          {mantenimientos.length === 0 ? (
            <p className="rounded-lg border border-dashed bg-white p-6 text-center text-sm text-slate-500">
              Todavía no hay mantenimientos registrados para este equipo.
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Realizado por</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3">Fotos</th>
                  </tr>
                </thead>
                <tbody>
                  {mantenimientos.map((m) => (
                    <ClickableRow key={m.id} href={`/mantenimientos/${m.id}`}>
                      <td className="px-4 py-3 font-medium text-slate-900">{formatFecha(m.fecha)}</td>
                      <td className="px-4 py-3">
                        <Badge className={TIPO_MANTENIMIENTO_COLOR[m.tipo]}>
                          {TIPO_MANTENIMIENTO_LABEL[m.tipo]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{m.realizadoPor}</td>
                      <td className="px-4 py-3 text-slate-500">{m.descripcion || "—"}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {m.fotos.length > 0 ? `📷 ${m.fotos.length}` : "—"}
                      </td>
                    </ClickableRow>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
