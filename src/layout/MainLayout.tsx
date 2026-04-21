import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-base-200 flex">
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}