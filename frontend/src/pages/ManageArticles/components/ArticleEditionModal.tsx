import ArticleEditor from "../../../global/components/ArticleEditor.tsx";
import React, { useEffect, useRef } from "react";

type ArticleEditionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (description: string) => void;
    setContent: (content: string) => void;
    tags: string[];
    setTags: (tags: string[]) => void;
    setMiniatureFile: (file: File | null) => void;
}

const ArticleEditionModal: React.FC<ArticleEditionModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     onConfirm,
                                                                     title,
                                                                     setTitle,
                                                                     description,
                                                                     setDescription,
                                                                     setContent,
                                                                     tags,
                                                                     setTags,
                                                                     setMiniatureFile
                                                                 }) => {
    const modalRef = useRef(null);

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === "Escape") {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }
        return () => document.removeEventListener("keydown", handleKeyDown);
    });

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center px-4 z-50"
                onClick={onClose}
            >
                <div
                    ref={modalRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ArticleEditor
                        componentType="Edit Article"
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        setContent={setContent}
                        tags={tags}
                        setTags={setTags}
                        setMiniatureFile={setMiniatureFile}
                        onConfirm={onConfirm}
                    />
                </div>
            </div>
        </>
    );
};

export default ArticleEditionModal;