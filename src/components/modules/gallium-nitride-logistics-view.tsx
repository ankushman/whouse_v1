'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'

interface GalliumNitrideRecord {
  id: string
  batchNo: string
  city: string
  foundry: string
  deviceType: string
  application: string
  voltageClassV: number
  frequencyGHz: number
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

const galliumNitrideRecords: GalliumNitrideRecord[] = [
  { id: 'GAN-0001', batchNo: 'GAN-B2401', city: 'Bengaluru', foundry: 'GaN Power India', deviceType: 'GaN HEMT 650V', application: 'EV Onboard Charger (Ather 450X)', voltageClassV: 650, frequencyGHz: 0, investmentCr: 142, status: 'Delivered', priority: 'Standard', origin: 'GaN Power Bengaluru (KA)', destination: 'Ather Energy Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 0, zone: 'South', remarks: 'GaN HEMT 650V for Ather 450X Gen3 onboard charger &#8594; 97.8% PFC efficiency vs 94% Si MOSFET &#8594; &#8377;142Cr for 60,000 modules &#8594; 3.2kW charger in half the volume &#8594; GaN Power India JV between MACOM and Reliance at &#8377;1,200Cr fab &#8594; first indigenous 200mm GaN-on-Si line targeting 100,000 wafers/year' },
  { id: 'GAN-0002', batchNo: 'GAN-B2402', city: 'Gandhinagar', foundry: 'Texas Instruments Gujarat', deviceType: 'GaN HEMT 900V', application: 'Solar String Inverter (Adani Green)', voltageClassV: 900, frequencyGHz: 0, investmentCr: 198, status: 'In Transit', priority: 'Critical', origin: 'TI Fab Gandhinagar (GJ)', destination: 'Adani Solar Mundra (GJ)', shipDate: '2026-07-24', transitDays: 1, zone: 'West', remarks: 'TI Gujarat 900V GaN HEMT for Adani 500kW string inverter &#8594; 99.1% CEC efficiency &#8594; &#8377;198Cr for 15,000 modules &#8594; enables 1500V DC bus architecture &#8594; reduces BOM cost 20% vs Si IGBT triple &#8594; TI India fab at &#8377;14,000Cr investment with 28nm and GaN capability &#8594; targeting 200,000 GaN wafer starts/year by 2028' },
  { id: 'GAN-0003', batchNo: 'GAN-B2403', city: 'Hyderabad', foundry: 'Skyworks GaN Fab', deviceType: 'GaN-on-SiC 28GHz MMIC', application: '5G Base Station Amplifier (Jio)', voltageClassV: 48, frequencyGHz: 28, investmentCr: 225, status: 'Delivered', priority: 'Critical', origin: 'Skyworks Fab Hyderabad (TS)', destination: 'Jio Telecom Mumbai (MH)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'GaN-on-SiC MMIC power amplifier for Jio 5G mmWave n258 band &#8594; 45% PAE at 28GHz vs 28% GaAs &#8594; &#8377;225Cr for 8,000 modules &#8594; covers 40% less tower sites vs sub-6GHz &#8594; Skyworks &#8377;3,200Cr Hyderabad fab with MOCVD GaN-on-SiC epitaxy &#8594; defence grade QML-V qualified for radar EW applications' },
  { id: 'GAN-0004', batchNo: 'GAN-B2404', city: 'Bengaluru', foundry: 'BEL GaN Systems', deviceType: 'GaN HEMT 100V', application: 'Datacenter 48V Power (CtrlS)', voltageClassV: 100, frequencyGHz: 0, investmentCr: 86, status: 'In Transit', priority: 'Standard', origin: 'BEL Bengaluru (KA)', destination: 'CtrlS Datacenter Hyderabad (TS)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: 'BEL 100V GaN HEMT for CtrlS 48V-to-1.2V point-of-load converter &#8594; 96.5% efficiency at 200W output &#8594; &#8377;86Cr for 12,000 POL modules &#8594; eliminates intermediate bus converter stage &#8594; reduces datacenter PUE from 1.4 to 1.25 &#8594; BEL leveraging DRDO GaN-on-Si technology transfer &#8594; &#8377;800Cr GaN foundry at Bengaluru defence corridor' },
  { id: 'GAN-0005', batchNo: 'GAN-B2405', city: 'Pune', foundry: 'Mindspeed Semicon', deviceType: 'GaN HEMT 650V', application: 'Motor Drive VFD (Siemens India)', voltageClassV: 650, frequencyGHz: 0, investmentCr: 134, status: 'Processing', priority: 'High', origin: 'Mindspeed Pune (MH)', destination: 'Siemens Factory Kalwa (MH)', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'Mindspeed 650V GaN HEMT for Siemens SINAMICS VFD &#8594; 15kHz switching at 650V vs 8kHz Si IGBT &#8594; &#8377;134Cr for 20,000 power modules &#8594; 50% size reduction in VFD cabinet &#8594; 3dB acoustic noise reduction in motor &#8594; Mindspeed startup with &#8377;2,400Cr GaN fab approved under PLI &#8594; targeting industrial and EV dual-use GaN platform' },
  { id: 'GAN-0006', batchNo: 'GAN-B2406', city: 'Noida', foundry: 'L&T GaN Defence', deviceType: 'GaN-on-SiC X-band 10GHz', application: 'AESA Radar Module (DRDO)', voltageClassV: 28, frequencyGHz: 10, investmentCr: 312, status: 'Delayed', priority: 'Critical', origin: 'L&T Noida (UP)', destination: 'LRDE Bengaluru (KA)', shipDate: '2026-07-10', transitDays: 8, zone: 'North', remarks: 'L&T X-band GaN-on-SiC TRM for DRDO Uttam AESA radar &#8594; 15W/mm power density at 10GHz &#8594; &#8377;312Cr for 4,000 TRM modules &#8594; 8-day delay: MOCVD reactor maintenance shifted schedule &#8594; Tejas Mark 2 radar depends on this shipment &#8594; L&T &#8377;5,600Cr GaN defence fab cleared by MoD &#8594; also supplies GaN EW jammers for Navy Kamorta-class' },
  { id: 'GAN-0007', batchNo: 'GAN-B2407', city: 'Chennai', foundry: 'Saclay GaN India', deviceType: 'GaN HEMT 1200V', application: 'Railway Traction (Alstom India)', voltageClassV: 1200, frequencyGHz: 0, investmentCr: 176, status: 'Delivered', priority: 'High', origin: 'Saclay Fab Chennai (TN)', destination: 'Alstom Factory Sri City (AP)', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: 'Saclay 1200V GaN HEMT for Alstom Prima locomotive traction inverter &#8594; 99.3% efficiency at 2.5MW &#8594; &#8377;176Cr for 3,500 power stacks &#8594; regenerative braking energy recovery 15% higher &#8594; Saclay India JV between CEA-LITEN and TVS Group at &#8377;4,100Cr &#8594; targeting 150,000 GaN wafer/year for rail and grid &#8594; first Indian GaN fab with vertical device architecture' },
  { id: 'GAN-0008', batchNo: 'GAN-B2408', city: 'Mumbai', foundry: 'Reliance GaN Tech', deviceType: 'GaN-on-Si 650V', application: 'Fast Charger (Shell Recharge)', voltageClassV: 650, frequencyGHz: 0, investmentCr: 95, status: 'In Transit', priority: 'High', origin: 'Reliance Jamnagar GaN (GJ)', destination: 'Shell Recharge Delhi (DL)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Reliance GaN-on-Si 650V for Shell 150kW DC fast charger &#8594; 97.5% efficiency enables liquid-cooling elimination &#8594; &#8377;95Cr for 10,000 PFC+LLC stages &#8594; air-cooled design reduces charger cost 30% &#8594; Reliance &#8377;8,000Cr GaN fab at Dhirubhai Ambani Green Energy Giga Complex &#8594; 200mm GaN-on-Si capacity for EV solar and grid &#8594; volume production Q2 2027' },
  { id: 'GAN-0009', batchNo: 'GAN-B2409', city: 'Kolkata', foundry: 'Webel GaN Centre', deviceType: 'GaN HEMT 200V', application: 'LED Driver (Philips India)', voltageClassV: 200, frequencyGHz: 0, investmentCr: 42, status: 'Processing', priority: 'Standard', origin: 'Webel Salt Lake (WB)', destination: 'Philips LED Kolkata (WB)', shipDate: '2026-07-26', transitDays: 0, zone: 'East', remarks: 'Webel 200V GaN HEMT for Philips smart LED driver &#8594; 95% efficiency at 100W &#8594; &#8377;42Cr for 25,000 driver ICs &#8594; enables flicker-free dimming to 0.1% &#8594; 10-year driver lifetime vs 5-year Si MOSFET &#8594; Webel &#8377;350Cr GaN design centre with packaging and test &#8594; serves lighting consumer electronics and industrial IoT markets' },
  { id: 'GAN-0010', batchNo: 'GAN-B2410', city: 'Jaipur', foundry: 'Rajasthan GaN Park', deviceType: 'GaN HEMT 650V', application: 'Solar Microinverter (Luminous)', voltageClassV: 650, frequencyGHz: 0, investmentCr: 68, status: 'Delivered', priority: 'Standard', origin: 'RGP Jaipur (RJ)', destination: 'Luminous Noida (UP)', shipDate: '2026-07-16', transitDays: 2, zone: 'North', remarks: 'RGP 650V GaN for Luminous 2kW rooftop microinverter &#8594; 98.2% CEC efficiency &#8594; &#8377;68Cr for 18,000 microinverters &#8594; module-level MPPT increases yield 12% &#8594; Rajasthan State Electronics Dev Corp &#8377;500Cr GaN park &#8594; leveraging abundant solar for 24/7 fab power &#8594; targeting export to SE Asia and Africa markets' },
  { id: 'GAN-0011', batchNo: 'GAN-B2411', city: 'Guwahati', foundry: 'NE GaN Hub', deviceType: 'GaN-on-SiC Ku-band 14GHz', application: 'Satcom Terminal (ISRO)', voltageClassV: 12, frequencyGHz: 14, investmentCr: 156, status: 'In Transit', priority: 'Critical', origin: 'NE Hub Guwahati (AS)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-21', transitDays: 5, zone: 'East', remarks: 'NE Hub Ku-band GaN-on-SiC SSPA for ISRO GSAT-N3 satcom terminal &#8594; 25W at 14GHz with 40% PAE &#8594; &#8377;156Cr for 2,500 SSPA modules &#8594; enables VSAT terminal for rural broadband &#8594; DoT NE connectivity project covers 45,000 villages &#8594; Assam Electronics Dev Corp &#8377;450Cr GaN assembly and test facility &#8594; strategic location near ASEAN markets for export' },
  { id: 'GAN-0012', batchNo: 'GAN-B2412', city: 'Coimbatore', foundry: 'PSG GaN Foundry', deviceType: 'GaN HEMT 100V', application: 'Wireless Charger (Bose India)', voltageClassV: 100, frequencyGHz: 0, investmentCr: 38, status: 'Processing', priority: 'Standard', origin: 'PSG Tech Coimbatore (TN)', destination: 'Bose Factory Bengaluru (KA)', shipDate: '2026-07-27', transitDays: 1, zone: 'South', remarks: 'PSG 100V eGaN FET for Bose wireless charging pad &#8594; 93% efficiency at 15W Qi2 &#8594; &#8377;38Cr for 30,000 eGaN ICs &#8594; zero-voltage switching reduces EMI 10dB &#8594; PSG GaN foundry &#8377;280Cr MOCVD system operational &#8594; academic-industry model with Anna University &#8594; training 200 GaN engineers/year for Indian semiconductor ecosystem' },
  { id: 'GAN-0013', batchNo: 'GAN-B2413', city: 'Ahmedabad', foundry: 'IITBNF GaN Lab', deviceType: 'GaN HEMT 650V', application: 'Industrial UPS (ABB India)', voltageClassV: 650, frequencyGHz: 0, investmentCr: 112, status: 'Delivered', priority: 'High', origin: 'IITBNF Gandhinagar (GJ)', destination: 'ABB Vadodara (GJ)', shipDate: '2026-07-14', transitDays: 1, zone: 'West', remarks: 'IITBNF 650V GaN for ABB 200kVA industrial UPS &#8594; 97% efficiency vs 93% Si IGBT &#8594; &#8377;112Cr for 5,000 power blocks &#8594; backup time extended 40% with same battery &#8594; IITBNF &#8377;750Cr national GaN prototyping centre &#8594; MOCVD and DRIE for 200mm GaN-on-Si &#8594; open-access model serves 50 Indian startups' },
  { id: 'GAN-0014', batchNo: 'GAN-B2414', city: 'Thiruvananthapuram', foundry: 'VSSC GaN Centre', deviceType: 'GaN-on-SiC Ka-band 30GHz', application: 'Satellite Transponder (ISRO)', voltageClassV: 5, frequencyGHz: 30, investmentCr: 285, status: 'Delayed', priority: 'Critical', origin: 'VSSC Thiruvananthapuram (KL)', destination: 'ISAC Bengaluru (KA)', shipDate: '2026-07-08', transitDays: 10, zone: 'South', remarks: 'VSSC Ka-band GaN-on-SiC TWTA replacement SSPA &#8594; 40W at 30GHz &#8594; &#8377;285Cr for 1,200 flight modules &#8594; 10-day delay: AlGaN barrier uniformity failed 95% spec at 4-inch &#8594; VSSC redeploying MBE regrowth instead of MOCVD &#8594; GSAT-N2 Ka-band payload launch delayed Q1 2027 &#8594; &#8377;620Cr VSSC GaN space qualification facility &#8594; ISRO targeting 100% indigenous GaN SSPA by 2029' }
]

const ganKpis = [
  { label: 'In Transit / Shipped', value: galliumNitrideRecords.filter(r => r.status === 'In Transit' || r.status === 'Shipped').length, suffix: ' batches', color: 'text-blue-700 bg-blue-50' },
  { label: 'Processing / Tested', value: galliumNitrideRecords.filter(r => r.status === 'Processing' || r.status === 'Tested').length, suffix: ' batches', color: 'text-amber-700 bg-amber-50' },
  { label: 'Delivered / Installed', value: galliumNitrideRecords.filter(r => r.status === 'Delivered' || r.status === 'Installed').length, suffix: ' batches', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Total Investment', value: galliumNitrideRecords.reduce((s: number, r) => s + r.investmentCr, 0), suffix: ' Cr', color: 'text-rose-700 bg-rose-50' }
]

export default function GalliumNitrideLogisticsView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    galliumNitrideRecords.forEach(r => { map[r.status] = (map[r.status] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const foundryCounts = useMemo(() => {
    const map: Record<string, number> = {}
    galliumNitrideRecords.forEach(r => { map[r.foundry] = (map[r.foundry] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const appCounts = useMemo(() => {
    const map: Record<string, number> = {}
    galliumNitrideRecords.forEach(r => { map[r.application] = (map[r.application] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneCounts = useMemo(() => {
    const map: Record<string, number> = {}
    galliumNitrideRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    return galliumNitrideRecords.filter(r => {
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
    <div className="gan-logistics-container p-4 space-y-4">
      <PageHeader title="Gallium Nitride Logistics" description="GaN Power Semiconductor Supply Chain Tracking &#8212; HEMT, MMIC, RF amplifier for EV chargers, 5G base stations, datacenter PSU, defence radar, solar inverters and satellite communications" />

      <div className="gan-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ganKpis.map((kpi, i) => (
          <Card key={i} className="gan-kpi-card border-l-4 border-l-rose-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-2xl font-bold ${kpi.color.split(' ')[0]}`}>{kpi.value.toLocaleString()}<span className="text-sm font-normal">{kpi.suffix}</span></p></CardContent></Card>
        ))}
      </div>

      <div className="gan-tab-bar flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`gan-tab-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === i ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-muted-foreground hover:bg-rose-50 border'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="gan-dashboard space-y-4">
          <div className="gan-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="gan-chart-card"><CardHeader><CardTitle className="text-sm">Batch Status Distribution</CardTitle></CardHeader><CardContent>
              <div className="gan-bar-chart space-y-2">
                {statusCounts.map(([s, c]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-rose-100 rounded-full h-4 overflow-hidden"><div className="gan-bar-fill h-full bg-rose-500 rounded-full" style={{ width: `${(c / galliumNitrideRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="gan-chart-card"><CardHeader><CardTitle className="text-sm">Foundry Batch Volume</CardTitle></CardHeader><CardContent>
              <div className="gan-bar-chart space-y-2">
                {foundryCounts.slice(0, 8).map(([f, c]) => (
                  <div key={f} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{f}</span><div className="flex-1 bg-rose-100 rounded-full h-4 overflow-hidden"><div className="gan-bar-fill h-full bg-rose-400 rounded-full" style={{ width: `${(c / galliumNitrideRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="gan-registry space-y-3">
          <div className="gan-filter-bar flex flex-wrap gap-2 items-center">
            <Input placeholder="Search batches..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-xs h-8 text-sm" />
            {['status', 'zone', 'priority'].map(key => (
              <div key={key} className="gan-filter-group flex flex-wrap gap-1">
                {Array.from(new Set(galliumNitrideRecords.map(r => r[key as keyof GalliumNitrideRecord] as string))).filter(Boolean).slice(0, 4).map(val => (
                  <button key={val} onClick={() => toggleFilter(key, val)} className={`gan-filter-btn px-2 py-1 text-xs rounded-md border transition-all ${activeFilters[key]?.includes(val) ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-muted-foreground hover:bg-rose-50'}`}>
                    {val}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Card><CardContent className="p-0">
            <div className="gan-table-wrap overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b bg-rose-50/50">
                  <th className="p-2 text-left font-medium">Batch ID</th><th className="p-2 text-left font-medium">Foundry</th><th className="p-2 text-left font-medium">Device</th><th className="p-2 text-left font-medium">Application</th><th className="p-2 text-left font-medium">Voltage</th><th className="p-2 text-left font-medium">Investment</th><th className="p-2 text-left font-medium">Status</th><th className="p-2 text-left font-medium">Origin</th><th className="p-2 text-left font-medium">Dest</th><th className="p-2 text-left font-medium">Days</th>
                </tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`gan-table-row border-b hover:bg-rose-50/30 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-2"><Badge variant="outline" className="text-rose-700 border-rose-300 font-mono">{r.id}</Badge></td>
                      <td className="p-2">{r.foundry}</td><td className="p-2">{r.deviceType}</td><td className="p-2">{r.application}</td>
                      <td className="p-2">{r.voltageClassV}V</td><td className="p-2">{r.investmentCr}Cr</td>
                      <td className="p-2"><Badge className={`${r.status === 'Delayed' ? 'bg-red-100 text-red-800' : r.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : r.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{r.status}</Badge></td>
                      <td className="p-2 truncate max-w-28">{r.origin}</td><td className="p-2 truncate max-w-28">{r.destination}</td><td className="p-2">{r.transitDays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </div>
      )}

      {activeTab === 2 && (
        <div className="gan-analytics space-y-4">
          <div className="gan-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="gan-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent>
              <div className="gan-bar-chart space-y-2">
                {(Object.entries(zoneCounts.reduce((acc: Record<string, number>, [z]) => {
                  const total = galliumNitrideRecords.filter(r => r.zone === z).reduce((s: number, rr) => s + rr.investmentCr, 0)
                  acc[z] = total
                  return acc
                }, {})) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, v]) => (
                  <div key={z} className="flex items-center gap-2"><span className="text-xs w-16 text-right">{z}</span><div className="flex-1 bg-rose-100 rounded-full h-4 overflow-hidden"><div className="gan-bar-fill h-full bg-rose-500 rounded-full" style={{ width: `${(v / 2200) * 100}%` }} /></div><span className="text-xs font-medium w-16 text-right">{v}Cr</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="gan-chart-card"><CardHeader><CardTitle className="text-sm">Application Distribution</CardTitle></CardHeader><CardContent>
              <div className="gan-bar-chart space-y-2">
                {appCounts.slice(0, 8).map(([a, c]) => (
                  <div key={a} className="flex items-center gap-2"><span className="text-xs w-40 text-right truncate">{a}</span><div className="flex-1 bg-rose-100 rounded-full h-4 overflow-hidden"><div className="gan-bar-fill h-full bg-rose-400 rounded-full" style={{ width: `${(c / galliumNitrideRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="gan-chart-card"><CardHeader><CardTitle className="text-sm">Frequency vs Power (RF Devices)</CardTitle></CardHeader><CardContent>
              <div className="gan-bar-chart space-y-2">
                {galliumNitrideRecords.filter(r => r.frequencyGHz > 0).sort((a, b) => b.frequencyGHz - a.frequencyGHz).map(r => (
                  <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-40 text-right truncate">{r.deviceType}</span><div className="flex-1 bg-rose-100 rounded-full h-4 overflow-hidden"><div className="gan-bar-fill h-full bg-rose-300 rounded-full" style={{ width: `${(r.frequencyGHz / 35) * 100}%` }} /></div><span className="text-xs font-medium w-16 text-right">{r.frequencyGHz}GHz</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="gan-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Status</CardTitle></CardHeader><CardContent>
              <div className="gan-bar-chart space-y-2">
                {(Object.entries(galliumNitrideRecords.reduce((acc: Record<string, { sum: number; count: number }>, r) => {
                  if (!acc[r.status]) acc[r.status] = { sum: 0, count: 0 }
                  acc[r.status].sum += r.transitDays
                  acc[r.status].count += 1
                  return acc
                }, {})) as [string, { sum: number; count: number }][]).map(([s, v]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-24 text-right truncate">{s}</span><div className="flex-1 bg-rose-100 rounded-full h-4 overflow-hidden"><div className="gan-bar-fill h-full bg-rose-500 rounded-full" style={{ width: `${(v.sum / v.count / 12) * 100}%` }} /></div><span className="text-xs font-medium w-12 text-right">{(v.sum / v.count).toFixed(1)}d</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="gan-insights space-y-3">
          <Card className="gan-insight-card border-l-4 border-l-rose-600"><CardHeader><CardTitle className="text-sm text-rose-800">India GaN Fab Ecosystem: &#8377;35,000Cr Investment Pipeline</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s gallium nitride semiconductor industry is rapidly expanding with 14 GaN fabs and design centres across 13 cities &#8594; Reliance GaN Tech Jamnagar (&#8377;8,000Cr), L&amp;T GaN Defence Noida (&#8377;5,600Cr), Saclay GaN India Chennai (&#8377;4,100Cr), Skyworks Fab Hyderabad (&#8377;3,200Cr), TI Fab Gandhinagar (&#8377;14,000Cr multi-tech including GaN) &#8594; PLI scheme incentives covering 30% CAPEX for GaN power and RF &#8594; targeting &#8377;18,000Cr GaN output by 2030. GaN-on-Si dominates power (650-1200V) while GaN-on-SiC dominates RF (6-40GHz) &#8594; 200mm transition underway at Reliance and Saclay fabs.</p></CardContent></Card>
          <Card className="gan-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: GAN-0006 and GAN-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GAN-0006 (L&amp;T Noida to LRDE Bengaluru, 8-day delay): X-band TRM for DRDO Uttam AESA radar &#8594; MOCVD reactor at L&amp;T fab down for unscheduled preventive maintenance &#8594; AlGaN barrier thickness drifted 2nm from 18nm target &#8594; Tejas Mark 2 flight test schedule at risk &#8594; 4,000 TRM modules worth &#8377;312Cr affected. GAN-0014 (VSSC Thiruvananthapuram to ISAC Bengaluru, 10-day delay): Ka-band SSPA for GSAT-N2 &#8594; 4-inch GaN-on-SiC wafer AlGaN barrier uniformity failed 95% spec &#8594; VSSC switching from MOCVD to MBE regrowth process &#8594; &#8377;285Cr satellite payload at risk &#8594; GSAT-N2 launch pushed to Q1 2027.</p></CardContent></Card>
          <Card className="gan-insight-card border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm text-rose-700">GaN vs SiC: Complementary Power Semiconductor Roadmap</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GaN and SiC serve complementary roles in the power semiconductor landscape &#8594; GaN dominates below 1200V with superior switching speed (100MHz vs 1MHz SiC) and lower cost on 200mm Si substrates &#8594; ideal for EV chargers, datacenter PSU, LED drivers, and consumer fast chargers &#8594; SiC dominates above 1200V with higher thermal conductivity and breakdown field &#8594; ideal for EV traction, rail, solar string inverters, and grid &#8594; India&apos;s dual-track strategy: 8 GaN fabs for sub-1200V and 4 SiC fabs for 1200V+ &#8594; &#8377;25,000Cr combined investment in both technologies.</p></CardContent></Card>
          <Card className="gan-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">RF GaN: Strategic Defence and 5G Opportunity</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GaN-on-SiC RF devices represent India&apos;s highest-value semiconductor segment &#8594; defence applications: AESA radar (DRDO Uttam), electronic warfare jammers (Navy Kamorta-class), satellite communications (ISRO GSAT series) &#8594; 5G mmWave: Jio deploying 28GHz GaN MMIC from Skyworks Hyderabad &#8594; 45% PAE enables 40% fewer base stations vs sub-6GHz &#8594; global GaN RF market &#8377;45,000Cr by 2028 &#8594; India targeting &#8377;5,000Cr domestic GaN RF output &#8594; QML-V defence qualification at L&amp;T and BEL fabs &#8594; L&amp;T TRM cost 60% below Raytheon imports.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
