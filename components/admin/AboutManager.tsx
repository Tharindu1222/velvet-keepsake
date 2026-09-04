"use client";

import { useCallback, useEffect, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";

const FIELDS: { key: string; label: string; hint: string }[] = [
  {
    key: "about_hero_image",
    label: "Hero Background",
    hint: "Full-screen image behind the page title at the top of the About page.",
  },
  {
    key: "about_intro_image",
    label: "Our Craft Section Background",
    hint: "Subtle textured background behind the intro text and stat counters.",
  },
  {
    key: "about_services_image",
    label: "Services Section Background",
    hint: "Background behind the \"What We Offer\" cards and Reserve Now button.",
  },
];

export default function AboutManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/about-settings");
      setSettings(await res.json());
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

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/about-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error();
      flash("About page images saved.");
    } catch {
      flash("Could not save images.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[#8E8E93]">Loading…</p>;
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
            About Page
          </p>
          <h1 className="mt-2 font-display text-3xl font-light">Background Images</h1>
          <p className="mt-2 text-sm text-[#8E8E93]">
            Change the background imagery used across the About page sections.
          </p>
        </div>
        {status && <p className="text-sm text-[#E5A93C]">{status}</p>}
      </div>

      <div className="space-y-8">
        {FIELDS.map((field) => (
          <div key={field.key} className="border border-white/10 bg-[#141414] p-5">
            <p className="mb-1 text-sm text-white/85">{field.label}</p>
            <p className="mb-4 text-xs text-[#8E8E93]">{field.hint}</p>
            <ImageUploadField
              label="Image"
              value={settings[field.key] || ""}
              onChange={(url) => setSettings((prev) => ({ ...prev, [field.key]: url }))}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-8 border border-[#E5A93C]/60 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] transition hover:bg-[#E5A93C]/10 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Images"}
      </button>
    </div>
  );
}
