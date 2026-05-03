import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  organizationId: number;
  exp: number;
  iat: number;
}

interface User {
  email: string;
  role: string;
  organizationId: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token: string) => {
    localStorage.setItem('nexo_token', token);
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const user: User = {
        email: decoded.sub,
        role: decoded.role,
        organizationId: decoded.organizationId
      };
      set({ token, user, isAuthenticated: true });
    } catch (error) {
      console.error('Invalid token during login', error);
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem('nexo_token');
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('nexo_token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        // Sprawdź czy token wygasł (exp jest w sekundach, Data.now() zwraca milisekundy)
        if (decoded.exp * 1000 < Date.now()) {
          console.warn('Token expired');
          localStorage.removeItem('nexo_token');
          set({ token: null, user: null, isAuthenticated: false });
          return;
        }

        const user: User = {
          email: decoded.sub,
          role: decoded.role,
          organizationId: decoded.organizationId
        };
        set({ token, user, isAuthenticated: true });
      } catch (error) {
        console.error('Invalid token during checkAuth', error);
        localStorage.removeItem('nexo_token');
        set({ token: null, user: null, isAuthenticated: false });
      }
    } else {
      set({ token: null, user: null, isAuthenticated: false });
    }
  }
}));

// Zainicjuj stan na podstawie tego, co jest w localStorage
useAuthStore.getState().checkAuth();
