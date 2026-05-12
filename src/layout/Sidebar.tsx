import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from "react-router-dom"
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
  X,
  Plus,
  Layout
} from "lucide-react"

interface Board {
  id: number;
  name: string;
  organizationId: number;
  userIds: number[];
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenCreateBoard: () => void;
  boards: Board[];             
}

const navItems = [
  { icon: LayoutDashboard, key: "nav.dashboard", path: "/dashboard" },
  { icon: Zap, key: "nav.activeSprints", path: "/active-sprints" },
  { icon: Layers, key: "nav.backlog", path: "/backlog" },
  { icon: BarChart3, key: "nav.reports", path: "/reports" },
  { icon: Settings, key: "nav.settings", path: "/settings" },
]

const yourWorkItems = [
  { icon: ClipboardList, key: "yourWork.assigned", count: 5 },
  { icon: Clock, key: "yourWork.recent", count: 12 },
  { icon: CheckCircle2, key: "yourWork.done", count: 24 },
]

export function Sidebar({ isOpen = false, onClose, onOpenCreateBoard, boards }: SidebarProps) {
  const [yourWorkOpen, setYourWorkOpen] = useState(true)
  const [boardsOpen, setBoardsOpen] = useState(true)
  const { user } = useAuthStore()
  const { t } = useTranslation('common')
  const location = useLocation()

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
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] flex-col bg-sidebar-bg text-sidebar-text border-r border-[#4e2233] transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[#4e2233]">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href='/dashboard'}>
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#6b2c44] bg-[#2d121c]">
              <Hexagon className="h-5 w-5 text-white fill-white/10" />
            </div>
            <div className="bg-[#004fcf] text-white px-2 py-0.5 rounded shadow-sm">
              <span className="text-xl font-bold tracking-tight">Nexo</span>
            </div>
          </div>
          <button className="md:hidden p-1 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    location.pathname === item.path 
                      ? 'bg-sidebar-hover text-white' 
                      : 'text-sidebar-text hover:bg-sidebar-hover/60 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4.5 w-4.5" />
                  <span>{t(item.key)}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <div className="flex items-center justify-between group px-3 py-2">
              <button
                onClick={() => setBoardsOpen(!boardsOpen)}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-sidebar-text/50 hover:text-white transition-colors"
              >
                {boardsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                {t('sidebar.boardsTitle', 'Tablice')}
              </button>
              
              {user?.role === 'ADMIN' && (
                <button 
                  onClick={onOpenCreateBoard}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-sidebar-hover rounded text-sidebar-text/70 hover:text-white transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {boardsOpen && (
              <ul className="mt-1 space-y-0.5">
                {boards.map((board) => (
                  <li key={board.id}>
                    <Link
                      to={`/boards/${board.id}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        location.pathname === `/boards/${board.id}`
                        ? 'bg-sidebar-hover text-white'
                        : 'text-sidebar-text hover:bg-sidebar-hover/40 hover:text-white'
                      }`}
                    >
                      <Layout className="h-4 w-4 text-blue-400/80" />
                      <span className="truncate">{board.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 border-t border-[#4e2233] pt-4 text-left">
            <button
              onClick={() => setYourWorkOpen(!yourWorkOpen)}
              className="flex w-full items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-sidebar-text/50 hover:text-white"
            >
              {yourWorkOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              {t('sidebar.yourWorkTitle', 'Twoja Praca')}
            </button>
            
            {yourWorkOpen && (
              <ul className="mt-1 space-y-0.5">
                {yourWorkItems.map((item) => (
                  <li key={item.key}>
                    <button className="flex w-full justify-between px-3 py-2 rounded-md hover:bg-sidebar-hover/40 text-sidebar-text hover:text-white text-sm transition-colors text-left">
                      <span className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 opacity-70" />
                        {t(item.key)}
                      </span>
                      <span className="bg-white/5 text-[10px] text-white/60 rounded px-1.5 py-0.5 font-mono">
                        {item.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        <div className="border-t border-[#4e2233] bg-[#2d121c]/50 p-4">
          <div 
            onClick={() => window.location.href='/profile'}
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-hover cursor-pointer group text-left"
          >
            <div className="avatar placeholder">
              <div className="bg-[#0052CC] text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md ring-2 ring-transparent group-hover:ring-white/20">
                <span className="text-xs font-bold">{getInitials(user?.email || "")}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-bold text-white leading-none mb-1">{user?.email}</p>
              <p className="truncate text-[10px] uppercase tracking-tighter text-sidebar-text/50 font-bold">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}