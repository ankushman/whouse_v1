"use client"

import { useState, useCallback, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ScanBarcode,
  Camera,
  Keyboard,
  Check,
  Package,
  MapPin,
  Tag,
  Layers,
  X,
  ArrowRight,
  RotateCcw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BarcodeScannerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inventoryItems: Array<{
    id: string
    sku: string
    partName: string
    category: string
    warehouse: string
    quantity: number
    minStock: number
    maxStock: number
    location: string
    abcClass: string
    variance: number
  }>
}

interface ScanResult {
  item: typeof inventoryItems[number]
  scannedAt: Date
}

// Generate a simple visual barcode from SKU string
function BarcodeVisual({ sku }: { sku: string }) {
  const bars = sku.split("").map((char, i) => {
    const code = char.charCodeAt(0)
    const width = code % 3 === 0 ? 3 : code % 2 === 0 ? 2 : 1
    const filled = code % 2 === 0
    return (
      <span
        key={i}
        className="inline-block"
        style={{
          width: `${width}px`,
          height: "40px",
          backgroundColor: filled ? "currentColor" : "transparent",
        }}
      />
    )
  })
  return (
    <div className="flex items-center justify-center gap-px py-2 text-foreground">
      {bars}
    </div>
  )
}

// Generate a simple QR code visual
function QRCodeVisual({ sku }: { sku: string }) {
  const size = 9
  const cells: boolean[][] = []
  // Deterministic pseudo-random pattern based on SKU
  for (let row = 0; row < size; row++) {
    cells[row] = []
    for (let col = 0; col < size; col++) {
      // Corner positions are always filled (like real QR)
      const isCorner =
        (row < 3 && col < 3) ||
        (row < 3 && col >= size - 3) ||
        (row >= size - 3 && col < 3)
      const hash = (sku.charCodeAt(row % sku.length) + sku.charCodeAt(col % sku.length) + row * 3 + col * 7) % 3
      cells[row][col] = isCorner || hash === 0
    }
  }
  return (
    <div className="inline-grid gap-px" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: "72px", height: "72px" }}>
      {cells.flat().map((filled, i) => (
        <div
          key={i}
          className={cn("aspect-square", filled ? "bg-foreground" : "bg-muted")}
        />
      ))}
    </div>
  )
}

export function BarcodeScannerModal({
  open,
  onOpenChange,
  inventoryItems,
}: BarcodeScannerModalProps) {
  const [mode, setMode] = useState<"camera" | "manual">("camera")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [manualInput, setManualInput] = useState("")
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([])
  const [scanProgress, setScanProgress] = useState(0)
  const scanTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Reset state when modal closes
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen) {
      setIsScanning(false)
      setScanResult(null)
      setScanProgress(0)
      setManualInput("")
      if (scanTimerRef.current) clearInterval(scanTimerRef.current)
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }
    onOpenChange(newOpen)
  }, [onOpenChange])

  const simulateScan = useCallback(() => {
    if (inventoryItems.length === 0) return
    setIsScanning(true)
    setScanResult(null)
    setScanProgress(0)

    // Progress animation
    progressTimerRef.current = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) return 95
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    // Random item after 2-3 seconds
    scanTimerRef.current = setTimeout(() => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
      setScanProgress(100)

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * inventoryItems.length)
        const item = inventoryItems[randomIndex]
        const result: ScanResult = { item, scannedAt: new Date() }
        setScanResult(result)
        setIsScanning(false)
        setScanHistory((prev) => [result, ...prev.slice(0, 4)])
      }, 300)
    }, 2500)
  }, [inventoryItems])

  const handleManualSearch = useCallback(() => {
    const input = manualInput.trim().toLowerCase()
    if (!input) return

    // Find matching item by SKU or part name
    const found = inventoryItems.find(
      (item) =>
        item.sku.toLowerCase().includes(input) ||
        item.partName.toLowerCase().includes(input)
    )

    if (found) {
      const result: ScanResult = { item: found, scannedAt: new Date() }
      setScanResult(result)
      setScanHistory((prev) => [result, ...prev.slice(0, 4)])
    } else {
      // If no match, simulate a random scan
      const randomIndex = Math.floor(Math.random() * inventoryItems.length)
      const result: ScanResult = { item: inventoryItems[randomIndex], scannedAt: new Date() }
      setScanResult(result)
      setScanHistory((prev) => [result, ...prev.slice(0, 4)])
    }
  }, [manualInput, inventoryItems])

  const handleRescan = useCallback(() => {
    setScanResult(null)
    setScanProgress(0)
    simulateScan()
  }, [simulateScan])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <ScanBarcode className="h-5 w-5 text-emerald-600" />
            Barcode / QR Scanner
          </DialogTitle>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="flex gap-2 p-3 border-b bg-muted/30">
          <Button
            variant={mode === "camera" ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-1.5 h-8 text-xs"
            onClick={() => setMode("camera")}
          >
            <Camera className="h-3.5 w-3.5" />
            Camera Scan
          </Button>
          <Button
            variant={mode === "manual" ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-1.5 h-8 text-xs"
            onClick={() => setMode("manual")}
          >
            <Keyboard className="h-3.5 w-3.5" />
            Manual Entry
          </Button>
        </div>

        <div className="flex flex-col md:flex-row min-h-[380px]">
          {/* Left: Scanner / Input */}
          <div className="flex-1 p-4">
            {mode === "camera" ? (
              <div className="flex flex-col items-center gap-4">
                {/* Simulated Camera View */}
                <div className="relative w-full max-w-[260px] aspect-[4/3] rounded-xl bg-zinc-900 dark:bg-zinc-950 overflow-hidden border border-zinc-700">
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950/80" />

                  {/* Corner brackets */}
                  <div className="scan-corner scan-corner-tl" />
                  <div className="scan-corner scan-corner-tr" />
                  <div className="scan-corner scan-corner-bl" />
                  <div className="scan-corner scan-corner-br" />

                  {/* Scanning line */}
                  {(isScanning || scanProgress < 100) && (
                    <div
                      className="scan-line absolute left-4 right-4 h-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                      style={{ top: `${10 + scanProgress * 0.75}%` }}
                    />
                  )}

                  {/* Scanning indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      isScanning ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                    )} />
                    <span className="text-[10px] text-zinc-400">
                      {isScanning ? "Scanning..." : "Ready to scan"}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {isScanning && (
                    <div className="absolute top-3 left-3 right-3">
                      <div className="h-1 w-full rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-emerald-400 transition-all duration-200"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan button */}
                <Button
                  onClick={simulateScan}
                  disabled={isScanning || inventoryItems.length === 0}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isScanning ? (
                    <>
                      <div className="flex gap-1">
                        <div className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                        <div className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                        <div className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <ScanBarcode className="h-4 w-4" />
                      Start Scan
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-muted-foreground">
                  Enter SKU code or part name to search inventory
                </p>
                <div className="flex gap-2">
                  <Input
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                    placeholder="e.g. ENG-0024 or Brake Pad"
                    className="h-9 text-sm font-mono"
                  />
                  <Button
                    onClick={handleManualSearch}
                    disabled={!manualInput.trim()}
                    size="sm"
                    className="shrink-0"
                  >
                    Search
                  </Button>
                </div>
                {manualInput.trim() && (
                  <p className="text-[10px] text-muted-foreground">
                    {inventoryItems.filter(
                      (item) =>
                        item.sku.toLowerCase().includes(manualInput.trim().toLowerCase()) ||
                        item.partName.toLowerCase().includes(manualInput.trim().toLowerCase())
                    ).length} match(es) found
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <Separator orientation="vertical" className="hidden md:block h-auto" />
          <Separator className="md:hidden" />

          {/* Right: Result */}
          <div className="w-full md:w-[220px] p-4">
            {scanResult ? (
              <div className="scan-result-enter flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Scanned
                  </p>
                  <button
                    onClick={() => setScanResult(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardContent className="p-3 space-y-2.5">
                    {/* SKU & Part Name */}
                    <div>
                      <p className="text-xs font-semibold truncate">{scanResult.item.partName}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{scanResult.item.sku}</p>
                    </div>

                    {/* Barcode Visual */}
                    <BarcodeVisual sku={scanResult.item.sku} />

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{scanResult.item.warehouse}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        <span>{scanResult.item.category}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Layers className="h-3 w-3" />
                        <span>{scanResult.item.location}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] h-4 justify-self-end">
                        {scanResult.item.abcClass}
                      </Badge>
                    </div>

                    <Separator />

                    {/* Quantity */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className={cn(
                        "font-bold",
                        scanResult.item.quantity < scanResult.item.minStock
                          ? "text-red-600 dark:text-red-400"
                          : "text-foreground"
                      )}>
                        {scanResult.item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Min / Max Stock</span>
                      <span className="font-medium">
                        {scanResult.item.minStock} / {scanResult.item.maxStock}
                      </span>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center pt-1">
                      <QRCodeVisual sku={scanResult.item.sku} />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1.5 pt-1">
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1">
                        View Details
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1">
                        <Package className="h-3 w-3" />
                        Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Rescan */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-7 text-[10px] gap-1 text-muted-foreground"
                  onClick={handleRescan}
                >
                  <RotateCcw className="h-3 w-3" />
                  Scan Again
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <ScanBarcode className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Scan a barcode or enter SKU manually
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scan History */}
        {scanHistory.length > 0 && (
          <div className="border-t p-3">
            <p className="text-[10px] font-medium text-muted-foreground mb-2">Recent Scans</p>
            <ScrollArea className="max-h-[100px]">
              <div className="flex gap-2">
                {scanHistory.map((scan, i) => (
                  <button
                    key={`${scan.item.id}-${i}`}
                    onClick={() => setScanResult(scan)}
                    className="shrink-0 rounded-lg border p-2 text-left transition-colors hover:bg-muted/50 w-[140px]"
                  >
                    <p className="text-[10px] font-medium truncate">{scan.item.partName}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{scan.item.sku}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      {scan.scannedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
