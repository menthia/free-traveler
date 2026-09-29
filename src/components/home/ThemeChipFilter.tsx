import type { TravelTheme } from "@/data/destinations.schema";

export type TravelMotive =
  "자연·힐링" | "도심 미식" | "가족 여행" | "액티비티·모험" | "문화·역사 탐방" | "나 홀로 여행";

export const TRAVEL_MOTIVES: TravelMotive[] = [
  "자연·힐링",
  "도심 미식",
  "가족 여행",
  "액티비티·모험",
  "문화·역사 탐방",
  "나 홀로 여행",
];

/**
 * 여행 동기(Motive) Chip → 실제 여행지 테마(TravelTheme) 매핑.
 * src/data/destinations.ts의 themes는 여행지 성격(자연/도심/휴양/역사/미식/액티비티/문화예술) 축이고,
 * 이 6개 Chip은 여행객의 동기(가족/나홀로 등) 축이라 1:1로 대응하지 않는다 — 두 축을 연결하는
 * 근사 매핑을 여기서 정의한다(PROJECT_SCOPE.md §3 승인된 단순화).
 */
export const TRAVEL_MOTIVE_THEME_MAP: Record<TravelMotive, TravelTheme[]> = {
  "자연·힐링": ["자연", "휴양"],
  "도심 미식": ["도심", "미식"],
  "가족 여행": ["휴양", "문화예술"],
  "액티비티·모험": ["액티비티"],
  "문화·역사 탐방": ["역사", "문화예술"],
  "나 홀로 여행": ["도심", "자연"],
};

interface ThemeChipFilterProps {
  selected: TravelMotive | null;
  onChange: (motive: TravelMotive | null) => void;
}

export default function ThemeChipFilter({ selected, onChange }: ThemeChipFilterProps) {
  return (
    <div role="group" aria-label="여행 동기·테마 필터" className="flex flex-wrap gap-2">
      {TRAVEL_MOTIVES.map((motive) => {
        const isActive = selected === motive;
        return (
          <button
            key={motive}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? null : motive)}
            className={`flex min-h-[44px] items-center rounded-[999px] px-4 text-[14px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D] ${
              isActive ? "bg-[#FF6A4D] text-white" : "bg-[#F0EEEA] text-[#262425]"
            }`}
          >
            {motive}
          </button>
        );
      })}
    </div>
  );
}
