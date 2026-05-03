import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/useAuthStore";

export function LoginPage() {
    const { t } = useTranslation('auth');
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);
    
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errorMsg, setErrorMsg] = useState("");

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            // Używamy globalnego stanu do zapisu logowania
            login(data.token);
            // Przekierowanie do głównej aplikacji
            navigate("/");
        },
        onError: (error: any) => {
            setErrorMsg(error.response?.data?.message || t("login.errors.generic"));
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg(""); // Wyczyść błąd podczas wpisywania
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-gray-900">{t("login.title")}</h1>
                <p className="text-sm text-gray-500 mt-1">{t("login.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        {t("login.emailLabel")}
                    </label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t("login.emailPlaceholder")}
                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                        {t("login.passwordLabel")}
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

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-[#0052CC] focus:ring-[#0052CC]" />
                        {t("login.rememberMe")}
                    </label>
                    <a href="#" className="text-[#0052CC] hover:underline">
                        {t("login.forgotPassword")}
                    </a>
                </div>

                {errorMsg && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
                        {errorMsg}
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full h-10 mt-2 bg-[#0052CC] hover:bg-[#0047b3] disabled:bg-[#0052cc]/70 text-white font-medium rounded-md text-sm transition-colors flex items-center justify-center"
                >
                    {loginMutation.isPending ? t("loading.saving", { ns: "common" }) : t("login.submitButton")}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                {t("login.noAccountText")}{" "}
                <Link to="/auth/register-admin" className="text-[#0052CC] hover:underline font-medium">
                    {t("login.registerOrgLink")}
                </Link>
            </div>
        </div>
    );
}