import { Config } from "./config";
import isEqual from "lodash.isequal";
import { NamedTypeProperty, Type, TypeValue, Union } from "./types";

export type UnionizeableProperty = {
    propKey: string;
    propValue: TypeValue[];
    count: number;
};

export type KeyCounts = {
    [key: string]: {
        propKey: string;
        propValue: TypeValue[];
        count: number;
    }[]
}

type TypedData = Map<string, Type>;

export function keyDupeCount(data: TypedData): KeyCounts {
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

export function getUnionizableProperties(keyCounts: KeyCounts, config: Config): UnionizeableProperty[] {
    const required = config.unionCount;
    const out: UnionizeableProperty[] = [];

    for (const v of Object.values(keyCounts)) {
        for (let i = 0; i < v.length; ++i) {
            if (v[i].count > required) {
                out.push({
                    propKey: v[i].propKey,
                    propValue: v[i].propValue,
                    count: v[i].count,
                });
            }
        }
    }

    return out;
}

// an interesting idea if we wish to optimize.
//
// we would have to do several passes and cut out branches REAL fast for this
// to work
/*
type _TreeNode = {
    union: UnionizeableProperty,
    remainingPossibles: UnionizeableProperty[],
    nodes: string[],
    children: _TreeNode[],
}
*/

function toStringValue(propValue: TypeValue[]) {
    const copy = propValue.slice(0);
    const strValues = copy.filter(x => !Array.isArray(x)).sort();

    const arrValues = copy.filter(x => Array.isArray(x));
    const additional: string = arrValues.length > 0 ? toStringValue(arrValues) : "";

    return strValues.join("") + additional;
}

function toString(propKey: string, propValue: TypeValue[]): string {
    return propKey + toStringValue(propValue);
}

export function unionize(data: TypedData, config: Config): Union {
    const keyCount = keyDupeCount(data);
    const unionProps = getUnionizableProperties(keyCount, config);
    const unions = new Map<string, NamedTypeProperty>();

    // Two passes
    // 1st pass puts every possible single union together.
    // 2nd pass tries to condense
    for (let i = 0; i < unionProps.length; ++i) {
        const {
            propKey,
            propValue,
        } = unionProps[i];

        for (const type of data.values()) {
            if (propKey in type.properties && isEqual(type.properties[propKey], propValue)) {
                delete type.properties[propKey];

                const key = toString(propKey, propValue);
                if (!unions.has(key)) {
                    unions.set(key, {
                        name: propKey,
                        properties: {[propKey]: propValue},
                    });
                }

                type.unions.push(key);
            }
        }
    }

    return unions;
}

