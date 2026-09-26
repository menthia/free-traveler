import type { Metadata } from "next";

const SITE_NAME = "Free Traveler";
const SITE_URL = "https://free-traveler.example.com";

export type ScreenId = "SCR-001" | "SCR-002" | "SCR-003" | "SCR-004" | "SCR-005";

interface ScreenSeoConfig {
  route: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

const SCREEN_SEO_CONFIG: Record<ScreenId, ScreenSeoConfig> = {
  "SCR-001": {
    route: "/",
    title: "Free Traveler — 여행지 탐색과 동행 찾기",
    description:
      "국내외 인기 여행지, 국가별 안전정보, 최근 동행 모집글을 한눈에 살펴보는 여행 준비 허브.",
    ogTitle: "Free Traveler",
    ogDescription: "여행지 탐색, 안전정보, 동행 찾기를 한 곳에서.",
  },
  "SCR-002": {
    route: "/about",
    title: "대표 소개 — free_traveler | Free Traveler",
    description: "50회 이상, 30개국 이상을 여행한 free_traveler의 소개와 여행 이야기.",
    ogTitle: "free_traveler 대표 소개",
    ogDescription: "50+ Trips, 30+ Countries. free_traveler의 여행 철학과 기록.",
  },
  "SCR-003": {
    route: "/travel-tools",
    title: "여행 준비 — 항공·숙소·동행 | Free Traveler",
    description: "항공·숙소 조건을 정리하고 외부 사이트로 이동하거나 동행을 구하는 여행 준비 도구.",
    ogTitle: "여행 준비 도구",
    ogDescription: "항공·숙소 조건 정리와 동행 모집을 한 화면에서.",
  },
  "SCR-004": {
    route: "/mates",
    title: "동행 찾기 | Free Traveler",
    description: "국가·지역·기간별로 동행 모집글을 찾아보고 참가를 요청하세요.",
    ogTitle: "동행 찾기",
    ogDescription: "함께 떠날 여행 동행을 찾아보세요.",
  },
  "SCR-005": {
    route: "/account",
    title: "계정 | Free Traveler",
    description: "로그인, 프로필, 내 활동, 관리자 기능을 확인하는 계정 화면.",
    ogTitle: "계정",
    ogDescription: "Free Traveler 계정과 내 활동을 관리하세요.",
  },
};

/**
 * Screen ID로 해당 화면의 Next.js Metadata(title/description/canonical/OG)를 생성한다.
 * 필수 필드(title/description/canonical)가 비어 있으면 개발 환경에서 콘솔 경고를 출력한다.
 */
export function buildScreenMetadata(screenId: ScreenId): Metadata {
  const config = SCREEN_SEO_CONFIG[screenId];
  const canonical = new URL(config.route, SITE_URL).toString();

  if (process.env.NODE_ENV !== "production") {
    const missing = (["title", "description"] as const).filter((field) => !config[field]);
    if (missing.length > 0 || !canonical) {
      console.warn(`[seo] ${screenId}: 필수 메타 필드 누락 — ${missing.join(", ") || "canonical"}`);
    }
  }

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: config.route,
    },
    openGraph: {
      title: config.ogTitle,
      description: config.ogDescription,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}
