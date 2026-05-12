

export interface Issue {
  id: number;
  title: string;
  description: string;
  assigneeId: number;
  priority: string;
  boardId: number;
  stageId: number;
  type: string;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  boardId: number;
  stageId: number;
  organizationId: number;
  priority?: string;
  type?: string;
  assigneeId?: number;
  reporterId?: number;
}

const API_URL = import.meta.env.VITE_API_URL;

export const issuesApi = {
  getIssuesByBoard: async (token: string, boardId: number): Promise<Issue[]> => {
    const response = await fetch(`${API_URL}/issues?boardId=${boardId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Błąd pobierania zadań');
    return response.json();
  },

  createIssue: async (token: string, data: CreateIssueRequest): Promise<Issue> => {
    const response = await fetch(`${API_URL}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      console.error("Szczegóły błędu serwera:", errorMsg);
      throw new Error('Błąd podczas tworzenia zadania');
    }
    
    return response.json();
  }
};