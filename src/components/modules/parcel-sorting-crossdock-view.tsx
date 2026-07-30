'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  GitFork, Zap, Package, AlertTriangle, CheckCircle2, XCircle,
  Thermometer, Activity, MapPin, Clock, BarChart3, TrendingUp, TrendingDown,
  Eye, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Wrench, Play, Pause, RefreshCw, Filter,
  Signal, Gauge, Cpu, ArrowUpDown,
  Box, Warehouse, Truck, Timer, ScanBarcode,
  ArrowRightLeft, Split, Merge, Network, Shuffle, Route, Inbox, Send
} from 'lucide-react'
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, BarChart
} from 'recharts'

// ============================================================
// TYPES
// ============================================================

interface SortingLane {
  id: string; name: string; type: string;
  hub: string; zone: string;
  status: string; currentParcel: string;
  speed: number; parcelsPerHour: number;
  totalParcels: number; errorRate: number;
  uptime: number; sensorStatus: string;
  conveyorLength: number; sortOrder: number;
  assignedRoute: string;
  todayVolume: number; capacity: number;
}

interface Parcel {
  id: string; awb: string; barcode: string;
  weight: number; dimensions: string;
  sender: string; senderCity: string;
  receiver: string; receiverCity: string;
  courier: string; priority: string;
  status: string; sortLane: string;
  hub: string; dock: string;
  scanned: boolean; fragile: boolean;
  value: number; serviceType: string;
  created: string; sorted: string; dispatched: string | null;
  timeInHub: number;
}

interface CrossDockBatch {
  id: string; inboundTruck: string;
  outboundTruck: string; hub: string;
  totalParcels: number; sortedParcels: number;
  status: string; priority: string;
  startTime: string; endTime: string | null;
  dockIn: string; dockOut: string;
  targetSLA: number; elapsed: number;
  efficiency: number;
}

interface SortAlert {
  id: string; laneId: string; laneName: string;
  type: string; severity: string; message: string;
  timestamp: string; acknowledged: boolean;
  metric: string; value: number; threshold: number;
}

interface Dock {
  id: string; name: string; hub: string;
  type: string; status: string;
  currentTruck: string; parcelsLoaded: number;
  maxCapacity: number; utilization: number;
  avgProcessingTime: number;
}

interface SortingRoute {
  id: string; name: string; destination: string;
  status: string; parcelsInQueue: number;
  nextTruck: string; departure: string;
  priority: string;
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

function generateData() {
  const rng = seededRandom(167167)
  const r = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
  const rf = (min: number, max: number) => +(rng() * (max - min) + min).toFixed(1)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)]

  const hubs = ['HUB-Mumbai-01','HUB-Delhi-02','HUB-Bengaluru-03','HUB-Chennai-04','HUB-Hyderabad-05','HUB-Pune-06','HUB-Kolkata-07','HUB-Jaipur-08']
  const zones = ['Zone-A','Zone-B','Zone-C','Zone-D']
  const cities = ['Mumbai','Delhi','Bengaluru','Chennai','Hyderabad','Pune','Kolkata','Jaipur','Lucknow','Ahmedabad','Indore','Bhopal','Patna','Chandigarh','Coimbatore','Kochi']
  const laneTypes = ['Linear Sorter','Tilt Tray','Cross Belt','Bombay Sorter','Shoe Sorter','Pusher Sorter']
  const statuses = ['active','idle','maintenance','error','changeover']
  const parcelStatuses = ['received','scanning','sorting','sorted','staged','dispatched','exception']
  const priorities = ['express','priority','standard','economy']
  const serviceTypes = ['Same Day','Next Day','Express','Standard','COD','Surface','Air']
  const couriers = ['Delhivery','DTDC','BlueDart','XpressBees','Ecom Express','Shadowfax','Spoton','Amazon Transport']
  const alertTypes = ['Jam Detected','Sensor Fault','Conveyor Overload','Barcode Mismatch','Weight Limit','Speed Drift','Temperature High','Sort Error Burst','Missed Scan','Lane Blockage']
  const severities = ['critical','warning','info']
  const dockTypes = ['inbound','outbound','cross-dock']
  const batchStatuses = ['in_progress','completed','pending','failed']
  const dockNames = ['Dk-A1','Dk-A2','Dk-A3','Dk-B1','Dk-B2','Dk-B3','Dk-C1','Dk-C2','Dk-C3','Dk-D1','Dk-D2']
  const routes = ['North Express','South Corridor','West Link','East Route','Central Hub','Metro Express','Highway Direct','Last Mile Link']

  // Generate 30 sorting lanes
  const lanes: SortingLane[] = Array.from({ length: 30 }, (_, i) => {
    const st = pick(statuses)
    return {
      id: `LN-${String(i + 1).padStart(3, '0')}`,
      name: `Lane ${String.fromCharCode(65 + (i % 6))}${String(Math.floor(i / 6) + 1)}`,
      type: pick(laneTypes),
      hub: pick(hubs),
      zone: pick(zones),
      status: st,
      currentParcel: st === 'active' ? `PCL-${String(r(1000, 9999))}` : '—',
      speed: st === 'active' ? rf(1.5, 4.0) : 0,
      parcelsPerHour: st === 'active' ? r(200, 800) : r(0, 50),
      totalParcels: r(5000, 45000),
      errorRate: rf(0.1, 3.5),
      uptime: rf(85, 99.9),
      sensorStatus: st === 'error' && rng() > 0.5 ? 'fault' : 'ok',
      conveyorLength: rf(8, 30),
      sortOrder: i + 1,
      assignedRoute: pick(routes),
      todayVolume: r(500, 5000),
      capacity: r(3000, 8000),
    }
  })

  // Generate 500 parcels
  const parcels: Parcel[] = Array.from({ length: 500 }, (_, i) => {
    const st = pick(parcelStatuses)
    const hub = pick(hubs)
    return {
      id: `PCL-${String(i + 1000).padStart(5, '0')}`,
      awb: `${String(r(100000000, 999999999))}`,
      barcode: `490${String(r(10000000, 99999999))}`,
      weight: rf(0.1, 30),
      dimensions: `${r(5,60)}x${r(5,40)}x${r(2,30)}`,
      sender: `Customer-${r(100,999)}`[0],
      senderCity: pick(cities),
      receiver: `Customer-${r(100,999)}`,
      receiverCity: pick(cities),
      courier: pick(couriers),
      priority: pick(priorities),
      status: st,
      sortLane: pick(lanes.slice(0, 12)).name,
      hub,
      dock: pick(dockNames),
      scanned: st !== 'received' && st !== 'exception',
      fragile: rng() > 0.85,
      value: r(100, 50000),
      serviceType: pick(serviceTypes),
      created: `${r(1,48)}h ago`,
      sorted: st !== 'received' && st !== 'scanning' ? `${r(1,24)}h ago` : '—',
      dispatched: st === 'dispatched' ? `${r(0,8)}h ago` : null,
      timeInHub: rf(5, 180),
    }
  })

  // Generate 40 cross-dock batches
  const batches: CrossDockBatch[] = Array.from({ length: 40 }, (_, i) => {
    const st = pick(batchStatuses)
    const tp = r(20, 120)
    const sorted = st === 'completed' ? tp : st === 'in_progress' ? r(5, tp) : 0
    return {
      id: `XDB-${String(i + 1).padStart(4, '0')}`,
      inboundTruck: `TRK-${String(r(100, 999)).padStart(3, '0')}-IN`,
      outboundTruck: `TRK-${String(r(100, 999)).padStart(3, '0')}-OUT`,
      hub: pick(hubs),
      totalParcels: tp,
      sortedParcels: sorted,
      status: st,
      priority: pick(['critical','high','normal','low']),
      startTime: `${r(1,12)}h ago`,
      endTime: st === 'completed' || st === 'failed' ? `${r(0,5)}h ago` : null,
      dockIn: pick(dockNames.slice(0, 5)),
      dockOut: pick(dockNames.slice(5)),
      targetSLA: rf(30, 120),
      elapsed: st === 'in_progress' ? rf(10, 90) : st === 'completed' ? rf(20, 100) : 0,
      efficiency: st === 'completed' ? rf(70, 99) : st === 'in_progress' ? rf(40, 80) : 0,
    }
  })

  // Generate 15 alerts
  const alerts: SortAlert[] = Array.from({ length: 15 }, (_, i) => {
    const lane = pick(lanes)
    const sev = pick(severities)
    return {
      id: `SA-${String(i + 1).padStart(4, '0')}`,
      laneId: lane.id,
      laneName: lane.name,
      type: pick(alertTypes),
      severity: sev,
      message: `${pick(alertTypes)} on ${lane.name} at ${lane.hub.replace('HUB-', '')}`,
      timestamp: `${r(1,48)}h ago`,
      acknowledged: rng() > 0.6,
      metric: pick(['Speed','Error Rate','Temperature','Throughput','Sensor']),
      value: rf(10, 95),
      threshold: rf(60, 90),
    }
  })

  // Generate 20 docks
  const docks: Dock[] = Array.from({ length: 20 }, (_, i) => {
    const dt = i < 7 ? 'inbound' : i < 14 ? 'outbound' : 'cross-dock'
    const loaded = r(20, 300)
    const mx = r(200, 500)
    return {
      id: `DK-${String(i + 1).padStart(3, '0')}`,
      name: dockNames[i] || `Dk-E${i - 10}`,
      hub: pick(hubs),
      type: dt,
      status: pick(['active','active','active','idle','maintenance']),
      currentTruck: `TRK-${String(r(100, 999)).padStart(3, '0')}`,
      parcelsLoaded: loaded,
      maxCapacity: mx,
      utilization: +((loaded / mx) * 100).toFixed(1),
      avgProcessingTime: rf(2, 15),
    }
  })

  // Generate 12 sorting routes
  const sortingRoutes: SortingRoute[] = routes.slice(0, 12).map((name, i) => ({
    id: `RT-${String(i + 1).padStart(2, '0')}`,
    name,
    destination: pick(cities),
    status: pick(['active','active','active','congested','paused']),
    parcelsInQueue: r(10, 200),
    nextTruck: `TRK-${String(r(100, 999)).padStart(3, '0')}`[0],
    departure: `${r(15, 240)} min`,
    priority: pick(['high','normal','normal','low']),
  }))

  // KPIs
  const activeLanes = lanes.filter(l => l.status === 'active').length
  const totalParcelsToday = parcels.length
  const sortedToday = parcels.filter(p => p.status === 'sorted' || p.status === 'staged' || p.status === 'dispatched').length
  const avgSortSpeed = +(lanes.filter(l => l.status === 'active').reduce((s, l) => s + l.parcelsPerHour, 0) / Math.max(activeLanes, 1)).toFixed(0)
  const exceptionCount = parcels.filter(p => p.status === 'exception').length
  const crossDockEfficiency = +(batches.filter(b => b.status === 'completed').reduce((s, b) => s + b.efficiency, 0) / Math.max(batches.filter(b => b.status === 'completed').length, 1)).toFixed(1)

  // Hourly data (24h)
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    inbound: r(50, 300),
    sorted: r(40, 280),
    dispatched: r(30, 250),
    exceptions: r(2, 20),
    throughput: r(150, 800),
  }))

  // Lane type distribution
  const typeCounts: Record<string, number> = {}
  lanes.forEach(l => { typeCounts[l.type] = (typeCounts[l.type] || 0) + 1 })
  const typePieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }))

  // Status distribution
  const statusDist = statuses.map(s => ({ status: s, count: lanes.filter(l => l.status === s).length }))

  // Hub performance radar
  const hubRadar = hubs.slice(0, 6).map(h => {
    const hLanes = lanes.filter(l => l.hub === h)
    const hParcels = parcels.filter(p => p.hub === h)
    return {
      hub: h.replace('HUB-', '').replace('-0', ' #'),
      throughput: +((hParcels.length / Math.max(hLanes.length, 1))).toFixed(0),
      efficiency: +((hLanes.reduce((s, l) => s + l.uptime, 0) / Math.max(hLanes.length, 1))).toFixed(0),
      lanes: hLanes.filter(l => l.status === 'active').length,
      speed: +((hLanes.filter(l => l.status === 'active').reduce((s, l) => s + l.speed, 0) / Math.max(hLanes.filter(l => l.status === 'active').length, 1))).toFixed(1),
    }
  })

  // Courier volume breakdown
  const courierVolume: Record<string, number> = {}
  parcels.forEach(p => { courierVolume[p.courier] = (courierVolume[p.courier] || 0) + 1 })
  const courierChartData = Object.entries(courierVolume).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)

  return {
    lanes, parcels, batches, alerts, docks, sortingRoutes,
    hourlyData, typePieData, statusDist, hubRadar, courierChartData,
    activeLanes, totalParcelsToday, sortedToday, avgSortSpeed, exceptionCount, crossDockEfficiency,
    statuses, priorities, parcelStatuses, serviceTypes, couriers, hubs,
    dockTypes: dockTypes, dockNames,
  }
}


const COLORS = ['#ec4899', '#06b6d4', '#8b5cf6', '#22c55e', '#f97316', '#ef4444']
const THEME = { primary: '#ec4899', secondary: '#06b6d4', accent: '#8b5cf6', success: '#22c55e', danger: '#ef4444', warning: '#f97316' }

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`
  return `₹${num.toLocaleString('en-IN')}`
}

export default function ParcelSortingCrossDockView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [selectedLane, setSelectedLane] = useState<SortingLane | null>(null)
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<CrossDockBatch | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [courierFilter, setCourierFilter] = useState('all')
  const [sortField, setSortField] = useState<string>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [parcelPage, setParcelPage] = useState(1)
  const rowsPerPage = 15

  const [currentTime, setCurrentTime] = useState('')
  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }))
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  // Filtered lanes
  const filteredLanes = useMemo(() => {
    let list = data.lanes.filter(l => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false
      if (typeFilter !== 'all' && l.type !== typeFilter) return false
      if (searchQuery && !l.id.toLowerCase().includes(searchQuery.toLowerCase()) && !l.name.toLowerCase().includes(searchQuery.toLowerCase()) && !l.hub.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    list.sort((a, b) => {
      const aVal = (a as any)[sortField]; const bVal = (b as any)[sortField]
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
    return list
  }, [data, statusFilter, typeFilter, searchQuery, sortField, sortDir])

  // Filtered parcels
  const filteredParcels = useMemo(() => {
    return data.parcels.filter(p => {
      if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false
      if (courierFilter !== 'all' && p.courier !== courierFilter) return false
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (searchQuery && !p.id.includes(searchQuery) && !p.awb.includes(searchQuery) && !p.courier.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [data, priorityFilter, courierFilter, statusFilter, searchQuery])

  const paginatedLanes = filteredLanes.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  const paginatedParcels = filteredParcels.slice((parcelPage - 1) * rowsPerPage, parcelPage * rowsPerPage)
  const totalPages = Math.ceil(filteredLanes.length / rowsPerPage)
  const totalParcelPages = Math.ceil(filteredParcels.length / rowsPerPage)

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const tabs = ['Dashboard', 'Sorting Lanes', 'Parcel Tracker', 'Cross-Dock Ops', 'Routes & Alerts']

  const statusColor = (s: string) => {
    const map: Record<string, string> = { active: '#22c55e', idle: '#6b7280', maintenance: '#f59e0b', error: '#ef4444', changeover: '#8b5cf6', received: '#06b6d4', scanning: '#f97316', sorting: '#8b5cf6', sorted: '#22c55e', staged: '#06b6d4', dispatched: '#10b981', exception: '#ef4444', in_progress: '#f97316', completed: '#22c55e', pending: '#6b7280', failed: '#ef4444', congested: '#f97316', paused: '#6b7280', express: '#ef4444', priority: '#f97316', standard: '#06b6d4', economy: '#6b7280', critical: '#ef4444', high: '#f97316', normal: '#06b6d4', low: '#6b7280', online: '#22c55e' }
    return map[s] || '#6b7280'
  }

  const priorityBadge = (p: string) => {
    const c: Record<string, string> = { express: '#ef4444', priority: '#f97316', standard: '#06b6d4', economy: '#6b7280' }
    return c[p] || '#6b7280'
  }

  const renderDashboard = () => (
    <div className='psd-tab-content'>
      <div className='psd-clock-row'>
        <GitFork size={18} style={{ color: THEME.primary }} />
        <span className='psd-live-dot' />
        <span className='psd-clock-text'>Live — {currentTime} IST</span>
      </div>

      {/* KPIs */}
      <div className='psd-kpi-grid'>
        <div className='psd-kpi-card' style={{ borderTopColor: '#22c55e' }}>
          <div className='psd-kpi-icon' style={{ background: '#22c55e15', color: '#22c55e' }}><GitFork size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.activeLanes}</span>
            <span className='psd-kpi-label'>Active Lanes</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: THEME.primary }}>
          <div className='psd-kpi-icon' style={{ background: '#ec489915', color: THEME.primary }}><Package size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.totalParcelsToday}</span>
            <span className='psd-kpi-label'>Total Parcels</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: THEME.secondary }}>
          <div className='psd-kpi-icon' style={{ background: '#06b6d415', color: THEME.secondary }}><Shuffle size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.sortedToday}</span>
            <span className='psd-kpi-label'>Sorted Today</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: THEME.accent }}>
          <div className='psd-kpi-icon' style={{ background: '#8b5cf615', color: THEME.accent }}><Gauge size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.avgSortSpeed}/hr</span>
            <span className='psd-kpi-label'>Avg Sort Speed</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: THEME.warning }}>
          <div className='psd-kpi-icon' style={{ background: '#f9731615', color: THEME.warning }}><ArrowRightLeft size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.crossDockEfficiency}%</span>
            <span className='psd-kpi-label'>Cross-Dock Eff</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: THEME.danger }}>
          <div className='psd-kpi-icon' style={{ background: '#ef444415', color: THEME.danger }}><AlertTriangle size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.exceptionCount}</span>
            <span className='psd-kpi-label'>Exceptions</span>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className='psd-charts-row'>
        <div className='psd-chart-card psd-chart-wide'>
          <div className='psd-chart-header'><h4 className='psd-chart-title'>24h Parcel Flow (Inbound / Sorted / Dispatched)</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <ComposedChart data={data.hourlyData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#1e293b' />
              <XAxis dataKey='hour' stroke='#64748b' tick={{ fontSize: 10 }} interval={2} />
              <YAxis stroke='#64748b' tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey='inbound' fill='#06b6d4' radius={[4, 4, 0, 0]} name='Inbound' />
              <Bar dataKey='sorted' fill='#8b5cf6' radius={[4, 4, 0, 0]} name='Sorted' />
              <Bar dataKey='dispatched' fill='#22c55e' radius={[4, 4, 0, 0]} name='Dispatched' />
              <Line dataKey='exceptions' stroke='#ef4444' strokeWidth={2} dot={false} name='Exceptions' />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className='psd-chart-card'>
          <div className='psd-chart-header'><h4 className='psd-chart-title'>Lane Type Distribution</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <PieChart>
              <Pie data={data.typePieData} cx='50%' cy='50%' outerRadius={80} innerRadius={45} dataKey='value' label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#475569' }}>
                {data.typePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className='psd-charts-row'>
        <div className='psd-chart-card'>
          <div className='psd-chart-header'><h4 className='psd-chart-title'>Hub Performance Radar</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <RadarChart data={data.hubRadar}>
              <PolarGrid stroke='#334155' />
              <PolarAngleAxis dataKey='hub' stroke='#94a3b8' tick={{ fontSize: 10 }} />
              <PolarRadiusAxis stroke='#475569' tick={{ fontSize: 9 }} />
              <Radar name='Throughput' dataKey='throughput' stroke='#ec4899' fill='#ec489930' strokeWidth={2} />
              <Radar name='Efficiency' dataKey='efficiency' stroke='#06b6d4' fill='#06b6d430' strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className='psd-chart-card'>
          <div className='psd-chart-header'><h4 className='psd-chart-title'>Courier Volume</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <BarChart data={data.courierChartData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#1e293b' />
              <XAxis dataKey='name' stroke='#64748b' tick={{ fontSize: 9 }} angle={-25} textAnchor='end' height={55} />
              <YAxis stroke='#64748b' tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey='count' radius={[6, 6, 0, 0]}>
                {data.courierChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dock status grid */}
      <div className='psd-chart-card psd-chart-full'>
        <div className='psd-chart-header'><h4 className='psd-chart-title'>Dock Status Overview ({data.docks.length} Docks)</h4></div>
        <div className='psd-dock-visual-grid'>
          {data.docks.map(dk => {
            const utilColor = dk.utilization > 85 ? '#ef4444' : dk.utilization > 60 ? '#f59e0b' : '#22c55e'
            return (
              <div key={dk.id} className='psd-dock-cell' style={{ borderLeftColor: dk.type === 'inbound' ? '#06b6d4' : dk.type === 'outbound' ? '#22c55e' : '#8b5cf6' }}>
                <div className='psd-dock-name'>{dk.name}</div>
                <div className='psd-dock-type-badge' style={{ background: `${dk.type === 'inbound' ? '#06b6d4' : dk.type === 'outbound' ? '#22c55e' : '#8b5cf6'}20`, color: dk.type === 'inbound' ? '#06b6d4' : dk.type === 'outbound' ? '#22c55e' : '#8b5cf6' }}>{dk.type}</div>
                <div className='psd-dock-util-bar-track'><div className='psd-dock-util-bar-fill' style={{ width: `${dk.utilization}%`, background: utilColor }} /></div>
                <span className='psd-dock-util-text'>{dk.utilization}% ({dk.parcelsLoaded}/{dk.maxCapacity})</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderLanes = () => (
    <div className='psd-tab-content'>
      <div className='psd-filter-row'>
        <div className='psd-search-box'>
          <input type='text' placeholder='Search lane ID, name, hub...' value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} className='psd-search-input' />
        </div>
        <div className='psd-filter-pills'>
          <button className={`psd-pill ${statusFilter === 'all' ? 'psd-pill-active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
          {data.statuses.map(s => (
            <button key={s} className={`psd-pill ${statusFilter === s ? 'psd-pill-active' : ''}`} style={statusFilter === s ? { background: statusColor(s), borderColor: statusColor(s) } : {}} onClick={() => setStatusFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className='psd-fleet-stats'>
        <span>Total: <b>{filteredLanes.length}</b></span>
        <span>Active: <b>{filteredLanes.filter(l => l.status === 'active').length}</b></span>
        <span>Page {currentPage}/{totalPages}</span>
      </div>

      <div className='psd-table-wrapper'>
        <table className='psd-table'>
          <thead>
            <tr>
              <th onClick={() => toggleSort('id')} className='psd-th-sortable'>Lane {sortField === 'id' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</th>
              <th>Type</th>
              <th>Status</th>
              <th onClick={() => toggleSort('speed')} className='psd-th-sortable'>Speed {sortField === 'speed' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</th>
              <th onClick={() => toggleSort('parcelsPerHour')} className='psd-th-sortable'>Parcels/hr {sortField === 'parcelsPerHour' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</th>
              <th>Volume/Capacity</th>
              <th>Error Rate</th>
              <th>Uptime</th>
              <th>Route</th>
              <th>Hub</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLanes.map(lane => (
              <tr key={lane.id} className='psd-table-row' style={{ borderLeftColor: statusColor(lane.status) }}>
                <td className='psd-td-id'><GitFork size={14} style={{ color: THEME.primary, marginRight: 6 }} />{lane.id}</td>
                <td><span className='psd-type-badge'>{lane.type}</span></td>
                <td><span className='psd-status-badge' style={{ background: `${statusColor(lane.status)}20`, color: statusColor(lane.status) }}>{lane.status}</span></td>
                <td>{lane.speed > 0 ? `${lane.speed} m/s` : '—'}</td>
                <td style={{ fontWeight: 600 }}>{lane.parcelsPerHour}</td>
                <td>
                  <div className='psd-bar-cell'>
                    <div className='psd-bar-track'><div className='psd-bar-fill' style={{ width: `${(lane.todayVolume / lane.capacity) * 100}%`, background: (lane.todayVolume / lane.capacity) > 0.85 ? '#ef4444' : '#ec4899' }} /></div>
                    <span className='psd-bar-text'>{lane.todayVolume}/{lane.capacity}</span>
                  </div>
                </td>
                <td style={{ color: lane.errorRate > 2 ? '#ef4444' : '#22c55e' }}>{lane.errorRate}%</td>
                <td style={{ color: lane.uptime > 95 ? '#22c55e' : lane.uptime > 85 ? '#f59e0b' : '#ef4444' }}>{lane.uptime}%</td>
                <td style={{ fontSize: 11 }}>{lane.assignedRoute}</td>
                <td style={{ fontSize: 11 }}>{lane.hub.replace('HUB-', '')}</td>
                <td><button className='psd-view-btn' onClick={() => setSelectedLane(lane)}><Eye size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='psd-pagination'>
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className='psd-page-btn'><ChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => <button key={i} className={`psd-page-btn ${currentPage === i + 1 ? 'psd-page-active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>)}
        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className='psd-page-btn'><ChevronRight size={16} /></button>
      </div>
    </div>
  )

  const renderParcels = () => (
    <div className='psd-tab-content'>
      <div className='psd-filter-row'>
        <div className='psd-search-box'>
          <input type='text' placeholder='Search parcel ID, AWB, courier...' value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setParcelPage(1) }} className='psd-search-input' />
        </div>
        <div className='psd-filter-pills'>
          <button className={`psd-pill ${priorityFilter === 'all' ? 'psd-pill-active' : ''}`} onClick={() => setPriorityFilter('all')}>All</button>
          {data.priorities.map(p => (
            <button key={p} className={`psd-pill ${priorityFilter === p ? 'psd-pill-active' : ''}`} style={priorityFilter === p ? { background: priorityBadge(p), borderColor: priorityBadge(p) } : {}} onClick={() => setPriorityFilter(p)}>{p}</button>
          ))}
        </div>
        <div className='psd-filter-pills'>
          <button className={`psd-pill ${courierFilter === 'all' ? 'psd-pill-active' : ''}`} onClick={() => setCourierFilter('all')}>All Couriers</button>
          {data.couriers.slice(0, 5).map(c => (
            <button key={c} className={`psd-pill ${courierFilter === c ? 'psd-pill-active' : ''}`} onClick={() => setCourierFilter(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className='psd-fleet-stats'>
        <span>Total: <b>{filteredParcels.length}</b></span>
        <span>Sorted: <b>{filteredParcels.filter(p => p.status === 'sorted').length}</b></span>
        <span>Dispatched: <b>{filteredParcels.filter(p => p.status === 'dispatched').length}</b></span>
        <span>Exceptions: <b>{filteredParcels.filter(p => p.status === 'exception').length}</b></span>
      </div>

      <div className='psd-table-wrapper'>
        <table className='psd-table'>
          <thead>
            <tr>
              <th>Parcel ID</th>
              <th>AWB</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Courier</th>
              <th>Service</th>
              <th>Weight</th>
              <th>Route</th>
              <th>Lane</th>
              <th>Value</th>
              <th>Time in Hub</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedParcels.map(p => (
              <tr key={p.id} className='psd-table-row' style={{ borderLeftColor: statusColor(p.status) }}>
                <td className='psd-td-id'>{p.id}</td>
                <td style={{ fontSize: 11, fontFamily: 'monospace' }}>{p.awb}</td>
                <td><span className='psd-status-badge' style={{ background: `${priorityBadge(p.priority)}20`, color: priorityBadge(p.priority) }}>{p.priority}</span></td>
                <td><span className='psd-status-badge' style={{ background: `${statusColor(p.status)}20`, color: statusColor(p.status) }}>{p.status}</span></td>
                <td style={{ fontSize: 11 }}>{p.courier}</td>
                <td><span className='psd-type-badge'>{p.serviceType}</span></td>
                <td>{p.weight} kg</td>
                <td style={{ fontSize: 11 }}>{p.senderCity} → {p.receiverCity}</td>
                <td style={{ fontSize: 11 }}>{p.sortLane}</td>
                <td style={{ fontSize: 11 }}>{formatINR(p.value)}</td>
                <td style={{ fontSize: 11 }}>{p.timeInHub} min</td>
                <td><button className='psd-view-btn' onClick={() => setSelectedParcel(p)}><Eye size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='psd-pagination'>
        <button disabled={parcelPage <= 1} onClick={() => setParcelPage(p => p - 1)} className='psd-page-btn'><ChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(totalParcelPages, 8) }, (_, i) => <button key={i} className={`psd-page-btn ${parcelPage === i + 1 ? 'psd-page-active' : ''}`} onClick={() => setParcelPage(i + 1)}>{i + 1}</button>)}
        <button disabled={parcelPage >= totalParcelPages} onClick={() => setParcelPage(p => p + 1)} className='psd-page-btn'><ChevronRight size={16} /></button>
      </div>
    </div>
  )

  const renderCrossDock = () => (
    <div className='psd-tab-content'>
      <div className='psd-kpi-grid'>
        <div className='psd-kpi-card' style={{ borderTopColor: '#f97316' }}>
          <div className='psd-kpi-icon' style={{ background: '#f9731615', color: '#f97316' }}><ArrowRightLeft size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.batches.length}</span>
            <span className='psd-kpi-label'>Total Batches</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: '#06b6d4' }}>
          <div className='psd-kpi-icon' style={{ background: '#06b6d415', color: '#06b6d4' }}><Play size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.batches.filter(b => b.status === 'in_progress').length}</span>
            <span className='psd-kpi-label'>In Progress</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: '#22c55e' }}>
          <div className='psd-kpi-icon' style={{ background: '#22c55e15', color: '#22c55e' }}><CheckCircle2 size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.batches.filter(b => b.status === 'completed').length}</span>
            <span className='psd-kpi-label'>Completed</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: '#ef4444' }}>
          <div className='psd-kpi-icon' style={{ background: '#ef444415', color: '#ef4444' }}><XCircle size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.batches.filter(b => b.status === 'failed').length}</span>
            <span className='psd-kpi-label'>Failed</span>
          </div>
        </div>
      </div>

      <div className='psd-xd-grid'>
        {data.batches.map(batch => {
          const progress = batch.totalParcels > 0 ? (batch.sortedParcels / batch.totalParcels) * 100 : 0
          const slaProgress = batch.targetSLA > 0 ? (batch.elapsed / batch.targetSLA) * 100 : 0
          return (
            <div key={batch.id} className='psd-xd-card' style={{ borderColor: statusColor(batch.status) }}>
              <div className='psd-xd-header'>
                <span className='psd-xd-id'>{batch.id}</span>
                <span className='psd-xd-status' style={{ background: `${statusColor(batch.status)}20`, color: statusColor(batch.status) }}>{batch.status}</span>
                <span className='psd-xd-priority' style={{ color: priorityBadge(batch.priority) }}>{batch.priority}</span>
              </div>
              <div className='psd-xd-route'>
                <Inbox size={12} style={{ color: '#06b6d4' }} /><span>{batch.inboundTruck}</span>
                <ArrowRightLeft size={12} style={{ color: THEME.primary, margin: '0 4px' }} />
                <Send size={12} style={{ color: '#22c55e' }} /><span>{batch.outboundTruck}</span>
              </div>
              <div className='psd-xd-docks'>{batch.dockIn} → {batch.dockOut}</div>
              <div className='psd-xd-progress-section'>
                <div className='psd-xd-progress-label'>Sort Progress</div>
                <div className='psd-xd-progress-track'><div className='psd-xd-progress-fill' style={{ width: `${progress}%`, background: '#ec4899' }} /></div>
                <span className='psd-xd-progress-text'>{batch.sortedParcels}/{batch.totalParcels} ({Math.round(progress)}%)</span>
              </div>
              <div className='psd-xd-progress-section'>
                <div className='psd-xd-progress-label'>SLA ({batch.targetSLA} min)</div>
                <div className='psd-xd-progress-track'><div className='psd-xd-progress-fill' style={{ width: `${Math.min(slaProgress, 100)}%`, background: slaProgress > 80 ? '#ef4444' : '#06b6d4' }} /></div>
                <span className='psd-xd-progress-text'>{batch.elapsed}/{batch.targetSLA} min</span>
              </div>
              <div className='psd-xd-footer'>
                <span>{batch.hub.replace('HUB-', '')}</span>
                {batch.efficiency > 0 && <span>Eff: {batch.efficiency}%</span>}
              </div>
              <button className='psd-card-action-btn' onClick={() => setSelectedBatch(batch)}><Eye size={14} /> View Details</button>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderRoutesAlerts = () => (
    <div className='psd-tab-content'>
      <div className='psd-section-header'>
        <Route size={18} style={{ color: THEME.primary }} />
        <h3 className='psd-section-title'>Sorting Routes ({data.sortingRoutes.length})</h3>
      </div>
      <div className='psd-route-grid'>
        {data.sortingRoutes.map(rt => (
          <div key={rt.id} className='psd-route-card' style={{ borderLeftColor: statusColor(rt.status) }}>
            <div className='psd-route-name'>{rt.name}</div>
            <div className='psd-route-meta'>
              <span className='psd-route-status' style={{ background: `${statusColor(rt.status)}20`, color: statusColor(rt.status) }}>{rt.status}</span>
              <span className='psd-route-detail'>→ {rt.destination}</span>
              <span className='psd-route-detail'>{rt.parcelsInQueue} parcels</span>
              <span className='psd-route-detail'>Departs: {rt.departure}</span>
            </div>
          </div>
        ))}
      </div>

      <div className='psd-section-header' style={{ marginTop: 24 }}>
        <AlertTriangle size={18} style={{ color: THEME.danger }} />
        <h3 className='psd-section-title'>Sorting Alerts & Diagnostics</h3>
      </div>
      <div className='psd-kpi-grid'>
        <div className='psd-kpi-card' style={{ borderTopColor: '#ef4444' }}>
          <div className='psd-kpi-icon' style={{ background: '#ef444415', color: '#ef4444' }}><XCircle size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length}</span>
            <span className='psd-kpi-label'>Critical Unack</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: '#f59e0b' }}>
          <div className='psd-kpi-icon' style={{ background: '#f59e0b15', color: '#f59e0b' }}><AlertTriangle size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.alerts.filter(a => a.severity === 'warning').length}</span>
            <span className='psd-kpi-label'>Warnings</span>
          </div>
        </div>
        <div className='psd-kpi-card' style={{ borderTopColor: '#22c55e' }}>
          <div className='psd-kpi-icon' style={{ background: '#22c55e15', color: '#22c55e' }}><CheckCircle2 size={20} /></div>
          <div className='psd-kpi-body'>
            <span className='psd-kpi-value'>{data.alerts.filter(a => a.acknowledged).length}/{data.alerts.length}</span>
            <span className='psd-kpi-label'>Acknowledged</span>
          </div>
        </div>
      </div>
      <div className='psd-alert-list'>
        {data.alerts.map(alert => {
          const sevColor = alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#f59e0b' : '#06b6d4'
          return (
            <div key={alert.id} className='psd-alert-row' style={{ borderLeftColor: sevColor }}>
              <div className='psd-alert-icon' style={{ background: `${sevColor}20`, color: sevColor }}>
                {alert.severity === 'critical' ? <XCircle size={16} /> : alert.severity === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div className='psd-alert-body'>
                <div className='psd-alert-title'>{alert.type} — {alert.laneName}</div>
                <div className='psd-alert-msg'>{alert.message}</div>
                <div className='psd-alert-meta'>
                  <span>{alert.timestamp}</span>
                  <span>{alert.metric}: {alert.value} / {alert.threshold}</span>
                  <span className={`psd-alert-ack ${alert.acknowledged ? 'psd-ack-yes' : 'psd-ack-no'}`}>{alert.acknowledged ? 'ACK' : 'PENDING'}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ---- Lane Detail Drawer ----
  const renderLaneDrawer = () => {
    if (!selectedLane) return null
    const l = selectedLane
    const hBg = l.status === 'error' ? 'linear-gradient(135deg, #dc2626, #991b1b)' : l.status === 'active' ? 'linear-gradient(135deg, #ec4899, #be185d)' : l.status === 'maintenance' ? 'linear-gradient(135deg, #f59e0b, #b45309)' : 'linear-gradient(135deg, #6366f1, #4338ca)'
    return (
      <>
      <div className='psd-drawer-overlay' onClick={() => setSelectedLane(null)} />
      <div className='psd-drawer-panel'>
        <div className='psd-drawer-header' style={{ background: hBg }}>
          <div className='psd-drawer-header-top'>
            <div className='psd-drawer-header-info'>
              <GitFork size={24} className='psd-drawer-header-icon' />
              <div>
                <div className='psd-drawer-title'>{l.id}</div>
                <div className='psd-drawer-subtitle'>{l.name} · {l.type}</div>
              </div>
            </div>
            <button className='psd-drawer-close' onClick={() => setSelectedLane(null)}><XCircle size={20} /></button>
          </div>
          <div className='psd-drawer-badges'>
            <span className='psd-drawer-badge' style={{ background: `${statusColor(l.status)}30`, color: '#fff' }}>{l.status}</span>
            <span className='psd-drawer-badge' style={{ background: '#ffffff20', color: '#fff' }}>{l.assignedRoute}</span>
          </div>
        </div>
        <div className='psd-drawer-body'>
          <div className='psd-drawer-grid'>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Hub</span><span className='psd-drawer-value'>{l.hub}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Zone</span><span className='psd-drawer-value'>{l.zone}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Current Parcel</span><span className='psd-drawer-value'>{l.currentParcel}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Conveyor Length</span><span className='psd-drawer-value'>{l.conveyorLength} m</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Sensor Status</span><span className='psd-drawer-value' style={{ color: l.sensorStatus === 'ok' ? '#22c55e' : '#ef4444' }}>{l.sensorStatus.toUpperCase()}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Sort Order</span><span className='psd-drawer-value'>#{l.sortOrder}</span></div>
          </div>
          <div className='psd-drawer-card-row'>
            <div className='psd-drawer-metric-card'>
              <Gauge size={16} style={{ color: THEME.primary }} />
              <span className='psd-drawer-metric-label'>Speed</span>
              <span className='psd-drawer-metric-value'>{l.speed} m/s</span>
              <div className='psd-drawer-metric-bar'><div style={{ width: `${(l.speed / 4) * 100}%`, background: '#ec4899' }} /></div>
            </div>
            <div className='psd-drawer-metric-card'>
              <Activity size={16} style={{ color: '#22c55e' }} />
              <span className='psd-drawer-metric-label'>Throughput</span>
              <span className='psd-drawer-metric-value'>{l.parcelsPerHour}/hr</span>
              <div className='psd-drawer-metric-bar'><div style={{ width: `${(l.parcelsPerHour / 800) * 100}%`, background: '#22c55e' }} /></div>
            </div>
            <div className='psd-drawer-metric-card'>
              <Timer size={16} style={{ color: '#06b6d4' }} />
              <span className='psd-drawer-metric-label'>Uptime</span>
              <span className='psd-drawer-metric-value'>{l.uptime}%</span>
              <div className='psd-drawer-metric-bar'><div style={{ width: `${l.uptime}%`, background: l.uptime > 95 ? '#22c55e' : '#f59e0b' }} /></div>
            </div>
          </div>
          <div className='psd-drawer-section-title'>Performance</div>
          <div className='psd-drawer-grid'>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Total Parcels</span><span className='psd-drawer-value'>{l.totalParcels.toLocaleString()}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Today Volume</span><span className='psd-drawer-value'>{l.todayVolume.toLocaleString()}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Capacity</span><span className='psd-drawer-value'>{l.capacity.toLocaleString()}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Error Rate</span><span className='psd-drawer-value' style={{ color: l.errorRate > 2 ? '#ef4444' : '#22c55e' }}>{l.errorRate}%</span></div>
          </div>
          <div className='psd-drawer-actions'>
            <button className='psd-action-btn psd-action-primary'><Play size={14} /> Start Lane</button>
            <button className='psd-action-btn psd-action-secondary'><Pause size={14} /> Pause</button>
            <button className='psd-action-btn psd-action-secondary'><Wrench size={14} /> Maintenance</button>
            <button className='psd-action-btn psd-action-ghost'><RefreshCw size={14} /> Calibrate</button>
          </div>
        </div>
      </div>
      </>
    )
  }

  // ---- Parcel Detail Drawer ----
  const renderParcelDrawer = () => {
    if (!selectedParcel) return null
    const p = selectedParcel
    const hBg = p.status === 'dispatched' ? 'linear-gradient(135deg, #22c55e, #15803d)' : p.status === 'exception' ? 'linear-gradient(135deg, #ef4444, #991b1b)' : p.status === 'sorting' ? 'linear-gradient(135deg, #ec4899, #be185d)' : 'linear-gradient(135deg, #6366f1, #4338ca)'
    return (
      <>
      <div className='psd-drawer-overlay' onClick={() => setSelectedParcel(null)} />
      <div className='psd-drawer-panel'>
        <div className='psd-drawer-header' style={{ background: hBg }}>
          <div className='psd-drawer-header-top'>
            <div className='psd-drawer-header-info'>
              <Package size={24} className='psd-drawer-header-icon' />
              <div>
                <div className='psd-drawer-title'>{p.id}</div>
                <div className='psd-drawer-subtitle'>AWB: {p.awb}</div>
              </div>
            </div>
            <button className='psd-drawer-close' onClick={() => setSelectedParcel(null)}><XCircle size={20} /></button>
          </div>
          <div className='psd-drawer-badges'>
            <span className='psd-drawer-badge' style={{ background: `${statusColor(p.status)}30`, color: '#fff' }}>{p.status}</span>
            <span className='psd-drawer-badge' style={{ background: `${priorityBadge(p.priority)}40`, color: '#fff' }}>{p.priority}</span>
            {p.fragile && <span className='psd-drawer-badge' style={{ background: '#ffffff30', color: '#fff' }}>FRAGILE</span>}
          </div>
        </div>
        <div className='psd-drawer-body'>
          <div className='psd-drawer-grid'>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Courier</span><span className='psd-drawer-value'>{p.courier}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Service</span><span className='psd-drawer-value'>{p.serviceType}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Hub</span><span className='psd-drawer-value'>{p.hub}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Dock</span><span className='psd-drawer-value'>{p.dock}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Sort Lane</span><span className='psd-drawer-value'>{p.sortLane}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Scanned</span><span className='psd-drawer-value' style={{ color: p.scanned ? '#22c55e' : '#ef4444' }}>{p.scanned ? 'YES' : 'NO'}</span></div>
          </div>
          <div className='psd-drawer-section-title'>Dimensions & Weight</div>
          <div className='psd-drawer-grid'>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Weight</span><span className='psd-drawer-value'>{p.weight} kg</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Dimensions</span><span className='psd-drawer-value'>{p.dimensions} cm</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Declared Value</span><span className='psd-drawer-value'>{formatINR(p.value)}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Barcode</span><span className='psd-drawer-value' style={{ fontFamily: 'monospace', fontSize: 11 }}>{p.barcode}</span></div>
          </div>
          <div className='psd-drawer-section-title'>Route</div>
          <div className='psd-drawer-grid'>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>From</span><span className='psd-drawer-value'>{p.senderCity}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>To</span><span className='psd-drawer-value'>{p.receiverCity}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Created</span><span className='psd-drawer-value'>{p.created}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Sorted</span><span className='psd-drawer-value'>{p.sorted}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Dispatched</span><span className='psd-drawer-value'>{p.dispatched || '—'}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Time in Hub</span><span className='psd-drawer-value'>{p.timeInHub} min</span></div>
          </div>
          <div className='psd-drawer-actions'>
            <button className='psd-action-btn psd-action-primary'><ScanBarcode size={14} /> Rescan</button>
            <button className='psd-action-btn psd-action-secondary'><Shuffle size={14} /> Re-sort</button>
            <button className='psd-action-btn psd-action-ghost'><Eye size={14} /> Track</button>
          </div>
        </div>
      </div>
      </>
    )
  }

  // ---- Batch Detail Drawer ----
  const renderBatchDrawer = () => {
    if (!selectedBatch) return null
    const b = selectedBatch
    return (
      <>
      <div className='psd-drawer-overlay' onClick={() => setSelectedBatch(null)} />
      <div className='psd-drawer-panel'>
        <div className='psd-drawer-header' style={{ background: 'linear-gradient(135deg, #f97316, #c2410c)' }}>
          <div className='psd-drawer-header-top'>
            <div className='psd-drawer-header-info'>
              <ArrowRightLeft size={24} className='psd-drawer-header-icon' />
              <div>
                <div className='psd-drawer-title'>{b.id}</div>
                <div className='psd-drawer-subtitle'>{b.status} · Priority: {b.priority}</div>
              </div>
            </div>
            <button className='psd-drawer-close' onClick={() => setSelectedBatch(null)}><XCircle size={20} /></button>
          </div>
        </div>
        <div className='psd-drawer-body'>
          <div className='psd-drawer-grid'>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Hub</span><span className='psd-drawer-value'>{b.hub}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Status</span><span className='psd-drawer-value' style={{ color: statusColor(b.status) }}>{b.status}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Inbound Truck</span><span className='psd-drawer-value'>{b.inboundTruck}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Outbound Truck</span><span className='psd-drawer-value'>{b.outboundTruck}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Dock In</span><span className='psd-drawer-value'>{b.dockIn}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Dock Out</span><span className='psd-drawer-value'>{b.dockOut}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Total Parcels</span><span className='psd-drawer-value'>{b.totalParcels}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Sorted</span><span className='psd-drawer-value'>{b.sortedParcels}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Target SLA</span><span className='psd-drawer-value'>{b.targetSLA} min</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Elapsed</span><span className='psd-drawer-value'>{b.elapsed} min</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Efficiency</span><span className='psd-drawer-value'>{b.efficiency > 0 ? `${b.efficiency}%` : '—'}</span></div>
            <div className='psd-drawer-field'><span className='psd-drawer-label'>Started</span><span className='psd-drawer-value'>{b.startTime}</span></div>
          </div>
          <div className='psd-drawer-actions'>
            <button className='psd-action-btn psd-action-primary'><Play size={14} /> Resume</button>
            <button className='psd-action-btn psd-action-secondary'><RefreshCw size={14} /> Reassign</button>
            <button className='psd-action-btn psd-action-ghost'><Eye size={14} /> Monitor</button>
          </div>
        </div>
      </div>
      </>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 0: return renderDashboard()
      case 1: return renderLanes()
      case 2: return renderParcels()
      case 3: return renderCrossDock()
      case 4: return renderRoutesAlerts()
      default: return null
    }
  }

  return (
    <div className='psd-container'>
      <div className='psd-page-header'>
        <div className='psd-page-title-row'>
          <GitFork size={28} style={{ color: THEME.primary }} />
          <div>
            <h1 className='psd-page-title'>Parcel Sorting & Cross-Dock</h1>
            <p className='psd-page-subtitle'>Automated Parcel Sorting, Cross-Dock Transfer & Route Optimization</p>
          </div>
        </div>
        <div className='psd-header-stats'>
          <span className='psd-header-stat'><GitFork size={14} />{data.lanes.length} Lanes</span>
          <span className='psd-header-stat'><Package size={14} />{data.parcels.length} Parcels</span>
          <span className='psd-header-stat'><ArrowRightLeft size={14} />{data.batches.length} Batches</span>
          <span className='psd-header-stat'><AlertTriangle size={14} />{data.alerts.length} Alerts</span>
        </div>
      </div>

      <div className='psd-tabs'>
        {tabs.map((tab, i) => (
          <button key={tab} className={`psd-tab ${activeTab === i ? 'psd-tab-active' : ''}`} onClick={() => { setActiveTab(i); setCurrentPage(1); setParcelPage(1); setStatusFilter('all'); setTypeFilter('all'); setPriorityFilter('all'); setCourierFilter('all'); setSearchQuery('') }}>
            {tab}
          </button>
        ))}
      </div>

      {renderTab()}
      {renderLaneDrawer()}
      {renderParcelDrawer()}
      {renderBatchDrawer()}
    </div>
  )
}
