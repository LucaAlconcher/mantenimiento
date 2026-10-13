import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { listEquipos, listMantenimientos } from "@/lib/db";
import { TIPO_EQUIPO_COLOR, TIPO_EQUIPO_LABEL } from "@/lib/labels";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import ClickableRow from "@/components/ClickableRow";

export default async function Home() {
  const [equipos, mantenimientos] = await Promise.all([
    listEquipos(),
    listMantenimientos(),
  ]);

  const ultimaFechaPorEquipo = new Map<string, string>();
  const totalPorEquipo = new Map<string, number>();
  for (const m of mantenimientos) {
    const actual = ultimaFechaPorEquipo.get(m.equipoId);
    if (!actual || m.fecha > actual) ultimaFechaPorEquipo.set(m.equipoId, m.fecha);
    totalPorEquipo.set(m.equipoId, (totalPorEquipo.get(m.equipoId) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Equipos"
        count={equipos.length}
        description="Inventario de DJI Dock y drones bajo seguimiento."
        action={
          <Link
            href="/equipos/nuevo"
            className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500"
          >
            <PlusCircle size={16} />
            Nuevo equipo
          </Link>
        }
      />

      {equipos.length === 0 ? (
        <div className="m-6 rounded-lg border border-dashed bg-white p-10 text-center">
          <p className="text-slate-500">Todavía no registraste ningún equipo.</p>
          <Link
            href="/equipos/nuevo"
            className="mt-4 inline-block rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            Agregar el primer equipo
          </Link>
        </div>
      ) : (
        <div className="m-6 overflow-hidden rounded-lg border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Alias</th>
                <th className="px-4 py-3">Modelo / N° serie</th>
                <th className="px-4 py-3">Ubicación</th>
                <th className="px-4 py-3">Mantenimientos</th>
                <th className="px-4 py-3">Último mantenimiento</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((equipo) => (
                <ClickableRow key={equipo.id} href={`/equipos/${equipo.id}`}>
                  <td className="px-4 py-3">
                    <Badge className={TIPO_EQUIPO_COLOR[equipo.tipo]}>
                      {TIPO_EQUIPO_LABEL[equipo.tipo]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{equipo.alias}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {equipo.modelo || "—"} {equipo.numeroSerie && `· N/S ${equipo.numeroSerie}`}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{equipo.ubicacion || "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{totalPorEquipo.get(equipo.id) ?? 0}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {ultimaFechaPorEquipo.get(equipo.id) ?? "Sin registros"}
                  </td>
                </ClickableRow>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
