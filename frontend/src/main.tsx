import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/index.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/Errors/NotFound.tsx";
import App from "./App.tsx";
import NotAuthorized from "./pages/Errors/NotAuthorized.tsx";


export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            errorElement: <NotFound />,
            children: [
                {
                    path: "/not-authorized",
                    element: <NotAuthorized />
                }
            ]
        }
    ]
);


createRoot(document.getElementById("root")!).render(
    <RouterProvider router={router} />
);
