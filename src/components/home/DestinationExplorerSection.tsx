"use client";

import { useState } from "react";
import DestinationCardGrid from "./DestinationCardGrid";
import ThemeChipFilter, { type TravelMotive } from "./ThemeChipFilter";

/**
 * `DestinationCardGrid`(Section ②③ 국내/해외 여행지 Card Grid)와 `ThemeChipFilter`
 * (Section ④ 여행 동기·테마 Chip)를 함께 묶어 `theme` 선택 state를 공유하는 Client Component 래퍼.
 * Page Owner(PAGE-SCR001)는 이 하나만 import해 지정된 Section 순서 자리에 배치한다.
 */
export default function DestinationExplorerSection() {
  const [selectedTheme, setSelectedTheme] = useState<TravelMotive | null>(null);

  return (
    <>
      <DestinationCardGrid selectedTheme={selectedTheme} />
      <ThemeChipFilter selected={selectedTheme} onChange={setSelectedTheme} />
    </>
  );
}
