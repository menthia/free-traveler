import Link from "next/link";

const SERVICE_LINKS = [
  { href: "/", label: "여행지 탐색" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/about", label: "대표 소개" },
] as const;

const POLICY_LINKS = [
  { href: "/account", label: "이용약관" },
  { href: "/account", label: "개인정보 처리방침" },
  { href: "/account", label: "동행 안전수칙" },
  { href: "/account", label: "콘텐츠 면책 안내" },
] as const;

export default function GlobalFooter() {
  return (
    <footer className="border-t border-[#E4E0DC] bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <nav aria-label="서비스 메뉴">
            <h2 className="mb-3 text-[13px] font-medium text-[#78737A]">서비스</h2>
            <ul className="flex flex-col gap-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[#4B4749] hover:text-[#262425] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="정책 메뉴">
            <h2 className="mb-3 text-[13px] font-medium text-[#78737A]">정책</h2>
            <ul className="flex flex-col gap-2">
              {POLICY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[#4B4749] hover:text-[#262425] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-3 text-[13px] font-medium text-[#78737A]">안전·출처 고지</h2>
            <p className="text-[14px] leading-[1.5] text-[#4B4749]">
              국가별 안전정보는 외교부 해외안전여행(0404travel.go.kr)을 출처로 합니다.
            </p>
            <p className="mt-2 text-[14px] leading-[1.5] text-[#4B4749]">
              항공·숙소 조건 입력값은 서버로 전달되지 않으며, 실제 예약은 이동한 외부 사이트에서
              진행됩니다.
            </p>
          </div>
        </div>

        <p className="mt-10 border-t border-[#E4E0DC] pt-6 text-[13px] leading-[1.4] text-[#78737A]">
          © 2026 Free Traveler. 여행 정보는 참고용이며 실제 예약과 안전 판단은 각 공식 서비스에서
          확인하세요.
        </p>
      </div>
    </footer>
  );
}
