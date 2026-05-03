import { KanbanColumn } from "./KanbanColumn"
import type { Issue } from "./IssueCard"
import { useTranslation } from 'react-i18next'

const teamMembers = [
  { name: "John Doe", color: "#5243AA" },
  { name: "Sarah Chen", color: "#0052CC" },
  { name: "Mike Ross", color: "#00875A" },
  { name: "Emily Davis", color: "#FF5630" },
  { name: "Alex Kim", color: "#6554C0" },
]

const columns: { key: string; title: string; status: string; accentColor: string }[] = [
  { key: 'kanban.columns.todo', title: 'To Do', status: 'todo', accentColor: '#6B778C' },
  { key: 'kanban.columns.inProgress', title: 'In Progress', status: 'in-progress', accentColor: '#0052CC' },
  { key: 'kanban.columns.inReview', title: 'In Review', status: 'in-review', accentColor: '#FF991F' },
  { key: 'kanban.columns.done', title: 'Done', status: 'done', accentColor: '#00875A' },
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
  const { t } = useTranslation('common')
  const columnsTranslated = columns.map(c => ({ ...c, title: t(c.key) }))

  return (
    <div className="flex flex-1 flex-col h-full bg-board-bg pb-2">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm font-medium text-gray-500">
        {t('kanban.breadcrumbs')}
      </div>

      {/* Board Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('kanban.sprintTitle')}</h1>
        </div>

        {/* Team Avatars & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 mr-2">
            {teamMembers.map((member) => (
              <div 
                key={member.name}
                className="w-8 h-8 rounded-full border-2 border-board-bg flex items-center justify-center text-xs font-semibold text-white cursor-pointer hover:z-10"
                style={{ backgroundColor: member.color }}
                title={member.name}
              >
                  {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
            ))}
          </div>
          
          <button className="btn h-9 min-h-0 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none shadow-sm font-medium">
            {t('actions.completeSprint')}
          </button>
        </div>
      </div>

      {/* Board Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            className="h-9 w-64 rounded-md border border-gray-300 pl-9 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand bg-white"
          />
        </div>
        <select className="select select-sm h-9 bg-white border-gray-300 text-gray-700 rounded-md font-normal">
          <option>{t('actions.filters.epic')}</option>
        </select>
        <select className="select select-sm h-9 bg-white border-gray-300 text-gray-700 rounded-md font-normal">
          <option>{t('actions.filters.type')}</option>
        </select>
        <div className="h-6 w-[1px] bg-gray-300 mx-2"></div>
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">{t('actions.filters.clearAll')}</button>
      </div>

      {/* Kanban Columns */}
      <div className="flex flex-1 gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {columnsTranslated.map((column) => (
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