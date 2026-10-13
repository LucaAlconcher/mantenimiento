import { NextRequest, NextResponse } from "next/server";
import { createEquipo, listEquipos } from "@/lib/db";

export async function GET() {
  const equipos = await listEquipos();
  return NextResponse.json(equipos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tipo, alias, modelo, numeroSerie, ubicacion, notas } = body;
  if (!tipo || !alias) {
    return NextResponse.json({ error: "tipo y alias son obligatorios" }, { status: 400 });
  }
  const equipo = await createEquipo({
    tipo,
    alias,
    modelo: modelo ?? "",
    numeroSerie: numeroSerie ?? "",
    ubicacion: ubicacion ?? "",
    notas: notas ?? "",
  });
  return NextResponse.json(equipo, { status: 201 });
}
