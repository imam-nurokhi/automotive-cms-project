import { Hero } from "@/components/marketing/Hero"
import { PromoCard } from "@/components/marketing/PromoCard"
import { Wrench, Shield, Clock, Star, Users, TrendingUp } from "lucide-react"

interface Promo {
  id: string
  title: string
  image?: string | null
  description: string
  discount?: number | null
  validUntil: Date | string
  isActive: boolean
}

import { headers } from "next/headers"

async function getPromos() {
  try {
    const headersList = await headers()
    const host = headersList.get("host") ?? "localhost:3000"
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const baseUrl = `${protocol}://${host}`
    const res = await fetch(`${baseUrl}/api/promos`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

const services = [
  { icon: Wrench, title: "Servis Berkala", desc: "Perawatan rutin kendaraan Anda sesuai jadwal pabrikan" },
  { icon: Shield, title: "Garansi Pekerjaan", desc: "Garansi 30 hari untuk setiap pekerjaan servis" },
  { icon: Clock, title: "Express Service", desc: "Layanan cepat untuk servis ringan dalam 2 jam" },
  { icon: Star, title: "Teknisi Bersertifikat", desc: "Ditangani oleh teknisi berpengalaman bersertifikat" },
  { icon: Users, title: "Multi Merek", desc: "Menangani semua merek kendaraan roda empat" },
  { icon: TrendingUp, title: "Laporan Digital", desc: "Pantau riwayat servis kapan saja melalui dashboard" },
]

const stats = [
  { value: "5.000+", label: "Pelanggan Setia" },
  { value: "98%", label: "Kepuasan Pelanggan" },
  { value: "15+", label: "Teknisi Berpengalaman" },
  { value: "10 Tahun", label: "Pengalaman Bengkel" },
]

export default async function LandingPage() {
  const promos = await getPromos()

  return (
    <>
      <Hero />

      {/* Stats section */}
      <section className="border-b border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-red-600">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services section */}
      <section id="services" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
              Layanan <span className="text-red-600">Unggulan</span>
            </h2>
            <p className="mt-3 text-gray-500">
              Solusi perawatan kendaraan Anda dengan teknologi terkini
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-red-200 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                  <service.icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900">{service.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promos section */}
      {promos.length > 0 && (
        <section id="promos" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
                Promo <span className="text-red-600">Spesial</span>
              </h2>
              <p className="mt-3 text-gray-500">Penawaran terbaik untuk perawatan kendaraan Anda</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {promos.map((promo: Promo, i: number) => (
                <PromoCard key={promo.id} promo={promo} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About section */}
      <section id="about" className="bg-gray-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-black sm:text-4xl">
                Mengapa Memilih{" "}
                <span className="text-red-500">AutoFlow?</span>
              </h2>
              <p className="mt-4 text-gray-400 leading-relaxed">
                AutoFlow adalah platform manajemen bengkel premium yang mengintegrasikan
                teknologi modern dengan layanan otomotif berkualitas tinggi. Kami hadir
                untuk memberikan pengalaman perawatan kendaraan yang transparan dan terpercaya.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Pantau status servis secara real-time",
                  "Riwayat servis digital yang lengkap",
                  "Notifikasi servis berkala otomatis",
                  "Harga transparan tanpa biaya tersembunyi",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🔧", title: "Diagnosa Digital", desc: "Sistem diagnosa OBD terkini" },
                { icon: "📱", title: "Aplikasi Mobile", desc: "Pantau dari smartphone Anda" },
                { icon: "🛡️", title: "Suku Cadang Asli", desc: "Garansi keaslian spare part" },
                { icon: "⚡", title: "Fast Track", desc: "Antrean prioritas member" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h4 className="mt-3 font-bold">{item.title}</h4>
                  <p className="mt-1 text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
