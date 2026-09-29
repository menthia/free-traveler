import { expect, test, type Page } from "@playwright/test";

/**
 * SCR-003/004/005 동행 인증 흐름 E2E(흐름 7). 회원가입은 실제 이메일 발송(가입 확인/재설정)을
 * 유발하므로 이 테스트에서는 사용하지 않는다 — `supabase/seed.sql`이 만든 시드 계정
 * (member1/member2, 둘 다 성인 확인 완료 상태)으로 로그인해 흐름을 재현한다. 참가 요청은
 * 본인 글에 보낼 수 없어(OWNER_CANNOT_APPLY) 작성자(member1)와 신청자(member2) 두 세션을
 * 순차로 전환하며 하나의 시나리오로 이어 붙인다(로그인 → 성인확인 확인 → 동행글 작성(연락처
 * 차단 케이스 포함) → 참가 요청 → 작성자 승인 → 신고/차단). Chromium 단일 브라우저로만 실행한다.
 *
 * `supabase/seed.sql`을 실행하지 않은 환경에서는 로그인 자체가 실패하므로, 이 테스트는
 * 시드 계정이 없으면 안내와 함께 스킵한다.
 */

const SEED_PASSWORD = "SeedPass!1234";
const MEMBER1_EMAIL = "seed.member1@example.com";
const MEMBER2_EMAIL = "seed.member2@example.com";

async function login(page: Page, email: string) {
  await page.goto("/account");
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(SEED_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByRole("tab", { name: "프로필" })).toBeVisible({ timeout: 10000 });
}

async function logout(page: Page) {
  await page.getByRole("button", { name: "로그아웃" }).click();
  await expect(page.getByRole("tab", { name: "로그인" })).toBeVisible({ timeout: 10000 });
}

let seedAvailable = true;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto("/account");
  await page.getByLabel("이메일").fill(MEMBER1_EMAIL);
  await page.getByLabel("비밀번호").fill(SEED_PASSWORD);
  await page.getByRole("button", { name: "로그인" }).click();
  try {
    await expect(page.getByRole("tab", { name: "프로필" })).toBeVisible({ timeout: 8000 });
  } catch {
    seedAvailable = false;
    console.warn(
      "[E2E-MATE-AUTH] 시드 계정으로 로그인하지 못했습니다 — supabase/seed.sql을 라이브 " +
        "프로젝트에 먼저 적용해야 이 테스트를 실행할 수 있습니다. 이번 실행은 스킵합니다.",
    );
  }
  await page.close();
});

test.describe("흐름 7: 로그인 → 성인확인 → 동행글 작성(연락처 차단) → 참가 요청 → 승인 → 신고/차단", () => {
  test.skip(() => !seedAvailable, "supabase/seed.sql 시드 계정이 없어 스킵합니다.");

  test("member1(작성자)로 로그인해 성인 확인 상태를 확인하고 동행글을 작성한다", async ({
    page,
  }) => {
    const postTitle = `E2E 동행 모집 ${Date.now()}`;

    await test.step("로그인한다(회원가입은 이메일 발송을 유발하므로 사용하지 않는다)", async () => {
      await login(page, MEMBER1_EMAIL);
    });

    await test.step("프로필 탭에서 성인 확인이 이미 완료 상태임을 확인한다", async () => {
      await expect(page.getByText("성인 확인 완료")).toBeVisible();
    });

    await test.step("동행 탭에서 연락처가 포함된 내용은 제출이 차단된다", async () => {
      await page.goto("/travel-tools");
      await page.getByRole("tab", { name: "동행 구하기" }).click();
      await page.getByLabel("제목").fill(postTitle);
      await page.getByLabel("국가").selectOption("일본");
      await page.getByLabel("시작일").fill("2027-07-01");
      await page.getByLabel("종료일").fill("2027-07-05");
      await page.getByLabel("모집 인원").fill("2");
      await page.getByLabel("상세 설명(선택)").fill("연락은 카카오톡 tripmate2026 로 주세요.");
      await expect(page.getByText("전화번호·이메일·메신저 ID로 의심되는 내용")).toBeVisible();
      await expect(page.getByRole("button", { name: "동행 모집글 게시하기" })).toBeDisabled();
    });

    await test.step("연락처를 지우고 안전수칙에 동의하면 게시할 수 있다", async () => {
      await page.getByLabel("상세 설명(선택)").fill("함께 여행할 동행을 구합니다.");
      await page.locator('input[type="checkbox"]').check();
      const submit = page.getByRole("button", { name: "동행 모집글 게시하기" });
      await expect(submit).toBeEnabled();
      await submit.click();
      await expect(page.getByText("동행 모집글이 게시되었습니다.")).toBeVisible({
        timeout: 10000,
      });
    });

    await test.step("로그아웃한다", async () => {
      await logout(page);
    });

    await test.step("member2(신청자)로 로그인해 방금 게시된 글에 참가 요청을 보낸다", async () => {
      await login(page, MEMBER2_EMAIL);
      await page.goto("/mates");
      await page.getByLabel("국가").selectOption("일본");

      const card = page.getByTestId("mate-post-card").filter({ hasText: postTitle });
      await expect(card).toBeVisible({ timeout: 10000 });
      await card.click();

      await page.getByLabel(/참가 요청 메시지/).fill("같이 여행하고 싶습니다. 잘 부탁드려요!");
      await page.getByRole("button", { name: "참가 요청 보내기" }).click();
      await expect(page.getByText("참가 요청을 보냈습니다.")).toBeVisible({ timeout: 10000 });
    });

    await test.step("같은 글을 신고하고, 작성자를 차단했다가 다시 해제한다", async () => {
      await page.getByRole("button", { name: "신고하기" }).click();
      await page.getByLabel("신고 사유").selectOption("SCAM");
      await page.getByLabel("상세 설명(선택)").fill("E2E 테스트 신고입니다.");
      await page.getByRole("button", { name: "신고 접수하기" }).click();
      await expect(page.getByText(/접수 번호:/)).toBeVisible({ timeout: 10000 });

      const blockButton = page.getByRole("button", { name: "차단하기" });
      await expect(blockButton).toBeVisible({ timeout: 10000 });
      await blockButton.click();
      await expect(page.getByRole("button", { name: "차단 해제" })).toBeVisible({
        timeout: 10000,
      });

      // 테스트 부작용 복구 — 다음 실행에 영향을 주지 않도록 차단을 즉시 해제한다.
      await page.getByRole("button", { name: "차단 해제" }).click();
      await expect(blockButton).toBeVisible({ timeout: 10000 });
    });

    await test.step("로그아웃한다", async () => {
      await logout(page);
    });

    await test.step("member1(작성자)로 다시 로그인해 참가 요청을 승인한다", async () => {
      await login(page, MEMBER1_EMAIL);
      await page.goto("/mates");
      await page.getByLabel("국가").selectOption("일본");

      const card = page.getByTestId("mate-post-card").filter({ hasText: postTitle });
      await card.click();

      await expect(page.getByText("참가 요청")).toBeVisible();
      await page.getByRole("button", { name: "승인" }).click();
      await expect(page.getByText("대기 중인 참가 요청이 없습니다.")).toBeVisible({
        timeout: 10000,
      });
    });

    await test.step("로그아웃한다", async () => {
      await logout(page);
    });
  });
});
