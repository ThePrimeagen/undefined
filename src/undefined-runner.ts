import { collapse } from "./collapse";
import { Config } from "./config";
import { determineEnum, EnumKeys, stringifyEnum, updateAllEnumReferences } from "./enum";
import { Type, typeObject, TypeSet, typeToString, Union } from "./types";
import { unionize } from "./unions";
import { makeName } from "./utils";

export type Data = {[key: string]: unknown};
export type DataSet = Data[];

export type EnumSet = [string, EnumKeys][];
export type Undefined = {
    typeSet: TypeSet,
    unions: Union,
    enums: EnumSet,
}

export function undefinedRun(data: DataSet, config: Config): Undefined {
    const typeSet = new Map<string, Type>();

    // TODO: My mother would even be upset
    data.forEach(x => typeObject(typeSet, x, config));

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

    collapse(typeSet, config);

    const unions = unionize(typeSet, config);

    return {
        typeSet,
        unions,
        enums,
    };
}

export function stringify({
    typeSet,
    unions,
    enums,
}: Undefined, config: Config): string {
    const out = [];
    for (const enumData of enums) {
        out.push(stringifyEnum(enumData[0], enumData[1]));
        out.push("");
    }

    out.push(typeToString(typeSet, unions, config));
    return out.join("\n");
}
