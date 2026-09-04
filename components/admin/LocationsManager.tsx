"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { LocationRow } from "@/lib/db";

type FormState = {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  highlight: string;
  image: string;
};

const EMPTY: FormState = { slug: "", title: "", subtitle: "", badge: "", highlight: "", image: "" };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function LocationsManager() {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/locations");
      const data = await res.json();
      setLocations(Array.isArray(data) ? data : []);
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
    setEditingId(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function startEdit(loc: LocationRow) {
    setEditingId(loc.id);
    setForm({
      slug: loc.slug,
      title: loc.title,
      subtitle: loc.subtitle,
      badge: loc.badge,
      highlight: loc.highlight,
      image: loc.image,
    });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      const url = editingId ? `/api/locations/${editingId}` : "/api/locations";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash(editingId ? "Location updated." : "Location added.");
      setShowForm(false);
      await load();
    } catch (err) {
      flash(err instanceof Error ? err.message : "Could not save location.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this location? It will disappear from the public site.")) return;
    try {
      const res = await fetch(`/api/locations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setLocations((prev) => prev.filter((l) => l.id !== id));
    } catch {
      flash("Could not delete location.");
    }
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
            Home &amp; Locations Page
          </p>
          <h1 className="mt-2 font-display text-3xl font-light">Popular Locations</h1>
          <p className="mt-2 text-sm text-[#8E8E93]">
            Manage the destination cards shown on the homepage and the full
            Locations page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && <p className="text-sm text-[#E5A93C]">{status}</p>}
          <button
            type="button"
            onClick={startAdd}
            className="border border-[#E5A93C]/60 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
          >
            + Add Location
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
              <h2 className="mb-5 font-display text-xl">
                {editingId ? "Edit Location" : "New Location"}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Title
                  </span>
                  <input
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm((f) => ({
                        ...f,
                        title,
                        slug: editingId ? f.slug : slugify(title),
                      }));
                    }}
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Slug (URL)
                  </span>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Subtitle
                  </span>
                  <input
                    value={form.subtitle}
                    onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Badge
                  </span>
                  <input
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    placeholder="Coastal Heritage"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Highlight
                  </span>
                  <input
                    value={form.highlight}
                    onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.value }))}
                    placeholder="UNESCO World Heritage Site"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Image"
                    value={form.image}
                    onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                  />
                </div>
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
                  disabled={saving || !form.title || !form.slug || !form.image}
                  className="border border-[#E5A93C]/60 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save Location"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-sm text-[#8E8E93]">Loading…</p>
      ) : locations.length === 0 ? (
        <p className="text-sm text-[#8E8E93]">No locations yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <div key={loc.id} className="overflow-hidden border border-white/10 bg-[#141414]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={loc.image} alt={loc.title} className="h-36 w-full object-cover" />
              <div className="p-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#E5A93C]">
                  {loc.badge}
                </p>
                <h3 className="mt-1 font-display text-lg text-white">{loc.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-[#8E8E93]">{loc.subtitle}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => remove(loc.id)}
                    className="border border-white/15 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#8E8E93] transition hover:border-red-400 hover:text-red-400"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(loc)}
                    className="border border-[#E5A93C]/60 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
