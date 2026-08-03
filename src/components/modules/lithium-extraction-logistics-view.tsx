'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface LiRecord {
  id: string;
  batchNo: string;
  extractMethod: string;
  source: string;
  grade: string;
  yieldTPD: number;
  purity: number;
  costPerTonne: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: LiRecord[] = [
  { id: 'LIX-0001', batchNo: 'LIX-B2401', extractMethod: 'DLE (Adsorption)', source: 'Brine', grade: 'Battery Grade', yieldTPD: 150, purity: 99.5, costPerTonne: 8500, status: 'In Transit', priority: 'Critical', origin: 'Kutch (GSFC Brine)', destination: 'Ahmedabad (Amara Raja Cell)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: '150TPD DLE plant for EV battery grade Li2CO3 supply chain' },
  { id: 'LIX-0002', batchNo: 'LIX-B2402', extractMethod: 'Hard Rock Mining', source: 'Spodumene', grade: 'Technical Grade', yieldTPD: 500, purity: 99.2, costPerTonne: 12000, status: 'Delivered', priority: 'High', origin: 'Kodarma (AMNL Mining)', destination: 'Gandhinagar (Exicom Power)', shipDate: '2026-07-18', transitDays: 3, zone: 'East', remarks: 'Spodumene concentrate 6% Li2O for Exicom BMS cell production' },
  { id: 'LIX-0003', batchNo: 'LIX-B2403', extractMethod: 'DLE (Ion Exchange)', source: 'Brine', grade: 'Battery Grade', yieldTPD: 80, purity: 99.7, costPerTonne: 7200, status: 'Processing', priority: 'High', origin: 'Sambhar Lake (RSMML)', destination: 'Bengaluru (Mahindra EV)', shipDate: '2026-07-22', transitDays: 4, zone: 'North', remarks: 'Ion exchange DLE for Mahindra XUV400 battery pack 72kWh' },
  { id: 'LIX-0004', batchNo: 'LIX-B2404', extractMethod: 'DLE (Solvent Extraction)', source: 'Brine', grade: 'Battery Grade', yieldTPD: 200, purity: 99.6, costPerTonne: 9800, status: 'In Transit', priority: 'Critical', origin: 'Rann of Kutch (Hindustan Salts)', destination: 'Pune (Tata Motors EV)', shipDate: '2026-07-19', transitDays: 2, zone: 'West', remarks: 'Solvent extraction DLE for Tata Nexon EV 40.5kWh LFP cell' },
  { id: 'LIX-0005', batchNo: 'LIX-B2405', extractMethod: 'Clay Leaching', source: 'Sedimentary Clay', grade: 'Technical Grade', yieldTPD: 300, purity: 98.5, costPerTonne: 6500, status: 'Delayed', priority: 'High', origin: 'Jhabua (MP Mining)', destination: 'Hyderabad (Ola EV Megafactory)', shipDate: '2026-07-12', transitDays: 14, zone: 'Central', remarks: 'Clay leaching plant monsoon delay MP mining lease renewal' },
  { id: 'LIX-0006', batchNo: 'LIX-B2406', extractMethod: 'Hard Rock Mining', source: 'Pegmatite', grade: 'Battery Grade', yieldTPD: 250, purity: 99.4, costPerTonne: 11000, status: 'Delivered', priority: 'Medium', origin: 'Bhilwara (Rajasthan Lithium)', destination: 'Chennai (Ather Energy)', shipDate: '2026-07-16', transitDays: 3, zone: 'West', remarks: 'Pegmatite lithium for Ather 450X Gen-3 battery module' },
  { id: 'LIX-0007', batchNo: 'LIX-B2407', extractMethod: 'DLE (Adsorption)', source: 'Geothermal Brine', grade: 'Battery Grade', yieldTPD: 60, purity: 99.8, costPerTonne: 15000, status: 'In Transit', priority: 'High', origin: 'Puga Valley (ONGC Geothermal)', destination: 'Manesar (Maruti Suzuki EV)', shipDate: '2026-07-21', transitDays: 5, zone: 'North', remarks: 'Geothermal co-produced Li for Maruti WagonR EV LFP cells' },
  { id: 'LIX-0008', batchNo: 'LIX-B2408', extractMethod: 'Seawater Extraction', source: 'Seawater', grade: 'Low Grade', yieldTPD: 20, purity: 95.0, costPerTonne: 25000, status: 'Processing', priority: 'Low', origin: 'Tuticorin (NIOT)', destination: 'Kolkata (EMF Motors)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: 'Pilot seawater Li extraction TIRO membrane tech from NIOT' },
  { id: 'LIX-0009', batchNo: 'LIX-B2409', extractMethod: 'DLE (Ion Exchange)', source: 'Brine', grade: 'Battery Grade', yieldTPD: 120, purity: 99.6, costPerTonne: 7800, status: 'Delivered', priority: 'Critical', origin: 'Ladakh (DRDO Brine)', destination: 'Noida (BYD India)', shipDate: '2026-07-17', transitDays: 6, zone: 'North', remarks: 'High-altitude brine DLE for BYD Blade battery sodium-Li hybrid' },
  { id: 'LIX-0010', batchNo: 'LIX-B2410', extractMethod: 'Hard Rock Mining', source: 'Lepidolite', grade: 'Technical Grade', yieldTPD: 180, purity: 98.8, costPerTonne: 10500, status: 'In Transit', priority: 'Medium', origin: 'Riya (Bihar Mica Belt)', destination: 'Gurgaon (Hero Electric)', shipDate: '2026-07-22', transitDays: 2, zone: 'East', remarks: 'Lepidolite mica byproduct Li for Hero Vida scooter cells' },
  { id: 'LIX-0011', batchNo: 'LIX-B2411', extractMethod: 'DLE (Solvent Extraction)', source: 'Oilfield Brine', grade: 'Battery Grade', yieldTPD: 90, purity: 99.5, costPerTonne: 9000, status: 'Delivered', priority: 'High', origin: 'Mumbai (ONGC Offshore)', destination: 'Pune (Ather Supercell)', shipDate: '2026-07-15', transitDays: 1, zone: 'West', remarks: 'Oilfield co-produced brine Li for Ather S340 high-C cell' },
  { id: 'LIX-0012', batchNo: 'LIX-B2412', extractMethod: 'Clay Leaching', source: 'Laterite Clay', grade: 'Technical Grade', yieldTPD: 400, purity: 97.5, costPerTonne: 5800, status: 'Delayed', priority: 'Critical', origin: 'Koraput (Odisha Mining)', destination: 'Tiruvallur (Hyundai Motor)', shipDate: '2026-07-10', transitDays: 16, zone: 'East', remarks: 'Low-cost laterite clay Li for Hyundai Ioniq 5 India CKD battery' },
  { id: 'LIX-0013', batchNo: 'LIX-B2413', extractMethod: 'DLE (Adsorption)', source: 'Saline Lake', grade: 'Battery Grade', yieldTPD: 100, purity: 99.7, costPerTonne: 8200, status: 'In Transit', priority: 'High', origin: 'Sambhar (RSMML Phase-2)', destination: 'Bengaluru (TVS iCube)', shipDate: '2026-07-20', transitDays: 3, zone: 'North', remarks: 'Phase-2 DLE expansion Sambhar Lake TVS three-wheeler cells' },
  { id: 'LIX-0014', batchNo: 'LIX-B2414', extractMethod: 'Recycling (Hydromet)', source: 'Spent Battery', grade: 'Battery Grade', yieldTPD: 50, purity: 99.9, costPerTonne: 18000, status: 'Processing', priority: 'Medium', origin: 'Noida (Lohum Cleantech)', destination: 'Chennai (Exicom Recycle)', shipDate: '2026-07-25', transitDays: 2, zone: 'North', remarks: 'Hydrometallurgical battery recycling 99.9% Li recovery circular' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Extraction Method', key: 'extractMethod', options: [
    { value: 'DLE (Adsorption)', count: 3 }, { value: 'Hard Rock Mining', count: 3 }, { value: 'DLE (Ion Exchange)', count: 2 }, { value: 'DLE (Solvent Extraction)', count: 2 },
  ]},
  { label: 'Source', key: 'source', options: [
    { value: 'Brine', count: 4 }, { value: 'Spodumene', count: 1 }, { value: 'Sedimentary Clay', count: 1 }, { value: 'Geothermal Brine', count: 1 }, { value: 'Seawater', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 5 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 4 }, { value: 'North', count: 4 }, { value: 'East', count: 4 }, { value: 'South', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Li Extraction', color: 'text-teal-800' },
  { title: 'Combined Yield', value: '2,500 TPD', sub: 'All Methods', color: 'text-emerald-700' },
  { title: 'Avg Purity', value: '99.1%', sub: 'Battery Grade 99.5%+', color: 'text-green-700' },
  { title: 'National Target', value: '\u20b918,000Cr', sub: 'Critical Mineral Mission', color: 'text-lime-700' },
];

export default function LithiumExtractionLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.extractMethod} ${r.source} ${r.grade} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof LiRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const yieldByMethod = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.extractMethod.split(' ')[0], (map.get(r.extractMethod.split(' ')[0]) || 0) + r.yieldTPD); });
    return Array.from(map.entries()).map(([name, yieldTPD]) => ({ name, yieldTPD }));
  }, []);

  const sourceDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.source, (map.get(r.source) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { month: 'Jan', tpd: 800 }, { month: 'Feb', tpd: 1050 }, { month: 'Mar', tpd: 1200 }, { month: 'Apr', tpd: 1400 }, { month: 'May', tpd: 1800 }, { month: 'Jun', tpd: 2100 }, { month: 'Jul', tpd: 2500 },
  ], []);

  const costData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), cost: r.costPerTonne / 1000 }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const yieldByGrade = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.grade, (map.get(r.grade) || 0) + r.yieldTPD); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).map(([name, yieldTPD]) => ({ name, yieldTPD }));
  }, []);

  const COLORS = ['#0d9488', '#059669', '#65a30d', '#0891b2', '#7c3aed'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="lix-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Critical Minerals' }, { label: 'Lithium Extraction' }]} />
      <PageHeader title="Lithium Extraction Logistics" description="Indian Li supply chain \u2014 DLE adsorption, ion exchange, solvent extraction, hard rock mining, clay leaching, geothermal, seawater, and battery recycling for EV and energy storage" />

      <div className="lix-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="lix-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="lix-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`lix-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-teal-700 text-teal-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="lix-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="lix-chart-card"><CardHeader><CardTitle className="text-sm">Yield by Method (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={yieldByMethod}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="yieldTPD" fill="#0d9488" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="lix-chart-card"><CardHeader><CardTitle className="text-sm">Source Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={sourceDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0d9488" /><Cell fill="#059669" /><Cell fill="#65a30d" /><Cell fill="#0891b2" /><Cell fill="#7c3aed" /><Cell fill="#d97706" /><Cell fill="#dc2626" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="lix-chart-card"><CardHeader><CardTitle className="text-sm">Production Trend (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="tpd" stroke="#059669" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="lix-chart-card"><CardHeader><CardTitle className="text-sm">Cost per Tonne (x\u20b91K) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={costData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="cost" fill="#65a30d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="lix-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Method</th><th className="px-2 py-2 text-left">Source</th><th className="px-2 py-2 text-left">Grade</th><th className="px-2 py-2 text-right">TPD</th><th className="px-2 py-2 text-right">Pure%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`lix-table-row border-b hover:bg-teal-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.extractMethod}</td>
                  <td className="px-2 py-2 text-xs">{r.source}</td>
                  <td className="px-2 py-2 text-xs">{r.grade}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.yieldTPD}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.purity}</td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusBadge[r.status]}>{r.status}</Badge></td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusColor[r.priority]}>{r.priority}</Badge></td>
                  <td className="px-2 py-2 text-xs">{r.origin} \u2192 {r.destination}</td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="lix-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="lix-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0d9488" /><Cell fill="#059669" /><Cell fill="#65a30d" /><Cell fill="#0891b2" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="lix-chart-card"><CardHeader><CardTitle className="text-sm">Yield by Grade (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={yieldByGrade}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="yieldTPD" fill="#0d9488" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="lix-chart-card"><CardHeader><CardTitle className="text-sm">Purity vs Cost (Batch View)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), purity: r.purity, cost: r.costPerTonne / 100 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="purity" stroke="#059669" strokeWidth={2} name="Purity%" /><Line type="monotone" dataKey="cost" stroke="#65a30d" strokeWidth={2} name="Cost \u20b9x100" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="lix-chart-card"><CardHeader><CardTitle className="text-sm">Purity by Extraction Method (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [r.extractMethod.split(' ')[0], Math.max(...records.filter((x) => x.extractMethod.split(' ')[0] === r.extractMethod.split(' ')[0]).map((x) => x.purity))])).entries()).map(([name, purity]) => ({ name, purity }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[94, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="purity" fill="#0891b2" radius={[4,4,0,0]} name="Purity%" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="lix-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="lix-insight-card border-l-4 border-l-teal-700"><CardHeader><CardTitle className="text-sm text-teal-800">GSFC Kutch DLE: India&apos;s Largest Brine Lithium Plant</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GSFC Gujarat State Fertilizers commissioned 150TPD DLE adsorption plant (LIX-0001) at Rann of Kutch using indigenous aluminium oxide nanofiber sorbent developed by CSIR-CSMCRI Bhavnagar. Brine concentration: 800ppm Li from pre-concentrated Rann of Kutch evaporite. Adsorption capacity 12mg Li/g sorbent with 99.5% elution efficiency. Plant produces battery grade Li2CO3 at \u20b98,500/tonne — 40% cheaper than imported Chilean spodumene. GSFC targeting 500TPD by 2028 with Phase-2 expansion, servicing 3 GWh battery cell capacity for Gujarat EV cluster. Critical Mineral Mission allocated \u20b92,400Cr for Kutch lithium valley infrastructure including solar-powered evaporation ponds and rail siding for direct transport to cell manufacturers.</p></CardContent></Card>
          <Card className="lix-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: LIX-0005 and LIX-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">LIX-0005 (Jhabua MP Mining to Ola EV Hyderabad, 14-day delay): 300TPD sedimentary clay leaching plant awaiting Madhya Pradesh mining lease renewal — new Mineral Auction Rules 2026 requires environmental clearance for lithium-bearing clay classified as minor mineral. MP Mining Dept issued show-cause notice for accelerated lease. LIX-0012 (Koraput Odisha to Hyundai Tiruvallur, 16-day delay): 400TPD laterite clay lithium extraction — monsoon flooding disrupted road logistics on NH26. Odisha CMRF deployed NDRF for road restoration. Laterite clay grade at 97.5% purity adequate for Hyundai LFP chemistry requiring 99.2% post-refining. Hyundai India EV plant production loss: \u20b98Cr/day. Alternate sourcing from Bhilwara pegmatite route under negotiation.</p></CardContent></Card>
          <Card className="lix-insight-card border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm text-emerald-700">RSMML Sambhar Lake: Rajasthan&apos;s Lithium Crown Jewel</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Rajasthan State Mines and Minerals operates two DLE ion exchange plants at Sambhar Lake (LIX-0003: 80TPD, LIX-0013: 100TPD Phase-2) — India&apos;s largest lithium brine operation from inland saline lake. Sambhar brine: 600ppm Li concentration with seasonal variation 400-900ppm. CSIR-CIMFR Dhanbad developed selective Li-ion exchange resin with 15,000 cycle durability. Combined 180TPD output servicing Mahindra EV Bengaluru and TVS iCube Chennai battery cell lines. RSMML Phase-3 expansion to 500TPD approved under Critical Mineral Mission — \u20b91,800Cr investment. Sambhar Lake lithium corridor generating 12,000 direct and 45,000 indirect jobs. Rajasthan government declaring lithium processing as strategic industry with 15-year tax holiday.</p></CardContent></Card>
          <Card className="lix-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Lohum Battery Recycling: Circular Lithium Economy</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Lohum Cleantech Noida operates 50TPD hydrometallurgical battery recycling plant (LIX-0014) achieving 99.9% lithium recovery from spent EV and grid storage batteries — the highest purity of any Indian recycling operation. Lohum&apos;s proprietary organic acid leaching eliminates strong acid waste streams, reducing environmental impact by 90% vs conventional hydrometallurgy. Process recovers Li, Co, Ni, Mn simultaneously from NMC cathode scrap with 98% overall metal recovery. Supply chain: collection from Ola, Ather, Tata, Mahindra service centers across 28 cities via reverse logistics network. Output battery grade Li2CO3 at \u20b918,000/tonne — premium priced but offset by zero mining environmental cost. Lohum targeting 200TPD by 2028, servicing 10GWh annual battery recycling volume under Battery Waste Management Rules 2026 extended producer responsibility.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
