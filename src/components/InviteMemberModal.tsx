import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/useAuthStore";
import { Send, X, Loader2 } from "lucide-react";

export function InviteMemberModal({ onClose, onInviteSent }: { onClose: () => void, onInviteSent: () => void }) {
  const { t } = useTranslation('common');
  const { token } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invitations`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        onInviteSent();
        onClose();
      } else {
        setError(t('invitations.error'));
      }
    } catch (err) {
      setError("Connection error");
      console.error("Invite error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open bg-black/60 backdrop-blur-sm z-[100]">
      <div className="modal-box bg-white text-gray-900 max-w-sm border border-gray-200 shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500"
        >
          <X className="h-4 w-4" />
        </button>
        
        <h3 className="font-bold text-xl mb-1">{t('invitations.sendInvite')}</h3>
        <p className="text-sm text-gray-500 mb-6">{t('invitations.description')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">{t('invitations.emailLabel')}</span>
            </label>
            <input 
              type="email" 
              required
              placeholder={t('invitations.placeholder')}
              className={`input input-bordered w-full bg-white text-black border-gray-300 focus:border-brand ${error ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <span className="text-red-500 text-xs mt-2 font-medium">{error}</span>}
          </div>

          <div className="modal-action mt-6">
            <button 
              type="submit" 
              className="btn bg-brand hover:bg-brand/90 text-white w-full border-none shadow-md" 
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              {t('invitations.sendInvite')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}