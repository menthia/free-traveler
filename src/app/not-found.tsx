import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1280px] flex-col items-center justify-center gap-4 px-5 py-16 text-center">
      <p className="text-[13px] font-medium text-[#78737A]">404</p>
      <h1 className="text-[26px] font-bold leading-[1.3] text-[#262425]">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="max-w-md text-[16px] leading-[1.6] text-[#4B4749]">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다. 아래 버튼으로 메인 페이지로
        돌아가 다시 찾아보세요.
      </p>
      <Link
        href="/"
        className="mt-2 flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
      >
        메인으로 돌아가기
      </Link>
    </div>
  );
}
