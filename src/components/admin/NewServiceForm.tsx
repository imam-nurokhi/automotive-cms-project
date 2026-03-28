"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { User, Car, Wrench, Package, CheckCircle2, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { formatCurrency } from "@/lib/utils"

const step1Schema = z.object({
  customerEmail: z.string().email("Email tidak valid"),
  vehicleId: z.string().min(1, "Pilih kendaraan"),
})

const step2Schema = z.object({
  mileage: z.number().min(0, "KM harus positif"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  notes: z.string().optional(),
  mechanicId: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>

interface InventoryItem {
  id: string
  itemCode: string
  name: string
  price: number
  stockQuantity: number
  unit: string
}

interface ServicePart {
  inventoryId: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
}

interface NewServiceFormProps {
  inventoryItems: InventoryItem[]
  mechanics: Array<{ id: string; name: string | null }>
}

const STEPS = [
  { label: "Pelanggan", icon: User },
  { label: "Detail Servis", icon: Wrench },
  { label: "Spare Part", icon: Package },
  { label: "Konfirmasi", icon: CheckCircle2 },
]

export function NewServiceForm({ inventoryItems, mechanics }: NewServiceFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null)
  const [parts, setParts] = useState<ServicePart[]>([])
  const [selectedPartId, setSelectedPartId] = useState("")
  const [partQty, setPartQty] = useState(1)
  const [vehicles, setVehicles] = useState<Array<{ id: string; brand: string; model: string; licensePlate: string }>>([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { status: "PENDING" },
  })

  const lookupVehicles = async (email: string) => {
    if (!email) return
    setLoadingVehicles(true)
    try {
      const res = await fetch(`/api/customer/vehicles?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        setVehicles(data)
      }
    } finally {
      setLoadingVehicles(false)
    }
  }

  const addPart = () => {
    const item = inventoryItems.find((i) => i.id === selectedPartId)
    if (!item || partQty <= 0) return
    const existing = parts.findIndex((p) => p.inventoryId === selectedPartId)
    if (existing >= 0) {
      setParts((prev) =>
        prev.map((p, i) =>
          i === existing
            ? { ...p, quantity: p.quantity + partQty, subtotal: (p.quantity + partQty) * p.unitPrice }
            : p
        )
      )
    } else {
      setParts((prev) => [
        ...prev,
        {
          inventoryId: item.id,
          name: item.name,
          quantity: partQty,
          unitPrice: item.price,
          subtotal: partQty * item.price,
        },
      ])
    }
    setSelectedPartId("")
    setPartQty(1)
  }

  const removePart = (inventoryId: string) => {
    setParts((prev) => prev.filter((p) => p.inventoryId !== inventoryId))
  }

  const totalCost = parts.reduce((sum, p) => sum + p.subtotal, 0)

  const handleSubmit = async () => {
    if (!step1Data || !step2Data) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...step2Data,
          vehicleId: step1Data.vehicleId,
          parts,
          totalCost,
        }),
      })
      if (res.ok) {
        router.push("/admin/services")
        router.refresh()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                  i < step
                    ? "border-red-600 bg-red-600 text-white"
                    : i === step
                    ? "border-red-600 bg-white text-red-600"
                    : "border-gray-200 bg-white text-gray-400"
                }`}
              >
                <s.icon size={18} />
              </div>
              <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-red-600" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 transition-all ${i < step ? "bg-red-600" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Customer & Vehicle */}
      {step === 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="font-bold text-gray-900">Pilih Pelanggan & Kendaraan</h2>
          <form
            onSubmit={form1.handleSubmit((data) => {
              setStep1Data(data)
              setStep(1)
            })}
            className="space-y-4"
          >
            <div>
              <Input
                label="Email Pelanggan"
                type="email"
                placeholder="customer@email.com"
                {...form1.register("customerEmail")}
                error={form1.formState.errors.customerEmail?.message}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2"
                loading={loadingVehicles}
                onClick={() => lookupVehicles(form1.getValues("customerEmail"))}
              >
                Cari Kendaraan
              </Button>
            </div>

            {vehicles.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Pilih Kendaraan</label>
                <div className="space-y-2">
                  {vehicles.map((v) => (
                    <label key={v.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 hover:border-red-300 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                      <input
                        type="radio"
                        value={v.id}
                        {...form1.register("vehicleId")}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {v.brand} {v.model}
                        </p>
                        <p className="text-xs text-gray-500">{v.licensePlate}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {form1.formState.errors.vehicleId && (
                  <p className="mt-1 text-xs text-red-500">{form1.formState.errors.vehicleId.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit">
                Lanjut
                <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Step 2: Service Details */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="font-bold text-gray-900">Detail Servis</h2>
          <form
            onSubmit={form2.handleSubmit((data) => {
              setStep2Data(data)
              setStep(2)
            })}
            className="space-y-4"
          >
            <Input
              label="Kilometer Kendaraan"
              type="number"
              {...form2.register("mileage", { valueAsNumber: true })}
              error={form2.formState.errors.mileage?.message}
              placeholder="50000"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Deskripsi Pekerjaan</label>
              <textarea
                {...form2.register("description")}
                rows={3}
                placeholder="Jelaskan pekerjaan yang dilakukan..."
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
              {form2.formState.errors.description && (
                <p className="mt-1 text-xs text-red-500">{form2.formState.errors.description.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Catatan Teknisi</label>
              <textarea
                {...form2.register("notes")}
                rows={2}
                placeholder="Catatan tambahan..."
                className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Teknisi</label>
                <select
                  {...form2.register("mechanicId")}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">Belum ditugaskan</option>
                  {mechanics.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                <select
                  {...form2.register("status")}
                  className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="PENDING">Menunggu</option>
                  <option value="IN_PROGRESS">Dalam Proses</option>
                  <option value="COMPLETED">Selesai</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="ghost" onClick={() => setStep(0)}>Kembali</Button>
              <Button type="submit">
                Lanjut
                <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Step 3: Parts */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="font-bold text-gray-900">Tambah Spare Part</h2>

          {/* Part selector */}
          <div className="flex gap-2">
            <select
              value={selectedPartId}
              onChange={(e) => setSelectedPartId(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="">Pilih item...</option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id} disabled={item.stockQuantity === 0}>
                  [{item.itemCode}] {item.name} – {formatCurrency(item.price)} (Stok: {item.stockQuantity})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={partQty}
              onChange={(e) => setPartQty(Number(e.target.value))}
              min={1}
              className="w-20 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-red-500 focus:outline-none"
            />
            <Button type="button" onClick={addPart} disabled={!selectedPartId}>
              <Plus size={16} />
            </Button>
          </div>

          {/* Parts list */}
          {parts.length > 0 ? (
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Item</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Harga Satuan</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Subtotal</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {parts.map((p) => (
                    <tr key={p.inventoryId}>
                      <td className="px-4 py-2 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{p.quantity}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{formatCurrency(p.unitPrice)}</td>
                      <td className="px-4 py-2 text-right font-semibold">{formatCurrency(p.subtotal)}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => removePart(p.inventoryId)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan={3} className="px-4 py-2 text-right text-gray-700">Total:</td>
                    <td className="px-4 py-2 text-right text-red-600">{formatCurrency(totalCost)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
              Belum ada spare part ditambahkan
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>Kembali</Button>
            <Button type="button" onClick={() => setStep(3)}>
              Lanjut
              <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Confirmation */}
      {step === 3 && step1Data && step2Data && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="font-bold text-gray-900">Konfirmasi</h2>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email Pelanggan</span>
              <span className="font-medium">{step1Data.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">KM Kendaraan</span>
              <span className="font-medium">{step2Data.mileage.toLocaleString("id-ID")} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pekerjaan</span>
              <span className="font-medium text-right max-w-xs">{step2Data.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Spare Parts</span>
              <span className="font-medium">{parts.length} item</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold">
              <span>Total Biaya</span>
              <span className="text-red-600">{formatCurrency(totalCost)}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={() => setStep(2)}>Kembali</Button>
            <Button onClick={handleSubmit} loading={submitting}>
              <CheckCircle2 size={16} className="mr-2" />
              Buat Servis
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
