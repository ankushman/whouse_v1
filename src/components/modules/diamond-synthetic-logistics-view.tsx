'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Diamond } from 'lucide-react'

interface DiamondSyntheticRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  diamondType: string
  application: string
  caratKg: number
  clarityVVS: number
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

const diamondRecords: DiamondSyntheticRecord[] = [
  { id: 'DSN-0001', batchNo: 'DSN-B2401', city: 'Surat', manufacturer: 'Ethical Diamond Surat', diamondType: 'CVD Single Crystal', application: 'Jewellery Polki (Tanishq)', caratKg: 5000, clarityVVS: 98, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'EDS Surat (GJ)', destination: 'Tanishq Hosur (TN)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'EDS CVD single crystal 3mm round brilliant for Tanishq lab-grown diamond jewellery &#8594; 5,000 carats VVS clarity 98% yield &#8594; &#8377;185Cr for 2kg rough diamond &#8594; 60% cheaper than mined diamond equivalent &#8594; EDS &#8377;2,400Cr Surat CVD cluster with 100 reactors &#8594; Tanishq launching lab-grown diamond collection in 150 stores &#8594; India processes 14 of 15 world diamonds &#8594; CVD diamond certified by IGI and GIA &#8594; growing at 25% CAGR as millennials prefer lab-grown &#8594; &#8377;8,000Cr India lab-grown diamond market' },
  { id: 'DSN-0002', batchNo: 'DSN-B2402', city: 'Bengaluru', manufacturer: 'IIa Technologies', diamondType: 'CVD Electronic Grade', application: 'Semiconductor Heat Spreader (Wipro GE)', caratKg: 800, clarityVVS: 99, investmentCr: 245, status: 'In Transit', priority: 'Critical', origin: 'IIa Bengaluru (KA)', destination: 'Wipro GE Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 0, zone: 'South', remarks: 'IIa CVD electronic-grade diamond wafer for Wipro GE GaN power device heat spreader &#8594; 800 carats single-crystal thermal conductivity 2,200 W/mK &#8594; &#8377;245Cr for 0.8kg diamond wafer &#8594; 5x thermal conductivity vs copper &#8594; IIa &#8377;3,200Cr Bengaluru CVD fab &#8594; world&apos;s largest CVD diamond manufacturer &#8594; Wipro GE producing 100,000 GaN power modules/year &#8594; diamond heat spreader enables 50% higher power density &#8594; also for SiC MOSFET thermal management &#8594; &#8377;2,800Cr India wide-bandgap semiconductor thermal market' },
  { id: 'DSN-0003', batchNo: 'DSN-B2403', city: 'Mumbai', manufacturer: 'Element Six India', diamondType: 'HPHT Industrial', application: 'Cutting Tool Insert (Sandvik)', caratKg: 1200, clarityVVS: 0, investmentCr: 95, status: 'Delivered', priority: 'Standard', origin: 'E6 Mumbai (MH)', destination: 'Sandvik Pune (MH)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Element Six HPHT industrial diamond for Sandvik PCD cutting tool insert &#8594; 1,200 carats single-crystal for polycrystalline diamond compact &#8594; &#8377;95Cr for 1.2kg diamond grit &#8594; PCD tool life 100x vs WC-Co for aluminium machining &#8594; Element Six India &#8377;1,800Cr Mumbai &#8594; parent Element Six De Beers Group &#8594; Sandvik supplying PCD tools to Tata Motors Mahindra for aluminium engine block &#8594; HPHT diamond 8 GPa hardness &#8594; also for wire drawing dies and grinding wheels &#8594; &#8377;1,500Cr India PCD tool market' },
  { id: 'DSN-0004', batchNo: 'DSN-B2404', city: 'Hyderabad', manufacturer: 'DRDO Diamond Centre', diamondType: 'CVD Radiation Detector', application: 'Dosimeter (BARC)', caratKg: 150, clarityVVS: 99, investmentCr: 320, status: 'In Transit', priority: 'Critical', origin: 'DRDC Hyderabad (TS)', destination: 'BARC Trombay (MH)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'DRDO CVD diamond radiation detector for BARC nuclear dosimeter &#8594; 150 carats electronic-grade single crystal &#8594; &#8377;320Cr for 0.15kg detector-grade diamond &#8594; radiation hardness 1000x silicon &#8594; DRDC &#8377;1,600Cr diamond centre &#8594; diamond detector operates to 500&#176;C vs 150&#176;C silicon &#8594; BARC deploying 500 diamond dosimeters across 22 nuclear power plants &#8594; also for Tarapur and Kakrapar reactor neutron flux monitoring &#8594; replaces 3He tube neutron detector (helium shortage) &#8594; &#8377;5,600Cr India nuclear instrumentation market' },
  { id: 'DSN-0005', batchNo: 'DSN-B2405', city: 'Pune', manufacturer: 'Spark Diamonds', diamondType: 'HPHT Gem Quality', application: 'Jewellery Melee (Kalyan)', caratKg: 3000, clarityVVS: 95, investmentCr: 128, status: 'Processing', priority: 'Standard', origin: 'Spark Pune (MH)', destination: 'Kalyan Mumbai (MH)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'Spark HPHT 1-3mm melee for Kalyan Jewellers lab-grown diamond studded collection &#8594; 3,000 carats VS-VS clarity 95% yield &#8594; &#8377;128Cr for 1.5kg melee diamond &#8594; round brilliant cut with EX-EX grading &#8594; Spark &#8377;680Cr Pune HPHT cluster with 50 presses &#8594; Kalyan expanding lab-grown from 50 to 300 stores &#8594; melee diamonds for halo setting and tennis bracelet &#8594; India consumes 80% of world diamond melee &#8594; &#8377;18,000Cr India diamond jewellery market &#8594; lab-grown melee growing at 35% CAGR &#8594; Surat polishing 1.5 million pieces/day' },
  { id: 'DSN-0006', batchNo: 'DSN-B2406', city: 'Chennai', manufacturer: 'CSIR-CGCRI Diamond Lab', diamondType: 'CVD Optical Window', application: 'Laser Optics (ISRO)', caratKg: 200, clarityVVS: 99, investmentCr: 265, status: 'Delivered', priority: 'Critical', origin: 'CGCRI Chennai (TN)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-12', transitDays: 2, zone: 'South', remarks: 'CGCRI CVD diamond window for ISRO high-power LIDAR laser &#8594; 200 carats optical-grade with &lt;1% absorption at 1064nm &#8594; &#8377;265Cr for 0.2kg diamond window blanks &#8594; transmits MW-class laser without thermal lensing &#8594; CGCRI &#8377;480Cr diamond optics lab &#8594; diamond window replaces ZnSe at 10x higher damage threshold &#8594; ISRO deploying LIDAR on Chandrayaan-4 and Gaganyaan &#8594; diamond optic operates UV to far-IR 225nm-2500nm &#8594; &#8377;3,200Cr India space optics market &#8594; also for DRDO directed-energy laser defence programme' },
  { id: 'DSN-0007', batchNo: 'DSN-B2407', city: 'Jaipur', manufacturer: 'Rajasthan Diamond Works', diamondType: 'HPHT Abrasive Grit', application: 'Lapping Slurry (BEML)', caratKg: 8000, clarityVVS: 0, investmentCr: 42, status: 'Processing', priority: 'Standard', origin: 'RDW Jaipur (RJ)', destination: 'BEML Bengaluru (KA)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'RDW HPHT diamond grit 40-80um for BEML bearing lapping slurry &#8594; 8,000 carats micro-grit for precision finishing &#8594; &#8377;42Cr for 4kg diamond powder &#8594; surface finish Ra 0.05um for aerospace bearing &#8594; RDW &#8377;220Cr Jaipur processing &#8594; BEML producing 50,000 bearing sets/year for defence &#8594; diamond slurry replaces alumina and SiC at 10x faster material removal &#8594; also for hard disk head lapping and optical lens polishing &#8594; &#8377;600Cr India diamond abrasive market &#8594; HPHT grit 3x cheaper than natural diamond grit' },
  { id: 'DSN-0008', batchNo: 'DSN-B2408', city: 'Noida', manufacturer: 'Apex Diamond Tech', diamondType: 'CVD Quantum Grade', application: 'Qubit Substrate (IISc)', caratKg: 50, clarityVVS: 100, investmentCr: 380, status: 'In Transit', priority: 'Critical', origin: 'ADT Noida (UP)', destination: 'IISc Bengaluru (KA)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: 'ADT CVD quantum-grade diamond for IISc nitrogen-vacancy (NV) centre qubit &#8594; 50 carats isotopically pure 12C diamond (99.99% 12C) &#8594; &#8377;380Cr for 25g quantum diamond &#8594; NV centre coherence time 1ms at room temperature &#8594; ADT &#8377;520Cr Noida CVD fab &#8594; IISc building 10-qubit diamond quantum processor &#8594; NV diamond enables room-temperature quantum computing &#8594; replaces superconducting qubits requiring 15mK &#8594; &#8377;4,500Cr India quantum computing market by 2030 &#8594; also for DRDO quantum magnetometer and quantum radar' },
  { id: 'DSN-0009', batchNo: 'DSN-B2409', city: 'Ahmedabad', manufacturer: 'Gujarat Nano Diamond', diamondType: 'Detonation Nano Diamond', application: 'Drug Delivery (Zydus)', caratKg: 10000, clarityVVS: 0, investmentCr: 55, status: 'Delivered', priority: 'High', origin: 'GND Ahmedabad (GJ)', destination: 'Zydus Ahmedabad (GJ)', shipDate: '2026-07-14', transitDays: 0, zone: 'West', remarks: 'GND detonation nano diamond for Zydus cancer drug delivery carrier &#8594; 10,000 carats DND 4-6nm particle size &#8594; &#8377;55Cr for 5kg nano diamond &#8594; DND surface functionalized with carboxyl group for doxorubicin loading &#8594; GND &#8377;180Cr Ahmedabad DND plant &#8594; drug loading 120mg/g 3x higher than liposome &#8594; Zydus oncology division launching nano-diamond paclitaxel formulation &#8594; in-vivo studies show 60% tumor reduction vs 30% free drug &#8594; also for lubricant additive and polymer composite reinforcement &#8594; &#8377;6,500Cr India nanomedicine market' },
  { id: 'DSN-0010', batchNo: 'DSN-B2410', city: 'Kolkata', manufacturer: 'Bengal Diamond Corp', diamondType: 'CVD Electrode', application: 'Water Treatment (Kolkata Muncipal)', caratKg: 300, clarityVVS: 85, investmentCr: 72, status: 'Delivered', priority: 'Standard', origin: 'BDC Kolkata (WB)', destination: 'KMWP Kolkata (WB)', shipDate: '2026-07-17', transitDays: 0, zone: 'East', remarks: 'BDC boron-doped CVD diamond electrode for Kolkata municipal water treatment &#8594; 300 carats conductive diamond with boron doping 10^20 cm-3 &#8594; &#8377;72Cr for 0.3kg BDD electrode &#8594; electrochemical oxidation mineralizes 99.9% organic pollutants &#8594; BDC &#8377;280Cr Kolkata CVD processing &#8594; Kolkata treating 500 MLD wastewater &#8594; diamond electrode outlasts DSA anode 20x &#8594; zero chemical dosing required &#8594; also for textile effluent treatment in Tirupur &#8594; &#8377;1,200Cr India electrochemical water treatment market &#8594; diamond electrode replaces chlorine disinfection' },
  { id: 'DSN-0011', batchNo: 'DSN-B2411', city: 'Coimbatore', diamondType: 'HPHT Wire Die', application: 'Wire Drawing (Sterlite Copper)', caratKg: 400, clarityVVS: 90, investmentCr: 65, status: 'In Transit', priority: 'Standard', origin: 'SAM Coimbatore (TN)', destination: 'Sterlite Silvassa (DH)', shipDate: '2026-07-21', transitDays: 1, zone: 'South', manufacturer: 'SAM Diamond Tools', remarks: 'SAM HPHT diamond wire drawing die for Sterlite copper wire production &#8594; 400 carats single-crystal die blank for 0.5-3mm wire drawing &#8594; &#8377;65Cr for 0.2kg die blanks &#8594; die life 500,000m vs 200,000m WC die &#8594; SAM &#8377;320Cr Coimbatore diamond tool factory &#8594; Sterlite producing 200,000 tonnes copper wire/year &#8594; diamond die enables mirror-finish wire surface at 500m/s draw speed &#8594; also for aluminium and steel wire drawing &#8594; &#8377;400Cr India wire drawing die market &#8594; HPHT die cost 5x WC but life 10x longer' },
  { id: 'DSN-0012', batchNo: 'DSN-B2412', city: 'Guwahati', manufacturer: 'NE Diamond Hub', diamondType: 'CVD Wear Coating', application: 'Mining Drill Bit (NMDC)', caratKg: 600, clarityVVS: 80, investmentCr: 88, status: 'Delayed', priority: 'High', origin: 'NEDH Guwahati (AS)', destination: 'NMDC Bailadila (CG)', shipDate: '2026-07-09', transitDays: 7, zone: 'East', remarks: 'NEDH CVD diamond-coated drill bit for NMDC iron ore mining &#8594; 600 carats CVD diamond film 50um thick on WC-Co substrate &#8594; &#8377;88Cr for 0.3kg coating material &#8594; 7-day delay: CVD reactor cooling system failure delayed film deposition &#8594; NEDH &#8377;350Cr Guwahati CVD coating hub &#8594; diamond-coated bit life 3x PDC bit in iron ore &#8594; NMDC producing 67 MT iron ore/year &#8594; drill bit consumption 5,000/year &#8594; diamond coating also for bearing and seal faces &#8594; &#8377;1,800Cr India mining tool market' },
  { id: 'DSN-0013', batchNo: 'DSN-B2413', city: 'Thiruvananthapuram', manufacturer: 'VSSC Diamond Lab', diamondType: 'CVD X-Ray Window', application: 'Satellite Payload (ISRO)', caratKg: 100, clarityVVS: 100, investmentCr: 295, status: 'Delivered', priority: 'Critical', origin: 'VSSC Thiruvananthapuram (KL)', destination: 'ISAC Bengaluru (KA)', shipDate: '2026-07-13', transitDays: 1, zone: 'South', remarks: 'VSSC CVD diamond X-ray window for ISRO GSAT-N2 astronomy payload &#8594; 100 carats beryllium-free diamond 0.5mm thick &#8594; &#8377;295Cr for 50g window blanks &#8594; X-ray transmission 95% at 1keV vs 50% Be &#8594; VSSC &#8377;480Cr diamond lab &#8594; eliminates beryllium toxicity hazard in satellite assembly &#8594; diamond window also for X-ray fluorescence spectrometer &#8594; ISRO deploying on &#8377;12,000Cr GSAT-N2 &#8594; first Indian space-qualified diamond X-ray window &#8594; 15-year radiation hardness in GEO orbit &#8594; also for Aditya-L1 solar X-ray spectrometer' },
  { id: 'DSN-0014', batchNo: 'DSN-B2414', city: 'Lucknow', manufacturer: 'UP Diamond Park', diamondType: 'CVD Phonon Substrate', application: '5G RF Filter (Qorvo India)', caratKg: 350, clarityVVS: 99, investmentCr: 178, status: 'Delayed', priority: 'Critical', origin: 'UDP Lucknow (UP)', destination: 'Qorvo Hyderabad (TS)', shipDate: '2026-07-06', transitDays: 12, zone: 'North', remarks: 'UDP CVD diamond substrate for Qorvo 5G RF filter &#8594; 350 carats diamond-on-Si substrate for SAW/BAW filter &#8594; &#8377;178Cr for 0.175kg diamond substrate &#8594; 12-day delay: CVD diamond-to-Si wafer bonding yield at 72% below 90% spec &#8594; diamond acoustic velocity 18,000 m/s vs 3,000 m/s Si &#8594; enables 5G filter frequency up to 20GHz &#8594; UDP &#8377;820Cr Lucknow diamond park &#8594; Qorvo India &#8377;2,200Cr Hyderabad filter fab &#8594; India importing 100% RF filter substrates from Japan &#8594; 12-day delay impacting Qorvo 5G n77 filter production line &#8594; &#8377;4,000Cr India 5G RF filter market' }
]

const dsnKpis = [
  { label: 'In Transit / Shipped', value: diamondRecords.filter(r => r.status === 'In Transit' || r.status === 'Shipped').length, suffix: ' batches', color: 'text-cyan-700 bg-cyan-50' },
  { label: 'Processing / Growth', value: diamondRecords.filter(r => r.status === 'Processing' || r.status === 'Growth').length, suffix: ' batches', color: 'text-amber-700 bg-amber-50' },
  { label: 'Delivered / Certified', value: diamondRecords.filter(r => r.status === 'Delivered' || r.status === 'Certified').length, suffix: ' batches', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Total Investment', value: diamondRecords.reduce((s: number, r) => s + r.investmentCr, 0), suffix: ' Cr', color: 'text-sky-700 bg-sky-50' }
]

export default function DiamondSyntheticLogisticsView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    diamondRecords.forEach(r => { map[r.status] = (map[r.status] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const mfrCounts = useMemo(() => {
    const map: Record<string, number> = {}
    diamondRecords.forEach(r => { map[r.manufacturer] = (map[r.manufacturer] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const appCounts = useMemo(() => {
    const map: Record<string, number> = {}
    diamondRecords.forEach(r => { map[r.application] = (map[r.application] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneCounts = useMemo(() => {
    const map: Record<string, number> = {}
    diamondRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    return diamondRecords.filter(r => {
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
    <div className="dsn-logistics-container p-4 space-y-4">
      <PageHeader title="Synthetic Diamond Logistics" description="Lab-Grown Diamond Supply Chain Tracking &#8212; CVD and HPHT diamonds for jewellery, semiconductor thermal, defence radiation detector, quantum qubit, water treatment, mining tools and 5G RF filter substrates across India" />

      <div className="dsn-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {dsnKpis.map((kpi, i) => (
          <Card key={i} className="dsn-kpi-card border-l-4 border-l-cyan-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-2xl font-bold ${kpi.color.split(' ')[0]}`}>{kpi.value.toLocaleString()}<span className="text-sm font-normal">{kpi.suffix}</span></p></CardContent></Card>
        ))}
      </div>

      <div className="dsn-tab-bar flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`dsn-tab-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === i ? 'bg-cyan-600 text-white shadow-md' : 'bg-white text-muted-foreground hover:bg-cyan-50 border'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="dsn-dashboard space-y-4">
          <div className="dsn-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="dsn-chart-card"><CardHeader><CardTitle className="text-sm">Batch Status</CardTitle></CardHeader><CardContent>
              <div className="dsn-bar-chart space-y-2">
                {statusCounts.map(([s, c]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-cyan-100 rounded-full h-4 overflow-hidden"><div className="dsn-bar-fill h-full bg-cyan-500 rounded-full" style={{ width: `${(c / diamondRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="dsn-chart-card"><CardHeader><CardTitle className="text-sm">Manufacturer Volume</CardTitle></CardHeader><CardContent>
              <div className="dsn-bar-chart space-y-2">
                {mfrCounts.slice(0, 8).map(([m, c]) => (
                  <div key={m} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{m}</span><div className="flex-1 bg-cyan-100 rounded-full h-4 overflow-hidden"><div className="dsn-bar-fill h-full bg-cyan-400 rounded-full" style={{ width: `${(c / diamondRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="dsn-registry space-y-3">
          <div className="dsn-filter-bar flex flex-wrap gap-2 items-center">
            <Input placeholder="Search batches..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-xs h-8 text-sm" />
            {['status', 'zone', 'priority'].map(key => (
              <div key={key} className="dsn-filter-group flex flex-wrap gap-1">
                {Array.from(new Set(diamondRecords.map(r => r[key as keyof DiamondSyntheticRecord] as string))).filter(Boolean).slice(0, 4).map(val => (
                  <button key={val} onClick={() => toggleFilter(key, val)} className={`dsn-filter-btn px-2 py-1 text-xs rounded-md border transition-all ${activeFilters[key]?.includes(val) ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-muted-foreground hover:bg-cyan-50'}`}>
                    {val}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Card><CardContent className="p-0">
            <div className="dsn-table-wrap overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b bg-cyan-50/50">
                  <th className="p-2 text-left font-medium">Batch ID</th><th className="p-2 text-left font-medium">Manufacturer</th><th className="p-2 text-left font-medium">Type</th><th className="p-2 text-left font-medium">Application</th><th className="p-2 text-left font-medium">Carats</th><th className="p-2 text-left font-medium">Investment</th><th className="p-2 text-left font-medium">Status</th><th className="p-2 text-left font-medium">Origin</th><th className="p-2 text-left font-medium">Dest</th>
                </tr></thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className={`dsn-table-row border-b hover:bg-cyan-50/30 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-2"><Badge variant="outline" className="text-cyan-700 border-cyan-300 font-mono">{r.id}</Badge></td>
                      <td className="p-2">{r.manufacturer}</td><td className="p-2">{r.diamondType}</td><td className="p-2">{r.application}</td>
                      <td className="p-2">{r.caratKg.toLocaleString()}</td><td className="p-2">{r.investmentCr}Cr</td>
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
        <div className="dsn-analytics space-y-4">
          <div className="dsn-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="dsn-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent>
              <div className="dsn-bar-chart space-y-2">
                {(Object.entries(zoneCounts.reduce((acc: Record<string, number>, [z]) => { acc[z] = diamondRecords.filter(r => r.zone === z).reduce((s: number, rr) => s + rr.investmentCr, 0); return acc }, {})) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, v]) => (
                  <div key={z} className="flex items-center gap-2"><span className="text-xs w-16 text-right">{z}</span><div className="flex-1 bg-cyan-100 rounded-full h-4 overflow-hidden"><div className="dsn-bar-fill h-full bg-cyan-500 rounded-full" style={{ width: `${(v / 500) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{v}Cr</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="dsn-chart-card"><CardHeader><CardTitle className="text-sm">Application Distribution</CardTitle></CardHeader><CardContent>
              <div className="dsn-bar-chart space-y-2">
                {appCounts.slice(0, 8).map(([a, c]) => (
                  <div key={a} className="flex items-center gap-2"><span className="text-xs w-36 text-right truncate">{a}</span><div className="flex-1 bg-cyan-100 rounded-full h-4 overflow-hidden"><div className="dsn-bar-fill h-full bg-cyan-400 rounded-full" style={{ width: `${(c / diamondRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="dsn-chart-card"><CardHeader><CardTitle className="text-sm">Carat Volume by Manufacturer</CardTitle></CardHeader><CardContent>
              <div className="dsn-bar-chart space-y-2">
                {diamondRecords.sort((a, b) => b.caratKg - a.caratKg).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{r.manufacturer.split(' ')[0]}</span><div className="flex-1 bg-cyan-100 rounded-full h-4 overflow-hidden"><div className="dsn-bar-fill h-full bg-cyan-300 rounded-full" style={{ width: `${(r.caratKg / 10000) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{r.caratKg.toLocaleString()}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="dsn-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Status</CardTitle></CardHeader><CardContent>
              <div className="dsn-bar-chart space-y-2">
                {(Object.entries(diamondRecords.reduce((acc: Record<string, { sum: number; count: number }>, r) => { if (!acc[r.status]) acc[r.status] = { sum: 0, count: 0 }; acc[r.status].sum += r.transitDays; acc[r.status].count += 1; return acc }, {})) as [string, { sum: number; count: number }][]).map(([s, v]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-cyan-100 rounded-full h-4 overflow-hidden"><div className="dsn-bar-fill h-full bg-cyan-500 rounded-full" style={{ width: `${(v.sum / v.count / 14) * 100}%` }} /></div><span className="text-xs font-medium w-12 text-right">{(v.sum / v.count).toFixed(1)}d</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="dsn-insights space-y-3">
          <Card className="dsn-insight-card border-l-4 border-l-cyan-600"><CardHeader><CardTitle className="text-sm text-cyan-800">India Synthetic Diamond Ecosystem: &#8377;22,000Cr by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s lab-grown diamond industry is projected at &#8377;22,000Cr by 2028 with 14 manufacturers across 13 cities &#8594; CVD dominates electronic-grade and quantum applications (IIa, DRDO, CGCRI, VSSC) while HPHT leads jewellery melee and industrial grit (Spark, Element Six, RDW) &#8594; Surat processes 14 of every 15 world diamonds and is rapidly scaling lab-grown capacity &#8594; 100+ CVD reactors and 50+ HPHT presses operational in India &#8594; key export markets: USA 40%, EU 25%, China 20%, Middle East 15% &#8594; &#8377;12,000Cr total investment across Indian diamond facilities &#8594; India targeting 30% of global lab-grown diamond production by 2028 &#8594; 500,000+ carats/month production capacity.</p></CardContent></Card>
          <Card className="dsn-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: DSN-0012 and DSN-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">DSN-0012 (NEDH Guwahati to NMDC Bailadila, 7-day delay): CVD diamond-coated drill bit for iron ore mining &#8594; CVD reactor cooling system failure halted 50um film deposition &#8594; NEDH replacing chiller and restarting plasma at 2.45GHz microwave &#8594; 0.3kg coating material at &#8377;88Cr &#8594; NMDC 67 MT iron ore drilling impacted. DSN-0014 (UDP Lucknow to Qorvo Hyderabad, 12-day delay): CVD diamond-on-Si substrate for 5G RF filter &#8594; diamond-to-Si wafer bonding yield at 72% below 90% target &#8594; UDP troubleshooting plasma-enhanced bonding at 800&#176;C &#8594; 0.175kg substrate at &#8377;178Cr &#8594; Qorvo 5G n77 filter production line idle &#8594; &#8377;4,000Cr India 5G RF filter market import-dependent &#8594; 12-day delay risks missing Qorvo Q3 delivery commitments.</p></CardContent></Card>
          <Card className="dsn-insight-card border-l-4 border-l-cyan-500"><CardHeader><CardTitle className="text-sm text-cyan-700">Diamond Quantum Computing: Room-Temperature Qubits</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India is pioneering diamond-based quantum computing at IISc Bengaluru &#8594; nitrogen-vacancy (NV) centre qubits in isotopically pure 12C diamond &#8594; Apex Diamond Tech Noida producing quantum-grade CVD diamond with 99.99% 12C purity &#8594; NV centre coherence time 1ms at room temperature vs 100us for superconducting qubits at 15mK &#8594; IISc building 10-qubit NV diamond processor &#8594; DRDO developing quantum magnetometer and quantum radar using NV centres &#8594; room-temperature operation eliminates cryogenic infrastructure &#8594; &#8377;4,500Cr India quantum computing market by 2030 &#8594; diamond qubits also for quantum communication and quantum sensing &#8594; strategic for defence navigation without GPS.</p></CardContent></Card>
          <Card className="dsn-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">CVD Diamond for Defence and Space: Strategic Material</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Diamond is emerging as a strategic defence and space material in India &#8594; DRDO Hyderabad CVD diamond radiation detector for BARC nuclear dosimeter &#8594; 1000x radiation hardness vs silicon &#8594; operates at 500&#176;C enabling in-core reactor monitoring &#8594; CGCRI Chennai diamond laser window for ISRO LIDAR on Chandrayaan-4 and Gaganyaan &#8594; 10x higher damage threshold vs ZnSe &#8594; VSSC diamond X-ray window for GSAT-N2 astronomy payload &#8594; eliminates beryllium toxicity &#8594; DRDO diamond quantum radar for stealth detection &#8594; &#8377;3,200Cr defence diamond programme &#8594; diamond also for directed-energy laser thermal management &#8594; 5 Indian government agencies now procuring CVD diamond &#8594; targeting 50% indigenous defence diamond by 2029.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
