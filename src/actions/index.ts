"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createVehicle(data: {
  licensePlate: string
  brand: string
  model: string
  year: number
  color?: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const vehicle = await prisma.vehicle.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
  return vehicle
}

export async function createBooking(data: {
  vehicleId: string
  date: Date
  timeSlot: string
  serviceType: string
  notes?: string
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const booking = await prisma.booking.create({
    data: {
      ...data,
      status: "PENDING",
    },
  })

  revalidatePath("/booking")
  return booking
}

export async function createServiceRecord(data: {
  vehicleId: string
  mechanicId?: string
  mileage: number
  description: string
  notes?: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  parts: Array<{
    inventoryId: string
    quantity: number
    unitPrice: number
    subtotal: number
  }>
  totalCost: number
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const { parts, ...serviceData } = data

  const record = await prisma.$transaction(async (tx) => {
    // Create service record
    const serviceRecord = await tx.serviceRecord.create({
      data: {
        vehicleId: serviceData.vehicleId,
        mechanicId: serviceData.mechanicId || null,
        mileage: serviceData.mileage,
        description: serviceData.description,
        notes: serviceData.notes,
        status: serviceData.status,
        totalCost: serviceData.totalCost,
      },
    })

    // Create service items and decrement inventory
    for (const part of parts) {
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
        data: {
          stockQuantity: { decrement: part.quantity },
        },
      })
    }

    return serviceRecord
  })

  revalidatePath("/admin/services")
  revalidatePath("/admin/inventory")
  return record
}

export async function registerUser(data: {
  name: string
  email: string
  password: string
  phone?: string
}) {
  const bcrypt = await import("bcryptjs")
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new Error("Email sudah terdaftar")

  const hashedPassword = await bcrypt.hash(data.password, 12)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: "CUSTOMER",
    },
  })

  return { id: user.id, email: user.email, name: user.name }
}
