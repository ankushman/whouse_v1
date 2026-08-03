'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface CNTRecord {
  id: string;
  batchNo: string;
  synthesisMethod: string;
  cntType: string;
  application: string;
  purity: number;
  diameter: number;
  yieldKg: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: CNTRecord[] = [
  { id: 'CNT-0001', batchNo: 'CNT-B2401', synthesisMethod: 'CVD Floating Catalyst', cntType: 'SWCNT', application: 'Battery Electrode', purity: 99.2, diameter: 1.2, yieldKg: 50, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (Nano Research Lab)', destination: 'Mumbai (Tata Battery)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'Li-ion anode enhancement 15% capacity' },
  { id: 'CNT-0002', batchNo: 'CNT-B2402', synthesisMethod: 'Arc Discharge', cntType: 'MWCNT', application: 'Composite Reinforcement', purity: 97.5, diameter: 25, yieldKg: 200, status: 'Delivered', priority: 'High', origin: 'Hyderabad (CSIR-IICT)', destination: 'Chennai (L&T Composites)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: 'Aerospace-grade MWCNT for fuselage panels' },
  { id: 'CNT-0003', batchNo: 'CNT-B2403', synthesisMethod: 'Laser Ablation', cntType: 'SWCNT', application: 'Thermal Interface', purity: 99.8, diameter: 0.8, yieldKg: 10, status: 'Processing', priority: 'Medium', origin: 'Pune (IISER)', destination: 'Bengaluru (Wipro Infra)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Server chipset thermal paste 6W/mK' },
  { id: 'CNT-0004', batchNo: 'CNT-B2404', synthesisMethod: 'CVD Fixed Bed', cntType: 'MWCNT', application: 'EMI Shielding', purity: 98.1, diameter: 15, yieldKg: 150, status: 'Delayed', priority: 'Critical', origin: 'Kolkata (IIT-KGP)', destination: 'Gurgaon (Samsung R&D)', shipDate: '2026-07-14', transitDays: 8, zone: 'East', remarks: '5G device shielding coating raw material' },
  { id: 'CNT-0005', batchNo: 'CNT-B2405', synthesisMethod: 'HiPco Process', cntType: 'SWCNT', application: 'Flexible Display', purity: 99.5, diameter: 1.0, yieldKg: 25, status: 'In Transit', priority: 'High', origin: 'Mumbai (TIFR)', destination: 'Noida (Flex Display Ltd)', shipDate: '2026-07-21', transitDays: 3, zone: 'West', remarks: 'Transparent conductive film for foldable screens' },
  { id: 'CNT-0006', batchNo: 'CNT-B2406', synthesisMethod: 'CVD Fluidized Bed', cntType: 'MWCNT', application: 'Water Filtration', purity: 96.8, diameter: 30, yieldKg: 300, status: 'Delivered', priority: 'Medium', origin: 'Ahmedabad (CSIR-CSMCRI)', destination: 'Jaipur (PHED Rajasthan)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Arsenic removal membrane module 99.7% efficiency' },
  { id: 'CNT-0007', batchNo: 'CNT-B2407', synthesisMethod: 'Arc Discharge', cntType: 'DWCNT', application: 'Semiconductor Interconnect', purity: 99.6, diameter: 3.5, yieldKg: 5, status: 'Processing', priority: 'Low', origin: 'Bengaluru (IISc)', destination: 'Hyderabad (TSMC India)', shipDate: '2026-07-23', transitDays: 1, zone: 'South', remarks: '7nm chip Cu replacement interconnect test' },
  { id: 'CNT-0008', batchNo: 'CNT-B2408', synthesisMethod: 'CVD Floating Catalyst', cntType: 'MWCNT', application: 'Structural Concrete', purity: 95.2, diameter: 20, yieldKg: 500, status: 'In Transit', priority: 'High', origin: 'Delhi (IIT-D)', destination: 'Lucknow (L&T Construction)', shipDate: '2026-07-19', transitDays: 1, zone: 'North', remarks: 'Nano-silica CNT concrete 40% stronger bridges' },
  { id: 'CNT-0009', batchNo: 'CNT-B2409', synthesisMethod: 'Laser Ablation', cntType: 'SWCNT', application: 'Drug Delivery', purity: 99.9, diameter: 0.6, yieldKg: 2, status: 'Delivered', priority: 'Critical', origin: 'Thiruvananthapuram (VSSC)', destination: 'Mumbai (SERB-Pharma)', shipDate: '2026-07-16', transitDays: 3, zone: 'South', remarks: 'Functionalized SWCNT for targeted chemotherapy' },
  { id: 'CNT-0010', batchNo: 'CNT-B2410', synthesisMethod: 'CVD Fixed Bed', cntType: 'MWCNT', application: 'Supercapacitor Electrode', purity: 98.5, diameter: 12, yieldKg: 100, status: 'Processing', priority: 'Medium', origin: 'Kharagpur (IIT-KGP)', destination: 'Pune (BHEL R&D)', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'High-frequency supercap for rail regenerative braking' },
  { id: 'CNT-0011', batchNo: 'CNT-B2411', synthesisMethod: 'HiPco Process', cntType: 'SWCNT', application: 'Conductive Ink', purity: 99.3, diameter: 1.5, yieldKg: 15, status: 'In Transit', priority: 'High', origin: 'Chennai (IIT-M)', destination: 'Coimbatore (Print Electronics)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Printed RFID antenna CNT ink 85% conductivity' },
  { id: 'CNT-0012', batchNo: 'CNT-B2412', synthesisMethod: 'CVD Fluidized Bed', cntType: 'MWCNT', application: 'Rubber Reinforcement', purity: 94.5, diameter: 35, yieldKg: 800, status: 'Delivered', priority: 'Low', origin: 'Kochi (HLL Lifecare)', destination: 'Mumbai (MRF Tyres)', shipDate: '2026-07-13', transitDays: 2, zone: 'South', remarks: 'Tyre tread MWCNT 30% less rolling resistance' },
  { id: 'CNT-0013', batchNo: 'CNT-B2413', synthesisMethod: 'Arc Discharge', cntType: 'MWCNT', application: 'Anti-Corrosion Coating', purity: 97.8, diameter: 18, yieldKg: 120, status: 'Delayed', priority: 'High', origin: 'Bhilai (SAIL R&D)', destination: 'Visakhapatnam (HPCL Refinery)', shipDate: '2026-07-11', transitDays: 10, zone: 'East', remarks: 'Offshore pipeline coating 20yr salt-spray rated' },
  { id: 'CNT-0014', batchNo: 'CNT-B2414', synthesisMethod: 'CVD Floating Catalyst', cntType: 'SWCNT', application: 'Aerospace Wiring', purity: 99.7, diameter: 0.9, yieldKg: 8, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (NAL-ISRO)', destination: 'Thiruvananthapuram (VSSC-ISRO)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'GSLV Mk-IV lightweight CNT wiring harness' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 }, { value: 'Customs', count: 1 },
  ]},
  { label: 'Synthesis Method', key: 'synthesisMethod', options: [
    { value: 'CVD Floating Catalyst', count: 3 }, { value: 'Arc Discharge', count: 3 }, { value: 'CVD Fixed Bed', count: 2 }, { value: 'Laser Ablation', count: 2 }, { value: 'HiPco Process', count: 2 }, { value: 'CVD Fluidized Bed', count: 2 },
  ]},
  { label: 'CNT Type', key: 'cntType', options: [
    { value: 'SWCNT', count: 5 }, { value: 'MWCNT', count: 6 }, { value: 'DWCNT', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 7 }, { value: 'West', count: 3 }, { value: 'East', count: 2 }, { value: 'North', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Active Shipments', color: 'text-slate-800' },
  { title: 'Combined Yield', value: '2,285 kg', sub: 'All CNT Types', color: 'text-indigo-700' },
  { title: 'Avg Purity', value: '98.3%', sub: 'SWCNT 99.5% Lead', color: 'text-teal-700' },
  { title: 'Total Value', value: '\u20b9485Cr', sub: 'est. batch value', color: 'text-amber-700' },
];

export default function CarbonNanotubeProductionLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.synthesisMethod} ${r.cntType} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof CNTRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const yieldByMethod = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.synthesisMethod.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.yieldKg); });
    return Array.from(map.entries()).map(([name, yieldKg]) => ({ name: name.slice(0, 10), yieldKg }));
  }, []);

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.cntType, (map.get(r.cntType) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const purityTrend = useMemo(() => [
    { month: 'Jan', purity: 97.8 }, { month: 'Feb', purity: 98.1 }, { month: 'Mar', purity: 98.4 }, { month: 'Apr', purity: 98.6 }, { month: 'May', purity: 98.9 }, { month: 'Jun', purity: 99.1 }, { month: 'Jul', purity: 98.3 },
  ], []);

  const appData = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + r.yieldKg); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, yieldKg]) => ({ name: name.slice(0, 14), yieldKg }));
  }, []);

  const diameterData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), diameter: r.diameter }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const valueByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application.split(' ')[0], (map.get(r.application.split(' ')[0]) || 0) + 1); });
    return Array.from(map.entries()).slice(0, 6).map(([name, count]) => ({ name: name.slice(0, 12), count }));
  }, []);

  const COLORS = ['#334155', '#4f46e5', '#0d9488', '#b45309', '#dc2626', '#7c3aed'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="cnt-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Advanced Materials' }, { label: 'Carbon Nanotube' }]} />
      <PageHeader title="Carbon Nanotube Production Logistics" description="Indian CNT supply chain \u2014 SWCNT, MWCNT, DWCNT via CVD, Arc Discharge, Laser Ablation, HiPco synthesis" />

      <div className="cnt-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="cnt-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="cnt-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`cnt-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-slate-700 text-slate-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="cnt-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="cnt-chart-card"><CardHeader><CardTitle className="text-sm">Yield by Synthesis Method (kg)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={yieldByMethod}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="yieldKg" fill="#334155" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="cnt-chart-card"><CardHeader><CardTitle className="text-sm">CNT Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#334155" /><Cell fill="#4f46e5" /><Cell fill="#0d9488" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="cnt-chart-card"><CardHeader><CardTitle className="text-sm">Purity Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={purityTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[97, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="purity" stroke="#4f46e5" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="cnt-chart-card"><CardHeader><CardTitle className="text-sm">Yield by Application (kg)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={appData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="yieldKg" fill="#0d9488" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="cnt-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Method</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">Purity%</th><th className="px-2 py-2 text-right">nm</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`cnt-table-row border-b hover:bg-slate-50/50 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.synthesisMethod}</td>
                  <td className="px-2 py-2 text-xs">{r.cntType}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.purity}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.diameter}</td>
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
        <div className="cnt-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="cnt-chart-card"><CardHeader><CardTitle className="text-sm">Diameter Distribution by Batch (nm)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={diameterData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="diameter" fill="#b45309" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="cnt-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#334155" /><Cell fill="#4f46e5" /><Cell fill="#0d9488" /><Cell fill="#b45309" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="cnt-chart-card"><CardHeader><CardTitle className="text-sm">Batch Count by Application</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={valueByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="cnt-chart-card"><CardHeader><CardTitle className="text-sm">Purity vs Diameter (Batch View)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), purity: r.purity, diameter: r.diameter }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="purity" stroke="#4f46e5" strokeWidth={2} name="Purity%" /><Line type="monotone" dataKey="diameter" stroke="#0d9488" strokeWidth={2} name="Dia nm" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="cnt-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cnt-insight-card border-l-4 border-l-slate-600"><CardHeader><CardTitle className="text-sm text-slate-700">IISc CVD Scale-Up: 50kg SWCNT Run</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">IISc Bengaluru achieved 50kg single-run SWCNT output via optimized floating catalyst CVD — a 10x improvement over 2025 capacity. Process uses xylene/ferrocene catalyst at 900\u00b0C with 99.2% purity. Tata Battery using this batch for Li-ion anode enhancement: 15% capacity gain validated in 500-cycle test. India&apos;s Nano Mission Phase-2 target: 5,000kg SWCNT/year by 2030. Current installed capacity: 1,200kg across 8 labs. Funding: \u20b9750Cr under DST Nanotechnology Programme.</p></CardContent></Card>
          <Card className="cnt-insight-card border-l-4 border-l-indigo-500"><CardHeader><CardTitle className="text-sm text-indigo-700">CSIR-IICT Arc Discharge: Aerospace MWCNT</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">CSIR-IICT Hyderabad developed aerospace-grade MWCNT via pulsed arc discharge with 97.5% purity and 25nm diameter — optimized for L&amp;T composite fuselage panels. MWCNT-epoxy nanocomposite shows 40% tensile strength improvement over carbon fiber baseline. Batch CNT-0002 (200kg) delivered to L&amp;T Chennai for HAL Tejas Mk-2 airframe sections. ISRO also evaluating for PSLV payload fairing weight reduction. Potential: 18% mass saving per panel. Cost target: \u20b95,000/kg by 2028.</p></CardContent></Card>
          <Card className="cnt-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Delayed Batches: CNT-0004 and CNT-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">CNT-0004 (IIT-KGP to Samsung R&amp;D, 8-day delay): EMI shielding MWCNT held at Kolkata customs — missing nanomaterial handling certificate under CDSCO Biomedical Device Rules. Samsung expedited with \u20b912L urgent processing fee. CNT-0013 (SAIL to HPCL, 10-day delay): anti-corrosion MWCNT shipment damaged in transit — freight rerouted via Visakhapatnam port. Insurance claim: \u20b98.5Cr filed with New India Assurance. Mitigation: double-container packaging mandate for all CNT shipments exceeding 50kg.</p></CardContent></Card>
          <Card className="cnt-insight-card border-l-4 border-l-teal-500"><CardHeader><CardTitle className="text-sm text-teal-700">CNT Water Filtration: Arsenic Crisis Solution</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">CSIR-CSMCRI Ahmedabad MWCNT-based water filtration membranes (CNT-0006, 300kg) delivered to Rajasthan PHED for arsenic removal across 500 villages. MWCNT-zeolite composite achieves 99.7% arsenic removal at 0.01mg/L — well below WHO 0.01mg/L limit. Flow rate: 10,000L/hour per module. Replacing alum-based coagulation with CNT membrane reduces sludge generation by 85%. Jal Jeevan Mission allocated \u20b9320Cr for CNT filtration rollout to 2,500 arsenic-affected villages by 2028. Operating cost: \u20b90.02/L — 90% cheaper than RO.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
