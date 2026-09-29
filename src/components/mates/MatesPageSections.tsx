"use client";

import { useState } from "react";
import MatePostList from "./MatePostList";
import MateDetailPanel from "./MateDetailPanel";
import MateDetailDrawer from "./MateDetailDrawer";
import ApplicationForm from "./ApplicationForm";
import ReportBlockActions from "./ReportBlockActions";

/**
 * SCR-004의 "선택된 동행글" state를 들고 있는 유일한 Client wrapper. Page Owner
 * (PAGE-SCR004)는 `generateMetadata`를 export해야 해서 Server Component여야 하므로,
 * 이 state는 여기서 대신 소유한다(PAGE-SCR003의 `TravelToolsTabsSection`과 동일한 선례).
 * Desktop은 목록(좌 40%)+상세(우 60%) 분할, Mobile은 하단 Drawer로 전환한다.
 */
export default function MatesPageSections() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const renderDetailChildren = ({ postId, ownerId }: { postId: string; ownerId: string }) => (
    <>
      <ApplicationForm postId={postId} />
      <ReportBlockActions targetType="MATE_POST" targetId={postId} blockedUserId={ownerId} />
    </>
  );

  return (
    <>
      {/* 40%/60% 대신 2fr/3fr을 쓴다 — 퍼센트 트랙은 gap을 반영하지 않아 총합이 100%+gap이
          되면서 1128px 폭에서 약 12px 가로 스크롤이 발생했다(MANUAL-RESPONSIVE-CHECK에서 발견). */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_3fr]">
        <MatePostList selectedPostId={selectedPostId} onSelectPost={setSelectedPostId} />
        <div className="hidden md:block">
          <MateDetailPanel postId={selectedPostId}>{renderDetailChildren}</MateDetailPanel>
        </div>
      </div>

      <MateDetailDrawer postId={selectedPostId} onClose={() => setSelectedPostId(null)}>
        {renderDetailChildren}
      </MateDetailDrawer>
    </>
  );
}
