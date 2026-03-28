import { prisma } from "@/lib/prisma"
import { NewServiceForm } from "@/components/admin/NewServiceForm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

async function getFormData() {
  try {
    const [inventory, mechanics] = await Promise.all([
      prisma.inventory.findMany({
        where: { stockQuantity: { gt: 0 } },
        orderBy: { name: "asc" },
      }),
      prisma.user.findMany({
        where: { role: { in: ["MECHANIC", "ADMIN"] } },
        select: { id: true, name: true },
      }),
    ])
    return { inventory, mechanics }
  } catch {
    return { inventory: [], mechanics: [] }
  }
}

export default async function NewServicePage() {
  const { inventory, mechanics } = await getFormData()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/services"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft size={16} />
          Kembali
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-gray-900">Buat Servis Baru</h1>
        <p className="mt-1 text-sm text-gray-500">
          Isi detail servis kendaraan pelanggan
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <NewServiceForm inventoryItems={inventory} mechanics={mechanics} />
      </div>
    </div>
  )
}
