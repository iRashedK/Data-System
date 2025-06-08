"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { cn } from "@/lib/utils"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { theme, setTheme } = useTheme()

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />

      <div
        className={cn(
          "flex flex-col flex-1 w-full transition-all duration-300 ease-in-out",
          sidebarOpen && !isMobile ? "lg:ml-64" : "",
        )}
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          toggleTheme={toggleTheme}
          currentTheme={theme || "light"}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">{children}</main>
      </div>
    </div>
  )
}
