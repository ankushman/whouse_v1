#!/usr/bin/env python3
"""R460 Generator: Copper Sulfate Logistics + Manganese Metal Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Copper Sulfate: CuSO4 ---
# Prefix: cus, Icon: BadgeCheck, Color: #b45309 (copper-brown), density 3.6 g/cm3
cus_records = [
    ['CUS-A2401', 'B24-CUS-001', 'Mumbai', 'MIDHANI', 'CuSO4 99.5% Agricultural Fungicide', 'Grape/Bordeaux Mix', '99.5%', '3.6 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Maharashtra grape vineyard Cu spray'],
    ['CUS-A2402', 'B24-CUS-002', 'Bengaluru', 'DRDO DMRL', 'CuSO4 99.9% Electroplating Bath Makeup', 'Cu Bright Dip', '99.9%', '3.6 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'BEL PCB Cu electroplate'],
    ['CUS-A2403', 'B24-CUS-003', 'Hyderabad', 'Tata Chemicals', 'CuSO4 99.3% Animal Feed Trace Mineral', 'Cattle Cu Supplement', '99.3%', '3.6 g/cm3', '&#8377;720 Cr', 'in-transit', 'medium', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Amul dairy Cu premix'],
    ['CUS-A2404', 'B24-CUS-004', 'Chennai', 'Bharat Forge', 'CuSO4 99.7% Mining Flotation Reagent', 'Cu Ore Concentrate', '99.7%', '3.6 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Hindalco Khetri Cu float'],
    ['CUS-A2405', 'B24-CUS-005', 'Kolkata', 'Shyam Chemicals', 'CuSO4 99.85% Water Treatment Algicide', 'Cooling Tower', '99.85%', '3.6 g/cm3', '&#8377;780 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'NTPC Talcher cooling Cu algicide'],
    ['CUS-A2406', 'B24-CUS-006', 'Noida', 'BHEL R&amp;D', 'CuSO4 99.8% Textile Mordant Dye Fixing', 'Fabric Cu-Dye', '99.8%', '3.6 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Bhilwara Cu dye mordant'],
    ['CUS-A2407', 'B24-CUS-007', 'Pune', 'Godrej Chemicals', 'CuSO4 99.6% Pigment Manufacturing', 'Cu Phthalocyanine', '99.6%', '3.6 g/cm3', '&#8377;840 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Sudarshan CuPC blue pigment'],
    ['CUS-A2408', 'B24-CUS-008', 'Jaipur', 'Rajasthan Chemicals', 'CuSO4 99.0% Battery Electrolyte Additive', 'Lead-Acid Cell', '99.0%', '3.6 g/cm3', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Exide Pb-Cu battery extend'],
    ['CUS-A2409', 'B24-CUS-009', 'Guwahati', 'Assam Chemicals', 'CuSO4 99.4% Soil Amendment Micronutrient', 'Tea Garden Cu', '99.4%', '3.6 g/cm3', '&#8377;740 Cr', 'in-transit', 'medium', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Assam tea Cu foliar'],
    ['CUS-A2410', 'B24-CUS-010', 'Ahmedabad', 'Gujarat Chemicals', 'CuSO4 99.95% High-Purity Crystal Analytical', 'Lab Reagent AR', '99.95%', '3.6 g/cm3', '&#8377;880 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IISc analytical CuSO4 crystal'],
    ['CUS-A2411', 'B24-CUS-011', 'Lucknow', 'UP Chemicals', 'CuSO4 99.2% Leather Tanning Agent', 'Chromium-Free Tan', '99.2%', '3.6 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Kanpur leather Cu tan'],
    ['CUS-A2412', 'B24-CUS-012', 'Visakhapatnam', 'Vizag Chemicals', 'CuSO4 99.9% Submarine Anti-Fouling Paint', 'Hull Cu2O Source', '99.9%', '3.6 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK Cu anti-fouling'],
    ['CUS-A2413', 'B24-CUS-013', 'Balasore', 'DRDO TBRL', 'CuSO4 99.8% Warship Underwater Sensor Cu Electrode', 'Sonar Reference', '99.8%', '3.6 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval Cu electrode'],
    ['CUS-A2414', 'B24-CUS-014', 'Bhilai', 'SAIL Chemicals', 'CuSO4 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '3.6 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL CuSO4 process water'],
]

# --- Manganese Metal: Mn ---
# Prefix: mnm, Icon: Bean, Color: #475569 (slate-grey, metallic Mn), density 7.21 g/cm3
mnm_records = [
    ['MNM-A2401', 'B24-MNM-001', 'Mumbai', 'MIDHANI', 'Mn 99.9% Ferromanganese FeMn75', 'Steel Deoxidizer', '99.9%', '7.21 g/cm3', '&#8377;880 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'SAIL BOF FeMn75 charge'],
    ['MNM-A2402', 'B24-MNM-002', 'Bengaluru', 'DRDO DMRL', 'Mn 99.95% Silicomanganese SiMn65', 'Alloy Steel', '99.95%', '7.21 g/cm3', '&#8377;920 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'Tata Steel SiMn65 ladle'],
    ['MNM-A2403', 'B24-MNM-003', 'Hyderabad', 'Tata Chemicals', 'Mn 99.7% Aluminium-Mn Alloy Can Sheet', 'Beverage Can', '99.7%', '7.21 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Hindalco Al-Mn can body'],
    ['MNM-A2404', 'B24-MNM-004', 'Chennai', 'Bharat Forge', 'Mn 99.5% Hadfield Steel Mn12% Wear Plate', 'Railway Crossing', '99.5%', '7.21 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Indian Railways Mn12 frog'],
    ['MNM-A2405', 'B24-MNM-005', 'Kolkata', 'Shyam Chemicals', 'Mn 99.8% High-Strength Low-Alloy HSLA', 'Bridge Girder', '99.8%', '7.21 g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'L&amp;T HSLA bridge girder'],
    ['MNM-A2406', 'B24-MNM-006', 'Noida', 'BHEL R&amp;D', 'Mn 99.6% Stainless Steel 200 Series', 'Cr-Mn Austenitic', '99.6%', '7.21 g/cm3', '&#8377;840 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Jindal SS 201 Cr-Mn sheet'],
    ['MNM-A2407', 'B24-MNM-007', 'Pune', 'Godrej Chemicals', 'Mn 99.85% Dry Cell Battery MnO2 Cathode', 'Alkaline Cell', '99.85%', '7.21 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Eveready MnO2 depolarizer'],
    ['MNM-A2408', 'B24-MNM-008', 'Jaipur', 'Rajasthan Chemicals', 'Mn 99.3% Welding Flux Electrode Coating', 'SMAW Rod', '99.3%', '7.21 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Ador Welding Mn flux coat'],
    ['MNM-A2409', 'B24-MNM-009', 'Guwahati', 'Assam Chemicals', 'Mn 99.4% Fertilizer Micronutrient Grade', 'MnSO4 Precursor', '99.4%', '7.21 g/cm3', '&#8377;740 Cr', 'in-transit', 'medium', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IFFCO Mn foliar precursor'],
    ['MNM-A2410', 'B24-MNM-010', 'Ahmedabad', 'Gujarat Chemicals', 'Mn 99.92% Aerospace 2000-Series Al Alloy', 'Airframe Skin', '99.92%', '7.21 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'HAL Tejas Al-Mn skin panel'],
    ['MNM-A2411', 'B24-MNM-011', 'Lucknow', 'UP Chemicals', 'Mn 99.1% Aluminium Bronze Cu-Mn Bearing', 'Marine Propeller', '99.1%', '7.21 g/cm3', '&#8377;800 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Mazagon Dock Cu-Mn prop'],
    ['MNM-A2412', 'B24-MNM-012', 'Visakhapatnam', 'Vizag Chemicals', 'Mn 99.95% Submarine Hull HSLA-80 Steel', 'Pressure Vessel', '99.95%', '7.21 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK HSLA-80 hull'],
    ['MNM-A2413', 'B24-MNM-013', 'Balasore', 'DRDO TBRL', 'Mn 99.8% Warship Armour Steel Mangalloy', 'Ballistic Plate', '99.8%', '7.21 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval Mn12 armour'],
    ['MNM-A2414', 'B24-MNM-014', 'Bhilai', 'SAIL Chemicals', 'Mn 98.0% General Metallurgical Grade', 'Foundry Ingot', '98.0%', '7.21 g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Mn foundry alloy'],
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


# --- Generate Copper Sulfate ---
cus_config = {
    'prefix': 'cus', 'icon': 'BadgeCheck', 'color': '#b45309',
    'title': 'Copper Sulfate Logistics',
    'subtitle': 'CuSO4 fungicide &#8226; Electroplating &#8226; Mining flotation &#8226; Submarine anti-fouling paint supply chain',
    'fn_name': 'CopperSulfateLogisticsView',
}
with open('src/components/modules/copper-sulfate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(cus_records, cus_config))
print("Generated: copper-sulfate-logistics-view.tsx")

# --- Generate Manganese Metal ---
mnm_config = {
    'prefix': 'mnm', 'icon': 'Bean', 'color': '#475569',
    'title': 'Manganese Metal Logistics',
    'subtitle': 'Mn FeMn/SiMn steel &#8226; Hadfield armour &#8226; Al-Mn aerospace &#8226; Submarine HSLA-80 hull supply chain',
    'fn_name': 'ManganeseMetalLogisticsView',
}
with open('src/components/modules/manganese-metal-logistics-view.tsx', 'w') as f:
    f.write(gen_module(mnm_records, mnm_config))
print("Generated: manganese-metal-logistics-view.tsx")

# --- Verify ---
for fname in ['src/components/modules/copper-sulfate-logistics-view.tsx', 'src/components/modules/manganese-metal-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
