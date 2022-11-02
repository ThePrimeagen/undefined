import { Config } from "./config";
import isEqual from "lodash.isequal";
import { Type, TypeProperties, TypeValue } from "./types";
import { getName } from "./utils";

export type UnionizeableProperty = {
    propKey: string;
    propValue: TypeValue[];
    keyName: string;
};

export type KeyCounts = {
    [key: string]: {
        propKey: string;
        propValue: TypeValue[];
        count: number;
    }[]
}

type TypedData = Map<string, Type>;

function keyDupeCount(data: TypedData): KeyCounts {
    const out: KeyCounts = {};

    for (const [_, d] of data.entries()) {
        for (const [k, v] of Object.entries(d.properties)) {
            if (!out[k]) {
                out[k] = [];
            }

            const typeSet = out[k];
            let added = false;
            for (let i = 0; !added && i < typeSet.length; ++i) {
                if (isEqual(typeSet[i].propValue, v)) {
                    added = true;
                    typeSet[i].count++;
                }
            }

            if (!added) {
                typeSet.push({
                    propKey: k,
                    propValue: v,
                    count: 1,
                });
            }
        }
    }

    return out;
}

function getUnionizableProperties(keyCounts: KeyCounts, config: Config): UnionizeableProperty[] {
    const required = config.unionCount;
    const out: UnionizeableProperty[] = [];

    for (const [k, v] of Object.entries(keyCounts)) {
        for (let i = 0; i < v.length; ++i) {
            if (v[i].count > required) {
                out.push({
                    propKey: v[i].propKey,
                    propValue: v[i].propValue,
                    keyName: k,
                });
            }
        }
    }

    return out;
}

export function unionize(data: TypedData, config: Config): void {
    const keyCount = keyDupeCount(data);
    const unionProps = getUnionizableProperties(keyCount, config);
    const unions = new Map<string, TypeProperties>();

    // Two passes
    // 1st pass puts every possible single union together.
    // 2nd pass tries to condense
    for (let i = 0; i < unionProps.length; ++i) {
        const {
            propKey,
            propValue,
        } = unionProps[i];

        for (const [_, v] of data.entries()) {
            if (propKey in v.properties && isEqual(v.properties[propKey], propValue)) {
                delete v.properties[propKey];

                const name = getName(propKey, config);
                if (!unions.has(name)) {
                    unions.set(name, {
                        [propKey]: propValue,
                    });
                }
                v.unions.push(name);
            }
        }
    }
}

