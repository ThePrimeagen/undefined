import fs from "fs";
import path from "path";
import type { Config } from "../config";
import type { DataSet } from "../types";
import { stringify, undefinedRun } from "../undefined-runner";

function trimNewLine(str: string): string {
    if (str.indexOf("\n", str.length - 1) !== -1) {
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
