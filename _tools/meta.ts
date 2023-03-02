import { BuildOptions } from "https://deno.land/x/dnt@0.33.1/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@httpland/http-content-length",
    version,
    description:
      "HTTP Content-Length header middleware for standard request and response",
    keywords: [
      "http",
      "middleware",
      "content-length",
      "handler",
      "request",
      "response",
    ],
    license: "MIT",
    homepage: "https://github.com/httpland/http-content-length",
    repository: {
      type: "git",
      url: "git+https://github.com/httpland/http-content-length.git",
    },
    bugs: {
      url: "https://github.com/httpland/http-content-length/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
});
