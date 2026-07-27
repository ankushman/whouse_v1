"use client"

import { forwardRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  hover?: boolean
  glow?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = false, glow = false, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "card-glass",
          hover && "card-glass-hover",
          glow && "card-glass-hover shadow-[0_0_20px_oklch(0.588_0.243_264/0.08)]",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    )
  }
)
GlassCard.displayName = "GlassCard"

// Sub-components that forward className
export function GlassCardHeader({ className, ...props }: React.ComponentPropsWithoutRef<typeof CardHeader>) {
  return <CardHeader className={className} {...props} />
}

export function GlassCardContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof CardContent>) {
  return <CardContent className={className} {...props} />
}

export function GlassCardTitle({ className, ...props }: React.ComponentPropsWithoutRef<typeof CardTitle>) {
  return <CardTitle className={cn("text-sm font-semibold", className)} {...props} />
}

export function GlassCardDescription({ className, ...props }: React.ComponentPropsWithoutRef<typeof CardDescription>) {
  return <CardDescription className={className} {...props} />
}
