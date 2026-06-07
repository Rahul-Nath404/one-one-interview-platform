import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/lib/types'
import { apiClient } from '@/lib/api'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  getCurrentUser: () => Promise<void>
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.login(email, password)
          localStorage.setItem('token', response.token)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.register(email, password, name)
          localStorage.setItem('token', response.token)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          const message = error.response?.data?.message || 'Signup failed'
          set({ error: message, isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await apiClient.logout()
        } catch (error) {
          console.error('Logout error:', error)
        }
        localStorage.removeItem('token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      getCurrentUser: async () => {
        set({ isLoading: true })
        try {
          const user = await apiClient.getCurrentUser()
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error: any) {
          localStorage.removeItem('token')
          set({ user: null, token: null, isAuthenticated: false, isLoading: false })
        }
      },

      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
