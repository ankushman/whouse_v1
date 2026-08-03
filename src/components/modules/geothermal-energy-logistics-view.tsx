'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface GeothermalRecord {
  id: string;
  batchNo: string;
  plantType: string;
  wellType: string;
  siteLocation: string;
  depthM: number;
  temperature: number;
  capacityMW: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: GeothermalRecord[] = [
  { id: 'GEO-0001', batchNo: 'GEO-B2401', plantType: 'Binary ORC', wellType: 'Injection Well', siteLocation: 'Puga Valley Ladakh', depthM: 3000, temperature: 250, capacityMW: 5, status: 'In Transit', priority: 'Critical', origin: 'Manesar (L&T Geo)', destination: 'Leh (Puga Site)', shipDate: '2026-07-20', transitDays: 5, zone: 'North', remarks: '3MW ORC unit for Puga Phase-1 pilot' },
  { id: 'GEO-0002', batchNo: 'GEO-B2402', plantType: 'Flash Steam', wellType: 'Production Well', siteLocation: 'Cambay Basin Gujarat', depthM: 2500, temperature: 180, capacityMW: 20, status: 'Delivered', priority: 'High', origin: 'Vadodara (ONGC Workshop)', destination: 'Ahmedabad (GSECL Cambay)', shipDate: '2026-07-18', transitDays: 1, zone: 'West', remarks: 'Flash turbine for Cambay geothermal field' },
  { id: 'GEO-0003', batchNo: 'GEO-B2403', plantType: 'EGS Enhanced', wellType: 'Horizontal Well', siteLocation: 'Manikaran HP', depthM: 4000, temperature: 320, capacityMW: 10, status: 'Processing', priority: 'Medium', origin: 'Jalandhar (BHEL R&D)', destination: 'Kullu (Manikaran Site)', shipDate: '2026-07-22', transitDays: 3, zone: 'North', remarks: 'Hot dry rock stim injection equipment' },
  { id: 'GEO-0004', batchNo: 'GEO-B2404', plantType: 'Binary ORC', wellType: 'Monitoring Well', siteLocation: 'Tapovan Uttarakhand', depthM: 3500, temperature: 200, capacityMW: 3, status: 'Delayed', priority: 'Critical', origin: 'Roorkee (IIT-Roorkee)', destination: 'Joshimath (Tapovan Site)', shipDate: '2026-07-14', transitDays: 12, zone: 'North', remarks: 'Landslide blocked NH58 pipe transport' },
  { id: 'GEO-0005', batchNo: 'GEO-B2405', plantType: 'Flash Steam', wellType: 'Production Well', siteLocation: 'Surajkund Hazaribagh', depthM: 2200, temperature: 160, capacityMW: 15, status: 'In Transit', priority: 'High', origin: 'Ranchi (SAIL Foundry)', destination: 'Hazaribagh (JSEB Site)', shipDate: '2026-07-21', transitDays: 1, zone: 'East', remarks: 'Ranchi plate heat exchanger 1800kW' },
  { id: 'GEO-0006', batchNo: 'GEO-B2406', plantType: 'EGS Enhanced', wellType: 'Fracture Well', siteLocation: 'Bakkhali Sundarbans', depthM: 2800, temperature: 140, capacityMW: 8, status: 'Delivered', priority: 'Medium', origin: 'Kolkata (DCPL)', destination: 'Sagar Island (WBREDA)', shipDate: '2026-07-17', transitDays: 3, zone: 'East', remarks: 'Low-temp binary cycle for island micro-grid' },
  { id: 'GEO-0007', batchNo: 'GEO-B2407', plantType: 'Ground Source HP', wellType: 'Borehole Array', siteLocation: 'Gandhinagar Gujarat', depthM: 150, temperature: 28, capacityMW: 2, status: 'Processing', priority: 'Low', origin: 'Mumbai (Voltas HVAC)', destination: 'Gandhinagar (GIDC Complex)', shipDate: '2026-07-23', transitDays: 1, zone: 'West', remarks: 'GSHP district cooling 400TR capacity' },
  { id: 'GEO-0008', batchNo: 'GEO-B2408', plantType: 'Binary ORC', wellType: 'Injection Well', siteLocation: 'Chhumathang Ladakh', depthM: 3200, temperature: 280, capacityMW: 7, status: 'In Transit', priority: 'High', origin: 'Chandigarh (THERMAX)', destination: 'Chhumathang (LREDA)', shipDate: '2026-07-19', transitDays: 6, zone: 'North', remarks: 'ORC turbine bypass valve assembly' },
  { id: 'GEO-0009', batchNo: 'GEO-B2409', plantType: 'Flash Steam', wellType: 'Production Well', siteLocation: 'Tattapani HP', depthM: 2000, temperature: 150, capacityMW: 12, status: 'Delivered', priority: 'High', origin: 'Baddi (SME Forge)', destination: 'Mandi (SJVN Tattapani)', shipDate: '2026-07-16', transitDays: 2, zone: 'North', remarks: 'Tattapani cascaded heat-power plant' },
  { id: 'GEO-0010', batchNo: 'GEO-B2410', plantType: 'EGS Enhanced', wellType: 'Horizontal Well', siteLocation: 'Son-Narmada MP', depthM: 3500, temperature: 220, capacityMW: 25, status: 'Processing', priority: 'Critical', origin: 'Bhopal (BHEL Plant)', destination: 'Jabalpur (MPURJA Site)', shipDate: '2026-07-24', transitDays: 1, zone: 'West', remarks: 'EGS pilot for Narmada rift valley zone' },
  { id: 'GEO-0011', batchNo: 'GEO-B2411', plantType: 'Binary ORC', wellType: 'Production Well', siteLocation: 'Barren Island Andaman', depthM: 2500, temperature: 190, capacityMW: 5, status: 'In Transit', priority: 'Medium', origin: 'Chennai (L&T Shipyard)', destination: 'Port Blair (ANIL)', shipDate: '2026-07-20', transitDays: 8, zone: 'South', remarks: 'Volcanic island geothermal exploration rig' },
  { id: 'GEO-0012', batchNo: 'GEO-B2412', plantType: 'Ground Source HP', wellType: 'Borehole Array', siteLocation: 'Bengaluru Karnataka', depthM: 100, temperature: 24, capacityMW: 1.5, status: 'Delivered', priority: 'Low', origin: 'Coimbatore (Blue Star)', destination: 'Bengaluru (KIIDC Campus)', shipDate: '2026-07-13', transitDays: 1, zone: 'South', remarks: 'GSHP for IISc residential block 200kW' },
  { id: 'GEO-0013', batchNo: 'GEO-B2413', plantType: 'Flash Steam', wellType: 'Injection Well', siteLocation: 'Unai Gujarat', depthM: 1800, temperature: 120, capacityMW: 10, status: 'Delayed', priority: 'High', origin: 'Surat (Essar Fab)', destination: 'Navsari (GSECL Unai)', shipDate: '2026-07-11', transitDays: 14, zone: 'West', remarks: 'Well casing corrosion recall — SS316L rework' },
  { id: 'GEO-0014', batchNo: 'GEO-B2414', plantType: 'EGS Enhanced', wellType: 'Monitoring Well', siteLocation: 'Puga Valley Ladakh', depthM: 3800, temperature: 340, capacityMW: 15, status: 'In Transit', priority: 'Critical', origin: 'Delhi (DRDO Geothermal)', destination: 'Leh (Puga Phase-2)', shipDate: '2026-07-22', transitDays: 4, zone: 'North', remarks: 'Puga Phase-2 deep EGS monitoring sensors' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Plant Type', key: 'plantType', options: [
    { value: 'Binary ORC', count: 4 }, { value: 'Flash Steam', count: 4 }, { value: 'EGS Enhanced', count: 4 }, { value: 'Ground Source HP', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 4 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 7 }, { value: 'West', count: 3 }, { value: 'East', count: 2 }, { value: 'South', count: 2 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Plants', value: 14, sub: 'Active Developments', color: 'text-orange-700' },
  { title: 'Combined Capacity', value: '138.5 MW', sub: 'Geothermal Power', color: 'text-red-700' },
  { title: 'Avg Temperature', value: '218\u00b0C', sub: 'Puga 340\u00b0C Peak', color: 'text-amber-700' },
  { title: 'Total Investment', value: '\u20b94,850Cr', sub: 'MNRE Geothermal Plan', color: 'text-emerald-700' },
];

export default function GeothermalEnergyLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.plantType} ${r.wellType} ${r.siteLocation} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof GeothermalRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const capacityByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.plantType, (map.get(r.plantType) || 0) + r.capacityMW); });
    return Array.from(map.entries()).map(([name, capacity]) => ({ name: name.slice(0, 12), capacity }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const tempTrend = useMemo(() => [
    { month: 'Jan', temp: 195 }, { month: 'Feb', temp: 198 }, { month: 'Mar', temp: 202 }, { month: 'Apr', temp: 208 }, { month: 'May', temp: 212 }, { month: 'Jun', temp: 215 }, { month: 'Jul', temp: 218 },
  ], []);

  const depthData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), depth: r.depthM }));
  }, []);

  const wellTypeData = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.wellType, (map.get(r.wellType) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.slice(0, 14), value }));
  }, []);

  const tempByZone = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    records.forEach((r) => { const z = map.get(r.zone) || { total: 0, count: 0 }; z.total += r.temperature; z.count += 1; map.set(r.zone, z); });
    return Array.from(map.entries()).map(([name, data]) => ({ name, avgTemp: Math.round(data.total / data.count) }));
  }, []);

  const COLORS = ['#9a3412', '#dc2626', '#d97706', '#059669', '#7c3aed'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="geo-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Renewable Energy' }, { label: 'Geothermal Energy' }]} />
      <PageHeader title="Geothermal Energy Logistics" description="Indian geothermal supply chain \u2014 Binary ORC, Flash Steam, EGS Enhanced, Ground Source HP across Puga, Cambay, Manikaran, Tapovan" />

      <div className="geo-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="geo-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="geo-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`geo-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-orange-600 text-orange-700' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="geo-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="geo-chart-card"><CardHeader><CardTitle className="text-sm">Capacity by Plant Type (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="capacity" fill="#9a3412" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="geo-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#9a3412" /><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#059669" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="geo-chart-card"><CardHeader><CardTitle className="text-sm">Temperature Trend (\u00b0C)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={tempTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis domain={[180, 230]} tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="temp" stroke="#dc2626" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="geo-chart-card"><CardHeader><CardTitle className="text-sm">Well Depth by Batch (m)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={depthData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="depth" fill="#d97706" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="geo-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Plant Type</th><th className="px-2 py-2 text-left">Well Type</th><th className="px-2 py-2 text-left">Site</th><th className="px-2 py-2 text-right">MW</th><th className="px-2 py-2 text-right">\u00b0C</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`geo-table-row border-b hover:bg-orange-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.plantType}</td>
                  <td className="px-2 py-2 text-xs">{r.wellType}</td>
                  <td className="px-2 py-2 text-xs">{r.siteLocation}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.capacityMW}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.temperature}</td>
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
        <div className="geo-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="geo-chart-card"><CardHeader><CardTitle className="text-sm">Well Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={wellTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#9a3412" /><Cell fill="#dc2626" /><Cell fill="#d97706" /><Cell fill="#059669" /><Cell fill="#7c3aed" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="geo-chart-card"><CardHeader><CardTitle className="text-sm">Avg Temperature by Zone (\u00b0C)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={tempByZone}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="avgTemp" fill="#059669" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="geo-chart-card"><CardHeader><CardTitle className="text-sm">Capacity vs Depth (Batch View)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), capacity: r.capacityMW, depth: r.depthM / 100 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="capacity" stroke="#9a3412" strokeWidth={2} name="MW" /><Line type="monotone" dataKey="depth" stroke="#d97706" strokeWidth={2} name="km" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="geo-chart-card"><CardHeader><CardTitle className="text-sm">Temperature vs Capacity (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.siteLocation.split(' ')[0].slice(0, 8), temp: r.temperature, capacity: r.capacityMW }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="temp" fill="#dc2626" radius={[4,4,0,0]} name="\u00b0C" /><Bar dataKey="capacity" fill="#059669" radius={[4,4,0,0]} name="MW" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="geo-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="geo-insight-card border-l-4 border-l-orange-600"><CardHeader><CardTitle className="text-sm text-orange-700">Puga Valley: India&apos;s Flagship Geothermal Project</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Puga Valley in Ladakh (GEO-0001, 0014) hosts India&apos;s highest-temperature geothermal resource at 340\u00b0C and 10,000MW estimated potential. ONGC began Phase-1 drilling in 2024 — three production wells at 3,000m depth confirmed 250\u00b0C reservoir. L&amp;T Geothermal supplying 3MW binary ORC unit (GEO-0001) for pilot power generation. Phase-2 (GEO-0014) targets 15MW EGS at 3,800m with DRDO-developed downhole sensors. DRDO interest: strategic energy independence for forward military bases replacing diesel generators saving \u20b912Cr/year. Full development target: 1,000MW by 2035, estimated cost \u20b94,500Cr. MNRE allocated \u20b9850Cr for Puga development under Geothermal Energy Programme.</p></CardContent></Card>
          <Card className="geo-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Cambay Basin: Gujarat&apos;s Industrial Geothermal Hub</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Cambay Basin geothermal field (GEO-0002, 20MW) leverages ONGC&apos;s existing oil well infrastructure — repurposing 3 abandoned wells at 2,500m depth with 180\u00b0C reservoir. Flash steam plant designed by BHEL Vadodara delivers 20MW baseload power to GSECL grid at \u20b93.2/kWh — cheaper than gas-turbine peak power at \u20b98.5/kWh. Unique advantage: co-produced geothermal brine yields lithium extraction at 200mg/L — worth additional \u20b945Cr/year. GSECL planning 50MW expansion by 2028 using 12 more repurposed wells. ONGC estimating Cambay geothermal potential at 500MW across three fault blocks. Gujarat government offering 30% capital subsidy under State Renewable Energy Policy 2025.</p></CardContent></Card>
          <Card className="geo-insight-card border-l-4 border-l-amber-500"><CardHeader><CardTitle className="text-sm text-amber-700">Delayed Shipments: GEO-0004 and GEO-0013</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">GEO-0004 (IIT-Roorkee to Tapovan, 12-day delay): landslide on NH58 near Joshimath blocked heavy equipment transport to Tapovan geothermal site. Border Roads Organisation (BRO) deployed two dozers but clearance took 8 days. IIT-Roorkee monitoring equipment for 3MW binary ORC plant delayed — project commissioning pushed from August to October 2026. GEO-0013 (Surat to Navsari, 14-day delay): well casing components recalled due to corrosion test failure at 180\u00b0C. Original CS-grade casing upgraded to SS316L at Essar Fab — rework cost \u20b92.8Cr. New SOP: all geothermal well casings must pass 200\u00b0C 30-day corrosion test before shipment.</p></CardContent></Card>
          <Card className="geo-insight-card border-l-4 border-l-emerald-500"><CardHeader><CardTitle className="text-sm text-emerald-700">EGS Enhanced Geothermal: India&apos;s Hot Dry Rock Frontier</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s EGS programme (GEO-0003 Manikaran, GEO-0010 Son-Narmada) targets hot dry rock formations with no natural hydrothermal resource. BHEL R&amp;D developed proprietary hydraulic fracturing technology adapted from oil-and-gas for geothermal — 40% lower stimulation cost than US EGS methods. Manikaran pilot: 10MW at 3,200m depth, 320\u00b0C rock temperature. SJVN negotiating PPA at \u20b94.5/kWh. Son-Narmada MP pilot: 25MW targeting Narmada rift valley geothermal anomaly detected by GSI in 2023. Geological Survey of India mapping 7 additional EGS prospect zones across Maharashtra, Chhattisgarh, and Jharkhand with estimated combined potential of 3,000MW. MNRE budget: \u20b91,200Cr for EGS R&amp;D 2026-2030.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
