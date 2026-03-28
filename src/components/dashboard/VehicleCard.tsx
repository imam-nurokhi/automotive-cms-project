"use client"

import { motion } from "framer-motion"
import { Car, Calendar, Gauge, Edit, Trash2, Plus } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

interface Vehicle {
  id: string
  licensePlate: string
  brand: string
  model: string
  year: number
  color?: string | null
}

interface VehicleCardProps {
  vehicle: Vehicle
  index: number
  onEdit?: (vehicle: Vehicle) => void
  onDelete?: (id: string) => void
}

export function VehicleCard({ vehicle, index, onEdit, onDelete }: VehicleCardProps) {
  const brandColors: Record<string, string> = {
    Toyota: "from-red-500 to-red-700",
    Honda: "from-blue-500 to-blue-700",
    Suzuki: "from-blue-400 to-indigo-600",
    Mitsubishi: "from-red-400 to-orange-600",
    Daihatsu: "from-green-500 to-teal-600",
    Nissan: "from-gray-600 to-gray-800",
  }
  const gradient = brandColors[vehicle.brand] ?? "from-gray-500 to-gray-700"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Top gradient strip */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}>
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-500">{vehicle.year}</p>
            </div>
          </div>
          <Badge variant="default" className="font-mono text-xs">
            {vehicle.licensePlate}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600">Tahun {vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <Gauge size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600">{vehicle.color ?? "N/A"}</span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="mt-4 flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(vehicle)}
              >
                <Edit size={14} className="mr-1.5" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(vehicle.id)}
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface AddVehicleCardProps {
  onClick: () => void
}

export function AddVehicleCard({ onClick }: AddVehicleCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="flex min-h-[168px] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition hover:border-red-400 hover:bg-red-50 hover:text-red-500"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-current">
        <Plus size={24} />
      </div>
      <span className="text-sm font-medium">Tambah Kendaraan</span>
    </motion.button>
  )
}
