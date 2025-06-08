"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database, Server, Key, Lock, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function DatabaseConnector() {
  const [connectionType, setConnectionType] = useState("mysql")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "success" | "error">("idle")

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    setConnectionStatus("connecting")

    // Simulate connection attempt
    setTimeout(() => {
      setIsConnecting(false)
      setConnectionStatus("success")
    }, 2000)
  }

  const handleReset = () => {
    setConnectionStatus("idle")
  }

  return (
    <Card className="p-6">
      {connectionStatus === "idle" || connectionStatus === "connecting" ? (
        <form onSubmit={handleConnect} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="connection-type">Database Type</Label>
                <Select value={connectionType} onValueChange={setConnectionType}>
                  <SelectTrigger id="connection-type">
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mssql">Microsoft SQL Server</SelectItem>
                    <SelectItem value="oracle">Oracle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <div className="relative">
                  <Server className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="host" placeholder="localhost" className="pl-9" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input id="port" placeholder="3306" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="database">Database Name</Label>
                <div className="relative">
                  <Database className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="database" placeholder="my_database" className="pl-9" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="username" placeholder="username" className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-9" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect & Classify"}
            </Button>
          </div>
        </form>
      ) : connectionStatus === "success" ? (
        <div className="space-y-6">
          <div className="rounded-lg bg-green-50 p-4 text-green-700">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-green-100 p-2">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Connection Successful</h3>
                <p className="text-sm">Connected to database. Analyzing tables and columns...</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Tables Found: 12</h3>
              <p className="text-sm text-muted-foreground">Columns: 86</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analyzing data structure...</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium">Connection Failed</h3>
                <p className="text-sm">Unable to connect to the database. Please check your credentials.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleReset}>Try Again</Button>
          </div>
        </div>
      )}
    </Card>
  )
}
