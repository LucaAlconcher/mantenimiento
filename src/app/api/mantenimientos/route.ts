import { NextRequest, NextResponse } from "next/server";
import { createMantenimiento, listMantenimientos } from "@/lib/db";

export async function GET(req: NextRequest) {
  const equipoId = req.nextUrl.searchParams.get("equipoId") ?? undefined;
  const mantenimientos = await listMantenimientos(equipoId);
  return NextResponse.json(mantenimientos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { equipoId, fecha, realizadoPor, tipo, descripcion, observaciones } = body;
  if (!equipoId || !fecha || !realizadoPor || !tipo) {
    return NextResponse.json(
      { error: "equipoId, fecha, realizadoPor y tipo son obligatorios" },
      { status: 400 }
    );
  }
  const mantenimiento = await createMantenimiento({
    equipoId,
    fecha,
    realizadoPor,
    tipo,
    descripcion: descripcion ?? "",
    observaciones: observaciones ?? "",
  });
  return NextResponse.json(mantenimiento, { status: 201 });
}
