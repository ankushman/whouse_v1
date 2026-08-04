#!/usr/bin/env python3
"""R453 Generator: Copper Cathode Logistics + Tin Metal Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Copper Cathode: Cu ---
# Prefix: cuc, Icon: Power, Color: #b45309 (amber-dark), density 8.96 g/cm3
cuc_records = [
    ['CUC-A2401', 'B24-CUC-001', 'Mumbai', 'MIDHANI', 'Cu 99.99% OFHC Wire', 'Power Cable', '99.99%', '8.96 g/cm3', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'PowerGrid HTS transmission'],
    ['CUC-A2402', 'B24-CUC-002', 'Bengaluru', 'DRDO DMRL', 'Cu 99.97% Rocket Nozzle Liner', 'W-Cu Composite', '99.97%', '8.96 g/cm3', '&#8377;900 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'ISRO Vikas W-Cu throat'],
    ['CUC-A2403', 'B24-CUC-003', 'Hyderabad', 'Tata Chemicals', 'Cu 99.95% PCB Trace', 'Copper Foil', '99.95%', '8.96 g/cm3', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Dixon 2-layer PCB laminate'],
    ['CUC-A2404', 'B24-CUC-004', 'Chennai', 'Bharat Forge', 'Cu 99.5% Transformer Winding', 'Distribution Grid', '99.5%', '8.96 g/cm3', '&#8377;780 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BHEL power transformer'],
    ['CUC-A2405', 'B24-CUC-005', 'Kolkata', 'Shyam Chemicals', 'Cu 99.9% Induction Motor Rotor', 'EV Drive', '99.9%', '8.96 g/cm3', '&#8377;880 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Tata EV motor copper bar'],
    ['CUC-A2406', 'B24-CUC-006', 'Noida', 'BHEL R&amp;D', 'Cu 99.8% Generator Stator Bar', 'Hydro Turbine', '99.8%', '8.96 g/cm3', '&#8377;840 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'NHPC Bhakra stator rewind'],
    ['CUC-A2407', 'B24-CUC-007', 'Pune', 'Godrej Chemicals', 'Cu 99.93% Heat Exchanger Tube', 'HVAC Chiller', '99.93%', '8.96 g/cm3', '&#8377;820 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Blue Star chiller condenser'],
    ['CUC-A2408', 'B24-CUC-008', 'Jaipur', 'Rajasthan Chemicals', 'Cu 99.0% Brass Rod Stock', 'Plumbing Fitting', '99.0%', '8.96 g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Rajasthan brass valve body'],
    ['CUC-A2409', 'B24-CUC-009', 'Guwahati', 'Assam Chemicals', 'Cu 99.85% Telecom Cable', 'Fiber Backbone', '99.85%', '8.96 g/cm3', '&#8377;800 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Jio FTTH copper feeder'],
    ['CUC-A2410', 'B24-CUC-010', 'Ahmedabad', 'Gujarat Chemicals', 'Cu 99.99% Semiconductor Bond Wire', 'IC Package', '99.99%', '8.96 g/cm3', '&#8377;960 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Dixon QFP gold-bond wire'],
    ['CUC-A2411', 'B24-CUC-011', 'Lucknow', 'UP Chemicals', 'Cu 99.7% HVAC Refrigerant Tube', 'AC Split Unit', '99.7%', '8.96 g/cm3', '&#8377;740 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Voltas split AC coil'],
    ['CUC-A2412', 'B24-CUC-012', 'Visakhapatnam', 'Vizag Chemicals', 'Cu 99.95% Submarine Propeller Shaft', 'Naval Drive', '99.95%', '8.96 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK propulsion motor'],
    ['CUC-A2413', 'B24-CUC-013', 'Balasore', 'DRDO TBRL', 'Cu 99.8% Warship De-Gaussing Cable', 'Magnetic Shield', '99.8%', '8.96 g/cm3', '&#8377;900 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'IN Navy INS Kolkata degauss'],
    ['CUC-A2414', 'B24-CUC-014', 'Bhilai', 'SAIL Chemicals', 'Cu 97% General Wire Rod', 'Building Cable', '97.0%', '8.96 g/cm3', '&#8377;600 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL TMT Cu-clad ground'],
]

# --- Tin Metal: Sn ---
# Prefix: snm, Icon: Moon, Color: #7c3aed (violet), density 7.31 g/cm3
snm_records = [
    ['SNM-A2401', 'B24-SNM-001', 'Mumbai', 'MIDHANI', 'Sn 99.99% Solder Paste SAC305', 'SMT Assembly', '99.99%', '7.31 g/cm3', '&#8377;920 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Dixon SMT reflow solder'],
    ['SNM-A2402', 'B24-SNM-002', 'Bengaluru', 'DRDO DMRL', 'Sn 99.95% Pewter Alloy', 'Naval Fitting', '99.95%', '7.31 g/cm3', '&#8377;880 Cr', 'delivered', 'high', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IN Navy deck hardware'],
    ['SNM-A2403', 'B24-SNM-003', 'Hyderabad', 'Tata Chemicals', 'Sn 99.9% Float Glass Coating', 'Architectural', '99.9%', '7.31 g/cm3', '&#8377;840 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Asahi Glass low-E coat'],
    ['SNM-A2404', 'B24-SNM-004', 'Chennai', 'Bharat Forge', 'Sn 99.5% Bronze Bearing', 'Turbine Journal', '99.5%', '7.31 g/cm3', '&#8377;780 Cr', 'delivered', 'medium', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BHEL steam turbine bearing'],
    ['SNM-A2405', 'B24-SNM-005', 'Kolkata', 'Shyam Chemicals', 'Sn 99.85% Tin Can Sheet', 'Food Packaging', '99.85%', '7.31 g/cm3', '&#8377;820 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Hindustan Tin tinfoil roll'],
    ['SNM-A2406', 'B24-SNM-006', 'Noida', 'BHEL R&amp;D', 'Sn 99.8% Fusible Plug', 'Safety Valve', '99.8%', '7.31 g/cm3', '&#8377;800 Cr', 'delivered', 'high', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL boiler fusible plug'],
    ['SNM-A2407', 'B24-SNM-007', 'Pune', 'Godrej Chemicals', 'Sn 99.93% Sn-Ag-Cu BGA Ball', 'IC Substrate', '99.93%', '7.31 g/cm3', '&#8377;860 Cr', 'in-transit', 'critical', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Dixon BGA rework ball'],
    ['SNM-A2408', 'B24-SNM-008', 'Jaipur', 'Rajasthan Chemicals', 'Sn 99.0% Galvanized Steel Sheet', 'Corrugated Roof', '99.0%', '7.31 g/cm3', '&#8377;640 Cr', 'delivered', 'low', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Tata Galvano tin-zinc coat'],
    ['SNM-A2409', 'B24-SNM-009', 'Guwahati', 'Assam Chemicals', 'Sn 99.7% Organotin PVC Stabilizer', 'Pipe Extrusion', '99.7%', '7.31 g/cm3', '&#8377;780 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'Finolex PVC pipe stabilizer'],
    ['SNM-A2410', 'B24-SNM-010', 'Ahmedabad', 'Gujarat Chemicals', 'Sn 99.99% Wafer Bump solder', 'Flip Chip', '99.99%', '7.31 g/cm3', '&#8377;940 Cr', 'pending', 'critical', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Semiconductor wafer bump'],
    ['SNM-A2411', 'B24-SNM-011', 'Lucknow', 'UP Chemicals', 'Sn 99.5% Soft Solder Wire', 'Plumbing Joint', '99.5%', '7.31 g/cm3', '&#8377;700 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'General plumbing solder'],
    ['SNM-A2412', 'B24-SNM-012', 'Visakhapatnam', 'Vizag Chemicals', 'Sn 99.95% Submarine Sonar Dome', 'Acoustic Window', '99.95%', '7.31 g/cm3', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK bow sonar dome'],
    ['SNM-A2413', 'B24-SNM-013', 'Balasore', 'DRDO TBRL', 'Sn 99.8% Warship Anti-Corrosion Anode', 'Cathodic Protect', '99.8%', '7.31 g/cm3', '&#8377;880 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'IN Navy hull Zn-Sn anode'],
    ['SNM-A2414', 'B24-SNM-014', 'Bhilai', 'SAIL Chemicals', 'Sn 97% General Solder Bar', 'Sheet Metal', '97.0%', '7.31 g/cm3', '&#8377;580 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL tin solder stock'],
]


def fmt_record(r):
    """Format a record tuple with ALL values as strings."""
    parts = [f"'{r[i]}'" for i in range(len(r))]
    return '  [' + ', '.join(parts) + ']'


def gen_module(records, config):
    """Generate a module from template + config."""
    with open(TEMPLATE_PATH, 'r') as f:
        template = f.read()

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

    # Replace icon usage in JSX
    template = re.sub(r'<ShieldCheck className="w-5 h-5"', f'<{icon} className="w-5 h-5"', template)

    # Replace color references
    template = re.sub(r"'16a34a'", f"'{color}'", template)

    # Replace backgroundColor alpha
    template = re.sub(
        r"backgroundColor: '#6366f122'",
        f"backgroundColor: '{color}22'",
        template
    )

    return template


# --- Generate Copper Cathode ---
cuc_config = {
    'name': 'copper-cathode',
    'prefix': 'cuc',
    'icon': 'Power',
    'color': '#b45309',
    'title': 'Copper Cathode Logistics',
    'subtitle': 'Cu power cable &#8226; PCB trace &#8226; Motor winding &#8226; Submarine propulsion supply chain',
    'fn_name': 'CopperCathodeLogisticsView',
}

cuc_output = gen_module(cuc_records, cuc_config)
with open('src/components/modules/copper-cathode-logistics-view.tsx', 'w') as f:
    f.write(cuc_output)
print(f"Generated: copper-cathode-logistics-view.tsx ({len(cuc_output.splitlines())} lines)")

# --- Generate Tin Metal ---
snm_config = {
    'name': 'tin-metal',
    'prefix': 'snm',
    'icon': 'Moon',
    'color': '#7c3aed',
    'title': 'Tin Metal Logistics',
    'subtitle': 'Sn SMT solder &#8226; Float glass &#8226; Bronze bearing &#8226; Submarine sonar dome supply chain',
    'fn_name': 'TinMetalLogisticsView',
}

snm_output = gen_module(snm_records, snm_config)
with open('src/components/modules/tin-metal-logistics-view.tsx', 'w') as f:
    f.write(snm_output)
print(f"Generated: tin-metal-logistics-view.tsx ({len(snm_output.splitlines())} lines)")

# --- Verify no : typos ---
for fname in ['src/components/modules/copper-cathode-logistics-view.tsx', 'src/components/modules/tin-metal-logistics-view.tsx']:
    with open(fname, 'r') as f:
        content = f.read()
    record_section = content[content.find('RECORDS = ['):content.find('];')]
    colon_count = record_section.count(':')
    comma_count = record_section.count(',')
    bad = re.findall(r"'[^']*'\s*:\s*'", record_section)
    if bad:
        print(f"  WARNING: {fname} — {len(bad)} colon-separated fields! {bad[:3]}")
    else:
        print(f"  OK: {fname} — colons={colon_count}, commas={comma_count}")
