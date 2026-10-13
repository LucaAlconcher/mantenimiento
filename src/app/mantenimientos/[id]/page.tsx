import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import { getEquipo, getMantenimiento } from "@/lib/db";
import {
  TIPO_MANTENIMIENTO_COLOR,
  TIPO_MANTENIMIENTO_LABEL,
  formatFecha,
} from "@/lib/labels";
import Badge from "@/components/Badge";
import FotoUploader from "./FotoUploader";
import DeleteMantenimientoButton from "./DeleteMantenimientoButton";

export default async function MantenimientoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mantenimiento = await getMantenimiento(id);
  if (!mantenimiento) notFound();

  const equipo = await getEquipo(mantenimiento.equipoId);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <Link
            href={equipo ? `/equipos/${equipo.id}` : "/"}
            className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-violet-600"
          >
            <ArrowLeft size={13} />
            {equipo?.alias ?? "Volver"}
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-slate-900">
              Mantenimiento {formatFecha(mantenimiento.fecha)}
            </h1>
            <Badge className={TIPO_MANTENIMIENTO_COLOR[mantenimiento.tipo]}>
              {TIPO_MANTENIMIENTO_LABEL[mantenimiento.tipo]}
            </Badge>
          </div>
        </div>
        <DeleteMantenimientoButton mantenimientoId={mantenimiento.id} equipoId={mantenimiento.equipoId} />
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col gap-4 rounded-lg border bg-white p-5">
          <dl className="flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Realizado por</dt>
              <dd className="text-slate-900">{mantenimiento.realizadoPor}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Fecha</dt>
              <dd className="text-slate-900">{formatFecha(mantenimiento.fecha)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Equipo</dt>
              <dd className="text-slate-900">
                {equipo ? (
                  <Link href={`/equipos/${equipo.id}`} className="text-violet-600 hover:underline">
                    {equipo.alias}
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>

          {mantenimiento.descripcion && (
            <div className="border-t pt-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">Descripción</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{mantenimiento.descripcion}</p>
            </div>
          )}

          {mantenimiento.observaciones && (
            <div className="border-t pt-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">Observaciones</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{mantenimiento.observaciones}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <Camera size={15} />
            Fotos ({mantenimiento.fotos.length})
          </h2>

          {mantenimiento.fotos.length > 0 && (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {mantenimiento.fotos.map((foto) => (
                <div
                  key={foto.id}
                  className="relative aspect-square overflow-hidden rounded-xl border bg-slate-900 shadow-sm"
                >
                  <Image
                    src={foto.archivo}
                    alt={foto.caption || "Foto de mantenimiento"}
                    fill
                    className="object-cover"
                  />
                  {foto.caption && (
                    <span className="absolute left-2 top-2 rounded-md bg-slate-900/70 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                      {foto.caption}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <FotoUploader mantenimientoId={mantenimiento.id} />
        </div>
      </div>
    </div>
  );
}
