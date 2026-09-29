"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LoadStatus = "loading" | "ready" | "error";

/**
 * 성인 확인 완료 여부와 확인 시각만 저장·표시한다(REQ-FUNC-028) — 정확한 생년월일은 어떤
 * 테이블·응답에도 저장하지 않는다. 실제 신분 확인 서비스 연동은 이 프로젝트 범위 밖이라
 * (PROJECT_SCOPE.md에 별도 연동 Task 없음) 본인 확인 체크박스에 의한 자기 선언 방식을 쓴다.
 */
export default function AdultVerificationCard() {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdult, setIsAdult] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setStatus("error");
        return;
      }
      if (!cancelled) setUserId(user.id);

      const { data, error } = await supabase
        .from("user_profile")
        .select("is_adult, adult_verified_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        setStatus("error");
        return;
      }
      setIsAdult(data.is_adult);
      setVerifiedAt(data.adult_verified_at);
      setStatus("ready");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleVerify = async () => {
    if (!userId || !agreed) return;
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("user_profile")
        .update({ is_adult: true, adult_verified_at: now })
        .eq("user_id", userId);
      if (!error) {
        setIsAdult(true);
        setVerifiedAt(now);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div
        role="status"
        aria-label="성인 확인 상태 불러오는 중"
        className="h-24 animate-pulse rounded-[16px] bg-[#F0EEEA]"
      />
    );
  }

  if (status === "error") {
    return (
      <p className="rounded-[10px] bg-[#FDECEA] px-4 py-3 text-[14px] text-[#B3261E]">
        성인 확인 상태를 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-[#E4E0DC] bg-white p-6">
      <h2 className="text-[17px] font-semibold text-[#262425]">성인 확인</h2>
      {isAdult ? (
        <p className="rounded-[10px] bg-[#E9F7EF] px-3 py-2 text-[14px] text-[#1E7C4C]">
          성인 확인 완료 · {verifiedAt ? new Date(verifiedAt).toLocaleDateString("ko-KR") : ""}
        </p>
      ) : (
        <>
          <p className="text-[14px] text-[#78737A]">
            동행 모집글 작성은 성인 확인 후 이용할 수 있습니다. 정확한 생년월일은 저장하지 않습니다.
          </p>
          <label className="flex items-start gap-2 text-[14px] text-[#262425]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-5 w-5"
            />
            <span>만 19세 이상임을 확인합니다.</span>
          </label>
          <button
            type="button"
            onClick={handleVerify}
            disabled={!agreed || isSubmitting}
            className="flex min-h-[44px] w-fit items-center justify-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] disabled:cursor-not-allowed disabled:bg-[#FFE3D8]"
          >
            {isSubmitting ? "확인 중..." : "성인 확인하기"}
          </button>
        </>
      )}
    </div>
  );
}
