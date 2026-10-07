"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "verifying" | "verified" | "error";

/**
 * 이메일 인증 링크를 "클릭 즉시 자동 검증"하지 않고, 사용자가 버튼을 눌러야만
 * `verifyOtp`를 호출하는 확인 페이지(REQ-FUNC-066). Supabase의 기본 패턴처럼 이메일
 * 링크 자체가 1회용 GET으로 토큰을 바로 소모하면, Gmail 등 메일 보안 스캐너가 링크를
 * 미리 열어보는 것만으로 토큰이 소진되어 "otp_expired"가 발생한다(사용자 리포트로 발견).
 * 이 페이지는 `token_hash`만 받아두고, 실제 `verifyOtp` 호출은 사람이 버튼을 눌렀을 때만
 * 실행해 스캐너에 의한 사전 소모를 막는다.
 */
function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const handleVerify = async () => {
    if (!tokenHash || type !== "recovery") {
      setStatus("error");
      setError("인증 링크가 올바르지 않습니다. 비밀번호 재설정을 다시 요청해 주세요.");
      return;
    }
    setStatus("verifying");
    setError(null);
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });
    if (verifyError) {
      setStatus("error");
      setError(
        "인증 링크가 만료되었거나 이미 사용되었습니다. 비밀번호 재설정을 다시 요청해 주세요.",
      );
      return;
    }
    setStatus("verified");
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError("비밀번호 변경에 실패했습니다.");
      return;
    }
    router.push("/account");
  };

  if (status === "verified") {
    return (
      <form
        onSubmit={handleSetNewPassword}
        className="mx-auto flex max-w-md flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6"
      >
        <h1 className="text-[17px] font-semibold text-[#262425]">새 비밀번호 설정</h1>
        <label htmlFor="confirm-new-password" className="text-[13px] text-[#78737A]">
          새 비밀번호
        </label>
        <input
          id="confirm-new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
          className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
        />
        {error && (
          <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={newPassword.length < 8}
          className="flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#FF6A4D] text-[16px] font-semibold text-white hover:bg-[#E14E32] disabled:cursor-not-allowed disabled:bg-[#FFE3D8]"
        >
          비밀번호 변경
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6 text-center">
      <h1 className="text-[17px] font-semibold text-[#262425]">비밀번호 재설정</h1>
      <p className="text-[14px] text-[#4B4749]">
        아래 버튼을 눌러야 재설정 인증이 진행됩니다(이메일 미리보기로 인한 오인증 방지).
      </p>
      {error && (
        <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">{error}</p>
      )}
      <button
        type="button"
        onClick={handleVerify}
        disabled={status === "verifying"}
        className="flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#FF6A4D] text-[16px] font-semibold text-white hover:bg-[#E14E32] disabled:cursor-not-allowed disabled:bg-[#FFE3D8]"
      >
        {status === "verifying" ? "확인 중..." : "비밀번호 재설정 계속하기"}
      </button>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
      <Suspense fallback={null}>
        <ConfirmContent />
      </Suspense>
    </div>
  );
}
