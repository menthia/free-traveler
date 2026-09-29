import type { Metadata } from "next";
import { buildScreenMetadata } from "@/lib/seo";
import { REPRESENTATIVE_PROFILE } from "@/data/representative";
import ProfileHero from "@/components/about/ProfileHero";
import StatCardGroup from "@/components/about/StatCardGroup";
import IntroPhilosophySplit from "@/components/about/IntroPhilosophySplit";
import Timeline from "@/components/about/Timeline";
import RegionChipGroup from "@/components/about/RegionChipGroup";
import Gallery from "@/components/about/Gallery";
import MemorableDestinationCta from "@/components/about/MemorableDestinationCta";

export function generateMetadata(): Metadata {
  return buildScreenMetadata("SCR-002");
}

const ALLOWED_PROTOCOLS = ["mailto:", "https:"];

function isAllowedUrl(url: string): boolean {
  return ALLOWED_PROTOCOLS.some((protocol) => url.startsWith(protocol));
}

export default function AboutPage() {
  const contactLinks = REPRESENTATIVE_PROFILE.contactLinks.filter(
    (link) => link.url && isAllowedUrl(link.url),
  );

  return (
    <div className="flex flex-col">
      <ProfileHero />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-5 py-10 md:gap-24 md:py-24">
        <StatCardGroup />
        <IntroPhilosophySplit />
        <div>
          <h2 className="mb-4 text-[20px] font-semibold text-[#262425]">여행 Timeline</h2>
          <Timeline />
        </div>
        <RegionChipGroup />
        <Gallery />
        <MemorableDestinationCta />

        {contactLinks.length > 0 && (
          <div className="flex flex-wrap gap-4 border-t border-[#E4E0DC] pt-8">
            {contactLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target={link.url.startsWith("https:") ? "_blank" : undefined}
                rel={link.url.startsWith("https:") ? "noopener noreferrer" : undefined}
                className="text-[14px] font-semibold text-[#FF6A4D] hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
