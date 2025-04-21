import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";

dotenv.config();

export default defineConfig(() => {
    console.log("URL from .env:", process.env.VITE_API_URL);

    return {
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: 5173,
            hmr: {
                clientPort: 80,
            },
            proxy: {
                "/api": {
                    target: "https://equeue-server-production.up.railway.app/api", // ← без /api в кінці
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""), // Додатково: прибрати /api з шляху
                },
            },
        },
        build: {
            outDir: "dist",
        },
    };
});
