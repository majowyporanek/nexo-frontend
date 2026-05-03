import { Bug, CheckSquare, BookOpen, ArrowUp, ArrowRight, ArrowDown } from "lucide-react"
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('common')
  const TypeIcon = issueTypeConfig[issue.type].icon
  const PriorityIcon = priorityConfig[issue.priority].icon

  return (
    <div className="group cursor-pointer rounded bg-white p-3 shadow-[0_1px_2px_rgba(9,30,66,0.25)] transition-all duration-150 hover:bg-gray-50 border-none mx-1">
      {/* Summary */}
      <p className="mb-3 text-[14px] leading-snug text-gray-800 font-normal">
        {issue.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {/* Issue Type */}
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-sm ${issueTypeConfig[issue.type].bgColor}`}
            title={issue.type}
          >
            <TypeIcon
              className={`h-3.5 w-3.5 ${issueTypeConfig[issue.type].color}`}
            />
          </div>

          {/* Issue Key */}
          <span className="text-[13px] font-medium text-gray-500 hover:underline hover:text-brand">
            {issue.key}
          </span>
        </div>

        {/* Priority & Story Points & Assignee container */}
        <div className="flex items-center gap-1.5">
            {/* Priority */}
            <div title={t(`issue.priority.${issue.priority}`)}>
              <PriorityIcon
                className={`h-4 w-4 ${priorityConfig[issue.priority].color}`}
              />
            </div>

            {/* Story Points */}
            {issue.storyPoints && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-xs font-bold text-gray-600">
                {issue.storyPoints}
              </span>
            )}

            {/* Assignee */}
            {issue.assignee && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm ml-1"
                style={{ backgroundColor: issue.assignee.color || "#091E42" }}
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
    </div>
  )
}