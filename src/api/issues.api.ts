

export interface Issue {
  id: number;
  title: string;
  description: string;
  acceptanceCriteria?: string;
  reporterId?: number;
  assigneeId: number;
  storyPoints?: number;
  priority: string;
  flag?: boolean;
  type?: string;
  epicId?: number | null;
  createdAt?: string;
  startDate?: string | null;
  deadline?: string | null;
  boardId: number;
  stageId: number;
  organizationId?: number;
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

export interface IssueQueryParams {
  boardId?: number;
  stageId?: number;
  assigneeId?: number;
  search?: string;
}

const buildQueryString = (params: IssueQueryParams = {}) => {
  const query = new URLSearchParams();

  if (params.boardId !== undefined) query.set('boardId', String(params.boardId));
  if (params.stageId !== undefined) query.set('stageId', String(params.stageId));
  if (params.assigneeId !== undefined) query.set('assigneeId', String(params.assigneeId));
  if (params.search?.trim()) query.set('search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

export const issuesApi = {
  getIssues: async (token: string, params: IssueQueryParams = {}): Promise<Issue[]> => {
    const response = await fetch(`${API_URL}/issues${buildQueryString(params)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Błąd pobierania zadań');
    return response.json();
  },

  getIssuesByBoard: async (token: string, boardId: number): Promise<Issue[]> => {
    return issuesApi.getIssues(token, { boardId });
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
  },

  deleteIssue: async (token: string, issueId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/issues/${issueId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Błąd podczas usuwania zadania');
    }
  }
};