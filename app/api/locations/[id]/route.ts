import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { handleRouteError, jsonError, parsePositiveIntId } from "@/lib/api";
import { deleteById, updateById } from "@/lib/crud";
import { imageUrlField, readJsonBody, sortOrderField } from "@/lib/schemas";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, hyphen-separated"),
  title: z.string().trim().min(1).max(255),
  subtitle: z.string().trim().min(1).max(512),
  badge: z.string().trim().min(1).max(255),
  highlight: z.string().trim().min(1).max(255),
  image: imageUrlField,
  sort_order: sortOrderField,
});

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  const id = parsePositiveIntId((await params).id);
  if (id === null) return jsonError("Invalid id", 400);

  try {
    const body = schema.parse(await readJsonBody(request));
    const affected = await updateById("locations", id, body);
    if (affected === 0) return jsonError("Not found", 404);
    revalidatePath("/locations");
    revalidatePath(`/locations/${body.slug}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Could not update location");
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return jsonError("Unauthorized", 401);

  const id = parsePositiveIntId((await params).id);
  if (id === null) return jsonError("Invalid id", 400);

  try {
    const affected = await deleteById("locations", id);
    if (affected === 0) return jsonError("Not found", 404);
    revalidatePath("/locations");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err, "Could not delete location");
  }
}
