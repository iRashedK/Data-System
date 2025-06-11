import type React from "react"
// No changes needed to this file based on the previous context,
// but ensure DataProvider wraps the children if it's not already done
// by a higher-order layout component.
// For this example, I'll add it here.

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Assuming globals.css is in the app directory
import { ThemeProvider } from "@/components/theme-provider" // Assuming this path
import { DataProvider } from "@/app/contexts/DataContext" // Corrected path

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Data Classification System",
  description: "Modular AI-driven data classification and cataloging.",
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
          <DataProvider>
            {" "}
            {/* Wrap with DataProvider */}
            {children}
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
