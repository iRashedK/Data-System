"use client"

import { useState } from "react"
import { Bell, Menu, Moon, Search, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleTheme: () => void
  currentTheme: string
}

export function Header({ sidebarOpen, setSidebarOpen, toggleTheme, currentTheme }: HeaderProps) {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New classification completed", time: "5m ago" },
    { id: 2, message: "High-risk data detected", time: "1h ago" },
    { id: 3, message: "System update available", time: "2h ago" },
  ])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="w-full flex justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
            {currentTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    variant="destructive"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="font-medium">Notifications</span>
                <Button variant="ghost" size="sm">
                  Mark all as read
                </Button>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-0">
                  <div className="flex flex-col w-full px-4 py-2 cursor-pointer hover:bg-accent">
                    <span>{notification.message}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
