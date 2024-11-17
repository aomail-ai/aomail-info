import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelectionModal from "./LanguageSelectionModal";
import { AOMAIL_APP_URL } from "../constants.ts";
import SearchBar from "./SearchBar.tsx";


const allowedLanguages = ["fr", "en"];
const languages = {
    fr: "/flag-france.png",
    en: "flag-united-kingdom.png"
};

const Header = () => {
    const { t, i18n } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const [isLanguageSelectionModalOpen, setLanguageSelectionModalOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language") || "en";
        if (allowedLanguages.includes(storedLanguage)) {
            setCurrentLanguage(storedLanguage);
            i18n.changeLanguage(storedLanguage);
        }
    }, [i18n]);

    useEffect(() => {
        const handleLanguageChange = (lng) => {
            setCurrentLanguage(lng);
        };

        i18n.on("languageChanged", handleLanguageChange);

        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, [i18n]);


    useEffect(() => {
        const checkIfMobile = () => setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

    const openLanguageModal = () => {
        setMobileMenuOpen(false);
        setLanguageSelectionModalOpen(true);
    };

    const closeLanguageModal = () => setLanguageSelectionModalOpen(false);

    return (
        <header className="sticky inset-x-0 top-0 z-50 bg-white border-b border-gray-200">
            <LanguageSelectionModal isOpen={isLanguageSelectionModalOpen} onClose={closeLanguageModal} />

            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex items-center lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <img className="h-12 w-auto" src="/logo-aomail-name.png" alt="Aomail logo" />
                    </a>
                </div>

                {/* Desktop Menu */}
                <div className={`hidden ${!isMobile ? "lg:flex" : "lg:hidden"} lg:flex-1 lg:justify-center`}>
                    <SearchBar />
                </div>

                <div
                    className={`hidden ${!isMobile ? "lg:flex" : "lg:hidden"} items-center lg:flex-1 lg:justify-end lg:gap-x-8`}>
                    <a
                        href={`${AOMAIL_APP_URL}signup`}
                        className="text-center rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 CTA"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("constants.actions.joinBeta")}
                    </a>
                    <button className="open-popup-button text-gray-500 hover:text-gray-600" onClick={openLanguageModal}>
                        <img className="currentLanguageIcon h-6 w-6 mr-2" src={languages[currentLanguage]}
                             alt="Language Icon" />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 lg:hidden"
                    onClick={toggleMobileMenu}
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                         aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ease-in-out transform ${
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between p-6">
                    <a href="/" className="-m-1.5 p-1.5" onClick={toggleMobileMenu}>
                        <img className="h-8 w-auto" src="/logo-aomail-name.png" alt="Aomail logo" />
                    </a>
                    <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={toggleMobileMenu}>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                             aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mt-6 flow-root h-full overflow-y-auto">
                    <div className="-my-6 divide-y divide-gray-500/10">
                        <div className="space-y-2 py-6">
                            <a
                                onClick={toggleMobileMenu}
                                href="/"
                                className="block rounded-lg mx-4 px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-300 link"
                            >
                                {t("landingPage.constants.sections.home")}
                            </a>
                            <SearchBar />
                        </div>
                        <div className="space-y-2">
                            <a
                                href={`${AOMAIL_APP_URL}signup`}
                                className="block text-center rounded-lg bg-gray-900 mx-4 px-3 py-2.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-gray-700 CTA"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t("constants.actions.joinBeta")}
                            </a>
                            <button
                                className="flex text-center rounded-lg mx-4 px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 border border-gray-300 hover:bg-gray-100 items-center justify-center"
                                style={{ width: "calc(100% - 32px)" }}
                                onClick={openLanguageModal}
                            >
                                <img className="currentLanguageIcon h-6 w-6 mr-2" src={languages[currentLanguage]}
                                     alt="Language Icon" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
