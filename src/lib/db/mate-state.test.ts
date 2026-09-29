import { describe, expect, it } from "vitest";
import { canTransitionApplicationStatus } from "@/lib/db/applications";
import { canTransitionMatePostStatus, deriveMatePostDisplayStatus } from "@/lib/db/mates";

function daysFromToday(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

describe("deriveMatePostDisplayStatus (REQ-FUNC-037 — 배치 없는 조회 시 자동 마감 계산)", () => {
  it("OPEN이고 종료일이 미래면 OPEN을 유지한다", () => {
    expect(deriveMatePostDisplayStatus({ status: "OPEN", end_date: daysFromToday(3) })).toBe(
      "OPEN",
    );
  });

  it("OPEN이고 종료일이 오늘이면 아직 OPEN이다(경계값, 자정 이전)", () => {
    expect(deriveMatePostDisplayStatus({ status: "OPEN", end_date: daysFromToday(0) })).toBe(
      "OPEN",
    );
  });

  it("OPEN이고 종료일이 과거면 자동으로 CLOSED로 파생시킨다", () => {
    expect(deriveMatePostDisplayStatus({ status: "OPEN", end_date: daysFromToday(-1) })).toBe(
      "CLOSED",
    );
  });

  it("이미 CLOSED(수동 마감)면 종료일과 무관하게 CLOSED를 유지한다", () => {
    expect(deriveMatePostDisplayStatus({ status: "CLOSED", end_date: daysFromToday(5) })).toBe(
      "CLOSED",
    );
  });

  it("HIDDEN/DELETED는 종료일과 무관하게 원래 상태를 그대로 반환한다", () => {
    expect(deriveMatePostDisplayStatus({ status: "HIDDEN", end_date: daysFromToday(-10) })).toBe(
      "HIDDEN",
    );
    expect(deriveMatePostDisplayStatus({ status: "DELETED", end_date: daysFromToday(-10) })).toBe(
      "DELETED",
    );
  });
});

describe("canTransitionMatePostStatus (동행글 상태 전이 허용 규칙)", () => {
  it("OPEN에서 CLOSED(수동 마감)/HIDDEN/DELETED로 전이할 수 있다", () => {
    expect(canTransitionMatePostStatus("OPEN", "CLOSED")).toBe(true);
    expect(canTransitionMatePostStatus("OPEN", "HIDDEN")).toBe(true);
    expect(canTransitionMatePostStatus("OPEN", "DELETED")).toBe(true);
  });

  it("CLOSED에서 OPEN(재오픈)/DELETED로 전이할 수 있다", () => {
    expect(canTransitionMatePostStatus("CLOSED", "OPEN")).toBe(true);
    expect(canTransitionMatePostStatus("CLOSED", "DELETED")).toBe(true);
  });

  it("HIDDEN에서 OPEN/DELETED로 전이할 수 있다", () => {
    expect(canTransitionMatePostStatus("HIDDEN", "OPEN")).toBe(true);
    expect(canTransitionMatePostStatus("HIDDEN", "DELETED")).toBe(true);
  });

  it("DELETED는 종결 상태라 어떤 상태로도 전이할 수 없다", () => {
    expect(canTransitionMatePostStatus("DELETED", "OPEN")).toBe(false);
    expect(canTransitionMatePostStatus("DELETED", "CLOSED")).toBe(false);
    expect(canTransitionMatePostStatus("DELETED", "HIDDEN")).toBe(false);
  });

  it("OPEN에서 자기 자신(OPEN)으로는 전이를 허용하지 않는다(무의미한 전이)", () => {
    expect(canTransitionMatePostStatus("OPEN", "OPEN")).toBe(false);
  });
});

describe("canTransitionApplicationStatus (참가 요청 상태 전이 허용 규칙, REQ-FUNC-035/036)", () => {
  it("PENDING에서 ACCEPTED/REJECTED/WITHDRAWN으로 전이할 수 있다", () => {
    expect(canTransitionApplicationStatus("PENDING", "ACCEPTED")).toBe(true);
    expect(canTransitionApplicationStatus("PENDING", "REJECTED")).toBe(true);
    expect(canTransitionApplicationStatus("PENDING", "WITHDRAWN")).toBe(true);
  });

  it("ACCEPTED/REJECTED/WITHDRAWN은 모두 종결 상태라 재전이를 차단한다(중복 처리 방지)", () => {
    for (const from of ["ACCEPTED", "REJECTED", "WITHDRAWN"] as const) {
      for (const to of ["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"] as const) {
        expect(canTransitionApplicationStatus(from, to)).toBe(false);
      }
    }
  });

  it("이미 ACCEPTED인 요청을 다시 ACCEPTED/REJECTED 처리(중복 승인·거절)할 수 없다", () => {
    expect(canTransitionApplicationStatus("ACCEPTED", "ACCEPTED")).toBe(false);
    expect(canTransitionApplicationStatus("ACCEPTED", "REJECTED")).toBe(false);
  });
});
