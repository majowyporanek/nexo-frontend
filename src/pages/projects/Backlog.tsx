import { useMemo, useState } from "react";
import { CalendarRange, Filter, LayoutGrid, Search, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMyBoards, useOrgIssues, useOrgUsers } from "../../lib/workspace-hooks";
import { buildUserDisplayName, buildUserLookup, getBoardById, getStageById, getIssuePriorityRank, normalizeText } from "../../lib/workspace-data";

export const Backlog = () => {
  const { t } = useTranslation("common");
  const [search, setSearch] = useState("");
  const [boardFilter, setBoardFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  const { data: boards = [], isLoading: boardsLoading } = useMyBoards();
  const { data: issues = [], isLoading: issuesLoading } = useOrgIssues();
  const { data: users = [] } = useOrgUsers();

  const assigneeLookup = useMemo(() => buildUserLookup(users), [users]);

  const filteredIssues = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return issues
      .filter((issue) => boardFilter === "all" || String(issue.boardId) === boardFilter)
      .filter((issue) => assigneeFilter === "all" || String(issue.assigneeId || "") === assigneeFilter)
      .filter((issue) => {
        if (!normalizedSearch) return true;

        const stageInfo = getStageById(boards, issue.stageId);
        const board = getBoardById(boards, issue.boardId);
        const assignee = assigneeLookup.get(issue.assigneeId);

        return [issue.title, issue.description, board?.name, stageInfo?.stage.name, assignee?.email, buildUserDisplayName(assignee)]
          .filter(Boolean)
          .some((value) => normalizeText(String(value)).includes(normalizedSearch));
      })
      .sort((a, b) => getIssuePriorityRank(b.priority) - getIssuePriorityRank(a.priority) || a.title.localeCompare(b.title));
  }, [assigneeFilter, assigneeLookup, boardFilter, boards, issues, search]);

  const boardGroups = useMemo(() => {
    return boards.map((board) => ({
      board,
      issues: filteredIssues.filter((issue) => issue.boardId === board.id),
    }));
  }, [boards, filteredIssues]);

  const isLoading = boardsLoading || issuesLoading;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0052cc] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f4f5f7] p-6 md:p-8 text-left">
      <header className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#5e6c84] mb-2">
          <LayoutGrid className="h-4 w-4" />
          {t("nav.backlog", "Backlog")}
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#172b4d]">{t("backlog.title", "Backlog i plan pracy")}</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#5e6c84]">
              {t(
                "backlog.subtitle",
                "Widok oparty na istniejących tablicach i zadaniach. Możesz tu filtrować pracę bez czekania na dodatkowy backend."
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-[#42526e]">
            <span className="rounded-full bg-white px-3 py-1.5 shadow-sm border border-gray-200">{filteredIssues.length} {t("backlog.items", "zadań")}</span>
            <span className="rounded-full bg-white px-3 py-1.5 shadow-sm border border-gray-200">{boards.length} {t("backlog.boards", "tablic")}</span>
            <span className="rounded-full bg-white px-3 py-1.5 shadow-sm border border-gray-200">{users.length} {t("backlog.people", "osób")}</span>
          </div>
        </div>
      </header>

      <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-3">
          <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5">
            <Search className="h-4 w-4 text-[#5e6c84]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("backlog.searchPlaceholder", "Szukaj po tytule, opisie lub tablicy")}
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5">
            <Filter className="h-4 w-4 text-[#5e6c84]" />
            <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)} className="w-full bg-transparent text-sm outline-none">
              <option value="all">{t("backlog.allBoards", "Wszystkie tablice")}</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5">
            <Users className="h-4 w-4 text-[#5e6c84]" />
            <select value={assigneeFilter} onChange={(e) => setAssigneeFilter(e.target.value)} className="w-full bg-transparent text-sm outline-none">
              <option value="all">{t("backlog.allAssignees", "Wszyscy przypisani")}</option>
              {users.map((person) => (
                <option key={person.id} value={person.id}>
                  {buildUserDisplayName(person)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {filteredIssues.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <CalendarRange className="mx-auto mb-3 h-10 w-10 text-[#5e6c84]" />
          <h2 className="text-lg font-semibold text-[#172b4d]">{t("backlog.emptyTitle", "Brak zadań w backlogu")}</h2>
          <p className="mt-2 text-sm text-[#5e6c84]">{t("backlog.emptyDescription", "Spróbuj zmienić filtr lub dodaj nowe zadania na tablicy.")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {boardGroups
            .filter((group) => boardFilter === "all" || String(group.board.id) === boardFilter)
            .map(({ board, issues: boardIssues }) => (
              <section key={board.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#172b4d]">{board.name}</h2>
                    <p className="text-xs uppercase tracking-wider text-[#5e6c84]">{boardIssues.length} {t("backlog.items", "zadań")}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5e6c84]">
                    <span className="rounded-full bg-[#f4f5f7] px-3 py-1">{board.stages?.length || 0} {t("backlog.stages", "etapów")}</span>
                    <span className="rounded-full bg-[#f4f5f7] px-3 py-1">{board.userIds?.length || 0} {t("backlog.members", "osób")}</span>
                  </div>
                </div>

                <div className="grid gap-3 p-5 lg:grid-cols-2 xl:grid-cols-3">
                  {boardIssues.map((issue) => {
                    const stageInfo = getStageById(boards, issue.stageId);
                    const assignee = assigneeLookup.get(issue.assigneeId);

                    return (
                      <article key={issue.id} className="rounded-2xl border border-gray-200 bg-[#fdfdfd] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5e6c84]">ID-{issue.id}</p>
                            <h3 className="mt-1 text-sm font-semibold text-[#172b4d]">{issue.title}</h3>
                          </div>
                          <span className="rounded-full bg-[#f4f5f7] px-2.5 py-1 text-[11px] font-semibold text-[#42526e]">{issue.priority || "-"}</span>
                        </div>

                        <p className="line-clamp-3 text-sm text-[#5e6c84]">{issue.description || t("backlog.noDescription", "Brak opisu")}</p>

                        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[#5e6c84]">
                          <div>
                            <p className="font-semibold text-[#172b4d]">{stageInfo?.stage.name || t("backlog.noStage", "Bez etapu")}</p>
                            <p>{stageInfo?.stage.type || "-"}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#172b4d]">{buildUserDisplayName(assignee)}</p>
                            <p>{assignee?.email || t("backlog.unassigned", "Nieprzypisane")}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
};
