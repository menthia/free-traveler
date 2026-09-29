import type { Metadata } from "next";
import { buildScreenMetadata } from "@/lib/seo";
import MateIntro from "@/components/mates/MateIntro";
import MatesPageSections from "@/components/mates/MatesPageSections";
import ApplicationStepGuide from "@/components/mates/ApplicationStepGuide";
import SafetyCtaBanner from "@/components/mates/SafetyCtaBanner";

export function generateMetadata(): Metadata {
  return buildScreenMetadata("SCR-004");
}

// /travel-tools에서와 동일한 이유(정적 prerender 시 middleware의 CSP nonce와 빌드 시점
// HTML의 nonce가 어긋나 인라인 하이드레이션 스크립트가 전부 차단됨)로 이 화면도
// force-dynamic이 필요하다.
export const dynamic = "force-dynamic";

export default function MatesPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-10 md:gap-16 md:py-24">
      <MateIntro />
      <MatesPageSections />
      <ApplicationStepGuide />
      <SafetyCtaBanner />
    </div>
  );
}
