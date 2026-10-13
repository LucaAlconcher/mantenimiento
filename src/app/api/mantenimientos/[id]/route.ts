import { NextRequest, NextResponse } from "next/server";
import { deleteMantenimiento, getMantenimiento } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mantenimiento = await getMantenimiento(id);
  if (!mantenimiento) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(mantenimiento);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteMantenimiento(id);
  return NextResponse.json({ ok: true });
}
