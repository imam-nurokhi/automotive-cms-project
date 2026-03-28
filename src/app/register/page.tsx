"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Wrench, Mail, Lock, User, Phone, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { registerUser } from "@/actions"

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setError("")
    setLoading(true)
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      })

      // Auto login after register
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Registrasi berhasil, silakan login")
        router.push("/login")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Terjadi kesalahan, coba lagi")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg">
              <Wrench className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">
              Daftar ke Auto<span className="text-red-400">Flow</span>
            </h1>
            <p className="mt-1 text-sm text-gray-400">Buat akun untuk mulai menggunakan layanan</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-300"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Nama Lengkap"
              icon={<User size={16} />}
              {...register("name")}
              error={errors.name?.message}
              className="border-white/20 bg-white/10 text-white placeholder:text-gray-500"
            />
            <Input
              type="email"
              placeholder="Email"
              icon={<Mail size={16} />}
              {...register("email")}
              error={errors.email?.message}
              className="border-white/20 bg-white/10 text-white placeholder:text-gray-500"
            />
            <Input
              placeholder="Nomor HP (opsional)"
              icon={<Phone size={16} />}
              {...register("phone")}
              className="border-white/20 bg-white/10 text-white placeholder:text-gray-500"
            />
            <Input
              type="password"
              placeholder="Password"
              icon={<Lock size={16} />}
              {...register("password")}
              error={errors.password?.message}
              className="border-white/20 bg-white/10 text-white placeholder:text-gray-500"
            />
            <Input
              type="password"
              placeholder="Konfirmasi Password"
              icon={<Lock size={16} />}
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              className="border-white/20 bg-white/10 text-white placeholder:text-gray-500"
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              <CheckCircle2 size={16} className="mr-2" />
              Daftar Sekarang
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-red-400 font-medium hover:text-red-300">
              Masuk di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
