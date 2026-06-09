import { useTranslation } from "react-i18next"

import { KanbanColumn } from "./KanbanColumn"
import type { Issue } from "./IssueCard"

const teamMembers = [
	{ name: "John Doe", color: "#5243AA" },
	{ name: "Sarah Chen", color: "#0052CC" },
	{ name: "Mike Ross", color: "#00875A" },
	{ name: "Emily Davis", color: "#FF5630" },
	{ name: "Alex Kim", color: "#6554C0" },
]

const columns: { key: string; status: string; accentColor: string }[] = [
	{ key: "kanban.columns.todo", status: "todo", accentColor: "#6B778C" },
	{
		key: "kanban.columns.inProgress",
		status: "in-progress",
		accentColor: "#0052CC",
	},
	{
		key: "kanban.columns.inReview",
		status: "in-review",
		accentColor: "#FF991F",
	},
	{ key: "kanban.columns.done", status: "done", accentColor: "#00875A" },
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

const issuesByStatus: Record<string, Issue[]> = {
	todo: issues.slice(0, 4),
	"in-progress": issues.slice(4, 7),
	"in-review": issues.slice(7, 10),
	done: issues.slice(10, 12),
}

export function KanbanBoard() {
	const { t } = useTranslation("common")

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-background">
			<div className="flex items-center justify-between px-4 py-3">
				<div>
					<h1 className="text-lg font-semibold text-foreground">Sprint 1</h1>
					<p className="text-xs text-muted-foreground">April 1 - April 14, 2026</p>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs text-muted-foreground">Filter:</span>
					<div className="flex -space-x-1.5">
						{teamMembers.map((member) => (
							<button
								key={member.name}
								className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[10px] font-medium text-white transition-transform hover:z-10 hover:scale-110"
								style={{ backgroundColor: member.color }}
								title={member.name}
							>
								{member.name
									.split(" ")
									.map((part) => part[0])
									.join("")}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-1 gap-3 overflow-x-auto px-4 pb-4">
				{columns.map((column) => (
					<KanbanColumn
						key={column.status}
						title={t(column.key)}
						issues={issuesByStatus[column.status]}
						accentColor={column.accentColor}
					/>
				))}
			</div>
		</div>
	)
}