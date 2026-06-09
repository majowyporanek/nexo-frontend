import { useQuery } from "@tanstack/react-query";
import { boardsApi, Board } from "../api/boards.api";
import { issuesApi } from "../api/issues.api";
import { usersApi } from "../api/users.api";
import { useAuthStore } from "../store/useAuthStore";

// Boards belonging to the authenticated user's organization, filtered to the
// boards the user is actually a member of.
export const useMyBoards = () => {
  const { token, user } = useAuthStore();

  return useQuery({
    queryKey: ["boards", user?.id],
    queryFn: async (): Promise<Board[]> => {
      if (!token) return [];
      const allBoards = await boardsApi.getBoards(token);
      return user?.id ? allBoards.filter((board) => board.userIds.includes(user.id)) : allBoards;
    },
    enabled: !!token,
  });
};

// All issues for the authenticated user's organization.
export const useOrgIssues = () => {
  const { token, user } = useAuthStore();

  return useQuery({
    queryKey: ["issues", "org", user?.organizationId],
    queryFn: () => issuesApi.getIssues(token || ""),
    enabled: !!token,
  });
};

// All users for the authenticated user's organization.
export const useOrgUsers = () => {
  const { token, user } = useAuthStore();

  return useQuery({
    queryKey: ["users", "org", user?.organizationId],
    queryFn: () => usersApi.getUsers(token || ""),
    enabled: !!token,
  });
};
