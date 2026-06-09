import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { CreateBoardModal } from "../components/boards/CreateBoardModal";
import { useQueryClient } from "@tanstack/react-query";
import { useMyBoards } from "../lib/workspace-hooks";

export const MainLayout = () => {
  const queryClient = useQueryClient();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  const { data: boards = [] } = useMyBoards();

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