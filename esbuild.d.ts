import type { PluginBuild } from "esbuild";
declare const _default: {
    format: string;
    minify: boolean;
    outdir: string;
    platform: string;
    target: string;
    write: boolean;
    plugins: {
        name: string;
        setup(build: PluginBuild): void;
    }[];
};
export default _default;
