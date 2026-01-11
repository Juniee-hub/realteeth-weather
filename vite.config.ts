import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/api/vworld": {
                target: "https://api.vworld.kr",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/vworld/, "/req/address"),
            },
        },
    },
})
