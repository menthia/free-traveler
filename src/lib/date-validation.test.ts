import { describe, expect, it } from "vitest";
import { validateDateRange } from "./date-validation";

function daysFromToday(offset: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  // toISOString()은 UTC 기준이라 로컬 타임존에 따라 날짜가 하루 어긋날 수 있어 사용하지 않는다.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

describe("validateDateRange", () => {
  it("과거 출발일/체크인은 PAST_DATE로 차단한다", () => {
    const result = validateDateRange(daysFromToday(-1), daysFromToday(5));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("PAST_DATE");
  });

  it("과거 종료일(귀국일/체크아웃)도 PAST_DATE로 차단한다", () => {
    const result = validateDateRange(daysFromToday(-5), daysFromToday(-1));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("PAST_DATE");
  });

  it("귀국일이 출발일보다 빠르면(역전) REVERSED_RANGE로 차단한다", () => {
    const result = validateDateRange(daysFromToday(10), daysFromToday(5));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("REVERSED_RANGE");
  });

  it("기본값(allowSameDay 미지정)은 체크인=체크아웃을 SAME_DAY_NOT_ALLOWED로 차단한다", () => {
    const same = daysFromToday(3);
    const result = validateDateRange(same, same);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("SAME_DAY_NOT_ALLOWED");
  });

  it("allowSameDay: true면 출발일=귀국일(당일 왕복)을 허용한다", () => {
    const same = daysFromToday(3);
    const result = validateDateRange(same, same, { allowSameDay: true });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("오늘 날짜는 과거로 취급하지 않는다(경계값)", () => {
    const today = daysFromToday(0);
    const tomorrow = daysFromToday(1);
    const result = validateDateRange(today, tomorrow);
    expect(result.valid).toBe(true);
  });

  it("올바르지 않은 날짜 형식은 INVALID_FORMAT만 반환한다", () => {
    const result = validateDateRange("2027/01/01", "2027-01-05");
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(["INVALID_FORMAT"]);
  });

  it("정상 범위(출발일 < 귀국일, 둘 다 미래)는 유효하다", () => {
    const result = validateDateRange(daysFromToday(5), daysFromToday(10));
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("과거+역전이 동시에 발생하면 두 에러 코드를 모두 반환한다", () => {
    const result = validateDateRange(daysFromToday(-1), daysFromToday(-5));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("PAST_DATE");
    expect(result.errors).toContain("REVERSED_RANGE");
  });
});
