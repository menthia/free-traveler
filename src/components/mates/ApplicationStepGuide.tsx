const STEPS = [
  { title: "참가 요청", description: "비공개 메시지로 작성자에게 참가 요청을 보냅니다." },
  { title: "승인/거절", description: "작성자가 요청을 검토해 승인하거나 거절합니다." },
  { title: "인앱 알림 확인", description: "승인되면 인앱 알림으로 결과를 확인합니다." },
] as const;

export default function ApplicationStepGuide() {
  return (
    <div>
      <h2 className="mb-4 text-[20px] font-semibold text-[#262425]">참가 신청 방법</h2>
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
