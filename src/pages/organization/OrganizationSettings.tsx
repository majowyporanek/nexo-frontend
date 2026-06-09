import { useTranslation } from "react-i18next";
import { Building2, Save, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { organizationsApi } from "../../api/organizations.api";

export function OrganizationSettings() {
  const { t } = useTranslation('common');
  const { token, user, updateUserDetails, logout } = useAuthStore();

  const [orgName, setOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!token) return;
    organizationsApi.getMyOrganization(token)
      .then((org) => setOrgName(org.name))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleSave = async () => {
    if (!token || !orgName.trim()) return;
    setIsSaving(true);
    try {
      const updated = await organizationsApi.updateMyOrganization(token, { name: orgName.trim() });
      setOrgName(updated.name);
      updateUserDetails({ organizationName: updated.name });
      alert(t('organization.notifications.saved', 'Zapisano zmiany.'));
    } catch (error) {
      alert(t('organization.errors.saveFailed', 'Nie udało się zapisać zmian.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    const confirmed = window.confirm(
      t('organization.deleteConfirm', 'Czy na pewno chcesz usunąć organizację? Tej operacji nie można cofnąć.')
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await organizationsApi.deleteMyOrganization(token);
      logout();
    } catch (error) {
      alert(t('organization.errors.deleteFailed', 'Nie udało się usunąć organizacji.'));
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('organization.title')}</h1>
        <p className="text-gray-500">Zarządzaj ustawieniami i tożsamością Twojej organizacji</p>
      </header>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand" />
            <h3 className="font-semibold text-gray-900">{t('organization.name')}</h3>
          </div>

          <div className="p-6">
            <div className="form-control w-full max-w-md">
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={isLoading || !isAdmin}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading || !isAdmin || !orgName.trim()}
              className="btn bg-brand hover:bg-brand/90 text-white border-none gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t('profile.saveChanges')}
            </button>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-red-50 rounded-xl border border-red-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-red-100 flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-semibold">{t('organization.dangerZone')}</h3>
            </div>

            <div className="p-6 flex justify-between items-center">
              <div>
                <p className="text-red-900 font-medium">{t('organization.deleteOrg')}</p>
                <p className="text-red-700 text-sm">{t('organization.deleteWarning')}</p>
              </div>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-error btn-outline gap-2"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {t('organization.deleteOrg')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
