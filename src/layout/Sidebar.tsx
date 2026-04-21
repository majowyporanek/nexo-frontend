import { useState } from "react"
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
} from "lucide-react"
import { cn } from "../lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Zap, label: "Active Sprints", active: true },
  { icon: Layers, label: "Backlog", active: false },
  { icon: BarChart3, label: "Reports", active: false },
  { icon: Settings, label: "Settings", active: false },
]

const yourWorkItems = [
  { icon: ClipboardList, label: "Assigned to me", count: 5 },
  { icon: Clock, label: "Recent", count: 12 },
  { icon: CheckCircle2, label: "Done", count: 24 },
]

export function Sidebar() {
  const [yourWorkOpen, setYourWorkOpen] = useState(true)

  return (
    <aside className="flex h-screen w-[260px] flex-col bg-sidebar-bg text-sidebar-text hidden md:flex border-r border-[#4e2233]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-[18px] border-b border-[#4e2233]">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#6b2c44]">
          <Hexagon className="h-5 w-5 text-white" />
        </div>
        <div className="bg-[#004fcf] text-white px-2 py-0.5 rounded shadow-sm">
          <span className="text-xl font-bold tracking-tight leading-none">Nexo</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <a 
                className={`flex gap-3 px-3 py-2 rounded-md font-medium cursor-pointer transition-colors ${
                  item.active ? 'bg-sidebar-hover text-white flex-row' : 'hover:bg-sidebar-hover/60 hover:text-white text-sidebar-text'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
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
            Your Work
          </button>
          
          {yourWorkOpen && (
            <ul className="mt-2 space-y-1">
              {yourWorkItems.map((item) => (
                <li key={item.label}>
                   <a className="flex justify-between px-3 py-2 rounded-md hover:bg-sidebar-hover/60 cursor-pointer text-sidebar-text hover:text-white text-sm">
                    <span className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-sidebar-text/70" />
                      {item.label}
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
              <div className="bg-brand text-white rounded-full w-8">
                  <span className="text-xs font-semibold">JD</span>
              </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-white">John Doe</p>
            <p className="truncate text-xs text-sidebar-text/70">Developer</p>
          </div>
        </div>
      </div>
    </aside>
  )
}