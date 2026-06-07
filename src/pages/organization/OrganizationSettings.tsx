import { useTranslation } from "react-i18next";
import { Building2, Save, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

export function OrganizationSettings() {
  const { t } = useTranslation('common');
  const [orgName, setOrgName] = useState("Moja Organizacja");

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
                className="input input-bordered w-full" 
              />
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button className="btn bg-brand hover:bg-brand/90 text-white border-none gap-2">
              <Save className="h-4 w-4" />
              {t('profile.saveChanges')}
            </button>
          </div>
        </div>

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
            <button className="btn btn-error btn-outline gap-2">
              <Trash2 className="h-4 w-4" />
              {t('organization.deleteOrg')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}