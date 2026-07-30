'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  ShieldAlert, ShieldCheck, ShieldX, TriangleAlert, CheckCircle2, XCircle,
  Thermometer, Activity, MapPin, Clock, BarChart3, TrendingUp, TrendingDown,
  Eye, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Wrench, Play, Pause, RefreshCw, Filter,
  Signal, Gauge, Cpu, ArrowUpDown,
  FireExtinguisher, HardHat, Flame, Siren, HeartPulse, Zap,
  Users, FileText, CalendarDays, AlertTriangle, ClipboardCheck, CircleDot, Award, BookOpen
} from 'lucide-react'
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, BarChart
} from 'recharts'

// ============================================================
// TYPES
// ============================================================

interface SafetyIncident {
  id: string; type: string; severity: string;
  warehouse: string; zone: string;
  title: string; description: string;
  reportedBy: string; reportedAt: string;
  status: string; rootCause: string;
  correctiveAction: string;
  injuredCount: number; nearMiss: boolean;
  resolvedAt: string | null;
  complianceRef: string;
  riskScore: number;
}

interface ComplianceAudit {
  id: string; name: string; type: string;
  warehouse: string; auditor: string;
  status: string; score: number;
  totalChecks: number; passedChecks: number;
  failedChecks: number; criticalFinds: number;
  scheduledDate: string; completedDate: string | null;
  nextAudit: string; category: string;
}

interface SafetyEquipment {
  id: string; name: string; type: string;
  warehouse: string; zone: string;
  status: string; lastInspection: string;
  nextInspection: string; expiryDate: string;
  complianceStatus: string;
  condition: number;
}

interface TrainingRecord {
  id: string; course: string; type: string;
  warehouse: string; instructor: string;
  status: string; attendees: number;
  completedAttendees: number; passRate: number;
  scheduledDate: string; duration: number;
  certification: string;
}

interface SafetyInspection {
  id: string; area: string; type: string;
  warehouse: string; inspector: string;
  status: string; score: number;
  totalItems: number; passedItems: number;
  failedItems: number; findings: string;
  completedDate: string;
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

function generateData() {
  const rng = seededRandom(168168)
  const r = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
  const rf = (min: number, max: number) => +(rng() * (max - min) + min).toFixed(1)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)]

  const warehouses = ['WH-Mumbai-01','WH-Delhi-02','WH-Bengaluru-03','WH-Chennai-04','WH-Hyderabad-05','WH-Pune-06','WH-Kolkata-07','WH-Jaipur-08']
  const zones = ['Zone-A','Zone-B','Zone-C','Zone-D','Zone-E']
  const incidentTypes = ['Slip/Trip/Fall','Forklift Incident','Fire/Smoke','Chemical Spill','Equipment Malfunction','Electrical Hazard','Fall from Height','Confined Space','Manual Handling','Vehicle Collision']
  const severities = ['critical','major','minor','near-miss']
  const incidentStatuses = ['open','investigating','resolved','closed','escalated']
  const auditTypes = ['Safety Compliance','Fire Safety','Environmental','OSHA','ISO 45001','Internal Audit']
  const auditCategories = ['regulatory','voluntary','internal','customer']
  const equipmentTypes = ['Fire Extinguisher','First Aid Kit','Safety Harness','Hard Hat','Safety Goggles','Emergency Exit Sign','Smoke Detector','Sprinkler System','Spill Kit','AED Defibrillator']
  const courseTypes = ['Fire Safety','Forklift Operation','First Aid','Chemical Handling','Fall Protection','PPE Usage','Emergency Evacuation','Hazard Communication']
  const inspectionTypes = ['Daily Safety Walk','Weekly Inspection','Monthly Audit','Annual Review','Spot Check']
  const auditStatuses = ['scheduled','in_progress','completed','overdue']
  const complianceStatuses = ['compliant','non-compliant','expiring','pending']
  const inspectors = ['Inspector-01','Inspector-02','Inspector-03','Inspector-04']
  const auditors = ['Auditor-Alpha','Auditor-Beta','Auditor-Gamma','Auditor-Delta']
  const instructors = ['Trainer-01','Trainer-02','Trainer-03']
  const regulations = ['OSHA 1910','Factories Act 1948','BIS Standards','ISO 45001:2018','NFPA 101','MSHA Regulations']

  const incidents: SafetyIncident[] = Array.from({ length: 60 }, (_, i) => {
    const st = pick(incidentStatuses)
    const sev = pick(severities)
    return {
      id: `INC-${String(i + 1).padStart(4, '0')}`,
      type: pick(incidentTypes),
      severity: sev,
      warehouse: pick(warehouses),
      zone: pick(zones),
      title: `${pick(incidentTypes)} in ${pick(zones).replace('Zone-','Zone ')}`,
      description: `${pick(incidentTypes)} reported during operations. ${sev === 'near-miss' ? 'No injury — near miss event.' : 'Investigation ' + st + '.'}`,
      reportedBy: `Employee-${String(r(100, 500)).padStart(4,'0')}`,
      reportedAt: `${r(1,90)} days ago`,
      status: st,
      rootCause: st !== 'open' ? pick(['Equipment failure','Human error','Process gap','Environmental','Training deficiency']) : '—',
      correctiveAction: st !== 'open' ? pick(['Replace equipment','Update SOP','Additional training','Install guard','Repair required']) : '—',
      injuredCount: sev === 'near-miss' ? 0 : sev === 'minor' ? r(0, 1) : r(1, 3),
      nearMiss: sev === 'near-miss',
      resolvedAt: st === 'resolved' || st === 'closed' ? `${r(1,30)} days ago` : null,
      complianceRef: pick(regulations),
      riskScore: sev === 'critical' ? r(80, 100) : sev === 'major' ? r(50, 79) : sev === 'minor' ? r(20, 49) : r(5, 19),
    }
  })

  const audits: ComplianceAudit[] = Array.from({ length: 30 }, (_, i) => {
    const st = pick(auditStatuses)
    const total = r(20, 80)
    const passed = st === 'completed' ? r(Math.floor(total * 0.6), total) : st === 'in_progress' ? r(10, total) : r(0, 10)
    return {
      id: `AUD-${String(i + 1).padStart(4, '0')}`,
      name: `${pick(auditTypes)} — ${pick(warehouses).replace('WH-','')}`,
      type: pick(auditTypes),
      warehouse: pick(warehouses),
      auditor: pick(auditors),
      status: st,
      score: st === 'completed' ? r(55, 98) : st === 'in_progress' ? r(30, 80) : 0,
      totalChecks: total,
      passedChecks: passed,
      failedChecks: st === 'completed' ? total - passed : 0,
      criticalFinds: st === 'completed' ? r(0, 5) : 0,
      scheduledDate: `${r(1,60)} days ago`,
      completedDate: st === 'completed' ? `${r(1,30)} days ago` : null,
      nextAudit: `${r(10,180)} days`,
      category: pick(auditCategories),
    }
  })

  const equipment: SafetyEquipment[] = Array.from({ length: 80 }, (_, i) => {
    const cs = pick(complianceStatuses)
    return {
      id: `EQ-${String(i + 1).padStart(4, '0')}`,
      name: `${pick(equipmentTypes)}-${String(i + 1).padStart(3,'0')}`,
      type: pick(equipmentTypes),
      warehouse: pick(warehouses),
      zone: pick(zones),
      status: cs === 'non-compliant' ? 'flagged' : cs === 'expiring' ? 'warning' : 'ok',
      lastInspection: `${r(1,60)} days ago`,
      nextInspection: `${r(1,90)} days`,
      expiryDate: `${r(1,365)} days`,
      complianceStatus: cs,
      condition: rf(40, 100),
    }
  })

  const trainings: TrainingRecord[] = Array.from({ length: 25 }, (_, i) => {
    const st = pick(['completed','in_progress','scheduled','cancelled'])
    const att = r(10, 60)
    return {
      id: `TRN-${String(i + 1).padStart(4, '0')}`,
      course: pick(courseTypes),
      type: pick(['mandatory','refresher','certification','induction']),
      warehouse: pick(warehouses),
      instructor: pick(instructors),
      status: st,
      attendees: att,
      completedAttendees: st === 'completed' ? att : st === 'in_progress' ? r(5, att) : 0,
      passRate: st === 'completed' ? r(70, 100) : 0,
      scheduledDate: `${r(1,30)} days ago`,
      duration: r(30, 480),
      certification: pick(['OSHA 10-Hour','OSHA 30-Hour','First Aid Cert','Forklift License','Fire Warden','Chemical Handler']),
    }
  })

  const inspections: SafetyInspection[] = Array.from({ length: 20 }, (_, i) => {
    const st = pick(['completed','completed','completed','in_progress','scheduled'])
    const total = r(15, 50)
    const passed = st === 'completed' ? r(Math.floor(total * 0.7), total) : r(5, total)
    return {
      id: `INSP-${String(i + 1).padStart(4, '0')}`,
      area: pick(zones),
      type: pick(inspectionTypes),
      warehouse: pick(warehouses),
      inspector: pick(inspectors),
      status: st,
      score: st === 'completed' ? r(60, 100) : 0,
      totalItems: total,
      passedItems: passed,
      failedItems: total - passed,
      findings: pick(['No critical findings','Minor issues found','Guardrail damaged','Lighting insufficient','Spill kit expired','Exit blocked','Signage missing','PPE non-compliance']),
      completedDate: st === 'completed' ? `${r(1,15)} days ago` : '—',
    }
  })

  // KPIs
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating' || i.status === 'escalated').length
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length
  const avgAuditScore = +(audits.filter(a => a.status === 'completed').reduce((s, a) => s + a.score, 0) / Math.max(audits.filter(a => a.status === 'completed').length, 1)).toFixed(1)
  const nonCompliantEquip = equipment.filter(e => e.complianceStatus === 'non-compliant').length
  const daysWithoutIncident = r(12, 120)
  const trainingCompletion = +((trainings.filter(t => t.status === 'completed').length / trainings.length) * 100).toFixed(1)

  // Monthly incident trend
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    incidents: r(3, 18),
    resolved: r(2, 16),
    nearMisses: r(1, 8),
    trainingHours: r(20, 120),
    auditScore: r(60, 98),
  }))

  // Incident type distribution
  const typeCounts: Record<string, number> = {}
  incidents.forEach(i => { typeCounts[i.type] = (typeCounts[i.type] || 0) + 1 })
  const typePieData = Object.entries(typeCounts).map(([name, value]) => ({ name: name.split('/')[0], value }))

  // Severity distribution
  const severityDist = severities.map(s => ({ severity: s, count: incidents.filter(i => i.severity === s).length }))

  // Warehouse safety radar
  const whSafetyRadar = warehouses.slice(0, 6).map(wh => {
    const whInc = incidents.filter(i => i.warehouse === wh)
    const whAud = audits.filter(a => a.warehouse === wh && a.status === 'completed')
    return {
      warehouse: wh.replace('WH-', '').replace('-0', ' #'),
      safety: Math.max(0, 100 - whInc.filter(i => i.severity === 'critical').length * 15),
      compliance: +((whAud.reduce((s, a) => s + a.score, 0) / Math.max(whAud.length, 1))).toFixed(0),
      training: r(55, 95),
      equipment: r(60, 98),
    }
  })

  // Equipment compliance chart
  const equipCompliance = complianceStatuses.map((cs: string) => ({
    status: cs, count: equipment.filter(e => e.complianceStatus === cs).length
  }))

  return {
    incidents, audits, equipment, trainings, inspections,
    monthlyData, typePieData, severityDist, whSafetyRadar, equipCompliance,
    openIncidents, criticalIncidents, avgAuditScore, nonCompliantEquip, daysWithoutIncident, trainingCompletion,
    severities, incidentStatuses, incidentTypes, auditTypes, auditCategories, auditStatuses,
    complianceStatuses, equipmentTypes, courseTypes, inspectionTypes, warehouses,
}
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6']
const THEME = { primary: '#ef4444', secondary: '#22c55e', accent: '#f97316', info: '#06b6d4', success: '#22c55e', danger: '#ef4444', warning: '#f97316' }

export default function WarehouseSafetyComplianceView() {
  const data = useMemo(() => generateData(), [])
  const [activeTab, setActiveTab] = useState(0)
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(null)
  const [selectedAudit, setSelectedAudit] = useState<ComplianceAudit | null>(null)
  const [selectedEquip, setSelectedEquip] = useState<SafetyEquipment | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [equipFilter, setEquipFilter] = useState('all')
  const [sortField, setSortField] = useState<string>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [eqPage, setEqPage] = useState(1)
  const rowsPerPage = 15

  const [currentTime, setCurrentTime] = useState('')
  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }))
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  const filteredIncidents = useMemo(() => {
    let list = data.incidents.filter(i => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false
      if (severityFilter !== 'all' && i.severity !== severityFilter) return false
      if (searchQuery && !i.id.toLowerCase().includes(searchQuery.toLowerCase()) && !i.title.toLowerCase().includes(searchQuery.toLowerCase()) && !i.warehouse.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    list.sort((a, b) => {
      const aVal = (a as any)[sortField]; const bVal = (b as any)[sortField]
      if (typeof aVal === 'string') return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
    return list
  }, [data, statusFilter, severityFilter, searchQuery, sortField, sortDir])

  const filteredEquip = useMemo(() => {
    return data.equipment.filter(e => {
      if (equipFilter !== 'all' && e.complianceStatus !== equipFilter) return false
      if (typeFilter !== 'all' && e.type !== typeFilter) return false
      if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) && !e.warehouse.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [data, equipFilter, typeFilter, searchQuery])

  const paginated = filteredIncidents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  const paginatedEq = filteredEquip.slice((eqPage - 1) * rowsPerPage, eqPage * rowsPerPage)
  const totalPages = Math.ceil(filteredIncidents.length / rowsPerPage)
  const totalEqPages = Math.ceil(filteredEquip.length / rowsPerPage)
  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const tabs = ['Dashboard', 'Incident Tracker', 'Compliance Audits', 'Safety Equipment', 'Training & Inspections']

  const severityColor = (s: string) => { const map: Record<string, string> = { critical: '#ef4444', major: '#f97316', minor: '#eab308', 'near-miss': '#06b6d4', open: '#ef4444', investigating: '#f97316', resolved: '#22c55e', closed: '#6b7280', escalated: '#dc2626', scheduled: '#06b6d4', in_progress: '#f97316', completed: '#22c55e', overdue: '#ef4444', compliant: '#22c55e', 'non-compliant': '#ef4444', expiring: '#f97316', pending: '#6b7280', mandatory: '#ef4444', refresher: '#f97316', certification: '#8b5cf6', induction: '#06b6d4', regulatory: '#ef4444', voluntary: '#06b6d4', internal: '#8b5cf6', customer: '#f97316' }; return map[s] || '#6b7280' }

  // TAB 0: DASHBOARD
  const renderDashboard = () => (
    <div className='saf-tab-content'>
      <div className='saf-clock-row'><ShieldAlert size={18} style={{ color: THEME.primary }} /><span className='saf-live-dot' /><span className='saf-clock-text'>Live — {currentTime} IST</span></div>
      <div className='saf-kpi-grid'>
        {[{ label: 'Open Incidents', value: data.openIncidents, icon: <TriangleAlert size={20} />, color: '#ef4444' },{ label: 'Critical', value: data.criticalIncidents, icon: <Siren size={20} />, color: '#dc2626' },{ label: 'Days Safe', value: data.daysWithoutIncident, icon: <ShieldCheck size={20} />, color: '#22c55e' },{ label: 'Avg Audit Score', value: `${data.avgAuditScore}%`, icon: <ClipboardCheck size={20} />, color: '#06b6d4' },{ label: 'Non-Compliant Equip', value: data.nonCompliantEquip, icon: <ShieldX size={20} />, color: '#f97316' },{ label: 'Training Rate', value: `${data.trainingCompletion}%`, icon: <Award size={20} />, color: '#8b5cf6' }].map((k, i) => (
          <div key={i} className='saf-kpi-card' style={{ borderTopColor: k.color }}>
            <div className='saf-kpi-icon' style={{ background: `${k.color}15`, color: k.color }}>{k.icon}</div>
            <div className='saf-kpi-body'><span className='saf-kpi-value'>{k.value}</span><span className='saf-kpi-label'>{k.label}</span></div>
          </div>
        ))}
      </div>

      <div className='saf-charts-row'>
        <div className='saf-chart-card saf-chart-wide'>
          <div className='saf-chart-header'><h4 className='saf-chart-title'>Monthly Safety Trend</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <ComposedChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#1e293b' />
              <XAxis dataKey='month' stroke='#64748b' tick={{ fontSize: 10 }} />
              <YAxis yAxisId='left' stroke='#64748b' tick={{ fontSize: 10 }} />
              <YAxis yAxisId='right' orientation='right' stroke='#64748b' tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId='left' dataKey='incidents' fill='#ef4444' radius={[4, 4, 0, 0]} name='Incidents' />
              <Bar yAxisId='left' dataKey='resolved' fill='#22c55e' radius={[4, 4, 0, 0]} name='Resolved' />
              <Line yAxisId='right' dataKey='auditScore' stroke='#06b6d4' strokeWidth={2} dot={false} name='Audit Score' />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className='saf-chart-card'>
          <div className='saf-chart-header'><h4 className='saf-chart-title'>Incident Types</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <PieChart>
              <Pie data={data.typePieData} cx='50%' cy='50%' outerRadius={80} innerRadius={45} dataKey='value' label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#475569' }}>
                {data.typePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className='saf-charts-row'>
        <div className='saf-chart-card'>
          <div className='saf-chart-header'><h4 className='saf-chart-title'>Warehouse Safety Radar</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <RadarChart data={data.whSafetyRadar}>
              <PolarGrid stroke='#334155' />
              <PolarAngleAxis dataKey='warehouse' stroke='#94a3b8' tick={{ fontSize: 10 }} />
              <PolarRadiusAxis stroke='#475569' tick={{ fontSize: 9 }} />
              <Radar name='Safety' dataKey='safety' stroke='#ef4444' fill='#ef444430' strokeWidth={2} />
              <Radar name='Compliance' dataKey='compliance' stroke='#22c55e' fill='#22c55e30' strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className='saf-chart-card'>
          <div className='saf-chart-header'><h4 className='saf-chart-title'>Equipment Compliance</h4></div>
          <ResponsiveContainer width='100%' height={260}>
            <BarChart data={data.equipCompliance}>
              <CartesianGrid strokeDasharray='3 3' stroke='#1e293b' />
              <XAxis dataKey='status' stroke='#64748b' tick={{ fontSize: 10 }} />
              <YAxis stroke='#64748b' tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              <Bar dataKey='count' radius={[6, 6, 0, 0]}>
                {data.equipCompliance.map((entry, i) => <Cell key={i} fill={['#22c55e','#ef4444','#f97316','#6b7280'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  const renderIncidents = () => (
    <div className='saf-tab-content'>
      <div className='saf-filter-row'>
        <div className='saf-search-box'><input type='text' placeholder='Search incident ID, title, warehouse...' value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} className='saf-search-input' /></div>
        <div className='saf-filter-pills'>
          <button className={`saf-pill ${severityFilter === 'all' ? 'saf-pill-active' : ''}`} onClick={() => setSeverityFilter('all')}>All</button>
          {data.severities.map(s => (<button key={s} className={`saf-pill ${severityFilter === s ? 'saf-pill-active' : ''}`} style={severityFilter === s ? { background: severityColor(s), borderColor: severityColor(s) } : {}} onClick={() => setSeverityFilter(s)}>{s}</button>))}
        </div>
        <div className='saf-filter-pills'>
          <button className={`saf-pill ${statusFilter === 'all' ? 'saf-pill-active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
          {data.incidentStatuses.map(s => (<button key={s} className={`saf-pill ${statusFilter === s ? 'saf-pill-active' : ''}`} onClick={() => setStatusFilter(s)}>{s}</button>))}
        </div>
      </div>
      <div className='saf-fleet-stats'><span>Total: <b>{filteredIncidents.length}</b></span><span>Open: <b>{filteredIncidents.filter(i => i.status === 'open').length}</b></span><span>Critical: <b>{filteredIncidents.filter(i => i.severity === 'critical').length}</b></span><span>Page {currentPage}/{totalPages}</span></div>
      <div className='saf-table-wrapper'>
        <table className='saf-table'><thead><tr>
          <th onClick={() => toggleSort('id')} className='saf-th-sortable'>ID {sortField === 'id' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}</th>
          <th>Type</th><th>Severity</th><th>Status</th><th>Warehouse</th><th>Zone</th><th>Risk</th><th>Injuries</th><th>Near Miss</th><th>Reported</th><th>Action</th>
        </tr></thead><tbody>
        {paginated.map(inc => (
          <tr key={inc.id} className='saf-table-row' style={{ borderLeftColor: severityColor(inc.severity) }}>
            <td className='saf-td-id'><ShieldAlert size={14} style={{ color: severityColor(inc.severity), marginRight: 6 }} />{inc.id}</td>
            <td><span className='saf-type-badge'>{inc.type}</span></td>
            <td><span className='saf-status-badge' style={{ background: `${severityColor(inc.severity)}20`, color: severityColor(inc.severity) }}>{inc.severity}</span></td>
            <td><span className='saf-status-badge' style={{ background: `${severityColor(inc.status)}20`, color: severityColor(inc.status) }}>{inc.status}</span></td>
            <td style={{ fontSize: 11 }}>{inc.warehouse.replace('WH-','')}</td>
            <td>{inc.zone}</td>
            <td><div className='saf-bar-cell'><div className='saf-bar-track'><div className='saf-bar-fill' style={{ width: `${inc.riskScore}%`, background: inc.riskScore > 70 ? '#ef4444' : inc.riskScore > 40 ? '#f97316' : '#22c55e' }} /></div><span className='saf-bar-text'>{inc.riskScore}</span></div></td>
            <td style={{ color: inc.injuredCount > 0 ? '#ef4444' : '#22c55e' }}>{inc.injuredCount}</td>
            <td>{inc.nearMiss ? <CheckCircle2 size={14} style={{ color: '#06b6d4' }} /> : '—'}</td>
            <td style={{ fontSize: 11 }}>{inc.reportedAt}</td>
            <td><button className='saf-view-btn' onClick={() => setSelectedIncident(inc)}><Eye size={14} /></button></td>
          </tr>
        ))}
        </tbody></table>
      </div>
      <div className='saf-pagination'>
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} className='saf-page-btn'><ChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => <button key={i} className={`saf-page-btn ${currentPage === i + 1 ? 'saf-page-active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>)}
        <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className='saf-page-btn'><ChevronRight size={16} /></button>
      </div>
    </div>
  )

  const renderAudits = () => (
    <div className='saf-tab-content'>
      <div className='saf-kpi-grid'>
        <div className='saf-kpi-card' style={{ borderTopColor: '#06b6d4' }}><div className='saf-kpi-icon' style={{ background: '#06b6d415', color: '#06b6d4' }}><ClipboardCheck size={20} /></div><div className='saf-kpi-body'><span className='saf-kpi-value'>{data.audits.length}</span><span className='saf-kpi-label'>Total Audits</span></div></div>
        <div className='saf-kpi-card' style={{ borderTopColor: '#22c55e' }}><div className='saf-kpi-icon' style={{ background: '#22c55e15', color: '#22c55e' }}><CheckCircle2 size={20} /></div><div className='saf-kpi-body'><span className='saf-kpi-value'>{data.audits.filter(a => a.status === 'completed').length}</span><span className='saf-kpi-label'>Completed</span></div></div>
        <div className='saf-kpi-card' style={{ borderTopColor: '#f97316' }}><div className='saf-kpi-icon' style={{ background: '#f9731615', color: '#f97316' }}><AlertTriangle size={20} /></div><div className='saf-kpi-body'><span className='saf-kpi-value'>{data.audits.filter(a => a.status === 'overdue').length}</span><span className='saf-kpi-label'>Overdue</span></div></div>
        <div className='saf-kpi-card' style={{ borderTopColor: '#8b5cf6' }}><div className='saf-kpi-icon' style={{ background: '#8b5cf615', color: '#8b5cf6' }}><BarChart3 size={20} /></div><div className='saf-kpi-body'><span className='saf-kpi-value'>{data.avgAuditScore}%</span><span className='saf-kpi-label'>Avg Score</span></div></div>
      </div>
      <div className='saf-audit-grid'>
        {data.audits.map(aud => {
          const progress = aud.totalChecks > 0 ? (aud.passedChecks / aud.totalChecks) * 100 : 0
          return (
            <div key={aud.id} className='saf-audit-card' style={{ borderTopColor: severityColor(aud.status) }}>
              <div className='saf-audit-header'>
                <span className='saf-audit-id'>{aud.id}</span>
                <span className='saf-audit-status' style={{ background: `${severityColor(aud.status)}20`, color: severityColor(aud.status) }}>{aud.status}</span>
                <span className='saf-audit-cat' style={{ color: severityColor(aud.category) }}>{aud.category}</span>
              </div>
              <div className='saf-audit-name'>{aud.name}</div>
              <div className='saf-audit-score-section'>
                {aud.status === 'completed' && <><div className='saf-audit-score-circle' style={{ borderColor: aud.score > 85 ? '#22c55e' : aud.score > 60 ? '#f97316' : '#ef4444' }}><span className='saf-audit-score-value'>{aud.score}%</span></div></>}
                <div className='saf-audit-progress'>
                  <div className='saf-audit-progress-label'>Checks: {aud.passedChecks}/{aud.totalChecks} passed</div>
                  <div className='saf-progress-track'><div className='saf-progress-fill' style={{ width: `${progress}%`, background: '#22c55e' }} /></div>
                </div>
              </div>
              {aud.criticalFinds > 0 && <div className='saf-audit-finds'><TriangleAlert size={12} style={{ color: '#ef4444' }} /><span>{aud.criticalFinds} critical findings</span></div>}
              <div className='saf-audit-meta'><span>{aud.warehouse.replace('WH-','')}</span><span>{aud.type}</span><span>Next: {aud.nextAudit}</span></div>
              <button className='saf-card-action-btn' onClick={() => setSelectedAudit(aud)}><Eye size={14} /> View Details</button>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderEquipment = () => (
    <div className='saf-tab-content'>
      <div className='saf-filter-row'>
        <div className='saf-search-box'><input type='text' placeholder='Search equipment, warehouse...' value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setEqPage(1) }} className='saf-search-input' /></div>
        <div className='saf-filter-pills'>
          <button className={`saf-pill ${equipFilter === 'all' ? 'saf-pill-active' : ''}`} onClick={() => setEquipFilter('all')}>All</button>
          {data.complianceStatuses.map(s => (<button key={s} className={`saf-pill ${equipFilter === s ? 'saf-pill-active' : ''}`} style={equipFilter === s ? { background: severityColor(s), borderColor: severityColor(s) } : {}} onClick={() => setEquipFilter(s)}>{s}</button>))}
        </div>
      </div>
      <div className='saf-fleet-stats'><span>Total: <b>{filteredEquip.length}</b></span><span>Non-Compliant: <b>{filteredEquip.filter(e => e.complianceStatus === 'non-compliant').length}</b></span><span>Expiring: <b>{filteredEquip.filter(e => e.complianceStatus === 'expiring').length}</b></span><span>Page {eqPage}/{totalEqPages}</span></div>
      <div className='saf-table-wrapper'>
        <table className='saf-table'><thead><tr><th>Equipment</th><th>Type</th><th>Status</th><th>Condition</th><th>Warehouse</th><th>Zone</th><th>Last Inspection</th><th>Expiry</th><th>Action</th></tr></thead><tbody>
        {paginatedEq.map(eq => (
          <tr key={eq.id} className='saf-table-row' style={{ borderLeftColor: severityColor(eq.complianceStatus) }}>
            <td className='saf-td-id'><FireExtinguisher size={14} style={{ color: severityColor(eq.complianceStatus), marginRight: 6 }} />{eq.id}</td>
            <td><span className='saf-type-badge'>{eq.type}</span></td>
            <td><span className='saf-status-badge' style={{ background: `${severityColor(eq.complianceStatus)}20`, color: severityColor(eq.complianceStatus) }}>{eq.complianceStatus}</span></td>
            <td><div className='saf-bar-cell'><div className='saf-bar-track'><div className='saf-bar-fill' style={{ width: `${eq.condition}%`, background: eq.condition > 70 ? '#22c55e' : eq.condition > 40 ? '#f97316' : '#ef4444' }} /></div><span className='saf-bar-text'>{eq.condition}%</span></div></td>
            <td style={{ fontSize: 11 }}>{eq.warehouse.replace('WH-','')}</td>
            <td>{eq.zone}</td>
            <td style={{ fontSize: 11 }}>{eq.lastInspection}</td>
            <td style={{ fontSize: 11 }}>{eq.expiryDate}</td>
            <td><button className='saf-view-btn' onClick={() => setSelectedEquip(eq)}><Eye size={14} /></button></td>
          </tr>
        ))}
        </tbody></table>
      </div>
      <div className='saf-pagination'>
        <button disabled={eqPage <= 1} onClick={() => setEqPage(p => p - 1)} className='saf-page-btn'><ChevronLeft size={16} /></button>
        {Array.from({ length: Math.min(totalEqPages, 8) }, (_, i) => <button key={i} className={`saf-page-btn ${eqPage === i + 1 ? 'saf-page-active' : ''}`} onClick={() => setEqPage(i + 1)}>{i + 1}</button>)}
        <button disabled={eqPage >= totalEqPages} onClick={() => setEqPage(p => p + 1)} className='saf-page-btn'><ChevronRight size={16} /></button>
      </div>
    </div>
  )

  const renderTraining = () => (
    <div className='saf-tab-content'>
      <div className='saf-section-header'><Award size={18} style={{ color: '#8b5cf6' }} /><h3 className='saf-section-title'>Safety Training Programs ({data.trainings.length})</h3></div>
      <div className='saf-training-grid'>
        {data.trainings.map(tr => (
          <div key={tr.id} className='saf-training-card' style={{ borderLeftColor: severityColor(tr.type) }}>
            <div className='saf-training-header'>
              <BookOpen size={16} style={{ color: '#8b5cf6' }} />
              <span className='saf-training-name'>{tr.course}</span>
              <span className='saf-training-type' style={{ color: severityColor(tr.type) }}>{tr.type}</span>
            </div>
            <div className='saf-training-meta'>
              <span>{tr.warehouse.replace('WH-','')}</span><span>{tr.instructor}</span><span>{tr.duration} min</span>
              <span className='saf-training-cert'>{tr.certification}</span>
            </div>
            <div className='saf-training-progress'>
              <span>Attendees: {tr.completedAttendees}/{tr.attendees}</span>
              <span>Pass Rate: {tr.passRate > 0 ? `${tr.passRate}%` : '—'}</span>
            </div>
            <span className='saf-training-status' style={{ background: `${severityColor(tr.status)}20`, color: severityColor(tr.status) }}>{tr.status}</span>
          </div>
        ))}
      </div>
      <div className='saf-section-header' style={{ marginTop: 24 }}><ClipboardCheck size={18} style={{ color: '#22c55e' }} /><h3 className='saf-section-title'>Safety Inspections ({data.inspections.length})</h3></div>
      <div className='saf-insp-grid'>
        {data.inspections.map(insp => (
          <div key={insp.id} className='saf-insp-card' style={{ borderLeftColor: severityColor(insp.status) }}>
            <div className='saf-insp-header'>
              <span className='saf-insp-id'>{insp.id}</span>
              <span className='saf-insp-status' style={{ background: `${severityColor(insp.status)}20`, color: severityColor(insp.status) }}>{insp.status}</span>
            </div>
            <div className='saf-insp-name'>{insp.type} — {insp.area}</div>
            <div className='saf-insp-meta'><span>{insp.warehouse.replace('WH-','')}</span><span>{insp.inspector}</span></div>
            {insp.status === 'completed' && <div className='saf-insp-score-row'><span>Score:</span><span className='saf-insp-score' style={{ color: insp.score > 85 ? '#22c55e' : insp.score > 60 ? '#f97316' : '#ef4444' }}>{insp.score}%</span><span>({insp.passedItems}/{insp.totalItems})</span></div>}
            <div className='saf-insp-finding'>{insp.findings}</div>
          </div>
        ))}
      </div>
    </div>
  )

  // ---- Incident Drawer ----
  const renderIncidentDrawer = () => {
    if (!selectedIncident) return null
    const i = selectedIncident
    const hBg = i.severity === 'critical' ? 'linear-gradient(135deg, #dc2626, #991b1b)' : i.severity === 'major' ? 'linear-gradient(135deg, #f97316, #c2410c)' : i.severity === 'minor' ? 'linear-gradient(135deg, #eab308, #a16207)' : 'linear-gradient(135deg, #06b6d4, #0e7490)'
    return (<>
      <div className='saf-drawer-overlay' onClick={() => setSelectedIncident(null)} />
      <div className='saf-drawer-panel'>
        <div className='saf-drawer-header' style={{ background: hBg }}>
          <div className='saf-drawer-header-top'>
            <div className='saf-drawer-header-info'><ShieldAlert size={24} className='saf-drawer-header-icon' /><div><div className='saf-drawer-title'>{i.id}</div><div className='saf-drawer-subtitle'>{i.type} · {i.severity}</div></div></div>
            <button className='saf-drawer-close' onClick={() => setSelectedIncident(null)}><XCircle size={20} /></button>
          </div>
          <div className='saf-drawer-badges'><span className='saf-drawer-badge' style={{ background: `${severityColor(i.status)}30`, color: '#fff' }}>{i.status}</span><span className='saf-drawer-badge' style={{ background: '#ffffff20', color: '#fff' }}>{i.nearMiss ? 'NEAR MISS' : `${i.injuredCount} injured`}</span></div>
        </div>
        <div className='saf-drawer-body'>
          <div className='saf-drawer-grid'>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Warehouse</span><span className='saf-drawer-value'>{i.warehouse}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Zone</span><span className='saf-drawer-value'>{i.zone}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Risk Score</span><span className='saf-drawer-value' style={{ color: i.riskScore > 70 ? '#ef4444' : '#22c55e' }}>{i.riskScore}/100</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Compliance Ref</span><span className='saf-drawer-value'>{i.complianceRef}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Reported By</span><span className='saf-drawer-value'>{i.reportedBy}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Reported At</span><span className='saf-drawer-value'>{i.reportedAt}</span></div>
          </div>
          <div className='saf-drawer-section-title'>Description</div>
          <p className='saf-drawer-desc'>{i.description}</p>
          <div className='saf-drawer-section-title'>Investigation</div>
          <div className='saf-drawer-grid'>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Root Cause</span><span className='saf-drawer-value'>{i.rootCause}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Corrective Action</span><span className='saf-drawer-value'>{i.correctiveAction}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Resolved</span><span className='saf-drawer-value'>{i.resolvedAt || '—'}</span></div>
          </div>
          <div className='saf-drawer-actions'><button className='saf-action-btn saf-action-primary'><Play size={14} /> Investigate</button><button className='saf-action-btn saf-action-secondary'><RefreshCw size={14} /> Escalate</button><button className='saf-action-btn saf-action-secondary'><ClipboardCheck size={14} /> Close</button><button className='saf-action-btn saf-action-ghost'><FileText size={14} /> Report</button></div>
        </div>
      </div>
    </>)
  }

  // ---- Audit Drawer ----
  const renderAuditDrawer = () => {
    if (!selectedAudit) return null
    const a = selectedAudit
    return (<>
      <div className='saf-drawer-overlay' onClick={() => setSelectedAudit(null)} />
      <div className='saf-drawer-panel'>
        <div className='saf-drawer-header' style={{ background: 'linear-gradient(135deg, #06b6d4, #0e7490)' }}>
          <div className='saf-drawer-header-top'>
            <div className='saf-drawer-header-info'><ClipboardCheck size={24} className='saf-drawer-header-icon' /><div><div className='saf-drawer-title'>{a.id}</div><div className='saf-drawer-subtitle'>{a.type} · {a.category}</div></div></div>
            <button className='saf-drawer-close' onClick={() => setSelectedAudit(null)}><XCircle size={20} /></button>
          </div>
        </div>
        <div className='saf-drawer-body'>
          <div className='saf-drawer-grid'>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Warehouse</span><span className='saf-drawer-value'>{a.warehouse}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Auditor</span><span className='saf-drawer-value'>{a.auditor}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Status</span><span className='saf-drawer-value' style={{ color: severityColor(a.status) }}>{a.status}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Score</span><span className='saf-drawer-value'>{a.score > 0 ? `${a.score}%` : '—'}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Passed</span><span className='saf-drawer-value'>{a.passedChecks}/{a.totalChecks}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Failed</span><span className='saf-drawer-value' style={{ color: a.failedChecks > 0 ? '#ef4444' : '#22c55e' }}>{a.failedChecks}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Critical Finds</span><span className='saf-drawer-value' style={{ color: a.criticalFinds > 0 ? '#ef4444' : '#22c55e' }}>{a.criticalFinds}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Scheduled</span><span className='saf-drawer-value'>{a.scheduledDate}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Completed</span><span className='saf-drawer-value'>{a.completedDate || '—'}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Next Audit</span><span className='saf-drawer-value'>{a.nextAudit}</span></div>
          </div>
          <div className='saf-drawer-actions'><button className='saf-action-btn saf-action-primary'><Play size={14} /> Start Audit</button><button className='saf-action-btn saf-action-secondary'><FileText size={14} /> Export Report</button></div>
        </div>
      </div>
    </>)
  }

  // ---- Equipment Drawer ----
  const renderEquipDrawer = () => {
    if (!selectedEquip) return null
    const e = selectedEquip
    return (<>
      <div className='saf-drawer-overlay' onClick={() => setSelectedEquip(null)} />
      <div className='saf-drawer-panel'>
        <div className='saf-drawer-header' style={{ background: e.complianceStatus === 'non-compliant' ? 'linear-gradient(135deg, #dc2626, #991b1b)' : e.complianceStatus === 'expiring' ? 'linear-gradient(135deg, #f97316, #c2410c)' : 'linear-gradient(135deg, #22c55e, #15803d)' }}>
          <div className='saf-drawer-header-top'>
            <div className='saf-drawer-header-info'><FireExtinguisher size={24} className='saf-drawer-header-icon' /><div><div className='saf-drawer-title'>{e.id}</div><div className='saf-drawer-subtitle'>{e.name} · {e.type}</div></div></div>
            <button className='saf-drawer-close' onClick={() => setSelectedEquip(null)}><XCircle size={20} /></button>
          </div>
        </div>
        <div className='saf-drawer-body'>
          <div className='saf-drawer-grid'>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Warehouse</span><span className='saf-drawer-value'>{e.warehouse}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Zone</span><span className='saf-drawer-value'>{e.zone}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Compliance</span><span className='saf-drawer-value' style={{ color: severityColor(e.complianceStatus) }}>{e.complianceStatus}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Condition</span><span className='saf-drawer-value'>{e.condition}%</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Last Inspection</span><span className='saf-drawer-value'>{e.lastInspection}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Next Inspection</span><span className='saf-drawer-value'>{e.nextInspection}</span></div>
            <div className='saf-drawer-field'><span className='saf-drawer-label'>Expiry</span><span className='saf-drawer-value'>{e.expiryDate}</span></div>
          </div>
          <div className='saf-drawer-actions'><button className='saf-action-btn saf-action-primary'><Wrench size={14} /> Schedule Inspection</button><button className='saf-action-btn saf-action-secondary'><RefreshCw size={14} /> Replace</button></div>
        </div>
      </div>
    </>)
  }

  const renderTab = () => { switch (activeTab) { case 0: return renderDashboard(); case 1: return renderIncidents(); case 2: return renderAudits(); case 3: return renderEquipment(); case 4: return renderTraining(); default: return null } }

  return (
    <div className='saf-container'>
      <div className='saf-page-header'>
        <div className='saf-page-title-row'><ShieldAlert size={28} style={{ color: THEME.primary }} /><div><h1 className='saf-page-title'>Warehouse Safety & Compliance</h1><p className='saf-page-subtitle'>Incident Management · Safety Audits · Equipment Compliance · Training Programs</p></div></div>
        <div className='saf-header-stats'><span className='saf-header-stat'><ShieldAlert size={14} />{data.incidents.length} Incidents</span><span className='saf-header-stat'><ClipboardCheck size={14} />{data.audits.length} Audits</span><span className='saf-header-stat'><FireExtinguisher size={14} />{data.equipment.length} Equipment</span><span className='saf-header-stat'><Award size={14} />{data.trainings.length} Training</span></div>
      </div>
      <div className='saf-tabs'>{tabs.map((tab, i) => (<button key={tab} className={`saf-tab ${activeTab === i ? 'saf-tab-active' : ''}`} onClick={() => { setActiveTab(i); setCurrentPage(1); setEqPage(1); setStatusFilter('all'); setSeverityFilter('all'); setTypeFilter('all'); setEquipFilter('all'); setSearchQuery('') }}>{tab}</button>))}</div>
      {renderTab()}
      {renderIncidentDrawer()}{renderAuditDrawer()}{renderEquipDrawer()}
    </div>
  )
}
