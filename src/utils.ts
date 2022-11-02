import { Type } from "./types";
import { Config } from "./config";
import { Logger } from "./logger";

export function makeName(name: string): string {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
}

export function getDisplayName(keyName: string, config: Config, type: Type): string | undefined {
    const keys = Object.keys(type.properties);
    for (const nameConfig of config.names) {
        if (keys.length !== nameConfig.props.length && nameConfig.exact) {
            continue;
        }

        let common = true;
        for (let i = 0; common && i < nameConfig.props.length; ++i) {
            common = nameConfig.props[i] in type.properties;
        }

        if (common) {
            keyNameToName.set(keyName, nameConfig.name);
            return nameConfig.name;
        }
    }

    return undefined;
}

let count = 0;
const keyNameToName: Map<string, string> = new Map();
export function getName(keyName: string, config: Config, t: Type): string {
    const value = keyNameToName.get(keyName);
    if (value) {
        return value;
    }

    const displayName = getDisplayName(keyName, config, t);
    if (displayName) {
        keyNameToName.set(keyName, displayName);
        return displayName;
    }

    const name = config.nameBase + ++count;
    if (config.traces.length && config.traces.includes(name)) {
        Logger.trace("minting", name, "for", t);
    }
    keyNameToName.set(keyName, name);
    return name;
}
