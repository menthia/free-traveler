import Link from "next/link";

export default function MateIntro() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-[26px] font-bold text-[#262425] md:text-[36px]">동행 찾기</h1>
        <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4749]">
          국가·지역·기간별로 여행 동행을 찾아보고, 마음에 드는 모집글에 참가를 요청해 보세요.
        </p>
      </div>
      <Link
        href="/travel-tools"
        className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
      >
        동행글 작성하기
      </Link>
    </div>
  );
}
