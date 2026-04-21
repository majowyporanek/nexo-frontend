import { KanbanColumn } from "./KanbanColumn"
import type { Issue } from "./IssueCard"

const teamMembers = [
  { name: "John Doe", color: "#5243AA" },
  { name: "Sarah Chen", color: "#0052CC" },
  { name: "Mike Ross", color: "#00875A" },
  { name: "Emily Davis", color: "#FF5630" },
  { name: "Alex Kim", color: "#6554C0" },
]

const columns: { title: string; status: string; accentColor: string }[] = [
  { title: "To Do", status: "todo", accentColor: "#6B778C" },
  { title: "In Progress", status: "in-progress", accentColor: "#0052CC" },
  { title: "In Review", status: "in-review", accentColor: "#FF991F" },
  { title: "Done", status: "done", accentColor: "#00875A" },
]

const issues: Issue[] = [
  {
    id: "1",
    key: "NEX-101",
    summary: "Implement user authentication flow with OAuth providers",
    type: "story",
    priority: "high",
    storyPoints: 8,
    assignee: { name: "John Doe", color: "#5243AA" },
  },
  {
    id: "2",
    key: "NEX-102",
    summary: "Fix memory leak in dashboard component",
    type: "bug",
    priority: "high",
    storyPoints: 3,
    assignee: { name: "Sarah Chen", color: "#0052CC" },
  },
  {
    id: "3",
    key: "NEX-103",
    summary: "Add pagination to issues list",
    type: "task",
    priority: "medium",
    storyPoints: 5,
    assignee: { name: "Mike Ross", color: "#00875A" },
  },
  {
    id: "4",
    key: "NEX-104",
    summary: "Update API documentation for v2 endpoints",
    type: "task",
    priority: "low",
    storyPoints: 2,
  },
  {
    id: "5",
    key: "NEX-105",
    summary: "Design new notification system with real-time updates",
    type: "story",
    priority: "high",
    storyPoints: 13,
    assignee: { name: "Emily Davis", color: "#FF5630" },
  },
  {
    id: "6",
    key: "NEX-106",
    summary: "Refactor database queries for better performance",
    type: "task",
    priority: "medium",
    storyPoints: 5,
    assignee: { name: "Alex Kim", color: "#6554C0" },
  },
  {
    id: "7",
    key: "NEX-107",
    summary: "Button hover states not working on mobile Safari",
    type: "bug",
    priority: "low",
    storyPoints: 2,
    assignee: { name: "Sarah Chen", color: "#0052CC" },
  },
  {
    id: "8",
    key: "NEX-108",
    summary: "Create reusable modal component library",
    type: "story",
    priority: "medium",
    storyPoints: 8,
    assignee: { name: "John Doe", color: "#5243AA" },
  },
  {
    id: "9",
    key: "NEX-109",
    summary: "Implement dark mode toggle functionality",
    type: "task",
    priority: "low",
    storyPoints: 3,
    assignee: { name: "Mike Ross", color: "#00875A" },
  },
  {
    id: "10",
    key: "NEX-110",
    summary: "Fix incorrect date formatting in reports",
    type: "bug",
    priority: "medium",
    storyPoints: 1,
    assignee: { name: "Emily Davis", color: "#FF5630" },
  },
  {
    id: "11",
    key: "NEX-111",
    summary: "Add unit tests for payment processing module",
    type: "task",
    priority: "high",
    storyPoints: 5,
    assignee: { name: "Alex Kim", color: "#6554C0" },
  },
  {
    id: "12",
    key: "NEX-112",
    summary: "Optimize image loading with lazy loading",
    type: "task",
    priority: "medium",
    storyPoints: 3,
    assignee: { name: "John Doe", color: "#5243AA" },
  },
]

// Distribute issues across columns
const issuesByStatus: Record<string, Issue[]> = {
  todo: issues.slice(0, 4),
  "in-progress": issues.slice(4, 7),
  "in-review": issues.slice(7, 10),
  done: issues.slice(10, 12),
}

export function KanbanBoard() {
  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-theme(spacing.14)-theme(spacing.6)*2)]">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Sprint 1</h1>
          <p className="text-sm font-semibold text-base-content/60">
            April 1 - April 14, 2026 
          </p>
        </div>

        {/* Team Avatars */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-base-content/60 hidden sm:inline">Filter:</span>
          <div className="avatar-group -space-x-3 rtl:space-x-reverse">
            {teamMembers.map((member) => (
              <div 
                key={member.name}
                className="avatar border-base-100 transition-transform hover:z-10 hover:-translate-y-1 cursor-pointer"
                title={member.name}
              >
                  <div className="w-10 rounded-full" style={{ backgroundColor: member.color }}>
                    <span className="text-white text-xs font-bold w-full h-full flex items-center justify-center">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex flex-1 gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            issues={issuesByStatus[column.status] || []}
            accentColor={column.accentColor}
          />
        ))}
      </div>
    </div>
  )
}