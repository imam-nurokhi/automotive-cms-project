import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { Navbar } from "@/components/marketing/Navbar"
import { Footer } from "@/components/marketing/Footer"

export const metadata: Metadata = {
  title: "AutoFlow – Sistem Manajemen Bengkel Premium",
  description: "Platform manajemen bengkel premium terpercaya di Indonesia",
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </SessionProvider>
  )
}
