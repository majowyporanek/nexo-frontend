export interface CreateBoardRequest {
  name: string;
  organizationId: number;
  userIds: number[];
}

export interface Stage {
  id: number;
  name: string;
  type: string;
  active: boolean;
}

export interface Board {
  id: number;
  name: string;
  organizationId: number;
  userIds: number[];
  stages: Stage[];
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const boardsApi = {
  getBoards: async (token: string): Promise<Board[]> => {
    const response = await fetch(`${API_URL}/boards`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      }
    });

    if (response.status === 403) {
      console.warn("Dostęp do listy tablic zabroniony (403). Zwracam pustą listę.");
      return []; 
    }

    if (!response.ok) {
      throw new ApiError('Błąd pobierania listy', response.status);
    }
    
    return response.json();
  },

  getBoardDetails: async (token: string, boardId: string): Promise<Board> => {
    const response = await fetch(`${API_URL}/boards/${boardId}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      }
    });

    if (!response.ok) {
      throw new ApiError('Błąd pobierania detali', response.status);
    }
    
    return response.json();
  },

  createBoard: async (token: string, data: CreateBoardRequest): Promise<Board> => {
    const response = await fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new ApiError('Błąd tworzenia', response.status);
    }
    
    return response.json();
  },

  addUserToBoard: async (token: string, boardId: number, userId: number): Promise<Board> => {
    const response = await fetch(`${API_URL}/boards/${boardId}/users/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new ApiError('Failed to add user to board', response.status);
    }

    return response.json();
  },

  removeUserFromBoard: async (token: string, boardId: number, userId: number): Promise<any> => {
    const response = await fetch(`${API_URL}/boards/${boardId}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new ApiError('Failed to remove user from board', response.status);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response;
  }
};