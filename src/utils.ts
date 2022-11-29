import { Context, Type } from "./types";
import { Config, NameProps } from "./config";
import { Logger } from "./logger";

export function getDisplayName(context: Context, obj: Record<string, unknown>): string | undefined {
    let hasName = false;
    let name = undefined;
    for (let i = 0; !hasName && i < context.config.names.length; ++i) {
        const nameConfig = context.config.names[i];

        const res = objContains(obj, nameConfig.props);
        hasName = res.match && (res.exact || !nameConfig.exact);
        if (hasName) {
            name = nameConfig.name;
        }
    }

    return name;
}


export function makeName(name: string): string {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
}

/*
 * checks to see if an object has all the properties passed in.
 *
 * if it has all the properties it is a match
 * if it has all the properties _AND_ it has _ONLY_ those properties, it is an exact match
 */
export function objContains(obj: Record<string, unknown>, properties: NameProps): {match: boolean, exact: boolean} {
    let contains = true;
    for (let i = 0; contains && i < properties.length; ++i) {
        const property = properties[i];
        if (typeof property === 'string') {
            contains = property in obj;
        } else {
            contains = property.key in obj && obj[property.key] === property.value;
        }
    }

    return {
        match: contains,
        exact: contains && Object.keys(obj).length === properties.length,
    };
}

/*
 * checks to see if an object has all the properties passed in.
 *
 * if it has all the properties it is a match
 * if it has all the properties _AND_ it has _ONLY_ those properties, it is an exact match
 */
export function contains(obj: Type, properties: string[]): {match: boolean, exact: boolean} {
    let contains = true;
    for (let i = 0; contains && i < properties.length; ++i) {
        contains = properties[i] in obj.properties;
    }

    return {
        match: contains,
        exact: contains && Object.keys(obj).length === properties.length,
    };
}

export class Name {
    private count = 0;
    private keyNameToName: Map<string, string> = new Map();
    constructor(private config: Config) {}

    getName(keyName: string, t: Type): string {
        const value = this.keyNameToName.get(keyName);
        if (value) {
            return value;
        }

        const displayName = t.displayName;
        if (displayName !== "") {
            this.keyNameToName.set(keyName, displayName);
            return displayName;
        }

        const name = this.config.nameBase + ++this.count;
        if (this.config.traces.length && this.config.traces.includes(name)) {
            Logger.trace("minting", name, "for", t);
        }
        this.keyNameToName.set(keyName, name);
        return name;
    }
}

export function getKeyName(context: Context, obj: Record<string, unknown>): string {
    const name = getDisplayName(context, obj);
    if (name) {
        return name;
    }
    return Object.keys(obj).sort().join("");
}

