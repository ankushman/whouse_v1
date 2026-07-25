"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ShortcutItem {
  keys: string[]
  label: string
  description?: string
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ["⌘", "K"], label: "Command Palette", description: "Search and navigate to any module" },
  { keys: ["?"], label: "Keyboard Shortcuts", description: "Show this help dialog" },
  { keys: ["1"], label: "Dashboard", description: "Navigate to Dashboard" },
  { keys: ["2"], label: "Warehouses", description: "Navigate to Warehouses" },
  { keys: ["3"], label: "Inbound", description: "Navigate to Inbound" },
  { keys: ["4"], label: "Outbound", description: "Navigate to Outbound" },
  { keys: ["5"], label: "Inventory", description: "Navigate to Inventory" },
  { keys: ["6"], label: "Alerts", description: "Navigate to Alerts" },
  { keys: ["D"], label: "Toggle Dark Mode", description: "Switch between light and dark theme" },
  { keys: ["Escape"], label: "Close / Back", description: "Close current overlay or dialog" },
]

const CATEGORY_SHORTCUTS = [
  { keys: ["⌘", "1"], label: "Operations", description: "Navigate to first operations module" },
  { keys: ["⌘", "2"], label: "Analytics", description: "Navigate to first analytics module" },
  { keys: ["⌘", "."], label: "Settings", description: "Navigate to Settings" },
]

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    },
    []
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-sm">
              ⌨️
            </span>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Navigate faster with these keyboard shortcuts. Press <kbd className="inline-flex items-center rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-semibold">?</kbd> to toggle this dialog.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 -mx-1">
          {/* Navigation Shortcuts */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              Navigation
            </h4>
            <div className="space-y-1">
              {SHORTCUTS.map((shortcut) => (
                <div
                  key={shortcut.label}
                  className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium">{shortcut.label}</span>
                    {shortcut.description && (
                      <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                        — {shortcut.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {shortcut.keys.map((key, i) => (
                      <span key={i}>
                        <kbd
                          className={cn(
                            "inline-flex h-6 min-w-[24px] items-center justify-center rounded border bg-background px-1.5 text-[11px] font-mono font-semibold shadow-sm transition-colors",
                            "border-border text-foreground hover:bg-muted"
                          )}
                        >
                          {key}
                        </kbd>
                        {i < shortcut.keys.length - 1 && (
                          <span className="text-muted-foreground mx-0.5 text-[10px]">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Command Shortcuts */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
              Quick Commands
            </h4>
            <div className="space-y-1">
              {CATEGORY_SHORTCUTS.map((shortcut) => (
                <div
                  key={shortcut.label}
                  className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium">{shortcut.label}</span>
                    {shortcut.description && (
                      <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                        — {shortcut.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {shortcut.keys.map((key, i) => (
                      <span key={i}>
                        <kbd
                          className={cn(
                            "inline-flex h-6 min-w-[24px] items-center justify-center rounded border bg-background px-1.5 text-[11px] font-mono font-semibold shadow-sm transition-colors",
                            "border-border text-foreground hover:bg-muted"
                          )}
                        >
                          {key}
                        </kbd>
                        {i < shortcut.keys.length - 1 && (
                          <span className="text-muted-foreground mx-0.5 text-[10px]">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
