'use client'

import * as LucideIcons from 'lucide-react'
import {
  LayoutDashboard,
  Warehouse,
  PackageSearch,
  Truck,
  Package,
  Route,
  Cog,
  Users,
  TrendingUp,
  DollarSign,
  Bell,
  FileBarChart,
  Settings,
  Grid3X3,
  ChevronsUpDown,
  LogOut,
} from 'lucide-react'

import { useAppStore, navItems, type NavItem } from '@/store/app-store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Warehouse,
  PackageSearch,
  Truck,
  Package,
  Route,
  Cog,
  Users,
  TrendingUp,
  DollarSign,
  Bell,
  FileBarChart,
  Settings,
}

const warehouses = [
  { id: 'all', label: 'All Warehouses' },
  { id: 'wh-1', label: 'Mumbai Central' },
  { id: 'wh-2', label: 'Delhi NCR Hub' },
  { id: 'wh-3', label: 'Bangalore South' },
  { id: 'wh-4', label: 'Chennai Port' },
  { id: 'wh-5', label: 'Hyderabad East' },
]

export function AppSidebar() {
  const { activeView, setActiveView, currentRole, selectedWarehouse, setSelectedWarehouse } = useAppStore()

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(currentRole)
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Grid3X3 className="size-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight text-foreground">
              AutoFlow
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              Warehouse Management
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item: NavItem) => {
                const IconComponent = iconMap[item.icon]
                const isActive = activeView === item.id

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => setActiveView(item.id)}
                      className={
                        isActive
                          ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
                          : ''
                      }
                    >
                      {IconComponent && (
                        <IconComponent className="size-4" />
                      )}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && item.badge > 0 && (
                      <SidebarMenuBadge
                        className={
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-600 text-white'
                        }
                      >
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2">
        <SidebarSeparator />
        <div className="px-2 group-data-[collapsible=icon]:px-0">
          <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
            <SelectTrigger
              size="sm"
              className="w-full group-data-[collapsible=icon]:hidden"
            >
              <Warehouse className="size-3.5 shrink-0" />
              <SelectValue placeholder="Select warehouse" />
            </SelectTrigger>
            <SelectContent>
              {warehouses.map((wh) => (
                <SelectItem key={wh.id} value={wh.id}>
                  {wh.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <SidebarSeparator />

        <div className="flex items-center gap-2.5 px-3 py-2">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-blue-600 text-xs font-semibold text-white">
              RK
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-xs font-medium text-foreground">
              Rajesh Kumar
            </span>
            <span className="truncate text-[10px] text-muted-foreground">
              Executive
            </span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
