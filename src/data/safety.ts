export type SafetyScopeType = "COUNTRY" | "REGION";

/** 외교부 해외안전여행 4단계 여행경보(색상만이 아닌 텍스트 라벨로 항상 병기한다). */
export type TravelAdvisoryLevel = "여행유의" | "여행자제" | "출국권고" | "여행금지";

export interface SafetySource {
  name: string;
  url: string;
  /** 정보 확인일(ISO 8601). */
  confirmedAt: string;
  editor: string;
}

export interface CountrySafetyInfo {
  /** src/data/destinations.ts의 Destination.safetyCountryId와 일치. */
  id: string;
  countryName: string;
  scopeType: SafetyScopeType;
  /** 여행경보 단계(텍스트 라벨). */
  advisoryLevel: TravelAdvisoryLevel;
  /** 경보 적용 범위 설명 — 국가 전체("국가 전체")인지 특정 지역("~ 지역")인지 텍스트로 구분한다. */
  scopeText: string;
  /** 치안 — 소매치기, 강력범죄, 위험 지역 등. */
  security: string;
  /** 사기 — 관광객 대상 흔한 사기 수법. */
  scam: string;
  /** 법규 — 현지에서 유의해야 할 법률·규정. */
  law: string;
  /** 교통 — 대중교통·렌터카·도로 사정. */
  transport: string;
  /** 재난 — 자연재해·기후 위험 요소. */
  disaster: string;
  /** 보건 — 위생, 감염병, 응급 의료 체계. */
  health: string;
  /** 문화 — 존중해야 할 관습·금기. */
  culture: string;
  /** 긴급연락처 — 경찰/구급/현지 한국 대사관 등. */
  emergencyContacts: string;
  source: SafetySource;
}

const CONFIRMED_AT = "2026-01-15";
const EDITOR = "Free Traveler 안전정보팀";
const MOFA_SOURCE = {
  name: "외교부 해외안전여행",
  url: "https://www.0404.go.kr/",
  confirmedAt: CONFIRMED_AT,
  editor: EDITOR,
};

export const COUNTRY_SAFETY_INFO: CountrySafetyInfo[] = [
  {
    id: "japan",
    countryName: "일본",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security:
      "전반적으로 치안이 매우 우수하나, 도쿄 카부키초·오사카 도톤보리 등 유흥가에서는 호객꾼과 바가지 요금에 주의해야 한다.",
    scam: "길거리 호객(캐치)을 따라가 고액 청구를 받는 바 사기와, SNS로 접근해 선물·투자 유도 사기가 간혹 발생한다.",
    law: "길거리 흡연은 지정 구역 외 금지(지자체별 과태료), 대마초 등 마약류는 소지만으로도 강하게 처벌된다.",
    transport:
      "대중교통이 매우 정확하고 안전하나, 막차 시간이 이르므로 심야 이동 시 택시나 심야버스를 미리 확인한다.",
    disaster:
      "지진·태풍이 빈번하니 숙소의 대피 경로를 미리 확인하고, 기상청·지자체 재난 문자(Safety tips 앱)를 받아두는 것이 좋다.",
    health:
      "의료 수준이 높지만 진료비가 비싸 여행자보험 가입을 권장하며, 일부 지역은 겨울철 독감 유행에 대비한다.",
    culture:
      "신발을 벗고 들어가는 실내 공간이 많고, 대중교통·공공장소에서는 정숙을 유지하는 문화가 강하다.",
    emergencyContacts: "경찰 110 / 구급·소방 119 / 주일 한국대사관 +81-3-3452-7611",
    source: MOFA_SOURCE,
  },
  {
    id: "thailand",
    countryName: "태국",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security:
      "관광지는 대체로 안전하나 방콕 카오산로드·파타야 유흥가에서는 소매치기와 취객 대상 절도가 발생할 수 있다.",
    scam: "보석·투어 바가지 판매(투크투크 기사 연계), 위조 여행사 티켓 판매 등 관광객 대상 사기가 흔하다.",
    law: "왕실을 모독하는 언행은 불경죄로 엄격히 처벌되며, 사원 내 부적절한 복장·행동도 처벌 대상이 될 수 있다.",
    transport:
      "툭툭·오토바이 택시는 사전에 요금을 흥정해야 하며, 그랩(Grab) 앱 이용이 바가지 방지에 도움이 된다.",
    disaster: "우기(5~10월)에는 홍수·산사태 위험 지역이 있으니 여행 전 기상 특보를 확인한다.",
    health:
      "뎅기열 등 모기 매개 질병이 있어 방충제를 준비하고, 길거리 음식은 위생 상태를 확인 후 섭취한다.",
    culture: "머리를 함부로 만지지 않고 발로 물건이나 사람을 가리키지 않는 것이 예의다.",
    emergencyContacts: "관광경찰 1155 / 구급 1669 / 주태국 한국대사관 +66-2-481-6000",
    source: MOFA_SOURCE,
  },
  {
    id: "vietnam",
    countryName: "베트남",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security:
      "전반적으로 안전하나 대도시 관광지에서는 오토바이를 이용한 날치기와 소매치기에 유의해야 한다.",
    scam: "환전 시 위폐·부족 지급, 택시 미터기 조작 등의 사례가 있어 공식 환전소와 신뢰할 수 있는 택시 브랜드 이용을 권장한다.",
    law: "마약류는 소량 소지만으로도 엄격히 처벌되며, 정치적 발언이나 집회 참여는 제한된다.",
    transport:
      "오토바이 통행량이 매우 많아 도로 횡단 시 일정한 속도로 건너야 하며, 자체 렌트 오토바이 운전은 국제운전면허 소지 여부를 확인한다.",
    disaster: "중부·북부 지역은 우기(태풍철)에 홍수 피해가 잦으니 방문 전 기상 상황을 확인한다.",
    health:
      "길거리 음식으로 인한 식중독에 유의하고, 생수 음용을 권장하며 뎅기열 예방을 위해 방충제를 준비한다.",
    culture:
      "사원·왕궁 방문 시 노출이 적은 복장을 갖추고, 어른에게 두 손으로 물건을 건네는 예절을 지킨다.",
    emergencyContacts: "경찰 113 / 구급 115 / 주베트남 한국대사관 +84-24-3771-0404",
    source: MOFA_SOURCE,
  },
  {
    id: "taiwan",
    countryName: "대만",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security:
      "치안이 매우 우수한 편으로 심야 시간대에도 비교적 안전하지만, 관광지 소매치기는 기본적인 주의가 필요하다.",
    scam: "관광객 대상 고가 요금 청구나 가짜 국제운전면허 대행 등의 소규모 사기가 드물게 보고된다.",
    law: "대마초 등 마약류 소지는 강하게 처벌되며, 대중교통 내 음식물 섭취는 벌금 대상이다.",
    transport:
      "MRT·기차 등 대중교통이 매우 안전하고 정확하며, 태풍철에는 운행이 중단될 수 있어 일정에 여유를 둔다.",
    disaster: "태풍(6~10월)과 지진이 빈번하니 기상청 특보와 숙소 안내를 확인한다.",
    health: "의료 시스템이 우수하며 여행자보험 가입 시 대부분의 병원에서 진료가 가능하다.",
    culture: "사찰에서는 향을 피우는 순서를 지키고, 대중교통 내 노약자석은 비워둔다.",
    emergencyContacts: "경찰 110 / 구급 119 / 주타이베이 한국대표부 +886-2-2758-8320",
    source: MOFA_SOURCE,
  },
  {
    id: "singapore",
    countryName: "싱가포르",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security: "세계적으로 치안이 우수한 국가로 꼽히며, 강력범죄 발생률이 매우 낮다.",
    scam: "관광객을 노린 대규모 사기는 드물지만, 온라인 쇼핑·투자 사기에 대한 주의 안내가 있다.",
    law: "껌 반입·판매, 무단횡단, 쓰레기 투기 등 경범죄에도 높은 벌금이 부과되며 마약류는 사형까지 가능한 중범죄다.",
    transport:
      "MRT·버스 등 대중교통이 매우 효율적이고 안전하며, 대중교통 내 음식물 섭취는 금지되어 있다.",
    disaster: "적도 인근 기후로 스콜(소나기)이 잦으나 대형 자연재해 위험은 낮은 편이다.",
    health: "의료 수준이 매우 높으나 진료비가 비싸 여행자보험 가입을 권장한다.",
    culture:
      "다민족 사회로 종교·문화적 다양성을 존중하는 것이 중요하며 공공장소 흡연은 지정 구역에서만 가능하다.",
    emergencyContacts: "경찰 999 / 구급·소방 995 / 주싱가포르 한국대사관 +65-6256-1188",
    source: MOFA_SOURCE,
  },
  {
    id: "france",
    countryName: "프랑스",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security:
      "파리 등 대도시 관광지·대중교통에서 소매치기가 매우 빈번하니 소지품 관리에 각별히 유의해야 한다.",
    scam: "가짜 서명 요청(청원서) 후 소매치기, 팔찌 강매 등 관광객을 노린 수법이 유명 관광지에 흔하다.",
    law: "공공장소 흡연 제한 구역이 있으며, 인종·종교 관련 혐오 발언은 강하게 처벌된다.",
    transport: "지하철(메트로)이 편리하지만 소매치기 위험이 있어 혼잡 시간대 소지품을 앞으로 멘다.",
    disaster: "대형 자연재해 위험은 낮은 편이나 여름철 폭염·산불 경보에 유의한다.",
    health: "의료 수준이 높으며 응급실 이용 시 여행자보험 서류를 지참한다.",
    culture: "상점·식당 입장 시 먼저 인사를 건네는 것이 기본 예절로 여겨진다.",
    emergencyContacts: "경찰 17 / 구급 15 / 주프랑스 한국대사관 +33-1-4753-6996",
    source: MOFA_SOURCE,
  },
  {
    id: "italy",
    countryName: "이탈리아",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security: "로마·밀라노 등 대도시 관광지와 대중교통에서 소매치기·날치기가 빈번하게 발생한다.",
    scam: "가짜 경찰을 사칭한 소지품 검사 사기, 레스토랑 자릿세(코페르토) 미고지 등이 흔한 사례다.",
    law: "주요 유적지 낙서·훼손 행위는 고액 벌금 대상이며, 일부 해변은 지정 구역 외 취사가 제한된다.",
    transport:
      "기차·지하철이 편리하지만 혼잡 시간대 소매치기에 유의하고 승차권은 반드시 개찰기에 각인한다.",
    disaster: "일부 남부 지역은 지진 위험이 있으며 여름철 폭염에 대비한다.",
    health: "의료 수준이 높으며 여행자보험 가입 시 대부분의 병원에서 진료가 가능하다.",
    culture: "성당 방문 시 어깨와 무릎을 가리는 복장을 갖추고 정숙을 유지한다.",
    emergencyContacts: "경찰 113 / 구급 118 / 주이탈리아 한국대사관 +39-06-802-461",
    source: MOFA_SOURCE,
  },
  {
    id: "spain",
    countryName: "스페인",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security: "바르셀로나 람블라스거리 등 관광 밀집 구역에서 소매치기 발생률이 높은 편이다.",
    scam: "택시 바가지 요금, 꽃·팔찌 강매 후 금전 요구 등의 수법이 관광지에 흔하다.",
    law: "공공장소 음주는 지역에 따라 제한되며, 투우 등 전통 행사 관람 시 현지 규정을 따른다.",
    transport: "메트로·버스가 편리하나 혼잡한 관광지 노선에서는 소지품을 몸 앞쪽에 둔다.",
    disaster: "대형 자연재해 위험은 낮으나 여름철 폭염에 대비해 수분 섭취를 충분히 한다.",
    health: "의료 수준이 높으며 응급 상황 시 여행자보험 서류를 지참해 병원을 이용한다.",
    culture: "시에스타(오후 낮잠) 시간에는 일부 상점이 문을 닫는 문화를 이해한다.",
    emergencyContacts: "경찰 091 / 구급 112 / 주스페인 한국대사관 +34-91-353-2000",
    source: MOFA_SOURCE,
  },
  {
    id: "united-kingdom",
    countryName: "영국",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security: "전반적으로 치안이 양호하나 런던 일부 지역과 대중교통에서 소매치기가 발생할 수 있다.",
    scam: "가짜 자선단체 서명 요청, 노상 카드 게임(속임수 도박) 등 관광객 대상 사기에 유의한다.",
    law: "공공장소 음주는 일부 구역에서 제한되며, 대중교통 무임승차는 고액 벌금 대상이다.",
    transport:
      "지하철(튜브)이 편리하며, 에스컬레이터에서는 오른쪽으로 서서 왼쪽 통행로를 비워두는 문화를 지킨다.",
    disaster: "대형 자연재해 위험은 낮으나 겨울철 폭풍·홍수 경보에 유의한다.",
    health: "의료 수준이 높으며 응급 상황 시 NHS(국민보건서비스) 병원 이용이 가능하다.",
    culture: "줄서기(큐잉) 문화를 매우 중요하게 여기며 새치기는 무례한 행동으로 여겨진다.",
    emergencyContacts: "경찰·구급 999(비긴급 101) / 주영국 한국대사관 +44-20-7227-5500",
    source: MOFA_SOURCE,
  },
  {
    id: "united-states",
    countryName: "미국",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security:
      "도시별 치안 편차가 크며, 대도시 일부 구역은 야간 이동을 피하고 대중교통 이용 시 소지품에 유의한다.",
    scam: "가짜 자선 모금, 렌터카 보험 강매 등 관광객을 노린 수법이 있어 계약 내용을 꼼꼼히 확인한다.",
    law: "주(state)마다 법규가 다르며, 대마초 합법화 여부도 주마다 달라 사전 확인이 필요하다.",
    transport:
      "대중교통이 제한적인 도시가 많아 렌터카 이용이 일반적이며, 우회전 신호 등 현지 교통 규칙을 숙지한다.",
    disaster:
      "지역에 따라 허리케인(남동부)·산불(서부)·토네이도(중부) 위험이 있어 여행 전 기상 특보를 확인한다.",
    health:
      "의료비가 매우 높아 여행자보험 가입이 필수적이며, 응급실 이용 전 보험 적용 여부를 확인한다.",
    culture: "레스토랑·택시 등에서 15~20% 팁 문화가 일반적이다.",
    emergencyContacts: "경찰·구급 911 / 주미국 한국대사관 +1-202-939-5600",
    source: MOFA_SOURCE,
  },
  {
    id: "australia",
    countryName: "호주",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security:
      "전반적으로 치안이 우수하나 시드니·멜버른 유흥가 심야 시간대는 취객 관련 사건에 유의한다.",
    scam: "렌터카 반납 시 과도한 손상 청구, 투어 예약 사기 등에 유의해야 한다.",
    law: "음주운전 단속이 엄격하며, 해양보호구역에서 산호·해양생물 채취는 금지되어 있다.",
    transport:
      "대중교통(Opal 카드 등)이 잘 갖춰져 있으나 도시 간 이동은 장거리 렌터카·항공을 이용한다.",
    disaster:
      "여름철(12~2월) 산불·폭염 위험이 있으며, 북부 지역은 사이클론 시즌(11~4월)에 유의한다.",
    health:
      "자외선이 매우 강해 자외선 차단제를 챙기고, 해파리·상어 등 해양 생물 안전 안내를 따른다.",
    culture: "해변에서는 안전 깃발 표시 구역 내에서만 수영하는 문화가 확립되어 있다.",
    emergencyContacts: "경찰·구급·소방 000 / 주호주 한국대사관 +61-2-6270-4100",
    source: MOFA_SOURCE,
  },
  {
    id: "new-zealand",
    countryName: "뉴질랜드",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security: "전반적으로 치안이 매우 우수하며 강력범죄 발생률이 낮은 편이다.",
    scam: "렌터카 관련 소규모 분쟁 외에 큰 사기 사례는 드물지만 계약 조건을 꼼꼼히 확인한다.",
    law: "자연보호구역 반출입 규정이 엄격하며, 하이킹 시 지정 탐방로를 벗어나면 처벌될 수 있다.",
    transport: "렌터카 이용이 일반적이며 좌측 통행 규정을 숙지해야 한다.",
    disaster: "지진·화산 활동 지역이 있어 국립공원 방문 시 안내소의 최신 경보를 확인한다.",
    health: "의료 수준이 높으나 원거리 지역은 병원 접근성이 낮아 사전 대비가 필요하다.",
    culture:
      "마오리 문화 유적 방문 시 안내 규칙을 따르고 자연을 훼손하지 않는 것을 중요하게 여긴다.",
    emergencyContacts: "경찰·구급·소방 111 / 주뉴질랜드 한국대사관 +64-4-473-9073",
    source: MOFA_SOURCE,
  },
  {
    id: "turkey",
    countryName: "터키",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security: "이스탄불 관광지는 비교적 안전하나 대규모 집회·시위 지역은 접근을 피하는 것이 좋다.",
    scam: "카펫 강매, 환전소 바가지 등 관광객 대상 상술이 그랜드바자르 등에서 흔하다.",
    law: "국가 지도자·국기에 대한 모독 행위는 강하게 처벌되며, 군사시설 촬영은 금지되어 있다.",
    transport: "트램·페리 등 대중교통이 편리하며, 야간 장거리 버스 이용 시 정류장 안전에 유의한다.",
    disaster: "지진 활동이 활발한 지역이라 숙소의 대피 경로를 미리 확인하는 것이 좋다.",
    health: "대도시 의료 수준은 양호하나 지방은 응급 의료 접근성이 낮을 수 있다.",
    culture: "모스크 방문 시 신발을 벗고 여성은 스카프를 준비해야 한다.",
    emergencyContacts: "경찰 155 / 구급 112 / 주터키 한국대사관 +90-312-468-4822",
    source: MOFA_SOURCE,
  },
  {
    id: "greece",
    countryName: "그리스",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security: "전반적으로 안전하나 아테네 일부 구역과 대중교통에서 소매치기가 발생할 수 있다.",
    scam: "택시 바가지 요금, 관광지 사진 촬영 강요 후 금전 요구 등의 사례가 있다.",
    law: "고대 유적 훼손·무단 반출은 강하게 처벌되며, 일부 섬은 드론 촬영이 제한된다.",
    transport: "페리 시간표가 기상에 따라 변경될 수 있어 여유 있는 일정을 계획한다.",
    disaster: "여름철 산불·폭염 위험이 있으며 일부 지역은 지진 활동이 있다.",
    health: "대도시 의료 수준은 양호하나 섬 지역은 응급 의료 접근성이 낮을 수 있다.",
    culture: "성당·수도원 방문 시 어깨와 무릎을 가리는 복장을 갖춘다.",
    emergencyContacts: "경찰 100 / 구급 166 / 주그리스 한국대사관 +30-210-698-4080",
    source: MOFA_SOURCE,
  },
  {
    id: "switzerland",
    countryName: "스위스",
    scopeType: "COUNTRY",
    advisoryLevel: "여행유의",
    scopeText: "국가 전체",
    security: "치안이 매우 우수한 국가로 꼽히며, 관광지에서도 강력범죄 발생률이 매우 낮다.",
    scam: "관광객을 노린 대규모 사기 사례는 드물지만 산악 열차·케이블카 티켓 재판매 사기에 유의한다.",
    law: "대중교통 무임승차는 고액 벌금 대상이며, 자연보호구역 캠핑은 지정 장소에서만 허용된다.",
    transport: "기차·트램 등 대중교통이 매우 정확하니 환승 시간을 엄수해야 한다.",
    disaster: "산악 지역은 눈사태·낙석 위험이 있어 하이킹 전 현지 안내소의 경보를 확인한다.",
    health: "의료 수준이 매우 높으나 진료비가 비싸 여행자보험 가입을 권장한다.",
    culture: "일요일에는 대부분의 상점이 문을 닫으며 공공장소에서는 조용히 대화하는 문화가 있다.",
    emergencyContacts: "경찰 117 / 구급 144 / 주스위스 한국대사관 +41-31-356-2444",
    source: MOFA_SOURCE,
  },
];

export const SAFETY_COUNTRY_COUNT = COUNTRY_SAFETY_INFO.length;
