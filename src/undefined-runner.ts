import { collapse } from "./collapse";
import { Config } from "./config";
import { determineEnum, stringifyEnum, updateAllEnumReferences } from "./enum";
import { Context, Data, DataSet, EnumSet, Type, typeObject, typeToString } from "./types";
import { unionize } from "./unions";
import { makeName, Name } from "./utils";
import { sumTypes } from "./sum-types";

// TODO: Merge context and undefined
export function undefinedRun(data: DataSet, config: Config): Context {
    const typeSet = new Map<string, Type>();
    const context: Context = {
        typeSet,
        data,
        config,
        namer: new Name(config),

        // default values
        unions: new Map(),
        enums: [],
    };

    // TODO: My mother would even be upset
    data.forEach((x: Data) => typeObject(context, x));

    // TODO: i think that i need to move this
    // into a better function.
    //
    // I hate mixing the logic + the printing.
    //
    // I think a enumsToString would be the play and then
    // have this for loop moved into enums.ts
    //
    // the reason why i haven't done this yet is because i don't want to
    // refactor the whole project.  The TypeSet really needs to be a higher
    // level abstraction that allows for types and enums to exist under one
    // key.  effectively, TypeSet needs to be a key into a context object

    const enums: EnumSet = [ ];

    for (let i = 0; i < config.enums.length; ++i) {
        const enumItem = config.enums[i];
        const enumKeys = determineEnum(data, enumItem);
        const enumName = makeName(enumItem);
        updateAllEnumReferences(typeSet, enumItem, enumName);

        enums.push([enumName, enumKeys]);
    }
    context.enums = enums;

    collapse(context);
    sumTypes(context);
    unionize(context);

    return context;
}

// TODO: the separation of context vs Undefined sucks...
export function stringify(context: Context): string {
    const out = [];
    for (const enumData of context.enums) {
        out.push(stringifyEnum(enumData[0], enumData[1]));
        out.push("");
    }

    out.push(typeToString(context));
    return out.join("\n");
}

