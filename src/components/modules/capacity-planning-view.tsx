"use client"

import React, { useState, useMemo } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { exportToCSV } from "@/components/shared/export-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, RadialBarChart,
  RadialBar, LineChart,
} from "recharts"
import {
  TrendingUp, Search, Download, RefreshCw, CheckCircle2,
  XCircle, AlertTriangle, Eye, Clock, Activity, Gauge,
  Zap, BarChart3, PieChartIcon, LayoutGrid,
  Lightbulb, Filter, Info,
  Factory, Target, Calendar, Bell, Users, Cog, Package, Truck,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast-helper"

// ============================================================================
// TYPES
// ============================================================================

type WCType = 'Assembly' | 'Packing' | 'Quality Check' | 'Labeling' | 'Palletizing' | 'Cold Storage' | 'Receiving' | 'Shipping'
type WCStatus = 'operational' | 'under_maintenance' | 'idle' | 'overloaded' | 'offline'
type ShiftName = 'Morning' | 'Afternoon' | 'Night'
type ScenarioType = 'current' | 'base' | 'optimistic' | 'pessimistic'
type SeverityType = 'critical' | 'warning' | 'info' | 'success'

interface WorkCenter {
  id: string
  name: string
  type: WCType
  warehouse: string
  warehouseCode: string
  capacityPerHour: number
  shifts: ShiftData[]
  status: WCStatus
  oee: number
  availability: number
  performance: number
  quality: number
  efficiency: number
  supervisor: string
  equipmentCount: number
  lastMaintenance: string
  efficiencyTarget: number
  oeeTarget: number
  sinceDate: string
  notes: string
}

interface ShiftData {
  name: ShiftName
  hours: number
  capacityPerHour: number
  totalCapacity: number
  plannedUnits: number
  actualUnits: number
  utilization: number
  efficiency: number
  headcount: number
}

interface CapacityWeek {
  week: string
  forecastDemand: number
  requiredCapacity: number
  availableCapacity: number
  gap: number
  gapPercent: number
  action: string
  status: 'overloaded' | 'balanced' | 'underutilized'
}

interface OEEHistory {
  week: string
  availability: number
  performance: number
  quality: number
  oee: number
}

interface EfficiencyLoss {
  category: string
  hours: number
  percentage: number
  color: string
}

interface CapacityAlert {
  id: string
  severity: SeverityType
  title: string
  description: string
  source: string
  timestamp: string
}

// ============================================================================
// SEEDED MOCK DATA GENERATORS
// ============================================================================

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

const WAREHOUSES = [
  { id: 'WH-MUM', name: 'Mumbai Central', code: 'MUM' },
  { id: 'WH-DEL', name: 'Delhi NCR Hub', code: 'DEL' },
  { id: 'WH-CHN', name: 'Chennai Gateway', code: 'CHN' },
  { id: 'WH-BLR', name: 'Bangalore South', code: 'BLR' },
  { id: 'WH-HYD', name: 'Hyderabad East', code: 'HYD' },
  { id: 'WH-KOL', name: 'Kolkata Port', code: 'KOL' },
]

const WC_TYPES: WCType[] = ['Assembly', 'Packing', 'Quality Check', 'Labeling', 'Palletizing', 'Cold Storage', 'Receiving', 'Shipping']

const WC_TYPE_CAPACITY: Record<WCType, [number, number]> = {
  'Assembly': [60, 120],
  'Packing': [200, 500],
  'Quality Check': [80, 180],
  'Labeling': [150, 350],
  'Palletizing': [40, 100],
  'Cold Storage': [100, 250],
  'Receiving': [150, 400],
  'Shipping': [120, 350],
}

const WC_TYPE_ICONS: Record<WCType, string> = {
  'Assembly': '🔧',
  'Packing': '📦',
  'Quality Check': '🔍',
  'Labeling': '🏷️',
  'Palletizing': '🏗️',
  'Cold Storage': '❄️',
  'Receiving': '📥',
  'Shipping': '📤',
}

const SUPERVISORS = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Devi',
  'Vikram Singh', 'Meera Iyer', 'Arjun Reddy', 'Kavitha Nair',
  'Deepak Joshi', 'Anita Das', 'Ramesh Gupta', 'Lakshmi Rao',
]

const STATUS_WEIGHTS: [WCStatus, number][] = [
  ['operational', 0.55],
  ['under_maintenance', 0.1],
  ['idle', 0.12],
  ['overloaded', 0.15],
  ['offline', 0.08],
]

function pickWeighted<T>(rng: () => number, items: [T, number][]): T {
  const r = rng()
  let cumulative = 0
  for (const [item, weight] of items) {
    cumulative += weight
    if (r <= cumulative) return item
  }
  return items[items.length - 1][0]
}

function generateWorkCenters(rng: () => number): WorkCenter[] {
  const centers: WorkCenter[] = []
  let id = 1

  for (const wh of WAREHOUSES) {
    const numCenters = 5 + Math.floor(rng() * 4)
    const usedTypes = new Set<WCType>()

    for (let i = 0; i < numCenters; i++) {
      let type: WCType
      do {
        type = WC_TYPES[Math.floor(rng() * WC_TYPES.length)]
      } while (usedTypes.has(type) && usedTypes.size < WC_TYPES.length)
      usedTypes.add(type)

      const [minCap, maxCap] = WC_TYPE_CAPACITY[type]
      const baseCapacity = Math.round(minCap + rng() * (maxCap - minCap))
      const status = pickWeighted(rng, STATUS_WEIGHTS)

      const baseAvailability = status === 'offline' ? 0.3 : status === 'under_maintenance' ? 0.5 : 0.82 + rng() * 0.15
      const basePerformance = status === 'offline' ? 0.5 : status === 'idle' ? 0.7 : 0.75 + rng() * 0.2
      const baseQuality = status === 'offline' ? 0.6 : 0.92 + rng() * 0.06

      const shifts: ShiftData[] = (['Morning', 'Afternoon', 'Night'] as ShiftName[]).map(sn => {
        const shiftMult = sn === 'Morning' ? 1.0 : sn === 'Afternoon' ? 0.85 : 0.6
        const shiftCap = Math.round(baseCapacity * shiftMult)
        const shiftHours = sn === 'Morning' ? 8 : sn === 'Afternoon' ? 8 : 6
        const totalCap = shiftCap * shiftHours
        const utilMult = status === 'idle' ? 0.2 + rng() * 0.3 : status === 'offline' ? 0.1 : 0.6 + rng() * 0.35
        const planned = Math.round(totalCap * utilMult)
        const eff = status === 'offline' ? 0.5 + rng() * 0.2 : 0.85 + rng() * 0.13
        const actual = Math.round(planned * eff)
        return {
          name: sn,
          hours: shiftHours,
          capacityPerHour: shiftCap,
          totalCapacity: totalCap,
          plannedUnits: planned,
          actualUnits: actual,
          utilization: planned / totalCap,
          efficiency: eff,
          headcount: sn === 'Night' ? Math.round((3 + rng() * 5) * shiftMult) : Math.round(3 + rng() * 8),
        }
      })

      const oee = baseAvailability * basePerformance * baseQuality
      const dailyCapacity = shifts.reduce((s, sh) => s + sh.totalCapacity, 0)
      const dailyActual = shifts.reduce((s, sh) => s + sh.actualUnits, 0)

      centers.push({
        id: `WC-${String(id).padStart(3, '0')}`,
        name: `${type} ${id}`,
        type,
        warehouse: wh.name,
        warehouseCode: wh.code,
        capacityPerHour: baseCapacity,
        shifts,
        status,
        oee,
        availability: baseAvailability,
        performance: basePerformance,
        quality: baseQuality,
        efficiency: dailyActual / dailyCapacity,
        supervisor: SUPERVISORS[Math.floor(rng() * SUPERVISORS.length)],
        equipmentCount: Math.round(2 + rng() * 8),
        lastMaintenance: `${Math.floor(rng() * 28) + 1} days ago`,
        efficiencyTarget: 0.88,
        oeeTarget: 0.75,
        sinceDate: `2024-${String(Math.floor(rng() * 12) + 1).padStart(2, '0')}-${String(Math.floor(rng() * 28) + 1).padStart(2, '0')}`,
        notes: '',
      })
      id++
    }
  }
  return centers
}

function generateCapacityPlan(rng: () => number, scenario: ScenarioType): CapacityWeek[] {
  const weeks: CapacityWeek[] = []
  const baseDemand = 42000
  const baseAvailable = 48000
  const scenarioMult = scenario === 'optimistic' ? 0.85 : scenario === 'pessimistic' ? 1.2 : scenario === 'base' ? 1.0 : 1.05
  const availMult = scenario === 'optimistic' ? 1.1 : scenario === 'pessimistic' ? 0.9 : 1.0

  for (let w = 0; w < 12; w++) {
    const seasonal = Math.sin((w / 12) * Math.PI * 2) * 0.15
    const demand = Math.round(baseDemand * (1 + seasonal + (rng() - 0.5) * 0.1) * scenarioMult)
    const available = Math.round(baseAvailable * availMult * (1 + (rng() - 0.5) * 0.05))
    const required = Math.round(demand * 1.08)
    const gap = required - available
    const gapPct = gap / available

    let action: string
    if (gap > available * 0.15) action = 'Hire Temp Staff'
    else if (gap > available * 0.08) action = 'Add Overtime Shift'
    else if (gap > available * 0.03) action = 'Extend Shift Hours'
    else if (gap > 0) action = 'Monitor Closely'
    else if (gap > -available * 0.1) action = 'Optimize Scheduling'
    else action = 'Accept Surplus Capacity'

    weeks.push({
      week: `W${w + 1}`,
      forecastDemand: demand,
      requiredCapacity: required,
      availableCapacity: available,
      gap,
      gapPercent: gapPct,
      action,
      status: gap > available * 0.05 ? 'overloaded' : gap < -available * 0.05 ? 'underutilized' : 'balanced',
    })
  }
  return weeks
}

function generateOEEHistory(rng: () => number): OEEHistory[] {
  const history: OEEHistory[] = []
  for (let w = 0; w < 12; w++) {
    const avail = 0.82 + rng() * 0.12
    const perf = 0.78 + rng() * 0.15
    const qual = 0.93 + rng() * 0.05
    history.push({
      week: `W${w + 1}`,
      availability: Math.round(avail * 1000) / 1000,
      performance: Math.round(perf * 1000) / 1000,
      quality: Math.round(qual * 1000) / 1000,
      oee: Math.round(avail * perf * qual * 1000) / 1000,
    })
  }
  return history
}

function generateEfficiencyLosses(rng: () => number): EfficiencyLoss[] {
  const categories = [
    { name: 'Unplanned Downtime', color: '#ef4444' },
    { name: 'Changeover Time', color: '#f97316' },
    { name: 'Minor Stops', color: '#eab308' },
    { name: 'Reduced Speed', color: '#22c55e' },
    { name: 'Startup Losses', color: '#06b6d4' },
    { name: 'Quality Rejects', color: '#8b5cf6' },
    { name: 'Material Shortage', color: '#ec4899' },
    { name: 'Operator Error', color: '#14b8a6' },
    { name: 'Waiting / Queue', color: '#f43f5e' },
    { name: 'Tool Wear', color: '#a855f7' },
  ]
  let total = 0
  const losses: EfficiencyLoss[] = categories.map(c => {
    const hours = Math.round(10 + rng() * 60)
    total += hours
    return { category: c.name, hours, percentage: 0, color: c.color }
  })
  losses.forEach(l => { l.percentage = l.hours / total })
  return losses.sort((a, b) => b.hours - a.hours)
}

function generateAlerts(rng: () => number, workCenters: WorkCenter[]): CapacityAlert[] {
  const alerts: CapacityAlert[] = []
  const overloaded = workCenters.filter(wc => wc.status === 'overloaded')
  const offline = workCenters.filter(wc => wc.status === 'offline')
  const lowOEE = workCenters.filter(wc => wc.oee < 0.5)

  for (const wc of overloaded.slice(0, 3)) {
    alerts.push({
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      severity: 'critical',
      title: `${wc.name} is Overloaded`,
      description: `Utilization exceeded 95% across all shifts. Risk of quality degradation and equipment failure. Immediate capacity rebalancing recommended.`,
      source: wc.id,
      timestamp: `${Math.floor(rng() * 48)}h ago`,
    })
  }

  for (const wc of offline.slice(0, 2)) {
    alerts.push({
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      severity: 'warning',
      title: `${wc.name} is Offline`,
      description: `Work center has been offline for ${wc.lastMaintenance}. Maintenance team notified. Expected restoration in ${Math.floor(rng() * 24) + 4} hours.`,
      source: wc.id,
      timestamp: `${Math.floor(rng() * 12) + 1}h ago`,
    })
  }

  for (const wc of lowOEE.slice(0, 2)) {
    alerts.push({
      id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      severity: 'warning',
      title: `Low OEE on ${wc.name}`,
      description: `OEE at ${(wc.oee * 100).toFixed(1)}% is significantly below ${(wc.oeeTarget * 100).toFixed(0)}% target. Primary loss driver: availability at ${(wc.availability * 100).toFixed(1)}%.`,
      source: wc.id,
      timestamp: `${Math.floor(rng() * 24) + 2}h ago`,
    })
  }

  alerts.push({
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    severity: 'info',
    title: 'Night Shift Underutilization Detected',
    description: 'Average night shift utilization across all warehouses is 38%. Consider consolidating to reduce operational costs by an estimated INR 2.4L/month.',
    source: 'system',
    timestamp: '2h ago',
  })

  alerts.push({
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    severity: 'success',
    title: 'Mumbai Assembly Line OEE Improvement',
    description: 'Mumbai Central Assembly work centers improved OEE by 4.2% WoW, reaching 72.8%. Best performing region this week.',
    source: 'WH-MUM',
    timestamp: '6h ago',
  })

  return alerts
}

// ============================================================================
// COLOR CONSTANTS
// ============================================================================

const STATUS_CONFIG: Record<WCStatus, { label: string; color: string; bg: string }> = {
  operational: { label: 'Operational', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  under_maintenance: { label: 'Maintenance', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  idle: { label: 'Idle', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800/40' },
  overloaded: { label: 'Overloaded', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' },
  offline: { label: 'Offline', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800/40' },
}

const TYPE_COLORS: Record<WCType, string> = {
  'Assembly': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  'Packing': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
  'Quality Check': 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
  'Labeling': 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300',
  'Palletizing': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  'Cold Storage': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  'Receiving': 'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-300',
  'Shipping': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
}

const SEVERITY_CONFIG: Record<SeverityType, { label: string; border: string; bg: string; icon: React.ReactNode }> = {
  critical: { label: 'Critical', border: 'border-l-4 border-l-red-500', bg: 'bg-red-50 dark:bg-red-950/30', icon: <XCircle className="h-4 w-4 text-red-500" /> },
  warning: { label: 'Warning', border: 'border-l-4 border-l-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> },
  info: { label: 'Info', border: 'border-l-4 border-l-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30', icon: <Info className="h-4 w-4 text-cyan-500" /> },
  success: { label: 'Success', border: 'border-l-4 border-l-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" /> },
}

const CHART_COLORS = ['#0d9488', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1']

const TABS = [
  { id: 'overview', label: 'Capacity Overview', icon: <Gauge className="h-4 w-4" /> },
  { id: 'workcenters', label: 'Work Centers', icon: <Factory className="h-4 w-4" /> },
  { id: 'shifts', label: 'Shift Management', icon: <Clock className="h-4 w-4" /> },
  { id: 'planning', label: 'Capacity Planning', icon: <Target className="h-4 w-4" /> },
  { id: 'scheduling', label: 'Production Scheduling', icon: <Calendar className="h-4 w-4" /> },
  { id: 'efficiency', label: 'Efficiency Analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'alerts', label: 'Alerts & Actions', icon: <Bell className="h-4 w-4" /> },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CapacityPlanningView() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all')
  const [scenario, setScenario] = useState<ScenarioType>('current')
  const [selectedWC, setSelectedWC] = useState<WorkCenter | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Generate all mock data
  const workCenters = useMemo(() => generateWorkCenters(seededRandom(555666)), [])
  const capacityPlan = useMemo(() => generateCapacityPlan(seededRandom(777888), scenario), [scenario])
  const oeeHistory = useMemo(() => generateOEEHistory(seededRandom(999111)), [])
  const efficiencyLosses = useMemo(() => generateEfficiencyLosses(seededRandom(333444)), [])
  const capacityAlerts = useMemo(() => generateAlerts(seededRandom(555777), workCenters), [workCenters])

  // Computed stats
  const stats = useMemo(() => {
    const operational = workCenters.filter(wc => wc.status === 'operational')
    const totalCap = workCenters.reduce((s, wc) => s + wc.capacityPerHour, 0)
    const currentLoad = operational.reduce((s, wc) => s + wc.capacityPerHour * wc.efficiency, 0)
    const avgOEE = operational.length > 0 ? operational.reduce((s, wc) => s + wc.oee, 0) / operational.length : 0
    const avgUtil = operational.length > 0 ? operational.reduce((s, wc) => s + wc.efficiency, 0) / operational.length : 0
    const overloaded = workCenters.filter(wc => wc.status === 'overloaded').length
    const maintenance = workCenters.filter(wc => wc.status === 'under_maintenance').length
    return {
      totalCapacity: totalCap,
      currentLoad,
      utilizationRate: avgUtil,
      availableCapacity: totalCap - currentLoad,
      avgOEE,
      operationalCount: operational.length,
      totalCount: workCenters.length,
      overloaded,
      maintenance,
    }
  }, [workCenters])

  // Filtered work centers
  const filteredWC = useMemo(() => {
    return workCenters.filter(wc => {
      if (searchQuery && !wc.name.toLowerCase().includes(searchQuery.toLowerCase()) && !wc.id.toLowerCase().includes(searchQuery.toLowerCase()) && !wc.supervisor.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (statusFilter !== 'all' && wc.status !== statusFilter) return false
      if (typeFilter !== 'all' && wc.type !== typeFilter) return false
      if (warehouseFilter !== 'all' && wc.warehouseCode !== warehouseFilter) return false
      return true
    })
  }, [workCenters, searchQuery, statusFilter, typeFilter, warehouseFilter])

  // Warehouse capacity chart data
  const warehouseCapData = useMemo(() => {
    return WAREHOUSES.map(wh => {
      const wcs = workCenters.filter(wc => wc.warehouseCode === wh.code)
      const totalCap = wcs.reduce((s, wc) => s + wc.capacityPerHour * 22, 0)
      const totalLoad = wcs.reduce((s, wc) => s + wc.capacityPerHour * 22 * wc.efficiency, 0)
      return {
        name: wh.code,
        capacity: totalCap,
        demand: Math.round(totalLoad * (1.05 + seededRandom(wh.code.charCodeAt(0))() * 0.15)),
        load: totalLoad,
      }
    })
  }, [workCenters])

  // Shift utilization data
  const shiftChartData = useMemo(() => {
    const shifts = ['Morning', 'Afternoon', 'Night'] as ShiftName[]
    return shifts.map(sn => {
      const allShifts = workCenters.flatMap(wc => wc.shifts).filter(s => s.name === sn)
      const totalCap = allShifts.reduce((s, sh) => s + sh.totalCapacity, 0)
      const totalActual = allShifts.reduce((s, sh) => s + sh.actualUnits, 0)
      const totalPlanned = allShifts.reduce((s, sh) => s + sh.plannedUnits, 0)
      return {
        name: sn,
        Capacity: totalCap,
        Planned: totalPlanned,
        Actual: totalActual,
        Utilization: Math.round((totalActual / totalCap) * 100),
      }
    })
  }, [workCenters])

  // Weekly shift heatmap data
  const shiftHeatmapData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const shifts = ['Morning', 'Afternoon', 'Night'] as ShiftName[]
    return days.map(day => {
      const row: Record<string, number | string> = { day }
      shifts.forEach(sn => {
        const util = 0.4 + seededRandom(day.charCodeAt(0) + sn.charCodeAt(0))() * 0.5
        row[sn] = Math.round(util * 100)
      })
      return row
    })
  }, [])

  // Production schedule data
  const scheduleData = useMemo(() => {
    const products = ['SKU-A100', 'SKU-B200', 'SKU-C300', 'SKU-D400', 'SKU-E500', 'SKU-F600', 'SKU-G700', 'SKU-H800']
    return products.map((sku, i) => {
      const planned = 200 + Math.round(seededRandom(i * 111)() * 800)
      const actual = Math.round(planned * (0.85 + seededRandom(i * 222)() * 0.3))
      const progress = Math.min(100, Math.round((actual / planned) * 100))
      const startTime = `${6 + Math.floor(seededRandom(i * 333)() * 4)}:00`
      const endTime = `${14 + Math.floor(seededRandom(i * 444)() * 6)}:00`
      let adherence: 'On-time' | 'Early' | 'Late' | 'At Risk'
      if (progress >= 100) adherence = actual >= planned ? 'Early' : 'On-time'
      else if (progress >= 80) adherence = 'On-time'
      else if (progress >= 60) adherence = 'At Risk'
      else adherence = 'Late'
      return { sku, startTime, endTime, planned, actual, progress, adherence, priority: i < 3 ? 'High' : i < 6 ? 'Medium' : 'Low' }
    })
  }, [])

  // Health scores
  const healthScores = useMemo(() => {
    return [
      { label: 'Overall OEE', value: stats.avgOEE, target: 0.75, format: 'pct' },
      { label: 'Capacity Utilization', value: stats.utilizationRate, target: 0.85, format: 'pct' },
      { label: 'Schedule Adherence', value: scheduleData.filter(s => s.adherence === 'On-time' || s.adherence === 'Early').length / scheduleData.length, target: 0.95, format: 'pct' },
      { label: 'Shift Coverage', value: 0.92, target: 0.90, format: 'pct' },
      { label: 'Bottleneck Resolution', value: 0.78, target: 0.85, format: 'pct' },
      { label: 'Efficiency Trend', value: 0.82, target: 0.80, format: 'pct' },
    ]
  }, [stats, scheduleData])

  // Capacity gap stats
  const gapStats = useMemo(() => {
    const overloaded = capacityPlan.filter(w => w.status === 'overloaded')
    const underutilized = capacityPlan.filter(w => w.status === 'underutilized')
    const criticalGaps = overloaded.filter(w => w.gapPercent > 0.1)
    return {
      overloadedWeeks: overloaded.length,
      underutilizedWeeks: underutilized.length,
      criticalGaps: criticalGaps.length,
      totalGapHours: capacityPlan.reduce((s, w) => s + Math.abs(w.gap), 0),
    }
  }, [capacityPlan])

  // Bottlenecks
  const bottlenecks = useMemo(() => {
    return workCenters
      .filter(wc => wc.status === 'overloaded' || wc.efficiency > 0.9)
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 5)
      .map(wc => ({
        ...wc,
        severity: wc.efficiency > 0.95 ? 'critical' as SeverityType : wc.efficiency > 0.9 ? 'warning' as SeverityType : 'info' as SeverityType,
      }))
  }, [workCenters])

  // OEE gauge data
  const oeeGaugeData = useMemo(() => {
    const avg = stats.avgOEE
    return [{ name: 'OEE', value: Math.round(avg * 100), fill: avg >= 0.75 ? '#10b981' : avg >= 0.6 ? '#f59e0b' : '#ef4444' }]
  }, [stats])

  const handleOpenDetail = (wc: WorkCenter) => {
    setSelectedWC(wc)
    setSheetOpen(true)
  }

  const handleExportCSV = () => {
    const data = filteredWC.map(wc => ({
      ID: wc.id,
      Name: wc.name,
      Type: wc.type,
      Warehouse: wc.warehouse,
      'Capacity/hr': wc.capacityPerHour,
      Status: wc.status,
      OEE: (wc.oee * 100).toFixed(1) + '%',
      Availability: (wc.availability * 100).toFixed(1) + '%',
      Performance: (wc.performance * 100).toFixed(1) + '%',
      Quality: (wc.quality * 100).toFixed(1) + '%',
      Efficiency: (wc.efficiency * 100).toFixed(1) + '%',
      Supervisor: wc.supervisor,
    }))
    exportToCSV(data, 'capacity-planning-work-centers')
  }

  return (
    <div className="cap-root space-y-6">
      {/* Header */}
      <div className="cap-header rounded-xl border border-teal-200/50 dark:border-teal-800/50 bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 p-6 text-white shadow-lg">
        <div className="cap-header-inner flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="cap-header-title text-2xl font-bold tracking-tight flex items-center gap-3">
                <Gauge className="h-7 w-7" />
                Production Capacity Planning
              </h1>
              <p className="cap-header-subtitle text-teal-100 text-sm mt-1">
                Rough-Cut Capacity Planning (RCCP) · OEE Tracking · Shift Optimization
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => {}}>
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Banner */}
      <div className="cap-kpi-banner grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="cap-kpi-main col-span-2 lg:col-span-1 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 p-4 text-white shadow-lg relative overflow-hidden">
          <div className="cap-kpi-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="cap-kpi-label text-xs font-medium text-teal-100 uppercase tracking-wider">Total Capacity</div>
          <div className="cap-kpi-value text-2xl font-bold tabular-nums">{stats.totalCapacity.toLocaleString('en-IN')}</div>
          <div className="cap-kpi-unit text-xs text-teal-200 mt-1">units/hour across {stats.totalCount} work centers</div>
        </div>
        <div className="cap-kpi-tile rounded-xl border border-teal-100 dark:border-teal-900/50 bg-white dark:bg-slate-900 p-4">
          <div className="cap-kpi-label text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Load</div>
          <div className="cap-kpi-value text-xl font-bold tabular-nums text-teal-700 dark:text-teal-400">{Math.round(stats.currentLoad).toLocaleString('en-IN')}</div>
          <div className="cap-kpi-sub text-xs text-muted-foreground mt-1">units/hour</div>
        </div>
        <div className="cap-kpi-tile rounded-xl border border-teal-100 dark:border-teal-900/50 bg-white dark:bg-slate-900 p-4">
          <div className="cap-kpi-label text-xs font-medium text-muted-foreground uppercase tracking-wider">Utilization Rate</div>
          <div className="cap-kpi-value text-xl font-bold tabular-nums text-cyan-700 dark:text-cyan-400">{(stats.utilizationRate * 100).toFixed(1)}%</div>
          <div className="cap-kpi-sub text-xs text-muted-foreground mt-1">avg across operational</div>
        </div>
        <div className="cap-kpi-tile rounded-xl border border-teal-100 dark:border-teal-900/50 bg-white dark:bg-slate-900 p-4">
          <div className="cap-kpi-label text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg OEE</div>
          <div className="cap-kpi-value text-xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">{(stats.avgOEE * 100).toFixed(1)}%</div>
          <div className="cap-kpi-sub text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Target className="h-3 w-3" /> Target: 75%
          </div>
        </div>
        <div className="cap-kpi-tile rounded-xl border border-teal-100 dark:border-teal-900/50 bg-white dark:bg-slate-900 p-4">
          <div className="cap-kpi-label text-xs font-medium text-muted-foreground uppercase tracking-wider">Available</div>
          <div className="cap-kpi-value text-xl font-bold tabular-nums text-sky-700 dark:text-sky-400">{Math.round(stats.availableCapacity).toLocaleString('en-IN')}</div>
          <div className="cap-kpi-sub text-xs text-muted-foreground mt-1">units/hour spare</div>
        </div>
        <div className="cap-kpi-tile rounded-xl border border-teal-100 dark:border-teal-900/50 bg-white dark:bg-slate-900 p-4">
          <div className="cap-kpi-label text-xs font-medium text-muted-foreground uppercase tracking-wider">Overloaded</div>
          <div className="cap-kpi-value text-xl font-bold tabular-nums text-red-600 dark:text-red-400">{stats.overloaded}</div>
          <div className="cap-kpi-sub text-xs text-muted-foreground mt-1">work centers</div>
        </div>
        <div className="cap-kpi-tile rounded-xl border border-teal-100 dark:border-teal-900/50 bg-white dark:bg-slate-900 p-4">
          <div className="cap-kpi-label text-xs font-medium text-muted-foreground uppercase tracking-wider">In Maintenance</div>
          <div className="cap-kpi-value text-xl font-bold tabular-nums text-amber-600 dark:text-amber-400">{stats.maintenance}</div>
          <div className="cap-kpi-sub text-xs text-muted-foreground mt-1">work centers</div>
        </div>
        <div className="cap-kpi-tile rounded-xl border border-teal-100 dark:border-teal-900/50 bg-white dark:bg-slate-900 p-4">
          <div className="cap-kpi-label text-xs font-medium text-muted-foreground uppercase tracking-wider">Operational</div>
          <div className="cap-kpi-value text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{stats.operationalCount}/{stats.totalCount}</div>
          <div className="cap-kpi-sub text-xs text-muted-foreground mt-1">work centers active</div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="cap-tab-bar flex gap-1 overflow-x-auto border-b border-border pb-px">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cap-tab-item flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors rounded-t-lg ${
              activeTab === tab.id
                ? 'cap-tab-active text-teal-700 dark:text-teal-400 bg-gradient-to-b from-teal-50 to-transparent dark:from-teal-950/30 border-b-2 border-teal-500'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="cap-tab-content">
        {activeTab === 'overview' && (
          <div className="cap-overview space-y-4">
            {/* Capacity vs Demand Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="cap-chart-card lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-teal-600" />
                    Capacity vs Demand by Warehouse
                  </CardTitle>
                  <CardDescription>Current capacity, planned load, and forecasted demand</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={warehouseCapData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="capacity" fill="#0d9488" name="Capacity" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="load" fill="#06b6d4" name="Current Load" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="demand" stroke="#ef4444" strokeWidth={2} name="Forecast Demand" dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Bottleneck Card */}
              <Card className="cap-bottleneck-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Top Bottlenecks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {bottlenecks.map((bn, i) => (
                    <div key={bn.id} className={`cap-bottleneck-item flex items-center justify-between p-2 rounded-lg ${SEVERITY_CONFIG[bn.severity].bg}`}>
                      <div className="flex items-center gap-2">
                        <span className="cap-bottleneck-rank text-xs font-bold text-muted-foreground">#{i + 1}</span>
                        <div>
                          <div className="text-sm font-medium">{bn.name}</div>
                          <div className="text-xs text-muted-foreground">{bn.warehouseCode} · {bn.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold ${bn.efficiency > 0.95 ? 'text-red-600' : 'text-amber-600'}`}>
                          {(bn.efficiency * 100).toFixed(0)}%
                        </span>
                        <div className="text-xs text-muted-foreground">util</div>
                      </div>
                    </div>
                  ))}
                  {bottlenecks.length === 0 && (
                    <div className="cap-empty-state text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                      <p className="text-sm">No bottlenecks detected</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Work Center Utilization Grid */}
            <Card className="cap-heatmap-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-cyan-600" />
                  Work Center Utilization Matrix (Warehouse x Shift)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="cap-heatmap-grid overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="cap-heatmap-th p-2 text-left font-medium text-muted-foreground">Warehouse</th>
                        {(['Morning', 'Afternoon', 'Night'] as ShiftName[]).map(s => (
                          <th key={s} className="cap-heatmap-th p-2 text-center font-medium text-muted-foreground">{s}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {WAREHOUSES.map(wh => {
                        const wcs = workCenters.filter(wc => wc.warehouseCode === wh.code)
                        return (
                          <tr key={wh.code} className="border-t border-border/50">
                            <td className="p-2 font-medium">{wh.code}</td>
                            {(['Morning', 'Afternoon', 'Night'] as ShiftName[]).map(sn => {
                              const shifts = wcs.flatMap(wc => wc.shifts).filter(s => s.name === sn)
                              const totalCap = shifts.reduce((s, sh) => s + sh.totalCapacity, 0)
                              const totalActual = shifts.reduce((s, sh) => s + sh.actualUnits, 0)
                              const util = totalCap > 0 ? totalActual / totalCap : 0
                              const pct = Math.round(util * 100)
                              const bg = pct > 90 ? 'bg-red-500 text-white' : pct > 75 ? 'bg-amber-400 text-white' : pct > 50 ? 'bg-teal-400 text-white' : 'bg-slate-200 dark:bg-slate-700'
                              return (
                                <td key={sn} className="p-2 text-center">
                                  <span className={`cap-heatmap-cell inline-block px-2 py-1 rounded text-xs font-bold ${bg}`}>
                                    {pct}%
                                  </span>
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'workcenters' && (
          <div className="cap-workcenters space-y-4">
            {/* Filter Bar */}
            <Card className="cap-filter-bar">
              <CardContent className="py-3 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, or supervisor..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="overloaded">Overloaded</SelectItem>
                    <SelectItem value="under_maintenance">Maintenance</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {WC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger className="h-9 w-[160px]">
                    <SelectValue placeholder="Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {WAREHOUSES.map(w => <SelectItem key={w.code} value={w.code}>{w.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Badge variant="secondary" className="h-9 px-3 flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  {filteredWC.length} results
                </Badge>
              </CardContent>
            </Card>

            {/* Work Center Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-teal-50/50 dark:bg-teal-950/20">
                      <TableHead className="cap-table-th text-xs font-semibold">ID</TableHead>
                      <TableHead className="cap-table-th text-xs font-semibold">Name</TableHead>
                      <TableHead className="cap-table-th text-xs font-semibold">Type</TableHead>
                      <TableHead className="cap-table-th text-xs font-semibold">Status</TableHead>
                      <TableHead className="cap-table-th text-xs font-semibold text-right">Cap/hr</TableHead>
                      <TableHead className="cap-table-th text-xs font-semibold text-right">Load %</TableHead>
                      <TableHead className="cap-table-th text-xs font-semibold text-right">OEE</TableHead>
                      <TableHead className="cap-table-th text-xs font-semibold text-right">Efficiency</TableHead>
                      <TableHead className="cap-table-th text-xs font-semibold">Supervisor</TableHead>
                      <TableHead className="cap-table-th text-xs font-semibold text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWC.slice(0, 50).map(wc => {
                      const sc = STATUS_CONFIG[wc.status]
                      const tc = TYPE_COLORS[wc.type]
                      return (
                        <TableRow key={wc.id} className="cap-table-row hover:bg-muted/30 transition-colors">
                          <TableCell className="cap-table-cell font-mono text-xs">{wc.id}</TableCell>
                          <TableCell className="cap-table-cell">
                            <div className="flex items-center gap-2">
                              <span>{WC_TYPE_ICONS[wc.type]}</span>
                              <span className="font-medium text-sm">{wc.name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{wc.warehouseCode}</div>
                          </TableCell>
                          <TableCell className="cap-table-cell">
                            <span className={`cap-type-pill inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tc}`}>
                              {wc.type}
                            </span>
                          </TableCell>
                          <TableCell className="cap-table-cell">
                            <span className={`cap-status-pill inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                              {sc.label}
                            </span>
                          </TableCell>
                          <TableCell className="cap-table-cell text-right tabular-nums font-medium">{wc.capacityPerHour.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="cap-table-cell text-right tabular-nums">
                            <span className={wc.efficiency > 0.9 ? 'text-red-600 font-bold' : wc.efficiency > 0.75 ? 'text-amber-600' : 'text-emerald-600'}>
                              {(wc.efficiency * 100).toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="cap-table-cell text-right tabular-nums">
                            <span className={wc.oee >= 0.75 ? 'text-emerald-600 font-medium' : wc.oee >= 0.6 ? 'text-amber-600' : 'text-red-600'}>
                              {(wc.oee * 100).toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell className="cap-table-cell text-right tabular-nums">
                            <div className="flex items-center gap-2 justify-end">
                              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${wc.efficiency >= 0.85 ? 'bg-emerald-500' : wc.efficiency >= 0.7 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(100, wc.efficiency * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs tabular-nums">{(wc.efficiency * 100).toFixed(0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="cap-table-cell text-xs text-muted-foreground">{wc.supervisor}</TableCell>
                          <TableCell className="cap-table-cell text-center">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleOpenDetail(wc)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="cap-shifts space-y-4">
            {/* Shift Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['Morning', 'Afternoon', 'Night'] as ShiftName[]).map(sn => {
                const allShifts = workCenters.flatMap(wc => wc.shifts).filter(s => s.name === sn)
                const totalCap = allShifts.reduce((s, sh) => s + sh.totalCapacity, 0)
                const totalActual = allShifts.reduce((s, sh) => s + sh.actualUnits, 0)
                const totalPlanned = allShifts.reduce((s, sh) => s + sh.plannedUnits, 0)
                const headcount = allShifts.reduce((s, sh) => s + sh.headcount, 0)
                const util = totalCap > 0 ? totalActual / totalCap : 0
                const gradient = sn === 'Morning' ? 'from-amber-500 to-orange-600' : sn === 'Afternoon' ? 'from-cyan-500 to-blue-600' : 'from-indigo-500 to-purple-600'
                return (
                  <Card key={sn} className="cap-shift-card overflow-hidden">
                    <div className={`cap-shift-card-header bg-gradient-to-r ${gradient} p-4 text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          <span className="font-semibold">{sn} Shift</span>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white border-0">
                          {sn === 'Morning' ? '06:00-14:00' : sn === 'Afternoon' ? '14:00-22:00' : '22:00-04:00'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Capacity</div>
                          <div className="text-lg font-bold tabular-nums">{totalCap.toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Actual</div>
                          <div className="text-lg font-bold tabular-nums text-teal-600 dark:text-teal-400">{totalActual.toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Planned</div>
                          <div className="text-sm font-medium tabular-nums">{totalPlanned.toLocaleString('en-IN')}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Headcount</div>
                          <div className="text-sm font-medium tabular-nums">{headcount}</div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Utilization</span>
                          <span className="font-bold">{(util * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${util > 0.85 ? 'bg-red-500' : util > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, util * 100)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Shift Comparison Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-teal-600" />
                  Shift Comparison — Capacity vs Actual Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={shiftChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Capacity" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Planned" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Shift Heatmap */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-cyan-600" />
                  Weekly Shift Utilization Heatmap
                </CardTitle>
                <CardDescription>Color intensity indicates utilization level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="p-2 text-left font-medium text-muted-foreground">Day</th>
                        <th className="p-2 text-center font-medium text-amber-600">Morning</th>
                        <th className="p-2 text-center font-medium text-cyan-600">Afternoon</th>
                        <th className="p-2 text-center font-medium text-indigo-600">Night</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftHeatmapData.map(row => (
                        <tr key={row.day} className="border-t border-border/50">
                          <td className="p-2 font-medium">{row.day}</td>
                          {(['Morning', 'Afternoon', 'Night'] as ShiftName[]).map(sn => {
                            const val = row[sn] as number
                            const bg = val > 85 ? 'bg-red-500 text-white' : val > 70 ? 'bg-amber-400 text-white' : val > 50 ? 'bg-teal-400 text-white' : 'bg-slate-200 dark:bg-slate-700'
                            return (
                              <td key={sn} className="p-2 text-center">
                                <span className={`inline-block px-3 py-1.5 rounded text-xs font-bold ${bg}`}>
                                  {val}%
                                </span>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'planning' && (
          <div className="cap-planning space-y-4">
            {/* Scenario Selector + Gap Stats */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Scenario:</span>
                {(['current', 'base', 'optimistic', 'pessimistic'] as ScenarioType[]).map(s => (
                  <Button
                    key={s}
                    size="sm"
                    variant={scenario === s ? 'default' : 'outline'}
                    className={scenario === s ? 'bg-teal-600 hover:bg-teal-700' : ''}
                    onClick={() => setScenario(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="cap-gap-card">
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-muted-foreground uppercase">Overloaded Weeks</div>
                  <div className="text-2xl font-bold text-red-600">{gapStats.overloadedWeeks}</div>
                </CardContent>
              </Card>
              <Card className="cap-gap-card">
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-muted-foreground uppercase">Underutilized Weeks</div>
                  <div className="text-2xl font-bold text-sky-600">{gapStats.underutilizedWeeks}</div>
                </CardContent>
              </Card>
              <Card className="cap-gap-card">
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-muted-foreground uppercase">Critical Gaps</div>
                  <div className="text-2xl font-bold text-amber-600">{gapStats.criticalGaps}</div>
                </CardContent>
              </Card>
              <Card className="cap-gap-card">
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-muted-foreground uppercase">Total Gap Hours</div>
                  <div className="text-2xl font-bold text-teal-600">{gapStats.totalGapHours.toLocaleString('en-IN')}</div>
                </CardContent>
              </Card>
            </div>

            {/* Capacity Plan Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-teal-600" />
                  12-Week Capacity Plan — {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={capacityPlan}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="availableCapacity" fill="#0d948833" stroke="#0d9488" name="Available Capacity" />
                    <Area type="monotone" dataKey="requiredCapacity" fill="#06b6d433" stroke="#06b6d4" name="Required Capacity" />
                    <Line type="monotone" dataKey="forecastDemand" stroke="#8b5cf6" strokeWidth={2} name="Forecast Demand" dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Capacity Plan Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Rough-Cut Capacity Plan</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-teal-50/50 dark:bg-teal-950/20">
                      <TableHead className="text-xs font-semibold">Week</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Forecast Demand</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Required Cap.</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Available Cap.</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Gap</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Gap %</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-xs font-semibold">Recommended Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {capacityPlan.map(w => (
                      <TableRow key={w.week} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-sm font-semibold">{w.week}</TableCell>
                        <TableCell className="text-right tabular-nums">{w.forecastDemand.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right tabular-nums">{w.requiredCapacity.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right tabular-nums">{w.availableCapacity.toLocaleString('en-IN')}</TableCell>
                        <TableCell className={`text-right tabular-nums font-bold ${w.gap > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {w.gap > 0 ? '+' : ''}{w.gap.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className={`text-right tabular-nums ${w.gapPercent > 0.1 ? 'text-red-600' : w.gapPercent > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {(w.gapPercent * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            w.status === 'overloaded' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                            w.status === 'underutilized' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                          }`}>
                            {w.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{w.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'scheduling' && (
          <div className="cap-scheduling space-y-4">
            {/* Schedule Adherence Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['On-time', 'Early', 'At Risk', 'Late'] as const).map(status => {
                const count = scheduleData.filter(s => s.adherence === status).length
                const color = status === 'On-time' ? 'text-emerald-600' : status === 'Early' ? 'text-teal-600' : status === 'At Risk' ? 'text-amber-600' : 'text-red-600'
                const bg = status === 'On-time' ? 'bg-emerald-50 dark:bg-emerald-950/30' : status === 'Early' ? 'bg-teal-50 dark:bg-teal-950/30' : status === 'At Risk' ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-red-50 dark:bg-red-950/30'
                return (
                  <Card key={status} className={`${bg} border-${color.replace('text-', '')}`}>
                    <CardContent className="p-4 text-center">
                      <div className="text-xs text-muted-foreground uppercase">{status}</div>
                      <div className={`text-2xl font-bold ${color}`}>{count}</div>
                      <div className="text-xs text-muted-foreground">orders</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Production Schedule Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-600" />
                  Today's Production Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-teal-50/50 dark:bg-teal-950/20">
                      <TableHead className="text-xs font-semibold">SKU</TableHead>
                      <TableHead className="text-xs font-semibold">Time Window</TableHead>
                      <TableHead className="text-xs font-semibold">Priority</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Planned</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Actual</TableHead>
                      <TableHead className="text-xs font-semibold">Progress</TableHead>
                      <TableHead className="text-xs font-semibold">Adherence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduleData.map(item => {
                      const adherenceColor = item.adherence === 'On-time' || item.adherence === 'Early' ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400' : item.adherence === 'At Risk' ? 'text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400' : 'text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-400'
                      const priorityColor = item.priority === 'High' ? 'text-red-600' : item.priority === 'Medium' ? 'text-amber-600' : 'text-muted-foreground'
                      return (
                        <TableRow key={item.sku} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-sm font-semibold">{item.sku}</TableCell>
                          <TableCell className="text-sm tabular-nums">{item.startTime} — {item.endTime}</TableCell>
                          <TableCell>
                            <span className={`text-xs font-bold ${priorityColor}`}>
                              {'●'.repeat(item.priority === 'High' ? 3 : item.priority === 'Medium' ? 2 : 1)} {item.priority}
                            </span>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">{item.planned.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="text-right tabular-nums font-medium">{item.actual.toLocaleString('en-IN')}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${item.progress >= 100 ? 'bg-emerald-500' : item.progress >= 80 ? 'bg-teal-500' : item.progress >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(100, item.progress)}%` }}
                                />
                              </div>
                              <span className="text-xs tabular-nums">{item.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${adherenceColor}`}>
                              {item.adherence}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'efficiency' && (
          <div className="cap-efficiency space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* OEE Gauge */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-teal-600" />
                    Overall OEE
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={oeeGaugeData} startAngle={180} endAngle={0}>
                      <RadialBar dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="text-center -mt-8">
                    <div className={`text-3xl font-bold ${stats.avgOEE >= 0.75 ? 'text-emerald-600' : stats.avgOEE >= 0.6 ? 'text-amber-600' : 'text-red-600'}`}>
                      {(stats.avgOEE * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Target: 75%</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 w-full mt-4">
                    <div className="text-center p-2 rounded-lg bg-teal-50 dark:bg-teal-950/30">
                      <div className="text-xs text-muted-foreground">Availability</div>
                      <div className="text-sm font-bold">{(stats.avgOEE > 0 ? 0.88 : 0.82) * 100 > 0 ? `${(oeeHistory[oeeHistory.length - 1]?.availability * 100).toFixed(1)}%` : 'N/A'}</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
                      <div className="text-xs text-muted-foreground">Performance</div>
                      <div className="text-sm font-bold">{(oeeHistory[oeeHistory.length - 1]?.performance * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                      <div className="text-xs text-muted-foreground">Quality</div>
                      <div className="text-sm font-bold">{(oeeHistory[oeeHistory.length - 1]?.quality * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* OEE Trend */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                    OEE Trend — 12 Weeks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={oeeHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="oee" stroke="#0d9488" strokeWidth={2.5} name="OEE" dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="availability" stroke="#06b6d4" strokeWidth={1.5} name="Availability" strokeDasharray="5 5" dot={false} />
                      <Line type="monotone" dataKey="performance" stroke="#8b5cf6" strokeWidth={1.5} name="Performance" strokeDasharray="5 5" dot={false} />
                      <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={1.5} name="Quality" strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Efficiency Loss Pareto */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-cyan-600" />
                    Efficiency Loss Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={efficiencyLosses} dataKey="hours" nameKey="category" cx="50%" cy="50%" outerRadius={90} label={({ name, percentage }) => `${name.split(' ')[0]} ${(percentage * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                        {efficiencyLosses.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    Benchmark Comparison
                  </CardTitle>
                  <CardDescription>Actual vs Target vs Industry Average</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { metric: 'OEE', actual: stats.avgOEE * 100, target: 75, industry: 65 },
                      { metric: 'Availability', actual: oeeHistory[oeeHistory.length - 1]?.availability * 100 || 85, target: 90, industry: 82 },
                      { metric: 'Performance', actual: oeeHistory[oeeHistory.length - 1]?.performance * 100 || 80, target: 85, industry: 78 },
                      { metric: 'Quality', actual: oeeHistory[oeeHistory.length - 1]?.quality * 100 || 95, target: 98, industry: 96 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                      <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                      <Legend />
                      <Bar dataKey="actual" fill="#0d9488" name="Actual" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" fill="#f59e0b" name="Target" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="industry" fill="#94a3b8" name="Industry Avg" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="cap-alerts space-y-4">
            {/* Health Scorecards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {healthScores.map(hs => {
                const pct = hs.value * 100
                const isAboveTarget = pct >= hs.target * 100
                return (
                  <Card key={hs.label} className="cap-health-tile">
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground font-medium mb-2">{hs.label}</div>
                      <div className={`text-lg font-bold tabular-nums ${isAboveTarget ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {pct.toFixed(1)}%
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Target: {(hs.target * 100).toFixed(0)}%</span>
                        <span className={isAboveTarget ? 'text-emerald-500' : 'text-amber-500'}>
                          {isAboveTarget ? '● Met' : '● Below'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isAboveTarget ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Alerts List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-500" />
                  Capacity Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {capacityAlerts.map(alert => {
                  const sev = SEVERITY_CONFIG[alert.severity]
                  return (
                    <div key={alert.id} className={`cap-alert-row flex items-start gap-3 p-3 rounded-lg border ${sev.border} ${sev.bg}`}>
                      <div className="mt-0.5">{sev.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{alert.title}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs h-5">{alert.source}</Badge>
                          <Badge variant="secondary" className="text-xs h-5">{sev.label}</Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { priority: 1, action: 'Rebalance Mumbai Assembly load to Bangalore shifts', impact: 'High', effort: 'Low', status: 'Pending' },
                    { priority: 2, action: 'Schedule preventive maintenance for Cold Storage WH-DEL', impact: 'High', effort: 'Medium', status: 'In Progress' },
                    { priority: 3, action: 'Consolidate Night Shift across underutilized warehouses', impact: 'Medium', effort: 'High', status: 'Pending' },
                    { priority: 4, action: 'Add temporary staffing for W3-W5 peak demand window', impact: 'High', effort: 'Medium', status: 'Scheduled' },
                    { priority: 5, action: 'Install OEE monitoring sensors on Quality Check work centers', impact: 'Medium', effort: 'High', status: 'Pending' },
                  ].map(rec => (
                    <div key={rec.priority} className="cap-rec-row flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      <span className="cap-rec-priority flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 flex items-center justify-center text-xs font-bold">
                        {rec.priority}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{rec.action}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs h-5 ${rec.impact === 'High' ? 'border-red-300 text-red-600' : 'border-amber-300 text-amber-600'}`}>
                            Impact: {rec.impact}
                          </Badge>
                          <Badge variant="outline" className={`text-xs h-5 ${rec.effort === 'High' ? 'border-purple-300 text-purple-600' : rec.effort === 'Medium' ? 'border-amber-300 text-amber-600' : 'border-emerald-300 text-emerald-600'}`}>
                            Effort: {rec.effort}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="secondary" className={`text-xs h-5 ${rec.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : rec.status === 'Scheduled' ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-600'}`}>
                        {rec.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Work Center Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto cap-detail-sheet">
          {selectedWC && (
            <>
              <SheetHeader className="cap-detail-header bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 -mx-6 -mt-6 rounded-b-2xl">
                <SheetTitle className="text-white flex items-center gap-3">
                  <span className="text-2xl">{WC_TYPE_ICONS[selectedWC.type]}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      {selectedWC.id}
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white`}>
                        {STATUS_CONFIG[selectedWC.status].label}
                      </span>
                    </div>
                    <div className="text-sm text-teal-100">{selectedWC.name} · {selectedWC.type}</div>
                  </div>
                </SheetTitle>
                <SheetDescription className="text-teal-100">{selectedWC.warehouse}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Metadata Grid */}
                <div className="cap-detail-meta grid grid-cols-3 gap-3">
                  {[
                    { label: 'Type', value: selectedWC.type },
                    { label: 'Warehouse', value: selectedWC.warehouseCode },
                    { label: 'Capacity/hr', value: selectedWC.capacityPerHour.toLocaleString('en-IN') },
                    { label: 'Supervisor', value: selectedWC.supervisor },
                    { label: 'Equipment', value: `${selectedWC.equipmentCount} units` },
                    { label: 'Last Maint.', value: selectedWC.lastMaintenance },
                    { label: 'Eff. Target', value: `${(selectedWC.efficiencyTarget * 100).toFixed(0)}%` },
                    { label: 'OEE Target', value: `${(selectedWC.oeeTarget * 100).toFixed(0)}%` },
                    { label: 'Since', value: selectedWC.sinceDate },
                  ].map(meta => (
                    <div key={meta.label} className="cap-meta-cell p-2 rounded-lg bg-muted/50 border border-border/50">
                      <div className="text-xs text-muted-foreground">{meta.label}</div>
                      <div className="text-sm font-medium mt-0.5">{meta.value}</div>
                    </div>
                  ))}
                </div>

                {/* Performance Tiles */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Availability', value: selectedWC.availability, color: 'from-teal-500 to-teal-600' },
                    { label: 'Performance', value: selectedWC.performance, color: 'from-cyan-500 to-cyan-600' },
                    { label: 'Quality', value: selectedWC.quality, color: 'from-emerald-500 to-emerald-600' },
                    { label: 'OEE', value: selectedWC.oee, color: 'from-violet-500 to-violet-600' },
                  ].map(tile => (
                    <div key={tile.label} className={`cap-perf-tile rounded-xl bg-gradient-to-br ${tile.color} p-3 text-white`}>
                      <div className="text-xs text-white/80">{tile.label}</div>
                      <div className="text-xl font-bold tabular-nums mt-1">{(tile.value * 100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>

                {/* Shift Cards */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Shift Performance</h4>
                  <div className="space-y-2">
                    {selectedWC.shifts.map(sh => (
                      <div key={sh.name} className="cap-shift-detail flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{sh.name}</span>
                          <Badge variant="outline" className="text-xs">{sh.hours}h</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Cap</div>
                            <div className="font-medium tabular-nums">{sh.totalCapacity.toLocaleString('en-IN')}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Planned</div>
                            <div className="font-medium tabular-nums">{sh.plannedUnits.toLocaleString('en-IN')}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Actual</div>
                            <div className="font-medium tabular-nums text-teal-600 dark:text-teal-400">{sh.actualUnits.toLocaleString('en-IN')}</div>
                          </div>
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-teal-500" style={{ width: `${Math.min(100, sh.utilization * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="mt-6">
                <Button variant="outline" onClick={() => setSheetOpen(false)}>Close</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
