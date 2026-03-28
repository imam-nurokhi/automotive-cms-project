"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { AddVehicleCard } from "@/components/dashboard/VehicleCard"
import { createVehicle } from "@/actions"
import { useRouter } from "next/navigation"

export function AddVehicleButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    licensePlate: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createVehicle({
        ...form,
        year: Number(form.year),
        color: form.color || undefined,
      })
      setOpen(false)
      setForm({ licensePlate: "", brand: "", model: "", year: new Date().getFullYear(), color: "" })
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AddVehicleCard onClick={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Kendaraan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nomor Polisi"
            value={form.licensePlate}
            onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
            placeholder="B 1234 ABC"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Merek"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="Toyota"
              required
            />
            <Input
              label="Model"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              placeholder="Avanza"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tahun"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              min={1990}
              max={new Date().getFullYear() + 1}
              required
            />
            <Input
              label="Warna"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              placeholder="Putih"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              Tambah
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
