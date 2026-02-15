import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TOKEN_NAME } from '@/until';

// Create a Zustand store with persistence
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      token: null,
      user: null,
      isAuthenticated: false,
      
      // Actions
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      
      setUser: (user) => set({ user }),
      
      login: (token, user) => set({ 
        token, 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        token: null, 
        user: null, 
        isAuthenticated: false 
      }),
      
      // Getters
      getToken: () => get().token,
      
      getUser: () => get().user,
      
      getIsAuthenticated: () => get().isAuthenticated,
    }),
    {
      name: TOKEN_NAME, // Storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }), // Only persist these fields
    }
  )
);

export default useAuthStore;
