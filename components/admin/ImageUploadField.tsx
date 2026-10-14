"use client";

import { ChangeEvent, ClipboardEvent, useState } from "react";

const ALLOWED_IMAGE_HOSTS = new Set(["res.cloudinary.com", "images.unsplash.com"]);
const URL_ERROR =
  "Image must be an https URL on res.cloudinary.com or images.unsplash.com";

function isAllowedImageUrl(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    return u.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploadField({ label = "Image", value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").trim();
    if (!text) return;
    e.preventDefault();
    if (!isAllowedImageUrl(text)) {
      setError(URL_ERROR);
      return;
    }
    setError("");
    onChange(text);
  }

  function onBlur() {
    if (value.trim() && !isAllowedImageUrl(value)) setError(URL_ERROR);
  }

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="block">
      <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
        {label}
      </span>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => {
            setError("");
            onChange(e.target.value);
          }}
          onPaste={onPaste}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          placeholder="https://res.cloudinary.com/... or upload a file"
          className="w-full border border-white/10 bg-[#141414] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
        />
        <label className="flex shrink-0 cursor-pointer items-center border border-white/15 px-4 text-[10px] tracking-[0.15em] uppercase text-[#8E8E93] transition hover:border-[#E5A93C] hover:text-[#E5A93C]">
          {uploading ? "…" : "Upload"}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {error && (
        <span role="alert" className="mt-1 block text-xs text-red-400">
          {error}
        </span>
      )}
      {value && isAllowedImageUrl(value) && (
        <div className="mt-3 h-28 w-full max-w-xs overflow-hidden border border-white/10 bg-[#141414]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        </div>
      )}
    </label>
  );
}
