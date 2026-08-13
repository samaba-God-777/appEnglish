import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { reviewApiPlugin } from "./server/review-plugin";
import { grammarAiPlugin } from "./server/grammar-ai-plugin";
import { speechPlugin } from "./server/speech-plugin";
import { speakingAiPlugin } from "./server/speaking-ai-plugin";
import { gamesAiPlugin } from "./server/games-ai-plugin";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    reviewApiPlugin(),
    grammarAiPlugin(),
    speechPlugin(),
    speakingAiPlugin(),
    gamesAiPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5199,
  },
});
