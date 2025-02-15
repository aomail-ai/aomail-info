import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";


type ArticleEditorProps = {
    componentType: string;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    setContent: (content: string) => void;
    tags: string[];
    setTags: (tags: string[]) => void;
    setMiniatureFile: (file: File | null) => void;
    onConfirm: () => void;
};

const ArticleEditor: React.FC<ArticleEditorProps> = ({
                                                         componentType,
                                                         title,
                                                         setTitle,
                                                         description,
                                                         setDescription,
                                                         setContent,
                                                         tags,
                                                         setTags,
                                                         setMiniatureFile,
                                                         onConfirm
                                                     }) => {
    const [tagInput, setTagInput] = useState("");
    const editorRef = useRef<Quill | null>(null);

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
        }

        editorRef.current.on("text-change", () => {
            setContent(editorRef.current!.root.innerHTML);
        });
    }, []);


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
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">{componentType}</h1>
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
                        <label className="block text-gray-700">Miniature Image (only .png file accepted)</label>
                        <input
                            type="file"
                            accept="image/png"
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
                        onClick={onConfirm}
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        {componentType}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ArticleEditor;