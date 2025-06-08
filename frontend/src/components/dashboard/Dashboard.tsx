"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { UploadSection } from "@/components/upload/UploadSection"
import { ResultsTable } from "@/components/results/ResultsTable"
import { SettingsPanel } from "@/components/settings/SettingsPanel"
import { AuditLogs } from "@/components/audit/AuditLogs"
import { CustomRules } from "@/components/rules/CustomRules"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

type ActiveTab = "dashboard" | "upload" | "results" | "rules" | "settings" | "audit"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useAuth()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.getDashboardStats(),
    enabled: activeTab === "dashboard",
  })

  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["classification-results"],
    queryFn: () => api.getClassificationResults(),
    enabled: activeTab === "results",
  })

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats stats={stats} loading={statsLoading} />
      case "upload":
        return <UploadSection />
      case "results":
        return <ResultsTable results={results} loading={resultsLoading} />
      case "rules":
        return <CustomRules />
      case "settings":
        return <SettingsPanel />
      case "audit":
        return user?.role === "admin" ? <AuditLogs /> : <div>Access Denied</div>
      default:
        return <DashboardStats stats={stats} loading={statsLoading} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}
