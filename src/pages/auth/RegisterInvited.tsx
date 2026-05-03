import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth.api";

export function RegisterInvited() {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
    
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

    const [errorMsg, setErrorMsg] = useState("");

    const registerMutation = useMutation({
        mutationFn: authApi.registerInvited,
        onSuccess: () => {
            // Po pomyślnej rejestracji zaproszonego, przenosimy do logowania
            navigate("/auth/login");
        },
        onError: (error: any) => {
            setErrorMsg(error.response?.data?.message || t("registerInvited.errors.generic"));
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
                    {registerMutation.isPending ? t("loading.saving", { ns: "common" }) : t("registerInvited.submitButton")}
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