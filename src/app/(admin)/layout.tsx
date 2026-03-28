import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) redirect("/login")
  if (session.user?.role !== "ADMIN" && session.user?.role !== "MECHANIC") {
    redirect("/dashboard")
  }

  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
            <div>
              <p className="text-sm text-gray-500">
                Login sebagai{" "}
                <span className="font-semibold text-gray-900">{session.user?.name}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                {session.user?.role}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                {session.user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
