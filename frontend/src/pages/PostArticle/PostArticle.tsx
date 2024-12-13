import { useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { fetchWithToken } from "../../global/security.ts";
import { API_BASE_URL } from "../../global/constants.ts";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";
import ArticleEditor from "../../global/components/ArticleEditor.tsx";

const PostArticle = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [miniatureFile, setMiniatureFile] = useState<File | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const editorRef = useRef<Quill | null>(null);
    const timerId = useRef<NodeJS.Timeout | null>(null);


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

    const postArticle = async () => {
        if (!title) {
            displayPopup("error", "Failed to post article", "Title is required");
            return;
        } else if (!description) {
            displayPopup("error", "Failed to post article", "Description is required");
            return;
        } else if (!content) {
            displayPopup("error", "Failed to post article", "Content is required");
            return;
        } else if (!miniatureFile) {
            displayPopup("error", "Failed to post article", "Miniature is required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("content", content);
        formData.append("tags", JSON.stringify(tags));

        if (miniatureFile) {
            formData.append("miniature", miniatureFile);
        }


        const response = await fetchWithToken(`${API_BASE_URL}user/article`, {
            method: "POST",
            body: formData as BodyInit
        });

        if (!response) {
            displayPopup("error", "Failed to post article", "No server response");
            return;
        }

        if (response.ok) {
            displayPopup("success", "Success", "Article posted successfully!");
            setTitle("");
            setDescription("");
            setContent("");
            setTags([]);
            setMiniatureFile(null);
            editorRef.current!.root.innerHTML = "";
        } else {
            try {
                const data = await response.json();
                displayPopup("error", "Failed to post article", data.error ? data.error : "Unknown error");
            } catch {
                displayPopup("error", "Failed to post article", "Unknown error");
            }
        }
    };


    return (
        <>
            <NotificationTimer
                showNotification={showNotification}
                notificationTitle={notificationTitle}
                notificationMessage={notificationMessage}
                backgroundColor={backgroundColor}
                onDismiss={() => setShowNotification(false)}
            />
            <ArticleEditor
                componentType="Post Article"
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                setContent={setContent}
                tags={tags}
                setTags={setTags}
                setMiniatureFile={setMiniatureFile}
                onConfirm={postArticle}
            />
        </>
    );
};

export default PostArticle;