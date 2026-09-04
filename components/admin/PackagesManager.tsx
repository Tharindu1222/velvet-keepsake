"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PackageRow } from "@/lib/db";

const CATEGORIES = ["Pre-Shoot", "Engagement", "Wedding", "Special Offer"];
const NEW_CATEGORY_VALUE = "__new__";

type FormState = {
  category: string;
  name: string;
  subtitle: string;
  price: string;
  badge: string;
  features: string;
  is_featured: boolean;
};

const EMPTY: FormState = {
  category: "Wedding",
  name: "",
  subtitle: "",
  price: "",
  badge: "",
  features: "",
  is_featured: false,
};

function formatLKR(value: number) {
  return `Rs. ${value.toLocaleString("en-LK")}`;
}

export default function PackagesManager() {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      setPackages(Array.isArray(data) ? data : []);
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
    setAddingCategory(false);
    setShowForm(true);
  }

  function startEdit(pkg: PackageRow) {
    setEditingId(pkg.id);
    setForm({
      category: pkg.category,
      name: pkg.name,
      subtitle: pkg.subtitle,
      price: String(pkg.price),
      badge: pkg.badge,
      features: pkg.features,
      is_featured: !!pkg.is_featured,
    });
    setAddingCategory(false);
    setShowForm(true);
  }

  function handleCategorySelect(value: string) {
    if (value === NEW_CATEGORY_VALUE) {
      setAddingCategory(true);
      setForm((f) => ({ ...f, category: "" }));
    } else {
      setAddingCategory(false);
      setForm((f) => ({ ...f, category: value }));
    }
  }

  async function save() {
    setSaving(true);
    try {
      const url = editingId ? `/api/packages/${editingId}` : "/api/packages";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: form.category.trim(),
          price: Number(form.price) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      flash(editingId ? "Package updated." : "Package added.");
      setShowForm(false);
      await load();
    } catch (err) {
      flash(err instanceof Error ? err.message : "Could not save package.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this package?")) return;
    try {
      const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch {
      flash("Could not delete package.");
    }
  }

  const allCategories = [
    ...CATEGORIES,
    ...Array.from(new Set(packages.map((p) => p.category))).filter(
      (c) => !CATEGORIES.includes(c)
    ),
  ];

  const grouped = allCategories
    .map((cat) => ({
      category: cat,
      items: packages.filter((p) => p.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
            Home Page &amp; Investment Page
          </p>
          <h1 className="mt-2 font-display text-3xl font-light">Packages</h1>
          <p className="mt-2 text-sm text-[#8E8E93]">
            Manage pricing packages shown on the homepage and the Investment
            page. Toggle &ldquo;Featured&rdquo; to display a package on the
            homepage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && <p className="text-sm text-[#E5A93C]">{status}</p>}
          <button
            type="button"
            onClick={startAdd}
            className="border border-[#E5A93C]/60 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
          >
            + Add Package
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
                {editingId ? "Edit Package" : "New Package"}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Category
                  </span>
                  {addingCategory ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        placeholder="e.g. Honeymoon Shoots"
                        className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAddingCategory(false);
                          setForm((f) => ({ ...f, category: allCategories[0] ?? "" }));
                        }}
                        className="shrink-0 border border-white/15 px-3 text-[10px] tracking-[0.15em] uppercase text-[#8E8E93] transition hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <select
                      value={form.category}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                    >
                      {allCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value={NEW_CATEGORY_VALUE}>+ Add New Category…</option>
                    </select>
                  )}
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Price (LKR)
                  </span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="150000"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Package Name
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Velvet Signature"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Subtitle (optional)
                  </span>
                  <input
                    value={form.subtitle}
                    onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                    placeholder="Wedding Only + 01 Album"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Badge (optional — e.g. Most Popular, Special Offer)
                  </span>
                  <input
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    placeholder="Most Popular"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Features (one per line)
                  </span>
                  <textarea
                    value={form.features}
                    onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
                    rows={8}
                    placeholder={"10 Hours Coverage\n2 Photographers\nPremium Album with Box"}
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
                <label className="flex items-center gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="h-4 w-4 accent-[#E5A93C]"
                  />
                  <span className="text-sm text-white/85">
                    Show on homepage (featured package)
                  </span>
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
                  disabled={
                    saving || !form.name || !form.price || !form.features || !form.category.trim()
                  }
                  className="border border-[#E5A93C]/60 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save Package"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-sm text-[#8E8E93]">Loading…</p>
      ) : packages.length === 0 ? (
        <p className="text-sm text-[#8E8E93]">No packages yet.</p>
      ) : (
        <div className="space-y-10">
          {grouped.map(
            (group) => (
              <div key={group.category}>
                <h2 className="mb-4 text-[11px] tracking-[0.25em] uppercase text-[#E5A93C]">
                  {group.category}
                </h2>
                <div className="space-y-4">
                  {group.items.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="grid gap-4 border border-white/10 bg-[#141414] p-4 sm:grid-cols-[1fr_auto]"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg text-white">{pkg.name}</h3>
                          {pkg.subtitle && (
                            <span className="text-xs text-[#8E8E93]">({pkg.subtitle})</span>
                          )}
                          {pkg.badge && (
                            <span className="border border-[#E5A93C]/40 px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase text-[#E5A93C]">
                              {pkg.badge}
                            </span>
                          )}
                          {!!pkg.is_featured && (
                            <span className="border border-white/20 px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase text-white/70">
                              On Homepage
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-[#E5A93C]">{formatLKR(pkg.price)}</p>
                        <p className="mt-2 line-clamp-2 text-xs text-[#8E8E93]">
                          {pkg.features.split("\n").join(" · ")}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => remove(pkg.id)}
                          className="border border-white/15 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#8E8E93] transition hover:border-red-400 hover:text-red-400"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(pkg)}
                          className="border border-[#E5A93C]/60 px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
