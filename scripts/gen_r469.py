#!/usr/bin/env python3
"""R469 Generator: Lead Zirconate Logistics + Hafnium Dioxide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Lead Zirconate: PbZrO3 ---
# Prefix: pbz, Icon: BrickWall, Color: #4338ca (indigo-dark), MP 1570 degC, density 7.10 g/cm3
pbz_records = [
    ['PBZ-A2401', 'B24-PBZ-001', 'Mumbai', 'MIDHANI', 'PbZrO3 99.9% Ferroelectric RAM Capacitor', 'FeRAM Memory Chip', '99.9%', '1570 degC', '&#8377;880 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'IISc FeRAM PbZrO3 cap'],
    ['PBZ-A2402', 'B24-PBZ-002', 'Bengaluru', 'DRDO DMRL', 'PbZrO3 99.95% Submarine Sonar Piezo Transducer', 'Underwater Acoustic', '99.95%', '1570 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'NPOL PbZrO3 sonar piezo'],
    ['PBZ-A2403', 'B24-PBZ-003', 'Hyderabad', 'Tata Chemicals', 'PbZrO3 99.7% PZT Ceramic Actuator Stack', 'Precision Micro-Pos', '99.7%', '1570 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'ISRO PZT actuator stack'],
    ['PBZ-A2404', 'B24-PBZ-004', 'Chennai', 'Bharat Forge', 'PbZrO3 99.85% Ignition Voltage Controller', 'Gas Turbine Spark', '99.85%', '1570 degC', '&#8377;820 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BHEL GT igniter PbZr'],
    ['PBZ-A2405', 'B24-PBZ-005', 'Kolkata', 'Shyam Chemicals', 'PbZrO3 99.3% Ultrasonic Cleaning Transducer', 'Industrial NDT', '99.3%', '1570 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'TATA Steel NDT transd'],
    ['PBZ-A2406', 'B24-PBZ-006', 'Noida', 'BHEL R&amp;D', 'PbZrO3 99.8% Warship Active Sonar Array', 'Hull-Mounted ASW', '99.8%', '1570 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BEL ASW PbZrO3 array'],
    ['PBZ-A2407', 'B24-PBZ-007', 'Pune', 'Godrej Chemicals', 'PbZrO3 99.0% Diesel Fuel Injector Piezo', 'Common Rail Direct', '99.0%', '1570 degC', '&#8377;780 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Cummins piezo injector'],
    ['PBZ-A2408', 'B24-PBZ-008', 'Jaipur', 'Rajasthan Chemicals', 'PbZrO3 99.6% Missile Accelerometer Sensor', 'Inertial Nav Unit', '99.6%', '1570 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO Astra PbZr accel'],
    ['PBZ-A2409', 'B24-PBZ-009', 'Guwahati', 'Assam Chemicals', 'PbZrO3 99.92% 5G SAW Filter Duplexer', 'RF Front-End', '99.92%', '1570 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G SAW PbZrO3 duplx'],
    ['PBZ-A2410', 'B24-PBZ-010', 'Ahmedabad', 'Gujarat Chemicals', 'PbZrO3 99.4% Medical Ultrasound Probe', 'Diagnostic Imaging', '99.4%', '1570 degC', '&#8377;840 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Wipro GE PbZrO3 probe'],
    ['PBZ-A2411', 'B24-PBZ-011', 'Lucknow', 'UP Chemicals', 'PbZrO3 99.8% Pyroelectric IR Detector', 'Fire Alarm Sensor', '99.8%', '1570 degC', '&#8377;800 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Honeywell PbZr pyro IR'],
    ['PBZ-A2412', 'B24-PBZ-012', 'Visakhapatnam', 'Vizag Chemicals', 'PbZrO3 99.85% Submarine Towed Array Hydrophone', 'Passive Listening', '99.85%', '1570 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK towed hydro'],
    ['PBZ-A2413', 'B24-PBZ-013', 'Balasore', 'DRDO TBRL', 'PbZrO3 99.95% Hypersonic Wind Tunnel Sensor', 'Mach 7+ Flow Meas', '99.95%', '1570 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO tunnel PbZr sensor'],
    ['PBZ-A2414', 'B24-PBZ-014', 'Bhilai', 'SAIL Chemicals', 'PbZrO3 98.0% General Industrial Grade', 'Process Ceramic', '98.0%', '1570 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL PbZrO3 ceramic'],
]

# --- Hafnium Dioxide: HfO2 ---
# Prefix: hfo, Icon: Briefcase, Color: #7c2d12 (brown-dark), MP 2758 degC, density 9.68 g/cm3
hfo_records = [
    ['HFO-A2401', 'B24-HFO-001', 'Mumbai', 'MIDHANI', 'HfO2 99.9% Advanced Node Gate Oxide', 'Sub-5nm FinFET', '99.9%', '2758 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'IISc HfO2 gate dielec'],
    ['HFO-A2402', 'B24-HFO-002', 'Bengaluru', 'DRDO DMRL', 'HfO2 99.95% Submarine Nuclear Control Rod', 'Reactivity Control', '99.95%', '2758 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'NPCIL HfO2 control rod'],
    ['HFO-A2403', 'B24-HFO-003', 'Hyderabad', 'Tata Chemicals', 'HfO2 99.7% DRAM Capacitor High-K Dielectric', 'Memory Node', '99.7%', '2758 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'IISc HfO2 DRAM cap'],
    ['HFO-A2404', 'B24-HFO-004', 'Chennai', 'Bharat Forge', 'HfO2 99.85% Warship Stealth Radar Absorber', 'RCS Reduction Tile', '99.85%', '2758 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BEL Naval RAM HfO2'],
    ['HFO-A2405', 'B24-HFO-005', 'Kolkata', 'Shyam Chemicals', 'HfO2 99.3% Optical Anti-Reflective Coat', 'UV Lithography', '99.3%', '2758 degC', '&#8377;820 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'IIT-K HfO2 AR coat'],
    ['HFO-A2406', 'B24-HFO-006', 'Noida', 'BHEL R&amp;D', 'HfO2 99.8% Submarine Reactor Vessel Liner', 'Nuke Containment', '99.8%', '2758 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'NPCIL HfO2 reactor lin'],
    ['HFO-A2407', 'B24-HFO-007', 'Pune', 'Godrej Chemicals', 'HfO2 99.0% Incandescent Lamp Filament Coil', 'Specialty Lighting', '99.0%', '2758 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Surya Roshni HfO2 fila'],
    ['HFO-A2408', 'B24-HFO-008', 'Jaipur', 'Rajasthan Chemicals', 'HfO2 99.6% Missile IR Seeker Window', 'Thermal Imaging', '99.6%', '2758 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO Astra HfO2 IR'],
    ['HFO-A2409', 'B24-HFO-009', 'Guwahati', 'Assam Chemicals', 'HfO2 99.92% Ferroelectric FeFET Memory', 'Neuromorphic Comp', '99.92%', '2758 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G HfO2 FeFET'],
    ['HFO-A2410', 'B24-HFO-010', 'Ahmedabad', 'Gujarat Chemicals', 'HfO2 99.4% Plasma Etch Chamber Liner', 'Semiconductor Fab', '99.4%', '2758 degC', '&#8377;840 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Applied Mat HfO2 liner'],
    ['HFO-A2411', 'B24-HFO-011', 'Lucknow', 'UP Chemicals', 'HfO2 99.8% Thermocouple Protection Tube', 'Ultra-High Temp', '99.8%', '2758 degC', '&#8377;860 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BHEL HfO2 TC protect'],
    ['HFO-A2412', 'B24-HFO-012', 'Visakhapatnam', 'Vizag Chemicals', 'HfO2 99.85% Submarine Radiation Shielding Tile', 'Gamma Attenuation', '99.85%', '2758 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK rad shield'],
    ['HFO-A2413', 'B24-HFO-013', 'Balasore', 'DRDO TBRL', 'HfO2 99.95% Hypersonic Vehicle Leading Edge', 'Mach 7+ TPS Tile', '99.95%', '2758 degC', '&#8377;980 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV HfO2 TPS'],
    ['HFO-A2414', 'B24-HFO-014', 'Bhilai', 'SAIL Chemicals', 'HfO2 98.0% General Industrial Grade', 'Refractory Oxide', '98.0%', '2758 degC', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL HfO2 refractory'],
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


# --- Generate Lead Zirconate ---
pbz_config = {
    'prefix': 'pbz', 'icon': 'BrickWall', 'color': '#4338ca',
    'title': 'Lead Zirconate Logistics',
    'subtitle': 'PbZrO3 FeRAM ferroelectric &#8226; Submarine sonar piezo &#8226; PZT actuator &#8226; Towed array hydrophone supply chain',
    'fn_name': 'LeadZirconateLogisticsView',
}
with open('src/components/modules/lead-zirconate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(pbz_records, pbz_config))
print("Generated: lead-zirconate-logistics-view.tsx")

# --- Generate Hafnium Dioxide ---
hfo_config = {
    'prefix': 'hfo', 'icon': 'Briefcase', 'color': '#7c2d12',
    'title': 'Hafnium Dioxide Logistics',
    'subtitle': 'HfO2 gate oxide &#8226; DRAM capacitor &#8226; Submarine reactor &#8226; Hypersonic TPS supply chain',
    'fn_name': 'HafniumDioxideLogisticsView',
}
with open('src/components/modules/hafnium-dioxide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(hfo_records, hfo_config))
print("Generated: hafnium-dioxide-logistics-view.tsx")

for fname in ['src/components/modules/lead-zirconate-logistics-view.tsx', 'src/components/modules/hafnium-dioxide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
    print(f"  Lines: {c.count(chr(10))+1}")
