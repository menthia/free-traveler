"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/toast-context";

type ReportStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "DISMISSED";
type ReportTargetType = "MATE_POST" | "MATE_APPLICATION" | "USER_PROFILE";
type StatusFilter = "ALL" | "OPEN" | "RESOLVED" | "DISMISSED";

interface ReportItem {
  report_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason_code: string;
  description: string | null;
  status: ReportStatus;
  created_at: string;
}

const TARGET_TYPE_LABELS: Record<ReportTargetType, string> = {
  MATE_POST: "동행글",
  MATE_APPLICATION: "참가 요청",
  USER_PROFILE: "사용자",
};

const STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: "접수",
  IN_REVIEW: "검토중",
  RESOLVED: "처리 완료",
  DISMISSED: "기각",
};

type RoleCheckStatus = "loading" | "allowed" | "denied";

/**
 * 관리자 신고 큐(IMPLEMENT(변형) — Task 승인 범위). 경고 메시지 발송·계정 정지 등 고급
 * 기능은 범위 밖이며, 게시물 숨기기/처리 완료/기각 3개 액션만 제공한다. Moderator/Admin이
 * 아니면 이 Component 자체를 렌더링하지 않는다(role 확인은 UI 게이트일 뿐, 실제 접근 제어는
 * API-ADMIN-REPORTS가 서버에서 재검증한다).
 */
export default function AdminReportQueue() {
  const { showToast } = useToast();
  const [roleStatus, setRoleStatus] = useState<RoleCheckStatus>("loading");
  const [filter, setFilter] = useState<StatusFilter>("OPEN");
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        if (!cancelled) setRoleStatus("denied");
        return;
      }
      const { data: profile } = await supabase
        .from("user_profile")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      setRoleStatus(
        profile?.role === "moderator" || profile?.role === "admin" ? "allowed" : "denied",
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadReports = async () => {
    setIsLoadingReports(true);
    const query = filter === "ALL" ? "" : `?status=${filter}`;
    const res = await fetch(`/api/admin/reports${query}`);
    if (res.ok) {
      const body = await res.json();
      setReports(body.reports ?? []);
    }
    setIsLoadingReports(false);
  };

  useEffect(() => {
    // role 확인 또는 필터가 바뀔 때만 다시 조회하는 일회성 fetch다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (roleStatus === "allowed") loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleStatus, filter]);

  const handleAction = async (reportId: string, nextStatus: ReportStatus, hidePostId?: string) => {
    const res = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, status: nextStatus, hidePostId }),
    });
    if (res.ok) {
      showToast("success", "신고를 처리했습니다.");
      loadReports();
    } else {
      showToast("error", "처리에 실패했습니다.");
    }
  };

  if (roleStatus === "loading") return null;
  if (roleStatus === "denied") return null;

  return (
    <div className="flex flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6">
      <h2 className="text-[17px] font-semibold text-[#262425]">신고 큐</h2>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "OPEN", label: "접수" },
            { key: "RESOLVED", label: "처리 완료" },
            { key: "DISMISSED", label: "기각" },
            { key: "ALL", label: "전체" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            aria-pressed={filter === tab.key}
            className={`min-h-[44px] rounded-full px-4 text-[14px] font-medium ${
              filter === tab.key ? "bg-[#FF6A4D] text-white" : "bg-[#F0EEEA] text-[#262425]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoadingReports ? (
        <div role="status" aria-label="신고 목록 불러오는 중" className="flex flex-col gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-[10px] bg-[#F0EEEA]" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <p className="rounded-[10px] bg-[#F7F6F4] px-4 py-6 text-center text-[14px] text-[#78737A]">
          해당 상태의 신고가 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <div
              key={report.report_id}
              className="flex flex-col gap-2 rounded-[10px] border border-[#E4E0DC] p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#78737A]">
                <span className="rounded-full bg-[#F0EEEA] px-3 py-1 text-[#262425]">
                  {TARGET_TYPE_LABELS[report.target_type]}
                </span>
                <span>{report.reason_code}</span>
                <span>{new Date(report.created_at).toLocaleString("ko-KR")}</span>
                <span className="rounded-full bg-[#FFF3E1] px-3 py-1 text-[#9A5B12]">
                  {STATUS_LABELS[report.status]}
                </span>
              </div>
              {report.description && (
                <p className="text-[14px] text-[#4B4749]">{report.description}</p>
              )}
              {report.status === "OPEN" || report.status === "IN_REVIEW" ? (
                <div className="flex flex-wrap gap-2">
                  {report.target_type === "MATE_POST" && (
                    <button
                      type="button"
                      onClick={() => handleAction(report.report_id, "RESOLVED", report.target_id)}
                      className="min-h-[44px] rounded-[10px] bg-[#FF6A4D] px-4 text-[13px] font-semibold text-white hover:bg-[#E14E32]"
                    >
                      게시물 숨기기
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleAction(report.report_id, "RESOLVED")}
                    className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-4 text-[13px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
                  >
                    처리 완료
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(report.report_id, "DISMISSED")}
                    className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-4 text-[13px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
                  >
                    기각
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
