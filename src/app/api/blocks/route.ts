import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createBlock, removeBlock, listBlocksByBlocker } from "@/lib/db/blocks";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** 본인이 생성한 차단 목록만 조회한다(REQ-FUNC-040 Security AC — 차단 목록은 본인만 조회 가능). */
export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }
  const blocks = await listBlocksByBlocker(user.id);
  return NextResponse.json({ blocks });
}

/** 차단을 생성한다. 생성 즉시 RLS(user_block 기반 정책)가 상호 글·프로필·요청 노출을 차단한다. */
export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }

  const body = await request.json();
  const { blockedId } = (body ?? {}) as { blockedId?: string };
  if (!blockedId) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  try {
    const block = await createBlock(user.id, blockedId);
    return NextResponse.json({ block }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "BLOCK_FAILED", message: String(error) }, { status: 400 });
  }
}

/** 차단을 해제한다. */
export async function DELETE(request: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const blockedId = searchParams.get("blockedId");
  if (!blockedId) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  await removeBlock(user.id, blockedId);
  return NextResponse.json({ ok: true });
}
