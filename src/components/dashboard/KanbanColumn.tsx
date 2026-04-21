import { Plus, MoreHorizontal } from "lucide-react"
import { IssueCard, type Issue } from "./IssueCard"

interface KanbanColumnProps {
  title: string
  issues: Issue[]
  accentColor?: string
}

export function KanbanColumn({ title, issues, accentColor }: KanbanColumnProps) {
  return (
    <div className="flex h-[calc(100vh-14rem)] w-[19rem] flex-shrink-0 flex-col rounded-xl bg-base-200/50 border border-base-300">
      {/* Column Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          {accentColor && (
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          )}
          <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
            {title}
          </h3>
          <span className="badge badge-sm badge-neutral font-semibold">
            {issues.length}
          </span>
        </div>
        <div className="flex items-center">
          <button className="btn btn-square btn-xs btn-ghost text-base-content/60 hover:text-base-content">
            <Plus className="h-4 w-4" />
          </button>
          <button className="btn btn-square btn-xs btn-ghost text-base-content/60 hover:text-base-content">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div
        className={`flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3 pt-1 ${
          issues.length === 0 ? "items-center justify-center" : ""
        }`}
      >
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-base-content/40 p-4 border-2 border-dashed border-base-300 rounded-lg h-full w-full">
              <span className="text-xs font-semibold">Drop issues here</span>
          </div>
        ) : (
          issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  )
}