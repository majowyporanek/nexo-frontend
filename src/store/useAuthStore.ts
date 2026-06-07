import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  organizationId: number;
  exp: number;
}

interface User {
  id: number;
  email: string;
  role: string;
  organizationId: number;
  organizationName?: string;
  firstName?: string;      
  lastName?: string;      
  username?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUserDetails: (details: Partial<User>) => void; 
}

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (token: string) => {
    try {
      localStorage.setItem('nexo_token', token);
      const decoded = jwtDecode<JwtPayload>(token);

      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const users: User[] = await response.json();
      const fullUserData = users.find(u => u.email === decoded.sub);

      if (fullUserData) {
        set({ token, user: fullUserData, isAuthenticated: true });
        window.location.replace('/dashboard'); 
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('nexo_token');
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      

      if (decoded.exp * 1000 < Date.now()) {
        get().logout();
        return;
      }

      set({ 
        token, 
        isAuthenticated: true,
        user: { 
          id: 0, 
          email: decoded.sub, 
          role: decoded.role, 
          organizationId: decoded.organizationId 
        } 
      });

      const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const users: User[] = await response.json();
        const fullUserData = users.find(u => u.email === decoded.sub);
        if (fullUserData) {
          set({ user: fullUserData });
        }
      }
    } catch (error) {
      console.error('CheckAuth error:', error);
      get().logout();
    }
  },

  updateUserDetails: (details: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...details } : null
    }));
  },

  logout: () => {
    localStorage.removeItem('nexo_token');
    set({ token: null, user: null, isAuthenticated: false });
    window.location.href = '/auth/login';
  },
}));

useAuthStore.getState().checkAuth();