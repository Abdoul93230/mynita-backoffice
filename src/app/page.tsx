'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, initStore } from '@/lib/store'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    initStore()
    const user = getCurrentUser()
    if (user) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#F2F2F5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F2714A] to-[#2352C8] animate-pulse" />
        <p className="text-sm text-gray-500">Redirection...</p>
      </div>
    </div>
  )
}
