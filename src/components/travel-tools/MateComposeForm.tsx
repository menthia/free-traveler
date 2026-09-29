"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DESTINATIONS } from "@/data/destinations";
import { validateDateRange } from "@/lib/date-validation";
import { containsContactPattern } from "@/lib/contact-detection";
import { POLICIES } from "@/data/policies";
import { useToast } from "@/lib/toast-context";

const TRAVEL_STYLE_OPTIONS = [
  "자연·힐링",
  "도심 미식",
  "가족 여행",
  "액티비티·모험",
  "문화·역사 탐방",
  "나 홀로 여행",
];

const MATE_SAFETY_CONSENT_STORAGE_KEY = "ft_mate_safety_consent";

/**
 * 동행 모집글 작성 Form(IMPLEMENT(변형) — TASK 승인 범위). 정책 동의는 별도 DB 컬럼이 없어
 * (USER_PROFILE/MATE_POST 스키마에 동의 필드가 존재하지 않음, DEC-006 6개 테이블 범위 고정)
 * 정책 버전과 동의 시각을 localStorage에 기록하는 방식으로 단순화했다.
 */
export default function MateComposeForm() {
  const { showToast } = useToast();
  const safetyPolicy = POLICIES.find((p) => p.id === "mate-safety")!;

  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState("2");
  const [preferences, setPreferences] = useState("");
  const [travelStyles, setTravelStyles] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [agreedSafety, setAgreedSafety] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishedPostId, setPublishedPostId] = useState<string | null>(null);

  const countries = useMemo(() => [...new Set(DESTINATIONS.map((d) => d.country))].sort(), []);
  const regionOptions = useMemo(
    () => DESTINATIONS.filter((d) => d.country === country).map((d) => d.name),
    [country],
  );

  const dateValidation =
    startDate && endDate
      ? validateDateRange(startDate, endDate, { allowSameDay: true })
      : { valid: true, errors: [] };

  const combinedText = `${title}\n${description}`;
  const hasContactPattern = containsContactPattern(combinedText);

  const hasRequiredFields =
    title.trim().length > 0 &&
    country.length > 0 &&
    startDate.length > 0 &&
    endDate.length > 0 &&
    Number(capacity) >= 1;

  const canSubmit = hasRequiredFields && dateValidation.valid && !hasContactPattern && agreedSafety;

  const toggleTravelStyle = (style: string) => {
    setTravelStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setRegion("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/mates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryName: country,
          regionName: region || undefined,
          startDate,
          endDate,
          capacity: Number(capacity),
          preferences: preferences ? { note: preferences } : undefined,
          travelStyles,
          title,
          description: description || undefined,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (body?.error === "CONTACT_INFO_NOT_ALLOWED") {
          setSubmitError("본문에 연락처로 의심되는 내용이 있어 게시할 수 없습니다.");
        } else if (body?.error === "LOGIN_REQUIRED") {
          setSubmitError("로그인 상태를 확인할 수 없습니다. 다시 로그인해 주세요.");
        } else {
          setSubmitError("게시에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
        showToast("error", "동행 모집글 게시에 실패했습니다.");
        return;
      }

      const { post } = await response.json();

      try {
        window.localStorage.setItem(
          MATE_SAFETY_CONSENT_STORAGE_KEY,
          JSON.stringify({
            policyVersion: safetyPolicy.version,
            consentedAt: new Date().toISOString(),
          }),
        );
      } catch {
        // localStorage 접근 불가 시에도 게시 자체는 이미 성공했으므로 무시한다.
      }

      setPublishedPostId(post.post_id);
      showToast("success", "동행 모집글이 게시되었습니다.");
    } catch {
      setSubmitError("네트워크 오류로 게시하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      showToast("error", "동행 모집글 게시에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (publishedPostId) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-8 text-center">
        <p className="text-[17px] font-semibold text-[#262425]">동행 모집글이 게시되었습니다.</p>
        <Link
          href="/mates"
          className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
        >
          동행 목록에서 보기
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6"
    >
      <label className="flex flex-col gap-1 text-[13px] text-[#78737A]">
        제목
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-[13px] text-[#78737A]">
          국가
          <select
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
        </label>
        <label className="flex flex-col gap-1 text-[13px] text-[#78737A]">
          지역(선택)
          <select
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
        </label>
        <label className="flex flex-col gap-1 text-[13px] text-[#78737A]">
          시작일
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[13px] text-[#78737A]">
          종료일
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-describedby={dateValidation.errors.length > 0 ? "mate-date-error" : undefined}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[13px] text-[#78737A]">
          모집 인원
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[13px] text-[#78737A]">
          선호 조건(선택)
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="예: 20대, 사진 촬영 좋아하는 분"
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          />
        </label>
      </div>

      {dateValidation.errors.length > 0 && (
        <p
          id="mate-date-error"
          className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]"
        >
          시작일과 종료일을 다시 확인해 주세요.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-[13px] text-[#78737A]">여행 스타일(선택, 복수 선택 가능)</p>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_STYLE_OPTIONS.map((style) => {
            const isSelected = travelStyles.includes(style);
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

      <label className="flex flex-col gap-1 text-[13px] text-[#78737A]">
        상세 설명(선택)
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="rounded-[10px] border border-[#E4E0DC] px-3 py-2 text-[15px] text-[#262425]"
        />
      </label>

      {hasContactPattern && (
        <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
          제목이나 상세 설명에 전화번호·이메일·메신저 ID로 의심되는 내용이 있습니다. 내용을 수정해
          주세요.
        </p>
      )}

      <label className="flex items-start gap-2 text-[14px] text-[#262425]">
        <input
          type="checkbox"
          checked={agreedSafety}
          onChange={(e) => setAgreedSafety(e.target.checked)}
          className="mt-1 h-5 w-5"
        />
        <span>
          <Link href="/account" className="font-semibold text-[#FF6A4D] underline">
            동행 안전수칙({safetyPolicy.version})
          </Link>
          을 확인했으며 이에 동의합니다.
        </span>
      </label>

      {submitError && (
        <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className={`flex min-h-[44px] items-center justify-center rounded-[10px] px-6 text-[16px] font-semibold text-white ${
          canSubmit && !isSubmitting
            ? "bg-[#FF6A4D] hover:bg-[#E14E32]"
            : "cursor-not-allowed bg-[#FFE3D8]"
        }`}
      >
        {isSubmitting ? "게시 중..." : "동행 모집글 게시하기"}
      </button>
    </form>
  );
}
