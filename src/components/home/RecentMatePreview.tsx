import Link from "next/link";
import { listMatePosts } from "@/lib/db/mates";

function formatPeriod(startDate: string, endDate: string): string {
  return `${startDate} ~ ${endDate}`;
}

export default async function RecentMatePreview() {
  let posts: Awaited<ReturnType<typeof listMatePosts>> = [];
  let loadFailed = false;

  try {
    posts = await listMatePosts({ status: "OPEN", limit: 3 });
  } catch {
    loadFailed = true;
  }

  return (
    <section data-testid="mate-preview-section">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[26px] font-bold text-[#262425]">최근 동행글</h2>
        {posts.length > 0 && (
          <Link href="/mates" className="text-[14px] font-semibold text-[#FF6A4D] hover:underline">
            동행 더 보기
          </Link>
        )}
      </div>

      {loadFailed ? (
        <div className="rounded-[16px] bg-[#FDECEA] p-6 text-center text-[14px] text-[#B3261E]">
          동행글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[16px] bg-[#F7F6F4] p-8 text-center">
          <p className="text-[16px] leading-[1.6] text-[#4B4749]">
            아직 등록된 동행글이 없습니다. 가장 먼저 동행을 모집해 보세요.
          </p>
          <ol className="flex flex-col gap-1 text-[14px] text-[#78737A]">
            <li>1. 로그인 후 동행 탭에서 여행 조건을 입력합니다.</li>
            <li>2. 모집 인원과 여행 스타일을 선택합니다.</li>
            <li>3. 안전수칙에 동의하고 게시하면 동행자를 모집할 수 있습니다.</li>
          </ol>
          <Link
            href="/travel-tools"
            className="flex min-h-[44px] items-center rounded-[10px] bg-[#FF6A4D] px-6 text-[16px] font-semibold text-white hover:bg-[#E14E32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A4D]"
          >
            동행글 작성하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.post_id}
              className="flex flex-col gap-2 rounded-[16px] border border-[#E4E0DC] bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-[999px] bg-[#FFE3D8] px-2 py-1 text-[13px] font-semibold text-[#FF6A4D]">
                  {post.status}
                </span>
                <span className="text-[13px] text-[#78737A]">모집 {post.capacity}명</span>
              </div>
              <p className="text-[17px] font-semibold text-[#262425]">{post.title}</p>
              <p className="text-[13px] text-[#78737A]">
                {post.country_name}
                {post.region_name ? ` · ${post.region_name}` : ""}
              </p>
              <p className="text-[13px] text-[#78737A]">
                {formatPeriod(post.start_date, post.end_date)}
              </p>
              {post.travel_styles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.travel_styles.map((style) => (
                    <span
                      key={style}
                      className="rounded-[999px] bg-[#F0EEEA] px-2 py-1 text-[12px] text-[#262425]"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
