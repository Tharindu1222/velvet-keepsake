"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ShootImage } from "@/lib/db";

type Props = {
  spotlightId: number;
  coverImage: string;
};

export default function ShootPhotosManager({ spotlightId, coverImage }: Props) {
  const [images, setImages] = useState<ShootImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shoot-images?spotlight_id=${spotlightId}`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [spotlightId]);

  useEffect(() => {
    load();
  }, [load]);

  function flash(msg: string) {
    setStatus(msg);
    setTimeout(() => setStatus(""), 2500);
  }

  async function addImage(image: string) {
    try {
      const res = await fetch("/api/shoot-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotlight_id: spotlightId, image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add photo");
      setImages((prev) => [...prev, { id: data.id, spotlight_id: spotlightId, image, sort_order: prev.length }]);
    } catch (err) {
      flash(err instanceof Error ? err.message : "Could not add photo");
    }
  }

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        await addImage(data.url);
      }
      flash("Photo(s) added.");
    } catch (err) {
      flash(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function addByUrl() {
    if (!urlInput.trim()) return;
    await addImage(urlInput.trim());
    setUrlInput("");
    flash("Photo added.");
  }

  async function removeImage(id: number) {
    if (!confirm("Remove this photo from the shoot?")) return;
    try {
      const res = await fetch(`/api/shoot-images/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      flash("Could not remove photo.");
    }
  }

  return (
    <div className="border-t border-white/10 bg-[#0A0A0A] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
          Shoot Photos ({images.length + 1} total incl. cover)
        </p>
        {status && <p className="text-xs text-[#E5A93C]">{status}</p>}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Paste an image URL…"
          className="min-w-[220px] flex-1 border border-white/10 bg-[#141414] px-3 py-2 text-sm outline-none focus:border-[#E5A93C]"
        />
        <button
          type="button"
          onClick={addByUrl}
          disabled={!urlInput.trim()}
          className="border border-white/15 px-4 py-2 text-[10px] tracking-[0.15em] uppercase text-[#8E8E93] transition hover:border-[#E5A93C] hover:text-[#E5A93C] disabled:opacity-40"
        >
          + Add URL
        </button>
        <label className="flex cursor-pointer items-center border border-[#E5A93C]/60 px-4 py-2 text-[10px] tracking-[0.15em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10">
          {uploading ? "Uploading…" : "+ Upload Photos"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <p className="text-xs text-[#8E8E93]">Loading photos…</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          <div className="relative aspect-square overflow-hidden border border-[#E5A93C]/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Cover" className="h-full w-full object-cover" />
            <span className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 text-[8px] uppercase tracking-widest text-[#E5A93C]">
              Cover
            </span>
          </div>
          <AnimatePresence>
            {images.map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square overflow-hidden border border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image} alt="Shoot" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] uppercase tracking-widest text-white opacity-0 transition group-hover:opacity-100"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
