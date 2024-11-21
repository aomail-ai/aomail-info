import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLanguage } from "../redux/user/actions.ts";


const LanguageModal = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const modalRef = useRef(null);
    const dispatch = useDispatch();

    const selectLanguage = (language) => {
        localStorage.setItem("language", language);
        i18n.changeLanguage(language);
        dispatch(setLanguage(language));
        onClose();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center px-4 z-50"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto"
                role="dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        aria-label="Close modal"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                             aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {t("header.languageSelectionModal.title")}
                    </h3>
                    <div className="mt-2">
                        <div className="space-y-2">
                            <button
                                className="language-button w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                                onClick={() => selectLanguage("fr")}
                            >
                                <img src="/flag-france.png" alt="French Flag" className="h-4 w-4 mr-2" />
                                {t("header.languageSelectionModal.french")}
                            </button>
                            <button
                                className="language-button w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                                onClick={() => selectLanguage("en")}
                            >
                                <img src="/flag-united-kingdom.png" alt="United Kingdom Flag"
                                     className="h-4 w-4 mr-2" />
                                {t("header.languageSelectionModal.english")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageModal;