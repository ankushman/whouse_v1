#!/usr/bin/env python3
"""R484 Generator: Chromium Carbide Logistics + Vanadium Carbide Logistics"""
import re

TEMPLATE_PATH = 'src/components/modules/zinc-oxide-logistics-view.tsx'

# --- Chromium Carbide: Cr3C2 ---
# Prefix: crc, Icon: Banana, Color: #78350f (brown-dark), MP 1895 degC, density 6.68 g/cm3
# Cr3C2: thermal spray wear coating, HVOF supersonic deposition, gas turbine seal,
# coal boiler erosion shield, cutting tool binder, automotive brake pad additive,
# high-temp oxidation-resistant overlay, steel hardfacing
crc_records = [
    ['CRC-A2401', 'B24-CRC-001', 'Mumbai', 'MIDHANI', 'Cr3C2 99.9% HVOF Thermal Spray Wear Coating', 'Supersonic Particle', '99.9%', '1895 degC', '&#8377;860 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Praxair Cr3C2 HVOF'],
    ['CRC-A2402', 'B24-CRC-002', 'Bengaluru', 'DRDO DMRL', 'Cr3C2 99.99% Gas Turbine Blade Shroud Seal', 'Kaveri Engine LPT', '99.99%', '1895 degC', '&#8377;940 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'GTRE Cr3C2 seal'],
    ['CRC-A2403', 'B24-CRC-003', 'Hyderabad', 'Tata Chemicals', 'Cr3C2 99.7% Coal Boiler Tube Erosion Shield', 'NTPC 660 MW Unit', '99.7%', '1895 degC', '&#8377;800 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'NTPC Cr3C2 erosion'],
    ['CRC-A2404', 'B24-CRC-004', 'Chennai', 'Bharat Forge', 'Cr3C2 99.5% NiCr-Cr3C2 High-Temp Overlay', 'Flame Spray Fused', '99.5%', '1895 degC', '&#8377;880 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'BHEL Cr3C2 overlay'],
    ['CRC-A2405', 'B24-CRC-005', 'Kolkata', 'Shyam Chemicals', 'Cr3C2 99.8% Automotive Brake Pad Friction Additive', 'Disc Brake Composite', '99.8%', '1895 degC', '&#8377;760 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'Bosch Cr3C2 brake'],
    ['CRC-A2406', 'B24-CRC-006', 'Noida', 'BHEL R&amp;D', 'Cr3C2 99.6% Steel Hardfacing Weld Overlay Wire', 'PTA Cr3C2-NiCr', '99.6%', '1895 degC', '&#8377;820 Cr', 'delivered', 'medium', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'BHEL Cr3C2 hardface'],
    ['CRC-A2407', 'B24-CRC-007', 'Pune', 'Godrej Chemicals', 'Cr3C2 99.4% Pump Shaft Sleeve Wear Coating', 'Centrifugal Slurry', '99.4%', '1895 degC', '&#8377;800 Cr', 'in-transit', 'medium', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'Kirloskar Cr3C2 sleeve'],
    ['CRC-A2408', 'B24-CRC-008', 'Jaipur', 'Rajasthan Chemicals', 'Cr3C2 99.3% Oil Gas Well Drill Pipe Coating', 'Sour Service H2S', '99.3%', '1895 degC', '&#8377;840 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'ONGC Cr3C2 drill'],
    ['CRC-A2409', 'B24-CRC-009', 'Guwahati', 'Assam Chemicals', 'Cr3C2 99.9% Hydro Turbine Runner Erosion Coat', 'NHPC 200 MW Unit', '99.9%', '1895 degC', '&#8377;880 Cr', 'in-transit', 'high', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'NHPC Cr3C2 turbine'],
    ['CRC-A2410', 'B24-CRC-010', 'Ahmedabad', 'Gujarat Chemicals', 'Cr3C2 99.5% Refinery FCC Catalyst Erosion Guard', 'Cyclone Separator', '99.5%', '1895 degC', '&#8377;820 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IOCL Cr3C2 FCC guard'],
    ['CRC-A2411', 'B24-CRC-011', 'Lucknow', 'UP Chemicals', 'Cr3C2 99.2% Paper Mill Yankee Dryer Coating', 'Cast Iron Cylinder', '99.2%', '1895 degC', '&#8377;740 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'JK Paper Cr3C2 dryer'],
    ['CRC-A2412', 'B24-CRC-012', 'Visakhapatnam', 'Vizag Chemicals', 'Cr3C2 99.92% Submarine Propeller Shaft Journal Bearing', 'SSK Stern Tube', '99.92%', '1895 degC', '&#8377;900 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK journal'],
    ['CRC-A2413', 'B24-CRC-013', 'Balasore', 'DRDO TBRL', 'Cr3C2 99.99% Hypersonic Test Facility Nozzle Coating', 'Mach 7+ HWT Nozzle', '99.99%', '1895 degC', '&#8377;940 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV nozzle'],
    ['CRC-A2414', 'B24-CRC-014', 'Bhilai', 'SAIL Chemicals', 'Cr3C2 99.0% General Thermal Spray Powder', 'Process Chemical', '99.0%', '1895 degC', '&#8377;520 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL Cr3C2 thermal'],
]

# --- Vanadium Carbide: VC ---
# Prefix: vc, Icon: Grip, Color: #4338ca (indigo), MP 2810 degC, density 5.77 g/cm3
# VC: tool steel grain refiner, V4C3 precipitate hardening, hydrogen storage MgH2 catalyst,
# superconductor NaV3O6 precursor, cutting tool cermet additive, steel deoxidizer,
# wear-resistant welding electrode, aerospace titanium alloy V-C alloy
vc_records = [
    ['VC-A2401', 'B24-VC-001', 'Mumbai', 'MIDHANI', 'VC 99.9% Tool Steel Grain Refiner V4C3', 'H13 Hot Work Die', '99.9%', '2810 degC', '&#8377;900 Cr', 'in-transit', 'critical', 'Mumbai', 'Pune', '2024-07-15', '3', 'West', 'Sandvik VC grain ref'],
    ['VC-A2402', 'B24-VC-002', 'Bengaluru', 'DRDO DMRL', 'VC 99.99% Hydrogen Storage MgH2 Catalyst', 'Ti-V-C Alloy 4.2 wt%', '99.99%', '2810 degC', '&#8377;1080 Cr', 'delivered', 'critical', 'Bengaluru', 'Chennai', '2024-07-10', '2', 'South', 'IISc VC MgH2 catalyst'],
    ['VC-A2403', 'B24-VC-003', 'Hyderabad', 'Tata Chemicals', 'VC 99.7% High-Speed Steel Cutting Tool Additive', 'M2 HSS VC Grain', '99.7%', '2810 degC', '&#8377;860 Cr', 'in-transit', 'high', 'Hyderabad', 'Hyderabad', '2024-07-18', '1', 'South', 'Kennametal VC HSS'],
    ['VC-A2404', 'B24-VC-004', 'Chennai', 'Bharat Forge', 'VC 99.5% Aerospace Titanium Alloy V-C Additive', 'Ti-6Al-4V ELI', '99.5%', '2810 degC', '&#8377;920 Cr', 'delivered', 'high', 'Chennai', 'Chennai', '2024-07-08', '0', 'South', 'HAL Ti-VC alloy'],
    ['VC-A2405', 'B24-VC-005', 'Kolkata', 'Shyam Chemicals', 'VC 99.8% Wear-Resistant Weld Overlay Electrode', 'PTA VC-FeCr Matrix', '99.8%', '2810 degC', '&#8377;840 Cr', 'in-transit', 'high', 'Kolkata', 'Visakhapatnam', '2024-07-20', '5', 'East', 'BHEL VC weld overlay'],
    ['VC-A2406', 'B24-VC-006', 'Noida', 'BHEL R&amp;D', 'VC 99.6% Steelmaking Vanadium Deoxidizer', 'LD Converter Fe-V', '99.6%', '2810 degC', '&#8377;800 Cr', 'delivered', 'medium', 'Noida', 'Noida', '2024-07-12', '0', 'North', 'SAIL VC deox'],
    ['VC-A2407', 'B24-VC-007', 'Pune', 'Godrej Chemicals', 'VC 99.4% Superconducting NaV3O6 Precursor', 'Low-T SC Wire', '99.4%', '2810 degC', '&#8377;1000 Cr', 'in-transit', 'high', 'Pune', 'Mumbai', '2024-07-16', '2', 'West', 'IISc VC supercon'],
    ['VC-A2408', 'B24-VC-008', 'Jaipur', 'Rajasthan Chemicals', 'VC 99.3% Cemented Carbide VC-Co-Ni Binder', 'WC-VC-Co Fine Grain', '99.3%', '2810 degC', '&#8377;880 Cr', 'delivered', 'high', 'Jaipur', 'Jaipur', '2024-07-09', '1', 'North', 'Sandvik VC binder'],
    ['VC-A2409', 'B24-VC-009', 'Guwahati', 'Assam Chemicals', 'VC 99.9% Thermoelectric Generator SEG Leg', 'TiC-VC-NiC SEG', '99.9%', '2810 degC', '&#8377;960 Cr', 'in-transit', 'critical', 'Guwahati', 'Kolkata', '2024-07-22', '4', 'East', 'IIT-G VC TEG'],
    ['VC-A2410', 'B24-VC-010', 'Ahmedabad', 'Gujarat Chemicals', 'VC 99.5% Sodium-Ion Battery Anode Precursor', 'NaV3O6 Cathode', '99.5%', '2810 degC', '&#8377;920 Cr', 'pending', 'high', 'Ahmedabad', 'Bengaluru', '2024-07-25', '3', 'West', 'IIT-B VC SIB'],
    ['VC-A2411', 'B24-VC-011', 'Lucknow', 'UP Chemicals', 'VC 99.2% Rail Steel Railhead Wear Resistance', 'R260 Pearlitic Rail', '99.2%', '2810 degC', '&#8377;820 Cr', 'delivered', 'medium', 'Lucknow', 'Lucknow', '2024-07-11', '0', 'North', 'SAIL VC rail wear'],
    ['VC-A2412', 'B24-VC-012', 'Visakhapatnam', 'Vizag Chemicals', 'VC 99.92% Submarine Hull Sonar Dome Coating', 'SSK Acoustic Stealth', '99.92%', '2810 degC', '&#8377;960 Cr', 'delayed', 'critical', 'Visakhapatnam', 'Visakhapatnam', '2024-07-06', '28', 'South', 'IN Navy SSK sonar dome'],
    ['VC-A2413', 'B24-VC-013', 'Balasore', 'DRDO TBRL', 'VC 99.99% Hypersonic Vehicle Aerodynamic Surface', 'Mach 9+ CVD Coating', '99.99%', '2810 degC', '&#8377;1080 Cr', 'in-transit', 'critical', 'Balasore', 'Chandipur', '2024-07-19', '2', 'East', 'DRDO HSTDV VC aero'],
    ['VC-A2414', 'B24-VC-014', 'Bhilai', 'SAIL Chemicals', 'VC 99.0% General Ferro-Alloy Grade', 'Process Chemical', '99.0%', '2810 degC', '&#8377;560 Cr', 'delivered', 'low', 'Bhilai', 'Bhilai', '2024-07-05', '0', 'East', 'SAIL VC ferro-alloy'],
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


crc_config = {
    'prefix': 'crc', 'icon': 'Banana', 'color': '#78350f',
    'title': 'Chromium Carbide Logistics',
    'subtitle': 'Cr3C2 thermal spray &#8226; HVOF wear coating &#8226; Gas turbine seal &#8226; Boiler erosion shield supply chain',
    'fn_name': 'ChromiumCarbideLogisticsView',
}
with open('src/components/modules/chromium-carbide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(crc_records, crc_config))
print("Generated: chromium-carbide-logistics-view.tsx")

vc_config = {
    'prefix': 'vc', 'icon': 'Grip', 'color': '#4338ca',
    'title': 'Vanadium Carbide Logistics',
    'subtitle': 'VC grain refiner &#8226; Hydrogen storage catalyst &#8226; Superconducting precursor &#8226; Tool steel additive supply chain',
    'fn_name': 'VanadiumCarbideLogisticsView',
}
with open('src/components/modules/vanadium-carbide-logistics-view.tsx', 'w') as f:
    f.write(gen_module(vc_records, vc_config))
print("Generated: vanadium-carbide-logistics-view.tsx")

for fname in ['src/components/modules/chromium-carbide-logistics-view.tsx', 'src/components/modules/vanadium-carbide-logistics-view.tsx']:
    with open(fname, 'r') as f:
        c = f.read()
    rs = c[c.find('RECORDS = ['):c.find('];')]
    bad = re.findall(r"'[^']*'\s*:\s*'", rs)
    print(f"  {'WARNING: '+str(len(bad))+' typos' if bad else 'OK'}: {fname.split('/')[-1]}, Lines: {c.count(chr(10))+1}")
