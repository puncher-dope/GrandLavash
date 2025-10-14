import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  userName: string
  userPhone: string
  setUserName: (userName: string) => void
  setUserPhone: (phone: string) => void
}

export const useLocalStore = create<AuthStore>()(
  persist(
    (set) => ({
      userName: '',
      setUserName: (name ) => set({ userName:name }),
      userPhone:'',
      setUserPhone: (phone ) => set({ userPhone:phone }),
    }),
    {
      name: 'user-auth-data', // ключ в localStorage
    }
  )
)