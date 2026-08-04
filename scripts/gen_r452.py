#!/usr/bin/env python3
"""R452 Generator: Sulfuric Acid Logistics + Nickel Sulfate Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Sulfuric Acid: H2SO4 ---
# Prefix: sua, Icon: TestTube, Color: #ea580c (orange), chem #ea580c
sua_records = [
    ['SUA-A2401', 'B24-SUA-001', 'Mumbai', 'MIDHANI', 'H2SO4 99.9% Lead-Acid Battery', 'Automotive Battery', '99.9%', '10.5 M g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Exide lead-acid plates'],
    ['SUA-A2402', 'B24-SUA-002', 'Bengaluru', 'DRDO DMRL', 'H2SO4 99.7% Rocket Propellant Oxidizer', 'SRB Oxidizer', '99.7%', '10.5 M g/cm3', '&#8377;880 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'ISRO S200 oxidizer blend'],
    ['SUA-A2403', 'B24-SUA-003', 'Hyderabad', 'Tata Chemicals', 'H2SO4 99.5% Phosphoric Acid Production', 'Fertilizer', '99.5%', '10.4 M g/cm3', '&#8377;780 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'IFFCO DAP intermediate'],
    ['SUA-A2404', 'B24-SUA-004', 'Chennai', 'Bharat Forge', 'H2SO4 99.0% Steel Pickling', 'Surface Clean', '99.0%', '10.3 M g/cm3', '&#8377;680 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'SAIL hot-rolled strip pickle'],
    ['SUA-A2405', 'B24-SUA-005', 'Kolkata', 'Shyam Chemicals', 'H2SO4 99.8% Detergent Surfactant', 'LABS Alkylation', '99.8%', '10.5 M g/cm3', '&#8377;840 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Hindustan Unilever LAS'],
    ['SUA-A2406', 'B24-SUA-006', 'Noida', 'BHEL R&amp;D', 'H2SO4 99.3% Electrolyte Refining', 'Copper Anode', '99.3%', '10.4 M g/cm3', '&#8377;800 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Hindalco Cu smelter bath'],
    ['SUA-A2407', 'B24-SUA-007', 'Pune', 'Godrej Chemicals', 'H2SO4 99.6% Rayon Viscose Process', 'Textile Fiber', '99.6%', '10.5 M g/cm3', '&#8377;860 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Grasim Viscose staple'],
    ['SUA-A2408', 'B24-SUA-008', 'Jaipur', 'Rajasthan Chemicals', 'H2SO4 98.5% Alumina Digestion', 'Bauxite Bayer', '98.5%', '10.2 M g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Hindalco alumina refinery'],
    ['SUA-A2409', 'B24-SUA-009', 'Guwahati', 'Assam Chemicals', 'H2SO4 99.4% Petroleum Alkylation', 'Gasoline Octane', '99.4%', '10.5 M g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IOCL Numaligarh refinery'],
    ['SUA-A2410', 'B24-SUA-010', 'Ahmedabad', 'Gujarat Chemicals', 'H2SO4 99.95% Electronic Etchant', 'PCB Manufacturing', '99.95%', '10.5 M g/cm3', '&#8377;940 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Dixon copper PCB etch'],
    ['SUA-A2411', 'B24-SUA-011', 'Lucknow', 'UP Chemicals', 'H2SO4 99.2% Water pH Adjustment', 'Municipal Treatment', '99.2%', '10.3 M g/cm3', '&#8377;700 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Ganga water treatment plant'],
    ['SUA-A2412', 'B24-SUA-012', 'Visakhapatnam', 'Vizag Chemicals', 'H2SO4 99.8% Submarine Battery Electrolyte', 'Naval Lead-Acid', '99.8%', '10.5 M g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK battery top-up'],
    ['SUA-A2413', 'B24-SUA-013', 'Balasore', 'DRDO TBRL', 'H2SO4 99.6% Explosive Nitration', 'RDX/HMX Synth', '99.6%', '10.5 M g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'OFB GL Nalanda mixed acid'],
    ['SUA-A2414', 'B24-SUA-014', 'Bhilai', 'SAIL Chemicals', 'H2SO4 97% Industrial Drain Cleaner', 'General Purpose', '97.0%', '10.1 M g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL maintenance supply'],
]

# --- Nickel Sulfate: NiSO4 ---
# Prefix: nis, Icon: Magnet, Color: #0d9488 (teal), chem #0d9488
nis_records = [
    ['NIS-A2401', 'B24-NIS-001', 'Mumbai', 'MIDHANI', 'NiSO4 99.9% EV Battery Cathode', 'NMC Precursor', '99.9%', '4.0 M g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Ola S1 Pro NMC811 cell'],
    ['NIS-A2402', 'B24-NIS-002', 'Bengaluru', 'DRDO DMRL', 'NiSO4 99.7% Superalloy Plating', 'Turbine Blade', '99.7%', '3.9 M g/cm3', '&#8377;880 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'HAL HTFE-20 Ni coat'],
    ['NIS-A2403', 'B24-NIS-003', 'Hyderabad', 'Tata Chemicals', 'NiSO4 99.5% Electroplating Anode', 'Chrome Substrate', '99.5%', '3.9 M g/cm3', '&#8377;780 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'auto bumper Ni underlayer'],
    ['NIS-A2404', 'B24-NIS-004', 'Chennai', 'Bharat Forge', 'NiSO4 99.0% Catalyst Support', 'Hydrogenation', '99.0%', '3.8 M g/cm3', '&#8377;700 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'IOCL FCC Ni-W catalyst'],
    ['NIS-A2405', 'B24-NIS-005', 'Kolkata', 'Shyam Chemicals', 'NiSO4 99.8% Dye Fixation Mordant', 'Textile Dyeing', '99.8%', '4.0 M g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Arvind denim mordant'],
    ['NIS-A2406', 'B24-NIS-006', 'Noida', 'BHEL R&amp;D', 'NiSO4 99.3% PCB Electroless Cu', 'IC Substrate', '99.3%', '3.9 M g/cm3', '&#8377;800 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'Dixon HDI PCB ENIG'],
    ['NIS-A2407', 'B24-NIS-007', 'Pune', 'Godrej Chemicals', 'NiSO4 99.6% Corrosion Resistant Coating', 'Marine Paint', '99.6%', '4.0 M g/cm3', '&#8377;860 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Grasim marine anticorrosive'],
    ['NIS-A2408', 'B24-NIS-008', 'Jaipur', 'Rajasthan Chemicals', 'NiSO4 98.5% Ceramic Pigment', 'Yellow Glaze', '98.5%', '3.8 M g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Morbi ceramic glaze'],
    ['NIS-A2409', 'B24-NIS-009', 'Guwahati', 'Assam Chemicals', 'NiSO4 99.4% Magnetic Recording Media', 'Hard Disk', '99.4%', '4.0 M g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Seagate plating bath'],
    ['NIS-A2410', 'B24-NIS-010', 'Ahmedabad', 'Gujarat Chemicals', 'NiSO4 99.95% Aerospace Alloy Precursor', 'Ni-P Deposition', '99.95%', '4.0 M g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'ISRO L110 tank Ni-P liner'],
    ['NIS-A2411', 'B24-NIS-011', 'Lucknow', 'UP Chemicals', 'NiSO4 99.2% Galvanizing Brightener', 'Zn-Ni Alloy', '99.2%', '3.9 M g/cm3', '&#8377;720 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'SAIL galv line additive'],
    ['NIS-A2412', 'B24-NIS-012', 'Visakhapatnam', 'Vizag Chemicals', 'NiSO4 99.8% Submarine Propeller Shielding', 'EMI Coating', '99.8%', '4.0 M g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK EMI shield'],
    ['NIS-A2413', 'B24-NIS-013', 'Balasore', 'DRDO TBRL', 'NiSO4 99.6% Warship Hull Anti-Fouling', 'Naval Paint', '99.6%', '4.0 M g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'IN Navy hull Ni-Cu plate'],
    ['NIS-A2414', 'B24-NIS-014', 'Bhilai', 'SAIL Chemicals', 'NiSO4 97% General Electroplating', 'Decorative Finish', '97.0%', '3.7 M g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL hardware Ni plate'],
]


def fmt_record(r):
    """Format a record tuple with ALL values as strings."""
    parts = [f"'{r[i]}'" for i in range(len(r))]
    return '  [' + ', '.join(parts) + ']'


def gen_module(records, config):
    """Generate a module from template + config."""
    with open(TEMPLATE_PATH, 'r') as f:
        template = f.read()

    name = config['name']
    prefix = config['prefix']
    icon = config['icon']
    color = config['color']
    title = config['title']
    subtitle = config['subtitle']
    fn_name = config['fn_name']

    # Record block
    rec_strs = [fmt_record(r) for r in records]
    rec_block = f"const {prefix}_RECORDS = [\n" + ',\n'.join(rec_strs) + "\n];"

    # Replace record block
    template = re.sub(
        r"const [\w]+_RECORDS = \[.*?\];",
        rec_block,
        template,
        flags=re.DOTALL
    )

    # Replace import icon
    template = re.sub(
        r"import \{ \w+ \} from 'lucide-react';",
        f"import {{ {icon} }} from 'lucide-react';",
        template
    )

    # Replace function name
    template = re.sub(
        r"export default function \w+LogisticsView\(\)",
        f"export default function {fn_name}()",
        template
    )

    # Replace filtered variable references
    template = re.sub(
        r"zinc_oxide_RECORDS",
        f"{prefix}_RECORDS",
        template
    )

    # Replace title
    template = template.replace('Zinc Oxide Logistics', title)

    # Replace subtitle
    template = template.replace(
        'ZnO varistor &#8226; UV blocker &#8226; Rubber vulcanization &#8226; TCO electrode supply chain',
        subtitle
    )

    # Replace icon usage in JSX (2 occurrences: icon component tag)
    template = re.sub(r'<ShieldCheck className="w-5 h-5"', f'<{icon} className="w-5 h-5"', template)

    # Replace color references (hex color and named)
    template = re.sub(r"'16a34a'", f"'{color}'", template)

    # Replace backgroundColor alpha
    template = re.sub(
        r"backgroundColor: '#6366f122'",
        f"backgroundColor: '{color}22'",
        template
    )

    return template


# --- Generate Sulfuric Acid ---
sua_config = {
    'name': 'sulfuric-acid',
    'prefix': 'sua',
    'icon': 'TestTube',
    'color': '#ea580c',
    'title': 'Sulfuric Acid Logistics',
    'subtitle': 'H2SO4 battery electrolyte &#8226; Fertilizer &#8226; Steel pickling &#8226; PCB etchant supply chain',
    'fn_name': 'SulfuricAcidLogisticsView',
}

sua_output = gen_module(sua_records, sua_config)
with open('src/components/modules/sulfuric-acid-logistics-view.tsx', 'w') as f:
    f.write(sua_output)
print(f"Generated: sulfuric-acid-logistics-view.tsx ({len(sua_output.splitlines())} lines)")

# --- Generate Nickel Sulfate ---
nis_config = {
    'name': 'nickel-sulfate',
    'prefix': 'nis',
    'icon': 'Magnet',
    'color': '#0d9488',
    'title': 'Nickel Sulfate Logistics',
    'subtitle': 'NiSO4 EV battery cathode &#8226; Electroplating &#8226; Superalloy coating &#8226; Aerospace Ni-P supply chain',
    'fn_name': 'NickelSulfateLogisticsView',
}

nis_output = gen_module(nis_records, nis_config)
with open('src/components/modules/nickel-sulfate-logistics-view.tsx', 'w') as f:
    f.write(nis_output)
print(f"Generated: nickel-sulfate-logistics-view.tsx ({len(nis_output.splitlines())} lines)")

# --- Verify no : typos in generated files ---
for fname in ['src/components/modules/sulfuric-acid-logistics-view.tsx', 'src/components/modules/nickel-sulfate-logistics-view.tsx']:
    with open(fname, 'r') as f:
        content = f.read()
    # Check for any ":" in record arrays (should only have "," between fields)
    record_section = content[content.find('RECORDS = ['):content.find('];')]
    colon_count = record_section.count(':')
    comma_count = record_section.count(',')
    print(f"{fname}: colons={colon_count}, commas={comma_count}")
    # Check field separator pattern: looking for "string":"string" (colon between quoted strings)
    import re as re2
    bad = re2.findall(r"'[^']*'\s*:\s*'", record_section)
    if bad:
        print(f"  WARNING: Found {len(bad)} colon-separated fields! {bad[:3]}")
    else:
        print(f"  OK: No colon field separators found")
