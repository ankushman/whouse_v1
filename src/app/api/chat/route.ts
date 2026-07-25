import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT =
  'You are AutoFlow AI Assistant, an intelligent warehouse operations advisor for an automobile logistics company. You help with inventory queries, shipment tracking, warehouse performance, SLA monitoring, dock scheduling, and general logistics operations. Be concise, data-driven, and actionable. When referencing data, use realistic figures based on Indian warehouse operations.'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const conversationHistory = new Map<string, ChatMessage[]>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationId } = body as {
      message: string
      conversationId?: string
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid message is required.' },
        { status: 400 }
      )
    }

    const convId =
      conversationId ||
      `conv-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    // Retrieve or create conversation history
    let history = conversationHistory.get(convId) || []

    // Append user message
    history.push({ role: 'user', content: message })

    // Trim to last 20 messages (10 exchanges)
    if (history.length > 20) {
      history = history.slice(-20)
    }

    // Build messages array for the SDK
    const sdkMessages: Array<{ role: string; content: string }> = [
      { role: 'assistant', content: SYSTEM_PROMPT },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ]

    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: sdkMessages,
      thinking: { type: 'disabled' },
    })

    const response =
      completion.choices?.[0]?.message?.content ||
      'I apologize, but I could not generate a response. Please try again.'

    // Append assistant response to history
    history.push({ role: 'assistant', content: response })
    conversationHistory.set(convId, history)

    // Prevent memory bloat: prune old conversations (keep last 100)
    if (conversationHistory.size > 100) {
      const keys = Array.from(conversationHistory.keys())
      for (let i = 0; i < keys.length - 100; i++) {
        conversationHistory.delete(keys[i])
      }
    }

    return NextResponse.json({
      success: true,
      response,
      conversationId: convId,
    })
  } catch (err) {
    console.error('Chat API error:', err)
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred.'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
