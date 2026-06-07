import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Layout, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { boardsApi, CreateBoardRequest } from "../../api/boards.api"; 

interface CreateBoardModalProps {
  onClose: () => void;
  onBoardCreated: () => void;
}

export function CreateBoardModal({ onClose, onBoardCreated }: CreateBoardModalProps) {
  const { t } = useTranslation('common');
  const { token, user } = useAuthStore();
  
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !token) return;

    setIsSubmitting(true);

    try {
      const newBoard: CreateBoardRequest = {
        name: name.trim(),
        organizationId: user?.organizationId || 1,
        userIds: [(user as any)?.id || 1]
      };

      await boardsApi.createBoard(token, newBoard);
      
      onBoardCreated();
      onClose();
    } catch (error) {
      console.error("Błąd API:", error);
      alert(t('common.error', 'Wystąpił błąd podczas tworzenia tablicy.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white text-gray-800 p-0 overflow-hidden border border-gray-100 shadow-2xl max-w-md">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-brand/10 p-2 rounded-lg">
              <Layout className="h-5 w-5 text-brand" />
            </div>
            <h3 className="font-bold text-lg text-gray-900">
              {t('boards.createTitle', 'Utwórz nową tablicę')}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="hover:bg-gray-200 p-1 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {t('boards.formTitle', 'Nazwa tablicy')}
            </label>
            <input
              type="text"
              placeholder={t('boards.formTitlePlaceholder', 'np. Projekt Omega')}
              className="input input-bordered w-full bg-white text-gray-800 focus:outline-brand border-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              className="btn btn-ghost text-gray-600 font-medium" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t('common.cancel', 'Anuluj')}
            </button>
            <button 
              type="submit" 
              className="btn bg-brand hover:bg-brand/90 text-white border-none px-8 font-bold"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('common.create', 'Utwórz')
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose}></div>
    </div>
  );
}