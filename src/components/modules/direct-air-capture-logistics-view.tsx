'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface DACRecord {
  id: string;
  batchNo: string;
  sorbentType: string;
  captureMethod: string;
  captureCapacity: number;
  energyConsumption: number;
  removalEfficiency: number;
  purity: number;
  dailyCapture: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: DACRecord[] = [
  { id: 'DAC-0001', batchNo: 'DAC-B2401', sorbentType: 'Solid Amine Sorbent', captureMethod: 'Temperature Swing Adsorption', captureCapacity: 500, energyConsumption: 8500, removalEfficiency: 92, purity: 97.5, dailyCapture: 120, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (IISc)', destination: 'Mumbai (Tata Power)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'PEI-grained silica pellets' },
  { id: 'DAC-0002', batchNo: 'DAC-B2402', sorbentType: 'Liquid Solvent KOH', captureMethod: 'Liquid Solvent Scrubbing', captureCapacity: 800, energyConsumption: 12000, removalEfficiency: 88, purity: 98.2, dailyCapture: 200, status: 'Delivered', priority: 'High', origin: 'Hyderabad (CSIR-IICT)', destination: 'Delhi (NTPC)', shipDate: '2026-07-18', transitDays: 3, zone: 'North', remarks: 'Caustic potash regeneration' },
  { id: 'DAC-0003', batchNo: 'DAC-B2403', sorbentType: 'Metal-Organic Framework', captureMethod: 'Electrochemical Swing', captureCapacity: 300, energyConsumption: 5500, removalEfficiency: 95, purity: 99.1, dailyCapture: 75, status: 'Processing', priority: 'Medium', origin: 'Pune (NCL)', destination: 'Gandhinagar (Reliance)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Mg-MOF-74 coated monolith' },
  { id: 'DAC-0004', batchNo: 'DAC-B2404', sorbentType: 'Solid Amine Sorbent', captureMethod: 'Moisture Swing Adsorption', captureCapacity: 200, energyConsumption: 3200, removalEfficiency: 90, purity: 96.8, dailyCapture: 50, status: 'Delayed', priority: 'Critical', origin: 'Chennai (IIT-M)', destination: 'Kolkata (DVC)', shipDate: '2026-07-15', transitDays: 6, zone: 'East', remarks: 'Bio-inspired DAC — monsoon delay' },
  { id: 'DAC-0005', batchNo: 'DAC-B2405', sorbentType: 'Zeolite 13X', captureMethod: 'Pressure Swing Adsorption', captureCapacity: 400, energyConsumption: 7000, removalEfficiency: 85, purity: 99.5, dailyCapture: 100, status: 'In Transit', priority: 'High', origin: 'Baroda (GSFC)', destination: 'Ahmedabad (Adani Green)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: 'High-purity industrial zeolite' },
  { id: 'DAC-0006', batchNo: 'DAC-B2406', sorbentType: 'Aqueous Amine Solution', captureMethod: 'Advanced Amine Scrubbing', captureCapacity: 1000, energyConsumption: 10000, removalEfficiency: 86, purity: 97.8, dailyCapture: 250, status: 'Delivered', priority: 'Medium', origin: 'Dhanbad (IIT-ISM)', destination: 'Ranchi (JSEB)', shipDate: '2026-07-17', transitDays: 1, zone: 'East', remarks: 'MEA solution for coal-plant integration' },
  { id: 'DAC-0007', batchNo: 'DAC-B2407', sorbentType: 'Biochar Sorbent', captureMethod: 'Thermal Regeneration', captureCapacity: 150, energyConsumption: 4000, removalEfficiency: 78, purity: 94.0, dailyCapture: 35, status: 'Processing', priority: 'Low', origin: 'Dehradun (FRI)', destination: 'Lucknow (UPPCL)', shipDate: '2026-07-23', transitDays: 2, zone: 'North', remarks: 'Agricultural waste biochar' },
  { id: 'DAC-0008', batchNo: 'DAC-B2408', sorbentType: 'Metal-Organic Framework', captureMethod: 'Vacuum Pressure Swing', captureCapacity: 350, energyConsumption: 4800, removalEfficiency: 94, purity: 99.3, dailyCapture: 85, status: 'In Transit', priority: 'High', origin: 'Mumbai (TIFR)', destination: 'Bengaluru (Wipro)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'UiO-66-NH2 framework batch' },
  { id: 'DAC-0009', batchNo: 'DAC-B2409', sorbentType: 'Solid Amine Sorbent', captureMethod: 'Temperature Swing Adsorption', captureCapacity: 600, energyConsumption: 9000, removalEfficiency: 93, purity: 98.0, dailyCapture: 150, status: 'Delivered', priority: 'Medium', origin: 'Kolkata (IIT-KGP)', destination: 'Bhubaneswar (NALCO)', shipDate: '2026-07-16', transitDays: 3, zone: 'East', remarks: 'Quaternary amine resin beads' },
  { id: 'DAC-0010', batchNo: 'DAC-B2410', sorbentType: 'Carbon Nanotube Aerogel', captureMethod: 'Electrothermal Desorption', captureCapacity: 250, energyConsumption: 6200, removalEfficiency: 91, purity: 99.6, dailyCapture: 60, status: 'Processing', priority: 'Critical', origin: 'Kanpur (IIT-K)', destination: 'Noida (HCL)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: 'CNT aerogel pilot batch' },
  { id: 'DAC-0011', batchNo: 'DAC-B2411', sorbentType: 'Liquid Solvent NaOH', captureMethod: 'Ca Looping Process', captureCapacity: 1200, energyConsumption: 11000, removalEfficiency: 87, purity: 99.9, dailyCapture: 300, status: 'In Transit', priority: 'High', origin: 'Jamnagar (Reliance)', destination: 'Mumbai (BARC)', shipDate: '2026-07-20', transitDays: 2, zone: 'West', remarks: 'CaO carbonation loop' },
  { id: 'DAC-0012', batchNo: 'DAC-B2412', sorbentType: 'Hydroxide Sorbent', captureMethod: 'Solid DAC Contactors', captureCapacity: 180, energyConsumption: 2800, removalEfficiency: 82, purity: 96.5, dailyCapture: 42, status: 'Delivered', priority: 'Low', origin: 'Jodhpur (CAZRI)', destination: 'Jaipur (RSEB)', shipDate: '2026-07-14', transitDays: 2, zone: 'North', remarks: 'Desert-optimized low-energy DAC' },
  { id: 'DAC-0013', batchNo: 'DAC-B2413', sorbentType: 'Amine Oxide Polymer', captureMethod: 'Humidity Swing Cycle', captureCapacity: 350, energyConsumption: 3800, removalEfficiency: 89, purity: 97.2, dailyCapture: 80, status: 'Delayed', priority: 'High', origin: 'Thiruvananthapuram (VSSC)', destination: 'Kochi (BPCL)', shipDate: '2026-07-12', transitDays: 8, zone: 'South', remarks: 'Polyethyleneimine polymer — port congestion' },
  { id: 'DAC-0014', batchNo: 'DAC-B2414', sorbentType: 'Zeolite 5A', captureMethod: 'Pressure Temperature Swing', captureCapacity: 450, energyConsumption: 7500, removalEfficiency: 84, purity: 99.0, dailyCapture: 110, status: 'In Transit', priority: 'Medium', origin: 'Coimbatore (PSG Tech)', destination: 'Madurai (TNEB)', shipDate: '2026-07-22', transitDays: 1, zone: 'South', remarks: 'Dual-swing industrial zeolite' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Sorbent Type', key: 'sorbentType', options: [
    { value: 'Solid Amine Sorbent', count: 3 }, { value: 'Metal-Organic Framework', count: 2 }, { value: 'Liquid Solvent KOH', count: 1 }, { value: 'Zeolite 13X', count: 1 }, { value: 'Aqueous Amine Solution', count: 1 }, { value: 'Biochar Sorbent', count: 1 }, { value: 'Carbon Nanotube Aerogel', count: 1 }, { value: 'Liquid Solvent NaOH', count: 1 }, { value: 'Hydroxide Sorbent', count: 1 }, { value: 'Amine Oxide Polymer', count: 1 }, { value: 'Zeolite 5A', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 4 }, { value: 'North', count: 4 }, { value: 'South', count: 4 }, { value: 'East', count: 3 }, { value: 'Central', count: 0 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Units', value: 14, sub: 'DAC Systems', color: 'text-sky-700' },
  { title: 'Total Capture', value: '1,657 TPD', sub: 'CO2 Removed', color: 'text-teal-700' },
  { title: 'Avg Efficiency', value: '89.1%', sub: 'Removal Rate', color: 'text-emerald-700' },
  { title: 'Avg Energy', value: '7,129 kWh/T', sub: 'Per Tonne CO2', color: 'text-orange-700' },
];

export default function DirectAirCaptureLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.sorbentType} ${r.captureMethod} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof DACRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityBySorbent = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.sorbentType.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.captureCapacity); });
    return Array.from(map.entries()).map(([name, capacity]) => ({ name: name.slice(0, 12), capacity }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const energyTrend = useMemo(() => [
    { month: 'Jan', energy: 9500 }, { month: 'Feb', energy: 9100 }, { month: 'Mar', energy: 8700 }, { month: 'Apr', energy: 8300 }, { month: 'May', energy: 7800 }, { month: 'Jun', energy: 7400 }, { month: 'Jul', energy: 7129 },
  ], []);

  const captureByMethod = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.captureMethod.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.dailyCapture); });
    return Array.from(map.entries()).map(([name, capture]) => ({ name: name.slice(0, 10), capture }));
  }, []);

  const efficiencyData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), eff: r.removalEfficiency }));
  }, []);

  const priorityDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.priority, (map.get(r.priority) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const purityData = useMemo(() => {
    return records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), purity: r.purity }));
  }, []);

  const COLORS = ['#0c4a6e', '#14532d', '#581c87', '#7c2d12', '#1e3a5f'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="dac-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Environment' }, { label: 'Direct Air Capture' }]} />
      <PageHeader title="Direct Air Capture Logistics" description="Indian DAC supply chain \u2014 Solid amine, MOF, zeolite, liquid solvent sorbents & CO2 removal tracking" />

      <div className="dac-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="dac-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="dac-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`dac-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-sky-600 text-sky-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="dac-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="dac-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Sorbent Type (TPD CO2)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityBySorbent}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacity" fill="#0c4a6e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="dac-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#0c4a6e" /><Cell fill="#14532d" /><Cell fill="#581c87" /><Cell fill="#7c2d12" /><Cell fill="#1e3a5f" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="dac-chart-card"><CardHeader><CardTitle className="text-sm">Energy Consumption Trend (kWh/T CO2)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={energyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[6000, 10000]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="energy" stroke="#7c2d12" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="dac-chart-card"><CardHeader><CardTitle className="text-sm">Daily Capture by Method (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={captureByMethod}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capture" fill="#14532d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="dac-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Sorbent</th><th className="px-2 py-2 text-left">Method</th><th className="px-2 py-2 text-right">TPD</th><th className="px-2 py-2 text-right">kWh/T</th><th className="px-2 py-2 text-right">Eff%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`dac-table-row border-b hover:bg-sky-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.sorbentType}</td>
                  <td className="px-2 py-2 text-xs">{r.captureMethod}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.captureCapacity}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.energyConsumption.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.removalEfficiency}%</td>
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
        <div className="dac-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="dac-chart-card"><CardHeader><CardTitle className="text-sm">Removal Efficiency by Batch (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={efficiencyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[70, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="eff" fill="#581c87" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="dac-chart-card"><CardHeader><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#2563eb" /><Cell fill="#16a34a" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="dac-chart-card"><CardHeader><CardTitle className="text-sm">CO2 Purity by Batch (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={purityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[93, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="purity" fill="#14532d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="dac-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Energy Consumption</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), capacity: r.captureCapacity, energy: r.energyConsumption }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="capacity" stroke="#0c4a6e" strokeWidth={2} name="TPD" /><Line type="monotone" dataKey="energy" stroke="#7c2d12" strokeWidth={2} name="kWh/T" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="dac-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="dac-insight-card border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm text-sky-700">MOF Sorbents: Highest Efficiency at Lowest Energy</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Metal-Organic Framework sorbents (DAC-0003 Mg-MOF-74, DAC-0008 UiO-66-NH2) achieve 94-95% removal efficiency at only 4,800-5,500 kWh/T CO2 — 30% less energy than solid amine. NCL Pune developing next-gen MOF with amine-functionalized pores targeting 97% efficiency. Challenge: MOF synthesis scale-up cost remains 3x solid amine. CSIR funding: \u20b9180Cr for MOF pilot at 10TPD by 2028. Potential: if MOF cost drops below \u20b91,500/kg, DAC energy target of 3,000 kWh/T achievable by 2030.</p></CardContent></Card>
          <Card className="dac-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">India&apos;s Carbon Removal Target: 10MT CO2/year</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Long-Term Low Carbon Development Strategy targets 10 million tonnes CO2 removal annually by 2050. Current DAC fleet: 1,657 TPD (0.6MT/year). Gap: 9.4MT requires 15,000 additional DAC units at current avg 350TPD per unit. Government incentive: \u20b9450/tonne CO2 removed under Carbon Credit Trading Scheme. Private investment pipeline: Tata Power 2,000TPD plant in Maharashtra, Adani Green 3,000TPD in Gujarat, NTPC 5,000TPD in UP. Total committed: \u20b98,500Cr for 2030 milestone of 5MT/year.</p></CardContent></Card>
          <Card className="dac-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Biochar DAC: Low-Cost Rural Deployment</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">DAC-0007 (Forest Research Institute Dehradun) uses agricultural waste biochar as low-cost sorbent. Energy: only 4,000 kWh/T, lowest in fleet. Efficiency: 78% — below industrial threshold but suitable for rural verification sites. Advantage: sorbent production cost \u20b9200/kg vs \u20b93,500/kg for solid amine. Kerosene: co-locate biochar DAC with biomass power plants. IIT-ISM Dhanbad pilot: integrate biochar DAC with coal-plant flue gas for hybrid capture. Budget: \u20b935Cr for 50 village-level units across Punjab, Haryana, UP.</p></CardContent></Card>
          <Card className="dac-insight-card border-l-4 border-l-purple-500"><CardHeader><CardTitle className="text-sm text-purple-700">Delayed Shipments: DAC-0004 & DAC-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Two delayed shipments. DAC-0004 (IIT-M Chennai to DVC Kolkata): moisture swing sorbent requires dry transport, monsoon flooding disrupted NH5 corridor for 6 days. DAC-0013 (VSSC Thiruvananthapuram to BPCL Kochi): amine oxide polymer shipment stuck at Cochin port for 8 days — RoRo vessel scheduling conflict. Mitigation: pre-book dedicated dry containers for hygroscopic sorbents; shift Kochi shipments to road route via NH66. Financial impact: \u20b922L demurrage + sorbent degradation risk for moisture-sensitive batches.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
