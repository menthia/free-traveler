import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * 공개(비로그인) 핵심 흐름 Smoke — E2E-001 ~ E2E-005.
 *
 * 선택자 규칙(요청 사항 그대로):
 *   1) role/label을 우선하고, 반복되는 콘텐츠 카드처럼 role만으로 특정할 수 없을 때만
 *      data-testid를 사용한다.
 *   2) 외부 사이트(FLIGHT_OUTBOUND_URL/HOTEL_OUTBOUND_URL)는 실제로 열어 내용을 검사하지
 *      않는다 — 버튼/링크의 href와 안내 문구만 확인한다.
 *   3) 이미지 출처 URL의 응답 상태(200 등)는 검사하지 않는다.
 *
 * 아래 data-testid는 이 Task가 새로 부여하는 계약이다. PAGE-SCR001/003 구현 Task는
 * 해당 Component에 이 test id를 그대로 붙여야 한다(Expected Files 안에서의 속성 추가이므로
 * "Expected Files 밖 수정"에 해당하지 않는다):
 *   - [data-testid="destination-card"]        COMP-SCR001-DESTINATION-DIRECTORY
 *   - [data-testid="mate-preview-section"]     COMP-SCR001-MATE-PREVIEW
 *   - [data-testid="flight-outbound-link"]     COMP-SCR003-FLIGHT-FORM
 *   - [data-testid="hotel-outbound-link"]      COMP-SCR003-HOTEL-FORM
 *
 * 현재 저장소에는 SCR-001만 Next.js 기본 Starter 상태이고 SCR-002~005 Page Owner는 아직
 * 구현되지 않았다(TASKS/WAVE_STATE.json 기준). 이 Spec은 해당 Task들의 Functional AC를
 * 그대로 코드화한 것이므로, 구현 전까지는 실패하는 것이 정상이다.
 */

test.describe("E2E-001 메인 페이지 추천 여행지와 주요 CTA", () => {
  test("국내·해외 추천 여행지 카드와 SCR-002~004 이동 CTA를 확인한다", async ({ page }) => {
    await page.goto("/");

    await test.step("추천 여행지 Card Grid가 최소 6개 이상 노출된다", async () => {
      const cards = page.getByTestId("destination-card");
      await expect(cards.first()).toBeVisible();
      expect(await cards.count()).toBeGreaterThanOrEqual(6);
    });

    await test.step("Hero의 여행 도구·동행 찾기 CTA가 올바른 Route로 연결된다", async () => {
      await expect(page.getByRole("link", { name: "여행 도구 살펴보기" })).toHaveAttribute(
        "href",
        "/travel-tools",
      );
      // "동행 찾기" 링크는 Header 내비게이션·Hero 보조 링크·Footer 서비스 메뉴에 모두 존재하고
      // (모두 의도된 정상 UI) 셋 다 같은 href를 가리키므로, strict mode 충돌을 피하기 위해
      // 첫 번째 일치 요소로 href만 확인한다.
      await expect(page.getByRole("link", { name: "동행 찾기" }).first()).toHaveAttribute(
        "href",
        "/mates",
      );
    });

    await test.step("최근 동행글 Section 또는 완성형 Empty State가 노출된다", async () => {
      await expect(page.getByTestId("mate-preview-section")).toBeVisible();
    });

    await test.step("대표 소개(SCR-002) 이동 CTA가 노출된다", async () => {
      await expect(page.getByRole("link", { name: "대표 소개 더 보기" })).toHaveAttribute(
        "href",
        "/about",
      );
    });
  });
});

test.describe("E2E-002 대표 소개 free_traveler / 50회 이상 / 30개국 이상", () => {
  test("free_traveler 소개와 지표(50+ Trips, 30+ Countries)를 확인한다", async ({ page }) => {
    await page.goto("/about");

    await test.step("free_traveler 대표 소개 Hero가 노출된다", async () => {
      await expect(page.getByRole("heading", { name: /free_traveler/i })).toBeVisible();
    });

    await test.step("50회 이상 여행 지표가 노출된다", async () => {
      await expect(page.getByText(/50\s*\+?\s*(Trips|회\s*이상)/i)).toBeVisible();
    });

    await test.step("30개국 이상 방문 지표가 노출된다", async () => {
      await expect(page.getByText(/30\s*\+?\s*(Countries|개국\s*이상)/i)).toBeVisible();
    });
  });
});

test.describe("E2E-003 여행 도구 항공 외부 이동 안내와 href", () => {
  test("항공 조건 입력 후 비전달 고지와 외부 이동 링크 href를 확인한다", async ({ page }) => {
    await page.goto("/travel-tools");

    await test.step("항공편 탭으로 전환한다", async () => {
      await page.getByRole("tab", { name: "항공편" }).click();
    });

    await test.step("항공 조건을 입력한다", async () => {
      await page.getByLabel("국가").selectOption({ label: "일본" });
      await page.getByLabel("지역").selectOption({ index: 1 });
      await page.getByLabel("출발일").fill("2027-03-01");
      await page.getByLabel("귀국일").fill("2027-03-05");
    });

    await test.step("비전달 고지 문구가 표시된다", async () => {
      // 폼·요약 두 곳 모두에 고지가 표시되어야 하므로(REQ-FUNC-017 AC) 2개 매치가 정상이다.
      await expect(
        page.getByText("입력값은 외부 사이트로 전달되지 않습니다").first(),
      ).toBeVisible();
    });

    await test.step("외부 이동 링크가 새 탭으로 안전하게 열리고, 입력값이 href에 담기지 않는다", async () => {
      const outboundLink = page.getByTestId("flight-outbound-link");
      await expect(outboundLink).toBeVisible();
      await expect(outboundLink).toHaveAttribute("target", "_blank");
      await expect(outboundLink).toHaveAttribute("rel", /noopener/);
      await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);

      const href = await outboundLink.getAttribute("href");
      expect(href).toBeTruthy();
      // 입력한 날짜·지역 값이 href의 쿼리·경로에 그대로 노출되지 않아야 한다(CON-01/02).
      expect(href).not.toContain("2027-03-01");
      expect(href).not.toContain("2027-03-05");
    });
  });
});

test.describe("E2E-004 여행 도구 숙소 외부 이동 안내와 href", () => {
  test("숙소 조건 입력 후 비전달 고지와 외부 이동 링크 href를 확인한다", async ({ page }) => {
    await page.goto("/travel-tools");

    await test.step("숙소 탭으로 전환한다", async () => {
      await page.getByRole("tab", { name: "숙소" }).click();
    });

    await test.step("숙소 조건을 입력한다", async () => {
      await page.getByLabel("국가").selectOption({ label: "일본" });
      await page.getByLabel("지역").selectOption({ index: 1 });
      await page.getByLabel("체크인").fill("2027-03-01");
      await page.getByLabel("체크아웃").fill("2027-03-03");
    });

    await test.step("비전달 고지 문구가 표시된다", async () => {
      await expect(
        page.getByText("입력값은 외부 사이트로 전달되지 않습니다").first(),
      ).toBeVisible();
    });

    await test.step("외부 이동 링크가 새 탭으로 안전하게 열리고, 입력값이 href에 담기지 않는다", async () => {
      const outboundLink = page.getByTestId("hotel-outbound-link");
      await expect(outboundLink).toBeVisible();
      await expect(outboundLink).toHaveAttribute("target", "_blank");
      await expect(outboundLink).toHaveAttribute("rel", /noopener/);
      await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);

      const href = await outboundLink.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toContain("2027-03-01");
      expect(href).not.toContain("2027-03-03");
    });
  });
});

test.describe("E2E-005 비로그인 동행글 작성의 로그인 안내", () => {
  test("비로그인 상태로 동행 탭에 진입하면 작성 Form 대신 로그인 안내가 노출된다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");

    await test.step("동행 구하기 탭으로 전환한다", async () => {
      await page.getByRole("tab", { name: "동행 구하기" }).click();
    });

    await test.step("작성 Form은 보이지 않고 로그인 안내 Card와 CTA가 노출된다", async () => {
      await expect(page.getByLabel("제목")).toHaveCount(0);

      const loginCta = page.getByRole("link", { name: "로그인/가입하기" });
      await expect(loginCta).toBeVisible();
      await expect(loginCta).toHaveAttribute("href", "/account");
    });
  });
});

test.describe("흐름 1: SCR-001 진입 → 필터 적용 → 여행지 Drawer 열람", () => {
  test("국가 필터를 적용한 뒤 결과 Card를 클릭하면 해당 여행지 Drawer가 열린다", async ({
    page,
  }) => {
    await page.goto("/");

    await test.step("국가 필터를 '일본'으로 적용한다", async () => {
      await page.getByLabel("국가").selectOption("일본");
    });

    await test.step("필터링된 Card를 클릭해 Drawer를 연다", async () => {
      const card = page.getByTestId("destination-card").first();
      await expect(card).toContainText("일본");
      await card.getByRole("button").first().click();
      await expect(page.getByRole("dialog")).toBeVisible();
    });

    await test.step("닫기 버튼으로 Drawer를 닫을 수 있다", async () => {
      await page.getByRole("button", { name: "닫기" }).click();
      await expect(page.getByRole("dialog")).not.toBeVisible();
    });
  });
});

test.describe("흐름 2: 해외 여행지 상세 → 안전정보 Drawer 전환", () => {
  test("해외 여행지 Drawer에서 안전정보 탭으로 전환할 수 있다", async ({ page }) => {
    await page.goto("/");

    await test.step("해외 여행지 Card를 클릭해 Drawer를 연다", async () => {
      await page.getByLabel("국가").selectOption("일본");
      await page.getByTestId("destination-card").first().getByRole("button").first().click();
      await expect(page.getByRole("dialog")).toBeVisible();
    });

    await test.step("안전정보 보기 탭으로 전환하면 안전정보 콘텐츠가 노출된다", async () => {
      await page.getByRole("tab", { name: "안전정보 보기" }).click();
      await expect(page.getByRole("tab", { name: "안전정보 보기" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      await expect(page.getByRole("heading", { name: "치안" })).toBeVisible();
    });
  });
});

test.describe("흐름 3: SCR-002 진입 → Gallery/Timeline 노출 확인", () => {
  test("대표 소개 페이지의 Gallery와 Timeline이 노출된다", async ({ page }) => {
    await page.goto("/about");

    await test.step("여행 Gallery가 노출된다", async () => {
      await expect(page.getByRole("heading", { name: "여행 Gallery" })).toBeVisible();
    });

    await test.step("여행 Timeline이 최소 6개 항목으로 노출된다", async () => {
      await expect(page.getByRole("heading", { name: "여행 Timeline" })).toBeVisible();
      const timelineItems = page.getByRole("listitem");
      expect(await timelineItems.count()).toBeGreaterThanOrEqual(6);
    });
  });
});

test.describe("흐름 4: 404 페이지 복구 행동 확인", () => {
  test("존재하지 않는 경로는 404 안내와 메인 복귀 CTA를 보여준다", async ({ page }) => {
    const response = await page.goto("/no-such-route-xyz");
    expect(response?.status()).toBe(404);

    await expect(page.getByText("페이지를 찾을 수 없습니다")).toBeVisible();
    const backHome = page.getByRole("link", { name: "메인으로 돌아가기" });
    await expect(backHome).toBeVisible();
    await backHome.click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("접근성: axe-core 자동 검사(REQ-NF-024)", () => {
  for (const route of ["/", "/about"]) {
    test(`${route} 페이지는 axe-core serious/critical 위반이 0건이다`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        // 브랜드 코럴색(#FF6A4D, design-reference/D-001/DESIGN.md §1 Color Token — Status:
        // LOCKED)이 흰 배경/흰 텍스트 조합에서 WCAG AA 4.5:1 명암대비를 충족하지 못한다
        // (실측 2.82:1). 색상 값 자체를 바꾸는 디자인 결정은 이 E2E 테스트 Task의 범위를
        // 벗어나므로, 사용자 승인에 따라 알려진 한계로 남기고 color-contrast만 제외한다.
        // 다른 접근성 규칙(ARIA, 포커스, 레이블 등)은 그대로 검사한다.
        .disableRules(["color-contrast"])
        .analyze();
      const seriousOrCritical = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(
        seriousOrCritical,
        seriousOrCritical.map((v) => `${v.id}: ${v.description}`).join("\n"),
      ).toHaveLength(0);
    });
  }
});
