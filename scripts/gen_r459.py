#!/usr/bin/env python3
"""R459 Generator: Cobalt Carbonate Logistics + Zinc Sulfate Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Cobalt Carbonate: CoCO3 ---
# Prefix: cbc, Icon: Heart, Color: #1d4ed8 (cobalt-blue), density 4.13 g/cm3
cbc_records = [
    ['CBC-A2401', 'B24-CBC-001', 'Mumbai', 'MIDHANI', 'CoCO3 99.9% Li-Ion Battery Precursor', 'NMC Cathode', '99.9%', '4.13 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Exide NMC-622 Li cell'],
    ['CBC-A2402', 'B24-CBC-002', 'Bengaluru', 'DRDO DMRL', 'CoCO3 99.95% Superalloy Binder', 'Jet Engine Turbine', '99.95%', '4.13 g/cm3', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HAL Tejas Ni-Co blade'],
    ['CBC-A2403', 'B24-CBC-003', 'Hyderabad', 'Tata Chemicals', 'CoCO3 99.5% Ceramic Pigment Blue', 'Glass Enamel', '99.5%', '4.13 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Corning Co-blue glass frit'],
    ['CBC-A2404', 'B24-CBC-004', 'Chennai', 'Bharat Forge', 'CoCO3 99.7% Hardmetal WC-Co Binder', 'Cutting Insert', '99.7%', '4.13 g/cm3', '&#8377;880 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Sandvik WC-Co carbide'],
    ['CBC-A2405', 'B24-CBC-005', 'Kolkata', 'Shyam Chemicals', 'CoCO3 99.85% Animal Feed Trace Mineral', 'Cattle Supplement', '99.85%', '4.13 g/cm3', '&#8377;740 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Amul dairy Co premix'],
    ['CBC-A2406', 'B24-CBC-006', 'Noida', 'BHEL R&amp;D', 'CoCO3 99.3% Magnetic Alloy Alnico', 'Permanent Magnet', '99.3%', '4.13 g/cm3', '&#8377;800 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL generator Alnico mag'],
    ['CBC-A2407', 'B24-CBC-007', 'Pune', 'Godrej Chemicals', 'CoCO3 99.8% Catalyst petroleum Hydro-Desulf', 'Refinery Co-Mo', '99.8%', '4.13 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'IOC Vadodara Co-Mo HDS'],
    ['CBC-A2408', 'B24-CBC-008', 'Jaipur', 'Rajasthan Chemicals', 'CoCO3 99.0% Electroplating Anode', 'Decorative Coat', '99.0%', '4.13 g/cm3', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Rajasthan Co bright plate'],
    ['CBC-A2409', 'B24-CBC-009', 'Guwahati', 'Assam Chemicals', 'CoCO3 99.6% Rubber Adhesion Promoter', 'Tyre Cord Bond', '99.6%', '4.13 g/cm3', '&#8377;760 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'MRF brass Co-plated tyre'],
    ['CBC-A2410', 'B24-CBC-010', 'Ahmedabad', 'Gujarat Chemicals', 'CoCO3 99.92% EV Battery NCM-811', 'High-Ni Cathode', '99.92%', '4.13 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Ola Electric NCM-811 pack'],
    ['CBC-A2411', 'B24-CBC-011', 'Lucknow', 'UP Chemicals', 'CoCO3 99.4% Polyester Dye Catalyst', 'Textile Blue', '99.4%', '4.13 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Bhilwara Co-blue dye mord'],
    ['CBC-A2412', 'B24-CBC-012', 'Visakhapatnam', 'Vizag Chemicals', 'CoCO3 99.95% Submarine Sonar Magnet', 'Alnico Sensor', '99.95%', '4.13 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK sonar Alnico'],
    ['CBC-A2413', 'B24-CBC-013', 'Balasore', 'DRDO TBRL', 'CoCO3 99.8% Warship Gas Turbine Blade', 'Ni-Co Superalloy', '99.8%', '4.13 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval LM2500 Co blade'],
    ['CBC-A2414', 'B24-CBC-014', 'Bhilai', 'SAIL Chemicals', 'CoCO3 97.5% General Industrial Grade', 'Alloy Additive', '97.5%', '4.13 g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL steel Co charge'],
]

# --- Zinc Sulfate: ZnSO4 ---
# Prefix: zns, Icon: Map, Color: #0e7490 (cyan), density 3.54 g/cm3
zns_records = [
    ['ZNS-A2401', 'B24-ZNS-001', 'Mumbai', 'MIDHANI', 'ZnSO4 99.5% Agricultural Micronutrient', 'Crop Fertilizer', '99.5%', '3.54 g/cm3', '&#8377;800 Cr', 'in-transit', 'high', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'IFFCO Zn foliar spray'],
    ['ZNS-A2402', 'B24-ZNS-002', 'Bengaluru', 'DRDO DMRL', 'ZnSO4 99.9% Zn-Ion Battery Electrolyte', 'Aqueous Zn Cell', '99.9%', '3.54 g/cm3', '&#8377;920 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc Zn-ion pouch cell'],
    ['ZNS-A2403', 'B24-ZNS-003', 'Hyderabad', 'Tata Chemicals', 'ZnSO4 99.3% Animal Feed Supplement', 'Poultry Mineral', '99.3%', '3.54 g/cm3', '&#8377;720 Cr', 'in-transit', 'medium', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Venkateshwara Zn feed'],
    ['ZNS-A2404', 'B24-ZNS-004', 'Chennai', 'Bharat Forge', 'ZnSO4 99.7% Galvanizing Zinc Bath Makeup', 'Hot-Dip Galv', '99.7%', '3.54 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'SAIL HDG bath replenish'],
    ['ZNS-A2405', 'B24-ZNS-005', 'Kolkata', 'Shyam Chemicals', 'ZnSO4 99.0% Water Treatment Coagulant', 'Municipal WTP', '99.0%', '3.54 g/cm3', '&#8377;700 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Kolkata ZWC flocculant'],
    ['ZNS-A2406', 'B24-ZNS-006', 'Noida', 'BHEL R&amp;D', 'ZnSO4 99.8% Rayon Viscose Spin Bath', 'Textile Fiber', '99.8%', '3.54 g/cm3', '&#8377;820 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Grasim Viscose ZnSO4 bath'],
    ['ZNS-A2407', 'B24-ZNS-007', 'Pune', 'Godrej Chemicals', 'ZnSO4 99.6% Zinc Plating Electrolyte', 'Electrogalvanize', '99.6%', '3.54 g/cm3', '&#8377;840 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Tata Steel Zn electroplate'],
    ['ZNS-A2408', 'B24-ZNS-008', 'Jaipur', 'Rajasthan Chemicals', 'ZnSO4 99.1% Wood Preservative', 'Timber Treatment', '99.1%', '3.54 g/cm3', '&#8377;680 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Rajasthan CCA Zn treat'],
    ['ZNS-A2409', 'B24-ZNS-009', 'Guwahati', 'Assam Chemicals', 'ZnSO4 99.4% Fungicide Zineb/Ziram', 'Agrochemical', '99.4%', '3.54 g/cm3', '&#8377;740 Cr', 'in-transit', 'medium', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'UPL Zineb fungicide'],
    ['ZNS-A2410', 'B24-ZNS-010', 'Ahmedabad', 'Gujarat Chemicals', 'ZnSO4 99.85% Lithium Battery Zn Anode', 'Zn-Li Hybrid', '99.85%', '3.54 g/cm3', '&#8377;940 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc Zn-Li prototype'],
    ['ZNS-A2411', 'B24-ZNS-011', 'Lucknow', 'UP Chemicals', 'ZnSO4 99.2% Dental Cement Zinc Phosphate', 'Dental Filling', '99.2%', '3.54 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Dental ZnPO4 cement'],
    ['ZNS-A2412', 'B24-ZNS-012', 'Visakhapatnam', 'Vizag Chemicals', 'ZnSO4 99.9% Submarine Zinc Anode CP', 'Hull Protection', '99.9%', '3.54 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK Zn anode plate'],
    ['ZNS-A2413', 'B24-ZNS-013', 'Balasore', 'DRDO TBRL', 'ZnSO4 99.7% Warship Smoke Screening', 'HC Smoke ZnO', '99.7%', '3.54 g/cm3', '&#8377;880 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval ZnO smoke'],
    ['ZNS-A2414', 'B24-ZNS-014', 'Bhilai', 'SAIL Chemicals', 'ZnSO4 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '3.54 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL ZnSO4 pickle liquor'],
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


# --- Generate Cobalt Carbonate ---
cbc_config = {
    'prefix': 'cbc', 'icon': 'Heart', 'color': '#1d4ed8',
    'title': 'Cobalt Carbonate Logistics',
    'subtitle': 'CoCO3 NMC cathode &#8226; Superalloy binder &#8226; Ceramic pigment &#8226; Submarine sonar magnet supply chain',
    'fn_name': 'CobaltCarbonateLogisticsView',
}
with open('src/components/modules/cobalt-carbonate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(cbc_records, cbc_config))
print("Generated: cobalt-carbonate-logistics-view.tsx")

# --- Generate Zinc Sulfate ---
zns_config = {
    'prefix': 'zns', 'icon': 'Map', 'color': '#0e7490',
    'title': 'Zinc Sulfate Logistics',
    'subtitle': 'ZnSO4 fertilizer &#8226; Zn-ion battery &#8226; Galvanizing bath &#8226; Submarine hull CP supply chain',
    'fn_name': 'ZincSulfateLogisticsView',
}
with open('src/components/modules/zinc-sulfate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(zns_records, zns_config))
print("Generated: zinc-sulfate-logistics-view.tsx")

# --- Verify ---
for fname in ['src/components/modules/cobalt-carbonate-logistics-view.tsx', 'src/components/modules/zinc-sulfate-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
