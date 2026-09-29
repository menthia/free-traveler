"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type MateApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

interface MateApplication {
  application_id: string;
  applicant_id: string;
  message: string;
  status: MateApplicationStatus;
}

const AGE_BAND_LABELS: Record<string, string> = {
  "10s": "10대",
  "20s": "20대",
  "30s": "30대",
  "40s": "40대",
  "50s_plus": "50대 이상",
};

interface MateDetailPostData {
  post_id: string;
  owner_id: string;
  country_name: string;
  region_name: string | null;
  start_date: string;
  end_date: string;
  capacity: number;
  travel_styles: string[];
  title: string;
  description: string | null;
  owner_nickname: string;
  owner_age_band: string | null;
}

type DetailStatus = "loading" | "ready" | "not_found" | "error";

interface MateDetailPanelProps {
  postId: string | null;
  /**
   * APPLICATION-FORM/REPORT-BLOCK-ACTIONS를 이 상세 아래에 조립할 자리. 렌더 prop으로 받아
   * 이미 조회해 둔 글 작성자 `ownerId`를 Page Owner가 다시 조회하지 않고 그대로 전달한다.
   */
  children?: (ctx: { postId: string; ownerId: string }) => ReactNode;
}

/**
 * 동행글 상세(작성자 시점 참가 요청 승인/거절 포함). 작성자 표시는 닉네임·연령대·여행
 * 스타일만 사용하며(REQ-FUNC-033), 이메일·전화번호 등 연락처는 어떤 필드에서도 조회·표시하지
 * 않는다. 참가 요청 승인/거절은 서버(API-APPLICATIONS)가 작성자 본인 여부를 재검증하므로
 * 이 Component는 UI 상에서만 소유자 여부로 조작 버튼 노출을 결정한다.
 */
export default function MateDetailPanel({ postId, children }: MateDetailPanelProps) {
  const [status, setStatus] = useState<DetailStatus>("loading");
  const [post, setPost] = useState<MateDetailPostData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [applications, setApplications] = useState<MateApplication[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!postId) {
      // postId가 없으면 렌더 최상단에서 이미 별도 placeholder를 반환하므로 아무 것도 하지 않는다.
      return;
    }

    const supabase = createClient();

    async function load() {
      setStatus("loading");
      setActionError(null);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!cancelled) setCurrentUserId(user?.id ?? null);

        const { data, error } = await supabase
          .from("mate_post")
          .select("*, user_profile!inner(nickname, age_band)")
          .eq("post_id", postId)
          .maybeSingle();
        if (error) throw error;
        if (cancelled) return;

        if (!data) {
          setStatus("not_found");
          return;
        }

        setPost({
          post_id: data.post_id,
          owner_id: data.owner_id,
          country_name: data.country_name,
          region_name: data.region_name,
          start_date: data.start_date,
          end_date: data.end_date,
          capacity: data.capacity,
          travel_styles: data.travel_styles,
          title: data.title,
          description: data.description,
          owner_nickname: data.user_profile.nickname,
          owner_age_band: data.user_profile.age_band,
        });

        if (user && user.id === data.owner_id) {
          const res = await fetch(`/api/mates/${postId}/applications`);
          if (res.ok) {
            const body = await res.json();
            if (!cancelled) setApplications(body.applications ?? []);
          }
        } else if (!cancelled) {
          setApplications([]);
        }

        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleDecision = async (applicationId: string, next: "ACCEPTED" | "REJECTED") => {
    setActionError(null);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        setActionError("참가 요청 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setApplications((prev) =>
        prev.map((app) => (app.application_id === applicationId ? { ...app, status: next } : app)),
      );
    } catch {
      setActionError("참가 요청 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  if (!postId) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center rounded-[16px] border border-[#E4E0DC] bg-[#F7F6F4] p-8 text-center">
        <p className="text-[15px] text-[#78737A]">목록에서 동행글을 선택하면 상세가 표시됩니다.</p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div
        role="status"
        aria-label="동행글 상세 불러오는 중"
        className="h-64 animate-pulse rounded-[16px] bg-[#F0EEEA]"
      />
    );
  }

  if (status === "not_found" || status === "error" || !post) {
    return (
      <p className="rounded-[10px] bg-[#FDECEA] px-4 py-3 text-[14px] text-[#B3261E]">
        동행글 상세를 불러오지 못했습니다.
      </p>
    );
  }

  const isOwner = currentUserId !== null && currentUserId === post.owner_id;
  const pendingApplications = applications.filter((app) => app.status === "PENDING");

  return (
    <div className="flex flex-col gap-6 rounded-[16px] border border-[#E4E0DC] bg-white p-6">
      <div>
        <p className="text-[13px] text-[#78737A]">
          {post.country_name}
          {post.region_name ? ` · ${post.region_name}` : ""}
        </p>
        <h2 className="text-[20px] font-bold text-[#262425]">{post.title}</h2>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[14px]">
        <dt className="text-[#78737A]">기간</dt>
        <dd className="text-[#262425]">
          {post.start_date} ~ {post.end_date}
        </dd>
        <dt className="text-[#78737A]">모집 인원</dt>
        <dd className="text-[#262425]">{post.capacity}명</dd>
        <dt className="text-[#78737A]">여행 스타일</dt>
        <dd className="text-[#262425]">
          {post.travel_styles.length > 0 ? post.travel_styles.join(", ") : "미지정"}
        </dd>
      </dl>

      {post.description && (
        <p className="whitespace-pre-wrap text-[15px] leading-[1.6] text-[#4B4749]">
          {post.description}
        </p>
      )}

      <div className="rounded-[10px] bg-[#F7F6F4] p-4">
        <p className="text-[13px] text-[#78737A]">작성자</p>
        <p className="text-[15px] font-semibold text-[#262425]">
          {post.owner_nickname}
          {post.owner_age_band ? ` · ${AGE_BAND_LABELS[post.owner_age_band] ?? ""}` : ""}
        </p>
      </div>

      {isOwner && (
        <div className="flex flex-col gap-3">
          <h3 className="text-[15px] font-semibold text-[#262425]">참가 요청</h3>
          {actionError && (
            <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
              {actionError}
            </p>
          )}
          {pendingApplications.length === 0 ? (
            <p className="text-[14px] text-[#78737A]">대기 중인 참가 요청이 없습니다.</p>
          ) : (
            pendingApplications.map((app) => (
              <div
                key={app.application_id}
                className="flex flex-col gap-2 rounded-[10px] border border-[#E4E0DC] p-3"
              >
                <p className="text-[14px] text-[#4B4749]">{app.message}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecision(app.application_id, "ACCEPTED")}
                    className="min-h-[44px] flex-1 rounded-[10px] bg-[#FF6A4D] text-[14px] font-semibold text-white hover:bg-[#E14E32]"
                  >
                    승인
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision(app.application_id, "REJECTED")}
                    className="min-h-[44px] flex-1 rounded-[10px] border border-[#E4E0DC] text-[14px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
                  >
                    거절
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {children?.({ postId: post.post_id, ownerId: post.owner_id })}
    </div>
  );
}
