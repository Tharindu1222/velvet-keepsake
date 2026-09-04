"use client";

import { ChangeEvent, useState } from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploadField({ label = "Image", value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload a file"
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
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
      {value && (
        <div className="mt-3 h-28 w-full max-w-xs overflow-hidden border border-white/10 bg-[#141414]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        </div>
      )}
    </label>
  );
}
