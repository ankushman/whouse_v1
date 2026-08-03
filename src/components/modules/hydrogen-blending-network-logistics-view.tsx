'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface HBNRecord {
  id: string;
  projectId: string;
  city: string;
  pipeline: string;
  operator: string;
  blendRatio: number;
  pipelineLengthKm: number;
  h2VolumeTPD: number;
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

const records: HBNRecord[] = [
  { id: 'HBN-0001', projectId: 'HBN-D26DEL', city: 'Delhi', pipeline: 'IGL Delhi City Gas Network', operator: 'IGL + NTPC Green', blendRatio: 5, pipelineLengthKm: 285, h2VolumeTPD: 42, investmentCr: 320, status: 'In Transit', priority: 'Critical', origin: 'IGL Rohini Control', destination: 'NTPC Dadri H2 Plant', shipDate: '2026-07-28', transitDays: 2, zone: 'North', remarks: 'India&apos;s largest H2-CNG blending pilot in Delhi CGD network &#8594; 5% green hydrogen blended into 285 km IGL city gas pipeline. NTPC Dadri supplies 42 TPD electrolytic H2 from 10 MW alkaline electrolyzer &#8594; &#8377;320Cr investment. Reduces CO2 by 3,200 tCO2/yr across 18 lakh domestic PNG connections &#8594; first step toward 15% blend target by 2030' },
  { id: 'HBN-0002', projectId: 'HBN-M26MUM', city: 'Mumbai', pipeline: 'MGL Thane-Belapur Industrial Network', operator: 'MGL + GAIL', blendRatio: 8, pipelineLengthKm: 195, h2VolumeTPD: 55, investmentCr: 450, status: 'Delivered', priority: 'Critical', origin: 'MGL Wadala HQ', destination: 'GAIL Uran H2 Terminal', shipDate: '2026-07-10', transitDays: 1, zone: 'West', remarks: 'Mumbai industrial gas network achieves India&apos;s highest H2 blend at 8% &#8594; 195 km MGL pipeline serving Thane-Belapur MIDC. GAIL supplies 55 TPD from imported ammonia cracking at Uran terminal &#8594; &#8377;450Cr investment. Industrial consumers include refineries, petrochemicals and steel plants &#8594; 4,500 tCO2/yr reduction. Blueprint for all Indian industrial CGD clusters' },
  { id: 'HBN-0003', projectId: 'HBN-A26AHM', city: 'Ahmedabad', pipeline: 'SGGL Saurashtra Industrial Corridor', operator: 'SGGL + Adani Green', blendRatio: 5, pipelineLengthKm: 168, h2VolumeTPD: 28, investmentCr: 210, status: 'Processing', priority: 'High', origin: 'SGGL Naroda Depot', destination: 'Adani Green Mundra H2', shipDate: '2026-08-01', transitDays: 2, zone: 'West', remarks: 'Gujarat&apos;s first H2-CNG blending in SGGL&apos;s Saurashtra industrial pipeline &#8594; 5% blend across 168 km. Adani Green&apos;s Mundra 30 MW electrolyzer supplies 28 TPD green H2 &#8594; &#8377;210Cr investment. Gujarat&apos;s 50% renewable grid enables lowest green H2 cost at &#8377;180/kg &#8594; serves Morbi ceramic cluster reducing natural gas import dependence by 2,800 tonnes/yr' },
  { id: 'HBN-0004', projectId: 'HBN-B26BLR', city: 'Bengaluru', pipeline: 'GAIL Bengaluru-Chennai Pipeline', operator: 'GAIL + Karnataka STU', blendRatio: 3, pipelineLengthKm: 340, h2VolumeTPD: 35, investmentCr: 380, status: 'In Transit', priority: 'High', origin: 'GAIL Devanagonthi Terminal', destination: 'GAIL Chennai Manali', shipDate: '2026-07-26', transitDays: 3, zone: 'South', remarks: 'GAIL&apos;s Bengaluru-Chennai 340 km cross-state pipeline piloting 3% H2 blend &#8594; 35 TPH injection at Devanagonthi. First interstate H2 blending in India &#8594; &#8377;380Cr investment. Safety validated for 30 bar transmission with H2-specific compressor seals and monitoring. Serves Bengaluru&apos;s 200 CNG stations and Chennai&apos;s 150 &#8594; 2,800 tCO2/yr reduction across 2 states' },
  { id: 'HBN-0005', projectId: 'HBN-C26CHN', city: 'Chennai', pipeline: 'IGL Chennai Metro Gas Grid', operator: 'IGL + IOCL', blendRatio: 4, pipelineLengthKm: 145, h2VolumeTPD: 22, investmentCr: 175, status: 'Delivered', priority: 'High', origin: 'IGL Anna Nagar', destination: 'IOCL Manali Refinery', shipDate: '2026-07-08', transitDays: 1, zone: 'South', remarks: 'Chennai metro gas grid blending 4% H2 &#8594; 145 km pipeline serving 12 lakh PNG customers. IOCL Manali refinery supplies by-product H2 &#8594; lowest cost pathway at &#8377;80/kg. &#8377;175Cr investment &#8594; 1,800 tCO2/yr reduction. First gray-to-green transition where refinery H2 is gradually replaced by NTPC Ennore electrolytic H2 by 2028' },
  { id: 'HBN-0006', projectId: 'HBN-H26HYD', city: 'Hyderabad', pipeline: 'Bhagyanagar Gas Network', operator: 'BGL + NTPC Ramagundam', blendRatio: 5, pipelineLengthKm: 210, h2VolumeTPD: 30, investmentCr: 260, status: 'Delivered', priority: 'High', origin: 'BGL Begumpet', destination: 'NTPC Ramagundam H2', shipDate: '2026-07-14', transitDays: 2, zone: 'South', remarks: 'Hyderabad&apos;s Bhagyanagar Gas network blends 5% H2 across 210 km &#8594; serving 8 lakh domestic connections. NTPC Ramagundam supplies 30 TPD from 8 MW PEM electrolyzer &#8594; &#8377;260Cr investment. Telangana&apos;s 24/7 power grid enables consistent H2 production &#8594; 2,400 tCO2/yr reduction. Pharma cluster in Hyderabad uses H2-enriched CNG for boiler efficiency improvement' },
  { id: 'HBN-0007', projectId: 'HBN-K26KOL', city: 'Kolkata', pipeline: 'GAIL Haldia-Kolkata Pipeline', operator: 'GAIL + DVC', blendRatio: 4, pipelineLengthKm: 185, h2VolumeTPD: 25, investmentCr: 220, status: 'Delayed', priority: 'High', origin: 'GAIL Salt Lake', destination: 'DVC Mejia H2 Plant', shipDate: '2026-07-18', transitDays: 2, zone: 'East', remarks: 'Kolkata Haldia corridor H2 blending at 4% across 185 km GAIL pipeline &#8594; delayed due to monsoon-related pipeline integrity testing. DVC Mejia supplies 25 TPD from coal gasification by-product &#8594; &#8377;220Cr investment. Serves Haldia petrochemical cluster and Kolkata city gas &#8594; 2,000 tCO2/yr reduction. Delay expected resolution by August 2026 &#8594; additional &#8377;15Cr for upgraded H2-compatible seals' },
  { id: 'HBN-0008', projectId: 'HBN-P26PUN', city: 'Pune', pipeline: 'MGL Pune PCMC Network', operator: 'MGL + Thermax', blendRatio: 5, pipelineLengthKm: 125, h2VolumeTPD: 18, investmentCr: 145, status: 'Delivered', priority: 'Medium', origin: 'MGL Pimpri Depot', destination: 'Thermax Chinchwad H2', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'Pune PCMC area H2-CNG blending at 5% &#8594; 125 km pipeline serving Hinjewadi IT park and PCMC industrial zone. Thermax supplies 18 TPD from solid oxide electrolyzer at Chinchwad &#8594; &#8377;145Cr investment. Waste heat from IT data centers powers electrolysis &#8594; unique circular economy model. 1,400 tCO2/yr reduction &#8594; pilot for IT campus H2 microgrids' },
  { id: 'HBN-0009', projectId: 'HBN-J26JPR', city: 'Jaipur', pipeline: 'GAIL Jaipur Alwar Grid', operator: 'GAIL + RUVNL', blendRatio: 3, pipelineLengthKm: 110, h2VolumeTPD: 14, investmentCr: 115, status: 'In Transit', priority: 'Medium', origin: 'GAIL Jaipur Sanganer', destination: 'RUVNL Phulera Solar H2', shipDate: '2026-07-25', transitDays: 1, zone: 'North', remarks: 'Rajasthan&apos;s first H2 blending in Jaipur-Alwar 110 km CGD network &#8594; 3% blend. RUVNL Phulera solar farm powers 5 MW PEM electrolyzer &#8594; 14 TPD green H2 at &#8377;200/kg. &#8377;115Cr investment &#8594; 1,100 tCO2/yr reduction. Rajasthan&apos;s 7 GW solar capacity enables ultra-cheap green H2 &#8594; scaling to 10% blend planned by 2028 targeting &#8377;320Cr additional investment' },
  { id: 'HBN-0010', projectId: 'HBN-L26LKO', city: 'Lucknow', pipeline: 'IGL Lucknow-Kanpur Network', operator: 'IGL + UPNEDA', blendRatio: 4, pipelineLengthKm: 155, h2VolumeTPD: 20, investmentCr: 165, status: 'Delivered', priority: 'Medium', origin: 'IGL Gomti Nagar', destination: 'UPNEDA Unnao H2', shipDate: '2026-07-08', transitDays: 2, zone: 'North', remarks: 'UP&apos;s first H2-CNG blending in Lucknow-Kanpur 155 km network &#8594; 4% blend. UPNEDA Unnao solar-powered electrolyzer supplies 20 TPD &#8594; &#8377;165Cr investment. Serves 6 lakh PNG customers in Lucknow and 5 lakh in Kanpur &#8594; 1,600 tCO2/yr reduction. UP targets 500 TPD green H2 by 2028 under State Hydrogen Policy &#8594; this pipeline is anchor infrastructure' },
  { id: 'HBN-0011', projectId: 'HBN-K26KOCHI', city: 'Kochi', pipeline: 'Kerala GAIL LNG Pipeline', operator: 'GAIL + BPCL Kochi Ref', blendRatio: 5, pipelineLengthKm: 92, h2VolumeTPD: 12, investmentCr: 98, status: 'Processing', priority: 'Medium', origin: 'GAIL Kochi Irumpanam', destination: 'BPCL Kochi Refinery', shipDate: '2026-08-02', transitDays: 2, zone: 'South', remarks: 'Kerala&apos;s first H2 blending in GAIL&apos;s Kochi LNG-to-CNG pipeline &#8594; 5% blend across 92 km. BPCL Kochi refinery supplies 12 TPD process by-product H2 &#8594; &#8377;98Cr investment. Unique tropical climate resilience design &#8594; H2 sensors rated for 95% humidity and 42&#176;C ambient. 960 tCO2/yr reduction &#8594; serves Kochi port&apos;s emerging green hydrogen corridor to Colombo' },
  { id: 'HBN-0012', projectId: 'HBN-B26BBS', city: 'Bhubaneswar', pipeline: 'GAIL Paradip-Bhubaneswar', operator: 'GAIL + NTPC Talcher', blendRatio: 4, pipelineLengthKm: 140, h2VolumeTPD: 18, investmentCr: 135, status: 'In Transit', priority: 'Medium', origin: 'GAIL Bhubaneswar Patia', destination: 'NTPC Talcher H2 Plant', shipDate: '2026-07-24', transitDays: 2, zone: 'East', remarks: 'Odisha&apos;s Paradip-Bhubaneswar 140 km pipeline blending 4% H2 &#8594; NTPC Talcher&apos;s 6 MW electrolyzer supplies 18 TPD. &#8377;135Cr investment &#8594; 1,440 tCO2/yr reduction. Serves Paradip port industrial cluster and Bhubaneswar smart city network. Coal-rich Talcher basin transitions from coal gasification to green electrolysis &#8594; symbolic of India&apos;s energy transition' },
  { id: 'HBN-0013', projectId: 'HBN-V26VIZ', city: 'Visakhapatnam', pipeline: 'GAIL Vizag-Srikakulam Grid', operator: 'GAIL + HPCL Vizag Ref', blendRatio: 3, pipelineLengthKm: 105, h2VolumeTPD: 15, investmentCr: 110, status: 'Delivered', priority: 'Medium', origin: 'GAIL Vizag MVP Colony', destination: 'HPCL Vizag Refinery', shipDate: '2026-07-12', transitDays: 1, zone: 'South', remarks: 'Vizag-Srikakulam 105 km CGD network piloting 3% H2 blend &#8594; HPCL Vizag refinery supplies 15 TPD. &#8377;110Cr investment &#8594; 1,200 tCO2/yr reduction. Serves Vizag steel plant and naval dockyard &#8594; first defense establishment H2 utilization in India. Cyclone-resistant pipeline design with automatic isolation valves &#8594; tested for 250 kmph wind loads' },
  { id: 'HBN-0014', projectId: 'HBN-G26GAU', city: 'Guwahati', pipeline: 'AGCL Guwahati Gas Grid', operator: 'AGCL + ONGC Nazira', blendRatio: 3, pipelineLengthKm: 75, h2VolumeTPD: 8, investmentCr: 72, status: 'In Transit', priority: 'Medium', origin: 'AGCL Guwahati Paltan Bazar', destination: 'ONGC Nazira H2 Unit', shipDate: '2026-07-27', transitDays: 3, zone: 'East', remarks: 'Northeast India&apos;s first H2 blending in AGCL&apos;s Guwahati 75 km network &#8594; 3% blend from ONGC Nazira natural gas processing by-product. &#8377;72Cr investment &#8594; 640 tCO2/yr reduction. Serves Brahmaputra valley industries and Guwahati metro CNG buses. Gateway for future H2 pipeline from Assam&apos;s surplus hydropower &#8594; 2 GW potential at &#8377;120/kg green H2 cost' },
];

const COLORS = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#6d28d9', '#5b21b6', '#4c1d95', '#581c87'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 5 }, { value: 'Delivered', count: 5 }, { value: 'Processing', count: 2 }, { value: 'Delayed', count: 1 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 5 }, { value: 'Medium', count: 7 },
  ]},
  { label: 'Operator', key: 'operator', options: [
    { value: 'IGL + NTPC Green', count: 1 }, { value: 'MGL + GAIL', count: 1 }, { value: 'SGGL + Adani Green', count: 1 }, { value: 'GAIL + Karnataka STU', count: 1 }, { value: 'IGL + IOCL', count: 1 }, { value: 'BGL + NTPC Ramagundam', count: 1 }, { value: 'GAIL + DVC', count: 1 }, { value: 'MGL + Thermax', count: 1 }, { value: 'GAIL + RUVNL', count: 1 }, { value: 'IGL + UPNEDA', count: 1 }, { value: 'GAIL + BPCL Kochi Ref', count: 1 }, { value: 'GAIL + NTPC Talcher', count: 1 }, { value: 'GAIL + HPCL Vizag Ref', count: 1 }, { value: 'AGCL + ONGC Nazira', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 3 }, { value: 'South', count: 5 }, { value: 'West', count: 3 }, { value: 'East', count: 3 },
  ]},
];

export default function HydrogenBlendingNetworkLogisticsView() {
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
    return records.filter((r: HBNRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.city.toLowerCase().includes(searchQuery.toLowerCase()) || r.pipeline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof HBNRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalPipe = records.reduce((s, r) => s + r.pipelineLengthKm, 0);
  const totalH2 = records.reduce((s, r) => s + r.h2VolumeTPD, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const avgBlend = (records.reduce((s, r) => s + r.blendRatio, 0) / records.length).toFixed(1);

  const kpiData = [
    { label: 'Pipeline Network', value: `${totalPipe.toLocaleString()} km`, sub: 'H2-Blended Gas Network' },
    { label: 'Daily H2 Volume', value: `${totalH2} TPD`, sub: 'Green Hydrogen Injected' },
    { label: 'Avg Blend Ratio', value: `${avgBlend}%`, sub: 'H2 in Natural Gas' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'National H2 Blending Mission' },
  ];

  const cityData = useMemo(() => records.map(r => ({ city: r.city, h2: r.h2VolumeTPD, pipe: r.pipelineLengthKm })).sort((a, b) => b.h2 - a.h2), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const pipeVsH2 = useMemo(() => records.map(r => ({ city: r.city, pipe: r.pipelineLengthKm, h2: r.h2VolumeTPD })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 hbn-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'Hydrogen Blending Network' }]} />
      <PageHeader title="Hydrogen Blending Network Logistics" description="Green hydrogen injection into India&apos;s natural gas CGD pipelines for decarbonizing city gas distribution, industrial heating and transport across national pipeline corridors" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#7c3aed] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="hbn-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#7c3aed]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="hbn-chart-card"><CardHeader><CardTitle className="text-base">H2 Volume by City (TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="h2" fill="#7c3aed" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="hbn-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#7c3aed" /><Cell fill="#8b5cf6" /><Cell fill="#a78bfa" /><Cell fill="#6d28d9" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'hbn-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'H2 Blending Network Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#7c3aed] bg-violet-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.city} &#8594; {r.transitDays}d | {r.blendRatio}% blend | {r.pipelineLengthKm} km</span>
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
          <Card className="hbn-chart-card"><CardHeader><CardTitle className="text-base">Pipeline Length vs H2 Volume</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={pipeVsH2}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="pipe" stroke="#7c3aed" strokeWidth={2} name="Pipeline (km)" /><Line yAxisId="right" type="monotone" dataKey="h2" stroke="#6d28d9" strokeWidth={2} name="H2 (TPD)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="hbn-chart-card"><CardHeader><CardTitle className="text-base">Investment per TPD H2 (&#8377;Cr/TPD)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ city: r.city, invTpd: +(r.investmentCr / r.h2VolumeTPD).toFixed(1) }))}><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="invTpd" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hbn-chart-card"><CardHeader><CardTitle className="text-base">Blend Ratio by Zone (%)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, { sum: number; count: number }>, r) => { const k = r.zone; m[k] = m[k] ? { sum: m[k].sum + r.blendRatio, count: m[k].count + 1 } : { sum: r.blendRatio, count: 1 }; return m; }, {})).map(([k, v]) => ({ zone: k, blend: +(v.sum / v.count).toFixed(1) }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="blend" fill="#6d28d9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="hbn-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 5 }, { name: 'Delivered', value: 5 }, { name: 'Processing', value: 2 }, { name: 'Delayed', value: 1 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#7c3aed" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hbn-insight-card"><CardHeader><CardTitle className="text-base">Mumbai Achieves India&apos;s Highest 8% H2 Blend</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">MGL&apos;s Thane-Belapur network (HBN-0002) leads India at 8% H2 blend &#8594; 60% above the national average. GAIL&apos;s ammonia cracking at Uran terminal provides reliable 55 TPD supply. At &#8377;450Cr investment with 4,500 tCO2/yr reduction &#8594; the cost of CO2 avoided is &#8377;10,000/tonne &#8594; competitive with carbon credits at &#8377;8,500/tonne. This proves industrial CGD clusters can economically blend up to 15% H2 with existing pipeline materials.</p></CardContent></Card>
          <Card className="hbn-insight-card"><CardHeader><CardTitle className="text-base">Gujarat&apos;s Solar Advantage Delivers Cheapest Green H2</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">SGGL&apos;s Saurashtra corridor (HBN-0003) benefits from Gujarat&apos;s 50% renewable grid &#8594; green H2 at &#8377;180/kg vs national average of &#8377;250/kg. Adani Green&apos;s Mundra 30 MW electrolyzer achieves 72 kWh/kg efficiency &#8594; the best in India. This 28% cost advantage makes Gujarat the natural hub for scaling H2 blending to 15% by 2028. The Morbi ceramic cluster alone could absorb 200 TPD at full blend.</p></CardContent></Card>
          <Card className="hbn-insight-card"><CardHeader><CardTitle className="text-base">Interstate Blending: Bengaluru-Chennai Sets Precedent</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">GAIL&apos;s Bengaluru-Chennai 340 km interstate pipeline (HBN-0004) is India&apos;s first cross-state H2 blending &#8594; establishing regulatory framework for multi-state H2 injection. 35 TPD at 3% blend across Karnataka and Tamil Nadu &#8594; CO2 reduction of 2,800 tCO2/yr in 2 states simultaneously. The safety validation for 30 bar transmission with H2-specific compressor seals sets the template for all future interstate H2 pipeline projects under National Hydrogen Mission.</p></CardContent></Card>
          <Card className="hbn-insight-card"><CardHeader><CardTitle className="text-base">National H2 Blending Scale-Up Roadmap</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 2,450 km pipeline network, 352 TPD H2 volume and &#8377;2,955Cr investment across 14 cities represents India&apos;s foundation for H2 economy. National Green Hydrogen Mission targets 5% blend by 2028 &#8594; requiring 2,000 TPD across 20,000 km CGD pipeline at &#8377;25,000Cr. Current portfolio demonstrates 30% cost reduction pathway through electrolyzer scale-up and pipeline material upgrades &#8594; reaching &#8377;150/kg green H2 by 2030.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
