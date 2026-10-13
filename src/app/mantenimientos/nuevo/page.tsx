import PageHeader from "@/components/PageHeader";
import { listEquipos } from "@/lib/db";
import MantenimientoForm from "./MantenimientoForm";

export default async function NuevoMantenimientoPage({
  searchParams,
}: {
  searchParams: Promise<{ equipoId?: string }>;
}) {
  const { equipoId } = await searchParams;
  const equipos = await listEquipos();

  return (
    <div className="flex flex-col">
      <PageHeader title="Nuevo mantenimiento" description="Registra fecha, responsable y observaciones del trabajo realizado." />
      <div className="max-w-xl p-6">
        <MantenimientoForm equipos={equipos} equipoIdPreseleccionado={equipoId} />
      </div>
    </div>
  );
}
