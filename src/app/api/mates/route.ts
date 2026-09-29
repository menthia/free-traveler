import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listMatePosts, createMatePost, type MatePostStatus } from "@/lib/db/mates";
import { detectContactPatterns } from "@/lib/contact-detection";

/** 다중 조건 필터로 동행 모집글 목록을 조회한다(REQ-FUNC-030). 비회원도 조회 가능. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const posts = await listMatePosts({
    countryName: searchParams.get("country") ?? undefined,
    regionName: searchParams.get("region") ?? undefined,
    startDateFrom: searchParams.get("startDateFrom") ?? undefined,
    endDateTo: searchParams.get("endDateTo") ?? undefined,
    status: (searchParams.get("status") as MatePostStatus | null) ?? undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  });

  return NextResponse.json({ posts });
}

/** 동행 모집글을 생성한다(REQ-FUNC-031/032). 비회원 요청은 401로 차단한다. */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }

  const body = await request.json();
  const {
    countryName,
    regionName,
    startDate,
    endDate,
    capacity,
    preferences,
    travelStyles,
    title,
    description,
  } = body ?? {};

  if (!countryName || !startDate || !endDate || !title) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  // 클라이언트 우회 방지 — 서버에서도 연락처 패턴을 재검증한다(REQ-FUNC-032).
  const combinedText = `${title}\n${description ?? ""}`;
  const contactMatches = detectContactPatterns(combinedText);
  if (contactMatches.length > 0) {
    return NextResponse.json(
      { error: "CONTACT_INFO_NOT_ALLOWED", matches: contactMatches.map((m) => m.type) },
      { status: 400 },
    );
  }

  try {
    const post = await createMatePost({
      ownerId: user.id,
      countryName,
      regionName,
      startDate,
      endDate,
      capacity,
      preferences,
      travelStyles,
      title,
      description,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "CREATE_FAILED", message: String(error) }, { status: 400 });
  }
}
