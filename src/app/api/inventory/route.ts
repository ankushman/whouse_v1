import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const warehouse = searchParams.get('warehouse')
    const category = searchParams.get('category')
    const abc = searchParams.get('abc')
    const search = searchParams.get('search')
    const belowMin = searchParams.get('belowMin') === 'true'

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
      query = query.or(`part_name.ilike.%${search}%,sku.ilike.%${search}%,location.ilike.%${search}%`)
    }
    if (belowMin) {
      query = query.lt('quantity', 'min_stock')
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [], count: data?.length ?? 0 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
