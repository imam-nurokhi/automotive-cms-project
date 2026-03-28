import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { vehicles: true },
      })
      return NextResponse.json(user?.vehicles ?? [])
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: session.user.id },
    })
    return NextResponse.json(vehicles)
  } catch {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const vehicle = await prisma.vehicle.create({
      data: { ...body, userId: session.user.id },
    })
    return NextResponse.json(vehicle, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 })
  }
}
