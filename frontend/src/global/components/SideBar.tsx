import { useEffect, useState } from "react";
import {
    Gauge,
    LogIn,
    LogOut,
    MailCheck,
    Newspaper,
    PanelLeftClose,
    PanelRightClose,
    PencilLine,
    RefreshCw,
    Rocket,
    User
} from "lucide-react";
import { loadUserState, saveUserState } from "../localStorage.ts";
import { getData } from "../fetchData.ts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks.ts";
import { selectUserState } from "../redux/user/selectors.ts";
import { setIsConnected } from "../redux/user/reducer.ts";
import { setFilters } from "../redux/articles/reducer.ts";

const SideBar = () => {
    const [visible, setVisible] = useState(localStorage.getItem("sidebar") === "true" || false);
    const userState = loadUserState();
    const isConnected = userState?.isConnected;
    const reduxUserState = useAppSelector(selectUserState);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const toggleVisibility = () => {
        localStorage.setItem("sidebar", (!visible).toString());
        setVisible(!visible);
    };
    const logout = async () => {
        const result = await getData("user/logout");
        if (result.success) {
            saveUserState({ ...userState, isConnected: false });
            navigate("/");
        }
    };
    const update = () => {
        dispatch(setFilters({ tags: ["update"], advanced: true }));
        navigate("/");
    };
    const emailTips = () => {
        dispatch(setFilters({ tags: ["email"], advanced: true }));
        navigate("/");
    };
    const features = () => {
        dispatch(setFilters({ tags: ["feature"], advanced: true }));
        navigate("/");
    };

    useEffect(() => {
        if (!reduxUserState.isConnected) {
            setIsConnected(false);
        } else {
            setIsConnected(true);
        }
    }, [reduxUserState]);

    return (
        <div className="relative h-full">
            {visible ? (
                    <button onClick={toggleVisibility}
                            className="transition-all duration-300 ease-in-out bg-gray-100 w-64 p-2">
                        <PanelLeftClose />
                    </button>
                ) :
                <button onClick={toggleVisibility} className="p-2">
                    <PanelRightClose />
                </button>
            }
            <div
                className={`transition-all duration-300 ease-in-out bg-gray-100 overflow-hidden ${
                    visible ? "w-64" : "w-0"
                }`}
                style={{ height: "100vh" }}
                aria-hidden={!visible}
            >

                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">Categories</h2>
                    <button onClick={update} className="flex items-center mb-2">
                        <RefreshCw className="mr-2" />
                        Updates
                    </button>
                    <button onClick={emailTips} className="flex items-center mb-2">
                        <MailCheck className="mr-2" />
                        Email tips
                    </button>
                    <button onClick={features} className="flex items-center mb-2">
                        <Rocket className="mr-2" />
                        Features
                    </button>

                    <hr className="my-4 border-gray-300" />

                    {isConnected ? (
                            <>
                                <h2 className="text-lg font-semibold mb-2">Account</h2>
                                <a href="/profile" className="flex items-center mb-2">
                                    <User className="mr-2" />
                                    Profile
                                </a>
                                <a href={"/post-article"} className="flex items-center mb-2">
                                    <PencilLine className="mr-2" />
                                    Post an article
                                </a>
                                <a href="/manage-articles" className="flex items-center mb-2">
                                    <Newspaper className="mr-2" />
                                    Manage articles
                                </a>
                                <a href="/dashboard" className="flex items-center mb-2">
                                    <Gauge className="mr-2" />
                                    Dashboard
                                </a>
                                <button onClick={logout} className="flex items-center mb-2">
                                    <LogOut className="mr-2" />
                                    Logout
                                </button>
                            </>
                        ) :
                        <>
                            <h2 className="text-lg font-semibold mb-2">Account</h2>
                            <a href="/login" className="flex items-center mb-2">
                                <LogIn className="mr-2" />
                                Login
                            </a>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default SideBar;