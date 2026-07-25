import { NextRequest, NextResponse } from 'next/server'
import { getShipments, createShipment } from '@/services'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const result = await getShipments({
    type: searchParams.get('type'),
    status: searchParams.get('status'),
    warehouse: searchParams.get('warehouse'),
    search: searchParams.get('search'),
    page: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('pageSize')) || 20,
  })
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || ''
    const body = await request.json()
    const result = await createShipment(body, type)
    if (result.error) {
      const status =
        result.error.includes('required') ? 400 : 500
      return NextResponse.json({ error: result.error }, { status })
    }
    return NextResponse.json({ data: result.data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
