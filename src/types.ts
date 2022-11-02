
// TODO: There is this whole recursive definition issue that i suck at
// typescript trying to make.  I could literally make this in rust in no
// time....... i hate my choices some times.

import { Config } from "./config";
import { getName } from "./utils";

export type TypeValue = string | string[];

export type TypeProperties = {
    [key: string]: TypeValue[],
}

export type Type = {
    unions: string[],
    properties: TypeProperties,
}

export type NamedTypeProperty = {
    name: string;
    properties?: TypeProperties;
    combinedUnion?: string[];
};

export type KeyNameToType = Map<string, Type>;

export type Union = Map<string, NamedTypeProperty>

function arrayTypeToString(arr: (string | string[])[], current: {[key: string]: boolean} = {}, sub: boolean = false): string {
    const out: string[] = [];
    for (let i = 0; i < arr.length; ++i) {
        const value = arr[i];
        if (Array.isArray(value)) {
            const types = arrayTypeToString(value, current, true);
            if (types) {
                out.push(types);
            }
        } else if (!current[value]) {
            current[value] = true;
            out.push(value);
        }
    }

    if (out.length > 1) {
        return `(${out.join(" | ")})`;
    }

    if (out.length === 1) {
        if (sub) {
            return `${out[0]}[]`;
        }
        return out[0];
    }

    return "";
}

export function unionName(name: string): string {
    if (name.endsWith("Union")) {
        return name;
    }
    return `${name}Union`;
}

function stringUnions(type: Type, unions: Union, connectingAmp: boolean = true): string {
    if (type.unions.length === 0) {
        return "";
    }

    return `${type.unions.map(u => unionName(unions.get(u)?.name as string)).join(" & ")} ${connectingAmp ? "& " : ""}`;
}

export function typeToString(keyNameToType: KeyNameToType, unions: Union, config: Config): string {
    const out: string[] = [];

    for (const [_, v] of unions.entries()) {
        const {properties, name, combinedUnion} = v;
        const uName = unionName(name);

        if (properties) {
            out.push(`type ${uName} = {`);

            const keys = Object.keys(properties);
            for (let i = 0; i < keys.length; ++i) {
                const k = keys[i];
                const types = properties[k];

                out.push(`    ${k}: ${arrayTypeToString(types)};`);
            }

            out.push("}");
        } else if (combinedUnion) {
            // TODO: There are several things wrong here
            out.push(`type ${uName} = ${combinedUnion.map(x => unionName(x)).join(" & ")}`);
        }
        out.push("");
    }

    for (const [keyName, v] of keyNameToType.entries()) {
        const name = getName(keyName, config, v);
        const keys = Object.keys(v.properties);
        if (keys.length === 0) {
            out.push(`type ${name} = ${stringUnions(v, unions, false)};`);
        } else {
            out.push(`type ${name} = ${stringUnions(v, unions)} {`);
            for (let i = 0; i < keys.length; ++i) {
                const k = keys[i];
                const types = v.properties[k];

                out.push(`    ${k}: ${arrayTypeToString(types)};`);
            }

            out.push(`}`);
        }

        out.push("");
    };

    return out.join("\n");
}
