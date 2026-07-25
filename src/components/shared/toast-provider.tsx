"use client"

import { useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner"

/**
 * ToastProvider — wraps Sonner's <Toaster> with custom theme,
 * positioning, and a global Alt+T keyboard shortcut to toggle toast history.
 *
 * Mount this component (once) inside your root layout.
 */
export function ToastProvider() {
  const { theme = "system" } = useTheme()

  // ---- Alt+T → toggle toast history ----
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.altKey && e.key.toLowerCase() === "t") {
      e.preventDefault()
      const count = document.querySelectorAll("[data-sonner-toast]").length
      sonnerToast.info("Toast history", {
        description: count > 0
          ? `${count} active toast${count > 1 ? "s" : ""} on screen`
          : "No active toasts",
        duration: 2000,
        id: "alt-t-history",
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      position="top-right"
      richColors
      expand
      closeButton
      className="toast-custom"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "toast-item",
          title: "toast-title",
          description: "toast-description",
          actionButton: "toast-action",
          cancelButton: "toast-cancel",
          closeButton: "toast-close",
        },
      }}
    />
  )
}
