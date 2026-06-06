'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, initStore } from '@/lib/store'
import { CurrentUser } from '@/lib/types'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initStore()
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.replace('/login')
    } else {
      setUser(currentUser)
    }
    setLoading(false)
  }, [router])

  return { user, loading }
}
