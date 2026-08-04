#!/usr/bin/env python3
"""R433 Generator: Magnesium Oxide (MgO) + Barium Titanate (BaTiO3) logistics modules."""
import re

TEMPLATE = "/home/z/my-project/src/components/modules/aluminium-nitride-logistics-view.tsx"
OUT_DIR = "/home/z/my-project/src/components/modules"

def clone_module(slug_var, slug_camel, icon, hex_color, title, subtitle, spec_label, spec_unit, records):
    src = TEMPLATE
    dst = f"{OUT_DIR}/{slug_var.replace('_','-')}-logistics-view.tsx"
    
    with open(src, 'r') as f:
        content = f.read()
    
    # Replace import icon
    old_icon = re.search(r"import \{ (\w+) \} from 'lucide-react';", content).group(1)
    content = content.replace(f"import {{ {old_icon} }} from 'lucide-react';", f"import {{ {icon} }} from 'lucide-react';")
    
    # Replace const name (both definition and usage)
    old_var = re.search(r'const (\w+_RECORDS) =', content).group(1)
    content = content.replace(f'const {old_var} =', f'const {slug_var}_RECORDS =')
    content = content.replace(f'return {old_var}.filter', f'return {slug_var}_RECORDS.filter')
    
    # Replace function name
    old_fn = re.search(r'export default function (\w+LogisticsView)', content).group(1)
    content = content.replace(f'function {old_fn}()', f'function {slug_camel}LogisticsView()')
    
    # Replace colors
    old_colors = re.findall(r"'#[0-9a-fA-F]{6}'", content)
    if old_colors:
        old_c = old_colors[0]
        content = content.replace(old_c, f"'{hex_color}'")
    
    # Replace icon JSX usage
    content = content.replace(f'<{old_icon} className', f'<{icon} className')
    
    # Replace title and subtitle
    content = re.sub(r'<h2 className="text-xl font-bold">.*?</h2>', f'<h2 className="text-xl font-bold">{title}</h2>', content)
    content = re.sub(r'<p className="text-sm text-gray-400">.*?</p>', f'<p className="text-sm text-gray-400">{subtitle}</p>', content, count=1)
    
    # Replace spec label and unit
    content = re.sub(r'>\w[\w\s]+\w Distribution</h3>', f'>{spec_label} Distribution</h3>', content)
    content = re.sub(r'\{\{r\[7\]\}\} \w[\w/]+</span>', f'{{r[7]}} {spec_unit}</span>', content)
    
    # Replace records block
    rec_str = "\n".join("  [" + ", ".join(f"'{x}'" for x in r) + "]," for r in records)
    content = re.sub(r'const \w+_RECORDS = \[\n.*?\n\];', f'const {slug_var}_RECORDS = [\n{rec_str}\n];', content, flags=re.DOTALL)
    
    with open(dst, 'w') as f:
        f.write(content)
    print(f"  Written: {dst}")
    return dst


# ===== MODULE 1: Magnesium Oxide (MgO) =====
# High-temperature refractory, electrical insulator, crucible, pharmaceutical antacid
mgo_records = [
  ("MGO-A2401","B24-MGO-001","Hyderabad","MIDHANI","MgO 99.9% Electrical Insulator","HV Bushing","99.9%","2800 degC","&#8377;920 Cr","in-transit","critical","Hyderabad","Bengaluru","2024-07-15","3","South"),
  ("MGO-A2402","B24-MGO-002","Bengaluru","DRDO DMRL","MgO 99.5% Radar Dome","AESA Radome","99.5%","2800 degC","&#8377;880 Cr","delivered","high","Bengaluru","Bengaluru","2024-07-10","1","South"),
  ("MGO-A2403","B24-MGO-003","Mumbai","Tata Steel","MgO 99.0% Steel Refractory","LD Converter","99.0%","2800 degC","&#8377;760 Cr","in-transit","high","Mumbai","Jamshedpur","2024-07-18","4","West"),
  ("MGO-A2404","B24-MGO-004","Pune","Bharat Forge","MgO 98.5% Crucible","Investment Cast","98.5%","2780 degC","&#8377;720 Cr","delivered","medium","Pune","Pune","2024-07-08","0","West"),
  ("MGO-A2405","B24-MGO-005","Chennai","Shyam Refractories","MgO 99.7% Cement Rotary","Kiln Lining","99.7%","2800 degC","&#8377;840 Cr","in-transit","critical","Chennai","Visakhapatnam","2024-07-20","5","South"),
  ("MGO-A2406","B24-MGO-006","Kolkata","BHEL R&amp;D","MgO 99.3% Boiler Panel","CFBC Lining","99.3%","2790 degC","&#8377;800 Cr","delivered","high","Kolkata","Kolkata","2024-07-12","1","East"),
  ("MGO-A2407","B24-MGO-007","Noida","Godrej Pharma","MgO 99.8% Antacid Pharma","Tablet Grade","99.8%","2852 degC","&#8377;700 Cr","in-transit","high","Noida","Hyderabad","2024-07-16","2","North"),
  ("MGO-A2408","B24-MGO-008","Jaipur","Rajasthan Refractories","MgO 99.1% Glass Furnace","Float Glass","99.1%","2800 degC","&#8377;740 Cr","delivered","medium","Jaipur","Mumbai","2024-07-09","3","North"),
  ("MGO-A2409","B24-MGO-009","Guwahati","Assam Refractories","MgO 99.6% Transformer Core","MgO Insulator","99.6%","2810 degC","&#8377;860 Cr","in-transit","high","Guwahati","Kolkata","2024-07-22","4","East"),
  ("MGO-A2410","B24-MGO-010","Ahmedabad","Gujarat Refractories","MgO 99.95% Space Igniter","SRB Ignition","99.95%","2852 degC","&#8377;940 Cr","pending","critical","Ahmedabad","Sriharikota","2024-07-25","6","West"),
  ("MGO-A2411","B24-MGO-011","Lucknow","UP Refractories","MgO 99.2% Cattle Feed","Mineral Supplement","99.2%","2800 degC","&#8377;640 Cr","delivered","low","Lucknow","Lucknow","2024-07-11","0","North"),
  ("MGO-A2412","B24-MGO-012","Visakhapatnam","Vizag Refractories","MgO 99.8% Submarine Insulator","Propulsion Motor","99.8%","2820 degC","&#8377;940 Cr","delayed","critical","Visakhapatnam","Visakhapatnam","2024-07-06","28","South"),
  ("MGO-A2413","B24-MGO-013","Balasore","DRDO TBRL","MgO 99.7% Missile Nozzle","ScramJet Liner","99.7%","2800 degC","&#8377;880 Cr","in-transit","critical","Balasore","Chandipur","2024-07-19","2","East"),
  ("MGO-A2414","B24-MGO-014","Bhilai","SAIL Refractories","MgO 97% General Refractory","Blast Furnace","97.0%","2750 degC","&#8377;640 Cr","delivered","medium","Bhilai","Bhilai","2024-07-05","0","East"),
]

print("=== R433a: Magnesium Oxide Logistics ===")
clone_module("magnesium_oxide", "Magnesium_Oxide", "FlaskConical", "059669",
  "Magnesium Oxide Logistics",
  "MgO high-temp refractory &#8226; Electrical insulator &#8226; Crucible &#8226; Pharmaceutical supply chain",
  "Melting Point", "degC",
  mgo_records)


# ===== MODULE 2: Barium Titanate (BaTiO3) =====
# Piezoelectric transducer, MLCC capacitor, ferroelectric memory, sonar
batio3_records = [
  ("BTO-A2401","B24-BTO-001","Bengaluru","MIDHANI","BaTiO3 99.9% MLCC Capacitor","5G Filter","99.9%","1200 pC/N","&#8377;920 Cr","in-transit","critical","Bengaluru","Chennai","2024-07-15","3","South"),
  ("BTO-A2402","B24-BTO-002","Hyderabad","DRDO DMRL","BaTiO3 99.5% Sonar Transducer","Bow Array","99.5%","1150 pC/N","&#8377;940 Cr","delivered","critical","Hyderabad","Visakhapatnam","2024-07-10","1","South"),
  ("BTO-A2403","B24-BTO-003","Mumbai","Tata Electronics","BaTiO3 99.8% Piezo Actuator","MEMS Mirror","99.8%","1200 pC/N","&#8377;900 Cr","in-transit","critical","Mumbai","Pune","2024-07-18","2","West"),
  ("BTO-A2404","B24-BTO-004","Chennai","Bharat Forge","BaTiO3 99.0% Ferroelectric RAM","FeRAM Chip","99.0%","1100 pC/N","&#8377;840 Cr","delivered","high","Chennai","Chennai","2024-07-08","0","South"),
  ("BTO-A2405","B24-BTO-005","Kolkata","Shyam Ceramics","BaTiO3 99.7% PZT Substrate","Ultrasound","99.7%","1180 pC/N","&#8377;880 Cr","in-transit","high","Kolkata","Kolkata","2024-07-20","1","East"),
  ("BTO-A2406","B24-BTO-006","Noida","BHEL R&amp;D","BaTiO3 99.3% Vibration Sensor","GT Monitor","99.3%","1120 pC/N","&#8377;760 Cr","delivered","high","Noida","Noida","2024-07-12","0","North"),
  ("BTO-A2407","B24-BTO-007","Pune","Godrej Ceramics","BaTiO3 99.6% Ignition Piezo","Gas Lighter","99.6%","1170 pC/N","&#8377;720 Cr","in-transit","medium","Pune","Pune","2024-07-16","1","West"),
  ("BTO-A2408","B24-BTO-008","Jaipur","Rajasthan Ceramics","BaTiO3 98.5% Dielectric Resin","Capacitor Film","98.5%","1050 pC/N","&#8377;680 Cr","delivered","medium","Jaipur","Gurugram","2024-07-09","2","North"),
  ("BTO-A2409","B24-BTO-009","Guwahati","Assam Ceramics","BaTiO3 99.4% Hydrophone","Seismic Sensor","99.4%","1140 pC/N","&#8377;840 Cr","in-transit","high","Guwahati","Kolkata","2024-07-22","4","East"),
  ("BTO-A2410","B24-BTO-010","Ahmedabad","Gujarat Ceramics","BaTiO3 99.95% Space Gyro","Satellite IMU","99.95%","1200 pC/N","&#8377;960 Cr","pending","critical","Ahmedabad","Sriharikota","2024-07-25","6","West"),
  ("BTO-A2411","B24-BTO-011","Lucknow","UP Ceramics","BaTiO3 99.2% SAW Filter","Telecom RF","99.2%","1130 pC/N","&#8377;800 Cr","delivered","high","Lucknow","Noida","2024-07-11","2","North"),
  ("BTO-A2412","B24-BTO-012","Visakhapatnam","Vizag Ceramics","BaTiO3 99.8% Submarine Sonar","Towed Array","99.8%","1190 pC/N","&#8377;940 Cr","delayed","critical","Visakhapatnam","Visakhapatnam","2024-07-06","28","South"),
  ("BTO-A2413","B24-BTO-013","Balasore","DRDO TBRL","BaTiO3 99.6% Missile Fuze","Proximity Sensor","99.6%","1160 pC/N","&#8377;880 Cr","in-transit","critical","Balasore","Chandipur","2024-07-19","2","East"),
  ("BTO-A2414","B24-BTO-014","Bhilai","SAIL Ceramics","BaTiO3 97% General Ceramic","Spark Plug","97.0%","1000 pC/N","&#8377;640 Cr","delivered","low","Bhilai","Bhilai","2024-07-05","0","East"),
]

print("\n=== R433b: Barium Titanate Logistics ===")
clone_module("barium_titanate", "Barium_Titanate", "Waves", "ca8a04",
  "Barium Titanate Logistics",
  "BaTiO3 piezoelectric &#8226; MLCC capacitor &#8226; Ferroelectric memory &#8226; Sonar transducer supply chain",
  "Piezo Coefficient", "pC/N",
  batio3_records)

print("\n=== R433 Generation Complete ===")
