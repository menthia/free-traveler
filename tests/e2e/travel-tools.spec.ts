import { expect, test } from "@playwright/test";

/**
 * SCR-003(`/travel-tools`) 항공·숙소 조건 입력 흐름 E2E(흐름 5·6). 입력한 국가·지역·날짜
 * 값이 어떤 네트워크 요청(URL·본문)에도 포함되지 않음을 요청을 직접 가로채 검증한다
 * (REQ-FUNC-017/REQ-NF-017, Chromium 단일 브라우저).
 */

function collectNetworkPayloads(page: import("@playwright/test").Page): string[] {
  const payloads: string[] = [];
  page.on("request", (request) => {
    payloads.push(request.url());
    const data = request.postDataJSON?.() ?? request.postData();
    if (data) payloads.push(typeof data === "string" ? data : JSON.stringify(data));
  });
  return payloads;
}

test.describe("흐름 5: 항공 탭 — 오류 확인 → 정상 입력 → 요약 → 외부 이동", () => {
  test("역전된 날짜는 오류를 표시하고, 정상 입력 후 요약과 외부 이동 링크가 노출된다", async ({
    page,
  }) => {
    const networkPayloads = collectNetworkPayloads(page);
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "항공편" }).click();

    const MARKER_REGION = "인터라켄";
    const MARKER_START = "2027-03-01";
    const MARKER_END_REVERSED = "2027-02-01"; // 출발일보다 빠른(역전) 귀국일
    const MARKER_END_VALID = "2027-03-05";

    await test.step("국가/지역을 선택한다", async () => {
      await page.getByLabel("국가").selectOption("스위스");
      await page.getByLabel("지역").selectOption({ label: MARKER_REGION });
    });

    await test.step("귀국일이 출발일보다 빠르면 검증 오류가 표시되고 요약이 뜨지 않는다", async () => {
      await page.getByLabel("출발일").fill(MARKER_START);
      await page.getByLabel("귀국일").fill(MARKER_END_REVERSED);
      await expect(page.getByText("귀국일은 출발일보다 늦어야 합니다")).toBeVisible();
      await expect(page.getByText("항공 조건 요약")).not.toBeVisible();
    });

    await test.step("귀국일을 정상 값으로 고치면 오류가 사라지고 요약이 자동으로 표시된다", async () => {
      await page.getByLabel("귀국일").fill(MARKER_END_VALID);
      await expect(page.getByText("귀국일은 출발일보다 늦어야 합니다")).not.toBeVisible();
      await expect(page.getByText("항공 조건 요약")).toBeVisible();
      await expect(page.getByRole("definition").filter({ hasText: MARKER_REGION })).toBeVisible();
    });

    await test.step("외부 이동 링크는 새 탭(target=_blank, noopener/noreferrer)으로 연결된다", async () => {
      const outboundLink = page.getByTestId("flight-outbound-link");
      await expect(outboundLink).toBeVisible();
      await expect(outboundLink).toHaveAttribute("target", "_blank");
      await expect(outboundLink).toHaveAttribute("rel", /noopener/);
      await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);
    });

    await test.step("입력한 지역·날짜 값이 어떤 네트워크 요청 URL·본문에도 포함되지 않는다", async () => {
      const leaked = networkPayloads.filter(
        (p) =>
          p.includes(MARKER_REGION) ||
          p.includes(MARKER_START) ||
          p.includes(MARKER_END_VALID) ||
          p.includes(encodeURIComponent(MARKER_REGION)),
      );
      expect(leaked, `유출된 요청: ${leaked.join("\n")}`).toHaveLength(0);
    });
  });
});

test.describe("흐름 6: 숙소 탭 — 오류 확인 → 정상 입력 → 요약 → 외부 이동", () => {
  test("체크인=체크아웃은 오류를 표시하고, 정상 입력 후 요약과 외부 이동 링크가 노출된다", async ({
    page,
  }) => {
    const networkPayloads = collectNetworkPayloads(page);
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "숙소" }).click();

    const MARKER_REGION = "오사카";
    const MARKER_CHECK_IN = "2027-04-01";
    const MARKER_CHECK_OUT_INVALID = "2027-04-01"; // 체크인과 동일(허용 안 됨)
    const MARKER_CHECK_OUT_VALID = "2027-04-04";

    await test.step("국가/지역을 선택한다", async () => {
      await page.getByLabel("국가").selectOption("일본");
      await page.getByLabel("지역").selectOption({ label: MARKER_REGION });
    });

    await test.step("체크인=체크아웃이면 검증 오류가 표시되고 요약이 뜨지 않는다", async () => {
      await page.getByLabel("체크인").fill(MARKER_CHECK_IN);
      await page.getByLabel("체크아웃").fill(MARKER_CHECK_OUT_INVALID);
      await expect(page.getByText("체크아웃일은 체크인일과 같을 수 없습니다")).toBeVisible();
      await expect(page.getByText("숙소 조건 요약")).not.toBeVisible();
    });

    await test.step("체크아웃을 정상 값으로 고치면 오류가 사라지고 요약이 자동으로 표시된다", async () => {
      await page.getByLabel("체크아웃").fill(MARKER_CHECK_OUT_VALID);
      await expect(page.getByText("체크아웃일은 체크인일과 같을 수 없습니다")).not.toBeVisible();
      await expect(page.getByText("숙소 조건 요약")).toBeVisible();
      await expect(page.getByRole("definition").filter({ hasText: MARKER_REGION })).toBeVisible();
    });

    await test.step("외부 이동 링크는 새 탭(target=_blank, noopener/noreferrer)으로 연결된다", async () => {
      const outboundLink = page.getByTestId("hotel-outbound-link");
      await expect(outboundLink).toBeVisible();
      await expect(outboundLink).toHaveAttribute("target", "_blank");
      await expect(outboundLink).toHaveAttribute("rel", /noopener/);
      await expect(outboundLink).toHaveAttribute("rel", /noreferrer/);
    });

    await test.step("입력한 지역·날짜 값이 어떤 네트워크 요청 URL·본문에도 포함되지 않는다", async () => {
      const leaked = networkPayloads.filter(
        (p) =>
          p.includes(MARKER_REGION) ||
          p.includes(MARKER_CHECK_IN) ||
          p.includes(MARKER_CHECK_OUT_VALID) ||
          p.includes(encodeURIComponent(MARKER_REGION)),
      );
      expect(leaked, `유출된 요청: ${leaked.join("\n")}`).toHaveLength(0);
    });
  });
});
