"use client";

import { useEffect, useState } from "react";
import { POLICIES } from "@/data/policies";

const MATE_SAFETY_CONSENT_STORAGE_KEY = "ft_mate_safety_consent";

interface StoredConsent {
  policyVersion: string;
  consentedAt: string;
}

/**
 * 동행 안전수칙 동의 여부·동의 시각을 표시한다(REQ-FUNC-080). 동의 기록은 별도 DB 컬럼이
 * 없어(MateComposeForm 구현 당시 승인된 단순화) localStorage에 저장된 값을 그대로 읽는다 —
 * 브라우저를 바꾸면 동의 기록도 초기화된다는 한계가 있다.
 */
export default function PolicyConsentStatus() {
  const [consent, setConsent] = useState<StoredConsent | null>(null);
  const safetyPolicy = POLICIES.find((p) => p.id === "mate-safety")!;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MATE_SAFETY_CONSENT_STORAGE_KEY);
      // localStorage(외부 저장소)와의 최초 동기화이며, 하이드레이션 이후 1회만 실행된다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setConsent(JSON.parse(raw));
    } catch {
      // localStorage 접근 불가 시 미동의 상태로 표시한다.
    }
  }, []);

  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-[#E4E0DC] bg-white p-6">
      <h2 className="text-[17px] font-semibold text-[#262425]">정책 동의 현황</h2>
      {consent ? (
        <p className="rounded-[10px] bg-[#E9F7EF] px-3 py-2 text-[14px] text-[#1E7C4C]">
          동행 안전수칙({consent.policyVersion}) 동의 완료 ·{" "}
          {new Date(consent.consentedAt).toLocaleDateString("ko-KR")}
        </p>
      ) : (
        <p className="rounded-[10px] bg-[#F7F6F4] px-3 py-2 text-[14px] text-[#78737A]">
          아직 동행 안전수칙({safetyPolicy.version})에 동의하지 않았습니다. 동행 모집글을 작성하면
          자동으로 기록됩니다.
        </p>
      )}
    </div>
  );
}
