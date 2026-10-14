import { z, ZodError } from "zod";
import { imageUrlSchemaMessage, isAllowedImageUrl } from "@/lib/api";

/** https URL on an allowed image host (Cloudinary / Unsplash). Matches VARCHAR(1024). */
export const imageUrlField = z
  .string()
  .trim()
  .min(1)
  .max(1024)
  .refine(isAllowedImageUrl, { message: imageUrlSchemaMessage() });

/** Optional sort position. Omit to append (POST) or leave unchanged (PUT). */
export const sortOrderField = z.number().int().min(0).max(1_000_000).optional();

export const PHOTO_CATEGORIES = [
  "Candid",
  "Destination",
  "Portraits",
  "Ceremony",
  "Reception",
  "Details",
] as const;

export const photoCategorySchema = z.enum(PHOTO_CATEGORIES);

export const photoCreateSchema = z.object({
  url: imageUrlField,
  public_id: z.string().trim().max(512).optional().nullable(),
  category: photoCategorySchema,
  title: z.string().trim().max(255).optional().nullable(),
  alt_text: z.string().trim().max(512).optional().nullable(),
});

export const photoUpdateSchema = z.object({
  category: photoCategorySchema.optional(),
  title: z.string().trim().max(255).nullable().optional(),
  alt_text: z.string().trim().max(512).nullable().optional(),
});

/**
 * Parse a JSON request body. Malformed JSON surfaces as a ZodError so that
 * handleRouteError turns it into a 422 instead of a 500.
 */
export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ZodError([
      { code: "custom", path: [], message: "Invalid JSON body", input: undefined },
    ]);
  }
}
