import axios from 'axios';

// Domyślny adres backendu (według dokumentacji działa na localhost:8080 z prefixem /api)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor do dodawania tokenu JWT do każdego żądania (jeśli użytkownik jest zalogowany)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor do wyłapywania błędów (np. 401 Unauthorized - wylogowanie)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jeśli token wygasł lub jest nieprawidłowy, usuń go
      localStorage.removeItem('nexo_token');
      // Tutaj w przyszłości można dodać przekierowanie na stronę logowania,
      // ale zajmiemy się tym po stronie komponentów Reacta
    }
    return Promise.reject(error);
  }
);
