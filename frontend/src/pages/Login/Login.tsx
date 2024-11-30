import { useEffect, useRef, useState } from "react";
import { postData } from "../../global/fetchData.ts";
import { useNavigate } from "react-router-dom";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { useDispatch } from "react-redux";
import i18n from "i18next";
import { saveUserState } from "../../global/localStorage.ts";
import { setUserState } from "../../global/redux/user/reducer.ts";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const timerId = useRef<NodeJS.Timeout | null>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!username) {
            displayPopup("error", "Invalid username", "Username is required");
            return;
        } else if (!password) {
            displayPopup("error", "Invalid password", "Password is required");
            return;
        }
        const result = await postData("login", { username, password });
        if (!result.success) {
            displayPopup("error", "Invalid credentials", result.error as string);
        } else {
            dispatch(
                setUserState({
                    ...result.data,
                    language: i18n.language,
                    isConnected: true
                })
            );
            saveUserState({
                ...result.data,
                language: i18n.language,
                isConnected: true
            });
            navigate("/dashboard");
        }
    };

    const displayPopup = (type: "success" | "error", title: string, message: string) => {
        if (type === "error") {
            displayErrorPopup(
                setShowNotification,
                setNotificationTitle,
                setNotificationMessage,
                setBackgroundColor,
                title,
                message
            );
        } else {
            displaySuccessPopup(
                setShowNotification,
                setNotificationTitle,
                setNotificationMessage,
                setBackgroundColor,
                title,
                message
            );
        }
        timerId.current = setTimeout(() => {
            setShowNotification(false);
        }, 4000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
            e.preventDefault();
            if (document.activeElement === usernameRef.current) {
                passwordRef.current?.focus();
            } else {
                usernameRef.current?.focus();
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            void handleLogin();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [username, password]);

    return (
        <>
            <NotificationTimer
                showNotification={showNotification}
                notificationTitle={notificationTitle}
                notificationMessage={notificationMessage}
                backgroundColor={backgroundColor}
                onDismiss={() => setShowNotification(false)}
            />
            <div className="flex min-h-screen items-center justify-center bg-gray-100 p-12">
                <div className="space-y-8 text-center">
                    <h1 className="text-xl font-semibold text-gray-800">Sign-in to your account</h1>
                    <p className="text-sm tracking-wide text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="/signup"
                            className="text-blue-600 transition duration-200 hover:underline"
                        >
                            Signup
                        </a>{" "}
                        for free
                    </p>

                    <div className="space-y-6">
                        <input
                            ref={usernameRef}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-transparent text-gray-800 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Your Username"
                            type="text"
                            name="username"
                            id="username"
                        />

                        <input
                            ref={passwordRef}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent text-gray-800 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Your Password"
                            type="password"
                            name="password"
                            id="password"
                        />

                        <button
                            onClick={handleLogin}
                            className="h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition duration-300 rounded-md text-white"
                        >
                            Sign-in
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
