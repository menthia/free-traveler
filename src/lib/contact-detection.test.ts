import { describe, expect, it } from "vitest";
import { containsContactPattern, detectContactPatterns } from "./contact-detection";

// 연락처(전화번호·이메일·메신저 ID)가 포함된 문장 — 모두 탐지되어야 한다.
const POSITIVE_SAMPLES = [
  "연락은 010-1234-5678로 주세요.",
  "번호는 01012345678 입니다.",
  "010 1234 5678로 전화 주세요.",
  "+82 10-1234-5678 국제전화 가능합니다.",
  "이메일은 traveler.friend@gmail.com 입니다.",
  "메일 보내주세요: mate_2026+trip@example.co.kr",
  "카카오톡 아이디는 travelmate2026 입니다.",
  "카톡 id: hello_world123",
  "텔레그램 아이디 abcTravel99",
  "라인 아이디: linefriend01",
  "라인 id linefriend02",
  "디스코드 mate#discord123",
  "instagram id: mytravelgram",
  "인스타 아이디 travel_daily",
  "인스타그램: gogo_travel",
  "위챗 아이디 wechat_user1",
  "whatsapp: wa12345",
  "what's app 대신 whatsapp id waid77",
  "연락처: 010-9999-8888 / 이메일 also@ok.com",
  "궁금하면 카카오톡 tripmate2026 로 연락주세요",
];

// 연락처가 전혀 없는 정상적인 동행 모집글/설명 문장 — 오탐(false positive)이 없어야 한다.
const NEGATIVE_SAMPLES = [
  "다음 주에 제주도로 3박 4일 여행 갈 동행을 구합니다.",
  "20대 여성이며 사진 찍는 것을 좋아합니다.",
  "아침 일찍 출발해서 성산일출봉부터 들를 예정입니다.",
  "숙소는 이미 예약했고 렌트카만 같이 나눠서 타실 분 구해요.",
  "여행 스타일은 자연·힐링이고 활동적인 일정은 선호하지 않습니다.",
  "총 4명이서 함께 움직일 예정이며 남는 자리는 2자리입니다.",
  "맛집 위주로 다닐 예정이고 계획은 유동적으로 조율 가능합니다.",
  "부산에서 서울로 올라오시는 분과 동행하고 싶습니다.",
  "1월 10일부터 1월 15일까지 일정입니다.",
  "여행 경비는 숙소비 제외하고 1인당 10만원 예상됩니다.",
  "안전을 위해 공공장소에서 첫 만남을 가지려 합니다.",
  "동행 신청 시 간단한 자기소개 부탁드립니다.",
  "역사 탐방과 문화 유적지 위주로 다닐 계획입니다.",
  "국내 여행이라 준비물은 크게 없습니다.",
  "일정은 대략 오전 9시부터 오후 6시까지입니다.",
  "게스트하우스에서 도미토리로 묵을 예정입니다.",
  "짐은 최소화해서 백팩 하나로 다닐 예정입니다.",
  "현지 교통은 대중교통을 이용할 계획입니다.",
  "날씨가 좋으면 등산도 같이 하고 싶습니다.",
  "동행 여부는 이번 주말까지 알려주시면 감사하겠습니다.",
];

describe("contact-detection", () => {
  it("연락처가 포함된 문장의 탐지율이 95% 이상이다", () => {
    const detectedCount = POSITIVE_SAMPLES.filter((text) => containsContactPattern(text)).length;
    const detectionRate = detectedCount / POSITIVE_SAMPLES.length;
    expect(detectionRate).toBeGreaterThanOrEqual(0.95);
  });

  it("연락처가 없는 정상 문장의 오탐률이 5% 이하다", () => {
    const falsePositiveCount = NEGATIVE_SAMPLES.filter((text) =>
      containsContactPattern(text),
    ).length;
    const falsePositiveRate = falsePositiveCount / NEGATIVE_SAMPLES.length;
    expect(falsePositiveRate).toBeLessThanOrEqual(0.05);
  });

  it("전화번호 패턴은 type: 'phone'으로 분류된다", () => {
    const matches = detectContactPatterns("010-1234-5678로 연락주세요.");
    expect(matches.some((m) => m.type === "phone")).toBe(true);
  });

  it("이메일 패턴은 type: 'email'로 분류된다", () => {
    const matches = detectContactPatterns("mail@test.com 으로 보내주세요.");
    expect(matches.some((m) => m.type === "email")).toBe(true);
  });

  it("메신저 ID 패턴은 type: 'messenger'로 분류된다", () => {
    const matches = detectContactPatterns("카카오톡 아이디는 abc123 입니다.");
    expect(matches.some((m) => m.type === "messenger")).toBe(true);
  });

  it("연락처가 없으면 빈 배열을 반환한다", () => {
    expect(detectContactPatterns("동행 구합니다. 잘 부탁드려요.")).toHaveLength(0);
  });
});
