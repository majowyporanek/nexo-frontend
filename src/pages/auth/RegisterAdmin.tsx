import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function RegisterAdmin() {
    const { t } = useTranslation('auth');
    
    const [formData, setFormData] = useState({
        organizationName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Register Admin payload:", formData);
        // Tutaj w przyszłości podepniemy zapytanie do /auth/register-admin
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-gray-900">{t("registerAdmin.title")}</h1>
                <p className="text-sm text-gray-500 mt-1">{t("registerAdmin.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="organizationName">
                        {t("registerAdmin.orgNameLabel")}
                    </label>
                    <input 
                        type="text" 
                        id="organizationName"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        required
                        placeholder={t("registerAdmin.orgNamePlaceholder")}
                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-colors"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                            {t("registerAdmin.firstNameLabel")}
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
                            {t("registerAdmin.lastNameLabel")}
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
                        {t("registerAdmin.emailLabel")}
                    </label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t("registerAdmin.emailPlaceholder")}
                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                        {t("registerAdmin.passwordLabel")}
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

                <button 
                    type="submit"
                    className="w-full h-10 mt-2 bg-[#0052CC] hover:bg-[#0047b3] text-white font-medium rounded-md text-sm transition-colors"
                >
                    {t("registerAdmin.submitButton")}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                {t("registerAdmin.hasAccountText")}{" "}
                <Link to="/auth/login" className="text-[#0052CC] hover:underline font-medium">
                    {t("registerAdmin.loginLink")}
                </Link>
            </div>
            
            <div className="mt-2 text-center text-sm text-gray-500">
                {t("registerAdmin.invitedText")}{" "}
                <Link to="/auth/register-invited" className="text-[#0052CC] hover:underline font-medium">
                    {t("registerAdmin.invitedLink")}
                </Link>
            </div>
        </div>
    );
}