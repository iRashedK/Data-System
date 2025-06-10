"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Database,
  Shield,
  Settings,
  FileText,
  Globe,
  LogOut,
  ChevronRight,
  ChevronLeft,
  BookOpenText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/useAuth"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isMobile: boolean
}

export function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Classification",
      href: "/classification",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      title: "Open Data Generator",
      href: "/open-data",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "Data Catalog",
      href: "/data-catalog",
      icon: <BookOpenText className="h-5 w-5" />,
    },
    {
      title: "Data Sources",
      href: "/data-sources",
      icon: <Database className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {isOpen ? (
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Data Guardian</span>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            )}

            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="hidden lg:flex">
              {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    !isOpen && "justify-center",
                  )}
                >
                  {item.icon}
                  {isOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              ))}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="p-4 border-t border-border">
            {isOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.role || "Analyst"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
