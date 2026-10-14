/**
 * Fail-closed env helpers. Never invent secrets for production.
 */

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export function getJwtSecretBytes(): Uint8Array {
  return new TextEncoder().encode(requireEnv("JWT_SECRET"));
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

/** Soft-check Cloudinary; returns missing key names. */
export function missingCloudinaryKeys(): string[] {
  const keys = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ] as const;
  return keys.filter((k) => !process.env[k]);
}
