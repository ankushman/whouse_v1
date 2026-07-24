import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: inboundData } = await supabaseAdmin
      .from('inbound_shipments')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (inboundData) {
      return NextResponse.json({ data: { ...inboundData, shipment_type: 'inbound' } })
    }

    const { data: outboundData } = await supabaseAdmin
      .from('outbound_shipments')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (outboundData) {
      return NextResponse.json({ data: { ...outboundData, shipment_type: 'outbound' } })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Try inbound first
    const { data: inData, error: inErr } = await supabaseAdmin
      .from('inbound_shipments')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (inData) {
      return NextResponse.json({ data: { ...inData, shipment_type: 'inbound' } })
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
      return NextResponse.json({ data: { ...outData, shipment_type: 'outbound' } })
    }

    return NextResponse.json(
      { error: inErr?.message || outErr?.message || 'Not found' },
      { status: 404 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const now = new Date().toISOString()

    const { data: inData } = await supabaseAdmin
      .from('inbound_shipments')
      .update({ is_active: false, updated_at: now })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (inData) {
      return NextResponse.json({ data: inData })
    }

    const { data: outData } = await supabaseAdmin
      .from('outbound_shipments')
      .update({ is_active: false, updated_at: now })
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (outData) {
      return NextResponse.json({ data: outData })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
