"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AgeBand = "10s" | "20s" | "30s" | "40s" | "50s_plus";
type Gender = "male" | "female" | "other" | "unspecified";

const AGE_BAND_OPTIONS: { value: AgeBand; label: string }[] = [
  { value: "10s", label: "10대" },
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s", label: "40대" },
  { value: "50s_plus", label: "50대 이상" },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "unspecified", label: "선택 안 함" },
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "other", label: "기타" },
];

const TRAVEL_STYLE_OPTIONS = [
  "자연·힐링",
  "도심 미식",
  "가족 여행",
  "액티비티·모험",
  "문화·역사 탐방",
  "나 홀로 여행",
];

interface ProfileData {
  nickname: string;
  age_band: AgeBand | null;
  gender: Gender | null;
  travel_styles: string[];
  bio: string | null;
}

type LoadStatus = "loading" | "ready" | "error";

/**
 * 닉네임·연령대·성별(선택)·여행 스타일·자기소개 표시/수정(REQ-FUNC-029). 생년월일은 이 Card는
 * 물론 어떤 화면에서도 다루지 않는다 — 성인 확인은 AdultVerificationCard가 별도로 담당한다.
 */
export default function ProfileSummaryCard() {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setStatus("error");
        return;
      }
      if (!cancelled) setUserId(user.id);

      const { data, error } = await supabase
        .from("user_profile")
        .select("nickname, age_band, gender, travel_styles, bio")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;
      if (error || !data) {
        setStatus("error");
        return;
      }
      setProfile(data);
      setStatus("ready");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleTravelStyle = (style: string) => {
    setProfile((prev) => {
      if (!prev) return prev;
      const has = prev.travel_styles.includes(style);
      return {
        ...prev,
        travel_styles: has
          ? prev.travel_styles.filter((s) => s !== style)
          : [...prev.travel_styles, style],
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !userId) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("user_profile")
        .update({
          nickname: profile.nickname,
          age_band: profile.age_band,
          gender: profile.gender,
          travel_styles: profile.travel_styles,
          bio: profile.bio,
        })
        .eq("user_id", userId);
      setSaveMessage(error ? "저장에 실패했습니다." : "저장되었습니다.");
      // GlobalHeader는 마운트 시 1회 + 로그인/로그아웃 이벤트에만 닉네임을 다시 읽으므로,
      // 저장 직후 헤더 표시가 갱신되지 않는 문제(사용자 리포트)가 있었다. 저장 성공 시
      // 커스텀 이벤트로 알려 헤더가 다시 읽도록 한다.
      if (!error) window.dispatchEvent(new Event("ft:nickname-updated"));
    } catch {
      setSaveMessage("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div
        role="status"
        aria-label="프로필 불러오는 중"
        className="h-64 animate-pulse rounded-[16px] bg-[#F0EEEA]"
      />
    );
  }

  if (status === "error" || !profile) {
    return (
      <p className="rounded-[10px] bg-[#FDECEA] px-4 py-3 text-[14px] text-[#B3261E]">
        프로필을 불러오지 못했습니다.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="flex flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6"
    >
      <h2 className="text-[17px] font-semibold text-[#262425]">프로필</h2>

      <label htmlFor="profile-nickname" className="text-[13px] text-[#78737A]">
        닉네임
      </label>
      <input
        id="profile-nickname"
        type="text"
        value={profile.nickname}
        onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
        required
        maxLength={40}
        className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="profile-age-band" className="text-[13px] text-[#78737A]">
            연령대
          </label>
          <select
            id="profile-age-band"
            value={profile.age_band ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, age_band: (e.target.value || null) as AgeBand | null })
            }
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          >
            <option value="">선택 안 함</option>
            {AGE_BAND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="profile-gender" className="text-[13px] text-[#78737A]">
            성별(선택)
          </label>
          <select
            id="profile-gender"
            value={profile.gender ?? "unspecified"}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value as Gender })}
            className="min-h-[44px] rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
          >
            {GENDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] text-[#78737A]">여행 스타일</p>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_STYLE_OPTIONS.map((style) => {
            const isSelected = profile.travel_styles.includes(style);
            return (
              <button
                key={style}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleTravelStyle(style)}
                className={`flex min-h-[44px] items-center rounded-full px-4 text-[14px] font-medium ${
                  isSelected ? "bg-[#FF6A4D] text-white" : "bg-[#F0EEEA] text-[#262425]"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      <label htmlFor="profile-bio" className="text-[13px] text-[#78737A]">
        자기소개(선택)
      </label>
      <textarea
        id="profile-bio"
        value={profile.bio ?? ""}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        rows={3}
        maxLength={500}
        className="rounded-[10px] border border-[#E4E0DC] px-3 py-2 text-[15px] text-[#262425]"
      />

      {saveMessage && (
        <p
          className={`rounded-[10px] px-3 py-2 text-[13px] ${
            saveMessage === "저장되었습니다."
              ? "bg-[#E9F7EF] text-[#1E7C4C]"
              : "bg-[#FDECEA] text-[#B3261E]"
          }`}
        >
          {saveMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving || !profile.nickname.trim()}
        className="flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#FF6A4D] text-[16px] font-semibold text-white hover:bg-[#E14E32] disabled:cursor-not-allowed disabled:bg-[#FFE3D8]"
      >
        {isSaving ? "저장 중..." : "저장하기"}
      </button>
    </form>
  );
}
