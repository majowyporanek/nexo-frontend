import { Search, Plus, Bell, Settings, HelpCircle, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-base-300 bg-base-100 px-4">
      {/* Mobile Menu & Search */}
      <div className="flex items-center gap-4 w-full max-w-md">
        <button className="btn btn-square btn-sm btn-ghost md:hidden">
            <Menu className="h-5 w-5" />
        </button>
        
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            placeholder="Search issues, projects..."
            className="input input-sm input-bordered w-full pl-9 bg-base-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="btn btn-sm btn-primary gap-1.5 px-4 font-bold">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create</span>
        </button>

        <div className="divider divider-horizontal mx-0"></div>

        <button className="btn btn-square btn-sm btn-ghost relative">
          <Bell className="h-4 w-4 text-base-content/70" />
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
          </span>
        </button>

        <button className="btn btn-square btn-sm btn-ghost hidden sm:flex">
          <HelpCircle className="h-4 w-4 text-base-content/70" />
        </button>

        <button className="btn btn-square btn-sm btn-ghost hidden sm:flex">
          <Settings className="h-4 w-4 text-base-content/70" />
        </button>

        <div className="avatar placeholder ml-2 cursor-pointer">
            <div className="bg-neutral text-neutral-content rounded-full w-8">
                <span className="text-xs font-semibold">UX</span>
            </div>
        </div>
      </div>
    </header>
  )
}