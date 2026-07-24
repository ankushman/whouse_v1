'use client'

import { useTheme } from 'next-themes'
import {
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
} from 'lucide-react'

import { useAppStore, navItems } from '@/store/app-store'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const warehouses = [
  { id: 'all', label: 'All Warehouses' },
  { id: 'wh-1', label: 'Mumbai Central' },
  { id: 'wh-2', label: 'Delhi NCR Hub' },
  { id: 'wh-3', label: 'Bangalore South' },
  { id: 'wh-4', label: 'Chennai Port' },
  { id: 'wh-5', label: 'Hyderabad East' },
]

export function TopNav() {
  const { theme, setTheme } = useTheme()
  const { activeView, selectedWarehouse, setSelectedWarehouse, setCommandPaletteOpen } =
    useAppStore()

  const currentNavItem = navItems.find((item) => item.id === activeView)
  const currentPageName = currentNavItem?.label ?? 'Dashboard'

  const currentWarehouseLabel =
    warehouses.find((w) => w.id === selectedWarehouse)?.label ?? 'All Warehouses'

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Center - Search */}
      <Button
        variant="outline"
        size="sm"
        className="hidden h-8 w-64 justify-start gap-2 text-muted-foreground md:flex"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="size-3.5" />
        <span className="text-sm">Search...</span>
        <kbd className="pointer-events-none ml-auto hidden select-none items-center gap-1 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Mobile search button */}
      <Button
        variant="ghost"
        size="icon"
        className="size-8 md:hidden"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="size-4" />
        <span className="sr-only">Search</span>
      </Button>

      {/* Right section */}
      <div className="flex items-center gap-1.5">
        {/* Warehouse selector */}
        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
          <SelectTrigger size="sm" className="hidden w-40 lg:flex">
            <SelectValue>{currentWarehouseLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {warehouses.map((wh) => (
              <SelectItem key={wh.id} value={wh.id}>
                {wh.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative size-8">
          <Bell className="size-4" />
          <Badge className="absolute -top-0.5 -right-0.5 size-4 justify-center rounded-full p-0 text-[10px]">
            5
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Profile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 gap-2 rounded-full pl-2 pr-3">
              <Avatar className="size-7">
                <AvatarFallback className="bg-blue-600 text-[11px] font-semibold text-white">
                  RK
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium lg:inline-block">
                Rajesh Kumar
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Rajesh Kumar</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Executive
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
