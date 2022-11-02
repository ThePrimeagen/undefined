import fs from "fs";
import cli from "command-line-args";

export type Config = {
    nameBase: string;
    enums: string[];
    file: string;
    unionCount: number;
    unions: {[key: string]: string[]},
    names: {
        exact: boolean,
        props: string[],
    }[],
}

type CLIConfig = {
    nameBase: string;
    enums: string;
    file: string;
    configFile: string;
    unionCount: number;
}

const BASE_NAME = "BaseName";
const UNION_COUNT = 4;
const FILE = "stdin";

const args = [{
    name: "configFile",
    type: String,
    alias: "c",
    defaultValue: "",
}, {
    name: "file",
    type: String,
    alias: "f",
    defaultValue: FILE,
}, {
    name: "enums",
    type: String,
    alias: "e",
    defaultValue: "",
}, {
    name: "unionCount",
    type: Number,
    alias: "u",
    defaultValue: UNION_COUNT,
}, {
    name: "nameBase",
    type: String,
    alias: "n",
    defaultValue: BASE_NAME,
}];


export type TSConfig = {
    unions: {[key: string]: string[]},
    names: {
        exact: boolean,
        props: string[],
    }[],
    enums: string[];

    nameBase?: string;
    file?: string;
    unionCount?: number;
};

export function getConfig(): Config {
    const cliArgs = cli(args) as CLIConfig;

    if (cliArgs.configFile) {
        const config = JSON.parse(fs.readFileSync(cliArgs.configFile).toString()) as TSConfig;
        return {
            unions: config.unions,
            names: config.names,
            unionCount: config.unionCount || UNION_COUNT,
            file: config.file || FILE,
            nameBase: config.nameBase || BASE_NAME,
            enums: config.enums || "",
        }
    }

    return {
        unions: {},
        names: [],
        unionCount: cliArgs.unionCount || UNION_COUNT,
        file: cliArgs.file || FILE,
        nameBase: cliArgs.nameBase || BASE_NAME,
        enums: cliArgs.enums !== "" ? cliArgs.enums.split(",") : [],
    };
}

