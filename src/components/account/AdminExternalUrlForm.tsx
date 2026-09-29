"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/toast-context";

type OutboundLinkKey = "flight" | "hotel";
type RoleCheckStatus = "loading" | "allowed" | "denied";

const FIELD_LABELS: Record<OutboundLinkKey, string> = {
  flight: "항공 예약 사이트 URL",
  hotel: "숙소 예약 사이트 URL",
};

/**
 * 관리자 외부 URL 설정(REQ-FUNC-077). HTTP/javascript/data URL은 클라이언트에서도 먼저
 * 막지만(즉각적인 오류 표시), 최종 강제는 API-ADMIN-OUTBOUND-SETTINGS 서버 검증과
 * `outbound_link_setting_https_only` DB check 제약이 담당한다. Admin이 아니면 이 Component
 * 자체를 렌더링하지 않는다.
 */
export default function AdminExternalUrlForm() {
  const { showToast } = useToast();
  const [roleStatus, setRoleStatus] = useState<RoleCheckStatus>("loading");
  const [values, setValues] = useState<Record<OutboundLinkKey, string>>({ flight: "", hotel: "" });
  const [savingKey, setSavingKey] = useState<OutboundLinkKey | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<OutboundLinkKey, string | null>>({
    flight: null,
    hotel: null,
  });

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setRoleStatus("denied");
        return;
      }
      const { data: profile } = await supabase
        .from("user_profile")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;

      if (profile?.role !== "admin") {
        setRoleStatus("denied");
        return;
      }
      setRoleStatus("allowed");

      const res = await fetch("/api/admin/settings/outbound");
      if (res.ok) {
        const body = await res.json();
        const settings = (body.settings ?? []) as { setting_key: OutboundLinkKey; url: string }[];
        if (!cancelled) {
          setValues({
            flight: settings.find((s) => s.setting_key === "flight")?.url ?? "",
            hotel: settings.find((s) => s.setting_key === "hotel")?.url ?? "",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (key: OutboundLinkKey) => {
    const url = values[key].trim();
    if (!/^https:\/\//i.test(url)) {
      setFieldErrors((prev) => ({
        ...prev,
        [key]: "https:// 로 시작하는 주소만 저장할 수 있습니다.",
      }));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, [key]: null }));
    setSavingKey(key);
    try {
      const res = await fetch("/api/admin/settings/outbound", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settingKey: key, url }),
      });
      if (res.ok) {
        showToast("success", `${FIELD_LABELS[key]}이 저장되었습니다.`);
      } else {
        const body = await res.json().catch(() => null);
        setFieldErrors((prev) => ({
          ...prev,
          [key]:
            body?.error === "HTTPS_URL_REQUIRED"
              ? "HTTPS 주소만 저장할 수 있습니다."
              : "저장에 실패했습니다.",
        }));
        showToast("error", "저장에 실패했습니다.");
      }
    } catch {
      setFieldErrors((prev) => ({ ...prev, [key]: "저장에 실패했습니다." }));
      showToast("error", "저장에 실패했습니다.");
    } finally {
      setSavingKey(null);
    }
  };

  if (roleStatus === "loading" || roleStatus === "denied") return null;

  return (
    <div className="flex flex-col gap-4 rounded-[16px] border border-[#E4E0DC] bg-white p-6">
      <h2 className="text-[17px] font-semibold text-[#262425]">외부 URL 설정</h2>
      {(["flight", "hotel"] as const).map((key) => (
        <div key={key} className="flex flex-col gap-1">
          <label htmlFor={`outbound-url-${key}`} className="text-[13px] text-[#78737A]">
            {FIELD_LABELS[key]}
          </label>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              id={`outbound-url-${key}`}
              type="text"
              value={values[key]}
              onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder="https://"
              className="min-h-[44px] flex-1 rounded-[10px] border border-[#E4E0DC] px-3 text-[15px] text-[#262425]"
            />
            <button
              type="button"
              onClick={() => handleSave(key)}
              disabled={savingKey === key}
              className="min-h-[44px] rounded-[10px] bg-[#FF6A4D] px-6 text-[14px] font-semibold text-white hover:bg-[#E14E32] disabled:cursor-not-allowed disabled:bg-[#FFE3D8]"
            >
              {savingKey === key ? "저장 중..." : "저장"}
            </button>
          </div>
          {fieldErrors[key] && (
            <p className="rounded-[10px] bg-[#FDECEA] px-3 py-2 text-[13px] text-[#B3261E]">
              {fieldErrors[key]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
