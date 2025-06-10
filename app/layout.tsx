import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Assuming your global styles are here
import { ThemeProvider } from "@/components/theme-provider" // Assuming this path is correct
import { Toaster } from "@/components/ui/sonner" // For notifications

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HOKM - Data Management Platform",
  description: "HOKM - Advanced Data Classification, Cataloging, and Governance.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
