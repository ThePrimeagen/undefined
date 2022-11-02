import yargs from "yargs";

type PartialConfig = {
    nameBase?: string;
    enums?: string;
    file?: string | "stdin";
    unionCount?: number;
    unionEnabled?: boolean;
}

export type Config = {
    nameBase: string;
    enums: string[];
    file: string | "stdin";
    unionCount: number;
    unionEnabled: boolean;
}

// TODO: Normalize i use command-line-arguments fro this, tried yarg, need
// to take more time to figure this out.
const BASE_NAME = "BaseName";
const UNION_COUNT = 4;
export async function getConfig(): Promise<Config> {
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

    if (("unionEnabled" in args)) {
        // @ts-ignore
        args.unionEnabled = +args.unionEnabled;
    } else {
        args.unionEnabled = false
    }

    if (!("file" in args)) {
        if (process.argv[2].length < 3) {
            throw new Error("please provide a file either as the first positional argument or --file");
        }

        return {
            nameBase: args.nameBase as string,
            unionCount: args.unionCount as number,
            unionEnabled: args.unionEnabled as boolean,
            enums: args.enums as unknown as string[],
            file: String(process.argv[2]),
        };
    }

    return args as unknown as Config;
}

