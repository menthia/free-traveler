import { createClient } from "@/lib/supabase/server";

export type MateApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export interface MateApplication {
  application_id: string;
  post_id: string;
  applicant_id: string;
  message: string;
  status: MateApplicationStatus;
  created_at: string;
  updated_at: string;
}

const APPLICATION_TRANSITIONS: Record<MateApplicationStatus, MateApplicationStatus[]> = {
  PENDING: ["ACCEPTED", "REJECTED", "WITHDRAWN"],
  ACCEPTED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

export function canTransitionApplicationStatus(
  from: MateApplicationStatus,
  to: MateApplicationStatus,
): boolean {
  return APPLICATION_TRANSITIONS[from].includes(to);
}

export interface CreateApplicationInput {
  postId: string;
  applicantId: string;
  message: string;
}

export type CreateApplicationResult =
  | { ok: true; application: MateApplication }
  | { ok: false; reason: "DUPLICATE_APPLICATION" | "OWNER_CANNOT_APPLY" };

/** 중복 요청 검사 후 참가 요청을 생성한다(REQ-FUNC-035, MATE_APPLICATION UNIQUE(post_id, applicant_id)로도 DB 레벨 방어). */
export async function createApplication(
  input: CreateApplicationInput,
): Promise<CreateApplicationResult> {
  const supabase = await createClient();

  const { data: post, error: postError } = await supabase
    .from("mate_post")
    .select("owner_id")
    .eq("post_id", input.postId)
    .maybeSingle();
  if (postError) throw postError;
  if (post && post.owner_id === input.applicantId) {
    return { ok: false, reason: "OWNER_CANNOT_APPLY" };
  }

  const { data: existing, error: existingError } = await supabase
    .from("mate_application")
    .select("application_id")
    .eq("post_id", input.postId)
    .eq("applicant_id", input.applicantId)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) {
    return { ok: false, reason: "DUPLICATE_APPLICATION" };
  }

  const { data, error } = await supabase
    .from("mate_application")
    .insert({
      post_id: input.postId,
      applicant_id: input.applicantId,
      message: input.message,
    })
    .select("*")
    .single();
  if (error) throw error;
  return { ok: true, application: data };
}

export async function listApplicationsForPost(postId: string): Promise<MateApplication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_application")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listApplicationsByApplicant(applicantId: string): Promise<MateApplication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mate_application")
    .select("*")
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** 상태 전이(PENDING -> ACCEPTED/REJECTED/WITHDRAWN)를 허용된 경로에서만 수행한다. */
export async function updateApplicationStatus(
  applicationId: string,
  nextStatus: MateApplicationStatus,
): Promise<MateApplication> {
  const supabase = await createClient();
  const { data: current, error: currentError } = await supabase
    .from("mate_application")
    .select("status")
    .eq("application_id", applicationId)
    .maybeSingle();
  if (currentError) throw currentError;
  if (!current) throw new Error("MATE_APPLICATION_NOT_FOUND");
  if (!canTransitionApplicationStatus(current.status, nextStatus)) {
    throw new Error(`INVALID_TRANSITION: ${current.status} -> ${nextStatus}`);
  }

  const { data, error } = await supabase
    .from("mate_application")
    .update({ status: nextStatus })
    .eq("application_id", applicationId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
