"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query" // This import should now work

export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)

  useEffect(() => {
    // This effect ensures the sidebar state correctly reflects mobile status
    // especially on initial load or when window is resized.
    if (typeof window !== "undefined") {
      // Ensure window is defined for client-side logic
      setIsSidebarOpen(!isMobile)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isMobile={isMobile} />
      <div
        className={cn(
          "flex flex-col flex-1 w-full transition-all duration-300 ease-in-out",
          // Adjust margin based on sidebar state and mobile view
          isSidebarOpen && !isMobile ? "lg:ml-64" : "lg:ml-16", // Desktop: open vs closed
          // isMobile && isSidebarOpen ? "ml-0" : "", // Mobile: if sidebar is overlay, no margin needed
          // isMobile && !isSidebarOpen ? "ml-0" : ""
        )}
      >
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">{children}</main>
      </div>
    </div>
  )
}
