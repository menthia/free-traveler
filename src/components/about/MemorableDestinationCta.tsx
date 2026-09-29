import Link from "next/link";
import Image from "next/image";
import { REPRESENTATIVE_PROFILE } from "@/data/representative";
import { DESTINATIONS } from "@/data/destinations";

export default function MemorableDestinationCta() {
  const { memorableDestinations } = REPRESENTATIVE_PROFILE;

  // 비공개(공개 여행지 목록에 없는) 여행지는 자동 제외한다.
  const visibleDestinations = memorableDestinations
    .map((memorable) => {
      const match = DESTINATIONS.find(
        (d) => d.name === memorable.name && d.country === memorable.country,
      );
      return match ? { ...memorable, destinationId: match.id } : null;
    })
    .filter((m): m is NonNullable<typeof m> => m !== null);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="mb-4 text-[20px] font-semibold text-[#262425]">기억에 남는 여행지</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {visibleDestinations.map((d) => (
            <Link
              key={d.destinationId}
              href={`/?destination=${encodeURIComponent(d.destinationId)}`}
              className="flex flex-col overflow-hidden rounded-[16px] border border-[#E4E0DC] bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
            >
              <div className="relative h-32 w-full">
                <Image
                  src={d.image.url}
                  alt={d.image.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-[15px] font-semibold text-[#262425]">
                  {d.name} · {d.country}
                </p>
                <p className="mt-1 text-[13px] leading-[1.5] text-[#78737A]">{d.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-[16px] bg-[#F7F6F4] p-8 text-center md:flex-row md:justify-between md:text-left">
        <p className="text-[16px] font-semibold text-[#262425]">
          다음 여행을 준비하거나 함께할 동행을 찾아보세요.
        </p>
        <div className="flex gap-3">
          <Link
            href="/travel-tools"
            className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
          >
            여행 준비하기
          </Link>
          <Link
            href="/mates"
            className="flex min-h-[44px] items-center rounded-[10px] border border-[#E4E0DC] px-6 text-[16px] font-semibold text-[#262425] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
          >
            동행 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
