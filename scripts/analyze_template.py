#!/usr/bin/env python3
"""Generate R352 modules: Kinhal Woodcraft Karnataka (new, kwc-*) + Handloom Cotton Supply Chain (overwrite, hcl-*)"""

import os

def make_module(
    css_prefix, tailwind_color, primary_hex, light_hex,
    products, artisans, statuses, 
    record_prefix, records_var_name, function_name,
    breadcrumb_label, title, description,
    kpi_data, health_data, value_data,
    insight_cards
):
    """Build the 253-line module content."""
    
    # Line mapping (1-indexed, follows template exactly):
    # 1-7: imports
    # 8: blank
    # 9: COLORS
    # 10: PRODUCTS
    # 11: ARTISANS
    # 12: STATUSES
    # 13: blank
    # 14: ri
    # 15: blank
    # 16-18: ProductBadge
    # 19: blank
    # 20-22: StatusBadge
    # 23: blank
    # 24-26: CostBar
    # 27: blank
    # 28-40: HealthRing (13 lines)
    # 41: blank
    # 42-44: KpiTile
    # 45: blank
    # 46-48: ValueTile
    # 49: blank
    # 50-57: genRecords
    # 58: blank
    # 59-80: records (22 lines: opening + 20 records + closing)
    # 81: blank
    # 82: export default function
    # 83-84: states
    # 85: blank
    # 86: blank
    # 87: allRecords
    # 88: blank
    # 89-93: useMemo
    # 94: blank
    # 95-98: filterGroups
    # 99: blank
    # 100: trendData
    # 101: artisanChart
    # 102: statusPie
    # 103: maxCost
    # 104: blank
    # 105: return (
    # 106: div root
    # 107: Breadcrumb
    # 108: PageHeader
    # 109: Tabs
    # 110-115: TabsList
    # 116: Dashboard tab
    # 117-122: KPIs (4 items)
    # 123-130: HealthRings (6 items)
    # 131-136: ValueTiles (4 items)
    # 137: /Dashboard
    # 138: Shipments tab
    # 139-151: SearchFilterToolbar (11 props)
    # 152-181: table
    # 182: /Shipments
    # 183: Analytics tab
    # 184-226: charts
    # 226: /Analytics
    # 227: Insights tab
    # 228-244: 4 insight cards
    # 245: /Insights
    # 246: /Tabs
    # 247: (no, it's </Tabs>)
    # 248: </div>
    # 249: )
    # 250: }
    # 251: blank
    # 252: blank

    L = []
    
    def a(s=""):
        L.append(s)

    # 1-7: imports
    a("import React, { useState, useMemo } from 'react'")
    a("import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'")
    a("import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'")
    a("import { PageHeader } from '@/components/shared/page-header'")
    a("import { SearchFilterToolbar } from '@/components/shared/search-filter-toolbar'")
    a("import { ModuleBreadcrumb } from '@/components/shared/module-breadcrumb'")
    a("import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'")
    # 8: blank
    a()
    # 9-12: constants
    a(f"const COLORS = {primary_hex}")
    a(f"const PRODUCTS = {products}")
    a(f"const ARTISANS = {artisans}")
    a(f"const STATUSES = {statuses}")
    # 13: blank
    a()
    # 14: ri
    a("const ri = (min: number, max: number, value: number) => Math.max(min, Math.min(max, value))")
    # 15: blank
    a()
    # 16-18: ProductBadge
    a("const ProductBadge = ({ name }: { name: string }) => (")
    a(f"  <span className=\"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium\" style={{ backgroundColor: '{light_hex}', color: '{primary_hex}'.split(\"'\")[0] }}>{{name}}</span>")
    # FIX: use COLORS[7] and COLORS[0] like template
    # Actually let me just copy the template exactly
    pass

# OK this approach is getting complex with the escaping. Let me just use raw string concatenation.
# Actually, the simplest approach: take the template, do string replacements.

def build_module_from_template(template_lines, replacements):
    """Take the template as a list of lines and return new content."""
    result = []
    for line in template_lines:
        new_line = line
        for old, new in replacements.items():
            new_line = new_line.replace(old, new)
        result.append(new_line)
    return result

# Read template
with open('/home/z/my-project/src/components/modules/sungudi-saree-tamil-nadu-logistics-view.tsx') as f:
    template = f.read()

template_lines = template.split('\n')
# template has 253 lines (last line is empty)

print(f"Template lines: {len(template_lines)}")

# Check specific line content
for i in [0, 7, 8, 9, 10, 11, 12, 13, 14, 15, 58, 59, 79, 80, 81, 250, 251, 252]:
    print(f"  Line {i+1}: {template_lines[i][:100]}")
