import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { addFotoToMantenimiento, getMantenimiento } from "@/lib/db";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mantenimiento = await getMantenimiento(id);
  if (!mantenimiento) {
    return NextResponse.json({ error: "Mantenimiento no encontrado" }, { status: 404 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const caption = formData.get("caption");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Archivo demasiado grande (máx 10MB)" }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".jpg";
  const fileName = `${nanoid(12)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", id);
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, fileName), bytes);

  const updated = await addFotoToMantenimiento(id, {
    id: nanoid(10),
    archivo: `/uploads/${id}/${fileName}`,
    caption: typeof caption === "string" ? caption : "",
  });

  return NextResponse.json(updated, { status: 201 });
}
