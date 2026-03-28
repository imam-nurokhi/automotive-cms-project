import Link from "next/link"
import { Wrench, Phone, Mail, MapPin } from "lucide-react"

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <a
    href="#"
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 text-gray-400 transition hover:border-red-600 hover:text-red-500"
  >
    {children}
  </a>
)

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">
                Auto<span className="text-red-500">Flow</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Platform manajemen bengkel premium terpercaya. Solusi modern untuk
              perawatan kendaraan Anda.
            </p>
            <div className="mt-6 flex gap-3">
              {["f", "in", "tw"].map((icon) => (
                <SocialIcon key={icon}>
                  <span className="text-xs font-bold">{icon}</span>
                </SocialIcon>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white">Layanan</h3>
            <ul className="mt-4 space-y-2">
              {["Servis Berkala", "Tune Up", "Ganti Oli", "Perbaikan AC", "Balancing & Spooring"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 transition hover:text-red-400">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white">Perusahaan</h3>
            <ul className="mt-4 space-y-2">
              {[
                { label: "Tentang Kami", href: "#about" },
                { label: "Blog", href: "#" },
                { label: "Karir", href: "#" },
                { label: "Kebijakan Privasi", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-gray-400 transition hover:text-red-400">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white">Kontak</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={14} className="text-red-500" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-red-500" />
                <span>info@autoflow.id</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={14} className="mt-0.5 shrink-0 text-red-500" />
                <span>Jl. Sudirman No. 123, Jakarta Pusat, 10210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AutoFlow. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  )
}
