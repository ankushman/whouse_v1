"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  ScanBarcode,
  X,
  CheckCircle2,
  History,
  Keyboard,
  QrCode,
  Package,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

interface BarcodeScannerProps {
  onScan: (barcode: string, type: "barcode" | "qr") => void
  onClose: () => void
  isOpen: boolean
}

interface ScanHistoryItem {
  barcode: string
  type: "barcode" | "qr"
  timestamp: Date
}

const PRESET_BARCODES: { code: string; type: "barcode" | "qr"; label: string }[] = [
  { code: "SKU-001", type: "barcode", label: "SKU-001" },
  { code: "SKU-047", type: "barcode", label: "SKU-047" },
  { code: "LOT-2024-001", type: "barcode", label: "LOT-2024-001" },
  { code: "LOT-2024-089", type: "barcode", label: "LOT-2024-089" },
  { code: "PAL-4821", type: "qr", label: "PAL-4821" },
  { code: "LOC-A12-R03", type: "qr", label: "LOC-A12-R03" },
]

function getBarcodeType(code: string): "barcode" | "qr" {
  const upper = code.toUpperCase()
  if (upper.startsWith("PAL") || upper.startsWith("LOC") || upper.startsWith("QR")) {
    return "qr"
  }
  return "barcode"
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

export function BarcodeScanner({ onScan, onClose, isOpen }: BarcodeScannerProps) {
  const [manualInput, setManualInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([])
  const [manualOpen, setManualOpen] = useState(false)
  const [viewportFlash, setViewportFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScan = useCallback(
    (barcode: string, type: "barcode" | "qr") => {
      if (!barcode.trim() || isScanning) return

      const trimmed = barcode.trim()
      const scanType = type || getBarcodeType(trimmed)

      // Start scanning animation
      setIsScanning(true)

      // Simulate 800ms scan delay
      scanTimeoutRef.current = setTimeout(() => {
        setIsScanning(false)

        // Show success feedback
        setShowSuccess(true)
        setViewportFlash(true)

        // Clear success after animation
        successTimeoutRef.current = setTimeout(() => {
          setShowSuccess(false)
        }, 600)

        flashTimeoutRef.current = setTimeout(() => {
          setViewportFlash(false)
        }, 800)

        // Add to history (keep last 5)
        setScanHistory((prev) => {
          const newHistory = [
            { barcode: trimmed, type: scanType, timestamp: new Date() },
            ...prev,
          ]
          return newHistory.slice(0, 5)
        })

        // Clear manual input
        setManualInput("")

        // Call the parent callback
        onScan(trimmed, scanType)
      }, 800)
    },
    [isScanning, onScan]
  )

  const handleManualSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (manualInput.trim()) {
        handleScan(manualInput, getBarcodeType(manualInput))
      }
    },
    [manualInput, handleScan]
  )

  const handleQuickScan = useCallback(
    (code: string, type: "barcode" | "qr") => {
      handleScan(code, type)
    },
    [handleScan]
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-xl"
        showCloseButton={false}
      >
        {/* ── Header ─────────────────────────────────── */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <ScanBarcode className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold leading-tight">
                Scan Barcode / QR Code
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Point at a barcode or use manual entry below
              </DialogDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close scanner</span>
          </Button>
        </DialogHeader>

        <div className="flex flex-col gap-3 p-4 pt-2">
          {/* ── Scanner Viewport ────────────────────────── */}
          <div
            className={cn(
              "scanner-viewfinder scanner-corners relative flex flex-col items-center justify-center rounded-lg overflow-hidden transition-all duration-300",
              "bg-foreground/95 min-h-[200px]",
              viewportFlash && "ring-2 ring-green-500/70 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            )}
          >
            {/* Corner brackets */}
            <span className="scanner-corner-tr" />
            <span className="scanner-corner-bl" />

            {/* Scan line animation overlay (from CSS ::after on scanner-viewfinder) */}

            {/* Center crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Horizontal line */}
              <div className="absolute h-px w-16 bg-green-500/40" />
              {/* Vertical line */}
              <div className="absolute w-px h-16 bg-green-500/40" />
              {/* Center dot */}
              <div className="absolute h-1.5 w-1.5 rounded-full bg-green-500/60" />
            </div>

            {/* Success overlay */}
            {showSuccess && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 rounded-lg">
                <div className="scan-success flex flex-col items-center gap-1">
                  <div className="h-14 w-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-green-400 text-xs font-medium mt-1">
                    Scanned!
                  </span>
                </div>
              </div>
            )}

            {/* Scanning animation overlay */}
            {isScanning && !showSuccess && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="h-10 w-10 rounded-full border-2 border-green-500/60 border-t-green-500 animate-spin" />
              </div>
            )}

            {/* Mock barcode content */}
            {!showSuccess && !isScanning && (
              <div className="flex flex-col items-center gap-3 text-white/60 pointer-events-none select-none">
                <ScanBarcode className="h-10 w-10 opacity-40" />
                <span className="text-xs font-medium tracking-wide opacity-50">
                  Waiting for scan...
                </span>
              </div>
            )}

            {/* Bottom label */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center z-10">
              <Badge
                variant="outline"
                className="text-[10px] font-mono bg-black/50 text-white/70 border-white/10"
              >
                Simulated Camera Feed
              </Badge>
            </div>
          </div>

          {/* ── Quick Preset Barcodes ───────────────────── */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-0.5">
              <Package className="h-3 w-3" />
              <span>Quick Scan Presets</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_BARCODES.map((item) => (
                <Button
                  key={item.code}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-auto py-2 px-2 text-xs font-mono flex flex-col items-center gap-1 nav-tap-feedback transition-all",
                    "hover:border-primary/50 hover:bg-primary/5",
                    isScanning && "pointer-events-none opacity-50"
                  )}
                  onClick={() => handleQuickScan(item.code, item.type)}
                  disabled={isScanning}
                >
                  {item.type === "qr" ? (
                    <QrCode className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ScanBarcode className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className="truncate w-full text-center">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* ── Manual Input (Collapsible) ──────────────── */}
          <Collapsible open={manualOpen} onOpenChange={setManualOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between px-2 h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <Keyboard className="h-3.5 w-3.5" />
                  Manual Barcode Entry
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    manualOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter barcode (e.g. SKU-001)"
                  className="flex-1 h-9 text-sm font-mono"
                  disabled={isScanning}
                  autoFocus={manualOpen}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!manualInput.trim() || isScanning}
                  className="h-9 px-4"
                >
                  <ScanBarcode className="h-3.5 w-3.5 mr-1.5" />
                  Scan
                </Button>
              </form>
            </CollapsibleContent>
          </Collapsible>

          {/* ── Scan History ────────────────────────────── */}
          {scanHistory.length > 0 && (
            <Card className="card-depth p-0 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <History className="h-3 w-3" />
                  <span>Recent Scans</span>
                </div>
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  {scanHistory.length}
                </Badge>
              </div>
              <ScrollArea className="max-h-36">
                <div className="divide-y">
                  {scanHistory.map((item, index) => (
                    <div
                      key={`${item.barcode}-${item.timestamp.getTime()}`}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-muted/50",
                        index === 0 && "data-flash"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {item.type === "qr" ? (
                          <QrCode className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        ) : (
                          <ScanBarcode className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="font-mono font-medium truncate">
                          {item.barcode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <Badge
                          variant={item.type === "qr" ? "default" : "outline"}
                          className={cn(
                            "text-[10px] px-1.5 py-0",
                            item.type === "qr" && "bg-violet-600 text-white hover:bg-violet-700"
                          )}
                        >
                          {item.type === "qr" ? "QR" : "BC"}
                        </Badge>
                        <span className="text-muted-foreground font-mono text-[10px]">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
