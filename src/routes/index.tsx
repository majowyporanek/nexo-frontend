import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { MainLayout } from "../layout/MainLayout"
import { ProtectedRoute } from "./components/ProtectedRoute"

import { AuthLayout } from "../pages/auth/AuthLayout";
import { RegisterAdmin } from "../pages/auth/RegisterAdmin";
import { RegisterInvited } from "../pages/auth/RegisterInvited";
import { LoginPage } from "../pages/auth/LoginPage";

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
                        element: <App /> // Temporary Dashboard View
                    },
                    {
                        path: "board/:boardId",
                        element: <div>Kanban Board Placeholder (wait for UX)</div>
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