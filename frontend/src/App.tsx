import Header from "./global/components/Header.tsx";
import { Outlet } from "react-router-dom";
import Footer from "./global/components/Footer.tsx";

function App() {

    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

export default App;
