import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import LngDetector from "i18next-browser-languagedetector";


const resources = {
    en: { translation: en },
    fr: { translation: fr }
};

// Detect initial locale from localStorage or default to navigator's language or English
const initialLocale =
    (typeof localStorage !== "undefined" && localStorage.getItem("i18nextLng")) ||
    navigator.language.split("-")[0] ||
    "en";

i18n
    .use(LngDetector)
    .use(initReactI18next)
    .init({
        lng: initialLocale,
        fallbackLng: "en",
        resources,
        interpolation: {
            escapeValue: false
        }
    });


// Set up a listener to persist the locale in localStorage
i18n.on("languageChanged", (lng) => {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("i18nextLng", lng);
    }
});
