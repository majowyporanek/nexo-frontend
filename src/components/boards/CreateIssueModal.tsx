import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { X, Loader2 } from "lucide-react";

interface CreateIssueModalProps {
  stageId: number;
  stageName: string;
  boardId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateIssueModal = ({ stageId, stageName, boardId, onClose, onSuccess }: CreateIssueModalProps) => {
  const { t } = useTranslation('common');
  const { token, user } = useAuthStore();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !token || !user) return;

    setIsSubmitting(true);
    const now = new Date().toISOString();

    const payload = {
      title: title.trim(),
      description: description.trim(),
      acceptanceCriteria: "",
      reporterId: user.id,
      assigneeId: null,
      storyPoints: 0,
      priority: "MEDIUM",
      type: "TASK",
      epicId: null,
      startDate: now,
      deadline: now,
      boardId: boardId,
      stageId: stageId,
      organizationId: user.organizationId
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert(t('board.errors.createFailed', 'Nie udało się utworzyć zadania.'));
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white max-w-lg p-0 overflow-hidden shadow-2xl border border-gray-100 text-left">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">
            {t('board.createIssue', 'Utwórz zadanie')} — <span className="text-brand uppercase">{stageName}</span>
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle text-gray-400 hover:text-gray-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-gray-600 uppercase text-[11px]">
                {t('board.issueTitle', 'Tytuł zadania')}
              </span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full bg-white text-gray-900 border-gray-300 focus:border-brand" 
              placeholder={t('board.placeholders.title', 'Co trzeba zrobić?')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-gray-600 uppercase text-[11px]">
                {t('board.description', 'Opis')}
              </span>
            </label>
            <textarea 
              className="textarea textarea-bordered h-32 w-full bg-white text-gray-900 border-gray-300 focus:border-brand" 
              placeholder={t('board.placeholders.description', 'Dodaj opis zadania...')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-action bg-gray-50 p-4 mt-6">
            <button type="button" className="btn btn-ghost text-gray-500" onClick={onClose}>
              {t('common.cancel', 'Anuluj')}
            </button>
            <button 
              type="submit" 
              className="btn bg-brand border-none text-white px-8"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : t('common.create', 'Utwórz')}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose}></div>
    </div>
  );
};