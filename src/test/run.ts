import fs from "fs";
import path from "path";
import { Config } from "../config";
import { DataSet } from "../types";
import { stringify, undefinedRun } from "../undefined-runner";

function trimNewLine(str: string): string {
    if (str.at(-1) === "\n") {
        return str.substring(0, str.length - 1);
    }
    return str;
}

export function runTest(config: Config, data: DataSet, expected: string) {
    const undef = undefinedRun(data, config);
    let expectedValue = fs
        .readFileSync(path.join(__dirname, expected))
        .toString();

    expect(trimNewLine(stringify(undef))).toEqual(trimNewLine(expectedValue));
}
