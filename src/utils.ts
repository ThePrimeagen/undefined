import { Config } from "./config";

export function makeName(name: string): string {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
}

let count = 0;
const keyNameToName: Map<string, string> = new Map();
export function getName(keyName: string, config: Config): string {
    const value = keyNameToName.get(keyName);
    if (value) {
        return value;
    }

    const name = config.nameBase + ++count;
    keyNameToName.set(keyName, name);
    return name;
}

