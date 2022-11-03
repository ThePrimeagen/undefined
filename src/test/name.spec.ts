import fs from "fs";
import path from "path";
import { Config, getDefaultConfig } from "../config";
import { jsons } from "./create-data";
import { runTest } from "./run";

test("names, unionCount == 4", function() {
    const names = JSON.parse(
        fs.readFileSync(path.join(__dirname, "config.name.json")).toString());

    const config: Config = {
        ...getDefaultConfig(),
        ...names,
    };

    const data = [...jsons];

    runTest(config, data, "config.name.ts");
});

