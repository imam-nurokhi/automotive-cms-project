import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const promos = await prisma.promo.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(promos)
  } catch {
    // Return mock data if DB unavailable
    const mockPromos = [
      {
        id: "1",
        title: "Paket Servis Lebaran",
        description: "Servis lengkap + ganti oli + cek AC gratis untuk persiapan mudik lebaran",
        discount: 20,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      },
      {
        id: "2",
        title: "Tune Up Spesial",
        description: "Tune up mesin lengkap termasuk busi, filter udara, dan pembersihan injector",
        discount: 15,
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      },
      {
        id: "3",
        title: "Member Baru",
        description: "Diskon spesial untuk pelanggan baru. Gratis pemeriksaan pertama!",
        discount: 30,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      },
      {
        id: "4",
        title: "Ganti Ban Hemat",
        description: "Beli 3 ban gratis 1, termasuk balancing dan nitrogen",
        discount: 25,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
      },
    ]
    return NextResponse.json(mockPromos)
  }
}
