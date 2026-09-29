export type TravelToolTab = "flight" | "hotel" | "mate";

const TABS: { id: TravelToolTab; label: string; description: string }[] = [
  { id: "flight", label: "항공편", description: "항공 조건을 입력하고 예약 사이트로 이동합니다." },
  { id: "hotel", label: "숙소", description: "숙소 조건을 입력하고 예약 사이트로 이동합니다." },
  { id: "mate", label: "동행 구하기", description: "함께할 동행을 모집하는 글을 작성합니다." },
];

interface TabBarProps {
  active: TravelToolTab;
  onChange: (tab: TravelToolTab) => void;
}

/**
 * SCR-003의 3개 탭(항공편/숙소/동행 구하기)만 전환하는 순수 UI다. 각 탭의 입력·검증·완료
 * 상태는 Page Owner(PAGE-SCR003)가 탭별로 독립된 state를 유지해 보존한다 — 이 Component는
 * 어떤 탭 state도 소유하지 않는다.
 */
export default function TabBar({ active, onChange }: TabBarProps) {
  const activeTab = TABS.find((t) => t.id === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="여행 준비 탭"
        className="flex gap-6 overflow-x-auto border-b border-[#E4E0DC]"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`flex min-h-[44px] shrink-0 items-center border-b-2 px-1 text-[16px] font-semibold whitespace-nowrap ${
                isActive ? "border-[#FF6A4D] text-[#262425]" : "border-transparent text-[#78737A]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab && <p className="mt-3 text-[14px] text-[#78737A]">{activeTab.description}</p>}
    </div>
  );
}
