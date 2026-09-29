"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import MateFilterBar, { EMPTY_MATE_FILTERS, type MateFilters } from "./MateFilterBar";

const MAX_CARDS = 8;

type MatePostStatus = "OPEN" | "CLOSED" | "HIDDEN" | "DELETED";

interface MatePost {
  post_id: string;
  country_name: string;
  region_name: string | null;
  start_date: string;
  end_date: string;
  capacity: number;
  travel_styles: string[];
  title: string;
  status: MatePostStatus;
}

const STATUS_LABELS: Record<MatePostStatus, string> = {
  OPEN: "모집중",
  CLOSED: "모집완료",
  HIDDEN: "숨김",
  DELETED: "삭제됨",
};

type ListStatus = "loading" | "ready" | "error";

interface MatePostListProps {
  /** 선택된 글의 post_id — 상세 패널/Drawer가 무엇을 열지 결정하는 값(Page Owner가 소유). */
  selectedPostId?: string | null;
  /** 카드를 클릭했을 때(상세 패널/Drawer를 여는 신호). */
  onSelectPost?: (postId: string) => void;
}

/**
 * `src/lib/db/mates.ts`의 `deriveMatePostDisplayStatus`와 동일한 로직이지만, 그 파일은
 * `@/lib/supabase/server`(next/headers 사용)를 import해 Server 전용이라 Client Component인
 * 이 파일에서 재사용하면 서버 전용 코드가 클라이언트 번들에 섞여 빌드가 깨진다. 순수 날짜
 * 계산 로직만 이 파일 안에 그대로 복제한다(새 공용 파일을 만들지 않음 — Expected Files 범위).
 */
function deriveMatePostDisplayStatus(post: Pick<MatePost, "status" | "end_date">): MatePostStatus {
  if (post.status !== "OPEN") return post.status;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(`${post.end_date}T00:00:00`);
  return end < today ? "CLOSED" : "OPEN";
}

/**
 * 필터 Bar + 동행글 목록을 함께 소유하는 Component(FILTER-BAR에 의존). 연령대·성별은
 * MATE_POST가 아닌 작성자 USER_PROFILE 컬럼이라 `user_profile!inner(...)` 조인으로 필터한다.
 * 차단 관계 제외는 애플리케이션 코드가 아니라 DB RLS(`mate_post_select_visible` 정책의
 * `is_blocked_pair`)가 항상 적용하므로 이 Component는 별도 처리를 하지 않는다.
 * 모집 상태는 DB의 `status` 컬럼을 그대로 믿지 않고 매 조회 시 `deriveMatePostDisplayStatus`로
 * 다시 계산해 종료일이 지난 글이 "모집중"으로 남아 있지 않게 한다(REQ-FUNC-037, 배치 없음).
 */
export default function MatePostList({ selectedPostId = null, onSelectPost }: MatePostListProps) {
  const [filters, setFilters] = useState<MateFilters>(EMPTY_MATE_FILTERS);
  const [status, setStatus] = useState<ListStatus>("loading");
  const [posts, setPosts] = useState<MatePost[]>([]);
  const [anyPostsExist, setAnyPostsExist] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      setStatus("loading");
      try {
        let query = supabase
          .from("mate_post")
          .select("*, user_profile!inner(age_band, gender)")
          .in("status", ["OPEN", "CLOSED"])
          .order("created_at", { ascending: false });

        if (filters.country) query = query.eq("country_name", filters.country);
        if (filters.region) query = query.eq("region_name", filters.region);
        if (filters.startDateFrom) query = query.gte("start_date", filters.startDateFrom);
        if (filters.endDateTo) query = query.lte("end_date", filters.endDateTo);
        if (filters.ageBand) query = query.eq("user_profile.age_band", filters.ageBand);
        if (filters.gender) query = query.eq("user_profile.gender", filters.gender);
        if (filters.travelStyles.length > 0) {
          query = query.contains("travel_styles", filters.travelStyles);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (cancelled) return;

        const withDisplayStatus = (data ?? []).map((post) => ({
          ...post,
          status: deriveMatePostDisplayStatus(post),
        }));

        const matched = filters.status
          ? withDisplayStatus.filter((post) => post.status === filters.status)
          : withDisplayStatus;

        setPosts(matched);
        setStatus("ready");

        if (matched.length === 0) {
          const { count } = await supabase
            .from("mate_post")
            .select("post_id", { count: "exact", head: true })
            .in("status", ["OPEN", "CLOSED"]);
          if (!cancelled) setAnyPostsExist((count ?? 0) > 0);
        } else {
          setAnyPostsExist(true);
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  const hasActiveFilter =
    filters.country ||
    filters.region ||
    filters.startDateFrom ||
    filters.endDateTo ||
    filters.ageBand ||
    filters.gender ||
    filters.travelStyles.length > 0 ||
    filters.status;

  return (
    <div className="flex flex-col gap-8">
      <MateFilterBar filters={filters} onChange={setFilters} resultCount={posts.length} />

      {status === "loading" && (
        <div
          role="status"
          aria-label="동행글 불러오는 중"
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-[16px] bg-[#F0EEEA]" />
          ))}
        </div>
      )}

      {status === "error" && (
        <p className="rounded-[10px] bg-[#FDECEA] px-4 py-3 text-[14px] text-[#B3261E]">
          동행글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {status === "ready" && posts.length === 0 && !hasActiveFilter && !anyPostsExist && (
        <div className="flex flex-col items-center gap-4 rounded-[16px] bg-[#F7F6F4] p-8 text-center">
          <p className="text-[16px] leading-[1.6] text-[#4B4749]">
            아직 등록된 동행글이 없습니다. 가장 먼저 동행을 모집해 보세요.
          </p>
          <ol className="flex flex-col gap-1 text-[14px] text-[#78737A]">
            <li>1. 로그인 후 여행 준비 페이지의 동행 탭에서 조건을 입력합니다.</li>
            <li>2. 모집 인원과 여행 스타일을 선택합니다.</li>
            <li>3. 안전수칙에 동의하고 게시하면 동행자를 모집할 수 있습니다.</li>
          </ol>
          <Link
            href="/travel-tools"
            className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
          >
            동행글 작성하기
          </Link>
        </div>
      )}

      {status === "ready" && posts.length === 0 && (hasActiveFilter || anyPostsExist) && (
        <div className="flex flex-col items-center gap-4 rounded-[16px] bg-[#F7F6F4] p-8 text-center">
          <p className="text-[16px] text-[#4B4749]">조건에 맞는 동행글이 없습니다.</p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_MATE_FILTERS)}
            className="font-semibold text-[#FF6A4D] underline"
          >
            필터 초기화
          </button>
        </div>
      )}

      {status === "ready" && posts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.slice(0, MAX_CARDS).map((post) => {
            const isSelected = post.post_id === selectedPostId;
            return (
              <button
                key={post.post_id}
                type="button"
                data-testid="mate-post-card"
                onClick={() => onSelectPost?.(post.post_id)}
                aria-pressed={isSelected}
                className={`flex flex-col gap-3 rounded-[16px] border bg-white p-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D] ${
                  isSelected ? "border-[#FF6A4D]" : "border-[#E4E0DC]"
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[13px] font-medium ${
                      post.status === "OPEN"
                        ? "bg-[#FF6A4D] text-white"
                        : "bg-[#F0EEEA] text-[#78737A]"
                    }`}
                  >
                    {STATUS_LABELS[post.status]}
                  </span>
                  {post.travel_styles.slice(0, 2).map((style) => (
                    <span
                      key={style}
                      className="rounded-full bg-[#F0EEEA] px-3 py-1 text-[13px] text-[#262425]"
                    >
                      {style}
                    </span>
                  ))}
                </div>
                <p className="text-[17px] font-semibold text-[#262425]">{post.title}</p>
                <p className="text-[14px] text-[#78737A]">
                  {post.country_name}
                  {post.region_name ? ` · ${post.region_name}` : ""}
                </p>
                <p className="text-[14px] text-[#78737A]">
                  {post.start_date} ~ {post.end_date}
                </p>
                <p className="text-[14px] text-[#78737A]">모집 인원 {post.capacity}명</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
