import PageHeader from "@/components/PageHeader";
import EquipoForm from "./EquipoForm";

export default function NuevoEquipoPage() {
  return (
    <div className="flex flex-col">
      <PageHeader title="Nuevo equipo" description="Registra un DJI Dock, drone u otro equipo para hacerle seguimiento." />
      <div className="max-w-xl p-6">
        <EquipoForm />
      </div>
    </div>
  );
}
