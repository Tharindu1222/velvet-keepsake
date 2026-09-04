import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import InquiryForm from "@/components/InquiryForm";
import SplitHeading from "@/components/SplitHeading";

export const metadata = {
  title: "Reserve Now",
};

export default function ReservePage() {
  return (
    <div className="bg-[#0A0A0A] px-6 pb-28 pt-32 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
        <div>
          <LuxuryFadeIn>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
              Reserve Now
            </p>
          </LuxuryFadeIn>
          <SplitHeading
            as="h1"
            immediate
            className="mt-4 font-display text-5xl text-white sm:text-6xl"
          >
            Booking for celebrations island-wide
          </SplitHeading>
          <LuxuryFadeIn delay={0.1}>
            <p className="mt-4 text-base font-light leading-relaxed text-[#8E8E93]">
              Bringing Velvet Keepsake to your wedding is as simple as filling
              out this form. Our team will connect with you to guide package
              selection and tailor services to your vision — wherever in Sri
              Lanka you celebrate.
            </p>
            <ul className="mt-10 space-y-4 text-sm text-[#8E8E93]">
              <li className="border-l border-[#E5A93C]/50 pl-4">
                Island-wide coverage — coast to hill country
              </li>
              <li className="border-l border-[#E5A93C]/50 pl-4">
                Pre-wedding shoots at popular locations
              </li>
              <li className="border-l border-[#E5A93C]/50 pl-4">
                Custom collections for multi-day celebrations
              </li>
            </ul>
          </LuxuryFadeIn>
        </div>
        <LuxuryFadeIn delay={0.1}>
          <div className="border border-white/10 bg-[#141414] p-8">
            <InquiryForm submitLabel="Start your journey" />
          </div>
        </LuxuryFadeIn>
      </div>
    </div>
  );
}
