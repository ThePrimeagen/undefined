import fs from "fs";
import path from "path";
import type { Config } from "../config";
import { getDefaultConfig } from "../config";
import { jsons } from "./create-data";
import { runTest } from "./run";

test("simple transformation, unionCount == 4", function () {
    const config: Config = getDefaultConfig();
    const data = [...jsons];
    runTest(config, data, "no-config.4.ts");
});

test("simple transformation, unionCount == 2", function () {
    const config: Config = {
        ...getDefaultConfig(),
        unionCount: 2,
    };

    const data = [...jsons];
    runTest(config, data, "no-config.2.ts");
});

test("names, unionCount == 4", function () {
    const names = JSON.parse(
        fs.readFileSync(path.join(__dirname, "config.name.json")).toString(),
    );

    const config: Config = {
        ...getDefaultConfig(),
        ...names,
    };

    const data = [...jsons];

    runTest(config, data, "config.name.ts");
});

test("collapse, unionCount == 4", function () {
    const collapse = JSON.parse(
        fs
            .readFileSync(path.join(__dirname, "config.collapse.json"))
            .toString(),
    );

    const config: Config = {
        ...getDefaultConfig(),
        ...collapse,
    };

    const data = [...jsons];

    runTest(config, data, "config.collapse.ts");
});

test("sumtype, unionCount == 4", function () {
    const collapse = JSON.parse(
        fs.readFileSync(path.join(__dirname, "config.sumtype.json")).toString(),
    );

    const config: Config = {
        ...getDefaultConfig(),
        ...collapse,
    };

    const data = [...jsons];

    runTest(config, data, "config.sumtype.ts");
});

test("export.declare, unionCount == 4", function () {
    const collapse = JSON.parse(
        fs
            .readFileSync(path.join(__dirname, "config.export.declare.json"))
            .toString(),
    );

    const config: Config = {
        ...getDefaultConfig(),
        ...collapse,
    };

    const data = [...jsons];

    runTest(config, data, "config.export.declare.ts");
});
