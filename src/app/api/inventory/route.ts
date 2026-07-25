import { NextRequest, NextResponse } from 'next/server'
import { getInventoryItems, createInventoryItem } from '@/services'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const result = await getInventoryItems({
    warehouse: searchParams.get('warehouse'),
    category: searchParams.get('category'),
    abc: searchParams.get('abc'),
    search: searchParams.get('search'),
    belowMin: searchParams.get('belowMin'),
  })
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await createInventoryItem(body)
    if (result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json({ data: result.data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
