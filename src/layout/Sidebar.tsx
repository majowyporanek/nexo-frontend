import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Zap,
  Layers,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  Clock,
  Hexagon,
  X
} from "lucide-react"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navItems = [
  { icon: LayoutDashboard, key: "nav.dashboard", active: false },
  { icon: Zap, key: "nav.activeSprints", active: true },
  { icon: Layers, key: "nav.backlog", active: false },
  { icon: BarChart3, key: "nav.reports", active: false },
  { icon: Settings, key: "nav.settings", active: false },
]

const yourWorkItems = [
  { icon: ClipboardList, key: "yourWork.assigned", count: 5 },
  { icon: Clock, key: "yourWork.recent", count: 12 },
  { icon: CheckCircle2, key: "yourWork.done", count: 24 },
]

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [yourWorkOpen, setYourWorkOpen] = useState(true)
  const { user } = useAuthStore()
  const { t } = useTranslation('common')

  // Inicjały
  const getInitials = (email: string) => {
    if (!email) return "?"
    const parts = email.split('@')[0].split('.')
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] flex-col bg-sidebar-bg text-sidebar-text border-r border-[#4e2233] transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[#4e2233]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#6b2c44]">
              <Hexagon className="h-5 w-5 text-white" />
            </div>
            <div className="bg-[#004fcf] text-white px-2 py-0.5 rounded shadow-sm">
              <span className="text-xl font-bold tracking-tight leading-none">Nexo</span>
            </div>
          </div>
          
          <button 
            className="md:hidden p-1 text-sidebar-text hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                className={`flex gap-3 px-3 py-2 rounded-md font-medium cursor-pointer transition-colors ${
                  item.active ? 'bg-sidebar-hover text-white flex-row' : 'hover:bg-sidebar-hover/60 hover:text-white text-sidebar-text'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">{t(item.key)}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Your Work Section */}
        <div className="mt-8">
          <button
            onClick={() => setYourWorkOpen(!yourWorkOpen)}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-sidebar-text/70 hover:text-white"
          >
            {yourWorkOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {t('sidebar.yourWorkTitle', 'Your Work')}
          </button>
          
          {yourWorkOpen && (
            <ul className="mt-2 space-y-1">
              {yourWorkItems.map((item) => (
                <li key={item.key}>
                   <a className="flex justify-between px-3 py-2 rounded-md hover:bg-sidebar-hover/60 cursor-pointer text-sidebar-text hover:text-white text-sm">
                    <span className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-sidebar-text/70" />
                      {t(item.key)}
                    </span>
                    <span className="bg-white/10 text-white rounded-sm px-1.5 py-0.5 text-xs font-semibold">
                      {item.count}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-[#4e2233] p-4 mt-auto">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-hover cursor-pointer">
          <div className="avatar placeholder">
              <div className="bg-[#0052CC] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-semibold">{getInitials(user?.email || "")}</span>
              </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.email || "Użytkownik"}</p>
            <p className="truncate text-xs text-sidebar-text/70">{user?.role || "Brak Roli"}</p>
          </div>
        </div>
      </div>
      </aside>
    </>
  )
}