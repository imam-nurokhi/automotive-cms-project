import { prisma } from "@/lib/prisma"
import { InventoryTable } from "@/components/admin/InventoryTable"

async function getInventory() {
  try {
    return await prisma.inventory.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch {
    // Return mock data if DB unavailable
    return [
      { id: "1", itemCode: "OIL-001", name: "Oli Mesin 5W-30", category: "Oli & Fluida", stockQuantity: 45, minimumThreshold: 10, price: 85000, unit: "liter", createdAt: new Date(), updatedAt: new Date() },
      { id: "2", itemCode: "FLT-001", name: "Filter Udara", category: "Filter", stockQuantity: 3, minimumThreshold: 5, price: 125000, unit: "pcs", createdAt: new Date(), updatedAt: new Date() },
      { id: "3", itemCode: "BRK-001", name: "Kampas Rem Depan", category: "Rem", stockQuantity: 12, minimumThreshold: 4, price: 350000, unit: "set", createdAt: new Date(), updatedAt: new Date() },
      { id: "4", itemCode: "SPK-001", name: "Busi Iridium", category: "Kelistrikan", stockQuantity: 8, minimumThreshold: 8, price: 65000, unit: "pcs", createdAt: new Date(), updatedAt: new Date() },
      { id: "5", itemCode: "FLT-002", name: "Filter Oli", category: "Filter", stockQuantity: 20, minimumThreshold: 6, price: 45000, unit: "pcs", createdAt: new Date(), updatedAt: new Date() },
      { id: "6", itemCode: "OIL-002", name: "Oli Transmisi ATF", category: "Oli & Fluida", stockQuantity: 2, minimumThreshold: 5, price: 120000, unit: "liter", createdAt: new Date(), updatedAt: new Date() },
    ]
  }
}

export default async function InventoryPage() {
  const inventory = await getInventory()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Manajemen Inventori</h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola stok spare part dan suku cadang bengkel
        </p>
      </div>

      <InventoryTable initialData={inventory} />
    </div>
  )
}
