import { useQuery } from "@tanstack/react-query";
import { boardsApi } from "../../api/boards.api";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout, CheckCircle, Clock } from "lucide-react";

export const Dashboard = () => {
  const { token, user } = useAuthStore();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const { data: boards, isLoading } = useQuery({
    queryKey: ['boards', user?.id], 
    queryFn: async () => {
      if (!token || !user?.id) return [];
      
      const allBoards = await boardsApi.getBoards(token);
      return allBoards.filter((board: any) => board.userIds.includes(user.id));
    },

    enabled: !!token && !!user?.id
  });

  return (
    <div className="p-8 bg-[#f4f5f7] min-h-full text-left animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#172b4d]">
          {t('dashboard.welcome', 'Witaj')}, {user?.firstName || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {t('dashboard.subtitle', 'Oto co dzieje się w Twoich projektach.')}
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Layout className="h-5 w-5 text-[#0052cc]" />
          <h2 className="font-bold text-[#172b4d] uppercase tracking-wider text-sm">
            {t('dashboard.yourBoards', 'Twoje tablice')}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards?.map(board => (
              <div 
                key={board.id}
                onClick={() => navigate(`/boards/${board.id}`)}
                className="h-32 bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-[#0052cc] cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#0052cc]"></div>
                <h3 className="font-bold text-[#172b4d] group-hover:text-[#0052cc] transition-colors truncate">
                  {board.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-black uppercase tracking-wider">
                    {board.stages?.length || 0} {t('dashboard.stages_count', 'Etapy')}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-blue-50 transition-colors">
                     <Layout className="h-4 w-4 text-gray-400 group-hover:text-[#0052cc]" />
                  </div>
                </div>
              </div>
            ))}
            
            {boards?.length === 0 && (
              <div className="col-span-full py-10 text-center bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-400 italic">
                  {t('dashboard.noBoards', 'Nie masz jeszcze żadnych przypisanych tablic.')}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center gap-5 shadow-sm">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#172b4d]">12</p>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
              {t('dashboard.stats.recent', 'Ostatnie')}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center gap-5 shadow-sm">
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#172b4d]">24</p>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
              {t('dashboard.stats.done', 'Zrobione')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};