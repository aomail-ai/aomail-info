import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveUserState } from "../../global/localStorage.ts";
import { useAppSelector } from "../../global/redux/hooks.ts";
import { setIsConnected } from "../../global/redux/user/reducer.ts";

const NotAuthorized = () => {
    const { t } = useTranslation();
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    dispatch(setIsConnected(false));
    const userState = useAppSelector((state) => state.user);
    saveUserState({ ...userState, isConnected: false });

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    navigate("/login");
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const redirectNow = (): void => {
        navigate("/login");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-semibold mb-4">
                    {t("errorWebPagesTemplates.error401NotAuthorized.youAreNotConnected")}
                </h1>
                <p className="mb-4">
                    {t("errorWebPagesTemplates.error401NotAuthorized.redirectionToLogin")}
                    <div>{countdown}</div>
                    seconds
                </p>
                <button
                    onClick={redirectNow}
                    className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                >
                    {t("errorWebPagesTemplates.error401NotAuthorized.redirectNow")}
                </button>
            </div>
        </div>
    );
};

export default NotAuthorized;
