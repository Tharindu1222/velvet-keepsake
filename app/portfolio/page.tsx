import GalleryGrid from "@/components/GalleryGrid";
import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import SplitHeading from "@/components/SplitHeading";
import MagneticButton from "@/components/MagneticButton";
import TiltCard from "@/components/TiltCard";
import { getPool, type Photo } from "@/lib/db";
import { getSpotlightData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio",
};

async function getPhotos(): Promise<Photo[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, url, public_id, category, title, alt_text, created_at
       FROM photos ORDER BY created_at DESC`
    );
    return rows as Photo[];
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const [photos, spotlight] = await Promise.all([getPhotos(), getSpotlightData()]);

  return (
    <div className="bg-[#0A0A0A] px-6 pb-28 pt-32 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <LuxuryFadeIn>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
            Portfolio
          </p>
        </LuxuryFadeIn>
        <SplitHeading
          as="h1"
          immediate
          className="mt-4 font-display text-5xl text-white sm:text-6xl"
        >
          Our spotlight
        </SplitHeading>
        <LuxuryFadeIn delay={0.1}>
          <p className="mt-4 max-w-xl text-base font-light text-[#8E8E93]">
            Exclusive pieces of work — click a shoot to see every photo.
          </p>
        </LuxuryFadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spotlight.map((item, i) => (
            <LuxuryFadeIn key={item.id} delay={i * 0.04}>
              <Link href={`/portfolio/${item.id}`} className="group block">
                <TiltCard max={5} className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.couple}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#E5A93C]">
                      {item.type}
                    </p>
                    <h2 className="mt-1 font-display text-2xl text-white">
                      {item.couple}
                    </h2>
                    <p className="text-sm text-[#8E8E93]">{item.location}</p>
                    <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-[#E5A93C] opacity-0 transition group-hover:opacity-100">
                      View shoot →
                    </p>
                  </div>
                </TiltCard>
              </Link>
            </LuxuryFadeIn>
          ))}
        </div>

        <div className="mt-24">
          <SplitHeading as="h2" className="mb-10 font-display text-3xl text-white">
            Full gallery
          </SplitHeading>
          <GalleryGrid photos={photos} />
        </div>

        <div className="mt-16 text-center">
          <MagneticButton href="/reserve" variant="gold">
            Reserve Now
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
