import type { PRDData, SavedPRD } from "./types"

const STORAGE_KEY = "idea-alchemy-prds"
const CURRENT_DRAFT_KEY = "idea-alchemy-current-draft"

// Check if Supabase is configured
const hasSupabase = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// LocalStorage fallback
export const localStorageAPI = {
  saveDraft: (data: PRDData) => {
    if (typeof window === "undefined") return
    localStorage.setItem(CURRENT_DRAFT_KEY, JSON.stringify(data))
  },

  loadDraft: (): PRDData | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(CURRENT_DRAFT_KEY)
    return data ? JSON.parse(data) : null
  },

  savePRD: (data: PRDData): string => {
    if (typeof window === "undefined") return ""
    const id = Math.random().toString(36).substring(2, 15)
    const saved: SavedPRD = {
      id,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const existing = localStorage.getItem(STORAGE_KEY)
    const prds = existing ? JSON.parse(existing) : {}
    prds[id] = saved
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prds))

    return id
  },

  loadPRD: (id: string): SavedPRD | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    const prds = JSON.parse(data)
    return prds[id] || null
  },
}

// Main storage API (will use Supabase if configured, otherwise localStorage)
export const storageAPI = {
  saveDraft: localStorageAPI.saveDraft,
  loadDraft: localStorageAPI.loadDraft,
  savePRD: localStorageAPI.savePRD,
  loadPRD: localStorageAPI.loadPRD,
}
