import { Search, Plus, Bell, Settings, HelpCircle, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-base-300 bg-white px-6">
      {/* Mobile Menu & Search */}
      <div className="flex items-center gap-4 w-full max-w-md">
        <button className="btn btn-square btn-sm btn-ghost md:hidden">
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

        <div className="avatar placeholder ml-1 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="bg-brand text-white rounded-full w-8 shadow-sm">
                <span className="text-xs font-semibold">JD</span>
            </div>
        </div>
      </div>
    </header>
  )
}