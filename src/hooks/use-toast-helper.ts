"use client"

import { toast as sonnerToast, type ExternalToast } from "sonner"

/**
 * Convenience wrapper around sonner's `toast` with named methods
 * that enforce a consistent (title, description) shape across the app.
 *
 * Usage:
 *   import { useToast } from "@/hooks/use-toast-helper"
 *   const { toast } = useToast()
 *   toast.success("Saved!", "Your changes have been applied")
 */
export function useToast() {
  return {
    /** Display a success toast */
    success: (title: string, description?: string, opts?: ExternalToast) =>
      sonnerToast.success(title, {
        description,
        ...opts,
      }),

    /** Display an error toast */
    error: (title: string, description?: string, opts?: ExternalToast) =>
      sonnerToast.error(title, {
        description,
        ...opts,
      }),

    /** Display a warning toast */
    warning: (title: string, description?: string, opts?: ExternalToast) =>
      sonnerToast.warning(title, {
        description,
        ...opts,
      }),

    /** Display an info toast */
    info: (title: string, description?: string, opts?: ExternalToast) =>
      sonnerToast.info(title, {
        description,
        ...opts,
      }),

    /** Display a loading toast — returns the id so you can update/dismiss it */
    loading: (title: string, description?: string, opts?: ExternalToast) =>
      sonnerToast.loading(title, {
        description,
        ...opts,
      }),

    /** Dismiss a toast by id */
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),

    /** Direct access to the underlying sonner toast for advanced usage */
    raw: sonnerToast,
  }
}
