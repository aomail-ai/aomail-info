import React, { useEffect, useRef } from "react";

type ArticleDeletionConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};


const ArticleDeletionConfirmationModal: React.FC<ArticleDeletionConfirmationModalProps> = ({
                                                                                               isOpen,
                                                                                               onClose,
                                                                                               onConfirm
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
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center px-4 z-50"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto"
                role="dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center w-full h-16 bg-gray-50 ring-1 ring-black ring-opacity-5 rounded-t-lg">
                    <div className="ml-8 flex items-center space-x-1">
                        <p className="block font-semibold leading-6 text-gray-900">
                            Delete Article Confirmation
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 px-8 py-6">
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Are you sure you want to delete this article? This action cannot be undone.
                        </label>
                    </div>
                    <div className="mt-2 sm:mt-2 sm:flex sm:flex-row justify-between">
                        <button
                            type="button"
                            className="ml-auto rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <div className="flex-grow"></div>
                        <button
                            type="button"
                            className="inline-flex w-full justify-center items-center gap-x-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:w-auto"
                            onClick={onConfirm}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                            Delete Article
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDeletionConfirmationModal;