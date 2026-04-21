import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export const MainLayout = () => {
    return (
        <div className="h-screen w-full bg-board-bg flex overflow-hidden font-sans text-gray-800">
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="flex-1 p-8 overflow-hidden h-full">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}