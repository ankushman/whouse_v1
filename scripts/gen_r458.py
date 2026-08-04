#!/usr/bin/env python3
"""R458 Generator: Vanadium Metal Logistics + Manganese Sulfate Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Vanadium Metal: V ---
# Prefix: vam, Icon: GraduationCap, Color: #c2410c (rust/burnt-orange), density 6.0 g/cm3
vam_records = [
    ['VAM-A2401', 'B24-VAM-001', 'Mumbai', 'MIDHANI', 'V 99.9% HSLA Steel Alloy', 'Structural Rebar', '99.9%', '6.0 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'SAIL Vanadium-TiCr HSLA rebar'],
    ['VAM-A2402', 'B24-VAM-002', 'Bengaluru', 'DRDO DMRL', 'V 99.7% Aerospace Ti-6Al-4V', 'Jet Engine Blade', '99.7%', '6.0 g/cm3', '&#8377;940 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HAL Tejas LPTK Ti-V forge'],
    ['VAM-A2403', 'B24-VAM-003', 'Hyderabad', 'Tata Chemicals', 'V 99.5% Vanadium Redox Flow Battery', 'Grid Storage', '99.5%', '6.0 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Tata Power VRFB 4hr grid'],
    ['VAM-A2404', 'B24-VAM-004', 'Chennai', 'Bharat Forge', 'V 99.6% Tool Steel HSS M2', 'Cutting Tool', '99.6%', '6.0 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Bharat Forge HSS V drill'],
    ['VAM-A2405', 'B24-VAM-005', 'Kolkata', 'Shyam Chemicals', 'V 99.85% Ferrovanadium FeV80', 'Steel Additive', '99.85%', '6.0 g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'SAIL Jindal FeV80 charge'],
    ['VAM-A2406', 'B24-VAM-006', 'Noida', 'BHEL R&amp;D', 'V 99.3% Cr-V Turbine Blade Steel', 'Power Gen', '99.3%', '6.0 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL 800MW steam turbine'],
    ['VAM-A2407', 'B24-VAM-007', 'Pune', 'Godrej Chemicals', 'V 99.95% V2O5 SCR Catalyst', 'Emission Control', '99.95%', '6.0 g/cm3', '&#8377;820 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Tata Cummins SCR DeNOx'],
    ['VAM-A2408', 'B24-VAM-008', 'Jaipur', 'Rajasthan Chemicals', 'V 99.0% Surgical Implant Ti-6Al-7Nb', 'Orthopedic Plate', '99.0%', '6.0 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'AIIMS Ti-V bone plate'],
    ['VAM-A2409', 'B24-VAM-009', 'Guwahati', 'Assam Chemicals', 'V 99.4% Spring Steel SiCrV', 'Railway Coil', '99.4%', '6.0 g/cm3', '&#8377;740 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Indian Railways SiCrV spring'],
    ['VAM-A2410', 'B24-VAM-010', 'Ahmedabad', 'Gujarat Chemicals', 'V 99.8% Nitriding Alloy  Nitro-V', 'Crankshaft', '99.8%', '6.0 g/cm3', '&#8377;840 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Mahindra Nitro-V crankshaft'],
    ['VAM-A2411', 'B24-VAM-011', 'Lucknow', 'UP Chemicals', 'V 99.2% Petrochemical Catalyst V2O5', 'Sulfuric Acid', '99.2%', '6.0 g/cm3', '&#8377;780 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'IOC Mathura V2O5 contact'],
    ['VAM-A2412', 'B24-VAM-012', 'Visakhapatnam', 'Vizag Chemicals', 'V 99.7% Submarine Pressure Hull HY-130', 'Naval Steel', '99.7%', '6.0 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK HY-130 weld'],
    ['VAM-A2413', 'B24-VAM-013', 'Balasore', 'DRDO TBRL', 'V 99.6% Warship Armour Plate', 'Ballistic Steel', '99.6%', '6.0 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval armour V-alloy'],
    ['VAM-A2414', 'B24-VAM-014', 'Bhilai', 'SAIL Chemicals', 'V 98.5% General Ferrovanadium', 'Foundry Charge', '98.5%', '6.0 g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL BOF FeV charge'],
]

# --- Manganese Sulfate: MnSO4 ---
# Prefix: mns, Icon: Cherry, Color: #15803d (green-dark), density 3.25 g/cm3
mns_records = [
    ['MNS-A2401', 'B24-MNS-001', 'Mumbai', 'MIDHANI', 'MnSO4 99.5% Micronutrient Fertilizer', 'Crop Nutrition', '99.5%', '3.25 g/cm3', '&#8377;800 Cr', 'in-transit', 'high', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'IFFCO Mn foliar spray'],
    ['MNS-A2402', 'B24-MNS-002', 'Bengaluru', 'DRDO DMRL', 'MnSO4 99.9% NMC Battery Precursor', 'Li-Ion Cathode', '99.9%', '3.25 g/cm3', '&#8377;940 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'Exide NMC-811 Li cell'],
    ['MNS-A2403', 'B24-MNS-003', 'Hyderabad', 'Tata Chemicals', 'MnSO4 99.3% Animal Feed Supplement', 'Cattle Mineral', '99.3%', '3.25 g/cm3', '&#8377;720 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Amul dairy Mn premix'],
    ['MNS-A2404', 'B24-MNS-004', 'Chennai', 'Bharat Forge', 'MnSO4 99.7% Electrolytic MnO2 Feed', 'EMD Battery', '99.7%', '3.25 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'HBL Zn-MnO2 alkaline cell'],
    ['MNS-A2405', 'B24-MNS-005', 'Kolkata', 'Shyam Chemicals', 'MnSO4 99.0% Agrochemical Intermediary', 'Fungicide Mn', '99.0%', '3.25 g/cm3', '&#8377;700 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'UPL Mancozeb Mn bridge'],
    ['MNS-A2406', 'B24-MNS-006', 'Noida', 'BHEL R&amp;D', 'MnSO4 99.8% Pottery Glaze Colorant', 'Ceramic Pigment', '99.8%', '3.25 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Morbi purple Mn glaze'],
    ['MNS-A2407', 'B24-MNS-007', 'Pune', 'Godrej Chemicals', 'MnSO4 99.6% Water Treatment Oxidant', 'Potable Mn', '99.6%', '3.25 g/cm3', '&#8377;780 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Mumbai BMC Fe-Mn filter'],
    ['MNS-A2408', 'B24-MNS-008', 'Jaipur', 'Rajasthan Chemicals', 'MnSO4 99.2% Textile Dye Mordant', 'Fabric Fixation', '99.2%', '3.25 g/cm3', '&#8377;680 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Bhilwara Mn dye mordant'],
    ['MNS-A2409', 'B24-MNS-009', 'Guwahati', 'Assam Chemicals', 'MnSO4 99.4% Tea Plantation Micronutrient', 'Tea Garden', '99.4%', '3.25 g/cm3', '&#8377;740 Cr', 'in-transit', 'medium', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Assam tea estate Mn foliar'],
    ['MNS-A2410', 'B24-MNS-010', 'Ahmedabad', 'Gujarat Chemicals', 'MnSO4 99.85% High-Purity Electrolyte', 'Mn Metal Plating', '99.85%', '3.25 g/cm3', '&#8377;840 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Tata Mn electrorefining'],
    ['MNS-A2411', 'B24-MNS-011', 'Lucknow', 'UP Chemicals', 'MnSO4 99.1% Dry Cell Battery Activator', 'Zn-Carbon Cell', '99.1%', '3.25 g/cm3', '&#8377;700 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Eveready MnO2 depolarizer'],
    ['MNS-A2412', 'B24-MNS-012', 'Visakhapatnam', 'Vizag Chemicals', 'MnSO4 99.9% Submarine Lead-Acid Battery', 'Naval Battery', '99.9%', '3.25 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK Pb-MnO2 bank'],
    ['MNS-A2413', 'B24-MNS-013', 'Balasore', 'DRDO TBRL', 'MnSO4 99.7% Warship Propulsion Fuel Additive', 'Naval Diesel', '99.7%', '3.25 g/cm3', '&#8377;880 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval Mn anti-smoke'],
    ['MNS-A2414', 'B24-MNS-014', 'Bhilai', 'SAIL Chemicals', 'MnSO4 98.0% General Industrial Grade', 'Alloy Additive', '98.0%', '3.25 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL steel MnSO4 pickle'],
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


# --- Generate Vanadium Metal ---
vam_config = {
    'prefix': 'vam', 'icon': 'GraduationCap', 'color': '#c2410c',
    'title': 'Vanadium Metal Logistics',
    'subtitle': 'V HSLA steel &#8226; VRFB battery &#8226; Ti-6Al-4V aerospace &#8226; Submarine HY-130 hull supply chain',
    'fn_name': 'VanadiumMetalLogisticsView',
}
with open('src/components/modules/vanadium-metal-logistics-view.tsx', 'w') as f:
    f.write(gen_module(vam_records, vam_config))
print("Generated: vanadium-metal-logistics-view.tsx")

# --- Generate Manganese Sulfate ---
mns_config = {
    'prefix': 'mns', 'icon': 'Cherry', 'color': '#15803d',
    'title': 'Manganese Sulfate Logistics',
    'subtitle': 'MnSO4 fertilizer &#8226; NMC cathode &#8226; Animal feed &#8226; Submarine Pb-MnO2 battery supply chain',
    'fn_name': 'ManganeseSulfateLogisticsView',
}
with open('src/components/modules/manganese-sulfate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(mns_records, mns_config))
print("Generated: manganese-sulfate-logistics-view.tsx")

# --- Verify ---
for fname in ['src/components/modules/vanadium-metal-logistics-view.tsx', 'src/components/modules/manganese-sulfate-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
