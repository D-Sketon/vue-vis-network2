import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: "./src",
      outDir: ["./dist"],
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueVisNetwork",
      fileName: "vue-vis-network2",
      formats: ["es", "umd", "cjs"],
    },
    rollupOptions: {
      external: ["vue", "vis-network", "vis-data"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          "vis-network": "vis",
          "vis-data": "vis",
        },
      },
    },
  },
});
