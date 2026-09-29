import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createReport, listMyReports, type ReportTargetType } from "@/lib/db/reports";

/** 본인이 접수한 신고 목록만 조회한다(상세·전체 큐는 API-ADMIN-REPORTS가 Moderator/Admin 전용으로 제공). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }
  const reports = await listMyReports(user.id);
  return NextResponse.json({ reports });
}

/** 신고를 접수하고 접수 ID를 즉시 반환한다(REQ-FUNC-039 — 3초 이내 접수 ID 응답). */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }

  const body = await request.json();
  const { targetType, targetId, reasonCode, description } = (body ?? {}) as {
    targetType?: ReportTargetType;
    targetId?: string;
    reasonCode?: string;
    description?: string;
  };

  if (!targetType || !targetId || !reasonCode) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  try {
    const report = await createReport({
      reporterId: user.id,
      targetType,
      targetId,
      reasonCode,
      description,
    });
    return NextResponse.json({ reportId: report.report_id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "REPORT_FAILED", message: String(error) }, { status: 400 });
  }
}
