import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { postData } from "../fetchData.ts";
import { setArticlesData, setFilters, setIds } from "../redux/articles/reducer.ts";
import { useAppDispatch } from "../redux/hooks.ts";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const fetchArticles = async () => {
        let result;
        if (inputValue) {
            result = await postData("articles-ids", { search: inputValue });
        } else {
            result = await postData("articles-ids", {});
        }

        if (!result.success) {
            return;
        }
        const fetchedIds = result.data.ids;
        dispatch(setIds(result.data.ids));

        result = await postData("articles-data", { ids: fetchedIds.slice(0, 25) });
        if (!result.success) {
            return;
        }
        dispatch(setArticlesData(result.data.articles));
    };


    useEffect(() => {


        if (!inputValue) void fetchArticles();

        const timer = setTimeout(() => {
            if (inputValue) {
                if (window.location.pathname !== "/") {
                    if (inputValue) {
                        dispatch(setFilters({ search: inputValue }));
                        navigate("/");
                    }
                } else {
                    void fetchArticles();
                }
            }
        }, 900);

        return () => clearTimeout(timer);

    }, [inputValue]);

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
                type="text"
                id="search"
                className="w-full h-10 2xl:h-11 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 pl-10 py-2 bg-transparent text-gray-900 placeholder-gray-400 sm:text-sm sm:leading-6 2xl:py-3 2xl:pl-12 2xl:text-base"
                placeholder={t("constants.searchPlaceholder")}
            />
        </div>
    );
};

export default SearchBar;
