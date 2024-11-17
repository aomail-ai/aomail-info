// import { router } from "../../main.tsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const NotFound = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const goHome = () => {
        navigate("/");
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    {t("errorWebPagesTemplates.error404NotFound.pageNotFound")}
                </h2>
                <p className="mb-8 text-gray-600">
                    {t("errorWebPagesTemplates.error404NotFound.pageDoesNotExist")}
                </p>
                <div className="flex justify-center space-x-4">
                    <button onClick={goBack}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                    >
                        {t("errorWebPagesTemplates.error404NotFound.goBack")}
                    </button>
                    <button onClick={goHome}
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                        {t("errorWebPagesTemplates.error404NotFound.goMainPage")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;