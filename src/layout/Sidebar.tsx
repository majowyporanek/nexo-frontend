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
    <aside className="flex h-screen w-64 flex-col border-r border-base-300 bg-base-100 hidden md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-base-300">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-content">
          <Hexagon className="h-4 w-4" />
        </div>
        <span className="text-xl font-bold text-base-content">Nexo</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="menu menu-md w-full p-0">
          {navItems.map((item) => (
            <li key={item.label} className="my-0.5">
              <a className={`flex gap-3 px-3 py-2 ${item.active ? 'active bg-primary text-primary-content' : 'hover:bg-base-200'}`}>
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Your Work Section */}
        <div className="mt-8">
          <button
            onClick={() => setYourWorkOpen(!yourWorkOpen)}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-base-content/60 hover:text-base-content"
          >
            {yourWorkOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Your Work
          </button>
          
          {yourWorkOpen && (
            <ul className="menu menu-sm w-full p-0 mt-2">
              {yourWorkItems.map((item) => (
                <li key={item.label} className="my-0.5">
                   <a className="flex justify-between px-3 py-2 hover:bg-base-200">
                    <span className="flex items-center gap-3 text-base-content/80">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <span className="badge badge-neutral badge-sm font-semibold">
                      {item.count}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* User Section (Optional in sidebar, but kept from original design) */}
      <div className="border-t border-base-300 p-4 mt-auto">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-base-200 cursor-pointer">
          <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8">
                  <span className="text-xs">JD</span>
              </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-base-content">John Doe</p>
            <p className="truncate text-xs text-base-content/60">Developer</p>
          </div>
        </div>
      </div>
    </aside>
  )
}