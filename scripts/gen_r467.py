#!/usr/bin/env python3
"""R467 Generator: Aluminum Nitride Logistics + Samarium Cobalt Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Aluminum Nitride: AlN ---
# Prefix: aln, Icon: Printer, Color: #0369a1 (sky-dark), MP 2200 degC, density 3.26 g/cm3
aln_records = [
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
    ['ALN-A2414', 'B24-ALN-014', 'Bhilai', 'SAIL Chemicals', 'AlN 98.0% General Industrial Grade', 'Refractory Ceramic', '98.0%', '2200 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL AlN refractory'],
]

# --- Samarium Cobalt: SmCo ---
# Prefix: smc, Icon: Octagon, Color: #9f1239 (rose-dark), MP 1350 degC (Curie), density 8.40 g/cm3
smc_records = [
    ['SMC-A2401', 'B24-SMC-001', 'Mumbai', 'MIDHANI', 'SmCo 99.9% Fighter Jet Actuator Motor', 'Flight Control Servo', '99.9%', '8.40 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'HAL Tejas SmCo servo'],
    ['SMC-A2402', 'B24-SMC-002', 'Bengaluru', 'DRDO DMRL', 'SmCo 99.95% Space Satellite Reaction Wheel', 'Attitude Control', '99.95%', '8.40 g/cm3', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'ISRO SmCo reaction wheel'],
    ['SMC-A2403', 'B24-SMC-003', 'Hyderabad', 'Tata Chemicals', 'SmCo 99.7% Submarine Torpedo Propulsion Motor', 'Lightweight EM Drive', '99.7%', '8.40 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'NPOL torpedo SmCo motor'],
    ['SMC-A2404', 'B24-SMC-004', 'Chennai', 'Bharat Forge', 'SmCo 99.85% Warship Electric Propulsion Motor', 'IEP Permanent Mag', '99.85%', '8.40 g/cm3', '&#8377;960 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'GRSE IEP SmCo motor'],
    ['SMC-A2405', 'B24-SMC-005', 'Kolkata', 'Shyam Chemicals', 'SmCo 99.3% MRI Gradient Coil Magnet', 'Medical Imaging', '99.3%', '8.40 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Wipro GE MRI SmCo'],
    ['SMC-A2406', 'B24-SMC-006', 'Noida', 'BHEL R&amp;D', 'SmCo 99.8% Wind Turbine Direct Drive Gen', '5MW Offshore Rotor', '99.8%', '8.40 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Suzlon SmCo DD gen'],
    ['SMC-A2407', 'B24-SMC-007', 'Pune', 'Godrej Chemicals', 'SmCo 99.0% EV Traction Motor Rotor', 'Permanent Mag Sync', '99.0%', '8.40 g/cm3', '&#8377;840 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Tata Motors SmCo rotor'],
    ['SMC-A2408', 'B24-SMC-008', 'Jaipur', 'Rajasthan Chemicals', 'SmCo 99.6% Missile Seeker Gyroscope Motor', 'Precision Inertial', '99.6%', '8.40 g/cm3', '&#8377;920 Cr', 'delivered', 'critical', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'DRDO Astra SmCo gyro'],
    ['SMC-A2409', 'B24-SMC-009', 'Guwahati', 'Assam Chemicals', 'SmCo 99.92% Defense Radar Travelling Wave Tube', 'Klystron Magnet', '99.92%', '8.40 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'BEL radar SmCo TWT'],
    ['SMC-A2410', 'B24-SMC-010', 'Ahmedabad', 'Gujarat Chemicals', 'SmCo 99.4% Industrial Servo Motor Magnet', 'CNC Robot Arm', '99.4%', '8.40 g/cm3', '&#8377;800 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Bosch SmCo servo mag'],
    ['SMC-A2411', 'B24-SMC-011', 'Lucknow', 'UP Chemicals', 'SmCo 99.8% Aerospace Generator Starter', 'APU Magnetic', '99.8%', '8.40 g/cm3', '&#8377;880 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'HAL APU SmCo starter'],
    ['SMC-A2412', 'B24-SMC-012', 'Visakhapatnam', 'Vizag Chemicals', 'SmCo 99.85% Submarine Periscope Rotary Motor', 'Optronic Mast Drive', '99.85%', '8.40 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK mast motor'],
    ['SMC-A2413', 'B24-SMC-013', 'Balasore', 'DRDO TBRL', 'SmCo 99.95% Hypersonic Missile Guidance Sys', 'Mach 7+ Seeker', '99.95%', '8.40 g/cm3', '&#8377;980 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV SmCo guid'],
    ['SMC-A2414', 'B24-SMC-014', 'Bhilai', 'SAIL Chemicals', 'SmCo 98.0% General Industrial Grade', 'Process Magnet', '98.0%', '8.40 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL SmCo mag scrap'],
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


# --- Generate Aluminum Nitride ---
aln_config = {
    'prefix': 'aln', 'icon': 'Printer', 'color': '#0369a1',
    'title': 'Aluminum Nitride Logistics',
    'subtitle': 'AlN GaN-on-AlN substrate &#8226; UV LED &#8226; Submarine sonar &#8226; Hypersonic TPS supply chain',
    'fn_name': 'AluminumNitrideLogisticsView',
}
with open('src/components/modules/aluminum-nitride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(aln_records, aln_config))
print("Generated: aluminum-nitride-logistics-view.tsx")

# --- Generate Samarium Cobalt ---
smc_config = {
    'prefix': 'smc', 'icon': 'Octagon', 'color': '#9f1239',
    'title': 'Samarium Cobalt Logistics',
    'subtitle': 'SmCo fighter servo &#8226; Satellite reaction wheel &#8226; Submarine motor &#8226; Hypersonic guidance supply chain',
    'fn_name': 'SamariumCobaltLogisticsView',
}
with open('src/components/modules/samarium-cobalt-logistics-view.tsx', 'w') as f:
    f.write(gen_module(smc_records, smc_config))
print("Generated: samarium-cobalt-logistics-view.tsx")

# --- Verify colon typo ---
for fname in ['src/components/modules/aluminum-nitride-logistics-view.tsx', 'src/components/modules/samarium-cobalt-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
    lines = c.count('\n') + 1
    print(f"  Lines: {lines}")
