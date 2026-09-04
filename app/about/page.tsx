import Image from "next/image";
import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import MagneticButton from "@/components/MagneticButton";
import SplitHeading from "@/components/SplitHeading";
import ParallaxImage from "@/components/ParallaxImage";
import TiltCard from "@/components/TiltCard";
import CountUpStat from "@/components/CountUpStat";
import { getServicesData, getHeroStats, getAboutSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us",
};

export default async function AboutPage() {
  const [services, heroStats, aboutSettings] = await Promise.all([
    getServicesData(),
    getHeroStats(),
    getAboutSettings(),
  ]);

  return (
    <div className="bg-[#0A0A0A]">
      <section className="relative flex min-h-[70vh] items-end overflow-hidden px-6 pb-16 pt-36 lg:px-10">
        <ParallaxImage className="absolute inset-0" strength={30}>
          <Image
            src={aboutSettings.about_hero_image}
            alt=""
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
        </ParallaxImage>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/30" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <LuxuryFadeIn>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
              About us
            </p>
          </LuxuryFadeIn>
          <SplitHeading
            as="h1"
            immediate
            className="mt-4 max-w-3xl font-display text-5xl text-white sm:text-6xl"
          >
            Crafting timeless wedding stories across Sri Lanka
          </SplitHeading>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24 lg:px-10">
        <ParallaxImage className="absolute inset-0" strength={16}>
          <Image
            src={aboutSettings.about_intro_image}
            alt=""
            fill
            className="object-cover opacity-[0.08]"
            sizes="100vw"
          />
        </ParallaxImage>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
        <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-lg font-light leading-relaxed text-[#8E8E93]">
          <LuxuryFadeIn>
            <p>
              Velvet Keepsake specializes in capturing the elegance and emotion
              of your wedding, wherever on the island it takes place. From
              coastal forts in Galle to misty tea estates in the hill
              country, we make your special moments unforgettable with
              fine-art photography and a personal touch.
            </p>
          </LuxuryFadeIn>
          <LuxuryFadeIn delay={0.1}>
            <p>
              Our approach blends documentary instinct with editorial craft —
              natural light when it sings, sculpted shadow when it tells the
              truth, and a quiet camera that lets emotion lead.
            </p>
          </LuxuryFadeIn>
        </div>

        <LuxuryFadeIn delay={0.15}>
          <div className="relative z-10 mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-4">
            {heroStats.map((stat, i) => (
              <CountUpStat
                key={stat.id}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={i * 0.08}
                className="items-center text-center"
              />
            ))}
          </div>
        </LuxuryFadeIn>
      </section>

      <section className="relative overflow-hidden border-t border-white/5 px-6 py-24 lg:px-10">
        <Image
          src={aboutSettings.about_services_image}
          alt=""
          fill
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#141414]/90" />
        <div className="relative z-10 mx-auto max-w-7xl grid gap-10 md:grid-cols-2">
          {services.map((s, i) => (
            <LuxuryFadeIn key={s.id} delay={i * 0.06}>
              <TiltCard className="h-full border border-white/10 bg-[#0A0A0A]/60 p-8 backdrop-blur-sm" max={4}>
                <h2 className="font-display text-3xl text-white">{s.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[#8E8E93]">
                  {s.copy}
                </p>
              </TiltCard>
            </LuxuryFadeIn>
          ))}
        </div>
        <div className="relative z-10 mx-auto mt-16 max-w-7xl">
          <MagneticButton href="/reserve" variant="gold">
            Reserve Now
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
