"use client";

import { useState } from "react";
import { COUNTRY_SAFETY_INFO, type CountrySafetyInfo } from "@/data/safety";
import SafetyDrawer from "./SafetyDrawer";

const STALE_THRESHOLD_DAYS = 7;
const DISPLAY_COUNT = 6;

function isStale(confirmedAt: string): boolean {
  const confirmed = new Date(`${confirmedAt}T00:00:00`);
  const now = new Date();
  const diffDays = (now.getTime() - confirmed.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > STALE_THRESHOLD_DAYS;
}

function SafetyCard({ info, onOpen }: { info: CountrySafetyInfo; onOpen: () => void }) {
  const stale = isStale(info.source.confirmedAt);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col gap-2 rounded-[16px] border border-[#E4E0DC] bg-white p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-[999px] bg-[#FFF3E1] px-2 py-1 text-[13px] font-semibold text-[#9A5B12]">
          {info.advisoryLevel}
        </span>
        {stale && (
          <span className="rounded-[999px] bg-[#FFF3E1] px-2 py-1 text-[13px] font-semibold text-[#9A5B12]">
            최신 정보 재확인 필요
          </span>
        )}
      </div>
      <p className="text-[17px] font-semibold text-[#262425]">{info.countryName}</p>
      <p className="text-[13px] text-[#78737A]">{info.scopeText}</p>
      <p className="text-[13px] text-[#78737A]">확인일 {info.source.confirmedAt}</p>
    </button>
  );
}

export default function CountrySafetyCardGrid() {
  const [openId, setOpenId] = useState<string | null>(null);
  const cards = COUNTRY_SAFETY_INFO.slice(0, DISPLAY_COUNT);
  const openInfo = COUNTRY_SAFETY_INFO.find((c) => c.id === openId) ?? null;

  return (
    <div>
      <h2 className="mb-2 text-[26px] font-bold text-[#262425]">국가별 주의사항</h2>
      <p className="mb-4 text-[14px] text-[#78737A]">
        이 정보는 참고용이며 공식 판단을 대체하지 않습니다. 여행 전 외교부 해외안전여행에서 최신
        정보를 다시 확인하세요.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {cards.map((info) => (
          <SafetyCard key={info.id} info={info} onOpen={() => setOpenId(info.id)} />
        ))}
      </div>

      {openInfo && <SafetyDrawer info={openInfo} onClose={() => setOpenId(null)} />}
    </div>
  );
}
