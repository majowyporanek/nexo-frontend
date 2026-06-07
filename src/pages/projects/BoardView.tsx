import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useAuthStore } from "../../store/useAuthStore";
import { boardsApi } from "../../api/boards.api";
import { issuesApi } from "../../api/issues.api";
import { Plus, Loader2, MoreHorizontal, User, UserPlus, Users, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CreateIssueModal } from "../../components/boards/CreateIssueModal";
import { IssueDetailsModal } from "../../components/dashboard/IssueDetailsModal";

export const BoardView = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { token, user: currentUser } = useAuthStore();
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();

  const [selectedStage, setSelectedStage] = useState<{ id: number; name: string } | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);

  const numericBoardId = Number(boardId);
  const isAdmin = currentUser?.role === 'ADMIN';

  // 1. Dane tablicy
  const { data: board, isLoading: boardLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => boardsApi.getBoardDetails(token || "", boardId as string),
    enabled: !!token && !!boardId
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.json();
    },
    enabled: !!token && isAdmin
  });

  const { data: issues = [], isLoading: issuesLoading } = useQuery({
    queryKey: ['issues', boardId],
    queryFn: () => issuesApi.getIssuesByBoard(token || "", numericBoardId),
    enabled: !!token && !!numericBoardId
  });

  const refreshIssues = () => {
    queryClient.invalidateQueries({ queryKey: ['issues', boardId] });
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const issueId = Number(draggableId);
    const newStageId = Number(destination.droppableId);

    const previousIssues = issues;
    const updatedIssues = issues.map((iss: any) => 
      iss.id === issueId ? { ...iss, stageId: newStageId } : iss
    );
    queryClient.setQueryData(['issues', boardId], updatedIssues);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...issues.find((i: any) => i.id === issueId), stageId: newStageId })
      });
    } catch (error) {

      queryClient.setQueryData(['issues', boardId], previousIssues);
      alert(t('board.errors.moveFailed', 'Nie udało się przesunąć zadania.'));
    }
  };

  const handleAddUserToBoard = async (userId: number) => {
    try {
      await boardsApi.addUserToBoard(token!, numericBoardId, userId);
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
      alert(t('board.notifications.userAdded', 'Użytkownik dodany do tablicy!'));
    } catch (error) {
      alert(t('board.errors.addMemberFailed', 'Błąd podczas dodawania użytkownika.'));
    }
  };

  const handleRemoveUserFromBoard = async (userId: number) => {
    try {
      await boardsApi.removeUserFromBoard(token!, numericBoardId, userId);
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
      alert(t('board.notifications.userRemoved', 'Dostęp do tablicy został odebrany.'));
    } catch (error) {
      alert(t('board.errors.removeMemberFailed', 'Błąd podczas usuwania użytkownika z tablicy.'));
    }
  };

  if (boardLoading || issuesLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  const activeStages = board?.stages?.filter((s: any) => s.active) || [];
  const orgMembers = allUsers.filter((u: any) => u.organizationId === currentUser?.organizationId);

  return (
    <div className="flex flex-col h-full text-left p-6 bg-[#f4f5f7]">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span>{t('board.projects', 'Projekty') as string}</span>
          <span>/</span>
          <span>{board?.name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-left">
            <h1 className="text-2xl font-bold text-[#172b4d]">{board?.name}</h1>
            <div className="relative">
              <button 
                onClick={() => setShowMembersDropdown(!showMembersDropdown)}
                className="btn btn-ghost btn-sm gap-2 text-[#42526e] hover:bg-[#ebecf0]"
              >
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{orgMembers.length}</span>
              </button>

              {showMembersDropdown && (
                <div className="absolute left-0 mt-2 w-72 bg-white shadow-xl rounded-lg border border-gray-200 z-50 p-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase p-2 tracking-wider">
                    {t('board.manageMembers', 'Zarządzaj dostępem') as string}
                  </p>
                  <div className="max-h-64 overflow-y-auto">
                    {orgMembers.map((member: any) => {
                      const isOnBoard = board?.userIds?.includes(member.id);
                      return (
                        <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors text-left">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center text-[10px] font-bold">
                              {member.firstName ? member.firstName[0] : '?'}{member.lastName ? member.lastName[0] : ''}
                            </div>
                            <span className="text-sm text-gray-700">{member.firstName} {member.lastName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {isOnBoard ? (
                              <>
                                <Check className="h-4 w-4 text-green-500 mr-1" />
                                {isAdmin && (
                                  <button onClick={() => handleRemoveUserFromBoard(member.id)} className="btn btn-ghost btn-xs text-red-400 hover:text-red-600 p-0 h-6 w-6">
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </>
                            ) : (
                              isAdmin && (
                                <button onClick={() => handleAddUserToBoard(member.id)} className="btn btn-ghost btn-xs text-brand hover:bg-brand hover:text-white h-6 w-6">
                                  <UserPlus className="h-3.5 w-3.5" />
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => activeStages.length > 0 && setSelectedStage({ id: activeStages[0].id, name: activeStages[0].name })}
            className="btn btn-primary btn-sm text-white bg-[#0052cc] hover:bg-[#0747a6] border-none px-4 rounded-sm shadow-md"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('board.createIssue', 'Utwórz zadanie') as string}
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto flex gap-3 pb-6 custom-scrollbar">
          {activeStages.map((stage: any, index: number) => {
            const stageIssues = issues.filter((i: any) => i.stageId === stage.id);
            const isFirstStage = index === 0;

            return (
              <div key={stage.id} className="w-[300px] shrink-0 flex flex-col bg-[#ebecf0] rounded-lg p-2 max-h-full shadow-sm text-left">
                <div className="flex justify-between items-center px-2 py-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold uppercase text-[#5e6c84] tracking-wide">
                      {t(`board.stages.${stage.name}`, stage.name) as string}
                    </span>
                    <span className="bg-[#dfe1e6] text-[#172b4d] text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {stageIssues.length}
                    </span>
                  </div>
                  <MoreHorizontal className="h-4 w-4 text-[#42526e] cursor-pointer hover:text-black" />
                </div>

                <Droppable droppableId={stage.id.toString()}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 overflow-y-auto space-y-2 px-1 scrollbar-hide min-h-[50px] transition-colors rounded-md ${
                        snapshot.isDraggingOver ? 'bg-[#091e4214]' : ''
                      }`}
                    >
                      {stageIssues.map((issue: any, idx: number) => (
                        <Draggable key={issue.id} draggableId={issue.id.toString()} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedIssue(issue)}
                              className={`bg-white p-3 rounded-md shadow-sm border-b border-gray-300 hover:bg-[#f4f5f7] cursor-pointer transition-all group text-left ${
                                snapshot.isDragging ? 'shadow-xl rotate-2 ring-2 ring-[#0052cc]' : ''
                              }`}
                            >
                              <p className="text-sm text-[#172b4d] mb-3 leading-snug group-hover:text-[#0052cc] font-medium">{issue.title}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] font-bold text-[#42526e] uppercase tracking-tighter">ID-{issue.id}</span>
                                   {issue.priority && (
                                     <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                                       issue.priority === 'HIGH' || issue.priority === 'HIGHEST' ? 'border-red-200 text-red-600 bg-red-50' : 'border-gray-200 text-gray-500'
                                     }`}>
                                       {t(`board.priorities.${issue.priority}`, issue.priority) as string}
                                     </span>
                                   )}
                                </div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ring-1 ring-white ${issue.assigneeId ? 'bg-[#0052cc]' : 'bg-gray-300'}`}>
                                  {issue.assigneeId ? <User className="h-3 w-3" /> : "?"}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {isFirstStage && (
                  <button 
                    onClick={() => setSelectedStage({ id: stage.id, name: stage.name })}
                    className="w-full py-2 flex items-center gap-2 text-[#5e6c84] hover:bg-[#091e4214] hover:text-[#172b4d] rounded-md text-sm transition-all px-2 mt-1"
                  >
                    <Plus className="h-4 w-4" />
                    {t('board.addCard', 'Dodaj kartę') as string}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {selectedStage && (
        <CreateIssueModal 
          stageId={selectedStage.id}
          stageName={selectedStage.name}
          boardId={numericBoardId}
          onClose={() => setSelectedStage(null)}
          onSuccess={() => { refreshIssues(); setSelectedStage(null); }}
        />
      )}

      {selectedIssue && (
        <IssueDetailsModal 
          issue={selectedIssue}
          stages={activeStages}
          onClose={() => setSelectedIssue(null)}
          onUpdate={() => { refreshIssues(); }}
        />
      )}
    </div>
  );
};