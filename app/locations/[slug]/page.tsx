import Image from "next/image";
import { notFound } from "next/navigation";
import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import SplitHeading from "@/components/SplitHeading";
import ParallaxImage from "@/components/ParallaxImage";
import MagneticButton from "@/components/MagneticButton";
import { getLocationBySlug, getLocationsData } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const locations = await getLocationsData();
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  return { title: location?.title ?? "Location" };
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  return (
    <div className="bg-[#0A0A0A]">
      <section className="relative min-h-[75vh] overflow-hidden">
        <ParallaxImage className="absolute inset-0" strength={26}>
          <Image
            src={location.image}
            alt={location.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </ParallaxImage>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]/20" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-16 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <LuxuryFadeIn>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
                {location.badge}
              </p>
            </LuxuryFadeIn>
            <SplitHeading
              as="h1"
              immediate
              className="mt-3 font-display text-5xl text-white sm:text-7xl"
            >
              {location.title}
            </SplitHeading>
            <LuxuryFadeIn delay={0.1}>
              <p className="mt-4 max-w-xl text-lg text-[#8E8E93]">
                {location.subtitle}
              </p>
              <p className="mt-6 font-display text-2xl text-[#E5A93C]">
                {location.highlight}
              </p>
            </LuxuryFadeIn>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
        <LuxuryFadeIn>
          <p className="text-base font-light leading-relaxed text-[#8E8E93]">
            Whether it&apos;s your ceremony, reception, or a pre-wedding shoot,
            we travel to {location.title} and anywhere else across Sri Lanka
            to capture your day. Reach out early — hill-country and coastal
            dates fill up fast during peak season.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <MagneticButton href="/reserve" variant="gold">
              Reserve a shoot here
            </MagneticButton>
            <MagneticButton href="/locations">All locations</MagneticButton>
          </div>
        </LuxuryFadeIn>
      </section>
    </div>
  );
}
