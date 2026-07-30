#!/usr/bin/env python3
"""R256: Integrate SearchFilterToolbar into 30+ table-based modules.
Strategy: Find modules that have:
1. useMemo with generateXXX() patterns
2. <Table> with data rows (xxx.map)
3. Add SearchFilterToolbar above the table Card
4. Add useSearchFilter hook with auto-detected fields
"""

import os, re, glob

MODULES_DIR = '/home/z/my-project/src/components/modules'

def find_modules_with_tables():
    """Find modules suitable for SearchFilterToolbar integration."""
    candidates = []
    for filepath in sorted(glob.glob(os.path.join(MODULES_DIR, '*-view.tsx'))):
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Must have useMemo data generation
        if 'useMemo' not in content:
            continue
        # Must have <Table>
        if '<Table' not in content:
            continue
        # Must have some data type (interface with id field)
        has_interface = bool(re.search(r'interface\s+\w+\s*\{[^}]*id:\s*string', content))
        if not has_interface:
            continue
        # Skip if already has SearchFilterToolbar
        if 'SearchFilterToolbar' in content:
            continue
        
        candidates.append(filepath)
    return candidates

def extract_interface_fields(content):
    """Extract field names from the first data interface."""
    match = re.search(r'interface\s+(\w+)\s*\{([^}]+)\}', content)
    if not match:
        return []
    body = match.group(2)
    fields = re.findall(r'(\w+)\s*:', body)
    # Filter out 'id' and keep string/number fields
    return [f for f in fields if f != 'id']

def find_data_variable(content, interface_name):
    """Find the useMemo variable that generates data of this type."""
    # Look for patterns like: const xxx = useMemo(() => generateXxx(), [])
    pattern = r'const\s+(\w+)\s*=\s*useMemo\(\(\)\s*=>\s*(?:generate\w+|create\w+|\w+Data)\s*\(\s*\)?\s*,\s*\[\s*\]\s*\)'
    matches = re.findall(pattern, content)
    return matches[0] if matches else None

def process_module(filepath):
    """Integrate SearchFilterToolbar into a single module."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract interface fields
    fields = extract_interface_fields(content)
    if not fields:
        return False, "no fields"
    
    # Pick up to 3 searchable fields (prefer name/company/title/status)
    search_fields = []
    preferred = ['name', 'company', 'title', 'status', 'type', 'category', 'description', 'city', 'region', 'partner', 'supplier', 'carrier', 'warehouse', 'customer', 'product', 'sku']
    for f_pref in preferred:
        if f_pref in fields and f_pref not in search_fields:
            search_fields.append(f_pref)
    # Fill remaining
    for f_all in fields:
        if len(search_fields) >= 3:
            break
        if f_all not in search_fields:
            search_fields.append(f_all)
    if not search_fields:
        return False, "no search fields"
    
    # Find data variable
    data_var = None
    # Try to find a useMemo data variable
    use_mem_pattern = r'const\s+(\w+)\s*=\s*useMemo'
    for m in re.finditer(use_mem_pattern, content):
        var_name = m.group(1)
        # Check if this var is used in .map() for table rows
        if var_name + '.map' in content:
            data_var = var_name
            break
    
    if not data_var:
        return False, "no data var"
    
    search_fields_str = ','.join(repr(f) for f in search_fields)
    
    # 1. Add imports if not present
    if 'useSearchFilter' not in content:
        # Find the import block with hooks or add after first import
        import_pattern = r'(import\s+\{[^}]*\}\s+from\s+"@/hooks/[^"]*")'
        hook_import_match = re.search(import_pattern, content)
        if hook_import_match:
            existing_import = hook_import_match.group(1)
            if 'useSearchFilter' not in existing_import:
                new_import = existing_import.rstrip('}') + ', useSearchFilter }'
                content = content.replace(existing_import, new_import, 1)
        else:
            # Add new import after the last import line
            last_import = 0
            for i, line in enumerate(content.split('\n')):
                if line.startswith('import '):
                    last_import = i
            lines = content.split('\n')
            lines.insert(last_import + 1, 'import { useSearchFilter } from "@/hooks/use-search-filter"')
            content = '\n'.join(lines)
    
    if 'SearchFilterToolbar' not in content:
        # Add import after shared import block
        import_pattern2 = r'(import\s+\{[^}]*\}\s+from\s+"@/components/shared/[^"]*")'
        shared_match = re.search(import_pattern2, content)
        if shared_match:
            existing = shared_match.group(1)
            if 'SearchFilterToolbar' not in existing:
                new_imp = existing.rstrip('}') + ', SearchFilterToolbar }'
                content = content.replace(existing, new_imp, 1)
        else:
            last_import = 0
            for i, line in enumerate(content.split('\n')):
                if line.startswith('import '):
                    last_import = i
            lines = content.split('\n')
            lines.insert(last_import + 1, 'import { SearchFilterToolbar } from "@/components/shared/search-filter-toolbar"')
            content = '\n'.join(lines)
    
    # 2. Add useSearchFilter hook after the data variable declaration
    hook_code = '  const sf = useSearchFilter({{ items: {data_var}, searchFields: [{search_fields_str}] }})'
    
    # Find the data_var useMemo line and add hook after it
    # Pattern: const dataVar = useMemo(() => ..., [])
    hook_insert_pattern = r'(const\s+' + re.escape(data_var) + r'\s*=\s*useMemo\([^)]+\]\s*\))'
    hook_match = re.search(hook_insert_pattern, content)
    if hook_match and 'const sf' not in content:
        insert_pos = hook_match.end()
        content = content[:insert_pos] + '\n' + hook_code + content[insert_pos:]
    
    # 3. Replace data_var.map with sf.filteredItems.map in table rendering
    # Find patterns like: {dataVar.map( or dataVar.map( or  {dataVar.map(
    map_patterns = [
        (r'\{' + re.escape(data_var) + r'\.map\(', '{sf.filteredItems.map('),
        (re.escape(data_var) + r'\.map\(', 'sf.filteredItems.map('),
    ]
    for pattern, replacement in map_patterns:
        content = re.sub(pattern, replacement, content)
    
    # 4. Add SearchFilterToolbar before the table Card
    # Find the Card that wraps the table
    # Look for pattern: <Card...><CardContent...><Table
    toolbar_jsx = '''<SearchFilterToolbar
          searchQuery={sf.searchQuery}
          onSearchChange={sf.setSearchQuery}
          onClearSearch={sf.clearSearch}
          activeFilters={sf.activeFilters}
          filterGroups={sf.filterGroupsWithCounts}
          onToggleFilter={sf.toggleFilter}
          onClearAllFilters={sf.clearAllFilters}
          totalItems={sf.totalItems}
          filteredCount={sf.filteredCount}
        />'''
    
    # Insert toolbar before the Card that has table in CardContent
    # Find: <Card className="card-crud-lift ..."><CardContent ...><Table
    card_table_pattern = r'(<Card\s[^>]*>\s*<CardContent[^>]*>\s*<Table)'
    card_table_match = re.search(card_table_pattern, content)
    if card_table_match:
        insert_at = card_table_match.start()
        content = content[:insert_at] + toolbar_jsx + '\n        ' + content[insert_at:]
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    return True, f"fields={search_fields}, data={data_var}"

# Process modules
candidates = find_modules_with_tables()
results = []
success = 0
for filepath in candidates[:35]:  # Limit to 35
    ok, detail = process_module(filepath)
    name = os.path.basename(filepath)
    if ok:
        results.append((name, "OK", detail))
        success += 1
    else:
        results.append((name, "SKIP", detail))

print(f"R256 SearchFilterToolbar integration: {success}/{len(candidates)} modules")
for name, status, detail in results:
    print(f"  [{status}] {name}: {detail}")
