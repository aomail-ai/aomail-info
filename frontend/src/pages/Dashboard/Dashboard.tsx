import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { postData } from "../../global/fetchData.ts";
import { useAppDispatch, useAppSelector } from "../../global/redux/hooks.ts";
import { selectFetchIds } from "../../global/redux/articles/selectors.ts";
import { loadUserState } from "../../global/localStorage.ts";
import { setIds } from "../../global/redux/articles/actions.ts";

const Dashboard = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const [loading, setLoading] = useState(true);
    const userState = loadUserState();
    const fetchedIds = useAppSelector(selectFetchIds);
    const dispatch = useAppDispatch();


    useEffect(() => {
        const fetchArticles = async () => {
            const result = await postData("articles-ids", { userId: userState?.id });
            if (!result.success) {
                displayPopup("error", "Failed to fetch articles", result.error as string);
                return;
            }
            const fetchedIds = result.data.ids;
            dispatch(setIds(fetchedIds));
            setLoading(false);
        };
        fetchArticles();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-xl text-gray-700">Loading...</div>;
    }

    const fakeStats = {
        viewsOverTime: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            data: [500, 1000, 1500, 2000, 2500, 3000, 3500]
        },
        reactionsPerArticle: {
            labels: ["Article 1", "Article 2", "Article 3", "Article 4", "Article 5"],
            data: [20, 35, 50, 25, 60]
        },
        articlesPerMonth: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            data: [2, 3, 1, 4, 2, 5, 3]
        }
    };

    const displayPopup = (type: "success" | "error", title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setBackgroundColor(type === "error" ? "red" : "green");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
    };

    const getViewsOverTimeOptions = () => ({
        title: {
            text: "Views Over Time"
        },
        tooltip: {
            trigger: "axis"
        },
        xAxis: {
            type: "category",
            data: fakeStats.viewsOverTime.labels
        },
        yAxis: {
            type: "value"
        },
        series: [
            {
                name: "Views",
                type: "line",
                data: fakeStats.viewsOverTime.data,
                smooth: true,
                areaStyle: {}
            }
        ]
    });

    const getReactionsPerArticleOptions = () => ({
        title: {
            text: "Reactions Per Article"
        },
        tooltip: {
            trigger: "axis"
        },
        xAxis: {
            type: "category",
            data: fakeStats.reactionsPerArticle.labels
        },
        yAxis: {
            type: "value"
        },
        series: [
            {
                name: "Reactions",
                type: "bar",
                data: fakeStats.reactionsPerArticle.data,
                itemStyle: {
                    color: "#6C63FF"
                }
            }
        ]
    });

    const getArticlesPerMonthOptions = () => ({
        title: {
            text: "Articles Per Month"
        },
        tooltip: {
            trigger: "axis"
        },
        xAxis: {
            type: "category",
            data: fakeStats.articlesPerMonth.labels
        },
        yAxis: {
            type: "value"
        },
        series: [
            {
                name: "Articles",
                type: "bar",
                data: fakeStats.articlesPerMonth.data,
                itemStyle: {
                    color: "#FF6F61"
                }
            }
        ]
    });

    const getViewsDistributionOptions = () => ({
        title: {
            text: "Views Distribution"
        },
        tooltip: {
            trigger: "item"
        },
        legend: {
            orient: "vertical",
            left: "left"
        },
        series: [
            {
                name: "Views",
                type: "pie",
                radius: "50%",
                data: fakeStats.reactionsPerArticle.labels.map((label, index) => ({
                    value: fakeStats.reactionsPerArticle.data[index],
                    name: label
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                }
            }
        ]
    });

    return (
        <>
            <NotificationTimer
                showNotification={showNotification}
                notificationTitle={notificationTitle}
                notificationMessage={notificationMessage}
                backgroundColor={backgroundColor}
                onDismiss={() => setShowNotification(false)}
            />
            <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto">
                    <header className="flex items-center justify-between py-4">
                        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                        <p className="text-gray-600">You have publicated {fetchedIds.length} articles</p>
                    </header>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
                        <div className="bg-white shadow rounded-lg p-4">
                            <ReactECharts option={getViewsOverTimeOptions()} />
                        </div>
                        <div className="bg-white shadow rounded-lg p-4">
                            <ReactECharts option={getReactionsPerArticleOptions()} />
                        </div>
                        <div className="bg-white shadow rounded-lg p-4">
                            <ReactECharts option={getArticlesPerMonthOptions()} />
                        </div>
                        <div className="bg-white shadow rounded-lg p-4">
                            <ReactECharts option={getViewsDistributionOptions()} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
