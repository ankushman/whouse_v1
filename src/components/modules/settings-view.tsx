"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Settings,
  Building2,
  Users,
  Truck,
  Target,
  Bell,
  Shield,
  Globe,
  Save,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Star,
  AlertTriangle,
  Search,
  Palette,
  Monitor,
  Volume2,
  Clock,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useThemeStore, type AccentColor, type LayoutDensity } from "@/store/theme-store"
import { useAppStore } from "@/store/app-store"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast-helper"
import { warehouses as warehouseData, kpiMetrics } from "@/data/mock-data"

// ---- Mock Customer Data ----
const customersData = [
  { id: "1", name: "Maruti Suzuki India", code: "MSI-001", city: "Gurugram", state: "Haryana", contact: "Harsh Mehta", email: "harsh.mehta@maruti.co.in", type: "OEM", status: "Active" },
  { id: "2", name: "Tata Motors Ltd", code: "TML-002", city: "Pune", state: "Maharashtra", contact: "Rahul Kulkarni", email: "rahul.k@tatamotors.com", type: "OEM", status: "Active" },
  { id: "3", name: "Bosch Ltd", code: "BSH-003", city: "Bangalore", state: "Karnataka", contact: "Deepak Rao", email: "deepak.rao@bosch.in", type: "Tier1", status: "Active" },
  { id: "4", name: "Motherson Sumi Systems", code: "MSS-004", city: "Noida", state: "Uttar Pradesh", contact: "Vineet Agarwal", email: "vineet.a@motherson.com", type: "Tier1", status: "Active" },
  { id: "5", name: "Bharat Forge Ltd", code: "BFL-005", city: "Pune", state: "Maharashtra", contact: "Suresh Jadhav", email: "suresh.j@bharatforge.com", type: "Tier1", status: "Active" },
  { id: "6", name: "Uno Minda Ltd", code: "UML-006", city: "Manesar", state: "Haryana", contact: "Anil Bhatia", email: "anil.b@unominda.com", type: "Tier2", status: "Active" },
  { id: "7", name: "Varroc Polymers", code: "VPC-007", city: "Aurangabad", state: "Maharashtra", contact: "Prasad Joshi", email: "prasad.j@varroc.com", type: "Tier2", status: "Inactive" },
  { id: "8", name: "Jamna Auto Industries", code: "JAI-008", city: "Delhi", state: "Delhi", contact: "Manish Gupta", email: "manish.g@jamnaauto.com", type: "Tier2", status: "Active" },
]

// ---- Mock Transporter Data ----
const transportersData = [
  { id: "1", name: "TCI Express Ltd", fleet: 120, routes: 45, contact: "Pradeep Kumar", phone: "+91 98765 43210", rating: 5, status: "Active" },
  { id: "2", name: "Delhivery Logistics", fleet: 85, routes: 32, contact: "Arun Sharma", phone: "+91 87654 32109", rating: 4, status: "Active" },
  { id: "3", name: "Blue Dart Express", fleet: 65, routes: 28, contact: "Sunil Verma", phone: "+91 76543 21098", rating: 5, status: "Active" },
  { id: "4", name: "VRL Logistics", fleet: 95, routes: 38, contact: "Mahesh Patil", phone: "+91 65432 10987", rating: 3, status: "Active" },
  { id: "5", name: "SafeExpress", fleet: 55, routes: 20, contact: "Kiran Reddy", phone: "+91 54321 09876", rating: 4, status: "Inactive" },
  { id: "6", name: "Allcargo Logistics", fleet: 70, routes: 25, contact: "Dinesh Yadav", phone: "+91 43210 98765", rating: 3, status: "Active" },
]

// ---- KPI Config Data ----
interface KPIConfigItem {
  key: string
  label: string
  value: number
  unit: string
  target: number
  warningThreshold: number
  criticalThreshold: number
}

const initialKPIConfig: KPIConfigItem[] = [
  { key: "inventoryAccuracy", label: "Inventory Accuracy", value: 97.8, unit: "%", target: 99, warningThreshold: 96, criticalThreshold: 93 },
  { key: "slaAchievement", label: "SLA Achievement", value: 94.6, unit: "%", target: 97, warningThreshold: 93, criticalThreshold: 88 },
  { key: "dockToStockTime", label: "Dock to Stock Time", value: 3.2, unit: "hrs", target: 2.5, warningThreshold: 4, criticalThreshold: 6 },
  { key: "equipmentUtilization", label: "Equipment Utilization", value: 82.4, unit: "%", target: 85, warningThreshold: 70, criticalThreshold: 55 },
  { key: "warehouseOccupancy", label: "Warehouse Occupancy", value: 79.7, unit: "%", target: 80, warningThreshold: 90, criticalThreshold: 95 },
  { key: "productivity", label: "Productivity Index", value: 86.3, unit: "%", target: 90, warningThreshold: 75, criticalThreshold: 60 },
  { key: "costPerShipment", label: "Cost per Shipment", value: 3245, unit: "₹", target: 2800, warningThreshold: 4000, criticalThreshold: 5500 },
  { key: "pendingGRN", label: "Pending GRN", value: 63, unit: "", target: 30, warningThreshold: 80, criticalThreshold: 120 },
]

const usersData = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh.kumar@autoflow.in", role: "Executive", status: "Active", lastLogin: "2 min ago" },
  { id: "2", name: "Priya Sharma", email: "priya.sharma@autoflow.in", role: "Regional Manager", status: "Active", lastLogin: "15 min ago" },
  { id: "3", name: "Amit Patel", email: "amit.patel@autoflow.in", role: "Warehouse Manager", status: "Active", lastLogin: "1 hr ago" },
  { id: "4", name: "Deepa Nair", email: "deepa.nair@autoflow.in", role: "Supervisor", status: "Active", lastLogin: "30 min ago" },
  { id: "5", name: "Suresh Reddy", email: "suresh.reddy@autoflow.in", role: "Operator", status: "Inactive", lastLogin: "2 days ago" },
  { id: "6", name: "Kavitha Menon", email: "kavitha.menon@autoflow.in", role: "Warehouse Manager", status: "Active", lastLogin: "5 min ago" },
  { id: "7", name: "Ravi Verma", email: "ravi.verma@autoflow.in", role: "Supervisor", status: "Active", lastLogin: "45 min ago" },
  { id: "8", name: "Anjali Desai", email: "anjali.desai@autoflow.in", role: "Operator", status: "Active", lastLogin: "2 hrs ago" },
]

const rolesData = [
  { name: "Super Admin", permissions: "Full access", users: 1 },
  { name: "Executive", permissions: "All views, reports, settings", users: 3 },
  { name: "Regional Manager", permissions: "Regional views, reports", users: 4 },
  { name: "Warehouse Manager", permissions: "Warehouse operations, inventory", users: 6 },
  { name: "Supervisor", permissions: "Operations, alerts", users: 12 },
  { name: "Operator", permissions: "Basic operations only", users: 45 },
]

function SettingsSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <Label className="text-sm">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  )
}

export function SettingsView() {
  const toast = useToast()
  const [enabledNotifications, setEnabledNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    slaBreach: true,
    lowStock: true,
    equipmentAlert: true,
    dailyReport: false,
  })

  // Appearance state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    accentColor: "blue",
    density: "comfortable",
    animations: true,
    sidebarDefault: "expanded",
    showDecimals: true,
    compactNumbers: false,
    tabularNumbers: true,
  })

  // Theme store connections
  const { setTheme: setNextTheme } = useTheme()
  const storeSetAccentColor = useThemeStore((s) => s.setAccentColor)
  const storeSetDensity = useThemeStore((s) => s.setDensity)
  const storeSetAnimations = useThemeStore((s) => s.setAnimationsEnabled)

  // Notification Preferences state
  const notifPrefs = useAppStore((s) => s.notifPrefs)
  const setNotifPrefs = useAppStore((s) => s.setNotifPrefs)

  // Warehouse dialog
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<typeof warehouseData[0] | null>(null)
  const [warehouseSearch, setWarehouseSearch] = useState("")
  const [warehouseForm, setWarehouseForm] = useState({
    name: "", city: "", state: "", managerName: "", capacity: "",
  })

  // Customer dialog
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<typeof customersData[0] | null>(null)
  const [customerSearch, setCustomerSearch] = useState("")
  const [customerForm, setCustomerForm] = useState({
    name: "", code: "", city: "", state: "", contact: "", email: "", type: "OEM" as const,
  })

  // Transporter dialog
  const [transporterDialogOpen, setTransporterDialogOpen] = useState(false)
  const [editingTransporter, setEditingTransporter] = useState<typeof transportersData[0] | null>(null)
  const [transporterSearch, setTransporterSearch] = useState("")
  const [transporterForm, setTransporterForm] = useState({
    name: "", fleet: "", routes: "", contact: "", phone: "", rating: "4",
  })

  // KPI config
  const [kpiConfig, setKpiConfig] = useState<KPIConfigItem[]>(initialKPIConfig)
  const [kpiSearch, setKpiSearch] = useState("")


  // Handlers — Warehouses
  const openAddWarehouse = () => {
    setEditingWarehouse(null)
    setWarehouseForm({ name: "", city: "", state: "", managerName: "", capacity: "" })
    setWarehouseDialogOpen(true)
  }
  const openEditWarehouse = (wh: typeof warehouseData[0]) => {
    setEditingWarehouse(wh)
    setWarehouseForm({ name: wh.name, city: wh.city, state: wh.state, managerName: wh.managerName, capacity: String(wh.capacity) })
    setWarehouseDialogOpen(true)
  }
  const filteredWarehouses = warehouseData.filter(wh =>
    wh.name.toLowerCase().includes(warehouseSearch.toLowerCase()) ||
    wh.city.toLowerCase().includes(warehouseSearch.toLowerCase()) ||
    wh.state.toLowerCase().includes(warehouseSearch.toLowerCase())
  )

  // Handlers — Customers
  const openAddCustomer = () => {
    setEditingCustomer(null)
    setCustomerForm({ name: "", code: "", city: "", state: "", contact: "", email: "", type: "OEM" })
    setCustomerDialogOpen(true)
  }
  const openEditCustomer = (c: typeof customersData[0]) => {
    setEditingCustomer(c)
    setCustomerForm({ name: c.name, code: c.code, city: c.city, state: c.state, contact: c.contact, email: c.email, type: c.type as "OEM" })
    setCustomerDialogOpen(true)
  }
  const filteredCustomers = customersData.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(customerSearch.toLowerCase())
  )

  // Handlers — Transporters
  const openAddTransporter = () => {
    setEditingTransporter(null)
    setTransporterForm({ name: "", fleet: "", routes: "", contact: "", phone: "", rating: "4" })
    setTransporterDialogOpen(true)
  }
  const openEditTransporter = (t: typeof transportersData[0]) => {
    setEditingTransporter(t)
    setTransporterForm({ name: t.name, fleet: String(t.fleet), routes: String(t.routes), contact: t.contact, phone: t.phone, rating: String(t.rating) })
    setTransporterDialogOpen(true)
  }
  const filteredTransporters = transportersData.filter(t =>
    t.name.toLowerCase().includes(transporterSearch.toLowerCase()) ||
    t.contact.toLowerCase().includes(transporterSearch.toLowerCase())
  )

  // Handlers — KPI Config
  const updateKPI = (key: string, field: keyof KPIConfigItem, value: number) => {
    setKpiConfig(prev => prev.map(k => k.key === key ? { ...k, [field]: value } : k))
  }
  const filteredKPIConfig = kpiConfig.filter(k =>
    k.label.toLowerCase().includes(kpiSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure system preferences and manage users"
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast.success("Settings saved successfully", "All changes have been applied", { duration: 3000 })}>
            <Save className="h-3.5 w-3.5" /> Save All Changes
          </Button>
        }
      />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          {["general", "warehouses", "customers", "transporters", "users", "roles", "kpi", "notifications", "appearance", "notif-prefs"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="text-xs h-7 px-3 capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
            <CardHeader>
              <CardTitle className="text-sm font-semibold animated-underline">General Settings</CardTitle>
              <CardDescription className="text-xs">Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">Company Name</Label>
                  <Input defaultValue="AutoFlow Logistics" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Industry</Label>
                  <Input defaultValue="Automobile Logistics" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Timezone</Label>
                  <Select defaultValue="asia-kolkata">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-kolkata">Asia/Kolkata (IST +5:30)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">INR (₹)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button size="sm" className="gap-1.5" onClick={() => toast.success("Notification settings saved", "Preferences updated", { duration: 3000 })}>
                  <Save className="h-3.5 w-3.5" /> Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warehouses Tab — Real CRUD */}
        <TabsContent value="warehouses">
          <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold animated-underline">Warehouse Management</CardTitle>
                  <CardDescription className="text-xs">Manage warehouse configurations and details</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={openAddWarehouse}>
                  <Plus className="h-3.5 w-3.5" /> Add Warehouse
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search warehouses..."
                  value={warehouseSearch}
                  onChange={(e) => setWarehouseSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <div className="max-h-[420px] overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">City</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">State</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Manager</TableHead>
                      <TableHead className="text-xs">Capacity</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarehouses.map((wh) => (
                      <TableRow key={wh.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                              <Building2 className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                            </div>
                            <div>
                              <p className="text-xs font-medium">{wh.name}</p>
                              <p className="text-[10px] text-muted-foreground">{wh.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs hidden md:table-cell">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {wh.city}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs hidden lg:table-cell">{wh.state}</TableCell>
                        <TableCell className="text-xs hidden md:table-cell">{wh.managerName}</TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  wh.capacityUsed > 90 ? "bg-red-500" : wh.capacityUsed > 80 ? "bg-amber-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${wh.capacityUsed}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{wh.capacityUsed}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={wh.status === "green" ? "Healthy" : wh.status === "amber" ? "Warning" : "Critical"}
                            variant={wh.status}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditWarehouse(wh)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredWarehouses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                          No warehouses found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filteredWarehouses.length} of {warehouseData.length} warehouses</span>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Dialog */}
          <Dialog open={warehouseDialogOpen} onOpenChange={setWarehouseDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-sm">{editingWarehouse ? "Edit Warehouse" : "Add New Warehouse"}</DialogTitle>
                <DialogDescription className="text-xs">
                  {editingWarehouse ? "Update warehouse configuration details." : "Enter details for the new warehouse."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Warehouse Name</Label>
                    <Input value={warehouseForm.name} onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })} placeholder="e.g. Chennai Distribution Hub" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">City</Label>
                    <Input value={warehouseForm.city} onChange={(e) => setWarehouseForm({ ...warehouseForm, city: e.target.value })} placeholder="e.g. Chennai" className="h-9 text-sm" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">State</Label>
                    <Input value={warehouseForm.state} onChange={(e) => setWarehouseForm({ ...warehouseForm, state: e.target.value })} placeholder="e.g. Tamil Nadu" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Capacity (pallets)</Label>
                    <Input type="number" value={warehouseForm.capacity} onChange={(e) => setWarehouseForm({ ...warehouseForm, capacity: e.target.value })} placeholder="e.g. 3000" className="h-9 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Manager Name</Label>
                  <Input value={warehouseForm.managerName} onChange={(e) => setWarehouseForm({ ...warehouseForm, managerName: e.target.value })} placeholder="e.g. Rajesh Krishnamurthy" className="h-9 text-sm" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setWarehouseDialogOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={() => setWarehouseDialogOpen(false)}>
                  {editingWarehouse ? "Update Warehouse" : "Add Warehouse"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold animated-underline">Customer Management</CardTitle>
                  <CardDescription className="text-xs">Manage OEM and supplier customer profiles</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={openAddCustomer}>
                  <Plus className="h-3.5 w-3.5" /> Add Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <div className="max-h-[420px] overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Code</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">City</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">Contact</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={cn(
                                "text-[10px]",
                                c.type === "OEM" ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                  : c.type === "Tier1" ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                  : "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                              )}>
                                {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{c.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-mono">{c.code}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{c.city}, {c.state}</TableCell>
                        <TableCell className="text-xs hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {c.contact}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[10px] rounded-full",
                            c.type === "OEM" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
                            c.type === "Tier1" && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                            c.type === "Tier2" && "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
                          )}>
                            {c.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "text-[10px] rounded-full",
                            c.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          )}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditCustomer(c)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-xs text-muted-foreground">
                          No customers found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filteredCustomers.length} of {customersData.length} customers</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Dialog */}
          <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-sm">{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
                <DialogDescription className="text-xs">
                  {editingCustomer ? "Update customer details." : "Enter details for the new customer."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Customer Name</Label>
                    <Input value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} placeholder="e.g. Maruti Suzuki India" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Customer Code</Label>
                    <Input value={customerForm.code} onChange={(e) => setCustomerForm({ ...customerForm, code: e.target.value })} placeholder="e.g. MSI-001" className="h-9 text-sm" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">City</Label>
                    <Input value={customerForm.city} onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })} placeholder="e.g. Gurugram" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">State</Label>
                    <Input value={customerForm.state} onChange={(e) => setCustomerForm({ ...customerForm, state: e.target.value })} placeholder="e.g. Haryana" className="h-9 text-sm" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Contact Person</Label>
                    <Input value={customerForm.contact} onChange={(e) => setCustomerForm({ ...customerForm, contact: e.target.value })} placeholder="e.g. Harsh Mehta" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} placeholder="e.g. harsh.mehta@maruti.co.in" className="h-9 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Customer Type</Label>
                  <Select value={customerForm.type} onValueChange={(v) => setCustomerForm({ ...customerForm, type: v as "OEM" | "Tier1" | "Tier2" })}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OEM">OEM (Original Equipment Manufacturer)</SelectItem>
                      <SelectItem value="Tier1">Tier 1 Supplier</SelectItem>
                      <SelectItem value="Tier2">Tier 2 Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setCustomerDialogOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={() => setCustomerDialogOpen(false)}>
                  {editingCustomer ? "Update Customer" : "Add Customer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Transporters Tab */}
        <TabsContent value="transporters">
          <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold animated-underline">Transporter Management</CardTitle>
                  <CardDescription className="text-xs">Manage logistics partners and fleet providers</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={openAddTransporter}>
                  <Plus className="h-3.5 w-3.5" /> Add Transporter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transporters..."
                  value={transporterSearch}
                  onChange={(e) => setTransporterSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <div className="max-h-[420px] overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Fleet Size</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Routes</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">Contact</TableHead>
                      <TableHead className="text-xs">Rating</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransporters.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
                              <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium">{t.name}</p>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Phone className="h-2.5 w-2.5" />
                                {t.phone}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs hidden sm:table-cell">
                          <Badge variant="secondary" className="text-[10px]">{t.fleet} vehicles</Badge>
                        </TableCell>
                        <TableCell className="text-xs hidden md:table-cell">{t.routes} active routes</TableCell>
                        <TableCell className="text-xs hidden lg:table-cell">{t.contact}</TableCell>
                        <TableCell>
                          <RatingStars rating={t.rating} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditTransporter(t)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTransporters.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                          No transporters found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filteredTransporters.length} of {transportersData.length} transporters</span>
              </div>
            </CardContent>
          </Card>

          {/* Transporter Dialog */}
          <Dialog open={transporterDialogOpen} onOpenChange={setTransporterDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-sm">{editingTransporter ? "Edit Transporter" : "Add New Transporter"}</DialogTitle>
                <DialogDescription className="text-xs">
                  {editingTransporter ? "Update transporter details." : "Enter details for the new transporter."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Company Name</Label>
                  <Input value={transporterForm.name} onChange={(e) => setTransporterForm({ ...transporterForm, name: e.target.value })} placeholder="e.g. TCI Express Ltd" className="h-9 text-sm" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Fleet Size</Label>
                    <Input type="number" value={transporterForm.fleet} onChange={(e) => setTransporterForm({ ...transporterForm, fleet: e.target.value })} placeholder="e.g. 120" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Active Routes</Label>
                    <Input type="number" value={transporterForm.routes} onChange={(e) => setTransporterForm({ ...transporterForm, routes: e.target.value })} placeholder="e.g. 45" className="h-9 text-sm" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Contact Person</Label>
                    <Input value={transporterForm.contact} onChange={(e) => setTransporterForm({ ...transporterForm, contact: e.target.value })} placeholder="e.g. Pradeep Kumar" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Phone</Label>
                    <Input value={transporterForm.phone} onChange={(e) => setTransporterForm({ ...transporterForm, phone: e.target.value })} placeholder="+91 98765 43210" className="h-9 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Rating (1-5)</Label>
                  <Select value={transporterForm.rating} onValueChange={(v) => setTransporterForm({ ...transporterForm, rating: v })}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <SelectItem key={r} value={String(r)}>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={cn("h-3 w-3", i < r ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                            ))}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setTransporterDialogOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={() => setTransporterDialogOpen(false)}>
                  {editingTransporter ? "Update Transporter" : "Add Transporter"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold animated-underline">User Management</CardTitle>
                  <CardDescription className="text-xs">Manage users and their access levels</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">User</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Last Login</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px]">
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] rounded-full">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px] rounded-full", user.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300")}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles */}
        <TabsContent value="roles">
          <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold animated-underline">Roles & Permissions</CardTitle>
                  <CardDescription className="text-xs">Define roles and access permissions</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs">
                  <Shield className="h-3.5 w-3.5" /> Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Role Name</TableHead>
                    <TableHead className="text-xs">Permissions</TableHead>
                    <TableHead className="text-xs text-right">Users</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesData.map((role) => (
                    <TableRow key={role.name}>
                      <TableCell className="text-xs font-medium">{role.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{role.permissions}</TableCell>
                      <TableCell className="text-xs text-right">
                        <Badge variant="secondary" className="text-[10px]">{role.users}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KPI Config Tab — Real Configuration */}
        <TabsContent value="kpi">
          <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold animated-underline">KPI Target Configuration</CardTitle>
                  <CardDescription className="text-xs">Set target values and alert thresholds for each KPI</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs" onClick={() => toast.success("KPI targets saved", "Thresholds updated for all warehouses", { duration: 3000 })}>
                  <Save className="h-3.5 w-3.5" /> Save Targets
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search KPIs..."
                  value={kpiSearch}
                  onChange={(e) => setKpiSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
              <div className="max-h-[480px] overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">KPI Name</TableHead>
                      <TableHead className="text-xs">Current</TableHead>
                      <TableHead className="text-xs">Target</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Unit</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                          Warning
                        </div>
                      </TableHead>
                      <TableHead className="text-xs hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          Critical
                        </div>
                      </TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKPIConfig.map((kpi) => {
                      const isAtTarget = kpi.value >= kpi.target
                      const isWarning = !isAtTarget && kpi.value >= kpi.warningThreshold
                      const isCritical = !isAtTarget && !isWarning

                      return (
                        <TableRow key={kpi.key}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                                <Target className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                              </div>
                              <span className="text-xs font-medium">{kpi.label}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-mono font-medium">{kpi.value}{kpi.unit}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={kpi.target}
                              onChange={(e) => updateKPI(kpi.key, "target", Number(e.target.value))}
                              className="h-7 w-20 text-xs"
                            />
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{kpi.unit || "—"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Input
                              type="number"
                              value={kpi.warningThreshold}
                              onChange={(e) => updateKPI(kpi.key, "warningThreshold", Number(e.target.value))}
                              className="h-7 w-20 text-xs"
                            />
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Input
                              type="number"
                              value={kpi.criticalThreshold}
                              onChange={(e) => updateKPI(kpi.key, "criticalThreshold", Number(e.target.value))}
                              className="h-7 w-20 text-xs"
                            />
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <StatusBadge
                              status={isAtTarget ? "On Target" : isWarning ? "Warning" : "Critical"}
                              variant={isAtTarget ? "green" : isWarning ? "amber" : "red"}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filteredKPIConfig.length} KPIs configured</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>On Target</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Warning</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Critical</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="rounded-xl border-border/60 shadow-sm hover-zoom">
            <CardHeader>
              <CardTitle className="text-sm font-semibold animated-underline">Notification Settings</CardTitle>
              <CardDescription className="text-xs">Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Channels</h4>
                <SettingsSection>
                  <SettingRow label="Email Notifications" description="Receive alerts via email">
                    <Switch checked={enabledNotifications.email} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, email: v })} />
                  </SettingRow>
                  <SettingRow label="Push Notifications" description="Browser push notifications">
                    <Switch checked={enabledNotifications.push} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, push: v })} />
                  </SettingRow>
                  <SettingRow label="SMS Alerts" description="Critical alerts via SMS">
                    <Switch checked={enabledNotifications.sms} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, sms: v })} />
                  </SettingRow>
                </SettingsSection>
              </div>
              <Separator />
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alert Types</h4>
                <SettingsSection>
                  <SettingRow label="SLA Breach Alerts">
                    <Switch checked={enabledNotifications.slaBreach} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, slaBreach: v })} />
                  </SettingRow>
                  <SettingRow label="Low Stock Warnings">
                    <Switch checked={enabledNotifications.lowStock} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, lowStock: v })} />
                  </SettingRow>
                  <SettingRow label="Equipment Failure">
                    <Switch checked={enabledNotifications.equipmentAlert} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, equipmentAlert: v })} />
                  </SettingRow>
                  <SettingRow label="Daily Report Email">
                    <Switch checked={enabledNotifications.dailyReport} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, dailyReport: v })} />
                  </SettingRow>
                </SettingsSection>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <div className="grid gap-4 lg:grid-cols-2 stagger-children">
            <Card className="rounded-xl border-border/60 shadow-sm card-depth hover-zoom">
              <CardHeader>
                <CardTitle className="text-sm font-semibold animated-underline flex items-center gap-2">
                  <Palette className="size-4 text-purple-500" /> Theme
                </CardTitle>
                <CardDescription className="text-xs">Customize the visual appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <SettingRow label="Color Mode" description="Light, dark, or follow system">
                  <Select value={appearanceSettings.theme} onValueChange={(v) => { setAppearanceSettings({ ...appearanceSettings, theme: v }); setNextTheme(v); toast.success("Theme updated", `Switched to ${v} mode`) }}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">☀️ Light</SelectItem>
                      <SelectItem value="dark">🌙 Dark</SelectItem>
                      <SelectItem value="system">💻 System</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
                <Separator />
                <div>
                  <Label className="text-xs font-medium">Accent Color</Label>
                  <p className="text-[11px] text-muted-foreground mb-2">Choose the primary accent for highlights and interactive elements</p>
                  <div className="flex items-center gap-2">
                    {[
                      { name: "blue", color: "bg-blue-500", ring: "ring-blue-300 dark:ring-blue-700" },
                      { name: "emerald", color: "bg-emerald-500", ring: "ring-emerald-300 dark:ring-emerald-700" },
                      { name: "amber", color: "bg-amber-500", ring: "ring-amber-300 dark:ring-amber-700" },
                      { name: "violet", color: "bg-violet-500", ring: "ring-violet-300 dark:ring-violet-700" },
                      { name: "rose", color: "bg-rose-500", ring: "ring-rose-300 dark:ring-rose-700" },
                    ].map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { setAppearanceSettings({ ...appearanceSettings, accentColor: c.name }); storeSetAccentColor(c.name as AccentColor); toast.success("Accent color updated", `Applied ${c.name} accent`) }}
                        className={cn(
                          "relative h-8 w-8 rounded-full transition-all duration-200 hover:scale-110",
                          c.color,
                          appearanceSettings.accentColor === c.name && `ring-2 ring-offset-2 ring-offset-background ${c.ring}`
                        )}
                      >
                        {appearanceSettings.accentColor === c.name && (
                          <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border/60 shadow-sm card-depth hover-zoom">
              <CardHeader>
                <CardTitle className="text-sm font-semibold animated-underline flex items-center gap-2">
                  <Monitor className="size-4 text-blue-500" /> Layout & Display
                </CardTitle>
                <CardDescription className="text-xs">Control density and data presentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <SettingRow label="Layout Density" description="Adjust spacing and sizing">
                  <Select value={appearanceSettings.density} onValueChange={(v) => { setAppearanceSettings({ ...appearanceSettings, density: v }); storeSetDensity(v as LayoutDensity); toast.success("Density updated", `Layout set to ${v}`) }}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
                <SettingRow label="Default Sidebar" description="Initial sidebar state on load">
                  <Select value={appearanceSettings.sidebarDefault} onValueChange={(v) => setAppearanceSettings({ ...appearanceSettings, sidebarDefault: v })}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expanded">Expanded</SelectItem>
                      <SelectItem value="collapsed">Collapsed</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
                <Separator />
                <SettingsSection>
                  <SettingRow label="Animations" description="Enable page and element transitions">
                    <Switch checked={appearanceSettings.animations} onCheckedChange={(v) => { setAppearanceSettings({ ...appearanceSettings, animations: v }); storeSetAnimations(v); toast.success(v ? "Animations enabled" : "Animations disabled") }} />
                  </SettingRow>
                  <SettingRow label="Show Decimals" description="Display decimal places in numbers">
                    <Switch checked={appearanceSettings.showDecimals} onCheckedChange={(v) => setAppearanceSettings({ ...appearanceSettings, showDecimals: v })} />
                  </SettingRow>
                  <SettingRow label="Tabular Numbers" description="Fixed-width digits for alignment">
                    <Switch checked={appearanceSettings.tabularNumbers} onCheckedChange={(v) => setAppearanceSettings({ ...appearanceSettings, tabularNumbers: v })} />
                  </SettingRow>
                </SettingsSection>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notif-prefs">
          <div className="grid gap-4 lg:grid-cols-2 stagger-children">
            <Card className="rounded-xl border-border/60 shadow-sm card-depth hover-zoom">
              <CardHeader>
                <CardTitle className="text-sm font-semibold animated-underline flex items-center gap-2">
                  <Clock className="size-4 text-amber-500" /> Delivery Schedule
                </CardTitle>
                <CardDescription className="text-xs">Control how and when notifications are delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <SettingRow label="Delivery Frequency" description="How often alerts are sent">
                  <Select value={notifPrefs.frequency} onValueChange={(v) => setNotifPrefs({ frequency: v })}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant</SelectItem>
                      <SelectItem value="1hr">Digest (1hr)</SelectItem>
                      <SelectItem value="4hr">Digest (4hr)</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
                <SettingRow label="Minimum Severity" description="Only receive alerts at or above this level">
                  <Select value={notifPrefs.minSeverity} onValueChange={(v) => setNotifPrefs({ minSeverity: v })}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="warning">Warning &amp; Critical</SelectItem>
                      <SelectItem value="critical">Critical Only</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-medium">Quiet Hours</Label>
                    <Switch checked={notifPrefs.quietHoursEnabled} onCheckedChange={(v) => setNotifPrefs({ quietHoursEnabled: v }) } />
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">Silence non-critical notifications during these hours</p>
                  <div className="flex items-center gap-2">
                    <Select value={notifPrefs.quietHoursStart} onValueChange={(v) => setNotifPrefs({ quietHoursStart: v })}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20:00">20:00</SelectItem>
                        <SelectItem value="21:00">21:00</SelectItem>
                        <SelectItem value="22:00">22:00</SelectItem>
                        <SelectItem value="23:00">23:00</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">to</span>
                    <Select value={notifPrefs.quietHoursEnd} onValueChange={(v) => setNotifPrefs({ quietHoursEnd: v })}>
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">06:00</SelectItem>
                        <SelectItem value="07:00">07:00</SelectItem>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border/60 shadow-sm card-depth hover-zoom">
              <CardHeader>
                <CardTitle className="text-sm font-semibold animated-underline flex items-center gap-2">
                  <Volume2 className="size-4 text-blue-500" /> Sound & Channels
                </CardTitle>
                <CardDescription className="text-xs">Configure notification sounds and delivery channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <SettingRow label="Notification Sound" description="Play sound for incoming alerts">
                  <Switch checked={notifPrefs.soundEnabled} onCheckedChange={(v) => setNotifPrefs({ ...notifPrefs, soundEnabled: v })} />
                </SettingRow>
                <SettingRow label="Sound Volume">
                  <Select value={notifPrefs.soundVolume} onValueChange={(v) => setNotifPrefs({ ...notifPrefs, soundVolume: v })}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
                <Separator />
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Channel</h4>
                  <SettingsSection>
                    <div className="space-y-1">
                      <Label className="text-xs">Delivery Email</Label>
                      <Input
                        value={notifPrefs.emailAddress}
                        onChange={(e) => setNotifPrefs({ ...notifPrefs, emailAddress: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <SettingRow label="Daily Digest">
                      <Switch checked={notifPrefs.dailyDigest} onCheckedChange={(v) => setNotifPrefs({ ...notifPrefs, dailyDigest: v })} />
                    </SettingRow>
                    <SettingRow label="Weekly Summary">
                      <Switch checked={notifPrefs.weeklySummary} onCheckedChange={(v) => setNotifPrefs({ ...notifPrefs, weeklySummary: v })} />
                    </SettingRow>
                  </SettingsSection>
                </div>
                <Separator />
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Push Channel</h4>
                  <SettingsSection>
                    <SettingRow label="Browser Push" description="Chrome/Firefox notifications">
                      <Switch checked={notifPrefs.browserPush} onCheckedChange={(v) => setNotifPrefs({ ...notifPrefs, browserPush: v })} />
                    </SettingRow>
                    <SettingRow label="Desktop Badge" description="Show unread count on taskbar">
                      <Switch checked={notifPrefs.desktopBadge} onCheckedChange={(v) => setNotifPrefs({ ...notifPrefs, desktopBadge: v })} />
                    </SettingRow>
                  </SettingsSection>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
