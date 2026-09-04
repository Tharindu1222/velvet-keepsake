import Image from "next/image";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import DestinationsMarquee from "@/components/DestinationsMarquee";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import FAQAccordion from "@/components/FAQAccordion";
import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import MagneticButton from "@/components/MagneticButton";
import SplitHeading from "@/components/SplitHeading";
import TiltCard from "@/components/TiltCard";
import HorizontalScrollGallery from "@/components/HorizontalScrollGallery";
import ScrollWipeGallery from "@/components/ScrollWipeGallery";
import PackagesGrid from "@/components/PackagesGrid";
import { insights } from "@/lib/content";
import {
  getHeroSlides,
  getHeroStats,
  getHeroSettings,
  getLocationsData,
  getServicesData,
  getSpotlightData,
  getPackagesData,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [heroSlides, heroStats, heroSettings, locations, services, spotlight, packages] =
    await Promise.all([
      getHeroSlides(),
      getHeroStats(),
      getHeroSettings(),
      getLocationsData(),
      getServicesData(),
      getSpotlightData(),
      getPackagesData(),
    ]);

  const featuredPackages = packages.filter((p) => !!p.is_featured).slice(0, 3);

  return (
    <>
      <HomeHero slides={heroSlides} stats={heroStats} settings={heroSettings} />

      <section className="bg-[#0A0A0A] px-6 py-28 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-end">
          <div>
            <LuxuryFadeIn>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
                Our craft
              </p>
            </LuxuryFadeIn>
            <SplitHeading className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">
              Crafting timeless wedding stories across Sri Lanka
            </SplitHeading>
          </div>
          <LuxuryFadeIn delay={0.12}>
            <p className="text-base font-light leading-relaxed text-[#8E8E93]">
              Velvet Keepsake specializes in capturing the elegance and emotion
              of your wedding, wherever on the island it takes place. From
              coastal forts to misty tea country, we make your special
              moments unforgettable with fine-art photography and a personal
              touch.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-block text-[11px] tracking-[0.22em] uppercase text-[#E5A93C] hover:text-[#F5F5F7]"
            >
              Read more →
            </Link>
          </LuxuryFadeIn>
        </div>
      </section>

      <DestinationsMarquee />

      <section className="bg-[#0A0A0A] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <LuxuryFadeIn>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
                  Popular locations
                </p>
              </LuxuryFadeIn>
              <SplitHeading className="mt-3 font-display text-4xl text-white sm:text-5xl">
                We travel anywhere on the island
              </SplitHeading>
              <LuxuryFadeIn delay={0.1}>
                <p className="mt-4 max-w-xl text-sm font-light text-[#8E8E93]">
                  From coastal forts to hill-country tea estates, here are a
                  few of our favourite backdrops across Sri Lanka.
                </p>
              </LuxuryFadeIn>
            </div>
            <LuxuryFadeIn>
              <Link
                href="/locations"
                className="text-[11px] tracking-[0.22em] uppercase text-[#8E8E93] hover:text-[#E5A93C]"
              >
                All locations →
              </Link>
            </LuxuryFadeIn>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {locations.slice(0, 3).map((location, i) => (
              <LuxuryFadeIn key={location.id} delay={i * 0.08}>
                <Link href={`/locations/${location.slug}`} className="group block">
                  <TiltCard max={5} className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={location.image}
                      alt={location.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
                    <span className="absolute left-4 top-4 text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
                      {location.badge}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-display text-3xl text-white">
                        {location.title}
                      </h3>
                      <p className="mt-2 text-sm text-[#8E8E93]">
                        {location.subtitle}
                      </p>
                      <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-[#E5A93C]">
                        Explore location →
                      </p>
                    </div>
                  </TiltCard>
                </Link>
              </LuxuryFadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute inset-x-0 top-0 z-20 px-6 pt-16 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <LuxuryFadeIn>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
                  What we offer
                </p>
              </LuxuryFadeIn>
              <SplitHeading className="mt-3 font-display text-4xl text-white sm:text-5xl">
                Photography for every chapter
              </SplitHeading>
            </div>
            <LuxuryFadeIn delay={0.1}>
              <p className="max-w-xs text-sm leading-relaxed text-[#8E8E93]">
                Scroll down — each chapter reveals itself in turn.
              </p>
            </LuxuryFadeIn>
          </div>
        </div>

        <ScrollWipeGallery
          items={services.map((service, i) => (
            <div key={service.id} className="relative h-full w-full">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
              <div className="absolute inset-0 flex items-end">
                <div className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10">
                  <span className="font-display text-7xl leading-none text-white/15 sm:text-8xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-4xl text-white sm:text-5xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-[#C9C9CE] sm:text-lg">
                    {service.copy}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#E5A93C]">
                    Discover <span aria-hidden>→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        />
      </section>

      <section className="relative overflow-hidden bg-[#0A0A0A] py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <LuxuryFadeIn>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
                  Our spotlight
                </p>
              </LuxuryFadeIn>
              <SplitHeading className="mt-3 font-display text-4xl text-white sm:text-5xl">
                Exclusive pieces of work
              </SplitHeading>
            </div>
            <LuxuryFadeIn>
              <Link
                href="/portfolio"
                className="text-[11px] tracking-[0.22em] uppercase text-[#8E8E93] hover:text-[#E5A93C]"
              >
                View more →
              </Link>
            </LuxuryFadeIn>
          </div>
        </div>

        <div className="mt-16">
          <HorizontalScrollGallery
            itemWidth="min(72vw, 420px)"
            items={spotlight.map((item, i) => (
              <Link key={item.id} href={`/portfolio/${item.id}`} className="group block h-full">
                <TiltCard
                  max={5}
                  className="relative aspect-[3/4] w-full overflow-hidden border border-white/10"
                >
                  <Image
                    src={item.image}
                    alt={item.couple}
                    fill
                    sizes="(max-width: 768px) 72vw, 420px"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/15 to-transparent" />

                  <span className="absolute right-5 top-5 font-display text-5xl leading-none text-white/10 transition duration-500 group-hover:text-[#E5A93C]/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#E5A93C]">
                      {item.type}
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-white sm:text-3xl">
                      {item.couple}
                    </h3>
                    <p className="mt-1 text-sm text-[#8E8E93]">{item.location}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-[#E5A93C] transition-transform duration-500 group-hover:translate-x-1.5">
                      View shoot
                      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[#E5A93C] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </TiltCard>
              </Link>
            ))}
          />
        </div>
      </section>

      {featuredPackages.length > 0 && (
        <section className="bg-[#141414] px-6 py-28 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <LuxuryFadeIn>
                  <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
                    Investment
                  </p>
                </LuxuryFadeIn>
                <SplitHeading className="mt-3 font-display text-4xl text-white sm:text-5xl">
                  Transparent wedding packages
                </SplitHeading>
                <LuxuryFadeIn delay={0.1}>
                  <p className="mt-4 max-w-xl text-sm font-light text-[#8E8E93]">
                    From classic day coverage to our fullest luxury
                    collections — every package includes professionally
                    retouched images and albums crafted with care.
                  </p>
                </LuxuryFadeIn>
              </div>
              <LuxuryFadeIn>
                <Link
                  href="/packages"
                  className="text-[11px] tracking-[0.22em] uppercase text-[#8E8E93] hover:text-[#E5A93C]"
                >
                  All packages →
                </Link>
              </LuxuryFadeIn>
            </div>

            <PackagesGrid packages={featuredPackages} />
          </div>
        </section>
      )}

      <section className="relative overflow-hidden px-6 py-32 lg:px-10">
        <Image
          src="https://images.unsplash.com/photo-1760533852055-724d3a50dcbd?w=1800&q=80"
          alt=""
          fill
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/70" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <LuxuryFadeIn>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
              Booking now
            </p>
          </LuxuryFadeIn>
          <SplitHeading className="mt-4 font-display text-4xl text-white sm:text-5xl">
            Booking for celebrations island-wide
          </SplitHeading>
          <LuxuryFadeIn delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-base font-light text-[#8E8E93]">
              Bringing Velvet Keepsake to your wedding is as simple as a short
              form. We guide you through packages and tailor the experience —
              wherever in Sri Lanka you celebrate.
            </p>
            <div className="mt-10 flex justify-center">
              <MagneticButton href="/reserve" variant="gold">
                Start your journey
              </MagneticButton>
            </div>
          </LuxuryFadeIn>
        </div>
      </section>

      <TestimonialsCarousel />

      <section className="bg-[#0A0A0A] px-6 py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <LuxuryFadeIn>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
              Insights
            </p>
          </LuxuryFadeIn>
          <SplitHeading className="mt-3 font-display text-4xl text-white sm:text-5xl">
            Thoughts for an exquisite day
          </SplitHeading>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {insights.map((post, i) => (
              <LuxuryFadeIn key={post.slug} delay={i * 0.08}>
                <article className="border-t border-white/10 pt-8">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-[#8E8E93]">
                    Insights
                  </p>
                  <h3 className="mt-3 font-display text-3xl text-[#F5F5F7]">
                    {post.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#8E8E93]">
                    {post.excerpt}
                  </p>
                  <Link
                    href="/about"
                    className="mt-6 inline-block text-[11px] tracking-[0.2em] uppercase text-[#E5A93C]"
                  >
                    Read more…
                  </Link>
                </article>
              </LuxuryFadeIn>
            ))}
          </div>
        </div>
      </section>

      <FAQAccordion />

      <section className="border-t border-white/5 bg-[#141414] px-6 py-24 text-center lg:px-10">
        <SplitHeading className="font-display text-4xl text-white sm:text-5xl">
          Let us capture your wedding journey
        </SplitHeading>
        <LuxuryFadeIn delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-base font-light text-[#8E8E93]">
            Connect with us to discuss your photography needs, wherever in Sri
            Lanka your celebration awaits.
          </p>
          <div className="mt-10 flex justify-center">
            <MagneticButton href="/contact" variant="outline">
              Get in touch
            </MagneticButton>
          </div>
        </LuxuryFadeIn>
      </section>
    </>
  );
}
