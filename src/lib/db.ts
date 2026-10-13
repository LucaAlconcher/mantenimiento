import { JSONFilePreset } from "lowdb/node";
import { mkdirSync } from "fs";
import path from "path";
import { nanoid } from "nanoid";

export type TipoEquipo = "dock" | "drone" | "otro";

export type Equipo = {
  id: string;
  tipo: TipoEquipo;
  alias: string;
  modelo: string;
  numeroSerie: string;
  ubicacion: string;
  notas: string;
  createdAt: string;
};

export type TipoMantenimiento = "preventivo" | "correctivo" | "revision";

export type Foto = {
  id: string;
  archivo: string;
  caption: string;
};

export type Mantenimiento = {
  id: string;
  equipoId: string;
  fecha: string;
  realizadoPor: string;
  tipo: TipoMantenimiento;
  descripcion: string;
  observaciones: string;
  fotos: Foto[];
  createdAt: string;
};

type Data = {
  equipos: Equipo[];
  mantenimientos: Mantenimiento[];
};

const file = path.join(process.cwd(), "data", "db.json");
const defaultData: Data = { equipos: [], mantenimientos: [] };

let dbPromise: ReturnType<typeof JSONFilePreset<Data>> | null = null;

async function getDb() {
  if (!dbPromise) {
    mkdirSync(path.dirname(file), { recursive: true });
    dbPromise = JSONFilePreset<Data>(file, defaultData);
  }
  return dbPromise;
}

export async function listEquipos() {
  const db = await getDb();
  await db.read();
  return [...db.data.equipos].sort((a, b) => a.alias.localeCompare(b.alias));
}

export async function getEquipo(id: string) {
  const db = await getDb();
  await db.read();
  return db.data.equipos.find((e) => e.id === id) ?? null;
}

export async function createEquipo(input: Omit<Equipo, "id" | "createdAt">) {
  const db = await getDb();
  await db.read();
  const equipo: Equipo = {
    ...input,
    id: nanoid(10),
    createdAt: new Date().toISOString(),
  };
  db.data.equipos.push(equipo);
  await db.write();
  return equipo;
}

export async function updateEquipo(id: string, input: Partial<Omit<Equipo, "id" | "createdAt">>) {
  const db = await getDb();
  await db.read();
  const equipo = db.data.equipos.find((e) => e.id === id);
  if (!equipo) return null;
  Object.assign(equipo, input);
  await db.write();
  return equipo;
}

export async function deleteEquipo(id: string) {
  const db = await getDb();
  await db.read();
  db.data.equipos = db.data.equipos.filter((e) => e.id !== id);
  db.data.mantenimientos = db.data.mantenimientos.filter((m) => m.equipoId !== id);
  await db.write();
}

export async function listMantenimientos(equipoId?: string) {
  const db = await getDb();
  await db.read();
  const items = equipoId
    ? db.data.mantenimientos.filter((m) => m.equipoId === equipoId)
    : [...db.data.mantenimientos];
  return items.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export async function getMantenimiento(id: string) {
  const db = await getDb();
  await db.read();
  return db.data.mantenimientos.find((m) => m.id === id) ?? null;
}

export async function createMantenimiento(
  input: Omit<Mantenimiento, "id" | "createdAt" | "fotos">
) {
  const db = await getDb();
  await db.read();
  const mantenimiento: Mantenimiento = {
    ...input,
    id: nanoid(10),
    fotos: [],
    createdAt: new Date().toISOString(),
  };
  db.data.mantenimientos.push(mantenimiento);
  await db.write();
  return mantenimiento;
}

export async function addFotoToMantenimiento(mantenimientoId: string, foto: Foto) {
  const db = await getDb();
  await db.read();
  const mantenimiento = db.data.mantenimientos.find((m) => m.id === mantenimientoId);
  if (!mantenimiento) return null;
  mantenimiento.fotos.push(foto);
  await db.write();
  return mantenimiento;
}

export async function deleteMantenimiento(id: string) {
  const db = await getDb();
  await db.read();
  db.data.mantenimientos = db.data.mantenimientos.filter((m) => m.id !== id);
  await db.write();
}
