"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      role="alert"
      className="flex min-h-[80vh] items-center justify-center bg-[#0A0A0A] px-6 pb-24 pt-36 text-center"
    >
      <div className="max-w-xl">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
          Something went wrong
        </p>
        <h1 className="mt-5 font-display text-5xl text-[#F5F5F7] sm:text-6xl">
          A moment, please
        </h1>
        <div className="mx-auto mt-6 h-px w-16 bg-[#E5A93C]/60" />
        <p className="mt-6 text-base font-light leading-relaxed text-[#8E8E93]">
          We hit an unexpected problem loading this page. You can try again, or
          head back to the beginning.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center justify-center border border-[#E5A93C] bg-[#E5A93C] px-9 py-3.5 text-[11px] font-medium tracking-[0.26em] uppercase text-[#0A0A0A] transition-colors duration-500 hover:bg-transparent hover:text-[#E5A93C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A93C]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-white/30 px-9 py-3.5 text-[11px] font-medium tracking-[0.26em] uppercase text-[#F5F5F7] transition-colors duration-500 hover:border-[#E5A93C] hover:text-[#E5A93C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5A93C]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
