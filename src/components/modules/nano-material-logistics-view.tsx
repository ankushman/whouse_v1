'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface NMLRecord {
  id: string; projectId: string; city: string; operator: string; materialType: string
  productionKg: number; investmentCr: number; purity: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#0c4a6e', '#075985', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd']

const records: NMLRecord[] = [
  { id: 'NML-001', projectId: 'NML-001', city: 'Bengaluru', operator: 'Nano Mission CSIR Lab', materialType: 'Graphene Oxide',
    productionKg: 5000, investmentCr: 380, purity: 99.5, status: 'Delivered', priority: 'Critical', origin: 'JNCASR Lab', destination: 'Electronic City Industry', shipDate: '2024-01-10', transitDays: 5, state: 'Karnataka',
    remarks: 'CSIR-funded graphene oxide production at JNCASR Bengaluru, 5,000 kg annual output at 99.5% purity for semiconductor interconnects, conductive inks for printed electronics, and supercapacitor electrode coating serving 45+ Indian electronics companies' },
  { id: 'NML-002', projectId: 'NML-002', city: 'Hyderabad', operator: 'Tata NanoTech Center', materialType: 'Carbon Nanotubes CNT',
    productionKg: 3200, investmentCr: 520, purity: 99.2, status: 'Delivered', priority: 'Critical', origin: 'Tata Innovista', destination: 'Genome Valley Pharma', shipDate: '2024-01-22', transitDays: 6, state: 'Telangana',
    remarks: 'Multi-walled carbon nanotube production at Tata NanoTech, 3,200 kg/year for composite reinforcement in aerospace (HAL), automotive (Tata Motors), and drug delivery carriers for 20+ pharma companies at Genome Valley Hyderabad' },
  { id: 'NML-003', projectId: 'NML-003', city: 'Pune', operator: 'ARCI Ceramic Nano Coatings', materialType: 'Nano Alumina Powder',
    productionKg: 12000, investmentCr: 290, purity: 99.8, status: 'Delivered', priority: 'High', origin: 'ARCI Pashan', destination: 'Chakan Auto Cluster', shipDate: '2024-02-05', transitDays: 7, state: 'Maharashtra',
    remarks: 'International Advanced Research Centre producing 12,000 kg nano-alumina for thermal barrier coatings on gas turbine blades at HAL and GE Bengaluru, ceramic armor for DRDO, and catalytic converters for Bharat Stage VI automotive emission systems' },
  { id: 'NML-004', projectId: 'NML-004', city: 'Mumbai', operator: 'IIT Bombay Nano Lab', materialType: 'Quantum Dots CdSe',
    productionKg: 800, investmentCr: 340, purity: 99.9, status: 'Delivered', priority: 'High', origin: 'IIT Bombay Powai', destination: 'Andheri Display Tech', shipDate: '2024-02-18', transitDays: 4, state: 'Maharashtra',
    remarks: 'IIT Bombay quantum dot synthesis facility producing 800 kg/year of CdSe and InP quantum dots for next-generation QLED displays, bio-imaging contrast agents for medical diagnostics, and anti-counterfeiting ink for RBI currency security features' },
  { id: 'NML-005', projectId: 'NML-005', city: 'Thiruvananthapuram', operator: 'VSSC Nano Propellant', materialType: 'Nano Aluminium Particles',
    productionKg: 2500, investmentCr: 450, purity: 99.6, status: 'Delivered', priority: 'Critical', origin: 'VSSC ISRO Complex', destination: 'Sriharikota Range', shipDate: '2024-01-28', transitDays: 12, state: 'Kerala',
    remarks: 'ISRO VSSC nano-aluminium production for solid rocket propellant enhancement, 40% higher burn rate enabling 15% payload increase in PSLV and GSLV missions. 2,500 kg annual output meeting India&apos;s Gaganyaan and NextGen Launch Vehicle requirements through 2030' },
  { id: 'NML-006', projectId: 'NML-006', city: 'Kolkata', operator: 'SINP Nanopharma Unit', materialType: 'Lipid Nanoparticles LNP',
    productionKg: 1500, investmentCr: 680, purity: 99.7, status: 'In Transit', priority: 'Critical', origin: 'SINP Salt Lake', destination: 'Bengal Chemical Works', shipDate: '2024-04-10', transitDays: 8, state: 'West Bengal',
    remarks: 'Saha Institute of Nuclear Physics LNP production for mRNA vaccine delivery platforms (ZyCoV-D successor), targeted cancer drug delivery for Tata Memorial Hospital, and gene therapy vectors. 1,500 kg/year serving 5 Indian mRNA vaccine manufacturers under Bharat Biotech consortium' },
  { id: 'NML-007', projectId: 'NML-007', city: 'Delhi', operator: 'JNU Nano Agriculture', materialType: 'Nano Zinc Oxide',
    productionKg: 8000, investmentCr: 210, purity: 98.5, status: 'Delivered', priority: 'High', origin: 'JNU Biotech Park', destination: 'IARI Pusa Campus', shipDate: '2024-03-05', transitDays: 6, state: 'Delhi',
    remarks: 'Nano-ZnO production for agricultural applications: UV-blocking foliar sprays increasing wheat yield by 18%, zinc fortification in urea coating for 40% reduced zinc deficiency in Indian soils, and antimicrobial food packaging films extending shelf life of fruits by 30%' },
  { id: 'NML-008', projectId: 'NML-008', city: 'Chennai', operator: 'IIT Madras Nano Water', materialType: 'Titanium Dioxide Nano TiO2',
    productionKg: 15000, investmentCr: 260, purity: 99.4, status: 'Delivered', priority: 'Medium', origin: 'IIT Madras Guindy', destination: 'Chennai Water Board', shipDate: '2024-03-18', transitDays: 7, state: 'Tamil Nadu',
    remarks: 'IIT Madras nano-TiO2 production for photocatalytic water purification systems, 15,000 kg/year enabling self-cleaning surfaces and advanced oxidation processes treating 500 MLD of sewage water in Chennai, reducing coli-form count by 99.99% for safe industrial reuse' },
  { id: 'NML-009', projectId: 'NML-009', city: 'Ahmedabad', operator: 'PRL Space Nano Materials', materialType: 'Nano Silica Aerogel',
    productionKg: 3000, investmentCr: 310, purity: 97.8, status: 'Processing', priority: 'Medium', origin: 'PRL Ahmedabad', destination: 'ISRO Ahmedabad', shipDate: '2024-06-20', transitDays: 8, state: 'Gujarat',
    remarks: 'Physical Research Laboratory aerogel production for ISRO thermal insulation on Chandrayaan-4 and Aditya-L2 successor missions, 3,000 kg annual output. Also used in building insulation panels reducing AC energy by 35% in hot Indian climate zones' },
  { id: 'NML-010', projectId: 'NML-010', city: 'Jaipur', operator: 'DMRL Defence Nano', materialType: 'Nano Titanium Alloy',
    productionKg: 4500, investmentCr: 560, purity: 99.3, status: 'In Transit', priority: 'High', origin: 'DMRL Hyderabad', destination: 'Jaipur Defence Corridor', shipDate: '2024-05-15', transitDays: 10, state: 'Rajasthan',
    remarks: 'Defence Metallurgical Research Lab nano-titanium alloy production for Tejas Mk2 airframe components and futuristic AFMC programmes, 4,500 kg/year enabling 30% weight reduction in aerospace structural parts while maintaining 2x fatigue life compared to conventional Ti-6Al-4V alloy' },
  { id: 'NML-011', projectId: 'NML-011', city: 'Guwahati', operator: 'IIT Guwahati 2D Materials', materialType: 'MXene Nanosheets',
    productionKg: 600, investmentCr: 290, purity: 98.2, status: 'Delivered', priority: 'Medium', origin: 'IIT Guwahati Lab', destination: 'Amingaon Industrial', shipDate: '2024-04-08', transitDays: 14, state: 'Assam',
    remarks: 'IIT Guwahati MXene production (Ti3C2Tx nanosheets) for electromagnetic interference shielding, flexible supercapacitor electrodes, and water desalination membranes. 600 kg/year supply for Indian Navy stealth coating applications and North Eastern grid battery storage pilot' },
  { id: 'NML-012', projectId: 'NML-012', city: 'Kanpur', operator: 'IIT Kanpur Nano Sensors', materialType: 'Nano Silver Particles',
    productionKg: 7000, investmentCr: 240, purity: 99.1, status: 'Delivered', priority: 'Low', origin: 'IIT Kanpur Campus', destination: 'Kanpur Leather Hub', shipDate: '2024-03-28', transitDays: 9, state: 'Uttar Pradesh',
    remarks: 'Nano-silver production for antimicrobial textile coatings at Kanpur leather and textile clusters, 7,000 kg/year for wound dressing medical textiles, conductive epoxy for electronics assembly, and printable silver ink for RFID antenna manufacturing serving 100+ IoT startups' },
  { id: 'NML-013', projectId: 'NML-013', city: 'Bhubaneswar', operator: 'IMMT Functional Nano', materialType: 'Nano Iron Oxide Fe3O4',
    productionKg: 10000, investmentCr: 190, purity: 98.8, status: 'Delivered', priority: 'Low', origin: 'IMMT Bhubaneswar', destination: 'Paradip Port Zone', shipDate: '2024-04-22', transitDays: 11, state: 'Odisha',
    remarks: 'Institute of Minerals and Materials Technology producing 10,000 kg nano-Fe3O4 for magnetic hyperthermia cancer treatment at AIIMS Bhubaneswar, environmental remediation of heavy metal contaminated groundwater in Odisha mining areas, and magnetic ink for anti-counterfeiting applications' },
  { id: 'NML-014', projectId: 'NML-014', city: 'Mohali', operator: 'CSIO Nano Photonics', materialType: 'Nano YAG Phosphor',
    productionKg: 2000, investmentCr: 420, purity: 99.6, status: 'Delayed', priority: 'High', origin: 'CSIO Chandigarh', destination: 'Mohali LED Cluster', shipDate: '2024-06-01', transitDays: 8, state: 'Punjab',
    remarks: 'CSIO Central Scientific Instruments Organisation producing 2,000 kg nano-YAG phosphor for high-CRI LED manufacturing at Mohali semiconductor cluster, warm-white LED conversion layers for UJALA scheme LED bulbs, and laser phosphor projectors for Indian digital cinema initiative' },
]

export default function NanoMaterialLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof NMLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'materialType', label: 'Material Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.materialType] = (m[r.materialType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Production', value: `${filtered.reduce((a: number, r) => a + r.productionKg, 0).toLocaleString()} kg/yr` },
    { label: 'Avg Purity', value: `${(filtered.reduce((a: number, r) => a + r.purity, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Cost/kg', value: `&#8377;${(filtered.reduce((a: number, r) => a + r.investmentCr, 0) * 100 / Math.max(1, filtered.reduce((a: number, r) => a + r.productionKg, 0))).toFixed(0)}L` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: NMLRecord) => string, val: (r: NMLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.productionKg)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const matBar = grp(r => r.materialType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const effData = filtered.map(r => ({ name: r.materialType.split(' ').slice(0, 2).join(' '), value: r.purity }))
    const lm = filtered.reduce((a: Record<string, { productionKg: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { productionKg: 0, investmentCr: 0 }
      a[r.state].productionKg += r.productionKg; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, productionKg: v.productionKg, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, matBar, priorityPie, totalInvest, effData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="nml-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Nano Material' }]} />
      <PageHeader title="Nano Material Logistics" description="Track nanomaterial production, advanced material supply chains, quantum dot logistics, and nanoparticle distribution for semiconductor, aerospace, pharma and defence industries across India" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="nml-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`nml-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-sky-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="nml-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="nml-kpi-card"><CardContent className="p-4"><p className="nml-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="nml-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="nml-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="nml-chart-title text-sm">Production (kg/yr) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0c4a6e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="nml-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="nml-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="nml-chart-title text-sm">Material Purity (%) by Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.effData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[96, 100]} /><Tooltip /><Bar dataKey="value" fill="#075985" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="nml-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="nml-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`nml-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-sky-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.materialType} | {r.state}</p>
              <p className="text-xs mt-1">{r.productionKg.toLocaleString()} kg/yr | {r.purity}% purity | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="nml-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="nml-chart-title text-sm">Production vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="productionKg" stroke="#0c4a6e" name="Production kg" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#0ea5e9" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="nml-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0369a1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="nml-chart-title text-sm">Material Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.matBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="nml-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="nml-insights grid grid-cols-2 gap-4">
        <Card className="nml-insight-card border-l-4 border-l-sky-900"><CardContent className="p-5">
          <h4 className="nml-insight-title font-semibold text-base">India&apos;s &#8377;1.5 Lakh Cr Nanomaterial Market by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s nanomaterial market is growing at 22% CAGR, projected to reach &#8377;1.5 Lakh Cr by 2030 from &#8377;22,000 Cr in 2024. Key growth drivers: semiconductor fabrication (Tata Electronics, Micron), EV battery materials (Ola, Ather), and pharma nanocarriers (Biocon, Dr Reddy&apos;s). Nano Mission Phase III allocating &#8377;5,000 Cr for 2025-2030.</p>
        </CardContent></Card>
        <Card className="nml-insight-card border-l-4 border-l-sky-900"><CardContent className="p-5">
          <h4 className="nml-insight-title font-semibold text-base">Specialised Cold Chain for Nanomaterials</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Nanomaterial logistics requires specialised handling: inert atmosphere packaging for reactive nanoparticles (CNT, graphene oxide), temperature-controlled transport at 2-8&#176;C for biological nanomaterials (LNP, nano-silver), and ESD-safe containers for conductive nanomaterials. India is building 15 specialised nanomaterial logistics hubs at CSIR, DRDO, and ISRO facilities.</p>
        </CardContent></Card>
        <Card className="nml-insight-card border-l-4 border-l-sky-900"><CardContent className="p-5">
          <h4 className="nml-insight-title font-semibold text-base">Graphene: India&apos;s Strategic Material</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India produces 60 MT of graphite flake annually but imports 100% of its graphene. CSIR and IIT Kharagpur have developed indigenous CVD and liquid exfoliation processes for graphene production. By 2028, India aims for 500 MT domestic graphene capacity reducing &#8377;8,000 Cr annual import bill and enabling sovereign semiconductor packaging material supply.</p>
        </CardContent></Card>
        <Card className="nml-insight-card border-l-4 border-l-sky-900"><CardContent className="p-5">
          <h4 className="nml-insight-title font-semibold text-base">Regulatory Landscape: Nano Safety Standards</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s Bureau of Indian Standards (BIS) is developing IS 18000 series for nanomaterial classification, handling, and disposal. Nano-regulation requires MSDS for all nanomaterial shipments, occupational exposure limits for production workers, and environmental release monitoring for nanoparticle manufacturing effluent treatment at 98%+ removal efficiency.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
