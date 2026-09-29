"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/", label: "여행지" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/about", label: "대표 소개" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * 로그인 상태를 반영하는 계정 버튼(DESIGN.md §6: "비로그인 '로그인' / 로그인 시 닉네임+
 * 아바타 이니셜"). GlobalHeader는 5개 Screen 공통이라 세션 유무를 여기서 직접 조회한다.
 */
function useAccountNickname() {
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function loadNickname() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setNickname(null);
        return;
      }
      const { data: profile } = await supabase
        .from("user_profile")
        .select("nickname")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) setNickname(profile?.nickname ?? null);
    }

    // 마운트 시 1회 세션 조회 + 로그인/로그아웃 이벤트 발생 시 재조회하는 구독이다.
    loadNickname();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadNickname();
    });
    // ProfileSummaryCard가 닉네임 저장에 성공하면 이 이벤트를 발생시킨다(§ProfileSummaryCard
    // 참고 — 헤더가 로그인/로그아웃 시점에만 갱신되어 저장 직후 반영되지 않는 문제가 있었다).
    window.addEventListener("ft:nickname-updated", loadNickname);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      window.removeEventListener("ft:nickname-updated", loadNickname);
    };
  }, []);

  return nickname;
}

export default function GlobalHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nickname = useAccountNickname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E4E0DC] bg-white">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-5 md:h-[72px] md:px-8">
        <Link
          href="/"
          className="rounded text-[17px] font-semibold leading-[1.4] text-[#262425] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
        >
          Free Traveler
        </Link>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded pb-1 text-[16px] font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D] ${
                  active
                    ? "border-b-2 border-[#FF6A4D] text-[#262425]"
                    : "border-b-2 border-transparent text-[#262425] hover:text-[#4B4749]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/account"
          className="hidden min-h-[44px] items-center gap-2 rounded-[10px] px-4 text-[16px] font-semibold text-[#262425] hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D] md:flex"
        >
          {nickname ? (
            <>
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6A4D] text-[14px] font-semibold text-white"
              >
                {nickname.charAt(0).toUpperCase()}
              </span>
              {nickname}
            </>
          ) : (
            "로그인"
          )}
        </Link>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="global-mobile-menu"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-[10px] text-[#262425] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D] md:hidden"
        >
          <span className="sr-only">전체 메뉴</span>
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {isMenuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="global-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="전체 메뉴"
          className="fixed inset-0 top-14 z-30 flex flex-col bg-white px-5 py-6 md:hidden"
        >
          <Link
            href="/account"
            onClick={() => setIsMenuOpen(false)}
            className="mb-6 flex min-h-[44px] items-center gap-2 rounded-[10px] bg-[#F7F6F4] px-4 text-[16px] font-semibold text-[#262425] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
          >
            {nickname ? (
              <>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6A4D] text-[14px] font-semibold text-white"
                >
                  {nickname.charAt(0).toUpperCase()}
                </span>
                {nickname}
              </>
            ) : (
              "로그인 / 계정"
            )}
          </Link>
          <nav aria-label="전체 메뉴 내비게이션" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex min-h-[44px] items-center rounded-[10px] px-4 text-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D] ${
                    active ? "font-semibold text-[#FF6A4D]" : "font-normal text-[#262425]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
