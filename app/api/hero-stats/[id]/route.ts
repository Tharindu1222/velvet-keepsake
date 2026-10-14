import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError, parsePositiveIntId } from "@/lib/api";
import { deleteById, updateById } from "@/lib/crud";
import { readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  value: z.number().int().min(0).max(1_000_000_000),
  suffix: z.string().max(16).optional(),
  label: z.string().trim().min(1).max(255),
  sort_order: sortOrderField,
});

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  const id = parsePositiveIntId((await params).id);
  if (id === null) return jsonError("Invalid id", 400);

  try {
    const body = schema.parse(await readJsonBody(request));
    const affected = await updateById("hero_stats", id, body);
    if (affected === 0) return jsonError("Not found", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Could not update hero stat");
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  const id = parsePositiveIntId((await params).id);
  if (id === null) return jsonError("Invalid id", 400);

  try {
    const affected = await deleteById("hero_stats", id);
    if (affected === 0) return jsonError("Not found", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Could not delete hero stat");
  }
}
