import { Suspense } from "react";
import type { Metadata } from "next";
import { buildScreenMetadata } from "@/lib/seo";
import SearchHero from "@/components/home/SearchHero";
import DestinationExplorerSection from "@/components/home/DestinationExplorerSection";
import CountrySafetyCardGrid from "@/components/home/CountrySafetyCardGrid";
import RecentMatePreview from "@/components/home/RecentMatePreview";
import CuratorSummary from "@/components/home/CuratorSummary";

export function generateMetadata(): Metadata {
  return buildScreenMetadata("SCR-001");
}

function MatePreviewSkeleton() {
  return (
    <div
      role="status"
      aria-label="최근 동행글 불러오는 중"
      className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-3"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-32 rounded-[16px] bg-[#F0EEEA]" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <SearchHero />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-10 md:gap-24 md:py-24">
        <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
          <DestinationExplorerSection />
        </Suspense>
        <CountrySafetyCardGrid />
        <Suspense fallback={<MatePreviewSkeleton />}>
          <RecentMatePreview />
        </Suspense>
        <CuratorSummary />
      </div>
    </div>
  );
}
