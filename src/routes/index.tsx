import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard /> 
                    },
                    {
                        path: "boards/:boardId",
                        element: <BoardView />
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
    }
])