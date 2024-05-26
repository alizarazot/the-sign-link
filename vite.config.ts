import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

import { join } from "path";
import { buildSync } from "esbuild";

const serviceWorkerSrc = join(
  process.cwd(),
  "src/service-worker/service-worker.ts",
);

const serviceWorkerDest = join(process.cwd(), "dist", "service-worker.js");

const serviceWorker = {
  name: "local-vite-plugin-service-worker",
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        if (!req.originalUrl.endsWith("/service-worker.js")) {
          next();
          return;
        }
        const code = buildSync({
          minify: true,
          bundle: true,
          entryPoints: [serviceWorkerSrc],
          write: false,
        }).outputFiles[0].text;

        res.end(code);
      });
    };
  },

  transformIndexHtml() {
    buildSync({
      minify: true,
      bundle: true,
      entryPoints: [serviceWorkerSrc],
      outfile: serviceWorkerDest,
    });
  },
};

export default defineConfig({
  plugins: [tsConfigPaths(), serviceWorker],
  server: {
    port: 1921,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
