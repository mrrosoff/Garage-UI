import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        electron({
            entry: ["electron/main.ts", "electron/preload.ts"],
        }),
        react(),
        renderer({
            nodeIntegration: true
        })
    ],
    server: {
        port: 3000,
        strictPort: true,
    }
});
