import fs from "fs";

export default function getData<T extends object>(file: string): T[] {
    return fs.
        readFileSync(file).
        toString().
        split("\n").
        filter(x => x).
        map(x => JSON.parse(x));
}
