import React, { useEffect, useRef, useState } from "react";
import { postData } from "../../global/fetchData.ts";
import { useSelector } from "react-redux";
import { selectUserState } from "../../global/redux/user/selectors.ts";
import { setArticlesData, setIds } from "../../global/redux/articles/actions.ts";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";
import { useAppDispatch } from "../../global/redux/hooks.ts";

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const timerId = useRef<number>(0);
    const userState = useSelector(selectUserState);
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
            // todo: allow articles fetch by userId only
            const fetchArticles = async () => {
                let result = await postData("articles-ids", { userId: userState.id });
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
                setArticles(result.data.articles);
                dispatch(setArticlesData(result.data.articles));
                setLoading(false);
            };
            fetchArticles();
        }
        , []);


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
            <h1>Dashboard</h1>
            <ul>
                {articles.map((article) => (
                    <li key={article.id}>{article.title}</li>
                ))}
            </ul>
            {/*todo Profile component: display
            userState.username
            userState.name
            userState.createdAt

            endpoint to call api/user/update
            + allow user to change its username and its name by asking password
            + allow user to change its password (by asking the previous one)
            */}

        </>
    );
};

export default Dashboard;