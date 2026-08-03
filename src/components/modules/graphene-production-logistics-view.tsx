'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface GrapheneRecord {
  id: string;
  batchNo: string;
  productionMethod: string;
  grapheneType: string;
  application: string;
  layerCount: number;
  sheetResistance: number;
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

const records: GrapheneRecord[] = [
  { id: 'GRP-0001', batchNo: 'GRP-B2401', productionMethod: 'CVD on Cu Foil', grapheneType: 'Monolayer', application: 'Flexible Touch Screen', layerCount: 1, sheetResistance: 280, yieldKg: 5, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (IISc Nano)', destination: 'Noida (Microtouch Display)', shipDate: '2026-07-20', transitDays: 3, zone: 'South', remarks: 'Foldable phone ITO replacement 92% transparency' },
  { id: 'GRP-0002', batchNo: 'GRP-B2402', productionMethod: 'Liquid Phase Exfoliation', grapheneType: 'Few-Layer', application: 'Concrete Additive', layerCount: 5, sheetResistance: 850, yieldKg: 400, status: 'Delivered', priority: 'High', origin: 'Mumbai (TIFR)', destination: 'Pune (Afcons Infrastructure)', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: 'Graphene concrete 35% compressive strength gain' },
  { id: 'GRP-0003', batchNo: 'GRP-B2403', productionMethod: 'Epitaxial SiC', grapheneType: 'Monolayer', application: 'RF Transistor', layerCount: 1, sheetResistance: 150, yieldKg: 0.5, status: 'Processing', priority: 'Medium', origin: 'Thiruvananthapuram (VSSC)', destination: 'Bengaluru (BEL RF Division)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'GaN-on-graphene HEMT for satellite comms' },
  { id: 'GRP-0004', batchNo: 'GRP-B2404', productionMethod: 'Chemical Reduction GO', grapheneType: 'rGO', application: 'Battery Anode', layerCount: 8, sheetResistance: 1200, yieldKg: 250, status: 'Delayed', priority: 'Critical', origin: 'Kolkata (IIT-KGP)', destination: 'Gurgaon (Ola Electric)', shipDate: '2026-07-14', transitDays: 9, zone: 'East', remarks: 'Li-S battery rGO interlayer 3x cycle life' },
  { id: 'GRP-0005', batchNo: 'GRP-B2405', productionMethod: 'CVD Roll-to-Roll', grapheneType: 'Monolayer', application: 'Anti-Corrosion Coating', layerCount: 1, sheetResistance: 350, yieldKg: 20, status: 'In Transit', priority: 'High', origin: 'Chennai (IIT-M)', destination: 'Mumbai (Reliance Refinery)', shipDate: '2026-07-21', transitDays: 2, zone: 'South', remarks: 'Offshore pipeline graphene-zinc coating 50yr life' },
  { id: 'GRP-0006', batchNo: 'GRP-B2406', productionMethod: 'Liquid Phase Exfoliation', grapheneType: 'FLG Powder', application: 'Thermal Paste', layerCount: 10, sheetResistance: 2500, yieldKg: 600, status: 'Delivered', priority: 'Medium', origin: 'Hyderabad (JNCASR)', destination: 'Pune (Infosys DC)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: 'Datacenter GPU thermal paste 8W/mK performance' },
  { id: 'GRP-0007', batchNo: 'GRP-B2407', productionMethod: 'Electrochemical Exfoliation', grapheneType: 'Few-Layer', application: 'Sensor Electrode', layerCount: 3, sheetResistance: 500, yieldKg: 30, status: 'Processing', priority: 'Low', origin: 'Coimbatore (Amrita Univ)', destination: 'Bengaluru (Bosch Sensor)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: 'Graphene QCM gas sensor for VOC detection' },
  { id: 'GRP-0008', batchNo: 'GRP-B2408', productionMethod: 'CVD on Cu Foil', grapheneType: 'Bilayer', application: 'Transparent Heater', layerCount: 2, sheetResistance: 200, yieldKg: 8, status: 'In Transit', priority: 'High', origin: 'Mumbai (TIFR)', destination: 'Delhi (Maruti Suzuki)', shipDate: '2026-07-19', transitDays: 3, zone: 'West', remarks: 'EV windshield defogger 95% uniformity' },
  { id: 'GRP-0009', batchNo: 'GRP-B2409', productionMethod: 'Chemical Reduction GO', grapheneType: 'rGO', application: 'Water Desalination', layerCount: 6, sheetResistance: 900, yieldKg: 180, status: 'Delivered', priority: 'High', origin: 'Ahmedabad (CSIR-CSMCRI)', destination: 'Chennai (Metro Water)', shipDate: '2026-07-16', transitDays: 2, zone: 'West', remarks: 'rGO membrane 99.8% salt rejection at 50L/m2h' },
  { id: 'GRP-0010', batchNo: 'GRP-B2410', productionMethod: 'CVD Roll-to-Roll', grapheneType: 'Monolayer', application: 'EMI Shielding Film', layerCount: 1, sheetResistance: 300, yieldKg: 15, status: 'Processing', priority: 'Medium', origin: 'Bengaluru (IISc)', destination: 'Hyderabad (Qualcomm R&D)', shipDate: '2026-07-24', transitDays: 1, zone: 'South', remarks: '5G mmWave shielding 60dB at 30GHz' },
  { id: 'GRP-0011', batchNo: 'GRP-B2411', productionMethod: 'Liquid Phase Exfoliation', grapheneType: 'FLG Powder', application: 'Lubricant Additive', layerCount: 12, sheetResistance: 3000, yieldKg: 1000, status: 'In Transit', priority: 'Low', origin: 'Dhanbad (IIT-ISM)', destination: 'Ranchi (SAIL Plant)', shipDate: '2026-07-20', transitDays: 1, zone: 'East', remarks: 'Steel rolling mill graphene lubricant 45% friction cut' },
  { id: 'GRP-0012', batchNo: 'GRP-B2412', productionMethod: 'Epitaxial SiC', grapheneType: 'Monolayer', application: 'Quantum Device', layerCount: 1, sheetResistance: 120, yieldKg: 0.2, status: 'Delivered', priority: 'Critical', origin: 'Bengaluru (IISc)', destination: 'Mumbai (Tata Quantum)', shipDate: '2026-07-13', transitDays: 2, zone: 'South', remarks: 'Graphene qubit carrier mobility 200,000 cm2/Vs' },
  { id: 'GRP-0013', batchNo: 'GRP-B2413', productionMethod: 'Electrochemical Exfoliation', grapheneType: 'Few-Layer', application: 'Supercapacitor', layerCount: 4, sheetResistance: 400, yieldKg: 80, status: 'Delayed', priority: 'High', origin: 'Guwahati (IIT-G)', destination: 'Kolkata (CESC Storage)', shipDate: '2026-07-11', transitDays: 11, zone: 'East', remarks: 'Brahmaputra flooding disrupted NH31 cargo' },
  { id: 'GRP-0014', batchNo: 'GRP-B2414', productionMethod: 'CVD on Cu Foil', grapheneType: 'Bilayer', application: 'OLED Encapsulation', layerCount: 2, sheetResistance: 180, yieldKg: 3, status: 'In Transit', priority: 'Critical', origin: 'Thiruvananthapuram (VSSC)', destination: 'Noida (Samsung Display)', shipDate: '2026-07-22', transitDays: 4, zone: 'South', remarks: 'OLED water barrier graphene layer 10-6 g/m2/day' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Production Method', key: 'productionMethod', options: [
    { value: 'CVD on Cu Foil', count: 3 }, { value: 'Liquid Phase Exfoliation', count: 3 }, { value: 'Chemical Reduction GO', count: 2 }, { value: 'CVD Roll-to-Roll', count: 2 }, { value: 'Electrochemical Exfoliation', count: 2 }, { value: 'Epitaxial SiC', count: 2 },
  ]},
  { label: 'Graphene Type', key: 'grapheneType', options: [
    { value: 'Monolayer', count: 5 }, { value: 'Few-Layer', count: 2 }, { value: 'FLG Powder', count: 2 }, { value: 'rGO', count: 2 }, { value: 'Bilayer', count: 3 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 8 }, { value: 'West', count: 3 }, { value: 'East', count: 3 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Active Shipments', color: 'text-emerald-800' },
  { title: 'Total Production', value: '2,595 kg', sub: 'All Graphene Types', color: 'text-teal-700' },
  { title: 'Avg Sheet Resistance', value: '663 \u03a9/sq', sub: 'Monolayer 258\u03a9 Lead', color: 'text-purple-700' },
  { title: 'Market Value', value: '\u20b9720Cr', sub: 'est. shipment value', color: 'text-amber-700' },
];

export default function GrapheneProductionLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.productionMethod} ${r.grapheneType} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof GrapheneRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const yieldByMethod = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.productionMethod.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.yieldKg); });
    return Array.from(map.entries()).map(([name, yieldKg]) => ({ name: name.slice(0, 10), yieldKg }));
  }, []);

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.grapheneType, (map.get(r.grapheneType) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const resistanceTrend = useMemo(() => [
    { month: 'Jan', resistance: 720 }, { month: 'Feb', resistance: 680 }, { month: 'Mar', resistance: 620 }, { month: 'Apr', resistance: 580 }, { month: 'May', resistance: 540 }, { month: 'Jun', resistance: 500 }, { month: 'Jul', resistance: 663 },
  ], []);

  const appYield = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + r.yieldKg); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, yieldKg]) => ({ name: name.slice(0, 14), yieldKg }));
  }, []);

  const layerData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), layers: r.layerCount }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const priorityYield = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.priority, (map.get(r.priority) || 0) + r.yieldKg); });
    return Array.from(map.entries()).map(([name, yieldKg]) => ({ name, yieldKg }));
  }, []);

  const COLORS = ['#065f46', '#0d9488', '#7c3aed', '#b45309', '#dc2626', '#4f46e5'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="grp-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Advanced Materials' }, { label: 'Graphene' }]} />
      <PageHeader title="Graphene Production Logistics" description="Indian graphene supply chain \u2014 Monolayer, Bilayer, Few-Layer, rGO, FLG via CVD, LPE, Epitaxial, Electrochemical methods" />

      <div className="grp-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="grp-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="grp-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`grp-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="grp-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="grp-chart-card"><CardHeader><CardTitle className="text-sm">Yield by Production Method (kg)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={yieldByMethod}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="yieldKg" fill="#065f46" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="grp-chart-card"><CardHeader><CardTitle className="text-sm">Graphene Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#065f46" /><Cell fill="#0d9488" /><Cell fill="#7c3aed" /><Cell fill="#b45309" /><Cell fill="#4f46e5" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="grp-chart-card"><CardHeader><CardTitle className="text-sm">Sheet Resistance Trend (\u03a9/sq)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={resistanceTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[400, 800]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="resistance" stroke="#0d9488" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="grp-chart-card"><CardHeader><CardTitle className="text-sm">Yield by Application (kg)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={appYield}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="yieldKg" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="grp-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Method</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">Layers</th><th className="px-2 py-2 text-right">\u03a9/sq</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`grp-table-row border-b hover:bg-emerald-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.productionMethod}</td>
                  <td className="px-2 py-2 text-xs">{r.grapheneType}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.layerCount}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.sheetResistance}</td>
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
        <div className="grp-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="grp-chart-card"><CardHeader><CardTitle className="text-sm">Layer Count by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={layerData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="layers" fill="#b45309" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="grp-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#065f46" /><Cell fill="#0d9488" /><Cell fill="#7c3aed" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="grp-chart-card"><CardHeader><CardTitle className="text-sm">Yield by Priority (kg)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={priorityYield}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="yieldKg" fill="#dc2626" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="grp-chart-card"><CardHeader><CardTitle className="text-sm">Sheet Resistance vs Layer Count</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), resistance: r.sheetResistance, layers: r.layerCount }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="resistance" stroke="#065f46" strokeWidth={2} name="\u03a9/sq" /><Line type="monotone" dataKey="layers" stroke="#7c3aed" strokeWidth={2} name="Layers" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grp-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="grp-insight-card border-l-4 border-l-emerald-600"><CardHeader><CardTitle className="text-sm text-emerald-700">IISc CVD Roll-to-Roll: India&apos;s First Commercial Scale</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">IISc Bengaluru commissioned India&apos;s first CVD roll-to-roll graphene production line in Q1 2026 — capable of 30-inch wide monolayer graphene at 280\u03a9/sq sheet resistance. Current throughput: 20kg/month, scaling to 50kg by Q4 2026. Microtouch Display (Noida) is the anchor customer for foldable phone touchscreens, replacing ITO at 92% optical transparency. GOI Mission on Nano Science: \u20b91,200Cr allocated for graphene scale-up. Tata Steel providing Cu foil substrate at \u20b92,500/roll — 60% cheaper than imported Korean foil.</p></CardContent></Card>
          <Card className="grp-insight-card border-l-4 border-l-teal-500"><CardHeader><CardTitle className="text-sm text-teal-700">Graphene Concrete: Transforming Indian Infrastructure</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">TIFR Mumbai-developed few-layer graphene powder (GRP-0002, 400kg) is being used by Afcons Infrastructure for Mumbai Trans-Harbour Link bridge segments. Graphene additive at 0.05% by weight increases compressive strength by 35% and reduces cement consumption by 20%. Cost impact: \u20b9150/m2 vs conventional \u20b9120/m2 — offset by 8-year life extension. NHAI mandating graphene concrete for all new expressway bridges from 2027. MoRTH estimated savings: \u20b98,500Cr over 10-year highway programme. Production: IIT-ISM Dhanbad mining waste-derived graphene for lowest cost.</p></CardContent></Card>
          <Card className="grp-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Delayed Batches: GRP-0004 and GRP-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GRP-0004 (IIT-KGP to Ola Electric, 9-day delay): rGO for Li-S battery anode stuck at Kolkata port — CDSCO nanomaterial classification dispute. Ola expedited with \u20b918L priority clearance. Impact: Gigafactory Li-S pilot line startup delayed, risking \u20b94.2Cr/month subsidy clawback. GRP-0013 (IIT-G to CESC, 11-day delay): supercapacitor graphene shipment stranded on NH31 due to Brahmaputra monsoon flooding. Rerouted via Bangladesh corridor with 3-day border transit. Insurance claim: \u20b93.8Cr filed. New SOP: avoid Assam corridor June-September.</p></CardContent></Card>
          <Card className="grp-insight-card border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm text-purple-700">VSSC Epitaxial Graphene: ISRO&apos;s Quantum Leap</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">VSSC Thiruvananthapuram produced India&apos;s highest-quality epitaxial graphene on SiC wafer — monolayer with 150\u03a9/sq and carrier mobility 200,000 cm2/Vs. GRP-0003 (0.5kg) shipped to BEL for GaN-on-graphene HEMT for Gaganyaan satellite communications. GRP-0012 (0.2kg) delivered to Tata Quantum for qubit research — 10x improvement over silicon spin qubits. ISRO planning graphene-based radiation shields for crew module: 3x lighter than aluminium at equal shielding. Batch production scaling: 5kg/year current, 20kg target by 2028. Investment: \u20b9280Cr from DAE-ISRO joint programme.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
