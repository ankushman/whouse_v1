'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface BiojetRecord {
  id: string;
  batchNo: string;
  processRoute: string;
  feedstock: string;
  application: string;
  capacityKLD: number;
  ciReduction: number;
  astmGrade: string;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: BiojetRecord[] = [
  { id: 'BJF-0001', batchNo: 'BJF-B2401', processRoute: 'HEFA (Hydroprocessed Esters)', feedstock: 'Used Cooking Oil (UCO)', application: 'Commercial Aviation', capacityKLD: 800, ciReduction: 80, astmGrade: 'ASTM D7566', status: 'In Transit', priority: 'Critical', origin: 'Mumbai (IOC Biotech)', destination: 'Delhi IGI T3 (BPCL)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: '800 KLD HEFA-SPK from UCO collection network Mumbai-Pune for IndiGo A320neo fleet' },
  { id: 'BJF-0002', batchNo: 'BJF-B2402', processRoute: 'ATJ (Alcohol-to-Jet)', feedstock: 'Sugarcane Ethanol', application: 'Defense Aviation', capacityKLD: 500, ciReduction: 70, astmGrade: 'ASTM D7566', status: 'Delivered', priority: 'High', origin: 'Belgaum (Praj Biojet)', destination: 'Bengaluru HAL (IAF)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: '500 KLD ATJ-SPK sugarcane ethanol for IAF Sukhoi-30MKI test flight program' },
  { id: 'BJF-0003', batchNo: 'BJF-B2403', processRoute: 'HEFA (Hydroprocessed Esters)', feedstock: 'Jatropha Oil', application: 'Regional Aviation', capacityKLD: 350, ciReduction: 75, astmGrade: 'ASTM D1655', status: 'Processing', priority: 'High', origin: 'Nagpur (CSIR-NIIST)', destination: 'Nagpur Mihan (Airlines)', shipDate: '2026-07-23', transitDays: 1, zone: 'West', remarks: '350 KLD HEFA jatropha for regional ATR-72 fleet Nagpur hub connecting tier-2 cities' },
  { id: 'BJF-0004', batchNo: 'BJF-B2404', processRoute: 'SIP (Synthesized Iso-paraffins)', feedstock: 'Sugarcane Syngas', application: 'International Aviation', capacityKLD: 600, ciReduction: 85, astmGrade: 'ASTM D7566', status: 'In Transit', priority: 'Critical', origin: 'Karnal (IIT-D SIP Plant)', destination: 'Mumbai CSIA (Air India)', shipDate: '2026-07-19', transitDays: 2, zone: 'North', remarks: '600 KLD SIP for Air India Boeing 787 London-Singapore routes net-zero target 2027' },
  { id: 'BJF-0005', batchNo: 'BJF-B2405', processRoute: 'FT (Fischer-Tropsch)', feedstock: 'Biomass Syngas', application: 'Cargo Aviation', capacityKLD: 450, ciReduction: 90, astmGrade: 'ASTM D7566', status: 'Delayed', priority: 'Medium', origin: 'Ranchi (SAIL-BIOCL)', destination: 'Kolkata CCU (BlueDart)', shipDate: '2026-07-12', transitDays: 14, zone: 'East', remarks: 'FT-SPK from biomass gasification — boiler trip at SAIL plant caused 14-day supply disruption to BlueDart cargo hub' },
  { id: 'BJF-0006', batchNo: 'BJF-B2406', processRoute: 'HEFA (Hydroprocessed Esters)', feedstock: 'Animal Fat (Tallow)', application: 'Charter Aviation', capacityKLD: 200, ciReduction: 78, astmGrade: 'ASTM D7566', status: 'Delivered', priority: 'Medium', origin: 'Alwar (Godrej Agrovet)', destination: 'Jaipur JAI (Vistara)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: '200 KLD tallow HEFA for Vistara A321neo domestic blend 10% SAF mandate compliance' },
  { id: 'BJF-0007', batchNo: 'BJF-B2407', processRoute: 'ATJ (Alcohol-to-Jet)', feedstock: 'Corn Ethanol', application: 'Commercial Aviation', capacityKLD: 700, ciReduction: 65, astmGrade: 'ASTM D7566', status: 'In Transit', priority: 'Critical', origin: 'Rajkot (Chemoil Biojet)', destination: 'Ahmedabad AMD (SpiceJet)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: '700 KLD ATJ corn ethanol for SpiceJet Boeing 737 MAX domestic network 5% SAF blend' },
  { id: 'BJF-0008', batchNo: 'BJF-B2408', processRoute: 'HEFA (Hydroprocessed Esters)', feedstock: 'Algae Oil', application: 'International Aviation', capacityKLD: 300, ciReduction: 88, astmGrade: 'ASTM D7566', status: 'Delivered', priority: 'High', origin: 'Kandla (Reliance Algae Farm)', destination: 'Mumbai CSIA (Emirates)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: '300 KLD algae-derived HEFA-SPK for Emirates A380 Mumbai-Dubai hub route premium green fuel' },
  { id: 'BJF-0009', batchNo: 'BJF-B2409', processRoute: 'SIP (Synthesized Iso-paraffins)', feedstock: 'Cellulosic Ethanol', application: 'Defense Aviation', capacityKLD: 250, ciReduction: 82, astmGrade: 'ASTM D7566', status: 'Processing', priority: 'Critical', origin: 'Hyderabad (DRDO-BDL)', destination: 'Hyderabad HYD (IAF Transport)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: '250 KLD cellulosic SIP for IAF C-17 Globemaster strategic airlift green fuel certification' },
  { id: 'BJF-0010', batchNo: 'BJF-B2410', processRoute: 'FT (Fischer-Tropsch)', feedstock: 'Municipal Solid Waste', application: 'Regional Aviation', capacityKLD: 180, ciReduction: 72, astmGrade: 'ASTM D7566', status: 'In Transit', priority: 'Low', origin: 'Pune (NMMC Biojet)', destination: 'Goa GOI (IndiGo)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: '180 KLD MSW-to-FT biojet for IndiGo ATR regional Goa tourist circuit 3% SAF blend pilot' },
  { id: 'BJF-0011', batchNo: 'BJF-B2411', processRoute: 'HEFA (Hydroprocessed Esters)', feedstock: 'Pongamia Oil', application: 'Heli-Operations', capacityKLD: 120, ciReduction: 76, astmGrade: 'ASTM D1655', status: 'Delivered', priority: 'Medium', origin: 'Raipur ( Chattisgarh Bio)', destination: 'Jabalpur (IAF Helibase)', shipDate: '2026-07-17', transitDays: 2, zone: 'East', remarks: '120 KLD pongamia HEFA for IAF Mi-17 helicopter fleet Naxal-affected area VIP transport operations' },
  { id: 'BJF-0012', batchNo: 'BJF-B2412', processRoute: 'ATJ (Alcohol-to-Jet)', feedstock: 'Rice Straw Ethanol', application: 'Commercial Aviation', capacityKLD: 550, ciReduction: 68, astmGrade: 'ASTM D7566', status: 'Delayed', priority: 'Critical', origin: 'Lucknow (IOCL Biojet)', destination: 'Delhi IGI T3 (IndiGo)', shipDate: '2026-07-10', transitDays: 18, zone: 'North', remarks: '550 KLD rice straw ATJ delayed — monsoon disrupted straw bale logistics from Punjab farms to Lucknow plant' },
  { id: 'BJF-0013', batchNo: 'BJF-B2413', processRoute: 'HEFA (Hydroprocessed Esters)', feedstock: 'Cottonseed Oil', application: 'International Aviation', capacityKLD: 400, ciReduction: 74, astmGrade: 'ASTM D7566', status: 'In Transit', priority: 'High', origin: 'Nagpur (Adani Wilmar)', destination: 'Hyderabad HYD (Lufthansa)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: '400 KLD cottonseed HEFA for Lufthansa A340 Frankfurt-Hyderabad non-stop net-zero commitment' },
  { id: 'BJF-0014', batchNo: 'BJF-B2414', processRoute: 'SIP (Synthesized Iso-paraffins)', feedstock: 'Sweet Sorghum Syngas', application: 'Cargo Aviation', capacityKLD: 280, ciReduction: 83, astmGrade: 'ASTM D7566', status: 'Processing', priority: 'Medium', origin: 'Coimbatore (TNAU Biojet)', destination: 'Chennai MAA (QuikJet)', shipDate: '2026-07-25', transitDays: 1, zone: 'South', remarks: '280 KLD sweet sorghum SIP for QuikJet cargo 737F domestic express e-commerce logistics hub' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Process Route', key: 'processRoute', options: [
    { value: 'HEFA (Hydroprocessed Esters)', count: 6 }, { value: 'ATJ (Alcohol-to-Jet)', count: 3 }, { value: 'SIP (Synthesized Iso-paraffins)', count: 3 }, { value: 'FT (Fischer-Tropsch)', count: 2 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'Commercial Aviation', count: 4 }, { value: 'International Aviation', count: 3 }, { value: 'Defense Aviation', count: 2 }, { value: 'Regional Aviation', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 5 }, { value: 'South', count: 4 }, { value: 'North', count: 3 }, { value: 'East', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Biojet SAF Supply', color: 'text-sky-800' },
  { title: 'Combined Output', value: '5,580 KLD', sub: 'All Process Routes', color: 'text-blue-700' },
  { title: 'Avg CI Reduction', value: '78%', sub: 'FT-SPK 90% Peak', color: 'text-indigo-700' },
  { title: 'National Target', value: '\u20b98,500Cr', sub: 'National Bio-Energy Mission', color: 'text-cyan-700' },
];

export default function BiojetFuelLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => ((prev) => {
      const next = { ...prev };
      const arr = next[key] || [];
      if (arr.includes(value)) { next[key] = arr.filter((v: string) => v !== value); if (next[key].length === 0) delete next[key]; } else { next[key] = [...arr, value]; }
      return next;
    })(prev));
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.processRoute} ${r.feedstock} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof BiojetRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByRoute = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const key = r.processRoute.split(' ')[0]; map.set(key, (map.get(key) || 0) + r.capacityKLD); });
    return Array.from(map.entries()).map(([name, capacityKLD]) => ({ name, capacityKLD }));
  }, []);

  const feedstockDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.feedstock.split(' ').slice(0, 2).join(' '); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2022', kld: 200 }, { year: '2023', kld: 800 }, { year: '2024', kld: 2200 }, { year: '2025', kld: 4500 }, { year: '2026', kld: 8000 }, { year: '2027', kld: 14000 }, { year: '2028', kld: 22000 },
  ], []);

  const ciData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), ci: r.ciReduction }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const capacityByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application.split(' ')[0], (map.get(r.application.split(' ')[0]) || 0) + r.capacityKLD); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityKLD]) => ({ name: name.slice(0, 14), capacityKLD }));
  }, []);

  const COLORS = ['#0284c7', '#0369a1', '#0891b2', '#0e7490', '#155e75'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="bjf-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Aviation Fuels' }, { label: 'Biojet / SAF' }]} />
      <PageHeader title="Biojet Fuel (SAF) Logistics" description="Indian sustainable aviation fuel supply chain &#8212; HEFA, ATJ, SIP, Fischer-Tropsch biojet production from UCO, jatropha, algae, biomass for commercial, defense, regional, and cargo aviation sectors" />

      <div className="bjf-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="bjf-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="bjf-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`bjf-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-sky-700 text-sky-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="bjf-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Process Route (KLD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByRoute}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityKLD" fill="#0284c7" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-sm">Feedstock Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={feedstockDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0284c7" /><Cell fill="#0369a1" /><Cell fill="#0891b2" /><Cell fill="#0e7490" /><Cell fill="#155e75" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-sm">Biojet SAF Production Growth (KLD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="kld" stroke="#0891b2" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-sm">CI Reduction (%) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={ciData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="ci" fill="#0e7490" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="bjf-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Feedstock</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">KLD</th><th className="px-2 py-2 text-right">CI%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`bjf-table-row border-b hover:bg-sky-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.processRoute}</td>
                  <td className="px-2 py-2 text-xs">{r.feedstock}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityKLD}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.ciReduction}%</td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusBadge[r.status]}>{r.status}</Badge></td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusColor[r.priority]}>{r.priority}</Badge></td>
                  <td className="px-2 py-2 text-xs">{r.origin} &#8594; {r.destination}</td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bjf-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0284c7" /><Cell fill="#0369a1" /><Cell fill="#0891b2" /><Cell fill="#0e7490" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Application (KLD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityKLD" fill="#0284c7" radius={[4,4,0,0]} name="KLD" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs CI Reduction (Batch)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), cap: r.capacityKLD, ci: r.ciReduction }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="cap" stroke="#0284c7" strokeWidth={2} name="KLD" /><Line type="monotone" dataKey="ci" stroke="#0891b2" strokeWidth={2} name="CI %" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="bjf-chart-card"><CardHeader><CardTitle className="text-sm">ASTM Grade Compliance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.astmGrade, records.filter((x) => x.astmGrade === r.astmGrade).length])).entries()).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0284c7" /><Cell fill="#0369a1" /><Cell fill="#0891b2" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="bjf-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bjf-insight-card border-l-4 border-l-sky-700"><CardHeader><CardTitle className="text-sm text-sky-800">IOC Mumbai: India&apos;s First HEFA Biojet Refinery at Scale</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Indian Oil Corporation (IOC) Biotech Mumbai commissioned 800 KLD HEFA-SPK biojet facility (BJF-0001), India&apos;s largest sustainable aviation fuel plant. Used cooking oil collected from 12,000+ restaurants across Mumbai-Pune corridor via FSSAI-certified UCO aggregation network. Hydroprocessing at 380bar and 400C over Pt-Sn/Al2O3 catalyst producing ASTM D7566 certified synthetic paraffinic kerosene with 80% lifecycle CO2 reduction. BPCL Delhi IGI T3 terminal receiving daily rail tank car shipments for IndiGo A320neo fleet — 5% SAF blend reducing 4,200 tonnes CO2 per year per aircraft. IOC targeting 2,500 KLD by 2028 covering all major Indian metro airports. Government SAF blending mandate: 1% from 2027, 5% from 2028 under National Bio-Energy Programme. Total investment: &#8377;2,800Cr with &#8377;450Cr viability gap funding from MNRE.</p></CardContent></Card>
          <Card className="bjf-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: BJF-0005 and BJF-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BJF-0005 (Ranchi SAIL-BIOCL to Kolkata BlueDart, 14-day delay): 450 KLD Fischer-Tropsch biojet from biomass gasification — SAIL biomass gasifier boiler experienced refractory failure during monsoon humidity cycling, requiring 2-week emergency repair. BlueDart cargo hub Kolkata CCU rerouted to conventional ATF at 40% higher cost. BJF-0012 (Lucknow IOCL to Delhi IndiGo, 18-day delay): 550 KLD rice straw ATJ biojet — heavy monsoon in Punjab-Haryana disrupted paddy straw bale collection logistics. Standing water in fields prevented baling equipment access for 18 days. IOCL Lucknow ATJ plant operated at 30% capacity using buffer corn ethanol stocks. IndiGo Delhi hub received only partial SAF delivery, delaying 5% blend rollout. DGCA monitoring supply chain resilience — recommending geographically distributed feedstock sourcing to mitigate monsoon disruption risk.</p></CardContent></Card>
          <Card className="bjf-insight-card border-l-4 border-l-indigo-600"><CardHeader><CardTitle className="text-sm text-indigo-700">IIT-D SIP: Cellulosic Biojet for Net-Zero Aviation</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">IIT Delhi developed proprietary Synthesized Iso-paraffins (SIP) biojet process (BJF-0004) achieving 85% CI reduction — highest among Indian ATJ pathways. Sugarcane syngas from gasification fermented to isobutanol, then dehydrated and oligomerized to C12-C16 iso-paraffins meeting jet fuel specifications. 600 KLD SIP plant at Karnal supplying Air India Boeing 787 Dreamliner fleet on London and Singapore routes — each flight saves 35 tonnes CO2 with 50% SAF blend. Air India committed to net-zero by 2027 on international routes using IIT-D SIP technology licensed through NRDC. Technology transferred to Praj Industries for commercial scale-up to 3,000 KLD by 2029. SIP biojet offers freeze point below -47C critical for high-altitude operations, superior cold flow properties compared to HEFA. Cost: &#8377;95/liter SAF blend vs &#8377;72/liter conventional ATF — viability gap funding essential.</p></CardContent></Card>
          <Card className="bjf-insight-card border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm text-teal-700">Reliance Kandla: Algae-to-Biojet Circular Carbon Platform</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Reliance Industries commissioned 300 KLD algae-derived HEFA-SPK biojet facility (BJF-0008) at Kandla port — India&apos;s first commercial-scale algae biojet plant. 500-acre open pond raceway system cultivating Nannochloropsis oceanica on CO2-rich flue gas from Reliance Jamnagar refinery, achieving 88% lifecycle CO2 reduction. Algae lipid extracted and hydroprocessed to ASTM D7566 certified jet fuel with superior energy density (43.5 MJ/kg vs 43.2 MJ/kg conventional). Emirates A380 Mumbai-Dubai hub route receiving algae biojet for premium green aviation service marketed as &quot;Net-Zero Sky&quot;. Reliance developing integrated algae biorefinery: biojet fuel + omega-3 nutraceuticals + aquaculture feed + bioplastics from residual biomass. Scale-up target: 2,000 KLD by 2030 across Gujarat and Tamil Nadu coastal sites. Investment: &#8377;4,200Cr including pond infrastructure and downstream processing.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
