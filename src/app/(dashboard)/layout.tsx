import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import Link from "next/link"
import { Wrench, LayoutDashboard, Car, Calendar, LogOut } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-gray-100 bg-white lg:flex">
          <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-black text-gray-900">
              Auto<span className="text-red-600">Flow</span>
            </span>
          </div>

          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {[
                { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                { href: "/dashboard/vehicles", label: "Kendaraan Saya", icon: Car },
                { href: "/booking", label: "Booking Servis", icon: Calendar },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon size={18} className="text-gray-400" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-gray-100 p-4">
            <div className="mb-3 flex items-center gap-3 px-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                {session.user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{session.user?.name}</p>
                <p className="truncate text-xs text-gray-500">{session.user?.email}</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-500 transition hover:text-red-600"
            >
              <LogOut size={16} />
              Keluar
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
