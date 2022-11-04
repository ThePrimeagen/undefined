import type { Config } from "./config.js";
import type { Context, Type, TypeValue } from "./types.js";
export declare type UnionizeableProperty = {
    propKey?: string;
    propValue?: TypeValue[];
    count?: number;
};
export declare type KeyCounts = {
    [key: string]: {
        propKey?: string;
        propValue?: TypeValue[];
        count?: number;
    }[];
};
export declare type UnionDupes = {
    [key: string]: number;
};
declare type TypedData = Map<string, Type>;
export declare function keyDupeCount(data: TypedData): KeyCounts;
export declare function getUnionizableProperties(keyCounts: KeyCounts, config: Config): UnionizeableProperty[];
export declare function unionize(context: Context): void;
export {};
