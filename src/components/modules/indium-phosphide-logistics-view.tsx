'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { CircuitBoard } from 'lucide-react'

interface IndiumPhosphideRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  waferType: string
  application: string
  waferDiameterInch: number
  bandgapEv: number
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

const indiumPhosphideRecords: IndiumPhosphideRecord[] = [
  { id: 'INP-0001', batchNo: 'INP-B2401', city: 'Bengaluru', manufacturer: 'SCL Bengaluru', waferType: 'InP Semi-Insulating', application: '5G mmWave PA (Qualcomm India)', waferDiameterInch: 6, bandgapEv: 1.34, investmentCr: 285, status: 'Delivered', priority: 'Critical', origin: 'SCL Fab Bengaluru (KA)', destination: 'Qualcomm Hyderabad (TS)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: '6-inch semi-insulating InP wafer for 5G mmWave power amplifier &#8594; 1.34eV bandgap enables 39GHz operation &#8594; &#8377;285Cr for 25,000 wafers &#8594; Qualcomm India producing 5G chipsets at Hyderabad &#8594; InP outperforms GaAs by 2x power efficiency at mmWave &#8594; SCL India sole 6-inch InP wafer fab &#8594; &#8377;22,000Cr Indian 5G RF InP wafer market' },
  { id: 'INP-0002', batchNo: 'INP-B2402', city: 'Hyderabad', manufacturer: 'IICT-CSIR Hyderabad', waferType: 'InP-based HEMT epiwafer', application: 'Phosphorus Ingot (CSIR-NPL)', waferDiameterInch: 4, bandgapEv: 1.34, investmentCr: 168, status: 'In Transit', priority: 'High', origin: 'IICT Hyderabad (TS)', destination: 'CSIR-NPL New Delhi (DL)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'InP HEMT epiwafer for satellite transponder R&amp;D &#8594; 1.34eV direct bandgap with high electron mobility 5400 cm2/Vs &#8594; &#8377;168Cr for 8,000 epiwafers &#8594; CSIR-NPL developing indigenous satellite communication &#8594; InP HEMT offers 3x bandwidth vs GaAs at Ka-band &#8594; ISRO planned GSAT-N2 using InP MMIC &#8594; &#8377;14,500Cr Indian satcom InP market' },
  { id: 'INP-0003', batchNo: 'INP-B2403', city: 'Mumbai', manufacturer: 'Tata Electronics Mumbai', waferType: 'InP Photodiode Epiwafer', application: '100G Optical Receiver (Tejas Networks)', waferDiameterInch: 4, bandgapEv: 1.34, investmentCr: 215, status: 'Delivered', priority: 'Critical', origin: 'Tata Electronics Mumbai (MH)', destination: 'Tejas Networks Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'InP photodiode epiwafer for 100Gbps coherent optical receiver &#8594; 1.34eV bandgap matched to 1310nm and 1550nm telecom windows &#8594; &#8377;215Cr for 12,000 epiwafers &#8594; Tejas Networks India largest optical networking OEM &#8594; InP photodiodes achieve -20dBm sensitivity at 100G &#8594; India deploying 2.5 million fiber broadband connections/month &#8594; &#8377;18,200Cr Indian optical InP device market' },
  { id: 'INP-0004', batchNo: 'INP-B2404', city: 'Pune', manufacturer: 'KPIT Technologies', waferType: 'InP-based Laser Diode', application: 'LiDAR Module (Luminar India JV)', waferDiameterInch: 3, bandgapEv: 1.34, investmentCr: 198, status: 'In Transit', priority: 'High', origin: 'KPIT R&amp;D Pune (MH)', destination: 'Luminar JV Chennai (TN)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'InP laser diode wafer for 1550nm automotive LiDAR &#8594; 1.34eV bandgap enables eye-safe 1550nm operation &#8594; &#8377;198Cr for 18,000 laser diode bars &#8594; Luminar JV targeting 500,000 LiDAR units/year by 2028 &#8594; InP laser 3x range vs 905nm Si at same power class &#8594; ADAS mandate for all new cars from Oct 2027 &#8594; &#8377;16,800Cr Indian automotive InP LiDAR demand' },
  { id: 'INP-0005', batchNo: 'INP-B2405', city: 'Chennai', manufacturer: 'CEERI Pilani Chennai', waferType: 'InP THz Emitter', application: 'Security Scanner Module (BEL)', waferDiameterInch: 2, bandgapEv: 1.34, investmentCr: 142, status: 'Processing', priority: 'Medium', origin: 'CEERI Chennai Centre (TN)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: 'InP-based THz quantum cascade emitter for security imaging &#8594; 1.34eV enables 0.5-3THz frequency generation &#8594; &#8377;142Cr for 4,200 emitter chips &#8594; BEL developing next-gen airport body scanner &#8594; InP THz penetrates clothing without ionizing radiation &#8594; 100 airports targeted for deployment by 2028 &#8594; &#8377;8,500Cr Indian THz security imaging market' },
  { id: 'INP-0006', batchNo: 'INP-B2406', city: 'Noida', manufacturer: 'Bharat Semi Noida', waferType: 'InP Photonic IC', application: 'Silicon Photonics Transceiver (Bharat Net)', waferDiameterInch: 4, bandgapEv: 1.34, investmentCr: 320, status: 'Delivered', priority: 'Critical', origin: 'Bharat Semi Noida (UP)', destination: 'IIT Delhi Photonics Lab (DL)', shipDate: '2026-07-18', transitDays: 1, zone: 'North', remarks: 'InP photonic IC for heterogeneous SiPh transceiver &#8594; 1.34eV InP laser integrated on Si waveguide &#8594; &#8377;320Cr for 15,000 photonic ICs &#8594; Bharat Net deploying 500,000 village fibre connections &#8594; InP-on-Si achieves 400Gbps per wavelength &#8594; India targeting 100Gbps rural broadband by 2028 &#8594; &#8377;24,500Cr Indian photonic IC market' },
  { id: 'INP-0007', batchNo: 'INP-B2407', city: 'Kolkata', manufacturer: 'CGCRI Kolkata', waferType: 'InP Waveguide Epiwafer', application: 'Optical Amplifier (STERLITE Optical)', waferDiameterInch: 4, bandgapEv: 1.34, investmentCr: 156, status: 'Delayed', priority: 'High', origin: 'CGCRI Kolkata (WB)', destination: 'STERLITE Optical Aurangabad (MH)', shipDate: '2026-07-15', transitDays: 3, zone: 'East', remarks: 'InP waveguide epiwafer for EDFA pump laser module &#8594; 1.34eV bandgap optimized for 980nm pump emission &#8594; &#8377;156Cr for 10,000 waveguide epiwafers &#8594; STERLITE India largest optical cable manufacturer &#8594; EDFA pump lasers critical for 400G long-haul &#8594; CGCRI developing InP MOVPE growth capability &#8594; &#8377;12,400Cr Indian optical amplifier market' },
  { id: 'INP-0008', batchNo: 'INP-B2408', city: 'Gandhinagar', manufacturer: 'IIT Gandhinagar', waferType: 'InP-based Solar Cell', application: 'Space Solar Panel (ISRO URSC)', waferDiameterInch: 6, bandgapEv: 1.34, investmentCr: 275, status: 'In Transit', priority: 'Critical', origin: 'IITGN Solar Lab (GJ)', destination: 'ISRO URSC Bengaluru (KA)', shipDate: '2026-07-23', transitDays: 2, zone: 'West', remarks: 'InP-based triple-junction solar cell for Gaganyaan &#8594; 1.34eV middle junction in InGaP/InP/Ge stack &#8594; &#8377;275Cr for 35,000 solar cells &#8594; ISRO targeting 37% cell efficiency for space &#8594; InP triple-junction outperforms Si by 2x in radiation hardness &#8594; Gaganyaan crewed mission solar array 12kW &#8594; &#8377;20,000Cr Indian space solar cell market' },
  { id: 'INP-0009', batchNo: 'INP-B2409', city: 'Ahmedabad', manufacturer: 'PRL Ahmedabad', waferType: 'InP Infrared Detector', application: 'Earth Observation Payload (NRSC ISRO)', waferDiameterInch: 3, bandgapEv: 1.34, investmentCr: 185, status: 'Delivered', priority: 'High', origin: 'PRL Ahmedabad (GJ)', destination: 'NRSC Hyderabad (TS)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'InP infrared focal plane array for hyperspectral imager &#8594; 1.34eV cutoff at 920nm SWIR band &#8594; &#8377;185Cr for 6,000 detector arrays &#8594; NRSC operating INSAT-3DS and RISAT series &#8594; InP SWIR detectors enable mineral mapping and agriculture monitoring &#8594; India launching 12 remote-sensing satellites by 2028 &#8594; &#8377;13,800Cr Indian space IR detector market' },
  { id: 'INP-0010', batchNo: 'INP-B2410', city: 'Jaipur', manufacturer: 'MNIT Jaipur', waferType: 'InP-based LED Epiwafer', application: 'Micro-LED Display (Micron Tech JV)', waferDiameterInch: 6, bandgapEv: 1.34, investmentCr: 220, status: 'Processing', priority: 'Medium', origin: 'MNIT Jaipur (RJ)', destination: 'Micron JV Pune (MH)', shipDate: '2026-07-25', transitDays: 3, zone: 'North', remarks: 'InP-based red micro-LED epiwafer for AR/VR display &#8594; 1.34eV bandgap emits at 920nm, phosphor-converted to red &#8594; &#8377;220Cr for 20,000 epiwafers &#8594; Micron JV targeting 500,000 AR glasses/year by 2029 &#8594; InP micro-LED 10x brighter than GaN at same power &#8594; Apple Vision Pro driving global micro-LED demand &#8594; &#8377;17,500Cr Indian AR display InP market' },
  { id: 'INP-0011', batchNo: 'INP-B2411', city: 'Coimbatore', manufacturer: 'PSG Tech Coimbatore', waferType: 'InP-based Modulator', application: 'Electro-Absorption Modulator (Tejas Networks)', waferDiameterInch: 4, bandgapEv: 1.34, investmentCr: 165, status: 'Delivered', priority: 'High', origin: 'PSG Tech Coimbatore (TN)', destination: 'Tejas Networks Bengaluru (KA)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'InP electro-absorption modulator for 400G ZR transceiver &#8594; 1.34eV enables quantum-confined Stark effect modulation &#8594; &#8377;165Cr for 9,000 modulator chips &#8594; Tejas 400G ZR targeting 800km reach without regeneration &#8594; InP EAM 50x smaller than LiNbO3 modulator &#8594; India datacenter interconnect growing 35% CAGR &#8594; &#8377;15,200Cr Indian optical modulator market' },
  { id: 'INP-0012', batchNo: 'INP-B2412', city: 'Bhubaneswar', manufacturer: 'IICT Bhubaneswar', waferType: 'InP-based THz Detector', application: 'Non-Destructive Testing (BHEL)', waferDiameterInch: 2, bandgapEv: 1.34, investmentCr: 98, status: 'Delayed', priority: 'Medium', origin: 'IICT Bhubaneswar (OD)', destination: 'BHEL Bhopal (MP)', shipDate: '2026-07-14', transitDays: 3, zone: 'East', remarks: 'InP THz detector for weld inspection in power turbine blades &#8594; 1.34eV bandgap enables 0.1-2THz detection &#8594; &#8377;98Cr for 3,500 detector modules &#8594; BHEL manufacturing 80+ GW power equipment/year &#8594; THz NDT replaces X-ray for safer inspection &#8594; IICT scaling InP crystal growth to 3-inch &#8594; &#8377;6,800Cr Indian NDT InP detector market' },
  { id: 'INP-0013', batchNo: 'INP-B2413', city: 'Guwahati', manufacturer: 'IIT Guwahati', waferType: 'InP Quantum Dot', application: 'Single-Photon Source (Qiskit India)', waferDiameterInch: 2, bandgapEv: 1.34, investmentCr: 310, status: 'In Transit', priority: 'Critical', origin: 'IITG Quantum Lab (AS)', destination: 'TIFR Mumbai (MH)', shipDate: '2026-07-23', transitDays: 4, zone: 'East', remarks: 'InP quantum dot single-photon source for quantum computing &#8594; 1.34eV emission at telecom C-band (1550nm) &#8594; &#8377;310Cr for 2,800 quantum dot wafers &#8594; TIFR building 100-qubit superconducting quantum processor &#8594; InP QD emits indistinguishable photons with 99.5% purity &#8594; India allocating &#8377;8,000Cr for National Quantum Mission &#8594; &#8377;25,000Cr Indian quantum photonics market' },
  { id: 'INP-0014', batchNo: 'INP-B2414', city: 'Lucknow', manufacturer: 'DRDO Lucknow', waferType: 'InP-based IR Camera FPA', application: 'Thermal Imaging Sight (BEL Optronic)', waferDiameterInch: 3, bandgapEv: 1.34, investmentCr: 248, status: 'Processing', priority: 'Critical', origin: 'DRDO IRDE Lucknow (UP)', destination: 'BEL Optronic Pune (MH)', shipDate: '2026-07-26', transitDays: 2, zone: 'North', remarks: 'InP-based InGaAs focal plane array for night vision sight &#8594; 1.34eV cutoff for 0.9-1.7um SWIR imaging &#8594; &#8377;248Cr for 5,500 FPAs &#8594; BEL supplying 15,000 thermal sights to Indian Army &#8594; InP SWIR sees through fog and smoke vs MWIR &#8594; DRDO IRDE indigenising defence night vision &#8594; &#8377;21,000Cr Indian defence thermal imaging market' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function IndiumPhosphideLogisticsView() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setFilters(prev => {
      const current = prev[key] || []
      if (current.includes(value)) {
        const updated = current.filter(v => v !== value)
        if (updated.length === 0) {
          const next = { ...prev }
          delete next[key]
          return next
        }
        return { ...prev, [key]: updated }
      }
      return { ...prev, [key]: [...current, value] }
    })
  }

  const filtered = useMemo(() => {
    return indiumPhosphideRecords.filter(r => {
      const matchesSearch = searchQuery === '' ||
        Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase()))
      if (!matchesSearch) return false
      for (const [key, values] of Object.entries(filters)) {
        if (values.length === 0) continue
        const rv = String((r as unknown as Record<string, unknown>)[key] ?? '')
        if (!values.some(v => rv.toLowerCase().includes(v.toLowerCase()))) return false
      }
      return true
    })
  }, [searchQuery, filters])

  const totalInvestment = useMemo(() =>
    indiumPhosphideRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])

  const cityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of indiumPhosphideRecords) {
      map[r.city] = (map[r.city] || 0) + r.investmentCr
    }
    return map
  }, [])

  const waferMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of indiumPhosphideRecords) {
      map[r.waferType] = (map[r.waferType] || 0) + 1
    }
    return map
  }, [])

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of indiumPhosphideRecords) {
      map[r.status] = (map[r.status] || 0) + 1
    }
    return map
  }, [])

  const statusColorMap: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-800',
    'In Transit': 'bg-blue-100 text-blue-800',
    Processing: 'bg-yellow-100 text-yellow-800',
    Delayed: 'bg-red-100 text-red-800',
  }

  const maxBarValue = Math.max(...(Object.values(cityMap) as number[]), 1)

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Indium Phosphide Photonics Logistics"
        description={`India InP wafer and photonic device supply chain tracking &#8594; ${indiumPhosphideRecords.length} shipments &#8594; ${totalInvestment.toLocaleString('en-IN')} Cr total investment &#8594; 5G mmWave, LiDAR, quantum and more`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{indiumPhosphideRecords.length}</div>
            <p className="text-xs text-muted-foreground">InP wafer and device batches</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">&#8377;{totalInvestment.toLocaleString('en-IN')} Cr</div>
            <p className="text-xs text-muted-foreground">Across all manufacturers</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wafer Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{Object.keys(waferMap).length}</div>
            <p className="text-xs text-muted-foreground">Distinct InP device types</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delayed Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts['Delayed'] || 0}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 border-b pb-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === tab ? 'bg-amber-600 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-amber-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search indium phosphide shipments..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {activeTab === 'Registry' && (
          <div className="flex flex-wrap gap-2">
            {['status', 'priority', 'zone'].map(key => (
              <div key={key} className="flex flex-wrap gap-1">
                {[...new Set(indiumPhosphideRecords.map(r => String((r as unknown as Record<string, unknown>)[key] ?? '')))].map(v => (
                  <button
                    key={v}
                    onClick={() => toggleFilter(key, v)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${(filters[key] || []).includes(v) ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investment by City (&#8377; Cr)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(Object.entries(cityMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([city, val]) => (
                  <div key={city} className="flex items-center gap-3">
                    <span className="text-sm w-24 truncate text-right">{city}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                        style={{ width: `${Math.max((val / maxBarValue) * 100, 1)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">&#8377;{val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wafer Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(waferMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-100">
                    <span className="text-xs font-medium truncate mr-2">{type}</span>
                    <Badge variant="secondary" className="bg-amber-600 text-white shrink-0">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'Registry' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipment Registry ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-amber-50">
                    <th className="text-left p-3 font-medium">Batch</th>
                    <th className="text-left p-3 font-medium">City</th>
                    <th className="text-left p-3 font-medium">Manufacturer</th>
                    <th className="text-left p-3 font-medium">Wafer Type</th>
                    <th className="text-left p-3 font-medium">Application</th>
                    <th className="text-left p-3 font-medium">Dia (in)</th>
                    <th className="text-left p-3 font-medium">Bandgap (eV)</th>
                    <th className="text-left p-3 font-medium">Invest (&#8377; Cr)</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className={`border-b hover:bg-amber-50/50 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-3 font-mono text-xs">{r.batchNo}</td>
                      <td className="p-3">{r.city}</td>
                      <td className="p-3 truncate max-w-[140px]">{r.manufacturer}</td>
                      <td className="p-3 text-xs truncate max-w-[140px]">{r.waferType}</td>
                      <td className="p-3 truncate max-w-[160px]">{r.application}</td>
                      <td className="p-3 text-right">{r.waferDiameterInch}</td>
                      <td className="p-3 text-right">{r.bandgapEv}</td>
                      <td className="p-3 text-right font-medium">&#8377;{r.investmentCr}</td>
                      <td className="p-3"><Badge className={`${statusColorMap[r.status] || 'bg-gray-100'} text-xs`}>{r.status}</Badge></td>
                      <td className="p-3"><Badge variant="outline" className="text-xs">{r.priority}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'Analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status === 'Delivered' ? 'bg-green-500' : status === 'In Transit' ? 'bg-blue-500' : status === 'Processing' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <span className="text-sm">{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${status === 'Delivered' ? 'bg-green-500' : status === 'In Transit' ? 'bg-blue-500' : status === 'Processing' ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${(count / indiumPhosphideRecords.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wafer Diameter vs Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {indiumPhosphideRecords.sort((a, b) => b.investmentCr - a.investmentCr).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-xs w-28 truncate">{r.waferType}</span>
                    <div className="flex-1 flex gap-1 items-center">
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: `${(r.investmentCr / 350) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-20 text-right">&#8377;{r.investmentCr}Cr</span>
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{r.waferDiameterInch}&quot;</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(['Critical', 'High', 'Medium', 'Low'] as const).map(p => {
                  const count = indiumPhosphideRecords.filter(r => r.priority === p).length
                  return (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-sm">{p}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full bg-amber-500" style={{ width: `${(count / indiumPhosphideRecords.length) * 100}%` }} />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zone-wise Investment (&#8377; Cr)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(Object.entries(
                  indiumPhosphideRecords.reduce((s: Record<string, number>, r) => {
                    s[r.zone] = (s[r.zone] || 0) + r.investmentCr
                    return s
                  }, {})
                ) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (
                  <div key={zone} className="flex items-center gap-3">
                    <span className="text-sm w-16">{zone}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${(val / totalInvestment) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-20 text-right">&#8377;{val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'Insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">National Quantum Mission Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India&amp;apos;s &#8377;8,000Cr National Quantum Mission is creating unprecedented demand for InP quantum dot wafers. IIT Guwahati and TIFR are collaborating on single-photon sources emitting at telecom C-band (1550nm), essential for fiber-based quantum key distribution. The &#8377;25,000Cr quantum photonics market is projected to grow 45% CAGR through 2030, with InP as the foundation material.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">5G mmWave InP Monopoly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SCL Bengaluru remains India&amp;apos;s sole 6-inch InP semi-insulating wafer producer. With Jio and Airtel deploying 5G mmWave at 26-39GHz, demand for InP PAs is surging. Each 5G base station requires 16-64 InP PA modules. India targeting 1 million 5G sites by 2028, translating to &#8377;22,000Cr InP wafer demand. SCL capacity expansion from 20K to 80K wafers/year critical.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Automotive LiDAR InP Wave</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India&amp;apos;s ADAS mandate from Oct 2027 is driving 1550nm InP LiDAR adoption. Luminar JV Chennai targeting 500,000 units/year by 2028. InP laser diodes offer 3x detection range vs 905nm silicon alternatives. KPIT Pune supplying InP laser diode bars. The &#8377;16,800Cr market is attracting investment from Tata AutoComp and Motherson Sumi.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Delayed Shipments Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                INP-B2407 (InP waveguide epiwafer, Kolkata&#8594;Aurangabad) delayed 9 days due to CGCRI MOVPE reactor maintenance. INP-B2412 (InP THz detector, Bhubaneswar&#8594;Bhopal) delayed 12 days awaiting crystal quality certification from DRDO. Both shipments impacting STERLITE optical amplifier production and BHEL turbine inspection schedules. Total delayed value &#8377;254 Cr.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
