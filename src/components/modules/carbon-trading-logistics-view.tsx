'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface CTRecord {
  id: string;
  batchNo: string;
  creditType: string;
  marketType: string;
  sector: string;
  volumeTCO2e: number;
  pricePerTon: number;
  totalValue: number;
  status: string;
  priority: string;
  seller: string;
  buyer: string;
  tradeDate: string;
  validity: string;
  zone: string;
  remarks: string;
}

const records: CTRecord[] = [
  { id: 'CBT-0001', batchNo: 'CBT-T2401', creditType: 'Renewable Energy Certificate', marketType: 'Compliance', sector: 'Power Generation', volumeTCO2e: 85000, pricePerTon: 2200, totalValue: 187000000, status: 'Delivered', priority: 'Critical', seller: 'NTPC (Solar Park)', buyer: 'Tata Power (REC Obligation)', tradeDate: '2026-07-20', validity: '2027-12-31', zone: 'North', remarks: '85,000 REC from NTPC Vindhyachal solar park sold to Tata Power RPO compliance at &#8377;2,200/REC' },
  { id: 'CBT-0002', batchNo: 'CBT-T2402', creditType: 'Carbon Offset (Verra)', marketType: 'Voluntary', sector: 'Forestry', volumeTCO2e: 45000, pricePerTon: 3800, totalValue: 171000000, status: 'In Transit', priority: 'High', seller: 'Cameroon REDD+ (Verra)', buyer: 'Reliance (Net Zero 2035)', tradeDate: '2026-07-19', validity: '2029-06-30', zone: 'West', remarks: '45,000 VCU from Cameroon REDD+ forestry project purchased by Reliance for voluntary net-zero commitment' },
  { id: 'CBT-0003', batchNo: 'CBT-T2403', creditType: 'Emission Trading Scheme', marketType: 'Compliance', sector: 'Steel', volumeTCO2e: 120000, pricePerTon: 4200, totalValue: 504000000, status: 'Processing', priority: 'Critical', seller: 'JSW Steel (Surplus EUA)', buyer: 'Tata Steel (EU CBAM)', tradeDate: '2026-07-23', validity: '2026-12-31', zone: 'West', remarks: '120,000 EUA surplus allowances from JSW efficient BF-BOF route sold to Tata Steel EU CBAM compliance' },
  { id: 'CBT-0004', batchNo: 'CBT-T2404', creditType: 'Green Hydrogen Certificate', marketType: 'Compliance', sector: 'Refining', volumeTCO2e: 60000, pricePerTon: 5500, totalValue: 330000000, status: 'In Transit', priority: 'Critical', seller: 'Adani Green (H2 Electrolyzer)', buyer: 'BPCL (Green Fuel Mandate)', tradeDate: '2026-07-18', validity: '2027-06-30', zone: 'West', remarks: '60,000 GH2 certificates from Adani Kutch electrolyzer for BPCL refinery green hydrogen desulfurization mandate' },
  { id: 'CBT-0005', batchNo: 'CBT-T2405', creditType: 'Carbon Offset (Gold Standard)', marketType: 'Voluntary', sector: 'Biomass Energy', volumeTCO2e: 35000, pricePerTon: 4100, totalValue: 143500000, status: 'Delayed', priority: 'Medium', seller: 'Thermax (Biomass CHP)', buyer: 'Mahindra (Carbon Neutral)', tradeDate: '2026-07-12', validity: '2028-12-31', zone: 'West', remarks: '35,000 GS carbon credits from Thermax Nagpur biomass CHP sold to Mahindra for Scope-2 carbon neutral pledge' },
  { id: 'CBT-0006', batchNo: 'CBT-T2406', creditType: 'Renewable Energy Certificate', marketType: 'Compliance', sector: 'Cement', volumeTCO2e: 95000, pricePerTon: 2400, totalValue: 228000000, status: 'Delivered', priority: 'High', seller: 'Greenko (Hydro Pumped)', buyer: 'ACC Cement (RPO)', tradeDate: '2026-07-16', validity: '2027-03-31', zone: 'South', remarks: '95,000 REC from Greenko pumped hydro Andhra Pradesh for ACC cement manufacturing RPO compliance' },
  { id: 'CBT-0007', batchNo: 'CBT-T2407', creditType: 'Emission Trading Scheme', marketType: 'Compliance', sector: 'Aluminum', volumeTCO2e: 150000, pricePerTon: 4800, totalValue: 720000000, status: 'In Transit', priority: 'Critical', seller: 'NALCO (Efficient Smelter)', buyer: 'Hindalco (EU ETS Gap)', tradeDate: '2026-07-21', validity: '2026-12-31', zone: 'East', remarks: '150,000 EUETS allowances from NALCO Angul efficient smelter for Hindalco Novelis EU aluminum CBAM coverage' },
  { id: 'CBT-0008', batchNo: 'CBT-T2408', creditType: 'Carbon Offset (Verra)', marketType: 'Voluntary', sector: 'Clean Cooking', volumeTCO2e: 28000, pricePerTon: 3200, totalValue: 89600000, status: 'Delivered', priority: 'Medium', seller: 'BPCL (LPG Distribution)', buyer: 'Unilever (Scope-3 Reduction)', tradeDate: '2026-07-15', validity: '2029-03-31', zone: 'North', remarks: '28,000 VCU from BPCL Ujjwala clean cooking LPG distribution UP Bihar for Unilever Scope-3 value chain credits' },
  { id: 'CBT-0009', batchNo: 'CBT-T2409', creditType: 'Green Hydrogen Certificate', marketType: 'Compliance', sector: 'Fertilizer', volumeTCO2e: 55000, pricePerTon: 5800, totalValue: 319000000, status: 'Processing', priority: 'Critical', seller: 'NTPC (Solar H2)', buyer: 'NFL (Green Urea)', tradeDate: '2026-07-24', validity: '2027-09-30', zone: 'North', remarks: '55,000 GH2 certs from NTPC Rajasthan solar electrolyzer for NFL green urea production subsidy compliance' },
  { id: 'CBT-0010', batchNo: 'CBT-T2410', creditType: 'Renewable Energy Certificate', marketType: 'Compliance', sector: 'IT Services', volumeTCO2e: 40000, pricePerTon: 2100, totalValue: 84000000, status: 'In Transit', priority: 'Low', seller: 'NHPC (Hydro)', buyer: 'TCS (RE100)', tradeDate: '2026-07-22', validity: '2027-06-30', zone: 'South', remarks: '40,000 REC from NHPC Nathpa Jhakri hydro for TCS RE100 data center renewable energy matching commitment' },
  { id: 'CBT-0011', batchNo: 'CBT-T2411', creditType: 'Emission Trading Scheme', marketType: 'Compliance', sector: 'Petrochemical', volumeTCO2e: 200000, pricePerTon: 4500, totalValue: 900000000, status: 'Delivered', priority: 'Critical', seller: 'GAIL (Low-Carbon NG)', buyer: 'Reliance (PETROCHEM ETS)', tradeDate: '2026-07-17', validity: '2026-12-31', zone: 'West', remarks: '200,000 IETS allowances from GAIL low-carbon natural gas processing for Reliance Jamnagar petrochemical ETS compliance' },
  { id: 'CBT-0012', batchNo: 'CBT-T2412', creditType: 'Carbon Offset (Gold Standard)', marketType: 'Voluntary', sector: 'Water Purification', volumeTCO2e: 22000, pricePerTon: 3500, totalValue: 77000000, status: 'Delayed', priority: 'Low', seller: 'IOCL (Water Treatment)', buyer: 'ITC (Net Zero Water)', tradeDate: '2026-07-10', validity: '2028-06-30', zone: 'East', remarks: '22,000 GS credits from IOCL Varanasi water treatment plant — validation delayed pending VVB re-audit documentation' },
  { id: 'CBT-0013', batchNo: 'CBT-T2413', creditType: 'Carbon Offset (Verra)', marketType: 'Voluntary', sector: 'EV Charging', volumeTCO2e: 18000, pricePerTon: 2900, totalValue: 52200000, status: 'In Transit', priority: 'Medium', seller: 'Tata Power (EV Infra)', buyer: 'Amazon (Last Mile Green)', tradeDate: '2026-07-20', validity: '2029-12-31', zone: 'West', remarks: '18,000 VCU from Tata Power EV charging network replacing diesel gensets for Amazon India last-mile delivery hubs' },
  { id: 'CBT-0014', batchNo: 'CBT-T2414', creditType: 'Green Hydrogen Certificate', marketType: 'Compliance', sector: 'Shipping', volumeTCO2e: 70000, pricePerTon: 6200, totalValue: 434000000, status: 'Processing', priority: 'Critical', seller: 'NTPC (Offshore Wind H2)', buyer: 'SCI (IMO GHG Strategy)', tradeDate: '2026-07-25', validity: '2027-12-31', zone: 'South', remarks: '70,000 GH2 certs from NTPC Tamil Nadu offshore wind for SCI fleet IMO 2030 greenhouse gas strategy compliance' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Credit Type', key: 'creditType', options: [
    { value: 'Renewable Energy Certificate', count: 3 }, { value: 'Carbon Offset (Verra)', count: 3 }, { value: 'Emission Trading Scheme', count: 3 }, { value: 'Green Hydrogen Certificate', count: 3 },
  ]},
  { label: 'Market Type', key: 'marketType', options: [
    { value: 'Compliance', count: 8 }, { value: 'Voluntary', count: 6 },
  ]},
  { label: 'Sector', key: 'sector', options: [
    { value: 'Steel', count: 1 }, { value: 'Refining', count: 1 }, { value: 'Power Generation', count: 1 }, { value: 'Cement', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'West', count: 5 }, { value: 'North', count: 3 }, { value: 'South', count: 3 }, { value: 'East', count: 3 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Trades', value: 14, sub: 'Carbon Credit Batch', color: 'text-emerald-800' },
  { title: 'Total Volume', value: '1.04 MT CO2e', sub: 'All Credit Types', color: 'text-green-700' },
  { title: 'Total Value', value: '\u20b932.4Cr', sub: 'Avg &#8377;4,620/tonne', color: 'text-teal-700' },
  { title: 'Market Target', value: '\u20b95,000Cr/yr', sub: 'Indian Carbon Market', color: 'text-lime-700' },
];

export default function CarbonTradingLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.creditType} ${r.marketType} ${r.sector} ${r.seller} ${r.buyer}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof CTRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const volumeByType = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const key = r.creditType.split('(')[0].trim(); map.set(key, (map.get(key) || 0) + r.volumeTCO2e); });
    return Array.from(map.entries()).map(([name, volumeTCO2e]) => ({ name: name.slice(0, 16), volumeTCO2e }));
  }, []);

  const typeDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.creditType.split('(')[0].trim(); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2022', cr: 5 }, { year: '2023', cr: 25 }, { year: '2024', cr: 80 }, { year: '2025', cr: 200 }, { year: '2026', cr: 450 }, { year: '2027', cr: 900 }, { year: '2028', cr: 1800 },
  ], []);

  const priceData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), price: r.pricePerTon }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const valueBySector = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.sector, (map.get(r.sector) || 0) + r.totalValue); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value: Math.round(value / 10000000) }));
  }, []);

  const COLORS = ['#059669', '#10b981', '#047857', '#065f46', '#064e3b'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  const formatCrore = (val: number) => {
    if (val >= 10000000) return `&#8377;${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `&#8377;${(val / 100000).toFixed(0)}L`;
    return `&#8377;${val.toLocaleString()}`;
  };

  return (
    <div className="cbt-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Carbon Markets' }, { label: 'Carbon Trading' }]} />
      <PageHeader title="Carbon Credit Trading Logistics" description="Indian carbon credit trading platform &#8212; REC, Verra VCU, EU ETS, Green H2 certificates for compliance and voluntary markets covering power, steel, cement, refining, aluminum, shipping, EV, and forestry sectors" />

      <div className="cbt-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="cbt-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="cbt-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`cbt-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-emerald-700 text-emerald-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="cbt-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="cbt-chart-card"><CardHeader><CardTitle className="text-sm">Volume by Credit Type (tCO2e)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={volumeByType}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="volumeTCO2e" fill="#059669" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="cbt-chart-card"><CardHeader><CardTitle className="text-sm">Credit Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={typeDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#059669" /><Cell fill="#10b981" /><Cell fill="#047857" /><Cell fill="#065f46" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="cbt-chart-card"><CardHeader><CardTitle className="text-sm">Indian Carbon Market Growth (&#8377;Cr/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="cr" stroke="#10b981" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="cbt-chart-card"><CardHeader><CardTitle className="text-sm">Price per Tonne (&#8377;) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={priceData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="price" fill="#047857" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="cbt-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Credit Type</th><th className="px-2 py-2 text-left">Market</th><th className="px-2 py-2 text-left">Sector</th><th className="px-2 py-2 text-right">tCO2e</th><th className="px-2 py-2 text-right">&#8377;/ton</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Trade</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`cbt-table-row border-b hover:bg-emerald-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.creditType}</td>
                  <td className="px-2 py-2 text-xs">{r.marketType}</td>
                  <td className="px-2 py-2 text-xs">{r.sector}</td>
                  <td className="px-2 py-2 text-right font-mono">{(r.volumeTCO2e / 1000).toFixed(0)}K</td>
                  <td className="px-2 py-2 text-right font-mono">{r.pricePerTon.toLocaleString()}</td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusBadge[r.status]}>{r.status}</Badge></td>
                  <td className="px-2 py-2"><Badge variant="outline" className={statusColor[r.priority]}>{r.priority}</Badge></td>
                  <td className="px-2 py-2 text-xs">{r.tradeDate}</td>
                  <td className="px-2 py-2 text-xs">{r.seller} &#8594; {r.buyer}</td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="cbt-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="cbt-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#059669" /><Cell fill="#10b981" /><Cell fill="#047857" /><Cell fill="#065f46" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="cbt-chart-card"><CardHeader><CardTitle className="text-sm">Value by Sector (&#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={valueBySector}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#059669" radius={[4,4,0,0]} name="&#8377;Cr" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="cbt-chart-card"><CardHeader><CardTitle className="text-sm">Volume vs Price per Tonne</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.batchNo.slice(-2), vol: r.volumeTCO2e / 1000, price: r.pricePerTon }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="vol" stroke="#059669" strokeWidth={2} name="K tCO2e" /><Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} name="&#8377;/ton" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="cbt-chart-card"><CardHeader><CardTitle className="text-sm">Market Type Split</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Array.from(new Map(records.map((r) => [r.marketType, records.filter((x) => x.marketType === r.marketType).length])).entries()).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#059669" /><Cell fill="#047857" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="cbt-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cbt-insight-card border-l-4 border-l-emerald-700"><CardHeader><CardTitle className="text-sm text-emerald-800">India Carbon Market: &#8377;5,000Cr/yr Target by 2030</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s Energy Conservation (Amendment) Act 2022 established the Indian Carbon Credit Trading Scheme (ICTS) under Bureau of Energy Efficiency (BEE), targeting &#8377;5,000Cr annual carbon market turnover by 2030. Phase-1 (2024-2026): PAT scheme energy saving certificates (ESCerts) converted to carbon credits — 880 industrial units across cement, steel, aluminum, fertilizer, pulp and paper sectors. Phase-2 (2026-2028): Integration of Renewable Energy Certificates (REC) and emerging Green Hydrogen Certificates (GHC) into unified ICTS platform hosted on NSE/BSE carbon exchange. India&apos;s carbon price currently &#8377;2,200-6,200/tCO2e, significantly below EU ETS (&#8377;7,800) but pricing convergence expected by 2028 as CBAM drives demand for verified Indian credits. Power Grid Corporation developing national carbon credit registry blockchain platform for transparent credit tracking. Total Indian compliance market: 1.2 GtCO2e/yr from 314 obligated entities. Voluntary market: 45 MtCO2e/yr from Reliance, Tata, Mahindra, ITC, Amazon India net-zero pledges.</p></CardContent></Card>
          <Card className="cbt-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Trades: CBT-0005 and CBT-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">CBT-0005 (Thermax Nagpur to Mahindra, &#8377;14.35Cr): 35,000 Gold Standard carbon credits from Thermax Nagpur 50MW biomass CHP plant — GS VVB validation delayed due to new Additionality Tool v3.0 requirements requiring updated baseline emissions calculation against India&apos;s 2025 grid emission factor (0.82 tCO2/MWh down from 0.87). Thermax recalculating baseline with updated IIT-B power grid model. Mahindra holding &#8377;14.35Cr payment in escrow. CBT-0012 (IOCL Varanasi to ITC, &#8377;7.7Cr): 22,000 Gold Standard credits from IOCL Varanasi water treatment plant — VVB desk review flagged monitoring methodology discrepancy: IOCL used SMS-based fuel switching surveys while GS requires GPS-verified LPG delivery tracking. ITC Hotels division offsetting Scope-3 guest water heating emissions, project critical for ITC net-zero water 2030 commitment. IOCL engaging SGS India for revised monitoring plan submission targeting re-validation Q4 2026.</p></CardContent></Card>
          <Card className="cbt-insight-card border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm text-teal-700">EU CBAM Impact: Indian Steel and Aluminum Credit Demand Surge</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">EU Carbon Border Adjustment Mechanism (CBAM) transitional phase (2023-2025) driving massive carbon credit trading demand from Indian steel and aluminum exporters. CBT-0003: JSW Steel sold 120,000 EUA surplus at &#8377;4,200/tonne to Tata Steel for EU CBAM coverage on 2.5 MTPA galvanized steel exports to European automotive market. CBT-0007: NALCO sold 150,000 EUETS allowances at &#8377;4,800/tonne to Hindalco Novelis for aluminum can sheet exports to European beverage market. Indian steel exports face &#8377;12,000/tonne CBAM surcharge without verified carbon credits — creating &#8377;35,000Cr annual compliance credit demand from 45 Indian steel and aluminum exporters. Ministry of Steel establishing dedicated carbon credit acquisition fund (&#8377;5,000Cr) for small exporters unable to independently access EU ETS market. BEE developing bilateral recognition framework with EU Commission for Indian Energy Saving Certificates equivalent to EU ETS allowances.</p></CardContent></Card>
          <Card className="cbt-insight-card border-l-4 border-l-green-600"><CardHeader><CardTitle className="text-sm text-green-700">Green Hydrogen Certificates: Premium Pricing at &#8377;6,200/tonne</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Green Hydrogen Certificates (GHC) emerging as India&apos;s highest-value carbon credit instrument at &#8377;5,500-6,200/tCO2e premium pricing, reflecting both carbon avoidance and green fuel premium. CBT-0004: Adani Green sold 60,000 GH2 certs at &#8377;5,500/tCO2e to BPCL for refinery green hydrogen desulfurization mandate compliance under National Green Hydrogen Mission Phase-2. CBT-0014: NTPC sold 70,000 GH2 certs at &#8377;6,200/tCO2e to Shipping Corporation of India for IMO 2030 GHG strategy fleet compliance. GH2 certification scheme managed by Ministry of New and Renewable Energy (MNRE) with third-party verification by TUV India and DNV. Each GH2 certificate represents 1 tonne CO2e avoided by substituting grey H2 with green electrolytic H2. India targeting 100,000 GH2 certificates annual issuance by 2028, covering refinery desulfurization (40%), green ammonia fertilizer (25%), shipping marine fuel (20%), and steel DRI (15%). Pricing premium: 40% over conventional REC due to double counting prohibition and Scope-1 emission reduction verification.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
