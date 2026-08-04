#!/usr/bin/env python3
"""R485 Generator: Hafnium Diboride Logistics + Magnesium Diboride Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Hafnium Diboride: HfB2 ---
# Prefix: hfb, Icon: Calendar, Color: #059669 (emerald), MP 3380 degC, density 10.5 g/cm3
# HfB2: aerospace leading-edge UHTC, hypersonic TPS tile, ZrB2-HfB2 composite,
# thermal protection system for reentry, scramjet combustion chamber liner,
# plasma arc electrode, neutron absorber control rod, high-temp thermoelectric
hfb_records = [
    ['HFB-A2401', 'B24-HFB-001', 'Mumbai', 'MIDHANI', 'HfB2 99.99% ZrB2-HfB2 UHTC Leading Edge', 'Mach 12+ TPS Panel', '99.99%', '3380 degC', '&#8377;1600 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'DRDO HSTDV HfB2 UHTC'],
    ['HFB-A2402', 'B24-HFB-002', 'Bengaluru', 'DRDO DMRL', 'HfB2 99.9% Hypersonic Vehicle Nose Cone Ablative', 'Sharp Nose Cap', '99.9%', '3380 degC', '&#8377;1520 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO HGV HfB2 nose'],
    ['HFB-A2403', 'B24-HFB-003', 'Hyderabad', 'Tata Chemicals', 'HfB2 99.7% Scramjet Combustor Liner UHTC', 'Mach 8+ Scramjet', '99.7%', '3380 degC', '&#8377;1400 Cr', 'in-transit', 'critical', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO scramjet HfB2'],
    ['HFB-A2404', 'B24-HFB-004', 'Chennai', 'Bharat Forge', 'HfB2 99.5% Reentry Capsule TPS Heat Shield', 'GSLV Mk-4 Fairing', '99.5%', '3380 degC', '&#8377;1440 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'ISRO HfB2 TPS shield'],
    ['HFB-A2405', 'B24-HFB-005', 'Kolkata', 'Shyam Chemicals', 'HfB2 99.8% Plasma Arc Torch Electrode', 'Transfer Arc 5000K', '99.8%', '3380 degC', '&#8377;1200 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'IIT-Khar HfB2 plasma'],
    ['HFB-A2406', 'B24-HFB-006', 'Noida', 'BHEL R&amp;D', 'HfB2 99.6% Nuclear Reactor Neutron Absorber', 'HfB2 Control Rod', '99.6%', '3380 degC', '&#8377;1280 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BARC HfB2 ctrl rod'],
    ['HFB-A2407', 'B24-HFB-007', 'Pune', 'Godrej Chemicals', 'HfB2 99.4% High-Temp Thermoelectric HfB2-SiC', 'SEG Hot-Side Leg', '99.4%', '3380 degC', '&#8377;1360 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'IISc HfB2 TEG'],
    ['HFB-A2408', 'B24-HFB-008', 'Jaipur', 'Rajasthan Chemicals', 'HfB2 99.3% Molten Metal Thermocouple Sheath', 'Type B Pt-Rh/HfB2', '99.3%', '3380 degC', '&#8377;1100 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BHEL HfB2 TC sheath'],
    ['HFB-A2409', 'B24-HFB-009', 'Guwahati', 'Assam Chemicals', 'HfB2 99.99% Hypersonic Wind Tunnel Throat Insert', 'Mach 12 HWT Throat', '99.99%', '3380 degC', '&#8377;1480 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'DRDO HfB2 throat'],
    ['HFB-A2410', 'B24-HFB-010', 'Ahmedabad', 'Gujarat Chemicals', 'HfB2 99.5% Rocket Motor Nozzle Extension', 'Agni-V Upper Stage', '99.5%', '3380 degC', '&#8377;1400 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'ISRO HfB2 nozzle ext'],
    ['HFB-A2411', 'B24-HFB-011', 'Lucknow', 'UP Chemicals', 'HfB2 99.2% Sintered UHTC Furnace Element', '2200 degC Hot Press', '99.2%', '3380 degC', '&#8377;1000 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BHEL HfB2 element'],
    ['HFB-A2412', 'B24-HFB-012', 'Visakhapatnam', 'Vizag Chemicals', 'HfB2 99.92% Submarine Reentry Vehicle TPS', 'SLBM K-4 RV Cap', '99.92%', '3380 degC', '&#8377;1600 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SLBM TPS'],
    ['HFB-A2413', 'B24-HFB-013', 'Balasore', 'DRDO TBRL', 'HfB2 99.99% Hypersonic Cruise Missile Radome', 'BrahMos-II Radome', '99.99%', '3380 degC', '&#8377;1520 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO BrahMos-II'],
    ['HFB-A2414', 'B24-HFB-014', 'Bhilai', 'SAIL Chemicals', 'HfB2 99.0% General UHTC Refractory Grade', 'Process Chemical', '99.0%', '3380 degC', '&#8377;800 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL HfB2 UHTC'],
]

# --- Magnesium Diboride: MgB2 ---
# Prefix: mgb, Icon: Vibrate, Color: #dc2626 (red), MP ~830 degC (decomposes), density 2.57 g/cm3
# MgB2: superconducting MRI magnet wire, 39 K critical temperature, fault current limiter,
# superconducting magnetic energy storage (SMES), NMR magnet, MRI open-bore system,
# particle accelerator dipole magnet, SQUID magnetometer, transformer windings
mgb_records = [
    ['MGB-A2401', 'B24-MGB-001', 'Mumbai', 'MIDHANI', 'MgB2 99.99% Superconducting MRI Magnet Wire', '1.5T Open MRI', '99.99%', '830 degC', '&#8377;1200 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'ESCOM MgB2 MRI'],
    ['MGB-A2402', 'B24-MGB-002', 'Bengaluru', 'DRDO DMRL', 'MgB2 99.9% Fault Current Limiter Coil', 'Grid Protection FCL', '99.9%', '830 degC', '&#8377;1080 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO MgB2 FCL'],
    ['MGB-A2403', 'B24-MGB-003', 'Hyderabad', 'Tata Chemicals', 'MgB2 99.7% SMES Superconducting Energy Storage', '10 MJ Pulse Power', '99.7%', '830 degC', '&#8377;1120 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO MgB2 SMES'],
    ['MGB-A2404', 'B24-MGB-004', 'Chennai', 'Bharat Forge', 'MgB2 99.5% NMR Spectrometer Magnet', '600 MHz Solid-State', '99.5%', '830 degC', '&#8377;1040 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IISc MgB2 NMR'],
    ['MGB-A2405', 'B24-MGB-005', 'Kolkata', 'Shyam Chemicals', 'MgB2 99.8% Particle Accelerator Dipole Magnet', 'BARC Cyclotron', '99.8%', '830 degC', '&#8377;1000 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BARC MgB2 cyclotron'],
    ['MGB-A2406', 'B24-MGB-006', 'Noida', 'BHEL R&amp;D', 'MgB2 99.6% SQUID Magnetometer Sensor', 'Biomagnetic Imaging', '99.6%', '830 degC', '&#8377;960 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'IIT-D MgB2 SQUID'],
    ['MGB-A2407', 'B24-MGB-007', 'Pune', 'Godrej Chemicals', 'MgB2 99.4% Superconducting Transformer Winding', '11 kV-400 V Grid', '99.4%', '830 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'BHEL MgB2 trans'],
    ['MGB-A2408', 'B24-MGB-008', 'Jaipur', 'Rajasthan Chemicals', 'MgB2 99.3% MRI Gradient Coil Insert', 'Fast Switching MRI', '99.3%', '830 degC', '&#8377;880 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Wipro GE MgB2 grad'],
    ['MGB-A2409', 'B24-MGB-009', 'Guwahati', 'Assam Chemicals', 'MgB2 99.99% Magnetically Levitated Bearing', 'Contactless Flywheel', '99.99%', '830 degC', '&#8377;1080 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G MgB2 maglev'],
    ['MGB-A2410', 'B24-MGB-010', 'Ahmedabad', 'Gujarat Chemicals', 'MgB2 99.5% HTS Power Transmission Cable', 'DC 10 kA Link', '99.5%', '830 degC', '&#8377;1000 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'PGCIL MgB2 HTS cable'],
    ['MGB-A2411', 'B24-MGB-011', 'Lucknow', 'UP Chemicals', 'MgB2 99.2% Electron Beam Welding SC Magnet', 'Focused EB Deflect', '99.2%', '830 degC', '&#8377;840 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BHEL MgB2 EB weld'],
    ['MGB-A2412', 'B24-MGB-012', 'Visakhapatnam', 'Vizag Chemicals', 'MgB2 99.92% Submarine Mine Detection SQUID Array', 'MAD Sonobuoy', '99.92%', '830 degC', '&#8377;1120 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK MAD'],
    ['MGB-A2413', 'B24-MGB-013', 'Balasore', 'DRDO TBRL', 'MgB2 99.99% Electromagnetic Launcher Coil', 'Railgun SC Coil', '99.99%', '830 degC', '&#8377;1200 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO MgB2 railgun'],
    ['MGB-A2414', 'B24-MGB-014', 'Bhilai', 'SAIL Chemicals', 'MgB2 99.0% General Superconducting Grade', 'Process Chemical', '99.0%', '830 degC', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL MgB2 SC grade'],
]


def fmt_record(r):
    parts = [f"'{r[i]}'" for i in range(len(r))]
    return '  [' + ', '.join(parts) + ']'


def gen_module(records, config):
    with open(TEMPLATE_PATH, 'r') as f:
        template = f.read()
    prefix = config['prefix']
    icon = config['icon']
    color = config['color']
    title = config['title']
    subtitle = config['subtitle']
    fn_name = config['fn_name']
    rec_strs = [fmt_record(r) for r in records]
    rec_block = f"const {prefix}_RECORDS = [\n" + ',\n'.join(rec_strs) + "\n];"
    template = re.sub(r"const [\w]+_RECORDS = \[.*?\];", rec_block, template, flags=re.DOTALL)
    template = re.sub(r"import \{ \w+ \} from 'lucide-react';", f"import {{ {icon} }} from 'lucide-react';", template)
    template = re.sub(r"export default function \w+LogisticsView\(\)", f"export default function {fn_name}()", template)
    template = re.sub(r"zinc_oxide_RECORDS", f"{prefix}_RECORDS", template)
    template = template.replace('Zinc Oxide Logistics', title)
    template = template.replace('ZnO varistor &#8226; UV blocker &#8226; Rubber vulcanization &#8226; TCO electrode supply chain', subtitle)
    template = re.sub(r'<ShieldCheck className="w-5 h-5"', f'<{icon} className="w-5 h-5"', template)
    template = re.sub(r"'16a34a'", f"'{color}'", template)
    template = re.sub(r"backgroundColor: '#6366f122'", f"backgroundColor: '{color}22'", template)
    return template


hfb_config = {
    'prefix': 'hfb', 'icon': 'Calendar', 'color': '#059669',
    'title': 'Hafnium Diboride Logistics',
    'subtitle': 'HfB2 aerospace UHTC &#8226; Hypersonic TPS &#8226; Scramjet liner &#8226; Neutron absorber supply chain',
    'fn_name': 'HafniumDiborideLogisticsView',
}
with open('src/components/modules/hafnium-diboride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(hfb_records, hfb_config))
print("Generated: hafnium-diboride-logistics-view.tsx")

mgb_config = {
    'prefix': 'mgb', 'icon': 'Vibrate', 'color': '#dc2626',
    'title': 'Magnesium Diboride Logistics',
    'subtitle': 'MgB2 superconducting MRI &#8226; Fault current limiter &#8226; SMES &#8226; SQUID magnetometer supply chain',
    'fn_name': 'MagnesiumDiborideLogisticsView',
}
with open('src/components/modules/magnesium-diboride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(mgb_records, mgb_config))
print("Generated: magnesium-diboride-logistics-view.tsx")

for fname in ['src/components/modules/hafnium-diboride-logistics-view.tsx', 'src/components/modules/magnesium-diboride-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
