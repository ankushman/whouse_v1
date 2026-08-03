'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface HYLRecord {
  id: string; projectId: string; city: string; operator: string; liquefierType: string
  capacityTPD: number; investmentCr: number; energyKWhPerKg: number; purity: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#1e40af', '#1e3a8a', '#172554']

const records: HYLRecord[] = [
  { id: 'HYL-0001', projectId: 'HYL-001', city: 'Jamshedpur', operator: 'Tata Steel Hydrogen Liquifier', liquefierType: 'Brazed Plate Heat Exchanger 50TPD',
    capacityTPD: 50, investmentCr: 680, energyKWhPerKg: 12.5, purity: 99.999, status: 'Delivered', priority: 'Critical', origin: 'Tata Steel Green Hydrogen', destination: 'Jamshedpur LH2 Terminal', shipDate: '2025-08-05', transitDays: 1, state: 'Jharkhand',
    remarks: 'Brazed plate heat exchanger hydrogen liquefier at Tata Steel Jamshedpur with 50 TPD capacity producing liquid hydrogen at -253&#176;C for direct reduced ironmaking. 99.999% purity LH2 enables hydrogen-based steel production replacing coking coal. &#8377;680 Cr installation is India&apos;s first large-scale steel sector LH2 plant under Tata Steel&apos;s &#8377;15,000 Cr green steel transition programme achieving zero-carbon steel by 2035.' },
  { id: 'HYL-0002', projectId: 'HYL-002', city: 'Kandla', operator: 'Adani LH2 Kandla Port', liquefierType: 'Turbo-Brayton 100TPD',
    capacityTPD: 100, investmentCr: 1250, energyKWhPerKg: 10.8, purity: 99.998, status: 'Delivered', priority: 'Critical', origin: 'Adani Green H2 Electrolyser', destination: 'Kandla Port LH2 Export', shipDate: '2025-08-10', transitDays: 2, state: 'Gujarat',
    remarks: 'Turbo-Brayton hydrogen liquefier at Adani Kandla port with 100 TPD capacity for LH2 export terminal. World-scale turbo-Brayton cycle achieves 10.8 kWh/kg specific energy consumption 15% lower than conventional Claude cycle. &#8377;1,250 Cr project includes vacuum-insulated LH2 storage tanks and cryogenic loading arms for export to Japan and South Korea under India-GCC-Japan green hydrogen corridor agreement.' },
  { id: 'HYL-0003', projectId: 'HYL-003', city: 'Kochi', operator: 'BPCL Kochi LH2', liquefierType: 'Linde Claude Cycle 30TPD',
    capacityTPD: 30, investmentCr: 420, energyKWhPerKg: 13.2, purity: 99.999, status: 'Delivered', priority: 'High', origin: 'BPCL Kochi Refinery H2', destination: 'Kochi LH2 Distribution', shipDate: '2025-08-02', transitDays: 1, state: 'Kerala',
    remarks: 'Linde Claude cycle hydrogen liquefier at BPCL Kochi refinery with 30 TPD capacity capturing refinery byproduct hydrogen for liquid hydrogen distribution. Claude cycle with expansion turbines achieves -253&#176;C with 99.999% purity suitable for fuel cell electric vehicles. &#8377;420 Cr project supplies LH2 to Kerala mobility corridor including Kochi Metro hydrogen trains and 500 fuel cell buses under Kerala State Road Transport Corporation green public transport programme.' },
  { id: 'HYL-0004', projectId: 'HYL-004', city: 'Mumbai', operator: 'HPCL Mumbai LH2 Hub', liquefierType: 'Reverse Brayton 40TPD',
    capacityTPD: 40, investmentCr: 560, energyKWhPerKg: 11.5, purity: 99.998, status: 'Delivered', priority: 'High', origin: 'HPCL Mumbai Refinery', destination: 'Nhava Sheva LH2 Port', shipDate: '2025-07-28', transitDays: 2, state: 'Maharashtra',
    remarks: 'Reverse Brayton hydrogen liquefier at HPCL Mumbai refinery with 40 TPD capacity for maritime and port fuel supply. Compact reverse Brayton design fits within refinery footprint with lower vibration than turbo-expanders. &#8377;560 Cr installation supplies LH2 to Nhava Sheva and JNPT port for hydrogen-powered container ships and tugs under Ministry of Ports green shipping initiative targeting 50 hydrogen-fueled vessels in Indian waters by 2030.' },
  { id: 'HYL-0005', projectId: 'HYL-005', city: 'Vizag', operator: 'RINL Vizag LH2', liquefierType: 'Pre-Cooled Claude 25TPD',
    capacityTPD: 25, investmentCr: 350, energyKWhPerKg: 12.8, purity: 99.999, status: 'In Transit', priority: 'High', origin: 'RINL Vizag Steel H2', destination: 'Vizag Port LH2 Terminal', shipDate: '2025-08-15', transitDays: 2, state: 'Andhra Pradesh',
    remarks: 'Pre-cooled Claude cycle hydrogen liquefier en route to RINL Vizag steel plant with 25 TPD capacity for green steel pilot production. Liquid nitrogen pre-cooling stage reduces compressor power by 18% versus standard Claude cycle. &#8377;350 Cr project supports RINL&apos;s 2 MTPA green steel pilot using hydrogen direct reduction of iron ore pellets replacing blast furnace coke requirement for Visakhapatnam Steel Plant decarbonization under NMDC-RINL green iron partnership.' },
  { id: 'HYL-0006', projectId: 'HYL-006', city: 'Bengaluru', operator: 'IOCL Devanahalli LH2', liquefierType: 'Pulse Tube Mini 5TPD',
    capacityTPD: 5, investmentCr: 85, energyKWhPerKg: 15.0, purity: 99.9999, status: 'Delivered', priority: 'Medium', origin: 'IOCL Devanahalli Biodiesel', destination: 'Bengaluru HAL Aerospace', shipDate: '2025-08-08', transitDays: 1, state: 'Karnataka',
    remarks: 'Pulse tube mini hydrogen liquefier at IOCL Devanahalli Bengaluru with 5 TPD capacity for ultra-high purity 99.9999% LH2 for aerospace applications. Vibration-free pulse tube cryocoolers eliminate contamination risk for space-grade hydrogen. &#8377;85 Cr installation supplies liquid hydrogen to HAL and ISRO Bengaluru for satellite launch vehicle fuel and fuel cell UAV development under DRDO-ISRO hydrogen propulsion programme for next-generation GSLV and PSLV upper stage engines.' },
  { id: 'HYL-0007', projectId: 'HYL-007', city: 'Gandhinagar', operator: 'GAIL Sabarmati LH2', liquefierType: 'Mixed Refrigerant 60TPD',
    capacityTPD: 60, investmentCr: 780, energyKWhPerKg: 11.2, purity: 99.998, status: 'Delivered', priority: 'Critical', origin: 'GAIL H2 Pipeline', destination: 'Gandhinagar LH2 Hub', shipDate: '2025-07-25', transitDays: 1, state: 'Gujarat',
    remarks: 'Mixed refrigerant hydrogen liquefier at GAIL Sabarmati with 60 TPD capacity integrated with GAIL&apos;s 2,500 km natural gas pipeline hydrogen blending infrastructure. Mixed refrigerant cycle achieves higher thermodynamic efficiency by matching cooling curve to hydrogen specific heat profile. &#8377;780 Cr project enables Gujarat green hydrogen corridor from Kutch electrolyser farms to LH2 export terminals at Kandla and Mundra ports under GAIL&apos;s &#8377;5,000 Cr hydrogen logistics network plan.' },
  { id: 'HYL-0008', projectId: 'HYL-008', city: 'Chennai', operator: 'IOCL Chennai LH2', liquefierType: 'Helium Pre-Cooled 20TPD',
    capacityTPD: 20, investmentCr: 290, energyKWhPerKg: 10.2, purity: 99.9999, status: 'Delivered', priority: 'Medium', origin: 'IOCL Chennai Refinery', destination: 'Chennai Port LH2 Station', shipDate: '2025-08-12', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'Helium pre-cooled hydrogen liquefier at IOCL Chennai refinery with 20 TPD capacity achieving record 10.2 kWh/kg efficiency through helium Brayton pre-cooling to 20K before hydrogen final liquefaction. Ultra-high 99.9999% purity for semiconductor and electronics industry fuel cell backup power. &#8377;290 Cr project supplies LH2 to Chennai semiconductor fab cluster including TATA Electronics and Foxconn facilities for fuel cell UPS systems replacing diesel generators in chip fabrication clean rooms.' },
  { id: 'HYL-0009', projectId: 'HYL-009', city: 'Bhopal', operator: 'BHEL Bhopal LH2', liquefierType: 'Indigenous Claude 35TPD',
    capacityTPD: 35, investmentCr: 460, energyKWhPerKg: 13.5, purity: 99.998, status: 'Delayed', priority: 'High', origin: 'BHEL Bhopal Works', destination: 'Bhopal Industrial LH2', shipDate: '2025-07-15', transitDays: 3, state: 'Madhya Pradesh',
    remarks: 'Indigenous Claude cycle hydrogen liquefier at BHEL Bhopal with 35 TPD capacity delayed by supply chain issue for cryogenic compressor impellers. BHEL-designed and manufactured turbo-expanders and heat exchangers achieving 85% indigenization content. &#8377;460 Cr project demonstrates Indian cryogenic manufacturing capability for strategic hydrogen liquefaction technology reducing import dependency from Linde and Air Liquide by 40% under Atmanirbhar Bharat advanced energy equipment programme.' },
  { id: 'HYL-0010', projectId: 'HYL-010', city: 'Kolkata', operator: 'Haldia LH2 Terminal', liquefierType: 'Modular Brayton 15TPD',
    capacityTPD: 15, investmentCr: 210, energyKWhPerKg: 12.0, purity: 99.999, status: 'Delivered', priority: 'Medium', origin: 'Haldia Petrochemical H2', destination: 'Haldia Port LH2', shipDate: '2025-08-01', transitDays: 1, state: 'West Bengal',
    remarks: 'Modular Brayton hydrogen liquefier at Haldia petrochemical complex with 15 TPD capacity for inland waterway LH2 distribution along Ganga-Bhagirathi-Hooghly river system. Containerized modules enable rapid 6-month deployment versus 24-month site-built alternatives. &#8377;210 Cr project supplies LH2 by barge to Kolkata, Howrah and industrial towns along National Waterway-1 supporting Eastern India green hydrogen adoption for fertilizer plants and refineries in Haldia industrial belt.' },
  { id: 'HYL-0011', projectId: 'HYL-011', city: 'Guwahati', operator: 'OGCL Assam LH2', liquefierType: 'Small Scale Claude 8TPD',
    capacityTPD: 8, investmentCr: 120, energyKWhPerKg: 14.2, purity: 99.998, status: 'Delivered', priority: 'Low', origin: 'Oil India H2 Digboi', destination: 'Guwahati LH2 Station', shipDate: '2025-08-18', transitDays: 4, state: 'Assam',
    remarks: 'Small-scale Claude cycle hydrogen liquefier at Oil India Digboi with 8 TPD capacity for Northeast India hydrogen supply chain. Modular design transportable by road to remote locations in Assam, Arunachal Pradesh and Meghalaya. &#8377;120 Cr pilot under North East Special Infrastructure Development Scheme provides LH2 for Assam tea estate fuel cell generators, Guwahati city buses and defence installations replacing diesel logistics in strategically sensitive border region.' },
  { id: 'HYL-0012', projectId: 'HYL-012', city: 'Jaipur', operator: 'Rajasthan LH2 Solar', liquefierType: 'Solar-Powered Claude 45TPD',
    capacityTPD: 45, investmentCr: 620, energyKWhPerKg: 11.8, purity: 99.999, status: 'Processing', priority: 'Medium', origin: 'Bhadla Solar H2', destination: 'Jaipur LH2 Terminal', shipDate: '2025-08-22', transitDays: 3, state: 'Rajasthan',
    remarks: 'Solar-powered hydrogen liquefier at Bhadla Solar Park with 45 TPD capacity directly coupled to 2 GW solar PV array eliminating grid power dependency for electrolyser and liquefaction energy. &#8377;620 Cr green LH2 project achieves 100% renewable energy content from sun to liquid hydrogen under Rajasthan Green Hydrogen Policy providing direct solar-to-liquid-hydrogen pathway at &#8377;350/kg green LH2 production cost competitive with grey hydrogen at &#8377;200/kg.' },
  { id: 'HYL-0013', projectId: 'HYL-013', city: 'Leh', operator: 'NHPC Leh LH2', liquefierType: 'High Altitude Brayton 3TPD',
    capacityTPD: 3, investmentCr: 65, energyKWhPerKg: 13.8, purity: 99.999, status: 'Delivered', priority: 'High', origin: 'NHPC Leh Hydro H2', destination: 'Leh LH2 Station', shipDate: '2025-08-06', transitDays: 8, state: 'Ladakh',
    remarks: 'High altitude hydrogen liquefier at Leh with 3 TPD capacity operating at 3,500m altitude. Low ambient pressure of 0.65 bar reduces compressor work by 15% improving overall efficiency for Ladakh conditions. &#8377;65 Cr project provides liquid hydrogen storage for Leh military base and civilian winter power replacing diesel helicopter resupply for 6 months annual road closure saving &#8377;50 Cr annual logistics cost for Indian Army Northern Command forward deployments along Siachen-Daulat Beg Oldi sector.' },
  { id: 'HYL-0014', projectId: 'HYL-014', city: 'Noida', operator: 'NTPC Dadri LH2', liquefierType: 'Hybrid Claude-Brayton 70TPD',
    capacityTPD: 70, investmentCr: 920, energyKWhPerKg: 11.0, purity: 99.999, status: 'Delayed', priority: 'Critical', origin: 'NTPC Dadri Green H2', destination: 'Delhi NCR LH2 Hub', shipDate: '2025-07-20', transitDays: 2, state: 'Uttar Pradesh',
    remarks: 'Hybrid Claude-Brayton hydrogen liquefier at NTPC Dadri gas plant with 70 TPD capacity delayed by import delay for helium turbo-expander from Chart Industries USA. Hybrid cycle combines Claude expansion with Brayton pre-cooling for optimal efficiency at 11.0 kWh/kg. &#8377;920 Cr project supplies green LH2 to Delhi NCR for 1,000 fuel cell buses, 50 hydrogen refueling stations and 200 MW fuel cell power backup for Delhi Metro under National Capital Region Clean Air Programme targeting zero-emission public transport by 2030.' },
]

export default function HydrogenLiquefactionLogisticsView() {
  const [tab, setTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (group: string, value: string) => {
    setActiveFilters(prev => {
      const arr = prev[group] || []
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      if (!next.length) { const { [group]: _, ...rest } = prev; return rest }
      return { ...prev, [group]: next }
    })
  }

  const filtered = useMemo(() => {
    let result = records
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)))
    }
    result = result.filter(r =>
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof HYLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'liquefierType', label: 'Liquefier Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.liquefierType] = (m[r.liquefierType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPD, 0).toLocaleString()} TPD` },
    { label: 'Avg Energy Use', value: `${(filtered.reduce((a: number, r) => a + r.energyKWhPerKg, 0) / Math.max(1, filtered.length)).toFixed(1)} kWh/kg` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Purity', value: `${(filtered.reduce((a: number, r) => a + r.purity, 0) / Math.max(1, filtered.length)).toFixed(3)}%` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: HYLRecord) => string, val: (r: HYLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPD)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.liquefierType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.liquefierType.split(' ').slice(0, 2).join(' '), value: r.energyKWhPerKg }))
    const lm = filtered.reduce((a: Record<string, { capacity: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacity: 0, investmentCr: 0 }
      a[r.state].capacity += r.capacityTPD; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacity: v.capacity, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="hyl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Hydrogen Liquefaction' }]} />
      <PageHeader title="Hydrogen Liquefaction Logistics" description="Track hydrogen liquefaction supply chains, LH2 cryogenic plant logistics, liquid hydrogen distribution, and green hydrogen liquefier deployment for steel, mobility, aerospace and port fuel across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="hyl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`hyl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-800 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="hyl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="hyl-kpi-card"><CardContent className="p-4"><p className="hyl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="hyl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="hyl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="hyl-chart-title text-sm">Liquefaction Capacity (TPD) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#1d4ed8" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="hyl-chart-title text-sm">Installations by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="hyl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="hyl-chart-title text-sm">Energy Use (kWh/kg) by Liquefier Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[9, 16]} /><Tooltip /><Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="hyl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="hyl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`hyl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-blue-800'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.liquefierType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPD} TPD | {r.energyKWhPerKg} kWh/kg | {r.purity}% purity | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="hyl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="hyl-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacity" stroke="#1d4ed8" name="Capacity TPD" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#93c5fd" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="hyl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="hyl-chart-title text-sm">Liquefier Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="hyl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="hyl-insights grid grid-cols-2 gap-4">
        <Card className="hyl-insight-card border-l-4 border-l-blue-800"><CardContent className="p-5">
          <h4 className="hyl-insight-title font-semibold text-base">India&apos;s LH2 Import-Export: Green Hydrogen Gateway</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India targeting 5 MTPA green hydrogen production by 2030 with 2 MTPA earmarked for liquefaction and export. Kandla, Mundra and Ennore LH2 export terminals under development with combined 3,000 TPD liquefaction capacity. Japan and South Korea committed &#8377;8,000 Cr investment in Indian LH2 infrastructure through JICA and Korea Exim Bank financing under India-Japan Green Hydrogen MOU and India-Korea Hydrogen Valley partnership agreements signed 2024.</p>
        </CardContent></Card>
        <Card className="hyl-insight-card border-l-4 border-l-blue-800"><CardContent className="p-5">
          <h4 className="hyl-insight-title font-semibold text-base">Steel Sector LH2: Tata-JSW Racing to Green Steel</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s steel industry requiring 25 MTPA green hydrogen by 2040 for hydrogen direct reduced iron production. Tata Steel Jamshedpur and JSW Vijayanagar leading with 50+25 TPD LH2 plants for H-DRI pilot production. &#8377;50,000 Cr industry-wide green steel transformation replacing 90 MT coking coal with green hydrogen under Ministry of Steel Production-Linked Incentive scheme offering &#8377;6,000 Cr subsidy for LH2 infrastructure at 12 major steel plants across India.</p>
        </CardContent></Card>
        <Card className="hyl-insight-card border-l-4 border-l-blue-800"><CardContent className="p-5">
          <h4 className="hyl-insight-title font-semibold text-base">BHEL Indigenous Liquefier: Atmanirbhir Cryogenics</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">BHEL Bhopal developing indigenous hydrogen liquefaction technology achieving 85% localization for Claude cycle turbo-expanders, plate-fin heat exchangers and cryogenic compressors. Currently India imports 100% of large-scale hydrogen liquefaction equipment from Linde Germany, Air Liquide France and Chart Industries USA. BHEL targeting 95% localization by 2028 reducing LH2 plant cost by 35% and creating 2,000 skilled cryogenic engineering jobs under DRDO-BHEL strategic cryogenic technology development programme.</p>
        </CardContent></Card>
        <Card className="hyl-insight-card border-l-4 border-l-blue-800"><CardContent className="p-5">
          <h4 className="hyl-insight-title font-semibold text-base">LH2 for Defence: Siachen Energy Independence</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian Army deploying liquid hydrogen fuel cells at Siachen, Daulat Beg Oldi and 50 forward posts along Line of Actual Control replacing diesel generators and kerosene heating. LH2 stored at Leh liquefaction plant provides 5 kg/day per outpost fueling PEM fuel cells for -40&#176;C winter operation. &#8377;2,500 Cr Army Green Energy Programme eliminating hazardous diesel helicopter resupply missions saving 15 soldier lives annually lost in aviation accidents during Siachen logistics sorties along world&apos;s highest battlefield supply routes.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
