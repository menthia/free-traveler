"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { DESTINATIONS } from "@/data/destinations";
import type { Destination } from "@/data/destinations.schema";
import { COUNTRY_SAFETY_INFO } from "@/data/safety";
import DestinationDrawer from "./DestinationDrawer";
import { TRAVEL_MOTIVE_THEME_MAP, type TravelMotive } from "./ThemeChipFilter";

const FAVORITES_STORAGE_KEY = "ft_favorite_destinations";

/**
 * 필터: 국가 · 테마 선택 + 자유 검색어(도시명·계절 키워드 등을 함께 커버, PROJECT_SCOPE.md §3
 * 승인된 단순화 — 정적 데이터에 별도 도시/기간 필드가 없어 자유 검색어로 대체).
 */
function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // 서버 렌더링 결과(빈 Set)와 초기 클라이언트 렌더를 일치시켜 하이드레이션 불일치를 피하기
  // 위해, localStorage 읽기는 초기 상태가 아닌 마운트 후 effect에서 수행한다.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      // localStorage(외부 저장소)와의 최초 동기화이며, 하이드레이션 이후 1회만 실행된다
      // (구독이 필요 없는 일회성 읽기).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setFavorites(new Set(JSON.parse(raw)));
    } catch {
      // localStorage 접근 불가(프라이빗 모드 등) 시 빈 상태로 둔다.
    }
  }, []);

  const toggle = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // 저장 실패는 무시한다(치명적이지 않음).
      }
      return next;
    });
  };

  return { favorites, toggle };
}

function DestinationCard({
  destination,
  isFavorite,
  onOpen,
  onToggleFavorite,
}: {
  destination: Destination;
  isFavorite: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <div
      data-testid="destination-card"
      className="group relative overflow-hidden rounded-[16px] border border-[#E4E0DC] bg-white"
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF6A4D]"
      >
        <div className="relative h-40 w-full">
          <Image
            src={destination.image.url}
            alt={destination.image.alt}
            fill
            loading="lazy"
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <p className="text-[13px] text-[#78737A]">{destination.country}</p>
          <p className="text-[17px] font-semibold text-[#262425]">{destination.name}</p>
        </div>
      </button>
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite ? `${destination.name} 즐겨찾기 해제` : `${destination.name} 즐겨찾기 추가`
        }
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={isFavorite ? "#FF6A4D" : "none"}
          stroke="#FF6A4D"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 21s-7-4.5-9.5-9C.7 8.2 2 4.5 5.5 4c2-.3 3.7.7 4.5 2C10.8 4.7 12.5 3.7 14.5 4c3.5.5 4.8 4.2 3 8-2.5 4.5-9.5 9-9.5 9z" />
        </svg>
      </button>
    </div>
  );
}

function CardGridSection({
  title,
  destinations,
  favorites,
  onOpen,
  onToggleFavorite,
}: {
  title: string;
  destinations: Destination[];
  favorites: Set<string>;
  onOpen: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-4 text-[26px] font-bold text-[#262425]">{title}</h2>
      {destinations.length === 0 ? (
        <p className="rounded-[16px] bg-[#F7F6F4] px-4 py-6 text-center text-[14px] text-[#78737A]">
          조건에 맞는 여행지가 없습니다. 필터를 조정해 보세요.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {destinations.map((d) => (
            <DestinationCard
              key={d.id}
              destination={d}
              isFavorite={favorites.has(d.id)}
              onOpen={() => onOpen(d.id)}
              onToggleFavorite={() => onToggleFavorite(d.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DestinationCardGridProps {
  /** COMP-SCR001-THEME-CHIPS의 Chip 선택 상태(Page Owner가 두 Component에 공유해 전달한다). */
  selectedTheme?: TravelMotive | null;
}

export default function DestinationCardGrid({ selectedTheme = null }: DestinationCardGridProps) {
  const [country, setCountry] = useState("all");
  const [keyword, setKeyword] = useState("");
  const searchParams = useSearchParams();
  // SCR-002 방문 국가 Chip에서 `?country=일본` 형태로 넘어온 경우, 해당 국가의 첫 여행지
  // 상세 Drawer를 초기 상태로 연다(COMP-SCR002-COUNTRY-CHIPS Functional AC 2). URL은 서버·
  // 클라이언트 렌더 모두에서 동일하므로 하이드레이션 불일치 없이 초기값으로 계산할 수 있다.
  const [openId, setOpenId] = useState<string | null>(() => {
    const destinationParam = searchParams.get("destination");
    if (destinationParam) {
      return DESTINATIONS.find((d) => d.id === destinationParam)?.id ?? null;
    }
    const countryParam = searchParams.get("country");
    if (!countryParam) return null;
    return DESTINATIONS.find((d) => d.country === countryParam)?.id ?? null;
  });
  const { favorites, toggle } = useFavorites();

  const countries = useMemo(() => [...new Set(DESTINATIONS.map((d) => d.country))].sort(), []);

  const filtered = useMemo(() => {
    const kw = keyword.trim();
    const allowedThemes = selectedTheme ? TRAVEL_MOTIVE_THEME_MAP[selectedTheme] : null;
    return DESTINATIONS.filter((d) => {
      if (country !== "all" && d.country !== country) return false;
      if (allowedThemes && !d.themes.some((t) => allowedThemes.includes(t))) return false;
      if (kw && !`${d.name} ${d.country} ${d.bestSeason}`.includes(kw)) return false;
      return true;
    });
  }, [country, selectedTheme, keyword]);

  const domestic = filtered.filter((d) => d.region === "domestic");
  const overseas = filtered.filter((d) => d.region === "overseas");

  const resetFilters = () => {
    setCountry("all");
    setKeyword("");
  };

  const openDestination = DESTINATIONS.find((d) => d.id === openId) ?? null;
  const openSafetyInfo = openDestination?.safetyCountryId
    ? (COUNTRY_SAFETY_INFO.find((s) => s.id === openDestination.safetyCountryId) ?? null)
    : null;

  const noResults = filtered.length === 0;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-[13px] text-[#78737A]">
          국가
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="min-h-[44px] rounded-[16px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          >
            <option value="all">전체</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-[13px] text-[#78737A]">
          도시·계절 검색
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 오사카, 벚꽃"
            className="min-h-[44px] rounded-[16px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          />
        </label>
        {(country !== "all" || keyword) && (
          <button
            type="button"
            onClick={resetFilters}
            className="min-h-[44px] rounded-[10px] px-4 text-[14px] font-semibold text-[#FF6A4D] hover:bg-[#FFE3D8]"
          >
            필터 초기화
          </button>
        )}
      </div>

      {noResults ? (
        <p className="rounded-[16px] bg-[#F7F6F4] px-4 py-8 text-center text-[16px] text-[#4B4749]">
          조건에 맞는 여행지가 없습니다.{" "}
          <button
            type="button"
            onClick={resetFilters}
            className="font-semibold text-[#FF6A4D] underline"
          >
            전체 초기화
          </button>
        </p>
      ) : (
        <>
          <CardGridSection
            title="국내 인기 여행지"
            destinations={domestic}
            favorites={favorites}
            onOpen={setOpenId}
            onToggleFavorite={toggle}
          />
          <CardGridSection
            title="해외 인기 여행지"
            destinations={overseas}
            favorites={favorites}
            onOpen={setOpenId}
            onToggleFavorite={toggle}
          />
        </>
      )}

      {openDestination && (
        <DestinationDrawer
          destination={openDestination}
          safetyInfo={openSafetyInfo}
          isFavorite={favorites.has(openDestination.id)}
          onToggleFavorite={() => toggle(openDestination.id)}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
