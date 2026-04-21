import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

export const MainLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="h-screen w-full bg-board-bg flex overflow-hidden font-sans text-gray-800">
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 px-4 py-4 md:px-8 md:py-6 overflow-hidden h-[calc(100vh-72px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}