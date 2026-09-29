"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DESTINATIONS } from "@/data/destinations";
import { COUNTRY_SAFETY_INFO } from "@/data/safety";

type SearchResultType = "여행지" | "안전정보";

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
}

const DESTINATION_RESULTS: SearchResult[] = DESTINATIONS.map((d) => ({
  id: `destination-${d.id}`,
  type: "여행지",
  title: d.name,
  subtitle: `${d.country} · ${d.themes.join(", ")}`,
}));

const SAFETY_RESULTS: SearchResult[] = COUNTRY_SAFETY_INFO.map((s) => ({
  id: `safety-${s.id}`,
  type: "안전정보",
  title: s.countryName,
  subtitle: "국가별 안전정보",
}));

const ALL_RESULTS: SearchResult[] = [...DESTINATION_RESULTS, ...SAFETY_RESULTS];

function searchIndexText(result: SearchResult): string {
  return `${result.title} ${result.subtitle}`;
}

export default function SearchHero() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return ALL_RESULTS.filter((r) => searchIndexText(r).includes(trimmed)).slice(0, 8);
  }, [query]);

  return (
    <section
      className="relative flex h-[420px] flex-col items-center justify-center gap-6 overflow-hidden px-5 text-center md:h-[560px]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(38,36,37,0.35), rgba(38,36,37,0.35)), url('https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Seongsan_Ilchulbong.jpg/1280px-Seongsan_Ilchulbong.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="max-w-xl text-[28px] font-bold leading-[1.3] text-white md:text-[36px]">
        다음 여행지, 여기서 찾고 안전하게 준비하세요
      </h1>
      <p className="max-w-md text-[16px] leading-[1.6] text-white/90">
        여행지 이름이나 국가, 테마 키워드로 여행지와 안전정보를 함께 검색해 보세요.
      </p>

      <div className="w-full max-w-md">
        <div className="flex min-h-[48px] items-center gap-2 rounded-[999px] border border-[#E4E0DC] bg-white px-4 py-2 shadow-[0_1px_2px_rgba(38,36,37,0.06),0_8px_20px_rgba(38,36,37,0.08)]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-[#FF6A4D]"
          >
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="여행지·국가·테마 검색 (예: 제주, 일본, 휴양)"
            aria-label="여행지·안전정보 통합 검색"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-[#262425] outline-none placeholder:text-[#78737A]"
          />
        </div>

        {query.trim() && (
          <div className="mt-2 max-h-72 overflow-y-auto rounded-[16px] bg-white p-2 text-left shadow-[0_1px_2px_rgba(38,36,37,0.06),0_8px_20px_rgba(38,36,37,0.08)]">
            {results.length === 0 ? (
              <p className="px-3 py-2 text-[14px] text-[#78737A]">
                &quot;{query}&quot;에 대한 검색 결과가 없습니다.
              </p>
            ) : (
              <ul>
                {results.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-[10px] px-3 py-2 hover:bg-[#F7F6F4]"
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-[#262425]">{r.title}</p>
                      <p className="text-[13px] text-[#78737A]">{r.subtitle}</p>
                    </div>
                    <span className="shrink-0 rounded-[999px] bg-[#FFE3D8] px-2 py-1 text-[13px] font-medium text-[#FF6A4D]">
                      {r.type}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/travel-tools"
          className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          여행 도구 살펴보기
        </Link>
        <Link
          href="/mates"
          className="flex min-h-[44px] items-center rounded-[10px] px-4 text-[16px] font-semibold text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          동행 찾기
        </Link>
      </div>
    </section>
  );
}
