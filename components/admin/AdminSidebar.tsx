"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  UserCheck,
  FileText,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    href: "/admin/jobs",
    icon: Briefcase,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Employers",
    href: "/admin/employers",
    icon: Building2,
  },
  {
    title: "Applicants",
    href: "/admin/applicants",
    icon: UserCheck,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    title: "Verification",
    href: "/admin/verification",
    icon: ShieldCheck,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-white dark:bg-gray-950 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo & Collapse Button */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 h-9"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-950 dark:to-blue-950 text-purple-900 dark:text-purple-100"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", collapsed && "mx-auto")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3",
                collapsed && "justify-center px-2"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">Admin</span>
                  <span className="text-xs text-muted-foreground">admin@applynhire.com</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings/security">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Security
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <Link href="/admin/signout">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
