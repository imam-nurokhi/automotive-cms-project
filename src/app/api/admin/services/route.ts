import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const records = await prisma.serviceRecord.findMany({
      include: {
        vehicle: { select: { brand: true, model: true, licensePlate: true } },
        mechanic: { select: { name: true } },
        serviceItems: { include: { inventory: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(records)
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
