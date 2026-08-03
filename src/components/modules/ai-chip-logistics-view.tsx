'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface AICRecord {
  id: string;
  projectId: string;
  state: string;
  facility: string;
  company: string;
  chipType: string;
  nodeNm: number;
  waferCapacityK: number;
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

const records: AICRecord[] = [
  { id: 'AIC-0001', projectId: 'AIC-G26GJ1', state: 'Gujarat', facility: 'Tata Semiconductor Dholera', company: 'Tata Electronics + TSMC', chipType: 'AI Accelerator GPU (Custom)', nodeNm: 5, waferCapacityK: 30, investmentCr: 4200, status: 'In Transit', priority: 'Critical', origin: 'Tata Electronics Bengaluru', destination: 'Dholera SIC EPZ', shipDate: '2026-07-28', transitDays: 2, zone: 'West', remarks: 'India&apos;s flagship AI chip fab at Dholera SIC &#8594; 5nm AI accelerator GPU fab with TSMC technology transfer. &#8377;4,200Cr investment for 30,000 WSPM &#8594; producing custom AI inference chips for government and defense applications. TSMC partnership provides process know-how &#8594; first fab outside Taiwan for sub-7nm AI chips. Chips power India&apos;s national AI mission requiring 500,000 GPU equivalents by 2030 &#8594; reducing dependency on NVIDIA imports at &#8377;18,000Cr/year' },
  { id: 'AIC-0002', projectId: 'AIC-K26KA1', state: 'Karnataka', facility: 'SCL Bengaluru AI Chip Fab', company: 'SCL + Micron Technology', chipType: 'HBM Memory + AI Inference', nodeNm: 14, waferCapacityK: 50, investmentCr: 3200, status: 'Delivered', priority: 'Critical', origin: 'SCL Mohali HQ', destination: 'SCL Bengaluru AI Fab', shipDate: '2026-07-10', transitDays: 1, zone: 'South', remarks: 'SCL Bengaluru deploys 14nm AI inference and HBM memory fab &#8594; 50,000 WSPM producing AI inference chips and high-bandwidth memory. &#8377;3,200Cr investment with Micron HBM3E technology &#8594; India&apos;s first advanced memory fab. HBM stacks provide 1.2 TB/s bandwidth for AI training &#8594; critical for LLM inference at scale. Bengaluru&apos;s semiconductor ecosystem (1,500+ design companies) provides talent pipeline &#8594; SCL targets &#8377;8,000Cr annual revenue serving defense, space and enterprise AI markets' },
  { id: 'AIC-0003', projectId: 'AIC-T26TN1', state: 'Tamil Nadu', facility: 'Tata-PSMC Tirupati OSAT', company: 'Tata Electronics + PSMC', chipType: 'AI Chip Assembly + Test', nodeNm: 28, waferCapacityK: 40, investmentCr: 1850, status: 'Processing', priority: 'Critical', origin: 'Tata OSAT Chennai', destination: 'PSMC Tirupati Fab', shipDate: '2026-08-01', transitDays: 2, zone: 'South', remarks: 'Tata-PSMC Tirupati OSAT facility &#8594; 40,000 WSPM assembly and test for AI chips from global fabless companies. &#8377;1,850Cr investment &#8594; advanced packaging including 2.5D/3D chiplet stacking for AI accelerators. PSMC partnership enables flip-chip BGA and fan-out wafer-level packaging &#8594; critical for multi-chip AI modules. Tirupati OSAT reduces India&apos;s chip import dependency for AI inference &#8594; testing 200,000 AI chips/month for Qualcomm, MediaTek and indigenous designs' },
  { id: 'AIC-0004', projectId: 'AIC-M26MUM1', state: 'Maharashtra', facility: 'L&T Navi Mumbai Chip Complex', company: 'L&amp;T Semiconductor + Intel', chipType: 'Edge AI NPU + Foundry', nodeNm: 7, waferCapacityK: 20, investmentCr: 5500, status: 'Delivered', priority: 'High', origin: 'L&amp;T Mumbai HQ', destination: 'Navi Mumbai SIC', shipDate: '2026-07-08', transitDays: 1, zone: 'West', remarks: 'L&amp;T-Intel Navi Mumbai fab &#8594; 7nm edge AI NPU and foundry services at 20,000 WSPM. &#8377;5,500Cr investment is India&apos;s largest single fab &#8594; Intel technology for edge AI processors deployed in automotive, IoT and mobile. India&apos;s 1.2 billion smartphone market requires 500M AI chips/year &#8594; this fab addresses 20% of domestic demand. Navi Mumbai location leverages JNPT port for equipment imports and Mundra-Delhi fiber for data connectivity &#8594; ready for EUV lithography upgrade to 3nm' },
  { id: 'AIC-0005', projectId: 'AIC-H26HR1', state: 'Haryana', facility: 'NXP India AI Chip Design Centre', company: 'NXP Semiconductors + STMicro', chipType: 'Automotive AI SoC Design', nodeNm: 5, waferCapacityK: 0, investmentCr: 850, status: 'In Transit', priority: 'High', origin: 'NXP Bengaluru', destination: 'NXP Gurgaon Design Centre', shipDate: '2026-07-26', transitDays: 1, zone: 'North', remarks: 'NXP Gurgaon automotive AI SoC design centre &#8594; India&apos;s largest automotive chip design facility. &#8377;850Cr investment for 5nm automotive AI SoC designs serving Maruti Suzuki, Tata Motors and Mahindra. Chips power autonomous driving Level 3+ systems &#8594; processing 50 TOPS at under 15W. NXP-ST partnership develops India-specific automotive AI chips for ADAS, cabin monitoring and EV power management. Gurgaon centre employs 1,200 VLSI engineers &#8594; India&apos;s automotive chip demand at &#8377;45,000Cr/yr by 2030' },
  { id: 'AIC-0006', projectId: 'AIC-D26DL1', state: 'Delhi', facility: 'CDAC AI Chip National Lab', company: 'CDAC + ARM', chipType: 'National AI Processor VEGA', nodeNm: 28, waferCapacityK: 15, investmentCr: 650, status: 'Delivered', priority: 'High', origin: 'CDAC Pune', destination: 'CDAC Delhi AI Lab', shipDate: '2026-07-14', transitDays: 1, zone: 'North', remarks: 'CDAC Delhi deploys India&apos;s first indigenous AI processor VEGA &#8594; 28nm AI inference chip designed entirely in India. &#8377;650Cr investment &#8594; 15,000 WSPM at SCL fab producing VEGA chips for government AI applications. ARM Cortex-M55 + Ethos-U55 NPU architecture &#8594; 8 TOPS at 2W for edge deployment. VEGA powers India&apos;s national language translation AI (Bhashini) on 100,000 government kiosks &#8594; reducing NVIDIA dependency for citizen services. CDAC targets 1M VEGA chips by 2028 for e-governance and defense' },
  { id: 'AIC-0007', projectId: 'AIC-A26AHM1', state: 'Gujarat', facility: 'Synopsys Ahmedabad AI EDA Lab', company: 'Synopsys + IITGN', chipType: 'AI Chip Design Automation IP', nodeNm: 3, waferCapacityK: 0, investmentCr: 420, status: 'Delivered', priority: 'High', origin: 'Synopsys Bengaluru', destination: 'GIFT City AI EDA Centre', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'Synopsys Ahmedabad AI chip design automation lab &#8594; developing AI-powered EDA tools for 3nm and 2nm chip design. &#8377;420Cr investment &#8594; AI-based placement and routing reduces chip design time by 60% from 18 months to 7 months. IITGN partnership trains 500 VLSI engineers/year in AI-assisted chip design &#8594; critical talent pipeline for India&apos;s &#8377;76,000Cr semiconductor ecosystem. GIFT City location enables offshore EDA development &#8594; serving global fabless companies designing AI chips' },
  { id: 'AIC-0008', projectId: 'AIC-U26UP1', state: 'Uttar Pradesh', facility: 'Texas Instruments Lucknow', company: 'TI + UP Electronics', chipType: 'Analog AI Signal Processor', nodeNm: 22, waferCapacityK: 8, investmentCr: 280, status: 'In Transit', priority: 'Medium', origin: 'TI Bengaluru', destination: 'TI Lucknow Fab', shipDate: '2026-07-25', transitDays: 2, zone: 'North', remarks: 'TI Lucknow deploys 22nm analog AI signal processor fab &#8594; 8,000 WSPM producing AI-optimized analog chips for sensor fusion and edge inference. &#8377;280Cr investment &#8594; analog AI processors consume 10x less power than digital AI chips for sensor applications. UP&apos;s electronics manufacturing policy provides &#8377;200Cr subsidy &#8594; TI targets India&apos;s defense sensor market at &#8377;8,000Cr/yr. Lucknow fab also produces AI-ready power management chips &#8594; critical for EV charging, 5G base stations and solar inverter applications' },
  { id: 'AIC-0009', projectId: 'AIC-P26PUN1', state: 'Punjab', facility: 'Qualcomm Mohali AI Centre', company: 'Qualcomm + Thapar University', chipType: 'Mobile AI Snapdragon Design', nodeNm: 4, waferCapacityK: 0, investmentCr: 380, status: 'Delivered', priority: 'Medium', origin: 'Qualcomm Hyderabad', destination: 'Qualcomm Mohali Campus', shipDate: '2026-07-08', transitDays: 1, zone: 'North', remarks: 'Qualcomm Mohali AI chip design centre &#8594; designing next-generation Snapdragon AI accelerators for India&apos;s smartphone market. &#8377;380Cr investment &#8594; 4nm AI-on-mobile designs with 75 TOPS NPU for on-device LLM inference. India is world&apos;s 2nd largest smartphone market (700M+ users) &#8594; Qualcomm designs India-specific AI features (multilingual voice, camera AI). Thapar University partnership trains 200 chip design engineers/year &#8594; Mohali employs 800 VLSI designers working on Hexagon NPU architecture' },
  { id: 'AIC-0010', projectId: 'AIC-H26HYD1', state: 'Telangana', facility: 'AMD Hyderabad AI Chip Park', company: 'AMD + T-Hub', chipType: 'Data Center AI Accelerator MI300X', nodeNm: 5, waferCapacityK: 0, investmentCr: 520, status: 'Processing', priority: 'Medium', origin: 'AMD Santa Clara', destination: 'T-Hub AI Chip Park Gachibowli', shipDate: '2026-08-02', transitDays: 2, zone: 'South', remarks: 'AMD Hyderabad AI chip park &#8594; designing next-gen MI300X-class data center AI accelerators for India&apos;s cloud AI infrastructure. &#8377;520Cr investment &#8594; 5nm CDNA architecture with 192GB HBM3 memory for training LLMs up to 1T parameters. India&apos;s data center AI compute demand growing at 45% CAGR &#8594; requiring 50,000 AI accelerators by 2028 worth &#8377;35,000Cr. T-Hub ecosystem provides 200+ AI startups as early customers &#8594; AMD targets &#8377;5,000Cr annual revenue from India&apos;s AI chip market by 2030' },
  { id: 'AIC-0011', projectId: 'AIC-K26KER1', state: 'Kerala', facility: 'CDAC Kochi AI Chip Testing', company: 'CDAC + C-DOT', chipType: 'AI Chip Reliability + Security Testing', nodeNm: 3, waferCapacityK: 0, investmentCr: 95, status: 'Delivered', priority: 'Medium', origin: 'CDAC Delhi', destination: 'CDAC Kochi Test Lab', shipDate: '2026-07-12', transitDays: 2, zone: 'South', remarks: 'CDAC Kochi AI chip testing and reliability lab &#8594; India&apos;s first dedicated AI chip security testing facility. &#8377;95Cr investment &#8594; testing AI chips for hardware Trojans, side-channel attacks and AI-specific vulnerabilities. C-DOT partnership develops security testing standards for government AI chip procurement &#8594; critical for defense and communications AI systems. Kochi lab certifies all AI chips for India&apos;s 5G, UPI and Aadhaar infrastructure &#8594; testing 500 chip variants/year across defense, banking and telecom sectors' },
  { id: 'AIC-0012', projectId: 'AIC-R26RJ1', state: 'Rajasthan', facility: 'Foxconn Jaipur OSAT', company: 'Foxconn + Rajasthan State', chipType: 'AI Chip Packaging + Test', nodeNm: 14, waferCapacityK: 25, investmentCr: 1200, status: 'In Transit', priority: 'Medium', origin: 'Foxconn Chennai', destination: 'Khoskeda Electronics Hub Jaipur', shipDate: '2026-07-24', transitDays: 2, zone: 'North', remarks: 'Foxconn Jaipur OSAT facility &#8594; 25,000 WSPM advanced packaging for AI chips including 2.5D interposer and micro-bump technology. &#8377;1,200Cr investment under Rajasthan semiconductor policy &#8594; &#8377;300Cr state subsidy for employment generation. Foxconn assembles AI accelerators for NVIDIA, AMD and indigenous VEGA chips &#8594; advanced packaging enables multi-chiplet AI modules with 8 chiplets per package. Jaipur hub targets 5,000 jobs &#8594; Rajasthan&apos;s first semiconductor manufacturing facility' },
  { id: 'AIC-0013', projectId: 'AIC-O26OR1', state: 'Odisha', facility: 'Wipro Odisha AI Chip Design', company: 'Wipro + IIT Bhubaneswar', chipType: 'Enterprise AI Chiplet Design', nodeNm: 7, waferCapacityK: 0, investmentCr: 210, status: 'Delivered', priority: 'Medium', origin: 'Wipro Bengaluru', destination: 'IIT BBSR Design Centre', shipDate: '2026-07-12', transitDays: 2, zone: 'East', remarks: 'Wipro Odisha enterprise AI chiplet design centre &#8594; designing custom AI chiplets for enterprise workloads (SAP, ERP, database AI). &#8377;210Cr investment &#8594; 7nm chiplet designs for Wipro&apos;s enterprise AI platform. IIT Bhubaneswar provides VLSI talent &#8594; 150 engineers trained in chiplet architecture and die-to-die communication. Enterprise AI chiplet market at &#8377;12,000Cr globally by 2028 &#8594; Wipro targets 10% share with India-designed chiplets manufactured at Dholera and Navi Mumbai fabs' },
  { id: 'AIC-0014', projectId: 'AIC-B26BBS1', state: 'Bengal', facility: 'IIT Kharagpur AI Chip Lab', company: 'IIT KGP + DRDO', chipType: 'Defense AI ASIC + Neural Net', nodeNm: 28, waferCapacityK: 5, investmentCr: 180, status: 'Delivered', priority: 'Medium', origin: 'IIT KGP Campus', destination: 'DRDO MEMS Centre Kharagpur', shipDate: '2026-07-08', transitDays: 2, zone: 'East', remarks: 'IIT Kharagpur defense AI ASIC lab &#8594; designing India&apos;s first military-grade AI chips for autonomous weapons and signal intelligence. &#8377;180Cr investment &#8594; 28nm ASICs with neural network accelerators for DRDO missile guidance, UAV vision and radar AI. 5,000 WSPM pilot line produces prototype chips for field testing &#8594; DRDO targets 100,000 military AI chips by 2030. IIT KGP&apos;s silicon photonics expertise enables optical AI interconnects &#8594; 10x faster chip-to-chip communication for defense AI systems' },
];

const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 8 }, { value: 'Processing', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 3 }, { value: 'High', count: 4 }, { value: 'Medium', count: 7 },
  ]},
  { label: 'Chip Type', key: 'chipType', options: [
    { value: 'AI Accelerator GPU (Custom)', count: 1 }, { value: 'HBM Memory + AI Inference', count: 1 }, { value: 'AI Chip Assembly + Test', count: 1 }, { value: 'Edge AI NPU + Foundry', count: 1 }, { value: 'Automotive AI SoC Design', count: 1 }, { value: 'National AI Processor VEGA', count: 1 }, { value: 'AI Chip Design Automation IP', count: 1 }, { value: 'Analog AI Signal Processor', count: 1 }, { value: 'Mobile AI Snapdragon Design', count: 1 }, { value: 'Data Center AI Accelerator MI300X', count: 1 }, { value: 'AI Chip Reliability + Security Testing', count: 1 }, { value: 'AI Chip Packaging + Test', count: 1 }, { value: 'Enterprise AI Chiplet Design', count: 1 }, { value: 'Defense AI ASIC + Neural Net', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 5 }, { value: 'South', count: 5 }, { value: 'West', count: 4 }, { value: 'East', count: 2 },
  ]},
];

export default function AIChipLogisticsView() {
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
    return records.filter((r: AICRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.state.toLowerCase().includes(searchQuery.toLowerCase()) || r.facility.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof AICRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalWafer = records.reduce((s, r) => s + r.waferCapacityK, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const fabCount = records.filter(r => r.waferCapacityK > 0).length;
  const designCount = records.filter(r => r.waferCapacityK === 0).length;

  const kpiData = [
    { label: 'Total Wafer Capacity', value: `${totalWafer.toLocaleString()}K WSPM`, sub: 'AI Chip Fab Output' },
    { label: 'Fab Facilities', value: `${fabCount}`, sub: 'Manufacturing Plants' },
    { label: 'Design Centres', value: `${designCount}`, sub: 'R&amp;D Design Facilities' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'India Semiconductor Mission' },
  ];

  const stateData = useMemo(() => records.map(r => ({ state: r.state, inv: r.investmentCr, wafers: r.waferCapacityK })).sort((a, b) => b.inv - a.inv), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const invVsNode = useMemo(() => records.filter(r => r.waferCapacityK > 0).map(r => ({ facility: r.facility.split(' ').slice(0, 2).join(' '), inv: r.investmentCr, node: r.nodeNm })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 aic-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'AI Chip' }]} />
      <PageHeader title="AI Chip Logistics" description="India&apos;s semiconductor ecosystem for AI chip manufacturing, design and testing spanning GPU fabs, HBM memory, edge NPU, automotive SoC and defense ASIC across national semiconductor parks" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#dc2626] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="aic-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#dc2626]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="aic-chart-card"><CardHeader><CardTitle className="text-base">Investment by State (&#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={stateData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="state" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="inv" fill="#dc2626" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="aic-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#dc2626" /><Cell fill="#ef4444" /><Cell fill="#f87171" /><Cell fill="#b91c1c" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'aic-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'AI Chip Facility Registry' : 'Recent Shipments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm border-l-4 border-l-[#dc2626] bg-red-50/20`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.state} &#8594; {r.transitDays}d | {r.nodeNm}nm | {r.waferCapacityK > 0 ? `${r.waferCapacityK}K WSPM` : 'Design Centre'}</span>
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
          <Card className="aic-chart-card"><CardHeader><CardTitle className="text-base">Investment vs Process Node (Fabs Only)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={invVsNode}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="facility" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="inv" stroke="#dc2626" strokeWidth={2} name="Investment (Cr)" /><Line yAxisId="right" type="monotone" dataKey="node" stroke="#b91c1c" strokeWidth={2} name="Node (nm)" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="aic-chart-card"><CardHeader><CardTitle className="text-base">Wafer Capacity by Fab (K WSPM)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.filter(r => r.waferCapacityK > 0).map(r => ({ state: r.state, wafers: r.waferCapacityK }))}><XAxis dataKey="state" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="wafers" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="aic-chart-card"><CardHeader><CardTitle className="text-base">Investment by Zone (&#8377;Cr)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.investmentCr; return m; }, {})).map(([k, v]) => ({ zone: k, inv: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="inv" fill="#b91c1c" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="aic-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 4 }, { name: 'Delivered', value: 8 }, { name: 'Processing', value: 2 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#dc2626" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="aic-insight-card"><CardHeader><CardTitle className="text-base">Tata Dholera: India&apos;s 5nm AI Chip Flagship</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Tata Electronics Dholera (AIC-0001) is India&apos;s most strategic AI chip fab &#8594; 5nm AI accelerator GPU with TSMC technology transfer at 30,000 WSPM. &#8377;4,200Cr investment produces custom AI inference chips for government defense and citizen services &#8594; reducing India&apos;s &#8377;18,000Cr/year NVIDIA import bill by 30%. First sub-7nm fab outside Taiwan &#8594; geopolitical resilience for AI chip supply. Dholera SIC EPZ provides water, power and gas infrastructure &#8594; fab starts production Q2 2027 with 5nm GPUs scaling to 3nm by 2029.</p></CardContent></Card>
          <Card className="aic-insight-card"><CardHeader><CardTitle className="text-base">L&amp;T-Intel Navi Mumbai: India&apos;s Largest Fab</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">L&amp;T-Intel Navi Mumbai (AIC-0004) at &#8377;5,500Cr is India&apos;s largest single semiconductor fab &#8594; 7nm edge AI NPU and foundry. 20,000 WSPM produces edge AI processors for India&apos;s 1.2B smartphone market and 50M IoT device ecosystem. Intel technology enables EUV lithography upgrade path to 3nm &#8594; Navi Mumbai location leverages JNPT port and dedicated fiber connectivity. The fab serves Qualcomm, MediaTek and indigenous chip companies &#8594; targeting &#8377;12,000Cr annual revenue by 2028 with India&apos;s largest chip manufacturing workforce at 4,500 employees.</p></CardContent></Card>
          <Card className="aic-insight-card"><CardHeader><CardTitle className="text-base">CDAC VEGA: India&apos;s Indigenous AI Processor</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">CDAC Delhi&apos;s VEGA (AIC-0006) is India&apos;s first fully indigenous AI chip &#8594; 28nm AI inference processor designed and fabricated entirely in India. ARM Cortex-M55 + Ethos-U55 NPU delivers 8 TOPS at 2W for edge deployment. &#8377;650Cr investment produces 1M VEGA chips by 2028 for e-governance &#8594; powering Bhashini national language translation on 100,000 government kiosks. VEGA proves India can design competitive AI silicon &#8594; cost 40% below NVIDIA equivalents with comparable inference performance for government workloads.</p></CardContent></Card>
          <Card className="aic-insight-card"><CardHeader><CardTitle className="text-base">India AI Chip Mission: &#8377;76,000Cr Ecosystem Target</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 168K WSPM fab capacity + 8 design centres at &#8377;19,935Cr demonstrates India&apos;s AI chip manufacturing readiness. India Semiconductor Mission targets &#8377;76,000Cr ecosystem by 2030 &#8594; 3 fabs + 20 design houses + 10 OSATs. India&apos;s AI compute demand at 50,000 GPU equivalents by 2030 (&#8377;45,000Cr) creates &#8377;3.5 lakh crore annual AI chip market opportunity. Current portfolio addresses 15% of demand &#8594; scaling to 500K WSPM by 2030 would achieve 80% self-reliance in AI chips &#8594; transforming India from chip importer to net exporter.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
