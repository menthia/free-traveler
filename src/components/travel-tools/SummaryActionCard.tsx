"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type OutboundKey = "flight" | "hotel";
type UrlStatus = "loading" | "ready" | "unavailable";

interface SummaryActionCardProps {
  title: string;
  summaryLines: { label: string; value: string }[];
  outboundKey: OutboundKey;
  ctaLabel: string;
  /** 항공 요약 단계에만 표시하는 안전정보 고지(REQ-FUNC-054). 숙소 탭은 전달하지 않는다. */
  showSafetyNotice?: boolean;
  /** 외부 이동 링크의 data-testid(예: "flight-outbound-link"). */
  testId: string;
}

/**
 * 항공/숙소 탭 공용 '입력 요약 + 외부 이동' Card. 요약값은 화면 표시용으로만 쓰이며 어떤
 * 네트워크 요청에도 포함하지 않는다(REQ-FUNC-017/REQ-NF-017) — 이 Component가 유일하게
 * 만드는 네트워크 요청은 `outbound_link_setting`에서 관리자가 설정한 URL을 읽는 것뿐이다.
 */
export default function SummaryActionCard({
  title,
  summaryLines,
  outboundKey,
  ctaLabel,
  showSafetyNotice = false,
  testId,
}: SummaryActionCardProps) {
  const [status, setStatus] = useState<UrlStatus>("loading");
  const [url, setUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function loadOutboundUrl() {
      try {
        const { data } = await supabase
          .from("outbound_link_setting")
          .select("url")
          .eq("setting_key", outboundKey)
          .maybeSingle();

        if (cancelled) return;
        const candidate = data?.url ?? null;
        if (candidate && candidate.startsWith("https://")) {
          setUrl(candidate);
          setStatus("ready");
        } else {
          setUrl(null);
          setStatus("unavailable");
        }
      } catch {
        if (!cancelled) {
          setUrl(null);
          setStatus("unavailable");
        }
      }
    }

    loadOutboundUrl();

    return () => {
      cancelled = true;
    };
  }, [outboundKey, retryCount]);

  return (
    <div className="flex flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6">
      <h3 className="text-[17px] font-semibold text-[#262425]">{title}</h3>
      <dl className="flex flex-col gap-2">
        {summaryLines.map((line) => (
          <div key={line.label} className="flex justify-between gap-4 text-[14px]">
            <dt className="text-[#78737A]">{line.label}</dt>
            <dd className="font-medium text-[#262425]">{line.value}</dd>
          </div>
        ))}
      </dl>
      <p className="rounded-[10px] bg-[#EAF3FA] px-3 py-2 text-[13px] text-[#1D5C8A]">
        입력값은 외부 사이트로 전달되지 않습니다. 실제 예약은 이동한 외부 사이트에서 진행됩니다.
      </p>

      {showSafetyNotice && (
        <p className="rounded-[10px] bg-[#EAF3FA] px-3 py-2 text-[13px] text-[#1D5C8A]">
          국가별 안전정보는 공식 판단을 대체하지 않습니다. 출국 전 외교부 해외안전여행에서 최신
          원문을 다시 확인하세요.
        </p>
      )}

      {status === "ready" && url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={testId}
          className="flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
        >
          {ctaLabel}
        </a>
      )}

      {status === "unavailable" && (
        <div className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
          <p>현재 이동 가능한 외부 사이트 주소가 설정되어 있지 않습니다.</p>
          <button
            type="button"
            onClick={() => {
              setStatus("loading");
              setRetryCount((n) => n + 1);
            }}
            className="mt-2 font-semibold underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {status === "loading" && (
        <div
          role="status"
          aria-label="외부 이동 주소 확인 중"
          className="h-11 animate-pulse rounded-[10px] bg-[#F0EEEA]"
        />
      )}
    </div>
  );
}
