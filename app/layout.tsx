import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "R.I.C.A.R.D.O Prompt Builder",
  description: "Construtor de prompts inteligente usando a metodologia R.I.C.A.R.D.O",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
