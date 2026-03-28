import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get("page") ?? 1))
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)))
    const skip = (page - 1) * limit

    const [records, total] = await Promise.all([
      prisma.serviceRecord.findMany({
        skip,
        take: limit,
        include: {
          vehicle: { select: { brand: true, model: true, licensePlate: true } },
          mechanic: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.serviceRecord.count(),
    ])

    return NextResponse.json({ records, total, page, limit })
  } catch {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user?.role !== "ADMIN" && session.user?.role !== "MECHANIC")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { parts, totalCost, vehicleId, mechanicId, mileage, description, notes, status } = await req.json()

    const record = await prisma.$transaction(async (tx) => {
      const serviceRecord = await tx.serviceRecord.create({
        data: {
          vehicleId,
          mechanicId: mechanicId || null,
          mileage: Number(mileage),
          description,
          notes,
          status,
          totalCost: Number(totalCost),
        },
      })

      for (const part of (parts ?? [])) {
        await tx.serviceItem.create({
          data: {
            serviceRecordId: serviceRecord.id,
            inventoryId: part.inventoryId,
            quantity: part.quantity,
            unitPrice: part.unitPrice,
            subtotal: part.subtotal,
          },
        })
        await tx.inventory.update({
          where: { id: part.inventoryId },
          data: { stockQuantity: { decrement: part.quantity } },
        })
      }

      return serviceRecord
    })

    return NextResponse.json(record, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
