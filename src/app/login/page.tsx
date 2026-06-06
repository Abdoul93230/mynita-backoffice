'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, getCurrentUser, initStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initStore()
    const user = getCurrentUser()
    if (user) {
      router.replace('/dashboard')
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const user = login(email, password)
      if (user) {
        router.replace('/dashboard')
      } else {
        setError('Email ou mot de passe incorrect')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#F2F2F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F2714A] to-[#2352C8] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">N</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-[#F2714A]">my</span>
            <span className="text-[#2352C8]">NITA</span>
          </h1>
          <p className="text-gray-500 mt-2">Backoffice Administration</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Connexion</h2>
          <p className="text-sm text-gray-500 mb-6">
            Entrez vos identifiants pour accéder au backoffice
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="admin@mynita.ne"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2352C8] hover:bg-[#1a3f9e] text-white h-11"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
            Identifiants de test
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Super Admin:</span>
              <code className="text-[#2352C8] bg-blue-50 px-2 py-0.5 rounded text-xs">
                superadmin@mynita.ne / Admin@2024
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Admin:</span>
              <code className="text-[#2352C8] bg-blue-50 px-2 py-0.5 rounded text-xs">
                admin@mynita.ne / Admin@2024
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
