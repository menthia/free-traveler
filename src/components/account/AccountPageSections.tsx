"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import GuestAuthForm from "./GuestAuthForm";
import ProfileSummaryCard from "./ProfileSummaryCard";
import AdultVerificationCard from "./AdultVerificationCard";
import PolicyConsentStatus from "./PolicyConsentStatus";
import MyActivityLists from "./MyActivityLists";
import AdminReportQueue from "./AdminReportQueue";
import AdminExternalUrlForm from "./AdminExternalUrlForm";

type Role = "guest" | "member" | "admin";
type RoleStatus = "loading" | "ready" | "error";
type MemberTab = "profile" | "activity" | "admin";

function randomNicknameSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

const FEATURE_CHIPS = [
  "동행 모집글 작성",
  "참가 요청 보내기",
  "여행지 즐겨찾기 동기화",
  "신고·차단",
];

/**
 * SCR-005의 역할(Guest/Member/Admin) 판별 state를 들고 있는 유일한 Client wrapper.
 * Page Owner(PAGE-SCR005)는 `generateMetadata`를 export해야 해서 Server Component여야
 * 하므로, 이 state는 여기서 대신 소유한다(PAGE-SCR003/PAGE-SCR004와 동일한 선례).
 * 역할별 데이터 접근은 DB RLS가 서버에서 강제하며, 여기서의 역할 분기는 UI 조립만 담당한다.
 */
export default function AccountPageSections() {
  const [status, setStatus] = useState<RoleStatus>("loading");
  const [role, setRole] = useState<Role>("guest");
  const [activeTab, setActiveTab] = useState<MemberTab>("profile");

  const checkRole = async () => {
    setStatus("loading");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setRole("guest");
        setStatus("ready");
        return;
      }
      let { data: profile } = await supabase
        .from("user_profile")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      // 이메일 인증 링크로 가입을 완료한 경우 GuestAuthForm.handleSignup의
      // ensureUserProfile을 거치지 않아 user_profile 행이 없을 수 있다(발견된 실제 버그:
      // "이메일 인증 후 화면에서 프로필 조회가 안됨"). 여기서 한 번 더 자동 생성을 시도한다.
      if (!profile) {
        const desiredNickname =
          (user.user_metadata?.nickname as string | undefined)?.trim() ||
          (user.email ?? "traveler").split("@")[0];
        // 회원가입 시 입력한 닉네임을 그대로 저장한다. 다른 계정과 겹칠 때만(23505
        // unique_violation) 무작위 접미사를 붙여 재시도한다(GuestAuthForm.ensureUserProfile과
        // 동일한 이유 — 항상 접미사를 붙이면 입력한 닉네임이 사라진다).
        const { data: created, error: insertError } = await supabase
          .from("user_profile")
          .insert({ user_id: user.id, nickname: desiredNickname })
          .select("role")
          .maybeSingle();
        if (insertError?.code === "23505") {
          const { data: retried } = await supabase
            .from("user_profile")
            .insert({
              user_id: user.id,
              nickname: `${desiredNickname}-${randomNicknameSuffix()}`,
            })
            .select("role")
            .maybeSingle();
          profile = retried;
        } else {
          profile = created;
        }
      }

      setRole(profile?.role === "moderator" || profile?.role === "admin" ? "admin" : "member");
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    // 마운트 시 1회 세션·role을 조회하는 일회성 fetch다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkRole();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setActiveTab("profile");
    checkRole();
  };

  if (status === "loading") {
    return (
      <div role="status" aria-label="계정 정보 불러오는 중" className="flex flex-col gap-4">
        <div className="h-32 animate-pulse rounded-[16px] bg-[#F0EEEA]" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[16px] bg-[#FDECEA] p-6 text-center">
        <p className="text-[14px] text-[#B3261E]">계정 정보를 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={checkRole}
          className="min-h-[44px] rounded-[10px] bg-[#FF6A4D] px-6 text-[14px] font-semibold text-white hover:bg-[#E14E32]"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (role === "guest") {
    return (
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-[26px] font-bold text-[#262425] md:text-[36px]">계정</h1>
          <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4749]">
            로그인하면 동행 모집글 작성, 참가 요청, 즐겨찾기 동기화 등의 기능을 이용할 수 있습니다.
          </p>
        </div>

        <GuestAuthForm onAuthenticated={checkRole} />

        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-[#78737A]">로그인 후 이용 가능한 기능</p>
          <div className="flex flex-wrap gap-2">
            {FEATURE_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-[#F0EEEA] px-4 py-2 text-[14px] text-[#262425]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <p className="rounded-[10px] bg-[#EAF3FA] px-4 py-3 text-[13px] text-[#1D5C8A]">
          비밀번호는 Supabase Auth가 안전하게 관리하며 이 서비스는 평문으로 저장하지 않습니다.
        </p>
      </div>
    );
  }

  const tabs: { key: MemberTab; label: string }[] =
    role === "admin"
      ? [
          { key: "profile", label: "프로필" },
          { key: "activity", label: "내 활동" },
          { key: "admin", label: "관리자" },
        ]
      : [
          { key: "profile", label: "프로필" },
          { key: "activity", label: "내 활동" },
        ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold text-[#262425] md:text-[36px]">계정</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-4 text-[14px] font-semibold text-[#262425] hover:bg-[#F7F6F4]"
        >
          로그아웃
        </button>
      </div>

      <div
        role="tablist"
        aria-label="계정 메뉴"
        className="flex gap-6 overflow-x-auto border-b border-[#E4E0DC]"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`min-h-[44px] shrink-0 border-b-2 px-1 text-[16px] font-semibold whitespace-nowrap ${
              activeTab === tab.key
                ? "border-[#FF6A4D] text-[#262425]"
                : "border-transparent text-[#78737A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="flex flex-col gap-6">
          <ProfileSummaryCard />
          <AdultVerificationCard />
          <PolicyConsentStatus />
        </div>
      )}

      {activeTab === "activity" && <MyActivityLists />}

      {activeTab === "admin" && role === "admin" && (
        <div className="flex flex-col gap-6">
          <p className="text-[15px] text-[#4B4749]">
            신고 처리와 외부 예약 사이트 URL을 관리합니다.
          </p>
          <AdminReportQueue />
          <AdminExternalUrlForm />
        </div>
      )}
    </div>
  );
}
