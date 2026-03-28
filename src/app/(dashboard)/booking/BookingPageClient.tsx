"use client"

import { useState } from "react"
import { BookingCalendar } from "@/components/dashboard/BookingCalendar"
import { Modal } from "@/components/ui/Modal"
import { createBooking } from "@/actions"
import { useRouter } from "next/navigation"
import { CheckCircle2, Car } from "lucide-react"

interface BookingPageClientProps {
  vehicles: Array<{ id: string; brand: string; model: string; licensePlate: string }>
}

export default function BookingPageClient({ vehicles }: BookingPageClientProps) {
  const router = useRouter()
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id ?? "")
  const [successModal, setSuccessModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async (data: { date: Date; timeSlot: string; serviceType: string }) => {
    if (!selectedVehicleId) return
    setLoading(true)
    try {
      await createBooking({
        vehicleId: selectedVehicleId,
        date: data.date,
        timeSlot: data.timeSlot,
        serviceType: data.serviceType,
      })
      setSuccessModal(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Booking Servis</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pilih kendaraan, tanggal, dan jenis servis yang Anda inginkan
        </p>
      </div>

      {vehicles.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Car className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="font-medium text-gray-500">Belum ada kendaraan terdaftar</p>
          <p className="mt-1 text-sm text-gray-400">Tambah kendaraan terlebih dahulu di halaman Dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Vehicle selector */}
          <div className="lg:col-span-1">
            <h2 className="mb-3 font-bold text-gray-900">Pilih Kendaraan</h2>
            <div className="space-y-2">
              {vehicles.map((v) => (
                <label
                  key={v.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    selectedVehicleId === v.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicle"
                    value={v.id}
                    checked={selectedVehicleId === v.id}
                    onChange={() => setSelectedVehicleId(v.id)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{v.brand} {v.model}</p>
                    <p className="text-xs text-gray-500">{v.licensePlate}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="lg:col-span-2">
            <BookingCalendar onConfirm={handleConfirm} />
          </div>
        </div>
      )}

      {/* Success modal */}
      <Modal open={successModal} onClose={() => { setSuccessModal(false); router.push("/dashboard") }} size="sm">
        <div className="text-center">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="text-xl font-bold text-gray-900">Booking Berhasil!</h2>
          <p className="mt-2 text-gray-500">
            Booking servis Anda telah dikonfirmasi. Tim kami akan menghubungi Anda segera.
          </p>
          <button
            onClick={() => { setSuccessModal(false); router.push("/dashboard") }}
            className="mt-6 w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </Modal>
    </div>
  )
}
