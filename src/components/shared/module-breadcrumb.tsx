"use client"

import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ModuleBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function ModuleBreadcrumb({ items, className }: ModuleBreadcrumbProps) {
  return (
    <nav className={cn("module-breadcrumb flex items-center gap-1 text-xs text-muted-foreground", className)}>
      <Home className="h-3 w-3" />
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 opacity-50" />
          {item.href ? (
            <a
              href={item.href}
              className="module-breadcrumb-link hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span className="module-breadcrumb-current font-medium text-foreground">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
export default ModuleBreadcrumb
