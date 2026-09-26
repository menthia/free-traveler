import { expect, test, type Page } from "@playwright/test";

/**
 * 인증이 필요한 핵심 흐름 골격 — E2E-006 ~ E2E-007.
 *
 * 이 Spec은 Supabase에 미리 시드된(DB-SEED-BASE) 테스트 계정 자격 증명이 있어야
 * 실행할 수 있다. 아래 두 환경변수 중 하나라도 없으면 파일 전체를 명시적으로 skip한다
 * (조용히 실패시키지 않고 "왜 건너뛰었는지"를 리포터에 남긴다):
 *   - E2E_TEST_USER_EMAIL
 *   - E2E_TEST_USER_PASSWORD
 *
 * 아래 로직은 "골격"이다 — PAGE-SCR003/PAGE-SCR004/PAGE-SCR005가 실제로 구현되면
 * TODO로 표시한 지점의 정확한 문구·역할 이름을 그 구현에 맞춰 확정해야 한다.
 */

const TEST_EMAIL = process.env.E2E_TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.E2E_TEST_USER_PASSWORD;

test.skip(
  !TEST_EMAIL || !TEST_PASSWORD,
  "인증 환경변수(E2E_TEST_USER_EMAIL/E2E_TEST_USER_PASSWORD)가 없어 Auth Smoke를 건너뜁니다.",
);

async function loginAsSeededTestUser(page: Page) {
  await page.goto("/account");
  await page.getByLabel("이메일").fill(TEST_EMAIL!);
  await page.getByLabel("비밀번호").fill(TEST_PASSWORD!);
  await page.getByRole("button", { name: "로그인" }).click();
  // TODO(PAGE-SCR005 구현 후 확정): 로그인 성공을 나타내는 정확한 accessible name으로 교체.
  await expect(page.getByRole("tab", { name: "프로필" })).toBeVisible();
}

test.describe("E2E-006 로그인 사용자의 동행글 작성과 목록·상세 확인", () => {
  test("동행글을 작성하면 목록과 상세에서 확인할 수 있다", async ({ page }) => {
    const uniqueTitle = `E2E-006 테스트 동행 ${Date.now()}`;

    await loginAsSeededTestUser(page);

    await test.step("여행 도구 > 동행 구하기 탭에서 모집글을 작성한다", async () => {
      await page.goto("/travel-tools");
      await page.getByRole("tab", { name: "동행 구하기" }).click();

      await page.getByLabel("제목").fill(uniqueTitle);
      await page.getByLabel("국가").selectOption({ label: "일본" });
      await page.getByLabel("지역").selectOption({ index: 1 });
      await page.getByLabel("시작일").fill("2027-04-01");
      await page.getByLabel("종료일").fill("2027-04-05");
      await page.getByLabel("모집 인원").fill("3");
      // TODO(COMP-SCR003-MATE-COMPOSE 구현 후 확정): 여행 스타일/선호 조건 입력 방식(select vs checkbox).
      await page
        .getByLabel("상세 설명")
        .fill("E2E 테스트용 동행 모집글입니다. 연락처는 적지 않습니다.");
      await page.getByLabel("안전수칙에 동의합니다").check();

      await page.getByRole("button", { name: "게시하기" }).click();
      // 실제 이메일 발송 없이 화면 내 Toast/상태로만 접수를 알린다(PROJECT_SCOPE.md §3).
      await expect(page.getByText(/게시(가|를) 완료|등록되었습니다/)).toBeVisible();
    });

    await test.step("동행 목록(SCR-004)에서 방금 쓴 글을 확인한다", async () => {
      await page.goto("/mates");
      await expect(page.getByRole("link", { name: uniqueTitle })).toBeVisible();
    });

    await test.step("상세 패널에서 같은 글을 다시 확인한다", async () => {
      await page.getByRole("link", { name: uniqueTitle }).click();
      await expect(page.getByRole("heading", { name: uniqueTitle })).toBeVisible();
    });
  });
});

test.describe("E2E-007 동행글 신청과 계정 화면의 내 활동 확인", () => {
  test("동행글에 참가 요청을 보내면 계정의 내 활동에서 확인할 수 있다", async ({ page }) => {
    await loginAsSeededTestUser(page);

    await test.step("동행 목록에서 글 하나를 열어 참가를 요청한다", async () => {
      await page.goto("/mates");
      // TODO(COMP-SCR004-POST-LIST 구현 후 확정): 첫 번째 카드를 여는 안정적인 선택자로 교체.
      await page.getByRole("link").first().click();

      await page.getByRole("button", { name: "참가 요청 보내기" }).click();
      await page.getByLabel("참가 메시지").fill("함께 여행하고 싶습니다. (E2E-007 테스트)");
      await page.getByRole("button", { name: "요청 보내기" }).click();

      await expect(page.getByText(/요청(이|을) 접수되었습니다/)).toBeVisible();
    });

    await test.step("계정 화면의 내 활동에서 보낸 참가 요청 상태를 확인한다", async () => {
      await page.goto("/account");
      await page.getByRole("tab", { name: "내 활동" }).click();

      // TODO(COMP-SCR005-MY-ACTIVITY 구현 후 확정): 상태 배지의 정확한 문구.
      await expect(page.getByText(/대기|검토 중/)).toBeVisible();
    });
  });
});
