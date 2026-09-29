import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listReportsForModerator, updateReportStatus, type ReportStatus } from "@/lib/db/reports";
import { updateMatePostStatus } from "@/lib/db/mates";

async function requireModeratorOrAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isAllowed: false };

  const { data: profile } = await supabase
    .from("user_profile")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const isAllowed = profile?.role === "moderator" || profile?.role === "admin";
  return { user, isAllowed };
}

/** OPEN/IN_REVIEW/RESOLVED/DISMISSED 상태 필터로 신고 큐를 조회한다. Moderator/Admin만 접근 가능. */
export async function GET(request: NextRequest) {
  const { user, isAllowed } = await requireModeratorOrAdmin();
  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }
  if (!isAllowed) {
    return NextResponse.json({ error: "FORBIDDEN_NOT_MODERATOR" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") as ReportStatus | null) ?? undefined;
  const reports = await listReportsForModerator(status);
  return NextResponse.json({ reports });
}

/**
 * 신고 상태를 변경한다(RESOLVED/DISMISSED 처리). `hidePostId`가 있으면 대상 동행글도
 * HIDDEN으로 전환한다(REQ-FUNC-041/042 — 게시물 숨김 포함).
 */
export async function PATCH(request: NextRequest) {
  const { user, isAllowed } = await requireModeratorOrAdmin();
  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }
  if (!isAllowed) {
    return NextResponse.json({ error: "FORBIDDEN_NOT_MODERATOR" }, { status: 403 });
  }

  const body = await request.json();
  const { reportId, status, hidePostId } = (body ?? {}) as {
    reportId?: string;
    status?: ReportStatus;
    hidePostId?: string;
  };

  if (!reportId || !status) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  try {
    const report = await updateReportStatus(reportId, status, user.id);
    if (hidePostId) {
      await updateMatePostStatus(hidePostId, "HIDDEN");
    }
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ error: "UPDATE_FAILED", message: String(error) }, { status: 400 });
  }
}
