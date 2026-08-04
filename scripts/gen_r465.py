#!/usr/bin/env python3
"""R465 Generator: Niobium Pentoxide Logistics + Germanium Dioxide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Niobium Pentoxide: Nb2O5 ---
# Prefix: nbp, Icon: Pentagon, Color: #7e22ce (purple), MP 1512 degC, density 4.60 g/cm3
nbp_records = [
    ['NBP-A2401', 'B24-NBP-001', 'Mumbai', 'MIDHANI', 'Nb2O5 99.9% MLCC Capacitor Dielectric', 'High-K Passive', '99.9%', '1512 degC', '&#8377;880 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Murata Nb2O5 MLCC dielec'],
    ['NBP-A2402', 'B24-NBP-002', 'Bengaluru', 'DRDO DMRL', 'Nb2O5 99.95% Lithium Niobate Substrate', 'Electro-Optic Crystal', '99.95%', '1512 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc LiNbO3 SAW device'],
    ['NBP-A2403', 'B24-NBP-003', 'Hyderabad', 'Tata Chemicals', 'Nb2O5 99.7% Optical Lens Anti-Reflective Coat', 'Defense Thermal IR', '99.7%', '1512 degC', '&#8377;820 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'BEL Optronic IR AR coat'],
    ['NBP-A2404', 'B24-NBP-004', 'Chennai', 'Bharat Forge', 'Nb2O5 99.85% Solid-State Battery Electrolyte', 'Na-Ion Cathode', '99.85%', '1512 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IIT-M Na-ion Nb cathode'],
    ['NBP-A2405', 'B24-NBP-005', 'Kolkata', 'Shyam Chemicals', 'Nb2O5 99.3% Ferroelectric Memory Capacitor', 'FeRAM Storage', '99.3%', '1512 degC', '&#8377;800 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'IIT-K FeRAM Nb2O5 cell'],
    ['NBP-A2406', 'B24-NBP-006', 'Noida', 'BHEL R&amp;D', 'Nb2O5 99.8% Submarine Sonar Piezo Transducer', 'Acoustic Underwater', '99.8%', '1512 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'NPOL sonar Nb piezo'],
    ['NBP-A2407', 'B24-NBP-007', 'Pune', 'Godrej Chemicals', 'Nb2O5 99.0% Catalytic Exhaust Catalyst', 'Petrochemical DeNOx', '99.0%', '1512 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'RIL refinery Nb catalyst'],
    ['NBP-A2408', 'B24-NBP-008', 'Jaipur', 'Rajasthan Chemicals', 'Nb2O5 99.6% Warship Laser Rangefinder Window', 'LIDAR Optic', '99.6%', '1512 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BEL Naval laser Nb glass'],
    ['NBP-A2409', 'B24-NBP-009', 'Guwahati', 'Assam Chemicals', 'Nb2O5 99.92% Superconducting RF Cavity', 'Particle Accelerator', '99.92%', '1512 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IISc SRF Nb2O5 cavity'],
    ['NBP-A2410', 'B24-NBP-010', 'Ahmedabad', 'Gujarat Chemicals', 'Nb2O5 99.4% Fiber Bragg Grating Sensor', 'Structural Monitor', '99.4%', '1512 degC', '&#8377;780 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Sterlite FBG Nb doped'],
    ['NBP-A2411', 'B24-NBP-011', 'Lucknow', 'UP Chemicals', 'Nb2O5 99.8% LED Blue Phosphor Host', 'Display Backlight', '99.8%', '1512 degC', '&#8377;840 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Dixon LED Nb phosphor'],
    ['NBP-A2412', 'B24-NBP-012', 'Visakhapatnam', 'Vizag Chemicals', 'Nb2O5 99.85% Submarine Torpedo Guidance Gyro', 'INS Navigation', '99.85%', '1512 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy torpedo INS gyro'],
    ['NBP-A2413', 'B24-NBP-013', 'Balasore', 'DRDO TBRL', 'Nb2O5 99.95% Hypersonic TPS Ceramic Tile', 'Re-Entry Shield', '99.95%', '1512 degC', '&#8377;980 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV Nb2O5 TPS'],
    ['NBP-A2414', 'B24-NBP-014', 'Bhilai', 'SAIL Chemicals', 'Nb2O5 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '1512 degC', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Nb2O5 refractory'],
]

# --- Germanium Dioxide: GeO2 ---
# Prefix: ged, Icon: Cylinder, Color: #ca8a04 (yellow-dark), MP 1116 degC, density 4.23 g/cm3
ged_records = [
    ['GED-A2401', 'B24-GED-001', 'Mumbai', 'MIDHANI', 'GeO2 99.9% Infrared Optical Lens Element', 'Thermal Imaging', '99.9%', '1116 degC', '&#8377;860 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BEL IR GeO2 lens blank'],
    ['GED-A2402', 'B24-GED-002', 'Bengaluru', 'DRDO DMRL', 'GeO2 99.95% Fiber Optic Core Preform', 'Telecom DWDM', '99.95%', '1116 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'Sterlite GeO2 fiber preform'],
    ['GED-A2403', 'B24-GED-003', 'Hyderabad', 'Tata Chemicals', 'GeO2 99.7% Polymerization Catalyst PE', 'Plastic Resin', '99.7%', '1116 degC', '&#8377;800 Cr', 'in-transit', 'medium', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'RIL GeO2 PE catalyst'],
    ['GED-A2404', 'B24-GED-004', 'Chennai', 'Bharat Forge', 'GeO2 99.85% Gamma-Ray Detector Crystal', 'Nuclear Medicine', '99.85%', '1116 degC', '&#8377;920 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BRIT GeO2 HPGe detector'],
    ['GED-A2405', 'B24-GED-005', 'Kolkata', 'Shyam Chemicals', 'GeO2 99.3% Phosphor LED Yellow Emitter', 'Display YAG:Ce', '99.3%', '1116 degC', '&#8377;780 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Dixon LED GeO2 phosphor'],
    ['GED-A2406', 'B24-GED-006', 'Noida', 'BHEL R&amp;D', 'GeO2 99.8% Submarine Periscope IR Window', 'Optronic Mast', '99.8%', '1116 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Mazagon Dock sub periscope'],
    ['GED-A2407', 'B24-GED-007', 'Pune', 'Godrej Chemicals', 'GeO2 99.0% Silicone Rubber Reinforce', 'HV Insulator', '99.0%', '1116 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'ABB GeO2 silicone insul'],
    ['GED-A2408', 'B24-GED-008', 'Jaipur', 'Rajasthan Chemicals', 'GeO2 99.6% Warship Thermal Imaging FLIR', 'Naval EO Sensor', '99.6%', '1116 degC', '&#8377;900 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'BEL Naval FLIR GeO2'],
    ['GED-A2409', 'B24-GED-009', 'Guwahati', 'Assam Chemicals', 'GeO2 99.92% 5G Photonic Transceiver Chip', 'Optical Interconnect', '99.92%', '1116 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G 5G GeO2 photonics'],
    ['GED-A2410', 'B24-GED-010', 'Ahmedabad', 'Gujarat Chemicals', 'GeO2 99.4% Solar Cell Anti-Reflective Coat', 'PV Panel Boost', '99.4%', '1116 degC', '&#8377;760 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Adani Solar GeO2 AR coat'],
    ['GED-A2411', 'B24-GED-011', 'Lucknow', 'UP Chemicals', 'GeO2 99.8% Semiconductor Strain Gauge', 'Structural Health', '99.8%', '1116 degC', '&#8377;840 Cr', 'delivered', 'high', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'GE Aviation strain gauge'],
    ['GED-A2412', 'B24-GED-012', 'Visakhapatnam', 'Vizag Chemicals', 'GeO2 99.85% Submarine Hull Sonar Dome', 'Acoustic Transparent', '99.85%', '1116 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK sonar dome'],
    ['GED-A2413', 'B24-GED-013', 'Balasore', 'DRDO TBRL', 'GeO2 99.95% Cherenkov Radiation Detector', 'Particle Physics', '99.95%', '1116 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'IISc GeO2 Cherenkov det'],
    ['GED-A2414', 'B24-GED-014', 'Bhilai', 'SAIL Chemicals', 'GeO2 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '1116 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL GeO2 optical blank'],
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


# --- Generate Niobium Pentoxide ---
nbp_config = {
    'prefix': 'nbp', 'icon': 'Pentagon', 'color': '#7e22ce',
    'title': 'Niobium Pentoxide Logistics',
    'subtitle': 'Nb2O5 MLCC dielectric &#8226; LiNbO3 substrate &#8226; Submarine sonar &#8226; Hypersonic TPS supply chain',
    'fn_name': 'NiobiumPentoxideLogisticsView',
}
with open('src/components/modules/niobium-pentoxide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(nbp_records, nbp_config))
print("Generated: niobium-pentoxide-logistics-view.tsx")

# --- Generate Germanium Dioxide ---
ged_config = {
    'prefix': 'ged', 'icon': 'Cylinder', 'color': '#ca8a04',
    'title': 'Germanium Dioxide Logistics',
    'subtitle': 'GeO2 IR optical lens &#8226; Fiber optic preform &#8226; Submarine periscope &#8226; 5G photonics supply chain',
    'fn_name': 'GermaniumDioxideLogisticsView',
}
with open('src/components/modules/germanium-dioxide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(ged_records, ged_config))
print("Generated: germanium-dioxide-logistics-view.tsx")

# --- Verify colon typo ---
for fname in ['src/components/modules/niobium-pentoxide-logistics-view.tsx', 'src/components/modules/germanium-dioxide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
    lines = c.count('\n') + 1
    print(f"  Lines: {lines}")
