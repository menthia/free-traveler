const STEPS = [
  { title: "조건 입력", description: "국가·지역·날짜 등 여행 조건을 입력합니다." },
  { title: "요약 확인", description: "입력한 조건 요약을 확인합니다." },
  { title: "외부 이동/게시", description: "실제 예약 사이트로 이동하거나 동행글을 게시합니다." },
] as const;

export default function IntroStepGuide() {
  return (
    <div>
      <h1 className="text-[26px] font-bold text-[#262425] md:text-[36px]">여행 준비</h1>
      <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4749]">
        항공·숙소 조건을 정리하고 외부 예약 사이트로 이동하거나, 함께할 동행을 모집해 보세요.
      </p>
      <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col gap-2 rounded-[16px] border border-[#E4E0DC] bg-white p-4"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFE3D8] text-[13px] font-semibold text-[#FF6A4D]">
              {index + 1}
            </span>
            <p className="text-[17px] font-semibold text-[#262425]">{step.title}</p>
            <p className="text-[14px] leading-[1.5] text-[#78737A]">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
