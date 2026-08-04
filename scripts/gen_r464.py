#!/usr/bin/env python3
"""R464 Generator: Molybdenum Sulfide Logistics + Tantalum Pentoxide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Molybdenum Sulfide: MoS2 ---
# Prefix: mos, Icon: Copy, Color: #0f766e (teal-dark), MP 1185 degC
mos_records = [
    ['MOS-A2401', 'B24-MOS-001', 'Mumbai', 'MIDHANI', 'MoS2 99.5% Solid Lubricant Coating', 'High-Temp Bearing', '99.5%', '1185 degC', '&#8377;820 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'SKF India MoS2 bearing coat'],
    ['MOS-A2402', 'B24-MOS-002', 'Bengaluru', 'DRDO DMRL', 'MoS2 99.9% Semiconductor 2D TMD Channel', 'FET Transistor', '99.9%', '1185 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc MoS2 2D transistor'],
    ['MOS-A2403', 'B24-MOS-003', 'Hyderabad', 'Tata Chemicals', 'MoS2 99.7% Refinery HDS Catalyst', 'Hydrodesulfurize', '99.7%', '1185 degC', '&#8377;840 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'HPCL Visakh HDS catalyst'],
    ['MOS-A2404', 'B24-MOS-004', 'Chennai', 'Bharat Forge', 'MoS2 99.85% Aerospace Dry Film Lube', 'Satellite Mechanism', '99.85%', '1185 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'ISRO PSLV MoS2 dry lube'],
    ['MOS-A2405', 'B24-MOS-005', 'Kolkata', 'Shyam Chemicals', 'MoS2 99.3% Polymer Composite Filler', 'Self-Lube Nylon', '99.3%', '1185 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'RIL MoS2 nylon bush'],
    ['MOS-A2406', 'B24-MOS-006', 'Noida', 'BHEL R&amp;D', 'MoS2 99.8% Submarine Shaft Bearing Lube', 'Naval Propulsion', '99.8%', '1185 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Mazagon Dock shaft MoS2'],
    ['MOS-A2407', 'B24-MOS-007', 'Pune', 'Godrej Chemicals', 'MoS2 99.0% Li-Ion Battery Anode Alt', 'Graphite Replace', '99.0%', '1185 degC', '&#8377;800 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Exide MoS2 anode trial'],
    ['MOS-A2408', 'B24-MOS-008', 'Jaipur', 'Rajasthan Chemicals', 'MoS2 99.6% Warship Gun Barrel Lining', 'Anti-Galling Coat', '99.6%', '1185 degC', '&#8377;880 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'OFB Ordnance MoS2 bore'],
    ['MOS-A2409', 'B24-MOS-009', 'Guwahati', 'Assam Chemicals', 'MoS2 99.92% MEMS NEMS Resonator Film', 'Micro-Oscillator', '99.92%', '1185 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G MEMS MoS2 film'],
    ['MOS-A2410', 'B24-MOS-010', 'Ahmedabad', 'Gujarat Chemicals', 'MoS2 99.4% EP Gear Oil Additive', 'Extreme Pressure', '99.4%', '1185 degC', '&#8377;720 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Castrol EP MoS2 gear'],
    ['MOS-A2411', 'B24-MOS-011', 'Lucknow', 'UP Chemicals', 'MoS2 99.8% Wind Turbine Gearbox Grease', '5MW Blade Bearing', '99.8%', '1185 degC', '&#8377;860 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Suzlon MoS2 turbine gear'],
    ['MOS-A2412', 'B24-MOS-012', 'Visakhapatnam', 'Vizag Chemicals', 'MoS2 99.85% Submarine Propeller Bearing', 'Stealth Quiet Run', '99.85%', '1185 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK prop bearing'],
    ['MOS-A2413', 'B24-MOS-013', 'Balasore', 'DRDO TBRL', 'MoS2 99.95% Quantum Dot TMD Precursor', 'Optoelectronic QD', '99.95%', '1185 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO MoS2 quantum dot'],
    ['MOS-A2414', 'B24-MOS-014', 'Bhilai', 'SAIL Chemicals', 'MoS2 98.0% General Industrial Grade', 'Process Lubricant', '98.0%', '1185 degC', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL MoS2 wire drawing'],
]

# --- Tantalum Pentoxide: Ta2O5 ---
# Prefix: tpt, Icon: HandMetal, Color: #b91c1c (red-dark), MP 1872 degC
tpt_records = [
    ['TPT-A2401', 'B24-TPT-001', 'Mumbai', 'MIDHANI', 'Ta2O5 99.9% MLCC Capacitor Dielectric', '5G Telecom Passive', '99.9%', '1872 degC', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Murata MLCC Ta2O5 dielec'],
    ['TPT-A2402', 'B24-TPT-002', 'Bengaluru', 'DRDO DMRL', 'Ta2O5 99.95% DRAM Cell Capacitor Insulator', 'Memory Chip Oxide', '99.95%', '1872 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc DRAM Ta2O5 barrier'],
    ['TPT-A2403', 'B24-TPT-003', 'Hyderabad', 'Tata Chemicals', 'Ta2O5 99.7% Optical Anti-Reflective Coating', 'Defense Thermal IR', '99.7%', '1872 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'BEL Optronic IR lens'],
    ['TPT-A2404', 'B24-TPT-004', 'Chennai', 'Bharat Forge', 'Ta2O5 99.85% Aerospace Radar Absorber Tile', 'Stealth RAM Coat', '99.85%', '1872 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'DRDO ASTRA RAM Ta2O5'],
    ['TPT-A2405', 'B24-TPT-005', 'Kolkata', 'Shyam Chemicals', 'Ta2O5 99.3% SAW Filter Piezo Substrate', 'RF Front-End', '99.3%', '1872 degC', '&#8377;800 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'RFIL SAW Ta2O5 filter'],
    ['TPT-A2406', 'B24-TPT-006', 'Noida', 'BHEL R&amp;D', 'Ta2O5 99.8% Submarine Sonar Transducer Ceram', 'Acoustic Underwater', '99.8%', '1872 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'NPOL sonar Ta2O5 ceramic'],
    ['TPT-A2407', 'B24-TPT-007', 'Pune', 'Godrej Chemicals', 'Ta2O5 99.0% X-Ray CT Scintillator Pack', 'Medical Imaging', '99.0%', '1872 degC', '&#8377;780 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Wipro GE CT Ta2O5 pack'],
    ['TPT-A2408', 'B24-TPT-008', 'Jaipur', 'Rajasthan Chemicals', 'Ta2O5 99.6% Warship EW Jammer Phase Shifter', 'Naval ECM Module', '99.6%', '1872 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BEL Naval EW Ta2O5 phase'],
    ['TPT-A2409', 'B24-TPT-009', 'Guwahati', 'Assam Chemicals', 'Ta2O5 99.92% Superconducting Qubit CQED', 'Quantum Computing', '99.92%', '1872 degC', '&#8377;980 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IISc QC Ta2O5 qubit'],
    ['TPT-A2410', 'B24-TPT-010', 'Ahmedabad', 'Gujarat Chemicals', 'Ta2O5 99.4% Fiber Optic Coupler Lens', 'Telecom Passive', '99.4%', '1872 degC', '&#8377;760 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Sterlite Ta2O5 fiber lens'],
    ['TPT-A2411', 'B24-TPT-011', 'Lucknow', 'UP Chemicals', 'Ta2O5 99.8% LED Phosphor Host Substrate', 'Display Technology', '99.8%', '1872 degC', '&#8377;840 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Micromax LED Ta2O5 host'],
    ['TPT-A2412', 'B24-TPT-012', 'Visakhapatnam', 'Vizag Chemicals', 'Ta2O5 99.85% Submarine Torpedo Homing Sonar', 'Acoustic Seeker', '99.85%', '1872 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy torpedo Ta2O5'],
    ['TPT-A2413', 'B24-TPT-013', 'Balasore', 'DRDO TBRL', 'Ta2O5 99.95% Advanced Node Gate Oxide', 'Sub-5nm FET', '99.95%', '1872 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO semiconductor gate'],
    ['TPT-A2414', 'B24-TPT-014', 'Bhilai', 'SAIL Chemicals', 'Ta2O5 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '1872 degC', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Ta2O5 refractory'],
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


# --- Generate Molybdenum Sulfide ---
mos_config = {
    'prefix': 'mos', 'icon': 'Copy', 'color': '#0f766e',
    'title': 'Molybdenum Sulfide Logistics',
    'subtitle': 'MoS2 solid lubricant &#8226; Semiconductor 2D TMD &#8226; Submarine bearing &#8226; Aerospace dry film supply chain',
    'fn_name': 'MolybdenumSulfideLogisticsView',
}
with open('src/components/modules/molybdenum-sulfide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(mos_records, mos_config))
print("Generated: molybdenum-sulfide-logistics-view.tsx")

# --- Generate Tantalum Pentoxide ---
tpt_config = {
    'prefix': 'tpt', 'icon': 'HandMetal', 'color': '#b91c1c',
    'title': 'Tantalum Pentoxide Logistics',
    'subtitle': 'Ta2O5 MLCC dielectric &#8226; DRAM capacitor &#8226; Submarine sonar &#8226; Quantum qubit supply chain',
    'fn_name': 'TantalumPentoxideLogisticsView',
}
with open('src/components/modules/tantalum-pentoxide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(tpt_records, tpt_config))
print("Generated: tantalum-pentoxide-logistics-view.tsx")

# --- Verify colon typo ---
for fname in ['src/components/modules/molybdenum-sulfide-logistics-view.tsx', 'src/components/modules/tantalum-pentoxide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
    lines = c.count('\n') + 1
    print(f"  Lines: {lines}")
