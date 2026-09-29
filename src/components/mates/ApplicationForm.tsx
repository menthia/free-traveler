"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/toast-context";

const MAX_MESSAGE_LENGTH = 500;

type GateStatus = "loading" | "guest" | "ready";

interface ApplicationFormProps {
  postId: string;
}

/**
 * 참가 요청 제출 Form. 참가 메시지는 MATE_APPLICATION.message에만 저장되며, RLS가 신청자
 * 본인·글 작성자·Moderator/Admin만 열람하게 강제한다(API-APPLICATIONS/DB-RLS-BASE).
 */
export default function ApplicationForm({ postId }: ApplicationFormProps) {
  const { showToast } = useToast();
  const [gateStatus, setGateStatus] = useState<GateStatus>("loading");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) setGateStatus(user ? "ready" : "guest");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/mates/${postId}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.error === "DUPLICATE_APPLICATION") {
          setSubmitError("이미 이 동행글에 참가 요청을 보냈습니다.");
        } else if (body?.error === "OWNER_CANNOT_APPLY") {
          setSubmitError("본인이 작성한 동행글에는 참가 요청을 보낼 수 없습니다.");
        } else if (body?.error === "LOGIN_REQUIRED") {
          setGateStatus("guest");
        } else {
          setSubmitError("참가 요청 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
        showToast("error", "참가 요청 전송에 실패했습니다.");
        return;
      }

      setSubmitted(true);
      showToast("success", "참가 요청을 보냈습니다.");
    } catch {
      setSubmitError("네트워크 오류로 참가 요청을 보내지 못했습니다.");
      showToast("error", "참가 요청 전송에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gateStatus === "loading") {
    return (
      <div
        role="status"
        aria-label="참가 요청 가능 여부 확인 중"
        className="h-24 animate-pulse rounded-[10px] bg-[#F0EEEA]"
      />
    );
  }

  if (gateStatus === "guest") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[10px] border border-[#E4E0DC] p-4 text-center">
        <p className="text-[14px] text-[#4B4749]">참가 요청은 로그인 후 보낼 수 있습니다.</p>
        <Link href="/account" className="font-semibold text-[#FF6A4D] underline">
          로그인/가입하기
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <p className="rounded-[10px] bg-[#E9F7EF] px-4 py-3 text-[14px] text-[#1E7C4C]">
        참가 요청을 보냈습니다. 작성자가 승인하면 알림으로 확인할 수 있습니다.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="mate-application-message" className="text-[13px] text-[#78737A]">
        참가 요청 메시지(비공개, 최대 {MAX_MESSAGE_LENGTH}자)
      </label>
      <textarea
        id="mate-application-message"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
        rows={4}
        className="rounded-[10px] border border-[#E4E0DC] px-3 py-2 text-[15px] text-[#262425]"
      />
      <p className="text-right text-[13px] text-[#78737A]">
        {message.length}/{MAX_MESSAGE_LENGTH}
      </p>

      {submitError && (
        <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={!message.trim() || isSubmitting}
        className={`flex min-h-[44px] items-center justify-center rounded-[10px] px-6 text-[16px] font-semibold text-white ${
          message.trim() && !isSubmitting
            ? "bg-[#FF6A4D] hover:bg-[#E14E32]"
            : "cursor-not-allowed bg-[#FFE3D8]"
        }`}
      >
        {isSubmitting ? "전송 중..." : "참가 요청 보내기"}
      </button>
    </form>
  );
}
