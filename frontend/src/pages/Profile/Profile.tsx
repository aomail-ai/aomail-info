import React, { useEffect, useRef, useState } from "react";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";
import { getData, postData } from "../../global/fetchData.ts";
import { loadUserState } from "../../global/localStorage.ts";

const BlogProfile = () => {
    // todo: add a button to delete account, add name, surname update modals. Use modal components
    const [profileData, setProfileData] = useState(loadUserState());
    const [editingField, setEditingField] = useState<"name" | "surname" | "username" | "password" | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);

    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
    const timerId = useRef<number>(0);

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
        const fetchProfileData = async () => {
            const result = await getData("api/profile");
            console.log("fetching profile data");
            if (!result.success) {
                displayPopup("error", "Failed to fetch profile", result.error as string);
            } else {
                setProfileData({ ...profileData, ...result.data });
            }
            console.log("fetch complete");
            setLoading(false);
        };
        fetchProfileData();
    }, []);

    const handleUpdateProfile = async (field: "name" | "surname" | "username") => {
        const result = await postData("api/user/update", {
            id: profileData.id,
            field,
            value: inputValue,
            currentPassword
        });
        if (!result.success) {
            displayPopup("error", "Update Failed", result.error as string);
            return;
        }
        setProfileData((prev) => ({ ...prev, [field]: inputValue }));
        displayPopup("success", "Update Successful", `${field} has been updated successfully.`);
        setEditingField(null);
    };

    const handleChangePassword = async () => {
        const result = await postData("api/user/change-password", {
            id: profileData.id,
            currentPassword,
            newPassword
        });
        if (!result.success) {
            displayPopup("error", "Password Change Failed", result.error as string);
            return;
        }
        displayPopup("success", "Password Changed", "Your password has been updated successfully.");
        setEditingField(null);
        setCurrentPassword("");
        setNewPassword("");
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-xl text-gray-700">Loading...</div>;
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
            <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Your Profile</h1>
                    <p className="text-gray-500">Manage your account information and settings.</p>
                    <div className="mt-6 space-y-6">
                        {/* Display Profile Fields */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">Username</p>
                            {editingField === "username" ? (
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        className="border rounded px-4 py-2 text-sm w-full"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        className="border rounded px-4 py-2 text-sm w-full"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleUpdateProfile("username")}
                                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-500"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingField(null)}
                                        className="px-4 py-2 text-sm text-white bg-gray-400 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <p className="text-gray-600">{profileData.username}</p>
                                    <button
                                        onClick={() => {
                                            setEditingField("username");
                                            setInputValue(profileData.username);
                                        }}
                                        className="ml-4 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Repeat similar structure for Name and Surname */}
                        {/* Password Change */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">Password</p>
                            {editingField === "password" ? (
                                <div className="flex space-x-4">
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        className="border rounded px-4 py-2 text-sm w-full"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        className="border rounded px-4 py-2 text-sm w-full"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        onClick={handleChangePassword}
                                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-500"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingField(null)}
                                        className="px-4 py-2 text-sm text-white bg-gray-400 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setEditingField("password")}
                                    className="ml-4 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100"
                                >
                                    Change Password
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogProfile;
