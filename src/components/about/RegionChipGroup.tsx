import Link from "next/link";
import { REPRESENTATIVE_PROFILE } from "@/data/representative";
import { DESTINATIONS } from "@/data/destinations";
import type { WorldRegion } from "@/data/representative";

const REGION_ORDER: WorldRegion[] = ["아시아", "유럽", "아메리카", "오세아니아"];

export default function RegionChipGroup() {
  const { visitedCountries } = REPRESENTATIVE_PROFILE;
  const countriesWithContent = new Set(DESTINATIONS.map((d) => d.country));
  const totalCount = visitedCountries.length;

  return (
    <div>
      <p className="mb-4 text-[20px] font-semibold text-[#262425]">
        방문 국가 <span className="text-[#FF6A4D]">{totalCount}개국</span>
      </p>
      <div className="flex flex-col gap-4">
        {REGION_ORDER.map((region) => {
          const countries = visitedCountries.filter((c) => c.region === region);
          if (countries.length === 0) return null;
          return (
            <div key={region}>
              <p className="mb-2 text-[13px] font-medium text-[#78737A]">{region}</p>
              <div className="flex flex-wrap gap-2">
                {countries.map(({ country }) =>
                  countriesWithContent.has(country) ? (
                    <Link
                      key={country}
                      href={`/?country=${encodeURIComponent(country)}`}
                      className="min-h-[44px] rounded-[999px] bg-[#F0EEEA] px-4 py-2 text-[14px] font-medium text-[#262425] hover:bg-[#FFE3D8] hover:text-[#FF6A4D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
                    >
                      {country}
                    </Link>
                  ) : (
                    <span
                      key={country}
                      className="min-h-[44px] rounded-[999px] bg-[#F0EEEA] px-4 py-2 text-[14px] font-medium text-[#78737A]"
                    >
                      {country}
                    </span>
                  ),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
