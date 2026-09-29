"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/toast-context";
import { DESTINATIONS } from "@/data/destinations";

const FAVORITES_STORAGE_KEY = "ft_favorite_destinations";

type MatePostStatus = "OPEN" | "CLOSED" | "HIDDEN" | "DELETED";
type MateApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

interface MyPost {
  post_id: string;
  title: string;
  status: MatePostStatus;
}

interface SentApplication {
  application_id: string;
  status: MateApplicationStatus;
  post_id: string;
  mate_post: { title: string } | { title: string }[];
}

interface ReceivedApplication {
  application_id: string;
  status: MateApplicationStatus;
  message: string;
  post_id: string;
  applicant_id: string;
  mate_post: { title: string; owner_id: string } | { title: string; owner_id: string }[];
  user_profile: { nickname: string } | { nickname: string }[];
}

interface BlockedUser {
  blocked_id: string;
  nickname: string;
}

const STATUS_LABELS: Record<MatePostStatus, string> = {
  OPEN: "모집중",
  CLOSED: "모집완료",
  HIDDEN: "숨김",
  DELETED: "삭제됨",
};

const APPLICATION_STATUS_LABELS: Record<MateApplicationStatus, string> = {
  PENDING: "대기",
  ACCEPTED: "승인",
  REJECTED: "거절",
  WITHDRAWN: "철회",
};

function first<T>(value: T | T[]): T {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * 내 활동(내가 쓴 동행글/보낸·받은 참가 요청/차단 목록/즐겨찾기). 모두 본인 데이터만
 * 조회되도록 DB RLS가 서버에서 강제한다(mate_post/mate_application select 정책).
 * 즐겨찾기는 별도 테이블이 없어(COMP-SCR001-DESTINATION-DIRECTORY 구현 당시 승인된
 * 단순화) localStorage(`ft_favorite_destinations`)에 저장된 값을 그대로 읽는다.
 */
export default function MyActivityLists() {
  const { showToast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [sentApplications, setSentApplications] = useState<SentApplication[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<ReceivedApplication[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      return;
    }
    setUserId(user.id);

    const [postsRes, sentRes, receivedRes, blocksRes] = await Promise.all([
      supabase
        .from("mate_post")
        .select("post_id, title, status")
        .eq("owner_id", user.id)
        .neq("status", "DELETED")
        .order("created_at", { ascending: false }),
      supabase
        .from("mate_application")
        .select("application_id, status, post_id, mate_post(title)")
        .eq("applicant_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("mate_application")
        .select(
          "application_id, status, message, post_id, applicant_id, mate_post!inner(title, owner_id), user_profile(nickname)",
        )
        .eq("mate_post.owner_id", user.id)
        .order("created_at", { ascending: false }),
      fetch("/api/blocks").then((res) => (res.ok ? res.json() : { blocks: [] })),
    ]);

    setMyPosts(postsRes.data ?? []);
    setSentApplications((sentRes.data as unknown as SentApplication[]) ?? []);
    setReceivedApplications((receivedRes.data as unknown as ReceivedApplication[]) ?? []);

    const blocks = (blocksRes.blocks ?? []) as { blocked_id: string }[];
    if (blocks.length > 0) {
      const { data: blockedProfiles } = await supabase
        .from("user_profile")
        .select("user_id, nickname")
        .in(
          "user_id",
          blocks.map((b) => b.blocked_id),
        );
      setBlockedUsers(
        blocks.map((b) => ({
          blocked_id: b.blocked_id,
          nickname:
            blockedProfiles?.find((p) => p.user_id === b.blocked_id)?.nickname ?? "알 수 없음",
        })),
      );
    } else {
      setBlockedUsers([]);
    }

    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      setFavoriteIds(raw ? JSON.parse(raw) : []);
    } catch {
      setFavoriteIds([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // 마운트 시 1회, 이후에는 각 액션 핸들러가 명시적으로 다시 호출하는 일회성 조회다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  const handlePostStatusChange = async (postId: string, nextStatus: MatePostStatus) => {
    const res = await fetch(`/api/mates/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      showToast("success", nextStatus === "DELETED" ? "삭제되었습니다." : "상태가 변경되었습니다.");
      loadAll();
    } else {
      showToast("error", "처리에 실패했습니다.");
    }
  };

  const handleApplicationDecision = async (
    applicationId: string,
    next: "ACCEPTED" | "REJECTED",
  ) => {
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      showToast("success", "참가 요청을 처리했습니다.");
      loadAll();
    } else {
      showToast("error", "처리에 실패했습니다.");
    }
  };

  const handleUnblock = async (blockedId: string) => {
    const res = await fetch(`/api/blocks?blockedId=${encodeURIComponent(blockedId)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      showToast("success", "차단을 해제했습니다.");
      loadAll();
    } else {
      showToast("error", "차단 해제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div role="status" aria-label="내 활동 불러오는 중" className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-[16px] bg-[#F0EEEA]" />
        ))}
      </div>
    );
  }

  if (!userId) {
    return (
      <p className="rounded-[10px] bg-[#FDECEA] px-4 py-3 text-[14px] text-[#B3261E]">
        로그인 상태를 확인할 수 없습니다.
      </p>
    );
  }

  const favoriteDestinations = favoriteIds
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#262425]">내가 쓴 동행글</h2>
          <Link href="/travel-tools" className="text-[14px] font-semibold text-[#FF6A4D] underline">
            새 동행글 작성하기
          </Link>
        </div>
        {myPosts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[16px] bg-[#F7F6F4] p-6 text-center">
            <p className="text-[14px] text-[#78737A]">아직 작성한 동행글이 없습니다.</p>
            <Link
              href="/travel-tools"
              className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[14px] font-semibold text-white hover:bg-[#E14E32]"
            >
              동행글 작성하기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myPosts.map((post) => (
              <div
                key={post.post_id}
                className="flex flex-col gap-2 rounded-[16px] border border-[#E4E0DC] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#F0EEEA] px-3 py-1 text-[13px] text-[#262425]">
                    {STATUS_LABELS[post.status]}
                  </span>
                  <p className="text-[15px] font-semibold text-[#262425]">{post.title}</p>
                </div>
                <div className="flex gap-2">
                  {post.status === "OPEN" && (
                    <button
                      type="button"
                      onClick={() => handlePostStatusChange(post.post_id, "CLOSED")}
                      className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[13px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
                    >
                      마감하기
                    </button>
                  )}
                  {post.status === "CLOSED" && (
                    <button
                      type="button"
                      onClick={() => handlePostStatusChange(post.post_id, "OPEN")}
                      className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[13px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
                    >
                      재오픈
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handlePostStatusChange(post.post_id, "DELETED")}
                    className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[13px] font-semibold text-[#B3261E] hover:bg-[#FDECEA]"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-[17px] font-semibold text-[#262425]">내가 받은 참가 요청</h2>
        {receivedApplications.length === 0 ? (
          <p className="rounded-[16px] bg-[#F7F6F4] p-6 text-center text-[14px] text-[#78737A]">
            아직 받은 참가 요청이 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {receivedApplications.map((app) => {
              const post = first(app.mate_post);
              const applicant = first(app.user_profile);
              return (
                <div
                  key={app.application_id}
                  className="flex flex-col gap-2 rounded-[16px] border border-[#E4E0DC] p-4"
                >
                  <p className="text-[13px] text-[#78737A]">
                    {post?.title} · {applicant?.nickname}
                  </p>
                  <p className="text-[14px] text-[#4B4749]">{app.message}</p>
                  {app.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplicationDecision(app.application_id, "ACCEPTED")}
                        className="min-h-[44px] rounded-[10px] bg-[#FF6A4D] px-4 text-[13px] font-semibold text-white hover:bg-[#E14E32]"
                      >
                        승인
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplicationDecision(app.application_id, "REJECTED")}
                        className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-4 text-[13px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
                      >
                        거절
                      </button>
                    </div>
                  ) : (
                    <span className="w-fit rounded-full bg-[#F0EEEA] px-3 py-1 text-[13px] text-[#262425]">
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-[17px] font-semibold text-[#262425]">내가 보낸 참가 요청</h2>
        {sentApplications.length === 0 ? (
          <p className="rounded-[16px] bg-[#F7F6F4] p-6 text-center text-[14px] text-[#78737A]">
            아직 보낸 참가 요청이 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {sentApplications.map((app) => (
              <div
                key={app.application_id}
                className="flex items-center justify-between gap-4 rounded-[16px] border border-[#E4E0DC] p-4"
              >
                <p className="text-[15px] text-[#262425]">{first(app.mate_post)?.title}</p>
                <span className="rounded-full bg-[#F0EEEA] px-3 py-1 text-[13px] text-[#262425]">
                  {APPLICATION_STATUS_LABELS[app.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-[17px] font-semibold text-[#262425]">차단 목록</h2>
        {blockedUsers.length === 0 ? (
          <p className="rounded-[16px] bg-[#F7F6F4] p-6 text-center text-[14px] text-[#78737A]">
            차단한 사용자가 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {blockedUsers.map((b) => (
              <div
                key={b.blocked_id}
                className="flex items-center justify-between gap-4 rounded-[16px] border border-[#E4E0DC] p-4"
              >
                <p className="text-[15px] text-[#262425]">{b.nickname}</p>
                <button
                  type="button"
                  onClick={() => handleUnblock(b.blocked_id)}
                  className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-4 text-[13px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
                >
                  차단 해제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-[17px] font-semibold text-[#262425]">즐겨찾기</h2>
        {favoriteDestinations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[16px] bg-[#F7F6F4] p-6 text-center">
            <p className="text-[14px] text-[#78737A]">
              즐겨찾기한 여행지가 없습니다. 메인 화면에서 저장해 보세요.
            </p>
            <Link
              href="/"
              className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[14px] font-semibold text-white hover:bg-[#E14E32]"
            >
              여행지 보러 가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {favoriteDestinations.map((d) => (
              <Link
                key={d.id}
                href={`/?destination=${encodeURIComponent(d.id)}`}
                className="rounded-[16px] border border-[#E4E0DC] p-4 hover:bg-[#F7F6F4]"
              >
                <p className="text-[13px] text-[#78737A]">{d.country}</p>
                <p className="text-[15px] font-semibold text-[#262425]">{d.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
