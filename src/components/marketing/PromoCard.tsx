"use client"

import { motion } from "framer-motion"
import { Calendar, Tag } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/Badge"

interface Promo {
  id: string
  title: string
  image?: string | null
  description: string
  discount?: number | null
  validUntil: Date | string
  isActive: boolean
}

interface PromoCardProps {
  promo: Promo
  index: number
}

export function PromoCard({ promo, index }: PromoCardProps) {
  const colors = [
    "from-red-500 to-rose-600",
    "from-orange-500 to-amber-600",
    "from-blue-500 to-cyan-600",
    "from-purple-500 to-violet-600",
  ]
  const gradient = colors[index % colors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Card header gradient */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient} p-6`}>
        {promo.discount && (
          <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <span className="text-center text-xs font-black leading-tight text-white">
              {promo.discount}%
              <br />
              OFF
            </span>
          </div>
        )}
        <Tag className="h-8 w-8 text-white/60" />
        <Badge
          variant="default"
          className="mt-2 bg-white/20 text-white border-0"
        >
          {promo.isActive ? "Aktif" : "Tidak Aktif"}
        </Badge>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 line-clamp-1">{promo.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{promo.description}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <Calendar size={12} />
          <span>Berlaku hingga {formatDate(promo.validUntil)}</span>
        </div>
      </div>
    </motion.div>
  )
}
