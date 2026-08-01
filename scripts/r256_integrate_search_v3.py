#!/usr/bin/env python3
"""R256 v3: Safely integrate SearchFilterToolbar into modules.
Inserts imports right after 'use client' to avoid multi-line import conflicts.
"""

import os, re, glob

MODULES_DIR = '/home/z/my-project/src/components/modules'

def find_last_single_line_import(content):
    """Find the index of the last complete single-line import statement."""
    lines = content.split('\n')
    in_multiline_import = False
    last_complete_import = 0
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('import ') and not stripped.startswith('//'):
            if not in_multiline_import:
                in_multiline_import = True
        elif in_multiline_import:
            if stripped.startswith('}') or stripped.endswith(';') or stripped.endswith('"'):
                # Multi-line import ends
                last_complete_import = i
                in_multiline_import = False
            # else still in multi-line import
        # Single-line import
        if stripped.startswith('import ') and (';' in stripped or stripped.endswith('"') or stripped.endswith("'")):
            last_complete_import = i
            in_multiline_import = False
    
    return last_complete_import

def add_import_safe(content, from_path, item_name):
    """Add import after the last complete import line."""
    if item_name in content.split('return (')[0] if 'return (' in content else content:  # Only check pre-return
        return content
    
    lines = content.split('\n')
    last_idx = find_last_single_line_import(content)
    
    new_line = 'import { ' + item_name + ' } from "' + from_path + '"'
    lines.insert(last_idx + 1, new_line)
    return '\n'.join(lines)

def process_module(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract interface fields
    int_match = re.search(r'interface\s+(\w+)\s*\{([^}]*id:\s*string[^}]*)\}', content)
    if not int_match:
        return False, "no interface with id"
    
    body = int_match.group(2)
    fields = [f.strip() for f in re.findall(r'(\w+)\s*:', body) if f.strip() != 'id']
    if not fields:
        return False, "no fields"
    
    # Pick search fields
    preferred = ['name','company','title','status','type','category','description','city','region','partner','supplier','carrier','warehouse','customer','product','sku','orderId','pickupId','supplierName']
    search_fields = []
    for p in preferred:
        if p in fields and p not in search_fields:
            search_fields.append(p)
    for f in fields:
        if len(search_fields) >= 3:
            break
        if f not in search_fields:
            search_fields.append(f)
    if not search_fields:
        return False, "no search fields"
    
    # Find data var with .map() usage
    data_var = None
    for m in re.finditer(r'const\s+(\w+)\s*=\s*useMemo', content):
        var = m.group(1)
        if var + '.map(' in content:
            data_var = var
            break
    if not data_var:
        return False, "no data var"
    
    search_fields_str = ', '.join(repr(f) for f in search_fields)
    
    # Add imports (after all existing imports)
    content = add_import_safe(content, '@/hooks/use-search-filter', 'useSearchFilter')
    content = add_import_safe(content, '@/components/shared/search-filter-toolbar', 'SearchFilterToolbar')
    
    # Add useSearchFilter hook after data_var useMemo
    hook_line = '  const sf = useSearchFilter({{ items: {data_var}, searchFields: [{search_fields_str}] }})'
    
    # Find the complete useMemo expression for data_var
    simpler = r'const\s+' + re.escape(data_var) + r'\s*=\s*useMemo'
    s_match = re.search(simpler, content)
    if not s_match:
        return False, "no useMemo match"
    
    start = s_match.start()
    remaining = content[start:]
    # Find closing )) or ])
    end_match = re.search(r'\],?\s*\)', remaining)
    if not end_match:
        end_match = re.search(r'\[\s*\]\s*\)', remaining)
    if not end_match:
        return False, "can't find useMemo end"
    
    end_pos = start + end_match.end()
    content = content[:end_pos] + '\n' + hook_line + content[end_pos:]
    
    # Replace data_var.map with sf.filteredItems.map in JSX only
    return_idx = content.find('return (')
    if return_idx < 0:
        return False, "no return"
    
    jsx_part = content[return_idx:]
    before = jsx_part.count(data_var + '.map(')
    jsx_part = jsx_part.replace(data_var + '.map(', 'sf.filteredItems.map(')
    content = content[:return_idx] + jsx_part
    
    # Add SearchFilterToolbar before Card containing Table
    toolbar = '<SearchFilterToolbar\n          searchQuery={sf.searchQuery}\n          onSearchChange={sf.setSearchQuery}\n          onClearSearch={sf.clearSearch}\n          activeFilters={sf.activeFilters}\n          filterGroups={sf.filterGroupsWithCounts}\n          onToggleFilter={sf.toggleFilter}\n          onClearAllFilters={sf.clearAllFilters}\n          totalItems={sf.totalItems}\n          filteredCount={sf.filteredCount}\n        />'
    
    # Find <Card ...>\n<CardContent ...>\n<Table pattern
    card_pat = r'(<Card\b[^>]*>)\n(\s*)(<CardContent[^>]*>)\n(\s*)(<Table)'
    card_match = re.search(card_pat, content)
    if card_match:
        insert_pos = card_match.start()
        content = content[:insert_pos] + toolbar + '\n        ' + content[insert_pos:]
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    return True, f"fields={search_fields}, data={data_var}, maps_replaced={before}"

# Find candidates
candidates = []
for fp in sorted(glob.glob(os.path.join(MODULES_DIR, '*-view.tsx'))):
    with open(fp, 'r') as f:
        c = f.read()
    if 'useMemo' in c and '<Table' in c and re.search(r'interface\s+\w+\s*\{[^}]*id:\s*string', c):
        if 'SearchFilterToolbar' not in c:
            candidates.append(fp)

success = 0
for fp in candidates[:35]:
    ok, detail = process_module(fp)
    name = os.path.basename(fp)
    status = "OK" if ok else "SKIP"
    if ok:
        success += 1
    print(f"  [{status}] {name}: {detail}")

print(f"\nR256 SearchFilterToolbar v3: {success}/{len(candidates[:35])} modules")
