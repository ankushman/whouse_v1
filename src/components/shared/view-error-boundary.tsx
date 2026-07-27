"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppStore } from "@/store/app-store"

interface ViewErrorBoundaryProps {
  children: React.ReactNode
}

interface ViewErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ViewErrorBoundary extends React.Component<
  ViewErrorBoundaryProps,
  ViewErrorBoundaryState
> {
  constructor(props: ViewErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ViewErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ViewErrorBoundary]", error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    const { setActiveView } = useAppStore.getState()
    setActiveView("dashboard")
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <Card className="w-full max-w-md border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Something went wrong
                </h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-[280px]">
                  {this.state.error?.message || "An unexpected error occurred while rendering this view."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={this.handleGoHome}
                >
                  <Home className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={this.handleRetry}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
