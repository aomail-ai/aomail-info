import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n/index.ts";
import { Provider } from "react-redux";
import store from "./global/redux/store.ts";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
    <Provider store={store}>
        <App />
    </Provider>
);