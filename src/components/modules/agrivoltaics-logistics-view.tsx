'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface AGRRecord {
  id: string;
  projectId: string;
  state: string;
  location: string;
  developer: string;
  panelType: string;
  solarCapacityMw: number;
  cropYieldGain: number;
  landAreaHa: number;
  investmentCr: number;
  status: string;
  priority: string;
  origin: string;
  destination: string;
  shipDate: string;
  transitDays: number;
  zone: string;
  remarks: string;
}

const records: AGRRecord[] = [
  { id: 'AGR-0001', projectId: 'AGR-R26RJ1', state: 'Rajasthan', location: 'Jodhpur Barmer Solar Farm', developer: 'Azure Power + IARI', panelType: 'Bifacial Elevated + Ground Crops', solarCapacityMw: 50, cropYieldGain: 35, landAreaHa: 120, investmentCr: 285, status: 'In Transit', priority: 'Critical', origin: 'Azure Power Jaipur Depot', destination: 'Barmer Agrivoltaic Site', shipDate: '2026-07-28', transitDays: 2, zone: 'North', remarks: 'Rajasthan&apos;s largest agrivoltaic installation at 120 ha &#8594; 50 MW bifacial elevated panels 4m above ground enabling cumin and guar cultivation beneath. IARI-developed shade-tolerant crop varieties yield 35% more under partial shade vs open field. &#8377;285Cr investment with dual revenue from solar (&#8377;42Cr/yr) and crop sales (&#8377;18Cr/yr) &#8594; 4.5 year payback. Proven model for Thar desert large-scale deployment' },
  { id: 'AGR-0002', projectId: 'AGR-G26GJ1', state: 'Gujarat', location: 'Kutch Solar-Agriculture Park', developer: 'Adani Green + GAU', panelType: 'Semi-Transparent PV + Fruit Orchard', solarCapacityMw: 40, cropYieldGain: 28, landAreaHa: 95, investmentCr: 240, status: 'Delivered', priority: 'Critical', origin: 'Adani Green Gandhinagar', destination: 'Kutch Mandvi Solar Farm', shipDate: '2026-07-10', transitDays: 1, zone: 'West', remarks: 'Gujarat Kutch agrivoltaic park integrates 40 MW semi-transparent panels with mango and date palm orchard &#8594; 95 ha. Semi-transparent panels transmit 40% sunlight ideal for fruit trees. 28% yield gain from reduced heat stress and water retention. &#8377;240Cr investment &#8594; Adani&apos;s first agrivoltaic project serving Gujarat&apos;s 13 GW solar target while preserving agricultural land classification' },
  { id: 'AGR-0003', projectId: 'AGR-M26MH1', state: 'Maharashtra', location: 'Nashik Grape-Solar Vineyard', developer: 'Tata Power Solar + NRCG', panelType: 'Tracking PV + Grape Trellis', solarCapacityMw: 25, cropYieldGain: 42, landAreaHa: 65, investmentCr: 175, status: 'Processing', priority: 'High', origin: 'Tata Power Solar Mumbai', destination: 'Nashik Agrivoltaic Vineyard', shipDate: '2026-08-01', transitDays: 2, zone: 'West', remarks: 'Nashik wine country agrivoltaic pilot &#8594; 25 MW single-axis tracking panels mounted on grape trellis structures at 65 ha. NRCG shade-tolerant grape varieties produce 42% higher yield under 30% shade. Wine grapes benefit from reduced sunburn and UV damage &#8594; higher tannin quality. &#8377;175Cr investment with premium wine revenue &#8594; model for India&apos;s 300,000 ha vineyard expansion potential' },
  { id: 'AGR-0004', projectId: 'AGR-K26KA1', state: 'Karnataka', location: 'Bengaluruperi-Tumkur Rice-Solar', developer: 'CleanMax + UAS Bangalore', panelType: 'Floating PV + Paddy Fields', solarCapacityMw: 18, cropYieldGain: 22, landAreaHa: 80, investmentCr: 125, status: 'In Transit', priority: 'High', origin: 'CleanMax Whitefield', destination: 'Tumkur Paddy Solar Farm', shipDate: '2026-07-26', transitDays: 1, zone: 'South', remarks: 'Karnataka&apos;s first floating agrivoltaic on paddy fields &#8594; 18 MW floating panels on irrigation canals at 80 ha near Tumkur. Water evaporation reduced by 60% &#8594; critical for drought-prone Tumkur. Paddy yield gains 22% from reduced water stress and microclimate cooling. &#8377;125Cr investment &#8594; UAS Bangalore-developed SRI rice technique optimized for partial shade conditions' },
  { id: 'AGR-0005', projectId: 'AGR-T26TN1', state: 'Tamil Nadu', location: 'Madurai Cotton-Solar Farm', developer: 'Vestas India + TNAU', panelType: 'Vertical Bifacial + Cotton Row', solarCapacityMw: 30, cropYieldGain: 18, landAreaHa: 110, investmentCr: 195, status: 'Delivered', priority: 'High', origin: 'Vestas India Chennai', destination: 'Madurai Agrivoltaic Site', shipDate: '2026-07-08', transitDays: 2, zone: 'South', remarks: 'Tamil Nadu Madurai corridor agrivoltaic &#8594; 30 MW vertical bifacial panels between cotton rows at 110 ha. Vertical orientation captures morning and evening sun while allowing full midday light for cotton. 18% yield gain from wind protection and reduced soil temperature. &#8377;195Cr investment &#8594; TNAU shade-tolerant MCU-5 cotton variety. First vertical agrivoltaic installation in India optimized for row crops' },
  { id: 'AGR-0006', projectId: 'AGR-A26AP1', state: 'Andhra Pradesh', location: 'Anantapur Groundnut-Solar Park', developer: 'Sterling &amp; Wilson + ANGRAU', panelType: 'Elevated Fixed-Tilt + Groundnut', solarCapacityMw: 22, cropYieldGain: 30, landAreaHa: 75, investmentCr: 145, status: 'Delivered', priority: 'High', origin: 'S&amp;W Hyderabad', destination: 'Anantapur Agrivoltaic Park', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'Andhra Anantapur groundnut belt agrivoltaic &#8594; 22 MW elevated panels at 4.5m height over 75 ha groundnut cultivation. 30% yield gain from moisture conservation in arid Rayalaseema region &#8594; groundnut yields improved from 1,200 to 1,560 kg/ha. &#8377;145Cr investment &#8594; ANGRAU-developed drought-resistant groundnut varieties. Water savings of 40% through reduced evaporation critical for Anantapur&apos;s 540 mm annual rainfall' },
  { id: 'AGR-0007', projectId: 'AGR-U26UP1', state: 'Uttar Pradesh', location: 'Lucknow Wheat-Solar Corridor', developer: 'Jakson Green + CSAU&amp;T', panelType: 'High-Clearance PV + Wheat', solarCapacityMw: 35, cropYieldGain: 15, landAreaHa: 140, investmentCr: 210, status: 'Delivered', priority: 'High', origin: 'Jakson Green Noida', destination: 'Lucknow Wheat Solar Farm', shipDate: '2026-07-12', transitDays: 1, zone: 'North', remarks: 'UP&apos;s largest agrivoltaic in Lucknow wheat belt &#8594; 35 MW high-clearance panels at 5m height over 140 ha wheat fields. Rabi wheat yields gain 15% from frost protection and extended growing season. Kharif paddy also cultivated beneath panels. &#8377;210Cr investment &#8594; CSAU&amp;T-developed microclimate management protocol. Demonstrates agrivoltaics in fertile Indo-Gangetic plains &#8594; critical for land-scarce UP with 20 crore population' },
  { id: 'AGR-0008', projectId: 'AGR-M26MP1', state: 'Madhya Pradesh', location: 'Neemuch Wheat-Solar Belt', developer: 'ReNew Power + JNKVV', panelType: 'Agrivoltaic Greenhouse + Vegetables', solarCapacityMw: 20, cropYieldGain: 45, landAreaHa: 55, investmentCr: 165, status: 'In Transit', priority: 'Medium', origin: 'ReNew Power Bhopal', destination: 'Neemuch Greenhouse Farm', shipDate: '2026-07-25', transitDays: 2, zone: 'North', remarks: 'MP Neemuch agrivoltaic greenhouse &#8594; 20 MW greenhouse-integrated solar with tomato and capsicum cultivation at 55 ha. 45% yield gain in controlled microclimate &#8594; highest yield improvement in portfolio. Greenhouse reduces pest incidence by 50% &#8594; minimal pesticide use. &#8377;165Cr investment &#8594; JNKVV-certified organic produce commands 40% premium in Indore and Bhopal markets' },
  { id: 'AGR-0009', projectId: 'AGR-P26PB1', state: 'Punjab', location: 'Ludhiana Maize-Solar Block', developer: 'Suntech + PAU', panelType: 'Rotating Tracking PV + Maize', solarCapacityMw: 28, cropYieldGain: 20, landAreaHa: 100, investmentCr: 185, status: 'Delivered', priority: 'Medium', origin: 'Suntech Mohali', destination: 'Ludhiana Maize Solar Block', shipDate: '2026-07-08', transitDays: 1, zone: 'North', remarks: 'Punjab Ludhiana agrivoltaic &#8594; 28 MW rotating tracking panels synchronized with maize row orientation at 100 ha. 20% yield gain from optimized shade during tasseling stage. PAU-developed shade-tolerant maize hybrid PMH-10 performs exceptionally under 25% shade. &#8377;185Cr investment &#8594; addresses Punjab&apos;s paddy monoculture crisis by enabling profitable maize cultivation with solar bonus income' },
  { id: 'AGR-0010', projectId: 'AGR-H26HR1', state: 'Haryana', location: 'Karnal Rice-Solar Hub', developer: 'Amplus Energy + CCSHAU', panelType: 'East-West Elevated + Basmati Rice', solarCapacityMw: 15, cropYieldGain: 12, landAreaHa: 70, investmentCr: 110, status: 'Processing', priority: 'Medium', origin: 'Amplus Energy Gurgaon', destination: 'Karnal Basmati Solar Hub', shipDate: '2026-08-02', transitDays: 1, zone: 'North', remarks: 'Haryana Karnal basmati rice agrivoltaic &#8594; 15 MW east-west elevated panels over 70 ha PUSA-1121 basmati cultivation. Modest 12% yield gain &#8594; but basmati premium price of &#8377;85/kg makes even small yield gains highly valuable. &#8377;110Cr investment &#8594; dual income from solar PPAs (&#8377;12Cr/yr) and premium basmati export (&#8377;22Cr/yr). CCSHAU shade management ensures basmati aroma compound (2-acetyl-1-pyrroline) preservation' },
  { id: 'AGR-0011', projectId: 'AGR-T26TL1', state: 'Telangana', location: 'Warangal Soybean-Solar Farm', developer: 'Greenko + PJTSAU', panelType: 'Agrivoltaic Shade Structure + Soybean', solarCapacityMw: 24, cropYieldGain: 32, landAreaHa: 85, investmentCr: 155, status: 'Delivered', priority: 'Medium', origin: 'Greenko Hyderabad', destination: 'Warangal Soybean Solar Farm', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: 'Telangana Warangal soybean agrivoltaic &#8594; 24 MW shade structures over 85 ha soybean cultivation. 32% yield gain from reduced heat stress during critical pod-filling stage &#8594; temperatures under shade 3-5&#176;C lower. &#8377;155Cr investment &#8594; Greenko&apos;s first agrivoltaic project. PJTSAU-developed TS-38 soybean variety optimized for partial shade &#8594; oil content maintained at 20% despite reduced sunlight hours' },
  { id: 'AGR-0012', projectId: 'AGR-B26BH1', state: 'Bihar', location: 'Patna Vegetable-Solar Zone', developer: 'Vikram Solar + RCAU', panelType: 'Low-Height Fixed PV + Vegetables', solarCapacityMw: 12, cropYieldGain: 38, landAreaHa: 45, investmentCr: 85, status: 'In Transit', priority: 'Medium', origin: 'Vikram Solar Kolkata', destination: 'Patna Vegetable Solar Zone', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Bihar Patna vegetable agrivoltaic &#8594; 12 MW low-height fixed panels at 2.5m over 45 ha vegetable cultivation. 38% yield gain for leafy vegetables (spinach, cabbage, cauliflower) under partial shade &#8594; ideal for Bihar&apos;s hot summers. &#8377;85Cr investment &#8594; RCAU-selected shade-tolerant vegetable varieties. Year-round 3-crop rotation (rabi-vegetables, zaid-pumpkin, kharif-okra) maximizes land productivity to 280% of single crop' },
  { id: 'AGR-0013', projectId: 'AGR-O26OR1', state: 'Odisha', location: 'Bhubaneswar Turmeric-Solar Block', developer: 'NTPC Green + OUAT', panelType: 'Elevated PV + Turmeric Intercrop', solarCapacityMw: 16, cropYieldGain: 25, landAreaHa: 60, investmentCr: 105, status: 'Delivered', priority: 'Medium', origin: 'NTPC Green Bhubaneswar', destination: 'Bhubaneswar Turmeric Solar Block', shipDate: '2026-07-12', transitDays: 1, zone: 'East', remarks: 'Odisha Bhubaneswar turmeric agrivoltaic &#8594; 16 MW elevated panels with turmeric and ginger intercropping at 60 ha. 25% yield gain for turmeric (curcumin content maintained at 5.2%). &#8377;105Cr investment &#8594; OUAT-developed Roma turmeric variety thrives in partial shade with 18-month crop cycle. NTPC&apos;s first agrivoltaic project &#8594; generates 24 MWh/yr solar and &#8377;8Cr/yr turmeric revenue from Odisha&apos;s premium &apos;Konark turmeric&apos; GI tag' },
  { id: 'AGR-0014', projectId: 'AGR-W26WB1', state: 'West Bengal', location: 'Burdwan Jute-Solar Field', developer: 'CIL Solar + BCKV', panelType: 'Semi-Shade PV + Jute-Rice Rotation', solarCapacityMw: 10, cropYieldGain: 15, landAreaHa: 50, investmentCr: 72, status: 'In Transit', priority: 'Medium', origin: 'CIL Solar Asansol', destination: 'Burdwan Jute Solar Field', shipDate: '2026-07-27', transitDays: 2, zone: 'East', remarks: 'West Bengal Burdwan jute-rice rotation agrivoltaic &#8594; 10 MW semi-shade panels at 50 ha supporting jute (rabi) and rice (kharif) rotation. 15% jute fiber yield improvement from partial shade &#8594; fiber quality grades improved by 1 level. &#8377;72Cr investment &#8594; CIL solar demonstrates coal-to-solar transition on reclaimed mine land. BCKV-developed retting process optimized for agrivoltaic conditions &#8594; dual income supports smallholder families' },
];

const COLORS = ['#65a30d', '#84cc16', '#a3e635', '#bef264', '#4d7c0f', '#3f6212', '#365314', '#1a2e05'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 7 }, { value: 'Processing', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 5 }, { value: 'Medium', count: 7 },
  ]},
  { label: 'Panel Type', key: 'panelType', options: [
    { value: 'Bifacial Elevated + Ground Crops', count: 1 }, { value: 'Semi-Transparent PV + Fruit Orchard', count: 1 }, { value: 'Tracking PV + Grape Trellis', count: 1 }, { value: 'Floating PV + Paddy Fields', count: 1 }, { value: 'Vertical Bifacial + Cotton Row', count: 1 }, { value: 'Elevated Fixed-Tilt + Groundnut', count: 1 }, { value: 'High-Clearance PV + Wheat', count: 1 }, { value: 'Agrivoltaic Greenhouse + Vegetables', count: 1 }, { value: 'Rotating Tracking PV + Maize', count: 1 }, { value: 'East-West Elevated + Basmati Rice', count: 1 }, { value: 'Agrivoltaic Shade Structure + Soybean', count: 1 }, { value: 'Low-Height Fixed PV + Vegetables', count: 1 }, { value: 'Elevated PV + Turmeric Intercrop', count: 1 }, { value: 'Semi-Shade PV + Jute-Rice Rotation', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 5 }, { value: 'South', count: 4 }, { value: 'West', count: 3 }, { value: 'East', count: 2 },
  ]},
];

export default function AgrivoltaicsLogisticsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registry' | 'analytics' | 'insights'>('dashboard');

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev: Record<string, string[]>) => {
      const next = { ...prev };
      const arr = next[key] || [];
      if (arr.includes(value)) {
        next[key] = arr.filter((v: string) => v !== value);
        if (next[key].length === 0) delete next[key];
      } else {
        next[key] = [...arr, value];
      }
      return next;
    });
  };

  const clearAllFilters = () => setActiveFilters({});

  const filteredRecords = useMemo(() => {
    return records.filter((r: AGRRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.state.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof AGRRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalMw = records.reduce((s, r) => s + r.solarCapacityMw, 0);
  const totalHa = records.reduce((s, r) => s + r.landAreaHa, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgYield = (records.reduce((s, r) => s + r.cropYieldGain, 0) / records.length).toFixed(0);

  const kpiData = [
    { label: 'Total Solar Capacity', value: `${totalMw} MW`, sub: 'Agrivoltaic Installations' },
    { label: 'Total Land Area', value: `${totalHa} ha`, sub: 'Dual-Use Agricultural Land' },
    { label: 'Avg Crop Yield Gain', value: `${avgYield}%`, sub: 'vs Open-Field Baseline' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'National Agrivoltaics Mission' },
  ];

  const stateData = useMemo(() => records.map(r => ({ state: r.state, mw: r.solarCapacityMw, yield: r.cropYieldGain })).sort((a, b) => b.mw - a.mw), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const mwVsYield = useMemo(() => records.map(r => ({ state: r.state, mw: r.solarCapacityMw, yield: r.cropYieldGain })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 agr-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Agrivoltaics' }]} />
      <PageHeader title="Agrivoltaics Logistics" description="Dual-use solar-plus-agriculture installations combining elevated PV panels with shade-tolerant crop cultivation for land productivity optimization across Indian states" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#65a30d] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="agr-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#65a30d]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="agr-chart-card"><CardHeader><CardTitle className="text-base">Solar Capacity by State (MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={stateData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="mw" fill="#65a30d" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="agr-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#65a30d" /><Cell fill="#84cc16" /><Cell fill="#a3e635" /><Cell fill="#4d7c0f" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'agr-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Agrivoltaic Project Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#65a30d] bg-lime-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.state} &#8594; {r.transitDays}d | {r.solarCapacityMw} MW | {r.cropYieldGain}% yield gain</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1" dangerouslySetInnerHTML={{ __html: r.remarks }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="agr-chart-card"><CardHeader><CardTitle className="text-base">Solar Capacity vs Crop Yield Gain</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={mwVsYield}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="mw" stroke="#65a30d" strokeWidth={2} name="Solar (MW)" /><Line yAxisId="right" type="monotone" dataKey="yield" stroke="#4d7c0f" strokeWidth={2} name="Yield Gain (%)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="agr-chart-card"><CardHeader><CardTitle className="text-base">Investment per MW (&#8377;Cr/MW)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ state: r.state, invMw: +(r.investmentCr / r.solarCapacityMw).toFixed(1) }))}><XAxis dataKey="state" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="invMw" fill="#84cc16" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="agr-chart-card"><CardHeader><CardTitle className="text-base">Total Land Area by Zone (ha)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.landAreaHa; return m; }, {})).map(([k, v]) => ({ zone: k, ha: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="ha" fill="#4d7c0f" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="agr-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 5 }, { name: 'Delivered', value: 7 }, { name: 'Processing', value: 2 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#65a30d" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="agr-insight-card"><CardHeader><CardTitle className="text-base">Rajasthan Leads at 50 MW with Desert Agrivoltaics</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Rajasthan&apos;s Jodhpur-Barmer 50 MW agrivoltaic installation (AGR-0001) is India&apos;s largest &#8594; 120 ha of bifacial elevated panels with cumin and guar cultivation beneath. IARI-developed shade-tolerant varieties achieve 35% yield improvement &#8594; proving that Thar desert farming can coexist with solar at utility scale. Dual revenue of &#8377;60Cr/yr delivers 4.5-year payback &#8594; the fastest ROI in the portfolio and a model for Rajasthan&apos;s 62 GW solar target without converting agricultural land.</p></CardContent></Card>
          <Card className="agr-insight-card"><CardHeader><CardTitle className="text-base">Greenhouse Agrivoltaics Achieves Highest Yield Gains</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">MP Neemuch&apos;s agrivoltaic greenhouse (AGR-0008) achieves 45% crop yield gain &#8594; the highest in the portfolio. 20 MW greenhouse-integrated solar with tomato and capsicum cultivation demonstrates that controlled-environment agrivoltaics can exceed open-field yields significantly. 50% pest reduction eliminates pesticide costs &#8594; organic certification enables 40% price premium. &#8377;165Cr investment generates &#8377;32Cr/yr revenue &#8594; 5.2-year payback with zero chemical input.</p></CardContent></Card>
          <Card className="agr-insight-card"><CardHeader><CardTitle className="text-base">Nashik Wine Country Model for 300,000 ha Vineyards</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Maharashtra Nashik grape-solar vineyard (AGR-0003) uniquely mounts single-axis tracking panels on grape trellis structures &#8594; 42% yield gain with improved wine quality from reduced sunburn. NRCG-developed shade-tolerant varieties produce higher tannin concentration under partial shade. India&apos;s 300,000 ha vineyard area could host 75 GW of agrivoltaic capacity &#8594; transforming Nashik into India&apos;s first net-positive wine region with carbon-negative wine production.</p></CardContent></Card>
          <Card className="agr-insight-card"><CardHeader><CardTitle className="text-base">National Scale-Up: 10 GW Target by 2030</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 375 MW across 1,250 ha at &#8377;2,312Cr investment demonstrates average yield gain of 26% across 14 Indian states. Ministry of New and Renewable Energy targets 10 GW agrivoltaic by 2030 under PM-KUSUM extension &#8594; requiring &#8377;65,000Cr across 33,000 ha. Current projects prove that land-use conflict between solar and agriculture is solvable &#8594; agrivoltaics can generate 2.5x the economic value per hectare vs solar-only or crop-only alternatives.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
