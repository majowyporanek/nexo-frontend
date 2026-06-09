export interface Organization {
  id: number;
  name: string;
  createdAt?: string;
}

export interface UpdateOrganizationRequest {
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const organizationsApi = {
  getMyOrganization: async (token: string): Promise<Organization> => {
    const response = await fetch(`${API_URL}/organizations/my`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Błąd pobierania organizacji');
    }

    return response.json();
  },

  updateMyOrganization: async (token: string, data: UpdateOrganizationRequest): Promise<Organization> => {
    const response = await fetch(`${API_URL}/organizations/my`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Błąd aktualizacji organizacji');
    }

    return response.json();
  },

  deleteMyOrganization: async (token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/organizations/my`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Błąd usuwania organizacji');
    }
  }
};
