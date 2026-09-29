import { createClient } from "@/lib/supabase/server";

export type ReportTargetType = "MATE_POST" | "MATE_APPLICATION" | "USER_PROFILE";
export type ReportStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "DISMISSED";

export interface Report {
  report_id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason_code: string;
  description: string | null;
  status: ReportStatus;
  assignee_id: string | null;
  created_at: string;
  resolved_at: string | null;
}

const REPORT_TRANSITIONS: Record<ReportStatus, ReportStatus[]> = {
  OPEN: ["IN_REVIEW", "RESOLVED", "DISMISSED"],
  IN_REVIEW: ["RESOLVED", "DISMISSED"],
  RESOLVED: [],
  DISMISSED: [],
};

export function canTransitionReportStatus(from: ReportStatus, to: ReportStatus): boolean {
  return REPORT_TRANSITIONS[from].includes(to);
}

export interface CreateReportInput {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reasonCode: string;
  description?: string;
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("report")
    .insert({
      reporter_id: input.reporterId,
      target_type: input.targetType,
      target_id: input.targetId,
      reason_code: input.reasonCode,
      description: input.description ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listMyReports(reporterId: string): Promise<Report[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("report")
    .select("*")
    .eq("reporter_id", reporterId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Moderator/Admin 전용 신고 큐 조회(RLS가 역할 검증을 이미 강제하므로 여기서는 필터만 캡슐화). */
export async function listReportsForModerator(status?: ReportStatus): Promise<Report[]> {
  const supabase = await createClient();
  let query = supabase.from("report").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/** 상태 전이(OPEN -> IN_REVIEW/RESOLVED/DISMISSED, IN_REVIEW -> RESOLVED/DISMISSED)를 허용된 경로에서만 수행한다. */
export async function updateReportStatus(
  reportId: string,
  nextStatus: ReportStatus,
  assigneeId?: string,
): Promise<Report> {
  const supabase = await createClient();
  const { data: current, error: currentError } = await supabase
    .from("report")
    .select("status")
    .eq("report_id", reportId)
    .maybeSingle();
  if (currentError) throw currentError;
  if (!current) throw new Error("REPORT_NOT_FOUND");
  if (!canTransitionReportStatus(current.status, nextStatus)) {
    throw new Error(`INVALID_TRANSITION: ${current.status} -> ${nextStatus}`);
  }

  const isTerminal = nextStatus === "RESOLVED" || nextStatus === "DISMISSED";
  const { data, error } = await supabase
    .from("report")
    .update({
      status: nextStatus,
      assignee_id: assigneeId ?? undefined,
      resolved_at: isTerminal ? new Date().toISOString() : undefined,
    })
    .eq("report_id", reportId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
