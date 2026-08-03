'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface SGORecord {
  id: string;
  batchNo: string;
  platformType: string;
  gridRegion: string;
  functionality: string;
  nodesDeployed: number;
  latencyMs: number;
  coveragePct: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: SGORecord[] = [
  { id: 'SGO-0001', batchNo: 'SGO-D2401', platformType: 'ADMS (Distribution)', gridRegion: 'Western Region (WR)', functionality: 'FLISR + DERMS + Volt/VAR', nodesDeployed: 12500, latencyMs: 200, coveragePct: 72, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (ABB India)', destination: 'Mumbai (MSETCL)', shipDate: '2026-07-20', transitDays: 1, zone: 'West', remarks: '12,500-node ABB Ability ADMS for MSETCL Maharashtra Western Region &#8212; fault location isolation service restoration + DER management' },
  { id: 'SGO-0002', batchNo: 'SGO-D2402', platformType: 'EMS/SCADA (Transmission)', gridRegion: 'Southern Region (SR)', functionality: 'Real-Time Monitoring + AGC', nodesDeployed: 8500, latencyMs: 100, coveragePct: 88, status: 'Delivered', priority: 'High', origin: 'Hyderabad (Siemens India)', destination: 'Bengaluru (KPTCL)', shipDate: '2026-07-18', transitDays: 0, zone: 'South', remarks: '8,500-node Siemens Spectrum Power 7 EMS/SCADA for KPTCL Karnataka &#8212; automatic generation control + 100ms grid snapshot' },
  { id: 'SGO-0003', batchNo: 'SGO-D2403', platformType: 'DERMS (Distributed)', gridRegion: 'Northern Region (NR)', functionality: 'Solar + BESS Dispatch', nodesDeployed: 6000, latencyMs: 300, coveragePct: 45, status: 'Processing', priority: 'High', origin: 'Noida (Schneider India)', destination: 'Jaipur (RVPN)', shipDate: '2026-07-23', transitDays: 1, zone: 'North', remarks: '6,000-node Schneider EcoStruxure DERMS for RVPN Rajasthan &#8212; rooftop solar + BESS real-time dispatch optimization' },
  { id: 'SGO-0004', batchNo: 'SGO-D2404', platformType: 'OMS (Outage Mgmt)', gridRegion: 'Eastern Region (ER)', functionality: 'Crew Dispatch + CIS', nodesDeployed: 4200, latencyMs: 500, coveragePct: 58, status: 'In Transit', priority: 'Critical', origin: 'Pune (GE T&amp;D India)', destination: 'Kolkata (CESC)', shipDate: '2026-07-19', transitDays: 3, zone: 'East', remarks: '4,200-node GE GridOS OMS for CESC Kolkata &#8214; crew dispatch optimization + storm outage prediction ML model' },
  { id: 'SGO-0005', batchNo: 'SGO-D2405', platformType: 'MDM (Meter Data)', gridRegion: 'NER Eastern India', functionality: 'AMI Head-End + Analytics', nodesDeployed: 200000, latencyMs: 1500, coveragePct: 35, status: 'Delayed', priority: 'Medium', origin: 'Gurgaon (Oracle India)', destination: 'Patna (BRPL Bihar)', shipDate: '2026-07-12', transitDays: 14, zone: 'East', remarks: '200,000-smart-meter Oracle Utilities MDM for BRPL Bihar &#8212; AMI head-end system delay pending 4G IoT gateway provisioning' },
  { id: 'SGO-0006', batchNo: 'SGO-D2406', platformType: 'DERMS + VPP', gridRegion: 'Southern Region (SR)', functionality: 'Virtual Power Plant', nodesDeployed: 3500, latencyMs: 250, coveragePct: 62, status: 'Delivered', priority: 'High', origin: 'Chennai (TCS Digital)', destination: 'Coimbatore (TNEB)', shipDate: '2026-07-16', transitDays: 0, zone: 'South', remarks: '3,500-node TCS VPP platform for TNEB Coimbatore &#8212; aggregating 200 MW rooftop solar + 50 MW BESS as virtual power plant' },
  { id: 'SGO-0007', batchNo: 'SGO-D2407', platformType: 'Transactive Energy', gridRegion: 'Western Region (WR)', functionality: 'Peer-to-Peer Energy Trading', nodesDeployed: 15000, latencyMs: 400, coveragePct: 28, status: 'In Transit', priority: 'High', origin: 'Mumbai (Power Ledger India)', destination: 'Surat ( Torrent Power)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: '15,000-node Power Ledger blockchain P2P trading for Torrent Surat &#8212; prosumer energy marketplace on IEX price signals' },
  { id: 'SGO-0008', batchNo: 'SGO-D2408', platformType: 'AI Grid Analytics', gridRegion: 'Northern Region (NR)', functionality: 'Load Forecast + Fraud Detection', nodesDeployed: 30000, latencyMs: 2000, coveragePct: 52, status: 'Delivered', priority: 'Medium', origin: 'Bengaluru (Infosys Energy)', destination: 'Delhi (BRPL ND)', shipDate: '2026-07-15', transitDays: 1, zone: 'North', remarks: '30,000-node Infosys AI grid analytics for BRPL Delhi &#8212; 24hr load forecast 96% accuracy + 12% theft reduction using smart meter ML' },
  { id: 'SGO-0009', batchNo: 'SGO-D2409', platformType: 'Microgrid EMS', gridRegion: 'Island Territory', functionality: 'Lakshadweep Island Grid', nodesDeployed: 450, latencyMs: 150, coveragePct: 95, status: 'Processing', priority: 'Critical', origin: 'Trivandrum (KSEB Ltd)', destination: 'Kavaratti (Lakshadweep Admin)', shipDate: '2026-07-24', transitDays: 2, zone: 'South', remarks: '450-node KSEB microgrid EMS for Lakshadweep Kavaratti &#8212; solar-diesel-battery hybrid island grid 95% renewable fraction' },
  { id: 'SGO-0010', batchNo: 'SGO-D2410', platformType: 'EV Grid Integration', gridRegion: 'Western Region (WR)', functionality: 'V2G + Smart Charging', nodesDeployed: 8000, latencyMs: 350, coveragePct: 40, status: 'In Transit', priority: 'High', origin: 'Pune (Ather Energy Grid)', destination: 'Pune (MSEDCL)', shipDate: '2026-07-22', transitDays: 0, zone: 'West', remarks: '8,000-node Ather V2G smart charging platform for MSEDCL Pune &#8212; 500kW grid-to-vehicle peak shaving during evening demand' },
  { id: 'SGO-0011', batchNo: 'SGO-D2411', platformType: 'WAMS (Wide Area)', gridRegion: 'Southern Region (SR)', functionality: 'Synchrophasor PMU', nodesDeployed: 1800, latencyMs: 50, coveragePct: 78, status: 'Delivered', priority: 'Medium', origin: 'Bengaluru (NALCO Grid)', destination: 'Hyderabad (POSOCO SR)', shipDate: '2026-07-17', transitDays: 1, zone: 'South', remarks: '1,800-node WAMS synchrophasor PMU for POSOCO Southern Regional load despatch centre &#8212; 50ms islanding detection' },
  { id: 'SGO-0012', batchNo: 'SGO-D2412', platformType: 'DRMS (Demand Response)', gridRegion: 'Northern Region (NR)', functionality: 'Auto DR + Flex Market', nodesDeployed: 10000, latencyMs: 600, coveragePct: 33, status: 'Delayed', priority: 'Low', origin: 'Gurgaon (Honeywell India)', destination: 'Lucknow (UPPCL)', shipDate: '2026-07-10', transitDays: 16, zone: 'North', remarks: '10,000-node Honeywell DRMS for UPPCL Lucknow &#8212; automated demand response 500 MW industrial Curtailment &#8212; utility API integration delay' },
  { id: 'SGO-0013', batchNo: 'SGO-D2413', platformType: 'Grid Edge Computing', gridRegion: 'Eastern Region (ER)', functionality: 'Edge AI + Local Control', nodesDeployed: 2200, latencyMs: 30, coveragePct: 48, status: 'In Transit', priority: 'Critical', origin: 'Bhubaneswar (Wipro Grid)', destination: 'Ranchi (JSEB)', shipDate: '2026-07-20', transitDays: 2, zone: 'East', remarks: '2,200-node Wipro grid edge computing for JSEB Ranchi &#8212; 30ms local fault clearance without cloud dependency for rural reliability' },
  { id: 'SGO-0014', batchNo: 'SGO-D2414', platformType: 'Cybersecurity (ICS)', gridRegion: 'National Level', functionality: 'NERC CIP + OT Security', nodesDeployed: 50000, latencyMs: 5000, coveragePct: 55, status: 'Processing', priority: 'Critical', origin: 'Hyderabad (Kaspersky ICS)', destination: 'New Delhi (POSOCO NLDC)', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: '50,000-node Kaspersky ICS cybersecurity for POSOCO NLDC national grid &#8212; OT/IT segmentation + real-time threat detection 500 nodes' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Platform Type', key: 'platformType', options: [
    { value: 'ADMS (Distribution)', count: 1 }, { value: 'EMS/SCADA (Transmission)', count: 1 }, { value: 'DERMS (Distributed)', count: 1 }, { value: 'OMS (Outage Mgmt)', count: 1 },
  ]},
  { label: 'Grid Region', key: 'gridRegion', options: [
    { value: 'Western Region (WR)', count: 3 }, { value: 'Southern Region (SR)', count: 3 }, { value: 'Northern Region (NR)', count: 3 }, { value: 'Eastern Region (ER)', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 3 }, { value: 'South', count: 4 }, { value: 'North', count: 4 }, { value: 'East', count: 3 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Deployments', value: 14, sub: 'Grid OS Platforms', color: 'text-indigo-800' },
  { title: 'Total Nodes', value: '351,350', sub: 'Smart Grid Points', color: 'text-violet-700' },
  { title: 'Best Latency', value: '30 ms', sub: 'Grid Edge Computing', color: 'text-purple-700' },
  { title: 'National Mission', value: '\u20b928,500Cr', sub: 'RDSS Smart Grid', color: 'text-indigo-700' },
];

export default function SmartGridOSLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.platformType} ${r.gridRegion} ${r.functionality} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof SGORecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const nodesByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.platformType.split('(')[0].trim().slice(0, 16); map.set(s, (map.get(s) || 0) + r.nodesDeployed); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, nodes]) => ({ name, nodes: nodes >= 1000 ? `${Math.round(nodes / 1000)}K` : nodes }));
  }, []);

  const regionDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.gridRegion, (map.get(r.gridRegion) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.slice(0, 18), value }));
  }, []);

  const marketTrend = useMemo(() => [
    { year: '2022', gw: 85 }, { year: '2023', gw: 180 }, { year: '2024', gw: 420 }, { year: '2025', gw: 850 }, { year: '2026', gw: 1600 }, { year: '2027', gw: 3200 }, { year: '2028', gw: 6500 },
  ], []);

  const latencyData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), latency: r.latencyMs }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const coverageByRegion = useMemo(() => {
    return Array.from(new Map(records.map((r) => [r.gridRegion.split('(')[0].trim().slice(0, 14), { name: r.gridRegion.split('(')[0].trim().slice(0, 14), coverage: r.coveragePct }])).values()).reduce((acc, v) => { const e = acc.find((a) => a.name === v.name); if (e) e.coverage = Math.max(e.coverage, v.coverage); else acc.push({...v}); return acc; }, [] as { name: string; coverage: number }[]).sort((a, b) => b.coverage - a.coverage).slice(0, 6);
  }, []);

  const COLORS = ['#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#818cf8', '#a5b4fc'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="sgo-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Grid Infrastructure' }, { label: 'Smart Grid OS' }]} />
      <PageHeader title="Smart Grid OS Logistics" description="Indian smart grid operating system platforms &#8212; ADMS distribution management, EMS/SCADA transmission monitoring, DERMS distributed energy resources, OMS outage management, MDM meter data, VPP virtual power plant, AI grid analytics, WAMS synchrophasor, DRMS demand response, grid edge computing, ICS cybersecurity, transactive blockchain P2P energy trading, EV V2G integration under RDSS Smart Grid Mission" />

      <div className="sgo-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="sgo-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="sgo-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`sgo-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-indigo-700 text-indigo-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="sgo-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="sgo-chart-card"><CardHeader><CardTitle className="text-sm">Nodes by Platform Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={nodesByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="nodes" fill="#6366f1" radius={[4,4,0,0]} name="nodes" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="sgo-chart-card"><CardHeader><CardTitle className="text-sm">Grid Region Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={regionDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name.slice(0,10)} ${(percent * 100).toFixed(0)}%`}><Cell fill="#6366f1" /><Cell fill="#4f46e5" /><Cell fill="#4338ca" /><Cell fill="#3730a3" /><Cell fill="#818cf8" /><Cell fill="#a5b4fc" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="sgo-chart-card"><CardHeader><CardTitle className="text-sm">India Smart Grid Rollout (GW monitored)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={marketTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="gw" stroke="#818cf8" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="sgo-chart-card"><CardHeader><CardTitle className="text-sm">System Latency (ms) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={latencyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="latency" fill="#4f46e5" radius={[4,4,0,0]} name="ms" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="sgo-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Platform</th><th className="px-2 py-2 text-left">Region</th><th className="px-2 py-2 text-right">Nodes</th><th className="px-2 py-2 text-right">ms</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`sgo-table-row border-b hover:bg-indigo-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.platformType.split('(')[0].trim()}</td>
                  <td className="px-2 py-2 text-xs">{r.gridRegion.split('(')[0].trim().slice(0, 18)}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.nodesDeployed.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.latencyMs}</td>
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
        <div className="sgo-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="sgo-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#6366f1" /><Cell fill="#4f46e5" /><Cell fill="#4338ca" /><Cell fill="#3730a3" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="sgo-chart-card"><CardHeader><CardTitle className="text-sm">Max Grid Coverage (%) by Region</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={coverageByRegion}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="coverage" fill="#6366f1" radius={[4,4,0,0]} name="Coverage %" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="sgo-chart-card"><CardHeader><CardTitle className="text-sm">Nodes vs Latency</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), nodes: Math.min(Math.round(r.nodesDeployed / 1000), 50), ms: r.latencyMs }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="nodes" stroke="#6366f1" strokeWidth={2} name="K nodes" /><Line type="monotone" dataKey="ms" stroke="#818cf8" strokeWidth={2} name="ms latency" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="sgo-chart-card"><CardHeader><CardTitle className="text-sm">Deployment Phase Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.platformType.split(' ').slice(0, 2).join(' '), { name: r.platformType.split(' ').slice(0, 2).join(' '), value: 1 }])).values())} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#6366f1" /><Cell fill="#4f46e5" /><Cell fill="#4338ca" /><Cell fill="#3730a3" /><Cell fill="#818cf8" /><Cell fill="#a5b4fc" /><Cell fill="#6366f1" /><Cell fill="#4f46e5" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="sgo-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="sgo-insight-card border-l-4 border-l-indigo-700"><CardHeader><CardTitle className="text-sm text-indigo-800">India RDSS Smart Grid Mission: 6,500 GW Monitored by 2028</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Revamped Distribution Sector Scheme (RDSS) targeting 6,500 GW of grid capacity under smart monitoring by 2028, covering all 5 regional load dispatch centres and 250 million smart meters under the National Smart Metering Programme (NSMP). Phase-1 (2024-2026): 1,600 GW monitored through ADMS deployment at MSETCL Maharashtra (SGO-0001, 12,500 nodes), KPTCL Karnataka (SGO-0002, 8,500 nodes Siemens), and RVPN Rajasthan DERMS (SGO-0003, 6,000 nodes Schneider). Smart meter rollout: 250 million AMI meters from Genus Power, Flash Electronics, and Secure Meters at &#8377;2,800/unit with 4G/NB-IoT connectivity. MDM systems (SGO-0005, Oracle Utilities) ingesting 15 billion meter reads/day. Phase-2 (2026-2028): 4,900 GW expansion including AI grid analytics (SGO-0008, Infosys 30,000-node ML platform), grid edge computing (SGO-0013, Wipro 30ms edge AI), and national ICS cybersecurity (SGO-0014, Kaspersky 50,000-node OT protection). Total investment &#8377;28,500Cr under RDSS &#8377;3.03 lakh crore umbrella with &#8377;12,000Cr smart metering subsidy, &#8377;9,500Cr ADMS/SCADA platform procurement, and &#8377;7,000Cr cybersecurity and grid modernization. India&apos;s AT&amp;C loss reduction target: 12-15% nationally through smart grid-enabled theft detection, automated billing, and real-time load balancing.</p></CardContent></Card>
          <Card className="sgo-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Deployments: SGO-0005 and SGO-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">SGO-0005 (Oracle Gurgaon to BRPL Bihar, 14-day delay): 200,000-smart-meter Oracle Utilities MDM system &#8212; head-end system (HES) deployment blocked pending 4G IoT cellular gateway provisioning from Airtel IoT and Vodafone Idea (Vi) for rural Bihar smart meter connectivity. Bihar terrain challenges: 38% of meter locations in areas with &#60;2 Mbps 4G coverage requiring LoRaWAN mesh fallback at additional &#8377;450/meter installation cost. Oracle HES configured for 15 billion daily meter reads requiring 200 TB cloud storage on Oracle Cloud Infrastructure (OCI) Mumbai region. BRPL Patna has 200,000 meters installed but HES commissioning pending network readiness verification. Interim: manual meter reading continuing at &#8377;2.5/collection vs smart &#8377;0.8/collection &#8214; &#8377;22L/day additional manual cost. SGO-0012 (Honeywell Gurgaon to UPPCL Lucknow, 16-day delay): 10,000-node Honeywell DRMS for UPPCL automated demand response &#8214; OpenADR 2.0b protocol integration with UPPCL existing SAP IS-U billing system API delayed by SAP custom middleware development. DRMS requires real-time price signals from IEX day-ahead market (DAM) and 500 MW industrial Curtailment Service Provider (CSP) enrollment. Honeywell DRMS designed to auto-trigger 200 MW load reduction within 10 minutes of grid frequency drop below 49.7 Hz. UPPCL Lucknow facing 8-hour daily peak deficit of 1,200 MW during 6-9 PM summer season. Interim manual DR phone calls to 45 industrial CSPs achieving only 180 MW response vs 500 MW automated target.</p></CardContent></Card>
          <Card className="sgo-insight-card border-l-4 border-l-violet-600"><CardHeader><CardTitle className="text-sm text-violet-700">Grid Edge Computing: 30ms Rural Fault Clearance</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">SGO-0013: Wipro grid edge computing 2,200-node deployment for JSEB Ranchi Jharkhand &#8214; India&apos;s first large-scale grid edge AI platform achieving 30ms local fault clearance without cloud connectivity dependency. Edge hardware: NVIDIA Jetson AGX Orin edge AI modules installed at 132 kV and 33 kV substations with local 5G private network backhaul. AI models: fault detection using 200 microsecond waveform sampling at 10 kHz from CT/PT sensors, trained on 15 million fault event dataset from PGCIL national grid archives. 30ms pipeline: sensor sampling (0.1ms) &#8594; edge AI inference (5ms NVIDIA TensorRT) &#8594; circuit breaker trip signal (2ms) &#8594; mechanical breaker operation (23ms spring-operated). Previous cloud-based system latency: 500-2000ms causing cascading outages in rural Jharkhand grid with 38% SAIDI (System Average Interruption Duration Index). Wipro targeting 50% reduction in Jharkhand SAIDI from 12 hours to 6 hours annually. Edge computing advantage: operates during WAN outage using local battery-backed edge node for 72-hour islanded operation. JSEB Ranchi deploying 2,200 nodes across 45 substations covering 1.2 million rural consumers in Ranchi, Ramgarh, and Hazaribagh districts. Cost: &#8377;4.5Cr per substation edge node (NVIDIA Jetson + sensors + 5G private network) vs &#8377;0.5Cr traditional RTU. ROI: &#8377;12Cr annual avoided outage cost per substation at 6-hour SAIDI reduction for 25,000 connected consumers.</p></CardContent></Card>
          <Card className="sgo-insight-card border-l-4 border-l-purple-600"><CardHeader><CardTitle className="text-sm text-purple-700">Blockchain P2P Energy Trading: Torrent Surat</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">SGO-0007: Power Ledger blockchain 15,000-node transactive energy platform for Torrent Power Surat &#8214; India&apos;s first commercial-scale peer-to-peer electricity trading marketplace enabling rooftop solar prosumers to sell excess energy directly to neighboring consumers. Platform: Power Ledger Xgrid blockchain on Hyperledger Fabric with 400ms settlement time, 15,000 connected nodes (rooftop solar systems + smart meters + consumer wallets). Surat has 850 MW rooftop solar potential with 180 MW installed across 12,000 prosumer sites generating average 6 kWh/day excess. P2P pricing: IEX day-ahead market price signal (&#8377;3.2-8.5/kWh seasonal) plus 5% platform fee, with dynamic pricing every 15 minutes. Prosumer revenue: &#8377;18,000/month average from 5 kWh/day excess sales at &#8377;4.2/kWh weighted average. Consumer savings: &#8377;800/month vs Torrent retail tariff &#8377;5.8/kWh. Torrent Power benefit: reduced T&amp;D loss in solar-heavy feeders from 18% to 8% as energy is consumed locally. Gujarat Electricity Regulatory Commission (GERC) approved P2P trading framework in June 2026 under Section 62(1)(a) of Electricity Act allowing retail competition in Surat and Ahmedabad as pilot. India P2P potential: 15 GW rooftop solar generating 30 GWh/day excess by 2030 under PM Surya Ghar Yojana, creating &#8377;4,500Cr annual P2P trading market. Power Ledger India targeting 500,000 nodes across Gujarat, Maharashtra, and Tamil Nadu by 2028.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
