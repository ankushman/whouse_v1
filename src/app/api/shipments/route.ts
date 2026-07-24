import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { inboundShipments, outboundShipments } from '@/data/mock-data'

function mockResponse(searchParams: URLSearchParams) {
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const page = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 20

  let data: any[] = []
  if (type === 'inbound' || !type) data = [...data, ...inboundShipments]
  if (type === 'outbound' || !type) data = [...data, ...outboundShipments]
  if (status) data = data.filter(s => s.status === status)
  if (search) data = data.filter(s => s.invoice.toLowerCase().includes(search.toLowerCase()))

  const start = (page - 1) * pageSize
  return NextResponse.json({
    data: data.slice(start, start + pageSize),
    count: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  })
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) return mockResponse(new URL(request.url).searchParams)
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const warehouse = searchParams.get('warehouse')
    const search = searchParams.get('search')
    const page = Number(searchParams.get('page')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || 20

    const table = type === 'inbound' ? 'inbound_shipments' : type === 'outbound' ? 'outbound_shipments' : null

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
        return NextResponse.json(
          { error: inErr?.message || outErr?.message || 'Fetch error' },
          { status: 500 }
        )
      }

      const allData = [
        ...(inboundData ?? []).map((d) => ({ ...d, shipment_type: 'inbound' })),
        ...(outboundData ?? []).map((d) => ({ ...d, shipment_type: 'outbound' })),
      ]

      const start = (page - 1) * pageSize
      const paginatedData = allData.slice(start, start + pageSize)

      return NextResponse.json({
        data: paginatedData,
        count: allData.length,
        page,
        pageSize,
        totalPages: Math.ceil(allData.length / pageSize),
      })
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
        query = query.or(`invoice.ilike.%${search}%,supplier.ilike.%${search}%`)
      } else {
        query = query.or(`invoice.ilike.%${search}%,customer.ilike.%${search}%`)
      }
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: (data ?? []).map((d) => ({ ...d, shipment_type: type })),
      count: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const body = await request.json()

    if (!type || !['inbound', 'outbound'].includes(type)) {
      return NextResponse.json({ error: 'Valid ?type=inbound|outbound is required' }, { status: 400 })
    }

    const table = type === 'inbound' ? 'inbound_shipments' : 'outbound_shipments'

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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
