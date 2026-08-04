#!/usr/bin/env python3
"""gen_r436.py — R436: Lead Oxide (PbO) + Nickel Oxide (NiO) logistics modules.
Clone-and-customize from zinc-oxide template."""
import re, shutil

TEMPLATE = 'src/components/modules/zinc-oxide-logistics-view.tsx'

MODULES = [
  {
    'slug': 'lead-oxide',
    'title': 'Lead Oxide',
    'formula': 'PbO',
    'icon': 'Radiation',
    'color': '#b91c1c',       # deep red — toxic heavy metal
    'prefix': 'PBO',
    'subtitle': 'PbO battery plate &#8226; Ceramic glaze &#8226; Radiation shielding &#8226; Crystal glass supply chain',
    'var': 'lead_oxide',
    'func': 'Lead_OxideLogisticsView',
    'records': [
      # (id, batchNo, city, mfr, grade, app, purity, specProp, investCr, status, priority, origin, dest, shipDate, transitDays, zone, remarks)
      ['PBO-A2401','B24-PBO-001','Mumbai','MIDHANI','PbO 99.9% Battery Plate','Lead-Acid Battery','99.9%','888 degC','&#8377;900 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['PBO-A2402','B24-PBO-002','Bengaluru','Exide Industries','PbO 99.7% Grid Alloy','UPS Battery','99.7%','880 degC','&#8377;760 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['PBO-A2403','B24-PBO-003','Hyderabad','Amara Raja','PbO 99.5% Litharge','Ceramic Glaze','99.5%','888 degC','&#8377;720 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['PBO-A2404','B24-PBO-004','Chennai','HBL Power','PbO 99.0% Radiation Shield','X-Ray Barrier','99.0%','870 degC','&#8377;840 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['PBO-A2405','B24-PBO-005','Kolkata','Tata Steel','PbO 99.8% Crystal Glass','Lead Crystal','99.8%','888 degC','&#8377;880 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['PBO-A2406','B24-PBO-006','Noida','BHEL R&amp;D','PbO 99.3% Piezoelectric','PZT Precursor','99.3%','882 degC','&#8377;920 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['PBO-A2407','B24-PBO-007','Pune','DRDO DMRL','PbO 99.6% Missile Seeker','IR Dome','99.6%','888 degC','&#8377;960 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['PBO-A2408','B24-PBO-008','Jaipur','Rajasthan Chemicals','PbO 98.5% PVC Stabilizer','Thermal Stabilize','98.5%','860 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['PBO-A2409','B24-PBO-009','Guwahati','Assam Chemicals','PbO 99.4% Ferroelectric','PZT Ceramic','99.4%','885 degC','&#8377;860 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['PBO-A2410','B24-PBO-010','Ahmedabad','Gujarat Chemicals','PbO 99.95% Submarine Anode','Cathodic Protect','99.95%','888 degC','&#8377;940 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['PBO-A2411','B24-PBO-011','Lucknow','UP Chemicals','PbO 99.2% Rubber Anti-Aging','Anti-Ozonant','99.2%','875 degC','&#8377;720 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['PBO-A2412','B24-PBO-012','Visakhapatnam','Vizag Chemicals','PbO 99.8% Nuclear Shield','Reactor Contain','99.8%','888 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['PBO-A2413','B24-PBO-013','Balasore','DRDO TBRL','PbO 99.6% Propellant','AP Binder','99.6%','882 degC','&#8377;880 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['PBO-A2414','B24-PBO-014','Bhilai','SAIL Chemicals','PbO 97% General Chemical','Solder Alloy','97.0%','850 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
    ],
  },
  {
    'slug': 'nickel-oxide',
    'title': 'Nickel Oxide',
    'formula': 'NiO',
    'icon': 'Magnet',
    'color': '#7c3aed',       # violet — magnetic material
    'prefix': 'NIO',
    'subtitle': 'NiO thermistor &#8226; Ferromagnetic &#8226; Battery cathode &#8226; Catalyst supply chain',
    'var': 'nickel_oxide',
    'func': 'Nickel_OxideLogisticsView',
    'records': [
      ['NIO-A2401','B24-NIO-001','Mumbai','MIDHANI','NiO 99.9% Thermistor','NTC Temp','99.9%','1955 degC','&#8377;900 Cr','in-transit','critical','Mumbai','Pune','2024-07-15','3','West',''],
      ['NIO-A2402','B24-NIO-002','Bengaluru','DRDO DMRL','NiO 99.7% Ferrite Core','Soft Magnetic','99.7%','1955 degC','&#8377;760 Cr','delivered','high','Bengaluru','Chennai','2024-07-10','2','South',''],
      ['NIO-A2403','B24-NIO-003','Hyderabad','Tata Advanced Materials','NiO 99.5% Battery Cathode','NMC Precursor','99.5%','1955 degC','&#8377;880 Cr','in-transit','high','Hyderabad','Hyderabad','2024-07-18','1','South',''],
      ['NIO-A2404','B24-NIO-004','Chennai','Bharat Forge','NiO 99.0% Fuel Cell','SOFC Anode','99.0%','1955 degC','&#8377;840 Cr','delivered','medium','Chennai','Chennai','2024-07-08','0','South',''],
      ['NIO-A2405','B24-NIO-005','Kolkata','Shyam Chemicals','NiO 99.8% Catalyst','Methanation','99.8%','1955 degC','&#8377;720 Cr','in-transit','high','Kolkata','Visakhapatnam','2024-07-20','5','East',''],
      ['NIO-A2406','B24-NIO-006','Noida','BHEL R&amp;D','NiO 99.3% Ceramic Glaze','Green Pigment','99.3%','1950 degC','&#8377;800 Cr','delivered','high','Noida','Noida','2024-07-12','0','North',''],
      ['NIO-A2407','B24-NIO-007','Pune','Godrej Chemicals','NiO 99.6% EMI Shielding','Absorber Coat','99.6%','1955 degC','&#8377;920 Cr','in-transit','critical','Pune','Mumbai','2024-07-16','2','West',''],
      ['NIO-A2408','B24-NIO-008','Jaipur','Rajasthan Chemicals','NiO 98.5% Glass Tint','UV Absorb','98.5%','1940 degC','&#8377;640 Cr','delivered','low','Jaipur','Jaipur','2024-07-09','1','North',''],
      ['NIO-A2409','B24-NIO-009','Guwahati','Assam Chemicals','NiO 99.4% Gas Sensor','CO Detect','99.4%','1950 degC','&#8377;860 Cr','in-transit','high','Guwahati','Kolkata','2024-07-22','4','East',''],
      ['NIO-A2410','B24-NIO-010','Ahmedabad','Gujarat Chemicals','NiO 99.95% Submarine Sonar','Acoustic Match','99.95%','1955 degC','&#8377;940 Cr','pending','critical','Ahmedabad','Bengaluru','2024-07-25','3','West',''],
      ['NIO-A2411','B24-NIO-011','Lucknow','UP Chemicals','NiO 99.2% Electrode','Rechargeable','99.2%','1948 degC','&#8377;720 Cr','delivered','medium','Lucknow','Lucknow','2024-07-11','0','North',''],
      ['NIO-A2412','B24-NIO-012','Visakhapatnam','Vizag Chemicals','NiO 99.8% Missile Seeker','IR Seeker Dome','99.8%','1955 degC','&#8377;940 Cr','delayed','critical','Visakhapatnam','Visakhapatnam','2024-07-06','28','South',''],
      ['NIO-A2413','B24-NIO-013','Balasore','DRDO TBRL','NiO 99.6% Propellant','AP Catalyst','99.6%','1950 degC','&#8377;880 Cr','in-transit','critical','Balasore','Chandipur','2024-07-19','2','East',''],
      ['NIO-A2414','B24-NIO-014','Bhilai','SAIL Chemicals','NiO 97% General Chemical','Alloy Additive','97.0%','1930 degC','&#8377;640 Cr','delivered','low','Bhilai','Bhilai','2024-07-05','0','East',''],
    ],
  },
]

def fmt_record(r):
  """Format a 17-element tuple as a JS array literal."""
  # Handle HTML entities in app (r[5]) and remarks (r[16])
  parts = []
  for i, v in enumerate(r):
    if i in (5, 16) and v:
      # Already has entities
      parts.append(f"'{v}'")
    else:
      parts.append(f"'{v}'")
  return f"  [{', '.join(parts)}],"

def generate_module(mod):
  slug = mod['slug']
  out = f"src/components/modules/{slug}-logistics-view.tsx"

  # Read template
  with open(TEMPLATE) as f:
    content = f.read()

  # 1. Replace import icon
  content = re.sub(r"import \{ \w+ \} from 'lucide-react'", f"import {{ {mod['icon']} }} from 'lucide-react'", content)

  # 2. Replace RECORDS const name
  content = re.sub(r'const \w+_RECORDS', f"const {mod['var']}_RECORDS", content)

  # 3. Replace records data
  rec_block = '\n'.join(fmt_record(r) for r in mod['records'])
  content = re.sub(
    r"const \w+_RECORDS = \[.*?\];",
    f"const {mod['var']}_RECORDS = [\n{rec_block}\n];",
    content,
    flags=re.DOTALL,
  )

  # 4. Replace function name
  content = re.sub(r'export default function \w+', f"export default function {mod['func']}", content)

  # 5. Replace useMemo filter reference
  content = re.sub(r'return \w+_RECORDS\.filter', f"return {mod['var']}_RECORDS.filter", content)

  # 6. Replace icon usage in JSX
  content = re.sub(r'<\w+ className="w-5 h-5"', f"<{mod['icon']} className=\"w-5 h-5\"", content)

  # 7. Replace color hex
  content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content)
  content = re.sub(r"color: '[^']+'", f"color: '{mod['color']}'", content)
  # Also for backgroundColor and inline bar colors
  content = re.sub(r"backgroundColor: '[^']+'", f"backgroundColor: '{mod['color']}22'", content)

  # 8. Replace title
  content = re.sub(r'<h2 className="text-xl font-bold">[^<]+</h2>', f'<h2 className="text-xl font-bold">{mod["title"]} Logistics</h2>', content)

  # 9. Replace subtitle
  content = re.sub(r'<p className="text-sm text-gray-400">[^<]+</p>', f'<p className="text-sm text-gray-400">{mod["subtitle"]}</p>', content)

  # Write output
  with open(out, 'w') as f:
    f.write(content)
  print(f"Generated {out}")

if __name__ == '__main__':
  for mod in MODULES:
    generate_module(mod)
  print("R436 generation complete.")
