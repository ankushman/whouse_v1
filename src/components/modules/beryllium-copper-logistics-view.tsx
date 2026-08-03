'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Wrench } from 'lucide-react'

interface BerylliumCopperRecord {
  id: string
  batchNo: string
  city: string
  supplier: string
  alloyGrade: string
  application: string
  conductivityPACSIACS: number
  hardnessHRC: number
  investmentCr: number
  status: string
  priority: string
  origin: string
  destination: string
  shipDate: string
  transitDays: number
  zone: string
  remarks: string
}

const berylliumCopperRecords: BerylliumCopperRecord[] = [
  { id: 'BCU-0001', batchNo: 'BCU-B2401', city: 'Mumbai', supplier: 'NGK Beryllium India', alloyGrade: 'C17200 (BeCu-2%)', application: 'Connectors (Molex India)', conductivityPACSIACS: 22, hardnessHRC: 40, investmentCr: 92, status: 'Delivered', priority: 'High', origin: 'NGK Mumbai (MH)', destination: 'Molex Pune (MH)', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: 'NGK C17200 strip for Molex high-speed automotive connectors &#8594; 22% IACS conductivity with 40 HRC &#8594; &#8377;92Cr for 120 tonnes strip &#8594; spring-loaded contacts for EV charging connector &#8594; NGK Japan &#8377;1,200Cr Mumbai trading hub &#8594; supplies 80% of Indian BeCu demand from Japan &#8594; Molex &#8377;2,800Cr Pune connector plant for Tata Mahindra &#8594; C17200 age-hardened to 42 HRC for 10,000 cycle fatigue life &#8594; EV charging connector requires 250A continuous current at 40&#176;C ambient' },
  { id: 'BCU-0002', batchNo: 'BCU-B2402', city: 'Bengaluru', supplier: 'Materion India', alloyGrade: 'C17510 (BeCu-Ni-Co)', application: 'Resistance Welding Electrode (Bosch)', conductivityPACSIACS: 45, hardnessHRC: 35, investmentCr: 68, status: 'In Transit', priority: 'Critical', origin: 'Materion Bengaluru (KA)', destination: 'Bosch Chassis Nashik (MH)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'Materion C17510 rod for Bosch resistance welding electrode caps &#8594; 45% IACS conductivity &#8594; &#8377;68Cr for 45 tonnes electrode material &#8594; electrode life 200,000 spots vs 50,000 for Cu-Cr &#8594; Materion &#8377;800Cr Bengaluru distribution &#8594; parent Materion Corp USA &#8594; Bosch Nashik producing 5 million spot-welded BIW units/year &#8594; C17510 combines high conductivity with high strength &#8594; essential for high-speed welding of AHSS steel for crash safety &#8594; tip dressing interval extended 4x' },
  { id: 'BCU-0003', batchNo: 'BCU-B2403', city: 'Pune', supplier: 'Kobelco BeCu India', alloyGrade: 'C17200 HT Strip', application: 'Relay Spring (Larsen &amp; Toubro)', conductivityPACSIACS: 22, hardnessHRC: 42, investmentCr: 48, status: 'Delivered', priority: 'Standard', origin: 'Kobelco Pune (MH)', destination: 'L&amp;T Switchgear Vadodara (GJ)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Kobelco C17200 HT strip for L&amp;T contactor relay spring &#8594; 42 HRC with 22% IACS &#8594; &#8377;48Cr for 35 tonnes HT strip &#8594; 20 million mechanical cycle life &#8594; Kobelco &#8377;600Cr Pune warehouse &#8594; parent Kobe Steel Japan &#8594; L&amp;T Electrical producing 100,000 contactors/year &#8594; relay spring must maintain 95% contact force after 20M cycles &#8594; BeCu spring outperforms phosphor bronze 5x on cycle life &#8594; also supplies spring contacts for L&amp;T switchgear range' },
  { id: 'BCU-0004', batchNo: 'BCU-B2404', city: 'Hyderabad', supplier: 'DRDO BeCu Facility', alloyGrade: 'C17500 (BeCu-Co-Ag)', application: 'Non-Sparking Tool (BEL)', conductivityPACSIACS: 50, hardnessHRC: 32, investmentCr: 125, status: 'In Transit', priority: 'Critical', origin: 'DRDO Hyderabad (TS)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'DRDO C17500 bar stock for BEL non-sparking tools for INS Vikrant carrier &#8594; 50% IACS with 32 HRC &#8594; &#8377;125Cr for 25 tonnes bar stock &#8594; non-sparking certified for Zone 1 explosive atmosphere &#8594; DRDO &#8377;1,600Cr BeCu defence programme &#8594; C17500 IACS 50% enables welding gun current transfer &#8594; BEL producing 500 sets of tools for Navy carrier &#8594; replaces imported Brush Wellman USA at 40% lower cost &#8594; also for submarine torpedo handling equipment &#8594; certified to MIL-B-56215 and DEF STAN 02-834' },
  { id: 'BCU-0005', batchNo: 'BCU-B2405', city: 'Chennai', supplier: 'BeCu Alloys India', alloyGrade: 'C17410 (BeCu-Ti)', application: 'Oilfield Probe (Oil India)', conductivityPACSIACS: 28, hardnessHRC: 38, investmentCr: 85, status: 'Delivered', priority: 'High', origin: 'BeCu Alloys Chennai (TN)', destination: 'Oil India Jorhat (AS)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'BeCu Alloys C17410 for Oil India well logging probe housing &#8594; 28% IACS with 38 HRC &#8594; &#8377;85Cr for 40 tonnes tube and bar &#8594; survives 15,000 psi and 200&#176;C downhole &#8594; BeCu Alloys &#8377;450Cr Chennai processing &#8594; oilfield grade with H2S stress corrosion cracking resistance &#8594; Oil India drilling 200 wells/year in Assam and Rajasthan &#8594; probe housing must maintain dimensional tolerance at 200&#176;C &#8594; BeCu outperforms MP35N at 60% lower cost &#8594; also for ONGC offshore platform probe tools' },
  { id: 'BCU-0006', batchNo: 'BCU-B2406', city: 'Nagpur', supplier: 'Indian BeCu Corp', alloyGrade: 'C17200 Wire', application: 'Spring Contact Socket (TE Connectivity)', conductivityPACSIACS: 20, hardnessHRC: 44, investmentCr: 56, status: 'Processing', priority: 'Standard', origin: 'Indian BeCu Nagpur (MH)', destination: 'TE Connectivity Bengaluru (KA)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'Indian BeCu C17200 wire for TE spring contact IC test socket &#8594; 20% IACS with 44 HRC &#8594; &#8377;56Cr for 18 tonnes wire &#8594; 50,000 insertions without force degradation &#8594; Indian BeCu &#8377;380Cr Nagpur wire drawing &#8594; first Indian BeCu wire producer &#8594; TE Bengaluru producing 2 million test sockets/year &#8594; wire diameter 0.15mm with &#177;2um tolerance &#8594; also supplies spring contacts for semiconductor burn-in sockets &#8594; &#8377;4,500Cr India semiconductor test market &#8594; targeting 20% import substitution by 2028' },
  { id: 'BCU-0007', batchNo: 'BCU-B2407', city: 'Kolkata', supplier: 'Hindustan BeCu Works', alloyGrade: 'C17500 Tube', application: 'Current Collector Ring (BHEL)', conductivityPACSIACS: 48, hardnessHRC: 30, investmentCr: 72, status: 'Delivered', priority: 'High', origin: 'HBW Kolkata (WB)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-12', transitDays: 2, zone: 'East', remarks: 'HBW C17500 tube for BHEL turbine generator current collector ring &#8594; 48% IACS with 30 HRC &#8594; &#8377;72Cr for 60 tonnes tube &#8594; ring operates at 250&#176;C at 3,000 RPM &#8594; HBW &#8377;320Cr Kolkata tube mill &#8594; former Hindustan Copper subsidiary &#8594; BHEL producing 200 turbine generators/year &#8594; collector ring must maintain conductivity under centrifugal stress &#8594; BeCu ring outlasts Cu-CrZr ring 3x &#8594; also supplies brush holders and commutator segments &#8594; &#8377;8,000Cr BHEL turbine generator market' },
  { id: 'BCU-0008', batchNo: 'BCU-B2408', city: 'Ahmedabad', supplier: 'Gujarat BeCu Centre', alloyGrade: 'C17400 Strip', application: 'EV Motor Brush Spring (Tata Motors)', conductivityPACSIACS: 30, hardnessHRC: 36, investmentCr: 88, status: 'In Transit', priority: 'Critical', origin: 'GBC Ahmedabad (GJ)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'GBC C17400 strip for Tata Nexon EV motor brush spring &#8594; 30% IACS with 36 HRC &#8594; &#8377;88Cr for 55 tonnes strip &#8594; brush spring life 150,000 km vs 80,000 km CuBe &#8594; GBC &#8377;420Cr Ahmedabad processing &#8594; EV motor operating at 12,000 RPM requires spring stability at 180&#176;C &#8594; Tata Nexon Gen3 EV motor at 150kW peak &#8594; C17400 maintains 95% spring force at elevated temperature &#8594; also supplies brush springs for Mahindra XUV400 EV &#8594; &#8377;2,200Cr India EV motor component market' },
  { id: 'BCU-0009', batchNo: 'BCU-B2409', city: 'Jaipur', supplier: 'Rajasthan NonFerrous', alloyGrade: 'C17200 Cast Rod', application: 'Mould Insert (Godrej Tooling)', conductivityPACSIACS: 18, hardnessHRC: 45, investmentCr: 35, status: 'Delivered', priority: 'Standard', origin: 'RNF Jaipur (RJ)', destination: 'Godrej Tooling Aurangabad (MH)', shipDate: '2026-07-14', transitDays: 2, zone: 'North', remarks: 'RNF C17200 cast rod for Godrej plastic injection mould core pin &#8594; 18% IACS with 45 HRC &#8594; &#8377;35Cr for 12 tonnes cast rod &#8594; thermal conductivity enables 30% faster cycle time &#8594; RNF &#8377;260Cr Rajasthan casting &#8594; BeCu mould inserts for high-volume thin-wall packaging &#8594; Godrej Tooling producing 500 moulds/year &#8594; cycle time reduction from 8s to 5.5s for 0.3mm wall container &#8594; BeCu insert maintains flatness over 2 million shots &#8594; also for parison moulds in pharmaceutical packaging &#8594; &#8377;3,500Cr India mould market' },
  { id: 'BCU-0010', batchNo: 'BCU-B2410', city: 'Bhubaneswar', supplier: 'NALCO BeCu Alloy', alloyGrade: 'C17510 Forging', application: 'Undersea Cable Clamp (SubCom)', conductivityPACSIACS: 42, hardnessHRC: 34, investmentCr: 95, status: 'Delivered', priority: 'High', origin: 'NALCO Bhubaneswar (OD)', destination: 'SubCom Chennai (TN)', shipDate: '2026-07-17', transitDays: 1, zone: 'East', remarks: 'NALCO C17510 forging for SubCom undersea repeater cable clamp &#8594; 42% IACS with 34 HRC &#8594; &#8377;95Cr for 35 tonnes forging &#8594; resists 8,000 psi deep-sea pressure and galvanic corrosion &#8594; NALCO &#8377;560Cr BeCu alloy division &#8594; backward integrated from Indian beryllium ore (Andhra Pradesh) &#8594; SubCom Chennai laying 20,000km undersea cable &#8594; clamp material must survive 25-year subsea service &#8594; BeCu chosen over Monel for superior corrosion resistance &#8594; also supplies cable armour terminations &#8594; &#8377;4,500Cr India undersea cable market' },
  { id: 'BCU-0011', batchNo: 'BCU-B2411', city: 'Coimbatore', supplier: 'SAF BeCu Precision', alloyGrade: 'C17200 Foil', application: 'EMI Shield Gasket (BEL Defence)', conductivityPACSIACS: 25, hardnessHRC: 38, investmentCr: 78, status: 'Processing', priority: 'High', origin: 'SAF Coimbatore (TN)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-26', transitDays: 2, zone: 'South', remarks: 'SAF C17200 foil for BEL EMI/RFI shielding gasket for AESA radar module &#8594; 25% IACS with 38 HRC &#8594; &#8377;78Cr for 8 tonnes 0.05mm foil &#8594; 100 dB shielding effectiveness 1-18 GHz &#8594; SAF &#8377;340Cr Coimbatore precision rolling &#8594; first Indian BeCu foil producer &#8594; BEL Ghaziabad producing 2,000 AESA TRM modules/year &#8594; BeCu gasket maintains compression set &lt;5% after thermal cycling &#8594; replaces imported Elastomer-Cu mesh &#8594; also for DRDO EW self-protection jammer housing &#8594; &#8377;2,800Cr India defence EMI shielding market' },
  { id: 'BCU-0012', batchNo: 'BCU-B2412', city: 'Srinagar', supplier: 'Kashmir NonFerrous Works', alloyGrade: 'C17500 Plate', application: 'Explosive Bolt (DRDO)', conductivityPACSIACS: 50, hardnessHRC: 30, investmentCr: 165, status: 'Delayed', priority: 'Critical', origin: 'KNFW Srinagar (JK)', destination: 'DRDO Pune (MH)', shipDate: '2026-07-08', transitDays: 10, zone: 'North', remarks: 'KNFW C17500 plate for DRDO frangible explosive bolt for satellite launch vehicle &#8594; 50% IACS with 30 HRC &#8594; &#8377;165Cr for 15 tonnes plate &#8594; 10-day delay: beryllium oxide inclusion found at 0.15% above 0.1% spec &#8594; DRDO PSLV stage separation depends on 200 explosive bolts per launch &#8594; KNFW &#8377;280Cr Srinagar plate mill &#8594; explosive bolt must fracture predictably at 3,000 psi charge pressure &#8594; re-melting batch with improved deoxidation &#8594; ISRO launching 12 PSLV missions/year &#8594; &#8377;15,000Cr total launch vehicle value at stake &#8594; safety-critical: bolt failure causes stage separation anomaly' },
  { id: 'BCU-0013', batchNo: 'BCU-B2413', city: 'Lucknow', supplier: 'UP BeCu Foundry', alloyGrade: 'C17400 Tube', application: 'Cryogenic Valve Seat (ISRO)', conductivityPACSIACS: 32, hardnessHRC: 34, investmentCr: 142, status: 'Delivered', priority: 'Critical', origin: 'UPBF Lucknow (UP)', destination: 'ISRO Sriharikota (AP)', shipDate: '2026-07-13', transitDays: 2, zone: 'North', remarks: 'UPBF C17400 tube for ISRO GSLV LH2 cryogenic engine valve seat &#8594; 32% IACS retained at -253&#176;C liquid hydrogen &#8594; &#8377;142Cr for 12 tonnes tube &#8594; maintains ductility at cryogenic temperature (KIC 80 MPa&#8730;m at -196&#176;C) &#8594; UPBF &#8377;480Cr Lucknow foundry &#8594; BeCu chosen over stainless steel for thermal conductivity &#8594; ISRO GSLV Mk-3 CE-20 engine with 200kN thrust &#8594; valve seat must survive 50 hot fire cycles &#8594; zero-leak helium proof test at 1.5x operating pressure &#8594; &#8377;1,800Cr per GSLV launch vehicle &#8594; India&apos;s heaviest satellite launcher' },
  { id: 'BCU-0014', batchNo: 'BCU-B2414', city: 'Thiruvananthapuram', alloyGrade: 'C17200 Spring Wire', application: 'Bearing Cage (SCEB)', conductivityPACSIACS: 20, hardnessHRC: 42, investmentCr: 45, status: 'Delayed', priority: 'High', origin: 'VSSC BeCu Lab (KL)', destination: 'SCEB Bengaluru (KA)', shipDate: '2026-07-05', transitDays: 12, zone: 'South', supplier: 'VSSC BeCu Lab', remarks: 'VSSC C17200 spring wire for SCEB satellite reaction wheel bearing cage &#8594; 20% IACS with 42 HRC &#8594; &#8377;45Cr for 6 tonnes spring wire &#8594; 12-day delay: wire drawing die breakage slowed 0.3mm wire production &#8594; bearing cage maintains dimensional stability at 10,000 RPM &#8594; VSSC &#8377;280Cr BeCu wire laboratory &#8594; SCEB producing 1,000 reaction wheels/year for ISRO satellites &#8594; cage material must survive 5-year radiation exposure in LEO &#8594; BeCu has proven radiation resistance &#8594; wire diameter tolerance &#177;1um for 0.3mm wire &#8594; &#8377;620Cr per reaction wheel assembly' }
]

const bcuKpis = [
  { label: 'In Transit / Shipped', value: berylliumCopperRecords.filter(r => r.status === 'In Transit' || r.status === 'Shipped').length, suffix: ' batches', color: 'text-slate-700 bg-slate-50' },
  { label: 'Processing / Mill', value: berylliumCopperRecords.filter(r => r.status === 'Processing' || r.status === 'Mill').length, suffix: ' batches', color: 'text-amber-700 bg-amber-50' },
  { label: 'Delivered / Dispatched', value: berylliumCopperRecords.filter(r => r.status === 'Delivered' || r.status === 'Dispatched').length, suffix: ' batches', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Total Investment', value: berylliumCopperRecords.reduce((s: number, r) => s + r.investmentCr, 0), suffix: ' Cr', color: 'text-indigo-700 bg-indigo-50' }
]

export default function BerylliumCopperLogisticsView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    berylliumCopperRecords.forEach(r => { map[r.status] = (map[r.status] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const supplierCounts = useMemo(() => {
    const map: Record<string, number> = {}
    berylliumCopperRecords.forEach(r => { map[r.supplier] = (map[r.supplier] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const appCounts = useMemo(() => {
    const map: Record<string, number> = {}
    berylliumCopperRecords.forEach(r => { map[r.application] = (map[r.application] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneCounts = useMemo(() => {
    const map: Record<string, number> = {}
    berylliumCopperRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    return berylliumCopperRecords.filter(r => {
      if (searchTerm && !Object.values(r).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))) return false
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length === 0) continue
        const val = String((r as unknown as Record<string, unknown>)[key] || '')
        if (!values.some(v => val.includes(v))) return false
      }
      return true
    })
  }, [searchTerm, activeFilters])

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[key] || []
      if (current.includes(value)) {
        const next = current.filter(v => v !== value)
        return next.length === 0 ? (() => { const n = { ...prev }; delete n[key]; return n })() : { ...prev, [key]: next }
      }
      return { ...prev, [key]: [...current, value] }
    })
  }

  return (
    <div className="bcu-logistics-container p-4 space-y-4">
      <PageHeader title="Beryllium Copper Logistics" description="Beryllium Copper Alloy Supply Chain Tracking &#8212; C17200, C17500, C17400, C17410 and C17510 grades for connectors, welding electrodes, defence tools, EV springs, cryogenic valves and EMI shielding across Indian manufacturing" />

      <div className="bcu-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {bcuKpis.map((kpi, i) => (
          <Card key={i} className="bcu-kpi-card border-l-4 border-l-slate-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-2xl font-bold ${kpi.color.split(' ')[0]}`}>{kpi.value.toLocaleString()}<span className="text-sm font-normal">{kpi.suffix}</span></p></CardContent></Card>
        ))}
      </div>

      <div className="bcu-tab-bar flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`bcu-tab-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === i ? 'bg-slate-600 text-white shadow-md' : 'bg-white text-muted-foreground hover:bg-slate-50 border'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="bcu-dashboard space-y-4">
          <div className="bcu-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bcu-chart-card"><CardHeader><CardTitle className="text-sm">Batch Status Distribution</CardTitle></CardHeader><CardContent>
              <div className="bcu-bar-chart space-y-2">
                {statusCounts.map(([s, c]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden"><div className="bcu-bar-fill h-full bg-slate-500 rounded-full" style={{ width: `${(c / berylliumCopperRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="bcu-chart-card"><CardHeader><CardTitle className="text-sm">Supplier Volume</CardTitle></CardHeader><CardContent>
              <div className="bcu-bar-chart space-y-2">
                {supplierCounts.slice(0, 8).map(([s, c]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{s}</span><div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden"><div className="bcu-bar-fill h-full bg-slate-400 rounded-full" style={{ width: `${(c / berylliumCopperRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="bcu-registry space-y-3">
          <div className="bcu-filter-bar flex flex-wrap gap-2 items-center">
            <Input placeholder="Search batches..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-xs h-8 text-sm" />
            {['status', 'zone', 'priority'].map(key => (
              <div key={key} className="bcu-filter-group flex flex-wrap gap-1">
                {Array.from(new Set(berylliumCopperRecords.map(r => r[key as keyof BerylliumCopperRecord] as string))).filter(Boolean).slice(0, 4).map(val => (
                  <button key={val} onClick={() => toggleFilter(key, val)} className={`bcu-filter-btn px-2 py-1 text-xs rounded-md border transition-all ${activeFilters[key]?.includes(val) ? 'bg-slate-600 text-white border-slate-600' : 'bg-white text-muted-foreground hover:bg-slate-50'}`}>
                    {val}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Card><CardContent className="p-0">
            <div className="bcu-table-wrap overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b bg-slate-50/50">
                  <th className="p-2 text-left font-medium">Batch ID</th><th className="p-2 text-left font-medium">Supplier</th><th className="p-2 text-left font-medium">Grade</th><th className="p-2 text-left font-medium">Application</th><th className="p-2 text-left font-medium">IACS%</th><th className="p-2 text-left font-medium">HRC</th><th className="p-2 text-left font-medium">Investment</th><th className="p-2 text-left font-medium">Status</th><th className="p-2 text-left font-medium">Origin</th><th className="p-2 text-left font-medium">Dest</th>
                </tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`bcu-table-row border-b hover:bg-slate-50/30 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-2"><Badge variant="outline" className="text-slate-700 border-slate-300 font-mono">{r.id}</Badge></td>
                      <td className="p-2">{r.supplier}</td><td className="p-2">{r.alloyGrade}</td><td className="p-2">{r.application}</td>
                      <td className="p-2">{r.conductivityPACSIACS}%</td><td className="p-2">{r.hardnessHRC}</td><td className="p-2">{r.investmentCr}Cr</td>
                      <td className="p-2"><Badge className={`${r.status === 'Delayed' ? 'bg-red-100 text-red-800' : r.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : r.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{r.status}</Badge></td>
                      <td className="p-2 truncate max-w-28">{r.origin}</td><td className="p-2 truncate max-w-28">{r.destination}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </div>
      )}

      {activeTab === 2 && (
        <div className="bcu-analytics space-y-4">
          <div className="bcu-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bcu-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent>
              <div className="bcu-bar-chart space-y-2">
                {(Object.entries(zoneCounts.reduce((acc: Record<string, number>, [z]) => {
                  const total = berylliumCopperRecords.filter(r => r.zone === z).reduce((s: number, rr) => s + rr.investmentCr, 0)
                  acc[z] = total
                  return acc
                }, {})) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, v]) => (
                  <div key={z} className="flex items-center gap-2"><span className="text-xs w-16 text-right">{z}</span><div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden"><div className="bcu-bar-fill h-full bg-slate-500 rounded-full" style={{ width: `${(v / 250) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{v}Cr</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="bcu-chart-card"><CardHeader><CardTitle className="text-sm">Application Distribution</CardTitle></CardHeader><CardContent>
              <div className="bcu-bar-chart space-y-2">
                {appCounts.slice(0, 8).map(([a, c]) => (
                  <div key={a} className="flex items-center gap-2"><span className="text-xs w-36 text-right truncate">{a}</span><div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden"><div className="bcu-bar-fill h-full bg-slate-400 rounded-full" style={{ width: `${(c / berylliumCopperRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="bcu-chart-card"><CardHeader><CardTitle className="text-sm">Conductivity vs Hardness</CardTitle></CardHeader><CardContent>
              <div className="bcu-bar-chart space-y-2">
                {berylliumCopperRecords.sort((a, b) => b.conductivityPACSIACS - a.conductivityPACSIACS).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{r.alloyGrade.split('(')[0].trim()}</span><div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden"><div className="bcu-bar-fill h-full bg-slate-300 rounded-full" style={{ width: `${(r.conductivityPACSIACS / 55) * 100}%` }} /></div><span className="text-xs font-medium w-20 text-right">{r.conductivityPACSIACS}% / {r.hardnessHRC}HRC</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="bcu-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Status</CardTitle></CardHeader><CardContent>
              <div className="bcu-bar-chart space-y-2">
                {(Object.entries(berylliumCopperRecords.reduce((acc: Record<string, { sum: number; count: number }>, r) => {
                  if (!acc[r.status]) acc[r.status] = { sum: 0, count: 0 }
                  acc[r.status].sum += r.transitDays
                  acc[r.status].count += 1
                  return acc
                }, {})) as [string, { sum: number; count: number }][]).map(([s, v]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden"><div className="bcu-bar-fill h-full bg-slate-500 rounded-full" style={{ width: `${(v.sum / v.count / 14) * 100}%` }} /></div><span className="text-xs font-medium w-12 text-right">{(v.sum / v.count).toFixed(1)}d</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="bcu-insights space-y-3">
          <Card className="bcu-insight-card border-l-4 border-l-slate-600"><CardHeader><CardTitle className="text-sm text-slate-800">India Beryllium Copper Market: &#8377;4,500Cr Strategic Alloy</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s beryllium copper market is valued at &#8377;4,500Cr serving automotive EV defence aerospace oil and gas and telecom sectors &#8594; 14 suppliers across 13 cities handling 5 alloy grades &#8594; C17200 (BeCu-2%) dominates connectors springs and moulds &#8594; C17500 (BeCu-Co-Ag) leads defence non-sparking tools and current collectors &#8594; C17400 (BeCu-Ti) for EV motor springs and undersea clamps &#8594; C17410 (BeCu-Ti) for oilfield probes &#8594; C17510 (BeCu-Ni-Co) for welding electrodes and frequency combs &#8594; India imports 70% BeCu from Japan (NGK Kobelco) and USA (Materion Brush Wellman) &#8594; NALCO developing indigenous beryllium ore processing &#8594; &#8377;8,500Cr total BeCu supply chain investment.</p></CardContent></Card>
          <Card className="bcu-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: BCU-0012 and BCU-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BCU-0012 (KNFW Srinagar to DRDO Pune, 10-day delay): C17500 plate for ISRO PSLV explosive bolt &#8594; beryllium oxide (BeO) inclusion at 0.15% above 0.1% spec limit &#8594; BeO particles cause stress concentration and premature fracture in explosive bolts &#8594; KNFW re-melting batch with improved argon deoxidation &#8594; 200 bolts per PSLV launch with &#8377;165Cr at stake &#8594; DRDO qualifying alternative supplier VSSC BeCu Lab. BCU-0014 (VSSC Thiruvananthapuram to SCEB Bengaluru, 12-day delay): C17200 spring wire for satellite reaction wheel bearing cage &#8594; wire drawing die breakage on 0.3mm fine wire &#8594; tungsten carbide die cracked at 180,000m cumulative draw length &#8594; replacing die and restarting cold drawing &#8594; 6 tonnes wire at &#8377;45Cr &#8594; ISRO satellite assembly line idle awaiting bearing cages.</p></CardContent></Card>
          <Card className="bcu-insight-card border-l-4 border-l-slate-500"><CardHeader><CardTitle className="text-sm text-slate-700">Defence-Grade BeCu: Non-Sparking and EMI Shielding</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Beryllium copper is a critical defence material classified under strategic metals &#8594; DRDO Hyderabad C17500 for BEL INS Vikrant non-sparking tools &#8594; certified to MIL-B-56215 and DEF STAN 02-834 for Zone 1 explosive atmosphere &#8594; SAF Coimbatore C17200 foil for EMI shielding gasket on DRDO AESA radar &#8594; 100 dB shielding 1-18 GHz &#8594; DRDO &#8377;1,600Cr BeCu programme &#8594; KNFW Srinagar producing explosive bolts for ISRO launch vehicles &#8594; 200 bolts per PSLV and 300 per GSLV &#8594; safety-critical: bolt fracture causes stage separation failure &#8594; DDP targeting 40% indigenous BeCu for defence by 2029 &#8594; beryllium handling requires OSHA Be exposure &lt;0.2ug/m3 &#8594; Indian foundries implementing fume extraction and PPE protocols.</p></CardContent></Card>
          <Card className="bcu-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">NALCO Beryllium Integration: India&apos;s Strategic Ambition</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">NALCO Bhubaneswar is pursuing beryllium value chain integration &#8594; Indian beryllium ore deposits in Vizianagaram Andhra Pradesh estimated at 12,000 tonnes &#8594; NALCO developing beryllium hydroxide extraction from beryl ore &#8594; current import dependency 70% from NGK Japan Materion USA Kobelco Japan &#8594; &#8377;560Cr BeCu alloy division &#8594; NALCO targeting C17200 strip production by 2028 &#8594; &#8377;2,800Cr integrated beryllium complex proposed &#8594; beryllium is also used in X-ray windows (Be metal) and nuclear reactor neutron reflectors &#8594; strategic material for India&apos;s nuclear submarine INS Arihant programme &#8594; domestic BeO ceramic production for nuclear applications &#8594; beryllium exposure safety standards being tightened under new Atomic Energy Regulations.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
