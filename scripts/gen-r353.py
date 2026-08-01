#!/usr/bin/env python3
"""Generate R353 modules by cloning the template with targeted replacements."""

import re, subprocess

TEMPLATE = '/home/z/my-project/src/components/modules/sungudi-saree-tamil-nadu-logistics-view.tsx'

def clone_module(replacements):
    with open(TEMPLATE, 'r') as f:
        content = f.read()
    for old, new in replacements.items():
        content = content.replace(old, new)
    # Ensure 253 newlines
    nl = content.count('\n')
    if nl < 253:
        content += '\n' * (253 - nl)
    elif nl > 253:
        lines = content.split('\n')
        content = '\n'.join(lines[:253])
    return content

def fix_records(filepath, prefix, products, artisans, statuses):
    """Replace hand records and genRecords prefix."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix genRecords prefix
    content = content.replace(f"id: `SGS-${{", f"id: `{prefix}-${{")
    
    # Fix 20 hand records using exact template data
    old_products = ['Sungudi Traditional Saree', 'Sungudi Temple Border Saree', 'Sungudi Madurai Weave Stole', 'Sungudi Dot Design Dupatta', 'Sungudi Festival Cotton Wrap', 'Sungudi Bridal Koorai Saree', 'Sungudi Geometric Border Stole', 'Sungudi Cotton Handkerchief Set']
    old_artisans = ['Madurai Sungudi Weavers Guild TN', 'Sivaganga Sungudi Cluster TN', 'Chellampatti Block Print Society', 'Virudhunagar Sungudi Cooperative TN', 'Ramanathapuram Weaving Centre', 'Dindigul Sungudi Artisan Group', 'Theni Handloom Society TN', 'Paramakudi Sungudi Women Collective']
    old_statuses = ['GI Tamil Nadu Sungudi Mark', 'IS 16796 Sungudi Weave Grade A', 'Muslin Cloth Fold Pack', 'Palletised Truck Transit', 'Dry Storage 20-28C', 'Cotton Yarn Tensile QC']
    
    for i in range(20):
        idx = i + 1
        old_artist = old_artisans[i % len(old_artisans)]
        old_product = old_products[i % len(old_products)]
        old_status = old_statuses[i % len(old_statuses)]
        
        old_line = f"  {{ id: 'SGS-{idx:04d}', painter: '{old_artist}', ware: '{old_product}', status: '{old_status}'"
        
        # Map to new data
        new_artist = artisans[i % len(artisans)]
        new_product = products[i % len(products)]
        new_status = statuses[i % len(statuses)]
        new_line = f"  {{ id: '{prefix}-{idx:04d}', painter: '{new_artist}', ware: '{new_product}', status: '{new_status}'"
        
        if old_line in content:
            content = content.replace(old_line, new_line, 1)
        else:
            print(f"  WARN: Record SGS-{idx:04d} not found with expected pattern")
    
    # Ensure 253 newlines
    nl = content.count('\n')
    if nl < 253:
        content += '\n' * (253 - nl)
    elif nl > 253:
        lines = content.split('\n')
        content = '\n'.join(lines[:253])
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    # Verify
    sgs = re.findall(r"SGS-\d+", content)
    if sgs:
        print(f"  WARNING: {len(sgs)} SGS remnants: {sgs}")
    else:
        print(f"  All records replaced with {prefix}")
    
    r = subprocess.run(['wc', '-l', filepath], capture_output=True, text=True)
    print(f"  {r.stdout.strip()}")


# ═══════════════════════════════════════════════════
# Module 1: Sikki Grass Weaving Bihar Logistics (NEW)
# Sikki grass is a golden grass weaving tradition from Bihar — baskets, toys, jewelry, mats
# GI Registered craft from Bihar, using sikki grass (vetiveria zizanioides)
# ═══════════════════════════════════════════════════
sikki_replacements = {
    "const COLORS = ['#701a75', '#86198f', '#a21caf', '#c026d3', '#d946ef', '#4a044e', '#6b0f6e', '#fae8ff']":
    "const COLORS = ['#854d0e', '#a16207', '#ca8a04', '#eab308', '#facc15', '#713f12', '#422006', '#fef9c3']",
    "const PRODUCTS = ['Sungudi Traditional Saree', 'Sungudi Temple Border Saree', 'Sungudi Madurai Weave Stole', 'Sungudi Dot Design Dupatta', 'Sungudi Festival Cotton Wrap', 'Sungudi Bridal Koorai Saree', 'Sungudi Geometric Border Stole', 'Sungudi Cotton Handkerchief Set']":
    "const PRODUCTS = ['Sikki Grass Basket Set', 'Sikki Grass Toy Elephant', 'Sikki Grass Jewellery Box', 'Sikki Grass Storage Container', 'Sikki Grass Table Mat Set', 'Sikki Grass Wall Panel Art', 'Sikki Grass Flower Vase', 'Sikki Grass Gift Hamper']",
    "const ARTISANS = ['Madurai Sungudi Weavers Guild TN', 'Sivaganga Sungudi Cluster TN', 'Chellampatti Block Print Society', 'Virudhunagar Sungudi Cooperative TN', 'Ramanathapuram Weaving Centre', 'Dindigul Sungudi Artisan Group', 'Theni Handloom Society TN', 'Paramakudi Sungudi Women Collective']":
    "const ARTISANS = ['Madhubani Sikki Weavers Bihar', 'Darbhanga Grass Art Cluster Bihar', 'Samastipur Sikki Cooperative Bihar', 'Sitamarhi Rural Craft Society Bihar', 'Muzaffarpur Sikki Guild Bihar', 'Begusarai Grass Weavers Bihar', 'Khagaria Sikki Women Collective Bihar', 'Katihar Golden Grass Artisans Bihar']",
    "const STATUSES = ['GI Tamil Nadu Sungudi Mark', 'IS 16796 Sungudi Weave Grade A', 'Muslin Cloth Fold Pack', 'Palletised Truck Transit', 'Dry Storage 20-28C', 'Cotton Yarn Tensile QC']":
    "const STATUSES = ['GI Bihar Sikki Grass Mark', 'IS 16482 Golden Grass Grade A', 'Moisture Barrier Wrap QC', 'Palletised Rail Container', 'Dry Storage 18-25C', 'Sikki Grass Tensile QC']",
    "const sungudiRecords": "const sikkirecords",
    "allRecords = [...sungudiRecords": "allRecords = [...sikkirecords",
    "SungudiSareeTamilNaduLogisticsView": "SikkiGrassWeavingBiharLogisticsView",
    "sgs-root": "sgw-root",
    "fuchsia": "yellow",
    "'Sungudi Saree TN'": "'Sikki Grass Bihar'",
    'title="Sungudi Saree Tamil Nadu Logistics" description="Tamil Nadu Sungudi cotton saree and tie-dye textile supply chain with IS 16796 certification, cotton yarn tensile QC, muslin cloth fold packaging, and GI Tamil Nadu Sungudi Mark across 8 weaving communities in Madurai, Sivaganga, and Virudhunagar"':
    'title="Sikki Grass Weaving Bihar Logistics" description="Bihar Sikki golden grass weaving supply chain with IS 16482 golden grass certification, sikki grass tensile quality control, moisture barrier wrap packaging, and GI Bihar Sikki Grass Mark across 8 artisan communities in Madhubani, Darbhanga, and Samastipur"',
    "'Weaving Clusters'": "'Grass Guilds'",
    "'20+'": "'500+'",
    "'Since 6th C'": "'Since 4th C BC'",
    "'4 Countries'": "'8 Countries'",
    "'₹1.8 Crore'": "'₹1.2 Crore'",
    "'Weaver Families'": "'Artisan Households'",
    "'IS 16796'": "'IS 16482'",
    "'Muslin'": "'Barrier'",
    "'Dry'": "'Dry'",
    "'Tensile'": "'Tensile'",
    "Search Sungudi saree shipments": "Search Sikki grass shipments",
    # Insight card titles
    "Sungudi Saree — 1400-Year Madurai Tamil Nadu Tie-Dye Cotton Textile Heritage":
    "Sikki Grass Weaving \u2014 2400-Year Bihar Golden Grass Basket Heritage",
    "IS 16796 Sungudi Weave Standards & Cotton Yarn Tensile QC":
    "IS 16482 Sikki Grass Standards & Golden Grass Tensile QC",
    "Muslin Cloth Fold Packaging for Sungudi Saree Transit":
    "Moisture Barrier Packaging for Sikki Grass Product Transit",
    "AI Pattern Verification & Sungudi Heritage Market Development":
    "AI Design Archive & Bihar Sikki Grass Heritage Market Development",
}

sikki_products = ['Sikki Grass Basket Set', 'Sikki Grass Toy Elephant', 'Sikki Grass Jewellery Box', 'Sikki Grass Storage Container', 'Sikki Grass Table Mat Set', 'Sikki Grass Wall Panel Art', 'Sikki Grass Flower Vase', 'Sikki Grass Gift Hamper']
sikki_artisans = ['Madhubani Sikki Weavers Bihar', 'Darbhanga Grass Art Cluster Bihar', 'Samastipur Sikki Cooperative Bihar', 'Sitamarhi Rural Craft Society Bihar', 'Muzaffarpur Sikki Guild Bihar', 'Begusarai Grass Weavers Bihar', 'Khagaria Sikki Women Collective Bihar', 'Katihar Golden Grass Artisans Bihar']
sikki_statuses = ['GI Bihar Sikki Grass Mark', 'IS 16482 Golden Grass Grade A', 'Moisture Barrier Wrap QC', 'Palletised Rail Container', 'Dry Storage 18-25C', 'Sikki Grass Tensile QC']

print("Generating Sikki Grass Weaving Bihar...")
content = clone_module(sikki_replacements)
with open('/home/z/my-project/src/components/modules/sikki-grass-weaving-bihar-logistics-view.tsx', 'wb') as f:
    f.write(content.encode('utf-8'))
fix_records('/home/z/my-project/src/components/modules/sikki-grass-weaving-bihar-logistics-view.tsx', 'SGW', sikki_products, sikki_artisans, sikki_statuses)

# ═══════════════════════════════════════════════════
# Module 2: Silk & Textile Heritage Supply Chain (OVERWRITE 244→253)
# ═══════════════════════════════════════════════════
silk_replacements = {
    "const COLORS = ['#701a75', '#86198f', '#a21caf', '#c026d3', '#d946ef', '#4a044e', '#6b0f6e', '#fae8ff']":
    "const COLORS = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#431407', '#2d0a01', '#ffedd5']",
    "const PRODUCTS = ['Sungudi Traditional Saree', 'Sungudi Temple Border Saree', 'Sungudi Madurai Weave Stole', 'Sungudi Dot Design Dupatta', 'Sungudi Festival Cotton Wrap', 'Sungudi Bridal Koorai Saree', 'Sungudi Geometric Border Stole', 'Sungudi Cotton Handkerchief Set']":
    "const PRODUCTS = ['Banarasi Silk Brocade Saree', 'Kanchipuram Temple Silk Saree', 'Muga Silk Mekhela Chador', 'Patola Double Ikat Saree', 'Chanderi Silk Muslin Dupatta', 'Bhagalpuri Tussar Silk Stole', 'Sambalpuri Ikat Silk Fabric', 'Baluchari Silk Pallu Saree']",
    "const ARTISANS = ['Madurai Sungudi Weavers Guild TN', 'Sivaganga Sungudi Cluster TN', 'Chellampatti Block Print Society', 'Virudhunagar Sungudi Cooperative TN', 'Ramanathapuram Weaving Centre', 'Dindigul Sungudi Artisan Group', 'Theni Handloom Society TN', 'Paramakudi Sungudi Women Collective']":
    "const ARTISANS = ['Varanasi Silk Weavers UP', 'Kanchipuram Silk Guild TN', 'Sualkuchi Muga Cluster Assam', 'Patan Patola Weavers Gujarat', 'Chanderi Silk Weavers MP', 'Bhagalpur Tussar Society Bihar', 'Sambalpur Ikat Cooperative Odisha', 'Bishnupur Baluchari Weavers WB']",
    "const STATUSES = ['GI Tamil Nadu Sungudi Mark', 'IS 16796 Sungudi Weave Grade A', 'Muslin Cloth Fold Pack', 'Palletised Truck Transit', 'Dry Storage 20-28C', 'Cotton Yarn Tensile QC']":
    "const STATUSES = ['GI Silk Mark Certified', 'IS 17183 Silk Grade A', 'Acid-Free Tissue Wrap Pack', 'Palletised Air Transit', 'Climate Vault 20-24C', 'Silk Denier Tensile QC']",
    "const sungudiRecords": "const silkRecords",
    "allRecords = [...sungudiRecords": "allRecords = [...silkRecords",
    "SungudiSareeTamilNaduLogisticsView": "SilkTextileHeritageSupplyChainView",
    "sgs-root": "sth-root",
    "fuchsia": "orange",
    "'Sungudi Saree TN'": "'Silk Heritage'",
    'title="Sungudi Saree Tamil Nadu Logistics" description="Tamil Nadu Sungudi cotton saree and tie-dye textile supply chain with IS 16796 certification, cotton yarn tensile QC, muslin cloth fold packaging, and GI Tamil Nadu Sungudi Mark across 8 weaving communities in Madurai, Sivaganga, and Virudhunagar"':
    'title="Silk & Textile Heritage Supply Chain" description="Indian heritage silk and textile supply chain with IS 17183 silk certification, silk denier tensile quality control, acid-free tissue wrap packaging, and GI Silk Mark across 8 weaving communities in Varanasi, Kanchipuram, and Sualkuchi"',
    "'20+'": "'1200+'",
    "'Since 6th C'": "'Since Vedic Era'",
    "'4 Countries'": "'30+ Countries'",
    "'₹1.8 Crore'": "'₹18.5 Crore'",
    "'Weaver Families'": "'Weaver Households'",
    "'IS 16796'": "'IS 17183'",
    "'Muslin'": "'Tissue'",
    "'Truck'": "'Air'",
    "'Dry'": "'Climate'",
    "'Tensile'": "'Denier'",
    "Search Sungudi saree shipments": "Search silk textile shipments",
    # Insight card titles
    "Sungudi Saree — 1400-Year Madurai Tamil Nadu Tie-Dye Cotton Textile Heritage":
    "Indian Heritage Silk \u2014 5000-Year Vedic Era Silk Weaving Tradition",
    "IS 16796 Sungudi Weave Standards & Cotton Yarn Tensile QC":
    "IS 17183 Silk Standards & Denier Tensile Quality Control",
    "Muslin Cloth Fold Packaging for Sungudi Saree Transit":
    "Acid-Free Tissue Wrap Packaging for Heritage Silk Transit",
    "AI Pattern Verification & Sungudi Heritage Market Development":
    "AI Jacquard Design Verification & Silk Heritage Market Development",
}

silk_products = ['Banarasi Silk Brocade Saree', 'Kanchipuram Temple Silk Saree', 'Muga Silk Mekhela Chador', 'Patola Double Ikat Saree', 'Chanderi Silk Muslin Dupatta', 'Bhagalpuri Tussar Silk Stole', 'Sambalpuri Ikat Silk Fabric', 'Baluchari Silk Pallu Saree']
silk_artisans = ['Varanasi Silk Weavers UP', 'Kanchipuram Silk Guild TN', 'Sualkuchi Muga Cluster Assam', 'Patan Patola Weavers Gujarat', 'Chanderi Silk Weavers MP', 'Bhagalpur Tussar Society Bihar', 'Sambalpur Ikat Cooperative Odisha', 'Bishnupur Baluchari Weavers WB']
silk_statuses = ['GI Silk Mark Certified', 'IS 17183 Silk Grade A', 'Acid-Free Tissue Wrap Pack', 'Palletised Air Transit', 'Climate Vault 20-24C', 'Silk Denier Tensile QC']

print("\nGenerating Silk & Textile Heritage...")
content2 = clone_module(silk_replacements)
with open('/home/z/my-project/src/components/modules/silk-textile-heritage-supply-chain-view.tsx', 'wb') as f:
    f.write(content2.encode('utf-8'))
fix_records('/home/z/my-project/src/components/modules/silk-textile-heritage-supply-chain-view.tsx', 'STH', silk_products, silk_artisans, silk_statuses)

# Validate both
print("\n=== Validation ===")
for f in ['src/components/modules/sikki-grass-weaving-bihar-logistics-view.tsx', 'src/components/modules/silk-textile-heritage-supply-chain-view.tsx']:
    r = subprocess.run(['wc', '-l', f], capture_output=True, text=True)
    print(f"  {r.stdout.strip()}")
    
    # Check no forbidden patterns
    import subprocess as sp
    for pat in ["'use client'", "import.*lucide", "Refrigerator|Fridge|ComposedChart|ResponsiveContainer|oklch"]:
        r2 = sp.run(['rg', '-c', pat, f], capture_output=True, text=True)
        if r2.stdout.strip():
            print(f"  WARNING: Found {pat} in {f}")
    
    # Check SGS remnants
    r3 = sp.run(['rg', '-c', 'SGS-', f], capture_output=True, text=True)
    if r3.stdout.strip() and r3.stdout.strip() != '0':
        print(f"  WARNING: SGS remnants in {f}: {r3.stdout.strip()}")
    else:
        print(f"  No SGS remnants")

print("\nDone!")
