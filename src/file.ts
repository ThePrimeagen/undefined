import fs from "fs";
import { Config } from "./config";

export default function getData<T extends object>(file: string): T[] {
    if (!file) {
        throw new Error("requires a file to read data from");
    }

    return fs
        .readFileSync(file === "stdin" ? 0 : file, "utf-8")
        .toString()
        .split("\n")
        .filter((x) => x)
        .map((x) => JSON.parse(x));
}
