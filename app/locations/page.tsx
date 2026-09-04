import Image from "next/image";
import Link from "next/link";
import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import SplitHeading from "@/components/SplitHeading";
import TiltCard from "@/components/TiltCard";
import { getLocationsData } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Locations",
};

export default async function LocationsPage() {
  const locations = await getLocationsData();

  return (
    <div className="bg-[#0A0A0A] px-6 pb-28 pt-32 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <LuxuryFadeIn>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
            Island-wide coverage
          </p>
        </LuxuryFadeIn>
        <SplitHeading
          as="h1"
          immediate
          className="mt-4 font-display text-5xl text-white sm:text-6xl"
        >
          Favourite locations across Sri Lanka
        </SplitHeading>
        <LuxuryFadeIn delay={0.1}>
          <p className="mt-4 max-w-2xl text-base font-light text-[#8E8E93]">
            From coastal forts to misty tea country, we travel anywhere on the
            island to capture your day. Here are a few of our favourite
            backdrops.
          </p>
        </LuxuryFadeIn>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {locations.map((location, i) => (
            <LuxuryFadeIn key={location.id} delay={i * 0.08}>
              <Link href={`/locations/${location.slug}`} className="group block">
                <TiltCard max={5} className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={location.image}
                    alt={location.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
                  <div className="absolute bottom-0 p-8">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#E5A93C]">
                      {location.badge}
                    </span>
                    <h2 className="mt-2 font-display text-4xl text-white">
                      {location.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#8E8E93]">
                      {location.subtitle}
                    </p>
                    <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-[#E5A93C]/90">
                      {location.highlight}
                    </p>
                  </div>
                </TiltCard>
              </Link>
            </LuxuryFadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
