import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

const SearchBar = () => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleFocusSearch = () => {
        setIsFocused(true);
    };

    const handleBlurSearch = () => {
        setIsFocused(false);
    };

    return (
        <div className="relative inline-block">
            {!inputValue && (
                <MagnifyingGlassIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                />
            )}

            {/* Input Field */}
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={handleFocusSearch}
                onBlur={handleBlurSearch}
                type="text"
                id="search"
                className="w-full h-10 2xl:h-11 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 pl-10 py-2 bg-transparent text-gray-900 placeholder-gray-400 sm:text-sm sm:leading-6 2xl:py-3 2xl:pl-12 2xl:text-base"
                placeholder={t("constants.searchPlaceholder")}
            />
        </div>
    );
};

export default SearchBar;
