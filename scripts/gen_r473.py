#!/usr/bin/env python3
"""R473 Generator: Silicon Germanium Logistics + Zirconium Diboride Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Silicon Germanium: SiGe ---
# Prefix: sge, Icon: Ruler, Color: #4f46e5 (indigo), MP 938 degC, density 5.32 g/cm3
# SiGe: RF BiCMOS for telecom/wireless, space PV multi-junction, thermal IR sensor,
# strained-Si CMOS high-speed logic, fiber-optic photodetector
sge_records = [
    ['SGE-A2401', 'B24-SGE-001', 'Mumbai', 'MIDHANI', 'SiGe 99.9999% RF BiCMOS Telecom Chip', '5G mmWave PA', '99.9999%', '938 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BEL SiGe RF BiCMOS'],
    ['SGE-A2402', 'B24-SGE-002', 'Bengaluru', 'DRDO DMRL', 'SiGe 99.999% Space Multi-Junction PV Cell', 'Triple-Junction Stack', '99.999%', '938 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'ISRO SiGe space PV'],
    ['SGE-A2403', 'B24-SGE-003', 'Hyderabad', 'Tata Chemicals', 'SiGe 99.99% Thermal IR Imaging FPA', 'Uncooled Microbolometer', '99.99%', '938 degC', '&#8377;900 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'DRDO SiGe thermal IR'],
    ['SGE-A2404', 'B24-SGE-004', 'Chennai', 'Bharat Forge', 'SiGe 99.97% Strained-Si CMOS Logic Wafer', 'High-Mobility Channel', '99.97%', '938 degC', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IIT-M SiGe strained'],
    ['SGE-A2405', 'B24-SGE-005', 'Kolkata', 'Shyam Chemicals', 'SiGe 99.9% Fiber-Optic High-Speed Photodetector', '10Gbps PIN Diode', '99.9%', '938 degC', '&#8377;840 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Sterlite SiGe photodet'],
    ['SGE-A2406', 'B24-SGE-006', 'Noida', 'BHEL R&amp;D', 'SiGe 99.995% Missile Seeker RF Front-End', 'Ka-Band MMIC', '99.995%', '938 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO Astra SiGe MMIC'],
    ['SGE-A2407', 'B24-SGE-007', 'Pune', 'Godrej Chemicals', 'SiGe 99.5% WLAN Power Amplifier Module', 'Wi-Fi 6E RF', '99.5%', '938 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'BEL SiGe WLAN PA'],
    ['SGE-A2408', 'B24-SGE-008', 'Jaipur', 'Rajasthan Chemicals', 'SiGe 99.8% Radar Transceiver Chipset', 'X-Band TR Module', '99.8%', '938 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO SiGe radar T/R'],
    ['SGE-A2409', 'B24-SGE-009', 'Guwahati', 'Assam Chemicals', 'SiGe 99.999% Quantum Cascade Thermoelectric', 'SiGe/Si Superlattice', '99.999%', '938 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G SiGe TE superlat'],
    ['SGE-A2410', 'B24-SGE-010', 'Ahmedabad', 'Gujarat Chemicals', 'SiGe 99.6% Satellite On-Board Processor', 'Rad-Hard SOC', '99.6%', '938 degC', '&#8377;880 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'ISRO SiGe SAT OBP'],
    ['SGE-A2411', 'B24-SGE-011', 'Lucknow', 'UP Chemicals', 'SiGe 99.4% Automotive Radar Sensor Die', '77 GHz MIMO', '99.4%', '938 degC', '&#8377;800 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Bosch SiGe auto radar'],
    ['SGE-A2412', 'B24-SGE-012', 'Visakhapatnam', 'Vizag Chemicals', 'SiGe 99.97% Submarine EW Jammer RF Module', 'ESM Countermeasure', '99.97%', '938 degC', '&#8377;940 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK EW module'],
    ['SGE-A2413', 'B24-SGE-013', 'Balasore', 'DRDO TBRL', 'SiGe 99.999% Hypersonic Telemetry Transmitter', 'Mach 7+ S-Band TX', '99.999%', '938 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV SiGe TX'],
    ['SGE-A2414', 'B24-SGE-014', 'Bhilai', 'SAIL Chemicals', 'SiGe 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '938 degC', '&#8377;540 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL SiGe industrial'],
]

# --- Zirconium Diboride: ZrB2 ---
# Prefix: zrb, Icon: PlugZap, Color: #be123c (rose), MP 3246 degC, density 6.09 g/cm3
# ZrB2: ultra-high-temp ceramic, hypersonic TPS leading edge, nuclear fuel cladding,
# thermoelectric, plasma arc electrode, molten metal crucible
zrb_records = [
    ['ZRB-A2401', 'B24-ZRB-001', 'Mumbai', 'MIDHANI', 'ZrB2 99.5% Hypersonic TPS Leading Edge', 'Mach 7+ Nose Cap', '99.5%', '3246 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'DRDO HSTDV ZrB2 TPS'],
    ['ZRB-A2402', 'B24-ZRB-002', 'Bengaluru', 'DRDO DMRL', 'ZrB2 99.9% Nuclear Reactor Control Rod Sleeve', 'BWR/PWR Cladding', '99.9%', '3246 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'BARC ZrB2 ctrl rod'],
    ['ZRB-A2403', 'B24-ZRB-003', 'Hyderabad', 'Tata Chemicals', 'ZrB2 99.7% Plasma Arc Welding Electrode', 'TIG/WIG Tip', '99.7%', '3246 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'BHEL ZrB2 electrode'],
    ['ZRB-A2404', 'B24-ZRB-004', 'Chennai', 'Bharat Forge', 'ZrB2 99.85% Molten Metal Crucible Liner', 'Al/Ti Smelting', '99.85%', '3246 degC', '&#8377;880 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Hindalco ZrB2 crucible'],
    ['ZRB-A2405', 'B24-ZRB-005', 'Kolkata', 'Shyam Chemicals', 'ZrB2 99.3% Thermoelectric Generator Element', 'TEG Hot-Side Leg', '99.3%', '3246 degC', '&#8377;820 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'ISRO ZrB2 TEG leg'],
    ['ZRB-A2406', 'B24-ZRB-006', 'Noida', 'BHEL R&amp;D', 'ZrB2 99.95% Missile Airframe Thermal Structure', 'Scramjet Frame', '99.95%', '3246 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO BrahMos ZrB2 frame'],
    ['ZRB-A2407', 'B24-ZRB-007', 'Pune', 'Godrej Chemicals', 'ZrB2 99.0% Aluminum Casting Nozzle', 'Die Casting Gate', '99.0%', '3246 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Bajaj ZrB2 nozzle'],
    ['ZRB-A2408', 'B24-ZRB-008', 'Jaipur', 'Rajasthan Chemicals', 'ZrB2 99.8% Submarine Propeller Shaft Bearing', 'UHT Marine Bearing', '99.8%', '3246 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Mazagon Dock ZrB2 bearing'],
    ['ZRB-A2409', 'B24-ZRB-009', 'Guwahati', 'Assam Chemicals', 'ZrB2 99.6% Rocket Motor Nozzle Throat Insert', 'Solid Rocket Nozzle', '99.6%', '3246 degC', '&#8377;880 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'DRDO ZrB2 nozzle'],
    ['ZRB-A2410', 'B24-ZRB-010', 'Ahmedabad', 'Gujarat Chemicals', 'ZrB2 99.4% Re-Entry Vehicle Ablative Shield', 'RV Heat Shield', '99.4%', '3246 degC', '&#8377;860 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'DRDO Agni ZrB2 shield'],
    ['ZRB-A2411', 'B24-ZRB-011', 'Lucknow', 'UP Chemicals', 'ZrB2 99.2% Industrial Furnace Heating Element', 'UHT Radiant Heater', '99.2%', '3246 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'SAIL ZrB2 furnace'],
    ['ZRB-A2412', 'B24-ZRB-012', 'Visakhapatnam', 'Vizag Chemicals', 'ZrB2 99.85% Submarine Hull Ceramic Armor Tile', 'Anti-Torpedo Ceramic', '99.85%', '3246 degC', '&#8377;920 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK hull armor'],
    ['ZRB-A2413', 'B24-ZRB-013', 'Balasore', 'DRDO TBRL', 'ZrB2 99.9% Hypersonic Scramjet Combustor Liner', 'Mach 7+ Combustion', '99.9%', '3246 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV ZrB2 liner'],
    ['ZRB-A2414', 'B24-ZRB-014', 'Bhilai', 'SAIL Chemicals', 'ZrB2 98.5% General Industrial Grade', 'Process Chemical', '98.5%', '3246 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL ZrB2 industrial'],
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


sge_config = {
    'prefix': 'sge', 'icon': 'Ruler', 'color': '#4f46e5',
    'title': 'Silicon Germanium Logistics',
    'subtitle': 'SiGe RF BiCMOS &#8226; Space multi-junction PV &#8226; Thermal IR sensor &#8226; Strained-Si CMOS supply chain',
    'fn_name': 'SiliconGermaniumLogisticsView',
}
with open('src/components/modules/silicon-germanium-logistics-view.tsx', 'w') as f:
    f.write(gen_module(sge_records, sge_config))
print("Generated: silicon-germanium-logistics-view.tsx")

zrb_config = {
    'prefix': 'zrb', 'icon': 'PlugZap', 'color': '#be123c',
    'title': 'Zirconium Diboride Logistics',
    'subtitle': 'ZrB2 hypersonic TPS &#8226; Nuclear fuel cladding &#8226; Plasma electrode &#8226; UHT ceramic supply chain',
    'fn_name': 'ZirconiumDiborideLogisticsView',
}
with open('src/components/modules/zirconium-diboride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(zrb_records, zrb_config))
print("Generated: zirconium-diboride-logistics-view.tsx")

for fname in ['src/components/modules/silicon-germanium-logistics-view.tsx', 'src/components/modules/zirconium-diboride-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
