import yargs, { Argv } from "yargs";

type PartialConfig = {
    nameBase?: string;
    enums?: string;
    file?: string | "stdin";
}

export type Config = {
    nameBase: string;
    enums: string[];
    file: string | "stdin";
}

const BASE_NAME = "BaseName";
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

    if (!("file" in args)) {
        if (process.argv[2].length < 3) {
            throw new Error("please provide a file either as the first positional argument or --file");
        }

        return {
            nameBase: args.nameBase as string,
            enums: args.enums as unknown as string[],
            file: String(process.argv[2]),
        };
    }

    return args as unknown as Config;
}

