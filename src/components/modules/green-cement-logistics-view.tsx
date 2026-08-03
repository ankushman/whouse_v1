'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface GCMRecord {
  id: string;
  projectId: string;
  state: string;
  plant: string;
  company: string;
  technology: string;
  capacityMTPA: number;
  co2Reduction: number;
  investmentCr: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: GCMRecord[] = [
  { id: 'GCM-0001', projectId: 'GCM-R26RJ1', state: 'Rajasthan', plant: 'Shree Cement Ras Plant', company: 'Shree Cement', technology: 'LC3 Blend + Calcined Clay Clinker', capacityMTPA: 8, co2Reduction: 42, investmentCr: 320, status: 'In Transit', priority: 'Critical', origin: 'Shree Cement HQ Kolkata', destination: 'Ras Plant Beawar', shipDate: '2026-07-28', transitDays: 2, zone: 'North', remarks: 'Shree Cement Ras &#8594; India&apos;s largest LC3 (Limestone Calcined Clay Cement) plant at 8 MTPA. Calcined clay replaces 50% clinker &#8594; 42% CO2 reduction vs OPC. &#8377;320Cr conversion investment from existing kiln. Rajasthan&apos;s abundant kaolin clay reserves (200M tonnes) provide raw material for 50+ years. Shree targets net-zero cement by 2040 &#8594; LC3 is cornerstone technology reducing 3.2 MtCO2/yr across 4 Rajasthan plants' },
  { id: 'GCM-0002', projectId: 'GCM-M26MUM1', state: 'Maharashtra', plant: 'UltraTech Worli Green Plant', company: 'UltraTech Cement', technology: 'AAM + Carbon Capture + Green Clinker', capacityMTPA: 6, co2Reduction: 55, investmentCr: 480, status: 'Delivered', priority: 'Critical', origin: 'UltraTech HQ Mumbai', destination: 'Worli Green Cement Plant', shipDate: '2026-07-10', transitDays: 1, zone: 'West', remarks: 'UltraTech Worli flagship green cement plant &#8594; 6 MTPA with 55% CO2 reduction through AAM (Alkali-Activated Materials) + Carbon Capture + Green Clinker triple strategy. &#8377;480Cr investment &#8594; India&apos;s lowest carbon cement at 320 kgCO2/tonne vs industry average 690 kgCO2/tonne. Carbon capture from kiln flue gas at 800,000 TPA CO2 supplies IGOL for pipeline blending &#8594; first cement-CCUS integration in India' },
  { id: 'GCM-0003', projectId: 'GCM-T26TN1', state: 'Tamil Nadu', plant: 'Ramco Cements Ariyalur', company: 'Ramco Cements', technology: 'LC3 + Waste Heat Recovery + Solar Calciner', capacityMTPA: 5, co2Reduction: 48, investmentCr: 285, status: 'Processing', priority: 'High', origin: 'Ramco HQ Chennai', destination: 'Ariyalur Plant', shipDate: '2026-08-01', transitDays: 2, zone: 'South', remarks: 'Ramco Cements Ariyalur deploys LC3 blend with solar-powered calciner &#8594; 5 MTPA with 48% CO2 reduction. &#8377;285Cr investment includes 25 MW solar thermal for calcination heat &#8594; replacing 40% fossil fuel. Waste heat recovery generates 18 MW power &#8594; plant achieves 85% energy self-sufficiency. Ariyalur&apos;s limestone belt provides raw material advantage &#8594; plant is India&apos;s first net-zero energy cement facility targeting 280 kgCO2/tonne by 2028' },
  { id: 'GCM-0004', projectId: 'GCM-K26KA1', state: 'Karnataka', plant: 'Dalmia Cement Belgaum', company: 'Dalmia Bharat Cement', technology: 'Geopolymer + BFS Slag + LC3', capacityMTPA: 4, co2Reduction: 52, investmentCr: 240, status: 'Delivered', priority: 'High', origin: 'Dalmia HQ New Delhi', destination: 'Belgaum Plant', shipDate: '2026-07-08', transitDays: 2, zone: 'South', remarks: 'Dalmia Belgaum &#8594; India&apos;s lowest carbon cement producer at 52% reduction using geopolymer technology with blast furnace slag and LC3 blend. &#8377;240Cr investment &#8594; 4 MTPA geopolymer cement for JSW Steel and Tata Steel construction projects. BFS slag from JSW Vijayanagar eliminates clinker entirely for non-structural applications. Dalmia targets 1 tonne CO2 per tonne cement by 2030 &#8594; current portfolio average is 493 kgCO2/tonne, lowest globally' },
  { id: 'GCM-0005', projectId: 'GCM-G26GJ1', state: 'Gujarat', plant: 'ACC Cement Kutch', company: 'ACC (Holcim)', technology: 'PLC + Calcined Clay + Biomass Clinker', capacityMTPA: 7, co2Reduction: 38, investmentCr: 350, status: 'In Transit', priority: 'High', origin: 'ACC HQ Mumbai', destination: 'Kutch Plant', shipDate: '2026-07-26', transitDays: 2, zone: 'West', remarks: 'ACC Kutch deploys PLC (Portland Limestone Cement) with calcined clay and biomass clinker &#8594; 7 MTPA with 38% CO2 reduction. &#8377;350Cr investment &#8594; Holcim&apos;s global ECOPact technology adapted for Indian limestone grades. Biomass co-processing replaces 25% coal with agricultural waste pellets from Kutch&apos;s groundnut and cotton stalks. Limestone from Kutch&apos;s 500M tonne reserves &#8594; ACC targets Gujarat infrastructure build (DMIC, DFC, expressways) requiring 15 MT/yr green cement' },
  { id: 'GCM-0006', projectId: 'GCM-C26CHN1', state: 'Chhattisgarh', plant: 'Ambuja Cement Raipur', company: 'Ambuja Cements (Adani)', technology: 'PLC + WHR + AAM Block', capacityMTPA: 5, co2Reduction: 45, investmentCr: 265, status: 'Delivered', priority: 'High', origin: 'Ambuja HQ Ahmedabad', destination: 'Raipur Plant Maroda', shipDate: '2026-07-14', transitDays: 2, zone: 'North', remarks: 'Ambuja Raipur deploys PLC with AAM block manufacturing &#8594; 5 MTPA with 45% CO2 reduction. &#8377;265Cr investment &#8594; Adani Group synergy with captive power from Raipur&apos;s 1,200 MW thermal plant. AAM blocks for precast construction use fly ash from Adani Power plants &#8594; converting waste into construction material. Chhattisgarh&apos;s rich limestone and coal reserves enable integrated green cement value chain &#8594; targeting &#8377;4,000Cr revenue from green cement premium' },
  { id: 'GCM-0007', projectId: 'GCM-A26AP1', state: 'Andhra Pradesh', plant: 'Sagar Cement Kurnool', company: 'Sagar Cements', technology: 'LC3 + Natural Pozzolana + WHR', capacityMTPA: 3, co2Reduction: 35, investmentCr: 120, status: 'Delivered', priority: 'High', origin: 'Sagar Cement Hyderabad', destination: 'Kurnool Plant', shipDate: '2026-07-12', transitDays: 2, zone: 'South', remarks: 'Sagar Cement Kurnool &#8594; 3 MTPA LC3 with natural pozzolana from Rayalaseema volcanic deposits. &#8377;120Cr investment &#8594; 35% CO2 reduction. Natural pozzolana replaces 30% clinker without calcination &#8594; zero-energy supplementary cementitious material. Kurnool&apos;s tuff deposits provide 50M tonnes of natural pozzolana &#8594; Sagar targets LC3 cost parity with OPC by 2027. WHR generates 8 MW reducing grid dependency &#8594; serving AP&apos;s Amaravati capital construction boom' },
  { id: 'GCM-0008', projectId: 'GCM-H26HR1', state: 'Haryana', plant: 'JK Cement Panyala', company: 'JK Cement', technology: 'White Cement LC3 + Calcined Clay', capacityMTPA: 2, co2Reduction: 40, investmentCr: 95, status: 'In Transit', priority: 'Medium', origin: 'JK Cement HQ New Delhi', destination: 'Panyala Plant', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'JK Cement Panyala &#8594; India&apos;s first green white cement plant at 2 MTPA with LC3 technology. &#8377;95Cr investment &#8594; 40% CO2 reduction for premium white cement serving luxury construction and export markets. Calcined clay from Rajasthan kaolin preserves white color while reducing energy-intensive white clinker. White cement commands 3x price premium &#8594; green LC3 white cement targets EU CBAM compliance for Indian cement exports. JK exports 40% to Middle East and Europe' },
  { id: 'GCM-0009', projectId: 'GCM-M26MP1', state: 'Madhya Pradesh', plant: 'JP Cement Satna', company: 'JP Associates', technology: 'Composite Cement + BFS + Fly Ash', capacityMTPA: 4, co2Reduction: 33, investmentCr: 140, status: 'Delivered', priority: 'Medium', origin: 'JP Associates Noida', destination: 'Satna Plant', shipDate: '2026-07-08', transitDays: 2, zone: 'North', remarks: 'JP Cement Satna deploys composite cement with BFS from SAIL Bhilai and fly ash from NTPC Vindhyachal &#8594; 4 MTPA with 33% CO2 reduction. &#8377;140Cr investment &#8594; converting existing OPC plant to composite process. Satna&apos;s cement belt benefits from proximity to both steel plants (Bhilai, Rourkela) and thermal power stations &#8594; industrial symbiosis reduces waste disposal costs by &#8377;120Cr/yr for SAIL and NTPC. MP targets 60% green cement by 2027 under state carbon policy' },
  { id: 'GCM-0010', projectId: 'GCM-W26WB1', state: 'West Bengal', plant: 'Dalmia Bengal Salboni', company: 'Dalmia Bharat Cement', technology: 'LC3 + Rice Husk Ash + WHR', capacityMTPA: 3, co2Reduction: 44, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'Dalmia Kolkata Office', destination: 'Salboni Plant West Midnapore', shipDate: '2026-07-12', transitDays: 1, zone: 'East', remarks: 'Dalmia Salboni deploys LC3 with rice husk ash from Bengal&apos;s rice mills &#8594; 3 MTPA with 44% CO2 reduction. &#8377;165Cr investment &#8594; rice husk ash replaces 20% clinker with highly reactive silica. West Bengal&apos;s 15M tonnes annual rice husk waste provides unlimited raw material &#8594; converting agricultural waste into premium cement. WHR generates 6 MW from kiln exhaust &#8594; Salboni serves Kolkata metro construction and Bangladesh export market through Haldia port' },
  { id: 'GCM-0011', projectId: 'GCM-U26UP1', state: 'Uttar Pradesh', plant: 'Birla Corporation Chanderia', company: 'Birla Corporation', technology: 'PLC + Calcined Clay + Solar WHR', capacityMTPA: 4, co2Reduction: 36, investmentCr: 185, status: 'Processing', priority: 'Medium', origin: 'Birla Corp HQ Kolkata', destination: 'Chanderia Plant Chittorgarh', shipDate: '2026-08-02', transitDays: 2, zone: 'North', remarks: 'Birla Corporation Chanderia deploys PLC with solar waste heat recovery &#8594; 4 MTPA with 36% CO2 reduction. &#8377;185Cr investment &#8594; 50 MW solar thermal supplements WHR for calcination. Chanderia is Rajasthan&apos;s largest cement cluster (3 companies, 25 MTPA) &#8594; Birla&apos;s green conversion serves UP infrastructure demand (expressways, airports, smart cities). UP&apos;s &#8377;10 lakh crore infrastructure pipeline requires 80 MT/yr cement &#8594; green premium at 8% above OPC' },
  { id: 'GCM-0012', projectId: 'GCM-K26KL1', state: 'Kerala', plant: 'Malabar Cements Walayar', company: 'Malabar Cements', technology: 'Composite Cement + Pozzolana + WHR', capacityMTPA: 1, co2Reduction: 30, investmentCr: 42, status: 'Delivered', priority: 'Medium', origin: 'Malabar HQ Kochi', destination: 'Walayar Plant Palakkad', shipDate: '2026-07-08', transitDays: 2, zone: 'South', remarks: 'Kerala&apos;s only government-owned green cement plant &#8594; 1 MTPA composite cement with 30% CO2 reduction. &#8377;42Cr investment &#8594; using laterite-based pozzolana from Kerala&apos;s laterite deposits for clinker substitution. Malabar Cements&apos; small scale proves green cement viability for state-level producers &#8594; Kerala government mandates 50% green cement for all government projects. WHR generates 2 MW &#8594; plant supplies Kerala&apos;s green building certification (IGBC) market growing at 25% CAGR' },
  { id: 'GCM-0013', projectId: 'GCM-O26OR1', state: 'Odisha', plant: 'ACC Cement Bargarh', company: 'ACC (Holcim)', technology: 'LC3 + BF Slag + Biomass', capacityMTPA: 3, co2Reduction: 40, investmentCr: 145, status: 'In Transit', priority: 'Medium', origin: 'ACC Bhubaneswar Office', destination: 'Bargarh Plant', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'ACC Bargarh deploys LC3 with blast furnace slag from MCL Talcher and biomass from Odisha&apos;s rice belt &#8594; 3 MTPA with 40% CO2 reduction. &#8377;145Cr investment &#8594; industrial ecology hub connecting coal mines, steel plants and cement kilns. Bargarh limestone belt (300M tonnes) enables integrated green cement &#8594; 25% biomass replaces coal with paddy husk pellets. Odisha&apos;s steel cities (Rourkela, Jharsuguda, Angul) supply BFS creating zero-waste symbiosis with SAIL, TATA and MCL' },
  { id: 'GCM-0014', projectId: 'GCM-N26NL1', state: 'North East', plant: 'Star Cement Meghalaya', company: 'Star Cement (ML Group)', technology: 'LC3 + Limestone Tailings + WHR', capacityMTPA: 2, co2Reduction: 34, investmentCr: 68, status: 'Delivered', priority: 'Medium', origin: 'Star Cement Shillong', destination: 'Lumshnong Plant', shipDate: '2026-07-12', transitDays: 3, zone: 'East', remarks: 'Star Cement Meghalaya &#8594; Northeast India&apos;s first green cement plant at 2 MTPA with LC3 technology. &#8377;68Cr investment &#8594; 34% CO2 reduction using limestone tailings from coal mines as calcined clay substitute. Meghalaya&apos;s 6,000 mm annual rainfall enables hydropower for green electricity &#8594; plant achieves 70% renewable energy. Serving Northeast infrastructure demand (highways, railways, airports) &#8594; saving 5,000 km road transport from Gujarat cement imports. LC3 reduces logistics carbon by 80% for Northeast markets' },
];

const COLORS = ['#b45309', '#d97706', '#f59e0b', '#fbbf24', '#92400e', '#78350f', '#713f12', '#451a03'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 9 }, { value: 'Processing', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 5 }, { value: 'Medium', count: 7 },
  ]},
  { label: 'Technology', key: 'technology', options: [
    { value: 'LC3 Blend + Calcined Clay Clinker', count: 1 }, { value: 'AAM + Carbon Capture + Green Clinker', count: 1 }, { value: 'LC3 + Waste Heat Recovery + Solar Calciner', count: 1 }, { value: 'Geopolymer + BFS Slag + LC3', count: 1 }, { value: 'PLC + Calcined Clay + Biomass Clinker', count: 1 }, { value: 'PLC + WHR + AAM Block', count: 1 }, { value: 'LC3 + Natural Pozzolana + WHR', count: 1 }, { value: 'White Cement LC3 + Calcined Clay', count: 1 }, { value: 'Composite Cement + BFS + Fly Ash', count: 1 }, { value: 'LC3 + Rice Husk Ash + WHR', count: 1 }, { value: 'PLC + Calcined Clay + Solar WHR', count: 1 }, { value: 'Composite Cement + Pozzolana + WHR', count: 1 }, { value: 'LC3 + BF Slag + Biomass', count: 1 }, { value: 'LC3 + Limestone Tailings + WHR', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 5 }, { value: 'South', count: 4 }, { value: 'West', count: 3 }, { value: 'East', count: 3 },
  ]},
];

export default function GreenCementLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registry' | 'analytics' | 'insights'>('dashboard');

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev: Record<string, string[]>) => {
      const next = { ...prev };
      const arr = next[key] || [];
      if (arr.includes(value)) {
        next[key] = arr.filter((v: string) => v !== value);
        if (next[key].length === 0) delete next[key];
      } else {
        next[key] = [...arr, value];
      }
      return next;
    });
  };

  const clearAllFilters = () => setActiveFilters({});

  const filteredRecords = useMemo(() => {
    return records.filter((r: GCMRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.state.toLowerCase().includes(searchQuery.toLowerCase()) || r.plant.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof GCMRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalCapacity = records.reduce((s, r) => s + r.capacityMTPA, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgCO2 = Math.round(records.reduce((s, r) => s + r.co2Reduction, 0) / records.length);
  const totalCO2Reduced = Math.round(totalCapacity * avgCO2 * 0.69 / 100);

  const kpiData = [
    { label: 'Total Green Capacity', value: `${totalCapacity} MTPA`, sub: 'Low-Carbon Cement Plants' },
    { label: 'Avg CO2 Reduction', value: `${avgCO2}%`, sub: 'vs Ordinary Portland Cement' },
    { label: 'Annual CO2 Avoided', value: `${totalCO2Reduced} MtCO2`, sub: 'Per Year Emission Savings' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'Green Cement Transition' },
  ];

  const stateData = useMemo(() => records.map(r => ({ state: r.state, cap: r.capacityMTPA, co2: r.co2Reduction })).sort((a, b) => b.cap - a.cap), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const capVsCO2 = useMemo(() => records.map(r => ({ state: r.state, cap: r.capacityMTPA, co2: r.co2Reduction })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 gcm-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Green Cement' }]} />
      <PageHeader title="Green Cement Logistics" description="Low-carbon cement manufacturing with LC3, geopolymer, PLC, calcined clay, BFS slag and carbon capture technologies for India&apos;s infrastructure decarbonization" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#b45309] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="gcm-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#b45309]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="gcm-chart-card"><CardHeader><CardTitle className="text-base">Green Cement Capacity by State (MTPA)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={stateData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="cap" fill="#b45309" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="gcm-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#b45309" /><Cell fill="#d97706" /><Cell fill="#f59e0b" /><Cell fill="#92400e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'gcm-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Green Cement Plant Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm border-l-4 border-l-[#b45309] bg-amber-50/20`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.state} &#8594; {r.transitDays}d | {r.capacityMTPA} MTPA | {r.co2Reduction}% CO2 &#8595;</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: r.remarks }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="gcm-chart-card"><CardHeader><CardTitle className="text-base">Capacity vs CO2 Reduction</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={capVsCO2}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="cap" stroke="#b45309" strokeWidth={2} name="Capacity (MTPA)" /><Line yAxisId="right" type="monotone" dataKey="co2" stroke="#92400e" strokeWidth={2} name="CO2 Reduction (%)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="gcm-chart-card"><CardHeader><CardTitle className="text-base">Investment per MTPA (&#8377;Cr/MTPA)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ state: r.state, invMtpa: +(r.investmentCr / r.capacityMTPA).toFixed(1) }))}><XAxis dataKey="state" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="invMtpa" fill="#d97706" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="gcm-chart-card"><CardHeader><CardTitle className="text-base">Total Capacity by Zone (MTPA)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.capacityMTPA; return m; }, {})).map(([k, v]) => ({ zone: k, cap: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="cap" fill="#92400e" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="gcm-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 4 }, { name: 'Delivered', value: 9 }, { name: 'Processing', value: 2 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#b45309" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="gcm-insight-card"><CardHeader><CardTitle className="text-base">UltraTech Worli: India&apos;s First 55% Green Cement</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">UltraTech Worli (GCM-0002) achieves India&apos;s deepest CO2 reduction at 55% through AAM + Carbon Capture + Green Clinker triple strategy. At 320 kgCO2/tonne vs industry average 690 &#8594; the plant produces carbon-negative concrete for Mumbai&apos;s coastal infrastructure. &#8377;480Cr investment includes 800,000 TPA carbon capture from kiln flue gas &#8594; first cement-CCUS integration in India supplying captured CO2 for IGOL pipeline blending. UltraTech targets this model for 100% of its 140 MTPA capacity by 2040.</p></CardContent></Card>
          <Card className="gcm-insight-card"><CardHeader><CardTitle className="text-base">Dalmia: World&apos;s Lowest Carbon Cement Producer</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Dalmia Cement (GCM-0004, GCM-0010) achieves portfolio average of 493 kgCO2/tonne &#8594; the world&apos;s lowest among major cement producers. Belgaum geopolymer plant at 52% reduction uses zero clinker for non-structural applications with BFS slag from JSW Steel. &#8377;240Cr investment serves JSW and Tata Steel&apos;s green construction requirements. Dalmia&apos;s 2025 achievement of 1 tonne CO2 per tonne cement target &#8594; ahead of industry&apos;s 2050 net-zero commitment &#8594; establishes India as global green cement leader.</p></CardContent></Card>
          <Card className="gcm-insight-card"><CardHeader><CardTitle className="text-base">LC3 Technology: India&apos;s Cement Revolution</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">LC3 (Limestone Calcined Clay Cement) is India&apos;s most adopted green cement technology &#8594; deployed in 10 of 14 portfolio plants. Replaces 50% clinker with calcined clay requiring only 800&#176;C vs 1,450&#176;C for clinker &#8594; 40% energy reduction. India has 200M tonnes of kaolin clay reserves &#8594; enough for 100 years at 5 billion tonnes annual cement production. IIT Madras and IIT Hyderabad developed India-specific LC3 formulations &#8594; BIS standards updated in 2026 enabling 50% clinker substitution in all cement grades.</p></CardContent></Card>
          <Card className="gcm-insight-card"><CardHeader><CardTitle className="text-base">India Green Cement Target: &#8377;25,000Cr by 2030</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 57 MTPA green capacity at &#8377;3,005Cr investment demonstrates average 39% CO2 reduction &#8594; avoiding 15.5 MtCO2/yr. India produces 1,400 MTPA cement (world&apos;s 2nd largest) &#8594; converting 50% to green cement by 2030 requires &#8377;25,000Cr investment for 700 MTPA. At &#8377;53Cr/MTPA conversion cost, annual savings of 245 MtCO2 at &#8377;1,200/tonne carbon credits generates &#8377;29,400Cr/yr &#8594; payback under 1 year with carbon revenue. India&apos;s infrastructure pipeline makes it the world&apos;s largest green cement opportunity.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
