import { Bug, CheckSquare, BookOpen, ArrowUp, ArrowRight, ArrowDown } from "lucide-react"

export type IssueType = "bug" | "task" | "story"
export type Priority = "high" | "medium" | "low"

export interface Issue {
  id: string
  key: string
  summary: string
  type: IssueType
  priority: Priority
  storyPoints?: number
  assignee?: {
    name: string
    avatar?: string
    color?: string
  }
}

const issueTypeConfig = {
  bug: {
    icon: Bug,
    color: "text-error",
    bgColor: "bg-error/20",
  },
  task: {
    icon: CheckSquare,
    color: "text-info",
    bgColor: "bg-info/20",
  },
  story: {
    icon: BookOpen,
    color: "text-success",
    bgColor: "bg-success/20",
  },
}

const priorityConfig = {
  high: {
    icon: ArrowUp,
    color: "text-error",
    label: "High",
  },
  medium: {
    icon: ArrowRight,
    color: "text-warning",
    label: "Medium",
  },
  low: {
    icon: ArrowDown,
    color: "text-info",
    label: "Low",
  },
}

interface IssueCardProps {
  issue: Issue
}

export function IssueCard({ issue }: IssueCardProps) {
  const TypeIcon = issueTypeConfig[issue.type].icon
  const PriorityIcon = priorityConfig[issue.priority].icon

  return (
    <div className="group cursor-pointer rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      {/* Summary */}
      <p className="mb-4 text-sm leading-snug text-base-content font-medium">
        {issue.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Issue Type */}
          <div
            className={`flex h-6 w-6 items-center justify-center rounded ${issueTypeConfig[issue.type].bgColor}`}
            title={issue.type}
          >
            <TypeIcon
              className={`h-4 w-4 ${issueTypeConfig[issue.type].color}`}
            />
          </div>

          {/* Issue Key */}
          <span className="text-xs font-semibold text-base-content/70 hover:underline">
            {issue.key}
          </span>

          {/* Priority */}
          <PriorityIcon
            className={`h-4 w-4 ${priorityConfig[issue.priority].color}`}
            title={`Priority: ${priorityConfig[issue.priority].label}`}
          />

          {/* Story Points */}
          {issue.storyPoints && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-base-200 px-1.5 text-xs font-bold text-base-content/70">
              {issue.storyPoints}
            </span>
          )}
        </div>

        {/* Assignee */}
        {issue.assignee && (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
            style={{ backgroundColor: issue.assignee.color || "var(--fallback-p)" }}
            title={`Assignee: ${issue.assignee.name}`}
          >
            {issue.assignee.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        )}
      </div>
    </div>
  )
}