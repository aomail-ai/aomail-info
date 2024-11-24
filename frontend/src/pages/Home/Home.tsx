import { useEffect, useRef, useState } from "react";
import { postData } from "../../global/fetchData.ts";
import { useAppDispatch } from "../../global/redux/hooks.ts";
import { setArticlesData, setIds } from "../../global/redux/articles/actions.ts";
import Articles from "./components/Articles.tsx";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const timerId = useRef<number>(0);
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
            let result = await postData("articles-ids", {});
            if (!result.success) {
                displayPopup("error", "Failed to fetch articles", result.error as string);
                return;
            }
            const fetchedIds = result.data.ids;
            dispatch(setIds(fetchedIds));


            result = await postData("articles-data", { ids: fetchedIds.slice(0, 25) });
            if (!result.success) {
                displayPopup("error", "Failed to fetch articles", result.error as string);
                return;
            }
            dispatch(setArticlesData(result.data.articles));
            setLoading(false);
        };

        fetchArticles();
    }, [dispatch]);


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
