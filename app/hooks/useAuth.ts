"use client"

import { useState } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Data Analyst",
  })

  const logout = () => {
    setUser(null)
    // In a real app, this would clear tokens and redirect
  }

  return { user, logout }
}
