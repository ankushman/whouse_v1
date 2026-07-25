import { NextRequest, NextResponse } from 'next/server'
import {
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
} from '@/services'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await getWarehouseById(id)
  if (result.error)
    return NextResponse.json({ error: result.error }, { status: 404 })
  return NextResponse.json(result)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = await updateWarehouse(id, body)
    if (result.error)
      return NextResponse.json({ error: result.error }, { status: 404 })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = await deleteWarehouse(id)
  if (result.error)
    return NextResponse.json({ error: result.error }, { status: 404 })
  return NextResponse.json(result)
}
