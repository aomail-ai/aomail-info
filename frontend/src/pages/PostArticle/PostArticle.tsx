import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { fetchWithToken } from "../../global/security.ts";
import { API_BASE_URL } from "../../global/constants.ts";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";

const PostArticle = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [miniatureFile, setMiniatureFile] = useState<File | null>(null);
    const [tagInput, setTagInput] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const editorRef = useRef<Quill | null>(null);
    const timerId = useRef<number>(0);

    useEffect(() => {
        if (!editorRef.current) {
            editorRef.current = new Quill("#editor", {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        ["link"],
                        [{ align: [] }],
                        [{ color: [] }, { background: [] }],
                        ["clean"]
                    ],
                    clipboard: {
                        matchVisual: false
                    }
                }
            });

            if (editorRef.current instanceof Quill) {
                // Remove pasted images
                const Clipboard = Quill.import("modules/clipboard");

                class CustomClipboard extends Clipboard {
                    onPaste(e) {
                        const clipboardData = e.clipboardData;
                        const text = clipboardData.getData("text/plain");
                        editorRef.current!.clipboard.dangerouslyPasteHTML(0, text);
                        editorRef.current?.setContents([]);
                        e.preventDefault();
                    }
                }

                Quill.register("modules/clipboard", CustomClipboard, true);

                editorRef.current.on("text-change", () => {
                    setContent(editorRef.current!.root.innerHTML);
                });
            }
        }
    }, []);


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
            body: formData
        });

        if (!response) {
            displayPopup("error", "Failed to post article", "No server response");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            displayPopup("success", "Success", "Article posted successfully!");
            setTitle("");
            setDescription("");
            setContent("");
            setTags([]);
            setMiniatureFile(null);
        } else {
            console.log("Error posting article:", data.error ? data.error : "Unknown error");
            displayPopup("error", "Failed to post article", data.error ? data.error : "Unknown error");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target?.files[0]) {
            setMiniatureFile(e.target?.files[0]);
        }
    };

    const handleAddTag = () => {
        if (tagInput && !tags.includes(tagInput)) {
            setTags([...tags, tagInput]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
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
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Post an Article</h1>
                <div className="space-y-4">
                    {/* Title Input */}
                    <input
                        type="text"
                        className="w-full border rounded px-4 py-2"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Description Input */}
                    <input
                        type="text"
                        className="w-full border rounded px-4 py-2"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    {/* Rich Text Editor */}
                    <div className="border rounded p-2">
                        <div id="editor" style={{ height: "300px" }}></div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <label className="block text-gray-700">Miniature Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border rounded px-4 py-2"
                        />
                    </div>

                    {/* Tags Input */}
                    <div>
                        <label className="block text-gray-700 mb-2">Tags</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                className="border rounded px-4 py-2 flex-grow"
                                placeholder="Add a tag"
                            />
                            <button
                                onClick={handleAddTag}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Add Tag
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2"
                                >
                {tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-red-500 font-bold"
                                    >
                  &times;
                </button>
              </span>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={postArticle}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Post Article
                    </button>
                </div>
            </div>
        </>
    );
};

export default PostArticle;