"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Inquiry } from "@/lib/db";

export default function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          (data && typeof data.error === "string" && data.error) ||
            "Could not load inquiries (" + res.status + ")."
        );
      }
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      setInquiries([]);
      setLoadError(
        err instanceof Error ? err.message : "Could not load inquiries."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: number) {
    if (!confirm("Delete this inquiry?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Could not delete inquiry.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
          Contact
        </p>
        <h1 className="mt-2 font-display text-3xl font-light">Inquiries</h1>
        <p className="mt-2 text-sm text-[#8E8E93]">
          Messages submitted via the Contact and Reserve pages.
        </p>
      </div>

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
      ) : inquiries.length === 0 ? (
        <p className="text-sm text-[#8E8E93]">No inquiries yet.</p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {inquiries.map((inq) => (
              <motion.article
                key={inq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border border-white/10 bg-[#141414] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg text-white">{inq.name}</h3>
                    <a
                      href={`mailto:${inq.email}`}
                      className="text-sm text-[#E5A93C] hover:underline"
                    >
                      {inq.email}
                    </a>
                  </div>
                  <div className="text-right text-[11px] text-[#8E8E93]">
                    {inq.wedding_date && (
                      <p>
                        Wedding date:{" "}
                        {new Date(inq.wedding_date).toLocaleDateString()}
                      </p>
                    )}
                    <p>
                      Received {new Date(inq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#C7C7CC]">
                  {inq.message}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => remove(inq.id)}
                    disabled={deletingId === inq.id}
                    className="border border-white/15 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase text-[#8E8E93] transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                  >
                    {deletingId === inq.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
