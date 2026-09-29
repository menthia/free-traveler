"use client";

import { useEffect, type ReactNode } from "react";
import MateDetailPanel from "./MateDetailPanel";

interface MateDetailDrawerProps {
  postId: string | null;
  onClose: () => void;
  children?: (ctx: { postId: string; ownerId: string }) => ReactNode;
}

/**
 * Mobile 전용 하단 Drawer. 목록 Card를 탭하면 SCR-004 목록 화면 위로 슬라이드업되며,
 * 상세 콘텐츠 자체는 `MateDetailPanel`을 그대로 재사용한다(내용 중복 방지).
 */
export default function MateDetailDrawer({ postId, onClose, children }: MateDetailDrawerProps) {
  // 키보드만으로도 Drawer를 닫을 수 있게 Esc를 지원한다(design-reference/D-001/DESIGN.md §11).
  useEffect(() => {
    if (!postId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [postId, onClose]);

  if (!postId) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-black/50 md:hidden" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="동행글 상세"
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-[16px] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="#262425"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <MateDetailPanel postId={postId}>{children}</MateDetailPanel>
      </div>
    </div>
  );
}
