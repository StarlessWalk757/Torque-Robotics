import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This file runs in Node, not in the browser, but the project doesn't carry @types/node
// (nothing else here needs it). One declaration is cheaper than a dependency.
declare const process: { env: Record<string, string | undefined> };

// In development, Vite serves the app on :5173 and forwards /api calls to the Java server on :8080.
//
// Where the production build lands depends on who is building it:
//   Vercel      -> dist/, because Vercel serves the files itself and looks for that folder
//   anyone else -> straight into the Java server's static folder, so `java -jar` serves the
//                  whole app as one program (this is what the Dockerfile and Render use)
// Vercel sets VERCEL=1 during its builds, which is how we tell the two apart.
const onVercel = !!process.env.VERCEL;

export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:8080" } },
  build: {
    outDir: onVercel ? "dist" : "../server/src/main/resources/static",
    emptyOutDir: true,
  },
});
