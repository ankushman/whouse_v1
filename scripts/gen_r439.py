#!/usr/bin/env python3
"""gen_r439.py — R439: Titanium Dioxide (TiO2) + Silicon Dioxide (SiO2) logistics modules.
Clone-and-customize from zinc-oxide template."""
import re

TEMPLATE = 'src/components/modules/zinc-oxide-logistics-view.tsx'

MODULES = [
  {
    'slug': 'titanium-dioxide',
    'title': 'Titanium Dioxide',
    'formula': 'TiO2',
    'icon': 'Sun',
    'color': '#eab308',       # yellow — white pigment/UV/sunscreen
    'prefix': 'TIO',
    'subtitle': 'TiO2 white pigment &#8226; Sunscreen UV &#8226; Photocatalyst &#8226; Ceramic glaze supply chain',
    'var': 'titanium_dioxide',
    'func': 'Titanium_DioxideLogisticsView',
    'records': [
      ['TIO-A2401','B24-TIO-001','Mumbai','MIDHANI','TiO2 99.9% Rutile Pigment','Paint Opacifier','99.9%','1843 degC','&#8377;920 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['TIO-A2402','B24-TIO-002','Bengaluru','DRDO DMRL','TiO2 99.7% Sunscreen Nano','UV Broadband','99.7%','1843 degC','&#8377;880 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['TIO-A2403','B24-TIO-003','Hyderabad','Tata Chemicals','TiO2 99.5% Photocatalyst','Air Purify','99.5%','1843 degC','&#8377;840 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['TIO-A2404','B24-TIO-004','Chennai','Bharat Forge','TiO2 99.0% Ceramic Glaze','Tile Opacifier','99.0%','1843 degC','&#8377;760 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['TIO-A2405','B24-TIO-005','Kolkata','Shyam Chemicals','TiO2 99.8% Paper Coating','Brightness Add','99.8%','1843 degC','&#8377;800 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['TIO-A2406','B24-TIO-006','Noida','BHEL R&amp;D','TiO2 99.3% Dye-Sensitized','Solar Cell','99.3%','1840 degC','&#8377;860 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['TIO-A2407','B24-TIO-007','Pune','Godrej Chemicals','TiO2 99.6% Anti-Fog Glass','Self-Clean','99.6%','1843 degC','&#8377;880 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['TIO-A2408','B24-TIO-008','Jaipur','Rajasthan Chemicals','TiO2 98.5% Plastic Filler','Polymer Add','98.5%','1825 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['TIO-A2409','B24-TIO-009','Guwahati','Assam Chemicals','TiO2 99.4% Toothpaste','Abrasive Clean','99.4%','1840 degC','&#8377;720 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['TIO-A2410','B24-TIO-010','Ahmedabad','Gujarat Chemicals','TiO2 99.95% Submarine Periscope','AR Coating','99.95%','1843 degC','&#8377;960 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['TIO-A2411','B24-TIO-011','Lucknow','UP Chemicals','TiO2 99.2% Rubber Whiten','Tire sidewall','99.2%','1835 degC','&#8377;720 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['TIO-A2412','B24-TIO-012','Visakhapatnam','Vizag Chemicals','TiO2 99.8% Warship Stealth','Radar Absorb','99.8%','1843 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['TIO-A2413','B24-TIO-013','Balasore','DRDO TBRL','TiO2 99.6% Missile Seeker','IR Dome Coat','99.6%','1840 degC','&#8377;880 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['TIO-A2414','B24-TIO-014','Bhilai','SAIL Chemicals','TiO2 97% General Chemical','Welding Rod','97.0%','1800 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
    ],
  },
  {
    'slug': 'silicon-dioxide',
    'title': 'Silicon Dioxide',
    'formula': 'SiO2',
    'icon': 'Sparkles',
    'color': '#a855f7',       # purple — glass/silica/fiber optics
    'prefix': 'SIO',
    'subtitle': 'SiO2 optical fiber &#8226; Semiconductor wafer &#8226; Glass &#8226; Foundry sand supply chain',
    'var': 'silicon_dioxide',
    'func': 'Silicon_DioxideLogisticsView',
    'records': [
      ['SIO-A2401','B24-SIO-001','Mumbai','MIDHANI','SiO2 99.99% Optical Fiber','Telecom Grade','99.99%','1710 degC','&#8377;960 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['SIO-A2402','B24-SIO-002','Bengaluru','DRDO DMRL','SiO2 99.9% Semiconductor','Wafer SOI','99.9%','1710 degC','&#8377;940 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['SIO-A2403','B24-SIO-003','Hyderabad','Tata Electronics','SiO2 99.7% LCD Panel','Display Glass','99.7%','1710 degC','&#8377;880 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['SIO-A2404','B24-SIO-004','Chennai','Bharat Forge','SiO2 99.0% Fused Quartz','Crucible','99.0%','1710 degC','&#8377;840 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['SIO-A2405','B24-SIO-005','Kolkata','Shyam Chemicals','SiO2 99.8% Foundry Sand','Mold Core','99.8%','1710 degC','&#8377;760 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['SIO-A2406','B24-SIO-006','Noida','BHEL R&amp;D','SiO2 99.3% Solar Cell','AR Coating','99.3%','1705 degC','&#8377;860 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['SIO-A2407','B24-SIO-007','Pune','Godrej Chemicals','SiO2 99.6% Tire Rubber','Silica Fill','99.6%','1710 degC','&#8377;800 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['SIO-A2408','B24-SIO-008','Jaipur','Rajasthan Chemicals','SiO2 98.5% Concrete Mix','Pozzolan','98.5%','1690 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['SIO-A2409','B24-SIO-009','Guwahati','Assam Chemicals','SiO2 99.4% Toothpaste','Abrasive Gel','99.4%','1700 degC','&#8377;720 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['SIO-A2410','B24-SIO-010','Ahmedabad','Gujarat Chemicals','SiO2 99.95% Submarine Sonar','Acoustic Window','99.95%','1710 degC','&#8377;960 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['SIO-A2411','B24-SIO-011','Lucknow','UP Chemicals','SiO2 99.2% Beer Filter','Diatomaceous','99.2%','1695 degC','&#8377;680 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['SIO-A2412','B24-SIO-012','Visakhapatnam','Vizag Chemicals','SiO2 99.8% Warship Antenna','Radome Silica','99.8%','1710 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['SIO-A2413','B24-SIO-013','Balasore','DRDO TBRL','SiO2 99.6% Missile Radome','Stealth Dome','99.6%','1700 degC','&#8377;900 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['SIO-A2414','B24-SIO-014','Bhilai','SAIL Chemicals','SiO2 97% General Chemical','Glass Batch','97.0%','1680 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
    ],
  },
]

def fmt_record(r):
  parts = [f"'{v}'" for v in r]
  return f"  [{', '.join(parts)}],"

def generate_module(mod):
  slug = mod['slug']
  out = f"src/components/modules/{slug}-logistics-view.tsx"

  with open(TEMPLATE) as f:
    content = f.read()

  content = re.sub(r"import \{ \w+ \} from 'lucide-react'", f"import {{ {mod['icon']} }} from 'lucide-react'", content)
  content = re.sub(r'const \w+_RECORDS', f"const {mod['var']}_RECORDS", content)

  rec_block = '\n'.join(fmt_record(r) for r in mod['records'])
  content = re.sub(
    r"const \w+_RECORDS = \[.*?\];",
    f"const {mod['var']}_RECORDS = [\n{rec_block}\n];",
    content, flags=re.DOTALL,
  )

  content = re.sub(r'export default function \w+', f"export default function {mod['func']}", content)
  content = re.sub(r'return \w+_RECORDS\.filter', f"return {mod['var']}_RECORDS.filter", content)
  content = re.sub(r'<\w+ className="w-5 h-5"', f"<{mod['icon']} className=\"w-5 h-5\"", content)

  content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content)
  content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content)
  content = re.sub(r"backgroundColor: '[^']+'", f"backgroundColor: '{mod['color']}22'", content)

  content = re.sub(r'<h2 className="text-xl font-bold">[^<]+</h2>', f'<h2 className="text-xl font-bold">{mod["title"]} Logistics</h2>', content)
  content = re.sub(r'<p className="text-sm text-gray-400">[^<]+</p>', f'<p className="text-sm text-gray-400">{mod["subtitle"]}</p>', content)

  with open(out, 'w') as f:
    f.write(content)
  print(f"Generated {out}")

if __name__ == '__main__':
  for mod in MODULES:
    generate_module(mod)
  print("R439 generation complete.")
