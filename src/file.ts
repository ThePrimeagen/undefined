import readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
});

export default async function getData<T extends object>(file: string): Promise<T[]> {
    if (!file) {
        throw new Error("requires a file to read data from");
    }

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
