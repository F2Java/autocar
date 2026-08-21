"use client"

import { useState } from "react"
import Link from "next/link"
import { Store, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const [form, setForm] = useState({ companyName: "", contactPerson: "", email: "", phone: "", password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [f]: e.target.value })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("")
    if (!form.companyName || !form.contactPerson || !form.email || !form.password) { setError("Isi semua field wajib"); return }
    if (form.password.length < 6) { setError("Password minimal 6 karakter"); return }
    if (form.password !== form.confirmPassword) { setError("Password tidak cocok"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Gagal daftar")
      setSuccess(true)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="h-8 w-8 text-green-600" /></div>
        <h1 className="text-2xl font-bold text-gray-900">Pendaftaran Berhasil!</h1>
        <p className="text-gray-500 mt-2">Akun Anda menunggu persetujuan admin.</p>
        <p className="text-sm text-gray-400 mt-1">Kami akan memberi tahu setelah akun aktif.</p>
        <Link href="/auth/login"><Button className="mt-6">Masuk</Button></Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4"><Store className="h-6 w-6 text-white" /></div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Akun B2B</h1>
          <p className="text-sm text-gray-500 mt-1">Daftarkan perusahaan Anda untuk belanja grosir</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">Nama Perusahaan *</label><Input placeholder="PT Maju Bersama" value={form.companyName} onChange={handleChange("companyName")} required /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">Kontak Person *</label><Input placeholder="John Doe" value={form.contactPerson} onChange={handleChange("contactPerson")} required /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">Email *</label><Input type="email" placeholder="john@company.com" value={form.email} onChange={handleChange("email")} required /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">Telepon</label><Input placeholder="+62 812 3456 7890" value={form.phone} onChange={handleChange("phone")} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password *</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 karakter" value={form.password} onChange={handleChange("password")} required className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>
            <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">Konfirmasi Password *</label><Input type="password" placeholder="Ulangi password" value={form.confirmPassword} onChange={handleChange("confirmPassword")} required /></div>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"><AlertCircle className="h-4 w-4 inline mr-1" />{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{loading ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Sudah punya akun? <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">Masuk</Link></p>
      </div>
    </div>
  )
}
