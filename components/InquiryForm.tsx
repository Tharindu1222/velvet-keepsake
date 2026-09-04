"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  title?: string;
  submitLabel?: string;
};

export default function InquiryForm({
  title,
  submitLabel = "Send inquiry",
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          wedding_date: form.get("wedding_date") || null,
          message: form.get("message"),
        }),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {title && (
        <h2 className="font-display text-2xl text-white">{title}</h2>
      )}
      {[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        {
          name: "wedding_date",
          label: "Wedding date",
          type: "date",
          required: false,
        },
      ].map((field) => (
        <label key={field.name} className="group block">
          <span className="mb-2 block text-[10px] tracking-[0.24em] uppercase text-[#8E8E93] transition group-focus-within:text-[#E5A93C]">
            {field.label}
          </span>
          <input
            name={field.name}
            type={field.type}
            required={field.required}
            className="w-full border-b border-white/15 bg-transparent py-3 text-white outline-none transition-colors duration-300 focus:border-[#E5A93C]"
          />
        </label>
      ))}
      <label className="group block">
        <span className="mb-2 block text-[10px] tracking-[0.24em] uppercase text-[#8E8E93] transition group-focus-within:text-[#E5A93C]">
          Message / location
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about your celebration and city…"
          className="w-full resize-none border-b border-white/15 bg-transparent py-3 text-white outline-none transition-colors duration-300 placeholder:text-[#8E8E93]/50 focus:border-[#E5A93C]"
        />
      </label>

      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="group relative inline-flex items-center justify-center overflow-hidden border border-[#E5A93C] bg-[#E5A93C] px-9 py-3.5 text-[11px] font-medium tracking-[0.26em] uppercase text-[#0A0A0A] transition-colors duration-500 hover:bg-transparent hover:text-[#E5A93C] disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </motion.button>

      {status === "ok" && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[#E5A93C]"
        >
          Received — we will connect with you shortly.
        </motion.p>
      )}
      {status === "error" && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          Something went wrong. Please try again.
        </motion.p>
      )}
    </form>
  );
}
