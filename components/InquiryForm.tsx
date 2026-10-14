"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

type Props = {
  title?: string;
  submitLabel?: string;
  /** Package the visitor is inquiring about. Falls back to `?package=`. */
  defaultPackage?: string;
};

type FieldName = "name" | "email" | "wedding_date" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "loading" | "ok" | "error";

const FIELD_NAMES: FieldName[] = ["name", "email", "wedding_date", "message"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS: {
  name: FieldName;
  label: string;
  type: string;
  autoComplete?: string;
}[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "wedding_date", label: "Wedding date", type: "date" },
];

function validate(values: {
  name: string;
  email: string;
  message: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const message = values.message.trim();
  if (name.length < 2) errors.name = "Please enter at least 2 characters.";
  if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (message.length < 10)
    errors.message = "Please write at least 10 characters.";
  else if (message.length > 2000)
    errors.message = "Message must be 2000 characters or fewer.";
  return errors;
}

function InquiryFormInner({
  title,
  submitLabel = "Send inquiry",
  defaultPackage,
}: Props) {
  const searchParams = useSearchParams();
  const packageName = (defaultPackage ?? searchParams.get("package") ?? "")
    .trim()
    .slice(0, 255);

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  function clearError(field: FieldName) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const values = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    const clientErrors = validate(values);
    setFormError("");
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setStatus("idle");
      const first = FIELD_NAMES.find((f) => clientErrors[f]);
      if (first) formEl.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setFieldErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          wedding_date: form.get("wedding_date") || null,
          message: values.message.trim(),
          website: String(form.get("website") ?? ""),
          ...(packageName ? { package_name: packageName } : {}),
        }),
      });

      if (res.ok) {
        setStatus("ok");
        formEl.reset();
        return;
      }

      const data = await res.json().catch(() => null);
      if (res.status === 422 && Array.isArray(data?.issues)) {
        const next: FieldErrors = {};
        for (const issue of data.issues as { path?: string; message?: string }[]) {
          const key = FIELD_NAMES.find((f) => f === issue.path);
          if (key && !next[key]) next[key] = issue.message || "Invalid value.";
        }
        setFieldErrors(next);
        setFormError(
          Object.keys(next).length > 0
            ? "Please fix the highlighted fields."
            : "Please check your details and try again."
        );
      } else {
        setFormError(
          (data && typeof data.error === "string" && data.error) ||
            "Something went wrong. Please try again."
        );
      }
      setStatus("error");
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const labelClass =
    "mb-2 block text-[10px] tracking-[0.24em] uppercase text-[#8E8E93] transition group-focus-within:text-[#E5A93C]";
  const inputClass = (field: FieldName) =>
    `w-full border-b bg-transparent py-3 text-[#F5F5F7] outline-none transition-colors duration-300 focus:border-[#E5A93C] ${
      fieldErrors[field] ? "border-red-400" : "border-white/15"
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      {title && <h2 className="font-display text-2xl text-white">{title}</h2>}

      {packageName && (
        <p className="border-l-2 border-[#E5A93C] pl-4 text-sm text-[#F5F5F7]">
          <span className="block text-[10px] tracking-[0.24em] uppercase text-[#8E8E93]">
            Package
          </span>
          {packageName}
        </p>
      )}

      {FIELDS.map((field) => (
        <div key={field.name} className="group">
          <label htmlFor={`inquiry-${field.name}`} className={labelClass}>
            {field.label}
          </label>
          <input
            id={`inquiry-${field.name}`}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            required={field.name !== "wedding_date"}
            aria-invalid={fieldErrors[field.name] ? true : undefined}
            aria-describedby={
              fieldErrors[field.name] ? `inquiry-${field.name}-error` : undefined
            }
            onChange={() => clearError(field.name)}
            className={inputClass(field.name)}
          />
          {fieldErrors[field.name] && (
            <p
              id={`inquiry-${field.name}-error`}
              role="alert"
              className="mt-2 text-xs text-red-400"
            >
              {fieldErrors[field.name]}
            </p>
          )}
        </div>
      ))}

      <div className="group">
        <label htmlFor="inquiry-message" className={labelClass}>
          Message / location
        </label>
        <textarea
          id="inquiry-message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          placeholder="Tell us about your celebration and city…"
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={
            fieldErrors.message ? "inquiry-message-error" : undefined
          }
          onChange={() => clearError("message")}
          className={`${inputClass("message")} resize-none placeholder:text-[#8E8E93]/50`}
        />
        {fieldErrors.message && (
          <p
            id="inquiry-message-error"
            role="alert"
            className="mt-2 text-xs text-red-400"
          >
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label htmlFor="inquiry-website">Website</label>
        <input
          id="inquiry-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

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

      <div aria-live="polite" role="status">
        {status === "ok" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-[#E5A93C]"
          >
            Received — we will connect with you shortly.
          </motion.p>
        )}
      </div>
      {status === "error" && formError && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {formError}
        </motion.p>
      )}
    </form>
  );
}

export default function InquiryForm(props: Props) {
  return (
    <Suspense
      fallback={<div aria-hidden="true" className="min-h-[28rem]" />}
    >
      <InquiryFormInner {...props} />
    </Suspense>
  );
}
