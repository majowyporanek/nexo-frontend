import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { UserPlus, Shield, MoreVertical, Loader2, CheckCircle2, Trash2, ShieldAlert, ShieldCheck } from "lucide-react";
import { InviteMemberModal } from "../../components/InviteMemberModal";

interface Member {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: number;
}

export function MembersList() {
  const { t } = useTranslation('common');
  const { token, user: currentUser } = useAuthStore();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  const fetchMembers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const allUsers: Member[] = await res.json();
        setMembers(allUsers.filter(m => m.organizationId === currentUser?.organizationId));
      }
    } catch (error) {
      console.error("Błąd podczas pobierania członków:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (member: Member) => {
    if (!token) return;

    const newRole = member.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const originalMembers = [...members];
    
    setMembers(members.map(m => m.id === member.id ? { ...m, role: newRole } : m));

    try {
      const updatedUser = {
        ...member,
        role: newRole
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${member.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });
      
      if (!res.ok) throw new Error();


    } catch (error) {
      console.error("Błąd podczas zmiany roli:", error);
      alert(t('common.error', 'Wystąpił błąd. Spróbuj ponownie.'));
      setMembers(originalMembers);
    }
  };

  const handleDelete = async () => {
    if (!token || !memberToRemove) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${memberToRemove.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchMembers();
    } catch (error) {
      console.error("Błąd podczas usuwania:", error);
    } finally {
      setMemberToRemove(null);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [token, currentUser?.organizationId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <p className="text-gray-500 italic">{t('members.loading', 'Ładowanie zespołu...')}</p>
      </div>
    );
  }

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-end mb-10 text-left">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('members.listTitle', 'Zespół')}
          </h1>
          <p className="text-gray-500 mt-1">
            {t('organization.manageMembers', 'Zarządzaj dostępem do Twojej organizacji')}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn bg-brand hover:bg-brand/90 text-white border-none gap-2 shadow-lg"
          >
            <UserPlus className="h-4 w-4" />
            {t('organization.inviteMember', 'Zaproś osobę')}
          </button>
        )}
      </header>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <h2 className="font-bold text-gray-800 text-lg">
            {t('organization.members', 'Aktywni członkowie')} ({members.length})
          </h2>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-[11px] tracking-widest text-left">
                <th className="py-4 px-6 font-semibold">{t('members.table.user', 'Użytkownik')}</th>
                <th className="font-semibold">{t('members.table.role', 'Rola')}</th>
                <th className="text-right px-6 font-semibold">{t('members.table.actionHeader', 'Akcje')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-left">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-brand/10 text-brand rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {member.firstName?.[0] || member.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {member.firstName ? `${member.firstName} ${member.lastName}` : member.email.split('@')[0]}
                          {member.email === currentUser?.email && (
                            <span className="ml-2 badge badge-ghost badge-sm text-gray-400 font-normal">
                              {t('members.me', 'Ty')}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 italic">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Shield className={`h-4 w-4 ${member.role === 'ADMIN' ? 'text-purple-500' : 'text-blue-500'}`} />
                      <span className={`text-sm font-medium ${member.role === 'ADMIN' ? 'text-purple-700' : 'text-gray-700'}`}>
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-6">
                    {isAdmin && member.email !== currentUser?.email ? (
                      <div className="dropdown dropdown-left dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-xs btn-square">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[10] menu p-2 shadow-2xl bg-white border border-gray-100 rounded-box w-64 text-gray-800">
                          <li>
                            <button 
                              onClick={() => handleToggleRole(member)}
                              className="flex items-center gap-2 py-3 hover:bg-gray-50"
                            >
                              {member.role === 'ADMIN' ? (
                                <>
                                  <ShieldAlert className="h-4 w-4 text-blue-600" /> 
                                  {t('members.actions.changeToUser', 'Zmień na USER')}
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4 text-purple-600" /> 
                                  {t('members.actions.changeToAdmin', 'Daj ADMINA')}
                                </>
                              )}
                            </button>
                          </li>
                          
                          <div className="divider my-0 opacity-50"></div>
                          
                          <li>
                            <button 
                              onClick={() => setMemberToRemove(member)}
                              className="text-red-600 hover:bg-red-50 flex items-center gap-2 py-3"
                            >
                              <Trash2 className="h-4 w-4" /> 
                              <span className="font-medium">{t('members.actions.remove', 'Usuń z organizacji')}</span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {memberToRemove && (
        <div className="modal modal-open">
          <div className="modal-box bg-white shadow-2xl border border-gray-100 text-left">
            <h3 className="font-bold text-xl text-gray-900">
              {t('members.actions.confirmRemoveTitle', 'Usuń użytkownika')}
            </h3>
            <p className="py-6 text-gray-600 text-base leading-relaxed">
              {t('members.actions.confirmRemoveQuestion', { 
                name: memberToRemove.firstName ? `${memberToRemove.firstName} ${memberToRemove.lastName}` : memberToRemove.email,
                defaultValue: `Czy na pewno chcesz usunąć użytkownika ${memberToRemove.email} z organizacji?`
              })}
            </p>
            <div className="modal-action gap-3">
              <button className="btn btn-ghost" onClick={() => setMemberToRemove(null)}>
                {t('common.cancel', 'Anuluj')}
              </button>
              <button className="btn btn-error text-white" onClick={handleDelete}>
                {t('common.delete', 'Usuń')}
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => setMemberToRemove(null)}></div>
        </div>
      )}

      {isModalOpen && (
        <InviteMemberModal 
          onClose={() => setIsModalOpen(false)} 
          onInviteSent={() => fetchMembers()} 
        />
      )}
    </div>
  );
}