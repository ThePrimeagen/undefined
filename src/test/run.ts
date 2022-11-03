import fs from "fs";
import path from "path";
import { Config } from "../config";
import { DataSet, stringify, undefinedRun } from "../undefined-runner";

export function runTest(config: Config, data: DataSet, expected: string) {
    const undef = undefinedRun(data, config);
    const expectedValue = fs.
        readFileSync(path.join(__dirname, expected)).
        toString();

    expect(stringify(undef, config)).toEqual(expectedValue);
}


