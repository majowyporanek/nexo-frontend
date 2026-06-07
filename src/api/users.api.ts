export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  organizationId?: number;
  role?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const usersApi = {
  getUsers: async (token: string): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Błąd pobierania użytkowników');
    }

    return response.json();
  }
};