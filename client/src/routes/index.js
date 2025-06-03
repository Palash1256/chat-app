import { createBrowserRouter, Navigate } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import App from "../App";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import ForgotPassword from "../pages/ForgotPassword";

// PublicRoute: Redirect to home if token exists
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: "register",
                element: <AuthLayouts><RegisterPage /></AuthLayouts>
            },
            {
                path: 'email',
                element: (
                    <PublicRoute>
                        <AuthLayouts><CheckEmailPage /></AuthLayouts>
                    </PublicRoute>
                )
            },
            {
                path: "password",
                element: (
                    <PublicRoute>
                        <AuthLayouts><CheckPasswordPage /></AuthLayouts>
                    </PublicRoute>
                )
            },
            {
                path: 'forgot-password',
                element: <AuthLayouts><ForgotPassword /></AuthLayouts>
            },
            {
                path: "",
                element: <Home />,
                children: [
                    {
                        path: ":userId",
                        element: <MessagePage />
                    }
                ]
            }
        ]
    }
])

export default router