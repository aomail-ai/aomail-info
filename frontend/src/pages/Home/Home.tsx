import { useEffect, useRef, useState } from "react";
import { postData } from "../../global/fetchData.ts";
import { useAppDispatch, useAppSelector } from "../../global/redux/hooks.ts";
import Articles from "./components/Articles.tsx";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { setArticlesData, setIds } from "../../global/redux/articles/reducer.ts";
import { selectFilters } from "../../global/redux/articles/selectors.ts";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const filters = useAppSelector(selectFilters);
    const timerId = useRef<NodeJS.Timeout | null>(null);
    const dispatch = useAppDispatch();

    const displayPopup = (type: "success" | "error", title: string, message: string) => {
        if (type === "error") {
            displayErrorPopup(
                setShowNotification,
                setNotificationTitle,
                setNotificationMessage,
                setBackgroundColor,
                title,
                message
            );
        } else {
            displaySuccessPopup(
                setShowNotification,
                setNotificationTitle,
                setNotificationMessage,
                setBackgroundColor,
                title,
                message
            );
        }
        timerId.current = setTimeout(() => {
            setShowNotification(false);
        }, 4000);
    };

    useEffect(() => {
        const fetchArticles = async () => {
            let result;
            if (filters.advanced) {
                result = await postData("articles-ids", filters);
            } else if (filters.search) {
                result = await postData("articles-ids", { search: filters.search });
            } else {
                result = await postData("articles-ids", {});
            }
            if (!result.success) {
                displayPopup("error", "Failed to fetch articles", result.error as string);
                return;
            }
            const fetchedIds = result.data.ids;
            dispatch(setIds(result.data.ids));


            result = await postData("articles-data", { ids: fetchedIds.slice(0, 25) });
            if (!result.success) {
                displayPopup("error", "Failed to fetch articles", result.error as string);
                return;
            }
            dispatch(setArticlesData(result.data.articles));
            setLoading(false);
        };

        void fetchArticles();
    }, [filters]);


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <NotificationTimer
                showNotification={showNotification}
                notificationTitle={notificationTitle}
                notificationMessage={notificationMessage}
                backgroundColor={backgroundColor}
                onDismiss={() => setShowNotification(false)}
            />
            <Articles />
        </>
    );
}
