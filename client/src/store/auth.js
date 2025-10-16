import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    login: (token, user) => {
        set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false
        });
    },
    logout: () => {
        set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false
        });
        localStorage.removeItem('token');
    },
    updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
            set({
                user: { ...currentUser, ...userData }
            });
        }
    },
    setLoading: (loading) => {
        set({ isLoading: loading });
    }
}), {
    name: 'auth-storage',
    partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
    })
}));
