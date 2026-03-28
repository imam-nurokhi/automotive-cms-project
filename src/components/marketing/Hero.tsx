"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ArrowRight, Shield, Clock, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("")

  const features = [
    { icon: Shield, label: "Garansi 30 Hari" },
    { icon: Clock, label: "Servis Express" },
    { icon: Star, label: "Teknisi Bersertifikat" },
    { icon: Zap, label: "Suku Cadang Asli" },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-red-800/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-600/10 px-4 py-1.5 text-sm text-red-400"
          >
            <Zap size={14} className="fill-current" />
            <span>Bengkel Premium #1 Indonesia</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            Rawat Kendaraan Anda
            <span className="mt-2 block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Dengan Teknologi Terkini
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-400"
          >
            Platform manajemen bengkel premium yang menghubungkan Anda dengan
            teknisi terbaik. Pantau status servis secara real-time, mudah dan transparan.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-sm">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cek status servis kendaraan Anda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
              <Button size="sm" className="rounded-xl">
                <Search size={16} className="mr-2" />
                Cek Status
              </Button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" className="rounded-xl">
                Mulai Sekarang
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="#services">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                Lihat Layanan
              </Button>
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-4"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
              >
                <feature.icon size={14} className="text-red-400" />
                {feature.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60L1440 60L1440 0C1200 40 960 60 720 40C480 20 240 0 0 30L0 60Z"
            fill="#f9fafb"
          />
        </svg>
      </div>
    </section>
  )
}
