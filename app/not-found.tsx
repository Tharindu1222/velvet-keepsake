import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[#0A0A0A] px-6 pb-24 pt-36 text-center">
      <div className="max-w-xl">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
          Error 404
        </p>
        <h1 className="mt-5 font-display text-5xl text-[#F5F5F7] sm:text-6xl">
          This page has wandered off
        </h1>
        <div className="mx-auto mt-6 h-px w-16 bg-[#E5A93C]/60" />
        <p className="mt-6 text-base font-light leading-relaxed text-[#8E8E93]">
          The page you are looking for does not exist or has moved. Let us take
          you back to the keepsakes.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-[#E5A93C] bg-[#E5A93C] px-9 py-3.5 text-[11px] font-medium tracking-[0.26em] uppercase text-[#0A0A0A] transition-colors duration-500 hover:bg-transparent hover:text-[#E5A93C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A93C]"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-white/30 px-9 py-3.5 text-[11px] font-medium tracking-[0.26em] uppercase text-[#F5F5F7] transition-colors duration-500 hover:border-[#E5A93C] hover:text-[#E5A93C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A93C]"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
