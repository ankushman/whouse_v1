'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface GSRecord {
  id: string;
  batchNo: string;
  steelProcess: string;
  reductionAgent: string;
  product: string;
  capacityMTPA: number;
  carbonIntensity: number;
  energyGJ: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: GSRecord[] = [
  { id: 'GS-0001', batchNo: 'GS-S2401', steelProcess: 'DRI-EAF (H2 Direct)', reductionAgent: 'Green Hydrogen', product: 'Hot-Rolled Coil (HRC)', capacityMTPA: 2.5, carbonIntensity: 0.4, energyGJ: 12, status: 'In Transit', priority: 'Critical', origin: 'Kalinganagar (JSW Green)', destination: 'Jamshedpur (Tata Auto)', shipDate: '2026-07-20', transitDays: 3, zone: 'East', remarks: '2.5 MTPA H2-DRI electric arc furnace hot-rolled coil for Tata Jamshedpur automotive sheet &#8212; 0.4 tCO2/tonne 95% emission cut' },
  { id: 'GS-0002', batchNo: 'GS-S2402', steelProcess: 'BF-BOF (CCS Retrofit)', reductionAgent: 'Coal + CCS Capture', product: 'Steel Slab', capacityMTPA: 4.0, carbonIntensity: 0.8, energyGJ: 18, status: 'Delivered', priority: 'High', origin: 'Rourkela (SAIL CCS)', destination: 'Bokaro (SAIL Plate)', shipDate: '2026-07-18', transitDays: 2, zone: 'East', remarks: '4.0 MTPA blast furnace CCS retrofit steel slab for SAIL Bokaro heavy plate &#8212; 0.8 tCO2/tonne 70% capture rate' },
  { id: 'GS-0003', batchNo: 'GS-S2403', steelProcess: 'DRI-EAF (NG Based)', reductionAgent: 'Natural Gas + CCS', product: 'Wire Rod', capacityMTPA: 1.8, carbonIntensity: 0.6, energyGJ: 14, status: 'Processing', priority: 'High', origin: 'Hazira (Essar Steel)', destination: 'Mumbai (Godrej Appliance)', shipDate: '2026-07-23', transitDays: 1, zone: 'West', remarks: '1.8 MTPA NG-DRI EAF wire rod for Godrej Mumbai appliance motor core &#8212; 0.6 tCO2/tonne with amine CCS' },
  { id: 'GS-0004', batchNo: 'GS-S2404', steelProcess: 'Electric Arc Furnace (Scrap)', reductionAgent: 'Recycled Steel Scrap', product: 'Rebar (TMT)', capacityMTPA: 3.0, carbonIntensity: 0.3, energyGJ: 6, status: 'In Transit', priority: 'Critical', origin: 'Raigarh (Shyam Steel)', destination: 'Lucknow (UP Bridge Auth)', shipDate: '2026-07-19', transitDays: 3, zone: 'North', remarks: '3.0 MTPA scrap-EAF TMT rebar for UP Bridge Authority infrastructure &#8212; 0.3 tCO2/tonne 100% scrap feed' },
  { id: 'GS-0005', batchNo: 'GS-S2405', steelProcess: 'HISMELT (Smelt Reduction)', reductionAgent: 'Coal + Biomass Blend', product: 'Billets', capacityMTPA: 1.5, carbonIntensity: 1.1, energyGJ: 16, status: 'Delayed', priority: 'Medium', origin: 'Vizag (RINL HISMELT)', destination: 'Chennai (SRF Tubes)', shipDate: '2026-07-12', transitDays: 14, zone: 'South', remarks: '1.5 MTPA HISMELT coal-biomass billets for SRF Chennai ERW tubes &#8212; 1.1 tCO2/tonne biomass 30% blend delay' },
  { id: 'GS-0006', batchNo: 'GS-S2406', steelProcess: 'DRI-EAF (H2 Direct)', reductionAgent: 'Green Hydrogen', product: 'Cold-Rolled Coil (CRC)', capacityMTPA: 2.0, carbonIntensity: 0.35, energyGJ: 11, status: 'Delivered', priority: 'High', origin: 'Mundra (Adani Green Steel)', destination: 'Pune (Bajaj Auto)', shipDate: '2026-07-16', transitDays: 2, zone: 'West', remarks: '2.0 MTPA H2-DRI CRC for Bajaj Pune two-wheeler body panels &#8212; 0.35 tCO2/tonne IF steel grade' },
  { id: 'GS-0007', batchNo: 'GS-S2407', steelProcess: 'BF-BOF (Top Gas Recycling)', reductionAgent: 'BF Gas + CCS', product: 'Rail Steel', capacityMTPA: 1.2, carbonIntensity: 0.9, energyGJ: 19, status: 'In Transit', priority: 'High', origin: 'Bhilai (SAIL BTR)', destination: 'Delhi (DFCCIL Rail)', shipDate: '2026-07-21', transitDays: 2, zone: 'North', remarks: '1.2 MTPA BF top-gas-recycling rail steel for DFCCIL Dedicated Freight Corridor &#8212; R260 grade 880MPa' },
  { id: 'GS-0008', batchNo: 'GS-S2408', steelProcess: 'EAF (Scrap + DRI Mix)', reductionAgent: 'Scrap + H2-DRI 50%', product: 'Structural Steel', capacityMTPA: 2.8, carbonIntensity: 0.45, energyGJ: 9, status: 'Delivered', priority: 'Medium', origin: 'Ludhiana (Vardhman Steel)', destination: 'Chandigarh (L&amp;T Construction)', shipDate: '2026-07-15', transitDays: 1, zone: 'North', remarks: '2.8 MTPA scrap+H2-DRI mix EAF structural steel for L&amp;T Chandigarh high-rise &#8212; S355 grade 0.45 tCO2' },
  { id: 'GS-0009', batchNo: 'GS-S2409', steelProcess: 'Electrolysis (Electrowinning)', reductionAgent: 'Electric Current', product: 'Specialty Alloy', capacityMTPA: 0.08, carbonIntensity: 0.1, energyGJ: 25, status: 'Processing', priority: 'High', origin: 'Hyderabad (DRDO DMRL)', destination: 'Bengaluru (HAL Aerospace)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: '80,000 TPA electrolytic iron for HAL Bengaluru aerospace-grade maraging steel &#8212; 0.1 tCO2/tonne near-zero' },
  { id: 'GS-0010', batchNo: 'GS-S2410', steelProcess: 'DRI-EAF (H2 Direct)', reductionAgent: 'Green Hydrogen', product: 'Galvanized Sheet', capacityMTPA: 1.5, carbonIntensity: 0.38, energyGJ: 13, status: 'In Transit', priority: 'High', origin: 'Kalinganagar (JSW Green)', destination: 'Gurgaon (Maruti Suzuki)', shipDate: '2026-07-22', transitDays: 2, zone: 'North', remarks: '1.5 MTPA H2-DRI galvanized sheet for Maruti Gurgaon car body &#8212; 0.38 tCO2/tonne BH grade coating' },
  { id: 'GS-0011', batchNo: 'GS-S2411', steelProcess: 'BF-BOF (CCS Retrofit)', reductionAgent: 'Coal + Oxy-Fuel CCS', product: 'Plate Steel', capacityMTPA: 3.5, carbonIntensity: 0.75, energyGJ: 17, status: 'Delivered', priority: 'Medium', origin: 'Jamshedpur (Tata CCS)', destination: 'Kolkata (Kolkata Port)', shipDate: '2026-07-17', transitDays: 1, zone: 'East', remarks: '3.5 MTPA oxy-fuel CCS plate for Kolkata Port shipbuilding &#8212; DH36 grade 0.75 tCO2/tonne' },
  { id: 'GS-0012', batchNo: 'GS-S2412', steelProcess: 'EAF (100% Scrap)', reductionAgent: 'Recycled Steel Scrap', product: 'Angle/Channel', capacityMTPA: 1.0, carbonIntensity: 0.25, energyGJ: 5, status: 'Delayed', priority: 'Low', origin: 'Mumbai (Kalyani Steel)', destination: 'Nagpur (MOIL Manganese)', shipDate: '2026-07-10', transitDays: 16, zone: 'West', remarks: '1.0 MTPA 100% scrap EAF angle/channel for MOIL Nagpur manganese mine structures &#8212; scrap supply chain delay' },
  { id: 'GS-0013', batchNo: 'GS-S2413', steelProcess: 'DRI-EAF (Biomass)', reductionAgent: 'Biochar Reductant', product: 'Pig Iron', capacityMTPA: 0.5, carbonIntensity: 0.5, energyGJ: 15, status: 'In Transit', priority: 'Critical', origin: 'Raipur (IARI Biochar)', destination: 'Durg (Bhilai Sponge)', shipDate: '2026-07-20', transitDays: 1, zone: 'East', remarks: '500,000 TPA biochar-reduced DRI pig iron for Bhilai steelworks &#8212; 0.5 tCO2/tonne carbon-negative credit eligible' },
  { id: 'GS-0014', batchNo: 'GS-S2414', steelProcess: 'Flash Ironmaking (Hydrogen)', reductionAgent: 'Green Hydrogen', product: 'Direct Reduced Iron', capacityMTPA: 1.0, carbonIntensity: 0.3, energyGJ: 10, status: 'Processing', priority: 'Critical', origin: 'Pune (Tata Steel R&amp;D)', destination: 'Kalinganagar (JSW Flash)', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: '1.0 MTPA Tata-developed flash ironmaking pilot &#8212; H2-based suspension reduction at 1,200C 0.3 tCO2/tonne DRI' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Steel Process', key: 'steelProcess', options: [
    { value: 'DRI-EAF (H2 Direct)', count: 4 }, { value: 'BF-BOF (CCS Retrofit)', count: 2 }, { value: 'Electric Arc Furnace (Scrap)', count: 1 }, { value: 'HISMELT (Smelt Reduction)', count: 1 },
  ]},
  { label: 'Product', key: 'product', options: [
    { value: 'Hot-Rolled Coil (HRC)', count: 1 }, { value: 'Steel Slab', count: 1 }, { value: 'Wire Rod', count: 1 }, { value: 'Rebar (TMT)', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 5 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'East', count: 5 }, { value: 'North', count: 4 }, { value: 'West', count: 3 }, { value: 'South', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Shipments', value: 14, sub: 'Green Steel Batches', color: 'text-lime-800' },
  { title: 'Total Capacity', value: '25.88 MTPA', sub: 'Green Steel Output', color: 'text-green-700' },
  { title: 'Lowest Carbon', value: '0.1 tCO2/t', sub: 'Electrolytic Iron', color: 'text-emerald-700' },
  { title: 'National Target', value: '\u20b935,000Cr', sub: 'Green Steel Mission', color: 'text-lime-700' },
];

export default function GreenSteelLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.steelProcess} ${r.reductionAgent} ${r.product} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof GSRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByProcess = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.steelProcess.split('(')[0].trim(); map.set(s, (map.get(s) || 0) + r.capacityMTPA); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, capacityMTPA]) => ({ name: name.slice(0, 16), capacityMTPA }));
  }, []);

  const agentDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.reductionAgent, (map.get(r.reductionAgent) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.slice(0, 20), value }));
  }, []);

  const marketTrend = useMemo(() => [
    { year: '2022', mtpa: 2.0 }, { year: '2023', mtpa: 5.5 }, { year: '2024', mtpa: 14 }, { year: '2025', mtpa: 32 }, { year: '2026', mtpa: 65 }, { year: '2027', mtpa: 130 }, { year: '2028', mtpa: 280 },
  ], []);

  const carbonData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), carbon: r.carbonIntensity }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const intensityByAgent = useMemo(() => {
    return Array.from(new Map(records.map((r) => [r.reductionAgent.split(' ').slice(0, 2).join(' '), { name: r.reductionAgent.split(' ').slice(0, 2).join(' '), carbon: r.carbonIntensity }])).entries()).reduce((acc, [, v]) => { const e = acc.find((a) => a.name === v.name); if (e) e.carbon = Math.min(e.carbon, v.carbon); else acc.push({...v}); return acc; }, [] as { name: string; carbon: number }[]).sort((a, b) => a.carbon - b.carbon).slice(0, 6);
  }, []);

  const COLORS = ['#65a30d', '#4d7c0f', '#3f6212', '#365314', '#84cc16', '#a3e635'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="gs-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Green Manufacturing' }, { label: 'Green Steel' }]} />
      <PageHeader title="Green Steel Logistics" description="Indian green steel supply chain &#8212; H2-DRI electric arc furnace, blast furnace CCS retrofit oxy-fuel capture, scrap-based EAF recycling, HISMELT smelt reduction biomass blend, biochar reductant DRI, flash ironmaking hydrogen suspension, electrolytic electrowinning iron for automotive rail shipbuilding infrastructure aerospace applications under National Green Steel Mission" />

      <div className="gs-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="gs-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="gs-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`gs-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-lime-700 text-lime-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="gs-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="gs-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Process (MTPA)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByProcess}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityMTPA" fill="#65a30d" radius={[4,4,0,0]} name="MTPA" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="gs-chart-card"><CardHeader><CardTitle className="text-sm">Reduction Agent Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={agentDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name.slice(0,12)} ${(percent * 100).toFixed(0)}%`}><Cell fill="#65a30d" /><Cell fill="#4d7c0f" /><Cell fill="#3f6212" /><Cell fill="#365314" /><Cell fill="#84cc16" /><Cell fill="#a3e635" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="gs-chart-card"><CardHeader><CardTitle className="text-sm">India Green Steel Growth (MTPA/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={marketTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="mtpa" stroke="#84cc16" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="gs-chart-card"><CardHeader><CardTitle className="text-sm">Carbon Intensity (tCO2/tonne) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={carbonData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="carbon" fill="#4d7c0f" radius={[4,4,0,0]} name="tCO2/t" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="gs-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Process</th><th className="px-2 py-2 text-left">Product</th><th className="px-2 py-2 text-right">MTPA</th><th className="px-2 py-2 text-right">tCO2/t</th><th className="px-2 py-2 text-right">GJ/t</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`gs-table-row border-b hover:bg-lime-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.steelProcess.split('(')[0].trim()}</td>
                  <td className="px-2 py-2 text-xs">{r.product}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityMTPA}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.carbonIntensity}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.energyGJ}</td>
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
        <div className="gs-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="gs-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#65a30d" /><Cell fill="#4d7c0f" /><Cell fill="#3f6212" /><Cell fill="#365314" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="gs-chart-card"><CardHeader><CardTitle className="text-sm">Min Carbon Intensity by Reduction Agent</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={intensityByAgent}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="carbon" fill="#65a30d" radius={[4,4,0,0]} name="tCO2/t" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="gs-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Carbon Intensity</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), mtpa: r.capacityMTPA, carbon: r.carbonIntensity }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="mtpa" stroke="#65a30d" strokeWidth={2} name="MTPA" /><Line type="monotone" dataKey="carbon" stroke="#84cc16" strokeWidth={2} name="tCO2/t" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="gs-chart-card"><CardHeader><CardTitle className="text-sm">Energy Intensity (GJ/t) Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={records.sort((a, b) => a.energyGJ - b.energyGJ).slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), energy: r.energyGJ }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="energy" fill="#4d7c0f" radius={[4,4,0,0]} name="GJ/t" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="gs-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="gs-insight-card border-l-4 border-l-lime-700"><CardHeader><CardTitle className="text-sm text-lime-800">India Green Steel Mission: 280 MTPA by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Ministry of Steel National Green Steel Mission targeting 280 million tonnes per annum near-zero carbon steel production by 2028, achieving 40% reduction in sector emissions from current 2.6 tCO2/tonne BF-BOF average. India is world&apos;s 2nd largest steel producer at 140 MTPA crude steel. Phase-1 (2024-2026): 65 MTPA green steel focusing on H2-DRI-EAF route at JSW Kalinganagar (GS-0001, 2.5 MTPA), Adani Mundra (GS-0006, 2.0 MTPA), and Tata Steel flash ironmaking pilot (GS-0014, 1.0 MTPA). Green hydrogen supply: 5 million tonnes/year H2 required at &#8377;280/kg from NTPC-Adani-Reliance electrolyzers, transported via GAIL H2 pipeline at 60-100 bar. Phase-2 (2026-2028): 215 MTPA expansion including BF-CCS retrofits at SAIL Rourkela (GS-0002), Tata Jamshedpur (GS-0011), and RINL Vizag, plus scrap-EAF expansion at Shyam Steel (GS-0004), Kalyani (GS-0012), and Vardhman (GS-0008). Total investment &#8377;35,000Cr with &#8377;15,000Cr Production-Linked Incentive (PLI) for green steel, &#8377;12,000Cr H2 infrastructure, and &#8377;8,000Cr industry equity. EU CBAM impact: Indian steel exports to EU face &#8377;4,800/tonne carbon border tax from 2026, making green steel at 0.3-0.4 tCO2/tonne economically essential for &#8377;42,000Cr annual EU steel export market.</p></CardContent></Card>
          <Card className="gs-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: GS-0005 and GS-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GS-0005 (RINL Vizag to SRF Chennai, 14-day delay): 1.5 MTPA HISMELT coal-biomass blend billets &#8212; biomass feed (eucalyptus wood chips) from ITC Bhadrachalam paper mill showing inconsistent moisture content 35-55% (spec max 25%) causing variable HISMELT smelt reduction furnace temperature fluctuation by 120C and pig iron quality grade drift from 94% Fe to 89% Fe. RINL Vizag installing online biomass moisture sensor (NIR type) from Metso India at &#8377;4.5Cr and biomass pre-drying rotary drum at &#8377;8Cr. SRF Chennai ERW tube production impacted: 30% reduction in API 5L Grade B pipe output for ONGC Mumbai offshore pipeline project. EAF scrap interim substitute at 25% premium cost &#8377;3,500/tonne vs HISMELT &#8377;2,800/tonne. GS-0012 (Kalyani Mumbai to MOIL Nagpur, 16-day delay): 1.0 MTPA 100% scrap EAF angle/channel &#8212; scrap supply chain disruption from Tata Steel Jamshedpur shiploader breakdown for 12 days limiting scrap export from captive electric furnace melting shop. Kalyani sourcing emergency scrap from Shree Odisha and Mahindra Susten solar panel recycling at &#8377;33,000/tonne vs normal &#8377;28,000/tonne. MOIL Nagpur manganese mine expansion structures delayed 16 days affecting underground Level-3 development by 4,200 tonnes ore/month at &#8377;12,000/tonne.</p></CardContent></Card>
          <Card className="gs-insight-card border-l-4 border-l-green-600"><CardHeader><CardTitle className="text-sm text-green-700">JSW Kalinganagar: India&apos;s Largest H2-DRI Plant</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GS-0001: JSW Steel Kalinganagar Odisha operating 2.5 MTPA H2-DRI electric arc furnace, India&apos;s largest commercial-scale green hydrogen steel plant. Midrex H2-DRI shaft furnace: 2.5 MTPA direct reduced iron at 1,050C using 90% green H2 + 10% NG reducing gas mixture from Adani Kutch 10 MW electrolyzer pipeline transport via GAIL 650km H2 trunk at 60 bar. DRI output fed to 200 tonne ultra-high-power EAF with bottom stirring and ladle furnace refining producing automotive-grade IF (interstitial-free) steel at 0.4 tCO2/tonne vs conventional BF-BOF at 2.2 tCO2/tonne &#8212; 82% emission reduction. H2 consumption: 55 kg H2/tonne DRI at &#8377;280/kg = &#8377;15,400/tonne DRI reductant cost vs &#8377;8,500/tonne for natural gas (but 90% lower carbon). JSW planning Phase-2 expansion to 5.0 MTPA H2-DRI by 2027 with on-site 50 MW alkaline electrolyzer from Thyssenkrupp Nucera. Hot-rolled coil downstream: continuous pickling, tandem cold mill, galvanizing, and coil coating lines producing automotive outer panel BH (bake hardening) grade for Tata Maruti Hyundai. India&apos;s automotive steel market 22 MTPA requiring ultra-low carbon IF steel &#8214; JSW targeting 40% market share of green automotive steel by 2028. Capital expenditure: &#8377;8,500Cr for Phase-1 including Midrex reactor (&#8377;3,200Cr), EAF (&#8377;1,800Cr), H2 pipeline connection (&#8377;1,200Cr), and rolling mills (&#8377;2,300Cr).</p></CardContent></Card>
          <Card className="gs-insight-card border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm text-emerald-700">Scrap-EAF: India&apos;s Lowest-Carbon Steel Route</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GS-0004 + GS-0012: Scrap-based electric arc furnace producing India&apos;s lowest-carbon structural steel at 0.25-0.3 tCO2/tonne using 100% recycled steel scrap feedstock. Shyam Steel Raigarh 3.0 MTPA (GS-0004) and Kalyani Steel Mumbai 1.0 MTPA (GS-0012) operating twin-shell 80-tonne EAFs with eccentric bottom tapping (EBT) and 35 MVA transformer. India&apos;s steel scrap availability: 25 million tonnes/year from end-of-life vehicles, construction demolition, shipbreaking Alang-Sosiya (7 MTPA &#8212; world&apos;s largest), and appliance recycling. Energy: 400-500 kWh/tonne (5-6 GJ/tonne) vs BF-BOF at 18-20 GJ/tonne &#8212; 70% lower energy consumption. Cost: &#8377;38,000/tonne finished rebar vs &#8377;42,000/tonne BF-BOF rebar at current scrap price &#8377;28,000/tonne. India targeting 60% scrap-based EAF production by 2035 (current 28%), requiring 75 MTPA scrap supply. Policy: Ministry of Steel mandating 15% minimum scrap utilization in all new steel projects under Steel Scrap Recycling Policy 2024. BIS quality: EAF rebar meeting IS 1786 Fe500D grade for seismic-zone construction. Shyam Steel supplying UP Bridge Authority DFCCIL rail infrastructure projects with TMT rebar at 0.3 tCO2/tonne &#8214; first green-steel-certified infrastructure material in India under GreenPro certification from CII-Godrej GBC.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
