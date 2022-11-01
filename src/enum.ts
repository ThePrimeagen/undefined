import { Type } from "./types";
import { makeName } from "./utils";

export type EnumKeys = (string | number)[];
type DataShape = {[key: string]: unknown};
export function determineEnum(data: DataShape[], key: string): EnumKeys {
    const found: EnumKeys = [];
    data.forEach(x => {
        if (key in x) {
            const value = x[key];
            if (typeof value !== "string" && typeof value !== "number") {
                throw new Error("Cannot make an enum out of key " + key);
            }

            if (!found.includes(value)) {
                found.push(value);
            }
        }
    });

    return found;
}

export function stringifyEnum(name: string, keys: EnumKeys): string {
    const out = [];

    out.push(`enum ${name} {`);
    for (let i = 0; i < keys.length; ++i) {
        out.push(`    ${makeName(keys[i] as string)} = "${keys[i]}",`);
    }
    out.push(`}`);

    return out.join("\n");
}

export function updateAllEnumReferences(data: Map<string, Type>, keyName: string, enumName: string): void {
    data.forEach(v => {
        if (keyName in v.properties) {
            v.properties[keyName] = [enumName];
        }
    });
}

/*
if (require.main === module) {
    const file = process.argv[2];
    const key = process.argv[3];
    const data = getData<{[key: string]: string}>(file);
    const keys = determineEnum(data, key);
    const nameKey = key.substring(0, 1).toUpperCase() + key.substring(1);

    console.log(stringifyEnum(nameKey, keys));
}
*/
