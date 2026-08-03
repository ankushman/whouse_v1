'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface VRFBRecord {
  id: string;
  batchNo: string;
  systemType: string;
  electrolyte: string;
  application: string;
  capacityMWh: number;
  powerMW: number;
  efficiency: number;
  cycleLife: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: VRFBRecord[] = [
  { id: 'VRB-0001', batchNo: 'VRB-B2401', systemType: 'All-Vanadium', electrolyte: 'VOSO4/V2(SO4)3', application: 'Grid Scale Storage', capacityMWh: 50, powerMW: 10, efficiency: 75, cycleLife: 20000, status: 'In Transit', priority: 'Critical', origin: 'Mumbai (L&T Energy)', destination: 'Bhadla (Adani Solar Park)', shipDate: '2026-07-20', transitDays: 4, zone: 'West', remarks: 'Rajasthan 50MWh solar smoothing' },
  { id: 'VRB-0002', batchNo: 'VRB-B2402', systemType: 'V-Iron Hybrid', electrolyte: 'VCl3/FeCl2', application: 'Industrial UPS', capacityMWh: 8, powerMW: 2, efficiency: 72, cycleLife: 15000, status: 'Delivered', priority: 'High', origin: 'Bengaluru (IISc)', destination: 'Hosur (TVS Factory)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Factory power backup 2MW/8MWh' },
  { id: 'VRB-0003', batchNo: 'VRB-B2403', systemType: 'All-Vanadium', electrolyte: 'VOSO4/V2(SO4)3', application: 'Telecom Tower', capacityMWh: 1, powerMW: 0.05, efficiency: 78, cycleLife: 25000, status: 'Processing', priority: 'Medium', origin: 'Hyderabad (CSIR-IICT)', destination: 'Guwahati (Airtel NE)', shipDate: '2026-07-22', transitDays: 4, zone: 'South', remarks: 'NE tower 50kW DC backup 48hr' },
  { id: 'VRB-0004', batchNo: 'VRB-B2404', systemType: 'Vanadium-Bromine', electrolyte: 'VBr3/NaBr', application: 'Microgrid Island', capacityMWh: 20, powerMW: 5, efficiency: 70, cycleLife: 18000, status: 'Delayed', priority: 'Critical', origin: 'Kochi (V-Guard Energy)', destination: 'Lakshadweep (ANIL Power)', shipDate: '2026-07-14', transitDays: 12, zone: 'South', remarks: 'Island desalination VRB storage' },
  { id: 'VRB-0005', batchNo: 'VRB-B2405', systemType: 'All-Vanadium', electrolyte: 'VOSO4/V2(SO4)3', application: 'EV Charging Hub', capacityMWh: 5, powerMW: 1, efficiency: 76, cycleLife: 22000, status: 'In Transit', priority: 'High', origin: 'Pune (Tata Power)', destination: 'Mumbai (Tata EV Charging)', shipDate: '2026-07-21', transitDays: 2, zone: 'West', remarks: 'Fast charging peak shaving 1MW' },
  { id: 'VRB-0006', batchNo: 'VRB-B2406', systemType: 'Organic VRFB', electrolyte: 'Quinone/TEMPO', application: 'Data Center UPS', capacityMWh: 15, powerMW: 3, efficiency: 68, cycleLife: 12000, status: 'Delivered', priority: 'High', origin: 'Chennai (Reliance Jio)', destination: 'Noida (AWS DC)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: 'DC 99.999% uptime 4hr backup' },
  { id: 'VRB-0007', batchNo: 'VRB-B2407', systemType: 'V-Iron Hybrid', electrolyte: 'VCl3/FeCl2', application: 'Railway Substation', capacityMWh: 30, powerMW: 8, efficiency: 73, cycleLife: 16000, status: 'Processing', priority: 'Medium', origin: 'Kolkata (RCF Railways)', destination: 'Kanpur (NR Railways)', shipDate: '2026-07-23', transitDays: 2, zone: 'East', remarks: 'Railway regenerative braking capture' },
  { id: 'VRB-0008', batchNo: 'VRB-B2408', systemType: 'All-Vanadium', electrolyte: 'VOSO4/V2(SO4)3', application: 'Military Forward Base', capacityMWh: 2, powerMW: 0.5, efficiency: 77, cycleLife: 20000, status: 'In Transit', priority: 'Critical', origin: 'Pune (BEL Defense)', destination: 'Leh (14 Corps HQ)', shipDate: '2026-07-19', transitDays: 6, zone: 'West', remarks: 'High-altitude base microgrid -20C operation' },
  { id: 'VRB-0009', batchNo: 'VRB-B2409', systemType: 'Vanadium-Bromine', electrolyte: 'VBr3/NaBr', application: 'Wind Farm Storage', capacityMWh: 40, powerMW: 10, efficiency: 71, cycleLife: 18000, status: 'Delivered', priority: 'High', origin: 'Coimbatore (Gamesa India)', destination: 'Jaisalmer (NTPC Wind)', shipDate: '2026-07-16', transitDays: 5, zone: 'South', remarks: 'Rajasthan wind 4hr duration smoothing' },
  { id: 'VRB-0010', batchNo: 'VRB-B2410', systemType: 'All-Vanadium', electrolyte: 'VOSO4/V2(SO4)3', application: 'Hospital Emergency', capacityMWh: 0.5, powerMW: 0.25, efficiency: 79, cycleLife: 25000, status: 'Processing', priority: 'Medium', origin: 'Bengaluru (Exicom Power)', destination: 'Bhopal (AIIMS Hospital)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: 'ICU critical power 8hr backup' },
  { id: 'VRB-0011', batchNo: 'VRB-B2411', systemType: 'Organic VRFB', electrolyte: 'Alloxazine/Viologen', application: 'University Research', capacityMWh: 0.1, powerMW: 0.01, efficiency: 65, cycleLife: 8000, status: 'In Transit', priority: 'Low', origin: 'Delhi (IIT-D)', destination: 'Kanpur (IIT-K)', shipDate: '2026-07-20', transitDays: 1, zone: 'North', remarks: 'Organic electrolyte degradation study' },
  { id: 'VRB-0012', batchNo: 'VRB-B2412', systemType: 'V-Iron Hybrid', electrolyte: 'VCl3/FeCl2', application: 'Mining Operations', capacityMWh: 25, powerMW: 5, efficiency: 72, cycleLife: 14000, status: 'Delivered', priority: 'Medium', origin: 'Dhanbad (BEML Mining)', destination: 'Jharia (CIL Mining)', shipDate: '2026-07-13', transitDays: 1, zone: 'East', remarks: 'Underground mine 4hr shift power' },
  { id: 'VRB-0013', batchNo: 'VRB-B2413', systemType: 'All-Vanadium', electrolyte: 'VOSO4/V2(SO4)3', application: 'Solar Park Buffer', capacityMWh: 100, powerMW: 25, efficiency: 75, cycleLife: 20000, status: 'Delayed', priority: 'Critical', origin: 'Ahmedabad (Adani Green)', destination: 'Kutch (AGEL Solar Park)', shipDate: '2026-07-11', transitDays: 14, zone: 'West', remarks: 'Kutch 100MWh diurnal shift buffer' },
  { id: 'VRB-0014', batchNo: 'VRB-B2414', systemType: 'Vanadium-Bromine', electrolyte: 'VBr3/NaBr', application: 'Port Container Yard', capacityMWh: 10, powerMW: 2, efficiency: 71, cycleLife: 18000, status: 'In Transit', priority: 'High', origin: 'Chennai (TATA Harbour)', destination: 'Mumbai (JNPT Terminal)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Zero-emission RTG crane power' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'System Type', key: 'systemType', options: [
    { value: 'All-Vanadium', count: 6 }, { value: 'V-Iron Hybrid', count: 3 }, { value: 'Vanadium-Bromine', count: 3 }, { value: 'Organic VRFB', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 7 }, { value: 'West', count: 4 }, { value: 'East', count: 2 }, { value: 'North', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Systems', value: 14, sub: 'VRB Deployments', color: 'text-violet-800' },
  { title: 'Combined Capacity', value: '306.6 MWh', sub: 'Energy Storage', color: 'text-purple-700' },
  { title: 'Avg Round-Trip Eff', value: '73.4%', sub: 'All-V 75.2% Best', color: 'text-fuchsia-700' },
  { title: 'Market Projection', value: '\u20b96,800Cr', sub: 'India VRFB 2030', color: 'text-indigo-700' },
];

export default function VanadiumRedoxFlowBatteryLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.systemType} ${r.electrolyte} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof VRFBRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.systemType.split(' ')[0], (map.get(r.systemType.split(' ')[0]) || 0) + r.capacityMWh); });
    return Array.from(map.entries()).map(([name, capacityMWh]) => ({ name: name.slice(0, 10), capacityMWh }));
  }, []);

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.systemType, (map.get(r.systemType) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.slice(0, 12), value }));
  }, []);

  const effTrend = useMemo(() => [
    { month: 'Jan', eff: 68 }, { month: 'Feb', eff: 69.5 }, { month: 'Mar', eff: 71 }, { month: 'Apr', eff: 72 }, { month: 'May', eff: 72.8 }, { month: 'Jun', eff: 73.2 }, { month: 'Jul', eff: 73.4 },
  ], []);

  const mwhData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), mwh: r.capacityMWh }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const lifeByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.systemType.split('-')[0]; map.set(k, Math.max(map.get(k) || 0, r.cycleLife)); });
    return Array.from(map.entries()).map(([name, cycleLife]) => ({ name, cycleLife: cycleLife / 1000 }));
  }, []);

  const COLORS = ['#5b21b6', '#7c3aed', '#c026d3', '#db2777', '#0891b2'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="vrb-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Energy Storage' }, { label: 'Vanadium Redox Flow' }]} />
      <PageHeader title="Vanadium Redox Flow Battery Logistics" description="Indian VRFB supply chain \u2014 All-Vanadium, V-Iron Hybrid, Vanadium-Bromine, Organic VRFB for grid, telecom, defense, EV charging" />

      <div className="vrb-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="vrb-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="vrb-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`vrb-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-violet-600 text-violet-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="vrb-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="vrb-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by System Type (MWh)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacityMWh" fill="#5b21b6" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="vrb-chart-card"><CardHeader><CardTitle className="text-sm">System Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#5b21b6" /><Cell fill="#7c3aed" /><Cell fill="#c026d3" /><Cell fill="#db2777" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="vrb-chart-card"><CardHeader><CardTitle className="text-sm">Round-Trip Efficiency Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={effTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[65, 78]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="eff" stroke="#7c3aed" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="vrb-chart-card"><CardHeader><CardTitle className="text-sm">Storage Capacity by Batch (MWh)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={mwhData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="mwh" fill="#c026d3" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="vrb-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">MWh</th><th className="px-2 py-2 text-right">MW</th><th className="px-2 py-2 text-right">Eff%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`vrb-table-row border-b hover:bg-violet-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.systemType}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityMWh}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.powerMW}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.efficiency}</td>
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
        <div className="vrb-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="vrb-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#5b21b6" /><Cell fill="#7c3aed" /><Cell fill="#c026d3" /><Cell fill="#db2777" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="vrb-chart-card"><CardHeader><CardTitle className="text-sm">Max Cycle Life by Type (k-cycles)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={lifeByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="cycleLife" fill="#0891b2" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="vrb-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency vs Capacity (Batch View)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), eff: r.efficiency, mwh: r.capacityMWh }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="eff" stroke="#5b21b6" strokeWidth={2} name="Eff%" /><Line type="monotone" dataKey="mwh" stroke="#c026d3" strokeWidth={2} name="MWh" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="vrb-chart-card"><CardHeader><CardTitle className="text-sm">Power Rating by Application (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.application.split(' ')[0].slice(0, 10), mw: r.powerMW }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="mw" fill="#db2777" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="vrb-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="vrb-insight-card border-l-4 border-l-violet-600"><CardHeader><CardTitle className="text-sm text-violet-700">Adani Green: India&apos;s Largest 100MWh VRB Installation</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Adani Green Energy commissioning India&apos;s largest VRFB at Kutch Solar Park (VRB-0013, 100MWh/25MW) — all-vanadium system using indigenous VOSO4 electrolyte from Tata Steel vanadium slag processing. System provides 4-hour diurnal energy shift: charges during peak solar noon, discharges during evening peak 6-10PM. Cost: \u20b91,800Cr at \u20b918kWh/MWh installed — 40% cheaper than equivalent Li-ion LFP for 4-hour duration. Cycle life 20,000 (25 years daily cycling) vs Li-ion 6,000 (8 years). Key advantage: vanadium electrolyte does not degrade — can be reused indefinitely after battery end-of-life by simply replacing the stack. Tata Steel producing 2,000TPD V2O5 from blast furnace slag at Jamshedpur, reducing India&apos;s vanadium import dependency from 85% to 40%.</p></CardContent></Card>
          <Card className="vrb-insight-card border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm text-purple-700">V-Iron Hybrid: Low-Cost Alternative</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">IISc Bengaluru developed V-Iron hybrid VRFB (VRB-0002, 0007, 0012) replacing expensive vanadium positive electrolyte with low-cost iron chloride — cutting electrolyte cost by 60% from \u20b92,400/kWh to \u20b9960/kWh. Cross-contamination addressed with proprietary ion-selective membrane developed by CSIR-IICT Hyderabad. RCF Kolkata adopting 30MWh V-Iron for railway substation regenerative braking capture — recovering 35% of braking energy from Vande Bharat trains. BEML deploying 25MWh systems for underground coal mining 4-hour shift power, replacing diesel generators at Jharia mines. Total cost saving: \u20b912Cr/year per mine. V-Iron cycle life: 15,000 cycles (18 years daily). India V-Iron potential: \u20b93,500Cr market by 2030 for industrial UPS and mining backup.</p></CardContent></Card>
          <Card className="vrb-insight-card border-l-4 border-l-fuchsia-500"><CardHeader><CardTitle className="text-sm text-fuchsia-700">Delayed Batches: VRB-0004 and VRB-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">VRB-0004 (V-Guard Kochi to Lakshadweep, 12-day delay): Vanadium-Bromine VRFB for Lakshadweep island microgrid held at Kochi port — hazardous electrolyte (VBr3 corrosive Class-8) requires IMDG code compliance for sea shipment. Specialized chemical tanker arranged from Cochin Shipyard with reinforced containment. ANIL Power (Lakshadweep utility) facing diesel generator crisis — 500kW solar installation idling without storage. Cost of delay: \u20b98.5L/day diesel substitute. VRB-0013 (Adani Green Ahmedabad to Kutch, 14-day delay): 100MWh system delayed — 20 tanker trucks of vanadium electrolyte required individual CDSCO hazardous material transport permits. Each permit taking 2 days across 3 state borders (Gujarat-Rajasthan repeat). New SOP: pre-apply for multi-state hazmat corridor permits through MoRTH single-window.</p></CardContent></Card>
          <Card className="vrb-insight-card border-l-4 border-l-indigo-500"><CardHeader><CardTitle className="text-sm text-indigo-700">BEL Defense: High-Altitude VRB for Army</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BEL Pune delivered 2MWh/0.5MW all-vanadium VRFB (VRB-0008) to Indian Army 14 Corps HQ Leh — designed for -20\u00b0C operation at 4,500m altitude with pressurized electrolyte circulation system. Cold-climate modification: glycol heat exchanger prevents vanadium electrolyte freezing below -5\u00b0C. Replacing 8 diesel generators at forward base, saving \u20b945L/month fuel + eliminating supply convoy vulnerability. Noise signature: VRB is completely silent vs 85dB diesel — critical for tactical concealment. DRDO testing 5MW/20MWh VRFB for Siachen glacier base at 5,400m — would be world&apos;s highest-altitude battery installation. Defence VRB programme: \u20b91,200Cr allocated for 50 forward installations across Northern and Eastern Commands by 2028.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
