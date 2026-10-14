import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${brand.name} collects, uses and protects your personal information.`,
};

const sections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "Information we collect",
    body: (
      <>
        <p>
          When you submit the contact or reserve form we collect the details you
          give us: your name, email address, wedding date (optional), your
          message, and the package you were interested in, if any.
        </p>
        <p className="mt-4">
          We do not ask for payment details through this website.
        </p>
      </>
    ),
  },
  {
    heading: "How we use it",
    body: (
      <p>
        We use your details only to reply to your inquiry, discuss availability
        and quotes, and arrange your photography. We do not sell your personal
        information or use it for unrelated marketing.
      </p>
    ),
  },
  {
    heading: "Storage and retention",
    body: (
      <p>
        Inquiries are stored in our database and are visible only to authorised
        administrators of this site. We keep them for as long as needed to
        handle your request and any resulting booking, and delete them on
        request.
      </p>
    ),
  },
  {
    heading: "Third-party services",
    body: (
      <p>
        Images on this site are delivered through Cloudinary and Unsplash. These
        providers may receive standard request data (such as your IP address)
        when images load in your browser. Links to WhatsApp, Instagram and
        Facebook are governed by those services&apos; own privacy policies.
      </p>
    ),
  },
  {
    heading: "Cookies",
    body: (
      <p>
        The public website does not use advertising or tracking cookies. A
        session cookie is used only for administrator sign-in.
      </p>
    ),
  },
  {
    heading: "Your choices",
    body: (
      <p>
        You can ask us to access, correct or delete the information we hold
        about you at any time by emailing{" "}
        <a
          href={`mailto:${brand.email}`}
          className="text-[#E5A93C] underline-offset-4 hover:underline"
        >
          {brand.email}
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-[#0A0A0A] px-6 pb-28 pt-32 lg:px-10">
      <article className="mx-auto max-w-3xl">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
          Legal
        </p>
        <h1 className="mt-4 font-display text-5xl text-[#F5F5F7] sm:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-[#8E8E93]">
          Last updated: October 2026
        </p>
        <p className="mt-8 text-base font-light leading-relaxed text-[#8E8E93]">
          {brand.name} respects your privacy. This page explains what
          information we collect through this website and how we handle it.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl text-[#F5F5F7]">
                {s.heading}
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-[#8E8E93]">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14">
          <Link
            href="/"
            className="text-[11px] tracking-[0.24em] uppercase text-[#8E8E93] transition-colors hover:text-[#E5A93C]"
          >
            ← Back to home
          </Link>
        </p>
      </article>
    </div>
  );
}
