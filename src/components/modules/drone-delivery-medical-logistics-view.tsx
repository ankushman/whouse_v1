'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { PlaneTakeoff } from 'lucide-react'

interface DroneMedicalRecord {
  id: string
  flightNo: string
  city: string
  operator: string
  droneType: string
  payload: string
  rangeKm: number
  flightMin: number
  investmentCr: number
  status: string
  priority: string
  origin: string
  destination: string
  departDate: string
  transitDays: number
  zone: string
  remarks: string
}

const droneMedicalRecords: DroneMedicalRecord[] = [
  { id: 'DDM-0001', flightNo: 'DDM-F2401', city: 'Bengaluru', operator: 'TechEagle Innovations', droneType: 'VXi-CR20 VTOL', payload: 'Blood Units (O+)', rangeKm: 15, flightMin: 12, investmentCr: 45, status: 'Delivered', priority: 'Critical', origin: 'Victoria Hospital Blood Bank (KA)', destination: 'Chikkaballapur PHC (KA)', departDate: '2026-07-22', transitDays: 0, zone: 'South', remarks: 'TechEagle VTOL delivering 4 units O+ blood to Chikkaballapur PHC &#8594; 12-min flight vs 90-min road through traffic &#8594; &#8377;45Cr Karnataka drone medicine corridor &#8594; DGCA BVLOS permit for 15km medical corridor &#8594; 200 flights/month across 12 PHCs &#8594; TechEagle partnered with NIMHANS for organ transport trials &#8594; 98.5% on-time delivery rate since Jan 2026' },
  { id: 'DDM-0002', flightNo: 'DDM-F2402', city: 'Hyderabad', operator: 'Marut Dronetech', droneType: 'MediLift X10', payload: 'Insulin Vials (100IU)', rangeKm: 25, flightMin: 18, investmentCr: 62, status: 'In Transit', priority: 'High', origin: 'Gandhi Hospital Hyderabad (TS)', destination: 'Suryapet Area Hospital (TS)', departDate: '2026-07-24', transitDays: 0, zone: 'South', remarks: 'Marut MediLift delivering 500 insulin vials to Suryapet &#8594; cold-chain payload bay at 2-8&#176;C maintained &#8594; &#8377;62Cr Telangana drone health corridor &#8594; 100km/h cruise speed with GPS waypoint &#8594; TS govt covering 18 rural hospitals from 3 hub hospitals &#8594; Marut first Indian company with DGCA Type Certificate for medical drone &#8594; payload capacity 5kg with active temperature monitoring' },
  { id: 'DDM-0003', flightNo: 'DDM-F2403', city: 'New Delhi', operator: 'DJI Enterprise India', droneType: 'FlyCart 30T Modified', payload: 'COVID-19 RT-PCR Kits', rangeKm: 40, flightMin: 22, investmentCr: 88, status: 'Delivered', priority: 'Critical', origin: 'LNJP Testing Centre Delhi (DL)', destination: 'Nuh PHC Haryana (HR)', departDate: '2026-07-18', transitDays: 0, zone: 'North', remarks: 'DJI FlyCart modified for 40km BVLOS medical kit delivery &#8594; 500 RT-PCR kits per flight &#8594; &#8377;88Cr NCDC drone diagnostics programme &#8594; serves 8 districts across Delhi-NCR &#8594; real-time flight tracking on DGCA GAGAN &#8594; average 22-min delivery vs 4-hour road &#8594; AI-based route optimization avoids restricted airspace &#8594; DJI India collaborating with ICMR for nationwide rollout' },
  { id: 'DDM-0004', flightNo: 'DDM-F2404', city: 'Guwahati', operator: 'IoTech Aviation', droneType: 'Garuda V2 Hexacopter', payload: 'Anti-Snake Venom (ASV)', rangeKm: 30, flightMin: 25, investmentCr: 35, status: 'Delivered', priority: 'Critical', origin: 'GMCH Guwahati (AS)', destination: 'Tezpur CHC (AS)', departDate: '2026-07-16', transitDays: 0, zone: 'East', remarks: 'IoTech Garuda V2 hexacopter carrying 50 vials ASV to Tezpur &#8594; critical for snakebite emergency within golden hour &#8594; &#8377;35Cr Assam tribal health drone network &#8594; covers 25 CHCs across Brahmaputra valley &#8594; Assam records 50,000 snakebite cases/year &#8594; venom delivery reduced mortality from 15% to 3% in covered areas &#8594; IoTech Assam&apos;s only DGCA-certified drone manufacturer &#8594; IP67 rated for monsoon operations' },
  { id: 'DDM-0005', flightNo: 'DDM-F2405', city: 'Mumbai', operator: 'Redwing Labs', droneType: 'Zipline-Style Fixed Wing', payload: 'Lab Specimens (Blood/Urine)', rangeKm: 80, flightMin: 35, investmentCr: 125, status: 'In Transit', priority: 'Standard', origin: 'KEM Hospital Mumbai (MH)', destination: 'Alibag Rural Hospital (MH)', departDate: '2026-07-23', transitDays: 0, zone: 'West', remarks: 'Redwing Zipline-style fixed-wing delivering 50 lab specimens &#8594; 80km range crossing Arabian Sea coastline &#8594; &#8377;125Cr Maharashtra health diagnostics corridor &#8594;标本 arrive at Alibag in 35min vs 5-hour ferry &#8594; Redwing India&apos;s first autonomous drone delivery operator &#8594; &lt;1kg specimens with barcoded tracking &#8594; pathology results returned digitally same day &#8594; 350 flights/month connecting 6 island PHCs' },
  { id: 'DDM-0006', flightNo: 'DDM-F2406', city: 'Bhopal', operator: 'Aarav Unmanned Systems', droneType: 'SkyDeck Hexacopter', payload: 'Vaccines (BCG/DPT)', rangeKm: 20, flightMin: 15, investmentCr: 52, status: 'Processing', priority: 'High', origin: 'Hamidia Hospital Bhopal (MP)', destination: 'Hoshangabad CHC (MP)', departDate: '2026-07-25', transitDays: 0, zone: 'Central', remarks: 'AUS SkyDeck hexacopter for routine immunization vaccine delivery &#8594; maintaining cold chain 2-8&#176;C for BCG and DPT &#8594; &#8377;52Cr MP immunization drone programme &#8594; covers 32 CHCs within 20km of 4 district hospitals &#8594; WHO-recommended vaccine vial monitoring with IoT sensor &#8594; AUS Bhopal-based startup with &#8377;180Cr funding from USAID and BMGF &#8594; targeting 10,000 vaccine flights/year by 2027' },
  { id: 'DDM-0007', flightNo: 'DDM-F2407', city: 'Jaipur', operator: 'Quidich Innovation', droneType: 'MediSwift Quadcopter', payload: 'Eyebank Cornea Tissue', rangeKm: 35, flightMin: 20, investmentCr: 28, status: 'Delivered', priority: 'Critical', origin: 'Sankara Nethralaya Jaipur (RJ)', destination: 'Jodhpur Eye Hospital (RJ)', departDate: '2026-07-14', transitDays: 0, zone: 'North', remarks: 'Quidich MediSwift delivering corneal tissue for transplant &#8594; time-critical: viability drops after 72 hours &#8594; 20-min flight vs 5-hour road &#8594; &#8377;28Cr Rajasthan eye donation drone corridor &#8594; 15 corneal transplants completed via drone &#8594; Quidich specializing in medical organ logistics &#8594; partnered with Eye Bank Association of India &#8594; zero graft failure in 15 drone deliveries &#8594; expanding to cardiac valve transport' },
  { id: 'DDM-0008', flightNo: 'DDM-F2408', city: 'Chennai', operator: 'Skyroot Aerospace Med', droneType: 'Pratham VTOL Hybrid', payload: 'Anti-Rabies Vaccine', rangeKm: 45, flightMin: 28, investmentCr: 72, status: 'In Transit', priority: 'High', origin: 'Rajiv Gandhi Hospital Chennai (TN)', destination: 'Kanchipuram PHC (TN)', departDate: '2026-07-22', transitDays: 0, zone: 'South', remarks: 'Skyroot Pratham VTOL hybrid for anti-rabies vaccine delivery &#8594; Tamil Nadu reports 80,000 dog bite cases annually &#8594; &#8377;72Cr TN anti-rabies drone programme &#8594; cold chain at 2-8&#176;C for IDRV vaccine &#8594; Skyroot leveraging aerospace tech for medical drones &#8594; VTOL enables hospital rooftop pickup/dropoff &#8594; 300 flights/month across 24 PHCs from 5 hub hospitals &#8594; AI-based demand forecasting triggers automatic restock flights' },
  { id: 'DDM-0009', flightNo: 'DDM-F2409', city: 'Kolkata', operator: 'Ehang India', droneType: 'EHang 216L Medical', payload: 'Defibrillator Unit', rangeKm: 18, flightMin: 10, investmentCr: 95, status: 'Delivered', priority: 'Standard', origin: 'AMRI Hospital Kolkata (WB)', destination: 'Howrah Station Emergency (WB)', departDate: '2026-07-20', transitDays: 0, zone: 'East', remarks: 'EHang 216L autonomous passenger drone modified for AED delivery &#8594; 10-min delivery to Howrah station for cardiac emergency &#8594; &#8377;95Cr Kolkata cardiac emergency drone network &#8594; 6 AED-equipped drones on 24/7 standby &#8594; auto-dispatch on 112 emergency call &#8594; EHang India DGCA provisional type cert for medical cargo &#8594; integrated with Kolkata Police emergency response &#8594; average response time 8.5 min vs 22 min ambulance' },
  { id: 'DDM-0010', flightNo: 'DDM-F2410', city: 'Pune', operator: ' ideaForge Technology', droneType: 'Netra V4 Quadcopter', payload: 'Tuberculosis Sputum Samples', rangeKm: 22, flightMin: 14, investmentCr: 38, status: 'Processing', priority: 'Standard', origin: 'BJMC Pune (MH)', destination: 'Baramati RHC (MH)', departDate: '2026-07-26', transitDays: 0, zone: 'West', remarks: 'ideaForge Netra V4 for TB sputum sample collection &#8594; Maharashtra 2.1 lakh TB cases/year highest in India &#8594; &#8377;38Cr Maharashtra TB diagnostics drone &#8594; samples returned to BJMC lab within 4 hours &#8594; CBNAAT test results via SMS within 24 hours &#8594; ideaForge DRDO-certified drone with 5kg payload &#8594; 150 flights/month from 8 collection centres &#8594; drone-reach areas have 35% higher TB case detection rate' },
  { id: 'DDM-0011', flightNo: 'DDM-F2411', city: 'Srinagar', operator: 'Himalayan Drone Ops', droneType: 'SnowEagle HeLi-6', payload: 'Emergency Medicines', rangeKm: 50, flightMin: 40, investmentCr: 82, status: 'Delayed', priority: 'Critical', origin: 'SKIMS Srinagar (JK)', destination: 'Gurez Valley PHC (JK)', departDate: '2026-07-09', transitDays: 2, zone: 'North', remarks: 'Himalayan SnowEagle delivering emergency meds to Gurez Valley &#8594; 2-day delay: heavy snowfall at 3,000m altitude restricted BVLOS &#8594; &#8377;82Cr J&amp;K mountain healthcare drone corridor &#8594; covers 15 cut-off valleys across Pir Panjal range &#8594; SKIMS Srinagar as sole hub for 250km radius &#8594; Gurez Valley road blocked 4 months/year &#8594; drone only lifeline for 45,000 residents in winter &#8594; drone hardened for -20&#176;C operation and 50km/h crosswinds' },
  { id: 'DDM-0012', flightNo: 'DDM-F2412', city: 'Lucknow', operator: 'Drona Aviation', droneType: 'Bomba 15 VTOL', payload: 'Hepatitis-B Vaccine', rangeKm: 28, flightMin: 16, investmentCr: 48, status: 'Delivered', priority: 'Standard', origin: 'SGPGI Lucknow (UP)', destination: 'Sitapur District Hospital (UP)', departDate: '2026-07-17', transitDays: 0, zone: 'North', remarks: 'Drona Aviation Bomba 15 VTOL for Hepatitis-B vaccine delivery &#8594; UP targets 100% birth dose coverage &#8594; &#8377;48Cr UP immunization drone programme &#8594; covers 48 district hospitals within 28km of 6 medical colleges &#8594; Drona Aviation IIT Bombay spinoff &#8594; &lt;5dB noise signature for hospital operations &#8594; bio-degradable payload container &#8594; 500 flights/month with AI demand forecasting &#8594; 92% cold chain compliance rate' },
  { id: 'DDM-0013', flightNo: 'DDM-F2413', city: 'Bhubaneswar', operator: 'TCS IoT Healthcare', droneType: 'MediDrop Fixed Wing', payload: 'Malaria Test Kits (RDT)', rangeKm: 60, flightMin: 30, investmentCr: 56, status: 'In Transit', priority: 'High', origin: 'SCB Medical Bhubaneswar (OD)', destination: 'Malkangiri PHC (OD)', departDate: '2026-07-21', transitDays: 0, zone: 'East', remarks: 'TCS MediDrop fixed-wing for malaria RDT kit delivery &#8594; Odisha reports 4.5 lakh malaria cases in tribal districts &#8594; &#8377;56Cr Odisha tribal health drone &#8594; 60km range to Malkangiri across forest terrain &#8594; road journey 6 hours vs drone 30 minutes &#8594; TCS IoT platform with real-time flight and payload tracking &#8594; 200 flights/month across 18 tribal PHCs &#8594; drone-deployed RDTs increased testing 3x in covered areas &#8594; integrated with Odisha HMIS for case reporting' },
  { id: 'DDM-0014', flightNo: 'DDM-F2414', city: 'Thiruvananthapuram', operator: 'FAB Aerospace Med', droneType: 'FAB-Med HeliQuad', payload: 'Organ Transport (Kidney)', rangeKm: 35, flightMin: 22, investmentCr: 165, status: 'Delayed', priority: 'Critical', origin: 'KIMS Trivandrum (KL)', destination: 'Kochi Aster Medcity (KL)', departDate: '2026-07-07', transitDays: 3, zone: 'South', remarks: 'FAB-Med HeliQuad for kidney organ transport &#8594; 3-day delay: DGCA emergency flight permit pending for organ category &#8594; &#8377;165Cr Kerala organ transport drone corridor &#8594; kidney viability window 36 hours &#8594; FAB Aerospace Kerala&apos;s first drone manufacturer &#8594; specialized medical organ container at 4&#176;C &#8594; NOTTO coordination for organ matching &#8594; Kerala 2nd highest organ donation rate in India &#8594; drone reduces cold ischemia time from 8h to 2h &#8594; &#8377;220Cr total investment planned across 5 hospitals' }
]

const ddmKpis = [
  { label: 'In Transit / Airborne', value: droneMedicalRecords.filter(r => r.status === 'In Transit' || r.status === 'Airborne').length, suffix: ' flights', color: 'text-sky-700 bg-sky-50' },
  { label: 'Processing / Ready', value: droneMedicalRecords.filter(r => r.status === 'Processing' || r.status === 'Ready').length, suffix: ' flights', color: 'text-amber-700 bg-amber-50' },
  { label: 'Delivered / Completed', value: droneMedicalRecords.filter(r => r.status === 'Delivered' || r.status === 'Completed').length, suffix: ' flights', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Total Investment', value: droneMedicalRecords.reduce((s: number, r) => s + r.investmentCr, 0), suffix: ' Cr', color: 'text-violet-700 bg-violet-50' }
]

export default function DroneDeliveryMedicalLogisticsView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const tabs = ['Dashboard', 'Flight Registry', 'Analytics', 'Insights']

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    droneMedicalRecords.forEach(r => { map[r.status] = (map[r.status] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const operatorCounts = useMemo(() => {
    const map: Record<string, number> = {}
    droneMedicalRecords.forEach(r => { map[r.operator] = (map[r.operator] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const payloadCounts = useMemo(() => {
    const map: Record<string, number> = {}
    droneMedicalRecords.forEach(r => { map[r.payload] = (map[r.payload] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneCounts = useMemo(() => {
    const map: Record<string, number> = {}
    droneMedicalRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    return droneMedicalRecords.filter(r => {
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
    <div className="ddm-logistics-container p-4 space-y-4">
      <PageHeader title="Drone Delivery Medical Logistics" description="Medical Drone Supply Chain Flight Tracking &#8212; VTOL quadcopters, fixed-wing autonomous drones for blood, vaccine, organ, diagnostic and emergency medicine delivery across India" />

      <div className="ddm-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ddmKpis.map((kpi, i) => (
          <Card key={i} className="ddm-kpi-card border-l-4 border-l-sky-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-2xl font-bold ${kpi.color.split(' ')[0]}`}>{kpi.value.toLocaleString()}<span className="text-sm font-normal">{kpi.suffix}</span></p></CardContent></Card>
        ))}
      </div>

      <div className="ddm-tab-bar flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`ddm-tab-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === i ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-muted-foreground hover:bg-sky-50 border'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="ddm-dashboard space-y-4">
          <div className="ddm-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="ddm-chart-card"><CardHeader><CardTitle className="text-sm">Flight Status Distribution</CardTitle></CardHeader><CardContent>
              <div className="ddm-bar-chart space-y-2">
                {statusCounts.map(([s, c]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-sky-100 rounded-full h-4 overflow-hidden"><div className="ddm-bar-fill h-full bg-sky-500 rounded-full" style={{ width: `${(c / droneMedicalRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="ddm-chart-card"><CardHeader><CardTitle className="text-sm">Operator Flight Volume</CardTitle></CardHeader><CardContent>
              <div className="ddm-bar-chart space-y-2">
                {operatorCounts.slice(0, 8).map(([o, c]) => (
                  <div key={o} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{o}</span><div className="flex-1 bg-sky-100 rounded-full h-4 overflow-hidden"><div className="ddm-bar-fill h-full bg-sky-400 rounded-full" style={{ width: `${(c / droneMedicalRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="ddm-registry space-y-3">
          <div className="ddm-filter-bar flex flex-wrap gap-2 items-center">
            <Input placeholder="Search flights..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-xs h-8 text-sm" />
            {['status', 'zone', 'priority'].map(key => (
              <div key={key} className="ddm-filter-group flex flex-wrap gap-1">
                {Array.from(new Set(droneMedicalRecords.map(r => r[key as keyof DroneMedicalRecord] as string))).filter(Boolean).slice(0, 4).map(val => (
                  <button key={val} onClick={() => toggleFilter(key, val)} className={`ddm-filter-btn px-2 py-1 text-xs rounded-md border transition-all ${activeFilters[key]?.includes(val) ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-muted-foreground hover:bg-sky-50'}`}>
                    {val}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Card><CardContent className="p-0">
            <div className="ddm-table-wrap overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b bg-sky-50/50">
                  <th className="p-2 text-left font-medium">Flight ID</th><th className="p-2 text-left font-medium">Operator</th><th className="p-2 text-left font-medium">Drone</th><th className="p-2 text-left font-medium">Payload</th><th className="p-2 text-left font-medium">Range</th><th className="p-2 text-left font-medium">Flight</th><th className="p-2 text-left font-medium">Investment</th><th className="p-2 text-left font-medium">Status</th><th className="p-2 text-left font-medium">Origin</th><th className="p-2 text-left font-medium">Dest</th>
                </tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`ddm-table-row border-b hover:bg-sky-50/30 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-2"><Badge variant="outline" className="text-sky-700 border-sky-300 font-mono">{r.id}</Badge></td>
                      <td className="p-2">{r.operator}</td><td className="p-2">{r.droneType}</td><td className="p-2">{r.payload}</td>
                      <td className="p-2">{r.rangeKm}km</td><td className="p-2">{r.flightMin}min</td><td className="p-2">{r.investmentCr}Cr</td>
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
        <div className="ddm-analytics space-y-4">
          <div className="ddm-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="ddm-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent>
              <div className="ddm-bar-chart space-y-2">
                {(Object.entries(zoneCounts.reduce((acc: Record<string, number>, [z]) => {
                  const total = droneMedicalRecords.filter(r => r.zone === z).reduce((s: number, rr) => s + rr.investmentCr, 0)
                  acc[z] = total
                  return acc
                }, {})) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, v]) => (
                  <div key={z} className="flex items-center gap-2"><span className="text-xs w-16 text-right">{z}</span><div className="flex-1 bg-sky-100 rounded-full h-4 overflow-hidden"><div className="ddm-bar-fill h-full bg-sky-500 rounded-full" style={{ width: `${(v / 250) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{v}Cr</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="ddm-chart-card"><CardHeader><CardTitle className="text-sm">Payload Type Distribution</CardTitle></CardHeader><CardContent>
              <div className="ddm-bar-chart space-y-2">
                {payloadCounts.slice(0, 8).map(([p, c]) => (
                  <div key={p} className="flex items-center gap-2"><span className="text-xs w-36 text-right truncate">{p}</span><div className="flex-1 bg-sky-100 rounded-full h-4 overflow-hidden"><div className="ddm-bar-fill h-full bg-sky-400 rounded-full" style={{ width: `${(c / droneMedicalRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="ddm-chart-card"><CardHeader><CardTitle className="text-sm">Range vs Flight Time</CardTitle></CardHeader><CardContent>
              <div className="ddm-bar-chart space-y-2">
                {droneMedicalRecords.sort((a, b) => b.rangeKm - a.rangeKm).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{r.droneType}</span><div className="flex-1 bg-sky-100 rounded-full h-4 overflow-hidden"><div className="ddm-bar-fill h-full bg-sky-300 rounded-full" style={{ width: `${(r.rangeKm / 80) * 100}%` }} /></div><span className="text-xs font-medium w-16 text-right">{r.rangeKm}km / {r.flightMin}min</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="ddm-chart-card"><CardHeader><CardTitle className="text-sm">Avg Flight Time by Zone</CardTitle></CardHeader><CardContent>
              <div className="ddm-bar-chart space-y-2">
                {(Object.entries(droneMedicalRecords.reduce((acc: Record<string, { sum: number; count: number }>, r) => {
                  if (!acc[r.zone]) acc[r.zone] = { sum: 0, count: 0 }
                  acc[r.zone].sum += r.flightMin
                  acc[r.zone].count += 1
                  return acc
                }, {})) as [string, { sum: number; count: number }][]).map(([z, v]) => (
                  <div key={z} className="flex items-center gap-2"><span className="text-xs w-16 text-right">{z}</span><div className="flex-1 bg-sky-100 rounded-full h-4 overflow-hidden"><div className="ddm-bar-fill h-full bg-sky-500 rounded-full" style={{ width: `${(v.sum / v.count / 45) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{(v.sum / v.count).toFixed(0)}min</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="ddm-insights space-y-3">
          <Card className="ddm-insight-card border-l-4 border-l-sky-600"><CardHeader><CardTitle className="text-sm text-sky-800">India Medical Drone Market: &#8377;1,000Cr Opportunity by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s medical drone delivery market is projected to reach &#8377;1,000Cr by 2028 &#8594; 14 drone operators active across 13 states &#8594; DGCA has issued 28 BVLOS permits for medical logistics &#8594; MoCA Drone Rules 2021 and Production-Linked Incentive scheme driving adoption &#8594; 800+ medical drone flights completed in 2026 so far &#8594; blood products account for 35% of payloads, vaccines 25%, diagnostics 20%, organs 10%, emergency medicines 10% &#8594; average delivery time reduction 85% vs road transport &#8594; 12 drone manufacturers have DGCA Type Certificate for medical variants.</p></CardContent></Card>
          <Card className="ddm-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Flights: DDM-0011 and DDM-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">DDM-0011 (SKIMS Srinagar to Gurez Valley, 2-day delay): SnowEagle HeLi-6 grounded by heavy snowfall at 3,000m altitude &#8594; Pir Panjal range winds exceeding 50km/h &#8594; emergency medicines for 45,000 cut-off valley residents &#8594; Gurez road blocked November to April annually &#8594; Himalayan Drone Ops requesting DGCA waiver for IMC flight in snow &#8594; &#8377;82Cr corridor investment at risk. DDM-0014 (KIMS Trivandrum to Kochi Aster, 3-day delay): DGCA emergency flight permit pending for organ transport category &#8594; kidney viability clock ticking &#8594; FAB Aerospace working with NOTTO on expedited clearance &#8594; &#8377;165Cr organ corridor investment &#8594; Kerala govt intervening with MoCA for policy amendment.</p></CardContent></Card>
          <Card className="ddm-insight-card border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm text-sky-700">Technology Stack: From VTOL Quadcopters to Fixed-Wing Autonomous</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Indian medical drone ecosystem spans 14 distinct platform types &#8594; VTOL quadcopters dominate short-range &#60;25km deliveries (TechEagle VXi, Marut MediLift, ideaForge Netra) &#8594; fixed-wing drones for long-range &#62;40km corridors (Redwing Zipline-style, TCS MediDrop) &#8594; hybrid VTOL like Skyroot Pratham combining hover and cruise efficiency &#8594; specialized cargo: cold-chain insulin at 2-8&#176;C, organ transport at 4&#176;C, AED rapid-response &#8594; AI-based demand forecasting, GAGAN GPS navigation, real-time 4G/5G telemetry &#8594; average payload 2.5kg with &#177;0.5&#176;C thermal stability &#8594; 98.5% operational reliability across 3,000+ flights &#8594; next-gen: hydrogen fuel cell drones for 200km range.</p></CardContent></Card>
          <Card className="ddm-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">Public Health Impact: 85% Faster Critical Supply Delivery</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Medical drone delivery is transforming last-mile healthcare logistics in India &#8594; blood product delivery time reduced from 90 min (road) to 12 min (drone) &#8594; Assam snakebite mortality dropped from 15% to 3% in drone-covered areas &#8594; TB case detection 3x higher in ideaForge drone-reach zones in Maharashtra &#8594; Odisha tribal malaria testing increased 3x via TCS drone-deployed RDT kits &#8594; Rajasthan eye donation corneal transplants: zero graft failure in 15 drone deliveries &#8594; J&amp;K mountain healthcare: only lifeline for 45,000 residents during winter &#8594; Kolkata cardiac emergency response 8.5 min vs 22 min ambulance &#8594; estimated 500+ lives saved through drone medical logistics in 2026.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
