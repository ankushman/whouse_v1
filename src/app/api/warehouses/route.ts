import { NextRequest, NextResponse } from 'next/server'
import { getWarehouses, createWarehouse } from '@/services'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const result = await getWarehouses({
    city: searchParams.get('city'),
    status: searchParams.get('status'),
    search: searchParams.get('search'),
  })
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createWarehouse(body)
    if (result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json({ data: result.data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
