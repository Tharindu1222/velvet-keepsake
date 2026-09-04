import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import SplitHeading from "@/components/SplitHeading";
import MagneticButton from "@/components/MagneticButton";
import { testimonials } from "@/lib/content";

export const metadata = {
  title: "Reviews",
};

export default function ReviewsPage() {
  return (
    <div className="bg-[#0A0A0A] px-6 pb-28 pt-32 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <LuxuryFadeIn>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
            Testimonials
          </p>
        </LuxuryFadeIn>
        <SplitHeading
          as="h1"
          immediate
          className="mt-4 font-display text-5xl text-white sm:text-6xl"
        >
          Wedding testimonials
        </SplitHeading>
        <LuxuryFadeIn delay={0.1}>
          <p className="mt-4 text-base font-light text-[#8E8E93]">
            What our clients say about their experience with us.
          </p>
        </LuxuryFadeIn>

        <div className="mt-16 space-y-10">
          {testimonials.map((t, i) => (
            <LuxuryFadeIn key={t.name} delay={i * 0.05}>
              <blockquote className="group border-t border-white/10 pt-10 transition-colors duration-500 hover:border-[#E5A93C]/40">
                <p className="font-display text-2xl leading-relaxed text-white sm:text-3xl">
                  “{t.quote}”
                </p>
                <footer className="mt-6 flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-[#8E8E93]">
                  <span className="h-1 w-1 rounded-full bg-[#E5A93C] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {t.name}
                </footer>
              </blockquote>
            </LuxuryFadeIn>
          ))}
        </div>

        <div className="mt-16">
          <MagneticButton href="/reserve" variant="gold">
            Reserve Now
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
