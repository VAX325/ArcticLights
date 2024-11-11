import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["./src/main.ts"],
    outdir: "./dist/scripts/",
    bundle: true,
    platform: "browser",
    format: "iife",
    target: "es2015",
    minify: false,
    sourcemap: true,
    treeShaking: true,
});

await esbuild.stop();
