import fs from "fs";
import path from "path";
import { Config, getDefaultConfig } from "../config";
import { jsons } from "./create-data";
import { runTest } from "./run";

test("collapse, unionCount == 4", function() {
    const collapse = JSON.parse(
        fs.readFileSync(path.join(__dirname, "config.collapse.json")).toString());

    const config: Config = {
        ...getDefaultConfig(),
        ...collapse,
    };

    const data = [...jsons];

    runTest(config, data, "config.collapse.ts");
});

