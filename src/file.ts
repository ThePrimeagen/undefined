import fs from "fs";
import readline from "readline";

export default async function getData<T extends object>(file: string): Promise<T[]> {
    if (!file) {
        throw new Error("requires a file to read data from");
    }

    const rl = readline.createInterface({
        input: file === "stdin" ? process.stdin : fs.createReadStream(file),
    });

    return new Promise(res => {
        const data: T[] = [];
        rl.on("line", (line) => {
            data.push(JSON.parse(line));
        })

        rl.on("close", () => {
            res(data);
        });
    });
}
