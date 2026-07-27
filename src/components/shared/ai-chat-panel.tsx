'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Bot, MessageSquare, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuickAction {
  label: string
  message: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Check SLA Status', message: 'What is the current SLA status across all warehouses? Highlight any at-risk or breached deliveries.' },
  { label: 'Inventory Summary', message: 'Give me a summary of current inventory levels across all warehouses. What items need restocking?' },
  { label: 'Shipment Delay Analysis', message: 'Analyze current shipment delays. What are the top causes and which routes are most affected?' },
  { label: 'Dock Schedule', message: 'What is the current dock utilization? Any scheduling conflicts or available slots today?' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [hasGreeted, setHasGreeted] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }, [messages, isLoading])

  // Focus input when sheet opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Greeting message on first open
  const greetUser = useCallback(() => {
    if (hasGreeted) return
    setHasGreeted(true)
    setMessages([
      {
        id: `greet-${Date.now()}`,
        role: 'assistant',
        content:
          'Hello! I\'m AutoFlow AI, your warehouse operations assistant. I can help you with inventory queries, shipment tracking, SLA monitoring, dock scheduling, and more. How can I help you today?',
        timestamp: new Date(),
      },
    ])
  }, [hasGreeted])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (open && messages.length === 0) {
        greetUser()
      }
    },
    [greetUser, messages.length]
  )

  // ---------------------------------------------------------------------------
  // Send message
  // ---------------------------------------------------------------------------

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMsg])
      setInputValue('')
      setIsLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            conversationId: conversationId || undefined,
          }),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to get response from AI.')
        }

        // Persist conversation ID
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId)
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMsg])
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            err instanceof Error
              ? `Error: ${err.message}`
              : 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, conversationId]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.message)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => handleOpenChange(true)}
        size="lg"
        className={cn(
          'fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-lg',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          'transition-all duration-200 hover:scale-105',
          'md:bottom-6',
          'chat-btn-pulse'
        )}
        aria-label="Open AI Chat Assistant"
      >
        <MessageSquare className="h-6 w-6" />
        {/* Green active dot */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500" />
        </span>
      </Button>

      {/* Chat Sheet Panel */}
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className={cn(
            'w-full sm:max-w-md p-0 flex flex-col',
            'chat-panel-enter'
          )}
        >
          {/* Header */}
          <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base">AutoFlow AI</SheetTitle>
                <SheetDescription className="text-xs">
                  Warehouse Operations Assistant
                </SheetDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => handleOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Messages area */}
          <div className="flex-1 overflow-hidden" ref={scrollRef}>
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-3 p-4 min-h-[200px]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex flex-col max-w-[85%]',
                      msg.role === 'user'
                        ? 'self-end items-end'
                        : 'self-start items-start'
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-muted-foreground rounded-bl-md'
                      )}
                    >
                      {msg.content}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] text-muted-foreground/60 mt-1 px-1',
                        msg.role === 'user' ? 'text-right' : 'text-left'
                      )}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex flex-col self-start items-start max-w-[85%]">
                    <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
                        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
                        <span className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Quick action chips */}
          <div className="shrink-0 border-t px-4 pt-3 pb-1">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                  className={cn(
                    'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium',
                    'bg-background text-foreground border-border',
                    'hover:bg-accent hover:text-accent-foreground',
                    'transition-colors duration-150',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t p-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about warehouse operations..."
                disabled={isLoading}
                className="flex-1 rounded-full px-4"
                aria-label="Chat message input"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputValue.trim()}
                className="h-10 w-10 rounded-full shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
