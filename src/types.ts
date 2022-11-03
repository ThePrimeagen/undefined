
// TODO: There is this whole recursive definition issue that i suck at
// typescript trying to make.  I could literally make this in rust in no
// time....... i hate my choices some times.

import { Config } from "./config";
import { EnumKeys } from "./enum";
import { Logger } from "./logger";
import { getKeyName, Name } from "./utils";

export type TypeValue = string | string[];

export type TypeProperties = {
    [key: string]: TypeValue[],
}

export type Type = {
    displayName: string,
    unions: string[],
    properties: TypeProperties,
}

export type NamedTypeProperty = {
    name: string;
    properties?: TypeProperties;
    combinedUnion?: string[];
    useName?: boolean;
};

export type TypeSet = Map<string, Type>;

export type Union = Map<string, NamedTypeProperty>

export type Data = {[key: string]: unknown};
export type DataSet = Data[];
export type EnumSet = [string, EnumKeys][];
export type Context = {
    config: Config,
    data: DataSet,
    typeSet: TypeSet,
    namer: Name,
    unions: Union,
    enums: EnumSet,
};

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

function removeUndefined(typeValue: TypeValue[]): boolean {
    // NOTE: its only top level
    const idx = typeValue.indexOf("undefined");
    let found = false;
    if (idx >= 0) {
        // undefined fields need the type undefined.
        if (typeValue.length > 1) {
            typeValue.splice(idx, 1);
            found = true;
        }
    }

    return found;
}

export function typeToString(context: Context): string {
    const unions = context.unions;
    const keyNameToType = context.typeSet;
    const config = context.config;

    const out: string[] = [];
    const exportStr = context.config.export ? "export " : "";
    let ident = "";

    if (context.config.declareModule) {
        ident = "    ";
        out.push(`declare module "${context.config.declareModule}" {`);
    }

    function push(str: string): void {
        out.push(`${ident}${str}`);
    }
    function newline(): void {
        out.push("");
    }

    for (const v of unions.values()) {
        const {properties, name, combinedUnion, useName} = v;
        const uName = useName ? name : unionName(name);

        if (properties) {
            push(`${exportStr}type ${uName} = {`);

            const keys = Object.keys(properties);

            for (let i = 0; i < keys.length; ++i) {
                const k = keys[i];
                const types = properties[k];
                const nullable = removeUndefined(types);

                push(`    ${k}${nullable ? "?" : ""}: ${arrayTypeToString(types)};`);
            }

            push("}");
        } else if (combinedUnion) {
            // TODO: There are several things wrong here
            push(`${exportStr}type ${uName} = ${combinedUnion.map(x => useName ? x : unionName(x)).join(" & ")}`);
        }
        newline();
    }

    for (const v of keyNameToType.values()) {
        const keys = Object.keys(v.properties);

        if (config.traces.includes(v.displayName)) {
            Logger.trace("creating object", v.displayName, v);
        }
        if (keys.length === 0 && v.unions.length > 0) {
            push(`${exportStr}type ${v.displayName} = ${stringUnions(v, unions, false)};`);
        } else if (keys.length === 0) {
            push(`${exportStr}type ${v.displayName} = Record<string, never>;`);
        } else {
            push(`${exportStr}type ${v.displayName} = ${stringUnions(v, unions)} {`);
            for (let i = 0; i < keys.length; ++i) {
                const k = keys[i];
                const types = v.properties[k];
                const nullable = removeUndefined(types);

                push(`    ${k}${nullable ? "?" : ""}: ${arrayTypeToString(types)};`);
            }

            push(`}`);
        }
        newline();
    };

    if (context.config.declareModule) {
        out.push(`}`);
    }

    return out.join("\n");
}

function isPrimitive(typeofValue: string): boolean {
    return typeofValue === "number" ||
        typeofValue === "string" ||
        typeofValue === "boolean";
}

function insertKeyValue(obj: Type, key: string, value: string | string[]): void {
    let props = obj.properties[key];
    if (!props) {
        props = obj.properties[key] = [];
    }

    if (Array.isArray(value) || !props.includes(value)) {
        props.push(value);
    }
}

function getObj(keyNameToType: TypeSet, key: string): Type {
    const value = keyNameToType.get(key);
    if (value) {
        return value;
    }

    const typeObj = {
        unions: [],
        properties: {},
        displayName: "",
    };

    keyNameToType.set(key, typeObj);

    return typeObj;
}

// this might be a thing?
function handleArray(context: Context, items: any[]): (string | string[])[] {
    const out: (string | string[])[] = [];
    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const type = typeof item;
        let name: string | string[] = type;

        if (item === null) {
            name = "null";
        } else if (Array.isArray(item)) {
            // TODO: Rename this
            const okThisTypeSucksAndIDontKnowHowToFixIt = handleArray(context, item);

            // @ts-ignore
            name = okThisTypeSucksAndIDontKnowHowToFixIt;
        } else if (type === "object") {
            name = typeObject(context, item);
        }

        if (out.indexOf(name) === -1) {
            out.push(name);
        }
    }

    return out;
}

type StringToUnknown = {[key: string]: unknown};

export function typeObject(context: Context, obj: StringToUnknown): string {
    const keyNameToType = context.typeSet;
    const keys = Object.keys(obj);
    const keyName = getKeyName(obj);
    const typeObj = getObj(keyNameToType, keyName);

    for (let i = 0; i < keys.length; ++i) {
        const k = keys[i];
        const value = obj[k];
        const typeOf = typeof value;

        if (isPrimitive(typeOf)) {
            insertKeyValue(typeObj, k, typeOf);
        } else if (value === null) {
            insertKeyValue(typeObj, k, "null");
        } else if (Array.isArray(value)) {
            const valueToInsert = handleArray(context, value);

            // @ts-ignore type issue, OH NO
            insertKeyValue(typeObj, k, valueToInsert);
        } else {
            insertKeyValue(typeObj, k, typeObject(context, value as StringToUnknown));
        }
    }

    typeObj.displayName = context.namer.getName(keyName, typeObj);

    return typeObj.displayName;
}
