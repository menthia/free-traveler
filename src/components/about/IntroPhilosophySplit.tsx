import { REPRESENTATIVE_PROFILE } from "@/data/representative";

export default function IntroPhilosophySplit() {
  const { intro, philosophy } = REPRESENTATIVE_PROFILE;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h2 className="mb-3 text-[20px] font-semibold text-[#262425]">소개</h2>
        <p className="text-[16px] leading-[1.6] text-[#4B4749]">{intro}</p>
      </div>
      <div>
        <h2 className="mb-3 text-[20px] font-semibold text-[#262425]">여행 철학</h2>
        <p className="text-[16px] leading-[1.6] text-[#4B4749]">{philosophy}</p>
      </div>
    </div>
  );
}
