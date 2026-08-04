#!/usr/bin/env python3
"""R435 Generator: Zinc Oxide (ZnO) + Tin Oxide (SnO2) logistics modules."""
import re

TEMPLATE = "/home/z/my-project/src/components/modules/aluminium-nitride-logistics-view.tsx"
OUT_DIR = "/home/z/my-project/src/components/modules"

def clone_module(slug_var, slug_camel, icon, hex_color, title, subtitle, spec_label, spec_unit, records):
    dst = f"{OUT_DIR}/{slug_var.replace('_','-')}-logistics-view.tsx"
    with open(TEMPLATE, 'r') as f:
        content = f.read()
    old_icon = re.search(r"import \{ (\w+) \} from 'lucide-react';", content).group(1)
    content = content.replace(f"import {{ {old_icon} }} from 'lucide-react';", f"import {{ {icon} }} from 'lucide-react';")
    old_var = re.search(r'const (\w+_RECORDS) =', content).group(1)
    content = content.replace(f'const {old_var} =', f'const {slug_var}_RECORDS =')
    content = content.replace(f'return {old_var}.filter', f'return {slug_var}_RECORDS.filter')
    old_fn = re.search(r'export default function (\w+LogisticsView)', content).group(1)
    content = content.replace(f'function {old_fn}()', f'function {slug_camel}LogisticsView()')
    old_colors = re.findall(r"'#[0-9a-fA-F]{6}'", content)
    if old_colors:
        content = content.replace(old_colors[0], f"'{hex_color}'")
    content = content.replace(f'<{old_icon} className', f'<{icon} className')
    content = re.sub(r'<h2 className="text-xl font-bold">.*?</h2>', f'<h2 className="text-xl font-bold">{title}</h2>', content)
    content = re.sub(r'<p className="text-sm text-gray-400">.*?</p>', f'<p className="text-sm text-gray-400">{subtitle}</p>', content, count=1)
    content = re.sub(r'>\w[\w\s]+\w Distribution</h3>', f'>{spec_label} Distribution</h3>', content)
    content = re.sub(r'\{\{r\[7\]\}\} \w[\w/]+</span>', f'{{r[7]}} {spec_unit}</span>', content)
    rec_str = "\n".join("  [" + ", ".join(f"'{x}'" for x in r) + "]," for r in records)
    content = re.sub(r'const \w+_RECORDS = \[\n.*?\n\];', f'const {slug_var}_RECORDS = [\n{rec_str}\n];', content, flags=re.DOTALL)
    with open(dst, 'w') as f:
        f.write(content)
    print(f"  Written: {dst}")
    return dst


# ===== MODULE 1: Zinc Oxide (ZnO) =====
# Varistor, sunscreen UV blocker, rubber vulcanization, semiconductor LED, anti-corrosion
zno_records = [
  ("ZNO-A2401","B24-ZNO-001","Mumbai","MIDHANI","ZnO 99.9% Varistor","Surge Arrester","99.9%","1975 degC","&#8377;900 Cr","in-transit","critical","Mumbai","Pune","2024-07-15","3","West"),
  ("ZNO-A2402","B24-ZNO-002","Bengaluru","DRDO DMRL","ZnO 99.7% Rubber Vulcanize","Radial Tire","99.7%","1970 degC","&#8377;760 Cr","delivered","high","Bengaluru","Chennai","2024-07-10","2","South"),
  ("ZNO-A2403","B24-ZNO-003","Hyderabad","Tata Chemicals","ZnO 99.5% Sunscreen Nano","UV Blocker","99.5%","1975 degC","&#8377;720 Cr","in-transit","high","Hyderabad","Hyderabad","2024-07-18","1","South"),
  ("ZNO-A2404","B24-ZNO-004","Chennai","Bharat Forge","ZnO 99.0% Ceramic Glaze","Wall Tile","99.0%","1960 degC","&#8377;680 Cr","delivered","medium","Chennai","Chennai","2024-07-08","0","South"),
  ("ZNO-A2405","B24-ZNO-005","Kolkata","Shyam Chemicals","ZnO 99.8% Anti-Corrosion","Marine Paint","99.8%","1972 degC","&#8377;840 Cr","in-transit","high","Kolkata","Visakhapatnam","2024-07-20","5","East"),
  ("ZNO-A2406","B24-ZNO-006","Noida","BHEL R&amp;D","ZnO 99.3% Gas Sensor","CO Detect","99.3%","1965 degC","&#8377;800 Cr","delivered","high","Noida","Noida","2024-07-12","0","North"),
  ("ZNO-A2407","B24-ZNO-007","Pune","Godrej Chemicals","ZnO 99.6% UV LED Phosphor","Blue Chip","99.6%","1975 degC","&#8377;880 Cr","in-transit","critical","Pune","Mumbai","2024-07-16","2","West"),
  ("ZNO-A2408","B24-ZNO-008","Jaipur","Rajasthan Chemicals","ZnO 98.5% Animal Feed","Zinc Supplement","98.5%","1950 degC","&#8377;640 Cr","delivered","low","Jaipur","Jaipur","2024-07-09","1","North"),
  ("ZNO-A2409","B24-ZNO-009","Guwahati","Assam Chemicals","ZnO 99.4% Spintronics","Dilute Magnetic","99.4%","1970 degC","&#8377;860 Cr","in-transit","high","Guwahati","Kolkata","2024-07-22","4","East"),
  ("ZNO-A2410","B24-ZNO-010","Ahmedabad","Gujarat Chemicals","ZnO 99.95% Transparent Electrode","TCO Film","99.95%","1975 degC","&#8377;940 Cr","pending","critical","Ahmedabad","Bengaluru","2024-07-25","3","West"),
  ("ZNO-A2411","B24-ZNO-011","Lucknow","UP Chemicals","ZnO 99.2% Cement Additive","Quick Set","99.2%","1968 degC","&#8377;720 Cr","delivered","medium","Lucknow","Lucknow","2024-07-11","0","North"),
  ("ZNO-A2412","B24-ZNO-012","Visakhapatnam","Vizag Chemicals","ZnO 99.8% Submarine Anode","Cathodic Protect","99.8%","1972 degC","&#8377;940 Cr","delayed","critical","Visakhapatnam","Visakhapatnam","2024-07-06","28","South"),
  ("ZNO-A2413","B24-ZNO-013","Balasore","DRDO TBRL","ZnO 99.6% Smoke Grenade","IR Obscurant","99.6%","1970 degC","&#8377;880 Cr","in-transit","critical","Balasore","Chandipur","2024-07-19","2","East"),
  ("ZNO-A2414","B24-ZNO-014","Bhilai","SAIL Chemicals","ZnO 97% General Chemical","Galvanizing","97.0%","1940 degC","&#8377;640 Cr","delivered","low","Bhilai","Bhilai","2024-07-05","0","East"),
]

print("=== R435a: Zinc Oxide Logistics ===")
clone_module("zinc_oxide", "Zinc_Oxide", "ShieldCheck", "16a34a",
  "Zinc Oxide Logistics",
  "ZnO varistor &#8226; UV blocker &#8226; Rubber vulcanization &#8226; TCO electrode supply chain",
  "Melting Point", "degC",
  zno_records)


# ===== MODULE 2: Tin Oxide (SnO2) =====
# Transparent conductive oxide, gas sensor, display electrode, touch screen, catalyst
sno2_records = [
  ("SNO-A2401","B24-SNO-001","Bengaluru","MIDHANI","SnO2 99.99% ITO Target","Touch Panel","99.99%","1630 degC","&#8377;940 Cr","in-transit","critical","Bengaluru","Hyderabad","2024-07-15","3","South"),
  ("SNO-A2402","B24-SNO-002","Hyderabad","DRDO DMRL","SnO2 99.9% Gas Sensor Array","CBRN Detect","99.9%","1625 degC","&#8377;900 Cr","delivered","critical","Hyderabad","Hyderabad","2024-07-10","1","South"),
  ("SNO-A2403","B24-SNO-003","Mumbai","Tata Electronics","SnO2 99.95% LCD Electrode","Flat Panel","99.95%","1630 degC","&#8377;920 Cr","in-transit","critical","Mumbai","Pune","2024-07-18","2","West"),
  ("SNO-A2404","B24-SNO-004","Chennai","Bharat Forge","SnO2 99.0% Solar Cell TCO","PV Front","99.0%","1610 degC","&#8377;800 Cr","delivered","high","Chennai","Chennai","2024-07-08","0","South"),
  ("SNO-A2405","B24-SNO-005","Kolkata","Shyam Ceramics","SnO2 99.7% EMI Shielding","RF Coating","99.7%","1628 degC","&#8377;860 Cr","in-transit","high","Kolkata","Kolkata","2024-07-20","1","East"),
  ("SNO-A2406","B24-SNO-006","Noida","BHEL R&amp;D","SnO2 99.5% Catalyst","Methanol Synth","99.5%","1620 degC","&#8377;780 Cr","delivered","high","Noida","Noida","2024-07-12","0","North"),
  ("SNO-A2407","B24-SNO-007","Pune","Godrej Ceramics","SnO2 99.8% Smart Glass","Electrochromic","99.8%","1628 degC","&#8377;880 Cr","in-transit","critical","Pune","Mumbai","2024-07-16","2","West"),
  ("SNO-A2408","B24-SNO-008","Jaipur","Rajasthan Ceramics","SnO2 98.5% Ceramic Glaze","Opacifier","98.5%","1600 degC","&#8377;680 Cr","delivered","medium","Jaipur","Delhi","2024-07-09","2","North"),
  ("SNO-A2409","B24-SNO-009","Guwahati","Assam Ceramics","SnO2 99.6% Flame Retardant","Textile Coat","99.6%","1625 degC","&#8377;800 Cr","in-transit","high","Guwahati","Kolkata","2024-07-22","4","East"),
  ("SNO-A2410","B24-SNO-010","Ahmedabad","Gujarat Ceramics","SnO2 99.98% OLED Anode","Flexible Display","99.98%","1630 degC","&#8377;960 Cr","pending","critical","Ahmedabad","Bengaluru","2024-07-25","3","West"),
  ("SNO-A2411","B24-SNO-011","Lucknow","UP Ceramics","SnO2 99.3% Anti-Reflect","Solar AR","99.3%","1615 degC","&#8377;760 Cr","delivered","high","Lucknow","Noida","2024-07-11","2","North"),
  ("SNO-A2412","B24-SNO-012","Visakhapatnam","Vizag Ceramics","SnO2 99.8% Submarine Periscope","Optical Coat","99.8%","1628 degC","&#8377;940 Cr","delayed","critical","Visakhapatnam","Visakhapatnam","2024-07-06","28","South"),
  ("SNO-A2413","B24-SNO-013","Balasore","DRDO TBRL","SnO2 99.7% Missile Seeker","IR Dome","99.7%","1625 degC","&#8377;900 Cr","in-transit","critical","Balasore","Chandipur","2024-07-19","2","East"),
  ("SNO-A2414","B24-SNO-014","Bhilai","SAIL Ceramics","SnO2 97% General Glass","Bottle Opac","97.0%","1590 degC","&#8377;640 Cr","delivered","low","Bhilai","Bhilai","2024-07-05","0","East"),
]

print("\n=== R435b: Tin Oxide Logistics ===")
clone_module("tin_oxide", "Tin_Oxide", "Lightbulb", "854d0e",
  "Tin Oxide Logistics",
  "SnO2 TCO electrode &#8226; Gas sensor &#8226; Display &#8226; Smart glass supply chain",
  "Melting Point", "degC",
  sno2_records)

print("\n=== R435 Generation Complete ===")
