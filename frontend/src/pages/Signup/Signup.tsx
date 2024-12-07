const Signup = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    Access Restricted
                </h2>
                <p className="mb-8 text-gray-600">
                    Only admins can create new users for now. This website is under active development.
                </p>
                <p className="mb-8 text-gray-600">
                    You can view articles and react anonymously without an account.
                </p>
            </div>
        </div>
    );
};

export default Signup;
