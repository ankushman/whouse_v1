'use client';
import { useState, useMemo } from 'react';
import { Fingerprint } from 'lucide-react';

const SCO_RECORDS = [
  ['SCO-A2401', 'SCO-2024-B001', 'Hyderabad', 'MIDHANI', 'Sc2O3 99.99% Aerospace Alloy', 'Al-Li-Sc aerospace structural', '99.99%', 'density 3.86 g/cm3', '&#8377;960 Cr', 'In Transit', 'Critical', 'Mumbai', 'Hyderabad', '2024-03-15', '10', 'Central', 'ISRO GSLV Mk-III tank dome'],
  ['SCO-A2402', 'SCO-2024-B002', 'Bengaluru', 'DRDO DMRL', 'Sc2O3 99.9% Fighter Jet Panel', 'Al-Mg-Sc fighter fuselage skin', '99.9%', 'yield 380 MPa', '&#8377;940 Cr', 'Delivered', 'High', 'Chennai', 'Bengaluru', '2024-03-10', '7', 'South', 'Tejas Mk2 wing panel batch'],
  ['SCO-A2403', 'SCO-2024-B003', 'Mumbai', 'Tata Chemicals', 'Sc2O3 99.7% Baseball Bat', 'Al-Sc high-performance bat', '99.7%', 'density 2.78 g/cm3', '&#8377;720 Cr', 'Processing', 'Medium', 'Kolkata', 'Mumbai', '2024-03-20', '6', 'West', 'Tata sports equipment alloy'],
  ['SCO-A2404', 'SCO-2024-B004', 'Chennai', 'Bharat Forge', 'Sc2O3 99.5% Bicycle Frame', 'Al-Sc lightweight bicycle', '99.5%', 'tensile 420 MPa', '&#8377;700 Cr', 'In Transit', 'Medium', 'Delhi', 'Chennai', '2024-03-18', '9', 'South', 'Premium cycle frame export'],
  ['SCO-A2405', 'SCO-2024-B005', 'Delhi', 'Shyam Chemicals', 'Sc2O3 99.3% Solid Oxide Fuel Cell', 'ScSZ electrolyte membrane', '99.3%', 'ionic cond 0.1 S/cm', '&#8377;880 Cr', 'Stored', 'Low', 'Jaipur', 'Delhi', '2024-02-28', '4', 'North', 'SOFC fuel cell stack'],
  ['SCO-A2406', 'SCO-2024-B006', 'Kolkata', 'BHEL R&amp;D', 'Sc2O3 99.8% Laser Crystal', 'Sc-doped GGG substrate', '99.8%', 'lattice 12.38 A', '&#8377;900 Cr', 'In Transit', 'High', 'Vishakhapatnam', 'Kolkata', '2024-03-22', '12', 'East', 'BHEL laser diode substrate'],
  ['SCO-A2407', 'SCO-2024-B007', 'Jaipur', 'Godrej Chemicals', 'Sc2O3 99.0% Metal Halide Lamp', 'ScI3 lamp arc tube', '99.0%', 'CRI 96', '&#8377;680 Cr', 'Stored', 'Low', 'Mumbai', 'Jaipur', '2024-02-25', '5', 'West', 'Studio lighting lamp batch'],
  ['SCO-A2408', 'SCO-2024-B008', 'Ahmedabad', 'Rajasthan Chemicals', 'Sc2O3 98.5% Ceramic Capacitor', 'Sc-doped BaTiO3 KPM', '98.5%', 'K 3500 dielectric', '&#8377;860 Cr', 'In Transit', 'Medium', 'Jodhpur', 'Ahmedabad', '2024-03-25', '7', 'West', 'MLCC multilayer capacitor'],
  ['SCO-A2409', 'SCO-2024-B009', 'Guwahati', 'Assam Chemicals', 'Sc2O3 99.6% Optical Glass', 'High-refractive lens glass', '99.6%', 'n 1.88 RI', '&#8377;880 Cr', 'Processing', 'Medium', 'Dibrugarh', 'Guwahati', '2024-03-12', '3', 'East', 'Camera lens glass batch'],
  ['SCO-A2410', 'SCO-2024-B010', 'Lucknow', 'UP Chemicals', 'Sc2O3 99.95% Submarine Hull', 'Al-Mg-Sc submarine pressure hull', '99.95%', 'yield 450 MPa', '&#8377;960 Cr', 'In Transit', 'Critical', 'Vishakhapatnam', 'Lucknow', '2024-03-28', '10', 'North', 'IN Navy submarine hull alloy'],
  ['SCO-A2411', 'SCO-2024-B011', 'Pune', 'Gujarat Chemicals', 'Sc2O3 99.2% Welding Wire', 'Al-Sc filler wire 5356', '99.2%', 'fluidity 98%', '&#8377;820 Cr', 'Stored', 'Medium', 'Surat', 'Pune', '2024-03-05', '4', 'West', 'Aerospace weld wire stock'],
  ['SCO-A2412', 'SCO-2024-B012', 'Vishakhapatnam', 'Vizag Chemicals', 'Sc2O3 99.8% Warship Superstructure', 'Al-Sc naval superstructure', '99.8%', 'yield 400 MPa', '&#8377;960 Cr', 'Delayed', 'Critical', 'Chennai', 'Vishakhapatnam', '2024-02-15', '28', 'South', 'Monsoon delay naval depot'],
  ['SCO-A2413', 'SCO-2024-B013', 'Bhubaneswar', 'DRDO TBRL', 'Sc2O3 99.4% Missile Airframe', 'Al-Li-Sc missile body tube', '99.4%', 'density 2.64 g/cm3', '&#8377;940 Cr', 'In Transit', 'High', 'Balasore', 'Bhubaneswar', '2024-03-30', '2', 'East', 'DRDO Astra missile airframe'],
  ['SCO-A2414', 'SCO-2024-B014', 'Rourkela', 'SAIL Chemicals', 'Sc2O3 97% General Chemical', 'Industrial grain refiner', '97.0%', 'Al grain 15um', '&#8377;640 Cr', 'Stored', 'Low', 'Ranchi', 'Rourkela', '2024-02-20', '3', 'East', 'SAIL aluminum grain refiner']
];

export default function ScandiumOxideLogisticsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  const filtered = useMemo(() => {
    return SCO_RECORDS.filter(r => {
      const match = r[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
        r[2].toLowerCase().includes(searchTerm.toLowerCase()) ||
        r[3].toLowerCase().includes(searchTerm.toLowerCase()) ||
        r[4].toLowerCase().includes(searchTerm.toLowerCase());
      const sMatch = statusFilter === 'all' || r[10] === statusFilter;
      return match && sMatch;
    });
  }, [searchTerm, statusFilter]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const invest = filtered.reduce((s, r) => s + Number(String(r[8]).replace(/[^0-9.]/g, '') || 0), 0);
    const delayed = filtered.filter(r => r[10] === 'delayed').length;
    const avgPurity = filtered.reduce((s, r) => s + parseFloat(String(r[5]).replace('%', '')), 0) / (total || 1);
    return { total, invest: (invest / 100).toFixed(1), delayed, avgPurity: avgPurity.toFixed(2) };
  }, [filtered]);

  const statusColor = (s) => {
    if (s === 'in-transit') return 'bg-blue-500/20 text-blue-400';
    if (s === 'delivered') return 'bg-green-500/20 text-green-400';
    if (s === 'delayed') return 'bg-red-500/20 text-red-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const priorityColor = (p) => {
    if (p === 'critical') return 'bg-red-500/20 text-red-400';
    if (p === 'high') return 'bg-orange-500/20 text-orange-400';
    if (p === 'medium') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  };

  const tabs = ['dashboard', 'registry', 'analytics', 'insights'];
  const zoneData = useMemo(() => {
    const zones: Record<string, number> = {};
    filtered.forEach(r => { zones[r[16]] = (zones[r[16]] || 0) + 1; });
    return Object.entries(zones).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#05966922' }}>
          <Fingerprint className="w-5 h-5" style={{ color: '#059669' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Scandium Oxide Logistics</h2>
          <p className="text-sm text-gray-400">Sc2O3 aerospace alloy, SOFC fuel cell, laser crystal, naval superstructure supply chain tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Batches', value: kpis.total, color: '16a34a' },
          { label: 'Investment (Cr)', value: kpis.invest, color: '16a34a' },
          { label: 'Delayed', value: kpis.delayed, color: '#ef4444' },
          { label: 'Avg Purity', value: kpis.avgPurity + '%', color: '16a34a' },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <p className="text-xs text-gray-400">{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-gray-700/50 pb-2">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <input type="text" placeholder="Search batch, city, manufacturer..."
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-white focus:outline-none focus:border-gray-600">
          <option value="all">All Status</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="delayed">Delayed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Melting Point Distribution</h3>
            {zoneData.map(([zone, count]) => (
              <div key={zone} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 w-20">{zone}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-700/50">
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#05966922', width: `${(count / kpis.total * 100).toFixed(0)}%` }} />
                </div>
                <span className="text-xs text-gray-400">{count}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Recent Activity</h3>
            {filtered.slice(0, 5).map(r => (
              <div key={r[0]} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(r[10])}`}>{r[10]}</span>
                  <span className="text-sm text-gray-300">{r[1]}</span>
                </div>
                <span className="text-xs text-gray-500">{r[13]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="overflow-x-auto rounded-xl border border-gray-700/50">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Batch</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">City</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Manufacturer</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Grade</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">App</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Purity</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Invest (Cr)</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Status</th>
                <th className="px-4 py-3 text-left text-gray-400 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filtered.map(r => (
                <tr key={r[0]} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-white font-mono">{r[1]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[2]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[3]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[4]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[5]}</td>
                  <td className="px-4 py-3 text-gray-300">{r[6]}</td>
                  <td className="px-4 py-3 text-gray-300 font-mono">{r[8]}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(r[10])}`}>{r[10]}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(r[11])}`}>{r[11]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Manufacturer Performance</h3>
            {(() => { const mfg: Record<string, number> = {}; filtered.forEach(r => { mfg[r[3]] = (mfg[r[3]] || 0) + 1; }); return Object.entries(mfg).sort((a,b) => b[1]-a[1]).slice(0,6).map(([m,c]) => ( <div key={m} className="flex items-center gap-3 mb-2"> <span className="text-xs text-gray-400 w-32 truncate">{m}</span> <div className="flex-1 h-2 rounded-full bg-gray-700/50"> <div className="h-2 rounded-full" style={{ backgroundColor: '#05966922', width: `${(c/kpis.total*100).toFixed(0)}%` }} /> </div> <span className="text-xs text-gray-400">{c}</span> </div> )); })()}
          </div>
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Melting Point Distribution</h3>
            {filtered.slice(0, 8).map(r => (
              <div key={r[0]} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 w-28 truncate">{r[4]}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-700/50">
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#05966922', width: `${Math.min(100, parseFloat(String(r[7]).replace(/[^0-9.]/g, '')) / 2)}%` }} />
                </div>
                <span className="text-xs text-gray-400">{r[7]} W/mK</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Supply Chain Intelligence</h3>
            {filtered.filter(r => r[10] === 'delayed').map(r => (
              <div key={r[0]} className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Delayed</span>
                  <span className="text-sm font-medium text-white">{r[1]}</span>
                </div>
                <p className="text-xs text-gray-400">{r[2]} &#8594; {r[12]} | Transit: {r[14]}d | {r[15]}</p>
              </div>
            ))}
            {filtered.filter(r => r[11] === 'critical').slice(0, 3).map(r => (
              <div key={r[0]} className="mb-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">Critical</span>
                  <span className="text-sm font-medium text-white">{r[1]}</span>
                </div>
                <p className="text-xs text-gray-400">{r[5]} | {r[3]} | Ship: {r[13]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}