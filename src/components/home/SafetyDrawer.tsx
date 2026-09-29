"use client";

import { useEffect } from "react";
import type { CountrySafetyInfo } from "@/data/safety";

interface SafetyDrawerProps {
  info: CountrySafetyInfo;
  onClose: () => void;
}

const CATEGORY_LABELS: { key: keyof CountrySafetyInfo; label: string }[] = [
  { key: "security", label: "치안" },
  { key: "scam", label: "사기" },
  { key: "law", label: "법규" },
  { key: "transport", label: "교통" },
  { key: "disaster", label: "재난" },
  { key: "health", label: "보건" },
  { key: "culture", label: "문화" },
  { key: "emergencyContacts", label: "긴급연락처" },
];

export default function SafetyDrawer({ info, onClose }: SafetyDrawerProps) {
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
        aria-label={`${info.countryName} 안전정보`}
        className="h-full w-full max-w-lg overflow-y-auto bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-[#78737A]">{info.scopeText}</p>
            <h2 className="text-[20px] font-bold text-[#262425]">{info.countryName} 안전정보</h2>
          </div>
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

        <div
          role="status"
          className="mb-4 inline-flex items-center gap-2 rounded-[999px] bg-[#FFF3E1] px-3 py-1 text-[13px] font-semibold text-[#9A5B12]"
        >
          여행경보: {info.advisoryLevel}
        </div>

        <div className="mb-6 rounded-[16px] bg-[#EAF3FA] p-4 text-[14px] leading-[1.6] text-[#1D5C8A]">
          이 정보는 참고용이며 공식 판단을 대체하지 않습니다. 실제 여행 전 외교부 해외안전여행에서
          최신 정보를 다시 확인하세요.
        </div>

        <div className="flex flex-col gap-4">
          {CATEGORY_LABELS.map(({ key, label }) => (
            <section key={key}>
              <h3 className="mb-1 text-[15px] font-semibold text-[#262425]">{label}</h3>
              <p className="text-[14px] leading-[1.6] text-[#4B4749]">{String(info[key])}</p>
            </section>
          ))}
        </div>

        <div className="mt-6 border-t border-[#E4E0DC] pt-4 text-[13px] text-[#78737A]">
          <p>
            출처:{" "}
            <a
              href={info.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {info.source.name}
            </a>
          </p>
          <p>확인일: {info.source.confirmedAt}</p>
          <p>편집자: {info.source.editor}</p>
        </div>
      </div>
    </div>
  );
}
