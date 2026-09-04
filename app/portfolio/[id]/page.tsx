import Image from "next/image";
import { notFound } from "next/navigation";
import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import SplitHeading from "@/components/SplitHeading";
import ParallaxImage from "@/components/ParallaxImage";
import MagneticButton from "@/components/MagneticButton";
import HorizontalScrollGallery from "@/components/HorizontalScrollGallery";
import TiltCard from "@/components/TiltCard";
import { getSpotlightById, getShootImages } from "@/lib/data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const shoot = await getSpotlightById(Number(id));
  return { title: shoot ? `${shoot.couple} · ${shoot.type}` : "Shoot" };
}

export default async function ShootDetailPage({ params }: Props) {
  const { id } = await params;
  const shoot = await getSpotlightById(Number(id));
  if (!shoot) notFound();

  const extraImages = await getShootImages(shoot.id);
  const gallery = [
    shoot.image,
    ...extraImages.map((i) => i.image).filter((img) => img !== shoot.image),
  ];

  return (
    <div className="bg-[#0A0A0A]">
      <section className="relative min-h-[65vh] overflow-hidden">
        <ParallaxImage className="absolute inset-0" strength={26}>
          <Image
            src={shoot.image}
            alt={shoot.couple}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </ParallaxImage>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]/20" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <LuxuryFadeIn>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
                {shoot.type}
              </p>
            </LuxuryFadeIn>
            <SplitHeading
              as="h1"
              immediate
              className="mt-3 font-display text-5xl text-white sm:text-6xl"
            >
              {shoot.couple}
            </SplitHeading>
            <LuxuryFadeIn delay={0.1}>
              <p className="mt-3 text-sm tracking-[0.15em] uppercase text-[#8E8E93]">
                {shoot.location}
              </p>
            </LuxuryFadeIn>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SplitHeading as="h2" className="font-display text-3xl text-white">
              Full gallery
            </SplitHeading>
            <p className="text-sm text-[#8E8E93]">
              {gallery.length} {gallery.length === 1 ? "photo" : "photos"}
              {gallery.length > 1 ? " — scroll to explore" : ""}
            </p>
          </div>
        </div>

        {gallery.length === 0 ? (
          <p className="px-6 text-sm text-[#8E8E93] lg:px-10">
            No photos in this shoot yet.
          </p>
        ) : (
          <HorizontalScrollGallery
            itemWidth="min(78vw, 480px)"
            items={gallery.map((img, i) => (
              <TiltCard
                key={`${img}-${i}`}
                max={4}
                className="group relative aspect-[4/5] w-full overflow-hidden border border-white/10"
              >
                <Image
                  src={img}
                  alt={`${shoot.couple} — photo ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 80vw, 480px"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <span className="absolute left-5 top-5 font-display text-3xl leading-none text-white/25 transition duration-500 group-hover:text-[#E5A93C]/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </TiltCard>
            ))}
          />
        )}

        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mt-16 flex flex-wrap gap-4">
            <MagneticButton href="/reserve" variant="gold">
              Reserve a shoot like this
            </MagneticButton>
            <MagneticButton href="/portfolio">Back to portfolio</MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
