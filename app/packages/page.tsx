import { LuxuryFadeIn } from "@/components/LuxuryFadeIn";
import PackagesCategoryTabs from "@/components/PackagesCategoryTabs";
import SplitHeading from "@/components/SplitHeading";
import { getPackagesData } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Investment",
};

export default async function PackagesPage() {
  const packages = await getPackagesData();

  return (
    <div className="bg-[#0A0A0A] px-6 pb-28 pt-32 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <LuxuryFadeIn>
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#E5A93C]">
            Investment
          </p>
        </LuxuryFadeIn>
        <SplitHeading
          as="h1"
          immediate
          className="mt-4 font-display text-5xl text-white sm:text-6xl"
        >
          Transparent tiers
        </SplitHeading>
        <LuxuryFadeIn delay={0.1}>
          <p className="mt-4 max-w-xl text-base font-light text-[#8E8E93]">
            From intimate pre-shoots to full wedding-day coverage, here is
            every collection we offer — clear pricing before we craft your
            day.
          </p>
        </LuxuryFadeIn>

        <PackagesCategoryTabs packages={packages} />
      </div>
    </div>
  );
}
