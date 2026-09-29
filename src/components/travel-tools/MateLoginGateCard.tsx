"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type GateStatus = "loading" | "guest" | "not_adult_verified" | "ready";

interface MateLoginGateCardProps {
  /** 로그인 + 성인 확인이 모두 끝난 경우에만 렌더링되는 실제 작성 Form(예: 동행 모집글 작성). */
  children: ReactNode;
}

/**
 * 동행 탭 진입 게이트. 정확한 생년월일은 조회·저장하지 않고 `user_profile.is_adult`
 * (성인 확인 여부)와 `adult_verified_at`(확인 시각) 컬럼만 사용한다. 실제 작성 API의
 * 성인 확인 재검증은 서버 측(API-MATES-CRUD)에서 이미 수행하며, 이 Component는 UI 게이트일 뿐이다.
 */
export default function MateLoginGateCard({ children }: MateLoginGateCardProps) {
  const [status, setStatus] = useState<GateStatus>("loading");

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function loadGateStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) setStatus("guest");
        return;
      }

      const { data: profile } = await supabase
        .from("user_profile")
        .select("is_adult")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;
      setStatus(profile?.is_adult ? "ready" : "not_adult_verified");
    }

    loadGateStatus().catch(() => {
      if (!cancelled) setStatus("guest");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "ready") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div
        role="status"
        aria-label="동행 탭 정보 확인 중"
        className="h-40 animate-pulse rounded-[16px] bg-[#F0EEEA]"
      />
    );
  }

  const isNotAdultVerified = status === "not_adult_verified";

  return (
    <div className="flex flex-col items-center gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-8 text-center">
      <p className="text-[17px] font-semibold text-[#262425]">
        {isNotAdultVerified
          ? "동행 모집은 성인 확인 후 이용할 수 있습니다"
          : "동행 모집은 로그인 후 이용할 수 있습니다"}
      </p>
      <p className="text-[14px] leading-[1.5] text-[#78737A]">
        {isNotAdultVerified
          ? "계정 페이지에서 성인 확인을 완료하면 동행 모집글을 작성할 수 있습니다."
          : "로그인 또는 회원가입 후 동행 모집글을 작성할 수 있습니다."}
      </p>
      <Link
        href="/account"
        className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
      >
        {isNotAdultVerified ? "성인 확인하러 가기" : "로그인/가입하기"}
      </Link>
    </div>
  );
}
