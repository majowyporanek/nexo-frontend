import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth.api";

export function RegisterAdmin() {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        organizationName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [errorMsg, setErrorMsg] = useState("");

    const registerMutation = useMutation({
        mutationFn: authApi.registerAdmin,
        onSuccess: (data) => {
            // Po pomyślnej rejestracji admina, przenosimy do logowania
            navigate("/auth/login");
        },
        onError: (error: any) => {
            setErrorMsg(error.response?.data?.message || "Wystąpił błąd podczas rejestracji");
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate(formData);
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

                {errorMsg && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
                        {errorMsg}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full h-10 mt-2 bg-[#0052CC] hover:bg-[#0047b3] disabled:bg-[#0052cc]/70 text-white font-medium rounded-md text-sm transition-colors flex items-center justify-center"
                >
                    {registerMutation.isPending ? "Zapisywanie..." : t("registerAdmin.submitButton")}
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