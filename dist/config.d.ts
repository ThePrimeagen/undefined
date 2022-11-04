export declare type Config = {
    nameBase: string;
    enums: string[];
    file: string;
    unionCount: number;
    unions: {
        [key: string]: string[];
    };
    traces: string[];
    names: {
        name: string;
        exact: boolean;
        props: string[];
    }[];
    collapse: string[][];
    sumType?: {
        [key: string]: string[];
    };
    export?: boolean;
    declareModule?: string;
};
export declare type TSConfig = {
    unions?: {
        [key: string]: string[];
    };
    names?: {
        exact: boolean;
        props: string[];
        name: string;
    }[];
    enums?: string[];
    nameBase?: string;
    file?: string;
    traces?: string[];
    unionCount?: number;
    collapse?: string[][];
    sumType?: {
        [key: string]: string[];
    };
    export?: boolean;
    declareModule?: string;
};
export declare function getDefaultConfig(): Config;
export declare function getConfig(): Config;
