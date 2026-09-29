"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup" | "reset";

interface GuestAuthFormProps {
  /** 로그인/회원가입 성공 후 Page Owner가 세션 상태를 다시 확인하도록 알리는 콜백. */
  onAuthenticated?: () => void;
}

function randomNicknameSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * Guest 상태의 로그인·회원가입·비밀번호 재설정 Form(REQ-FUNC-066). 비밀번호는 Supabase Auth가
 * 직접 관리하며 애플리케이션 코드는 어떤 형태로도 저장·로그하지 않는다.
 * `user_profile.nickname`은 NOT NULL UNIQUE라 회원가입 시 반드시 함께 입력받아 생성한다.
 */
export default function GuestAuthForm({ onAuthenticated }: GuestAuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovering(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const resetMessages = () => {
    setError(null);
    setNotice(null);
  };

  async function ensureUserProfile(userId: string, fallbackEmail: string) {
    const supabase = createClient();
    const { data: existing } = await supabase
      .from("user_profile")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) return;

    const desiredNickname = nickname.trim() || fallbackEmail.split("@")[0];
    // 먼저 입력받은 닉네임을 그대로 저장한다. `nickname`은 NOT NULL UNIQUE라 다른 계정과
    // 겹칠 때만(23505 unique_violation) 무작위 접미사를 붙여 재시도한다 — 항상 접미사를
    // 붙이면 사용자가 입력한 닉네임이 그대로 사라지는 문제가 있었다(사용자 리포트로 발견).
    const { error: insertError } = await supabase
      .from("user_profile")
      .insert({ user_id: userId, nickname: desiredNickname });
    if (insertError?.code === "23505") {
      await supabase.from("user_profile").insert({
        user_id: userId,
        nickname: `${desiredNickname}-${randomNicknameSuffix()}`,
      });
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      if (data.user) await ensureUserProfile(data.user.id, data.user.email ?? email);
      onAuthenticated?.();
    } catch {
      setError("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!nickname.trim()) {
      setError("닉네임을 입력해 주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          // 이메일 인증 링크를 통한 가입 완료(콜백 Route)는 이 Form의 handleSignup을 다시
          // 거치지 않으므로, 닉네임을 auth 메타데이터에 실어 보내 AccountPageSections의
          // 자동 복구 로직(ensureUserProfile과 동일한 목적)이 참조할 수 있게 한다.
          data: { nickname: nickname.trim() },
        },
      });
      if (signUpError) {
        setError("회원가입에 실패했습니다. 이미 가입된 이메일일 수 있습니다.");
        return;
      }
      if (data.session && data.user) {
        await ensureUserProfile(data.user.id, data.user.email ?? email);
        onAuthenticated?.();
      } else {
        setNotice("가입 확인 이메일을 보냈습니다. 메일함에서 인증 링크를 클릭해 주세요.");
      }
    } catch {
      setError("회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      });
      setNotice("비밀번호 재설정 링크를 이메일로 보냈습니다.");
    } catch {
      setError("재설정 메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setError("비밀번호 변경에 실패했습니다.");
        return;
      }
      setIsRecovering(false);
      setNotice("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.");
      onAuthenticated?.();
    } catch {
      setError("비밀번호 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRecovering) {
    return (
      <form
        onSubmit={handleSetNewPassword}
        className="flex flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6"
      >
        <h2 className="text-[17px] font-semibold text-[#262425]">새 비밀번호 설정</h2>
        <label htmlFor="new-password" className="text-[13px] text-[#78737A]">
          새 비밀번호
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
        />
        {error && (
          <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-[10px] bg-[#E9F7EF] px-3 py-2 text-[13px] text-[#1E7C4C]">
            {notice}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting || newPassword.length < 8}
          className="flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#FF6A4D] text-[16px] font-semibold text-white hover:bg-[#E14E32] disabled:cursor-not-allowed disabled:bg-[#FFE3D8]"
        >
          비밀번호 변경
        </button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6">
      <div
        role="tablist"
        aria-label="계정 인증 방법"
        className="flex gap-6 border-b border-[#E4E0DC]"
      >
        {(
          [
            { key: "login", label: "로그인" },
            { key: "signup", label: "회원가입" },
            { key: "reset", label: "비밀번호 재설정" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={mode === tab.key}
            onClick={() => {
              setMode(tab.key);
              resetMessages();
            }}
            className={`min-h-[44px] border-b-2 px-1 text-[15px] font-semibold ${
              mode === tab.key
                ? "border-[#FF6A4D] text-[#262425]"
                : "border-transparent text-[#78737A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={
          mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleResetRequest
        }
        className="flex flex-col gap-3"
      >
        <label htmlFor="account-email" className="text-[13px] text-[#78737A]">
          이메일
        </label>
        <input
          id="account-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
        />

        {mode !== "reset" && (
          <>
            <label htmlFor="account-password" className="text-[13px] text-[#78737A]">
              비밀번호
            </label>
            <input
              id="account-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
            />
          </>
        )}

        {mode === "signup" && (
          <>
            <label htmlFor="account-password-confirm" className="text-[13px] text-[#78737A]">
              비밀번호 확인
            </label>
            <input
              id="account-password-confirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              minLength={8}
              className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
            />

            <label htmlFor="account-nickname" className="text-[13px] text-[#78737A]">
              닉네임
            </label>
            <input
              id="account-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              maxLength={40}
              className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
            />
          </>
        )}

        {error && (
          <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-[10px] bg-[#E9F7EF] px-3 py-2 text-[13px] text-[#1E7C4C]">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#FF6A4D] text-[16px] font-semibold text-white hover:bg-[#E14E32] disabled:cursor-not-allowed disabled:bg-[#FFE3D8]"
        >
          {mode === "login" ? "로그인" : mode === "signup" ? "회원가입" : "재설정 메일 보내기"}
        </button>
      </form>
    </div>
  );
}
