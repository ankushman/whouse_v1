"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { warehouses } from "@/data/mock-data"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Settings,
  Sun,
  Moon,
  Building2,
  Shield,
  Palette,
  Bell,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const roles = ["Executive", "Regional Manager", "Warehouse Manager", "Supervisor", "Operator"]

function QuickRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function QuickSettingsPopover() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { currentRole, setCurrentRole, selectedWarehouse, setSelectedWarehouse } = useAppStore()
  const [compactMode, setCompactMode] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const isDark = theme === "dark"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="icon-badge relative h-8 w-8 rounded-lg transition-all duration-200 hover:scale-105"
        >
          <Settings className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="bottom"
        className="glass-morphism w-72 rounded-xl border-border/60 p-0 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border/50 px-3 py-2.5">
          <Sparkles className="size-3.5 text-blue-500" />
          <span className="text-xs font-semibold">Quick Settings</span>
        </div>

        <div className="p-3 space-y-1">
          {/* Theme Toggle */}
          <QuickRow
            icon={isDark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
            label={isDark ? "Dark Mode" : "Light Mode"}
          >
            <Switch
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="scale-90"
            />
          </QuickRow>

          <Separator className="my-1" />

          {/* Warehouse Selector */}
          <QuickRow
            icon={<Building2 className="size-3.5" />}
            label="Warehouse"
          >
            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
            >
              <SelectTrigger className="h-7 w-[130px] text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id} className="text-[11px]">
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </QuickRow>

          {/* Role Switcher */}
          <QuickRow
            icon={<Shield className="size-3.5" />}
            label="Role"
          >
            <Select
              value={currentRole}
              onValueChange={(v) => setCurrentRole(v as typeof currentRole)}
            >
              <SelectTrigger className="h-7 w-[130px] text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role} className="text-[11px]">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </QuickRow>

          {/* Compact Mode */}
          <QuickRow
            icon={
              <svg className="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="14" height="14" rx="2" />
                <line x1="1" y1="5.5" x2="15" y2="5.5" />
                <line x1="1" y1="10.5" x2="15" y2="10.5" />
              </svg>
            }
            label="Compact Mode"
          >
            <Switch
              checked={compactMode}
              onCheckedChange={setCompactMode}
              className="scale-90"
            />
          </QuickRow>

          <Separator className="my-1" />

          {/* Quick Links */}
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 px-0 py-1">
              Quick Links
            </p>
            {[
              { label: "Appearance", icon: <Palette className="size-3" />, value: "appearance" },
              { label: "Notifications", icon: <Bell className="size-3" />, value: "notif-prefs" },
              { label: "KPI Config", icon: <Settings className="size-3" />, value: "kpi" },
            ].map((link) => (
              <button
                key={link.value}
                onClick={() => {
                  router.push("/")
                  setOpen(false)
                  // Use setTimeout to allow navigation to settle
                  setTimeout(() => {
                    const tabBtn = document.querySelector(`[value="${link.value}"]`) as HTMLElement
                    tabBtn?.click()
                  }, 100)
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <div className="flex items-center gap-2">
                  {link.icon}
                  {link.label}
                </div>
                <ChevronRight className="size-3 opacity-40" />
              </button>
            ))}
          </div>

          <Separator className="my-1" />

          {/* Full Settings Link */}
          <button
            onClick={() => {
              router.push("/")
              setOpen(false)
              const generalTab = document.querySelector('[value="general"]') as HTMLElement
              generalTab?.click()
              const settingsNav = document.querySelector('[data-view="settings"]') as HTMLElement
              settingsNav?.click()
            }}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            <span>Open Full Settings</span>
            <ChevronRight className="size-3" />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
