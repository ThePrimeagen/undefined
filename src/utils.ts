import type { Config } from "./config.js";
import { Logger } from "./logger.js";
import type { Type } from "./types.js";

export function makeName(name: string): string {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
}

/*
 * checks to see if an object has all the properties passed in.
 *
 * if it has all the properties it is a match
 * if it has all the properties _AND_ it has _ONLY_ those properties, it is an exact match
 */
export function contains(
    obj: Type,
    properties: string[],
): { match: boolean; exact: boolean } {
    let contains = true;
    for (let i = 0; contains && i < properties.length; ++i) {
        // @ts-ignore
        contains = properties[i] in obj.properties;
    }

    if (contains) {
        return {
            match: true,
            exact: Object.keys(obj.properties).length === properties.length,
        };
    }

    return {
        match: false,
        exact: false,
    };
}

export class Name {
    private count = 0;
    private keyNameToName: Map<string, string> = new Map();
    constructor(private config: Config) {}

    getDisplayName(keyName: string, type: Type): string | undefined {
        const keys = Object.keys(type.properties);
        for (const nameConfig of this.config.names) {
            if (keys.length !== nameConfig.props.length && nameConfig.exact) {
                continue;
            }

            let common = true;
            for (let i = 0; common && i < nameConfig.props.length; ++i) {
                // @ts-ignore
                common = nameConfig.props[i] in type.properties;
            }

            if (common) {
                this.keyNameToName.set(keyName, nameConfig.name);
                return nameConfig.name;
            }
        }

        return undefined;
    }

    getName(keyName: string, t: Type): string {
        const value = this.keyNameToName.get(keyName);
        if (value) {
            return value;
        }

        const displayName = this.getDisplayName(keyName, t);
        if (displayName) {
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
export function getKeyName(obj: object): string {
    return Object.keys(obj).sort().join("");
}
