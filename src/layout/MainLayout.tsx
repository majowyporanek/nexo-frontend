import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CreateBoardModal } from "../components/boards/CreateBoardModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "../api/boards.api";
import { useAuthStore } from "../store/useAuthStore";

export const MainLayout = () => {
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  const { data: boards = [] } = useQuery({
    queryKey: ['boards', user?.id], 
    queryFn: async () => {
      if (!token || !user?.id) return [];
      try {
        const data = await boardsApi.getBoards(token);
        return data.filter((board: any) => board.userIds.includes(user.id));
      } catch (error: any) {
        if (error.status === 403 || error.message?.includes('403')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!token && !!user?.id, 
    retry: (failureCount, error: any) => {
      if (error.status === 403) return false;
      return failureCount < 3;
    }
  });

  const handleBoardCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['boards'] });
    setIsCreateBoardModalOpen(false);
  };

  return (
    <div className="h-screen w-full bg-[#f4f5f7] flex overflow-hidden font-sans text-gray-800">
      
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onOpenCreateBoard={() => setIsCreateBoardModalOpen(true)}
        boards={boards}
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          onCreateClick={() => setIsCreateBoardModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {isCreateBoardModalOpen && (
        <CreateBoardModal 
          onClose={() => setIsCreateBoardModalOpen(false)} 
          onBoardCreated={handleBoardCreated}
        />
      )}
    </div>
  );
};