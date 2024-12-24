import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        electron({
            entry: ["electron/main.ts", "electron/preload.ts"],
            vite: {
                build: {
                    outDir: "dist/electron",
                    rollupOptions: {
                        external: ["epoll"]
                    }
                }
            }
        }),
        react()
    ],
    server: {
        port: 3000,
        strictPort: true
    }
});
