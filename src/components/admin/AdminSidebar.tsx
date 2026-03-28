"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Package,
  Wrench,
  Users,
  BarChart3,
  LogOut,
  ChevronRight,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/services", label: "Servis", icon: Wrench },
  { href: "/admin/inventory", label: "Inventori", icon: Package },
  { href: "/admin/customers", label: "Pelanggan", icon: Users },
  { href: "/admin/analytics", label: "Analitik", icon: BarChart3 },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-100 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
          <Wrench className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-black text-gray-900">
          Auto<span className="text-red-600">Flow</span>
        </span>
        <span className="ml-auto rounded-md bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={18}
                    className={cn(
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  {item.label}
                </div>
                {isActive && <ChevronRight size={14} className="text-white/70" />}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Sign out */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} className="text-gray-400" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
