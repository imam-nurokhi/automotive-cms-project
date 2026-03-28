"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import Link from "next/link"
import { Wrench, Mail, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
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
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau password salah")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            icon={<Mail size={16} />}
            {...register("email")}
            error={errors.email?.message}
            className="border-white/20 bg-white/10 text-white placeholder:text-gray-500"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            icon={<Lock size={16} />}
            {...register("password")}
            error={errors.password?.message}
            className="border-white/20 bg-white/10 text-white placeholder:text-gray-500"
          />
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Masuk
        </Button>
      </form>
    </>
  )
}

export default function LoginPage() {
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
              Masuk ke Auto<span className="text-red-400">Flow</span>
            </h1>
            <p className="mt-1 text-sm text-gray-400">Masuk untuk mengelola kendaraan Anda</p>
          </div>

          <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-white/5" />}>
            <LoginForm />
          </Suspense>

          {/* Demo accounts */}
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Demo Accounts
            </p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>Admin: admin@autoflow.id / admin123</p>
              <p>Mekanik: mekanik@autoflow.id / mekanik123</p>
              <p>Pelanggan: customer@autoflow.id / customer123</p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Belum punya akun?{" "}
            <Link href="/register" className="text-red-400 font-medium hover:text-red-300">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
