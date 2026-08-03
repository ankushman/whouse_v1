'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/shared/page-header'
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'

interface STLRecord {
  id: string; projectId: string; city: string; operator: string; textileType: string
  capacityTPA: number; investmentCr: number; smartFeatures: number; exportPct: number; status: string; priority: string
  origin: string; destination: string; shipDate: string; transitDays: number; state: string; remarks: string
}

const COLORS = ['#4a1d96', '#5b21b6', '#6d28d9', '#7c3aed', '#8b5cf6', '#3b0764', '#2e1065', '#1e1b4b']

const records: STLRecord[] = [
  { id: 'STL-0001', projectId: 'STL-001', city: 'Bengaluru', operator: 'Wipro Smart Textile Hub', textileType: 'IoT-Enabled Smart Fabric',
    capacityTPA: 85000, investmentCr: 340, smartFeatures: 12, exportPct: 45.0, status: 'Delivered', priority: 'Critical', origin: 'Wipro Electronics Division', destination: 'Bengaluru Tech Park', shipDate: '2025-05-05', transitDays: 1, state: 'Karnataka',
    remarks: 'IoT-enabled smart fabric manufacturing at Wipro Bengaluru Tech Park with 85,000 TPA capacity producing temperature-sensing, UV-monitoring and heart-rate-detecting textile sensors. &#8377;340 Cr facility integrates graphene nanofiber conductive threads with cotton yarn for real-time health monitoring garments. Exports 45% to European smart clothing brands under OEKO-TEX Standard 100 certification targeting &#8377;150 Cr annual export revenue from wearable health tech textile market growing at 28% CAGR globally.' },
  { id: 'STL-0002', projectId: 'STL-002', city: 'Coimbatore', operator: 'KG Smart Mills Consortium', textileType: 'RFID-Trackable Garment',
    capacityTPA: 120000, investmentCr: 420, smartFeatures: 8, exportPct: 62.0, status: 'Delivered', priority: 'Critical', origin: 'KG Mills Spinning Division', destination: 'Coimbatore Textile SEZ', shipDate: '2025-05-10', transitDays: 1, state: 'Tamil Nadu',
    remarks: 'RFID-traceable smart garment production at KG Mills Coimbatore SEZ with 120,000 TPA capacity embedding UHF RFID chips during weaving for end-to-end supply chain transparency. &#8377;420 Cr consortium of 12 Coimbatore mills producing garments with digital product passports tracking raw cotton origin to retail shelf under EU Digital Product Passport Regulation 2027. 62% export ratio serves H&amp;M, Zara and Nike sustainable sourcing programmes with real-time inventory visibility across 5,000 retail stores worldwide reducing counterfeiting by 85%.' },
  { id: 'STL-0003', projectId: 'STL-003', city: 'Tiruppur', operator: 'NIFT Smart Apparel Cluster', textileType: 'Phase-Change Cooling Fabric',
    capacityTPA: 95000, investmentCr: 310, smartFeatures: 6, exportPct: 55.0, status: 'Delivered', priority: 'High', origin: 'Tiruppur Knit City', destination: 'Tiruppur Export Zone', shipDate: '2025-05-02', transitDays: 2, state: 'Tamil Nadu',
    remarks: 'Phase-change material cooling fabric at Tiruppur NIFT Smart Apparel Cluster with 95,000 TPA capacity incorporating microencapsulated paraffin PCM yarn for self-regulating temperature garments. &#8377;310 Cr facility produces cooling sportswear and industrial workwear maintaining 18-22&#176;C skin temperature in 40&#176;C ambient. Exports 55% to Gulf Cooperation Council countries for construction worker safety apparel under UAE Ministry of Labour heat stress regulation mandating cooling PPE for outdoor workers from 2026, creating &#8377;85 Cr annual export revenue.' },
  { id: 'STL-0004', projectId: 'STL-004', city: 'Mumbai', operator: 'Reliance Smart Fashion Tech', textileType: 'Shape-Memory Polymer Textile',
    capacityTPA: 60000, investmentCr: 265, smartFeatures: 10, exportPct: 35.0, status: 'In Transit', priority: 'High', origin: 'Reliance Jio Innovation', destination: 'Mumbai Fashion Hub', shipDate: '2025-05-15', transitDays: 2, state: 'Maharashtra',
    remarks: 'Shape-memory polymer smart textile en route to Reliance Mumbai Fashion Hub with 60,000 TPA capacity producing wrinkle-free shape-retaining garments using nitinol wire woven fabric. &#8377;265 Cr plant integrating Reliance Jio IoT connectivity for garment usage tracking, wash cycle counting and automated detergent recommendation through companion smartphone app. Domestic market focused at 35% export ratio serving Reliance Trends 2,000 stores with premium smart formal wear line at &#8377;3,500 per piece versus &#8377;1,800 for conventional formal shirts.' },
  { id: 'STL-0005', projectId: 'STL-005', city: 'Ahmedabad', operator: 'Arvind Smart Denim Works', textileType: 'Conductive Stretch Denim',
    capacityTPA: 110000, investmentCr: 380, smartFeatures: 7, exportPct: 58.0, status: 'Delivered', priority: 'Critical', origin: 'Arvind Mills Ahmedabad', destination: 'Arvind Smart Factory', shipDate: '2025-04-28', transitDays: 1, state: 'Gujarat',
    remarks: 'Conductive stretch smart denim at Arvind Mills Ahmedabad with 110,000 TPA capacity producing touch-sensitive, Bluetooth-connected denim jeans with integrated flexible circuitry in waistband. &#8377;380 Cr facility serves Levi&apos;s, Tommy Hilfiger and Arvind own brands with smart denim featuring phone pocket NFC unlock, step counting and fall detection for elderly wearers. 58% export through Kandla Port to US and European denim markets where smart denim premium segment growing at 35% annually with consumers paying 40% premium for tech-integrated jeans.' },
  { id: 'STL-0006', projectId: 'STL-006', city: 'Bhilwara', operator: 'Rajasthan Smart Weaving Park', textileType: 'Color-Changing E-Textile',
    capacityTPA: 75000, investmentCr: 245, smartFeatures: 5, exportPct: 30.0, status: 'Delivered', priority: 'Medium', origin: 'Bhilwara Textile Cluster', destination: 'Rajasthan Smart Park', shipDate: '2025-05-08', transitDays: 3, state: 'Rajasthan',
    remarks: 'Electrochromic color-changing e-textile at Bhilwara Smart Weaving Park with 75,000 TPA capacity producing fabric that changes color through embedded electrochromic polymer threads controlled by smartphone app. &#8377;245 Cr plant developed with Rajasthan State Textile Development Corporation creating festival-ready ethnic wear that transforms design pattern on demand. Domestic market focused at 30% export ratio serving 50 million unit festive wear market in North India with &#8377;2,200 per smart saree versus &#8377;800 for traditional printed saree under GeM and Rajasthan State Emporium distribution.' },
  { id: 'STL-0007', projectId: 'STL-007', city: 'Noida', operator: 'UP Smart Technical Textile', textileType: 'Aramid Fiber Protective Fabric',
    capacityTPA: 45000, investmentCr: 290, smartFeatures: 9, exportPct: 25.0, status: 'Delivered', priority: 'High', origin: 'UP Textile Institute', destination: 'Noida Defence Corridor', shipDate: '2025-04-25', transitDays: 1, state: 'Uttar Pradesh',
    remarks: 'Smart aramid fiber protective fabric at Noida Defence Corridor with 45,000 TPA capacity producing bulletproof and stab-resistant smart textile with embedded vital signs monitoring for defence and paramilitary forces. &#8377;290 Cr facility developed with DRDO BDL technology transfer producing Level IIIA smart body armour weighing 25% less than conventional Kevlar while integrating GPS tracking and biometric sensors. Serves Indian Army, CRPF and BSF annual procurement of &#8377;2,500 Cr under Make in India defence textile initiative replacing imported DuPont and DSM protective fabrics.' },
  { id: 'STL-008', projectId: 'STL-008', city: 'Kolkata', operator: 'Bengal Smart Jute Innovation', textileType: 'Jute-Based Geotextile Smart',
    capacityTPA: 130000, investmentCr: 185, smartFeatures: 4, exportPct: 40.0, status: 'Delivered', priority: 'Medium', origin: 'NJP Jute Mills', destination: 'Kolkata Smart Jute Hub', shipDate: '2025-05-12', transitDays: 1, state: 'West Bengal',
    remarks: 'Smart jute geotextile at Kolkata with 130,000 TPA capacity producing IoT-monitored erosion control and soil moisture-sensing jute mats for infrastructure and agriculture applications. &#8377;185 Cr facility by IJIRA and NJL integrating biodegradable soil moisture sensors into jute geotextile for highway embankment, railway slope stabilization and tea garden erosion control. 40% export to Southeast Asian infrastructure projects under National Mission on Sustainable Habitat. Jute smart geotextile provides 5-year monitoring window before complete biodegradation unlike synthetic PP geotextile that persists for 100 years in soil.' },
  { id: 'STL-0009', projectId: 'STL-009', city: 'Surat', operator: 'Surat Smart Silk Platform', textileType: 'Luminescent Silk Fabric',
    capacityTPA: 55000, investmentCr: 210, smartFeatures: 6, exportPct: 52.0, status: 'Delivered', priority: 'Medium', origin: 'Surat Silk Exchange', destination: 'Surat Smart Textile Zone', shipDate: '2025-05-01', transitDays: 1, state: 'Gujarat',
    remarks: 'Luminescent and glow-in-dark smart silk fabric at Surat Smart Textile Zone with 55,000 TPA capacity producing silk sarees and fabrics with embedded photoluminescent yarn for bridal and festive wear. &#8377;210 Cr facility combining traditional Surat silk weaving with quantum dot luminescent coating technology from CSIR-NIIST Thiruvananthapuram. 52% export to Middle East and Southeast Asian wedding wear markets commanding &#8377;15,000 per luminescent silk saree versus &#8377;5,000 for conventional Banarasi silk. Surat&apos;s 150,000 power looms being upgraded for smart textile production under Textile Ministry &#8377;1,500 Cr Technology Upgradation Fund.' },
  { id: 'STL-0010', projectId: 'STL-010', city: 'Hyderabad', operator: 'DRDO Soldier Smart Uniform', textileType: 'Multi-Spectral Camouflage Fabric',
    capacityTPA: 25000, investmentCr: 320, smartFeatures: 14, exportPct: 10.0, status: 'Processing', priority: 'High', origin: 'DRDO Textile Lab', destination: 'Hyderabad Defence Factory', shipDate: '2025-05-18', transitDays: 2, state: 'Telangana',
    remarks: 'Multi-spectral camouflage smart uniform fabric at Hyderabad defence factory with 25,000 TPA capacity for Indian Army next-generation combat uniform. &#8377;320 DRDO project producing fabric with adaptive IR signature reduction, UV-reflectance modulation and near-invisible thermal signature for night operations. 14 smart features include integrated fragmentation sensor, tourniquet guide LED and encrypted communications antenna woven into fabric. 10% export to friendly nations under Indian defence export policy targeting &#8377;500 Cr annual smart military textile export to Myanmar, Vietnam and UAE defence forces.' },
  { id: 'STL-011', projectId: 'STL-011', city: 'Ludhiana', operator: 'Punjab Smart Hosiery Works', textileType: 'Compression Therapy Smart Sock',
    capacityTPA: 95000, investmentCr: 175, smartFeatures: 5, exportPct: 38.0, status: 'Delivered', priority: 'Medium', origin: 'Ludhiana Knitwear Cluster', destination: 'Ludhiana Smart Hosiery', shipDate: '2025-05-06', transitDays: 2, state: 'Punjab',
    remarks: 'Compression therapy smart socks at Ludhiana knitwear cluster with 95,000 TPA capacity producing gradient compression hosiery with embedded pressure sensors and Bluetooth connectivity for diabetic foot monitoring. &#8377;175 Cr facility by Vardhman and Nahar Group producing medical-grade smart socks prescribed by 5,000 Indian diabetologists for 77 million diabetic patients requiring daily foot pressure monitoring. 38% export to UK NHS and European medical supply chains under CE Class IIa medical device certification targeting &#8377;120 Cr annual medical textile export from India&apos;s largest hosiery cluster.' },
  { id: 'STL-0012', projectId: 'STL-012', city: 'Kochi', operator: 'Kerala Aquaculture Smart Net', textileType: 'Anti-Fouling Smart Netting',
    capacityTPA: 65000, investmentCr: 155, smartFeatures: 4, exportPct: 20.0, status: 'Delivered', priority: 'Low', origin: 'Kochi Marine Textile', destination: 'Kerala Aquaculture Hub', shipDate: '2025-05-22', transitDays: 1, state: 'Kerala',
    remarks: 'Anti-fouling smart aquaculture netting at Kochi Marine Textile facility with 65,000 TPA capacity producing HDPE netting with embedded biofouling sensors and automated cleaning cycle detection. &#8377;155 Cr installation by CMFRI and Kerala Aqua Ventures serving India&apos;s 1.2 million tonne aquaculture industry across 14 coastal states. Smart nets detect biofouling thickness through ultrasonic sensors triggering cleaning drone deployment reducing manual net cleaning labour by 60%. 20% export to Vietnam and Thailand shrimp farming operations under bilateral fisheries cooperation agreements.' },
  { id: 'STL-0013', projectId: 'STL-013', city: 'Varanasi', operator: 'Kashi Smart Handloom Cluster', textileType: 'NFC-Enabled Banarasi Silk',
    capacityTPA: 15000, investmentCr: 95, smartFeatures: 3, exportPct: 28.0, status: 'Delayed', priority: 'Low', origin: 'Varanasi Handloom Weavers', destination: 'Varanasi GI Tag Centre', shipDate: '2025-04-15', transitDays: 5, state: 'Uttar Pradesh',
    remarks: 'NFC-enabled GI-tagged Banarasi smart silk at Varanasi handloom cluster delayed by weaver onboarding logistics with 15,000 TPA capacity. &#8377;95 Cr project embedding NFC authentication chips in Banarasi silk sarees to prevent counterfeiting affecting 60% of Banarasi silk market. Each smart saree carries digital GI certificate verifiable by smartphone NFC tap enabling buyers to authenticate genuine Varanasi handloom origin protecting 500,000 weaver families. Delayed pending GeM portal integration for GI authentication QR code generation with expected Q3 2026 commissioning under Textile Committee GI protection scheme.' },
  { id: 'STL-014', projectId: 'STL-014', city: 'Guwahati', operator: 'NE Eri Silk Smart Textile', textileType: 'Bamboo-Fiber Smart Fabric',
    capacityTPA: 18000, investmentCr: 78, smartFeatures: 4, exportPct: 15.0, status: 'Processing', priority: 'Low', origin: 'Assam Eri Silk Cooperative', destination: 'Guwahati Bio-Textile Park', shipDate: '2025-04-20', transitDays: 6, state: 'Assam',
    remarks: 'Bamboo-fiber smart textile at Guwahati Bio-Textile Park with 18,000 TPA capacity combining Assam eri silk and bamboo viscose with UV-sensing and antimicrobial silver nanoparticle coating. &#8377;78 Cr facility by NEDFi and Assam Bamboo Mission serving northeast India eco-textile market and growing organic clothing demand. Smart bamboo fabric provides natural UV protection UPF 50+ with embedded sensor alerting wearer when cumulative UV exposure exceeds safe threshold. 15% export to Japan and South Korea premium eco-fashion market under India-Japan textile cooperation agreement targeting &#8377;25 Cr annual NE bio-textile export.' },
]

export default function SmartTextileLogisticsView() {
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
      Object.entries(activeFilters).every(([k, vs]) => vs.length === 0 || vs.includes(String(r[k as keyof STLRecord])))
    )
    return result
  }, [searchQuery, activeFilters])

  const filterGroups = useMemo(() => [
    { key: 'status', label: 'Status', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.status] = (m[r.status] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'priority', label: 'Priority', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.priority] = (m[r.priority] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'textileType', label: 'Textile Type', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.textileType] = (m[r.textileType] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
    { key: 'state', label: 'State', options: Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.state] = (m[r.state] || 0) + 1; return m }, {})).map(([value, count]) => ({ value, count })) },
  ], [])

  const kpis = useMemo(() => [
    { label: 'Total Capacity', value: `${filtered.reduce((a: number, r) => a + r.capacityTPA, 0).toLocaleString()} TPA` },
    { label: 'Avg Smart Features', value: `${(filtered.reduce((a: number, r) => a + r.smartFeatures, 0) / Math.max(1, filtered.length)).toFixed(1)}` },
    { label: 'Total Investment', value: `&#8377;${filtered.reduce((a: number, r) => a + r.investmentCr, 0).toLocaleString()} Cr` },
    { label: 'Avg Export %', value: `${(filtered.reduce((a: number, r) => a + r.exportPct, 0) / Math.max(1, filtered.length)).toFixed(1)}%` },
  ], [filtered])

  const cd = useMemo(() => {
    const grp = (fn: (r: STLRecord) => string, val: (r: STLRecord) => number) =>
      Object.entries(filtered.reduce((a: Record<string, number>, r) => { a[fn(r)] = (a[fn(r)] || 0) + val(r); return a }, {})).map(([name, value]) => ({ name, value }))
    const barState = grp(r => r.state, r => r.capacityTPA)
    const pieState = grp(r => r.state, () => 1)
    const statusPie = grp(r => r.status, () => 1)
    const typeBar = grp(r => r.textileType, () => 1)
    const priorityPie = grp(r => r.priority, () => 1)
    const totalInvest = grp(r => r.state, r => r.investmentCr)
    const exportData = filtered.map(r => ({ name: r.textileType.split(' ').slice(0, 2).join(' '), value: r.exportPct }))
    const lm = filtered.reduce((a: Record<string, { capacityTPA: number; investmentCr: number }>, r) => {
      if (!a[r.state]) a[r.state] = { capacityTPA: 0, investmentCr: 0 }
      a[r.state].capacityTPA += r.capacityTPA; a[r.state].investmentCr += r.investmentCr; return a
    }, {})
    const lineData = Object.entries(lm).map(([name, v]) => ({ name, capacityTPA: v.capacityTPA, investmentCr: v.investmentCr }))
    return { barState, pieState, statusPie, typeBar, priorityPie, totalInvest, exportData, lineData }
  }, [filtered])

  const sc = (s: string) => s === 'Delayed' ? 'bg-red-100 text-red-800' : s === 'Delivered' ? 'bg-green-100 text-green-800' : s === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'

  return (
    <div className="stl-root p-6 space-y-6">
      <ModuleBreadcrumb items={[{ label: 'Logistics', href: '/logistics' }, { label: 'Smart Textile' }]} />
      <PageHeader title="Smart Textile Logistics" description="Track smart textile supply chains, IoT-enabled fabric logistics, RFID-traceable garment distribution, conductive and shape-memory textile systems, and India's technical textile mission for defence, medical, automotive and fashion applications" />
      <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} activeFilters={activeFilters} filterGroups={filterGroups} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filtered.length} />
      <div className="stl-tabs flex gap-2">{['dashboard', 'registry', 'analytics', 'insights'].map(t => (
        <button key={t} onClick={() => setTab(t)} className={`stl-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-purple-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
      ))}</div>

      {tab === 'dashboard' && (<>
        <div className="stl-kpi-grid grid grid-cols-4 gap-4">{kpis.map((k, i) => (
          <Card key={i} className="stl-kpi-card"><CardContent className="p-4"><p className="stl-kpi-label text-sm text-muted-foreground">{k.label}</p><p className="stl-kpi-value text-2xl font-bold mt-1" dangerouslySetInnerHTML={{ __html: k.value }} /></CardContent></Card>
        ))}</div>
        <div className="stl-dash-charts grid grid-cols-2 gap-4 mt-4">
          <Card><CardHeader><CardTitle className="stl-chart-title text-sm">Production Capacity (TPA) by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.barState}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#4a1d96" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="stl-chart-title text-sm">Facilities by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.pieState} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.pieState.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      </>)}

      {tab === 'registry' && (<>
        <div className="stl-reg-charts grid grid-cols-2 gap-4 mb-4">
          <Card><CardHeader><CardTitle className="stl-chart-title text-sm">Export Ratio (%) by Textile Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={cd.exportData}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} domain={[0, 70]} /><Tooltip /><Bar dataKey="value" fill="#5b21b6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="stl-chart-title text-sm">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={cd.statusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fontSize={10}>{cd.statusPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
        <div className="stl-records space-y-3">{filtered.map(r => (
          <Card key={r.id} className={`stl-record-card ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-purple-900'}`}><CardContent className="p-4">
            <div className="flex justify-between items-start"><div>
              <p className="font-semibold text-sm">{r.projectId} &#8594; {r.city}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.operator} | {r.textileType} | {r.state}</p>
              <p className="text-xs mt-1">{r.capacityTPA.toLocaleString()} TPA | {r.smartFeatures} features | {r.exportPct}% export | &#8377;{r.investmentCr} Cr | {r.transitDays}d transit</p>
            </div><div className="flex gap-1 shrink-0 ml-3">
              <Badge className={sc(r.status)} variant="secondary">{r.status}</Badge>
              <Badge variant="outline" className="text-xs">{r.priority}</Badge>
            </div></div>
            <p className="text-xs text-muted-foreground mt-2">{r.remarks}</p>
          </CardContent></Card>
        ))}</div>
      </>)}

      {tab === 'analytics' && (<div className="stl-analytics grid grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="stl-chart-title text-sm">Capacity vs Investment by State</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><LineChart data={cd.lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={10} /><YAxis yAxisId="left" fontSize={11} /><YAxis yAxisId="right" orientation="right" fontSize={11} /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="capacityTPA" stroke="#4a1d96" name="Capacity TPA" /><Line yAxisId="right" type="monotone" dataKey="investmentCr" stroke="#8b5cf6" name="Investment &#8377; Cr" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="stl-chart-title text-sm">Total Investment by State (&#8377; Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.totalInvest}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#3b0764" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="stl-chart-title text-sm">Textile Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cd.typeBar}><XAxis dataKey="name" fontSize={9} angle={-25} textAnchor="end" height={55} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="value" fill="#5b21b6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="stl-chart-title text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={cd.priorityPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label fontSize={11}>{cd.priorityPie.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>)}

      {tab === 'insights' && (<div className="stl-insights grid grid-cols-2 gap-4">
        <Card className="stl-insight-card border-l-4 border-l-purple-900"><CardContent className="p-5">
          <h4 className="stl-insight-title font-semibold text-base">India&apos;s &#8377;1.5 Lakh Cr Smart Textile Market by 2030</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s technical and smart textile market projected to reach &#8377;1.5 lakh Cr by 2030 from &#8377;35,000 Cr in 2024 growing at 24% CAGR. National Technical Textiles Mission allocating &#8377;14,800 Cr for R&amp;D, product development and market promotion. Smart textiles combining electronics with fabrics represent 15% of global textile market by value but only 2% by volume creating massive premium opportunity. India&apos;s 140 million textile workforce being reskilled for smart textile production under Textile Ministry Samarth scheme with 200,000 smart textile specialist certifications by 2028 targeting 12% global smart textile market share.</p>
        </CardContent></Card>
        <Card className="stl-insight-card border-l-4 border-l-purple-900"><CardContent className="p-5">
          <h4 className="stl-insight-title font-semibold text-base">EU Digital Product Passport: RFID Opportunity</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">EU Digital Product Passport regulation effective 2027 requires every garment sold in EU to carry blockchain-verified traceability data from raw material to consumer. India&apos;s &#8377;42,000 Cr garment export industry serving EU must comply affecting 45% of India&apos;s total textile exports. RFID and NFC-enabled smart labels from Tiruppur, Coimbatore and Noida clusters provide compliance solution at &#8377;8 per garment versus &#8377;45 per garment for European RFID suppliers. Textile Export Promotion Council estimating &#8377;12,000 Cr additional export revenue for Indian smart-tagged garments as EU brands prefer compliant Indian suppliers over non-compliant competitors from Bangladesh and Vietnam.</p>
        </CardContent></Card>
        <Card className="stl-insight-card border-l-4 border-l-purple-900"><CardContent className="p-5">
          <h4 className="stl-insight-title font-semibold text-base">Defence Smart Textiles: &#8377;8,000 Cr Opportunity</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Indian defence forces spending &#8377;8,000 Cr annually on uniforms, protective gear and technical textiles with smart textile penetration currently at only 5%. DRDO developing 14 smart textile products including adaptive camouflage, soldier vital signs monitoring uniform, chemical-biological protective smart overgarments and GPS-enabled rescue fabric. Noida Defence Corridor and Hyderabad defence factories commissioned for smart military textile production under Make in India defence manufacturing policy targeting &#8377;3,000 Cr domestic smart military textile production by 2028 replacing &#8377;2,800 Cr annual import from Israeli, American and Chinese military textile suppliers.</p>
        </CardContent></Card>
        <Card className="stl-insight-card border-l-4 border-l-purple-900"><CardContent className="p-5">
          <h4 className="stl-insight-title font-semibold text-base">Medical Smart Textiles: Diabetic Foot Monitoring</h4>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">India&apos;s 77 million diabetic patients creating &#8377;4,500 Cr medical smart textile market for continuous glucose monitoring socks, compression therapy hosiery and wound-detecting bandages. Ludhiana hosiery cluster producing 95,000 TPA medical smart socks integrating pressure and temperature sensors connected to smartphone apps alerting patients and doctors of ulcer risk. ICMR estimating smart medical textiles could prevent 200,000 diabetes-related amputations annually saving &#8377;25,000 Cr in healthcare costs. CE-marked Indian medical smart textile exports growing at 35% CAGR to UK NHS, German statutory health insurance and Japanese healthcare system under bilateral medical device cooperation agreements.</p>
        </CardContent></Card>
      </div>)}
    </div>
  )
}
