'use client'
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Syringe } from 'lucide-react'

interface VaccineColdChainRecord {
  id: string
  batchNo: string
  city: string
  manufacturer: string
  vaccineName: string
  storageTempC: number
  doseType: string
  volumeDoses: number
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

const vaccineRecords: VaccineColdChainRecord[] = [
  { id: 'VCC-0001', batchNo: 'VCC-B2401', city: 'Pune', manufacturer: 'Serum Institute', vaccineName: 'Covishield (Oxford-AZ)', storageTempC: 2, doseType: '2-Dose', volumeDoses: 500000, investmentCr: 95, status: 'In Transit', priority: 'Critical', origin: 'Serum Pune (MH)', destination: 'GoI Warehouse Delhi (DL)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'Serum Institute Covishield 500K doses in cold chain 2-8&#176;C &#8594; &#8377;95Cr refrigerated truck fleet &#8594; passive cooling containers with PCM phase-change material &#8594; GPS temperature logger continuous monitoring &#8594; serum world&apos;s largest vaccine manufacturer 1.5B doses/year &#8594; supplying 170 countries through COVAX &#8594; GoI central procurement for UIP 27 crore annual doses' },
  { id: 'VCC-0002', batchNo: 'VCC-B2402', city: 'Hyderabad', manufacturer: 'Bharat Biotech', vaccineName: 'Covaxin (Inactivated)', storageTempC: 2, doseType: '2-Dose', volumeDoses: 300000, investmentCr: 68, status: 'Delivered', priority: 'High', origin: 'BBIL Genome Valley (TS)', destination: 'State Vaccine Store Chennai (TN)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'Bharat Biotech Covaxin whole-virion inactivated 300K doses &#8594; 2-8&#176;C cold chain &#8594; &#8377;68Cr for TN state procurement &#8594; multi-dose vials 5 doses each &#8594; BBIL expanding to 200M doses/year capacity &#8594; WHO prequalified for global distribution &#8594; Phase 4 booster study ongoing &#8594; nasal variant intranasal Covaxin in Phase 3 trials' },
  { id: 'VCC-0003', batchNo: 'VCC-B2403', city: 'Ahmedabad', manufacturer: 'Zydus Cadila', vaccineName: 'ZyCoV-D (DNA Plasmid)', storageTempC: 2, doseType: '3-Dose', volumeDoses: 200000, investmentCr: 55, status: 'In Transit', priority: 'High', origin: 'Zydus Ahmedabad (GJ)', destination: 'PHED Jaipur (RJ)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: 'Zydus Cadila ZyCoV-D world&apos;s first DNA plasmid vaccine &#8594; 200K doses for Rajasthan immunization &#8594; &#8377;55Cr &#8594; intradermal needle-free PharmaJet injector &#8594; 3-dose schedule 0-28-56 days &#8594; stable at 2-8&#176;C for 6 months &#8594; Zydus scaling to 50M doses/year &#8594; phase 2/3 pediatric trial approved &#8594; needle-free administration reduces needle-stick injuries' },
  { id: 'VCC-0004', batchNo: 'VCC-B2404', city: 'Bengaluru', manufacturer: 'BioE', vaccineName: 'Corbevax (RBD Protein)', storageTempC: 2, doseType: '2-Dose', volumeDoses: 250000, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'BioE Bengaluru (KA)', destination: 'PHED Lucknow (UP)', shipDate: '2026-07-16', transitDays: 2, zone: 'South', remarks: 'Biological E Corbevax recombinant RBD protein subunit 250K doses &#8594; &#8377;42Cr for UP state UIP &#8594; thyrocyanate adjuvant from Vaxine Australia &#8594; 2-8&#176;C stable 12 months &#8594; easy to manufacture using existing yeast expression &#8594; BioE licensed from BCM and Dynavax &#8594; 100M doses/year capacity &#8594; WHO prequalified &#8594; exported to Indonesia and Nigeria under COVAX' },
  { id: 'VCC-0005', batchNo: 'VCC-B2405', city: 'New Delhi', manufacturer: 'DBT-ICMR', vaccineName: 'BCG (Tuberculosis)', storageTempC: 2, doseType: '1-Dose', volumeDoses: 800000, investmentCr: 28, status: 'In Transit', priority: 'High', origin: 'BCG Lab Chennai (TN)', destination: 'GoI Cold Store Delhi (DL)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'ICMR BCG vaccine 800K doses for national neonatal immunization &#8594; freeze-dried lyophilized storage 2-8&#176;C &#8594; &#8377;28Cr &#8594; 1-dose at birth mandatory under UIP &#8594; BCG Lab Chennai sole Indian producer &#8594; 120M doses/year &#8594; new BCG Danish 1331 strain replacing Tokyo strain &#8594; DCGI approved strain change &#8594; supplying 15 million neonates annually' },
  { id: 'VCC-0006', batchNo: 'VCC-B2406', city: 'Chennai', manufacturer: 'Chiron Panacea', vaccineName: 'OPV (Polio)', storageTempC: -20, doseType: '3-Dose', volumeDoses: 1200000, investmentCr: 35, status: 'Delayed', priority: 'Critical', origin: 'Panacea Baddi (HP)', destination: 'State PH Kochi (KL)', shipDate: '2026-07-12', transitDays: 6, zone: 'South', remarks: 'Oral polio vaccine 1.2M doses at -20&#176;C frozen &#8594; &#8377;35Cr &#8594; 6-day delay: reefer truck compressor failure on Mumbai-Pune expressway &#8594; 4 hours above -15&#176;C threshold requiring stability review &#8594; Kerala pulse polio round delayed by 1 week &#8594; backup stock airlifted from ICMR Delhi &#8594; WHO India reviewing cold chain breach protocol &#8594; Panacea replacing truck fleet with dual-compressor units' },
  { id: 'VCC-0007', batchNo: 'VCC-B2407', city: 'Mumbai', manufacturer: 'Haffkine BioPharma', vaccineName: 'rDNA Hepatitis B', storageTempC: 2, doseType: '3-Dose', volumeDoses: 400000, investmentCr: 52, status: 'Processing', priority: 'High', origin: 'Haffkine Mumbai (MH)', destination: 'State EPI Kolkata (WB)', shipDate: '2026-07-25', transitDays: 3, zone: 'West', remarks: 'Haffkine recombinant DNA Hepatitis B vaccine 400K doses &#8594; 2-8&#176;C &#8594; &#8377;52Cr for West Bengal school immunization &#8594; PLGA nanoparticle adjuvant from Haffkine R&D &#8594; 3-dose 0-1-6 month schedule &#8594; Haffkine 139-year-old institution &#8594; 60M doses/year &#8594; supplying 22 states &#8594; GoI expanding Hep-B birth dose to all states &#8594; targeting 90% coverage by 2027' },
  { id: 'VCC-0008', batchNo: 'VCC-B2408', city: 'Bhubaneswar', manufacturer: 'Bharat Biotech', vaccineName: 'Rotavac (Rotavirus)', storageTempC: 2, doseType: '3-Dose', volumeDoses: 350000, investmentCr: 45, status: 'In Transit', priority: 'High', origin: 'BBIL Hyderabad (TS)', destination: 'State PH Bhubaneswar (OD)', shipDate: '2026-07-19', transitDays: 1, zone: 'East', remarks: 'Bharat Biotech Rotavac pentavalent rotavirus vaccine 350K doses &#8594; 2-8&#176;C &#8594; &#8377;45Cr for Odisha UIP &#8594; 3 oral drops at 6-10-14 weeks &#8594; India-developed 116E strain &#8594; BBIL only Indian rotavirus vaccine &#8594; 100M doses/year &#8594; WHO prequalified &#8594; 40% reduction in rotavirus hospitalization in immunized districts &#8594; Bhargava committee recommending expansion to all 36 states' },
  { id: 'VCC-0009', batchNo: 'VCC-B2409', city: 'Gandhinagar', manufacturer: 'Cadila Healthcare', vaccineName: 'HPV (Cervical Cancer)', storageTempC: 2, doseType: '3-Dose', volumeDoses: 150000, investmentCr: 85, status: 'Delivered', priority: 'Critical', origin: 'Zydus Moraiya (GJ)', destination: 'State EPI Bengaluru (KA)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Zydus Cadila HPV vaccine Cervavac for cervical cancer prevention &#8594; 150K doses for Karnataka school program &#8594; &#8377;85Cr &#8594; L1 VLP from HPV 16/18 produced in Pichia pastoris &#8594; 2-8&#176;C stable 24 months &#8594; India&apos;s first indigenous HPV vaccine &#8594; 3-dose for girls 9-14 years &#8594; GoI launching national HPV campaign &#8594; targeting 7.5 crore girls &#8594; Zydus scaling to 20M doses/year at &#8377;2,200Cr plant' },
  { id: 'VCC-0010', batchNo: 'VCC-B2410', city: 'Guwahati', manufacturer: 'BBIL-Kolkata JV', vaccineName: 'Japanese Encephalitis', storageTempC: 2, doseType: '2-Dose', volumeDoses: 250000, investmentCr: 32, status: 'In Transit', priority: 'High', origin: 'BCG Lab Kolkata (WB)', destination: 'State PH Guwahati (AS)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: 'Japanese Encephalitis live attenuated SA-14-14-2 vaccine 250K doses &#8594; &#8377;32Cr for Assam JE endemic districts &#8594; 2-8&#176;C &#8594; single dose for children 1-15 years &#8594; ICMR Kolkata producing 50M doses/year &#8594; monsoon season vaccination campaign &#8594; Assam reporting 200+ JE cases annually &#8594; GoI expanding to 171 endemic districts in 16 states &#8594; &#8377;450Cr national JE program' },
  { id: 'VCC-0011', batchNo: 'VCC-B2411', city: 'Kolkata', manufacturer: 'ICMR-Kolkata', vaccineName: 'DTP (Triple Antigen)', storageTempC: 2, doseType: '5-Dose', volumeDoses: 600000, investmentCr: 22, status: 'Delivered', priority: 'Medium', origin: 'Pankaj Pharma Indore (MP)', destination: 'State PH Kolkata (WB)', shipDate: '2026-07-17', transitDays: 3, zone: 'East', remarks: 'DPT whole-cell pertussis triple antigen 600K doses &#8594; 2-8&#176;C &#8594; &#8377;22Cr &#8594; 5-dose schedule 6-10-14 weeks + boosters &#8594; Pankaj Pharma one of 5 Indian DPT producers &#8594; GoI procuring 180M doses/year &#8594; phasing in DTaP acellular replacement &#8594; reduced reactogenicity &#8594; BBIL developing indigenous DTaP &#8594; targeting 2028 launch &#8594; UIP backbone vaccine' },
  { id: 'VCC-0012', batchNo: 'VCC-B2412', city: 'Thiruvananthapuram', manufacturer: 'Bharat Biotech', vaccineName: 'mRNA COVID Booster', storageTempC: -20, doseType: '1-Dose', volumeDoses: 100000, investmentCr: 75, status: 'Processing', priority: 'Medium', origin: 'BBIL Genome Valley (TS)', destination: 'State PH Thiruvananthapuram (KL)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: 'Bharat Biotech mRNA COVID-19 booster 100K doses &#8594; -20&#176;C frozen storage &#8594; &#8377;75Cr &#8594; mRNA platform adapted from Gennova Biopharma license &#8594; single-dose booster for healthcare workers &#8594; lipid nanoparticle encapsulation &#8594; stable at -20&#176;C for 6 months &#8594; BBIL scaling mRNA facility to 100M doses/year &#8594; pan-coronavirus variant pipeline &#8594; DCGI EUA for booster dose &#8594; exported to Myanmar and Nepal' },
  { id: 'VCC-0013', batchNo: 'VCC-B2413', city: 'Bhopal', manufacturer: 'Bio-Med Mumbai', vaccineName: 'Measles-Rubella', storageTempC: 2, doseType: '2-Dose', volumeDoses: 450000, investmentCr: 18, status: 'In Transit', priority: 'High', origin: 'Bio-Med Mumbai (MH)', destination: 'State PH Bhopal (MP)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: 'Bio-Med Measles-Rubella combined vaccine 450K doses &#8594; 2-8&#176;C &#8594; &#8377;18Cr &#8594; MR campaign for children 9 months - 15 years &#8594; lyophilized with diluent reconstitution &#8594; Bio-Med India largest vaccine exporter &#8594; 300M doses/year measles vaccine &#8594; India MR elimination target 2027 &#8594; GoI MR campaign covered 32 crore children &#8594; second dose introduced in UIP 2024' },
  { id: 'VCC-0014', batchNo: 'VCC-B2414', city: 'Srinagar', manufacturer: 'Serum Institute', vaccineName: 'PCV13 (Pneumococcal)', storageTempC: 2, doseType: '3-Dose', volumeDoses: 180000, investmentCr: 92, status: 'Delayed', priority: 'Critical', origin: 'Serum Pune (MH)', destination: 'State PH Srinagar (JK)', shipDate: '2026-07-09', transitDays: 8, zone: 'North', remarks: 'Serum Institute PCV13 pneumococcal conjugate vaccine 180K doses for J&amp;K cold chain &#8594; 2-8&#176;C &#8594; &#8377;92Cr &#8594; 8-day delay: Srinagar highway blocked by landslide at Ramban &#8594; 14-hour detour via Mughal Road added 2 days &#8594; PCV13 under UIP expansion to all states &#8594; 3-dose schedule 6-14-36 weeks &#8594; reducing pneumonia mortality 40% in under-5 children &#8594; Serum sole Indian PCV producer &#8594; &#8377;450Cr annual PCV supply &#8594; GoI ordering 100M doses for 2027 campaign' },
]

const filters = [
  { label: 'Vaccine Name', key: 'vaccineName', options: ['Covishield', 'Covaxin', 'ZyCoV-D', 'Corbevax', 'BCG', 'OPV', 'rDNA Hepatitis B', 'Rotavac', 'HPV', 'Japanese Encephalitis', 'DTP', 'mRNA COVID', 'Measles-Rubella', 'PCV13'] },
  { label: 'Storage Temp', key: 'storageTempC', options: ['-20', '2'] },
  { label: 'Zone', key: 'zone', options: ['North', 'South', 'East', 'West'] },
  { label: 'Status', key: 'status', options: ['In Transit', 'Delivered', 'Processing', 'Delayed'] },
]

export default function VaccineColdChainLogisticsView() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registry' | 'analytics' | 'insights'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[key] || []
      if (current.includes(value)) {
        const next = current.filter(v => v !== value)
        if (next.length === 0) { const { [key]: _, ...rest } = prev; return rest }
        return { ...prev, [key]: next }
      }
      return { ...prev, [key]: [...current, value] }
    })
  }

  const filteredRecords = useMemo(() => {
    return vaccineRecords.filter(r => {
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.vaccineName} ${r.manufacturer} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false
      for (const [key, values] of Object.entries(activeFilters)) {
        if (values.length > 0 && !values.includes(String(r[key as keyof VaccineColdChainRecord]))) return false
      }
      return true
    })
  }, [searchQuery, activeFilters])

  const kpis = useMemo(() => {
    const total = vaccineRecords.length
    const totalDoses = vaccineRecords.reduce((s: number, r) => s + r.volumeDoses, 0)
    const totalInvestment = vaccineRecords.reduce((s: number, r) => s + r.investmentCr, 0)
    const delayed = vaccineRecords.filter(r => r.status === 'Delayed').length
    return [
      { label: 'Total Batches', value: total, suffix: ' shipments', color: 'text-rose-700' },
      { label: 'Total Doses', value: `${(totalDoses / 1000000).toFixed(1)}M`, suffix: ' doses', color: 'text-rose-700' },
      { label: 'Total Investment', value: `${(totalInvestment / 1000).toFixed(1)}K`, suffix: ' Cr', color: 'text-rose-700' },
      { label: 'Delayed', value: delayed, suffix: ' batches', color: 'text-red-600' },
    ]
  }, [])

  const vaccineDistribution = useMemo(() => {
    const map = new Map<string, number>()
    vaccineRecords.forEach(r => { map.set(r.vaccineName.split('(')[0].trim(), (map.get(r.vaccineName.split('(')[0].trim()) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const tempDistribution = useMemo(() => {
    const map = new Map<string, number>()
    vaccineRecords.forEach(r => { const k = `${r.storageTempC}&#176;C`; map.set(k, (map.get(k) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>()
    vaccineRecords.forEach(r => { map.set(r.zone, (map.get(r.zone) || 0) + 1) })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [])

  const dosesByVaccine = useMemo(() => {
    const map: Record<string, number> = {}
    vaccineRecords.forEach(r => { const k = r.vaccineName.split('(')[0].trim(); map[k] = (map[k] || 0) + r.volumeDoses })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [])

  const investmentByZone = useMemo(() => {
    const map: Record<string, number> = {}
    vaccineRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.investmentCr })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>()
    vaccineRecords.forEach(r => { map.set(r.status, (map.get(r.status) || 0) + 1) })
    return Array.from(map.entries())
  }, [])

  const dosesByZone = useMemo(() => {
    const map: Record<string, number> = {}
    vaccineRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.volumeDoses })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const transitByZone = useMemo(() => {
    const map: Record<string, number> = {}
    const cnt: Record<string, number> = {}
    vaccineRecords.forEach(r => { map[r.zone] = (map[r.zone] || 0) + r.transitDays; cnt[r.zone] = (cnt[r.zone] || 0) + 1 })
    return (Object.entries(map) as [string, number][]).map(([k, v]) => [k, Math.round(v / cnt[k])] as [string, number]).sort((a, b) => b[1] - a[1])
  }, [])

  const tabs = ['dashboard', 'registry', 'analytics', 'insights'] as const

  return (
    <div className="space-y-4 p-4">
      <PageHeader title="Vaccine Cold Chain Logistics" description="Indian vaccine supply chain &#8212; COVID-19, BCG, OPV, Hepatitis B, Rotavirus, HPV, JE, MR, PCV cold chain distribution across UIP states with temperature monitoring" />

      <div className="flex gap-2 border-b pb-2">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm rounded-t-lg capitalize vcc-tab-btn ${activeTab === tab ? 'bg-rose-700 text-white vcc-tab-active' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map(kpi => <Card key={kpi.label} className="vcc-kpi-card border-l-4 border-l-rose-600"><CardContent className="p-3"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}<span className="text-xs font-normal ml-1">{kpi.suffix}</span></p></CardContent></Card>)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="vcc-chart-card"><CardHeader><CardTitle className="text-sm">Shipments by Vaccine Type</CardTitle></CardHeader><CardContent className="space-y-2">{vaccineDistribution.map(([vaccine, count]) => <div key={vaccine} className="flex items-center gap-2"><span className="text-xs w-28 truncate">{vaccine}</span><div className="flex-1 bg-rose-50 rounded-full h-2"><div className="bg-rose-600 h-2 rounded-full vcc-bar" style={{ width: `${(count / 2) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
            <Card className="vcc-chart-card"><CardHeader><CardTitle className="text-sm">Doses by Zone (millions)</CardTitle></CardHeader><CardContent className="space-y-2">{dosesByZone.map(([zone, doses]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-rose-50 rounded-full h-2"><div className="bg-rose-500 h-2 rounded-full vcc-bar" style={{ width: `${(doses / 2000000) * 100}%` }}></div></div><span className="text-xs font-medium">{(doses / 1000000).toFixed(1)}M</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Input placeholder="Search ID, batch, vaccine, manufacturer..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 text-sm vcc-search-input" />
            {filters.map(f => (
              <div key={f.key} className="flex gap-1 flex-wrap vcc-filter-group">
                {f.options.slice(0, 4).map(opt => (
                  <Badge key={opt} variant={activeFilters[f.key]?.includes(opt) ? 'default' : 'outline'} className="cursor-pointer text-xs vcc-filter-badge" onClick={() => toggleFilter(f.key, opt)}>{opt}</Badge>
                ))}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto vcc-table-wrap">
            <table className="w-full text-xs vcc-data-table">
              <thead><tr className="border-b vcc-table-header"><th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Manufacturer</th><th className="px-2 py-2 text-left">Vaccine</th><th className="px-2 py-2 text-right">Temp</th><th className="px-2 py-2 text-right">Doses</th><th className="px-2 py-2 text-right">Invest</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-right">Days</th></tr></thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r.id} className={`border-b vcc-table-row ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-rose-500'}`}>
                    <td className="px-2 py-2 font-mono">{r.id}</td>
                    <td className="px-2 py-2">{r.batchNo}</td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.manufacturer.split(' ')[0]}</td>
                    <td className="px-2 py-2 truncate max-w-[120px]">{r.vaccineName.split('(')[0].trim()}</td>
                    <td className="px-2 py-2 text-right font-medium">{r.storageTempC}&#176;C</td>
                    <td className="px-2 py-2 text-right">{(r.volumeDoses / 1000).toFixed(0)}K</td>
                    <td className="px-2 py-2 text-right">{r.investmentCr}</td>
                    <td className="px-2 py-2"><Badge variant={r.status === 'Delayed' ? 'destructive' : r.status === 'Delivered' ? 'default' : 'secondary'} className="text-xs vcc-status-badge">{r.status}</Badge></td>
                    <td className="px-2 py-2 truncate max-w-[100px]">{r.origin.split('(')[0].trim().split(' ').slice(-1)[0]} &#8594; {r.destination.split('(')[0].trim().split(' ').slice(-1)[0]}</td>
                    <td className="px-2 py-2 text-right">{r.transitDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="vcc-chart-card"><CardHeader><CardTitle className="text-sm">Status Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{statusBreakdown.map(([s, c]) => <div key={s} className="flex items-center gap-2"><span className="text-xs w-20">{s}</span><div className="flex-1 bg-rose-50 rounded-full h-2"><div className={`h-2 rounded-full vcc-bar ${s === 'Delayed' ? 'bg-red-500' : s === 'Delivered' ? 'bg-green-500' : s === 'In Transit' ? 'bg-blue-500' : 'bg-yellow-500'}`} style={{ width: `${(c / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{c}</span></div>)}</CardContent></Card>
            <Card className="vcc-chart-card"><CardHeader><CardTitle className="text-sm">Storage Temperature Split</CardTitle></CardHeader><CardContent className="space-y-2">{tempDistribution.map(([temp, count]) => <div key={temp} className="flex items-center gap-2"><span className="text-xs w-16">{temp}</span><div className="flex-1 bg-rose-50 rounded-full h-2"><div className="bg-rose-600 h-2 rounded-full vcc-bar" style={{ width: `${(count / 14) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="vcc-chart-card"><CardHeader><CardTitle className="text-sm">Doses by Vaccine Type</CardTitle></CardHeader><CardContent className="space-y-2">{dosesByVaccine.map(([vaccine, doses]) => <div key={vaccine} className="flex items-center gap-2"><span className="text-xs w-28 truncate">{vaccine}</span><div className="flex-1 bg-rose-50 rounded-full h-2"><div className="bg-rose-700 h-2 rounded-full vcc-bar" style={{ width: `${(doses / 1200000) * 100}%` }}></div></div><span className="text-xs font-medium">{(doses / 1000).toFixed(0)}K</span></div>)}</CardContent></Card>
          <Card className="vcc-chart-card"><CardHeader><CardTitle className="text-sm">Investment by Zone (&#8377; Cr)</CardTitle></CardHeader><CardContent className="space-y-2">{investmentByZone.map(([zone, inv]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-rose-50 rounded-full h-2"><div className="bg-rose-500 h-2 rounded-full vcc-bar" style={{ width: `${(inv / 600) * 100}%` }}></div></div><span className="text-xs font-medium">{inv}</span></div>)}</CardContent></Card>
          <Card className="vcc-chart-card"><CardHeader><CardTitle className="text-sm">Avg Transit Days by Zone</CardTitle></CardHeader><CardContent className="space-y-2">{transitByZone.map(([zone, days]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-rose-50 rounded-full h-2"><div className="bg-rose-600 h-2 rounded-full vcc-bar" style={{ width: `${(days / 8) * 100}%` }}></div></div><span className="text-xs font-medium">{days}d</span></div>)}</CardContent></Card>
          <Card className="vcc-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent className="space-y-2">{zoneDistribution.map(([zone, count]) => <div key={zone} className="flex items-center gap-2"><span className="text-xs w-16">{zone}</span><div className="flex-1 bg-rose-50 rounded-full h-2"><div className="bg-rose-400 h-2 rounded-full vcc-bar" style={{ width: `${(count / 5) * 100}%` }}></div></div><span className="text-xs font-medium">{count}</span></div>)}</CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="vcc-insight-card border-l-4 border-l-rose-700"><CardHeader><CardTitle className="text-sm text-rose-800">India&apos;s Cold Chain: 5.8 Billion Doses Annually</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Universal Immunization Programme (UIP) distributes 5.8 billion vaccine doses annually through 27,000 cold chain points &#8594; world&apos;s largest immunization network. Key cold chain infrastructure: 700+ walk-in coolers (2-8&#176;C), 400+ deep freezers (-20&#176;C), 30,000 ice-lined refrigerators, 4,000 cold boxes, 100,000 vaccine carriers &#8594; maintained by state health departments. Serum Institute supplies 60% of UIP vaccines, Bharat Biotech 15%, Biological E 10%, Haffkine 5%, others 10%. Total cold chain logistics &#8377;2,400Cr annually. eVIN electronic vaccine intelligence network monitors real-time temperature at 95% of cold chain points &#8594; IoT loggers with 15-minute reporting interval &#8594; cold chain breach alerts within 30 minutes.</p></CardContent></Card>
          <Card className="vcc-insight-card border-l-4 border-l-rose-600"><CardHeader><CardTitle className="text-sm text-rose-800">Serum Institute: World&apos;s Largest Vaccine Factory</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Serum Institute of India (SII) Pune is the world&apos;s largest vaccine manufacturer by volume &#8594; 1.5 billion doses/year across 15 vaccines. Produces: Covishield (500M doses), BCG (120M), DTP (150M), Measles (300M), Polio (200M), HPV/Cervavac (50M), PCV13 (100M), Rabies (80M), Tetanus (100M). SII cold chain: 25,000 sqm warehouse with 4 temperature zones (-25&#176;C, -15&#176;C, 2-8&#176;C, 15-25&#176;C). Refrigerated fleet: 200 temperature-controlled trucks, 50 reefers, 2 air cargo containers. Exports to 170 countries through WHO-UNICEF procurement. SII investing &#8377;2,800Cr in new cold chain hub at Manjari Pune &#8594; automated robotic storage with AI temperature prediction &#8594; commissioning Q2 2027.</p></CardContent></Card>
          <Card className="vcc-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: VCC-0006 and VCC-0014</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">VCC-0006 (Panacea Baddi to Kochi, 6-day delay): reefer truck compressor failure on Mumbai-Pune expressway &#8594; -20&#176;C OPV batches at -15&#176;C for 4 hours exceeding acceptable threshold &#8594; ICMR stability team reviewing impact on live attenuated virus potency &#8594; Kerala pulse polio round delayed 1 week &#8594; backup 200K doses airlifted from ICMR Delhi emergency stock &#8594; Panacea replacing entire truck fleet with dual-compressor independent units at &#8377;12Cr &#8594; 100% cold chain redundancy by Q4 2026. VCC-0014 (Serum Pune to Srinagar, 8-day delay): Ramban landslide blocked NH44 for 48 hours &#8594; 180K PCV13 doses rerouted via Mughal Road adding 2 days &#8594; J&amp;K海拔山区 cold chain requires active refrigeration &#8594; Serum deploying diesel-powered backup freezers at Banihal pass &#8594; permanent cold chain bypass tunnel at 9.2km under construction.</p></CardContent></Card>
          <Card className="vcc-insight-card border-l-4 border-l-rose-500"><CardHeader><CardTitle className="text-sm text-rose-700">Cervavac: India&apos;s Indigenous HPV Vaccine Game-Changer</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Zydus Cadila Cervavac is India&apos;s first indigenous HPV vaccine against cervical cancer &#8594; targeting HPV 16 and 18 strains responsible for 82% of Indian cervical cancer cases. India accounts for 25% of global cervical cancer deaths (78,000/year). Cervavac L1 virus-like particle produced in Pichia pastoris yeast &#8594; 3-dose schedule for girls 9-14 years &#8594; priced at &#8377;750/dose vs imported Gardasil &#8377;3,500/dose &#8594; 78% cost reduction. GoI launching national HPV immunization campaign targeting 7.5 crore adolescent girls &#8594; &#8377;12,000Cr 5-year program &#8594; Zydus scaling to 20M doses/year at &#8377;2,200Cr Moraiya plant &#8594; Serum also developing tetravalent HPV for broader strain coverage &#8594; WHO including Cervavac in 2027 prequalification pipeline.</p></CardContent></Card>
        </div>
      )}
    </div>
  )
}
