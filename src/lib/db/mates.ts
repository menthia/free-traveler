import { createClient } from "@/lib/supabase/server";

export type MatePostStatus = "OPEN" | "CLOSED" | "HIDDEN" | "DELETED";

export interface MatePost {
  post_id: string;
  owner_id: string;
  country_name: string;
  region_name: string | null;
  start_date: string;
  end_date: string;
  capacity: number;
  preferences: Record<string, unknown>;
  travel_styles: string[];
  title: string;
  description: string | null;
  status: MatePostStatus;
  created_at: string;
  updated_at: string;
}

export interface MatePostFilters {
  countryName?: string;
  regionName?: string;
  startDateFrom?: string;
  endDateTo?: string;
  /** 지정하지 않으면 OPEN/CLOSED 전체(공개 목록 기본값). */
  status?: MatePostStatus;
  limit?: number;
}

export interface CreateMatePostInput {
  ownerId: string;
  countryName: string;
  regionName?: string;
  startDate: string;
  endDate: string;
  capacity: number;
  preferences?: Record<string, unknown>;
  travelStyles?: string[];
  title: string;
  description?: string;
}

const MATE_POST_TRANSITIONS: Record<MatePostStatus, MatePostStatus[]> = {
  OPEN: ["CLOSED", "HIDDEN", "DELETED"],
  CLOSED: ["OPEN", "DELETED"],
  HIDDEN: ["OPEN", "DELETED"],
  DELETED: [],
};

/**
 * 배치 작업 없이 조회 시점에 `end_date` 경과 여부로 CLOSED 상태를 파생시킨다(REQ-FUNC-037).
 * 이 함수는 표시용 파생 상태만 계산하며 DB의 실제 status 컬럼을 바꾸지 않는다
 * (DB 갱신은 owner가 명시적으로 closeMatePost를 호출할 때만 일어난다).
 */
export function deriveMatePostDisplayStatus(
  post: Pick<MatePost, "status" | "end_date">,
): MatePostStatus {
  if (post.status !== "OPEN") return post.status;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(`${post.end_date}T00:00:00`);
  return end < today ? "CLOSED" : "OPEN";
}

export function canTransitionMatePostStatus(from: MatePostStatus, to: MatePostStatus): boolean {
  return MATE_POST_TRANSITIONS[from].includes(to);
}

/** 다중 조건(국가·지역·기간·상태) 필터로 동행 모집글 목록을 조회한다(REQ-FUNC-030). */
export async function listMatePosts(filters: MatePostFilters = {}): Promise<MatePost[]> {
  const supabase = await createClient();
  let query = supabase.from("mate_post").select("*").order("created_at", { ascending: false });

  if (filters.countryName) query = query.eq("country_name", filters.countryName);
  if (filters.regionName) query = query.eq("region_name", filters.regionName);
  if (filters.startDateFrom) query = query.gte("start_date", filters.startDateFrom);
  if (filters.endDateTo) query = query.lte("end_date", filters.endDateTo);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((post) => ({
    ...post,
    status: deriveMatePostDisplayStatus(post),
  }));
}

export async function getMatePostById(postId: string): Promise<MatePost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_post")
    .select("*")
    .eq("post_id", postId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { ...data, status: deriveMatePostDisplayStatus(data) };
}

export async function createMatePost(input: CreateMatePostInput): Promise<MatePost> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_post")
    .insert({
      owner_id: input.ownerId,
      country_name: input.countryName,
      region_name: input.regionName ?? null,
      start_date: input.startDate,
      end_date: input.endDate,
      capacity: input.capacity,
      preferences: input.preferences ?? {},
      travel_styles: input.travelStyles ?? [],
      title: input.title,
      description: input.description ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/** 상태 전이(OPEN/CLOSED/HIDDEN/DELETED)를 허용된 경로에서만 수행한다. */
export async function updateMatePostStatus(
  postId: string,
  nextStatus: MatePostStatus,
): Promise<MatePost> {
  const current = await getMatePostById(postId);
  if (!current) throw new Error("MATE_POST_NOT_FOUND");
  if (!canTransitionMatePostStatus(current.status, nextStatus)) {
    throw new Error(`INVALID_TRANSITION: ${current.status} -> ${nextStatus}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_post")
    .update({ status: nextStatus })
    .eq("post_id", postId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
