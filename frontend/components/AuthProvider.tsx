'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getCurrentUser, token } = useAuthStore()

  useEffect(() => {
    // If there's a token in localStorage, try to get the current user
    if (token) {
      getCurrentUser()
    }
  }, [token, getCurrentUser])

  return <>{children}</>
}
