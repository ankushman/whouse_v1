'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface ManufacturingRecord {
  id: string;
  batchNo: string;
  cellType: string;
  electrolyte: string;
  energyDensity: number;
  cycleLife: number;
  capacity: number;
  yieldRate: number;
  temperature: string;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: ManufacturingRecord[] = [
  { id: 'SSB-0001', batchNo: 'SSB-B2401', cellType: 'Sulfide ASSB', electrolyte: 'Li6PS5Cl', energyDensity: 420, cycleLife: 1200, capacity: 50, yieldRate: 92.3, temperature: '<60\u00b0C', status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (IIT-M)', destination: 'Pune (Tata)', shipDate: '2026-07-20', transitDays: 3, zone: 'South', remarks: 'Pilot batch for EV platform' },
  { id: 'SSB-0002', batchNo: 'SSB-B2402', cellType: 'Oxide ASSB', electrolyte: 'LLZO', energyDensity: 380, cycleLife: 1500, capacity: 30, yieldRate: 88.7, temperature: '<80\u00b0C', status: 'Delivered', priority: 'High', origin: 'Hyderabad (ARCI)', destination: 'Mumbai (JSW)', shipDate: '2026-07-18', transitDays: 2, zone: 'West', remarks: 'LLZO pellet shipment' },
  { id: 'SSB-0003', batchNo: 'SSB-B2403', cellType: 'Polymer ASSB', electrolyte: 'PEO-LiTFSI', energyDensity: 300, cycleLife: 800, capacity: 20, yieldRate: 94.1, temperature: '<100\u00b0C', status: 'Processing', priority: 'Medium', origin: 'Chennai (SAC-ISRO)', destination: 'Gandhinagar (Reliance)', shipDate: '2026-07-22', transitDays: 5, zone: 'North', remarks: 'Flexible cell prototype' },
  { id: 'SSB-0004', batchNo: 'SSB-B2404', cellType: 'Halide ASSB', electrolyte: 'Li3YCl6', energyDensity: 350, cycleLife: 1000, capacity: 40, yieldRate: 86.5, temperature: '<70\u00b0C', status: 'Delayed', priority: 'Critical', origin: 'Kolkata (IISER)', destination: 'Delhi (Ola Electric)', shipDate: '2026-07-15', transitDays: 8, zone: 'East', remarks: 'Customs clearance pending' },
  { id: 'SSB-0005', batchNo: 'SSB-B2405', cellType: 'Sulfide ASSB', electrolyte: 'Li10GeP2S12', energyDensity: 450, cycleLife: 1400, capacity: 60, yieldRate: 90.0, temperature: '<50\u00b0C', status: 'In Transit', priority: 'High', origin: 'Mumbai (TIFR)', destination: 'Chennai (MG Motor)', shipDate: '2026-07-21', transitDays: 4, zone: 'South', remarks: 'LGPS crystal batch' },
  { id: 'SSB-0006', batchNo: 'SSB-B2406', cellType: 'Oxide ASSB', electrolyte: 'Garnet-NASICON', energyDensity: 400, cycleLife: 1600, capacity: 35, yieldRate: 91.2, temperature: '<90\u00b0C', status: 'Delivered', priority: 'Medium', origin: 'Pune (NCL)', destination: 'Bengaluru (Ather)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Hybrid electrolyte slab' },
  { id: 'SSB-0007', batchNo: 'SSB-B2407', cellType: 'Polymer ASSB', electrolyte: 'PVDF-HFP', energyDensity: 280, cycleLife: 700, capacity: 15, yieldRate: 95.8, temperature: '<120\u00b0C', status: 'Processing', priority: 'Low', origin: 'Ahmedabad (PRL)', destination: 'Kolkata (Exide)', shipDate: '2026-07-23', transitDays: 6, zone: 'West', remarks: 'Thin-film roll trial' },
  { id: 'SSB-0008', batchNo: 'SSB-B2408', cellType: 'Sulfide ASSB', electrolyte: 'Argyrodite', energyDensity: 430, cycleLife: 1350, capacity: 55, yieldRate: 89.4, temperature: '<55\u00b0C', status: 'In Transit', priority: 'High', origin: 'Bengaluru (IISc)', destination: 'Hyundai (Chennai)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'High-throughput pilot' },
  { id: 'SSB-0009', batchNo: 'SSB-B2409', cellType: 'Oxide ASSB', electrolyte: 'Li7La3Zr2O12', energyDensity: 390, cycleLife: 1700, capacity: 25, yieldRate: 87.9, temperature: '<85\u00b0C', status: 'Delivered', priority: 'Medium', origin: 'Delhi (IIT-D)', destination: 'Kochi (KITCO)', shipDate: '2026-07-16', transitDays: 7, zone: 'South', remarks: 'Dense ceramic disc' },
  { id: 'SSB-0010', batchNo: 'SSB-B2410', cellType: 'Halide ASSB', electrolyte: 'Li3InCl6', energyDensity: 340, cycleLife: 950, capacity: 45, yieldRate: 85.2, temperature: '<65\u00b0C', status: 'Processing', priority: 'Critical', origin: 'Kanpur (IIT-K)', destination: 'Noida (Samsung SDI)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: 'Scalable halide route' },
  { id: 'SSB-0011', batchNo: 'SSB-B2411', cellType: 'Sulfide ASSB', electrolyte: 'Li2S-P2S5', energyDensity: 410, cycleLife: 1100, capacity: 70, yieldRate: 93.1, temperature: '<60\u00b0C', status: 'In Transit', priority: 'High', origin: 'Mumbai (BARC)', destination: 'Gurgaon (Maruti)', shipDate: '2026-07-20', transitDays: 3, zone: 'North', remarks: 'Glass-ceramic electrolyte' },
  { id: 'SSB-0012', batchNo: 'SSB-B2412', cellType: 'Polymer ASSB', electrolyte: 'Ionic Liquid-Gel', energyDensity: 260, cycleLife: 600, capacity: 10, yieldRate: 96.3, temperature: '<130\u00b0C', status: 'Delivered', priority: 'Low', origin: 'Thiruvananthapuram (VSSC)', destination: 'Bhopal (Epsilon)', shipDate: '2026-07-14', transitDays: 9, zone: 'Central', remarks: 'Space-rated cell sample' },
  { id: 'SSB-0013', batchNo: 'SSB-B2413', cellType: 'Oxide ASSB', electrolyte: 'Al-doped LLZO', energyDensity: 395, cycleLife: 1550, capacity: 32, yieldRate: 89.8, temperature: '<75\u00b0C', status: 'Delayed', priority: 'High', origin: 'Coimbatore (PSG Tech)', destination: 'Tata Motors (Pune)', shipDate: '2026-07-12', transitDays: 12, zone: 'South', remarks: 'Al-stabilized garnet batch' },
  { id: 'SSB-0014', batchNo: 'SSB-B2414', cellType: 'Sulfide ASSB', electrolyte: 'Li6PS5Br', energyDensity: 440, cycleLife: 1250, capacity: 48, yieldRate: 91.7, temperature: '<50\u00b0C', status: 'In Transit', priority: 'Medium', origin: 'Guwahati (IIT-G)', destination: 'Bhubaneswar (NALCO)', shipDate: '2026-07-22', transitDays: 4, zone: 'East', remarks: 'Bromide variant test' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Cell Type', key: 'cellType', options: [
    { value: 'Sulfide ASSB', count: 5 }, { value: 'Oxide ASSB', count: 4 }, { value: 'Polymer ASSB', count: 3 }, { value: 'Halide ASSB', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 5 }, { value: 'West', count: 3 }, { value: 'North', count: 3 }, { value: 'East', count: 2 }, { value: 'Central', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Active Shipments', color: 'text-blue-700' },
  { title: 'Avg Energy Density', value: '382 Wh/kg', sub: 'Sulfide Leading', color: 'text-emerald-700' },
  { title: 'Avg Yield Rate', value: '90.4%', sub: 'Target 95%', color: 'text-purple-700' },
  { title: 'Total Capacity', value: '540 Ah', sub: 'Across All Batches', color: 'text-orange-700' },
];

export default function SolidStateBatteryManufacturingLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.cellType} ${r.electrolyte} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof ManufacturingRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const cellTypeData = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.cellType.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.energyDensity); });
    return Array.from(map.entries()).map(([name, energy]) => ({ name, energy }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const yieldTrend = useMemo(() => [
    { month: 'Jan', yield: 82 }, { month: 'Feb', yield: 85 }, { month: 'Mar', yield: 87 }, { month: 'Apr', yield: 88 }, { month: 'May', yield: 90 }, { month: 'Jun', yield: 91 }, { month: 'Jul', yield: 90 },
  ], []);

  const capacityByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.cellType.split(' ')[0], (map.get(r.cellType.split(' ')[0]) || 0) + r.capacity); });
    return Array.from(map.entries()).map(([name, capacity]) => ({ name, capacity }));
  }, []);

  const cycleLifeData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-3), cycles: r.cycleLife }));
  }, []);

  const priorityDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.priority, (map.get(r.priority) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const temperatureData = useMemo(() => {
    return records.slice(0, 7).map((r) => ({ name: r.batchNo.slice(-2), maxTemp: parseInt(r.temperature.replace(/[^\d]/g, '')) || 60 }));
  }, []);

  const COLORS = ['#1e3a5f', '#2d6a4f', '#7c2d12', '#581c87', '#0c4a6e'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="ssb-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Manufacturing' }, { label: 'Solid-State Battery' }]} />
      <PageHeader title="Solid-State Battery Manufacturing Logistics" description="Indian ASSB supply chain \u2014 Sulfide, Oxide, Polymer & Halide electrolyte cell tracking" />

      <div className="ssb-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="ssb-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="ssb-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`ssb-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="ssb-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="ssb-chart-card"><CardHeader><CardTitle className="text-sm">Energy Density by Cell Type (Wh/kg)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={cellTypeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="energy" fill="#1e3a5f" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ssb-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#1e3a5f" /><Cell fill="#2d6a4f" /><Cell fill="#7c2d12" /><Cell fill="#581c87" /><Cell fill="#0c4a6e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="ssb-chart-card"><CardHeader><CardTitle className="text-sm">Manufacturing Yield Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={yieldTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[75, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="yield" stroke="#2d6a4f" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ssb-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Cell Type (Ah)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacity" fill="#2d6a4f" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="ssb-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Cell Type</th><th className="px-2 py-2 text-left">Electrolyte</th><th className="px-2 py-2 text-right">Wh/kg</th><th className="px-2 py-2 text-right">Cycles</th><th className="px-2 py-2 text-right">Yield</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`ssb-table-row border-b hover:bg-blue-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.cellType}</td>
                  <td className="px-2 py-2 text-xs font-mono">{r.electrolyte}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.energyDensity}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.cycleLife}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.yieldRate}%</td>
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
        <div className="ssb-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="ssb-chart-card"><CardHeader><CardTitle className="text-sm">Cycle Life by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={cycleLifeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="cycles" fill="#581c87" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ssb-chart-card"><CardHeader><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#2563eb" /><Cell fill="#16a34a" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="ssb-chart-card"><CardHeader><CardTitle className="text-sm">Operating Temperature Range (\u00b0C)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={temperatureData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="maxTemp" fill="#7c2d12" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ssb-chart-card"><CardHeader><CardTitle className="text-sm">Energy Density vs Cycle Life</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-3), energy: r.energyDensity, cycles: r.cycleLife }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="energy" stroke="#1e3a5f" strokeWidth={2} name="Wh/kg" /><Line type="monotone" dataKey="cycles" stroke="#581c87" strokeWidth={2} name="Cycles" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="ssb-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ssb-insight-card border-l-4 border-l-blue-500"><CardHeader><CardTitle className="text-sm text-blue-700">Sulfide Electrolyte Dominance</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Sulfide-based ASSBs (Li6PS5Cl, LGPS, Argyrodite) lead with 420\u2013450 Wh/kg energy density and 1200+ cycle life. IIT-M Bengaluru and TIFR Mumbai are primary sourcing nodes. Transit reliability: 92% on-time. Key bottleneck: moisture sensitivity requires nitrogen-packed shipping containers adding \u20b94L per batch.</p></CardContent></Card>
          <Card className="ssb-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">Yield Rate Improvement Path</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Average yield 90.4% against 95% target. Polymer cells achieve highest yield (95.8%) but lowest density. Oxide cells show most variance (85\u201394%) due to sintering inconsistencies at NCL Pune. Recommended: invest in dry-room upgrades at Hyderabad ARCI \u2014 \u20b950Cr capex for 3ppm humidity control, projected yield uplift 2.5%.</p></CardContent></Card>
          <Card className="ssb-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Delayed Shipment Alert: SSB-0004 & SSB-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Two batches face delays. SSB-0004 (Kolkata\u2192Delhi) held 8 days at customs for Halide electrolyte classification review. SSB-0013 (Coimbatore\u2192Pune) delayed 12 days due to Al-doped LLZO quality re-inspection. Financial impact: \u20b918L demurrage per batch. Recommend pre-clearance documentation for novel electrolyte compositions.</p></CardContent></Card>
          <Card className="ssb-insight-card border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm text-purple-700">India ASSB Scale-Up Roadmap</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">National Battery Mission target: 100GWh by 2030. Current pipeline: Tata 20GWh (Pune), Reliance 10GWh (Jamnagar), JSW 5GWh (Mumbai). ASSB transition expected by 2028 for premium EV segment. Government PLI incentive: \u20b918,000Cr for advanced cell chemistry. Research spending: \u20b93,200Cr across IIT system for solid electrolyte development.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
