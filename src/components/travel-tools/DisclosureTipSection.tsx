const TIPS: Record<"flight" | "hotel", string[]> = {
  flight: [
    "출발일이 가까울수록 항공 요금이 오를 수 있으니 여유 있게 확인하세요.",
    "환승 여부와 수하물 규정은 예약 사이트에서 항공편별로 다시 확인하세요.",
    "여권 유효기간이 입국일 기준 6개월 이상 남아 있는지 미리 확인하세요.",
  ],
  hotel: [
    "체크인·체크아웃 시간은 숙소마다 다르니 예약 사이트에서 다시 확인하세요.",
    "취소·환불 규정은 예약 확정 전 반드시 확인하세요.",
    "숙소 위치와 주변 치안 정보를 국가별 안전정보와 함께 확인하세요.",
  ],
};

interface DisclosureTipSectionProps {
  tab: "flight" | "hotel";
}

export default function DisclosureTipSection({ tab }: DisclosureTipSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-[10px] bg-[#EAF3FA] px-4 py-3 text-[14px] text-[#1D5C8A]">
        항공·숙소 조건 입력값은 서버로 전달되지 않으며, 실제 예약은 이동한 외부 사이트에서
        진행됩니다.
      </p>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {TIPS[tab].map((tip) => (
          <li
            key={tip}
            className="rounded-[16px] border border-[#E4E0DC] bg-white p-4 text-[14px] leading-[1.5] text-[#4B4749]"
          >
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
