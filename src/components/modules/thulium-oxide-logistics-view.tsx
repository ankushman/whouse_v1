'use client';
import { useState, useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';

const TMO_RECORDS = [
  ['TMO-A2401', 'TMO-2024-B001', 'Mumbai', 'MIDHANI', 'Tm2O3 99.99% Portable X-Ray', 'Tm-doped GSO portable detector', '99.99%', 'density 7.58 g/cm3', '&#8377;960 Cr', 'In Transit', 'Critical', 'Delhi', 'Mumbai', '2024-03-15', '10', 'West', 'Defense field hospital X-ray'],
  ['TMO-A2402', 'TMO-2024-B002', 'Bengaluru', 'DRDO DMRL', 'Tm2O3 99.9% Fiber Amplifier', 'Tm-doped fiber S-band amplifier', '99.9%', 'emission 1470nm', '&#8377;940 Cr', 'Delivered', 'High', 'Chennai', 'Bengaluru', '2024-03-10', '7', 'South', 'ISRO S-band telemetry amp'],
  ['TMO-A2403', 'TMO-2024-B003', 'Hyderabad', 'Tata Chemicals', 'Tm2O3 99.7% Laser Welding', 'Tm:YAG 2um industrial laser', '99.7%', 'emission 2010nm CW', '&#8377;920 Cr', 'Processing', 'Medium', 'Vishakhapatnam', 'Hyderabad', '2024-03-20', '8', 'Central', 'Tata heavy laser welder'],
  ['TMO-A2404', 'TMO-2024-B004', 'Chennai', 'Bharat Forge', 'Tm2O3 99.5% Upconversion', 'Green UC phosphor emitter', '99.5%', 'emission 540nm green', '&#8377;900 Cr', 'In Transit', 'Medium', 'Kolkata', 'Chennai', '2024-03-18', '11', 'South', 'Display tech UC phosphor'],
  ['TMO-A2405', 'TMO-2024-B005', 'Delhi', 'Shyam Chemicals', 'Tm2O3 99.3% Ceramic Glaze', 'Blue ceramic glaze tint', '99.3%', 'CIE L*82 a*(-4) b*(-8)', '&#8377;880 Cr', 'Stored', 'Low', 'Jaipur', 'Delhi', '2024-02-28', '4', 'North', 'Pottery glaze formulation'],
  ['TMO-A2406', 'TMO-2024-B006', 'Pune', 'BHEL R&amp;D', 'Tm2O3 99.8% Medical Laser', 'Tm:YAG tissue ablation laser', '99.8%', 'emission 2010nm pulsed', '&#8377;940 Cr', 'In Transit', 'High', 'Mumbai', 'Pune', '2024-03-22', '6', 'West', 'BHEL surgical laser unit'],
  ['TMO-A2407', 'TMO-2024-B007', 'Kolkata', 'Godrej Chemicals', 'Tm2O3 99.0% Glass Colorant', 'Blue glass colorant additive', '99.0%', 'absorption 680nm peak', '&#8377;860 Cr', 'Stored', 'Low', 'Guwahati', 'Kolkata', '2024-02-25', '5', 'East', 'Art glass batch'],
  ['TMO-A2408', 'TMO-2024-B008', 'Ahmedabad', 'Rajasthan Chemicals', 'Tm2O3 98.5% Arc Lamp Electrode', 'Metal halide lamp electrode', '98.5%', 'work function 2.8eV', '&#8377;900 Cr', 'In Transit', 'Medium', 'Jodhpur', 'Ahmedabad', '2024-03-25', '7', 'West', 'Cinema projector lamp'],
  ['TMO-A2409', 'TMO-2024-B009', 'Guwahati', 'Assam Chemicals', 'Tm2O3 99.6% Nuclear Shield', 'Reactor neutron shield absorber', '99.6%', 'sigma 100 barns thermal', '&#8377;940 Cr', 'Processing', 'High', 'Dibrugarh', 'Guwahati', '2024-03-12', '3', 'East', 'BARC shield panel'],
  ['TMO-A2410', 'TMO-2024-B010', 'Lucknow', 'UP Chemicals', 'Tm2O3 99.95% Submarine LIDAR', 'Blue-green undersea LIDAR', '99.95%', 'emission 2010nm eye-safe', '&#8377;960 Cr', 'In Transit', 'Critical', 'Vishakhapatnam', 'Lucknow', '2024-03-28', '12', 'North', 'IN Navy submarine depth sounder'],
  ['TMO-A2411', 'TMO-2024-B011', 'Jaipur', 'Gujarat Chemicals', 'Tm2O3 99.2% MRI Contrast', 'Tm-DTPA contrast agent precursor', '99.2%', 'relaxivity 4.2 mM-1s-1', '&#8377;920 Cr', 'Stored', 'Medium', 'Surat', 'Jaipur', '2024-03-05', '4', 'West', 'AIIMS diagnostic imaging'],
  ['TMO-A2412', 'TMO-2024-B012', 'Vishakhapatnam', 'Vizag Chemicals', 'Tm2O3 99.8% Warship Laser Comm', 'Naval IR laser comm link', '99.8%', 'emission 2010nm 10W CW', '&#8377;960 Cr', 'Delayed', 'Critical', 'Chennai', 'Vishakhapatnam', '2024-02-15', '28', 'South', 'Monsoon delay naval comms'],
  ['TMO-A2413', 'TMO-2024-B013', 'Bhubaneswar', 'DRDO TBRL', 'Tm2O3 99.4% Missile Seeker', 'IR seeker Tm-doped detector', '99.4%', 'D* 1.2e11 cmHz1/2/W', '&#8377;940 Cr', 'In Transit', 'High', 'Balasore', 'Bhubaneswar', '2024-03-30', '2', 'East', 'DRDO missile IR homing'],
  ['TMO-A2414', 'TMO-2024-B014', 'Rourkela', 'SAIL Chemicals', 'Tm2O3 97% General Chemical', 'Industrial alloy additive grade', '97.0%', 'Yb impurity 0.5%', '&#8377;860 Cr', 'Stored', 'Low', 'Ranchi', 'Rourkela', '2024-02-20', '3', 'East', 'SAIL steel deoxidizer']
];

export default function ThuliumOxideLogisticsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  const filtered = useMemo(() => {
    return TMO_RECORDS.filter(r => {
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
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#0891b222' }}>
          <ShieldCheck className="w-5 h-5" style={{ color: '#0891b2' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Thulium Oxide Logistics</h2>
          <p className="text-sm text-gray-400">Tm2O3 portable X-ray, fiber amplifier, medical laser, submarine LIDAR supply chain tracking</p>
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
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#0891b222', width: `${(count / kpis.total * 100).toFixed(0)}%` }} />
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
            {(() => { const mfg: Record<string, number> = {}; filtered.forEach(r => { mfg[r[3]] = (mfg[r[3]] || 0) + 1; }); return Object.entries(mfg).sort((a,b) => b[1]-a[1]).slice(0,6).map(([m,c]) => ( <div key={m} className="flex items-center gap-3 mb-2"> <span className="text-xs text-gray-400 w-32 truncate">{m}</span> <div className="flex-1 h-2 rounded-full bg-gray-700/50"> <div className="h-2 rounded-full" style={{ backgroundColor: '#0891b222', width: `${(c/kpis.total*100).toFixed(0)}%` }} /> </div> <span className="text-xs text-gray-400">{c}</span> </div> )); })()}
          </div>
          <div className="rounded-xl p-4 border border-gray-700/50 bg-gray-800/30">
            <h3 className="text-sm font-semibold mb-3 text-gray-300">Melting Point Distribution</h3>
            {filtered.slice(0, 8).map(r => (
              <div key={r[0]} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 w-28 truncate">{r[4]}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-700/50">
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#0891b222', width: `${Math.min(100, parseFloat(String(r[7]).replace(/[^0-9.]/g, '')) / 2)}%` }} />
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