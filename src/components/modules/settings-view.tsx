"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Building2,
  Users,
  Truck,
  Target,
  Bell,
  Shield,
  Globe,
  Save,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"

const usersData = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh.kumar@autoflow.in", role: "Executive", status: "Active", lastLogin: "2 min ago" },
  { id: "2", name: "Priya Sharma", email: "priya.sharma@autoflow.in", role: "Regional Manager", status: "Active", lastLogin: "15 min ago" },
  { id: "3", name: "Amit Patel", email: "amit.patel@autoflow.in", role: "Warehouse Manager", status: "Active", lastLogin: "1 hr ago" },
  { id: "4", name: "Deepa Nair", email: "deepa.nair@autoflow.in", role: "Supervisor", status: "Active", lastLogin: "30 min ago" },
  { id: "5", name: "Suresh Reddy", email: "suresh.reddy@autoflow.in", role: "Operator", status: "Inactive", lastLogin: "2 days ago" },
  { id: "6", name: "Kavitha Menon", email: "kavitha.menon@autoflow.in", role: "Warehouse Manager", status: "Active", lastLogin: "5 min ago" },
  { id: "7", name: "Ravi Verma", email: "ravi.verma@autoflow.in", role: "Supervisor", status: "Active", lastLogin: "45 min ago" },
  { id: "8", name: "Anjali Desai", email: "anjali.desai@autoflow.in", role: "Operator", status: "Active", lastLogin: "2 hrs ago" },
]

const rolesData = [
  { name: "Super Admin", permissions: "Full access", users: 1 },
  { name: "Executive", permissions: "All views, reports, settings", users: 3 },
  { name: "Regional Manager", permissions: "Regional views, reports", users: 4 },
  { name: "Warehouse Manager", permissions: "Warehouse operations, inventory", users: 6 },
  { name: "Supervisor", permissions: "Operations, alerts", users: 12 },
  { name: "Operator", permissions: "Basic operations only", users: 45 },
]

function SettingsSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <Label className="text-sm">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function SettingsView() {
  const [enabledNotifications, setEnabledNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    slaBreach: true,
    lowStock: true,
    equipmentAlert: true,
    dailyReport: false,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure system preferences and manage users"
        actions={
          <Button size="sm" className="gap-1.5">
            <Save className="h-3.5 w-3.5" /> Save All Changes
          </Button>
        }
      />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          {["general", "warehouses", "customers", "transporters", "users", "roles", "kpi", "notifications"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="text-xs h-7 px-3 capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">General Settings</CardTitle>
              <CardDescription className="text-xs">Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">Company Name</Label>
                  <Input defaultValue="AutoFlow Logistics" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Industry</Label>
                  <Input defaultValue="Automobile Logistics" className="h-9 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Timezone</Label>
                  <Select defaultValue="asia-kolkata">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-kolkata">Asia/Kolkata (IST +5:30)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Date Format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Currency</Label>
                  <Select defaultValue="inr">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">INR (₹)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button size="sm" className="gap-1.5">
                  <Save className="h-3.5 w-3.5" /> Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">User Management</CardTitle>
                  <CardDescription className="text-xs">Manage users and their access levels</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">User</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Last Login</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px]">
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] rounded-full">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px] rounded-full", user.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300")}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles */}
        <TabsContent value="roles">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Roles & Permissions</CardTitle>
                  <CardDescription className="text-xs">Define roles and access permissions</CardDescription>
                </div>
                <Button size="sm" className="gap-1.5 h-8 text-xs">
                  <Shield className="h-3.5 w-3.5" /> Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs">Role Name</TableHead>
                    <TableHead className="text-xs">Permissions</TableHead>
                    <TableHead className="text-xs text-right">Users</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesData.map((role) => (
                    <TableRow key={role.name}>
                      <TableCell className="text-xs font-medium">{role.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{role.permissions}</TableCell>
                      <TableCell className="text-xs text-right">
                        <Badge variant="secondary" className="text-[10px]">{role.users}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Notification Settings</CardTitle>
              <CardDescription className="text-xs">Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Channels</h4>
                <SettingsSection>
                  <SettingRow label="Email Notifications" description="Receive alerts via email">
                    <Switch checked={enabledNotifications.email} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, email: v })} />
                  </SettingRow>
                  <SettingRow label="Push Notifications" description="Browser push notifications">
                    <Switch checked={enabledNotifications.push} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, push: v })} />
                  </SettingRow>
                  <SettingRow label="SMS Alerts" description="Critical alerts via SMS">
                    <Switch checked={enabledNotifications.sms} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, sms: v })} />
                  </SettingRow>
                </SettingsSection>
              </div>
              <Separator />
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alert Types</h4>
                <SettingsSection>
                  <SettingRow label="SLA Breach Alerts">
                    <Switch checked={enabledNotifications.slaBreach} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, slaBreach: v })} />
                  </SettingRow>
                  <SettingRow label="Low Stock Warnings">
                    <Switch checked={enabledNotifications.lowStock} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, lowStock: v })} />
                  </SettingRow>
                  <SettingRow label="Equipment Failure">
                    <Switch checked={enabledNotifications.equipmentAlert} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, equipmentAlert: v })} />
                  </SettingRow>
                  <SettingRow label="Daily Report Email">
                    <Switch checked={enabledNotifications.dailyReport} onCheckedChange={(v) => setEnabledNotifications({ ...enabledNotifications, dailyReport: v })} />
                  </SettingRow>
                </SettingsSection>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs - placeholder */}
        {["warehouses", "customers", "transporters", "kpi"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card className="rounded-xl border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold capitalize">{tab === "kpi" ? "KPI Configuration" : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Master`}</CardTitle>
                <CardDescription className="text-xs">Manage {tab} configuration and data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Settings className="h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-3 text-sm font-medium text-muted-foreground">Configuration UI</p>
                  <p className="text-xs text-muted-foreground">Ready for Supabase integration. Connect your database to manage {tab} data.</p>
                  <Button variant="outline" size="sm" className="mt-4 gap-1.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add {tab === "kpi" ? "KPI" : tab.charAt(0).toUpperCase() + tab.slice(1).slice(0, -1)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
