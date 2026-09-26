export type DateRangeErrorCode =
  "INVALID_FORMAT" | "PAST_DATE" | "REVERSED_RANGE" | "SAME_DAY_NOT_ALLOWED";

export interface DateRangeValidationResult {
  valid: boolean;
  errors: DateRangeErrorCode[];
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string): Date | null {
  if (!DATE_RE.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * 항공 출발/귀국일 또는 숙소 체크인/체크아웃일의 경계값을 검증하는 순수 함수.
 * - 과거 날짜, 역전된 범위(종료일이 시작일보다 앞섬)를 판정한다.
 * - `allowSameDay`가 false(기본값)면 시작일과 종료일이 같은 경우도 오류로 판정한다
 *   (숙소 체크인=체크아웃처럼 최소 1박이 필요한 경우).
 */
export function validateDateRange(
  startDateStr: string,
  endDateStr: string,
  options: { allowSameDay?: boolean } = {},
): DateRangeValidationResult {
  const errors: DateRangeErrorCode[] = [];
  const allowSameDay = options.allowSameDay ?? false;

  const start = parseDate(startDateStr);
  const end = parseDate(endDateStr);

  if (!start || !end) {
    return { valid: false, errors: ["INVALID_FORMAT"] };
  }

  const today = startOfToday();
  if (start < today || end < today) {
    errors.push("PAST_DATE");
  }
  if (end < start) {
    errors.push("REVERSED_RANGE");
  }
  if (!allowSameDay && end.getTime() === start.getTime()) {
    errors.push("SAME_DAY_NOT_ALLOWED");
  }

  return { valid: errors.length === 0, errors };
}
