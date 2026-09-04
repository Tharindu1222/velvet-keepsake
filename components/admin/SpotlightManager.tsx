"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ShootPhotosManager from "@/components/admin/ShootPhotosManager";
import type { SpotlightRow } from "@/lib/db";

type FormState = { couple: string; type: string; location: string; image: string };
const EMPTY: FormState = { couple: "", type: "", location: "", image: "" };

export default function SpotlightManager() {
  const [items, setItems] = useState<SpotlightRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [managingPhotosId, setManagingPhotosId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/spotlight");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
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

  function startEdit(item: SpotlightRow) {
    setEditingId(item.id);
    setForm({ couple: item.couple, type: item.type, location: item.location, image: item.image });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      const url = editingId ? `/api/spotlight/${editingId}` : "/api/spotlight";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash(editingId ? "Spotlight updated." : "Spotlight added — now add more photos below.");
      setShowForm(false);
      await load();
      if (!editingId && data.id) {
        setManagingPhotosId(data.id);
      }
    } catch (err) {
      flash(err instanceof Error ? err.message : "Could not save spotlight item.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this spotlight item? Its shoot photos will be removed too.")) return;
    try {
      const res = await fetch(`/api/spotlight/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((s) => s.id !== id));
      if (managingPhotosId === id) setManagingPhotosId(null);
    } catch {
      flash("Could not delete spotlight item.");
    }
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
            Home &amp; Portfolio Page
          </p>
          <h1 className="mt-2 font-display text-3xl font-light">Our Spotlight</h1>
          <p className="mt-2 text-sm text-[#8E8E93]">
            Manage the &ldquo;Exclusive pieces of work&rdquo; couple showcase.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && <p className="text-sm text-[#E5A93C]">{status}</p>}
          <button
            type="button"
            onClick={startAdd}
            className="border border-[#E5A93C]/60 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
          >
            + Add Spotlight
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
                {editingId ? "Edit Spotlight" : "New Spotlight"}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Couple Names
                  </span>
                  <input
                    value={form.couple}
                    onChange={(e) => setForm((f) => ({ ...f, couple: e.target.value }))}
                    placeholder="Waruni & Asanka"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Shoot Type
                  </span>
                  <input
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    placeholder="Wedding Photography"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Location
                  </span>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="Galle"
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
                  disabled={saving || !form.couple || !form.type || !form.location || !form.image}
                  className="border border-[#E5A93C]/60 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save Spotlight"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-sm text-[#8E8E93]">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[#8E8E93]">No spotlight items yet.</p>
      ) : (
        <div className="space-y-5">
          {items.map((item) => {
            const isManaging = managingPhotosId === item.id;
            return (
              <div key={item.id} className="overflow-hidden border border-white/10 bg-[#141414]">
                <div className="grid gap-4 p-4 sm:grid-cols-[140px_1fr_auto] sm:items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.couple}
                    className="h-28 w-full rounded-sm object-cover sm:w-36"
                  />
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#E5A93C]">
                      {item.type}
                    </p>
                    <h3 className="mt-1 font-display text-lg text-white">{item.couple}</h3>
                    <p className="mt-1 text-xs text-[#8E8E93]">{item.location}</p>
                  </div>
                  <div className="flex flex-wrap items-start gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setManagingPhotosId(isManaging ? null : item.id)}
                      className={`border px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition ${
                        isManaging
                          ? "border-[#E5A93C] text-[#E5A93C]"
                          : "border-white/15 text-[#8E8E93] hover:border-[#E5A93C] hover:text-[#E5A93C]"
                      }`}
                    >
                      {isManaging ? "Hide Photos" : "Manage Photos"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="border border-white/15 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#8E8E93] transition hover:border-red-400 hover:text-red-400"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="border border-[#E5A93C]/60 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {isManaging && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <ShootPhotosManager spotlightId={item.id} coverImage={item.image} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
