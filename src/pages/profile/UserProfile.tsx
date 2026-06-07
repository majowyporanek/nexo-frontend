import { useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { Mail, Shield, LogOut, User as UserIcon, Building2, Loader2 } from "lucide-react";

export function UserProfile() {
  const { t } = useTranslation('common');
  const { user, token, logout, updateUserDetails } = useAuthStore();

  const fetchAllData = useCallback(async () => {
    if (!token) return;
    
    try {
      const [usersRes, orgRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/organizations/my`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      let updatedData: any = {};

      if (usersRes.ok) {
        const allUsers = await usersRes.json();
        const me = allUsers.find((u: any) => u.email === user?.email);
        if (me) {
          updatedData = { 
            ...updatedData, 
            firstName: me.firstName, 
            lastName: me.lastName, 
            username: `${me.firstName} ${me.lastName}` 
          };
        }
      }

      if (orgRes.ok) {
        const orgData = await orgRes.json();
        updatedData.organizationName = orgData.name;
      }

      if (Object.keys(updatedData).length > 0) {
        updateUserDetails(updatedData);
      }
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
    }
  }, [token, user?.email, updateUserDetails]);

  useEffect(() => {
    if (token && (!user?.firstName || !user?.organizationName)) {
      fetchAllData();
    }
  }, [token, user?.firstName, user?.organizationName, fetchAllData]);

  if (!user) return null;

  const isDataLoaded = !!user.firstName;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
        <p className="text-gray-500">{t('profile.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-24 h-24 bg-brand rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-inner">
              {!isDataLoaded ? <Loader2 className="animate-spin" /> : `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
            </div>
            <h2 className="text-xl font-bold text-gray-900 truncate px-2">
              {isDataLoaded ? `${user.firstName} ${user.lastName}` : t('profile.defaultUsername')}
            </h2>
            <p className="text-sm text-gray-500 mb-6">{user.role}</p>
            
            <button 
              onClick={() => { logout(); window.location.href = '/auth/login'; }}
              className="btn btn-outline btn-error btn-sm w-full gap-2"
            >
              <LogOut className="h-4 w-4" />
              {t('profile.logout')}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">{t('profile.accountInfo')}</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t('profile.firstName')}</label>
                    <p className="text-gray-900 font-medium">{user.firstName || "---"}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t('profile.lastName')}</label>
                    <p className="text-gray-900 font-medium">{user.lastName || "---"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {t('profile.organizationName')}
                  </label>
                  <p className="text-gray-900 font-medium">
                    {user.organizationName || t('common.loading', 'Pobieranie...')} 
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t('profile.email')}</label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}