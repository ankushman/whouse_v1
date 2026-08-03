'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface PerovskiteRecord {
  id: string;
  batchNo: string;
  cellStructure: string;
  perovskiteType: string;
  application: string;
  efficiency: number;
  areaCm2: number;
  yieldWatts: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: PerovskiteRecord[] = [
  { id: 'PSK-0001', batchNo: 'PSK-B2401', cellStructure: 'Inverted p-i-n', perovskiteType: 'MAPbI3', application: 'BIPV Facade Panel', efficiency: 24.8, areaCm2: 400, yieldWatts: 992, status: 'In Transit', priority: 'Critical', origin: 'Hyderabad (TATA Power Solar)', destination: 'Mumbai (Lodha BIPV)', shipDate: '2026-07-20', transitDays: 2, zone: 'South', remarks: 'Building-integrated perovskite glass facade' },
  { id: 'PSK-0002', batchNo: 'PSK-B2402', cellStructure: 'Normal n-i-p', perovskiteType: 'FAPbI3', application: 'Utility Scale Module', efficiency: 26.1, areaCm2: 800, yieldWatts: 2088, status: 'Delivered', priority: 'High', origin: 'Bengaluru (IISc)', destination: 'Bhadla (Adani Solar)', shipDate: '2026-07-18', transitDays: 4, zone: 'South', remarks: 'Rajasthan desert 50MW perovskite pilot array' },
  { id: 'PSK-0003', batchNo: 'PSK-B2403', cellStructure: 'Tandem Perov-Si', perovskiteType: 'CsFAMA', application: 'Space Solar Panel', efficiency: 31.5, areaCm2: 100, yieldWatts: 315, status: 'Processing', priority: 'Critical', origin: 'Ahmedabad (PRL-ISRO)', destination: 'Thiruvananthapuram (VSSC-ISRO)', shipDate: '2026-07-22', transitDays: 3, zone: 'West', remarks: 'Gaganyaan module tandem 31.5% PCE' },
  { id: 'PSK-0004', batchNo: 'PSK-B2404', cellStructure: 'Inverted p-i-n', perovskiteType: 'FA0.85MA0.15', application: 'Flexible Portable', efficiency: 23.2, areaCm2: 200, yieldWatts: 464, status: 'Delayed', priority: 'High', origin: 'Pune (NCL-CSIR)', destination: 'Chennai (Flextronics)', shipDate: '2026-07-14', transitDays: 9, zone: 'West', remarks: 'Flexible roll-to-roll encapsulation delay' },
  { id: 'PSK-0005', batchNo: 'PSK-B2405', cellStructure: 'Normal n-i-p', perovskiteType: 'MAPbBr3', application: 'Indoor PV Sensor', efficiency: 28.5, areaCm2: 25, yieldWatts: 71, status: 'In Transit', priority: 'Medium', origin: 'Kolkata (IIT-KGP)', destination: 'Bengaluru (Bosch IoT)', shipDate: '2026-07-21', transitDays: 2, zone: 'East', remarks: 'Indoor IoT sensor harvest 400lux power' },
  { id: 'PSK-0006', batchNo: 'PSK-B2406', cellStructure: 'Tandem Perov-Si', perovskiteType: 'CsFAMA', application: 'Concentrated PV', efficiency: 32.8, areaCm2: 400, yieldWatts: 1312, status: 'Delivered', priority: 'Critical', origin: 'Mumbai (TIFR)', destination: 'Bengaluru (NTPC R&D)', shipDate: '2026-07-17', transitDays: 2, zone: 'West', remarks: 'CPV tandem 3-sun concentration prototype' },
  { id: 'PSK-0007', batchNo: 'PSK-B2407', cellStructure: 'Inverted p-i-n', perovskiteType: '2D/3D Ruddlesden', application: 'Agrivoltaic Panel', efficiency: 22.5, areaCm2: 600, yieldWatts: 1350, status: 'Processing', priority: 'Medium', origin: 'Gandhinagar (Gujarat Energy)', destination: 'Jaipur (Rajasthan Agri Dept)', shipDate: '2026-07-23', transitDays: 1, zone: 'West', remarks: 'Semi-transparent greenhouse perovskite roof' },
  { id: 'PSK-0008', batchNo: 'PSK-B2408', cellStructure: 'Normal n-i-p', perovskiteType: 'FAPbI3', application: 'EV Solar Roof', efficiency: 25.9, areaCm2: 300, yieldWatts: 777, status: 'In Transit', priority: 'High', origin: 'Chennai (IIT-M)', destination: 'Pune (Tata Motors EV)', shipDate: '2026-07-19', transitDays: 1, zone: 'South', remarks: ' Nexon EV integrated solar roof panel' },
  { id: 'PSK-0009', batchNo: 'PSK-B2409', cellStructure: 'Tandem Perov-Si', perovskiteType: 'CsFAPbI', application: 'Rooftop C&I', efficiency: 30.2, areaCm2: 1200, yieldWatts: 3624, status: 'Delivered', priority: 'High', origin: 'Bengaluru (IISc)', destination: 'Hyderabad (TS-GENCO)', shipDate: '2026-07-16', transitDays: 1, zone: 'South', remarks: 'Commercial rooftop 10kW tandem system' },
  { id: 'PSK-0010', batchNo: 'PSK-B2410', cellStructure: 'Inverted p-i-n', perovskiteType: 'CsPbI2Br', application: 'Transparent Window', efficiency: 19.8, areaCm2: 500, yieldWatts: 990, status: 'Processing', priority: 'Low', origin: 'Delhi (IIT-D)', destination: 'Noida (DLF Smart Building)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: 'Smart glass BIPV 40% visible transparency' },
  { id: 'PSK-0011', batchNo: 'PSK-B2411', cellStructure: 'Normal n-i-p', perovskiteType: 'MAPbI3', application: 'Solar Lantern Kit', efficiency: 24.1, areaCm2: 50, yieldWatts: 121, status: 'In Transit', priority: 'Medium', origin: 'Bhubaneswar (NALCO R&D)', destination: 'Ranchi (Jharkhand RURBAN)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: 'Rural off-grid solar lantern 50,000 units' },
  { id: 'PSK-0012', batchNo: 'PSK-B2412', cellStructure: 'Tandem Perov-Si', perovskiteType: 'CsFAMA', application: 'Floating PV', efficiency: 29.5, areaCm2: 800, yieldWatts: 2360, status: 'Delivered', priority: 'High', origin: 'Kochi (Cochin Univ)', destination: 'Ramagundam (NTPC Float)', shipDate: '2026-07-13', transitDays: 5, zone: 'South', remarks: 'Floating perovskite on Ramagundam reservoir' },
  { id: 'PSK-0013', batchNo: 'PSK-B2413', cellStructure: 'Inverted p-i-n', perovskiteType: 'FA0.7Cs0.3PbI3', application: 'Railway Station Roof', efficiency: 23.8, areaCm2: 1500, yieldWatts: 3570, status: 'Delayed', priority: 'Critical', origin: 'Chennai (IIT-M)', destination: 'New Delhi (IRCON Railways)', shipDate: '2026-07-11', transitDays: 14, zone: 'South', remarks: 'Railway platform canopy 200kW perovskite' },
  { id: 'PSK-0014', batchNo: 'PSK-B2414', cellStructure: 'Normal n-i-p', perovskiteType: 'MAPbI3', application: 'Defense Field Unit', efficiency: 25.3, areaCm2: 150, yieldWatts: 380, status: 'In Transit', priority: 'Critical', origin: 'Pune (DRDO BEL)', destination: 'Leh (Indian Army 14 Corps)', shipDate: '2026-07-22', transitDays: 6, zone: 'West', remarks: 'High-altitude portable solar 4500m operation' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Cell Structure', key: 'cellStructure', options: [
    { value: 'Inverted p-i-n', count: 5 }, { value: 'Normal n-i-p', count: 4 }, { value: 'Tandem Perov-Si', count: 4 }, { value: 'Flexible R2R', count: 1 },
  ]},
  { label: 'Perovskite Type', key: 'perovskiteType', options: [
    { value: 'CsFAMA', count: 4 }, { value: 'MAPbI3', count: 3 }, { value: 'FAPbI3', count: 2 }, { value: 'FA0.85MA0.15', count: 1 }, { value: 'MAPbBr3', count: 1 }, { value: '2D/3D Ruddlesden', count: 1 }, { value: 'CsPbI2Br', count: 1 }, { value: 'CsFAPbI', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 7 }, { value: 'West', count: 4 }, { value: 'East', count: 1 }, { value: 'North', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Production Runs', color: 'text-yellow-700' },
  { title: 'Combined Output', value: '18.7 kW', sub: 'Total Wattage', color: 'text-orange-700' },
  { title: 'Avg Efficiency', value: '26.1%', sub: 'Tandem 31.3% Peak', color: 'text-amber-700' },
  { title: 'Market Projection', value: '\u20b98,500Cr', sub: 'India 2030 Perovskite', color: 'text-red-700' },
];

export default function PerovskiteSolarCellManufacturingLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.cellStructure} ${r.perovskiteType} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof PerovskiteRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const wattByStructure = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.cellStructure.split(' ')[0], (map.get(r.cellStructure.split(' ')[0]) || 0) + r.yieldWatts); });
    return Array.from(map.entries()).map(([name, yieldWatts]) => ({ name: name.slice(0, 10), yieldWatts }));
  }, []);

  const typeDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.perovskiteType.split('(')[0].trim().slice(0, 8), (map.get(r.perovskiteType.split('(')[0].trim().slice(0, 8)) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const effTrend = useMemo(() => [
    { month: 'Jan', eff: 22.5 }, { month: 'Feb', eff: 23.2 }, { month: 'Mar', eff: 24.0 }, { month: 'Apr', eff: 24.8 }, { month: 'May', eff: 25.5 }, { month: 'Jun', eff: 25.9 }, { month: 'Jul', eff: 26.1 },
  ], []);

  const areaData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), area: r.areaCm2 }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const appCount = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application.split(' ')[0], (map.get(r.application.split(' ')[0]) || 0) + 1); });
    return Array.from(map.entries()).slice(0, 6).map(([name, count]) => ({ name: name.slice(0, 10), count }));
  }, []);

  const COLORS = ['#b45309', '#d97706', '#dc2626', '#059669', '#4f46e5', '#7c3aed', '#0891b2'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="psk-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Advanced Manufacturing' }, { label: 'Perovskite Solar' }]} />
      <PageHeader title="Perovskite Solar Cell Manufacturing Logistics" description="Indian perovskite PV supply chain \u2014 Inverted p-i-n, Normal n-i-p, Tandem Perov-Si with MAPbI3, FAPbI3, CsFAMA compositions" />

      <div className="psk-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="psk-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="psk-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`psk-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-amber-600 text-amber-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="psk-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="psk-chart-card"><CardHeader><CardTitle className="text-sm">Output by Cell Structure (W)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={wattByStructure}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="yieldWatts" fill="#b45309" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="psk-chart-card"><CardHeader><CardTitle className="text-sm">Perovskite Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#b45309" /><Cell fill="#d97706" /><Cell fill="#dc2626" /><Cell fill="#059669" /><Cell fill="#4f46e5" /><Cell fill="#7c3aed" /><Cell fill="#0891b2" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="psk-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={effTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[21, 28]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="eff" stroke="#d97706" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="psk-chart-card"><CardHeader><CardTitle className="text-sm">Cell Area by Batch (cm2)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={areaData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="area" fill="#dc2626" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="psk-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Structure</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">Eff%</th><th className="px-2 py-2 text-right">cm2</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`psk-table-row border-b hover:bg-amber-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.cellStructure}</td>
                  <td className="px-2 py-2 text-xs">{r.perovskiteType}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.efficiency}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.areaCm2}</td>
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
        <div className="psk-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="psk-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#b45309" /><Cell fill="#d97706" /><Cell fill="#dc2626" /><Cell fill="#059669" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="psk-chart-card"><CardHeader><CardTitle className="text-sm">Batch Count by Application</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={appCount}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="psk-chart-card"><CardHeader><CardTitle className="text-sm">Efficiency vs Area (Batch View)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), eff: r.efficiency, area: r.areaCm2 / 10 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="eff" stroke="#b45309" strokeWidth={2} name="Eff %" /><Line type="monotone" dataKey="area" stroke="#4f46e5" strokeWidth={2} name="dm2" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="psk-chart-card"><CardHeader><CardTitle className="text-sm">Output Watts by Batch (selected)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), watts: r.yieldWatts }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="watts" fill="#059669" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="psk-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="psk-insight-card border-l-4 border-l-amber-600"><CardHeader><CardTitle className="text-sm text-amber-700">IISc Tandem Record: 31.5% Perovskite-Silicon</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">IISc Bengaluru achieved India&apos;s highest perovskite-silicon tandem efficiency at 31.5% (PSK-0003) for ISRO Gaganyaan space solar panels. Tandem architecture stacks CsFAMA wide-bandgap perovskite (1.68eV) on TOPCon silicon bottom cell — surpassing silicon Shockley-Queisser limit of 29.4%. VSSC qualifying the modules for space radiation tolerance: proton irradiation at 1MeV showing only 2% degradation after 100krad. Cost advantage: tandem modules at \u20b918/W vs silicon at \u20b922/W for space-grade cells. ISRO ordering 500 tandem modules for Gaganyaan and future GSAT satellites — total order value \u20b9285Cr. IISc scaling to 500cm2 tandem modules by Q4 2026 with slot-die coating.</p></CardContent></Card>
          <Card className="psk-insight-card border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm text-orange-700">Adani Solar: 50MW Perovskite Farm at Bhadla</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Adani Solar commissioned India&apos;s first utility-scale perovskite farm at Bhadla Rajasthan (PSK-0002, 26.1% FAPbI3 normal n-i-p structure). 50MW pilot uses 800cm2 modules with ALD SnO2 ETL and Spiro-OMeTAD HTL. Degradation testing: 98.5% initial efficiency retained after 1,000h damp-heat at 85\u00b0C/85% RH — approaching IEC 61215 certification. Land footprint 30% smaller than equivalent silicon farm due to higher efficiency. Water use: zero (dry-fab process) vs silicon 1,200L/MW for wafer cleaning. Levelized cost: \u20b92.1/kWh vs silicon \u20b92.8/kWh. Adani targeting 500MW perovskite addition across Rajasthan and Gujarat by 2028, requiring \u20b94,200Cr investment.</p></CardContent></Card>
          <Card className="psk-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: PSK-0004 and PSK-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">PSK-0004 (NCL Pune to Flextronics Chennai, 9-day delay): flexible roll-to-roll perovskite encapsulation equipment from Korea stuck at Chennai port customs — missing BIS certification for multi-layer barrier film. Flextronics expedited with \u20b985L fast-track BIS testing fee. Impact: flexible portable solar panel production line idle, losing \u20b91.2Cr/week. PSK-0013 (IIT-M to IRCON Railways, 14-day delay): 200kW railway platform canopy perovskite modules delayed — RITES structural audit flagged wind-load concerns for lightweight perovskite glass panels. IIT-M redesigning frame with galvanized steel reinforcement. New SOP: all BIPV perovskite panels must pass 180km/h wind-load test per Indian Railway Standard.</p></CardContent></Card>
          <Card className="psk-insight-card border-l-4 border-l-yellow-500"><CardHeader><CardTitle className="text-sm text-yellow-700">Lead-Free Cs2AgBiBr6: India&apos;s Eco Perovskite Push</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">CSIR-NCL Pune developing lead-free double perovskite Cs2AgBiBr6 with 14.2% efficiency — lower than Pb-perovskite but avoiding lead toxicity concerns for BIPV and indoor applications. Key advantage: non-toxic for building-integrated panels in hospitals and schools where Pb leakage risk is unacceptable. IIT-D (PSK-0010) using CsPbI2Br for transparent smart windows in DLF smart buildings — inorganic capping layer provides 100x better moisture stability than MAPbI3. SERII Chennai testing 20-year outdoor degradation at 35\u00b0C tropical conditions. MNRE draft Perovskite Safety Standards 2026: mandatory Pb-leach test below 5ppm for all BIPV installations. India targeting \u20b98,500Cr perovskite market by 2030 with 40% lead-free share.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
