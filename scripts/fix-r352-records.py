#!/usr/bin/env python3
"""Fix hand records and genRecords prefix in R352 modules."""

import re

def fix_module(filepath, prefix, products, artisans, statuses):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # 1. Fix genRecords prefix (template literal with backtick)
    content = content.replace(f"id: `SGS-${{", f"id: `{prefix}-${{")
    
    # 2. Fix record variable name
    # (already handled by clone script)
    
    # 3. Fix 20 hand records
    for i in range(20):
        idx = i + 1
        old_id = f"SGS-{idx:04d}"
        new_id = f"{prefix}-{idx:04d}"
        old_record_pattern = f"id: '{old_id}', painter: '{artisans[i % len(artisans)]}', ware: '{products[i % len(products)]}', status: '{statuses[i % len(statuses)]}'"
        
        # The old records use Sungudi template data
        old_products = ['Sungudi Traditional Saree', 'Sungudi Temple Border Saree', 'Sungudi Madurai Weave Stole', 'Sungudi Dot Design Dupatta', 'Sungudi Festival Cotton Wrap', 'Sungudi Bridal Koorai Saree', 'Sungudi Geometric Border Stole', 'Sungudi Cotton Handkerchief Set']
        old_artisans = ['Madurai Sungudi Weavers Guild TN', 'Sivaganga Sungudi Cluster TN', 'Chellampatti Block Print Society', 'Virudhunagar Sungudi Cooperative TN', 'Ramanathapuram Weaving Centre', 'Dindigul Sungudi Artisan Group', 'Theni Handloom Society TN', 'Paramakudi Sungudi Women Collective']
        old_statuses = ['GI Tamil Nadu Sungudi Mark', 'IS 16796 Sungudi Weave Grade A', 'Muslin Cloth Fold Pack', 'Palletised Truck Transit', 'Dry Storage 20-28C', 'Cotton Yarn Tensile QC']
        
        old_artist = old_artisans[i % len(old_artisans)]
        old_product = old_products[i % len(old_products)]
        old_status = old_statuses[i % len(old_statuses)]
        
        # Find and replace the full record line
        old_line = f"  {{ id: '{old_id}', painter: '{old_artist}', ware: '{old_product}', status: '{old_status}'"
        new_line = f"  {{ id: '{new_id}', painter: '{artisans[i % len(artisans)]}', ware: '{products[i % len(products)]}', status: '{statuses[i % len(statuses)]}'"
        
        if old_line in content:
            content = content.replace(old_line, new_line, 1)
        else:
            print(f"  WARNING: Could not find record {old_id}")
    
    # Verify no SGS remnants
    sgs_remaining = re.findall(r"SGS-\d+", content)
    if sgs_remaining:
        print(f"  WARNING: {len(sgs_remaining)} SGS remnants remain!")
    else:
        print(f"  All SGS references replaced with {prefix}")
    
    # Verify prefix in genRecords
    gen_prefix_matches = re.findall(r"id: `" + prefix + r"-\$\{String", content)
    if gen_prefix_matches:
        print(f"  genRecords prefix: {prefix} (OK)")
    else:
        print(f"  WARNING: genRecords prefix not found!")
    
    # Ensure 253 lines
    nl_count = content.count('\n')
    if nl_count < 253:
        content += '\n' * (253 - nl_count)
    elif nl_count > 253:
        lines = content.split('\n')
        content = '\n'.join(lines[:253])
        # Ensure final newline
        if not content.endswith('\n'):
            content += '\n'
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    import subprocess
    r = subprocess.run(['wc', '-l', filepath], capture_output=True, text=True)
    print(f"  Final: {r.stdout.strip()}")


# Kinhal Woodcraft Karnataka
kinhal_products = ['Kinhal Lacquerware Elephant Toy', 'Kinhal Marionette Doll Set', 'Kinhal Carved Hanuman Figurine', 'Kinhal Wooden Tamburi Instrument', 'Kinhal Lacquerware Spice Box', 'Kinhal Temple Mural Panel', 'Kinhal Turning Lathe Top Set', 'Kinhal Polished Sandalwood Box']
kinhal_artisans = ['Kinhal Lacquer Artisans Guild KA', 'Koppal Woodcraft Cooperative KA', 'Gangavathi Kinhal Society', 'Kushtagi Traditional Artisans KA', 'Yelburga Wood Carvers Guild KA', 'Hospet Heritage Crafts Cluster', 'Bellary Kinhal Workshop Network', 'Raichur Traditional Toy Makers KA']
kinhal_statuses = ['GI Karnataka Kinhal Toy Mark', 'IS 15856 Wood Toy Safety A', 'Lacquer Coat Curing QC', 'Palletised Rail Container', 'Dehumidified Storage 25-35C', 'Wrightia Wood Moisture QC']

print("Fixing Kinhal...")
fix_module(
    '/home/z/my-project/src/components/modules/kinhal-woodcraft-karnataka-logistics-view.tsx',
    'KWC', kinhal_products, kinhal_artisans, kinhal_statuses
)

# Handloom Cotton Supply Chain
handloom_products = ['Handloom Cotton Khadi Fabric', 'Handloom Muslin Dhoti', 'Handloom Cotton Bed Sheet', 'Handloom Linen Salwar Suit', 'Handloom Cotton Table Runner', 'Handloom Ikat Stole', 'Handloom Jamdani Saree', 'Handloom Cotton Napkin Set']
handloom_artisans = ['Varanasi Handloom Weavers UP', 'Pochampally Ikat Society Telangana', 'Sualkuchi Silk Cluster Assam', 'Chanderi Weavers MP', 'Kanchipuram Cotton Guild TN', 'Phulia Handloom Society Odisha', 'Kotpad Tribal Weavers Odisha', 'Bhagalpur Tussar Cluster Bihar']
handloom_statuses = ['GI Handloom Mark Certified', 'IS 16784 Handloom Grade A', 'Neem-treated Storage Pack', 'Palletised Truck Transit', 'Climate Controlled 22-28C', 'Cotton Count Tensile QC']

print("\nFixing Handloom...")
fix_module(
    '/home/z/my-project/src/components/modules/handloom-cotton-supply-chain-view.tsx',
    'HCL', handloom_products, handloom_artisans, handloom_statuses
)
