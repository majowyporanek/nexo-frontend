import { Search, Plus, Bell, Settings, HelpCircle, Menu, LogOut } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore()

  // Prosta funkcja do pobierania inicjałów z maila, np. "test.user@example.com" => "TU"
  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.')
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-base-300 bg-white px-6">
      {/* Mobile Menu & Search */}
      <div className="flex items-center gap-4 w-full max-w-md">
        <button 
          className="btn btn-square btn-sm btn-ghost md:hidden"
          onClick={onMenuClick}
        >
            <Menu className="h-5 w-5" />
        </button>
        
        <div className="relative w-full max-w-[400px] hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered h-10 w-full pl-10 bg-gray-50/50 border-gray-200 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand rounded-md text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="btn h-9 min-h-0 bg-brand hover:bg-brand/90 text-white border-none gap-1.5 px-4 font-semibold rounded-md shadow-sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create</span>
        </button>

        <button className="btn btn-square btn-sm btn-ghost relative hover:bg-gray-100">
          <Bell className="h-5 w-5 stroke-[1.5px] text-gray-600" />
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400 border border-white"></span>
          </span>
        </button>

        <button className="btn btn-square btn-sm btn-ghost hidden sm:flex hover:bg-gray-100">
          <HelpCircle className="h-5 w-5 stroke-[1.5px] text-gray-600" />
        </button>

        <button className="btn btn-square btn-sm btn-ghost hidden sm:flex hover:bg-gray-100">
          <Settings className="h-5 w-5 stroke-[1.5px] text-gray-600" />
        </button>

        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-medium leading-tight text-gray-700">{user.email}</span>
                <span className="text-xs text-gray-500 font-semibold">{user.role} (Org: {user.organizationId})</span>
              </div>
              <div className="avatar placeholder shadow-sm rounded-full bg-[#0052CC] text-white w-9 h-9 flex items-center justify-center">
                <span className="text-sm font-semibold">{getInitials(user.email)}</span>
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-2 border border-gray-100">
              <li>
                <button onClick={() => { logout(); window.location.href = '/auth/login'; }} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                  <LogOut className="h-4 w-4 mr-2" />
                  Wyloguj się
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="avatar placeholder ml-1 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="bg-gray-300 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                <span className="text-xs font-semibold">?</span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}