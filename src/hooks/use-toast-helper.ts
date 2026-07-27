"use client"

import { toast as sonnerToast, type ExternalToast } from "sonner"

type ToastFn = (
  title: string,
  description?: string,
  opts?: ExternalToast,
) => string | number

interface ToastApi {
  success: ToastFn
  error: ToastFn
  warning: ToastFn
  info: ToastFn
  loading: ToastFn
  dismiss: (id?: string | number) => void
  raw: typeof sonnerToast
}

/**
 * Convenience wrapper around sonner's `toast` with named methods
 * that enforce a consistent (title, description) shape across the app.
 *
 * Usage:
 *   import { useToast } from "@/hooks/use-toast-helper"
 *   const { toast } = useToast()
 *   toast.success("Saved!", "Your changes have been applied")
 *
 * Backward-compatible: also exposes `success`/`error`/`warning`/`info`/`loading`
 * at the top level so callers using `const { success } = useToast()` still work.
 */
export function useToast() {
  const api: ToastApi = {
    success: (title, description, opts) =>
      sonnerToast.success(title, { description, ...opts }),
    error: (title, description, opts) =>
      sonnerToast.error(title, { description, ...opts }),
    warning: (title, description, opts) =>
      sonnerToast.warning(title, { description, ...opts }),
    info: (title, description, opts) =>
      sonnerToast.info(title, { description, ...opts }),
    loading: (title, description, opts) =>
      sonnerToast.loading(title, { description, ...opts }),
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
    raw: sonnerToast,
  }

  return {
    // Preferred API — `const { toast } = useToast(); toast.success(...)`
    toast: api,
    // Backward-compatible API — `const { success } = useToast()`
    ...api,
  }
}
