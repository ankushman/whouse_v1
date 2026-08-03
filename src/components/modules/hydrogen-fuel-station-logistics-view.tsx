'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface HFSRecord {
  id: string;
  batchNo: string;
  stationType: string;
  pressure: string;
  dailyCapacity: number;
  dispensingRate: number;
  storageCapacity: number;
  compressorPower: number;
  utilization: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: HFSRecord[] = [
  { id: 'HFS-0001', batchNo: 'HFS-B2401', stationType: '350 Bar High-Pressure', pressure: '350 bar', dailyCapacity: 500, dispensingRate: 60, storageCapacity: 2000, compressorPower: 450, utilization: 72, status: 'In Transit', priority: 'Critical', origin: 'Gurgaon (IOCL)', destination: 'Delhi (DFC)', shipDate: '2026-07-20', transitDays: 1, zone: 'North', remarks: 'Delhi-Jaipur NH8 corridor station' },
  { id: 'HFS-0002', batchNo: 'HFS-B2402', stationType: '700 Bar Ultra-High', pressure: '700 bar', dailyCapacity: 200, dispensingRate: 30, storageCapacity: 800, compressorPower: 650, utilization: 45, status: 'Delivered', priority: 'High', origin: 'Bengaluru (NTPC)', destination: 'Bengaluru (BMTC)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: '700 bar for FCEV buses' },
  { id: 'HFS-0003', batchNo: 'HFS-B2403', stationType: '30 Bar Low-Pressure', pressure: '30 bar', dailyCapacity: 1000, dispensingRate: 120, storageCapacity: 5000, compressorPower: 180, utilization: 85, status: 'Processing', priority: 'Medium', origin: 'Pune (BHEL)', destination: 'Mumbai (BEST)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: 'Tube trailer delivery station' },
  { id: 'HFS-0004', batchNo: 'HFS-B2404', stationType: '350 Bar High-Pressure', pressure: '350 bar', dailyCapacity: 300, dispensingRate: 45, storageCapacity: 1200, compressorPower: 380, utilization: 58, status: 'Delayed', priority: 'Critical', origin: 'Chennai (AdvIn)', destination: 'Chennai (Metro)', shipDate: '2026-07-15', transitDays: 5, zone: 'South', remarks: 'Electrolyser-integrated station' },
  { id: 'HFS-0005', batchNo: 'HFS-B2405', stationType: '700 Bar Ultra-High', pressure: '700 bar', dailyCapacity: 150, dispensingRate: 25, storageCapacity: 600, compressorPower: 600, utilization: 38, status: 'In Transit', priority: 'High', origin: 'Hyderabad (Indian Oil)', destination: 'Hyderabad (TSRTC)', shipDate: '2026-07-21', transitDays: 1, zone: 'South', remarks: 'Hyderabad ORR corridor' },
  { id: 'HFS-0006', batchNo: 'HFS-B2406', stationType: '350 Bar High-Pressure', pressure: '350 bar', dailyCapacity: 400, dispensingRate: 55, storageCapacity: 1600, compressorPower: 420, utilization: 65, status: 'Delivered', priority: 'Medium', origin: 'Ahmedabad (GAIL)', destination: 'Gandhinagar (GSRTC)', shipDate: '2026-07-17', transitDays: 1, zone: 'West', remarks: 'Gujarat green corridor station' },
  { id: 'HFS-0007', batchNo: 'HFS-B2407', stationType: '30 Bar Low-Pressure', pressure: '30 bar', dailyCapacity: 800, dispensingRate: 100, storageCapacity: 4000, compressorPower: 150, utilization: 78, status: 'Processing', priority: 'Low', origin: 'Kolkata (Haldia)', destination: 'Haldia (HPL)', shipDate: '2026-07-23', transitDays: 2, zone: 'East', remarks: 'Industrial tube trailer hub' },
  { id: 'HFS-0008', batchNo: 'HFS-B2408', stationType: '700 Bar Ultra-High', pressure: '700 bar', dailyCapacity: 180, dispensingRate: 28, storageCapacity: 720, compressorPower: 580, utilization: 42, status: 'In Transit', priority: 'High', origin: 'Pune (Reliance)', destination: 'Pune (PMML)', shipDate: '2026-07-19', transitDays: 1, zone: 'West', remarks: 'Pune-Mumbai expressway station' },
  { id: 'HFS-0009', batchNo: 'HFS-B2409', stationType: '350 Bar High-Pressure', pressure: '350 bar', dailyCapacity: 350, dispensingRate: 50, storageCapacity: 1400, compressorPower: 400, utilization: 60, status: 'Delivered', priority: 'Medium', origin: 'Jaipur (HPCL)', destination: 'Jaipur (RSRTC)', shipDate: '2026-07-16', transitDays: 1, zone: 'North', remarks: 'Rajasthan highway network' },
  { id: 'HFS-0010', batchNo: 'HFS-B2410', stationType: '30 Bar Low-Pressure', pressure: '30 bar', dailyCapacity: 600, dispensingRate: 80, storageCapacity: 3000, compressorPower: 120, utilization: 82, status: 'Processing', priority: 'Critical', origin: 'Guwahati (AOC)', destination: 'Guwahati (ASTC)', shipDate: '2026-07-24', transitDays: 4, zone: 'East', remarks: 'NE India hub station' },
  { id: 'HFS-0011', batchNo: 'HFS-B2411', stationType: '350 Bar High-Pressure', pressure: '350 bar', dailyCapacity: 450, dispensingRate: 58, storageCapacity: 1800, compressorPower: 460, utilization: 68, status: 'In Transit', priority: 'High', origin: 'Kochi (BPCL)', destination: 'Kochi (KSRTC)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Kerala green hydrogen bus fleet' },
  { id: 'HFS-0012', batchNo: 'HFS-B2412', stationType: '700 Bar Ultra-High', pressure: '700 bar', dailyCapacity: 100, dispensingRate: 20, storageCapacity: 400, compressorPower: 550, utilization: 30, status: 'Delivered', priority: 'Low', origin: 'Lucknow (BPCL)', destination: 'Lucknow (UPSRTC)', shipDate: '2026-07-14', transitDays: 1, zone: 'North', remarks: 'UP state capital pilot' },
  { id: 'HFS-0013', batchNo: 'HFS-B2413', stationType: '350 Bar High-Pressure', pressure: '350 bar', dailyCapacity: 280, dispensingRate: 42, storageCapacity: 1100, compressorPower: 350, utilization: 55, status: 'Delayed', priority: 'High', origin: 'Indore (GAIL)', destination: 'Bhopal (MPCST)', shipDate: '2026-07-12', transitDays: 8, zone: 'North', remarks: 'MP green corridor — compressor delay' },
  { id: 'HFS-0014', batchNo: 'HFS-B2414', stationType: '30 Bar Low-Pressure', pressure: '30 bar', dailyCapacity: 900, dispensingRate: 110, storageCapacity: 4500, compressorPower: 160, utilization: 80, status: 'In Transit', priority: 'Medium', origin: 'Vizag (HPCL)', destination: 'Visakhapatnam (APSRTC)', shipDate: '2026-07-22', transitDays: 2, zone: 'South', remarks: 'Andhra Pradesh industrial hub' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Station Type', key: 'stationType', options: [
    { value: '350 Bar High-Pressure', count: 6 }, { value: '700 Bar Ultra-High', count: 4 }, { value: '30 Bar Low-Pressure', count: 4 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 6 }, { value: 'North', count: 4 }, { value: 'West', count: 3 }, { value: 'East', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Stations', value: 14, sub: 'Active Sites', color: 'text-orange-700' },
  { title: 'Total Daily Output', value: '6,010 kg', sub: 'H2 Dispensed', color: 'text-emerald-700' },
  { title: 'Avg Utilization', value: '59.4%', sub: 'Target 80%', color: 'text-blue-700' },
  { title: 'Total Storage', value: '25,720 kg', sub: 'On-Site Capacity', color: 'text-purple-700' },
];

export default function HydrogenFuelStationLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.stationType} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof HFSRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const k = r.stationType.split(' ')[0]; map.set(k, (map.get(k) || 0) + r.dailyCapacity); });
    return Array.from(map.entries()).map(([name, capacity]) => ({ name, capacity }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const utilTrend = useMemo(() => [
    { month: 'Jan', util: 35 }, { month: 'Feb', util: 39 }, { month: 'Mar', util: 43 }, { month: 'Apr', util: 48 }, { month: 'May', util: 52 }, { month: 'Jun', util: 56 }, { month: 'Jul', util: 59 },
  ], []);

  const storageData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), storage: r.storageCapacity }));
  }, []);

  const powerData = useMemo(() => {
    return records.slice(0, 7).map((r) => ({ name: r.batchNo.slice(-2), power: r.compressorPower }));
  }, []);

  const priorityDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.priority, (map.get(r.priority) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const dispensingData = useMemo(() => {
    return records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), rate: r.dispensingRate }));
  }, []);

  const COLORS = ['#b45309', '#14532d', '#581c87', '#1e3a5f', '#0c4a6e'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="hfs-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Energy' }, { label: 'H2 Fuel Station' }]} />
      <PageHeader title="Hydrogen Fuel Station Logistics" description="Indian H2 fueling station supply chain \u2014 30/350/700 bar stations, dispensing, storage & compressor tracking" />

      <div className="hfs-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hfs-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="hfs-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`hfs-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-orange-600 text-orange-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="hfs-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="hfs-chart-card"><CardHeader><CardTitle className="text-sm">Daily Capacity by Type (kg H2)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacity" fill="#b45309" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hfs-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#b45309" /><Cell fill="#14532d" /><Cell fill="#581c87" /><Cell fill="#1e3a5f" /><Cell fill="#0c4a6e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="hfs-chart-card"><CardHeader><CardTitle className="text-sm">Utilization Trend (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={utilTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[30, 70]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="util" stroke="#14532d" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="hfs-chart-card"><CardHeader><CardTitle className="text-sm">Storage Capacity by Batch (kg)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={storageData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="storage" fill="#1e3a5f" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="hfs-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Type</th><th className="px-2 py-2 text-left">Pressure</th><th className="px-2 py-2 text-right">kg/day</th><th className="px-2 py-2 text-right">kg/min</th><th className="px-2 py-2 text-right">Util%</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`hfs-table-row border-b hover:bg-orange-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.stationType}</td>
                  <td className="px-2 py-2 text-xs font-mono">{r.pressure}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.dailyCapacity}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.dispensingRate}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.utilization}%</td>
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
        <div className="hfs-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="hfs-chart-card"><CardHeader><CardTitle className="text-sm">Compressor Power by Batch (kW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={powerData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="power" fill="#581c87" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hfs-chart-card"><CardHeader><CardTitle className="text-sm">Priority Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#2563eb" /><Cell fill="#16a34a" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="hfs-chart-card"><CardHeader><CardTitle className="text-sm">Dispensing Rate by Batch (kg/min)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={dispensingData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="rate" fill="#0c4a6e" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hfs-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Utilization</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), capacity: r.dailyCapacity, util: r.utilization }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="capacity" stroke="#b45309" strokeWidth={2} name="kg/day" /><Line type="monotone" dataKey="util" stroke="#14532d" strokeWidth={2} name="Util %" /></LineChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="hfs-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hfs-insight-card border-l-4 border-l-orange-500"><CardHeader><CardTitle className="text-sm text-orange-700">National H2 Fueling Network: 500 Stations by 2030</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India targeting 500 hydrogen fueling stations by 2030 under National Hydrogen Mission. Current: 14 operational, 80 planned. OMCs (IOCL, BPCL, HPCL) converting 10% of existing CNG stations to H2 co-fueling. Delhi NCR corridor leads with 6 stations (HFS-0001, 0009, 0012, 0013 + 2 planned). Challenge: 350 bar vs 700 bar standardization — buses use 350 bar, cars use 700 bar. Dual-pressure stations cost \u20b95Cr vs \u20b93.5Cr for single. Government subsidy: \u20b92.5Cr per station under SIGHT program.</p></CardContent></Card>
          <Card className="hfs-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">30 Bar Tube Trailer Hub: Industrial Backbone</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">30 bar low-pressure stations (HFS-0003, 0007, 0010, 0014) serve as tube trailer hubs delivering H2 to remote sites. Highest utilization at 78-85%. BPCL Mumbai (HFS-0003) dispenses 1,000 kg/day to industrial customers. Key advantage: no on-site compression needed, H2 received at 200 bar from centralized green H2 plants. BHEL Pune manufacturing tube trailer modules: 4-tonne capacity each. Pipeline: 50 hubs by 2028 covering all major industrial corridors. Total investment: \u20b92,800Cr.</p></CardContent></Card>
          <Card className="hfs-insight-card border-l-4 border-l-sky-500"><CardHeader><CardTitle className="text-sm text-sky-700">FCEV Bus Fleet Driving Demand</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">State transport corporations driving H2 station demand. BMTC Bengaluru (HFS-0002): 200 FCEV buses need 700 bar station, 200 kg/day. TSRTC Hyderabad (HFS-0005): 150 buses on ORR corridor. Kerala KSRTC (HFS-0011): 100 buses for Kochi-Trivandrum route. FCEV range: 400km per fill, 8 min refueling. Diesel savings: \u20b93.2/km per bus. Operating 750 FCEV buses nationwide by 2027 requires 60+ dedicated stations. Tata Motors and Ashok Leyland supplying 70-bar hydrogen buses.</p></CardContent></Card>
          <Card className="hfs-insight-card border-l-4 border-l-red-500"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Stations: HFS-0004 Chennai & HFS-0013 Bhopal</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">HFS-0004 (Chennai Metro, 350 bar): electrolyser-integrated station delayed 5 days — AdvIn PEM electrolyser delivery from Denmark hit by customs hold at Chennai port. HFS-0013 (Bhopal MPCST, 350 bar): compressor unit from GAIL Indore delayed 8 days due to heavy monsoon flooding on NH-52. Mitigation: maintain compressor buffer stock at GAIL depot; pre-clear imported electrolyser through SRM Chennai. Financial impact: \u20b928L total demurrage + FCEV bus fleet idle cost of \u20b95L/day.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
