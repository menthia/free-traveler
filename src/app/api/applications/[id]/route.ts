import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateApplicationStatus, type MateApplicationStatus } from "@/lib/db/applications";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * 참가 요청 상태를 변경한다(ACCEPTED/REJECTED는 모집글 작성자만, WITHDRAWN은 신청자 본인만).
 * 비작성자의 승인/거절 시도는 403을 반환한다(REQ-FUNC-036).
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = (body ?? {}) as { status?: MateApplicationStatus };
  if (!status) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const { data: application, error: fetchError } = await supabase
    .from("mate_application")
    .select("applicant_id, post_id, mate_post!inner(owner_id)")
    .eq("application_id", id)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json(
      { error: "LOOKUP_FAILED", message: fetchError.message },
      { status: 400 },
    );
  }
  if (!application) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const ownerId = (application.mate_post as unknown as { owner_id: string }).owner_id;
  const isApplicant = application.applicant_id === user.id;
  const isOwner = ownerId === user.id;

  const ownerOnlyStatuses: MateApplicationStatus[] = ["ACCEPTED", "REJECTED"];
  const applicantOnlyStatuses: MateApplicationStatus[] = ["WITHDRAWN"];

  if (ownerOnlyStatuses.includes(status) && !isOwner) {
    return NextResponse.json({ error: "FORBIDDEN_NOT_OWNER" }, { status: 403 });
  }
  if (applicantOnlyStatuses.includes(status) && !isApplicant) {
    return NextResponse.json({ error: "FORBIDDEN_NOT_APPLICANT" }, { status: 403 });
  }

  try {
    const updated = await updateApplicationStatus(id, status);
    return NextResponse.json({ application: updated });
  } catch (error) {
    return NextResponse.json({ error: "UPDATE_FAILED", message: String(error) }, { status: 400 });
  }
}
