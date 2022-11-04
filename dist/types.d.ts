import type { Config } from "./config";
import type { EnumKeys } from "./enum";
import { Name } from "./utils";
export declare type TypeValue = string | string[];
export declare type TypeProperties = {
    [key: string]: TypeValue[];
};
export declare type Type = {
    displayName: string;
    unions: string[];
    properties: TypeProperties;
};
export declare type NamedTypeProperty = {
    name: string;
    properties?: TypeProperties;
    combinedUnion?: string[];
    useName?: boolean;
};
export declare type TypeSet = Map<string, Type>;
export declare type Union = Map<string, NamedTypeProperty>;
export declare type Data = {
    [key: string]: unknown;
};
export declare type DataSet = Data[];
export declare type EnumSet = [string, EnumKeys][];
export declare type Context = {
    config: Config;
    data: DataSet;
    typeSet: TypeSet;
    namer: Name;
    unions: Union;
    enums: EnumSet;
};
export declare function unionName(name: string): string;
export declare function typeToString(context: Context): string;
declare type StringToUnknown = {
    [key: string]: unknown;
};
export declare function typeObject(context: Context, obj: StringToUnknown): string;
export {};
