import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BookingPageClient from "./BookingPageClient"

async function getVehicles(userId: string) {
  try {
    return await prisma.vehicle.findMany({
      where: { userId },
      select: { id: true, brand: true, model: true, licensePlate: true },
    })
  } catch {
    return []
  }
}

export default async function BookingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const vehicles = await getVehicles(session.user.id)

  return <BookingPageClient vehicles={vehicles} />
}
