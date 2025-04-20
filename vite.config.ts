import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";

dotenv.config();

export default defineConfig(() => {
    const url = process.env.VITE_API_URL;
    console.log("VITE_API_URL", url);

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
                    target: url,
                    changeOrigin: true,
                },
            },
        },
        build: {
            outDir: "dist",
        },
    };
});
