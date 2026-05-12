import { Search, Plus, Bell, Menu, LogOut, User, Users } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

interface HeaderProps {
  onMenuClick?: () => void;
  onCreateClick: () => void;
}

export function Header({ onMenuClick, onCreateClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.')
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('nexo_lang', lng)
  }

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const currentLang = i18n.language || 'pl'

  return (
    <header className="flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4 w-full max-w-md">
        <button className="btn btn-square btn-sm btn-ghost md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full max-w-[400px] hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('header.search', 'Szukaj...')}
            className="input input-bordered h-10 w-full pl-10 bg-gray-50/50 border-gray-200 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand rounded-md text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === 'ADMIN'&& (
        <button 
          onClick={onCreateClick}
          className="btn h-9 min-h-0 bg-brand hover:bg-brand/90 text-white border-none gap-1.5 px-4 font-semibold rounded-md shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">
            {t('header.create', 'Utwórz')}
          </span>
        </button>
        )}

        <label className="hidden sm:flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 shadow-sm">
          <span>{t('header.language')}:</span>
          <select value={currentLang} onChange={(e) => changeLang(e.target.value)} className="select select-xs select-ghost h-7 min-h-0 px-1 focus:outline-none font-bold">
            <option value="pl">PL</option>
            <option value="en">EN</option>
          </select>
        </label>

        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex flex-col items-end hidden sm:flex text-right">
                <span className="text-sm font-medium leading-tight text-gray-700">{user.email}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase">{user.role}</span>
              </div>
              <div className="avatar placeholder shadow-sm rounded-full bg-[#0052CC] text-white w-9 h-9 flex items-center justify-center">
                <span className="text-sm font-semibold">{getInitials(user.email)}</span>
              </div>
            </div>

            <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow-2xl bg-white border border-gray-100 rounded-box w-64 mt-2 text-gray-800">
              <li className="menu-title px-4 py-2 text-xs font-bold text-gray-400 uppercase">
                {t('nav.account', 'Konto')}
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-3 py-3 hover:bg-gray-50">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{t('nav.myProfile', 'Mój profil')}</span>
                </Link>
              </li>
              <li>
                <Link to="/organization/members" className="flex items-center gap-3 py-3 hover:bg-gray-50">
                  <Users className="h-4 w-4 text-brand" />
                  <span className="font-medium">{t('nav.organization', 'Organizacja')}</span>
                </Link>
              </li>
              <div className="divider my-1 opacity-50"></div>
              <li>
                <button onClick={handleLogout} className="flex items-center gap-3 py-3 text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">{t('header.logout')}</span>
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="bg-gray-300 rounded-full w-9 h-9 animate-pulse"></div>
        )}
      </div>
    </header>
  )
}