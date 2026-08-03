'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar';
import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface EBSRecord {
  id: string;
  projectId: string;
  city: string;
  station: string;
  operator: string;
  batteryType: string;
  swapCapacity: number;
  dailySwaps: number;
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

const records: EBSRecord[] = [
  { id: 'EBS-0001', projectId: 'EBS-D26DL1', city: 'Delhi', station: 'BatterySwap Hub Connaught Place', operator: 'Sun Mobility', batteryType: 'LFP 30kWh Swappable Pack', swapCapacity: 480, dailySwaps: 312, investmentCr: 85, status: 'In Transit', priority: 'Critical', origin: 'Sun Mobility HQ Bengaluru', destination: 'Connaught Place Station Delhi', shipDate: '2026-07-28', transitDays: 2, zone: 'North', remarks: 'Sun Mobility Connaught Place &#8594; India&apos;s largest battery swap station at 480 swaps/day capacity for 2-wheelers and 3-wheelers. LFP 30kWh swappable packs deployed with 5-minute automated swap &#8594; serving 312 daily swaps for last-mile delivery fleet. &#8377;85Cr investment includes 6 robotic swap arms, 120 battery inventory, 50 kW solar canopy. Delhi NCR has 85,000 EV 2-wheelers needing fast turnaround &#8594; swap model eliminates 3-hour charging downtime for gig workers' },
  { id: 'EBS-0002', projectId: 'EBS-M26MUM1', city: 'Mumbai', station: 'BSES BatterySwap Andheri East', operator: 'Tata Power', batteryType: 'NMC 40kWh Swappable Pack', swapCapacity: 360, dailySwaps: 245, investmentCr: 72, status: 'Delivered', priority: 'Critical', origin: 'Tata Power HQ Mumbai', destination: 'Andheri East Station Mumbai', shipDate: '2026-07-10', transitDays: 1, zone: 'West', remarks: 'Tata Power Andheri &#8594; Mumbai&apos;s first integrated battery swap + charging hub at 360 swaps/day for electric 3-wheelers and delivery vans. NMC 40kWh packs with 200 km range per swap &#8594; 5-minute automated exchange via conveyor system. &#8377;72Cr investment covers 4 swap lanes, 96 battery slots, and 100 kW grid-tied storage. Mumbai&apos;s 52,000 EV 3-wheelers and Swiggy/Zomato fleet create 245 daily swaps &#8594; payback period 2.8 years at &#8377;18/swap tariff' },
  { id: 'EBS-0003', projectId: 'EBS-B26BLR1', city: 'Bengaluru', station: 'NMG BatterySwap Koramangala', operator: 'Nexgen Mobility', batteryType: 'LFP 25kWh Swappable Pack', swapCapacity: 300, dailySwaps: 198, investmentCr: 55, status: 'Processing', priority: 'High', origin: 'Nexgen Mobility Factory Pune', destination: 'Koramangala Station Bengaluru', shipDate: '2026-08-01', transitDays: 2, zone: 'South', remarks: 'Nexgen Mobility Koramangala &#8594; Bengaluru&apos;s high-tech battery swap station with AI-driven predictive battery management. LFP 25kWh packs with 3-minute ultra-fast swap using magnetic locking &#8594; 300 capacity serving tech park delivery ecosystem. &#8377;55Cr investment includes IoT-enabled BMS, cloud fleet analytics, and 40 kW rooftop solar. Bengaluru&apos;s 68,000 EV 2-wheelers and Amazon/Dunzo/Zepto fleets generate 198 daily swaps &#8594; station achieves 98.5% uptime with predictive maintenance' },
  { id: 'EBS-0004', projectId: 'EBS-C26CHN1', city: 'Chennai', station: 'TNEB BatterySwap Guindy', operator: 'ChargeZone', batteryType: 'LFP 35kWh Swappable Pack', swapCapacity: 240, dailySwaps: 156, investmentCr: 42, status: 'Delivered', priority: 'High', origin: 'ChargeZone HQ Hyderabad', destination: 'Guindy Industrial Station', shipDate: '2026-07-08', transitDays: 1, zone: 'South', remarks: 'ChargeZone Guindy &#8594; Chennai&apos;s industrial battery swap hub serving auto rickshaw fleet and factory worker commute. LFP 35kWh packs rated for 5,000 cycles with 180 km range &#8594; 240 swaps/day capacity. &#8377;42Cr investment with TANGEDCO grid connection and 30 kW solar rooftop. Chennai&apos;s 35,000 EV 3-wheelers and 12,000 electric autos create strong demand &#8594; 156 daily swaps at &#8377;22/swap generate &#8377;1.25Cr annual revenue per station' },
  { id: 'EBS-0005', projectId: 'EBS-H26HYD1', city: 'Hyderabad', station: 'TSGENCO BatterySwap HITEC City', operator: 'Ample', batteryType: 'NMC 50kWh Swappable Pack', swapCapacity: 420, dailySwaps: 285, investmentCr: 95, status: 'In Transit', priority: 'High', origin: 'Ample Asia HQ Singapore', destination: 'HITEC City Station Hyderabad', shipDate: '2026-07-26', transitDays: 3, zone: 'South', remarks: 'Ample HITEC City &#8594; India&apos;s first autonomous battery swap station for electric 4-wheelers and ride-hailing fleet. NMC 50kWh modular packs with 10-minute automated swap for sedan and SUV platforms &#8594; 420 capacity. &#8377;95Cr investment includes robotics, AI fleet scheduling, and 200 kW battery storage. Hyderabad&apos;s Ola/Uber EV fleet (12,000 vehicles) drives 285 daily swaps &#8594; Ample&apos;s modular design supports 5 vehicle platforms at single station. Telangana EV policy targets 100,000 battery swaps/day by 2028' },
  { id: 'EBS-0006', projectId: 'EBS-K26KOL1', city: 'Kolkata', station: 'WBSED BatterySwap Salt Lake', operator: 'Sun Mobility', batteryType: 'LFP 28kWh Swappable Pack', swapCapacity: 200, dailySwaps: 128, investmentCr: 38, status: 'Delivered', priority: 'High', origin: 'Sun Mobility Plant Kolkata', destination: 'Salt Lake Station', shipDate: '2026-07-14', transitDays: 1, zone: 'East', remarks: 'Sun Mobility Salt Lake &#8594; Kolkata&apos;s first battery swap station in IT hub Salt Lake serving 2-wheeler and 3-wheeler fleet. LFP 28kWh packs with 160 km range and 3,500 cycle life &#8594; 200 capacity. &#8377;38Cr investment with CESC grid and 25 kW solar. Kolkata&apos;s 28,000 EV 2-wheelers including food delivery fleet &#8594; 128 daily swaps. Station&apos;s modular design enables expansion to 400 capacity by Q2 2027 &#8594; West Bengal EV policy subsidises &#8377;5,000 per swap station installation' },
  { id: 'EBS-0007', projectId: 'EBS-A26AHD1', city: 'Ahmedabad', station: 'Torrent BatterySwap SG Highway', operator: 'Tata Power', batteryType: 'LFP 32kWh Swappable Pack', swapCapacity: 280, dailySwaps: 178, investmentCr: 52, status: 'Delivered', priority: 'Medium', origin: 'Tata Power Plant Gandhinagar', destination: 'SG Highway Station', shipDate: '2026-07-12', transitDays: 1, zone: 'West', remarks: 'Tata Power SG Highway &#8594; Ahmedabad&apos;s highway corridor battery swap station for inter-city EV logistics. LFP 32kWh packs supporting 2-wheeler, 3-wheeler, and light commercial vehicle swaps &#8594; 280 capacity. &#8377;52Cr investment with Torrent Power grid and 35 kW solar canopy. Ahmedabad-Rajkot-Ahmedabad EV logistics corridor drives 178 daily swaps &#8594; Gujarat&apos;s 45,000 EV 3-wheelers create dense demand. Tata Power targets 50 swap stations across Gujarat by 2027 &#8594; network enables 500 km EV range with swapping' },
  { id: 'EBS-0008', projectId: 'EBS-P26PNQ1', city: 'Pune', station: 'MSED BatterySwap Hinjewadi', operator: 'ChargeZone', batteryType: 'NMC 38kWh Swappable Pack', swapCapacity: 320, dailySwaps: 215, investmentCr: 62, status: 'In Transit', priority: 'Medium', origin: 'ChargeZone Plant Nashik', destination: 'Hinjewadi Tech Park Station', shipDate: '2026-07-25', transitDays: 1, zone: 'West', remarks: 'ChargeZone Hinjewadi &#8594; Pune&apos;s tech park battery swap hub serving IT corridor commute and delivery fleet. NMC 38kWh packs with 220 km range and fast 4-minute swap &#8594; 320 capacity. &#8377;62Cr investment with MSEDCL grid and 40 kW rooftop solar. Pune&apos;s 42,000 EV 2-wheelers and Hinjewadi tech park workforce drive 215 daily swaps &#8594; station integrates with Ola Electric and Ather swap-compatible batteries. ChargeZone&apos;s cloud platform manages battery health across 200+ swap stations in Maharashtra' },
  { id: 'EBS-0009', projectId: 'EBS-J26JPR1', city: 'Jaipur', station: 'JEN BatterySwap Mansarovar', operator: 'Rajasthan EV', batteryType: 'LFP 26kWh Swappable Pack', swapCapacity: 180, dailySwaps: 112, investmentCr: 32, status: 'Delivered', priority: 'Medium', origin: 'Rajasthan EV Depot Jaipur', destination: 'Mansarovar Station', shipDate: '2026-07-08', transitDays: 1, zone: 'North', remarks: 'Rajasthan EV Mansarovar &#8594; Jaipur&apos;s first battery swap station for 2-wheeler fleet and delivery ecosystem. LFP 26kWh packs rated for desert conditions (50&#176;C ambient) with 4,000 cycle life &#8594; 180 capacity. &#8377;32Cr investment with JVVNL grid and 20 kW solar. Jaipur&apos;s 22,000 EV 2-wheelers and growing e-rickshaw fleet drive 112 daily swaps &#8594; station heat-resistant design maintains battery performance in Rajasthan&apos;s extreme climate. Rajasthan targets 500,000 EVs by 2027 &#8594; swap infrastructure is critical for charging-sparse rural highways' },
  { id: 'EBS-0010', projectId: 'EBS-L26LKO1', city: 'Lucknow', station: 'UPPCL BatterySwap Gomti Nagar', operator: 'Nexgen Mobility', batteryType: 'LFP 30kWh Swappable Pack', swapCapacity: 220, dailySwaps: 142, investmentCr: 40, status: 'Delivered', priority: 'Medium', origin: 'Nexgen Plant Greater Noida', destination: 'Gomti Nagar Station', shipDate: '2026-07-12', transitDays: 1, zone: 'North', remarks: 'Nexgen Mobility Gomti Nagar &#8594; Lucknow&apos;s premium battery swap station in UP capital&apos;s IT corridor. LFP 30kWh packs with 170 km range for 2-wheeler and 3-wheeler fleet &#8594; 220 capacity. &#8377;40Cr investment with UPPCL grid and 28 kW rooftop solar. Lucknow&apos;s 30,000 EV 2-wheelers and government EV fleet &#8594; 142 daily swaps. UP EV policy 2026 mandates swap infrastructure at all bus depots and IT parks &#8594; station serves as template for 50 UP cities. Nexgen&apos;s cloud analytics optimise battery rotation across Lucknow-Kanpur-Agra corridor' },
  { id: 'EBS-0011', projectId: 'EBS-G26GAU1', city: 'Guwahati', station: 'APDCL BatterySwap Paltan Bazaar', operator: 'Sun Mobility', batteryType: 'LFP 24kWh Swappable Pack', swapCapacity: 120, dailySwaps: 68, investmentCr: 22, status: 'Processing', priority: 'Medium', origin: 'Sun Mobility Kolkata Hub', destination: 'Paltan Bazaar Station', shipDate: '2026-08-02', transitDays: 4, zone: 'East', remarks: 'Sun Mobility Paltan Bazaar &#8594; Northeast India&apos;s first battery swap station in Guwahati serving inter-city logistics. LFP 24kWh packs with monsoon-resistant design and 140 km range &#8594; 120 capacity. &#8377;22Cr investment with APDCL grid and 15 kW solar. Guwahati&apos;s 8,000 EV 2-wheelers and 3,000 e-rickshaws &#8594; 68 daily swaps. Station enables Assam&apos;s EV mission for 100,000 electric 2-wheelers by 2028 &#8594; swap model critical for rural highways with sparse charging. Northeast&apos;s first step towards sustainable battery-as-a-service ecosystem' },
  { id: 'EBS-0012', projectId: 'EBS-K26KOC1', city: 'Kochi', station: 'KSEB BatterySwap Edappally', operator: 'ChargeZone', batteryType: 'LFP 28kWh Swappable Pack', swapCapacity: 160, dailySwaps: 95, investmentCr: 30, status: 'Delivered', priority: 'Medium', origin: 'ChargeZone Cochin Depot', destination: 'Edappally NH Junction Station', shipDate: '2026-07-08', transitDays: 1, zone: 'South', remarks: 'ChargeZone Edappally &#8594; Kochi&apos;s NH corridor battery swap station at Edappally junction serving Kerala&apos;s EV logistics fleet. LFP 28kWh packs with 150 km range and humidity-resistant design &#8594; 160 capacity. &#8377;30Cr investment with KSEB grid and 22 kW rooftop solar. Kochi&apos;s 15,000 EV 2-wheelers and waterway-connected logistics &#8594; 95 daily swaps. Station supports Kerala&apos;s 100% electric auto-rickshaw mandate by 2028 &#8594; 2,300 Kochi autos converting to battery swap model. ChargeZone integrates with Kerala Water Authority for waterfront swap access' },
  { id: 'EBS-0013', projectId: 'EBS-I26IND1', city: 'Indore', station: 'MPMKVVCL BatterySwap Vijay Nagar', operator: 'Tata Power', batteryType: 'LFP 30kWh Swappable Pack', swapCapacity: 200, dailySwaps: 125, investmentCr: 36, status: 'In Transit', priority: 'Medium', origin: 'Tata Power Bhopal Depot', destination: 'Vijay Nagar Station Indore', shipDate: '2026-07-24', transitDays: 2, zone: 'North', remarks: 'Tata Power Vijay Nagar &#8594; Indore&apos;s commercial hub battery swap station serving MP&apos;s cleanest city EV fleet. LFP 30kWh packs with 170 km range and smart BMS &#8594; 200 capacity. &#8377;36Cr investment with MPMKVVCL grid and 25 kW solar. Indore&apos;s 18,000 EV 2-wheelers &#8594; 125 daily swaps. Station is first of Tata Power&apos;s 20-station MP network &#8594; Indore-Bhopal corridor enables 300 km inter-city EV range. Indore ranked India&apos;s cleanest city for 7 years &#8594; swap infrastructure aligns with city&apos;s zero-emission transport vision' },
  { id: 'EBS-0014', projectId: 'EBS-V26VIZ1', city: 'Visakhapatnam', station: 'APSPDCL BatterySwap Dwaraka Nagar', operator: 'Nexgen Mobility', batteryType: 'NMC 45kWh Swappable Pack', swapCapacity: 260, dailySwaps: 168, investmentCr: 48, status: 'Delivered', priority: 'Medium', origin: 'Nexgen Plant Chennai', destination: 'Dwaraka Nagar Station Vizag', shipDate: '2026-07-12', transitDays: 2, zone: 'South', remarks: 'Nexgen Mobility Dwaraka Nagar &#8594; Vizag&apos;s port-city battery swap hub serving industrial EV fleet and fishing community. NMC 45kWh packs with 250 km range for light trucks and fishing vessel auxiliaries &#8594; 260 capacity. &#8377;48Cr investment with APSPDCL grid and 35 kW coastal wind-solar hybrid. Vizag&apos;s 20,000 EV 2-wheelers and port logistics fleet &#8594; 168 daily swaps. Station unique in serving fishing boat battery needs &#8594; dual swap system for road and marine EVs. AP&apos;s Vizag-Chennai industrial corridor targets 500 km EV logistics range by 2028' },
];

const COLORS = ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#155e75', '#164e63', '#083344', '#0e7490'];

const filterGroups = [
  { label: 'Status', key: 'status', options: [
    { value: 'In Transit', count: 4 }, { value: 'Delivered', count: 7 }, { value: 'Processing', count: 2 },
  ]},
  { label: 'Priority', key: 'priority', options: [
    { value: 'Critical', count: 2 }, { value: 'High', count: 4 }, { value: 'Medium', count: 8 },
  ]},
  { label: 'Battery Type', key: 'batteryType', options: [
    { value: 'LFP 30kWh Swappable Pack', count: 3 }, { value: 'NMC 40kWh Swappable Pack', count: 1 }, { value: 'LFP 25kWh Swappable Pack', count: 1 }, { value: 'LFP 35kWh Swappable Pack', count: 1 }, { value: 'NMC 50kWh Swappable Pack', count: 1 }, { value: 'LFP 28kWh Swappable Pack', count: 2 }, { value: 'LFP 32kWh Swappable Pack', count: 1 }, { value: 'NMC 38kWh Swappable Pack', count: 1 }, { value: 'LFP 26kWh Swappable Pack', count: 1 }, { value: 'LFP 24kWh Swappable Pack', count: 1 }, { value: 'NMC 45kWh Swappable Pack', count: 1 },
  ]},
  { label: 'Zone', key: 'zone', options: [
    { value: 'North', count: 4 }, { value: 'South', count: 5 }, { value: 'West', count: 3 }, { value: 'East', count: 3 },
  ]},
];

export default function EVBatterySwappingView() {
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
    return records.filter((r: EBSRecord) => {
      const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.city.toLowerCase().includes(searchQuery.toLowerCase()) || r.station.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilters = Object.entries(activeFilters).every(([key, vals]) => vals.length === 0 || vals.includes(String(r[key as keyof EBSRecord])));
      return matchSearch && matchFilters;
    });
  }, [searchQuery, activeFilters]);

  const totalSwapCap = records.reduce((s, r) => s + r.swapCapacity, 0);
  const totalInv = records.reduce((s, r) => s + r.investmentCr, 0);
  const totalDailySwaps = records.reduce((s, r) => s + r.dailySwaps, 0);
  const avgUtil = Math.round((totalDailySwaps / totalSwapCap) * 100);

  const kpiData = [
    { label: 'Total Swap Capacity', value: `${totalSwapCap.toLocaleString()}/day`, sub: 'Automated Battery Exchange' },
    { label: 'Daily Swap Volume', value: `${totalDailySwaps.toLocaleString()}`, sub: `Avg ${avgUtil}% Utilization` },
    { label: 'Station Network', value: '14 Cities', sub: 'Pan-India Swap Coverage' },
    { label: 'Total Investment', value: `&#8377;${totalInv.toLocaleString()}Cr`, sub: 'Battery Swap Infrastructure' },
  ];

  const cityData = useMemo(() => records.map(r => ({ city: r.city, swaps: r.dailySwaps, cap: r.swapCapacity })).sort((a, b) => b.swaps - a.swaps), []);
  const zonePie = useMemo(() => {
    const m: Record<string, number> = {};
    records.forEach(r => { m[r.zone] = (m[r.zone] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, []);
  const capVsSwaps = useMemo(() => records.map(r => ({ city: r.city, cap: r.swapCapacity, swaps: r.dailySwaps })), []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'registry' as const, label: 'Registry' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'insights' as const, label: 'Insights' },
  ];

  return (
    <div className="space-y-4 ebs-logistics-view">
      <ModuleBreadcrumb items={[{ label: 'Operations' }, { label: 'EV Battery Swap' }]} />
      <PageHeader title="EV Battery Swapping Logistics" description="Automated battery exchange infrastructure for electric 2-wheelers, 3-wheelers and 4-wheelers across India with LFP and NMC swappable packs, AI-driven fleet management and solar-powered swap stations" />

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-[#0891b2] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <Card key={i} className="ebs-kpi-card">
                <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{kpi.label}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-[#0891b2]" dangerouslySetInnerHTML={{ __html: kpi.value }} /><p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="ebs-chart-card"><CardHeader><CardTitle className="text-base">Daily Swaps by City</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={cityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="swaps" fill="#0891b2" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card className="ebs-chart-card"><CardHeader><CardTitle className="text-base">Zone Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={zonePie} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}><Cell fill="#0891b2" /><Cell fill="#06b6d4" /><Cell fill="#22d3ee" /><Cell fill="#155e75" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </div>
        </div>
      )}

      {(activeTab === 'registry' || activeTab === 'dashboard') && (
        <Card className={activeTab === 'dashboard' ? '' : 'ebs-chart-card'}>
          <CardHeader><CardTitle className="text-base">{activeTab === 'registry' ? 'Battery Swap Station Registry' : 'Recent Deployments'}</CardTitle></CardHeader>
          <CardContent>
            <SearchFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} onClearSearch={() => setSearchQuery('')} filterGroups={filterGroups} activeFilters={activeFilters} onToggleFilter={toggleFilter} onClearAllFilters={clearAllFilters} totalItems={records.length} filteredCount={filteredRecords.length} />
            <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
              {(activeTab === 'dashboard' ? filteredRecords.slice(0, 5) : filteredRecords).map((r) => (
                <div key={r.id} className={`p-3 rounded-lg border text-sm ${r.status === 'Delayed' ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-l-4 border-l-[#0891b2] bg-cyan-50/20'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2"><span className="font-mono font-medium">{r.id}</span><Badge variant={r.priority === 'Critical' ? 'destructive' : 'secondary'}>{r.priority}</Badge><Badge variant="outline">{r.status}</Badge></div>
                    <span className="text-xs text-muted-foreground">{r.city} &#8594; {r.transitDays}d | {r.swapCapacity} cap | {r.dailySwaps} swaps/day</span>
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
          <Card className="ebs-chart-card"><CardHeader><CardTitle className="text-base">Capacity vs Daily Swaps</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={capVsSwaps}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="city" tick={{ fontSize: 9 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" type="monotone" dataKey="cap" stroke="#0891b2" strokeWidth={2} name="Capacity (swaps/day)" /><Line yAxisId="right" type="monotone" dataKey="swaps" stroke="#155e75" strokeWidth={2} name="Daily Swaps" /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card className="ebs-chart-card"><CardHeader><CardTitle className="text-base">Investment per Swap Capacity (&#8377;Cr per 100/day)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={records.map(r => ({ city: r.city, invPerCap: +((r.investmentCr / r.swapCapacity) * 100).toFixed(1) }))}><XAxis dataKey="city" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="invPerCap" fill="#06b6d4" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ebs-chart-card"><CardHeader><CardTitle className="text-base">Total Swaps by Zone (per day)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={Object.entries(records.reduce((m: Record<string, number>, r) => { m[r.zone] = (m[r.zone] || 0) + r.dailySwaps; return m; }, {})).map(([k, v]) => ({ zone: k, swaps: v }))}><XAxis dataKey="zone" /><YAxis /><Tooltip /><Bar dataKey="swaps" fill="#155e75" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
          <Card className="ebs-chart-card"><CardHeader><CardTitle className="text-base">Status Overview</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={[{ name: 'In Transit', value: 4 }, { name: 'Delivered', value: 7 }, { name: 'Processing', value: 2 }]} cx="50%" cy="50%" outerRadius={90} dataKey="value" label><Cell fill="#0891b2" /><Cell fill="#22c55e" /><Cell fill="#f59e0b" /></Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="ebs-insight-card"><CardHeader><CardTitle className="text-base">Ample HITEC City: India&apos;s First 4-Wheeler Swap</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Ample HITEC City (EBS-0005) deploys India&apos;s first autonomous battery swap for electric 4-wheelers &#8594; NMC 50kWh modular packs with 10-minute fully automated exchange for sedans and SUVs. &#8377;95Cr investment supports 5 vehicle platforms at a single station &#8594; 420 swaps/day capacity serving Ola and Uber EV fleet of 12,000 vehicles in Hyderabad. Ample&apos;s modular battery architecture allows station-level inventory sharing across vehicle types &#8594; reducing infrastructure cost by 60% vs dedicated fast chargers. Telangana EV policy targets 100,000 daily swaps by 2028.</p></CardContent></Card>
          <Card className="ebs-insight-card"><CardHeader><CardTitle className="text-base">LFP vs NMC: Chemistry Wars in Battery Swap</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio shows LFP dominating with 10 of 14 stations choosing iron phosphate chemistry &#8594; LFP&apos;s 5,000+ cycle life and &#8377;800/kWh cost makes it ideal for high-frequency swap operations. NMC chosen only for premium segments: Tata Power Mumbai 4-wheeler (NMC 40kWh), Ample Hyderabad sedan/SUV (NMC 50kWh), ChargeZone Pune tech fleet (NMC 38kWh), and Nexgen Vizag port trucks (NMC 45kWh). LFP achieves 4.5-year ROI vs NMC&apos;s 3.8-year &#8594; but NMC&apos;s higher energy density enables lighter packs and longer range per swap.</p></CardContent></Card>
          <Card className="ebs-insight-card"><CardHeader><CardTitle className="text-base">Solar-Powered Swap: 60% Renewable Energy Target</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">11 of 14 swap stations integrate rooftop solar ranging from 15 kW (Guwahati) to 50 kW (Delhi Connaught Place) &#8594; average solar capacity of 31 kW per station generates 45,000 kWh annually. Combined 344 kW solar across portfolio offsets 38% of grid electricity &#8594; target 60% renewable by 2028 with grid-scale battery storage. Tata Power Mumbai and Delhi lead with 100 kW grid-tied storage enabling peak shaving and demand response. India&apos;s 300+ sunny days/year make solar-powered swap stations 40% cheaper to operate than grid-only in most cities.</p></CardContent></Card>
          <Card className="ebs-insight-card"><CardHeader><CardTitle className="text-base">India Battery Swap Market: &#8377;18,500Cr by 2030</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Portfolio of 14 stations at 3,830/day capacity and &#8377;669Cr investment demonstrates average 2,327 daily swaps at 65% utilization &#8594; annual revenue of &#8377;169Cr at &#8377;20/swap. India&apos;s 500,000 daily swap demand by 2030 (FAME III + state policies) requires 30,000 stations at &#8377;40Cr each &#8594; &#8377;18,500Cr total investment. Battery-as-a-Service (BaaS) model reduces EV purchase price by 30% &#8594; making electric 2-wheelers cost-parity with ICE from day one. Sun Mobility, Tata Power, ChargeZone and Ample competing for India&apos;s &#8377;45,000Cr annual swap revenue by 2030.</p></CardContent></Card>
        </div>
      )}
    </div>
  );
}
