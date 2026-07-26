"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Eraser, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SignaturePadProps {
  /** Controlled value — the signature as an SVG path data string */
  value?: string
  /** Called whenever the signature changes (every stroke segment) */
  onChange?: (path: string) => void
  /** Called when user clicks "Confirm Signature" */
  onConfirm?: (path: string) => void
  /** Width in pixels (canvas is responsive, this is the SVG viewBox width) */
  width?: number
  /** Height in pixels */
  height?: number
  className?: string
  /** Stroke color */
  strokeColor?: string
  /** Stroke width in px */
  strokeWidth?: number
  /** Disabled state */
  disabled?: boolean
  /** Label shown above the pad */
  label?: string
  /** Show the confirm/clear buttons */
  showActions?: boolean
}

interface Point {
  x: number
  y: number
}

/**
 * A reusable signature pad that captures SVG paths.
 *
 * - Captures pointer events (mouse + touch + pen) for cross-device support.
 * - Stores strokes as a single concatenated SVG path string (`M x y L x y L x y ...`).
 * - Exposes the path via onChange/onConfirm so the parent can persist/serialize it.
 * - Renders a baseline "signature line" + placeholder hint when empty.
 */
export function SignaturePad({
  value,
  onChange,
  onConfirm,
  width = 360,
  height = 140,
  className,
  strokeColor = "hsl(var(--foreground))",
  strokeWidth = 2,
  disabled = false,
  label,
  showActions = true,
}: SignaturePadProps) {
  // Internal strokes state — only used when component is uncontrolled
  const [internalPath, setInternalPath] = React.useState("")
  const path = value ?? internalPath

  const [isDrawing, setIsDrawing] = React.useState(false)
  const lastPointRef = React.useRef<Point | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)

  const setPath = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternalPath(next)
      onChange?.(next)
    },
    [value, onChange]
  )

  const getRelativePoint = (e: React.PointerEvent<SVGSVGElement>): Point | null => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return null
    // Map client coords to SVG viewBox coords
    const x = ((e.clientX - rect.left) / rect.width) * width
    const y = ((e.clientY - rect.top) / rect.height) * height
    return { x, y }
  }

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (disabled) return
    e.preventDefault()
    svgRef.current?.setPointerCapture(e.pointerId)
    const pt = getRelativePoint(e)
    if (!pt) return
    lastPointRef.current = pt
    setIsDrawing(true)
    // Start a new sub-path with M (moveto) — preserve existing strokes
    setPath(path + ` M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
  }

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawing || disabled) return
    e.preventDefault()
    const pt = getRelativePoint(e)
    if (!pt || !lastPointRef.current) return
    // Add L (lineto) — quadratic curve would be smoother but L is fine for signature
    setPath(path + ` L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    lastPointRef.current = pt
  }

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (disabled) return
    e.preventDefault()
    svgRef.current?.releasePointerCapture(e.pointerId)
    setIsDrawing(false)
    lastPointRef.current = null
  }

  const handleClear = () => {
    if (disabled) return
    setPath("")
  }

  const handleConfirm = () => {
    if (!path.trim()) return
    onConfirm?.(path)
  }

  const isEmpty = !path.trim()

  return (
    <div className={cn("signature-pad-wrapper", className)}>
      {label && (
        <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>
      )}
      <div
        className={cn(
          "signature-pad-container relative rounded-lg border-2 border-dashed border-border bg-background transition-all",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && isDrawing && "border-primary/60 signature-pad-active",
          !disabled && !isDrawing && "hover:border-primary/40"
        )}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="signature-pad-svg block w-full h-auto touch-none select-none"
          style={{ aspectRatio: `${width} / ${height}` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="img"
          aria-label={isEmpty ? "Empty signature pad — please sign here" : "Signature captured"}
        >
          {/* Baseline */}
          <line
            x1={20}
            y1={height - 18}
            x2={width - 20}
            y2={height - 18}
            stroke="hsl(var(--border))"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          {/* The signature path itself */}
          {path && (
            <path
              d={path}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="signature-stroke-anim"
            />
          )}
          {/* Placeholder text when empty */}
          {isEmpty && (
            <text
              x={width / 2}
              y={height - 26}
              textAnchor="middle"
              fontSize={11}
              fill="hsl(var(--muted-foreground))"
              opacity={0.6}
              className="signature-placeholder-text"
            >
              ✍️ Sign above the line
            </text>
          )}
        </svg>
      </div>
      {showActions && (
        <div className="mt-2 flex items-center justify-end gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs btn-press"
            onClick={handleClear}
            disabled={disabled || isEmpty}
          >
            <Eraser className="h-3 w-3 mr-1" />
            Clear
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-xs btn-press focus-ring-primary"
            onClick={handleConfirm}
            disabled={disabled || isEmpty}
          >
            <Check className="h-3 w-3 mr-1" />
            Confirm
          </Button>
        </div>
      )}
    </div>
  )
}
