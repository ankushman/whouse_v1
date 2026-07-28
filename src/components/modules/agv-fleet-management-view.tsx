'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Bot, Zap, Battery, AlertTriangle, CheckCircle2, XCircle,
  Thermometer, Activity, MapPin, Clock, BarChart3, PieChart as PieChartIcon,
  Eye, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Wrench, Play, Pause, Square, RefreshCw, Filter,
  Signal, Gauge, Cpu, MapPinned, ArrowUpDown, TrendingUp,
  Package, Box, Warehouse, CircleDot, Circle, TriangleAlert
} from 'lucide-react'
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, BarChart
} from 'recharts'

// ============================================================
// TYPES
// ============================================================

interface AGVVehicle {
  id: string; name: string; model: string; type: string;
  warehouse: string; zone: string;
  status: string; batteryLevel: number;
  currentTask: string; speed: number;
  loadWeight: number; maxLoad: number;
  totalDistance: number; totalTasks: number;
  uptimeHours: number; lastMaintenance: string;
  nextMaintenance: string;
  firmware: string; cpuUsage: number; memoryUsage: number;
  motorTemp: number; lidarStatus: string;
  aisle: string; targetLocation: string;
  errorCount24h: number; efficiency: number;
  assignedTo: string;
}

interface AGVTask {
  id: string; agvId: string; agvName: string;
  type: string; priority: string; status: string;
  pickupLocation: string; dropoffLocation: string;
  aisle: string; weight: number;
  created: string; started: string; completed: string | null;
  distance: number; estimatedTime: number; actualTime: number | null;
  assignedBy: string;
}

interface ChargingStation {
  id: string; name: string; warehouse: string;
  zone: string; status: string;
  totalSlots: number; occupiedSlots: number;
  powerOutput: number; avgChargeTime: number;
  totalCharges: number; efficiency: number;
  lastMaintenance: string;
}

interface AGVAlert {
  id: string; agvId: string; agvName: string;
  type: string; severity: string; message: string;
  timestamp: string; acknowledged: boolean;
  value: number; threshold: number;
}

interface ZoneMapCell {
  aisle: string; zone: string;
  agvCount: number; taskDensity: number;
  congestion: string;
}

interface PathRoute {
  id: string; name: string; status: string;
  length: number; avgTime: number; trafficLevel: string;
  agvCount: number; incidents24h: number;
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

function generateData() {
  const rng = seededRandom(166166)
  const r = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
  const rf = (min: number, max: number) => +(rng() * (max - min) + min).toFixed(1)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)]

  const warehouses = ['WH-Mumbai-01','WH-Delhi-02','WH-Bengaluru-03','WH-Chennai-04','WH-Hyderabad-05','WH-Pune-06','WH-Kolkata-07','WH-Jaipur-08']
  const zones = ['Zone-A','Zone-B','Zone-C','Zone-D','Zone-E','Zone-F']
  const agvModels = ['AMR-ProX-500','AMR-FleetM-300','AGV-PalletL-800','AMR-PickP-200','AGV-HeavyH-1200','AMR-SortS-400']
  const agvTypes = ['Pallet Mover','Pick & Place','Sorter','Heavy Lift','Hybrid','Forklift AGV']
  const statuses = ['active','idle','charging','maintenance','error','offline']
  const taskTypes = ['Pallet Transport','Order Picking','Replenishment','Returns Processing','Cross-Dock Transfer','Inventory Count']
  const priorities = ['critical','high','normal','low']
  const taskStatuses = ['in_progress','completed','pending','cancelled','failed']
  const alertTypes = ['Low Battery','Obstacle Detected','Motor Overheating','Lidar Fault','Path Blocked','Communication Lost','Load Unbalanced','Charging Fault','Firmware Error','Collision Avoidance']
  const severities = ['critical','warning','info']
  const firmwareVersions = ['v3.2.1','v3.1.4','v3.3.0','v2.9.8','v3.2.0']
  const aisles = ['A1','A2','A3','A4','B1','B2','B3','B4','C1','C2','C3','C4','D1','D2','D3','D4']
  const locations = ['St-01','St-02','St-03','St-04','St-05','St-06','St-07','St-08','St-09','St-10','St-11','St-12','St-13','St-14','St-15','St-16','Dk-01','Dk-02','Dk-03','Dk-04']

  // Generate 50 AGVs
  const agvs: AGVVehicle[] = Array.from({ length: 50 }, (_, i) => {
    const st = pick(statuses)
    const wt = rf(300, 1200)
    const battery = st === 'charging' ? rf(15, 95) : st === 'error' ? rf(5, 40) : rf(35, 100)
    return {
      id: `AGV-${String(i + 1).padStart(3, '0')}`,
      name: `${pick(agvModels)}-${String(i + 1).padStart(3, '0')}`.substring(0, 22),
      model: pick(agvModels),
      type: pick(agvTypes),
      warehouse: pick(warehouses),
      zone: pick(zones),
      status: st,
      batteryLevel: battery,
      currentTask: st === 'active' ? pick(taskTypes) : st === 'error' ? 'Fault Recovery' : '—',
      speed: st === 'active' ? rf(0.5, 2.5) : 0,
      loadWeight: st === 'active' ? rf(50, wt * 0.9) : rf(0, 30),
      maxLoad: wt,
      totalDistance: rf(120, 8500),
      totalTasks: r(80, 3200),
      uptimeHours: rf(200, 4800),
      lastMaintenance: `${r(1,28)} days ago`,
      nextMaintenance: `${r(1,30)} days`,
      firmware: pick(firmwareVersions),
      cpuUsage: st === 'active' ? rf(40, 85) : st === 'idle' ? rf(5, 20) : rf(10, 30),
      memoryUsage: st === 'active' ? rf(45, 78) : rf(20, 45),
      motorTemp: st === 'active' ? rf(38, 72) : rf(28, 42),
      lidarStatus: st === 'error' && rng() > 0.5 ? 'fault' : 'ok',
      aisle: st === 'active' ? pick(aisles) : '—',
      targetLocation: st === 'active' ? pick(locations) : '—',
      errorCount24h: st === 'error' ? r(1, 8) : r(0, 2),
      efficiency: st === 'active' ? rf(65, 98) : st === 'idle' ? 0 : rf(50, 85),
      assignedTo: st === 'active' ? `Operator-${r(1, 12).toString().padStart(2, '0')}` : '—',
    }
  })

  // Generate 300 tasks
  const tasks: AGVTask[] = Array.from({ length: 300 }, (_, i) => {
    const st = pick(taskStatuses)
    const agv = pick(agvs)
    const dist = rf(20, 350)
    const et = rf(3, 25)
    return {
      id: `TSK-${String(i + 1).padStart(4, '0')}`,
      agvId: agv.id,
      agvName: agv.name.substring(0, 18),
      type: pick(taskTypes),
      priority: pick(priorities),
      status: st,
      pickupLocation: pick(locations),
      dropoffLocation: pick(locations),
      aisle: pick(aisles),
      weight: rf(20, 800),
      created: `${r(1,30)}h ago`,
      started: st !== 'pending' ? `${r(1,20)}h ago` : '—',
      completed: st === 'completed' || st === 'failed' ? `${r(0,10)}h ago` : null,
      distance: dist,
      estimatedTime: et,
      actualTime: st === 'completed' ? rf(et * 0.7, et * 1.4) : null,
      assignedBy: `Scheduler-${r(1, 4)}`,
    }
  })

  // Generate 20 charging stations
  const stations: ChargingStation[] = Array.from({ length: 20 }, (_, i) => {
    const occ = r(0, 4)
    return {
      id: `CHG-${String(i + 1).padStart(3, '0')}`,
      name: `Charger-${pick(['Alpha','Beta','Gamma','Delta','Sigma','Omega'])}-${String(i + 1).padStart(2, '0')}`,
      warehouse: pick(warehouses),
      zone: pick(zones),
      status: pick(['online','online','online','maintenance']),
      totalSlots: r(4, 8),
      occupiedSlots: occ,
      powerOutput: r(50, 150),
      avgChargeTime: rf(45, 120),
      totalCharges: r(200, 5000),
      efficiency: rf(82, 99),
      lastMaintenance: `${r(1,60)} days ago`,
    }
  })

  // Generate 15 alerts
  const alerts: AGVAlert[] = Array.from({ length: 15 }, (_, i) => {
    const agv = pick(agvs)
    const sev = pick(severities)
    return {
      id: `ALT-${String(i + 1).padStart(4, '0')}`,
      agvId: agv.id,
      agvName: agv.name.substring(0, 18),
      type: pick(alertTypes),
      severity: sev,
      message: `${pick(alertTypes)} on ${agv.id} ${sev === 'critical' ? 'requires immediate attention' : sev === 'warning' ? 'needs monitoring' : 'logged for review'}`,
      timestamp: `${r(1,48)}h ago`,
      acknowledged: rng() > 0.6,
      value: rf(0, 100),
      threshold: rf(60, 95),
    }
  })

  // Generate zone map (16 cells)
  const zoneMap: ZoneMapCell[] = aisles.slice(0, 16).map((aisle, i) => ({
    aisle,
    zone: pick(zones),
    agvCount: r(0, 5),
    taskDensity: r(1, 10),
    congestion: pick(['low','medium','high']),
  }))

  // Generate 12 path routes
  const paths: PathRoute[] = Array.from({ length: 12 }, (_, i) => ({
    id: `PATH-${String(i + 1).padStart(2, '0')}`,
    name: `${pick(['Main Corridor','Cross Aisle','Dock Route','Staging Path','Receiving Lane','Shipping Lane','Pick Zone Loop','Buffer Transfer','High-Speed Bypass','Return Loop','Emergency Escape','Service Tunnel'])} ${String(i+1).padStart(2,'0')}`,
    status: pick(['active','active','active','blocked','restricted']),
    length: rf(30, 250),
    avgTime: rf(2, 15),
    trafficLevel: pick(['low','medium','high']),
    agvCount: r(0, 6),
    incidents24h: r(0, 3),
  }))

  // KPI data
  const activeAGVs = agvs.filter(a => a.status === 'active').length
  const avgBattery = +(agvs.reduce((s, a) => s + a.batteryLevel, 0) / agvs.length).toFixed(1)
  const avgEfficiency = +(agvs.filter(a => a.status === 'active').reduce((s, a) => s + a.efficiency, 0) / Math.max(activeAGVs, 1)).toFixed(1)
  const completedTasks24h = tasks.filter(t => t.status === 'completed').length
  const totalDistanceToday = +agvs.reduce((s, a) => s + a.totalDistance, 0).toFixed(1)
  const errorAGVs = agvs.filter(a => a.status === 'error').length

  // Hourly throughput data (24h)
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    tasksCompleted: r(8, 35),
    tasksAssigned: r(5, 30),
    avgSpeed: rf(0.8, 2.2),
    energyUsage: r(40, 180),
  }))

  // Type distribution
  const typeCounts: Record<string, number> = {}
  agvs.forEach(a => { typeCounts[a.type] = (typeCounts[a.type] || 0) + 1 })
  const typePieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }))

  // Battery distribution
  const batteryDist = [
    { range: 'Critical (0-15%)', count: agvs.filter(a => a.batteryLevel <= 15).length, color: '#ef4444' },
    { range: 'Low (16-30%)', count: agvs.filter(a => a.batteryLevel > 15 && a.batteryLevel <= 30).length, color: '#f97316' },
    { range: 'Medium (31-60%)', count: agvs.filter(a => a.batteryLevel > 30 && a.batteryLevel <= 60).length, color: '#f59e0b' },
    { range: 'Good (61-85%)', count: agvs.filter(a => a.batteryLevel > 60 && a.batteryLevel <= 85).length, color: '#22c55e' },
    { range: 'Full (86-100%)', count: agvs.filter(a => a.batteryLevel > 85).length, color: '#06b6d4' },
  ]

  // Warehouse radar
  const warehouseRadar = warehouses.slice(0, 6).map(wh => {
    const whAGVs = agvs.filter(a => a.warehouse === wh)
    return {
      warehouse: wh.replace('WH-', '').replace('-0', ' #'),
      utilization: +((whAGVs.filter(a => a.status === 'active').length / Math.max(whAGVs.length, 1)) * 100).toFixed(0),
      efficiency: +((whAGVs.reduce((s, a) => s + a.efficiency, 0) / Math.max(whAGVs.length, 1))).toFixed(0),
      battery: +((whAGVs.reduce((s, a) => s + a.batteryLevel, 0) / Math.max(whAGVs.length, 1))).toFixed(0),
      throughput: r(40, 95),
    }
  })

  return {
    agvs, tasks, stations, alerts, zoneMap, paths,
    hourlyData, typePieData, batteryDist, warehouseRadar,
    activeAGVs, avgBattery, avgEfficiency, completedTasks24h, totalDistanceToday, errorAGVs,
    // return enums used in JSX
    statuses, agvTypes, taskTypes, priorities, taskStatuses, severities,
    warehouses, zones, aisles,
  }
}


const COLORS = ['#f97316', '#06b6d4', '#8b5cf6', '#22c55e', '#ef4444', '#f59e0b']
const THEME = { primary: '#f97316', secondary: '#06b6d4', accent: '#8b5cf6', success: '#22c55e', danger: '#ef4444', warning: '#f59e0b' }

function formatINR(num: number): string {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`
  return `₹${num.toLocaleString('en-IN')}`
}

export default function AGVFleetManagementView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [selectedAGV, setSelectedAGV] = useState<AGVVehicle | null>(null)
  const [selectedTask, setSelectedTask] = useState<AGVTask | null>(null)
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortField, setSortField] = useState<string>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [taskPage, setTaskPage] = useState(1)
  const rowsPerPage = 15

  // Live clock
  const [currentTime, setCurrentTime] = useState('')
  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }))
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  // Filtered/sorted fleets
  const filteredAGVs = useMemo(() => {
    let list = data.agvs.filter(a => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      if (typeFilter !== 'all' && a.type !== typeFilter) return false
      if (searchQuery && !a.id.toLowerCase().includes(searchQuery.toLowerCase()) && !a.name.toLowerCase().includes(searchQuery.toLowerCase()) && !a.warehouse.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    list.sort((a, b) => {
      const aVal = (a as any)[sortField]
      const bVal = (b as any)[sortField]
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
    return list
  }, [data, statusFilter, typeFilter, searchQuery, sortField, sortDir])

  const filteredTasks = useMemo(() => {
    return data.tasks.filter(t => {
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (searchQuery && !t.id.toLowerCase().includes(searchQuery.toLowerCase()) && !t.agvName.toLowerCase().includes(searchQuery.toLowerCase()) && !t.type.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [data, priorityFilter, statusFilter, searchQuery])

  const paginatedAGVs = filteredAGVs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  const paginatedTasks = filteredTasks.slice((taskPage - 1) * rowsPerPage, taskPage * rowsPerPage)
  const totalPages = Math.ceil(filteredAGVs.length / rowsPerPage)
  const totalTaskPages = Math.ceil(filteredTasks.length / rowsPerPage)

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const tabs = ['Dashboard', 'Fleet Overview', 'Task Queue', 'Charging Network', 'Path Planning & Alerts']

  const statusColor = (s: string) => {
    const map: Record<string, string> = { active: '#22c55e', idle: '#6b7280', charging: '#06b6d4', maintenance: '#f59e0b', error: '#ef4444', offline: '#374151' }
    return map[s] || '#6b7280'
  }

  const batteryColor = (lv: number) => lv > 60 ? '#22c55e' : lv > 30 ? '#f59e0b' : '#ef4444'

  const priorityBadge = (p: string) => {
    const c: Record<string, string> = { critical: '#ef4444', high: '#f97316', normal: '#06b6d4', low: '#6b7280' }
    return c[p] || '#6b7280'
  }

  // =====================================================
  // TAB 0: DASHBOARD
  // =====================================================
  const renderDashboard = () => (
    <div className='agv-tab-content'>
      <div className='agv-clock-row'>
        <Bot size={18} style={{ color: THEME.primary }} />
        <span className='agv-live-dot' />
        <span className='agv-clock-text'>Live — {currentTime} IST</span>
      </div>

      {/* KPIs */}
      <div className='agv-kpi-grid'>
        {['active','charging','error'].map(st => {
          const count = data.agvs.filter(a => a.status === st).length
          return (
            <div key={st} className='agv-kpi-card' style={{ borderTopColor: statusColor(st) }}>
              <div className='agv-kpi-icon' style={{ background: `${statusColor(st)}15`, color: statusColor(st) }}>
                {st === 'active' ? <Zap size={20} /> : st === 'charging' ? <Battery size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div className='agv-kpi-body'>
                <span className='agv-kpi-value'>{count}</span>
                <span className='agv-kpi-label'>{st === 'active' ? 'Active AGVs' : st === 'charging' ? 'Charging' : 'Errors'}</span>
              </div>
            </div>
          )
        })}
        <div className='agv-kpi-card' style={{ borderTopColor: THEME.secondary }}>
          <div className='agv-kpi-icon' style={{ background: '#06b6d415', color: THEME.secondary }}><Activity size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{data.avgEfficiency}%</span>
            <span className='agv-kpi-label'>Avg Efficiency</span>
          </div>
        </div>
        <div className='agv-kpi-card' style={{ borderTopColor: THEME.accent }}>
          <div className='agv-kpi-icon' style={{ background: '#8b5cf615', color: THEME.accent }}><BarChart3 size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{data.completedTasks24h}</span>
            <span className='agv-kpi-label'>Tasks Completed</span>
          </div>
        </div>
        <div className='agv-kpi-card' style={{ borderTopColor: THEME.warning }}>
          <div className='agv-kpi-icon' style={{ background: '#f59e0b15', color: THEME.warning }}><Gauge size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{data.totalDistanceToday.toLocaleString()}</span>
            <span className='agv-kpi-label'>Total Distance (m)</span>
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className='agv-charts-row'>
        <div className='agv-chart-card agv-chart-wide'>
          <div className='agv-chart-header'><h4 className='agv-chart-title'>24h Throughput & Energy</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <ComposedChart data={data.hourlyData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#1e293b' />
              <XAxis dataKey='hour' stroke='#64748b' tick={{ fontSize: 10 }} interval={2} />
              <YAxis yAxisId='left' stroke='#64748b' tick={{ fontSize: 10 }} />
              <YAxis yAxisId='right' orientation='right' stroke='#64748b' tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId='left' dataKey='tasksCompleted' fill='#22c55e' radius={[4, 4, 0, 0]} name='Completed' />
              <Bar yAxisId='left' dataKey='tasksAssigned' fill='#06b6d4' radius={[4, 4, 0, 0]} name='Assigned' />
              <Line yAxisId='right' dataKey='energyUsage' stroke='#f97316' strokeWidth={2} dot={false} name='Energy (kWh)' />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className='agv-chart-card'>
          <div className='agv-chart-header'><h4 className='agv-chart-title'>AGV Type Distribution</h4></div>
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
      <div className='agv-charts-row'>
        <div className='agv-chart-card'>
          <div className='agv-chart-header'><h4 className='agv-chart-title'>Warehouse Performance Radar</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <RadarChart data={data.warehouseRadar}>
              <PolarGrid stroke='#334155' />
              <PolarAngleAxis dataKey='warehouse' stroke='#94a3b8' tick={{ fontSize: 10 }} />
              <PolarRadiusAxis stroke='#475569' tick={{ fontSize: 9 }} />
              <Radar name='Utilization' dataKey='utilization' stroke='#f97316' fill='#f9731630' strokeWidth={2} />
              <Radar name='Efficiency' dataKey='efficiency' stroke='#06b6d4' fill='#06b6d430' strokeWidth={2} />
              <Radar name='Battery' dataKey='battery' stroke='#22c55e' fill='#22c55e30' strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className='agv-chart-card'>
          <div className='agv-chart-header'><h4 className='agv-chart-title'>Battery Distribution</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <BarChart data={data.batteryDist}>
              <CartesianGrid strokeDasharray='3 3' stroke='#1e293b' />
              <XAxis dataKey='range' stroke='#64748b' tick={{ fontSize: 8 }} angle={-25} textAnchor='end' height={60} />
              <YAxis stroke='#64748b' tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey='count' radius={[6, 6, 0, 0]}>
                {data.batteryDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone heat map */}
      <div className='agv-chart-card agv-chart-full'>
        <div className='agv-chart-header'><h4 className='agv-chart-title'>Zone Traffic Heat Map</h4></div>
        <div className='agv-heatmap-grid'>
          {data.zoneMap.map((cell) => {
            const bg = cell.congestion === 'high' ? '#ef4444' : cell.congestion === 'medium' ? '#f59e0b' : '#22c55e'
            const opacity = 0.2 + (cell.agvCount / 5) * 0.8
            return (
              <div key={cell.aisle} className='agv-heatmap-cell' style={{ background: `${bg}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`, borderColor: bg }}>
                <span className='agv-heatmap-aisle'>{cell.aisle}</span>
                <span className='agv-heatmap-zone'>{cell.zone}</span>
                <span className='agv-heatmap-count'>{cell.agvCount} AGV{cell.agvCount !== 1 ? 's' : ''}</span>
                <span className='agv-heatmap-density' style={{ color: bg }}>{cell.congestion}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  // =====================================================
  // TAB 1: FLEET OVERVIEW
  // =====================================================
  const renderFleet = () => (
    <div className='agv-tab-content'>
      {/* Filter row */}
      <div className='agv-filter-row'>
        <div className='agv-search-box'>
          <input type='text' placeholder='Search AGV ID, name, warehouse...' value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} className='agv-search-input' />
        </div>
        <div className='agv-filter-pills'>
          <button className={`agv-pill ${statusFilter === 'all' ? 'agv-pill-active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
          {data.statuses.map(s => (
            <button key={s} className={`agv-pill ${statusFilter === s ? 'agv-pill-active' : ''}`} style={statusFilter === s ? { background: statusColor(s), borderColor: statusColor(s) } : {}} onClick={() => setStatusFilter(s)}>{s}</button>
          ))}
        </div>
        <div className='agv-filter-pills'>
          <button className={`agv-pill ${typeFilter === 'all' ? 'agv-pill-active' : ''}`} onClick={() => setTypeFilter('all')}>All Types</button>
          {data.agvTypes.map(t => (
            <button key={t} className={`agv-pill ${typeFilter === t ? 'agv-pill-active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className='agv-fleet-stats'>
        <span>Total: <b>{filteredAGVs.length}</b></span>
        <span>Page {currentPage}/{totalPages}</span>
      </div>

      {/* Table */}
      <div className='agv-table-wrapper'>
        <table className='agv-table'>
          <thead>
            <tr>
              <th onClick={() => toggleSort('id')} className='agv-th-sortable'>AGV ID {sortField === 'id' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</th>
              <th>Model</th>
              <th>Type</th>
              <th>Status</th>
              <th onClick={() => toggleSort('batteryLevel')} className='agv-th-sortable'>Battery {sortField === 'batteryLevel' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</th>
              <th>Current Task</th>
              <th onClick={() => toggleSort('speed')} className='agv-th-sortable'>Speed {sortField === 'speed' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</th>
              <th>Load</th>
              <th>Efficiency</th>
              <th>Warehouse</th>
              <th>Aisle</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAGVs.map(agv => (
              <tr key={agv.id} className='agv-table-row' style={{ borderLeftColor: statusColor(agv.status) }}>
                <td className='agv-td-id'><Bot size={14} style={{ color: statusColor(agv.status), marginRight: 6 }} />{agv.id}</td>
                <td className='agv-td-model'>{agv.model}</td>
                <td><span className='agv-type-badge'>{agv.type}</span></td>
                <td><span className='agv-status-badge' style={{ background: `${statusColor(agv.status)}20`, color: statusColor(agv.status) }}>{agv.status}</span></td>
                <td>
                  <div className='agv-battery-cell'>
                    <div className='agv-battery-bar-track'><div className='agv-battery-bar-fill' style={{ width: `${agv.batteryLevel}%`, background: batteryColor(agv.batteryLevel) }} /></div>
                    <span className='agv-battery-text' style={{ color: batteryColor(agv.batteryLevel) }}>{agv.batteryLevel}%</span>
                  </div>
                </td>
                <td className='agv-td-task'>{agv.currentTask}</td>
                <td>{agv.speed > 0 ? `${agv.speed} m/s` : '—'}</td>
                <td>{agv.loadWeight > 0 ? `${Math.round(agv.loadWeight)} kg` : '—'}</td>
                <td>
                  <div className='agv-eff-cell'>
                    <div className='agv-eff-bar-track'><div className='agv-eff-bar-fill' style={{ width: `${agv.efficiency}%`, background: agv.efficiency > 80 ? '#22c55e' : agv.efficiency > 50 ? '#f59e0b' : '#ef4444' }} /></div>
                    <span style={{ fontSize: 11 }}>{agv.efficiency}%</span>
                  </div>
                </td>
                <td style={{ fontSize: 11 }}>{agv.warehouse.replace('WH-', '')}</td>
                <td>{agv.aisle}</td>
                <td><button className='agv-view-btn' onClick={() => setSelectedAGV(agv)}><Eye size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='agv-pagination'>
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className='agv-page-btn'><ChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => {
          const p = i + 1
          return <button key={p} className={`agv-page-btn ${currentPage === p ? 'agv-page-active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
        })}
        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className='agv-page-btn'><ChevronRight size={16} /></button>
      </div>
    </div>
  )

  // =====================================================
  // TAB 2: TASK QUEUE
  // =====================================================
  const renderTasks = () => (
    <div className='agv-tab-content'>
      <div className='agv-filter-row'>
        <div className='agv-search-box'>
          <input type='text' placeholder='Search task ID, AGV name, type...' value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setTaskPage(1) }} className='agv-search-input' />
        </div>
        <div className='agv-filter-pills'>
          <button className={`agv-pill ${priorityFilter === 'all' ? 'agv-pill-active' : ''}`} onClick={() => setPriorityFilter('all')}>All</button>
          {data.priorities.map(p => (
            <button key={p} className={`agv-pill ${priorityFilter === p ? 'agv-pill-active' : ''}`} style={priorityFilter === p ? { background: priorityBadge(p), borderColor: priorityBadge(p) } : {}} onClick={() => setPriorityFilter(p)}>{p}</button>
          ))}
        </div>
        <div className='agv-filter-pills'>
          <button className={`agv-pill ${statusFilter === 'all' ? 'agv-pill-active' : ''}`} onClick={() => setStatusFilter('all')}>All Status</button>
          {data.taskStatuses.map(s => (
            <button key={s} className={`agv-pill ${statusFilter === s ? 'agv-pill-active' : ''}`} onClick={() => setStatusFilter(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className='agv-fleet-stats'>
        <span>Total Tasks: <b>{filteredTasks.length}</b></span>
        <span>In Progress: <b>{filteredTasks.filter(t => t.status === 'in_progress').length}</b></span>
        <span>Completed: <b>{filteredTasks.filter(t => t.status === 'completed').length}</b></span>
        <span>Failed: <b>{filteredTasks.filter(t => t.status === 'failed').length}</b></span>
      </div>

      <div className='agv-table-wrapper'>
        <table className='agv-table'>
          <thead>
            <tr>
              <th>Task ID</th>
              <th>AGV</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Weight</th>
              <th>Distance</th>
              <th>Est / Actual</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map(task => (
              <tr key={task.id} className='agv-table-row' style={{ borderLeftColor: task.status === 'in_progress' ? '#f97316' : task.status === 'completed' ? '#22c55e' : task.status === 'failed' ? '#ef4444' : '#6b7280' }}>
                <td className='agv-td-id'>{task.id}</td>
                <td style={{ fontSize: 11 }}>{task.agvName}</td>
                <td><span className='agv-type-badge'>{task.type}</span></td>
                <td><span className='agv-status-badge' style={{ background: `${priorityBadge(task.priority)}20`, color: priorityBadge(task.priority) }}>{task.priority}</span></td>
                <td><span className='agv-status-badge' style={{ background: `${statusColor(task.status)}20`, color: statusColor(task.status) }}>{task.status}</span></td>
                <td style={{ fontSize: 11 }}>{task.pickupLocation}</td>
                <td style={{ fontSize: 11 }}>{task.dropoffLocation}</td>
                <td>{Math.round(task.weight)} kg</td>
                <td>{task.distance} m</td>
                <td style={{ fontSize: 11 }}>
                  {task.estimatedTime} min
                  {task.actualTime && <span style={{ color: task.actualTime > task.estimatedTime ? '#ef4444' : '#22c55e' }}> / {task.actualTime} min</span>}
                </td>
                <td style={{ fontSize: 11 }}>{task.created}</td>
                <td><button className='agv-view-btn' onClick={() => setSelectedTask(task)}><Eye size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='agv-pagination'>
        <button disabled={taskPage <= 1} onClick={() => setTaskPage(p => p - 1)} className='agv-page-btn'><ChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(totalTaskPages, 8) }, (_, i) => {
          const p = i + 1
          return <button key={p} className={`agv-page-btn ${taskPage === p ? 'agv-page-active' : ''}`} onClick={() => setTaskPage(p)}>{p}</button>
        })}
        <button disabled={taskPage >= totalTaskPages} onClick={() => setTaskPage(p => p + 1)} className='agv-page-btn'><ChevronRight size={16} /></button>
      </div>
    </div>
  )

  // =====================================================
  // TAB 3: CHARGING NETWORK
  // =====================================================
  const renderCharging = () => (
    <div className='agv-tab-content'>
      <div className='agv-kpi-grid'>
        <div className='agv-kpi-card' style={{ borderTopColor: '#06b6d4' }}>
          <div className='agv-kpi-icon' style={{ background: '#06b6d415', color: '#06b6d4' }}><Zap size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{data.stations.length}</span>
            <span className='agv-kpi-label'>Total Stations</span>
          </div>
        </div>
        <div className='agv-kpi-card' style={{ borderTopColor: '#22c55e' }}>
          <div className='agv-kpi-icon' style={{ background: '#22c55e15', color: '#22c55e' }}><CheckCircle2 size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{data.stations.filter(s => s.status === 'online').length}</span>
            <span className='agv-kpi-label'>Online</span>
          </div>
        </div>
        <div className='agv-kpi-card' style={{ borderTopColor: '#f59e0b' }}>
          <div className='agv-kpi-icon' style={{ background: '#f59e0b15', color: '#f59e0b' }}><Battery size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{data.stations.reduce((s, st) => s + st.occupiedSlots, 0)}</span>
            <span className='agv-kpi-label'>AGVs Charging</span>
          </div>
        </div>
        <div className='agv-kpi-card' style={{ borderTopColor: '#8b5cf6' }}>
          <div className='agv-kpi-icon' style={{ background: '#8b5cf615', color: '#8b5cf6' }}><Activity size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{(data.stations.reduce((s, st) => s + st.efficiency, 0) / data.stations.length).toFixed(1)}%</span>
            <span className='agv-kpi-label'>Avg Efficiency</span>
          </div>
        </div>
      </div>

      {/* Station cards grid */}
      <div className='agv-charging-grid'>
        {data.stations.map(st => {
          const usage = (st.occupiedSlots / st.totalSlots) * 100
          return (
            <div key={st.id} className='agv-station-card' style={{ borderColor: st.status === 'online' ? '#22c55e' : '#f59e0b' }}>
              <div className='agv-station-header'>
                <div className='agv-station-name-row'>
                  <Zap size={16} style={{ color: '#06b6d4' }} />
                  <span className='agv-station-name'>{st.name}</span>
                  <span className='agv-station-status-dot' style={{ background: st.status === 'online' ? '#22c55e' : '#f59e0b' }} />
                </div>
                <span className='agv-station-warehouse'>{st.warehouse.replace('WH-', '')} · {st.zone}</span>
              </div>
              <div className='agv-station-slots'>
                <div className='agv-slot-bar-track'>
                  {Array.from({ length: st.totalSlots }, (_, i) => (
                    <div key={i} className='agv-slot-indicator' style={{ background: i < st.occupiedSlots ? '#06b6d4' : '#1e293b' }} />
                  ))}
                </div>
                <span className='agv-slot-label'>{st.occupiedSlots} / {st.totalSlots} slots</span>
              </div>
              <div className='agv-station-stats'>
                <div className='agv-station-stat'>
                  <Cpu size={14} style={{ color: '#64748b' }} />
                  <span>{st.powerOutput} kW</span>
                </div>
                <div className='agv-station-stat'>
                  <Clock size={14} style={{ color: '#64748b' }} />
                  <span>{st.avgChargeTime} min avg</span>
                </div>
                <div className='agv-station-stat'>
                  <Activity size={14} style={{ color: '#64748b' }} />
                  <span>{st.totalCharges} charges</span>
                </div>
              </div>
              <button className='agv-card-action-btn' onClick={() => setSelectedStation(st)}><Eye size={14} /> View Details</button>
            </div>
          )
        })}
      </div>
    </div>
  )

  // =====================================================
  // TAB 4: PATH PLANNING & ALERTS
  // =====================================================
  const renderPathsAlerts = () => (
    <div className='agv-tab-content'>
      {/* Path routes */}
      <div className='agv-section-header'>
        <MapPinned size={18} style={{ color: THEME.primary }} />
        <h3 className='agv-section-title'>Path Routes ({data.paths.length})</h3>
      </div>
      <div className='agv-path-grid'>
        {data.paths.map(p => {
          const bg = p.status === 'active' ? '#22c55e' : p.status === 'blocked' ? '#ef4444' : '#f59e0b'
          return (
            <div key={p.id} className='agv-path-card' style={{ borderLeftColor: bg }}>
              <div className='agv-path-name'>{p.name}</div>
              <div className='agv-path-meta'>
                <span className='agv-path-status' style={{ background: `${bg}20`, color: bg }}>{p.status}</span>
                <span className='agv-path-detail'>{p.length}m · {p.avgTime} min</span>
                <span className='agv-path-detail'>{p.agvCount} AGVs</span>
                <span className='agv-path-detail' style={{ color: p.trafficLevel === 'high' ? '#ef4444' : p.trafficLevel === 'medium' ? '#f59e0b' : '#22c55e' }}>{p.trafficLevel} traffic</span>
              </div>
              {p.incidents24h > 0 && <div className='agv-path-incidents'><TriangleAlert size={12} style={{ color: '#ef4444' }} /><span>{p.incidents24h} incidents</span></div>}
            </div>
          )
        })}
      </div>

      {/* Alert summary cards */}
      <div className='agv-section-header' style={{ marginTop: 24 }}>
        <AlertTriangle size={18} style={{ color: THEME.danger }} />
        <h3 className='agv-section-title'>Alerts & Diagnostics</h3>
      </div>
      <div className='agv-kpi-grid'>
        <div className='agv-kpi-card' style={{ borderTopColor: '#ef4444' }}>
          <div className='agv-kpi-icon' style={{ background: '#ef444415', color: '#ef4444' }}><XCircle size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{data.alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length}</span>
            <span className='agv-kpi-label'>Critical Unack</span>
          </div>
        </div>
        <div className='agv-kpi-card' style={{ borderTopColor: '#f59e0b' }}>
          <div className='agv-kpi-icon' style={{ background: '#f59e0b15', color: '#f59e0b' }}><AlertTriangle size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{data.alerts.filter(a => a.severity === 'warning').length}</span>
            <span className='agv-kpi-label'>Warnings</span>
          </div>
        </div>
        <div className='agv-kpi-card' style={{ borderTopColor: '#22c55e' }}>
          <div className='agv-kpi-icon' style={{ background: '#22c55e15', color: '#22c55e' }}><CheckCircle2 size={20} /></div>
          <div className='agv-kpi-body'>
            <span className='agv-kpi-value'>{data.alerts.filter(a => a.acknowledged).length}/{data.alerts.length}</span>
            <span className='agv-kpi-label'>Acknowledged</span>
          </div>
        </div>
      </div>

      {/* Alert list */}
      <div className='agv-alert-list'>
        {data.alerts.map(alert => {
          const sevColor = alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#f59e0b' : '#06b6d4'
          return (
            <div key={alert.id} className='agv-alert-row' style={{ borderLeftColor: sevColor }}>
              <div className='agv-alert-icon' style={{ background: `${sevColor}20`, color: sevColor }}>
                {alert.severity === 'critical' ? <XCircle size={16} /> : alert.severity === 'warning' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div className='agv-alert-body'>
                <div className='agv-alert-title'>{alert.type} — {alert.agvName}</div>
                <div className='agv-alert-msg'>{alert.message}</div>
                <div className='agv-alert-meta'>
                  <span>{alert.timestamp}</span>
                  <span className='agv-alert-value'>Value: {alert.value} / Threshold: {alert.threshold}</span>
                  <span className={`agv-alert-ack ${alert.acknowledged ? 'agv-ack-yes' : 'agv-ack-no'}`}>{alert.acknowledged ? 'ACK' : 'PENDING'}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // =====================================================
  // AGV DETAIL DRAWER
  // =====================================================
  const renderAGDDrawer = () => {
    if (!selectedAGV) return null
    const a = selectedAGV
    const headerBg = a.status === 'error' ? 'linear-gradient(135deg, #dc2626, #991b1b)' : a.status === 'active' ? 'linear-gradient(135deg, #f97316, #c2410c)' : a.status === 'charging' ? 'linear-gradient(135deg, #06b6d4, #0e7490)' : 'linear-gradient(135deg, #6366f1, #4338ca)'
    return (
      <>
      <div className='agv-drawer-overlay' onClick={() => setSelectedAGV(null)} />
      <div className='agv-drawer-panel'>
        <div className='agv-drawer-header' style={{ background: headerBg }}>
          <div className='agv-drawer-header-top'>
            <div className='agv-drawer-header-info'>
              <Bot size={24} className='agv-drawer-header-icon' />
              <div>
                <div className='agv-drawer-title'>{a.id}</div>
                <div className='agv-drawer-subtitle'>{a.name} · {a.model}</div>
              </div>
            </div>
            <button className='agv-drawer-close' onClick={() => setSelectedAGV(null)}><XCircle size={20} /></button>
          </div>
          <div className='agv-drawer-badges'>
            <span className='agv-drawer-badge' style={{ background: `${statusColor(a.status)}30`, color: '#fff' }}>{a.status}</span>
            <span className='agv-drawer-badge' style={{ background: '#ffffff20', color: '#fff' }}>{a.type}</span>
          </div>
        </div>

        <div className='agv-drawer-body'>
          {/* Info grid */}
          <div className='agv-drawer-grid'>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Warehouse</span><span className='agv-drawer-value'>{a.warehouse}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Zone</span><span className='agv-drawer-value'>{a.zone}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Current Aisle</span><span className='agv-drawer-value'>{a.aisle}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Target Location</span><span className='agv-drawer-value'>{a.targetLocation}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Current Task</span><span className='agv-drawer-value'>{a.currentTask}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Assigned To</span><span className='agv-drawer-value'>{a.assignedTo}</span></div>
          </div>

          {/* Battery & Speed cards */}
          <div className='agv-drawer-card-row'>
            <div className='agv-drawer-metric-card'>
              <Battery size={16} style={{ color: batteryColor(a.batteryLevel) }} />
              <span className='agv-drawer-metric-label'>Battery</span>
              <span className='agv-drawer-metric-value' style={{ color: batteryColor(a.batteryLevel) }}>{a.batteryLevel}%</span>
              <div className='agv-drawer-metric-bar'><div style={{ width: `${a.batteryLevel}%`, background: batteryColor(a.batteryLevel) }} /></div>
            </div>
            <div className='agv-drawer-metric-card'>
              <Gauge size={16} style={{ color: THEME.primary }} />
              <span className='agv-drawer-metric-label'>Speed</span>
              <span className='agv-drawer-metric-value'>{a.speed} m/s</span>
              <div className='agv-drawer-metric-bar'><div style={{ width: `${(a.speed / 2.5) * 100}%`, background: '#f97316' }} /></div>
            </div>
            <div className='agv-drawer-metric-card'>
              <Activity size={16} style={{ color: '#22c55e' }} />
              <span className='agv-drawer-metric-label'>Efficiency</span>
              <span className='agv-drawer-metric-value'>{a.efficiency}%</span>
              <div className='agv-drawer-metric-bar'><div style={{ width: `${a.efficiency}%`, background: '#22c55e' }} /></div>
            </div>
          </div>

          {/* Performance stats */}
          <div className='agv-drawer-section-title'>Performance</div>
          <div className='agv-drawer-grid'>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Total Distance</span><span className='agv-drawer-value'>{a.totalDistance.toLocaleString()} m</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Total Tasks</span><span className='agv-drawer-value'>{a.totalTasks.toLocaleString()}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Uptime</span><span className='agv-drawer-value'>{a.uptimeHours}h</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Load / Max</span><span className='agv-drawer-value'>{Math.round(a.loadWeight)} / {a.maxLoad} kg</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Errors (24h)</span><span className='agv-drawer-value'>{a.errorCount24h}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Firmware</span><span className='agv-drawer-value'>{a.firmware}</span></div>
          </div>

          {/* Hardware diagnostics */}
          <div className='agv-drawer-section-title'>Hardware Diagnostics</div>
          <div className='agv-drawer-grid'>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>CPU Usage</span><span className='agv-drawer-value'>{a.cpuUsage}%</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Memory</span><span className='agv-drawer-value'>{a.memoryUsage}%</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Motor Temp</span><span className='agv-drawer-value' style={{ color: a.motorTemp > 65 ? '#ef4444' : '#22c55e' }}>{a.motorTemp}°C</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Lidar</span><span className='agv-drawer-value' style={{ color: a.lidarStatus === 'ok' ? '#22c55e' : '#ef4444' }}>{a.lidarStatus.toUpperCase()}</span></div>
          </div>

          {/* Maintenance */}
          <div className='agv-drawer-section-title'>Maintenance</div>
          <div className='agv-drawer-grid'>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Last Maintenance</span><span className='agv-drawer-value'>{a.lastMaintenance}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Next Maintenance</span><span className='agv-drawer-value'>{a.nextMaintenance}</span></div>
          </div>

          {/* Actions */}
          <div className='agv-drawer-actions'>
            <button className='agv-action-btn agv-action-primary'><Play size={14} /> Start Task</button>
            <button className='agv-action-btn agv-action-secondary'><Pause size={14} /> Pause</button>
            <button className='agv-action-btn agv-action-secondary'><Wrench size={14} /> Maintenance</button>
            <button className='agv-action-btn agv-action-ghost'><RefreshCw size={14} /> Reboot</button>
          </div>
        </div>
      </div>
      </>
    )
  }

  // =====================================================
  // TASK DETAIL DRAWER
  // =====================================================
  const renderTaskDrawer = () => {
    if (!selectedTask) return null
    const t = selectedTask
    const headerBg = t.status === 'completed' ? 'linear-gradient(135deg, #22c55e, #15803d)' : t.status === 'failed' ? 'linear-gradient(135deg, #ef4444, #991b1b)' : t.status === 'in_progress' ? 'linear-gradient(135deg, #f97316, #c2410c)' : 'linear-gradient(135deg, #6366f1, #4338ca)'
    return (
      <>
      <div className='agv-drawer-overlay' onClick={() => setSelectedTask(null)} />
      <div className='agv-drawer-panel'>
        <div className='agv-drawer-header' style={{ background: headerBg }}>
          <div className='agv-drawer-header-top'>
            <div className='agv-drawer-header-info'>
              <Package size={24} className='agv-drawer-header-icon' />
              <div>
                <div className='agv-drawer-title'>{t.id}</div>
                <div className='agv-drawer-subtitle'>{t.type} · Priority: {t.priority}</div>
              </div>
            </div>
            <button className='agv-drawer-close' onClick={() => setSelectedTask(null)}><XCircle size={20} /></button>
          </div>
          <div className='agv-drawer-badges'>
            <span className='agv-drawer-badge' style={{ background: `${statusColor(t.status)}30`, color: '#fff' }}>{t.status}</span>
            <span className='agv-drawer-badge' style={{ background: '#ffffff20', color: '#fff' }}>{t.agvName}</span>
          </div>
        </div>
        <div className='agv-drawer-body'>
          <div className='agv-drawer-grid'>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>AGV</span><span className='agv-drawer-value'>{t.agvId}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Aisle</span><span className='agv-drawer-value'>{t.aisle}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Pickup Location</span><span className='agv-drawer-value'>{t.pickupLocation}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Dropoff Location</span><span className='agv-drawer-value'>{t.dropoffLocation}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Weight</span><span className='agv-drawer-value'>{Math.round(t.weight)} kg</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Distance</span><span className='agv-drawer-value'>{t.distance} m</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Est. Time</span><span className='agv-drawer-value'>{t.estimatedTime} min</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Actual Time</span><span className='agv-drawer-value'>{t.actualTime ? `${t.actualTime} min` : '—'}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Assigned By</span><span className='agv-drawer-value'>{t.assignedBy}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Created</span><span className='agv-drawer-value'>{t.created}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Started</span><span className='agv-drawer-value'>{t.started}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Completed</span><span className='agv-drawer-value'>{t.completed || '—'}</span></div>
          </div>
          <div className='agv-drawer-actions'>
            <button className='agv-action-btn agv-action-primary'><Play size={14} /> Resume</button>
            <button className='agv-action-btn agv-action-secondary'><RefreshCw size={14} /> Reassign</button>
            <button className='agv-action-btn agv-action-secondary'><Square size={14} /> Cancel</button>
            <button className='agv-action-btn agv-action-ghost'><Eye size={14} /> Track</button>
          </div>
        </div>
      </div>
      </>
    )
  }

  // =====================================================
  // CHARGING STATION DETAIL DRAWER
  // =====================================================
  const renderStationDrawer = () => {
    if (!selectedStation) return null
    const st = selectedStation
    return (
      <>
      <div className='agv-drawer-overlay' onClick={() => setSelectedStation(null)} />
      <div className='agv-drawer-panel'>
        <div className='agv-drawer-header' style={{ background: 'linear-gradient(135deg, #06b6d4, #0e7490)' }}>
          <div className='agv-drawer-header-top'>
            <div className='agv-drawer-header-info'>
              <Zap size={24} className='agv-drawer-header-icon' />
              <div>
                <div className='agv-drawer-title'>{st.name}</div>
                <div className='agv-drawer-subtitle'>{st.id} · {st.status}</div>
              </div>
            </div>
            <button className='agv-drawer-close' onClick={() => setSelectedStation(null)}><XCircle size={20} /></button>
          </div>
        </div>
        <div className='agv-drawer-body'>
          <div className='agv-drawer-grid'>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Warehouse</span><span className='agv-drawer-value'>{st.warehouse}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Zone</span><span className='agv-drawer-value'>{st.zone}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Status</span><span className='agv-drawer-value' style={{ color: st.status === 'online' ? '#22c55e' : '#f59e0b' }}>{st.status}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Power Output</span><span className='agv-drawer-value'>{st.powerOutput} kW</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Avg Charge Time</span><span className='agv-drawer-value'>{st.avgChargeTime} min</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Total Charges</span><span className='agv-drawer-value'>{st.totalCharges.toLocaleString()}</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Efficiency</span><span className='agv-drawer-value'>{st.efficiency}%</span></div>
            <div className='agv-drawer-field'><span className='agv-drawer-label'>Last Maintenance</span><span className='agv-drawer-value'>{st.lastMaintenance}</span></div>
          </div>
          <div className='agv-drawer-section-title'>Slots ({st.occupiedSlots}/{st.totalSlots})</div>
          <div className='agv-slot-bar-track agv-slot-bar-track-lg'>
            {Array.from({ length: st.totalSlots }, (_, i) => (
              <div key={i} className='agv-slot-indicator agv-slot-indicator-lg' style={{ background: i < st.occupiedSlots ? '#06b6d4' : '#1e293b' }} />
            ))}
          </div>
          <div className='agv-drawer-actions'>
            <button className='agv-action-btn agv-action-primary'><Play size={14} /> Start Session</button>
            <button className='agv-action-btn agv-action-secondary'><Wrench size={14} /> Maintenance</button>
            <button className='agv-action-btn agv-action-ghost'><RefreshCw size={14} /> Diagnostics</button>
          </div>
        </div>
      </div>
      </>
    )
  }


  const renderTab = () => {
    switch (activeTab) {
      case 0: return renderDashboard()
      case 1: return renderFleet()
      case 2: return renderTasks()
      case 3: return renderCharging()
      case 4: return renderPathsAlerts()
      default: return null
    }
  }

  return (
    <div className='agv-container'>
      <div className='agv-page-header'>
        <div className='agv-page-title-row'>
          <Bot size={28} style={{ color: THEME.primary }} />
          <div>
            <h1 className='agv-page-title'>AGV Fleet Management</h1>
            <p className='agv-page-subtitle'>Automated Guided Vehicle Fleet Operations · Real-time Monitoring & Control</p>
          </div>
        </div>
        <div className='agv-header-stats'>
          <span className='agv-header-stat'><Bot size={14} />{data.agvs.length} Vehicles</span>
          <span className='agv-header-stat'><Package size={14} />{data.tasks.length} Tasks</span>
          <span className='agv-header-stat'><Zap size={14} />{data.stations.length} Stations</span>
          <span className='agv-header-stat'><AlertTriangle size={14} />{data.alerts.length} Alerts</span>
        </div>
      </div>

      <div className='agv-tabs'>
        {tabs.map((tab, i) => (
          <button key={tab} className={`agv-tab ${activeTab === i ? 'agv-tab-active' : ''}`} onClick={() => { setActiveTab(i); setCurrentPage(1); setTaskPage(1); setStatusFilter('all'); setTypeFilter('all'); setPriorityFilter('all'); setSearchQuery('') }}>
            {tab}
          </button>
        ))}
      </div>

      {renderTab()}

      {renderAGDDrawer()}
      {renderTaskDrawer()}
      {renderStationDrawer()}
    </div>
  )
}
