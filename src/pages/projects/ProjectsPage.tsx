import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Layout, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const fetchBoards = async () => {
  const token = localStorage.getItem('nexo_token');
  const res = await fetch(`${import.meta.env.VITE_API_URL}/boards`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Błąd pobierania');
  return res.json();
};

const createBoard = async (name: string) => {
  const token = localStorage.getItem('nexo_token');
  const res = await fetch(`${import.meta.env.VITE_API_URL}/boards`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ name, organizationId: 1 })
  });
  return res.json();
};

export function ProjectsPage() {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: boards, isLoading } = useQuery({ 
    queryKey: ['boards'], 
    queryFn: fetchBoards 
  });

  const mutation = useMutation({
    mutationFn: createBoard,
    onSuccess: (newBoard) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      navigate(`/board/${newBoard.id}`);
    }
  });

  const handleCreateProject = () => {
    const name = prompt(t('projects.createPrompt'));
    if (name) mutation.mutate(name);
  };

  if (isLoading) return <div className="p-10">{t('projects.loading')}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('projects.title')}</h1>
          <p className="text-gray-500">{t('projects.subtitle')}</p>
        </div>
        <button 
          onClick={handleCreateProject}
          className="btn bg-brand hover:bg-brand/90 text-white gap-2"
        >
          <Plus className="h-5 w-5" /> {t('projects.createButton')}
        </button>
      </header>

      {boards?.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Layout className="text-brand h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('projects.emptyState.title')}</h2>
          <p className="text-gray-500 mb-6">{t('projects.emptyState.description')}</p>
          <button onClick={handleCreateProject} className="btn btn-primary">
            {t('projects.emptyState.action')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boards?.map((board: any) => (
            <div 
              key={board.id} 
              onClick={() => navigate(`/board/${board.id}`)}
              className="group p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-brand cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded text-blue-600">
                  <Layout className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-brand transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{board.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('projects.card.type')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}