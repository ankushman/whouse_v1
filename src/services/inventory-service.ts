import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { inventoryItems } from '@/data/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InventoryFilters {
  warehouse?: string | null
  category?: string | null
  abc?: string | null
  search?: string | null
  belowMin?: string | null
}

export interface InventoryCreateData {
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Service functions – return plain objects (no NextResponse)
// ---------------------------------------------------------------------------

export async function getInventoryItems(filters: InventoryFilters = {}) {
  if (!isSupabaseConfigured()) {
    let data = inventoryItems
    const { warehouse, category, abc, search, belowMin } = filters
    if (warehouse)
      data = data.filter((i) =>
        i.warehouse.toLowerCase().includes(warehouse.toLowerCase()),
      )
    if (category) data = data.filter((i) => i.category === category)
    if (abc) data = data.filter((i) => i.abcClass === abc)
    if (search)
      data = data.filter(
        (i) =>
          i.partName.toLowerCase().includes(search.toLowerCase()) ||
          i.sku.toLowerCase().includes(search.toLowerCase()),
      )
    if (belowMin === 'true')
      data = data.filter((i) => i.quantity < i.minStock)
    return { data, count: data.length }
  }

  try {
    const { warehouse, category, abc, search, belowMin } = filters

    let query = supabaseAdmin
      .from('inventory_items')
      .select('*')
      .eq('is_active', true)
      .order('part_name')

    if (warehouse) {
      query = query.eq('warehouse_id', warehouse)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (abc) {
      query = query.eq('abc_class', abc)
    }
    if (search) {
      query = query.or(
        `part_name.ilike.%${search}%,sku.ilike.%${search}%,location.ilike.%${search}%`,
      )
    }
    if (belowMin === 'true') {
      query = query.lt('quantity', 'min_stock')
    }

    const { data, error } = await query

    if (error) {
      return { error: error.message }
    }

    return { data: data ?? [], count: data?.length ?? 0 }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: message }
  }
}

export async function createInventoryItem(body: InventoryCreateData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('inventory_items')
      .insert({
        ...body,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { data }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: message }
  }
}
