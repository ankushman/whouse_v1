import { supabaseAdmin, isSupabaseConfigured } from '@/config/supabase'
import { warehouses } from '@/data/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WarehouseFilters {
  city?: string | null
  status?: string | null
  search?: string | null
}

export interface WarehouseCreateData {
  [key: string]: unknown
}

export interface WarehouseUpdateData {
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Service functions – return plain objects (no NextResponse)
// ---------------------------------------------------------------------------

export async function getWarehouses(filters: WarehouseFilters = {}) {
  if (!isSupabaseConfigured()) {
    let data = warehouses
    const { city, status, search } = filters
    if (city)
      data = data.filter((w) => w.city.toLowerCase().includes(city.toLowerCase()))
    if (status) data = data.filter((w) => w.status === status)
    if (search)
      data = data.filter(
        (w) =>
          w.name.toLowerCase().includes(search.toLowerCase()) ||
          w.city.toLowerCase().includes(search.toLowerCase()),
      )
    return { data, count: data.length }
  }

  try {
    const { city, status, search } = filters

    let query = supabaseAdmin
      .from('warehouses')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (city) {
      query = query.ilike('city', `%${city}%`)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,city.ilike.%${search}%,code.ilike.%${search}%`,
      )
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

export async function getWarehouseById(id: string) {
  if (!isSupabaseConfigured()) {
    const warehouse = warehouses.find((w) => w.id === id)
    if (!warehouse) return { error: 'Not found' }
    return { data: warehouse }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('warehouses')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return { error: 'Not found' }
    }

    return { data }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: message }
  }
}

export async function createWarehouse(body: WarehouseCreateData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('warehouses')
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

export async function updateWarehouse(id: string, body: WarehouseUpdateData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('warehouses')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (error || !data) {
      return { error: 'Not found' }
    }

    return { data }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: message }
  }
}

export async function deleteWarehouse(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('warehouses')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (error || !data) {
      return { error: 'Not found' }
    }

    return { data }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: message }
  }
}
