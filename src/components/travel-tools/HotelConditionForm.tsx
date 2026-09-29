"use client";

import { useMemo, useState } from "react";
import { DESTINATIONS } from "@/data/destinations";
import { validateDateRange, type DateRangeErrorCode } from "@/lib/date-validation";
import SummaryActionCard from "./SummaryActionCard";

const DATE_ERROR_MESSAGES: Record<DateRangeErrorCode, string> = {
  INVALID_FORMAT: "날짜를 올바르게 입력해 주세요.",
  PAST_DATE: "과거 날짜는 선택할 수 없습니다.",
  REVERSED_RANGE: "체크아웃일은 체크인일보다 늦어야 합니다.",
  SAME_DAY_NOT_ALLOWED: "체크아웃일은 체크인일과 같을 수 없습니다.",
};

/**
 * 숙소 조건 입력 Form. 국가·지역·체크인·체크아웃 입력값은 이 Component의 로컬 state로만
 * 유지하며, 어떤 서버 API·DB·URL 쿼리·로그·분석 이벤트로도 전송하지 않는다
 * (REQ-FUNC-026, REQ-NF-017). 4개 필드가 모두 유효해지는 즉시 요약 Card를 표시한다
 * (별도 제출 버튼 없음).
 */
export default function HotelConditionForm() {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const countries = useMemo(() => [...new Set(DESTINATIONS.map((d) => d.country))].sort(), []);
  const regionOptions = useMemo(
    () => DESTINATIONS.filter((d) => d.country === country).map((d) => d.name),
    [country],
  );

  const dateValidation = validateDateRange(checkIn, checkOut, { allowSameDay: false });
  const canValidateDates = checkIn.length > 0 && checkOut.length > 0;
  const dateErrors = canValidateDates ? dateValidation.errors : [];

  const isValid =
    country.length > 0 && region.length > 0 && canValidateDates && dateValidation.valid;

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setRegion("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="hotel-country" className="text-[13px] text-[#78737A]">
              국가
            </label>
            <select
              id="hotel-country"
              value={country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
            >
              <option value="">선택해 주세요</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="hotel-region" className="text-[13px] text-[#78737A]">
              지역
            </label>
            <select
              id="hotel-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={!country}
              className={`min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425] ${
                !country ? "bg-[#F0EEEA] text-[#78737A]" : ""
              }`}
            >
              <option value="">{country ? "선택해 주세요" : "국가를 먼저 선택하세요"}</option>
              {regionOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="hotel-checkin" className="text-[13px] text-[#78737A]">
              체크인
            </label>
            <input
              id="hotel-checkin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="hotel-checkout" className="text-[13px] text-[#78737A]">
              체크아웃
            </label>
            <input
              id="hotel-checkout"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              aria-describedby={dateErrors.length > 0 ? "hotel-date-error" : undefined}
              className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
            />
          </div>
        </div>

        {dateErrors.length > 0 && (
          <p
            id="hotel-date-error"
            className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]"
          >
            {dateErrors.map((code) => DATE_ERROR_MESSAGES[code]).join(" ")}
          </p>
        )}

        <p className="text-[13px] text-[#78737A]">입력값은 외부 사이트로 전달되지 않습니다.</p>
      </div>

      {isValid && (
        <SummaryActionCard
          title="숙소 조건 요약"
          summaryLines={[
            { label: "국가", value: country },
            { label: "지역", value: region },
            { label: "체크인", value: checkIn },
            { label: "체크아웃", value: checkOut },
          ]}
          outboundKey="hotel"
          ctaLabel="숙소 보러 가기"
          testId="hotel-outbound-link"
        />
      )}
    </div>
  );
}
