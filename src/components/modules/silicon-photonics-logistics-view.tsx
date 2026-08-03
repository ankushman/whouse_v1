'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Sun } from 'lucide-react'

interface SiliconPhotonicsRecord {
  id: string
  batchNo: string
  city: string
  foundry: string
  deviceType: string
  application: string
  dataRateGbps: number
  wavelengthNm: number
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

const siliconPhotonicsRecords: SiliconPhotonicsRecord[] = [
  { id: 'SIP-0001', batchNo: 'SIP-B2401', city: 'Bengaluru', foundry: 'Sigtuple Photonics', deviceType: 'SiN MRR 100GHz', application: 'DWDM Filter (Jio Telecom)', dataRateGbps: 400, wavelengthNm: 1550, investmentCr: 168, status: 'Delivered', priority: 'Critical', origin: 'Sigtuple Bengaluru (KA)', destination: 'Jio Data Center Mumbai (MH)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Sigtuple silicon nitride microring resonator for Jio 400G DWDM transceiver &#8594; 100GHz channel spacing C-band filter &#8594; &#8377;168Cr for 15,000 MRR chips &#8594; replaces InP-based AWG at 80% lower cost &#8594; Sigtuple &#8377;2,400Cr Bengaluru Si photonics fab with 200mm SOI and SiN &#8594; targeting &#8377;6,000Cr revenue by 2029 &#8594; Jio deploying 800,000 400G ports in 5G backhaul &#8594; SiN platform enables CMOS-compatible photonics at scale' },
  { id: 'SIP-0002', batchNo: 'SIP-B2402', city: 'Pune', foundry: 'SiEn Photonics', deviceType: 'SOI Grating Coupler', application: 'Datacenter Interconnect (CtrlS)', dataRateGbps: 800, wavelengthNm: 1310, investmentCr: 95, status: 'In Transit', priority: 'High', origin: 'SiEn Pune (MH)', destination: 'CtrlS Hyderabad (TS)', shipDate: '2026-07-24', transitDays: 1, zone: 'West', remarks: 'SiEn SOI grating coupler for CtrlS 800G datacenter interconnect &#8594; edge coupler with 95% efficiency at 1310nm &#8594; &#8377;95Cr for 20,000 coupler chips &#8594; enables co-packaged optics (CPO) replacing pluggable transceivers &#8594; SiEn &#8377;1,600Cr Pune fab with 300mm SOI &#8594; first Indian fab with 300mm photonics capability &#8594; CtrlS building 1 GW datacenter capacity &#8594; CPO reduces switch power 60% vs QSFP-DD modules' },
  { id: 'SIP-0003', batchNo: 'SIP-B2403', city: 'Hyderabad', foundry: 'IIT-H Silicon Photonics', deviceType: 'SiGe Mach-Zehnder Modulator', application: 'Optical Transceiver (Airtel)', dataRateGbps: 200, wavelengthNm: 1550, investmentCr: 112, status: 'Delivered', priority: 'High', origin: 'IIT-H Fab Hyderabad (TS)', destination: 'Airtel NOC Noida (UP)', shipDate: '2026-07-15', transitDays: 2, zone: 'South', remarks: 'IIT-H SiGe Mach-Zehnder modulator for Airtel 200G coherent transceiver &#8594; 30GHz bandwidth enabling 64-QAM at 200G &#8594; &#8377;112Cr for 8,000 modulator chips &#8594; eliminates lithium niobate dependency &#8594; IIT-H &#8377;750Cr Si photonics research fab &#8594; open-access MPW for 50 Indian startups &#8594; Airtel deploying 200G coherent in 15,000 ROADM nodes &#8594; SiGe BiCMOS process integrated with STMicroelectronics &#8594; Vpi-L product 0.3 V-cm industry leading' },
  { id: 'SIP-0004', batchNo: 'SIP-B2404', city: 'Chennai', foundry: 'Tata SiPhoton Foundry', deviceType: 'SOI 4-Channel CWDM Mux', application: '5G Fronthaul (Reliance Jio)', dataRateGbps: 100, wavelengthNm: 1310, investmentCr: 78, status: 'In Transit', priority: 'Standard', origin: 'Tata SP Chennai (TN)', destination: 'Jio Tower Hub Ranchi (JH)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Tata SOI 4-channel CWDM mux for Jio 5G fronthaul &#8594; 1271-1331nm 20nm spacing 4-channel multiplexer &#8594; &#8377;78Cr for 25,000 mux chips &#8594; eCPRI compliant for 5G RAN split &#8594; Tata SiPhoton &#8377;3,800Cr Chennai fab with 200mm SOI line &#8594; JV with Intel for silicon photonics technology transfer &#8594; targeting 100,000 wafer starts/year &#8594; also producing AWG and VOA for telecom networks' },
  { id: 'SIP-0005', batchNo: 'SIP-B2405', city: 'Mumbai', foundry: 'L&T Optical Semicon', deviceType: 'SiN Edge Coupler Array', application: 'LIDAR (Tata Motors ADAS)', dataRateGbps: 0, wavelengthNm: 905, investmentCr: 145, status: 'Delivered', priority: 'Critical', origin: 'L&T Optical Mumbai (MH)', destination: 'Tata ADAS Pune (MH)', shipDate: '2026-07-16', transitDays: 1, zone: 'West', remarks: 'L&T SiN edge coupler array for Tata Motors solid-state LIDAR &#8594; 256-channel optical phased array at 905nm &#8594; &#8377;145Cr for 4,000 OPA chips &#8594; 200m range at 10cm resolution &#8594; L&T &#8377;4,200Cr optical semiconductor fab &#8594; SiN waveguide platform enables monolithic integration with CMOS driver &#8594; Tata ADAS level-3 autonomous driving programme &#8594; replaces Velodyne mechanical LIDAR at 90% lower cost &#8594; 10x reliability improvement vs moving parts' },
  { id: 'SIP-0006', batchNo: 'SIP-B2406', city: 'Gandhinagar', foundry: 'Darma Photonics', deviceType: 'SOI Ge-on-Si Photodetector', application: 'Receiver Module (BharatNet)', dataRateGbps: 25, wavelengthNm: 1550, investmentCr: 52, status: 'Processing', priority: 'High', origin: 'Darma Gandhinagar (GJ)', destination: 'BharatNet NOC Delhi (DL)', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: 'Darma Ge-on-Si photodetector for BharatNet FTTH receiver &#8594; 25Gbps responsivity 0.8A/W at 1550nm &#8594; &#8377;52Cr for 30,000 PD chips &#8594; monolithically integrated with SiGe TIA on 200mm SOI &#8594; Darma &#8377;680Cr Gandhinagar fab &#8594; serving BharatNet 500,000 village fibre connectivity &#8594; also producing APD for 10G PON &#8594; Ge-on-Si eliminates III-V material dependency &#8594; 3 dB lower noise vs InGaAs at 25Gbps' },
  { id: 'SIP-0007', batchNo: 'SIP-B2407', city: 'Noida', foundry: 'STMicroelectronics India', deviceType: 'SOI VCSEL Driver', application: 'AOC Module (Dell India)', dataRateGbps: 100, wavelengthNm: 850, investmentCr: 86, status: 'Delivered', priority: 'Standard', origin: 'STM Noida Fab (UP)', destination: 'Dell SRS Bengaluru (KA)', shipDate: '2026-07-12', transitDays: 2, zone: 'North', remarks: 'STM Noida VCSEL driver for Dell active optical cable module &#8594; 4x25G VCSEL driver array with CMOS photonics integration &#8594; &#8377;86Cr for 18,000 driver ICs &#8594; 100G AOC replaces copper cable in rack-to-rack &#8594; STM &#8377;14,000Cr Noida fab with 28nm CMOS and Si photonics &#8594; Dell SRS producing 200,000 servers/year &#8594; AOC reduces cable weight 80% vs copper DAC &#8594; 3m reach at 100G &#8594; STM targeting 400G VCSEL driver by 2027' },
  { id: 'SIP-0008', batchNo: 'SIP-B2408', city: 'Kolkata', foundry: 'Webel Photonics Centre', deviceType: 'SiN TFF WDM Filter', application: 'FTTH OLT (BSNL)', dataRateGbps: 10, wavelengthNm: 1490, investmentCr: 28, status: 'Processing', priority: 'Standard', origin: 'Webel Kolkata (WB)', destination: 'BSNL OLT Ranchi (JH)', shipDate: '2026-07-26', transitDays: 2, zone: 'East', remarks: 'Webel SiN thin-film filter for BSNL FTTH OLT transceiver &#8594; triplexer 1310/1490/1550nm for GPON &#8594; &#8377;28Cr for 40,000 TFF chips &#8594; flat-top passband with 0.4dB insertion loss &#8594; Webel &#8377;350 Kolkata Si photonics design centre &#8594; BSNL 200,000 FTTH connections under BharatNet Phase-2 &#8594; SiN TFF replaces bulk-optics thin-film filter &#8594; 10x reliability improvement in field conditions &#8594; Webel also producing thermo-optic VOA for power monitoring' },
  { id: 'SIP-0009', batchNo: 'SIP-B2409', city: 'Coimbatore', foundry: 'PSG SiP Foundry', deviceType: 'SOI Plasmonic Modulator', application: 'Quantum Key (ISRO)', dataRateGbps: 10, wavelengthNm: 1550, investmentCr: 195, status: 'Delayed', priority: 'Critical', origin: 'PSG Coimbatore (TN)', destination: 'ISRO Ahmedabad (GJ)', shipDate: '2026-07-09', transitDays: 8, zone: 'South', remarks: 'PSG plasmonic modulator for ISRO quantum key distribution &#8594; 10Gbps quantum random number generator on Si photonics &#8594; &#8377;195Cr for 2,000 QRNG modules &#8594; 8-day delay: gold plasmonic layer adhesion failure &#8594; ISRO GSAT-N3 QKD payload depends on this shipment &#8594; PSG &#8377;280Cr Si photonics foundry with e-beam lithography &#8594; first Indian quantum photonics chip &#8594; &#8377;12,000Cr GSAT-N3 at risk &#8594; DRDO quantum communication programme also dependent &#8594; replacing Ti-Au with Ti-Pt-Au adhesion stack' },
  { id: 'SIP-0010', batchNo: 'SIP-B2410', city: 'Thiruvananthapuram', foundry: 'VSSC Integrated Photonics', deviceType: 'SiN Spectrometer-on-Chip', application: 'Satellite Earth Observation (ISRO)', dataRateGbps: 0, wavelengthNm: 400, investmentCr: 220, status: 'In Transit', priority: 'Critical', origin: 'VSSC Thiruvananthapuram (KL)', destination: 'NRSC Hyderabad (TS)', shipDate: '2026-07-21', transitDays: 2, zone: 'South', remarks: 'VSSC SiN spectrometer-on-chip for ISRO hyperspectral earth observation &#8594; 400-1000nm visible-NIR on-chip spectrometer &#8594; &#8377;220Cr for 600 spectrometer chips &#8594; 2nm spectral resolution replaces 10kg grating spectrometer &#8594; VSSC &#8377;480Cr integrated photonics lab &#8594; NRSC processing satellite imagery for agriculture and defence &#8594; SiN waveguide array enables 256-band hyperspectral imaging &#8594; 100x size reduction vs conventional spectrometer &#8594; qualified for space radiation (TRL-6) &#8594; first Indian chip for space remote sensing' },
  { id: 'SIP-0011', batchNo: 'SIP-B2411', city: 'Guwahati', foundry: 'NE Silicon Photonics Hub', deviceType: 'SOI Optical Neural Net', application: 'AI Accelerator (IIT-G)', dataRateGbps: 0, wavelengthNm: 1550, investmentCr: 88, status: 'Processing', priority: 'Standard', origin: 'NE Hub Guwahati (AS)', destination: 'IIT Guwahati (AS)', shipDate: '2026-07-27', transitDays: 0, zone: 'East', remarks: 'NE Hub SOI photonic neural network for IIT-G AI accelerator research &#8594; 64-node mesh interconnect at 1550nm &#8594; &#8377;88Cr for 500 photonic computing chips &#8594; 100 TOPS/W energy efficiency vs 15 TOPS/W GPU &#8594; NE Hub &#8377;450Cr silicon photonics facility &#8594; first photonic AI chip designed in Northeast India &#8594; Mach-Zehnder interferometer weights programmable in situ &#8594; targeting defence AI inference at edge &#8594; strategic location near ASEAN electronics supply chain' },
  { id: 'SIP-0012', batchNo: 'SIP-B2412', city: 'Ahmedabad', foundry: 'IITBNF Photonic Line', deviceType: 'SiN Bio-Sensor Waveguide', application: 'Glucose Monitor (Zydus Lifesciences)', dataRateGbps: 0, wavelengthNm: 780, investmentCr: 62, status: 'Delivered', priority: 'High', origin: 'IITBNF Gandhinagar (GJ)', destination: 'Zydus Ahmedabad (GJ)', shipDate: '2026-07-14', transitDays: 0, zone: 'West', remarks: 'IITBNF SiN biosensor waveguide for Zydus continuous glucose monitor &#8594; evanescent field sensing at 780nm with fluorescent label &#8594; &#8377;62Cr for 15,000 biosensor chips &#8594; real-time glucose reading via subcutaneous interstitial fluid &#8594; IITBNF &#8377;750Cr national Si photonics prototyping centre &#8594; functionalized SiN surface with glucose oxidase &#8594; Zydus launching CGM patch for &#8377;5,000 14-day wear &#8594; replaces finger-prick glucose monitoring &#8594; &#8377;8,500Cr India diabetes care market' },
  { id: 'SIP-0013', batchNo: 'SIP-B2413', city: 'Jaipur', foundry: 'RGP Photonics Park', deviceType: 'SOI Thermo-Optic Switch', application: 'ROADM Node (BSNL)', dataRateGbps: 100, wavelengthNm: 1550, investmentCr: 45, status: 'In Transit', priority: 'Standard', origin: 'RGP Jaipur (RJ)', destination: 'BSNL ROADM Jaipur (RJ)', shipDate: '2026-07-22', transitDays: 0, zone: 'North', remarks: 'RGP SOI 1x4 thermo-optic switch for BSNL ROADM node &#8594; 1550nm 100Gbps per port with &lt;1dB insertion loss &#8594; &#8377;45Cr for 6,000 switch chips &#8594; 2ms switching speed replaces MEMS 10ms &#8594; RGP &#8377;500Cr Rajasthan photonics park &#8594; BSNL deploying 5,000 ROADM nodes under BharatNet &#8594; Si thermo-optic switch eliminates moving parts &#8594; 10x lifetime improvement vs MEMS &#8594; also producing variable optical attenuator for power equalization' },
  { id: 'SIP-0014', batchNo: 'SIP-B2414', city: 'Lucknow', foundry: 'UP Silicon Optics Centre', deviceType: 'SiN Frequency Comb', application: 'Optical Clock (CSIR-NPL)', dataRateGbps: 0, wavelengthNm: 1550, investmentCr: 175, status: 'Delayed', priority: 'Critical', origin: 'USOC Lucknow (UP)', destination: 'CSIR-NPL New Delhi (DL)', shipDate: '2026-07-06', transitDays: 12, zone: 'North', remarks: 'USOC SiN microresonator frequency comb for CSIR-NPL optical atomic clock &#8594; 1550nm octave-spanning comb with 1GHz repetition rate &#8594; &#8377;175Cr for 800 comb chips &#8594; 12-day delay: SiN waveguide loss at 0.5dB/cm above 0.2dB/cm spec &#8594; CSIR-NPL developing India&apos;s first strontium lattice optical clock &#8594; USOC &#8377;420Cr silicon optics centre &#8594; frequency comb enables 10-18 accuracy timekeeping &#8594; strategic for GPS-denied navigation (DRDO) &#8594; &#8377;2,800Cr national timing infrastructure at stake' }
]

const sipKpis = [
  { label: 'In Transit / Shipped', value: siliconPhotonicsRecords.filter(r => r.status === 'In Transit' || r.status === 'Shipped').length, suffix: ' batches', color: 'text-violet-700 bg-violet-50' },
  { label: 'Processing / Fab', value: siliconPhotonicsRecords.filter(r => r.status === 'Processing' || r.status === 'Fab').length, suffix: ' batches', color: 'text-amber-700 bg-amber-50' },
  { label: 'Delivered / Installed', value: siliconPhotonicsRecords.filter(r => r.status === 'Delivered' || r.status === 'Installed').length, suffix: ' batches', color: 'text-emerald-700 bg-emerald-50' },
  { label: 'Total Investment', value: siliconPhotonicsRecords.reduce((s: number, r) => s + r.investmentCr, 0), suffix: ' Cr', color: 'text-rose-700 bg-rose-50' }
]

export default function SiliconPhotonicsLogisticsView() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights']

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    siliconPhotonicsRecords.forEach(r => { map[r.status] = (map[r.status] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const foundryCounts = useMemo(() => {
    const map: Record<string, number> = {}
    siliconPhotonicsRecords.forEach(r => { map[r.foundry] = (map[r.foundry] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const appCounts = useMemo(() => {
    const map: Record<string, number> = {}
    siliconPhotonicsRecords.forEach(r => { map[r.application] = (map[r.application] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneCounts = useMemo(() => {
    const map: Record<string, number> = {}
    siliconPhotonicsRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const filtered = useMemo(() => {
    return siliconPhotonicsRecords.filter(r => {
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
    <div className="sip-logistics-container p-4 space-y-4">
      <PageHeader title="Silicon Photonics Logistics" description="Silicon Photonics Chip Supply Chain Tracking &#8212; SOI/SiN modulators, detectors, MRR filters, frequency combs, LIDAR arrays, biosensors and quantum photonics for telecom, datacenter, defence and healthcare" />

      <div className="sip-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sipKpis.map((kpi, i) => (
          <Card key={i} className="sip-kpi-card border-l-4 border-l-violet-500"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-2xl font-bold ${kpi.color.split(' ')[0]}`}>{kpi.value.toLocaleString()}<span className="text-sm font-normal">{kpi.suffix}</span></p></CardContent></Card>
        ))}
      </div>

      <div className="sip-tab-bar flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`sip-tab-btn px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === i ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-muted-foreground hover:bg-violet-50 border'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="sip-dashboard space-y-4">
          <div className="sip-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="sip-chart-card"><CardHeader><CardTitle className="text-sm">Batch Status Distribution</CardTitle></CardHeader><CardContent>
              <div className="sip-bar-chart space-y-2">
                {statusCounts.map(([s, c]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-violet-100 rounded-full h-4 overflow-hidden"><div className="sip-bar-fill h-full bg-violet-500 rounded-full" style={{ width: `${(c / siliconPhotonicsRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="sip-chart-card"><CardHeader><CardTitle className="text-sm">Foundry Batch Volume</CardTitle></CardHeader><CardContent>
              <div className="sip-bar-chart space-y-2">
                {foundryCounts.slice(0, 8).map(([f, c]) => (
                  <div key={f} className="flex items-center gap-2"><span className="text-xs w-28 text-right truncate">{f}</span><div className="flex-1 bg-violet-100 rounded-full h-4 overflow-hidden"><div className="sip-bar-fill h-full bg-violet-400 rounded-full" style={{ width: `${(c / siliconPhotonicsRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="sip-registry space-y-3">
          <div className="sip-filter-bar flex flex-wrap gap-2 items-center">
            <Input placeholder="Search batches..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-xs h-8 text-sm" />
            {['status', 'zone', 'priority'].map(key => (
              <div key={key} className="sip-filter-group flex flex-wrap gap-1">
                {Array.from(new Set(siliconPhotonicsRecords.map(r => r[key as keyof SiliconPhotonicsRecord] as string))).filter(Boolean).slice(0, 4).map(val => (
                  <button key={val} onClick={() => toggleFilter(key, val)} className={`sip-filter-btn px-2 py-1 text-xs rounded-md border transition-all ${activeFilters[key]?.includes(val) ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-muted-foreground hover:bg-violet-50'}`}>
                    {val}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Card><CardContent className="p-0">
            <div className="sip-table-wrap overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b bg-violet-50/50">
                  <th className="p-2 text-left font-medium">Batch ID</th><th className="p-2 text-left font-medium">Foundry</th><th className="p-2 text-left font-medium">Device</th><th className="p-2 text-left font-medium">Application</th><th className="p-2 text-left font-medium">Rate</th><th className="p-2 text-left font-medium">Wavelength</th><th className="p-2 text-left font-medium">Investment</th><th className="p-2 text-left font-medium">Status</th><th className="p-2 text-left font-medium">Origin</th><th className="p-2 text-left font-medium">Dest</th>
                </tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={`sip-table-row border-b hover:bg-violet-50/30 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-2"><Badge variant="outline" className="text-violet-700 border-violet-300 font-mono">{r.id}</Badge></td>
                      <td className="p-2">{r.foundry}</td><td className="p-2">{r.deviceType}</td><td className="p-2">{r.application}</td>
                      <td className="p-2">{r.dataRateGbps ? `${r.dataRateGbps}G` : 'N/A'}</td><td className="p-2">{r.wavelengthNm}nm</td><td className="p-2">{r.investmentCr}Cr</td>
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
        <div className="sip-analytics space-y-4">
          <div className="sip-chart-row grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="sip-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone</CardTitle></CardHeader><CardContent>
              <div className="sip-bar-chart space-y-2">
                {(Object.entries(zoneCounts.reduce((acc: Record<string, number>, [z]) => {
                  const total = siliconPhotonicsRecords.filter(r => r.zone === z).reduce((s: number, rr) => s + rr.investmentCr, 0)
                  acc[z] = total
                  return acc
                }, {})) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([z, v]) => (
                  <div key={z} className="flex items-center gap-2"><span className="text-xs w-16 text-right">{z}</span><div className="flex-1 bg-violet-100 rounded-full h-4 overflow-hidden"><div className="sip-bar-fill h-full bg-violet-500 rounded-full" style={{ width: `${(v / 400) * 100}%` }} /></div><span className="text-xs font-medium w-14 text-right">{v}Cr</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="sip-chart-card"><CardHeader><CardTitle className="text-sm">Application Distribution</CardTitle></CardHeader><CardContent>
              <div className="sip-bar-chart space-y-2">
                {appCounts.slice(0, 8).map(([a, c]) => (
                  <div key={a} className="flex items-center gap-2"><span className="text-xs w-36 text-right truncate">{a}</span><div className="flex-1 bg-violet-100 rounded-full h-4 overflow-hidden"><div className="sip-bar-fill h-full bg-violet-400 rounded-full" style={{ width: `${(c / siliconPhotonicsRecords.length) * 100}%` }} /></div><span className="text-xs font-medium w-6">{c}</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="sip-chart-card"><CardHeader><CardTitle className="text-sm">Data Rate by Device Type</CardTitle></CardHeader><CardContent>
              <div className="sip-bar-chart space-y-2">
                {siliconPhotonicsRecords.filter(r => r.dataRateGbps > 0).sort((a, b) => b.dataRateGbps - a.dataRateGbps).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-2"><span className="text-xs w-32 text-right truncate">{r.deviceType.split('(')[0].trim()}</span><div className="flex-1 bg-violet-100 rounded-full h-4 overflow-hidden"><div className="sip-bar-fill h-full bg-violet-300 rounded-full" style={{ width: `${(r.dataRateGbps / 800) * 100}%` }} /></div><span className="text-xs font-medium w-16 text-right">{r.dataRateGbps}Gbps</span></div>
                ))}
              </div>
            </CardContent></Card>
            <Card className="sip-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Status</CardTitle></CardHeader><CardContent>
              <div className="sip-bar-chart space-y-2">
                {(Object.entries(siliconPhotonicsRecords.reduce((acc: Record<string, { sum: number; count: number }>, r) => {
                  if (!acc[r.status]) acc[r.status] = { sum: 0, count: 0 }
                  acc[r.status].sum += r.transitDays
                  acc[r.status].count += 1
                  return acc
                }, {})) as [string, { sum: number; count: number }][]).map(([s, v]) => (
                  <div key={s} className="flex items-center gap-2"><span className="text-xs w-20 text-right truncate">{s}</span><div className="flex-1 bg-violet-100 rounded-full h-4 overflow-hidden"><div className="sip-bar-fill h-full bg-violet-500 rounded-full" style={{ width: `${(v.sum / v.count / 14) * 100}%` }} /></div><span className="text-xs font-medium w-12 text-right">{(v.sum / v.count).toFixed(1)}d</span></div>
                ))}
              </div>
            </CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="sip-insights space-y-3">
          <Card className="sip-insight-card border-l-4 border-l-violet-600"><CardHeader><CardTitle className="text-sm text-violet-800">India Silicon Photonics: &#8377;18,000Cr Ecosystem by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s silicon photonics industry is rapidly scaling with 14 fabs/design centres across 13 cities &#8594; combined &#8377;18,000Cr investment targeting 200mm and 300mm SOI/SiN platforms &#8594; key players: Tata SiPhoton Chennai (&#8377;3,800Cr), L&T Optical Mumbai (&#8377;4,200Cr), Sigtuple Bengaluru (&#8377;2,400Cr), SiEn Pune (&#8377;1,600Cr), STM Noida (&#8377;14,000Cr multi-tech including SiP) &#8594; SOI platform dominates telecom (modulators, AWG, switches) while SiN platform leads LIDAR, sensors and quantum &#8594; India targeting 10% global Si photonics market by 2030 &#8594; PLI scheme covering 30% CAPEX for photonic IC fabs &#8594; applications span telecom, datacenter, defence, healthcare, space and quantum computing.</p></CardContent></Card>
          <Card className="sip-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: SIP-0009 and SIP-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">SIP-0009 (PSG Coimbatore to ISRO Ahmedabad, 8-day delay): plasmonic modulator for GSAT-N3 QKD payload &#8594; gold plasmonic layer adhesion failure on Si waveguide &#8594; Ti-Au stack delaminating at 200&#176;C bonding step &#8594; PSG switching to Ti-Pt-Au adhesion stack with Pt barrier &#8594; 2,000 QRNG modules at &#8377;195Cr &#8594; DRDO quantum programme also dependent on this chip. SIP-0014 (USOC Lucknow to CSIR-NPL Delhi, 12-day delay): SiN microresonator frequency comb for optical atomic clock &#8594; SiN waveguide propagation loss at 0.5dB/cm vs 0.2dB/cm spec &#8594; USOC re-optimizing DRIE etch parameters for sidewall roughness &#8594; 800 comb chips at &#8377;175Cr &#8594; &#8377;2,800Cr national timing infrastructure at stake &#8594; DRDO GPS-denied navigation programme affected.</p></CardContent></Card>
          <Card className="sip-insight-card border-l-4 border-l-violet-500"><CardHeader><CardTitle className="text-sm text-violet-700">Co-Packaged Optics: 800G Datacenter Revolution</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Si photonics is enabling co-packaged optics (CPO) for next-gen datacenters &#8594; SiEn Pune producing 800G edge couplers for CtrlS replacing QSFP-DD pluggable modules &#8594; CPO integrates optical engine directly on switch ASIC reducing power 60% &#8594; India&apos;s datacenter capacity growing from 1.5 GW to 5 GW by 2028 &#8594; every 1 GW requires 500,000 optical transceivers &#8594; Sigtuple 400G MRR for Jio 5G backhaul at 80% below InP cost &#8594; Tata SiPhoton CWDM mux for 5G fronthaul at 25,000 chips/year &#8594; STM Noida 100G VCSEL driver for Dell AOC modules &#8594; global datacenter optics market &#8377;1,20,000Cr by 2028 &#8594; India targeting &#8377;12,000Cr domestic Si photonics output.</p></CardContent></Card>
          <Card className="sip-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">Quantum Photonics and Biosensing: Emerging Frontiers</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Silicon photonics enables quantum and biomedical applications unachievable with electronics &#8594; PSG Coimbatore Si plasmonic QRNG for ISRO satellite quantum key distribution &#8594; VSSC Thiruvananthapuram SiN spectrometer-on-chip for hyperspectral earth observation &#8594; USOC Lucknow SiN frequency comb for optical atomic clocks with 10-18 accuracy &#8594; IITBNF Gandhinagar SiN biosensor waveguide for Zydus continuous glucose monitor &#8594; NE Hub Guwahati photonic neural network for 100 TOPS/W AI inference &#8594; Webel Kolkata SiN TFF for BSNL FTTH triplexer &#8594; &#8377;5,500Cr combined investment in non-telecom Si photonics &#8594; India targeting 50 Si photonics startups by 2028 &#8594; quantum computing hub at IIT-Hyderabad with photonic qubit processor.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
