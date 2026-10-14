"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Photo, PhotoCategory } from "@/lib/db";

const CATEGORIES: PhotoCategory[] = [
  "Candid",
  "Destination",
  "Portraits",
  "Ceremony",
  "Reception",
  "Details",
];

type FormState = {
  url: string;
  public_id: string;
  category: PhotoCategory;
  title: string;
  alt_text: string;
};

const EMPTY: FormState = {
  url: "",
  public_id: "",
  category: "Candid",
  title: "",
  alt_text: "",
};

export default function PhotosManager() {
  const [items, setItems] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/photos");
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          (data && typeof data.error === "string" && data.error) ||
            "Could not load photos (" + res.status + ")."
        );
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setItems([]);
      setLoadError(
        err instanceof Error ? err.message : "Could not load photos."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function flash(msg: string) {
    setStatus(msg);
    setTimeout(() => setStatus(""), 2500);
  }

  function startAdd() {
    setForm(EMPTY);
    setUploadError("");
    setShowForm(true);
  }

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((f) => ({ ...f, url: data.url, public_id: data.public_id ?? "" }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/photos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: form.url,
          public_id: form.public_id || null,
          category: form.category,
          title: form.title.trim() || null,
          alt_text: form.alt_text.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash("Photo added.");
      setShowForm(false);
      await load();
    } catch (err) {
      flash(err instanceof Error ? err.message : "Could not save photo.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this photo from the gallery?")) return;
    try {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch {
      flash("Could not delete photo.");
    }
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
            Portfolio Page
          </p>
          <h1 className="mt-2 font-display text-3xl font-light">Gallery Photos</h1>
          <p className="mt-2 text-sm text-[#8E8E93]">
            Upload the photographs shown in the portfolio gallery.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && <p className="text-sm text-[#E5A93C]">{status}</p>}
          <button
            type="button"
            onClick={startAdd}
            className="border border-[#E5A93C]/60 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
          >
            + Add Photo
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden border border-white/10 bg-[#141414]"
          >
            <div className="p-6">
              <h2 className="mb-5 font-display text-xl">New Photo</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Image
                  </span>
                  <div className="flex gap-2">
                    <input
                      value={form.url}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, url: e.target.value, public_id: "" }))
                      }
                      placeholder="https://... or upload a file"
                      className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
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
                  {uploadError && (
                    <span className="mt-1 block text-xs text-red-400">{uploadError}</span>
                  )}
                  {form.url && (
                    <div className="mt-3 h-28 w-full max-w-xs overflow-hidden border border-white/10 bg-[#0A0A0A]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.url}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Category
                  </span>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value as PhotoCategory }))
                    }
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Title
                  </span>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Golden hour"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Alt Text
                  </span>
                  <input
                    value={form.alt_text}
                    onChange={(e) => setForm((f) => ({ ...f, alt_text: e.target.value }))}
                    placeholder="Couple portrait at sunset"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-white/15 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#8E8E93] transition hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || uploading || !form.url}
                  className="border border-[#E5A93C]/60 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save Photo"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-sm text-[#8E8E93]">Loading…</p>
      ) : loadError ? (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-4 border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-400"
        >
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => load()}
            className="border border-red-400/40 px-3 py-1 text-[10px] tracking-[0.2em] uppercase transition hover:bg-red-400/10"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-[#8E8E93]">No gallery photos yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((photo) => (
            <div key={photo.id} className="overflow-hidden border border-white/10 bg-[#141414]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.alt_text || photo.title || "Gallery photo"}
                className="h-48 w-full object-cover"
              />
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#E5A93C]">
                    {photo.category}
                  </p>
                  <h3 className="mt-1 truncate font-display text-lg text-white">
                    {photo.title || "Untitled"}
                  </h3>
                  {photo.alt_text && (
                    <p className="mt-1 truncate text-xs text-[#8E8E93]">{photo.alt_text}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(photo.id)}
                  className="shrink-0 border border-white/15 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#8E8E93] transition hover:border-red-400 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
