"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast-helper"

/**
 * SharedModuleDrawer — reusable drawer wrapper for all module detail views.
 * Eliminates per-module drawer boilerplate (gradient header, field grid, actions).
 *
 * Usage:
 *   <SharedModuleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
 *     <SharedModuleDrawer.Header
 *       title="Vessel Details"
 *       subtitle="MV Ocean Star"
 *       gradient="from-teal-600 to-sky-600"
 *       icon={<Ship className="h-5 w-5 text-white" />}
 *     />
 *     <SharedModuleDrawer.Body>
 *       <Badges />
 *       <MetricsGrid items={[...]} />
 *       <FieldGrid items={[{label: "Port", value: "JNPT"}]} />
 *     </SharedModuleDrawer.Body>
 *     <SharedModuleDrawer.Actions>
 *       <Button size="sm" onClick={fn}>Action</Button>
 *     </SharedModuleDrawer.Actions>
 *   </SharedModuleDrawer>
 */

interface SharedModuleDrawerProps {
  open: boolean
  onClose: (open: boolean) => void
  children: React.ReactNode
}

export function SharedModuleDrawer({ open, onClose, children }: SharedModuleDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[420px] overflow-y-auto">
        {children}
      </SheetContent>
    </Sheet>
  )
}

// ─── Header ────────────────────────────────────────────

interface HeaderProps {
  title: string
  subtitle?: string
  gradient: string
  icon?: React.ReactNode
  badges?: React.ReactNode
}

function Header({ title, subtitle, gradient, icon, badges }: HeaderProps) {
  return (
    <SheetHeader>
      <div className={cn("h-24 -mx-6 -mt-6 mb-4 flex items-end px-6 pb-3 rounded-b-lg bg-gradient-to-r", gradient)}>
        <SheetTitle className="text-white text-sm">{title}</SheetTitle>
      </div>
      {subtitle && (
        <SheetDescription className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </SheetDescription>
      )}
      {(icon || badges) && (
        <div className="mt-3 flex items-center gap-3">
          {icon}
          <div className="flex gap-2 flex-wrap">{badges}</div>
        </div>
      )}
    </SheetHeader>
  )
}
SharedModuleDrawer.Header = Header

// ─── Body ──────────────────────────────────────────────

interface BodyProps {
  children: React.ReactNode
}

function Body({ children }: BodyProps) {
  return <div className="mt-4 space-y-4">{children}</div>
}
SharedModuleDrawer.Body = Body

// ─── Metrics Grid ───────────────────────────────────────

interface MetricItem {
  label: string
  value: string | number
  color: string
}

interface MetricsGridProps {
  items: MetricItem[]
  columns?: 2 | 3
}

function MetricsGrid({ items, columns = 3 }: MetricsGridProps) {
  return (
    <div className={cn("grid gap-2", columns === 2 ? "grid-cols-2" : "grid-cols-3")}>
      {items.map((item, i) => (
        <div key={i} className="smod-stat-card rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900">
          <div className="text-[10px] text-gray-500">{item.label}</div>
          <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}</div>
        </div>
      ))}
    </div>
  )
}
SharedModuleDrawer.MetricsGrid = MetricsGrid

// ─── Field Grid ─────────────────────────────────────────

interface FieldItem {
  label: string
  value: React.ReactNode
  span?: boolean
}

interface FieldGridProps {
  items: FieldItem[]
}

function FieldGrid({ items }: FieldGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      {items.map((item, i) => (
        <div key={i} className={cn("flex justify-between", item.span && "col-span-2")}>
          <span className="text-gray-500">{item.label}</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
SharedModuleDrawer.FieldGrid = FieldGrid

// ─── Actions ───────────────────────────────────────────

interface ActionsProps {
  children: React.ReactNode
}

function Actions({ children }: ActionsProps) {
  return <div className="flex gap-2 pt-2 border-t">{children}</div>
}
SharedModuleDrawer.Actions = Actions

// ─── Reusable Visual Components ────────────────────────

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  height?: string
  label?: string
  showPercent?: boolean
}

export function ProgressBar({ value, max = 100, color, height = "8px", label, showPercent = true }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  const resolvedColor = color || (pct < 40 ? "#059669" : pct < 70 ? "#d97706" : pct < 90 ? "#ea580c" : "#e11d48")
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-[10px] text-gray-500 min-w-[48px]">{label}</span>}
      <div className="smod-bar-track" style={{ height }}>
        <div className="smod-bar-fill" style={{ width: `${pct}%`, background: resolvedColor }} />
      </div>
      {showPercent && <span className="text-[10px] font-semibold min-w-[30px] text-right" style={{ color: resolvedColor }}>{pct}%</span>}
    </div>
  )
}

interface PillBadgeProps {
  children: React.ReactNode
  colorClass?: string
}

export function PillBadge({ children, colorClass }: PillBadgeProps) {
  return (
    <span className={cn("smod-pill", colorClass || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300")}>
      {children}
    </span>
  )
}

interface InfoBlockProps {
  title: string
  children: React.ReactNode
}

export function InfoBlock({ title, children }: InfoBlockProps) {
  return (
    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs">
      <div className="text-[10px] text-gray-500 mb-0.5">{title}</div>
      <div>{children}</div>
    </div>
  )
}
