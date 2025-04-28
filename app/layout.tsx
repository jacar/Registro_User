import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { RegistroProvider } from "@/lib/store"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CORAZÓN SEGURO - Programa de Seguimiento",
  description: "Sistema de seguimiento para el programa de riesgo cardiovascular",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem enableColorScheme={false}>
          <RegistroProvider>{children}</RegistroProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
