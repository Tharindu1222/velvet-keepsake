"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { ServiceRow } from "@/lib/db";

type FormState = { title: string; copy: string; image: string };
const EMPTY: FormState = { title: "", copy: "", image: "" };

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
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

  function startEdit(svc: ServiceRow) {
    setEditingId(svc.id);
    setForm({ title: svc.title, copy: svc.copy, image: svc.image });
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    try {
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash(editingId ? "Service updated." : "Service added.");
      setShowForm(false);
      await load();
    } catch (err) {
      flash(err instanceof Error ? err.message : "Could not save service.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      flash("Could not delete service.");
    }
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
            Home Page
          </p>
          <h1 className="mt-2 font-display text-3xl font-light">What We Offer</h1>
          <p className="mt-2 text-sm text-[#8E8E93]">
            Manage the &ldquo;Photography for every chapter&rdquo; service cards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && <p className="text-sm text-[#E5A93C]">{status}</p>}
          <button
            type="button"
            onClick={startAdd}
            className="border border-[#E5A93C]/60 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
          >
            + Add Service
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
                {editingId ? "Edit Service" : "New Service"}
              </h2>
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Title
                  </span>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Wedding Photography"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Description
                  </span>
                  <textarea
                    value={form.copy}
                    onChange={(e) => setForm((f) => ({ ...f, copy: e.target.value }))}
                    rows={4}
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <ImageUploadField
                  label="Image"
                  value={form.image}
                  onChange={(url) => setForm((f) => ({ ...f, image: url }))}
                />
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
                  disabled={saving || !form.title || !form.copy || !form.image}
                  className="border border-[#E5A93C]/60 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save Service"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-sm text-[#8E8E93]">Loading…</p>
      ) : services.length === 0 ? (
        <p className="text-sm text-[#8E8E93]">No services yet.</p>
      ) : (
        <div className="space-y-4">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="grid gap-4 border border-white/10 bg-[#141414] p-4 sm:grid-cols-[120px_1fr_auto]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={svc.image} alt={svc.title} className="h-24 w-full rounded-sm object-cover sm:w-32" />
              <div>
                <h3 className="font-display text-lg text-white">{svc.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-[#8E8E93]">{svc.copy}</p>
              </div>
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => remove(svc.id)}
                  className="border border-white/15 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#8E8E93] transition hover:border-red-400 hover:text-red-400"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(svc)}
                  className="border border-[#E5A93C]/60 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
