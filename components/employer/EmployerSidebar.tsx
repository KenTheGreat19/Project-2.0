"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { 
  Briefcase, 
  Users, 
  Search,
  Calendar,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Tag,
  Building2,
  Megaphone,
  Lightbulb,
  Grid3x3,
  LayoutDashboard,
  CreditCard,
  FileText,
  UserCog,
  HelpCircle,
  Layers,
  LogOut,
  ChevronUp,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EmployerSidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  mobileOpen?: boolean
  onMobileToggle?: (open: boolean) => void
}

interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/employer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    href: "/employer/jobs",
    icon: Briefcase,
    children: [
      { title: "All Jobs", href: "/employer/jobs", icon: Briefcase },
      { title: "Tags", href: "/employer/jobs/tags", icon: Tag },
    ],
  },
  {
    title: "Talented",
    href: "/employer/talented",
    icon: Search,
  },
  {
    title: "Candidates",
    href: "/employer/candidates",
    icon: Users,
  },
  {
    title: "Interviews",
    href: "/employer/interviews",
    icon: Calendar,
    children: [
      { title: "All Interviews", href: "/employer/interviews", icon: Calendar },
      { title: "Interview Availability", href: "/employer/interviews/availability", icon: Calendar },
    ],
  },
  {
    title: "Analytics",
    href: "/employer/analytics",
    icon: BarChart3,
    children: [
      { title: "Analytics Overview", href: "/employer/analytics", icon: BarChart3 },
      { title: "Jobs and Campaigns", href: "/employer/analytics/jobs", icon: Briefcase },
      { title: "Talented", href: "/employer/analytics/talented", icon: Search },
      { title: "Employer Branding Ads", href: "/employer/analytics/branding", icon: Megaphone },
      { title: "Hiring Insights", href: "/employer/analytics/insights", icon: Lightbulb },
    ],
  },
  {
    title: "Tools",
    href: "/employer/tools",
    icon: Settings,
    children: [
      { title: "Overview", href: "/employer/tools", icon: Grid3x3 },
      { title: "Action Center", href: "/employer/tools/action-center", icon: Settings },
      { title: "ATS Integrations", href: "/employer/tools/integrations", icon: Building2 },
      { title: "Automations", href: "/employer/tools/automations", icon: Settings },
    ],
  },
  {
    title: "Billing & Invoices",
    href: "/employer/billing",
    icon: CreditCard,
  },
  {
    title: "Subscriptions",
    href: "/employer/subscriptions",
    icon: Layers,
  },
  {
    title: "Employer Settings",
    href: "/employer/settings",
    icon: UserCog,
  },
  {
    title: "Users",
    href: "/employer/users",
    icon: Users,
  },
  {
    title: "Contact Us",
    href: "/employer/contact",
    icon: HelpCircle,
  },
]

interface EmployerSidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export function EmployerSidebar({ 
  collapsed = false, 
  onCollapse,
  mobileOpen = false,
  onMobileToggle
}: EmployerSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Jobs", "Interviews", "Analytics", "Tools", "Employer Settings"])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  
  const userName = session?.user?.name || "User"
  const userEmail = session?.user?.email || ""

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (onMobileToggle) {
      onMobileToggle(false)
    }
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/")
  }

  const isParentActive = (item: SidebarItem) => {
    if (isActive(item.href)) return true
    if (item.children) {
      return item.children.some((child) => isActive(child.href))
    }
    return false
  }

  if (collapsed) {
    return (
      <div className="w-16 border-r bg-card h-screen sticky top-0 hidden lg:block">
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapse?.(false)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => onMobileToggle?.(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "w-64 border-r bg-card h-screen sticky top-0 overflow-y-auto transition-transform duration-300",
        "fixed lg:relative z-50",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-4 space-y-4">
          {/* Mobile Close Button */}
          <button
            onClick={() => onMobileToggle?.(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-md hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header with Collapse */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Employer Portal</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCollapse?.(true)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Create New Button */}
          <Button
            className="w-full justify-start gap-2"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Create new
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.title}>
                <Link href={item.href} onClick={!item.children ? handleLinkClick : undefined}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isParentActive(item)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={(e) => {
                      if (item.children) {
                        e.preventDefault()
                        toggleExpanded(item.title)
                      }
                    }}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.children && (
                      expandedItems.includes(item.title) ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      )
                    )}
                  </button>
                </Link>

                {/* Sub-items */}
                {item.children && expandedItems.includes(item.title) && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-4">
                    {item.children.map((child) => (
                      <Link key={child.title} href={child.href} onClick={handleLinkClick}>
                        <button
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                            isActive(child.href)
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <child.icon className="h-4 w-4 shrink-0" />
                          <span>{child.title}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Profile Section at Bottom */}
          <div className="border-t pt-4 mt-auto">
            <DropdownMenu open={showProfileDropdown} onOpenChange={setShowProfileDropdown}>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent"
                >
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium truncate">{userName}</div>
                    <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
                  </div>
                  <ChevronUp className={cn(
                    "h-4 w-4 transition-transform",
                    showProfileDropdown && "rotate-180"
                  )} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/employer/settings/account">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Create New Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new</DialogTitle>
            <DialogDescription>
              Choose what you'd like to create
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Link href="/employer/jobs/new">
              <Button
                variant="outline"
                className="w-full h-auto py-6 justify-start gap-4"
                onClick={() => setShowCreateDialog(false)}
              >
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Job</div>
                  <div className="text-sm text-muted-foreground">
                    Post a new job opening
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>
            </Link>

            <Link href="/employer/users/new">
              <Button
                variant="outline"
                className="w-full h-auto py-6 justify-start gap-4"
                onClick={() => setShowCreateDialog(false)}
              >
                <div className="p-3 rounded-lg bg-pink-500/10">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">User</div>
                  <div className="text-sm text-muted-foreground">
                    Add a team member to your account
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 ml-auto" />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
