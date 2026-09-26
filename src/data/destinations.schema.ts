export type DestinationRegion = "domestic" | "overseas";

export type TravelTheme = "자연" | "도심" | "휴양" | "역사" | "미식" | "액티비티" | "문화예술";

export interface DestinationImage {
  /** 실제 이미지 URL(라이선스·작가 메타데이터는 관리하지 않는다). */
  url: string;
  /** 실제 장소를 설명하는 대체 텍스트. */
  alt: string;
  /** 이미지 출처 URL. */
  sourceUrl: string;
}

export interface DestinationBudget {
  /** 1인 1일 기준, 원화 환산 대략적인 예산 범위. */
  currency: "KRW";
  budgetPerDay: string;
  midRangePerDay: string;
  luxuryPerDay: string;
}

export interface DestinationSource {
  name: string;
  url: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: DestinationRegion;
  /** 해외 여행지의 경우 SCR-001 Safety Card Grid와 연결되는 안전정보 국가 키(src/data/safety.ts의 id와 일치). */
  safetyCountryId?: string;
  themes: TravelTheme[];
  /** 300자 이상 소개문. */
  intro: string;
  /** 5개 이상 명소. */
  attractions: string[];
  bestSeason: string;
  oneDayItinerary: string[];
  threeDayItinerary: string[];
  budget: DestinationBudget;
  transport: string;
  /** 3개 이상 음식. */
  food: string[];
  /** 3개 이상 여행 에티켓. */
  etiquette: string[];
  /** 1개 이상 출처. */
  sources: DestinationSource[];
  /** 콘텐츠 최종 확인/수정일(ISO 8601). */
  updatedAt: string;
  image: DestinationImage;
}
