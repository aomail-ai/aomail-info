import { useEffect, useRef, useState } from "react";
import NotificationTimer from "../../global/components/NotificationTimer.tsx";
import { displayErrorPopup, displaySuccessPopup } from "../../global/popUp.ts";
import { deleteData, getData, putData } from "../../global/fetchData.ts";
import { loadUserState } from "../../global/localStorage.ts";
import AccountDeletionConfirmationModal from "./components/AccountDeletionConfirmationModal.tsx";

const Profile = () => {
    const [profileData, setProfileData] = useState(loadUserState());
    const [username, setUsername] = useState("");
    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAccountDeletionConfirmationModalOpen, setIsAccountDeletionConfirmationModalOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");
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
    const closeAccountDeletionConfirmationModal = () => setIsAccountDeletionConfirmationModalOpen(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            const result = await getData("user/profile");
            if (!result.success) {
                displayPopup("error", "Failed to fetch profile", result.error as string);
            } else {
                setProfileData({ ...profileData, ...result.data });
            }
            setLoading(false);
        };
        void fetchProfileData();
    }, []);

    const handleUpdateProfile = async () => {
        if (!currentPassword) {
            displayPopup("error", "Update Failed", "Please enter your current password.");
            return;
        }
        const result = await putData("user/profile", {
            username,
            name,
            surname,
            newPassword,
            currentPassword
        });
        if (!result.success) {
            displayPopup("error", "Update Failed", result.error as string);
            return;
        }
        displayPopup("success", "Profile has been updated successfully", "You have been logged out from all devices. Redirecting to the login page.");
        setTimeout(() => {
            window.location.href = "/login";
        }, 5000);
    };

    const handleAccountDeletion = async () => {
        setIsAccountDeletionConfirmationModalOpen(false);
        if (!currentPassword) {
            displayPopup("error", "Account Deletion Failed", "Please enter your current password.");
            return;
        }
        const result = await deleteData("user/profile", {
            currentPassword
        });
        if (!result.success) {
            displayPopup("error", "Account Deletion Failed", result.error as string);
            return;
        }
        displayPopup("success", "Account Deleted Successfully", "You will be redirected to the homepage.");
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
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
            <AccountDeletionConfirmationModal
                isOpen={isAccountDeletionConfirmationModalOpen}
                onClose={closeAccountDeletionConfirmationModal}
                onConfirm={handleAccountDeletion}
            />
            <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Your Profile</h1>
                    <p className="text-gray-500">Manage your account information and settings.</p>
                    <p className="text-gray-500">Account created
                        on: {new Date(profileData.createdAt).toLocaleDateString()}</p>
                    <div className="mt-6 space-y-6">
                        {/* Display Profile Fields */}
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold w-32">Username</p>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    className="border rounded px-4 py-2 text-sm w-full"
                                    placeholder={profileData.username}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold w-32">Name</p>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    className="border rounded px-4 py-2 text-sm w-full"
                                    placeholder={profileData.name}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold w-32">Surname</p>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    className="border rounded px-4 py-2 text-sm w-full"
                                    placeholder={profileData.surname}
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">New Password</p>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    className="border rounded px-4 py-2 text-sm w-full"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700">Current Password</p>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    className="border rounded px-4 py-2 text-sm w-full"
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleUpdateProfile}
                        className="ml-4 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-100"
                    >
                        Update Profile
                    </button>
                    <button
                        onClick={() => setIsAccountDeletionConfirmationModalOpen(true)}
                        className="ml-4 px-3 py-1 text-sm text-red-600 border border-red-600 rounded  hover:bg-red-100"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </>
    );
};

export default Profile;
