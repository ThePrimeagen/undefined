import fs from "fs";
const outDir = "dist";
export default {
    format: "esm",
    minify: false,
    outdir: outDir,
    platform: "node",
    target: "esnext",
    write: true,
    plugins: [
        {
            name: "clean-dist",
            setup(build) {
                build.onStart(async () => {
                    try {
                        await fs.promises.rm(outDir, {
                            recursive: true,
                        });
                    }
                    catch (error) { }
                });
            },
        },
    ],
};
