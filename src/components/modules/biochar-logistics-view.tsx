'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface BiocharRecord {
  id: string;
  batchNo: string;
  feedstock: string;
  pyrolysisType: string;
  application: string;
  quantityMT: number;
  carbonContent: number;
  yieldPct: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: BiocharRecord[] = [
  { id: 'BCH-0001', batchNo: 'BCH-B2401', feedstock: 'Rice Husk', pyrolysisType: 'Slow Pyrolysis (550C)', application: 'Organic Farming Soil Amendment', quantityMT: 1200, carbonContent: 72, yieldPct: 35, status: 'In Transit', priority: 'High', origin: 'Karnal (IARI Biochar)', destination: 'Patiala (Punjab Agri Dept)', shipDate: '2026-07-20', transitDays: 1, zone: 'North', remarks: '1,200 MT rice husk biochar for Punjab organic farming soil amendment program — 15% yield increase paddy' },
  { id: 'BCH-0002', batchNo: 'BCH-B2402', feedstock: 'Sugarcane Bagasse', pyrolysisType: 'Fast Pyrolysis (450C)', application: 'Water Filtration Media', quantityMT: 800, carbonContent: 65, yieldPct: 25, status: 'Delivered', priority: 'High', origin: 'Belgaum (Ugar Biochar)', destination: 'Hubli (Karnataka Water Board)', shipDate: '2026-07-18', transitDays: 1, zone: 'South', remarks: '800 MT bagasse biochar activated for Hubli municipal water fluoride and arsenic filtration system' },
  { id: 'BCH-0003', batchNo: 'BCH-B2403', feedstock: 'Coconut Shell', pyrolysisType: 'Slow Pyrolysis (600C)', application: 'Carbon Credit (Biochar CDR)', quantityMT: 500, carbonContent: 85, yieldPct: 30, status: 'Processing', priority: 'Critical', origin: 'Kerala (KIRAN Biochar)', destination: 'Mumbai (Reliance Carbon)', shipDate: '2026-07-23', transitDays: 2, zone: 'South', remarks: '500 MT coconut shell biochar certified PuroEarth for Reliance biochar CDR carbon credit Verra VCU issuance' },
  { id: 'BCH-0004', batchNo: 'BCH-B2404', feedstock: 'Wheat Straw', pyrolysisType: 'Torrefaction (280C)', application: 'Soil Remediation (Heavy Metal)', quantityMT: 1500, carbonContent: 58, yieldPct: 70, status: 'In Transit', priority: 'Medium', origin: 'Ludhiana (PAU Biochar)', destination: 'Jalandhar (NRB Agro)', shipDate: '2026-07-19', transitDays: 1, zone: 'North', remarks: '1,500 MT wheat straw torrefied biochar for Jalandhar industrial soil lead-cadmium remediation project' },
  { id: 'BCH-0005', batchNo: 'BCH-B2405', feedstock: 'Municipal Solid Waste', pyrolysisType: 'Slow Pyrolysis (500C)', application: 'Urban Green Space Soil', quantityMT: 600, carbonContent: 45, yieldPct: 20, status: 'Delayed', priority: 'Medium', origin: 'Pune (NMMC Bio-Carbon)', destination: 'Pune (PMC Parks Dept)', shipDate: '2026-07-12', transitDays: 8, zone: 'West', remarks: '600 MT MSW-derived biochar for Pune municipal park soil carbon enrichment — MSW sorting contamination delay' },
  { id: 'BCH-0006', batchNo: 'BCH-B2406', feedstock: 'Bamboo', pyrolysisType: 'Slow Pyrolysis (650C)', application: 'Tea Garden Soil Amendment', quantityMT: 350, carbonContent: 78, yieldPct: 28, status: 'Delivered', priority: 'High', origin: 'Guwahati (Assam Bamboo)', destination: 'Jorhat (Tata Tea)', shipDate: '2026-07-16', transitDays: 1, zone: 'East', remarks: '350 MT bamboo biochar for Tata Tea Jorhat estate acid tea soil pH amendment and moisture retention' },
  { id: 'BCH-0007', batchNo: 'BCH-B2407', feedstock: 'Cotton Stalk', pyrolysisType: 'Fast Pyrolysis (480C)', application: 'Composite Biochar Fertilizer', quantityMT: 900, carbonContent: 60, yieldPct: 32, status: 'In Transit', priority: 'High', origin: 'Nagpur (CICR Biochar)', destination: 'Akola (IFFCO Kisan)', shipDate: '2026-07-21', transitDays: 1, zone: 'West', remarks: '900 MT cotton stalk biochar blended with NPK for IFFCO Akola biochar-enhanced compound fertilizer BCF-15' },
  { id: 'BCH-0008', batchNo: 'BCH-B2408', feedstock: 'Sawdust (Teak)', pyrolysisType: 'Slow Pyrolysis (550C)', application: 'Odor Control (Livestock)', quantityMT: 250, carbonContent: 75, yieldPct: 33, status: 'Delivered', priority: 'Low', origin: 'Jabalpur (MP Forestry)', destination: 'Bhopal (MP Livestock)', shipDate: '2026-07-15', transitDays: 1, zone: 'North', remarks: '250 MT teak sawdust biochar for MP dairy farm manure odor absorption and bedding amendment ammonia reduction' },
  { id: 'BCH-0009', batchNo: 'BCH-B2409', feedstock: 'Paddy Straw', pyrolysisType: 'Hydrothermal (200C, 15bar)', application: 'Carbon Credit (Biochar CDR)', quantityMT: 1800, carbonContent: 52, yieldPct: 55, status: 'Processing', priority: 'Critical', origin: 'Karnal (IARI HTC Plant)', destination: 'Delhi (Adani Carbon)', shipDate: '2026-07-24', transitDays: 1, zone: 'North', remarks: '1,800 MT paddy straw hydrothermal biochar for Adani carbon credit certification — addressing stubble burning crisis' },
  { id: 'BCH-0010', batchNo: 'BCH-B2410', feedstock: 'Groundnut Shell', pyrolysisType: 'Slow Pyrolysis (500C)', application: 'Horticulture Root Growth', quantityMT: 400, carbonContent: 70, yieldPct: 30, status: 'In Transit', priority: 'Medium', origin: 'Rajkot (Junagadh Agri)', destination: 'Ahmedabad (IGFRI)', shipDate: '2026-07-22', transitDays: 1, zone: 'West', remarks: '400 MT groundnut shell biochar for IGFRI Ahmedabad mango orchard root zone mycorrhizal enhancement study' },
  { id: 'BCH-0011', batchNo: 'BCH-B2411', feedstock: 'Palm Frond', pyrolysisType: 'Slow Pyrolysis (580C)', application: 'Coconut Estate Soil Rehab', quantityMT: 280, carbonContent: 68, yieldPct: 27, status: 'Delivered', priority: 'Medium', origin: 'Thanjavur (TNAU Biochar)', destination: 'Kerala ( coconut Board)', shipDate: '2026-07-17', transitDays: 2, zone: 'South', remarks: '280 MT palm frond biochar for Coconut Development Board Kerala soil rehabilitation after white grub pest damage' },
  { id: 'BCH-0012', batchNo: 'BCH-B2412', feedstock: 'Eucalyptus Bark', pyrolysisType: 'Slow Pyrolysis (620C)', application: 'Wastewater Treatment (Phosphorus)', quantityMT: 550, carbonContent: 76, yieldPct: 29, status: 'Delayed', priority: 'High', origin: 'Coimbatore (TNAU Eucalyptus)', destination: 'Chennai (CMWSSB STP)', shipDate: '2026-07-10', transitDays: 12, zone: 'South', remarks: '550 MT eucalyptus biochar for Chennai sewage treatment phosphorus adsorption — plant shutdown delayed processing 12 days' },
  { id: 'BCH-0013', batchNo: 'BCH-B2413', feedstock: 'Mustard Stalk', pyrolysisType: 'Torrefaction (260C)', application: 'Biochar Concrete Admixture', quantityMT: 420, carbonContent: 55, yieldPct: 65, status: 'In Transit', priority: 'High', origin: 'Alwar (Rajasthan Agri)', destination: 'Jaipur (ACC Concrete)', shipDate: '2026-07-20', transitDays: 1, zone: 'North', remarks: '420 MT torrefied mustard stalk biochar for ACC Jaipur biochar concrete admixture pilot — 12% cement reduction target' },
  { id: 'BCH-0014', batchNo: 'BCH-B2414', feedstock: 'Coffee Pulp', pyrolysisType: 'Slow Pyrolysis (550C)', application: 'Vineyard Soil Acidification Fix', quantityMT: 320, carbonContent: 64, yieldPct: 26, status: 'Processing', priority: 'Low', origin: 'Chikmagalur (Coffeelands)', destination: 'Nashik (Sula Vineyards)', shipDate: '2026-07-25', transitDays: 2, zone: 'South', remarks: '320 MT coffee pulp biochar for Sula Nashik vineyard soil pH buffering and trace mineral supplementation' },
];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 4 }, { value: 'Processing', count: 3 }, { value: 'Delayed', count: 2 },
  ]},
  { label: 'Feedstock', key: 'feedstock', options: [
    { value: 'Rice Husk', count: 1 }, { value: 'Sugarcane Bagasse', count: 1 }, { value: 'Coconut Shell', count: 1 }, { value: 'Wheat Straw', count: 1 },
  ]},
  { label: 'Application', key: 'application', options: [
    { value: 'Organic Farming Soil Amendment', count: 1 }, { value: 'Carbon Credit (Biochar CDR)', count: 2 }, { value: 'Water Filtration Media', count: 1 }, { value: 'Composite Biochar Fertilizer', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 5 }, { value: 'Medium', count: 4 }, { value: 'Low', count: 3 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 4 }, { value: 'South', count: 5 }, { value: 'West', count: 3 }, { value: 'East', count: 1 },
  ]},
];

const statusColor: Record<string, string> = { 'Critical': 'bg-red-100 text-red-800 border-red-300', 'High': 'bg-amber-100 text-amber-800 border-amber-300', 'Medium': 'bg-blue-100 text-blue-800 border-blue-300', 'Low': 'bg-green-100 text-green-800 border-green-300' };
const statusBadge: Record<string, string> = { 'In Transit': 'bg-blue-100 text-blue-800', 'Delivered': 'bg-green-100 text-green-800', 'Processing': 'bg-amber-100 text-amber-800', 'Delayed': 'bg-red-100 text-red-800' };

const kpis = [
  { title: 'Total Batches', value: 14, sub: 'Biochar Supply Chain', color: 'text-lime-800' },
  { title: 'Total Volume', value: '9,870 MT', sub: 'All Feedstocks', color: 'text-green-700' },
  { title: 'Avg Carbon %', value: '67.1%', sub: 'Coconut Shell 85% Peak', color: 'text-emerald-700' },
  { title: 'National Target', value: '\u20b93,500Cr', sub: 'National Biochar Mission', color: 'text-olive-700' },
];

export default function BiocharLogisticsView() {
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
      if (searchQuery && !`${r.id} ${r.batchNo} ${r.feedstock} ${r.pyrolysisType} ${r.application} ${r.origin} ${r.destination}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      for (const [k, vs] of Object.entries(activeFilters)) { if (vs.length > 0 && !vs.includes(String(r[k as keyof BiocharRecord]))) return false; }
      return true;
    });
  }, [searchQuery, activeFilters]);

  const volumeByFeedstock = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.feedstock, (map.get(r.feedstock) || 0) + r.quantityMT); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, quantityMT]) => ({ name: name.slice(0, 14), quantityMT }));
  }, []);

  const pyroDist = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { const s = r.pyrolysisType.split('(')[0].trim(); map.set(s, (map.get(s) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const prodTrend = useMemo(() => [
    { year: '2022', mt: 5000 }, { year: '2023', mt: 15000 }, { year: '2024', mt: 35000 }, { year: '2025', mt: 70000 }, { year: '2026', mt: 120000 }, { year: '2027', mt: 200000 }, { year: '2028', mt: 320000 },
  ], []);

  const carbonData = useMemo(() => {
    return records.filter((_, i) => i % 2 === 0).map((r) => ({ name: r.batchNo.slice(-2), carbon: r.carbonContent }));
  }, []);

  const zoneDistribution = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.zone, (map.get(r.zone) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const volumeByApp = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => { map.set(r.application, (map.get(r.application) || 0) + r.quantityMT); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, quantityMT]) => ({ name: name.slice(0, 18), quantityMT }));
  }, []);

  const COLORS = ['#65a30d', '#84cc16', '#4d7c0f', '#3f6212', '#a3e635'];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'registry', label: 'Registry' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'insights', label: 'Insights' },
  ];

  return (
    <div className="bch-logistics-view space-y-4 p-4">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Circular Economy' }, { label: 'Biochar' }]} />
      <PageHeader title="Biochar Supply Chain Logistics" description="Indian biochar production and distribution &#8212; slow pyrolysis, fast pyrolysis, torrefaction, and hydrothermal carbonization from agricultural residues, biomass waste, and forestry byproducts for soil amendment, carbon credits, water filtration, and construction" />

      <div className="bch-kpi-grid grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="bch-kpi-card">
            <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="bch-tab-bar flex gap-1 border-b">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`bch-tab-btn px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-lime-700 text-lime-800' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab !== 'registry' && (
        <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={() => setActiveFilters({})} totalItems={records.length} filteredCount={filteredRecords.length} />
      )}

      {activeTab === 'dashboard' && (
        <div className="bch-dashboard-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bch-chart-card"><CardHeader><CardTitle className="text-sm">Volume by Feedstock (MT)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={volumeByFeedstock}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="quantityMT" fill="#65a30d" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="bch-chart-card"><CardHeader><CardTitle className="text-sm">Pyrolysis Type Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={pyroDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#65a30d" /><Cell fill="#84cc16" /><Cell fill="#4d7c0f" /><Cell fill="#3f6212" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="bch-chart-card"><CardHeader><CardTitle className="text-sm">Biochar Production Growth (MT/year)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={prodTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="mt" stroke="#84cc16" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="bch-chart-card"><CardHeader><CardTitle className="text-sm">Carbon Content (%) by Batch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={carbonData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="carbon" fill="#4d7c0f" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="bch-registry-table overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-slate-50">
              <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Feedstock</th><th className="px-2 py-2 text-left">Pyrolysis</th><th className="px-2 py-2 text-left">Application</th><th className="px-2 py-2 text-right">MT</th><th className="px-2 py-2 text-right">C%</th><th className="px-2 py-2 text-right">Yield</th><th className="px-2 py-2 text-left">Status</th><th className="px-2 py-2 text-left">Priority</th><th className="px-2 py-2 text-left">Route</th><th className="px-2 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id} className={`bch-table-row border-b hover:bg-lime-50/30 ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}`}>
                  <td className="px-2 py-2 font-mono text-xs">{r.id}</td>
                  <td className="px-2 py-2 text-xs">{r.feedstock}</td>
                  <td className="px-2 py-2 text-xs">{r.pyrolysisType}</td>
                  <td className="px-2 py-2 text-xs">{r.application}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.quantityMT.toLocaleString()}</td>
                  <td className="px-2 py-2 text-right font-mono">{r.carbonContent}%</td>
                  <td className="px-2 py-2 text-right font-mono">{r.yieldPct}%</td>
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
        <div className="bch-analytics-grid grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bch-chart-card"><CardHeader><CardTitle className="text-sm">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}><Cell fill="#65a30d" /><Cell fill="#84cc16" /><Cell fill="#4d7c0f" /><Cell fill="#3f6212" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          <Card className="bch-chart-card"><CardHeader><CardTitle className="text-sm">Volume by Application (MT)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={volumeByApp}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="quantityMT" fill="#65a30d" radius={[4,4,0,0]} name="MT" /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="bch-chart-card"><CardHeader><CardTitle className="text-sm">Volume vs Carbon Content</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><LineChart data={records.slice(0, 8).map((r) => ({ name: r.feedstock.slice(0, 8), vol: r.quantityMT, carbon: r.carbonContent }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Line type="monotone" dataKey="vol" stroke="#65a30d" strokeWidth={2} name="MT" /><Line type="monotone" dataKey="carbon" stroke="#84cc16" strokeWidth={2} name="C%" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="bch-chart-card"><CardHeader><CardTitle className="text-sm">Pyrolysis Yield (%) Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={220}><BarChart data={records.slice(0, 10).map((r) => ({ name: r.feedstock.slice(0, 10), yield: r.yieldPct }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="yield" fill="#4d7c0f" radius={[4,4,0,0]} name="Yield%" /></BarChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="bch-insights-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bch-insight-card border-l-4 border-l-lime-700"><CardHeader><CardTitle className="text-sm text-lime-800">National Biochar Mission: India&apos;s Agriculture Carbon Sink</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">India&apos;s National Biochar Mission under ICAR targeting 3.2 lakh tonnes annual biochar production by 2028, converting 15 million tonnes of agricultural residue currently burned or wasted into stable carbon soil amendment. India generates 680 MT crop residue annually &#8212; 180 MT openly burned causing severe air pollution. Biochar conversion captures 30-85% of feedstock carbon in stable form persisting 100-1,000 years in soil. BCH-0001: IARI Karnal rice husk slow pyrolysis plant producing 1,200 MT biochar for Punjab organic farming program &#8212; field trials demonstrate 15% paddy yield increase, 40% reduction in urea application, and 25% improvement in water retention in sandy loam soils. ICAR developing biochar application guidelines for 14 agro-climatic zones covering paddy, wheat, cotton, sugarcane, and horticulture crops. Biochar-amended soil shows 50% reduction in nitrous oxide emissions (potent GHG 298x CO2 equivalent), making biochar a triple-win: carbon sequestration, yield improvement, and emission reduction. National Biochar Mission budget: &#8377;3,500Cr covering 500 pyrolysis units across rural India, 150 biochar blending centers, and 50 biochar-enhanced fertilizer factories.</p></CardContent></Card>
          <Card className="bch-insight-card border-l-4 border-l-red-600"><CardHeader><CardTitle className="text-sm text-red-700">Delayed Batches: BCH-0005 and BCH-0012</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">BCH-0005 (Pune NMMC to PMC Parks, 8-day delay): 600 MT MSW-derived biochar for Pune municipal park soil carbon enrichment &#8212; NMMC mixed waste sorting facility received contaminated MSW with 25% plastic/glass contamination, requiring additional manual sorting line installation. Biochar from contaminated feedstock showed reduced carbon content (45% vs target 60%) and heavy metal traces exceeding biochar quality standards (IBI Biochar Standards). NMMC upgrading magnetic separation and eddy current separator for plastic/metal removal. BCH-0012 (Coimbatore TNAU to Chennai CMWSSB, 12-day delay): 550 MT eucalyptus bark biochar for Chennai sewage phosphorus adsorption media &#8212; TNAU Coimbatore biochar plant boiler tube leak forced 12-day shutdown. Alternative supply arranged from KRIBHCO biochar unit at 35% higher cost. Chennai CMWSSB 200 MLD sewage treatment plant phosphorus removal efficiency dropping without biochar media replacement &#8214; phosphorus discharge into Cooum River exceeding CPCB standards by 2.3x.</p></CardContent></Card>
          <Card className="bch-insight-card border-l-4 border-l-green-700"><CardHeader><CardTitle className="text-sm text-green-700">Biochar Carbon Credits: Verra CDR Certification India</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Biochar Carbon Dioxide Removal (CDR) credits emerging as India&apos;s fastest-growing voluntary carbon market instrument, priced at &#8377;3,500-6,000/tCO2e &#8212; premium 40% above forestry offsets due to measurable permanence verification. BCH-0003: KIRAN Kerala coconut shell slow pyrolysis at 600C producing 500 MT biochar at 85% carbon content &#8212; PuroEarth biochar CDR methodology Verra VCU-019 certified, each tonne biochar sequesters 2.5 tonnes CO2e over 100-year permanence period. Reliance Carbon acquiring 500 MT batch for corporate net-zero commitment at &#8377;5,200/tCO2e equivalent. BCH-0009: IARI Karnal hydrothermal carbonization (HTC) plant converting 1,800 MT paddy straw at 200C 15bar &#8212; HTC biochar at 52% carbon but 55% yield (vs 30% slow pyrolysis) enables massive scale from Punjab-Haryana stubble burning crisis. Adani Carbon offtake for Verra certification addressing 3 states stubble burning ban enforcement. India biochar CDR potential: 50 MtCO2e/year from 150 MT agricultural residue conversion, representing &#8377;17,500Cr annual carbon credit revenue opportunity.</p></CardContent></Card>
          <Card className="bch-insight-card border-l-4 border-l-teal-600"><CardHeader><CardTitle className="text-sm text-teal-700">Biochar Concrete: 12% Cement Reduction for Green Construction</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">Biochar as supplementary cementitious material replacing 8-12% Portland cement clinker in concrete production &#8214; each tonne of biochar replacing cement avoids 0.85 tonnes CO2 from cement manufacturing. BCH-0013: 420 MT torrefied mustard stalk biochar from Rajasthan for ACC Jaipur biochar concrete pilot &#8212; torrefaction at 260C yields 65% biochar with porous structure providing internal curing and microcrack self-healing in concrete. ACC Jaipur trial: 12% cement replacement with biochar maintaining M25 Grade strength (25 MPa) at 28 days while reducing water demand by 8%. Additional benefits: biochar concrete shows 30% improved chloride resistance for coastal structures and 20% reduced shrinkage cracking. India cement industry produces 380 MT CO2e annually &#8212; 12% biochar substitution across Indian cement plants could avoid 45 MT CO2e/year. UltraTech Cement and Ambuja Cements launching biochar-blended green cement product lines by 2028. BIS developing IS code for biochar concrete mix design standards. Construction industry biochar demand: 5 MT/year by 2028, 25 MT/year by 2032.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
