import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        electron({
            main: {
                entry: "electron/main.ts"
            },
            preload: {
                input: "electron/preload.ts"
            },
            renderer: {}
        }),
        react()
    ],
    server: {
        port: 3000,
        strictPort: true
    }
});
