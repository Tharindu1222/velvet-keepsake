import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { missingCloudinaryKeys } from "@/lib/env";
import { jsonError, handleRouteError } from "@/lib/api";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  const missing = missingCloudinaryKeys();
  if (missing.length) {
    return jsonError(
      `Cloudinary is not configured. Missing: ${missing.join(", ")}`,
      500
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return jsonError("No file provided", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return jsonError("Only JPEG, PNG, WebP, or AVIF images are allowed", 400);
    }

    if (file.size <= 0 || file.size > MAX_BYTES) {
      return jsonError("Image must be between 1 byte and 8MB", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadImageBuffer(buffer);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    return handleRouteError(err, "Upload failed");
  }
}
