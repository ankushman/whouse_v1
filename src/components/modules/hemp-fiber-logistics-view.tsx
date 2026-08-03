'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Leaf } from 'lucide-react'

interface HempFiberRecord {
  id: string
  batchNo: string
  city: string
  processor: string
  fiberType: string
  application: string
  tensileStrengthMPa: number
  yieldTonnes: number
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

const hempFiberRecords: HempFiberRecord[] = [
  { id: 'HFL-0001', batchNo: 'HFL-B2401', city: 'Dehradun', processor: 'Uttarakhand Hemp Board', fiberType: 'Industrial Bast Fiber', application: 'Biocomposite Auto Panel (Tata Motors)', tensileStrengthMPa: 550, yieldTonnes: 120, investmentCr: 45, status: 'Delivered', priority: 'High', origin: 'UHB Rishikesh (UK)', destination: 'Tata Motors Pune (MH)', shipDate: '2026-07-18', transitDays: 2, zone: 'North', remarks: 'UHB industrial bast fiber for Tata Nexon door panel biocomposite &#8594; 550 MPa tensile replacing ABS plastic &#8594; &#8377;45Cr for 120 tonnes hemp fiber &#8594; 30% weight reduction vs glass fiber &#8594; Uttarakhand Hemp Board &#8377;320Cr programme &#8594; 5,000 farmers cultivating 10,000 hectares &#8594; first Indian state to legalize industrial hemp cultivation 2021 &#8594; THC content below 0.3% compliance &#8594; CO2 absorption 10 tonnes/hectare during growth' },
  { id: 'HFL-0002', batchNo: 'HFL-B2402', city: 'Guwahati', processor: 'Assam Hemp Co-op', fiberType: 'Primary Long Fiber', application: 'Textile Yarn (Raymond Ltd)', tensileStrengthMPa: 480, yieldTonnes: 85, investmentCr: 32, status: 'In Transit', priority: 'Standard', origin: 'AHC Tezpur (AS)', destination: 'Raymond Thane (MH)', shipDate: '2026-07-24', transitDays: 4, zone: 'East', remarks: 'Assam Hemp Co-op long fiber for Raymond hemp-cotton blended fabric &#8594; 480 MPa for textile-grade spinning &#8594; &#8377;32Cr for 85 tonnes &#8594; hemp-cotton 60:40 blend with linen-like hand feel &#8594; Assam 15,000 hectares under hemp cultivation &#8594; cooperative model with 2,500 tribal farmers &#8594; Raymond launching hemp clothing line for sustainability market &#8594; UV resistance 3x better than cotton &#8594; antimicrobial and anti-odour natural properties' },
  { id: 'HFL-0003', batchNo: 'HFL-B2403', city: 'Bengaluru', processor: 'Becho Hemp Tech', fiberType: 'Technical Short Fiber', application: 'Construction Board (AkzoNobel India)', tensileStrengthMPa: 320, yieldTonnes: 200, investmentCr: 58, status: 'Delivered', priority: 'Standard', origin: 'Becho Bengaluru (KA)', destination: 'AkzoNobel Noida (UP)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'Becho technical short fiber for AkzoNobel hempcrete insulation board &#8594; 320 MPa for composite reinforcement &#8594; &#8377;58Cr for 200 tonnes &#8594; hempcrete R-value 2.4/inch vs 0.5/inch concrete &#8594; Becho &#8377;450Cr Bengaluru processing facility &#8594; decortication and retting for fiber extraction &#8594; AkzoNobel hemp building panel for green building market &#8594; 50% thermal insulation improvement &#8594; carbon-negative building material absorbing 110kg CO2/m3' },
  { id: 'HFL-0004', batchNo: 'HFL-B2404', city: 'Jodhpur', processor: 'Rajasthan Hemp Federation', fiberType: 'Hurd/Shiv Fiber', application: 'Animal Bedding (Godrej Agrovet)', tensileStrengthMPa: 180, yieldTonnes: 300, investmentCr: 22, status: 'In Transit', priority: 'Standard', origin: 'RHF Jodhpur (RJ)', destination: 'Godrej Agrovet Mumbai (MH)', shipDate: '2026-07-23', transitDays: 3, zone: 'North', remarks: 'Rajasthan Hemp Federation hurd fiber for Godrej poultry and cattle bedding &#8594; 180 MPa hurd from woody core after bast extraction &#8594; &#8377;22Cr for 300 tonnes &#8594; 4x absorption capacity vs straw bedding &#8594; antimicrobial reduces ammonia 60% &#8594; RHF &#8377;180Cr Rajasthan programme &#8594; 8,000 hectares in Thar Desert with drip irrigation &#8594; hemp requires 50% less water than cotton &#8594; 90-day crop cycle enables triple harvest per year in desert climate' },
  { id: 'HFL-0005', batchNo: 'HFL-B2405', city: 'Lucknow', processor: 'UP Hemp Authority', fiberType: 'CBD-Grade Flower', application: 'Pharma CBD Isolate (Zandu Pharma)', tensileStrengthMPa: 0, yieldTonnes: 45, investmentCr: 125, status: 'Processing', priority: 'Critical', origin: 'UPHA Lucknow (UP)', destination: 'Zandu Mumbai (MH)', shipDate: '2026-07-25', transitDays: 3, zone: 'North', remarks: 'UP Hemp Authority CBD-grade hemp flower for Zandu pharmaceutical CBD isolate &#8594; 0.2% THC compliance for AYUSH-approved formulations &#8594; &#8377;125Cr for 45 tonnes flower biomass &#8594; CBD isolate purity 99.2% &#8594; UPHA &#8377;850Cr Uttar Pradesh programme &#8594; 12,000 hectares across 15 districts &#8594; AYUSH Ministry notified hemp-derived CBD as Schedule E1 drug &#8594; applications: anti-epilepsy (Dravet syndrome), chronic pain, anxiety &#8594; &#8377;4,500Cr India CBD market by 2028' },
  { id: 'HFL-0006', batchNo: 'HFL-B2406', city: 'Imphal', processor: 'Manipur Hemp Collective', fiberType: 'Cordage/Rope Fiber', application: 'Marine Rope (Cochin Shipyard)', tensileStrengthMPa: 420, yieldTonnes: 65, investmentCr: 38, status: 'Delayed', priority: 'High', origin: 'MHC Imphal (MN)', destination: 'Cochin Shipyard Kerala (KL)', shipDate: '2026-07-11', transitDays: 7, zone: 'East', remarks: 'Manipur Hemp Collective cordage for Cochin Shipyard marine rope &#8594; 420 MPa tensile for mooring and towing lines &#8594; &#8377;38Cr for 65 tonnes &#8594; 7-day delay: monsoon flooding damaged retting tanks &#8594; hemp rope 8x stronger than manila and floats in water &#8594; MHC &#8377;150Cr cooperative with 800 Naga and Kuki tribal farmers &#8594; traditional hand-retting expertise with organic certification &#8594; Cochin Shipyard qualifying hemp rope for Navy INS Vishal carrier &#8594; replacing imported nylon rope at 40% lower cost' },
  { id: 'HFL-0007', batchNo: 'HFL-B2407', city: 'Shimla', processor: 'Himachal Hemp Initiative', fiberType: 'Seed (Food Grade)', application: 'Hemp Seed Protein (Fortis Health)', tensileStrengthMPa: 0, yieldTonnes: 80, investmentCr: 52, status: 'Delivered', priority: 'Standard', origin: 'HHI Shimla (HP)', destination: 'Fortis Gurgaon (HR)', shipDate: '2026-07-14', transitDays: 2, zone: 'North', remarks: 'Himachal Hemp Initiative food-grade hemp seed for Fortis nutrition programme &#8594; 33% protein content with complete amino acid profile &#8594; &#8377;52Cr for 80 tonnes seed &#8594; omega-3:omega-6 ratio 1:3 ideal for cardiac health &#8594; HHI &#8377;220Cr Himachal programme &#8594; 3,000 hectares at 1,500-2,500m altitude &#8594; FSSAI approved hemp seed as food ingredient 2023 &#8594; Fortis incorporating hemp protein in cardiac rehab diet &#8594; 200 tonnes seed oil for nutraceutical omega-3 supplements &#8594; hemp seed milk and butter launch Q3 2026' },
  { id: 'HFL-0008', batchNo: 'HFL-B2408', city: 'Bhopal', processor: 'MP Hemp Mission', fiberType: 'Nano-Cellulose Hemp', application: 'Bioplastic Film (Dabur India)', tensileStrengthMPa: 280, yieldTonnes: 35, investmentCr: 95, status: 'Processing', priority: 'High', origin: 'MPHM Bhopal (MP)', destination: 'Dabur Ghaziabad (UP)', shipDate: '2026-07-26', transitDays: 1, zone: 'Central', remarks: 'MP Hemp Mission nano-cellulose for Dabur bioplastic packaging film &#8594; 280 MPa nano-fibrillated hemp cellulose &#8594; &#8377;95Cr for 35 tonnes nano-cellulose &#8594; biodegradable in 90 days vs 450 years for PP &#8594; MPHM &#8377;650Cr Madhya Pradesh hemp mission &#8594; 8,000 hectares with dedicated processing park at Bhopal &#8594; Dabur targeting 100% biodegradable packaging by 2028 &#8594; nano-hemp cellulose film OTR barrier 50cc/m2/day &#8594; replacing plastic blister packs for Ayurvedic products &#8594; &#8377;1,200Cr India bioplastics market' },
  { id: 'HFL-0009', batchNo: 'HFL-B2409', city: 'Bhubaneswar', fiberType: 'Geotextile Woven', application: 'Road Reinforcement (NHAI)', tensileStrengthMPa: 350, yieldTonnes: 150, investmentCr: 68, status: 'Delivered', priority: 'High', origin: 'OHDB Bhubaneswar (OD)', destination: 'NHAI Bhubaneswar (OD)', shipDate: '2026-07-16', transitDays: 0, zone: 'East', processor: 'Odisha Hemp Dev Board', remarks: 'Odisha Hemp Dev Board geotextile for NHAI highway reinforcement &#8594; 350 MPa woven hemp geotextile for base reinforcement &#8594; &#8377;68Cr for 150 tonnes &#8594; extends road life 3x in black cotton soil zones &#8594; OHDB &#8377;280Cr Odisha programme &#8594; 4,000 hectares in tribal districts &#8594; NHAI deploying hemp geotextile on 500km of new Bharatmala corridors &#8594; 60% cheaper than synthetic polypropylene geotextile &#8594; biodegradable after 5 years eliminating plastic waste &#8594; also for slope stabilization and erosion control on hill roads' },
  { id: 'HFL-0010', batchNo: 'HFL-B2410', city: 'Pune', processor: 'Agro-Hemp Solutions', fiberType: 'Paper Pulp Fiber', application: 'Packaging Board (ITC Ltd)', tensileStrengthMPa: 250, yieldTonnes: 180, investmentCr: 56, status: 'In Transit', priority: 'Standard', origin: 'Agro-Hemp Pune (MH)', destination: 'ITC Bhadrachalam (TS)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'Agro-Hemp pulp fiber for ITC packaging board &#8594; 250 MPa for corrugated board application &#8594; &#8377;56Cr for 180 tonnes &#8594; hemp pulp yield 4x vs wood pulp per hectare &#8594; 100% recyclable and biodegradable packaging &#8594; Agro-Hemp &#8377;380Cr Pune agri-tech startup &#8594; 6,000 hectares under contract farming &#8594; ITC Wellbeing range switching to hemp packaging &#8594; chlorine-free bleaching process saves 40% water vs wood pulp &#8594; 90-day crop rotation enables 4 harvests/year &#8594; carbon credit potential 5 tonnes CO2/acre' },
  { id: 'HFL-0011', batchNo: 'HFL-B2411', city: 'Kolkata', processor: 'Bengal Hemp Corp', fiberType: 'Carbonized Hemp Fiber', application: 'Battery Anode (Exide Industries)', tensileStrengthMPa: 380, yieldTonnes: 25, investmentCr: 142, status: 'Delivered', priority: 'Critical', origin: 'BHC Kolkata (WB)', destination: 'Exide Kolkata (WB)', shipDate: '2026-07-12', transitDays: 0, zone: 'East', remarks: 'Bengal Hemp carbonized fiber for Exide lithium-ion battery anode &#8594; 380 MPa hemp-derived hard carbon with 350 mAh/g capacity &#8594; &#8377;142Cr for 25 tonnes carbonized fiber &#8594; replaces graphite anode at 60% lower cost &#8594; BHC &#8377;520Cr Kolkata facility &#8594; IIT Kharagpur licensed hemp carbonization technology &#8594; Exide targeting 5 GWh hemp anode cell production by 2028 &#8594; hard carbon superior for sodium-ion batteries (sodium intercalation) &#8594; &#8377;8,000Cr India anode material market &#8594; hemp carbon 100% India-origin critical battery material' },
  { id: 'HFL-0012', batchNo: 'HFL-B2412', city: 'Jaipur', processor: 'Rajasthan Bio-Hemp', fiberType: 'Hempcrete Aggregate', application: 'Green Building Block (L&amp;T Realty)', tensileStrengthMPa: 150, yieldTonnes: 250, investmentCr: 78, status: 'Processing', priority: 'High', origin: 'RBH Jaipur (RJ)', destination: 'L&amp;T Realty Mumbai (MH)', shipDate: '2026-07-27', transitDays: 2, zone: 'North', remarks: 'Rajasthan Bio-Hemp hempcrete aggregate for L&amp;T green building blocks &#8594; 150 MPa hemp-shiv-lime composite &#8594; &#8377;78Cr for 250 tonnes hempcrete aggregate &#8594; thermal conductivity 0.06 W/mK vs 1.7 W/mK concrete &#8594; RBH &#8377;340Cr Jaipur hempcrete plant &#8594; L&amp;T Realty IGBC Platinum-rated project using hempcrete &#8594; load-bearing walls with hempcrete infill &#8594; moisture regulating (humidity buffering) indoor comfort &#8594; GRIHA-5 compliant carbon-negative wall system &#8594; fire resistance 90 minutes &#8594; 110kg CO2 absorbed per m3 wall' },
  { id: 'HFL-0013', batchNo: 'HFL-B2413', city: 'Gandhinagar', processor: 'Gujarat Hemp Park', fiberType: 'Oilseed Press Cake', application: 'Biofuel Feedstock (IndianOil)', tensileStrengthMPa: 0, yieldTonnes: 160, investmentCr: 42, status: 'In Transit', priority: 'Standard', origin: 'GHP Gandhinagar (GJ)', destination: 'IOCL Gujarat Refinery (GJ)', shipDate: '2026-07-21', transitDays: 0, zone: 'West', remarks: 'Gujarat Hemp Park seed press cake for IndianOil biodiesel feedstock &#8594; 38% oil content hemp seed after pressing &#8594; &#8377;42Cr for 160 tonnes press cake &#8594; biodiesel yield 95L per tonne press cake &#8594; GHP &#8377;480Cr Gujarat hemp park with integrated processing &#8594; 6,000 hectares under contract farming &#8594; IOCL blending hemp biodiesel at 5% with diesel B5 &#8594; ASTM D6751 certified hemp methyl ester &#8594; cold filter plugging point -5&#176;C suitable for Indian climate &#8594; biodiesel CO2 reduction 78% vs diesel &#8594; hemp seed oil also for nutraceutical omega-3' },
  { id: 'HFL-0014', batchNo: 'HFL-B2414', city: 'Srinagar', processor: 'Kashmir Hemp Authority', fiberType: 'Premium Textile Fiber', application: 'Pashmina-Hemp Blend (J&amp;K Handicrafts)', tensileStrengthMPa: 510, yieldTonnes: 18, investmentCr: 65, status: 'Delayed', priority: 'Critical', origin: 'KHA Srinagar (JK)', destination: 'JK Handicrafts Srinagar (JK)', shipDate: '2026-07-07', transitDays: 9, zone: 'North', remarks: 'Kashmir Hemp Authority premium fiber for Pashmina-hemp blend shawls &#8594; 510 MPa textile-grade long fiber from Himalayan cultivar &#8594; &#8377;65Cr for 18 tonnes premium fiber &#8594; 9-day delay: early snowfall disrupted retting ponds &#8594; Pashmina-hemp 70:30 blend stronger and more durable &#8594; KHA &#8377;250Cr Kashmir programme &#8594; GI tag application for Kashmir Hemp Textile &#8594; traditional valley retting using glacial spring water &#8594; J&amp;K Handicrafts exporting to Europe duty-free under RODTEP &#8594; &#8377;450/shawl premium pricing in luxury market &#8594; 2,000 artisans trained in hemp spinning' }
]

const hflKpis = [
  { label: 'In Transit / Shipped', value: hempFiberRecords.filter(r => r.status === 'In Transit' || r.status === 'Shipped').length, suffix: ' batches', color: 'text-lime-700 bg-lime-50' },
  { label: 'Processing / Retting', value: hempFiberRecords.filter(r => r.status === 'Processing' || r.status === 'Retting').length, suffix: ' batches', color: 'text-amber-700 bg-amber-50' },
  { label: 'Delivered / Dispatched', value: hempFiberRecords.filter(r => r.status === 'Delivered' || r.status === 'Dispatched').length, suffix: ' batches', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Total Investment', value: hempFiberRecords.reduce((s: number, r) => s + r.investmentCr, 0), suffix: ' Cr', color: 'text-teal-700 bg-teal-50' }
]

export default function HempFiberLogisticsView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    hempFiberRecords.forEach(r => { map[r.status] = (map[r.status] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const processorCounts = useMemo(() => {
    const map: Record<string, number> = {}
    hempFiberRecords.forEach(r => { map[r.processor] = (map[r.processor] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const appCounts = useMemo(() => {
    const map: Record<string, number> = {}
    hempFiberRecords.forEach(r => { map[r.application] = (map[r.application] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneCounts = useMemo(() => {
    const map: Record<string, number> = {}
    hempFiberRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    return hempFiberRecords.filter(r => {
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
    <div className="hfl-logistics-container p-4 space-y-4">
      <PageHeader title="Hemp Fiber Logistics" description="Industrial Hemp Supply Chain Tracking &#8212; bast fiber, hurd, CBD flower, seed, nano-cellulose, carbonized fiber, hempcrete and geotextile for Indian manufacturing and agriculture" />

      <div className="hfl-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {hflKpis.map((kpi, i) => (
          <Card key={i} className="hfl-kpi-card border-l-4 border-l-lime-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-2xl font-bold ${kpi.color.split(' ')[0]}`}>{kpi.value.toLocaleString()}<span className="text-sm font-normal">{kpi.suffix}</span></p></CardContent></Card>
        ))}
      </div>

      <div className="hfl-tab-bar flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`hfl-tab-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === i ? 'bg-lime-600 text-white shadow-md' : 'bg-white text-muted-foreground hover:bg-lime-50 border'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="hfl-dashboard space-y-4">
          <div className="hfl-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="hfl-chart-card"><CardHeader><CardTitle className="text-sm">Batch Status Distribution</CardTitle></CardHeader><CardContent>
              <div className="hfl-bar-chart space-y-2">
                {statusCounts.map(([s, c]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-lime-100 rounded-full h-4 overflow-hidden"><div className="hfl-bar-fill h-full bg-lime-500 rounded-full" style={{ width: `${(c / hempFiberRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="hfl-chart-card"><CardHeader><CardTitle className="text-sm">Processor Volume</CardTitle></CardHeader><CardContent>
              <div className="hfl-bar-chart space-y-2">
                {processorCounts.slice(0, 8).map(([p, c]) => (
                  <div key={p} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{p}</span><div className="flex-1 bg-lime-100 rounded-full h-4 overflow-hidden"><div className="hfl-bar-fill h-full bg-lime-400 rounded-full" style={{ width: `${(c / hempFiberRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="hfl-registry space-y-3">
          <div className="hfl-filter-bar flex flex-wrap gap-2 items-center">
            <Input placeholder="Search batches..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-xs h-8 text-sm" />
            {['status', 'zone', 'priority'].map(key => (
              <div key={key} className="hfl-filter-group flex flex-wrap gap-1">
                {Array.from(new Set(hempFiberRecords.map(r => r[key as keyof HempFiberRecord] as string))).filter(Boolean).slice(0, 4).map(val => (
                  <button key={val} onClick={() => toggleFilter(key, val)} className={`hfl-filter-btn px-2 py-1 text-xs rounded-md border transition-all ${activeFilters[key]?.includes(val) ? 'bg-lime-600 text-white border-lime-600' : 'bg-white text-muted-foreground hover:bg-lime-50'}`}>
                    {val}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Card><CardContent className="p-0">
            <div className="hfl-table-wrap overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b bg-lime-50/50">
                  <th className="p-2 text-left font-medium">Batch ID</th><th className="p-2 text-left font-medium">Processor</th><th className="p-2 text-left font-medium">Fiber Type</th><th className="p-2 text-left font-medium">Application</th><th className="p-2 text-left font-medium">Strength</th><th className="p-2 text-left font-medium">Yield(T)</th><th className="p-2 text-left font-medium">Investment</th><th className="p-2 text-left font-medium">Status</th><th className="p-2 text-left font-medium">Origin</th><th className="p-2 text-left font-medium">Dest</th>
                </tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`hfl-table-row border-b hover:bg-lime-50/30 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-2"><Badge variant="outline" className="text-lime-700 border-lime-300 font-mono">{r.id}</Badge></td>
                      <td className="p-2">{r.processor}</td><td className="p-2">{r.fiberType}</td><td className="p-2">{r.application}</td>
                      <td className="p-2">{r.tensileStrengthMPa || 'N/A'}</td><td className="p-2">{r.yieldTonnes}T</td><td className="p-2">{r.investmentCr}Cr</td>
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
        <div className="hfl-analytics space-y-4">
          <div className="hfl-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="hfl-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent>
              <div className="hfl-bar-chart space-y-2">
                {(Object.entries(zoneCounts.reduce((acc: Record<string, number>, [z]) => {
                  const total = hempFiberRecords.filter(r => r.zone === z).reduce((s: number, rr) => s + rr.investmentCr, 0)
                  acc[z] = total
                  return acc
                }, {})) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, v]) => (
                  <div key={z} className="flex items-center gap-2"><span className="text-xs w-16 text-right">{z}</span><div className="flex-1 bg-lime-100 rounded-full h-4 overflow-hidden"><div className="hfl-bar-fill h-full bg-lime-500 rounded-full" style={{ width: `${(v / 200) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{v}Cr</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="hfl-chart-card"><CardHeader><CardTitle className="text-sm">Application Distribution</CardTitle></CardHeader><CardContent>
              <div className="hfl-bar-chart space-y-2">
                {appCounts.slice(0, 8).map(([a, c]) => (
                  <div key={a} className="flex items-center gap-2"><span className="text-xs w-36 text-right truncate">{a}</span><div className="flex-1 bg-lime-100 rounded-full h-4 overflow-hidden"><div className="hfl-bar-fill h-full bg-lime-400 rounded-full" style={{ width: `${(c / hempFiberRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="hfl-chart-card"><CardHeader><CardTitle className="text-sm">Yield by Processor (Tonnes)</CardTitle></CardHeader><CardContent>
              <div className="hfl-bar-chart space-y-2">
                {hempFiberRecords.sort((a, b) => b.yieldTonnes - a.yieldTonnes).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{r.processor.split(' ')[0]}</span><div className="flex-1 bg-lime-100 rounded-full h-4 overflow-hidden"><div className="hfl-bar-fill h-full bg-lime-300 rounded-full" style={{ width: `${(r.yieldTonnes / 320) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{r.yieldTonnes}T</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="hfl-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Status</CardTitle></CardHeader><CardContent>
              <div className="hfl-bar-chart space-y-2">
                {(Object.entries(hempFiberRecords.reduce((acc: Record<string, { sum: number; count: number }>, r) => {
                  if (!acc[r.status]) acc[r.status] = { sum: 0, count: 0 }
                  acc[r.status].sum += r.transitDays
                  acc[r.status].count += 1
                  return acc
                }, {})) as [string, { sum: number; count: number }][]).map(([s, v]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-lime-100 rounded-full h-4 overflow-hidden"><div className="hfl-bar-fill h-full bg-lime-500 rounded-full" style={{ width: `${(v.sum / v.count / 10) * 100}%` }} /></div><span className="text-xs font-medium w-12 text-right">{(v.sum / v.count).toFixed(1)}d</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="hfl-insights space-y-3">
          <Card className="hfl-insight-card border-l-4 border-l-lime-600"><CardHeader><CardTitle className="text-sm text-lime-800">India Industrial Hemp: &#8377;35,000Cr Opportunity by 2030</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s industrial hemp market is projected at &#8377;35,000Cr by 2030 across 15 states &#8594; 14 processors covering 70,000+ hectares with 35,000+ farmers &#8594; Uttarakhand first to legalize in 2021 followed by UP MP Rajasthan Odisha Himachal Assam Gujarat J&amp;K Maharashtra Karnataka Bengal &#8594; THC limit set at 0.3% aligned with EU and US standards &#8594; 12 fiber types: bast fiber for textiles and composites, hurd for hempcrete and bedding, CBD flower for pharma, seed for food and biofuel, nano-cellulose for bioplastic, carbonized for battery anodes &#8594; &#8377;5,200Cr total investment across state programmes &#8594; 80,000+ tonnes annual production capacity &#8594; generating &#8377;3,500Cr farmer income annually.</p></CardContent></Card>
          <Card className="hfl-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: HFL-0006 and HFL-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">HFL-0006 (Manipur Hemp Collective Imphal to Cochin Shipyard, 7-day delay): monsoon flooding destroyed 3 of 8 retting tanks at Imphal facility &#8594; 65 tonnes cordage fiber for Navy INS Vishal mooring rope &#8594; MHC deploying temporary above-ground retting using tarpaulin &#8594; shipyard qualifying nylon substitute in parallel &#8594; &#8377;38Cr shipment at risk &#8594; Manipur state govt deploying NDRF for infrastructure repair. HFL-0014 (Kashmir Hemp Authority Srinagar, 9-day delay): early September snowfall at 2,200m altitude froze retting ponds &#8594; 18 tonnes premium Pashmina-hemp blend fiber &#8594; KHA constructing indoor temperature-controlled retting facility &#8594; J&amp;K Handicrafts GI tag application delayed &#8594; &#8377;65Cr at risk &#8594; Kashmir harvest window narrowing due to climate change.</p></CardContent></Card>
          <Card className="hfl-insight-card border-l-4 border-l-lime-500"><CardHeader><CardTitle className="text-sm text-lime-700">Carbonized Hemp for EV Battery Anodes: Game Changer</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Bengal Hemp Corp Kolkata (HFL-0011) is pioneering carbonized hemp fiber for lithium-ion and sodium-ion battery anodes &#8594; 350 mAh/g capacity approaching graphite&apos;s 372 mAh/g at 60% lower cost &#8594; hemp-derived hard carbon superior for sodium-ion batteries (no intercalation limit) &#8594; IIT Kharagpur licensed patented pyrolysis at 1,200&#176;C in inert atmosphere &#8594; Exide targeting 5 GWh hemp anode production by 2028 &#8594; &#8377;8,000Cr India anode market with graphite 100% imported from China &#8594; hemp anode enables 100% indigenous critical battery material &#8594; also suitable for solid-state batteries &#8594; carbon credit: hemp absorbs 10 tonnes CO2/hectare &#8594; carbon-negative battery value chain.</p></CardContent></Card>
          <Card className="hfl-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">Agricultural Impact: Hemp Replaces Water-Intensive Cotton</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Industrial hemp is transforming Indian agriculture in water-stressed regions &#8594; hemp requires 50% less water than cotton and 40% less than rice &#8594; 90-day crop cycle enables 3-4 harvests per year vs 1 cotton harvest &#8594; Rajasthan Thar Desert producing 300 tonnes/year where cotton fails &#8594; Assam tribal farmers earning 3x per hectare with hemp vs jute &#8594; Manipur cooperative with 800 Naga/Kuki farmers &#8594; hemp improves soil health (deep taproot breaks compaction) &#8594; no pesticide or herbicide required (natural weed suppression) &#8594; crop rotation with wheat and pulses increases total farm income 45% &#8594; &#8377;3,500Cr farmer income projected by 2030 across 70,000 hectares &#8594; NITI Aayog recommending hemp as climate-resilient crop for Make in India.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
