"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00",
]

const SERVICE_TYPES = [
  "Servis Berkala",
  "Ganti Oli",
  "Tune Up",
  "Perbaikan AC",
  "Balancing & Spooring",
  "Penggantian Ban",
  "Overhaul",
  "Lainnya",
]

interface BookingCalendarProps {
  onConfirm?: (data: { date: Date; timeSlot: string; serviceType: string }) => void
}

export function BookingCalendar({ onConfirm }: BookingCalendarProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    )
  }

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < todayMidnight
  }

  const handleConfirm = () => {
    if (selectedDate && selectedTime && selectedService && onConfirm) {
      onConfirm({ date: selectedDate, timeSlot: selectedTime, serviceType: selectedService })
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        {/* Month navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button onClick={prevMonth} className="rounded-lg p-2 hover:bg-gray-100">
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-bold text-gray-900">
            {MONTHS[currentMonth]} {currentYear}
          </h3>
          <button onClick={nextMonth} className="rounded-lg p-2 hover:bg-gray-100">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-400 mb-2">
          {DAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const past = isPast(day)
            const selected = isSelected(day)
            const todayDay = isToday(day)

            return (
              <button
                key={day}
                disabled={past}
                onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                className={cn(
                  "flex h-9 w-full items-center justify-center rounded-lg text-sm transition",
                  past && "cursor-not-allowed text-gray-300",
                  !past && !selected && "hover:bg-gray-100 text-gray-700",
                  todayDay && !selected && "font-bold text-red-600",
                  selected && "bg-red-600 text-white font-bold shadow-sm"
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h4 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
            <Clock size={16} className="text-red-500" />
            Pilih Jam
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={cn(
                  "rounded-lg border py-2 text-sm font-medium transition",
                  selectedTime === slot
                    ? "border-red-600 bg-red-50 text-red-600"
                    : "border-gray-200 text-gray-600 hover:border-red-300"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Service type */}
      {selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h4 className="mb-3 font-bold text-gray-900">Jenis Servis</h4>
          <div className="grid grid-cols-2 gap-2">
            {SERVICE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedService(type)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm font-medium transition",
                  selectedService === type
                    ? "border-red-600 bg-red-50 text-red-600"
                    : "border-gray-200 text-gray-600 hover:border-red-300"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {selectedDate && selectedTime && selectedService && (
        <Button className="w-full" size="lg" onClick={handleConfirm}>
          Konfirmasi Booking
        </Button>
      )}
    </div>
  )
}
