import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import InquiryForm from "@/components/InquiryForm";
import SplitHeading from "@/components/SplitHeading";
import { brand, social } from "@/lib/content";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="bg-[#0A0A0A] px-6 pb-28 pt-32 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
        <div>
          <LuxuryFadeIn>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
              Contact
            </p>
          </LuxuryFadeIn>
          <SplitHeading
            as="h1"
            immediate
            className="mt-4 font-display text-5xl text-white sm:text-6xl"
          >
            Let us capture your wedding journey
          </SplitHeading>
          <LuxuryFadeIn delay={0.1}>
            <p className="mt-4 text-base font-light leading-relaxed text-[#8E8E93]">
              Connect with us to discuss your wedding photography needs,
              wherever in Sri Lanka your celebration awaits.
            </p>
            <div className="mt-10 space-y-3 text-sm text-[#8E8E93]">
              <p>
                <a
                  href={`tel:${brand.phone.replace(/\s/g, "")}`}
                  className="hover:text-[#E5A93C]"
                >
                  {brand.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${brand.email}`}
                  className="hover:text-[#E5A93C]"
                >
                  {brand.email}
                </a>
              </p>
              <p>{brand.address}</p>
            </div>
            <div className="mt-8 flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-[#8E8E93]">
              <a
                href={social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-transparent pb-1 transition hover:border-[#E5A93C] hover:text-[#E5A93C]"
              >
                WhatsApp
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-transparent pb-1 transition hover:border-[#E5A93C] hover:text-[#E5A93C]"
              >
                Instagram
              </a>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-transparent pb-1 transition hover:border-[#E5A93C] hover:text-[#E5A93C]"
              >
                Facebook
              </a>
            </div>
          </LuxuryFadeIn>
        </div>
        <LuxuryFadeIn delay={0.1}>
          <InquiryForm submitLabel="Get in touch" />
        </LuxuryFadeIn>
      </div>
    </div>
  );
}
