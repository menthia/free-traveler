import Link from "next/link";

export default function SafetyCtaBanner() {
  return (
    <div className="flex flex-col gap-4 rounded-[16px] bg-[#F7F6F4] p-8">
      <div>
        <h2 className="text-[20px] font-semibold text-[#262425]">안전 · 신고 · 차단 안내</h2>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#4B4749]">
          서비스는 이용자의 신원과 안전을 보증하지 않습니다. 첫 만남은 공공장소에서 진행하고,
          부적절한 언행이나 안전을 위협하는 행동을 겪으면 즉시 신고하거나 상대를 차단해 주세요.
        </p>
      </div>
      <div>
        <Link
          href="/travel-tools"
          className="flex min-h-[44px] w-fit items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
        >
          여행 준비하기
        </Link>
      </div>
    </div>
  );
}
