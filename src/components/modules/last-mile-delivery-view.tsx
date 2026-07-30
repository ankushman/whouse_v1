import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const COLORS = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0', '#047857', '#065f46', '#0d9488']

const ZONES = ['Metro Core', 'Suburban Ring', 'Tier-2 City', 'Semi-Urban', 'Rural Belt', 'Industrial Cluster', 'SEZ Zone', 'Coastal Town']
const VEHICLE_TYPES = ['Electric Scooter', 'Delivery Van', 'Cargo Bike', 'Auto Rickshaw', 'E-Rickshaw', 'Motorbike', 'Pickup Truck', 'Walk Courier']
const PRIORITIES = ['Express', 'Same-Day', 'Next-Day', 'Standard']

const deliveries = [
  { id: 'LMD-0001', zone: 'Metro Core', vehicle: 'Electric Scooter', priority: 'Express', distance_km: 4.2, eta_min: 18, status: 'In Transit', cod_amount: 0, weight_kg: 2.1, attempts: 1, customer_rating: 4.8, assigned_to: 'Ravi K.' },
  { id: 'LMD-0002', zone: 'Suburban Ring', vehicle: 'Delivery Van', priority: 'Same-Day', distance_km: 12.8, eta_min: 42, status: 'Delivered', cod_amount: 2450, weight_kg: 8.5, attempts: 1, customer_rating: 4.2, assigned_to: 'Priya S.' },
  { id: 'LMD-0003', zone: 'Tier-2 City', vehicle: 'Cargo Bike', priority: 'Next-Day', distance_km: 18.5, eta_min: 65, status: 'At Hub', cod_amount: 0, weight_kg: 5.3, attempts: 0, customer_rating: 0, assigned_to: 'Arun M.' },
  { id: 'LMD-0004', zone: 'Rural Belt', vehicle: 'Auto Rickshaw', priority: 'Standard', distance_km: 32.1, eta_min: 95, status: 'Out for Delivery', cod_amount: 3200, weight_kg: 12.4, attempts: 2, customer_rating: 3.8, assigned_to: 'Deepak R.' },
  { id: 'LMD-0005', zone: 'Metro Core', vehicle: 'Walk Courier', priority: 'Express', distance_km: 1.8, eta_min: 12, status: 'Delivered', cod_amount: 0, weight_kg: 0.5, attempts: 1, customer_rating: 5.0, assigned_to: 'Sneha P.' },
  { id: 'LMD-0006', zone: 'Industrial Cluster', vehicle: 'Pickup Truck', priority: 'Standard', distance_km: 22.4, eta_min: 55, status: 'In Transit', cod_amount: 15800, weight_kg: 45.2, attempts: 1, customer_rating: 0, assigned_to: 'Vikram T.' },
  { id: 'LMD-0007', zone: 'SEZ Zone', vehicle: 'E-Rickshaw', priority: 'Same-Day', distance_km: 8.6, eta_min: 30, status: 'Delivered', cod_amount: 780, weight_kg: 3.2, attempts: 1, customer_rating: 4.6, assigned_to: 'Meena D.' },
  { id: 'LMD-0008', zone: 'Coastal Town', vehicle: 'Motorbike', priority: 'Next-Day', distance_km: 28.3, eta_min: 78, status: 'Delayed', cod_amount: 5400, weight_kg: 6.8, attempts: 3, customer_rating: 2.1, assigned_to: 'Kiran J.' },
  { id: 'LMD-0009', zone: 'Suburban Ring', vehicle: 'Delivery Van', priority: 'Same-Day', distance_km: 15.2, eta_min: 48, status: 'At Hub', cod_amount: 0, weight_kg: 9.1, attempts: 0, customer_rating: 0, assigned_to: 'Anita G.' },
  { id: 'LMD-0010', zone: 'Metro Core', vehicle: 'Electric Scooter', priority: 'Express', distance_km: 5.1, eta_min: 22, status: 'Delivered', cod_amount: 1200, weight_kg: 1.8, attempts: 1, customer_rating: 4.9, assigned_to: 'Rahul V.' },
  { id: 'LMD-0011', zone: 'Semi-Urban', vehicle: 'Auto Rickshaw', priority: 'Standard', distance_km: 19.7, eta_min: 62, status: 'Out for Delivery', cod_amount: 4100, weight_kg: 7.6, attempts: 1, customer_rating: 0, assigned_to: 'Suresh N.' },
  { id: 'LMD-0012', zone: 'Tier-2 City', vehicle: 'Cargo Bike', priority: 'Next-Day', distance_km: 24.3, eta_min: 72, status: 'Delivered', cod_amount: 0, weight_kg: 4.9, attempts: 1, customer_rating: 4.4, assigned_to: 'Pooja K.' },
  { id: 'LMD-0013', zone: 'Metro Core', vehicle: 'E-Rickshaw', priority: 'Same-Day', distance_km: 6.3, eta_min: 25, status: 'In Transit', cod_amount: 890, weight_kg: 3.8, attempts: 1, customer_rating: 0, assigned_to: 'Manoj B.' },
  { id: 'LMD-0014', zone: 'Rural Belt', vehicle: 'Motorbike', priority: 'Standard', distance_km: 35.8, eta_min: 105, status: 'Delivered', cod_amount: 2800, weight_kg: 2.5, attempts: 2, customer_rating: 3.5, assigned_to: 'Lakshmi R.' },
  { id: 'LMD-0015', zone: 'Suburban Ring', vehicle: 'Delivery Van', priority: 'Express', distance_km: 10.9, eta_min: 35, status: 'At Hub', cod_amount: 0, weight_kg: 15.3, attempts: 0, customer_rating: 0, assigned_to: 'Rajesh M.' },
  { id: 'LMD-0016', zone: 'Industrial Cluster', vehicle: 'Pickup Truck', priority: 'Standard', distance_km: 26.5, eta_min: 68, status: 'Delivered', cod_amount: 18500, weight_kg: 52.1, attempts: 1, customer_rating: 4.1, assigned_to: 'Sunil D.' },
  { id: 'LMD-0017', zone: 'SEZ Zone', vehicle: 'Delivery Van', priority: 'Same-Day', distance_km: 11.2, eta_min: 38, status: 'Out for Delivery', cod_amount: 0, weight_kg: 11.2, attempts: 1, customer_rating: 0, assigned_to: 'Geeta P.' },
  { id: 'LMD-0018', zone: 'Metro Core', vehicle: 'Walk Courier', priority: 'Express', distance_km: 2.1, eta_min: 15, status: 'Delivered', cod_amount: 0, weight_kg: 0.3, attempts: 1, customer_rating: 4.7, assigned_to: 'Aditya S.' },
  { id: 'LMD-0019', zone: 'Coastal Town', vehicle: 'Auto Rickshaw', priority: 'Next-Day', distance_km: 20.8, eta_min: 58, status: 'Delayed', cod_amount: 6200, weight_kg: 8.9, attempts: 2, customer_rating: 2.8, assigned_to: 'Nandini V.' },
  { id: 'LMD-0020', zone: 'Semi-Urban', vehicle: 'E-Rickshaw', priority: 'Standard', distance_km: 14.5, eta_min: 45, status: 'Delivered', cod_amount: 1750, weight_kg: 4.1, attempts: 1, customer_rating: 4.3, assigned_to: 'Harish T.' },
  { id: 'LMD-0021', zone: 'Metro Core', vehicle: 'Electric Scooter', priority: 'Express', distance_km: 3.8, eta_min: 16, status: 'In Transit', cod_amount: 0, weight_kg: 1.5, attempts: 1, customer_rating: 0, assigned_to: 'Kavita L.' },
  { id: 'LMD-0022', zone: 'Tier-2 City', vehicle: 'Delivery Van', priority: 'Same-Day', distance_km: 16.4, eta_min: 50, status: 'At Hub', cod_amount: 0, weight_kg: 10.2, attempts: 0, customer_rating: 0, assigned_to: 'Prakash J.' },
  { id: 'LMD-0023', zone: 'Rural Belt', vehicle: 'Motorbike', priority: 'Standard', distance_km: 38.2, eta_min: 110, status: 'Delivered', cod_amount: 3100, weight_kg: 3.4, attempts: 3, customer_rating: 3.2, assigned_to: 'Bhawana A.' },
  { id: 'LMD-0024', zone: 'Suburban Ring', vehicle: 'Cargo Bike', priority: 'Next-Day', distance_km: 13.1, eta_min: 40, status: 'Delivered', cod_amount: 0, weight_kg: 6.7, attempts: 1, customer_rating: 4.5, assigned_to: 'Dinesh R.' },
  { id: 'LMD-0025', zone: 'Industrial Cluster', vehicle: 'Pickup Truck', priority: 'Standard', distance_km: 29.6, eta_min: 75, status: 'Out for Delivery', cod_amount: 9800, weight_kg: 38.6, attempts: 1, customer_rating: 0, assigned_to: 'Swati N.' },
  { id: 'LMD-0026', zone: 'Metro Core', vehicle: 'Walk Courier', priority: 'Express', distance_km: 1.2, eta_min: 10, status: 'Delivered', cod_amount: 0, weight_kg: 0.2, attempts: 1, customer_rating: 5.0, assigned_to: 'Amit P.' },
  { id: 'LMD-0027', zone: 'SEZ Zone', vehicle: 'E-Rickshaw', priority: 'Same-Day', distance_km: 7.4, eta_min: 28, status: 'Delivered', cod_amount: 560, weight_kg: 2.8, attempts: 1, customer_rating: 4.8, assigned_to: 'Rekha M.' },
  { id: 'LMD-0028', zone: 'Coastal Town', vehicle: 'Auto Rickshaw', priority: 'Standard', distance_km: 23.6, eta_min: 70, status: 'In Transit', cod_amount: 4500, weight_kg: 9.3, attempts: 1, customer_rating: 0, assigned_to: 'Tarun G.' },
  { id: 'LMD-0029', zone: 'Suburban Ring', vehicle: 'Electric Scooter', priority: 'Express', distance_km: 9.5, eta_min: 32, status: 'Delivered', cod_amount: 0, weight_kg: 1.9, attempts: 1, customer_rating: 4.6, assigned_to: 'Isha W.' },
  { id: 'LMD-0030', zone: 'Semi-Urban', vehicle: 'Delivery Van', priority: 'Next-Day', distance_km: 17.8, eta_min: 52, status: 'At Hub', cod_amount: 2200, weight_kg: 12.5, attempts: 0, customer_rating: 0, assigned_to: 'Nikhil B.' },
]

const genRecords = (start: number) => {
  const statuses = ['Delivered', 'In Transit', 'At Hub', 'Out for Delivery', 'Delayed']
  const assignees = ['Ravi K.', 'Priya S.', 'Arun M.', 'Deepak R.', 'Sneha P.', 'Vikram T.', 'Meena D.', 'Kiran J.', 'Anita G.', 'Rahul V.', 'Suresh N.', 'Pooja K.', 'Manoj B.', 'Lakshmi R.', 'Rajesh M.', 'Sunil D.', 'Geeta P.', 'Aditya S.', 'Nandini V.', 'Harish T.', 'Kavita L.', 'Prakash J.', 'Bhawana A.', 'Dinesh R.', 'Swati N.', 'Amit P.', 'Rekha M.', 'Tarun G.', 'Isha W.', 'Nikhil B.']
  return Array.from({ length: 30 }, (_, i) => ({
    id: `LMD-${String(start + i).padStart(4, '0')}`,
    zone: ZONES[(start + i) % 8],
    vehicle: VEHICLE_TYPES[(start + i) % 8],
    priority: PRIORITIES[(start + i) % 4],
    distance_km: Math.round((3 + Math.random() * 38) * 10) / 10,
    eta_min: Math.round(10 + Math.random() * 100),
    status: statuses[(start + i) % 5],
    cod_amount: Math.round(Math.random()) * Math.round(500 + Math.random() * 20000),
    weight_kg: Math.round((0.2 + Math.random() * 50) * 10) / 10,
    attempts: Math.floor(Math.random() * 4),
    customer_rating: Math.round(Math.random() * 50) / 10,
    assigned_to: assignees[(start + i) % 30],
  }))
}

const allDeliveries = [...deliveries, ...genRecords(31), ...genRecords(61)]

function ri(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value))
}

const filterGroups = [
  {
    key: 'zone',
    label: 'Zone',
    options: ZONES.map(z => ({ label: z, value: z, count: allDeliveries.filter(d => d.zone === z).length })),
  },
  {
    key: 'vehicle',
    label: 'Vehicle',
    options: VEHICLE_TYPES.map(v => ({ label: v, value: v, count: allDeliveries.filter(d => d.vehicle === v).length })),
  },
  {
    key: 'priority',
    label: 'Priority',
    options: PRIORITIES.map(p => ({ label: p, value: p, count: allDeliveries.filter(d => d.priority === p).length })),
  },
]

function ZoneBadge({ zone }: { zone: string }) {
  const colors: Record<string, string> = { 'Metro Core': 'bg-emerald-100 text-emerald-800', 'Suburban Ring': 'bg-teal-100 text-teal-800', 'Tier-2 City': 'bg-cyan-100 text-cyan-800', 'Semi-Urban': 'bg-sky-100 text-sky-800', 'Rural Belt': 'bg-amber-100 text-amber-800', 'Industrial Cluster': 'bg-violet-100 text-violet-800', 'SEZ Zone': 'bg-indigo-100 text-indigo-800', 'Coastal Town': 'bg-blue-100 text-blue-800' }
  return <span className={`lmd-zone-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[zone] || 'bg-gray-100 text-gray-800'}`}>{zone}</span>
}

function VehicleBadge({ vehicle }: { vehicle: string }) {
  const colors: Record<string, string> = { 'Electric Scooter': 'bg-green-100 text-green-800', 'Delivery Van': 'bg-emerald-100 text-emerald-800', 'Cargo Bike': 'bg-lime-100 text-lime-800', 'Auto Rickshaw': 'bg-teal-100 text-teal-800', 'E-Rickshaw': 'bg-cyan-100 text-cyan-800', 'Motorbike': 'bg-sky-100 text-sky-800', 'Pickup Truck': 'bg-blue-100 text-blue-800', 'Walk Courier': 'bg-violet-100 text-violet-800' }
  return <span className={`lmd-vehicle-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[vehicle] || 'bg-gray-100 text-gray-800'}`}>{vehicle}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = { Express: 'bg-red-100 text-red-800', 'Same-Day': 'bg-orange-100 text-orange-800', 'Next-Day': 'bg-yellow-100 text-yellow-800', Standard: 'bg-gray-100 text-gray-700' }
  return <span className={`lmd-priority-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[priority] || 'bg-gray-100 text-gray-700'}`}>{priority}</span>
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { Delivered: 'bg-green-100 text-green-800', 'In Transit': 'bg-blue-100 text-blue-800', 'At Hub': 'bg-yellow-100 text-yellow-800', 'Out for Delivery': 'bg-indigo-100 text-indigo-800', Delayed: 'bg-red-100 text-red-800' }
  return <span className={`lmd-status-badge inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function DistanceBar({ distance }: { distance: number }) {
  const pct = ri(0, 100, (distance / 40) * 100)
  return <div className="lmd-dist-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className="lmd-dist-bar-fill h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{distance}km</span></div>
}

function EtaBar({ eta }: { eta: number }) {
  const pct = ri(0, 100, (eta / 120) * 100)
  const color = eta < 30 ? 'bg-emerald-500' : eta < 60 ? 'bg-yellow-500' : 'bg-red-500'
  return <div className="lmd-eta-bar flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-gray-200"><div className={`lmd-eta-bar-fill h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-500">{eta}min</span></div>
}

function HealthRing({ value, label, color }: { value: number; label: string; color: string }) {
  const r = 28, cx = 35, cy = 35, sw = 5
  const circ = 2 * Math.PI * r
  const offset = circ - (ri(0, 100, value) / 100) * circ
  return <div className="lmd-health-ring flex flex-col items-center"><svg width={70} height={70} className="-rotate-90"><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} /><circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={offset} className="lmd-ring-path" strokeLinecap="round" /></svg><span className="lmd-ring-value mt-1 text-sm font-bold" style={{ color }}>{value}%</span><span className="text-xs text-gray-500">{label}</span></div>
}

function KpiTile({ title, value, sub }: { title: string; value: string; sub: string }) {
  return <Card className="lmd-kpi-card"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="lmd-kpi-value mt-1 text-2xl font-bold">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></CardContent></Card>
}

function ValueTile({ title, value, trend }: { title: string; value: string; trend: string }) {
  const up = trend.startsWith('+')
  return <Card className="lmd-value-tile"><CardContent className="p-4"><p className="text-xs text-gray-500">{title}</p><p className="mt-1 text-xl font-bold">{value}</p><p className={`text-xs mt-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>{trend}</p></CardContent></Card>
}

export default function LastMileDeliveryView() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const curr = prev[key] || []
      const next = curr.includes(value) ? curr.filter(v => v !== value) : [...curr, value]
      return next.length > 0 ? { ...prev, [key]: next } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key))
    })
  }

  const filtered = allDeliveries.filter(d => {
    const q = searchQuery.toLowerCase()
    if (q && !d.id.toLowerCase().includes(q) && !d.zone.toLowerCase().includes(q) && !d.assigned_to.toLowerCase().includes(q)) return false
    return Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(d[key as keyof typeof d] as string))
  })

  const delivered = allDeliveries.filter(d => d.status === 'Delivered')
  const avgRating = delivered.length > 0 ? (delivered.reduce((s, d) => s + d.customer_rating, 0) / delivered.length).toFixed(1) : '0'
  const onTime = allDeliveries.filter(d => d.status === 'Delivered' && d.eta_min < d.distance_km * 4).length

  const monthlyData = [
    { month: 'Jan', delivered: 4520, returned: 180, express: 890 },
    { month: 'Feb', delivered: 4890, returned: 210, express: 960 },
    { month: 'Mar', delivered: 5230, returned: 195, express: 1120 },
    { month: 'Apr', delivered: 4980, returned: 240, express: 1050 },
    { month: 'May', delivered: 5510, returned: 170, express: 1280 },
    { month: 'Jun', delivered: 5840, returned: 220, express: 1340 },
    { month: 'Jul', delivered: 5670, returned: 205, express: 1190 },
  ]
  const zoneData = ZONES.map(z => ({ zone: z, count: allDeliveries.filter(d => d.zone === z).length }))
  const vehicleData = VEHICLE_TYPES.map(v => ({ vehicle: v, count: allDeliveries.filter(d => d.vehicle === v).length }))

  const tabs = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'deliveries', label: 'Deliveries' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'insights', label: 'Insights' },
  ]

  return (
    <div className="lmd-container space-y-4">
      <PageHeader title="Last-Mile Delivery Ops" description="Hyperlocal delivery fleet management across Indian cities" />
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Last-Mile Delivery' }]} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="lmd-tabs-list">
          {tabs.map(t => <TabsTrigger key={t.value} value={t.value} className="lmd-tab-trigger">{t.label}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="dashboard" className="lmd-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <KpiTile title="Total Deliveries" value={allDeliveries.length.toString()} sub="This month" />
            <KpiTile title="Delivered" value={delivered.length.toString()} sub={`${((delivered.length / allDeliveries.length) * 100).toFixed(1)}% rate`} />
            <KpiTile title="Avg Rating" value={avgRating} sub="Customer score" />
            <KpiTile title="On-Time" value={onTime.toString()} sub="SLA compliance" />
          </div>
          <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
            <HealthRing value={92} label="On-Time" color="#10b981" />
            <HealthRing value={87} label="First-Attempt" color="#059669" />
            <HealthRing value={78} label="Express SLA" color="#34d399" />
            <HealthRing value={95} label="COD Accuracy" color="#047857" />
            <HealthRing value={71} label="EV Fleet" color="#0d9488" />
            <HealthRing value={88} label="Coverage" color="#6ee7b7" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lmd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Delivery Volume</CardTitle></CardHeader><CardContent><LineChart data={monthlyData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend /><Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} /><Line type="monotone" dataKey="express" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" /></LineChart></CardContent></Card>
            <Card className="lmd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Deliveries by Zone</CardTitle></CardHeader><CardContent><BarChart data={zoneData} width={300} height={200}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#10b981" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="lmd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Vehicle Mix</CardTitle></CardHeader><CardContent><PieChart width={300} height={200}><Pie data={vehicleData} dataKey="count" nameKey="vehicle" cx="50%" cy="50%" outerRadius={70} label={({ vehicle, count }) => `${vehicle}: ${count}`}>{vehicleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="deliveries" className="lmd-tab-content space-y-4 mt-4">
          <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={allDeliveries.length} filteredCount={filtered.length} onRefresh={() => {}} placeholder="Search by ID, zone, or agent..." />
          <div className="overflow-x-auto rounded-lg border">
            <table className="lmd-table w-full text-sm">
              <thead><tr className="lmd-table-header bg-gray-50"><th className="px-3 py-2 text-left font-medium">ID</th><th className="px-3 py-2 text-left font-medium">Zone</th><th className="px-3 py-2 text-left font-medium">Vehicle</th><th className="px-3 py-2 text-left font-medium">Priority</th><th className="px-3 py-2 text-left font-medium">Distance</th><th className="px-3 py-2 text-left font-medium">ETA</th><th className="px-3 py-2 text-left font-medium">Status</th><th className="px-3 py-2 text-left font-medium">Agent</th><th className="px-3 py-2 text-left font-medium">COD</th></tr></thead>
              <tbody>{filtered.slice(0, 20).map(d => (
                <tr key={d.id} className="lmd-table-row border-t hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2"><ZoneBadge zone={d.zone} /></td>
                  <td className="px-3 py-2"><VehicleBadge vehicle={d.vehicle} /></td>
                  <td className="px-3 py-2"><PriorityBadge priority={d.priority} /></td>
                  <td className="px-3 py-2"><DistanceBar distance={d.distance_km} /></td>
                  <td className="px-3 py-2"><EtaBar eta={d.eta_min} /></td>
                  <td className="px-3 py-2"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-2 text-xs">{d.assigned_to}</td>
                  <td className="px-3 py-2 text-xs">{d.cod_amount > 0 ? `₹${d.cod_amount.toLocaleString('en-IN')}` : '-'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="lmd-tab-content space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ValueTile title="Avg Distance" value="15.3 km" trend="+2.1% vs last month" />
            <ValueTile title="Avg ETA" value="42 min" trend="-5.4% improving" />
            <ValueTile title="COD Volume" value="₹4.2L" trend="+12.3% growth" />
            <ValueTile title="Return Rate" value="3.8%" trend="-0.6% improved" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="lmd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Zone Throughput</CardTitle></CardHeader><CardContent><BarChart data={zoneData} width={400} height={250}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="zone" fontSize={10} angle={-30} textAnchor="end" height={50} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="#059669" radius={[4,4,0,0]} /></BarChart></CardContent></Card>
            <Card className="lmd-chart-card"><CardHeader className="pb-2"><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><PieChart width={400} height={250}><Pie data={PRIORITIES.map(p => ({ priority: p, count: allDeliveries.filter(d => d.priority === p).length }))} dataKey="count" nameKey="priority" cx="50%" cy="50%" outerRadius={80} label>{PRIORITIES.map((_, i) => <Cell key={i} fill={['#ef4444','#f97316','#eab308','#6b7280'][i]} />)}</Pie><Tooltip /></PieChart></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="lmd-tab-content space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="lmd-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Quick Commerce Expansion</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Quick commerce adoption in Tier-1 cities has driven a 34% increase in express deliveries. Partnering with Zepto and Blinkit for 10-minute delivery corridors across Mumbai, Delhi, and Bangalore.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800">High Impact</span><span className="text-gray-400">Q3 2026</span></div></CardContent></Card>
            <Card className="lmd-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">EV Fleet Transition</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>71% of last-mile fleet now electric. Government FAME-II subsidies covering 40% of conversion costs. Projected 100% EV by Q1 2027. Charging infra expanded to 45 hubs.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-teal-800">In Progress</span><span className="text-gray-400">Ongoing</span></div></CardContent></Card>
            <Card className="lmd-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Droid Delivery Robots</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Autonomous delivery droids deployed in 3 gated communities in Noida and Gurgaon. 200 daily autonomous deliveries with 98.5% success rate. Scaling to 12 communities by Diwali.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">Pilot Phase</span><span className="text-gray-400">Q4 2026</span></div></CardContent></Card>
            <Card className="lmd-insight-card hover:shadow-md transition-shadow"><CardHeader><CardTitle className="text-sm">Rural Delivery Network</CardTitle></CardHeader><CardContent className="text-xs text-gray-600 space-y-2"><p>Partnering with India Post for last-mile rural coverage. Reaching 2,800+ pin codes through hub-and-spoke model with local franchise agents. COD collection efficiency improved 28%.</p><div className="flex items-center gap-2"><span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">Strategic</span><span className="text-gray-400">FY2027</span></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
