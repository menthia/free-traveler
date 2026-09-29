export type MateAutoCloseStatus = "OPEN" | "CLOSED" | "HIDDEN" | "DELETED";

/**
 * 배치 작업 없이 조회 시점에 `end_date` 경과 여부를 계산해 CLOSED 상태를 파생시킨다(REQ-FUNC-037).
 * OPEN 상태의 글만 대상이며, 다른 상태(HIDDEN/DELETED/이미 CLOSED)는 그대로 반환한다.
 * DB의 실제 status 컬럼은 바꾸지 않는다 — 표시용 파생 상태만 계산한다.
 */
export function computeMatePostAutoCloseStatus(
  status: MateAutoCloseStatus,
  endDate: string,
  referenceDate: Date = new Date(),
): MateAutoCloseStatus {
  if (status !== "OPEN") return status;

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  const end = new Date(`${endDate}T00:00:00`);

  return end < today ? "CLOSED" : "OPEN";
}
