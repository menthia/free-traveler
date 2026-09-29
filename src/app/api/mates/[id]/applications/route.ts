import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createApplication, listApplicationsForPost } from "@/lib/db/applications";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** 특정 모집글의 참가 요청 목록을 조회한다(신청자 본인/작성자/Moderator만 RLS로 열람 가능). */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const applications = await listApplicationsForPost(id);
  return NextResponse.json({ applications });
}

/** 참가 요청을 생성한다(REQ-FUNC-034/035) — 중복 PENDING/ACCEPTED는 DB unique 제약과 함께 차단한다. */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }

  const body = await request.json();
  const { message } = (body ?? {}) as { message?: string };
  if (!message) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const result = await createApplication({ postId: id, applicantId: user.id, message });
  if (!result.ok) {
    const status = result.reason === "DUPLICATE_APPLICATION" ? 409 : 400;
    return NextResponse.json({ error: result.reason }, { status });
  }

  return NextResponse.json({ application: result.application }, { status: 201 });
}
