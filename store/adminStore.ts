// store/adminStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  institution?: string;
}

interface AdminStore {
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      adminUser: null,
      setAdminUser: (user) => set({ adminUser: user }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'admin-store',
    }
  )
)