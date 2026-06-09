import { useMemo } from "react";
import { BarChart3, CheckCircle2, CircleSlash2, Users, Layers3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMyBoards, useOrgIssues, useOrgUsers } from "../../lib/workspace-hooks";
import { buildUserDisplayName, getBoardById, isActiveIssue, isCompletedIssue } from "../../lib/workspace-data";

const priorityOrder = ["HIGHEST", "HIGH", "MEDIUM", "LOW", "LOWEST"];

export const Reports = () => {
  const { t } = useTranslation("common");

  const { data: boards = [] } = useMyBoards();
  const { data: issues = [] } = useOrgIssues();
  const { data: users = [] } = useOrgUsers();

  // Restrict all metrics to issues that belong to the user's own boards
  const myBoardIds = useMemo(() => new Set(boards.map((board) => board.id)), [boards]);
  const scopedIssues = useMemo(() => issues.filter((issue) => myBoardIds.has(issue.boardId)), [issues, myBoardIds]);

  const metrics = useMemo(() => {
    const priorityCounts = Object.fromEntries(priorityOrder.map((priority) => [priority, 0]));
    const assigneeCounts = new Map<number, number>();
    const boardCounts = new Map<number, number>();

    for (const issue of scopedIssues) {
      priorityCounts[issue.priority || "MEDIUM"] = (priorityCounts[issue.priority || "MEDIUM"] || 0) + 1;
      boardCounts.set(issue.boardId, (boardCounts.get(issue.boardId) || 0) + 1);
      if (issue.assigneeId) {
        assigneeCounts.set(issue.assigneeId, (assigneeCounts.get(issue.assigneeId) || 0) + 1);
      }
    }

    const activeIssues = scopedIssues.filter((issue) => isActiveIssue(issue, boards));
    const doneIssues = scopedIssues.filter((issue) => isCompletedIssue(issue, boards));
    const unassignedIssues = scopedIssues.filter((issue) => !issue.assigneeId).length;

    return {
      priorityCounts,
      assigneeCounts,
      boardCounts,
      activeIssues,
      doneIssues,
      unassignedIssues,
    };
  }, [boards, scopedIssues]);

  const topAssignees = useMemo(() => {
    return [...metrics.assigneeCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([assigneeId, count]) => ({ user: users.find((item) => item.id === assigneeId), count }));
  }, [metrics.assigneeCounts, users]);

  const topBoards = useMemo(() => {
    return [...metrics.boardCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([boardId, count]) => ({ board: getBoardById(boards, boardId), count }));
  }, [boards, metrics.boardCounts]);

  const statCards = [
    { label: t("reports.total", "Wszystkie zadania"), value: scopedIssues.length, icon: Layers3 },
    { label: t("reports.active", "Aktywne"), value: metrics.activeIssues.length, icon: BarChart3 },
    { label: t("reports.done", "Zrobione"), value: metrics.doneIssues.length, icon: CheckCircle2 },
    { label: t("reports.unassigned", "Bez przypisania"), value: metrics.unassignedIssues, icon: CircleSlash2 },
  ];

  return (
    <div className="min-h-full bg-[#f4f5f7] p-6 md:p-8 text-left">
      <header className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#5e6c84] mb-2">
          <BarChart3 className="h-4 w-4" />
          {t("nav.reports", "Raporty")}
        </div>
        <h1 className="text-3xl font-bold text-[#172b4d]">{t("reports.title", "Raporty i podsumowania")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#5e6c84]">
          {t(
            "reports.subtitle",
            "Widok oparty wyłącznie na danych z aktualnego backendu: tablicach, etapach, użytkownikach i zadaniach."
          )}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {statCards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5e6c84]">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-[#172b4d]">{card.value}</p>
              </div>
              <div className="rounded-2xl bg-[#f4f5f7] p-3 text-[#0052cc]">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#0052cc]" />
            <h2 className="text-lg font-semibold text-[#172b4d]">{t("reports.byAssignee", "Zadania według osoby")}</h2>
          </div>
          <div className="space-y-3">
            {topAssignees.length === 0 ? (
              <p className="text-sm text-[#5e6c84]">{t("reports.noAssigneeData", "Brak danych do wyświetlenia.")}</p>
            ) : (
              topAssignees.map(({ user: assignee, count }) => (
                <div key={assignee?.id ?? count} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#172b4d]">{buildUserDisplayName(assignee)}</p>
                      <p className="text-xs text-[#5e6c84]">{assignee?.email}</p>
                    </div>
                    <span className="rounded-full bg-[#f4f5f7] px-3 py-1 text-sm font-semibold text-[#42526e]">{count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-[#0052cc]" />
            <h2 className="text-lg font-semibold text-[#172b4d]">{t("reports.byBoard", "Zadania według tablic")}</h2>
          </div>
          <div className="space-y-3">
            {topBoards.map(({ board, count }) => (
              <div key={board?.id ?? count} className="rounded-xl border border-gray-200 p-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#172b4d]">{board?.name || t("reports.unknownBoard", "Nieznana tablica")}</p>
                    <p className="text-xs text-[#5e6c84]">{board?.stages?.length || 0} {t("reports.stages", "etapów")}</p>
                  </div>
                  <span className="rounded-full bg-[#f4f5f7] px-3 py-1 text-sm font-semibold text-[#42526e]">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#0052cc]" />
            <h2 className="text-lg font-semibold text-[#172b4d]">{t("reports.byPriority", "Priorytety")}</h2>
          </div>
          <div className="space-y-3">
            {priorityOrder.map((priority) => {
              const count = metrics.priorityCounts[priority] || 0;
              const maxCount = Math.max(...priorityOrder.map((item) => metrics.priorityCounts[item] || 0), 1);
              const width = `${(count / maxCount) * 100}%`;

              return (
                <div key={priority}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#172b4d]">{priority}</span>
                    <span className="text-[#5e6c84]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#e9ebf0] overflow-hidden">
                    <div className="h-full rounded-full bg-[#0052cc]" style={{ width }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};