import fs from "fs";
import yargs from "yargs";

type PartialConfig = {
    nameBase?: string;
    enums?: string;
    file?: string | "stdin";
    unionCount?: number;
    config: string;
}

export type TSConfig = {
    unions: {[key: string]: string[]},
    names: {[key: string]: string[]},
};

export type Config = {
    nameBase: string;
    enums: string[];
    file: string | "stdin";
    unionCount: number;
    config: TSConfig;
}

// TODO: Normalize i use command-line-arguments fro this, tried yarg, need
// to take more time to figure this out.
const BASE_NAME = "BaseName";
const UNION_COUNT = 4;
const CONFIG = {
    unions: {},
    names: {},
};

// TODO: THIS IS MY LEAST FAVORITE THING I HAVE EVER DONE AND CLEARLY I DID NOT
// RTFM
export async function getConfig(): Promise<Config> {
    // @ts-ignore
    const args = await yargs(process.argv).argv as PartialConfig;

    if ("enums" in args) {
        // @ts-ignore
        args.enums = args.enums.split(",");
    } else {
        // @ts-ignore
        args.enums = [];
    }

    if (!("nameBase" in args)) {
        // @ts-ignore
        args.nameBase = BASE_NAME;
    }

    if (("unionCount" in args)) {
        // @ts-ignore
        args.unionCount = +args.unionCount;
    } else {
        args.unionCount = UNION_COUNT;
    }

    if (("config" in args)) {
        const configFile = args.config;
        try {
            const config = JSON.parse(fs.readFileSync(configFile).toString());
            args.config = config;
        } catch (e) {
            // @ts-ignore
            throw new Error(`error'd while loading config. ${args.config} ${e.message}`);
        }
    } else {
        // @ts-ignore
        args.config = CONFIG;
    }

    if (!("file" in args)) {
        if (process.argv[2].length < 3) {
            throw new Error("please provide a file either as the first positional argument or --file");
        }

        return {
            nameBase: args.nameBase as string,
            unionCount: args.unionCount as number,
            // @ts-ignore
            config: args.config as TSConfig,
            enums: args.enums as unknown as string[],
            file: String(process.argv[2]),
        };
    }

    return args as unknown as Config;
}

