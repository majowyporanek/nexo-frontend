import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { AuthLayout } from "../pages/auth/AuthLayout";
import { RegisterAdmin } from "../pages/auth/RegisterAdmin";
import { RegisterInvited } from "../pages/auth/RegisterInvited";
import { LoginPage } from "../pages/auth/LoginPage";
import { UserProfile } from "../pages/profile/UserProfile";
import { OrganizationSettings } from "../pages/organization/OrganizationSettings";
import { MembersList } from "../pages/organization/MembersList";
import { BoardView } from "../pages/projects/BoardView";
import { Dashboard } from "../pages/projects/Dashboard";
import { Backlog } from "../pages/projects/Backlog";
import { ActiveSprints } from "../pages/projects/ActiveSprints";
import { Reports } from "../pages/projects/Reports";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/dashboard" replace />
                    },
                    {
                        path: "dashboard",
                        element: <Dashboard /> 
                    },
                    {
                        path: "boards/:boardId",
                        element: <BoardView />
                    },
                    {
                        path: "active-sprints",
                        element: <ActiveSprints />
                    },
                    {
                        path: "backlog",
                        element: <Backlog />
                    },
                    {
                        path: "reports",
                        element: <Reports />
                    },
                    {
                        path: "settings",
                        element: <Navigate to="/organization/settings" replace />
                    },
                    {
                        path: "profile",
                        element: <UserProfile />
                    },
                    {
                        path: "organization/settings",
                        element: <OrganizationSettings />
                    },
                    {
                        path: "organization/members",
                        element: <MembersList />
                    }
                ]
            }
        ]
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <LoginPage />
            },
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "register-admin",
                element: <RegisterAdmin />
            },
            {
                path: "register-invited",
                element: <RegisterInvited />
            }
        ]
    },
    {
        path: "/settings",
        element: <Navigate to="/organization/settings" replace />
    }
])