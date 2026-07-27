"use client"

import { useMemo, useCallback, useState } from "react"
import { useToast } from "@/hooks/use-toast-helper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column, type BatchAction } from "@/components/shared/data-table"
import { ShipmentDetailDrawer, type ShipmentDetailRow } from "@/components/shared/shipment-detail-drawer"

interface Shipment {
  id: string | number
  trackingId: string
  origin: string
  destination: string
  carrier: string
  status: "In Transit" | "Delivered" | "Out for Delivery" | "Processing" | "Delayed"
  eta: string
  items: number
  value: string
}

// Re-export for external consumers (e.g. detail drawer)
export type { Shipment as ShipmentDetailRow }

const mockShipments: Shipment[] = [
  {
    id: "1",
    trackingId: "SHP-2024-0847",
    origin: "WH-MUM-001",
    destination: "Delhi NCR",
    carrier: "BlueDart",
    status: "In Transit",
    eta: "Jul 27, 10:30 AM",
    items: 142,
    value: "₹3,45,000",
  },
  {
    id: "2",
    trackingId: "SHP-2024-0846",
    origin: "WH-DEL-002",
    destination: "Jaipur",
    carrier: "Delhivery",
    status: "Delivered",
    eta: "Jul 25, 02:15 PM",
    items: 89,
    value: "₹1,87,500",
  },
  {
    id: "3",
    trackingId: "SHP-2024-0845",
    origin: "WH-CHN-003",
    destination: "Bangalore",
    carrier: "DTDC",
    status: "Out for Delivery",
    eta: "Jul 26, 06:00 PM",
    items: 67,
    value: "₹2,23,000",
  },
  {
    id: "4",
    trackingId: "SHP-2024-0844",
    origin: "WH-BLR-006",
    destination: "Hyderabad",
    carrier: "Ecom Express",
    status: "Processing",
    eta: "Jul 28, 09:00 AM",
    items: 203,
    value: "₹5,12,000",
  },
  {
    id: "5",
    trackingId: "SHP-2024-0843",
    origin: "WH-HYD-005",
    destination: "Chennai",
    carrier: "BlueDart",
    status: "Delayed",
    eta: "Jul 26, 11:45 AM",
    items: 56,
    value: "₹1,34,000",
  },
  {
    id: "6",
    trackingId: "SHP-2024-0842",
    origin: "WH-KOL-004",
    destination: "Mumbai Hub",
    carrier: "XpressBees",
    status: "In Transit",
    eta: "Jul 27, 08:00 PM",
    items: 178,
    value: "₹4,67,000",
  },
  {
    id: "7",
    trackingId: "SHP-2024-0841",
    origin: "WH-MUM-001",
    destination: "Pune",
    carrier: "Shadowfax",
    status: "Delivered",
    eta: "Jul 25, 04:30 PM",
    items: 45,
    value: "₹98,000",
  },
  {
    id: "8",
    trackingId: "SHP-2024-0840",
    origin: "WH-DEL-002",
    destination: "Lucknow",
    carrier: "Delhivery",
    status: "In Transit",
    eta: "Jul 27, 12:00 PM",
    items: 134,
    value: "₹3,21,000",
  },
]

const statusStyles: Record<Shipment["status"], string> = {
  "In Transit":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "Delivered":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  "Out for Delivery":
    "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  "Processing":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  "Delayed":
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
}

export function ShipmentTrackingTable() {
  const toast = useToast()
  const [detailItem, setDetailItem] = useState<Shipment | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const openDetail = useCallback((item: Shipment) => {
    setDetailItem(item)
    setDetailOpen(true)
  }, [])

  const columns: Column<Shipment>[] = useMemo(
    () => [
      {
        key: "trackingId",
        header: "Tracking ID",
        sortable: true,
        className: "w-[140px]",
        render: (value: unknown) => {
          const v = String(value ?? "")
          return (
            <span className="font-mono text-xs text-number">{v}</span>
          )
        },
      },
      {
        key: "origin",
        header: "Origin",
        sortable: true,
        className: "w-[120px]",
        render: (value: unknown) => (
          <span className="text-xs font-medium text-number">{String(value ?? "")}</span>
        ),
      },
      {
        key: "destination",
        header: "Destination",
        sortable: true,
        className: "w-[120px]",
        render: (value: unknown) => (
          <span className="text-xs text-number">{String(value ?? "")}</span>
        ),
      },
      {
        key: "carrier",
        header: "Carrier",
        sortable: true,
        className: "w-[110px]",
        render: (value: unknown) => (
          <span className="text-xs text-muted-foreground">{String(value ?? "")}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        className: "w-[130px]",
        render: (value: unknown) => {
          const v = value as Shipment["status"]
          return (
            <Badge
              variant="outline"
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                statusStyles[v] || ""
              }`}
            >
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {v}
            </Badge>
          )
        },
      },
      {
        key: "eta",
        header: "ETA",
        sortable: true,
        className: "w-[140px]",
        render: (value: unknown) => (
          <span className="text-xs text-muted-foreground">{String(value ?? "")}</span>
        ),
      },
      {
        key: "items",
        header: "Items",
        sortable: true,
        className: "w-[70px]",
        headerClassName: "text-right",
        render: (value: unknown) => (
          <span className="text-xs font-medium text-right block text-number">
            {Number(value ?? 0)}
          </span>
        ),
      },
      {
        key: "value",
        header: "Value",
        sortable: true,
        className: "w-[100px]",
        headerClassName: "text-right",
        render: (value: unknown) => (
          <span className="text-xs font-medium text-right block text-number">
            {String(value ?? "")}
          </span>
        ),
      },
    ],
    []
  )

  const batchActions: BatchAction<Shipment>[] = useMemo(
    () => [
      {
        label: "Track Selected",
        icon: undefined,
        onClick: (rows) =>
          toast.info(
            "Tracking",
            `${rows.length} shipment(s) added to tracking watchlist`,
            { duration: 3000 }
          ),
      },
      {
        label: "Export Selected",
        icon: undefined,
        onClick: (rows) =>
          toast.success(
            "Export Started",
            `Exporting ${rows.length} shipment(s) to CSV`,
            { duration: 3000 }
          ),
      },
    ],
    [toast]
  )

  const handleRowClick = useCallback((row: Shipment) => {
    openDetail(row)
  }, [openDetail])

  const handleTrack = useCallback((item: Shipment) => {
    toast.info(
      "Live tracking enabled",
      `${item.trackingId} — refreshes every 30 seconds`
    )
  }, [toast])

  const handleExport = useCallback((item: Shipment) => {
    toast.success(
      "Shipment summary exported",
      `${item.trackingId}.pdf (${item.items} items, ${item.value})`
    )
  }, [toast])

  return (
    <Card className="card-depth depth-shadow-md table-container hover-lift transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">
              Recent Shipments
            </CardTitle>
            <Badge variant="secondary" className="text-[10px] px-1.5">
              {mockShipments.length}
            </Badge>
          </div>
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            Last 24h
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <DataTable<Shipment>
          data={mockShipments}
          columns={columns}
          pageSize={5}
          searchableColumns={["trackingId", "origin", "destination"]}
          searchPlaceholder="Search by tracking ID, origin, or destination..."
          selectable
          batchActions={batchActions}
          showColumnToggle
          onRowClick={handleRowClick}
          showCount
          className="text-xs"
        />
      </CardContent>

      {/* Shipment Detail Drawer */}
      <ShipmentDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        item={detailItem}
        onTrack={handleTrack}
        onExport={handleExport}
      />
    </Card>
  )
}
