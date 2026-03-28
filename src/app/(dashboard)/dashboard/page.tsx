import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { VehicleCard, AddVehicleCard } from "@/components/dashboard/VehicleCard"
import { ServiceTimeline } from "@/components/dashboard/ServiceTimeline"
import { AddVehicleButton } from "./AddVehicleButton"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

async function getDashboardData(userId: string) {
  try {
    const [vehicles, serviceRecords] = await Promise.all([
      prisma.vehicle.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.serviceRecord.findMany({
        where: { vehicle: { userId } },
        include: {
          vehicle: { select: { brand: true, model: true, licensePlate: true } },
        },
        orderBy: { date: "desc" },
        take: 10,
      }),
    ])
    return { vehicles, serviceRecords }
  } catch {
    return { vehicles: [], serviceRecords: [] }
  }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { vehicles, serviceRecords } = await getDashboardData(session.user.id)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Halo, {session.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Selamat datang di dashboard kendaraan Anda
          </p>
        </div>
        <Link
          href="/booking"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          <Calendar size={16} />
          Booking Servis
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Vehicles */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Kendaraan Saya</h2>
          <span className="text-sm text-gray-500">{vehicles.length} kendaraan</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle, i) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
          <AddVehicleButton />
        </div>
      </div>

      {/* Service History */}
      <div>
        <div className="mb-4">
          <h2 className="font-bold text-gray-900">Riwayat Servis</h2>
          <p className="text-sm text-gray-500">10 servis terbaru</p>
        </div>
        <ServiceTimeline
          records={serviceRecords.map((r) => ({
            ...r,
            status: r.status as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
          }))}
        />
      </div>
    </div>
  )
}
