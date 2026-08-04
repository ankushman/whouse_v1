'use client';
import { useState, useMemo } from 'react';
import { Printer } from 'lucide-react';

const aln_RECORDS = [
  ['ALN-A2401', 'B24-ALN-001', 'Mumbai', 'MIDHANI', 'AlN 99.9% GaN-on-AlN RF Power Transistor', '5G Base Station PA', '99.9%', '2200 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'RFIL 5G GaN-on-AlN PA'],
  ['ALN-A2402', 'B24-ALN-002', 'Bengaluru', 'DRDO DMRL', 'AlN 99.95% UV LED 280nm Deep-UV Emit', 'Bio-Sterilization', '99.95%', '2200 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc AlN deep-UV LED'],
  ['ALN-A2403', 'B24-ALN-003', 'Hyderabad', 'Tata Chemicals', 'AlN 99.7% Power Electronics Heat Spreader', 'SiC IGBT Module', '99.7%', '2200 degC', '&#8377;840 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'BHEL SiC AlN heat sink'],
  ['ALN-A2404', 'B24-ALN-004', 'Chennai', 'Bharat Forge', 'AlN 99.85% Submarine Sonar Piezo Crystal', 'Underwater Acoustic', '99.85%', '2200 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'NPOL AlN sonar piezo'],
  ['ALN-A2405', 'B24-ALN-005', 'Kolkata', 'Shyam Chemicals', 'AlN 99.3% Aluminum Smelting Crucible Liner', 'Molten Metal Contain', '99.3%', '2200 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Hindalco AlN crucible'],
  ['ALN-A2406', 'B24-ALN-006', 'Noida', 'BHEL R&amp;D', 'AlN 99.8% Warship AESA Radar Module', 'Active Array Panel', '99.8%', '2200 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BEL AESA AlN substrate'],
  ['ALN-A2407', 'B24-ALN-007', 'Pune', 'Godrej Chemicals', 'AlN 99.0% HEPA Filter Ceramic Substrate', 'Clean Room HVAC', '99.0%', '2200 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Cipla AlN HEPA ceramic'],
  ['ALN-A2408', 'B24-ALN-008', 'Jaipur', 'Rajasthan Chemicals', 'AlN 99.6% Missile IR Dome Window', 'Seeker Transparent', '99.6%', '2200 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO Nag AlN IR dome'],
  ['ALN-A2409', 'B24-ALN-009', 'Guwahati', 'Assam Chemicals', 'AlN 99.92% Quantum Cascade Laser Heat Sink', 'Mid-IR Laser Diode', '99.92%', '2200 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G QCL AlN package'],
  ['ALN-A2410', 'B24-ALN-010', 'Ahmedabad', 'Gujarat Chemicals', 'AlN 99.4% EV Motor Controller Inverter', 'SiC Power Module', '99.4%', '2200 degC', '&#8377;820 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Tata Motors SiC AlN'],
  ['ALN-A2411', 'B24-ALN-011', 'Lucknow', 'UP Chemicals', 'AlN 99.8% Telecom Base Station Heat Pipe', 'Massive MIMO Cool', '99.8%', '2200 degC', '&#8377;860 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Jio 5G AlN heat pipe'],
  ['ALN-A2412', 'B24-ALN-012', 'Visakhapatnam', 'Vizag Chemicals', 'AlN 99.85% Submarine Propulsion Motor Insul', 'EM Drive Isolator', '99.85%', '2200 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK motor insul'],
  ['ALN-A2413', 'B24-ALN-013', 'Balasore', 'DRDO TBRL', 'AlN 99.95% Hypersonic Vehicle TPS Tile', 'Leading Edge Shield', '99.95%', '2200 degC', '&#8377;980 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV AlN TPS'],
  ['ALN-A2414', 'B24-ALN-014', 'Bhilai', 'SAIL Chemicals', 'AlN 98.0% General Industrial Grade', 'Refractory Ceramic', '98.0%', '2200 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL AlN refractory']
];

export default function AluminumNitrideLogisticsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  const filtered = useMemo(() => {
    return aln_RECORDS.filter(r => {
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
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#0369a122' }}>
          <Printer className="w-5 h-5" style={{ color: '#0369a1' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Aluminum Nitride Logistics</h2>
          <p className="text-sm text-gray-400">AlN GaN-on-AlN substrate &#8226; UV LED &#8226; Submarine sonar &#8226; Hypersonic TPS supply chain</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Batches', value: kpis.total, color: '#0369a1' },
          { label: 'Investment (Cr)', value: kpis.invest, color: '#0369a1' },
          { label: 'Delayed', value: kpis.delayed, color: '#ef4444' },
          { label: 'Avg Purity', value: kpis.avgPurity + '%', color: '#0369a1' },
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
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#0369a1', width: `${(count / kpis.total * 100).toFixed(0)}%` }} />
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
            {(() => { const mfg: Record<string, number> = {}; filtered.forEach(r => { mfg[r[3]] = (mfg[r[3]] || 0) + 1; }); return Object.entries(mfg).sort((a,b) => b[1]-a[1]).slice(0,6).map(([m,c]) => ( <div key={m} className="flex items-center gap-3 mb-2"> <span className="text-xs text-gray-400 w-32 truncate">{m}</span> <div className="flex-1 h-2 rounded-full bg-gray-700/50"> <div className="h-2 rounded-full" style={{ backgroundColor: '#0369a1', width: `${(c/kpis.total*100).toFixed(0)}%` }} /> </div> <span className="text-xs text-gray-400">{c}</span> </div> )); })()}
          </div>
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Melting Point Distribution</h3>
            {filtered.slice(0, 8).map(r => (
              <div key={r[0]} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 w-28 truncate">{r[4]}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-700/50">
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#0369a1', width: `${Math.min(100, parseFloat(String(r[7]).replace(/[^0-9.]/g, '')) / 2)}%` }} />
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