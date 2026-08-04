#!/usr/bin/env python3
"""R457 Generator: Cadmium Metal Logistics + Magnesium Metal Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Cadmium Metal: Cd ---
# Prefix: cdm, Icon: Lock, Color: #ca8a04 (yellow-dark), density 8.65 g/cm3
cdm_records = [
    ['CDM-A2401', 'B24-CDM-001', 'Mumbai', 'MIDHANI', 'Cd 99.99% NiCd Aircraft Battery', 'Emergency Power', '99.99%', '8.65 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'HAL HPT-32 NiCd standby'],
    ['CDM-A2402', 'B24-CDM-002', 'Bengaluru', 'DRDO DMRL', 'Cd 99.95% CdTe Thin-Film Solar', 'Photovoltaic', '99.95%', '8.65 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'Tata Power CdTe module'],
    ['CDM-A2403', 'B24-CDM-003', 'Hyderabad', 'Tata Chemicals', 'Cd 99.9% CdS Pigment Yellow', 'Ceramic Glaze', '99.9%', '8.65 g/cm3', '&#8377;800 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Morbi CdS yellow glaze'],
    ['CDM-A2404', 'B24-CDM-004', 'Chennai', 'Bharat Forge', 'Cd 99.5% Electroplating Anode', 'Corrosion Coat', '99.5%', '8.65 g/cm3', '&#8377;740 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Bharat Benz Cd plate fastener'],
    ['CDM-A2405', 'B24-CDM-005', 'Kolkata', 'Shyam Chemicals', 'Cd 99.85% CdSe Quantum Dot', 'QD Display', '99.85%', '8.65 g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Samsung QD-OLED CdSe'],
    ['CDM-A2406', 'B24-CDM-006', 'Noida', 'BHEL R&amp;D', 'Cd 99.8% Nuclear Reactor Control Rod', 'Ag-In-Cd Alloy', '99.8%', '8.65 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'NPCIL Tarapur AIC shim'],
    ['CDM-A2407', 'B24-CDM-007', 'Pune', 'Godrej Chemicals', 'Cd 99.93% Cadmium Stearate PVC Stabilizer', 'Pipe Extrusion', '99.93%', '8.65 g/cm3', '&#8377;820 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Finolex PVC Cd stabilizer'],
    ['CDM-A2408', 'B24-CDM-008', 'Jaipur', 'Rajasthan Chemicals', 'Cd 99.0% Bearing Alloy', 'Sleeve Bearing', '99.0%', '8.65 g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Rajasthan engine bearing'],
    ['CDM-A2409', 'B24-CDM-009', 'Guwahati', 'Assam Chemicals', 'Cd 99.7% Low-Melting Fusible Alloy', 'Fire Sprinkler', '99.7%', '8.65 g/cm3', '&#8377;780 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Honeywell Bi-Cd fusible'],
    ['CDM-A2410', 'B24-CDM-010', 'Ahmedabad', 'Gujarat Chemicals', 'Cd 99.99% Infrared Photodetector', 'HgCdTe Array', '99.99%', '8.65 g/cm3', '&#8377;940 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'DRDO thermal Imager MCT'],
    ['CDM-A2411', 'B24-CDM-011', 'Lucknow', 'UP Chemicals', 'Cd 99.3% Silver-Cadmium Oxide Contact', 'Relay Switch', '99.3%', '8.65 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'L&amp;T Ag-CdO relay contact'],
    ['CDM-A2412', 'B24-CDM-012', 'Visakhapatnam', 'Vizag Chemicals', 'Cd 99.95% Submarine Battery NiCd', 'Naval Propulsion', '99.95%', '8.65 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK NiCd bank'],
    ['CDM-A2413', 'B24-CDM-013', 'Balasore', 'DRDO TBRL', 'Cd 99.8% Warship Smoke Screening', 'CdO Obscurant', '99.8%', '8.65 g/cm3', '&#8377;880 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval CdO smoke'],
    ['CDM-A2414', 'B24-CDM-014', 'Bhilai', 'SAIL Chemicals', 'Cd 97% General Electroplating', 'Decorative Coat', '97.0%', '8.65 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL hardware Cd plate'],
]

# --- Magnesium Metal: Mg ---
# Prefix: mgm, Icon: Plane, Color: #059669 (emerald-dark), density 1.74 g/cm3
mgm_records = [
    ['MGM-A2401', 'B24-MGM-001', 'Mumbai', 'MIDHANI', 'Mg 99.95% Aerospace Alloy Sheet', 'Fighter Fuselage', '99.95%', '1.74 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Tejas Mk2 Mg-Li skin panel'],
    ['MGM-A2402', 'B24-MGM-002', 'Bengaluru', 'DRDO DMRL', 'Mg 99.9% Rocket Airframe', 'Lightweight Structure', '99.9%', '1.74 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'DRDO Pralay Mg airframe'],
    ['MGM-A2403', 'B24-MGM-003', 'Hyderabad', 'Tata Chemicals', 'Mg 99.8% Die-Cast Engine Block', 'Auto Lightweight', '99.8%', '1.74 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Mahindra Mg engine cradle'],
    ['MGM-A2404', 'B24-MGM-004', 'Chennai', 'Bharat Forge', 'Mg 99.5% Wheel Rim Forging', 'Alloy Wheel', '99.5%', '1.74 g/cm3', '&#8377;780 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Bajaj Mg alloy wheel'],
    ['MGM-A2405', 'B24-MGM-005', 'Kolkata', 'Shyam Chemicals', 'Mg 99.85% Grignard Reagent', 'Pharmaceutical', '99.85%', '1.74 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Sun Pharma Mg Grignard'],
    ['MGM-A2406', 'B24-MGM-006', 'Noida', 'BHEL R&amp;D', 'Mg 99.7% Desulfurization Agent', 'Iron Steel', '99.7%', '1.74 g/cm3', '&#8377;780 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'SAIL LD converter Mg desulf'],
    ['MGM-A2407', 'B24-MGM-007', 'Pune', 'Godrej Chemicals', 'Mg 99.93% AZ91D Gearbox Housing', 'Transmission', '99.93%', '1.74 g/cm3', '&#8377;860 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Tata Mg gearbox casing'],
    ['MGM-A2408', 'B24-MGM-008', 'Jaipur', 'Rajasthan Chemicals', 'Mg 99.0% Fireworks Flare Composition', 'Signal Pyro', '99.0%', '1.74 g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'OFB signal flare Mg ribbon'],
    ['MGM-A2409', 'B24-MGM-009', 'Guwahati', 'Assam Chemicals', 'Mg 99.6% Sacrificial Anode', 'Pipeline CP', '99.6%', '1.74 g/cm3', '&#8377;760 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IOCL pipeline Mg anode'],
    ['MGM-A2410', 'B24-MGM-010', 'Ahmedabad', 'Gujarat Chemicals', 'Mg 99.95% WE43 Biomedical Implant', 'Orthopedic Pin', '99.95%', '1.74 g/cm3', '&#8377;940 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'AIIMS biodegradable Mg pin'],
    ['MGM-A2411', 'B24-MGM-011', 'Lucknow', 'UP Chemicals', 'Mg 99.4% Laptop Chassis', 'Ultrabook Frame', '99.4%', '1.74 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Dell Mg-Li laptop lid'],
    ['MGM-A2412', 'B24-MGM-012', 'Visakhapatnam', 'Vizag Chemicals', 'Mg 99.9% Submarine Torpedo Hull', 'Lightweight Frame', '99.9%', '1.74 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy lightweight torpedo'],
    ['MGM-A2413', 'B24-MGM-013', 'Balasore', 'DRDO TBRL', 'Mg 99.8% Warship Decoy Flare', 'IR Countermeasure', '99.8%', '1.74 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval chaff Mg flare'],
    ['MGM-A2414', 'B24-MGM-014', 'Bhilai', 'SAIL Chemicals', 'Mg 97% General Alloy Ingot', 'Die-Casting', '97.0%', '1.74 g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Mg alloy ingot'],
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


# --- Generate Cadmium Metal ---
cdm_config = {
    'prefix': 'cdm', 'icon': 'Lock', 'color': '#ca8a04',
    'title': 'Cadmium Metal Logistics',
    'subtitle': 'Cd NiCd battery &#8226; CdTe solar &#8226; QD display &#8226; Submarine NiCd propulsion supply chain',
    'fn_name': 'CadmiumMetalLogisticsView',
}
with open('src/components/modules/cadmium-metal-logistics-view.tsx', 'w') as f:
    f.write(gen_module(cdm_records, cdm_config))
print("Generated: cadmium-metal-logistics-view.tsx")

# --- Generate Magnesium Metal ---
mgm_config = {
    'prefix': 'mgm', 'icon': 'Plane', 'color': '#059669',
    'title': 'Magnesium Metal Logistics',
    'subtitle': 'Mg aerospace alloy &#8226; Die-cast engine &#8226; Desulfurization &#8226; Submarine torpedo hull supply chain',
    'fn_name': 'MagnesiumMetalLogisticsView',
}
with open('src/components/modules/magnesium-metal-logistics-view.tsx', 'w') as f:
    f.write(gen_module(mgm_records, mgm_config))
print("Generated: magnesium-metal-logistics-view.tsx")

# --- Verify ---
for fname in ['src/components/modules/cadmium-metal-logistics-view.tsx', 'src/components/modules/magnesium-metal-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
