export interface RepresentativeImage {
  url: string;
  alt: string;
  sourceUrl: string;
}

export interface RepresentativeStats {
  trips: number;
  countries: number;
  regions: number;
}

export interface RepresentativeTimelineEntry {
  year: string;
  title: string;
  description: string;
}

export type WorldRegion = "아시아" | "유럽" | "오세아니아" | "아메리카";

export interface VisitedCountry {
  region: WorldRegion;
  country: string;
}

export interface MemorableDestination {
  name: string;
  country: string;
  description: string;
  image: RepresentativeImage;
}

export interface ContactLink {
  label: string;
  url: string;
}

export interface RepresentativeProfile {
  name: string;
  handle: string;
  tagline: string;
  stats: RepresentativeStats;
  intro: string;
  philosophy: string;
  timeline: RepresentativeTimelineEntry[];
  visitedCountries: VisitedCountry[];
  gallery: RepresentativeImage[];
  memorableDestinations: MemorableDestination[];
  contactLinks: ContactLink[];
  heroImage: RepresentativeImage;
}

export const REPRESENTATIVE_PROFILE: RepresentativeProfile = {
  name: "free_traveler",
  handle: "@free_traveler",
  tagline: "50+ Trips · 30+ Countries",
  stats: {
    trips: 54,
    countries: 32,
    regions: 4,
  },
  intro:
    "free_traveler는 지난 10년간 4개 대륙, 32개국을 여행하며 각 나라의 안전정보와 실전 여행 팁을 기록해온 여행 큐레이터다. 화려한 관광지 사진보다 실제로 도움이 되는 이동 동선, 안전 수칙, 현지 문화 예절을 정리해 공유하는 것을 목표로 활동한다.",
  philosophy:
    '"여행은 목적지가 아니라 그 과정에서 만나는 안전한 선택의 연속이다." free_traveler는 이 원칙 아래 화려함보다 실용성을, 자랑보다 정보 공유를 우선한다. 모든 여행지 소개에는 실제 방문 경험과 확인 가능한 출처를 함께 남기며, 안전에 관한 정보는 추측이 아닌 공식 기관 자료를 기준으로 정리한다.',
  timeline: [
    {
      year: "2016",
      title: "첫 해외 배낭여행",
      description:
        "동남아시아 3개국(태국·베트남·캄보디아)을 6주간 배낭 하나로 여행하며 여행 기록을 시작했다.",
    },
    {
      year: "2017",
      title: "유럽 첫 방문",
      description:
        "프랑스·이탈리아·스페인을 두 달간 여행하며 유럽 대중교통과 안전 정보를 정리하기 시작했다.",
    },
    {
      year: "2018",
      title: "여행 블로그 개설",
      description:
        "그동안의 여행 기록을 정리해 블로그를 개설하고 안전정보 중심의 여행기를 연재하기 시작했다.",
    },
    {
      year: "2019",
      title: "오세아니아 일주",
      description:
        "호주·뉴질랜드를 3개월간 로드트립으로 여행하며 렌터카 여행 안전 수칙을 정리했다.",
    },
    {
      year: "2020~2021",
      title: "국내 여행 재발견",
      description:
        "이동 제약이 많던 시기, 국내 10개 도시를 다시 찾아 안전하고 여유로운 국내 여행 코스를 기록했다.",
    },
    {
      year: "2022",
      title: "중동·터키 탐방",
      description:
        "터키 이스탄불과 카파도키아를 방문해 문화적 차이가 큰 지역의 여행 에티켓을 정리했다.",
    },
    {
      year: "2023",
      title: "누적 방문 30개국 달성",
      description:
        "그리스·스위스 여행을 끝으로 누적 방문 국가 30개국을 달성하며 여행 데이터베이스를 체계화했다.",
    },
    {
      year: "2024~2025",
      title: "동행 커뮤니티 운영 시작",
      description:
        "혼자 떠나기 어려운 여행자들을 위해 동행 모집 커뮤니티를 시작하고 안전 수칙 가이드를 공동 제작했다.",
    },
  ],
  visitedCountries: [
    { region: "아시아", country: "대한민국" },
    { region: "아시아", country: "일본" },
    { region: "아시아", country: "태국" },
    { region: "아시아", country: "베트남" },
    { region: "아시아", country: "캄보디아" },
    { region: "아시아", country: "라오스" },
    { region: "아시아", country: "대만" },
    { region: "아시아", country: "싱가포르" },
    { region: "아시아", country: "말레이시아" },
    { region: "아시아", country: "인도네시아" },
    { region: "아시아", country: "필리핀" },
    { region: "아시아", country: "인도" },
    { region: "유럽", country: "프랑스" },
    { region: "유럽", country: "이탈리아" },
    { region: "유럽", country: "스페인" },
    { region: "유럽", country: "영국" },
    { region: "유럽", country: "독일" },
    { region: "유럽", country: "스위스" },
    { region: "유럽", country: "오스트리아" },
    { region: "유럽", country: "네덜란드" },
    { region: "유럽", country: "포르투갈" },
    { region: "유럽", country: "그리스" },
    { region: "유럽", country: "체코" },
    { region: "유럽", country: "터키" },
    { region: "오세아니아", country: "호주" },
    { region: "오세아니아", country: "뉴질랜드" },
    { region: "오세아니아", country: "피지" },
    { region: "아메리카", country: "미국" },
    { region: "아메리카", country: "캐나다" },
    { region: "아메리카", country: "멕시코" },
    { region: "아메리카", country: "페루" },
    { region: "아메리카", country: "브라질" },
  ],
  gallery: [
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Sensoji_temple%2C_Asakusa%2C_Tokyo%2C_Japan.jpg/1280px-Sensoji_temple%2C_Asakusa%2C_Tokyo%2C_Japan.jpg",
      alt: "도쿄 센소지 앞에서 촬영한 여행 기록 사진",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Sensoji_temple%2C_Asakusa%2C_Tokyo%2C_Japan.jpg",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/1280px-Tour_Eiffel_Wikimedia_Commons.jpg",
      alt: "파리 에펠탑 앞 여행 기록 사진",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Tour_Eiffel_Wikimedia_Commons.jpg",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/1280px-Sydney_Opera_House_-_Dec_2008.jpg",
      alt: "시드니 오페라하우스 앞 여행 기록 사진",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sydney_Opera_House_-_Dec_2008.jpg",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Hot_air_balloon_in_Cappadocia_01.jpg/1280px-Hot_air_balloon_in_Cappadocia_01.jpg",
      alt: "카파도키아 열기구 투어 여행 기록 사진",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Hot_air_balloon_in_Cappadocia_01.jpg",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Oia_Santorini_sunset.jpg/1280px-Oia_Santorini_sunset.jpg",
      alt: "산토리니 이아마을 일몰 여행 기록 사진",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Oia_Santorini_sunset.jpg",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Jungfraujoch%2C_Swiss_Alps%28_Ank_Kumar_%2C_Infosys_Limited_%29_11.jpg/1280px-Jungfraujoch%2C_Swiss_Alps%28_Ank_Kumar_%2C_Infosys_Limited_%29_11.jpg",
      alt: "융프라우요흐 전망대 여행 기록 사진",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Jungfraujoch%2C_Swiss_Alps%28_Ank_Kumar_%2C_Infosys_Limited_%29_11.jpg",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Seongsan_Ilchulbong.jpg/1280px-Seongsan_Ilchulbong.jpg",
      alt: "제주 성산일출봉 여행 기록 사진",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Seongsan_Ilchulbong.jpg",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Hahoe_Folk_Village_03.jpg/1280px-Hahoe_Folk_Village_03.jpg",
      alt: "안동 하회마을 여행 기록 사진",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Hahoe_Folk_Village_03.jpg",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/1280px-Hagia_Sophia_Mars_2013.jpg",
      alt: "이스탄불 아야소피아 여행 기록 사진",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Hagia_Sophia_Mars_2013.jpg",
    },
  ],
  memorableDestinations: [
    {
      name: "산토리니",
      country: "그리스",
      description:
        "이아마을 칼데라 절벽에서 바라본 일몰은 10년 여행 중 가장 인상적인 순간으로 꼽힌다.",
      image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Oia_Santorini_sunset.jpg/1280px-Oia_Santorini_sunset.jpg",
        alt: "산토리니 이아마을의 일몰 전경",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Oia_Santorini_sunset.jpg",
      },
    },
    {
      name: "카파도키아",
      country: "터키",
      description: "새벽 하늘을 수놓은 열기구 무리를 처음 본 순간, 여행의 이유를 다시 확인했다.",
      image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Hot_air_balloon_in_Cappadocia_01.jpg/1280px-Hot_air_balloon_in_Cappadocia_01.jpg",
        alt: "카파도키아 상공의 열기구들",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Hot_air_balloon_in_Cappadocia_01.jpg",
      },
    },
    {
      name: "퀸스타운",
      country: "뉴질랜드",
      description: "와카티푸호수를 마주한 새벽 산책은 여행 중 가장 평온했던 기억으로 남아 있다.",
      image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Queenstown_NZ_08.jpg/1280px-Queenstown_NZ_08.jpg",
        alt: "퀸스타운 와카티푸호수 전경",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Queenstown_NZ_08.jpg",
      },
    },
    {
      name: "제주",
      country: "대한민국",
      description:
        "국내 여행 재발견 시기에 다시 찾은 성산일출봉의 일출은 해외 못지않은 감동을 주었다.",
      image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Seongsan_Ilchulbong.jpg/1280px-Seongsan_Ilchulbong.jpg",
        alt: "제주 성산일출봉의 일출 전경",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Seongsan_Ilchulbong.jpg",
      },
    },
  ],
  contactLinks: [
    { label: "이메일", url: "mailto:contact@free-traveler.example.com" },
    { label: "Instagram", url: "https://instagram.com/free_traveler" },
  ],
  heroImage: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Jungfraujoch%2C_Swiss_Alps%28_Ank_Kumar_%2C_Infosys_Limited_%29_11.jpg/1280px-Jungfraujoch%2C_Swiss_Alps%28_Ank_Kumar_%2C_Infosys_Limited_%29_11.jpg",
    alt: "알프스 산맥을 배경으로 한 free_traveler의 여행 기록 사진",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jungfraujoch%2C_Swiss_Alps%28_Ank_Kumar_%2C_Infosys_Limited_%29_11.jpg",
  },
};
