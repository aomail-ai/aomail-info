import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true,
        strictPort: true,
        allowedHosts: ["info.aomail.ai"],
    },
    preview: {
        host: true,
        strictPort: true,
        port: 3000,
        allowedHosts: ["info.aomail.ai"],
    },
});
