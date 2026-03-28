import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { Plus, Wrench } from "lucide-react"

async function getServices() {
  try {
    return await prisma.serviceRecord.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: { select: { brand: true, model: true, licensePlate: true } },
        mechanic: { select: { name: true } },
      },
      take: 50,
    })
  } catch {
    return []
  }
}

const statusBadgeVariant: Record<string, "success" | "info" | "pending" | "danger"> = {
  COMPLETED: "success",
  IN_PROGRESS: "info",
  PENDING: "pending",
  CANCELLED: "danger",
}

const statusLabel: Record<string, string> = {
  COMPLETED: "Selesai",
  IN_PROGRESS: "Dalam Proses",
  PENDING: "Menunggu",
  CANCELLED: "Dibatalkan",
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Daftar Servis</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola semua pekerjaan servis kendaraan</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          <Plus size={16} />
          Servis Baru
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        {services.length === 0 ? (
          <div className="py-16 text-center">
            <Wrench className="mx-auto mb-3 h-12 w-12 text-gray-200" />
            <p className="text-gray-500">Belum ada data servis</p>
            <Link href="/admin/services/new" className="mt-3 inline-block text-sm text-red-600 hover:underline">
              Buat servis pertama
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  {["Kendaraan", "Deskripsi", "KM", "Teknisi", "Tanggal", "Total", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{s.vehicle.brand} {s.vehicle.model}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.vehicle.licensePlate}</p>
                    </td>
                    <td className="max-w-[200px] px-4 py-3">
                      <p className="truncate text-gray-700">{s.description}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.mileage.toLocaleString("id-ID")} km
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.mechanic?.name ?? <span className="text-gray-400">–</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(s.date)}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(s.totalCost)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant[s.status] ?? "default"}>
                        {statusLabel[s.status] ?? s.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
