import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import ArticleDetail from "./pages/Home/components/ArticleDetail.tsx";
import NotFound from "./pages/Errors/NotFound.tsx";
import TermsOfService from "./pages/TermsOfService/TermsOfService.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.tsx";
import Fox from "./pages/Fox";
import Footer from "./global/components/Footer.tsx";
import Header from "./global/components/Header.tsx";
import NotAuthorized from "./pages/Errors/NotAuthorized.tsx";
import PostArticle from "./pages/PostArticle/PostArticle.tsx";
import Sidebar from "./global/components/SideBar.tsx";
import Login from "./pages/Login/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import { loadUserState } from "./global/localStorage.ts";
import ManageArticles from "./pages/ManageArticles/ManageArticles.tsx";


const RequireAuth = ({ Component }) => {
    const userState = loadUserState();
    return userState?.isConnected ? <Component /> : <Navigate to="/not-authorized" />;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex flex-grow">
                    <Sidebar />
                    <main className="flex-grow p-6 bg-gray-50">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<RequireAuth Component={Dashboard} />} />
                            <Route path="/post-article" element={<RequireAuth Component={PostArticle} />} />
                            <Route path="/manage-articles" element={<RequireAuth Component={ManageArticles} />} />
                            <Route path="/article/:id" element={<ArticleDetail />} />
                            <Route path="/terms-of-service" element={<TermsOfService />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/fox" element={<Fox />} />
                            <Route path="/not-authorized" element={<NotAuthorized />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;