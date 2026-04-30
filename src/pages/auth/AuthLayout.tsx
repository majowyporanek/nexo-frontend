import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 font-sans text-gray-900">
            <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-center mb-8">
                    {/* Nexo Logo / Branding Placeholder */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-[#0052CC] flex items-center justify-center text-white font-bold text-xl">
                            N
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-gray-800">Nexo</span>
                    </div>
                </div>
                
                <Outlet />
            </div>
        </div>
    );
}