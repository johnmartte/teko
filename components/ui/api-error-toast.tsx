"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";

type Props = {
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
};

export default function ApiErrorToast({
  message = "No pudimos cargar la información. Intenta de nuevo.",
  onRetry,
  onDismiss,
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-32px)] max-w-[480px] -translate-x-1/2 animate-[slideUp_0.3s_ease-out]">
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-white px-5 py-4 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] dark:border-red-500/20 dark:bg-[#1a1f2e] dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </div>

        <p className="flex-1 text-[13px] leading-[18px] text-[#252b37] dark:text-white/90">
          {message}
        </p>

        <div className="flex items-center gap-1">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#7a8595] transition-colors hover:bg-[#f4f7ff] hover:text-[#0047ff] dark:hover:bg-white/10 dark:hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => {
              setVisible(false);
              onDismiss?.();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#7a8595] transition-colors hover:bg-[#f4f7ff] hover:text-[#101828] dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
