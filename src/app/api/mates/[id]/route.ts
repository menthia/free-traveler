import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMatePostById, updateMatePostStatus, type MatePostStatus } from "@/lib/db/mates";
import { detectContactPatterns } from "@/lib/contact-detection";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const post = await getMatePostById(id);
  if (!post) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  return NextResponse.json({ post });
}

/** 모집글 마감/재오픈/숨김 처리(상태 전이)를 담당한다. 본문 텍스트 수정은 title/description만 허용한다. */
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
  const { status } = (body ?? {}) as { status?: MatePostStatus };

  if (!status) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  if (body.title || body.description) {
    const combinedText = `${body.title ?? ""}\n${body.description ?? ""}`;
    const contactMatches = detectContactPatterns(combinedText);
    if (contactMatches.length > 0) {
      return NextResponse.json({ error: "CONTACT_INFO_NOT_ALLOWED" }, { status: 400 });
    }
  }

  try {
    const post = await updateMatePostStatus(id, status);
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: "UPDATE_FAILED", message: String(error) }, { status: 400 });
  }
}

/** 작성자가 자신의 글을 삭제한다(소프트 삭제 — status를 DELETED로 전이). */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }

  try {
    const post = await updateMatePostStatus(id, "DELETED");
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: "DELETE_FAILED", message: String(error) }, { status: 400 });
  }
}
