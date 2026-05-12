import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { X, AlignLeft, Loader2, Clock, ChevronDown } from "lucide-react";

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  organizationId: number;
}

interface Stage {
  id: number;
  name: string;
  active: boolean;
}

interface Issue {
  id: number;
  title: string;
  description: string;
  stageId: number;
  assigneeId: number | null;
  priority: string;
  boardId: number;
  reporterId: number;
  organizationId: number;
}

interface Props {
  issue: Issue;
  stages: Stage[];
  onClose: () => void;
  onUpdate: () => void;
}

export const IssueDetailsModal = ({ issue, stages, onClose, onUpdate }: Props) => {
  const { t } = useTranslation('common');
  const { token, user: currentUser } = useAuthStore();
  
  const [localIssue, setLocalIssue] = useState<Issue>(issue);
  const [description, setDescription] = useState(issue.description || "");
  const [isEditing, setIsEditing] = useState(false); 
  const [members, setMembers] = useState<Member[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';
  const priorities = ["LOWEST", "LOW", "MEDIUM", "HIGH", "HIGHEST"];

  useEffect(() => {
    setLocalIssue(issue);
    setDescription(issue.description || "");
    setIsEditing(false);
  }, [issue]);

  useEffect(() => {
    const fetchBoardAndMembers = async () => {
      if (!token || !currentUser?.organizationId) return;
      
      try {
        const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const boardRes = await fetch(`${import.meta.env.VITE_API_URL}/boards/${issue.boardId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (usersRes.ok && boardRes.ok) {
          const allUsers: Member[] = await usersRes.json();
          const currentBoard = await boardRes.json();

          const allowedMembers = allUsers.filter((m: Member) => 
            m.organizationId === currentUser.organizationId && 
            currentBoard.userIds.includes(m.id)
          );
          
          setMembers(allowedMembers);
        }
      } catch (err) {
        console.error("Błąd ładowania członków tablicy:", err);
      }
    };

    fetchBoardAndMembers();
  }, [token, currentUser?.organizationId, issue.boardId]);

  const handleUpdate = async (updates: Partial<Issue>) => {
    if (!token) return;
    
    const updatedIssue = { ...localIssue, ...updates };
    setLocalIssue(updatedIssue);
    setIsSaving(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/issues/${issue.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedIssue)
      });

      if (res.ok) {
        onUpdate();
        setIsEditing(false); 
      } else {
        setLocalIssue(localIssue);
        alert(t('board.errors.updateFailed', 'Błąd podczas zapisywania zmian.'));
      }
    } catch (err) {
      setLocalIssue(localIssue);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelDescription = () => {
    setDescription(localIssue.description || "");
    setIsEditing(false);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl min-h-[500px] p-0 overflow-hidden flex flex-col bg-white border border-gray-200 shadow-2xl">
        
        <div className="p-4 flex justify-between items-center border-b bg-gray-50">
          <div className="flex items-center gap-2 font-bold text-gray-400 text-xs text-left">
            ID-{localIssue.id} {isSaving && <Loader2 className="h-3 w-3 animate-spin text-brand" />}
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden bg-white text-left">
          <div className="flex-[2] p-8 space-y-8 overflow-y-auto border-r border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{localIssue.title}</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider text-left">
                <AlignLeft className="h-4 w-4" /> {t('board.description', 'Opis')}
              </div>
              <textarea 
                className="textarea textarea-bordered w-full h-48 bg-white text-gray-900 border-gray-300 focus:border-brand p-4 leading-relaxed transition-all"
                placeholder={t('board.placeholders.description', 'Dodaj opis...')}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsEditing(true);
                }}
              />
              
              {isEditing && (
                <div className="flex gap-2 pt-2 animate-in fade-in duration-200">
                  <button 
                    onClick={() => handleUpdate({ description })}
                    className="btn btn-sm bg-[#0052cc] hover:bg-[#0747a6] text-white border-none normal-case px-4 rounded-sm shadow-sm"
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.update', 'Aktualizuj')}
                  </button>
                  <button 
                    onClick={handleCancelDescription}
                    className="btn btn-sm btn-ghost text-gray-600 normal-case px-4"
                    disabled={isSaving}
                  >
                    {t('common.cancel', 'Anuluj')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 bg-gray-50 p-8 space-y-6 border-l border-gray-200">
            
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                {t('board.status', 'Status')}
              </label>
              <div className="relative group">
                <select 
                  className="select select-bordered select-sm w-full bg-white text-gray-900 border-gray-300 focus:border-brand font-bold h-10 shadow-sm appearance-none cursor-pointer pr-10"
                  value={localIssue.stageId}
                  disabled={isSaving}
                  onChange={(e) => handleUpdate({ stageId: Number(e.target.value) })}
                >
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {t(`board.stages.${stage.name}`, stage.name) as string}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                {t('board.assignee', 'Osoba przypisana')}
              </label>
              <div className="relative group">
                <select 
                  className={`select select-bordered select-sm w-full bg-white text-gray-900 border-gray-300 focus:border-brand h-10 shadow-sm appearance-none cursor-pointer pr-10 ${!isAdmin ? 'opacity-70' : ''}`}
                  value={localIssue.assigneeId || ""}
                  disabled={!isAdmin || isSaving}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleUpdate({ assigneeId: val === "" ? null : Number(val) });
                  }}
                >
                  <option value="">{t('board.unassigned', 'Brak')}</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
                {t('board.priority', 'Priorytet')}
              </label>
              <div className="relative group">
                <select 
                  className={`select select-bordered select-sm w-full bg-white text-gray-900 border-gray-300 focus:border-brand font-bold h-10 shadow-sm appearance-none cursor-pointer pr-10 ${!isAdmin ? 'opacity-70' : ''}`}
                  value={localIssue.priority}
                  disabled={!isAdmin || isSaving}
                  onChange={(e) => handleUpdate({ priority: e.target.value })}
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>
                      {t(`board.priorities.${p}`, p) as string}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                <div className="p-2 bg-blue-50 rounded-md">
                  <Clock className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{t('board.createdAt', 'Utworzono')}</p>
                  <p className="text-xs text-gray-700 font-bold">12.05.2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};