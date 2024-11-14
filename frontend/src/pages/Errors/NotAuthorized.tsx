import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { router } from "../../main.tsx";

const NotAuthorized = () => {
    const { t } = useTranslation();
    let countdown = 5;
    let timer: ReturnType<typeof setInterval>;

    const updateCountdown = (): void => {
        countdown -= 1;

        if (countdown <= 0) {
            redirectNow();
        }
    };

    const redirectNow = (): void => {
        clearInterval(timer);
        router.navigate("/");
    };

    useEffect(() => {
        timer = setInterval(updateCountdown, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-semibold mb-4">
                    {t("errorWebPagesTemplates.error401Page.youAreNotConnected")}
                </h1>
                <p className="mb-4">
                    {t("errorWebPagesTemplates.error401Page.redirectionToLogin")}
                    <span className="font-bold">{{ countdown }}</span>
                    seconds
                </p>
                <button onClick={redirectNow}
                        className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                    {t("errorWebPagesTemplates.error401Page.redirectNow")}
                </button>
            </div>
        </div>
    );
};

export default NotAuthorized;