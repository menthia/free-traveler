export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
}

const VARIANT_STYLES: Record<ToastVariant, { text: string; bg: string; label: string }> = {
  success: { text: "#1E7C4C", bg: "#E9F7EF", label: "성공" },
  error: { text: "#B3261E", bg: "#FDECEA", label: "오류" },
  info: { text: "#1D5C8A", bg: "#EAF3FA", label: "안내" },
  warning: { text: "#9A5B12", bg: "#FFF3E1", label: "주의" },
};

function VariantIcon({ variant, color }: { variant: ToastVariant; color: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (variant) {
    case "success":
      return (
        <svg {...common}>
          <path d="M4 10.5l4 4 8-9" />
        </svg>
      );
    case "error":
      return (
        <svg {...common}>
          <path d="M6 6l8 8M14 6l-8 8" />
        </svg>
      );
    case "warning":
      return (
        <svg {...common}>
          <path d="M10 3l8 14H2l8-14z" />
          <path d="M10 8v3.5M10 14.5h.01" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg {...common}>
          <circle cx="10" cy="10" r="8" />
          <path d="M10 9v5M10 6.5h.01" />
        </svg>
      );
  }
}

interface ToastProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

export default function Toast({ item, onDismiss }: ToastProps) {
  const style = VARIANT_STYLES[item.variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-w-[280px] max-w-sm items-start gap-3 rounded-[16px] p-4"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        boxShadow: "0 1px 2px rgba(38,36,37,0.06), 0 8px 20px rgba(38,36,37,0.08)",
      }}
    >
      <VariantIcon variant={item.variant} color={style.text} />
      <div className="flex-1 text-[14px] leading-[1.5]">
        <span className="mr-1 font-semibold">{style.label}:</span>
        {item.message}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="알림 닫기"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ color: style.text }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2 2l10 10M12 2L2 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
