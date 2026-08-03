'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { RadioTower } from 'lucide-react'

interface GalliumArsenideRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  deviceType: string
  application: string
  waferDiameterInch: number
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

const gaasRecords: GalliumArsenideRecord[] = [
  { id: 'GAAS-0001', batchNo: 'GAAS-B2401', city: 'Bengaluru', manufacturer: 'SCL Bengaluru', deviceType: 'GaAs MMIC Power Amp', application: 'Active Phased Array TRM (BEL Uttam AESA)', waferDiameterInch: 6, frequencyGHz: 10, investmentCr: 320, status: 'Delivered', priority: 'Critical', origin: 'SCL Fab Bengaluru (KA)', destination: 'BEL AESA Div (KA)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: '6-inch GaAs MMIC X-band power amplifier for Uttam AESA TRM &#8594; 10GHz centre frequency with 15W output power &#8594; &#8377;320Cr for 18,000 MMIC chips &#8594; BEL delivering 150 Uttam radars for Tejas Mk1A &#8594; Each AESA array uses 2,400 TRM modules &#8594; GaAs MMIC 3x efficiency vs GaN at X-band cost &#8594; &#8377;24,500Cr Indian AESA GaAs MMIC demand' },
  { id: 'GAAS-0002', batchNo: 'GAAS-B2402', city: 'Hyderabad', manufacturer: 'IICT-CSIR Hyderabad', deviceType: 'GaAs HBT Epiwafer', application: '5G mmWave PA Module (Qualcomm India)', waferDiameterInch: 6, frequencyGHz: 39, investmentCr: 275, status: 'In Transit', priority: 'Critical', origin: 'IICT Hyderabad (TS)', destination: 'Qualcomm Hyderabad (TS)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'GaAs HBT epiwafer for 5G n258 (39GHz) mmWave PA &#8594; 39GHz with 38dBm output power per chain &#8594; &#8377;275Cr for 22,000 epiwafers &#8594; Jio and Airtel deploying 5G mmWave at 26-39GHz &#8594; GaAs HBT offers 60% PAE at mmWave vs 45% for SiGe &#8594; India producing 500,000 5G base stations by 2028 &#8594; &#8377;20,800Cr Indian 5G GaAs PA market' },
  { id: 'GAAS-0003', batchNo: 'GAAS-B2403', city: 'Chennai', manufacturer: 'ISRO VSSC', deviceType: 'GaAs Solar Cell (Triple Junction)', application: 'GSAT-N2 Solar Array (ISRO URSC)', waferDiameterInch: 4, frequencyGHz: 0, investmentCr: 290, status: 'Delivered', priority: 'Critical', origin: 'VSSC Thiruvananthapuram (KL)', destination: 'URSC Bengaluru (KA)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'GaInP/GaAs/Ge triple-junction solar cell for comsat &#8594; GaAs middle junction 1.42eV bandgap for maximum efficiency &#8594; &#8377;290Cr for 35,000 solar cells &#8594; ISRO launching 12 communication satellites by 2028 &#8594; GaAs triple-junction 32% efficiency vs 18% for Si at AM0 &#8594; Each GSAT-N2 needs 8,000 cells for 12kW array &#8594; &#8377;22,000Cr Indian space GaAs solar cell demand' },
  { id: 'GAAS-0004', batchNo: 'GAAS-B2404', city: 'Mumbai', manufacturer: 'Tata Electronics Mumbai', deviceType: 'GaAs PIN Photodiode', application: 'Fibre Optic Receiver (Tejas Networks)', waferDiameterInch: 4, frequencyGHz: 25, investmentCr: 185, status: 'In Transit', priority: 'High', origin: 'Tata Electronics Mumbai (MH)', destination: 'Tejas Networks Bengaluru (KA)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'GaAs PIN photodiode for 100Gbps coherent optical receiver &#8594; 25GHz bandwidth with -20dBm sensitivity at 1550nm &#8594; &#8377;185Cr for 12,000 detector chips &#8594; Tejas Networks India largest optical networking OEM &#8594; GaAs PIN 2x responsivity vs InGaAs at 850nm window &#8594; India deploying 2.5 million fibre connections/month &#8594; &#8377;14,200Cr Indian optical GaAs detector market' },
  { id: 'GAAS-0005', batchNo: 'GAAS-B2405', city: 'Pune', manufacturer: 'KPIT Technologies', deviceType: 'GaAs VCSEL Array', application: 'Automotive LiDAR Transmitter (Luminar JV)', waferDiameterInch: 4, frequencyGHz: 193, investmentCr: 210, status: 'Processing', priority: 'High', origin: 'KPIT R&amp;D Pune (MH)', destination: 'Luminar JV Chennai (TN)', shipDate: '2026-07-25', transitDays: 2, zone: 'West', remarks: 'GaAs 905nm VCSEL array for short-range automotive LiDAR &#8594; 193THz (905nm) with 100W peak power per array &#8594; &#8377;210Cr for 28,000 VCSEL arrays &#8594; Luminar JV targeting 500,000 LiDAR units/year &#8594; GaAs VCSEL 10x cheaper than InP for 905nm &#8594; ADAS mandate from Oct 2027 drives massive demand &#8594; &#8377;16,800Cr Indian automotive GaAs LiDAR market' },
  { id: 'GAAS-0006', batchNo: 'GAAS-B2406', city: 'Noida', manufacturer: 'Bharat Semi Noida', deviceType: 'GaAs MESFET Epiwafer', application: 'Satellite Ku-Band TWTA (NewSpace India)', waferDiameterInch: 4, frequencyGHz: 14, investmentCr: 242, status: 'Delivered', priority: 'Critical', origin: 'Bharat Semi Noida (UP)', destination: 'NSIL Bengaluru (KA)', shipDate: '2026-07-18', transitDays: 2, zone: 'North', remarks: 'GaAs MESFET for Ku-band satellite travelling wave tube amplifier &#8594; 14GHz uplink band with 6W linear power &#8594; &#8377;242Cr for 5,500 epiwafers &#8594; NSIL launching 18 GSAT/NSIL satellites by 2028 &#8594; GaAs MESFET pre-amplifier stage enables 60dB TWTA gain &#8594; India launching 100+ transponders annually &#8594; &#8377;18,500Cr Indian satcom GaAs device demand' },
  { id: 'GAAS-0007', batchNo: 'GAAS-B2407', city: 'Kolkata', manufacturer: 'CGCRI Kolkata', deviceType: 'GaAs-Based LED Epiwafer', application: 'Infrared Illuminator (BEL Defence)', waferDiameterInch: 6, frequencyGHz: 266, investmentCr: 128, status: 'Delayed', priority: 'High', origin: 'CGCRI Kolkata (WB)', destination: 'BEL Ghaziabad (UP)', shipDate: '2026-07-15', transitDays: 3, zone: 'East', remarks: 'GaAs-based 850nm IR LED for night vision illuminator array &#8594; 266THz (850nm) with 500mW optical power per LED &#8594; &#8377;128Cr for 8,000 LED epiwafers &#8594; BEL producing 15,000 night vision systems for Indian Army &#8594; GaAs IR LED 5x range vs GaN white LED with IR filter &#8594; Delayed 10 days due to MOCVD reactor maintenance &#8594; &#8377;9,800Cr Indian defence IR LED market' },
  { id: 'GAAS-0008', batchNo: 'GAAS-B2408', city: 'Ahmedabad', manufacturer: 'PRL Ahmedabad', deviceType: 'GaAs Avalanche Photodiode', application: 'Lidar Receiver (Drishti UAV)', waferDiameterInch: 3, frequencyGHz: 300, investmentCr: 165, status: 'In Transit', priority: 'High', origin: 'PRL Ahmedabad (GJ)', destination: 'Adani Defence Hyderabad (TS)', shipDate: '2026-07-23', transitDays: 2, zone: 'West', remarks: 'GaAs APD for UAV-based terrain mapping LiDAR receiver &#8594; 300THz (1000nm) with 250MHz gain bandwidth &#8594; &#8377;165Cr for 4,200 APD chips &#8594; Adani Drishti 40h endurance MALE UAV &#8594; GaAs APD 3x sensitivity vs Si APD at 1000nm &#8594; India deploying 200 military UAVs with LiDAR by 2028 &#8594; &#8377;13,500Cr Indian UAV GaAs LiDAR demand' },
  { id: 'GAAS-0009', batchNo: 'GAAS-B2409', city: 'Gandhinagar', manufacturer: 'IIT Gandhinagar', deviceType: 'GaAs pHEMT Epiwafer', application: 'Phased Array Element (DRDO AEW&amp;C)', waferDiameterInch: 6, frequencyGHz: 3, investmentCr: 355, status: 'Delivered', priority: 'Critical', origin: 'IITGN Materials Lab (GJ)', destination: 'DRDO LRDE Bengaluru (KA)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'GaAs pHEMT S-band transmit/receive module for AEW&amp;C radar &#8594; 3GHz with 20W pulsed output power &#8594; &#8377;355Cr for 6,000 T/R epiwafers &#8594; DRDO developing Netra Mk2 AEW&amp;C with 360&#176; coverage &#8594; GaAs pHEMT 5x yield at 3GHz vs GaN MMIC cost &#8594; DRDO targeting 3 AEW&amp;C aircraft by 2030 &#8594; &#8377;28,000Cr Indian AEW GaAs module market' },
  { id: 'GAAS-0010', batchNo: 'GAAS-B2410', city: 'Jaipur', manufacturer: 'MNIT Jaipur', deviceType: 'GaAs Radiation Detector', application: 'Nuclear Dosimeter (BARC Trombay)', waferDiameterInch: 3, frequencyGHz: 0, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'MNIT Jaipur (RJ)', destination: 'BARC Trombay Mumbai (MH)', shipDate: '2026-07-16', transitDays: 3, zone: 'North', remarks: 'GaAs single-crystal radiation detector for nuclear facility dosimetry &#8594; GaAs bandgap 1.42eV ideal for X-ray and gamma detection &#8594; &#8377;95Cr for 2,800 detector wafers &#8594; BARC operating 22 nuclear reactors and 6 fuel fabrication plants &#8594; GaAs detector operates at room temperature vs Ge requiring LN2 &#8594; India installing 1,500 radiation monitoring stations &#8594; &#8377;7,200Cr Indian nuclear GaAs detector market' },
  { id: 'GAAS-0011', batchNo: 'GAAS-B2411', city: 'Coimbatore', manufacturer: 'PSG Tech Coimbatore', deviceType: 'GaAs Schottky Diode', application: 'Millimeter-Wave Mixer (ISRO SAC)', waferDiameterInch: 2, frequencyGHz: 77, investmentCr: 115, status: 'In Transit', priority: 'Medium', origin: 'PSG Tech Coimbatore (TN)', destination: 'ISRO SAC Ahmedabad (GJ)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: 'GaAs Schottky diode for 77GHz cloud profiling radar mixer &#8594; 77GHz W-band with 6dB conversion loss &#8594; &#8377;115Cr for 3,500 mixer chips &#8594; ISRO launching Megha-Tropics Mk2 with Ka-W band radar &#8594; GaAs Schottky 2x bandwidth vs Si Ge mixer diode &#8594; Cloud profiling radar for monsoon prediction accuracy &#8594; &#8377;8,800Cr Indian space mmWave GaAs market' },
  { id: 'GAAS-0012', batchNo: 'GAAS-B2412', city: 'Bhubaneswar', manufacturer: 'IICT Bhubaneswar', deviceType: 'GaAs Infrared LED (940nm)', application: 'Biometric Face Scanner (IDEA India)', waferDiameterInch: 4, frequencyGHz: 319, investmentCr: 78, status: 'Processing', priority: 'Medium', origin: 'IICT Bhubaneswar (OD)', destination: 'IDEA Delhi (DL)', shipDate: '2026-07-26', transitDays: 3, zone: 'East', remarks: 'GaAs 940nm IR LED for Aadhaar biometric face recognition &#8594; 319THz (940nm) eye-safe wavelength &#8594; &#8377;78Cr for 5.5 million LED chips &#8594; India 1.4 billion Aadhaar biometric verifications/year &#8594; GaAs 940nm invisible to human eye with 40% wall-plug efficiency &#8594; 1.3 million Aadhaar centres deploying face authentication &#8594; &#8377;5,800Cr Indian biometric GaAs IR LED market' },
  { id: 'GAAS-0013', batchNo: 'GAAS-B2413', city: 'Guwahati', manufacturer: 'IIT Guwahati', deviceType: 'GaAs THz Quantum Cascade', application: 'Security Scanner (BEL Security)', waferDiameterInch: 2, frequencyGHz: 1500, investmentCr: 195, status: 'Delayed', priority: 'High', origin: 'IITG Quantum Lab (AS)', destination: 'BEL Bengaluru (KA)', shipDate: '2026-07-13', transitDays: 4, zone: 'East', remarks: 'GaAs-based THz quantum cascade emitter for airport body scanner &#8594; 1.5THz emission at 200um wavelength &#8594; &#8377;195Cr for 850 emitter chips &#8594; BEL developing next-gen airport security for 100 airports &#8594; GaAs QCL penetrates clothing without ionizing radiation &#8594; Delayed 12 days due to MBE growth chamber vacuum issue &#8594; &#8377;15,200Cr Indian THz security GaAs market' },
  { id: 'GAAS-0014', batchNo: 'GAAS-B2414', city: 'Lucknow', manufacturer: 'DRDO IRDE', deviceType: 'GaAs Thermal Imager FPA', application: 'Tank Thermal Sight (DRDO CVRDE)', waferDiameterInch: 4, frequencyGHz: 300, investmentCr: 268, status: 'Processing', priority: 'Critical', origin: 'DRDO IRDE Lucknow (UP)', destination: 'DRDO CVRDE Chennai (TN)', shipDate: '2026-07-27', transitDays: 3, zone: 'North', remarks: 'GaAs-based QWIP thermal focal plane array for Arjun Mk2 tank sight &#8594; 300THz (8-12um) with NETD &lt;50mK &#8594; &#8377;268Cr for 6,500 FPA modules &#8594; Indian Army inducting 500 Arjun Mk2 main battle tanks &#8594; GaAs QWIP 2x sensitivity vs VOx microbolometer at same cost &#8594; DRDO CVRDE developing indigenous thermal imaging &#8594; &#8377;21,000Cr Indian defence thermal GaAs FPA market' },
]

const tabs = ['Dashboard', 'Registry', 'Analytics', 'Insights'] as const
type TabType = typeof tabs[number]

export default function GalliumArsenideLogisticsView() {
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
    return gaasRecords.filter(r => {
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
    gaasRecords.reduce((s: number, r) => s + r.investmentCr, 0), [])

  const cityMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of gaasRecords) {
      map[r.city] = (map[r.city] || 0) + r.investmentCr
    }
    return map
  }, [])

  const deviceMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of gaasRecords) {
      map[r.deviceType] = (map[r.deviceType] || 0) + 1
    }
    return map
  }, [])

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of gaasRecords) {
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
        title="Gallium Arsenide RF &amp; Photonics Logistics"
        description={`India GaAs semiconductor supply chain &#8594; ${gaasRecords.length} shipments &#8594; ${totalInvestment.toLocaleString('en-IN')} Cr total investment &#8594; AESA radar, 5G mmWave, space solar, LiDAR and more`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{gaasRecords.length}</div>
            <p className="text-xs text-muted-foreground">GaAs device batches tracked</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">&#8377;{totalInvestment.toLocaleString('en-IN')} Cr</div>
            <p className="text-xs text-muted-foreground">Across all manufacturers</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{Object.keys(deviceMap).length}</div>
            <p className="text-xs text-muted-foreground">Distinct GaAs devices</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600">
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
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${activeTab === tab ? 'bg-purple-600 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-purple-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search gallium arsenide shipments..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        {activeTab === 'Registry' && (
          <div className="flex flex-wrap gap-2">
            {['status', 'priority', 'zone'].map(key => (
              <div key={key} className="flex flex-wrap gap-1">
                {[...new Set(gaasRecords.map(r => String((r as unknown as Record<string, unknown>)[key] ?? '')))].map(v => (
                  <button
                    key={v}
                    onClick={() => toggleFilter(key, v)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${(filters[key] || []).includes(v) ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'}`}
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
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-600 transition-all duration-500"
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
              <CardTitle className="text-lg">Device Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(deviceMap) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-100">
                    <span className="text-xs font-medium truncate mr-2">{device}</span>
                    <Badge variant="secondary" className="bg-purple-600 text-white shrink-0">{count}</Badge>
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
                  <tr className="border-b bg-purple-50">
                    <th className="text-left p-3 font-medium">Batch</th>
                    <th className="text-left p-3 font-medium">City</th>
                    <th className="text-left p-3 font-medium">Manufacturer</th>
                    <th className="text-left p-3 font-medium">Device Type</th>
                    <th className="text-left p-3 font-medium">Application</th>
                    <th className="text-left p-3 font-medium">Dia (in)</th>
                    <th className="text-left p-3 font-medium">Freq (GHz)</th>
                    <th className="text-left p-3 font-medium">Invest (&#8377; Cr)</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className={`border-b hover:bg-purple-50/50 transition-colors ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                      <td className="p-3 font-mono text-xs">{r.batchNo}</td>
                      <td className="p-3">{r.city}</td>
                      <td className="p-3 truncate max-w-[140px]">{r.manufacturer}</td>
                      <td className="p-3 text-xs truncate max-w-[140px]">{r.deviceType}</td>
                      <td className="p-3 truncate max-w-[160px]">{r.application}</td>
                      <td className="p-3 text-right">{r.waferDiameterInch}</td>
                      <td className="p-3 text-right">{r.frequencyGHz.toLocaleString()}</td>
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
                          style={{ width: `${(count / gaasRecords.length) * 100}%` }}
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
              <CardTitle className="text-lg">Frequency Band vs Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gaasRecords.filter(r => r.frequencyGHz > 0).sort((a, b) => b.frequencyGHz - a.frequencyGHz).slice(0, 8).map(r => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-xs w-28 truncate">{r.deviceType}</span>
                    <div className="flex-1 flex gap-1 items-center">
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.min((r.frequencyGHz / 1600) * 100, 100)}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-20 text-right">{r.frequencyGHz.toLocaleString()}GHz</span>
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">&#8377;{r.investmentCr}</span>
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
                  const count = gaasRecords.filter(r => r.priority === p).length
                  return (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-sm">{p}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full bg-purple-500" style={{ width: `${(count / gaasRecords.length) * 100}%` }} />
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
                  gaasRecords.reduce((s: Record<string, number>, r) => {
                    s[r.zone] = (s[r.zone] || 0) + r.investmentCr
                    return s
                  }, {})
                ) as [string, number][]).sort((a, b) => b[1] - a[1]).map(([zone, val]) => (
                  <div key={zone} className="flex items-center gap-3">
                    <span className="text-sm w-16">{zone}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-violet-500" style={{ width: `${(val / totalInvestment) * 100}%` }} />
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
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader>
              <CardTitle className="text-base font-semibold">AESA Radar GaAs Dominance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India&amp;apos;s fighter radar programme drives the largest GaAs MMIC demand. BEL Uttam AESA for 150 Tejas Mk1A requires 360,000 X-band GaAs MMIC chips worth &#8377;24,500 Cr. DRDO Netra Mk2 AEW&amp;C adds another &#8377;28,000 Cr in S-band pHEMT modules. GaAs remains the cost-efficiency king at X/S-band — 3x cheaper than GaN at same performance. SCL Bengaluru is India&amp;apos;s sole 6-inch GaAs fab, operating at 80% capacity.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader>
              <CardTitle className="text-base font-semibold">5G mmWave GaAs HBT Wave</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                India&amp;apos;s 5G mmWave rollout at 26-39GHz creates &#8377;20,800 Cr GaAs HBT PA demand. Qualcomm India and Jio are the primary drivers — each 5G mmWave base station uses 64 GaAs HBT PA chains. GaAs HBT achieves 60% PAE at 39GHz, outperforming SiGe BiCMOS by 15 percentage points. IICT-CSIR Hyderabad developing 6-inch GaAs HBT epiwafer capability for import substitution by 2028.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Space Solar Cell Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ISRO&amp;apos;s GaInP/GaAs/Ge triple-junction solar cell programme for GSAT-N2 and Gaganyaan represents &#8377;22,000 Cr demand. GaAs middle junction at 1.42eV bandgap achieves 32% AM0 efficiency — nearly 2x silicon. ISRO VSSC and IIT Gandhinagar collaborating on 6-inch GaAs solar cell production. India targeting 50% indigenous space solar cell production by 2030.
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Delayed Shipments Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                GAAS-B2407 (850nm IR LED epiwafer, Kolkata&#8594;Ghaziabad) delayed 10 days due to CGCRI MOCVD reactor maintenance. GAAS-B2413 (THz quantum cascade, Guwahati&#8594;Bengaluru) delayed 12 days due to MBE growth chamber vacuum system failure. Both shipments impacting BEL night vision and airport security scanner production schedules. Total delayed value &#8377;323 Cr. Spare parts ordered from Japan, ETA 5 days.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
