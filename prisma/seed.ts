import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set")
}
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@autoflow.id" },
    update: {},
    create: {
      name: "Admin AutoFlow",
      email: "admin@autoflow.id",
      password: adminPassword,
      role: "ADMIN",
      phone: "+62811000001",
    },
  })

  // Create mechanic
  const mechPassword = await bcrypt.hash("mekanik123", 12)
  const mechanic = await prisma.user.upsert({
    where: { email: "mekanik@autoflow.id" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "mekanik@autoflow.id",
      password: mechPassword,
      role: "MECHANIC",
      phone: "+62811000002",
    },
  })

  // Create customer
  const custPassword = await bcrypt.hash("customer123", 12)
  const customer = await prisma.user.upsert({
    where: { email: "customer@autoflow.id" },
    update: {},
    create: {
      name: "Andi Wijaya",
      email: "customer@autoflow.id",
      password: custPassword,
      role: "CUSTOMER",
      phone: "+62812345678",
      address: "Jl. Sudirman No. 45, Jakarta",
    },
  })

  // Create vehicles
  const vehicle1 = await prisma.vehicle.upsert({
    where: { licensePlate: "B 1234 AAA" },
    update: {},
    create: {
      licensePlate: "B 1234 AAA",
      brand: "Toyota",
      model: "Avanza",
      year: 2020,
      color: "Putih",
      userId: customer.id,
    },
  })

  const vehicle2 = await prisma.vehicle.upsert({
    where: { licensePlate: "B 5678 BBB" },
    update: {},
    create: {
      licensePlate: "B 5678 BBB",
      brand: "Honda",
      model: "Jazz",
      year: 2019,
      color: "Merah",
      userId: customer.id,
    },
  })

  // Create inventory
  const inventoryItems = [
    { itemCode: "OIL-001", name: "Oli Mesin 5W-30 Castrol", category: "Oli & Fluida", stockQuantity: 45, minimumThreshold: 10, price: 85000, unit: "liter" },
    { itemCode: "OIL-002", name: "Oli Transmisi ATF", category: "Oli & Fluida", stockQuantity: 2, minimumThreshold: 5, price: 120000, unit: "liter" },
    { itemCode: "OIL-003", name: "Oli Gardan", category: "Oli & Fluida", stockQuantity: 18, minimumThreshold: 5, price: 95000, unit: "liter" },
    { itemCode: "FLT-001", name: "Filter Udara Honda Jazz", category: "Filter", stockQuantity: 3, minimumThreshold: 5, price: 125000, unit: "pcs" },
    { itemCode: "FLT-002", name: "Filter Oli Universal", category: "Filter", stockQuantity: 22, minimumThreshold: 6, price: 45000, unit: "pcs" },
    { itemCode: "FLT-003", name: "Filter Bahan Bakar", category: "Filter", stockQuantity: 10, minimumThreshold: 4, price: 85000, unit: "pcs" },
    { itemCode: "BRK-001", name: "Kampas Rem Depan Toyota", category: "Rem", stockQuantity: 12, minimumThreshold: 4, price: 350000, unit: "set" },
    { itemCode: "BRK-002", name: "Kampas Rem Belakang Honda", category: "Rem", stockQuantity: 8, minimumThreshold: 4, price: 285000, unit: "set" },
    { itemCode: "BRK-003", name: "Minyak Rem DOT 4", category: "Rem", stockQuantity: 4, minimumThreshold: 5, price: 45000, unit: "botol" },
    { itemCode: "SPK-001", name: "Busi Iridium NGK", category: "Kelistrikan", stockQuantity: 8, minimumThreshold: 8, price: 65000, unit: "pcs" },
    { itemCode: "SPK-002", name: "Aki Kering GS Astra", category: "Kelistrikan", stockQuantity: 6, minimumThreshold: 2, price: 950000, unit: "pcs" },
    { itemCode: "SUS-001", name: "Shock Absorber Depan Toyota", category: "Suspensi", stockQuantity: 4, minimumThreshold: 2, price: 750000, unit: "pcs" },
    { itemCode: "SUS-002", name: "Ball Joint Set", category: "Suspensi", stockQuantity: 3, minimumThreshold: 2, price: 450000, unit: "set" },
    { itemCode: "BLT-001", name: "Belt Alternator", category: "Lainnya", stockQuantity: 15, minimumThreshold: 3, price: 125000, unit: "pcs" },
    { itemCode: "BLT-002", name: "Timing Belt Kit", category: "Lainnya", stockQuantity: 5, minimumThreshold: 2, price: 850000, unit: "set" },
  ]

  for (const item of inventoryItems) {
    await prisma.inventory.upsert({
      where: { itemCode: item.itemCode },
      update: {},
      create: item,
    })
  }

  // Create promos
  await prisma.promo.createMany({
    data: [
      {
        title: "Paket Servis Lebaran",
        description: "Servis lengkap + ganti oli + cek AC gratis untuk persiapan mudik lebaran. Dapatkan penghematan hingga 20% untuk paket komplet ini.",
        discount: 20,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        title: "Tune Up Spesial",
        description: "Tune up mesin lengkap termasuk busi, filter udara, dan pembersihan injector. Mesin jadi lebih bertenaga dan irit bahan bakar.",
        discount: 15,
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        title: "Member Baru",
        description: "Diskon spesial untuk pelanggan baru. Gratis pemeriksaan pertama dan diskon 30% untuk servis pertama Anda!",
        discount: 30,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        title: "Ganti Ban Hemat",
        description: "Beli 3 ban gratis 1, termasuk balancing dan nitrogen. Berlaku untuk semua merek ban premium.",
        discount: 25,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })

  // Create sample service records
  const allInventory = await prisma.inventory.findMany()
  const oliItem = allInventory.find((i) => i.itemCode === "OIL-001")
  const filterItem = allInventory.find((i) => i.itemCode === "FLT-002")

  const serviceRecord1 = await prisma.serviceRecord.create({
    data: {
      vehicleId: vehicle1.id,
      mechanicId: mechanic.id,
      mileage: 45000,
      description: "Servis berkala 45.000 KM - Ganti oli, filter oli, periksa rem",
      notes: "Kondisi rem depan mulai tipis, disarankan ganti dalam 5000 KM lagi",
      totalCost: 285000,
      status: "COMPLETED",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  })

  if (oliItem && filterItem) {
    await prisma.serviceItem.createMany({
      data: [
        {
          serviceRecordId: serviceRecord1.id,
          inventoryId: oliItem.id,
          quantity: 4,
          unitPrice: oliItem.price,
          subtotal: 4 * oliItem.price,
        },
        {
          serviceRecordId: serviceRecord1.id,
          inventoryId: filterItem.id,
          quantity: 1,
          unitPrice: filterItem.price,
          subtotal: filterItem.price,
        },
      ],
    })
  }

  await prisma.serviceRecord.create({
    data: {
      vehicleId: vehicle2.id,
      mechanicId: mechanic.id,
      mileage: 32000,
      description: "Tune up + ganti busi + bersih throttle body",
      notes: "Busi sudah aus, diganti iridium. Throttle body kotor, sudah dibersihkan",
      totalCost: 450000,
      status: "COMPLETED",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.serviceRecord.create({
    data: {
      vehicleId: vehicle1.id,
      mechanicId: mechanic.id,
      mileage: 47500,
      description: "Perbaikan AC - gas habis, penggantian filter kabin",
      notes: "Freon habis, isi ulang + cek kondensor",
      totalCost: 850000,
      status: "IN_PROGRESS",
      date: new Date(),
    },
  })

  console.log("✅ Seed completed successfully!")
  console.log(`
  Demo accounts:
  - Admin: admin@autoflow.id / admin123
  - Mekanik: mekanik@autoflow.id / mekanik123  
  - Customer: customer@autoflow.id / customer123
  `)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
