"use client" // This hook is client-side

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQueryList = window.matchMedia(query)
      const listener = () => setMatches(mediaQueryList.matches)

      // Initial check
      listener()

      // Listen for changes
      mediaQueryList.addEventListener("change", listener)

      return () => {
        mediaQueryList.removeEventListener("change", listener)
      }
    }
  }, [query])

  return matches
}
