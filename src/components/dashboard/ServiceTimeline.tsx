"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Clock, AlertCircle, XCircle, Wrench } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"

type ServiceStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

interface ServiceRecord {
  id: string
  date: Date | string
  description: string
  totalCost: number
  status: ServiceStatus
  mileage: number
  vehicle?: {
    brand: string
    model: string
    licensePlate: string
  }
}

interface ServiceTimelineProps {
  records: ServiceRecord[]
}

const statusConfig: Record<
  ServiceStatus,
  { icon: React.ComponentType<{ size?: number; className?: string }>; variant: "success" | "info" | "warning" | "danger" | "pending"; label: string; color: string }
> = {
  COMPLETED: {
    icon: CheckCircle2,
    variant: "success",
    label: "Selesai",
    color: "text-green-500",
  },
  IN_PROGRESS: {
    icon: Wrench,
    variant: "info",
    label: "Dalam Proses",
    color: "text-blue-500",
  },
  PENDING: {
    icon: Clock,
    variant: "pending",
    label: "Menunggu",
    color: "text-orange-500",
  },
  CANCELLED: {
    icon: XCircle,
    variant: "danger",
    label: "Dibatalkan",
    color: "text-red-500",
  },
}

export function ServiceTimeline({ records }: ServiceTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center">
        <AlertCircle className="mb-3 h-10 w-10 text-gray-300" />
        <p className="font-medium text-gray-500">Belum ada riwayat servis</p>
        <p className="mt-1 text-sm text-gray-400">
          Riwayat servis kendaraan Anda akan muncul di sini
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {records.map((record, index) => {
        const config = statusConfig[record.status]
        const Icon = config.icon

        return (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4 pb-6"
          >
            {/* Timeline line */}
            {index < records.length - 1 && (
              <div className="absolute left-[19px] top-10 h-full w-0.5 bg-gray-100" />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-100 bg-white ${config.color}`}
            >
              <Icon size={18} />
            </div>

            {/* Content */}
            <div className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {record.description}
                  </p>
                  {record.vehicle && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {record.vehicle.brand} {record.vehicle.model} • {record.vehicle.licensePlate}
                    </p>
                  )}
                </div>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                <span>{formatDate(record.date)}</span>
                <span>KM {record.mileage.toLocaleString("id-ID")}</span>
                <span className="font-medium text-gray-700">
                  {formatCurrency(record.totalCost)}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
