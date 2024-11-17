import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import ArticleDetail from "./pages/Home/components/ArticleDetail.tsx";
import NotFound from "./pages/Errors/NotFound.tsx";
import TermsOfService from "./pages/TermsOfService/TermsOfService.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.tsx";
import Fox from "./pages/Fox";
import Footer from "./global/components/Footer.tsx";
import Header from "./global/components/Header.tsx";
import NotAuthorized from "./pages/Errors/NotAuthorized.tsx";

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow bg-gray-50">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/article/:id" element={<ArticleDetail />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/fox" element={<Fox />} />
                        <Route path={"/not-authorized"} element={<NotAuthorized />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;