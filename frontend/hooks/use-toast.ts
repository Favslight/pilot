"use client";

import { useCallback, useState } from "react";

export type ToastKind = "success" | "error" | "warning" | "info";

export function useToast() {
  const [toast, setToast] = useState<{ message: string; kind: ToastKind } | null>(null);
  const showToast = useCallback((message: string, kind: ToastKind = "info") => {
    setToast({ message, kind });
    window.setTimeout(() => setToast(null), 3200);
  }, []);
  return { toast, showToast };
}
