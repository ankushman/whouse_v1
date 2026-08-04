#!/usr/bin/env python3
"""R477 Generator: Lithium Fluoride Logistics + Sodium Fluoride Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Lithium Fluoride: LiF ---
# Prefix: lif2, Icon: Infinity, Color: #0891b2 (cyan), MP 845 degC, density 2.64 g/cm3
# LiF: fusion reactor blanket tritium breeder, UV transparent optic, Mg reduction flux,
# molten salt FLiBe coolant, X-ray monochromator, flux crystal growth
lif_records = [
    ['LIF-A2401', 'B24-LIF-001', 'Mumbai', 'MIDHANI', 'LiF 99.99% Fusion Reactor Tritium Breeder', 'TBR Blanket Pellet', '99.99%', '845 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BARC LiF tritium breed'],
    ['LIF-A2402', 'B24-LIF-002', 'Bengaluru', 'DRDO DMRL', 'LiF 99.999% Deep-UV Transparent Optical Window', '105-200 nm UV', '99.999%', '845 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc LiF UV window'],
    ['LIF-A2403', 'B24-LIF-003', 'Hyderabad', 'Tata Chemicals', 'LiF 99.95% Molten Salt FLiBe Coolant Salt', '2LiF-BeF2 eutectic', '99.95%', '845 degC', '&#8377;920 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'BARC LiF FLiBe salt'],
    ['LIF-A2404', 'B24-LIF-004', 'Chennai', 'Bharat Forge', 'LiF 99.9% Magnesium Metal Reduction Flux', 'Kroll Process Mg', '99.9%', '845 degC', '&#8377;860 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'Vedanta LiF Mg flux'],
    ['LIF-A2405', 'B24-LIF-005', 'Kolkata', 'Shyam Chemicals', 'LiF 99.7% X-Ray Monochromator Crystal', 'Synchrotron Beam', '99.7%', '845 degC', '&#8377;840 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'IIT-Khar LiF monochrom'],
    ['LIF-A2406', 'B24-LIF-006', 'Noida', 'BHEL R&amp;D', 'LiF 99.98% Missile Infrared Seeker Dome', 'MIR Transparent', '99.98%', '845 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'DRDO LiF IR dome'],
    ['LIF-A2407', 'B24-LIF-007', 'Pune', 'Godrej Chemicals', 'LiF 99.5% Aluminum Smelting Electrolyte Additive', 'Cryolite-LiF Mix', '99.5%', '845 degC', '&#8377;760 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Hindalco LiF electrolyte'],
    ['LIF-A2408', 'B24-LIF-008', 'Jaipur', 'Rajasthan Chemicals', 'LiF 99.8% Flux Crystal Growth Substrate', 'LiF(100) Wafer', '99.8%', '845 degC', '&#8377;880 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'IISc LiF crystal sub'],
    ['LIF-A2409', 'B24-LIF-009', 'Guwahati', 'Assam Chemicals', 'LiF 99.99% Radiation Dosimeter TLD Chip', 'LiF:Mg,Cu,P TLD', '99.99%', '845 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G LiF TLD dosim'],
    ['LIF-A2410', 'B24-LIF-010', 'Ahmedabad', 'Gujarat Chemicals', 'LiF 99.6% Fiber Bragg Grating Write Source', 'UV FBG Inscription', '99.6%', '845 degC', '&#8377;820 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Sterlite LiF FBG'],
    ['LIF-A2411', 'B24-LIF-011', 'Lucknow', 'UP Chemicals', 'LiF 99.4% Glass-Ceramic Sealant Compound', 'Low-Melting Seal', '99.4%', '845 degC', '&#8377;740 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'BHEL LiF glass seal'],
    ['LIF-A2412', 'B24-LIF-012', 'Visakhapatnam', 'Vizag Chemicals', 'LiF 99.92% Submarine Nuclear Reactor Coolant', 'Pressurized Water Cool', '99.92%', '845 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSN reactor'],
    ['LIF-A2413', 'B24-LIF-013', 'Balasore', 'DRDO TBRL', 'LiF 99.99% Hypersonic Wind Tunnel Heat Flux Sensor', 'Mach 7+ Calorimeter', '99.99%', '845 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV LiF sensor'],
    ['LIF-A2414', 'B24-LIF-014', 'Bhilai', 'SAIL Chemicals', 'LiF 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '845 degC', '&#8377;520 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL LiF industrial'],
]

# --- Sodium Fluoride: NaF ---
# Prefix: naf2, Icon: IndianRupee, Color: #ea580c (orange), MP 993 degC, density 2.78 g/cm3
# NaF: uranium enrichment UF4 feedstock, dental health caries prevention, glass etching,
# wood preservative, insecticide, nuclear fuel reprocessing flux
naf_records = [
    ['NAF-A2401', 'B24-NAF-001', 'Mumbai', 'MIDHANI', 'NaF 99.99% Uranium Enrichment UF4 Feedstock', 'Nuclear Fuel Feed', '99.99%', '993 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'BARC NaF UF4 feed'],
    ['NAF-A2402', 'B24-NAF-002', 'Bengaluru', 'DRDO DMRL', 'NaF 99.999% High-Purity Dental Caries Preventive', 'Fluoridated Toothpaste', '99.999%', '993 degC', '&#8377;900 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'Colgate NaF dental'],
    ['NAF-A2403', 'B24-NAF-003', 'Hyderabad', 'Tata Chemicals', 'NaF 99.95% Glass Etching Hydrofluoric Alt Agent', 'Decorative Frost', '99.95%', '993 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Asahi NaF glass etch'],
    ['NAF-A2404', 'B24-NAF-004', 'Chennai', 'Bharat Forge', 'NaF 99.9% Wood Preservation Anti-Termite Agent', 'Timber Treatment', '99.9%', '993 degC', '&#8377;800 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'KITCO NaF wood treat'],
    ['NAF-A2405', 'B24-NAF-005', 'Kolkata', 'Shyam Chemicals', 'NaF 99.7% Insecticide Cockroach Bait', 'Pest Control Formulation', '99.7%', '993 degC', '&#8377;720 Cr', 'in-transit', 'medium', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Godrej NaF insecticide'],
    ['NAF-A2406', 'B24-NAF-006', 'Noida', 'BHEL R&amp;D', 'NaF 99.98% Nuclear Fuel Reprocessing Flux', 'Plutonium Separation', '99.98%', '993 degC', '&#8377;960 Cr', 'delivered', 'critical', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BARC NaF reprocess'],
    ['NAF-A2407', 'B24-NAF-007', 'Pune', 'Godrej Chemicals', 'NaF 99.5% Soldering Flux Core Compound', 'Electronic Solder', '99.5%', '993 degC', '&#8377;740 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Bajaj NaF solder flux'],
    ['NAF-A2408', 'B24-NAF-008', 'Jaipur', 'Rajasthan Chemicals', 'NaF 99.8% Optical Fiber Fluorine Doping', 'Fluorosilicate Glass', '99.8%', '993 degC', '&#8377;860 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Sterlite NaF fiber dop'],
    ['NAF-A2409', 'B24-NAF-009', 'Guwahati', 'Assam Chemicals', 'NaF 99.99% Molten Salt Reactor Fuel Salt', 'NaF-ZrF4-UF4 Mix', '99.99%', '993 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G NaF MSR fuel'],
    ['NAF-A2410', 'B24-NAF-010', 'Ahmedabad', 'Gujarat Chemicals', 'NaF 99.6% Laundry Detergent Enzyme Stabilizer', 'Bio-Textile Wash', '99.6%', '993 degC', '&#8377;740 Cr', 'pending', 'medium', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'Surf Excel NaF stab'],
    ['NAF-A2411', 'B24-NAF-011', 'Lucknow', 'UP Chemicals', 'NaF 99.4% Aluminium Smelting Bath Additive', 'AlF3-NaF Eutectic', '99.4%', '993 degC', '&#8377;760 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'Hindalco NaF bath'],
    ['NAF-A2412', 'B24-NAF-012', 'Visakhapatnam', 'Vizag Chemicals', 'NaF 99.92% Submarine Desalination Membrane Feed', 'Forward Osmosis Pre-Treatment', '99.92%', '993 degC', '&#8377;900 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK desal plant'],
    ['NAF-A2413', 'B24-NAF-013', 'Balasore', 'DRDO TBRL', 'NaF 99.99% Hypersonic Rocket Motor Propellant Bond', 'Composite Propellant', '99.99%', '993 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV NaF prop bond'],
    ['NAF-A2414', 'B24-NAF-014', 'Bhilai', 'SAIL Chemicals', 'NaF 99.0% General Industrial Grade', 'Process Chemical', '99.0%', '993 degC', '&#8377;500 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL NaF industrial'],
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


lif_config = {
    'prefix': 'lif2', 'icon': 'Infinity', 'color': '#0891b2',
    'title': 'Lithium Fluoride Logistics',
    'subtitle': 'LiF fusion breeder &#8226; UV transparent optic &#8226; FLiBe molten salt &#8226; TLD dosimeter supply chain',
    'fn_name': 'LithiumFluorideLogisticsView',
}
with open('src/components/modules/lithium-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(lif_records, lif_config))
print("Generated: lithium-fluoride-logistics-view.tsx")

naf_config = {
    'prefix': 'naf2', 'icon': 'IndianRupee', 'color': '#ea580c',
    'title': 'Sodium Fluoride Logistics',
    'subtitle': 'NaF uranium enrichment &#8226; Dental caries prevention &#8226; Glass etching &#8226; MSR fuel salt supply chain',
    'fn_name': 'SodiumFluorideLogisticsView',
}
with open('src/components/modules/sodium-fluoride-logistics-view.tsx', 'w') as f:
    f.write(gen_module(naf_records, naf_config))
print("Generated: sodium-fluoride-logistics-view.tsx")

for fname in ['src/components/modules/lithium-fluoride-logistics-view.tsx', 'src/components/modules/sodium-fluoride-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
