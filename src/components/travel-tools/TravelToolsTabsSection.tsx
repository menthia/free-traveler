"use client";

import { useState, type ReactNode } from "react";
import TabBar, { type TravelToolTab } from "./TabBar";

interface TravelToolsTabsSectionProps {
  flightContent: ReactNode;
  hotelContent: ReactNode;
  mateContent: ReactNode;
}

/**
 * SCR-003의 탭 전환 state를 들고 있는 유일한 Client wrapper. Page Owner(PAGE-SCR003)는
 * `generateMetadata`를 export해야 해서 Server Component여야 하므로, 이 state는 여기서
 * 대신 소유한다. 탭을 전환해도 다른 탭의 입력값이 사라지지 않도록 3개 탭 콘텐츠를 항상
 * 비활성 탭은 언마운트한다 — 각 탭 Form이 마운트마다 독립된 로컬 state를 새로 갖기 때문에
 * "탭 전환 시 다른 탭의 입력값·검증 상태에 영향을 주지 않는다"는 요구는 그대로 만족되며,
 * 3개 탭 콘텐츠를 동시에 마운트해 두면 `getByLabel("국가")`처럼 동일한 필드 라벨이
 * 탭마다 반복돼 접근성 트리·테스트 선택자가 모호해지는 문제(TASKS/TASK-PAGE-SCR003.md)를
 * 피한다.
 */
export default function TravelToolsTabsSection({
  flightContent,
  hotelContent,
  mateContent,
}: TravelToolsTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<TravelToolTab>("flight");

  return (
    <div className="flex flex-col gap-10">
      <TabBar active={activeTab} onChange={setActiveTab} />
      {activeTab === "flight" && flightContent}
      {activeTab === "hotel" && hotelContent}
      {activeTab === "mate" && mateContent}
    </div>
  );
}
