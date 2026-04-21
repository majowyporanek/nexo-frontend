import { Outlet } from "react-router-dom"

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-base-200 flex">
            {/* Sidebar Placeholder */}
            <aside className="w-64 bg-base-100 shadow-lg hidden md:block">
                <div className="p-4 text-xl font-bold border-b border-base-300">
                    Nexo Jira
                </div>
                <ul className="menu p-4 w-full text-base-content">
                    <li><a>Dashboard</a></li>
                    <li><a>Active Sprints</a></li>
                    <li><a>Backlog</a></li>
                </ul>
            </aside>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Navbar Placeholder */}
                <header className="navbar bg-base-100 shadow-sm">
                    <div className="flex-1">
                        <button className="btn btn-square btn-ghost md:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <a className="btn btn-ghost normal-case text-xl hidden md:flex">Project Board</a>
                    </div>
                    <div className="flex-none">
                        <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                                <span>UX</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}