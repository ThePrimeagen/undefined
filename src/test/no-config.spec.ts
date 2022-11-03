import fs from "fs";
import path from "path";
import { Config, getDefaultConfig } from "../config";
import { jsons } from "./create-data";
import { runTest } from "./run";

test("simple transformation, unionCount == 4", function() {
    const config: Config = getDefaultConfig();
    const data = [...jsons];
    runTest(config, data, "no-config.4.ts");
});

test("simple transformation, unionCount == 2", function() {
    const config: Config = {
        ...getDefaultConfig(),
        unionCount: 2,
    };

    const data = [...jsons];
    runTest(config, data, "no-config.2.ts");
});

