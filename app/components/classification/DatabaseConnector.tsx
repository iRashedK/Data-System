"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Database, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export function DatabaseConnector() {
  const [dbType, setDbType] = useState("postgresql")
  const [connectionName, setConnectionName] = useState("")
  const [host, setHost] = useState("")
  const [port, setPort] = useState("")
  const [database, setDatabase] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [connecting, setConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "success" | "error">("idle")
  const [connectionProgress, setConnectionProgress] = useState(0)

  const handleConnect = () => {
    setConnecting(true)
    setConnectionStatus("connecting")
    setConnectionProgress(0)

    // Simulate connection progress
    const interval = setInterval(() => {
      setConnectionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setConnecting(false)
          setConnectionStatus("success")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const isFormValid = connectionName && host && port && database && username && password

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-lg">Connect to Database</h3>
            <p className="text-sm text-muted-foreground">Connect to your database to classify its schema</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="connection-name">Connection Name</Label>
            <Input
              id="connection-name"
              placeholder="My Database"
              value={connectionName}
              onChange={(e) => setConnectionName(e.target.value)}
              disabled={connecting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="db-type">Database Type</Label>
            <Select value={dbType} onValueChange={setDbType} disabled={connecting}>
              <SelectTrigger id="db-type">
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="sqlserver">SQL Server</SelectItem>
                <SelectItem value="oracle">Oracle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              placeholder="localhost"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              disabled={connecting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              placeholder="5432"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              disabled={connecting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">Database</Label>
            <Input
              id="database"
              placeholder="my_database"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              disabled={connecting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={connecting}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={connecting}
            />
          </div>
        </div>

        {connectionStatus === "connecting" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connecting...</span>
              <span className="text-sm text-muted-foreground">{connectionProgress}%</span>
            </div>
            <Progress value={connectionProgress} className="h-2" />
          </div>
        )}

        {connectionStatus === "success" && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span>Connected successfully! Analyzing database schema...</span>
          </div>
        )}

        {connectionStatus === "error" && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
            <span>Connection failed. Please check your credentials and try again.</span>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button variant="outline" disabled={connecting}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={!isFormValid || connecting} className="flex items-center space-x-2">
            {connecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>Connect & Classify</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
