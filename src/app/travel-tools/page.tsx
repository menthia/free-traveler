import type { Metadata } from "next";
import { buildScreenMetadata } from "@/lib/seo";
import IntroStepGuide from "@/components/travel-tools/IntroStepGuide";
import TravelToolsTabsSection from "@/components/travel-tools/TravelToolsTabsSection";
import FlightConditionForm from "@/components/travel-tools/FlightConditionForm";
import HotelConditionForm from "@/components/travel-tools/HotelConditionForm";
import DisclosureTipSection from "@/components/travel-tools/DisclosureTipSection";
import MateLoginGateCard from "@/components/travel-tools/MateLoginGateCard";
import MateComposeForm from "@/components/travel-tools/MateComposeForm";

export function generateMetadata(): Metadata {
  return buildScreenMetadata("SCR-003");
}

// 정적으로 미리 렌더링(prerender)되면 middleware가 매 요청마다 새로 만드는 CSP nonce와
// 빌드 시점에 한 번만 구워진 HTML 속 <script nonce=...> 값이 어긋나, 모든 인라인
// 하이드레이션 스크립트가 차단되어 이 화면의 모든 Form·탭 상호작용이 깨진다(실측:
// 프로덕션 빌드에서 CSP 위반으로 재현). 요청마다 새로 렌더링해 nonce가 항상 일치하게 한다.
export const dynamic = "force-dynamic";

export default function TravelToolsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-10 md:gap-16 md:py-24">
      <IntroStepGuide />
      <TravelToolsTabsSection
        flightContent={
          <div className="flex flex-col gap-10">
            <FlightConditionForm />
            <DisclosureTipSection tab="flight" />
          </div>
        }
        hotelContent={
          <div className="flex flex-col gap-10">
            <HotelConditionForm />
            <DisclosureTipSection tab="hotel" />
          </div>
        }
        mateContent={
          <MateLoginGateCard>
            <MateComposeForm />
          </MateLoginGateCard>
        }
      />
    </div>
  );
}
