import cli from "command-line-args";
import fs from "fs";

export type Config = {
    nameBase: string;
    enums: string[];
    file: string;
    unionCount: number;
    unions: { [key: string]: string[] };
    traces: string[];
    names: {
        name: string;
        exact: boolean;
        props: string[];
    }[];
    collapse: string[][];
    sumType?: {
        [key: string]: string[];
    };

    export?: boolean;
    declareModule?: string;
};

export type TSConfig = {
    unions?: { [key: string]: string[] };
    names?: {
        exact: boolean;
        props: string[];
        name: string;
    }[];

    enums?: string[];
    nameBase?: string;
    file?: string;
    traces?: string[];
    unionCount?: number;
    collapse?: string[][];
    sumType?: {
        [key: string]: string[];
    };

    export?: boolean;
    declareModule?: string;
};

type CLIConfig = {
    nameBase: string;
    enums: string;
    file: string;
    configFile: string;
    unionCount: number;
    traces: string;
};

const BASE_NAME = "BaseName";
const UNION_COUNT = 4;
const FILE = "stdin";

const args = [
    {
        name: "configFile",
        type: String,
        alias: "c",
        defaultValue: "",
    },
    {
        name: "file",
        type: String,
        alias: "f",
        defaultValue: FILE,
    },
    {
        name: "enums",
        type: String,
        alias: "e",
        defaultValue: "",
    },
    {
        name: "unionCount",
        type: Number,
        alias: "u",
        defaultValue: UNION_COUNT,
    },
    {
        name: "nameBase",
        type: String,
        alias: "n",
        defaultValue: BASE_NAME,
    },
    {
        name: "trace",
        type: String,
        alias: "t",
        defaultValue: "",
    },
];

const defaultConfig = {
    unions: {},
    names: [],
    unionCount: UNION_COUNT,
    file: FILE,
    nameBase: BASE_NAME,
    enums: [],
    traces: [],
    collapse: [],
    sumType: {},
    export: false,
};

export function getDefaultConfig(): Config {
    return {
        ...defaultConfig,
    };
}

export function getConfig(): Config {
    const cliArgs = cli(args) as CLIConfig;

    if (cliArgs["configFile"]) {
        const config = JSON.parse(
            fs.readFileSync(cliArgs["configFile"]).toString(),
        ) as TSConfig;
        return {
            ...defaultConfig,
            ...config,
        };
    }

    const config = {
        unionCount: cliArgs["unionCount"],
        file: cliArgs["file"],
        nameBase: cliArgs["nameBase"],
        enums: cliArgs["enums"] !== "" ? cliArgs["enums"].split(",") : [],
        traces: cliArgs["traces"]?.split(",") || [],
    };

    return {
        ...defaultConfig,
        ...config,
    };
}
