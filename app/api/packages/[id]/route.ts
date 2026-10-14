import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError, parsePositiveIntId } from "@/lib/api";
import { deleteById, updateById } from "@/lib/crud";
import { readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

// Optional fields have no defaults here: omitted values keep their stored value.
const schema = z.object({
  category: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(255),
  subtitle: z.string().trim().max(255).optional(),
  price: z.number().nonnegative().max(9_999_999_999),
  badge: z.string().trim().max(64).optional(),
  features: z.string().trim().min(1).max(10_000),
  is_featured: z.union([z.boolean(), z.number()]).optional(),
  sort_order: sortOrderField,
});

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  const id = parsePositiveIntId((await params).id);
  if (id === null) return jsonError("Invalid id", 400);

  try {
    const body = schema.parse(await readJsonBody(request));
    const affected = await updateById("packages", id, {
      ...body,
      is_featured:
        body.is_featured === undefined ? undefined : body.is_featured ? 1 : 0,
    });
    if (affected === 0) return jsonError("Not found", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Could not update package");
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  const id = parsePositiveIntId((await params).id);
  if (id === null) return jsonError("Invalid id", 400);

  try {
    const affected = await deleteById("packages", id);
    if (affected === 0) return jsonError("Not found", 404);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Could not delete package");
  }
}
