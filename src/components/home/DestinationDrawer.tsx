"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Destination } from "@/data/destinations.schema";
import type { CountrySafetyInfo } from "@/data/safety";

interface DestinationDrawerProps {
  destination: Destination;
  safetyInfo: CountrySafetyInfo | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

type DrawerTab = "info" | "safety";

const SAFETY_CATEGORY_LABELS: { key: keyof CountrySafetyInfo; label: string }[] = [
  { key: "security", label: "치안" },
  { key: "scam", label: "사기" },
  { key: "law", label: "법규" },
  { key: "transport", label: "교통" },
  { key: "disaster", label: "재난" },
  { key: "health", label: "보건" },
  { key: "culture", label: "문화" },
  { key: "emergencyContacts", label: "긴급연락처" },
];

export default function DestinationDrawer({
  destination,
  safetyInfo,
  isFavorite,
  onToggleFavorite,
  onClose,
}: DestinationDrawerProps) {
  const [tab, setTab] = useState<DrawerTab>("info");

  // 키보드만으로도 Drawer를 닫을 수 있게 Esc를 지원한다(design-reference/D-001/DESIGN.md §11).
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${destination.name} 상세 정보`}
        className="h-full w-full max-w-lg overflow-y-auto bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-[#78737A]">
              {destination.country} · {destination.region === "domestic" ? "국내" : "해외"}
            </p>
            <h2 className="text-[20px] font-bold text-[#262425]">{destination.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleFavorite}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isFavorite ? "#FF6A4D" : "none"}
                stroke="#FF6A4D"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 21s-7-4.5-9.5-9C.7 8.2 2 4.5 5.5 4c2-.3 3.7.7 4.5 2C10.8 4.7 12.5 3.7 14.5 4c3.5.5 4.8 4.2 3 8-2.5 4.5-9.5 9-9.5 9z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2 2l12 12M14 2L2 14"
                  stroke="#262425"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {destination.region === "overseas" && safetyInfo && (
          <div role="tablist" aria-label="상세 정보 탭" className="mb-4 flex gap-2">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "info"}
              onClick={() => setTab("info")}
              className={`min-h-[44px] rounded-[999px] px-4 text-[14px] font-semibold ${
                tab === "info" ? "bg-[#FF6A4D] text-white" : "bg-[#F0EEEA] text-[#262425]"
              }`}
            >
              여행지 정보
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "safety"}
              onClick={() => setTab("safety")}
              className={`min-h-[44px] rounded-[999px] px-4 text-[14px] font-semibold ${
                tab === "safety" ? "bg-[#FF6A4D] text-white" : "bg-[#F0EEEA] text-[#262425]"
              }`}
            >
              안전정보 보기
            </button>
          </div>
        )}

        {tab === "info" || !safetyInfo ? (
          <div className="flex flex-col gap-5">
            <div className="relative h-48 w-full overflow-hidden rounded-[16px]">
              <Image
                src={destination.image.url}
                alt={destination.image.alt}
                fill
                sizes="(min-width: 768px) 32rem, 100vw"
                className="object-cover"
              />
            </div>
            <p className="text-[16px] leading-[1.6] text-[#4B4749]">{destination.intro}</p>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold text-[#262425]">명소</h3>
              <ul className="list-inside list-disc text-[14px] text-[#4B4749]">
                {destination.attractions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold text-[#262425]">추천 시기</h3>
              <p className="text-[14px] text-[#4B4749]">{destination.bestSeason}</p>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold text-[#262425]">1일 일정</h3>
              <ol className="list-inside list-decimal text-[14px] text-[#4B4749]">
                {destination.oneDayItinerary.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold text-[#262425]">3일 일정</h3>
              <ol className="list-inside list-decimal text-[14px] text-[#4B4749]">
                {destination.threeDayItinerary.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold text-[#262425]">예산(1인 1일)</h3>
              <p className="text-[14px] text-[#4B4749]">
                실속형 {destination.budget.budgetPerDay} · 중간 {destination.budget.midRangePerDay}{" "}
                · 여유 {destination.budget.luxuryPerDay}
              </p>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold text-[#262425]">교통</h3>
              <p className="text-[14px] text-[#4B4749]">{destination.transport}</p>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold text-[#262425]">음식</h3>
              <ul className="list-inside list-disc text-[14px] text-[#4B4749]">
                {destination.food.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold text-[#262425]">여행 에티켓</h3>
              <ul className="list-inside list-disc text-[14px] text-[#4B4749]">
                {destination.etiquette.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold text-[#262425]">출처</h3>
              <ul className="text-[13px] text-[#78737A]">
                {destination.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-[13px] text-[#78737A]">
                최종 수정일: {destination.updatedAt}
              </p>
            </section>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-[16px] bg-[#EAF3FA] p-4 text-[14px] text-[#1D5C8A]">
              출처: {safetyInfo.source.name} · 확인일 {safetyInfo.source.confirmedAt}
            </div>
            {SAFETY_CATEGORY_LABELS.map(({ key, label }) => (
              <section key={key}>
                <h3 className="mb-1 text-[15px] font-semibold text-[#262425]">{label}</h3>
                <p className="text-[14px] leading-[1.6] text-[#4B4749]">
                  {String(safetyInfo[key])}
                </p>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
