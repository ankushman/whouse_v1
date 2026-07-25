import { supabaseAdmin, isSupabaseConfigured } from '@/config/supabase'
import { inboundShipments, outboundShipments } from '@/data/mock-data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShipmentFilters {
  type?: string | null
  status?: string | null
  warehouse?: string | null
  search?: string | null
  page?: number
  pageSize?: number
}

export interface ShipmentCreateData {
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Service functions – return plain objects (no NextResponse)
// ---------------------------------------------------------------------------

export async function getShipments(filters: ShipmentFilters = {}) {
  const {
    type,
    status,
    warehouse,
    search,
    page = 1,
    pageSize = 20,
  } = filters

  if (!isSupabaseConfigured()) {
    let data: unknown[] = []
    if (type === 'inbound' || !type)
      data = [...data, ...inboundShipments]
    if (type === 'outbound' || !type)
      data = [...data, ...outboundShipments]
    if (status)
      data = data.filter(
        (s) => (s as { status: string }).status === status,
      )
    if (search)
      data = data.filter((s) =>
        (s as { invoice: string }).invoice
          .toLowerCase()
          .includes(search.toLowerCase()),
      )

    const start = (page - 1) * pageSize
    return {
      data: data.slice(start, start + pageSize),
      count: data.length,
      page,
      pageSize,
      totalPages: Math.ceil(data.length / pageSize),
    }
  }

  try {
    const table =
      type === 'inbound'
        ? 'inbound_shipments'
        : type === 'outbound'
          ? 'outbound_shipments'
          : null

    if (!table) {
      // Return both types combined when no type specified
      const { data: inboundData, error: inErr } = await supabaseAdmin
        .from('inbound_shipments')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      const { data: outboundData, error: outErr } = await supabaseAdmin
        .from('outbound_shipments')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (inErr || outErr) {
        return {
          error: inErr?.message || outErr?.message || 'Fetch error',
        }
      }

      const allData = [
        ...(inboundData ?? []).map((d) => ({ ...d, shipment_type: 'inbound' })),
        ...(outboundData ?? []).map((d) => ({
          ...d,
          shipment_type: 'outbound',
        })),
      ]

      const start = (page - 1) * pageSize
      const paginatedData = allData.slice(start, start + pageSize)

      return {
        data: paginatedData,
        count: allData.length,
        page,
        pageSize,
        totalPages: Math.ceil(allData.length / pageSize),
      }
    }

    let query = supabaseAdmin
      .from(table)
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }
    if (warehouse) {
      query = query.eq('warehouse_id', warehouse)
    }
    if (search) {
      if (table === 'inbound_shipments') {
        query = query.or(
          `invoice.ilike.%${search}%,supplier.ilike.%${search}%`,
        )
      } else {
        query = query.or(
          `invoice.ilike.%${search}%,customer.ilike.%${search}%`,
        )
      }
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      return { error: error.message }
    }

    return {
      data: (data ?? []).map((d) => ({ ...d, shipment_type: type })),
      count: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: message }
  }
}

export async function getShipmentById(id: string) {
  if (!isSupabaseConfigured()) {
    const shipment =
      inboundShipments.find((s) => s.id === id) ||
      outboundShipments.find((s) => s.id === id)
    if (!shipment) return { error: 'Not found' }
    return { data: shipment }
  }

  try {
    const { data: inboundData } = await supabaseAdmin
      .from('inbound_shipments')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (inboundData) {
      return { data: { ...inboundData, shipment_type: 'inbound' } }
    }

    const { data: outboundData } = await supabaseAdmin
      .from('outbound_shipments')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (outboundData) {
      return { data: { ...outboundData, shipment_type: 'outbound' } }
    }

    return { error: 'Not found' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: message }
  }
}

export async function updateShipment(
  id: string,
  body: ShipmentCreateData,
) {
  try {
    // Try inbound first
    const { data: inData, error: inErr } = await supabaseAdmin
      .from('inbound_shipments')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (inData) {
      return { data: { ...inData, shipment_type: 'inbound' } }
    }

    // Try outbound
    const { data: outData, error: outErr } = await supabaseAdmin
      .from('outbound_shipments')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (outData) {
      return { data: { ...outData, shipment_type: 'outbound' } }
    }

    return {
      error: inErr?.message || outErr?.message || 'Not found',
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: message }
  }
}

export async function deleteShipment(id: string) {
  try {
    const now = new Date().toISOString()

    const { data: inData } = await supabaseAdmin
      .from('inbound_shipments')
      .update({ is_active: false, updated_at: now })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (inData) {
      return { data: inData }
    }

    const { data: outData } = await supabaseAdmin
      .from('outbound_shipments')
      .update({ is_active: false, updated_at: now })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (outData) {
      return { data: outData }
    }

    return { error: 'Not found' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { error: message }
  }
}

export async function createShipment(
  body: ShipmentCreateData,
  type: string,
) {
  if (!type || !['inbound', 'outbound'].includes(type)) {
    return { error: 'Valid type (inbound|outbound) is required' }
  }

  try {
    const table =
      type === 'inbound' ? 'inbound_shipments' : 'outbound_shipments'

    const { data, error } = await supabaseAdmin
      .from(table)
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
