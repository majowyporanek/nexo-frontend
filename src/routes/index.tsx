import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import { MainLayout } from "../layout/MainLayout"

export const router = createBrowserRouter([
    {
        path: "/",
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
    },
    {
        path: "/auth",
        element: <div>Auth Module Placeholder</div>
    }
])