import { useState } from "react";
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
import { selectIsConnected } from "../redux/user/selectors.ts";
import { useAppSelector } from "../redux/hooks.ts";

const SideBar = () => {
    const [visible, setVisible] = useState(false);
    const isConnected = useAppSelector(selectIsConnected);
    const toggleVisibility = () => {
        setVisible(!visible);
    };

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
                    <button className="flex items-center mb-2">
                        <RefreshCw className="mr-2" />
                        Updates
                    </button>
                    <button className="flex items-center mb-2">
                        <MailCheck className="mr-2" />
                        Email tips
                    </button>
                    <button className="flex items-center mb-2">
                        <Rocket className="mr-2" />
                        Features
                    </button>

                    <hr className="my-4 border-gray-300" />

                    {isConnected ? (
                            <>
                                <h2 className="text-lg font-semibold mb-2">Account</h2>
                                <button className="flex items-center mb-2">
                                    <User className="mr-2" />
                                    Profile
                                </button>
                                <a href={"/post-article"} className="flex items-center mb-2">
                                    <PencilLine className="mr-2" />
                                    Post an article
                                </a>
                                <button className="flex items-center mb-2">
                                    <Newspaper className="mr-2" />
                                    Manage articles
                                </button>
                                <button className="flex items-center mb-2">
                                    <Gauge className="mr-2" />
                                    Dashboard
                                </button>
                                <button className="flex items-center mb-2">
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