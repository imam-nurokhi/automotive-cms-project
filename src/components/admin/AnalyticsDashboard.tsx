"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { TrendingUp, TrendingDown } from "lucide-react"

const monthlyData = [
  { month: "Jan", revenue: 45000000, services: 28 },
  { month: "Feb", revenue: 52000000, services: 32 },
  { month: "Mar", revenue: 48000000, services: 30 },
  { month: "Apr", revenue: 61000000, services: 38 },
  { month: "Mei", revenue: 55000000, services: 35 },
  { month: "Jun", revenue: 67000000, services: 42 },
  { month: "Jul", revenue: 72000000, services: 45 },
  { month: "Agu", revenue: 68000000, services: 43 },
  { month: "Sep", revenue: 75000000, services: 48 },
  { month: "Okt", revenue: 82000000, services: 52 },
  { month: "Nov", revenue: 79000000, services: 50 },
  { month: "Des", revenue: 91000000, services: 58 },
]

interface MetricCardProps {
  title: string
  value: string
  change: number
  subtitle: string
  index: number
}

function MetricCard({ title, value, change, subtitle, index }: MetricCardProps) {
  const isPositive = change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardContent className="pt-6">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-black text-gray-900">{value}</p>
          <div className="mt-2 flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp size={14} className="text-green-500" />
            ) : (
              <TrendingDown size={14} className="text-red-500" />
            )}
            <span
              className={`text-xs font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-gray-400">{subtitle}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface AnalyticsDashboardProps {
  totalRevenue?: number
  activeServices?: number
  lowStockCount?: number
  totalCustomers?: number
}

export function AnalyticsDashboard({
  totalRevenue = 795000000,
  activeServices = 12,
  lowStockCount = 5,
  totalCustomers = 248,
}: AnalyticsDashboardProps) {
  const metrics = [
    {
      title: "Total Pendapatan",
      value: formatCurrency(totalRevenue),
      change: 12.5,
      subtitle: "dari bulan lalu",
    },
    {
      title: "Servis Aktif",
      value: activeServices.toString(),
      change: 8.1,
      subtitle: "kendaraan hari ini",
    },
    {
      title: "Stok Menipis",
      value: lowStockCount.toString(),
      change: -15,
      subtitle: "item perlu restock",
    },
    {
      title: "Total Pelanggan",
      value: totalCustomers.toString(),
      change: 5.3,
      subtitle: "pelanggan aktif",
    },
  ]

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg">
          <p className="text-sm font-bold text-gray-900">{label}</p>
          <p className="text-sm text-red-600">{formatCurrency(payload[0]?.value ?? 0)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.title} {...m} index={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Pendapatan Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v / 1000000}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#dc2626" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services line chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Jumlah Servis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="services"
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#dc2626", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
