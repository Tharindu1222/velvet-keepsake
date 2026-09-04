"use client";

import { useCallback, useEffect, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { HeroSlide, HeroStat } from "@/lib/db";

type SlideRow = { id: number | null; image: string; place: string };
type StatRow = { id: number | null; value: number; suffix: string; label: string };

const SETTINGS_FIELDS: { key: string; label: string }[] = [
  { key: "hero_kicker", label: "Kicker (small line above headline)" },
  { key: "hero_heading_line1", label: "Headline · line 1" },
  { key: "hero_heading_line2", label: "Headline · line 2" },
  { key: "hero_heading_prefix", label: "Headline · rotating line prefix" },
];

export default function HeroManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [slides, setSlides] = useState<SlideRow[]>([]);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, slidesRes, statsRes] = await Promise.all([
        fetch("/api/hero-settings"),
        fetch("/api/hero-slides"),
        fetch("/api/hero-stats"),
      ]);
      setSettings(await settingsRes.json());
      const slidesData: HeroSlide[] = await slidesRes.json();
      setSlides(
        Array.isArray(slidesData)
          ? slidesData.map((s) => ({ id: s.id, image: s.image, place: s.place }))
          : []
      );
      const statsData: HeroStat[] = await statsRes.json();
      setStats(
        Array.isArray(statsData)
          ? statsData.map((s) => ({ id: s.id, value: s.value, suffix: s.suffix, label: s.label }))
          : []
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

  async function saveSettings() {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/hero-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      flash("Hero text saved.");
    } catch {
      flash("Could not save hero text.");
    } finally {
      setSavingSettings(false);
    }
  }

  async function saveSlide(index: number) {
    const row = slides[index];
    try {
      if (row.id === null) {
        const res = await fetch("/api/hero-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: row.image, place: row.place, sort_order: index }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, id: data.id } : s)));
      } else {
        const res = await fetch(`/api/hero-slides/${row.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: row.image, place: row.place, sort_order: index }),
        });
        if (!res.ok) throw new Error();
      }
      flash("Slide saved.");
    } catch {
      flash("Could not save slide.");
    }
  }

  async function deleteSlide(index: number) {
    const row = slides[index];
    if (row.id !== null) {
      if (!confirm("Delete this slide?")) return;
      await fetch(`/api/hero-slides/${row.id}`, { method: "DELETE" });
    }
    setSlides((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveStat(index: number) {
    const row = stats[index];
    try {
      if (row.id === null) {
        const res = await fetch("/api/hero-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...row, sort_order: index }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error();
        setStats((prev) => prev.map((s, i) => (i === index ? { ...s, id: data.id } : s)));
      } else {
        const res = await fetch(`/api/hero-stats/${row.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...row, sort_order: index }),
        });
        if (!res.ok) throw new Error();
      }
      flash("Stat saved.");
    } catch {
      flash("Could not save stat.");
    }
  }

  async function deleteStat(index: number) {
    const row = stats[index];
    if (row.id !== null) {
      if (!confirm("Delete this stat?")) return;
      await fetch(`/api/hero-stats/${row.id}`, { method: "DELETE" });
    }
    setStats((prev) => prev.filter((_, i) => i !== index));
  }

  if (loading) {
    return <p className="text-sm text-[#8E8E93]">Loading…</p>;
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
            Home Page
          </p>
          <h1 className="mt-2 font-display text-3xl font-light">Hero Section</h1>
          <p className="mt-2 text-sm text-[#8E8E93]">
            Edit the headline text, rotating background slides, and stat counters
            shown at the top of the homepage.
          </p>
        </div>
        {status && <p className="text-sm text-[#E5A93C]">{status}</p>}
      </div>

      {/* Text settings */}
      <section className="mb-14">
        <h2 className="mb-5 font-display text-xl">Headline Text</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SETTINGS_FIELDS.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                {field.label}
              </span>
              <input
                value={settings[field.key] || ""}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                className="w-full border border-white/10 bg-[#141414] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={saveSettings}
          disabled={savingSettings}
          className="mt-5 border border-[#E5A93C]/60 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10 disabled:opacity-50"
        >
          {savingSettings ? "Saving…" : "Save Headline Text"}
        </button>
      </section>

      {/* Slides */}
      <section className="mb-14">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl">Background Slides</h2>
          <button
            type="button"
            onClick={() => setSlides((prev) => [...prev, { id: null, image: "", place: "" }])}
            className="border border-white/15 px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[#8E8E93] transition hover:border-[#E5A93C] hover:text-[#E5A93C]"
          >
            + Add Slide
          </button>
        </div>
        <div className="space-y-6">
          {slides.map((slide, i) => (
            <div key={slide.id ?? `new-${i}`} className="border border-white/10 bg-[#141414] p-5">
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <ImageUploadField
                  label="Slide image"
                  value={slide.image}
                  onChange={(url) =>
                    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, image: url } : s)))
                  }
                />
                <label className="block">
                  <span className="mb-2 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                    Place name
                  </span>
                  <input
                    value={slide.place}
                    onChange={(e) =>
                      setSlides((prev) =>
                        prev.map((s, idx) => (idx === i ? { ...s, place: e.target.value } : s))
                      )
                    }
                    placeholder="e.g. Sigiriya"
                    className="w-full border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm outline-none focus:border-[#E5A93C]"
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => deleteSlide(i)}
                  className="border border-white/15 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase text-[#8E8E93] transition hover:border-red-400 hover:text-red-400"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => saveSlide(i)}
                  className="border border-[#E5A93C]/60 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
          {slides.length === 0 && (
            <p className="text-sm text-[#8E8E93]">No slides yet. Add one above.</p>
          )}
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl">Stat Counters</h2>
          <button
            type="button"
            onClick={() =>
              setStats((prev) => [...prev, { id: null, value: 0, suffix: "", label: "" }])
            }
            className="border border-white/15 px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-[#8E8E93] transition hover:border-[#E5A93C] hover:text-[#E5A93C]"
          >
            + Add Stat
          </button>
        </div>
        <div className="space-y-4">
          {stats.map((stat, i) => (
            <div
              key={stat.id ?? `new-${i}`}
              className="grid gap-3 border border-white/10 bg-[#141414] p-4 sm:grid-cols-[1fr_1fr_2fr_auto_auto]"
            >
              <label className="block">
                <span className="mb-1 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                  Value
                </span>
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) =>
                    setStats((prev) =>
                      prev.map((s, idx) =>
                        idx === i ? { ...s, value: Number(e.target.value) } : s
                      )
                    )
                  }
                  className="w-full border border-white/10 bg-[#0A0A0A] px-3 py-2.5 text-sm outline-none focus:border-[#E5A93C]"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                  Suffix
                </span>
                <input
                  value={stat.suffix}
                  onChange={(e) =>
                    setStats((prev) =>
                      prev.map((s, idx) => (idx === i ? { ...s, suffix: e.target.value } : s))
                    )
                  }
                  placeholder="+ / % / etc"
                  className="w-full border border-white/10 bg-[#0A0A0A] px-3 py-2.5 text-sm outline-none focus:border-[#E5A93C]"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] tracking-[0.2em] uppercase text-[#8E8E93]">
                  Label
                </span>
                <input
                  value={stat.label}
                  onChange={(e) =>
                    setStats((prev) =>
                      prev.map((s, idx) => (idx === i ? { ...s, label: e.target.value } : s))
                    )
                  }
                  placeholder="Weddings Captured"
                  className="w-full border border-white/10 bg-[#0A0A0A] px-3 py-2.5 text-sm outline-none focus:border-[#E5A93C]"
                />
              </label>
              <button
                type="button"
                onClick={() => deleteStat(i)}
                className="self-end border border-white/15 px-3 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#8E8E93] transition hover:border-red-400 hover:text-red-400"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => saveStat(i)}
                className="self-end border border-[#E5A93C]/60 px-3 py-2.5 text-[10px] tracking-[0.15em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10"
              >
                Save
              </button>
            </div>
          ))}
          {stats.length === 0 && (
            <p className="text-sm text-[#8E8E93]">No stats yet. Add one above.</p>
          )}
        </div>
      </section>
    </div>
  );
}
