import type { Context, Type } from "./types";
export declare type EnumKeys = (string | number)[];
declare type DataShape = {
    [key: string]: unknown;
};
export declare function determineEnum(data: DataShape[], key: string): EnumKeys;
export declare function stringifyEnum(context: Context, name: string, keys: EnumKeys): string;
export declare function updateAllEnumReferences(data: Map<string, Type>, keyName: string, enumName: string): void;
export {};
