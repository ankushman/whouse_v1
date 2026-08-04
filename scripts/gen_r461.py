#!/usr/bin/env python3
"""R461 Generator: Chromium Sulfate Logistics + Nickel Carbonate Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Chromium Sulfate: Cr2(SO4)3 ---
# Prefix: crs, Icon: Bug, Color: #7c3aed (violet, Cr-purple), density 3.01 g/cm3
crs_records = [
    ['CRS-A2401', 'B24-CRS-001', 'Mumbai', 'MIDHANI', 'Cr2(SO4)3 99.5% Leather Tanning Agent', 'Chrome-Tan Wet Blue', '99.5%', '3.01 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Kanpur chrome-tan leather'],
    ['CRS-A2402', 'B24-CRS-002', 'Bengaluru', 'DRDO DMRL', 'Cr2(SO4)3 99.9% Corrosion Inhibitor Coolant', 'Aerospace Alloy Coat', '99.9%', '3.01 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HAL Tejas chromate conv'],
    ['CRS-A2403', 'B24-CRS-003', 'Hyderabad', 'Tata Chemicals', 'Cr2(SO4)3 99.3% Pigment Chrome Green', 'Ceramic Glaze', '99.3%', '3.01 g/cm3', '&#8377;780 Cr', 'in-transit', 'medium', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Morbi chrome green glaze'],
    ['CRS-A2404', 'B24-CRS-004', 'Chennai', 'Bharat Forge', 'Cr2(SO4)3 99.7% Wood Preservative CCA', 'Timber Treatment', '99.7%', '3.01 g/cm3', '&#8377;840 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Rajasthan CCA Cr treat'],
    ['CRS-A2405', 'B24-CRS-005', 'Kolkata', 'Shyam Chemicals', 'Cr2(SO4)3 99.85% Textile Mordant', 'Wool Dye Fixing', '99.85%', '3.01 g/cm3', '&#8377;760 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Bhilwara chrome mordant'],
    ['CRS-A2406', 'B24-CRS-006', 'Noida', 'BHEL R&amp;D', 'Cr2(SO4)3 99.8% Refractory Bond Chrome-Mg', 'Steel Ladle Lining', '99.8%', '3.01 g/cm3', '&#8377;860 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'SAIL Cr-Mg refractory'],
    ['CRS-A2407', 'B24-CRS-007', 'Pune', 'Godrej Chemicals', 'Cr2(SO4)3 99.6% Water Treatment Coagulant Aid', 'Municipal WTP', '99.6%', '3.01 g/cm3', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Pune municipal Cr flocc'],
    ['CRS-A2408', 'B24-CRS-008', 'Jaipur', 'Rajasthan Chemicals', 'Cr2(SO4)3 99.0% Ceramic Chrome Alumina', 'Kiln Furniture', '99.0%', '3.01 g/cm3', '&#8377;700 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Morbi Cr-Al2O3 setter'],
    ['CRS-A2409', 'B24-CRS-009', 'Guwahati', 'Assam Chemicals', 'Cr2(SO4)3 99.4% Catalyst Cr2O3 Precursor', 'Petroleum Dehydrogen', '99.4%', '3.01 g/cm3', '&#8377;800 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IOC Guwahati Cr cat'],
    ['CRS-A2410', 'B24-CRS-010', 'Ahmedabad', 'Gujarat Chemicals', 'Cr2(SO4)3 99.92% Aerospace Chromic Anodize', 'Al Alloy Passivate', '99.92%', '3.01 g/cm3', '&#8377;940 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'HAL chromic anodize bath'],
    ['CRS-A2411', 'B24-CRS-011', 'Lucknow', 'UP Chemicals', 'Cr2(SO4)3 99.2% Magnetic Tape CrO2 Precursor', 'Recording Media', '99.2%', '3.01 g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'SME CrO2 tape precursor'],
    ['CRS-A2412', 'B24-CRS-012', 'Visakhapatnam', 'Vizag Chemicals', 'Cr2(SO4)3 99.9% Submarine Non-Magnetic Hull', 'Austenitic Cr-Ni', '99.9%', '3.01 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK non-mag Cr steel'],
    ['CRS-A2413', 'B24-CRS-013', 'Balasore', 'DRDO TBRL', 'Cr2(SO4)3 99.8% Warship Jet Engine Turbine Blade', 'Ni-Cr Superalloy', '99.8%', '3.01 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval GT blade Cr'],
    ['CRS-A2414', 'B24-CRS-014', 'Bhilai', 'SAIL Chemicals', 'Cr2(SO4)3 98.0% General Industrial Grade', 'Process Chemical', '98.0%', '3.01 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Cr process liquor'],
]

# --- Nickel Carbonate: NiCO3 ---
# Prefix: nic, Icon: Cable, Color: #059669 (teal-green, Ni-green), density 4.39 g/cm3
nic_records = [
    ['NIC-A2401', 'B24-NIC-001', 'Mumbai', 'MIDHANI', 'NiCO3 99.9% Stainless Steel Austenitic', '304/316 Cr-Ni', '99.9%', '4.39 g/cm3', '&#8377;880 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Jindal SS 304 Ni charge'],
    ['NIC-A2402', 'B24-NIC-002', 'Bengaluru', 'DRDO DMRL', 'NiCO3 99.95% Superalloy Turbine Disc', 'Jet Engine Ni-Base', '99.95%', '4.39 g/cm3', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HAL Tejas GT IN718 disc'],
    ['NIC-A2403', 'B24-NIC-003', 'Hyderabad', 'Tata Chemicals', 'NiCO3 99.5% Electroplating Bright Nickel', 'Decorative Plate', '99.5%', '4.39 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Tata Steel bright Ni plate'],
    ['NIC-A2404', 'B24-NIC-004', 'Chennai', 'Bharat Forge', 'NiCO3 99.7% EV Battery NCA Cathode Precursor', 'Li-Ion NCA', '99.7%', '4.39 g/cm3', '&#8377;920 Cr', 'delivered', 'critical', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Exide NCA Li cathode'],
    ['NIC-A2405', 'B24-NIC-005', 'Kolkata', 'Shyam Chemicals', 'NiCO3 99.85% Catalyst Nickel Ra-Ni Hydrogenation', 'Petrochemical', '99.85%', '4.39 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'IOC Haldia Ra-Ni cat'],
    ['NIC-A2406', 'B24-NIC-006', 'Noida', 'BHEL R&amp;D', 'NiCO3 99.6% Magnetic Alloy Alnico/NdFeB Bond', 'Permanent Magnet', '99.6%', '4.39 g/cm3', '&#8377;800 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL NdFeB bond Ni coat'],
    ['NIC-A2407', 'B24-NIC-007', 'Pune', 'Godrej Chemicals', 'NiCO3 99.8% Coinage Cupronickel 75-25', 'Rupee Coin', '99.8%', '4.39 g/cm3', '&#8377;840 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'SPMCIL Cu-Ni coin strip'],
    ['NIC-A2408', 'B24-NIC-008', 'Jaipur', 'Rajasthan Chemicals', 'NiCO3 99.3% Ceramic Frit Colour', 'Glass Enamel', '99.3%', '4.39 g/cm3', '&#8377;740 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Rajasthan Ni frit glaze'],
    ['NIC-A2409', 'B24-NIC-009', 'Guwahati', 'Assam Chemicals', 'NiCO3 99.4% Welding Electrode Core Wire', 'Ni-Alloy SMAW', '99.4%', '4.39 g/cm3', '&#8377;780 Cr', 'in-transit', 'medium', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Ador Ni-alloy electrode'],
    ['NIC-A2410', 'B24-NIC-010', 'Ahmedabad', 'Gujarat Chemicals', 'NiCO3 99.92% Aerospace Ni-Ti Shape Memory', 'Actuator Alloy', '99.92%', '4.39 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'DRDO Ni-Ti SMA actuator'],
    ['NIC-A2411', 'B24-NIC-011', 'Lucknow', 'UP Chemicals', 'NiCO3 99.2% Storage Battery Ni-Cd Electrode', 'Rechargeable Ni', '99.2%', '4.39 g/cm3', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Exide Ni-Cd pocket plate'],
    ['NIC-A2412', 'B24-NIC-012', 'Visakhapatnam', 'Vizag Chemicals', 'NiCO3 99.95% Submarine Propeller Shaft Monel', 'Ni-Cu Alloy K-500', '99.95%', '4.39 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK Monel shaft'],
    ['NIC-A2413', 'B24-NIC-013', 'Balasore', 'DRDO TBRL', 'NiCO3 99.8% Warship Gas Turbine Inconel Blade', 'Ni-Cr Superalloy', '99.8%', '4.39 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO naval Inconel blade'],
    ['NIC-A2414', 'B24-NIC-014', 'Bhilai', 'SAIL Chemicals', 'NiCO3 98.0% General Industrial Grade', 'Alloy Additive', '98.0%', '4.39 g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Ni alloy charge'],
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


# --- Generate Chromium Sulfate ---
crs_config = {
    'prefix': 'crs', 'icon': 'Bug', 'color': '#7c3aed',
    'title': 'Chromium Sulfate Logistics',
    'subtitle': 'Cr2(SO4)3 leather tanning &#8226; Chromic anodize &#8226; Refractory &#8226; Submarine non-magnetic hull supply chain',
    'fn_name': 'ChromiumSulfateLogisticsView',
}
with open('src/components/modules/chromium-sulfate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(crs_records, crs_config))
print("Generated: chromium-sulfate-logistics-view.tsx")

# --- Generate Nickel Carbonate ---
nic_config = {
    'prefix': 'nic', 'icon': 'Cable', 'color': '#059669',
    'title': 'Nickel Carbonate Logistics',
    'subtitle': 'NiCO3 stainless steel &#8226; Superalloy &#8226; NCA cathode &#8226; Submarine Monel propeller shaft supply chain',
    'fn_name': 'NickelCarbonateLogisticsView',
}
with open('src/components/modules/nickel-carbonate-logistics-view.tsx', 'w') as f:
    f.write(gen_module(nic_records, nic_config))
print("Generated: nickel-carbonate-logistics-view.tsx")

# --- Verify ---
for fname in ['src/components/modules/chromium-sulfate-logistics-view.tsx', 'src/components/modules/nickel-carbonate-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}")
