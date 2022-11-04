import type { Config } from "./config.js";
import type { Type } from "./types.js";
export declare function makeName(name: string): string;
export declare function contains(obj: Type, properties: string[]): {
    match: boolean;
    exact: boolean;
};
export declare class Name {
    private config;
    private count;
    private keyNameToName;
    constructor(config: Config);
    getDisplayName(keyName: string, type: Type): string | undefined;
    getName(keyName: string, t: Type): string;
}
export declare function getKeyName(obj: object): string;
