import { Board, Stage } from "../api/boards.api";
import { Issue } from "../api/issues.api";
import { User } from "../api/users.api";

export const normalizeText = (value: string) => value.trim().toLowerCase();

export const getBoardStages = (board: Board): Stage[] => board.stages || [];

export const getStageById = (boards: Board[], stageId: number) => {
  for (const board of boards) {
    const stage = board.stages?.find((item) => item.id === stageId);
    if (stage) {
      return { board, stage };
    }
  }

  return null;
};

export const getBoardById = (boards: Board[], boardId: number) => boards.find((board) => board.id === boardId);

export const isCompletedIssue = (issue: Issue, boards: Board[]) => {
  const match = getStageById(boards, issue.stageId);
  return match?.stage.type === "DONE" || match?.stage.name.toLowerCase().includes("done") || match?.stage.name.toLowerCase().includes("zrob");
};

export const isActiveIssue = (issue: Issue, boards: Board[]) => {
  const match = getStageById(boards, issue.stageId);
  return !!match?.stage.active && !isCompletedIssue(issue, boards);
};

export const buildUserDisplayName = (user?: User) => {
  if (!user) return "Nieprzypisane";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return fullName || user.email;
};

export const getIssuePriorityRank = (priority?: string) => {
  switch (priority) {
    case "HIGHEST":
      return 5;
    case "HIGH":
      return 4;
    case "MEDIUM":
      return 3;
    case "LOW":
      return 2;
    case "LOWEST":
      return 1;
    default:
      return 0;
  }
};