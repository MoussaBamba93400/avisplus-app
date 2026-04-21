import { defineStore } from 'pinia'

export interface Business {
  id: number
  name: string
  slug: string
  is_active: boolean
  google_review_url: string | null
}

export interface User {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: User | null
  businesses: Business[]
  activeBusinessId: number | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    businesses: [],
    activeBusinessId: null,
    token: null,
  }),

  getters: {
    isAuthenticated: (s) => s.token !== null && s.user !== null,
    activeBusiness: (s) =>
      s.businesses.find((b) => b.id === s.activeBusinessId) ?? s.businesses[0] ?? null,
  },

  actions: {
    setSession(payload: { user: User; token: string }) {
      this.user = payload.user
      this.token = payload.token
      if (import.meta.client) {
        localStorage.setItem('avisplus.token', payload.token)
      }
    },

    setBusinesses(businesses: Business[]) {
      this.businesses = businesses
      if (!this.activeBusinessId && businesses.length > 0) {
        this.setActiveBusiness(businesses[0].id)
      }
    },

    setActiveBusiness(id: number) {
      this.activeBusinessId = id
      if (import.meta.client) {
        localStorage.setItem('avisplus.activeBusinessId', String(id))
      }
    },

    hydrate() {
      if (!import.meta.client) return
      const token = localStorage.getItem('avisplus.token')
      const activeId = localStorage.getItem('avisplus.activeBusinessId')
      if (token) this.token = token
      if (activeId) this.activeBusinessId = Number(activeId)
    },

    clear() {
      this.user = null
      this.token = null
      this.businesses = []
      this.activeBusinessId = null
      if (import.meta.client) {
        localStorage.removeItem('avisplus.token')
        localStorage.removeItem('avisplus.activeBusinessId')
      }
    },
  },
})
