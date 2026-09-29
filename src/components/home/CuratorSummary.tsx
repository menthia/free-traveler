import Link from "next/link";
import { REPRESENTATIVE_PROFILE } from "@/data/representative";

export default function CuratorSummary() {
  const { name, stats, philosophy } = REPRESENTATIVE_PROFILE;
  const philosophyQuote = philosophy.split(".")[0]?.trim() ?? philosophy;

  return (
    <section className="flex flex-col items-center gap-8 md:flex-row md:items-stretch">
      <div className="flex flex-col justify-center gap-3 md:w-[46%]">
        <p className="text-[13px] font-medium text-[#78737A]">{name}</p>
        <p className="text-[26px] font-bold text-[#262425]">
          {stats.trips}+ Trips · {stats.countries}+ Countries
        </p>
        <p className="text-[16px] leading-[1.6] text-[#4B4749]">{philosophyQuote}</p>
      </div>
      <div className="flex flex-col justify-center gap-4 md:w-[54%]">
        <p className="text-[16px] leading-[1.6] text-[#4B4749]">{REPRESENTATIVE_PROFILE.intro}</p>
        <Link
          href="/about"
          className="inline-flex min-h-[44px] w-fit items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
        >
          대표 소개 더 보기
        </Link>
      </div>
    </section>
  );
}
