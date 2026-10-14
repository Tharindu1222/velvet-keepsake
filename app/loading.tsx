import Link from "next/link";

export default function Loading() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="flex min-h-[80vh] flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center"
    >
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border border-[#E5A93C]/25 border-t-[#E5A93C] motion-reduce:animate-none"
      />
      <p className="mt-6 text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
        Loading
      </p>
      <p className="mt-2 text-sm font-light text-[#8E8E93]">
        Preparing your keepsakes…
      </p>
      <Link
        href="/"
        className="mt-8 text-[10px] tracking-[0.24em] uppercase text-[#8E8E93] transition-colors hover:text-[#E5A93C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A93C]"
      >
        Back to home
      </Link>
    </section>
  );
}
