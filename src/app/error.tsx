"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 서버 콘솔에서 원인을 추적할 수 있도록만 기록한다(외부 로그 서비스 연동 없음).
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1280px] flex-col items-center justify-center gap-4 px-5 py-16 text-center">
      <p className="text-[13px] font-medium text-[#78737A]">500</p>
      <h1 className="text-[26px] font-bold leading-[1.3] text-[#262425]">
        일시적인 오류가 발생했습니다
      </h1>
      <p className="max-w-md text-[16px] leading-[1.6] text-[#4B4749]">
        페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도하거나 메인 페이지로 돌아가
        주세요.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="flex min-h-[44px] items-center rounded-[10px] px-6 text-[16px] font-semibold text-[#262425] hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
