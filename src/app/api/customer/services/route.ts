import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: session.user.id },
      select: { id: true },
    })

    const vehicleIds = vehicles.map((v) => v.id)

    const records = await prisma.serviceRecord.findMany({
      where: { vehicleId: { in: vehicleIds } },
      include: {
        vehicle: { select: { brand: true, model: true, licensePlate: true } },
      },
      orderBy: { date: "desc" },
      take: 20,
    })

    return NextResponse.json(records)
  } catch {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
