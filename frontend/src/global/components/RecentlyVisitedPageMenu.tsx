import { useEffect, useRef, useState } from "react";
import { loadRecentlyViewedArticles } from "../redux/localStorage.ts";
import { setRecentlyViewedArticles } from "../redux/articles/actions.ts";
import { useAppDispatch } from "../redux/hooks.ts";
import { Link } from "lucide-react";

const RecentlyVisitedPageMenu = () => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [recentlyVisited, setRecentlyVisited] = useState([]);

    useEffect(() => {
        const recentlyVisited = loadRecentlyViewedArticles();
        setRecentlyVisited(recentlyVisited);
        dispatch(setRecentlyViewedArticles(recentlyVisited));
    }, [dispatch]);

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                id="menu-button"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                Recently Visited Pages
                <svg
                    className="-mr-1 h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1" role="none">
                        {recentlyVisited.length > 0 ? (
                            recentlyVisited.map((article) => (
                                <Link
                                    key={article.id}
                                    to={`/articles/${article.id}`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                    tabIndex={-1}
                                >
                                    {article.title}
                                </Link>
                            ))
                        ) : (
                            <span className="block px-4 py-2 text-sm text-gray-700">
                                No recently visited articles.
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentlyVisitedPageMenu;
