'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface SLVRecord {
  id: string;
  batchNo: string;
  vehicleType: string;
  propulsion: string;
  mission: string;
  payloadKg: number;
  leoCapacity: number;
  costPerKg: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: SLVRecord[] = [
  { id: 'SLV-0001', batchNo: 'SLV-B2401', vehicleType: 'GSLV Mk-III', propulsion: 'Cryogenic CE-20', mission: 'GSLV-F15 Navigation', payloadKg: 2500, leoCapacity: 4000, costPerKg: 12000, status: 'In Transit', priority: 'Critical', origin: 'Thiruvananthapuram (LPSC)', destination: 'Sriharikota (SDSC)', shipDate: '2026-07-20', transitDays: 3, zone: 'South', remarks: 'CE-20 cryo stage for NVS-01 navigation satellite launch' },
  { id: 'SLV-0002', batchNo: 'SLV-B2402', vehicleType: 'PSLV-XL', propulsion: 'Solid HTPB + Liquid PS4', mission: 'PSLV-C60 Earth Obs', payloadKg: 1750, leoCapacity: 1750, costPerKg: 20000, status: 'Delivered', priority: 'High', origin: 'Hyderabad (ASL)', destination: 'Sriharikota (SDSC)', shipDate: '2026-07-18', transitDays: 2, zone: 'South', remarks: 'PSLV-XL for EOS-08 multispectral earth observation' },
  { id: 'SLV-0003', batchNo: 'SLV-B2403', vehicleType: 'LVM3 (GSLV Mk-III)', propulsion: 'S200 + L110 + CE-20', mission: 'LVM3-M4 Gaganyaan Test', payloadKg: 8000, leoCapacity: 10000, costPerKg: 8000, status: 'Processing', priority: 'Critical', origin: 'Sriharikota (SDSC)', destination: 'Sriharikota (Launch Pad)', shipDate: '2026-07-23', transitDays: 0, zone: 'South', remarks: 'Gaganyaan G1 uncrewed abort test vehicle integration' },
  { id: 'SLV-0004', batchNo: 'SLV-B2404', vehicleType: 'SSLV', propulsion: 'All-Solid 3-Stage', mission: 'SSLV-D3 Microsat', payloadKg: 500, leoCapacity: 500, costPerKg: 25000, status: 'In Transit', priority: 'Medium', origin: 'Bangalore (NSIL)', destination: 'Sriharikota (SDSC)', shipDate: '2026-07-19', transitDays: 2, zone: 'South', remarks: 'SSLV-D3 commercial dedicated launch 500kg microsat cluster' },
  { id: 'SLV-0005', batchNo: 'SLV-B2405', vehicleType: 'LVM3 (GSLV Mk-III)', propulsion: 'S200 + L110 + C32', mission: 'LVM3-M5 OneWeb', payloadKg: 6195, leoCapacity: 10000, costPerKg: 8500, status: 'Delivered', priority: 'High', origin: 'Sriharikota (NSIL Pad)', destination: 'Low Earth Orbit', shipDate: '2026-07-16', transitDays: 0, zone: 'South', remarks: '36 OneWeb Gen-1 satellites LEO constellation batch-4 deployment' },
  { id: 'SLV-0006', batchNo: 'SLV-B2406', vehicleType: 'PSLV-DL', propulsion: 'Solid + Liquid PS4', mission: 'PSLV-C61 Dual Launch', payloadKg: 1100, leoCapacity: 1300, costPerKg: 22000, status: 'Delayed', priority: 'High', origin: 'Hyderabad (ASL Propellant)', destination: 'Sriharikota (SDSC PS2)', shipDate: '2026-07-11', transitDays: 12, zone: 'South', remarks: 'PSLV-C61 dual satellite launch propellant delay HTPB curing' },
  { id: 'SLV-0007', batchNo: 'SLV-B2407', vehicleType: 'NGLV (Next Gen)', propulsion: 'Semi-Cryo LOX+Kerosene', mission: 'NGLV-D1 Test Flight', payloadKg: 12000, leoCapacity: 12000, costPerKg: 5000, status: 'Processing', priority: 'Critical', origin: 'Thiruvananthapuram (IIST)', destination: 'Sriharikota (New Pad)', shipDate: '2026-07-24', transitDays: 3, zone: 'South', remarks: 'NGLV first test flight LOX kerosene SC120 semi-cryo engine' },
  { id: 'SLV-0008', batchNo: 'SLV-B2408', vehicleType: 'Agni-V (Modified)', propulsion: 'Solid 3-Stage + MIRV', mission: 'Agni-5 MIRV Test', payloadKg: 2000, leoCapacity: 5000, costPerKg: 15000, status: 'Delivered', priority: 'Critical', origin: 'Hyderabad (DRDO)', destination: 'Abdul Kalam Island (WTR)', shipDate: '2026-07-15', transitDays: 5, zone: 'East', remarks: 'MIRV warhead delivery test Agni-5 range 5,000km DRDO mission' },
  { id: 'SLV-0009', batchNo: 'SLV-B2409', vehicleType: 'PSLV-CA', propulsion: 'Core Alone Solid', mission: 'PSLV-C62 Dedicated', payloadKg: 600, leoCapacity: 600, costPerKg: 30000, status: 'In Transit', priority: 'Medium', origin: 'Pune (MIDHANI Metals)', destination: 'Sriharikota (SDSC)', shipDate: '2026-07-22', transitDays: 2, zone: 'West', remarks: 'MIDHANI Ti-alloy motor casing for PSLV-CA core alone variant' },
  { id: 'SLV-0010', batchNo: 'SLV-B2410', vehicleType: 'Sounding Rocket', propulsion: 'Solid RH-560', mission: 'RH-560 Atmospheric', payloadKg: 100, leoCapacity: 100, costPerKg: 50000, status: 'Delivered', priority: 'Low', origin: 'Thumba (VSSC)', destination: 'Thumba Equatorial', shipDate: '2026-07-17', transitDays: 0, zone: 'South', remarks: 'RH-560 sounding rocket upper atmosphere ionosphere study' },
  { id: 'SLV-0011', batchNo: 'SLV-B2411', vehicleType: 'LVM3 (Human Rated)', propulsion: 'Human-Rated CE-20', mission: 'Gaganyaan G2 Orbital', payloadKg: 8500, leoCapacity: 10000, costPerKg: 7500, status: 'In Transit', priority: 'Critical', origin: 'Bengaluru (ISRO HQ)', destination: 'Sriharikota (HRLP)', shipDate: '2026-07-21', transitDays: 2, zone: 'South', remarks: 'Gaganyaan G2 crewed orbital mission CM/SM integration components' },
  { id: 'SLV-0012', batchNo: 'SLV-B2412', vehicleType: 'PSLV-XL', propulsion: 'Solid XL + Liquid PS4', mission: 'PSLV-C63 SpaceX Rideshare', payloadKg: 1600, leoCapacity: 1750, costPerKg: 18000, status: 'Delayed', priority: 'High', origin: 'Chennai (Sathyabama Univ)', destination: 'Sriharikota (SDSC)', shipDate: '2026-07-10', transitDays: 18, zone: 'South', remarks: 'Student satellite constellation 12 cubesats propellant delay monsoon' },
  { id: 'SLV-0013', batchNo: 'SLV-B2413', vehicleType: 'Reusable Booster', propulsion: 'LOX+Methane SC160', mission: 'RLV-LEX TD Flight', payloadKg: 500, leoCapacity: 500, costPerKg: 3500, status: 'Processing', priority: 'Critical', origin: 'Chandipur (ITR)', destination: 'Abdul Kalam Island', shipDate: '2026-07-25', transitDays: 3, zone: 'East', remarks: 'Reusable Launch Vehicle Landing Experiment TD-3 LOX methane' },
  { id: 'SLV-0014', batchNo: 'SLV-B2414', vehicleType: 'Small SLV', propulsion: 'All-Solid Mini', mission: 'SLV-1D Commercial', payloadKg: 300, leoCapacity: 300, costPerKg: 28000, status: 'In Transit', priority: 'Medium', origin: 'Coimbatore (Agnikul Cosmos)', destination: 'Sriharikota (Dedicated Pad)', shipDate: '2026-07-20', transitDays: 1, zone: 'South', remarks: 'Agnikul Agnibaan single-piece 3D printed rocket commercial launch' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Vehicle Type', key: 'vehicleType', options: [
    { value: 'PSLV-XL', count: 2 }, { value: 'LVM3 (GSLV Mk-III)', count: 3 }, { value: 'SSLV', count: 1 }, { value: 'PSLV-DL', count: 1 },
  ]},
  { label: 'Propulsion', key: 'propulsion', options: [
    { value: 'Cryogenic CE-20', count: 1 }, { value: 'Solid HTPB + Liquid PS4', count: 1 }, { value: 'S200 + L110 + CE-20', count: 1 }, { value: 'All-Solid 3-Stage', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 5 }, { value: 'High', count: 4 }, { value: 'Medium', count: 3 }, { value: 'Low', count: 2 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'South', count: 11 }, { value: 'East', count: 3 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Vehicles', value: 14, sub: 'Launch Assets', color: 'text-indigo-800' },
  { title: 'Combined Payload', value: '49,845 kg', sub: 'LEO Capacity', color: 'text-violet-700' },
  { title: 'Avg Cost/kg', value: '\u20b918,071', sub: 'NGLV \u20b95,000/kg Best', color: 'text-purple-700' },
  { title: 'National Target', value: '\u20b912,400Cr', sub: 'Space Programme 2030', color: 'text-fuchsia-700' },
];

export default function SpaceLaunchVehicleLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.vehicleType} ${r.propulsion} ${r.mission} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof SLVRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const payloadByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.vehicleType.split(' ')[0], (map.get(r.vehicleType.split(' ')[0]) || 0) + r.payloadKg); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, payloadKg]) => ({ name: name.slice(0, 12), payloadKg }));
  }, []);

  const propulsionDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.propulsion.split('+')[0].trim(); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const launchTrend = useMemo(() => [
    { year: '2020', launches: 2 }, { year: '2021', launches: 3 }, { year: '2022', launches: 5 }, { year: '2023', launches: 7 }, { year: '2024', launches: 9 }, { year: '2025', launches: 12 }, { year: '2026', launches: 15 },
  ], []);

  const costData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), cost: r.costPerKg / 1000 }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const capacityByProp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.propulsion.split(' ')[0], (map.get(r.propulsion.split(' ')[0]) || 0) + r.leoCapacity); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, leoCapacity]) => ({ name: name.slice(0, 14), leoCapacity }));
  }, []);

  const COLORS = ['#4338ca', '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="slv-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Space Programme' }, { label: 'Launch Vehicle' }]} />
      <PageHeader title="Space Launch Vehicle Logistics" description="Indian launch vehicle supply chain \u2014 GSLV Mk-III LVM3, PSLV-XL/DL/CA, SSLV, NGLV, Gaganyaan human-rated, reusable RLV, sounding rockets for navigation, earth observation, communication, crewed, and commercial missions" />

      <div className="slv-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="slv-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="slv-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`slv-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-indigo-700 text-indigo-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="slv-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="slv-chart-card"><CardHeader><CardTitle className="text-sm">Payload by Vehicle Type (kg)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={payloadByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="payloadKg" fill="#4338ca" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="slv-chart-card"><CardHeader><CardTitle className="text-sm">Propulsion Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={propulsionDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#4338ca" /><Cell fill="#6d28d9" /><Cell fill="#7c3aed" /><Cell fill="#8b5cf6" /><Cell fill="#a78bfa" /><Cell fill="#0f766e" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="slv-chart-card"><CardHeader><CardTitle className="text-sm">India Launches Per Year</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={launchTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="launches" stroke="#6d28d9" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="slv-chart-card"><CardHeader><CardTitle className="text-sm">Cost per kg LEO (x\u20b91K)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={costData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="cost" fill="#7c3aed" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="slv-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Batch</th><th className="px-2 py-2 text-left">Vehicle</th><th className="px-2 py-2 text-left">Propulsion</th><th className="px-2 py-2 text-left">Mission</th><th className="px-2 py-2 text-right">kg</th><th className="px-2 py-2 text-right">LEO</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`slv-table-row border-b hover:bg-indigo-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.batchNo}</td>
                  <td className="px-2 py-2 text-xs">{r.vehicleType}</td>
                  <td className="px-2 py-2 text-xs">{r.propulsion}</td>
                  <td className="px-2 py-2 text-xs">{r.mission}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.payloadKg.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.leoCapacity.toLocaleString()}</td>
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
        <div className="slv-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="slv-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#4338ca" /><Cell fill="#7c3aed" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="slv-chart-card"><CardHeader><CardTitle className="text-sm">LEO Capacity by Propulsion (kg)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={capacityByProp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="leoCapacity" fill="#4338ca" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="slv-chart-card"><CardHeader><CardTitle className="text-sm">Payload vs Cost/kg (Batch)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), payload: r.payloadKg / 1000, cost: r.costPerKg / 1000 }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="payload" stroke="#4338ca" strokeWidth={2} name="Tonnes" /><Line type="monotone" dataKey="cost" stroke="#6d28d9" strokeWidth={2} name="Cost \u20b9K/kg" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="slv-chart-card"><CardHeader><CardTitle className="text-sm">Vehicle Count by Mission Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={Array.from(new Map(records.map((r) => [r.mission.split(' ')[0], 1])).entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name: name.slice(0, 14), value }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#8b5cf6" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="slv-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="slv-insight-card border-l-4 border-l-indigo-700"><CardHeader><CardTitle className="text-sm text-indigo-800">ISRO Gaganyaan G2: India&apos;s Crewed Space Mission</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">ISRO Bengaluru shipped human-rated CE-20 cryogenic engine components (SLV-0011) for Gaganyaan G2 crewed orbital mission — India&apos;s first astronaut launch to low Earth orbit at 400km altitude. Human-rated LVM3 features 4-engine redundant cluster, triple-redundant flight computers, crew escape system with 16 solid motors, and crew module life support for 7-day mission. Crew of 3 Indian astronauts selected from IAF test pilot cohort trained at ISRO Astronaut Training Centre Bengaluru. Total programme budget: \u20b912,435Cr including 2 uncrewed test flights (G1 completed), 1 crewed orbital mission, and pad abort test. CE-20 human rating achieved through 60 hot-fire tests at LPSC Mahendragiri with 100% success rate. Mission targets Indian independence in human spaceflight — joining US, Russia, and China. Post-mission crew module recovery from Bay of Bengal by Indian Navy INS Vishakapatnam.</p></CardContent></Card>
          <Card className="slv-insight-card border-l-4 border-l-purple-600"><CardHeader><CardTitle className="text-sm text-purple-700">NGLV Next Generation: India&apos;s Reusable Heavy Lift</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">ISRO IIST Thiruvananthapuram developing Next Generation Launch Vehicle NGLV (SLV-0007) with semi-cryogenic LOX+kerosene SC160 engine — India&apos;s first reusable rocket booster with targeted 10x cost reduction vs GSLV Mk-III. SC160 engine produces 1,600kN thrust with staged combustion cycle developed jointly by LPSC and DRDL. NGLV first stage booster designed for flyback and autonomous landing at sea-based recovery platform in Bay of Bengal — inspired by SpaceX Falcon 9. Target cost: \u20b95,000/kg to LEO, making India competitive with SpaceX for commercial launch. NGLV capable of 12,000kg to LEO in reusable mode, 16,000kg in expendable. ISRO planning 4-pad launch complex at Sriharikota dedicated to NGLV high-cadence operations — 15 launches/year target by 2032. Total NGLV programme: \u20b98,700Cr over 2024-2032.</p></CardContent></Card>
          <Card className="slv-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Shipments: SLV-0006 and SLV-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">SLV-0006 (Hyderabad ASL to Sriharikota, 12-day delay): PSLV-C61 dual satellite launch propellant — HTPB solid propellant curing extended by 12 days due to ambient humidity spike from Andhra Pradesh cyclone alert at Sriharikota. ASL Hyderabad had to maintain 25C controlled storage while cyclone Phethai passed coastal AP. PS4 liquid propellant (MMH + MON-3) loaded after cyclone clearance. Mission carrying 1,100kg dual payload: indigenous earth observation + foreign commercial microsat. SLV-0012 (Chennai Sathyabama to Sriharikota, 18-day delay): Student satellite constellation 12 cubesats from 6 Indian universities — propellant transport delayed by monsoon flooding on NH16 Chennai-Tirupati section. Satellite integration at SDSC clean room delayed due to delayed component delivery from URSC Bengaluru solar panel supply chain. NSIL commercial launch revenue impact: \u20b945Cr penalty clause with foreign customer.</p></CardContent></Card>
          <Card className="slv-insight-card border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm text-teal-700">Agnikul Cosmos: India&apos;s First Private Rocket</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Agnikul Cosmos Coimbatore shipped single-piece 3D-printed Agnibaan rocket (SLV-0014) for dedicated commercial launch from ISRO SDSC pad — India&apos;s first fully private orbital launch vehicle. Agnibaan uses one-piece 3D-printed semi-cryo engine burning LOX+kerosene, eliminating complex turbopump assembly with 72 parts reduced to single printed component. 300kg LEO capacity targeting microsat and cubesat market at \u20b928,000/kg. Flight tested successfully as SLV-1 earlier in 2026. Agnibaan competitive advantage: launch-on-demand from dedicated pad with 72-hour mobilization. Agnikul pre-sold 12 launches for 2026-2027 including 6 international customers from Germany, Singapore, and UAE. Indian private space sector attracted \u20b93,200Cr FDI in 2025-26 — Agnikul valued at \u20b93,500Cr after Series C. Coimbatore manufacturing facility producing 10 engines/month with in-house SLM metal 3D printer from Germany.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
