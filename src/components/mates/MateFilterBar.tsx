import { DESTINATIONS } from "@/data/destinations";

export type MateAgeBand = "10s" | "20s" | "30s" | "40s" | "50s_plus";
export type MateGender = "male" | "female" | "other" | "unspecified";
export type MateRecruitStatus = "OPEN" | "CLOSED";

export const TRAVEL_STYLE_OPTIONS = [
  "자연·힐링",
  "도심 미식",
  "가족 여행",
  "액티비티·모험",
  "문화·역사 탐방",
  "나 홀로 여행",
];

const AGE_BAND_LABELS: Record<MateAgeBand, string> = {
  "10s": "10대",
  "20s": "20대",
  "30s": "30대",
  "40s": "40대",
  "50s_plus": "50대 이상",
};

const GENDER_LABELS: Record<MateGender, string> = {
  male: "남성",
  female: "여성",
  other: "기타",
  unspecified: "미공개",
};

export interface MateFilters {
  country: string;
  region: string;
  startDateFrom: string;
  endDateTo: string;
  ageBand: MateAgeBand | "";
  gender: MateGender | "";
  travelStyles: string[];
  status: MateRecruitStatus | "";
}

export const EMPTY_MATE_FILTERS: MateFilters = {
  country: "",
  region: "",
  startDateFrom: "",
  endDateTo: "",
  ageBand: "",
  gender: "",
  travelStyles: [],
  status: "",
};

interface MateFilterBarProps {
  filters: MateFilters;
  onChange: (filters: MateFilters) => void;
  resultCount: number;
}

/**
 * 국가·지역·기간·연령대(작성자 프로필 기준)·성별(작성자 프로필 기준)·여행 스타일·모집 상태를
 * AND 조건으로 조합하는 순수 필터 입력 UI다. 실제 조회(차단 사용자 글 제외 포함)는 이 값을
 * 전달받는 목록 Component/Page Owner가 수행한다 — 연령대·성별은 MATE_POST가 아닌
 * USER_PROFILE(작성자) 컬럼이라 목록 조회 쪽에서 owner_id로 조인해 필터한다.
 */
export default function MateFilterBar({ filters, onChange, resultCount }: MateFilterBarProps) {
  const countries = [...new Set(DESTINATIONS.map((d) => d.country))].sort();
  const regionOptions = DESTINATIONS.filter((d) => d.country === filters.country).map(
    (d) => d.name,
  );

  const update = (patch: Partial<MateFilters>) => onChange({ ...filters, ...patch });

  const toggleTravelStyle = (style: string) => {
    update({
      travelStyles: filters.travelStyles.includes(style)
        ? filters.travelStyles.filter((s) => s !== style)
        : [...filters.travelStyles, style],
    });
  };

  const hasActiveFilter =
    filters.country ||
    filters.region ||
    filters.startDateFrom ||
    filters.endDateTo ||
    filters.ageBand ||
    filters.gender ||
    filters.travelStyles.length > 0 ||
    filters.status;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-filter-country" className="text-[13px] text-[#78737A]">
            국가
          </label>
          <select
            id="mate-filter-country"
            value={filters.country}
            onChange={(e) => update({ country: e.target.value, region: "" })}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          >
            <option value="">전체</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-filter-region" className="text-[13px] text-[#78737A]">
            지역
          </label>
          <select
            id="mate-filter-region"
            value={filters.region}
            onChange={(e) => update({ region: e.target.value })}
            disabled={!filters.country}
            className={`min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425] ${
              !filters.country ? "bg-[#F0EEEA] text-[#78737A]" : ""
            }`}
          >
            <option value="">{filters.country ? "전체" : "국가를 먼저 선택하세요"}</option>
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-filter-start" className="text-[13px] text-[#78737A]">
            시작일 이후
          </label>
          <input
            id="mate-filter-start"
            type="date"
            value={filters.startDateFrom}
            onChange={(e) => update({ startDateFrom: e.target.value })}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-filter-end" className="text-[13px] text-[#78737A]">
            종료일 이전
          </label>
          <input
            id="mate-filter-end"
            type="date"
            value={filters.endDateTo}
            onChange={(e) => update({ endDateTo: e.target.value })}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-filter-age" className="text-[13px] text-[#78737A]">
            연령대
          </label>
          <select
            id="mate-filter-age"
            value={filters.ageBand}
            onChange={(e) => update({ ageBand: e.target.value as MateAgeBand | "" })}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          >
            <option value="">전체</option>
            {(Object.keys(AGE_BAND_LABELS) as MateAgeBand[]).map((band) => (
              <option key={band} value={band}>
                {AGE_BAND_LABELS[band]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-filter-gender" className="text-[13px] text-[#78737A]">
            성별
          </label>
          <select
            id="mate-filter-gender"
            value={filters.gender}
            onChange={(e) => update({ gender: e.target.value as MateGender | "" })}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          >
            <option value="">전체</option>
            {(Object.keys(GENDER_LABELS) as MateGender[]).map((g) => (
              <option key={g} value={g}>
                {GENDER_LABELS[g]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="mate-filter-status" className="text-[13px] text-[#78737A]">
            모집 상태
          </label>
          <select
            id="mate-filter-status"
            value={filters.status}
            onChange={(e) => update({ status: e.target.value as MateRecruitStatus | "" })}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          >
            <option value="">전체</option>
            <option value="OPEN">모집중</option>
            <option value="CLOSED">모집완료</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] text-[#78737A]">여행 스타일</p>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_STYLE_OPTIONS.map((style) => {
            const isSelected = filters.travelStyles.includes(style);
            return (
              <button
                key={style}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleTravelStyle(style)}
                className={`flex min-h-[44px] items-center rounded-full px-4 text-[14px] font-medium ${
                  isSelected ? "bg-[#FF6A4D] text-white" : "bg-[#F0EEEA] text-[#262425]"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-[14px] text-[#78737A]">조건에 맞는 동행글 {resultCount}건</p>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_MATE_FILTERS)}
            className="min-h-[44px] rounded-[10px] px-4 text-[14px] font-semibold text-[#FF6A4D] hover:bg-[#FFE3D8]"
          >
            필터 초기화
          </button>
        )}
      </div>
    </div>
  );
}
