import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Zap, LayoutGrid } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { boardsApi } from "../../api/boards.api";
import { issuesApi } from "../../api/issues.api";
import { usersApi } from "../../api/users.api";
import { buildUserDisplayName, getBoardById, getStageById, isActiveIssue, isCompletedIssue } from "../../lib/workspace-data";

export const ActiveSprints = () => {
  const { token, user } = useAuthStore();
  const { t } = useTranslation("common");

  const { data: boards = [], isLoading: boardsLoading } = useQuery({
    queryKey: ["boards", user?.id, "active-sprints"],
    queryFn: async () => {
      if (!token) return [];
      const allBoards = await boardsApi.getBoards(token);
      return user?.id ? allBoards.filter((board) => board.userIds.includes(user.id)) : allBoards;
    },
    enabled: !!token,
  });

  const { data: issues = [], isLoading: issuesLoading } = useQuery({
    queryKey: ["issues", user?.organizationId, "active-sprints"],
    queryFn: async () => {
      if (!token) return [];
      return issuesApi.getIssues(token);
    },
    enabled: !!token,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users", user?.organizationId, "active-sprints"],
    queryFn: async () => {
      if (!token) return [];
      return usersApi.getUsers(token);
    },
    enabled: !!token,
  });

  const assigneeLookup = useMemo(() => new Map(users.map((item) => [item.id, item])), [users]);

  const sprintBoards = useMemo(() => {
    return boards
      .map((board) => {
        const activeStages = board.stages?.filter((stage) => stage.active) || [];
        const boardIssues = issues.filter((issue) => issue.boardId === board.id);
        const activeIssues = boardIssues.filter((issue) => isActiveIssue(issue, boards));
        const doneIssues = boardIssues.filter((issue) => isCompletedIssue(issue, boards));

        return {
          board,
          activeStages,
          boardIssues,
          activeIssues,
          doneIssues,
          progress: boardIssues.length ? Math.round((doneIssues.length / boardIssues.length) * 100) : 0,
        };
      })
      .filter((item) => item.activeStages.length > 0 || item.activeIssues.length > 0 || item.doneIssues.length > 0);
  }, [boards, issues]);

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
          <Zap className="h-4 w-4" />
          {t("nav.activeSprints", "Aktywne sprinty")}
        </div>
        <h1 className="text-3xl font-bold text-[#172b4d]">{t("sprints.title", "Aktywne sprinty")}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#5e6c84]">
          {t(
            "sprints.subtitle",
            "To jest pochodny widok oparty na istniejących tablicach, etapach i zadaniach. Pokazuje aktualną pracę bez potrzeby nowego modelu sprintu."
          )}
        </p>
      </header>

      {sprintBoards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <LayoutGrid className="mx-auto mb-3 h-10 w-10 text-[#5e6c84]" />
          <h2 className="text-lg font-semibold text-[#172b4d]">{t("sprints.emptyTitle", "Brak aktywnych sprintów")}</h2>
          <p className="mt-2 text-sm text-[#5e6c84]">{t("sprints.emptyDescription", "Dodaj aktywne etapy do tablic, aby zobaczyć tutaj bieżącą pracę.")}</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {sprintBoards.map(({ board, activeStages, boardIssues, activeIssues, doneIssues, progress }) => (
            <section key={board.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5e6c84]">{t("sprints.boardLabel", "Tablica")}</p>
                    <h2 className="mt-1 text-xl font-semibold text-[#172b4d]">{board.name}</h2>
                    <p className="mt-1 text-sm text-[#5e6c84]">{boardIssues.length} {t("sprints.items", "zadań")} • {activeStages.length} {t("sprints.stages", "aktywnych etapów")}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f4f5f7] px-4 py-2 text-right">
                    <p className="text-2xl font-bold text-[#172b4d]">{progress}%</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5e6c84]">{t("sprints.progress", "Postęp")}</p>
                  </div>
                </div>

                <div className="mt-4 h-2 rounded-full bg-[#e9ebf0] overflow-hidden">
                  <div className="h-full rounded-full bg-[#0052cc]" style={{ width: `${progress}%` }} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#42526e]">
                  <span className="rounded-full bg-[#f4f5f7] px-3 py-1">{activeIssues.length} {t("sprints.activeIssues", "w toku")}</span>
                  <span className="rounded-full bg-[#f4f5f7] px-3 py-1">{doneIssues.length} {t("sprints.doneIssues", "gotowe")}</span>
                  <span className="rounded-full bg-[#f4f5f7] px-3 py-1">{board.userIds.length} {t("sprints.members", "członków")}</span>
                </div>
              </div>

              <div className="grid gap-4 p-5">
                {activeStages.map((stage) => {
                  const stageIssues = boardIssues.filter((issue) => issue.stageId === stage.id);
                  return (
                    <div key={stage.id} className="rounded-2xl border border-gray-200 bg-[#fdfdfd] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-[#172b4d]">{stage.name}</h3>
                          <p className="text-xs uppercase tracking-wider text-[#5e6c84]">{stage.type}</p>
                        </div>
                        <span className="rounded-full bg-[#f4f5f7] px-2.5 py-1 text-xs font-semibold text-[#42526e]">{stageIssues.length}</span>
                      </div>

                      {stageIssues.length === 0 ? (
                        <p className="text-sm text-[#5e6c84]">{t("sprints.emptyStage", "Brak zadań w tym etapie.")}</p>
                      ) : (
                        <div className="space-y-2">
                          {stageIssues.map((issue) => {
                            const assignee = assigneeLookup.get(issue.assigneeId);
                            const boardInfo = getBoardById(boards, issue.boardId);
                            const stageInfo = getStageById(boards, issue.stageId);

                            return (
                              <div key={issue.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5e6c84]">{boardInfo?.name}</p>
                                    <p className="mt-1 text-sm font-semibold text-[#172b4d]">{issue.title}</p>
                                  </div>
                                  <span className="rounded-full bg-[#f4f5f7] px-2 py-1 text-[10px] font-semibold text-[#42526e]">{issue.priority || "-"}</span>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-[#5e6c84]">
                                  <span>{stageInfo?.stage.name || stage.name}</span>
                                  <span className="font-medium text-[#172b4d]">{buildUserDisplayName(assignee)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
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