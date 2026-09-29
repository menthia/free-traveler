"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/lib/toast-context";

type ReportTargetType = "MATE_POST" | "MATE_APPLICATION" | "USER_PROFILE";

const REASON_CODES: { code: string; label: string }[] = [
  { code: "SPAM", label: "스팸/광고" },
  { code: "HARASSMENT", label: "부적절한 언행" },
  { code: "SCAM", label: "사기 의심(금전 요구 등)" },
  { code: "FAKE_INFO", label: "허위 정보" },
  { code: "OTHER", label: "기타" },
];

interface ReportBlockActionsProps {
  targetType: ReportTargetType;
  targetId: string;
  /** 신고/차단 대상 상대방(작성자)의 user_id — 차단 API는 사용자 단위로 동작한다. */
  blockedUserId: string;
}

type ReportPanelState = "closed" | "open" | "submitted";

/**
 * 신고 접수와 차단/차단 해제 액션. 신고·피신고 상세는 Moderator/Admin만 RLS로 열람 가능하며,
 * 이 Component는 접수 ID만 화면에 표시한다(상세 큐 열람 UI는 SCR-005 관리자 영역 별도 Task).
 */
export default function ReportBlockActions({
  targetType,
  targetId,
  blockedUserId,
}: ReportBlockActionsProps) {
  const { showToast } = useToast();
  const [reportPanel, setReportPanel] = useState<ReportPanelState>("closed");
  const [reasonCode, setReasonCode] = useState(REASON_CODES[0].code);
  const [description, setDescription] = useState("");
  const [reportId, setReportId] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlockLoading, setIsBlockLoading] = useState(true);
  const [isTogglingBlock, setIsTogglingBlock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blocks")
      .then((res) => (res.ok ? res.json() : { blocks: [] }))
      .then((body) => {
        if (cancelled) return;
        const blocks = (body.blocks ?? []) as { blocked_id: string }[];
        setIsBlocked(blocks.some((b) => b.blocked_id === blockedUserId));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsBlockLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [blockedUserId]);

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    setReportError(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          reasonCode,
          description: description || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setReportError(
          body?.error === "LOGIN_REQUIRED"
            ? "신고는 로그인 후 이용할 수 있습니다."
            : "신고 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        );
        showToast("error", "신고 접수에 실패했습니다.");
        return;
      }
      const body = await res.json();
      setReportId(body.reportId);
      setReportPanel("submitted");
      showToast("success", "신고가 접수되었습니다.");
    } catch {
      setReportError("네트워크 오류로 신고를 접수하지 못했습니다.");
      showToast("error", "신고 접수에 실패했습니다.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleToggleBlock = async () => {
    setIsTogglingBlock(true);
    try {
      if (isBlocked) {
        const res = await fetch(`/api/blocks?blockedId=${encodeURIComponent(blockedUserId)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsBlocked(false);
          showToast("success", "차단을 해제했습니다.");
        } else {
          showToast("error", "차단 해제에 실패했습니다.");
        }
      } else {
        const res = await fetch("/api/blocks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blockedId: blockedUserId }),
        });
        if (res.ok) {
          setIsBlocked(true);
          showToast("success", "상대를 차단했습니다.");
        } else {
          showToast("error", "차단에 실패했습니다.");
        }
      }
    } catch {
      showToast("error", "요청 처리에 실패했습니다.");
    } finally {
      setIsTogglingBlock(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t border-[#E4E0DC] pt-4">
      <div className="flex flex-wrap gap-2">
        {reportPanel === "closed" && (
          <button
            type="button"
            onClick={() => setReportPanel("open")}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-4 text-[14px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
          >
            신고하기
          </button>
        )}
        <button
          type="button"
          onClick={handleToggleBlock}
          disabled={isBlockLoading || isTogglingBlock}
          className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-4 text-[14px] font-semibold text-[#262425] hover:bg-[#F7F6F4] disabled:opacity-50"
        >
          {isBlocked ? "차단 해제" : "차단하기"}
        </button>
      </div>

      {reportPanel === "open" && (
        <form onSubmit={handleSubmitReport} className="flex flex-col gap-3">
          <label htmlFor="report-reason" className="text-[13px] text-[#78737A]">
            신고 사유
          </label>
          <select
            id="report-reason"
            value={reasonCode}
            onChange={(e) => setReasonCode(e.target.value)}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          >
            {REASON_CODES.map((r) => (
              <option key={r.code} value={r.code}>
                {r.label}
              </option>
            ))}
          </select>
          <label htmlFor="report-description" className="text-[13px] text-[#78737A]">
            상세 설명(선택)
          </label>
          <textarea
            id="report-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-[10px] border border-[#E4E0DC] px-3 py-2 text-[15px] text-[#262425]"
          />
          {reportError && (
            <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
              {reportError}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmittingReport}
              className="min-h-[44px] flex-1 rounded-[10px] bg-[#FF6A4D] text-[14px] font-semibold text-white hover:bg-[#E14E32] disabled:opacity-50"
            >
              {isSubmittingReport ? "접수 중..." : "신고 접수하기"}
            </button>
            <button
              type="button"
              onClick={() => setReportPanel("closed")}
              className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-4 text-[14px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {reportPanel === "submitted" && reportId && (
        <p className="rounded-[10px] bg-[#E9F7EF] px-3 py-2 text-[13px] text-[#1E7C4C]">
          신고가 접수되었습니다. 접수 번호: {reportId}
        </p>
      )}
    </div>
  );
}
