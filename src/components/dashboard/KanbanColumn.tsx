import { Plus, MoreHorizontal } from "lucide-react"
import { IssueCard, type Issue } from "./IssueCard"

interface KanbanColumnProps {
  title: string
  issues: Issue[]
  accentColor?: string
}

export function KanbanColumn({ title, issues, accentColor }: KanbanColumnProps) {
  return (
    <div className="flex h-full w-[280px] md:min-w-[280px] md:max-w-[400px] flex-1 flex-shrink-0 flex-col rounded-md bg-[#f4f5f7] border-none shadow-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-3 sticky top-0 z-10 rounded-t-md">
        <div className="flex items-center gap-2">
          {accentColor && (
            <div
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: accentColor }}
            />
          )}
          <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
            {title}
            <span className="ml-2 font-normal text-gray-400">{issues.length}</span>
          </h3>
        </div>
        <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
          <button className="btn btn-square btn-ghost btn-xs text-gray-500 rounded hover:bg-gray-200">
            <Plus className="h-4 w-4" />
          </button>
          <button className="btn btn-square btn-ghost btn-xs text-gray-500 rounded hover:bg-gray-200">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div
        className={`flex flex-1 flex-col gap-2 overflow-y-auto px-1.5 pb-2 custom-scrollbar ${
          issues.length === 0 ? "items-center justify-start p-2" : ""
        }`}
      >
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 p-4 border-2 border-dashed border-gray-200 rounded bg-white w-full">
              <span className="text-xs font-medium">Drop issues</span>
          </div>
        ) : (
          issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  )
}