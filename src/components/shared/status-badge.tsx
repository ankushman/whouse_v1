import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const variantClasses = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  gray: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800",
}

const dotClasses = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  gray: "bg-slate-500",
}

interface StatusBadgeProps {
  status: string
  variant?: keyof typeof variantClasses
  className?: string
}

export function StatusBadge({ status, variant = "gray", className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        variantClasses[variant],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[variant])} />
      {status}
    </Badge>
  )
}
