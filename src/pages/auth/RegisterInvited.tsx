import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function RegisterInvited() {
    const { t } = useTranslation('auth');
    
    const [searchParams] = useSearchParams();
    const emailFromInvite = searchParams.get("email") || ""; 
    const tokenFromInvite = searchParams.get("token") || "";

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: emailFromInvite,
        password: "",
        token: tokenFromInvite
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Register Invited payload:", formData);
        // Tutaj w przyszłości podepniemy zapytanie do /auth/register-invited
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-gray-900">{t("registerInvited.title")}</h1>
                <p className="text-sm text-gray-500 mt-1">{t("registerInvited.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                            {t("registerInvited.firstNameLabel")}
                        </label>
                        <input 
                            type="text" 
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-colors"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                            {t("registerInvited.lastNameLabel")}
                        </label>
                        <input 
                            type="text" 
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        {t("registerInvited.emailLabel")}
                    </label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        readOnly={!!emailFromInvite} // Zablokuj jeśli przyszedł z linku
                        placeholder={t("registerInvited.emailPlaceholder")}
                        className="w-full h-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-colors cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                        {t("registerInvited.passwordLabel")}
                    </label>
                    <input 
                        type="password" 
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-colors"
                    />
                </div>

                {/* Ukryte pole na token z zaproszenia, backend go potrzebuje */}
                {!tokenFromInvite && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="token">
                            {t("registerInvited.tokenLabel")}
                        </label>
                        <input 
                            type="text" 
                            id="token"
                            name="token"
                            value={formData.token}
                            onChange={handleChange}
                            required
                            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-colors"
                        />
                    </div>
                )}

                <button 
                    type="submit"
                    className="w-full h-10 mt-2 bg-[#0052CC] hover:bg-[#0047b3] text-white font-medium rounded-md text-sm transition-colors"
                >
                    {t("registerInvited.submitButton")}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                {t("registerInvited.founderText")}{" "}
                <Link to="/auth/register-admin" className="text-[#0052CC] hover:underline font-medium">
                    {t("registerInvited.registerOrgLink")}
                </Link>
            </div>
        </div>
    );
}